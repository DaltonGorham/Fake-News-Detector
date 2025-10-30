from datetime import datetime
from newspaper import Article
from fastapi import HTTPException
from ..repository import article_repository

class ArticleService:
    vectorizer = None
    model = None

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
    def analyze_article(url: str, user_id: str, user_jwt: str = None):
        """Analyze a new article and add it to history"""
        # Check for duplicate article URL first
        existing_articles = article_repository.get_all(user_id, user_jwt)
        if any(article['article']['url'] == url for article in existing_articles):
            raise HTTPException(
                status_code=409,
                detail={
                    "message": "Article already analyzed",
                    "error": "This URL has already been analyzed"
                }
            )
        
        try:
            article = ArticleService.pull_article(url)
            current_time = datetime.now().isoformat()
            ai_result = ArticleService.ai_analysis(article)

            truthness_label = ""
            genre = ""
            truthness_score = 0

            # prediction[0] = probability of real, prediction[1] = probability of fake
            # Use prediction[0] directly as the real probability
            real_probability = ai_result["prediction"][0]

            if real_probability > 0.60:
                truthness_label = "Reliable"
                genre = "Real News"
                truthness_score = real_probability
            else:
                truthness_label = "Unreliable"
                genre = "Fake News"
                truthness_score = real_probability

            analysis = {
                "input_by_user": user_id,
                "created_at": current_time,
                "article": article,
                "ai_result": {
                    "genre" : genre,
                    "truthness_label": truthness_label,
                    "truthness_score": truthness_score,
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

if __name__ == "__main__":
    test_url = "https://www.whitehouse.gov/articles/2025/10/top-democrat-cheers-americans-suffering-as-leverage-in-their-sick-political-game/"
    service = ArticleService()
    article = service.pull_article(test_url)
    print(article)
    analysis = service.ai_analysis(article)
    print(analysis)
    