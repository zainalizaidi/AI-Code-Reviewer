from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class DashboardStats(BaseModel):
    total_reviews: int
    average_score: float
    most_used_language: Optional[str]
    reviews_this_week: int
    score_trend: str  # "up", "down", "stable"


class WeeklyActivity(BaseModel):
    day: str
    count: int
    avg_score: float


class LanguageStat(BaseModel):
    language: str
    count: int
    percentage: float


class VulnerabilityStat(BaseModel):
    label: str
    count: int


class AnalyticsDashboard(BaseModel):
    stats: DashboardStats
    weekly_activity: List[WeeklyActivity]
    language_distribution: List[LanguageStat]
    recent_scores: List[Dict[str, Any]]
