import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
from src.main import app
from src.routes.article_routes import router as article_router
from src.middleware.auth import auth_handler


async def mock_get_user_with_token():
    return ("test_user_id", "fake_jwt_token")

async def mock_get_current_user():
    return "test_user_id"

app.dependency_overrides[auth_handler.get_user_with_token] = mock_get_user_with_token
app.dependency_overrides[auth_handler.get_current_user] = mock_get_current_user

client = TestClient(app)


class TestArticleRoutes:
    
    def test_get_article_history_success(self):
        mock_history = [{"id": 1, "article": {"url": "https://example.com"}}]
        
        with patch('src.routes.article_routes.article_service.get_article_history', return_value=mock_history):
            response = client.get("/api/v1/articles/history", headers={"Authorization": "Bearer fake_token"})
            
            assert response.status_code == 200
            assert response.json()["data"] == mock_history
            assert response.json()["error"] is None
    
    def test_get_article_history_unauthorized(self):
        app.dependency_overrides.clear()
        response = client.get("/api/v1/articles/history")
        assert response.status_code == 403
        app.dependency_overrides[auth_handler.get_user_with_token] = mock_get_user_with_token
        app.dependency_overrides[auth_handler.get_current_user] = mock_get_current_user
    
    def test_clear_article_history_success(self):
        with patch('src.routes.article_routes.article_service.clear_history', return_value=[]):
            response = client.delete("/api/v1/articles/history", headers={"Authorization": "Bearer fake_token"})
            
            assert response.status_code == 200
            assert response.json()["data"] is None
    
    def test_analyze_article_success(self):
        mock_analysis = {"id": 1, "article": {"url": "https://example.com"}}
        
        with patch('src.routes.article_routes.article_service.analyze_article', return_value=mock_analysis):
            response = client.post(
                "/api/v1/articles/analyze",
                json={"url": "https://example.com/article"},
                headers={"Authorization": "Bearer fake_token"}
            )
            
            assert response.status_code == 200
            assert response.json()["data"] == mock_analysis
    
    def test_analyze_article_invalid_url(self):
        with patch('src.routes.article_routes.article_service.analyze_article') as mock_analyze:
            mock_analyze.side_effect = ValueError("Invalid URL")
            response = client.post(
                "/api/v1/articles/analyze",
                json={"url": "not-a-valid-url"},
                headers={"Authorization": "Bearer fake_token"}
            )
            
            assert response.status_code == 422
    
    def test_get_article_by_id_success(self):
        mock_article = {"id": 1, "article": {"url": "https://example.com"}}
        
        with patch('src.routes.article_routes.article_service.get_article_by_id', return_value=mock_article):
            response = client.get("/api/v1/articles/1", headers={"Authorization": "Bearer fake_token"})
            assert response.status_code == 200
    
    def test_get_article_by_id_not_found(self):
        with patch('src.routes.article_routes.article_service.get_article_by_id', return_value=None):
            response = client.get("/api/v1/articles/999", headers={"Authorization": "Bearer fake_token"})
            assert response.status_code == 404
    
    def test_get_article_by_id_invalid_id(self):
        response = client.get("/api/v1/articles/invalid", headers={"Authorization": "Bearer fake_token"})
        assert response.status_code == 422
