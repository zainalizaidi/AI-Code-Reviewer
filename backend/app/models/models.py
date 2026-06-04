from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Text, JSON,
    DateTime, ForeignKey, Index
)
from sqlalchemy.orm import relationship
from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    reviews = relationship("CodeReview", back_populates="user", cascade="all, delete-orphan")


class CodeReview(Base):
    __tablename__ = "code_reviews"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    language = Column(String(50), nullable=False)
    original_code = Column(Text, nullable=False)
    score = Column(Float, nullable=True)
    bugs = Column(JSON, nullable=True)
    vulnerabilities = Column(JSON, nullable=True)
    performance_issues = Column(JSON, nullable=True)
    code_smells = Column(JSON, nullable=True)
    suggestions = Column(JSON, nullable=True)
    readability = Column(JSON, nullable=True)
    fixed_code = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="reviews")

    __table_args__ = (
        Index("idx_user_created", "user_id", "created_at"),
        Index("idx_language", "language"),
    )
