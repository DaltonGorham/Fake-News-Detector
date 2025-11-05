import pytest
from fastapi.testclient import TestClient
from unittest.mock import Mock, patch
from src.main import app
from src.routes.user_routes import router as user_router
from src.middleware.auth import auth_handler


async def mock_get_user_with_token():
    return ("test_user_id", "fake_jwt_token")

async def mock_get_current_user():
    return "test_user_id"

app.dependency_overrides[auth_handler.get_user_with_token] = mock_get_user_with_token
app.dependency_overrides[auth_handler.get_current_user] = mock_get_current_user

client = TestClient(app)


class TestUserRoutes:
    
    def test_upload_avatar_success(self):
        mock_avatar_url = "https://storage.example.com/avatar.jpg"
        
        with patch('src.routes.user_routes.user_service.upload_avatar', return_value=mock_avatar_url):
            files = {"file": ("avatar.jpg", b"fake image data", "image/jpeg")}
            response = client.post(
                "/api/v1/users/avatar",
                files=files,
                headers={"Authorization": "Bearer fake_token"}
            )
            
            assert response.status_code == 200
            assert response.json()["data"]["avatar_url"] == mock_avatar_url
    
    def test_upload_avatar_invalid_file_type(self):
        files = {"file": ("document.txt", b"text content", "text/plain")}
        response = client.post(
            "/api/v1/users/avatar",
            files=files,
            headers={"Authorization": "Bearer fake_token"}
        )
        
        assert response.status_code == 400
    
    def test_upload_avatar_unauthorized(self):
        app.dependency_overrides.clear()
        files = {"file": ("avatar.jpg", b"fake image data", "image/jpeg")}
        response = client.post("/api/v1/users/avatar", files=files)
        assert response.status_code == 403
        app.dependency_overrides[auth_handler.get_user_with_token] = mock_get_user_with_token
        app.dependency_overrides[auth_handler.get_current_user] = mock_get_current_user
    
    def test_upload_avatar_service_error(self):
        with patch('src.routes.user_routes.user_service.upload_avatar') as mock_upload:
            mock_upload.side_effect = Exception("Storage error")
            files = {"file": ("avatar.jpg", b"fake image data", "image/jpeg")}
            response = client.post(
                "/api/v1/users/avatar",
                files=files,
                headers={"Authorization": "Bearer fake_token"}
            )
            
            assert response.status_code == 500
