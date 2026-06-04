from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from collections import Counter
from app.database.database import get_db
from app.models.models import CodeReview, User
from app.middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    reviews = db.query(CodeReview).filter(CodeReview.user_id == current_user.id).all()
    total = len(reviews)
    avg_score = round(sum(r.score for r in reviews if r.score) / total, 2) if total else 0

    languages = [r.language for r in reviews]
    lang_counter = Counter(languages)
    most_used = lang_counter.most_common(1)[0][0] if lang_counter else None

    week_ago = datetime.utcnow() - timedelta(days=7)
    reviews_this_week = sum(1 for r in reviews if r.created_at >= week_ago)

    # Score trend (compare last 5 vs previous 5)
    scored = [r.score for r in sorted(reviews, key=lambda x: x.created_at, reverse=True) if r.score]
    trend = "stable"
    if len(scored) >= 10:
        recent_avg = sum(scored[:5]) / 5
        older_avg = sum(scored[5:10]) / 5
        if recent_avg > older_avg + 0.5:
            trend = "up"
        elif recent_avg < older_avg - 0.5:
            trend = "down"

    # Weekly activity (last 7 days)
    weekly = []
    for i in range(6, -1, -1):
        day = datetime.utcnow() - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        day_reviews = [r for r in reviews if day_start <= r.created_at < day_end]
        day_scores = [r.score for r in day_reviews if r.score]
        weekly.append({
            "day": day.strftime("%a"),
            "date": day.strftime("%Y-%m-%d"),
            "count": len(day_reviews),
            "avg_score": round(sum(day_scores) / len(day_scores), 1) if day_scores else 0,
        })

    # Language distribution
    total_lang = sum(lang_counter.values()) or 1
    lang_dist = [
        {"language": lang, "count": count, "percentage": round(count / total_lang * 100, 1)}
        for lang, count in lang_counter.most_common(8)
    ]

    # Recent scores (last 10)
    recent_scores = [
        {"id": r.id, "score": r.score, "language": r.language, "date": r.created_at.strftime("%m/%d")}
        for r in sorted(reviews, key=lambda x: x.created_at, reverse=True)[:10]
        if r.score
    ]

    # Vulnerability stats
    vuln_total = sum(len(r.vulnerabilities or []) for r in reviews)
    bug_total = sum(len(r.bugs or []) for r in reviews)
    perf_total = sum(len(r.performance_issues or []) for r in reviews)

    return {
        "stats": {
            "total_reviews": total,
            "average_score": avg_score,
            "most_used_language": most_used,
            "reviews_this_week": reviews_this_week,
            "score_trend": trend,
        },
        "weekly_activity": weekly,
        "language_distribution": lang_dist,
        "recent_scores": list(reversed(recent_scores)),
        "issue_overview": {
            "vulnerabilities": vuln_total,
            "bugs": bug_total,
            "performance": perf_total,
        }
    }
