from fastapi import FastAPI
from src.routes import test_routes
from src.config import settings

app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)


app.include_router(test_routes.router, prefix="/api/v1")
