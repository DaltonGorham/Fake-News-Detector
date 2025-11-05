import pytest
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime
from src.services.article_service import ArticleService
from fastapi import HTTPException


class TestArticleService:
    
    def test_satirical_domains_exist(self):
        assert len(ArticleService.SATIRICAL_DOMAINS) > 0
        assert 'theonion.com' in ArticleService.SATIRICAL_DOMAINS
        assert 'babylonbee.com' in ArticleService.SATIRICAL_DOMAINS
    
    def test_get_article_history_success(self):
        mock_history = [
            {"id": 1, "url": "https://example.com/article1"},
            {"id": 2, "url": "https://example.com/article2"}
        ]
        
        with patch('src.services.article_service.article_repository.get_all', return_value=mock_history):
            result = ArticleService.get_article_history("user123")
            assert result == mock_history
            assert len(result) == 2
    
    def test_get_article_history_empty(self):
        with patch('src.services.article_service.article_repository.get_all', return_value=None):
            result = ArticleService.get_article_history("user123")
            assert result == []
    
    def test_get_article_history_exception(self):
        with patch('src.services.article_service.article_repository.get_all', side_effect=Exception("Database error")):
            with pytest.raises(HTTPException) as exc_info:
                ArticleService.get_article_history("user123")
            
            assert exc_info.value.status_code == 500
            assert "Failed to retrieve article history" in str(exc_info.value.detail)
    
    def test_clear_history_success(self):
        with patch('src.services.article_service.article_repository.clear', return_value=True):
            result = ArticleService.clear_history("user123")
            assert result == []
    
    def test_clear_history_failure(self):
        with patch('src.services.article_service.article_repository.clear', return_value=False):
            result = ArticleService.clear_history("user123")
            assert result is None
    
    def test_clear_history_exception(self):
        with patch('src.services.article_service.article_repository.clear', side_effect=Exception("Database error")):
            with pytest.raises(HTTPException) as exc_info:
                ArticleService.clear_history("user123")
            
            assert exc_info.value.status_code == 500
            assert "Failed to clear article history" in str(exc_info.value.detail)
    
    def test_pull_article_success(self):
        mock_article = MagicMock()
        mock_article.title = "Test Article"
        mock_article.authors = ["John Doe"]
        mock_article.text = "Article content"
        mock_article.publish_date = None
        
        with patch('src.services.article_service.Article', return_value=mock_article):
            result = ArticleService.pull_article("https://example.com/article")
            
            assert result["url"] == "https://example.com/article"
            assert result["source"] == "example.com"
            assert result["title"] == "Test Article"
            assert result["authors"] == ["John Doe"]
            assert result["text"] == "Article content"
            assert "collected_date" in result
    
    def test_pull_article_exception(self):
        with patch('src.services.article_service.Article', side_effect=Exception("Network error")):
            with pytest.raises(HTTPException) as exc_info:
                ArticleService.pull_article("https://example.com/article")
            
            assert exc_info.value.status_code == 500
            assert "Failed to pull article" in str(exc_info.value.detail)
    
    def test_ai_analysis(self):
        ArticleService.vectorizer = MagicMock()
        ArticleService.model = MagicMock()
        
        ArticleService.vectorizer.transform.return_value = [[0.1, 0.2]]
        ArticleService.model.predict_proba.return_value = [[0.7, 0.3]]
        
        article = {"title": "Test", "text": "Content"}
        result = ArticleService.ai_analysis(article)
        
        assert "prediction" in result
        assert result["prediction"] == [0.7, 0.3]
    
    def test_analyze_article_duplicate(self):
        existing = [{"article": {"url": "https://example.com/test"}}]
        
        with patch('src.services.article_service.article_repository.get_all', return_value=existing):
            with pytest.raises(HTTPException) as exc_info:
                ArticleService.analyze_article("https://example.com/test", "user123")
            
            assert exc_info.value.status_code == 409
            assert "already analyzed" in str(exc_info.value.detail)
    
    def test_analyze_article_reliable(self):
        with patch('src.services.article_service.article_repository.get_all', return_value=[]):
            mock_article = {
                "url": "https://example.com/test",
                "source": "example.com",
                "title": "Test",
                "text": "Content"
            }
            
            with patch.object(ArticleService, 'pull_article', return_value=mock_article):
                with patch.object(ArticleService, 'ai_analysis', return_value={"prediction": [0.8, 0.2]}):
                    with patch('src.services.article_service.article_repository.save', return_value={"id": 1}):
                        result = ArticleService.analyze_article("https://example.com/test", "user123")
                        
                        assert result["id"] == 1
    
    def test_analyze_article_unreliable(self):
        with patch('src.services.article_service.article_repository.get_all', return_value=[]):
            mock_article = {
                "url": "https://example.com/test",
                "source": "example.com",
                "title": "Test",
                "text": "Content"
            }
            
            with patch.object(ArticleService, 'pull_article', return_value=mock_article):
                with patch.object(ArticleService, 'ai_analysis', return_value={"prediction": [0.3, 0.7]}):
                    with patch('src.services.article_service.article_repository.save', return_value={"id": 1}):
                        result = ArticleService.analyze_article("https://example.com/test", "user123")
                        
                        assert result["id"] == 1
    
    def test_analyze_article_satire(self):
        with patch('src.services.article_service.article_repository.get_all', return_value=[]):
            mock_article = {
                "url": "https://theonion.com/test",
                "source": "theonion.com",
                "title": "Test",
                "text": "Content"
            }
            
            with patch.object(ArticleService, 'pull_article', return_value=mock_article):
                with patch.object(ArticleService, 'ai_analysis', return_value={"prediction": [0.5, 0.5]}):
                    with patch('src.services.article_service.article_repository.save', return_value={"id": 1}):
                        result = ArticleService.analyze_article("https://theonion.com/test", "user123")
                        
                        assert result["id"] == 1
    
    def test_get_article_by_id_success(self):
        mock_article = {"id": 1, "title": "Test"}
        
        with patch('src.services.article_service.article_repository.get_by_id', return_value=mock_article):
            result = ArticleService.get_article_by_id(1, "user123")
            assert result == mock_article
    
    def test_get_article_by_id_not_found(self):
        with patch('src.services.article_service.article_repository.get_by_id', return_value=None):
            with pytest.raises(HTTPException) as exc_info:
                ArticleService.get_article_by_id(999, "user123")
            
            assert exc_info.value.status_code == 404
            assert "Article not found" in str(exc_info.value.detail)
    
    def test_get_article_by_id_exception(self):
        with patch('src.services.article_service.article_repository.get_by_id', side_effect=Exception("Database error")):
            with pytest.raises(HTTPException) as exc_info:
                ArticleService.get_article_by_id(1, "user123")
            
            assert exc_info.value.status_code == 500
            assert "Failed to retrieve article" in str(exc_info.value.detail)
