from fastapi import FastAPI
from src.routes import article_routes
from src.config import settings
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Local development
        "https://fake-news-detector.vercel.app",  # Production
        "https://fake-news-detector-git-*.vercel.app",  # Preview deployments
        "https://fake-news-detector-*.vercel.app"  # Latest preview
    ],
    allow_origin_regex=r"https://fake-news-detector-git-.*\.vercel\.app",  # All preview deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(article_routes.router, prefix="/api/v1")
