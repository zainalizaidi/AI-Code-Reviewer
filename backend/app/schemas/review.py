from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Any


class ReviewCreate(BaseModel):
    language: str
    original_code: str


class ReviewOut(BaseModel):
    id: int
    user_id: int
    language: str
    original_code: str
    score: Optional[float]
    bugs: Optional[List[Any]]
    vulnerabilities: Optional[List[Any]]
    performance_issues: Optional[List[Any]]
    code_smells: Optional[List[Any]]
    suggestions: Optional[List[Any]]
    readability: Optional[Any]
    fixed_code: Optional[str]
    summary: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ReviewSummary(BaseModel):
    id: int
    language: str
    score: Optional[float]
    summary: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
