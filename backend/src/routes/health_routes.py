"""
Health check routes for monitoring service availability
"""
from fastapi import APIRouter
from src.config import settings

router = APIRouter(tags=["health"])

@router.get("/healthz")
async def health_check():
    """Health check endpoint for monitoring service availability"""
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": "1.0.0"
    }
