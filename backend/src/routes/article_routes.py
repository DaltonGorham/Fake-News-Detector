from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.article_service import article_service

router = APIRouter()

'''
    THIS IS ALL MOCK LOGIC FOR DEMONSTRATION PURPOSES ONLY.
'''

class ArticleSubmission(BaseModel):
    url: str

@router.get("/articles/history")
async def get_article_history():
    """Get the history of analyzed articles"""
    return {"data": article_service.get_article_history(), "error": None}

@router.delete("/articles/history")
async def clear_article_history():
    """Clear all articles from history"""
    article_service.clear_history()
    return {"data": None, "error": None}

@router.post("/articles/analyze")
async def analyze_article(submission: ArticleSubmission):
    """Analyze a new article"""
    if not submission.url:
        raise HTTPException(status_code=400, detail="URL is required")

    analysis = article_service.analyze_article(submission.url)
    return {"data": analysis, "error": None}

@router.get("/articles/{article_id}")
async def get_article(article_id: int):
    """Get a specific article by ID"""
    article = article_service.get_article_by_id(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"data": article, "error": None}