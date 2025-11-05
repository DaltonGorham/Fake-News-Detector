"""
Tests for the health check endpoint
"""
from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_health_check():
    """Test that health check endpoint returns healthy status"""
    response = client.get("/healthz")
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "service" in data
    assert "version" in data
