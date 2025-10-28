from datetime import datetime, timedelta
import random
import stat
from turtle import pu
from newspaper import Article
from fastapi import HTTPException
from ..repository import article_repository

class ArticleService:
    vectorizer = None
    model = None

    @staticmethod
    def get_article_history(user_id: str):
        """Get all articles in the history for a user"""
        try:
            history = article_repository.get_all(user_id)
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
    def clear_history(user_id: str):
        """Clear all articles from history for a user"""
        try:
            success = article_repository.clear(user_id)
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
    def pull_article(url: str):
        """Pull article content from a URL"""
        try:
            article = Article(url)
            article.download()
            article.parse()

            current_time = datetime.now().isoformat()

            return {
                "url": url,
                "source": url.split('/')[2] if '://' in url else 'Unknown Source',
                "title": article.title,
                "authors": article.authors,
                "collected_date": current_time,
                "publish_date": article.publish_date.isoformat() if article.publish_date else None,
                "text": article.text,
            }
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail={
                    "message": "Failed to pull article",
                    "error": str(e)
                }
            )
        
    @staticmethod
    def ai_analysis(article: dict):
        if ArticleService.vectorizer is None or ArticleService.model is None:
            from ..repository.model_repository import get_all
            ArticleService.vectorizer, ArticleService.model = get_all()

        text = article.get("title", "") + " " + article.get("text", "")

        vectorized_text = ArticleService.vectorizer.transform([text])
        prediction = ArticleService.model.predict_proba(vectorized_text)
        return {
            "prediction": prediction[0]
        }

    @staticmethod
    def analyze_article(url: str, user_id: str):
        """Analyze a new article and add it to history"""
        try:
            existing_articles = article_repository.get_all(user_id)
            if any(article['article']['url'] == url for article in existing_articles):
                raise HTTPException(
                    status_code=409,
                    detail={
                        "message": "Article already analyzed",
                        "error": "This URL has already been analyzed"
                    }
                )

            article = ArticleService.pull_article(url)
            current_time = datetime.now().isoformat()
            ai_result = ArticleService.ai_analysis(article)

            analysis = {
                "input_by_user": user_id,
                "created_at": current_time,
                "article": article,
                "ai_result": ai_result
            }

            result = article_repository.save(analysis)
            if not result:
                raise HTTPException(
                    status_code=500,
                    detail={
                        "message": "Failed to save article analysis",
                        "error": "Database error occurred while saving"
                    }
                )
            return result

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail={
                    "message": "Failed to analyze article",
                    "error": str(e)
                }
            )

    @staticmethod
    def get_article_by_id(article_id: int):
        """Get a specific article by ID"""
        try:
            article = article_repository.get_by_id(article_id)
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
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail={
                    "message": "Failed to retrieve article",
                    "error": str(e)
                }
            )

article_service = ArticleService()

if __name__ == "__main__":
    test_url = "https://theonion.com/zohran-mamdani-refuses-to-share-plan-for-making-rich-richer/"
    service = ArticleService()
    article = service.pull_article(test_url)
    print(article)
    analysis = service.ai_analysis(article)
    print(analysis)
    