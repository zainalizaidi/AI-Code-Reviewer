from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import create_tables
from app.routes import auth, reviews, analytics
from app.config import settings

app = FastAPI(
    title="AI Code Reviewer API",
    description="Production-grade AI-powered code review backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(reviews.router)
app.include_router(analytics.router)


@app.on_event("startup")
def on_startup():
    create_tables()


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "AI Code Reviewer API is running"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
