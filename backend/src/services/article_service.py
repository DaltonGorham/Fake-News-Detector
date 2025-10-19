from datetime import datetime
import random
from ..repository import article_repository

'''
    THIS IS ALL MOCK LOGIC FOR DEMONSTRATION PURPOSES ONLY.
'''

class ArticleService:
    @staticmethod
    def get_article_history():
        """Get all articles in the history"""
        return article_repository.get_all()

    @staticmethod
    def clear_history():
        """Clear all articles from history"""
        article_repository.clear()

    @staticmethod
    def analyze_article(url: str, user_id: str = "test_user_id"):
        """Analyze a new article and add it to history"""
       
        all_articles = article_repository.get_all()
        new_id = len(all_articles) + 1

       
        analysis = {
            "id": new_id,
            "created_at": datetime.now().isoformat(),
            "input_by_user": user_id,
            "article": {
                "id": new_id,
                "url": url,
                "title": "Article " + str(new_id), 
                "source": url.split('/')[2] if '://' in url else 'Unknown Source'
            },
            "ai_result": {
                "genre": random.choice(["News", "Technology", "Science"]),  # Would be AI determined
                "truthness_label": random.choice(["RELIABLE", "UNRELIABLE"]),  # Would be AI determined
                "truthness_score": round(random.uniform(0, 1), 2),  # Would be AI determined
                "related_articles": []
            }
        }
        
        # Save to repository
        return article_repository.save(analysis)

    @staticmethod
    def get_article_by_id(article_id: int):
        """Get a specific article by ID"""
        return article_repository.get_by_id(article_id)

article_service = ArticleService()