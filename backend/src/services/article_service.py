from datetime import datetime, timedelta
import random
from fastapi import HTTPException
from ..repository import article_repository

class ArticleService:
    @staticmethod
    def get_article_history(user_id: str, user_jwt: str = None):
        """Get all articles in the history for a user"""
        try:
            history = article_repository.get_all(user_id, user_jwt)
            return history if history else []
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail={
                    "message": "Failed to retrieve article history",
                    "error": str(e)
                }
            )

    @staticmethod
    def clear_history(user_id: str, user_jwt: str = None):
        """Clear all articles from history for a user"""
        try:
            success = article_repository.clear(user_id, user_jwt)
            return [] if success else None
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail={
                    "message": "Failed to clear article history",
                    "error": str(e)
                }
            )

    @staticmethod
    def analyze_article(url: str, user_id: str, user_jwt: str = None):
        """Analyze a new article and add it to history"""
        # Check for duplicate article URL first
        existing_articles = article_repository.get_all(user_id, user_jwt)
        if any(article['article']['url'] == url for article in existing_articles):
            raise HTTPException(
                status_code=409,
                detail={
                    "message": "Article already analyzed",
                    "error": "This URL has already been analyzed by you"
                }
            )
        
        try:
            # In a real implementation, this would call an AI service
            # For now, we'll use mock AI results
            current_time = datetime.now().isoformat()
            published_date = (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat()
            
            analysis = {
                "input_by_user": user_id,
                "created_at": current_time,
                "article": {
                    "url": url,
                    "title": f"Testing Article",
                    "source": url.split('/')[2] if '://' in url else 'Unknown Source',
                    "collected_date": current_time,
                    "published_date": published_date,
                    "author": "Unknown Author",  # Would be extracted in real implementation
                    "content": None  # Would be extracted in real implementation
                },
                "ai_result": {
                    "genre": random.choice(["News", "Technology", "Science"]),
                    "truthness_label": random.choice(["RELIABLE", "UNRELIABLE"]),
                    "truthness_score": round(random.uniform(0, 1), 2),
                    "related_articles": []
                }
            }

            result = article_repository.save(analysis, user_jwt)
            if not result:
                raise HTTPException(
                    status_code=500,
                    detail={
                        "message": "Failed to save article analysis",
                        "error": "Database error occurred while saving"
                    }
                )
            return result

        except Exception as e:
            # Catch any unexpected errors and wrap them in HTTPException
            raise HTTPException(
                status_code=500,
                detail={
                    "message": "Failed to analyze article",
                    "error": str(e)
                }
            )

    @staticmethod
    def get_article_by_id(article_id: int, user_id: str, user_jwt: str = None):
        """Get a specific article by ID"""
        try:
            article = article_repository.get_by_id(article_id, user_jwt)
            if not article:
                raise HTTPException(
                    status_code=404,
                    detail={
                        "message": "Article not found",
                        "error": f"No article found with ID {article_id}"
                    }
                )
            return article
        except HTTPException:
            # Re-raise HTTP exceptions directly
            raise
        except Exception as e:
            # Wrap other exceptions in a 500 error
            raise HTTPException(
                status_code=500,
                detail={
                    "message": "Failed to retrieve article",
                    "error": str(e)
                }
            )

article_service = ArticleService()