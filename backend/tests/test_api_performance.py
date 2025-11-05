import os
import time
import asyncio
import pytest
from httpx import AsyncClient


BASE_URL = os.getenv("API_BASE_URL", "https://fake-news-detector-dev-prod.onrender.com")
LOCALHOST_ORIGIN = "http://localhost:5173"

# Skip performance tests in CI/CD since they require a live server
pytestmark = pytest.mark.skipif(
    os.getenv("TESTING") == "true",
    reason="Performance tests require live server"
)


@pytest.fixture
async def http_client():
    async with AsyncClient(base_url=BASE_URL, timeout=30.0) as client:
        yield client


class TestAPITiming:
    
    @pytest.mark.asyncio
    async def test_options_endpoint(self, http_client):
        response_times = []
        
        for _ in range(10):
            start_time = time.perf_counter()
            response = await http_client.options(
                "/api/v1/articles",
                headers={"origin": LOCALHOST_ORIGIN}
            )
            end_time = time.perf_counter()
            elapsed_ms = (end_time - start_time) * 1000
            response_times.append(elapsed_ms)
            assert response.status_code in [200, 404]
        
        average = sum(response_times) / len(response_times)
        minimum = min(response_times)
        maximum = max(response_times)
        
        print(f"\nOPTIONS /api/v1/articles")
        print(f"  avg: {average:.2f}ms")
        print(f"  min: {minimum:.2f}ms")
        print(f"  max: {maximum:.2f}ms")
        
        assert average < 500
    
    @pytest.mark.asyncio
    async def test_article_history_endpoint(self, http_client):
        response_times = []
        
        for _ in range(5):
            start_time = time.perf_counter()
            response = await http_client.get(
                "/api/v1/articles/history",
                headers={"origin": LOCALHOST_ORIGIN}
            )
            end_time = time.perf_counter()
            elapsed_ms = (end_time - start_time) * 1000
            response_times.append(elapsed_ms)
        
        average = sum(response_times) / len(response_times)
        minimum = min(response_times)
        maximum = max(response_times)
        
        print(f"\nGET /api/v1/articles/history")
        print(f"  avg: {average:.2f}ms")
        print(f"  min: {minimum:.2f}ms")
        print(f"  max: {maximum:.2f}ms")
        print(f"  status: {response.status_code}")
        
        assert average < 2000
    
    @pytest.mark.asyncio
    async def test_concurrent_requests(self, http_client):
        request_count = 20
        start_time = time.perf_counter()
        
        tasks = [
            http_client.options(
                "/api/v1/articles",
                headers={"origin": LOCALHOST_ORIGIN}
            )
            for _ in range(request_count)
        ]
        
        responses = await asyncio.gather(*tasks)
        end_time = time.perf_counter()
        
        total_elapsed_ms = (end_time - start_time) * 1000
        average_per_request = total_elapsed_ms / len(responses)
        requests_per_second = len(responses) / (total_elapsed_ms / 1000)
        
        print(f"\nConcurrent requests (n={request_count})")
        print(f"  total: {total_elapsed_ms:.2f}ms")
        print(f"  avg per request: {average_per_request:.2f}ms")
        print(f"  req/sec: {requests_per_second:.2f}")
        
        assert len(responses) == request_count
        assert all(r.status_code in [200, 404] for r in responses)
        assert total_elapsed_ms < 5000
    
    @pytest.mark.asyncio
    async def test_cors_preflight(self, http_client):
        response_times = []
        
        for _ in range(10):
            start_time = time.perf_counter()
            response = await http_client.options(
                "/api/v1/user/profile",
                headers={
                    "origin": LOCALHOST_ORIGIN,
                    "Access-Control-Request-Method": "GET",
                    "Access-Control-Request-Headers": "Authorization"
                }
            )
            end_time = time.perf_counter()
            elapsed_ms = (end_time - start_time) * 1000
            response_times.append(elapsed_ms)
        
        average = sum(response_times) / len(response_times)
        minimum = min(response_times)
        maximum = max(response_times)
        
        print(f"\nCORS preflight")
        print(f"  avg: {average:.2f}ms")
        print(f"  min: {minimum:.2f}ms")
        print(f"  max: {maximum:.2f}ms")
        
        assert average < 500


class TestAPIHealth:
    
    @pytest.mark.asyncio
    async def test_root_endpoint(self, http_client):
        start_time = time.perf_counter()
        response = await http_client.get("/")
        end_time = time.perf_counter()
        elapsed_ms = (end_time - start_time) * 1000
        
        print(f"\nGET /")
        print(f"  status: {response.status_code}")
        print(f"  time: {elapsed_ms:.2f}ms")
        print(f"  url: {BASE_URL}")
        
        assert elapsed_ms < 1000
    
    @pytest.mark.asyncio
    async def test_cors_headers(self, http_client):
        response = await http_client.options(
            "/api/v1/articles",
            headers={"origin": LOCALHOST_ORIGIN}
        )
        
        print(f"\nCORS headers:")
        cors_headers = {k: v for k, v in response.headers.items() if 'access-control' in k.lower()}
        for header_name, header_value in cors_headers.items():
            print(f"  {header_name}: {header_value}")
        
        assert response.status_code in [200, 404]

