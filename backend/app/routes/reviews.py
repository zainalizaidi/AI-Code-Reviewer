from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.models import CodeReview, User
from app.schemas.review import ReviewCreate, ReviewOut, ReviewSummary
from app.services.gemini_service import review_code
from app.middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.post("/", response_model=ReviewOut, status_code=201)
async def create_review(
    payload: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if len(payload.original_code.strip()) < 10:
        raise HTTPException(status_code=400, detail="Code is too short to review")

    try:
        ai_result = await review_code(payload.language, payload.original_code)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")

    review = CodeReview(
        user_id=current_user.id,
        language=payload.language,
        original_code=payload.original_code,
        score=ai_result.get("score"),
        bugs=ai_result.get("bugs", []),
        vulnerabilities=ai_result.get("vulnerabilities", []),
        performance_issues=ai_result.get("performance_issues", []),
        code_smells=ai_result.get("code_smells", []),
        suggestions=ai_result.get("suggestions", []),
        readability=ai_result.get("readability"),
        fixed_code=ai_result.get("fixed_code", ""),
        summary=ai_result.get("summary", ""),
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


@router.get("/", response_model=List[ReviewSummary])
def get_reviews(
    skip: int = 0,
    limit: int = 50,
    language: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(CodeReview).filter(CodeReview.user_id == current_user.id)
    if language:
        query = query.filter(CodeReview.language == language)
    reviews = query.order_by(CodeReview.created_at.desc()).offset(skip).limit(limit).all()
    return reviews


@router.get("/{review_id}", response_model=ReviewOut)
def get_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    review = db.query(CodeReview).filter(
        CodeReview.id == review_id,
        CodeReview.user_id == current_user.id,
    ).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


@router.delete("/{review_id}", status_code=204)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    review = db.query(CodeReview).filter(
        CodeReview.id == review_id,
        CodeReview.user_id == current_user.id,
    ).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(review)
    db.commit()
