from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from ..services.article_service import article_service
from ..middleware.auth import auth_handler
from typing import Tuple

router = APIRouter()

from pydantic import HttpUrl

class ArticleSubmission(BaseModel):
    url: HttpUrl

@router.get("/articles/history")
async def get_article_history(auth: Tuple[str, str] = Depends(auth_handler.get_user_with_token)):
    """Get the history of analyzed articles for the current user"""
    user_id, jwt_token = auth
    history = article_service.get_article_history(user_id, jwt_token)
    return {"data": history, "error": None}

@router.delete("/articles/history")
async def clear_article_history(auth: Tuple[str, str] = Depends(auth_handler.get_user_with_token)):
    """Clear all articles from history for the current user"""
    user_id, jwt_token = auth
    article_service.clear_history(user_id, jwt_token)
    return {"data": None, "error": None}

@router.post("/articles/analyze")
async def analyze_article(
    submission: ArticleSubmission,
    auth: Tuple[str, str] = Depends(auth_handler.get_user_with_token)
):
    """Analyze a new article for the current user"""
    user_id, jwt_token = auth
    str_url = str(submission.url)
    analysis = article_service.analyze_article(str_url, user_id, jwt_token)
    return {"data": analysis, "error": None}

@router.get("/articles/{article_id}")
async def get_article(
    article_id: int,
    auth: Tuple[str, str] = Depends(auth_handler.get_user_with_token)
):
    """Get a specific article by ID for the current user"""
    user_id, jwt_token = auth
    try:
        article = article_service.get_article_by_id(article_id, user_id, jwt_token)
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