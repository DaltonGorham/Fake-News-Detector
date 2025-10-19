from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from ..services.article_service import article_service
from ..middleware.auth import auth_handler

router = APIRouter()

from pydantic import HttpUrl

class ArticleSubmission(BaseModel):
    url: HttpUrl

@router.get("/articles/history")
async def get_article_history(user_id: str = Depends(auth_handler.get_current_user)):
    """Get the history of analyzed articles for the current user"""
    history = article_service.get_article_history(user_id)
    return {"data": history, "error": None}

@router.delete("/articles/history")
async def clear_article_history(user_id: str = Depends(auth_handler.get_current_user)):
    """Clear all articles from history for the current user"""
    article_service.clear_history(user_id)
    return {"data": None, "error": None}

@router.post("/articles/analyze")
async def analyze_article(
    submission: ArticleSubmission,
    user_id: str = Depends(auth_handler.get_current_user)
):
    """Analyze a new article for the current user"""
    str_url = str(submission.url)
    analysis = article_service.analyze_article(str_url, user_id)
    return {"data": analysis, "error": None}

@router.get("/articles/{article_id}")
async def get_article(
    article_id: int,
    user_id: str = Depends(auth_handler.get_current_user)
):
    """Get a specific article by ID for the current user"""
    try:
        article = article_service.get_article_by_id(article_id, user_id)
        if not article:
            raise HTTPException(
                status_code=404,
                detail={
                    "message": "Article not found",
                    "error": f"No article found with ID {article_id} for current user"
                }
            )
        return {"data": article, "error": None}
    except HTTPException:
        raise
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Invalid article ID",
                "error": str(e)
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "message": "Failed to retrieve article",
                "error": str(e)
            }
        )