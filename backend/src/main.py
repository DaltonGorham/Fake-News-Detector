from fastapi import FastAPI, Response, Request
from src.routes import article_routes, user_routes
from src.config import settings
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

@app.options("/{full_path:path}")
async def options_handler(full_path: str, request: Request) -> Response:
    origin = request.headers.get("origin", "")
    if origin == "http://localhost:5173" or origin.endswith("daltongorhams-projects.vercel.app") or origin.endswith("https://fake-news-detector-frontend-delta.vercel.app") or origin == "https://articleverify.app" or origin == "https://www.articleverify.app":
        return Response(
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Max-Age": "3600",
            }
        )
    return Response(status_code=400)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://fake-news-detector-frontend-delta.vercel.app",
        "https://articleverify.app",
        "https://www.articleverify.app",
    ],
    allow_origin_regex=r"https://fake-news-detector-frontend-[a-zA-Z0-9-]+-daltongorhams-projects\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(article_routes.router, prefix="/api/v1")
app.include_router(user_routes.router, prefix="/api/v1")