from datetime import datetime

'''
    THIS IS ALL MOCK LOGIC FOR DEMONSTRATION PURPOSES ONLY.
'''

# fake mock storage
_articles = [
    {
        "id": 1,
        "created_at": datetime.now().isoformat(),
        "input_by_user": "test_user_id",
        "article": {
            "id": 1,
            "url": "https://example.com/test-article",
            "title": "Test Article",
            "source": "Example News"
        },
        "ai_result": {
            "genre": "News",
            "truthness_label": "RELIABLE",
            "truthness_score": 0.9,
            "related_articles": []
        }
    }
]

def get_all():
    """Get all articles"""
    return _articles

def get_by_id(article_id: int):
    """Get a single article by ID"""
    for article in _articles:
        if article["id"] == article_id:
            return article
    return None

def save(article_data: dict):
    """Save a new article analysis"""
    _articles.insert(0, article_data)
    return article_data

def clear():
    """Clear all articles from storage"""
    _articles.clear()