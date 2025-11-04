# Fake News Detector - Backend

FastAPI server that analyzes news articles for credibility using a custom machine learning model. Provides REST API endpoints for article analysis, user management, and analysis history.

## Getting Started

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
python -m uvicorn src.main:app --reload

# Or use gunicorn for production
gunicorn src.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

The API will be available at `http://localhost:8000`.
API documentation is at `http://localhost:8000/docs`.

## Project Structure

```
backend/
├── src/
│   ├── main.py              # FastAPI app and configuration
│   ├── config.py            # Environment configuration
│   │
│   ├── routes/              # API endpoints
│   │   ├── article_routes.py  # Article analysis endpoints
│   │   └── user_routes.py     # User profile endpoints
│   │
│   ├── services/            # Business logic
│   │   ├── article_service.py
│   │   └── user_service.py
│   │
│   ├── repository/          # Data access layer
│   │   ├── article_repository.py
│   │   └── model_repository.py
│   │
│   ├── middleware/          # Request middleware
│   │   └── auth.py          # Authentication middleware
│   │
│   └── lib/                 # External services
│       └── supabase_client.py
│
└── model/                   # ML model files
```

## API Endpoints

### Article Analysis

```
POST /api/v1/articles/analyze
  Body: { "url": "article_url" }
  Returns: Analysis results with credibility score

GET /api/v1/articles/history
  Returns: User's analysis history

GET /api/v1/articles/{article_id}
  Returns: Specific article analysis
```

### User Management

```
GET /api/v1/user/profile
  Returns: User profile data

PUT /api/v1/user/profile
  Body: { profile data }
  Returns: Updated profile
```

## Architecture

The backend follows a layered architecture:

**Routes** - Handle HTTP requests and responses
**Services** - Contain business logic and orchestration
**Repository** - Handle data persistence and retrieval
**Middleware** - Process requests (authentication, CORS, etc.)

### Authentication

Authentication is handled through Supabase. The auth middleware:
- Validates JWT tokens from request headers
- Extracts user information
- Protects endpoints requiring authentication

### Article Analysis

The article analysis pipeline:
1. Extract article content from URL using newspaper3k
2. Process text through the ML model
3. Generate credibility score and classification
4. Store results in database
5. Return analysis to user

## Environment Variables

Required variables (create a `.env` file):

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
APP_NAME=Fake News Detector API
DEBUG=True
```

## Dependencies

Key dependencies:
- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **Supabase** - Database and authentication
- **newspaper3k** - Article extraction
- **scikit-learn** - Machine learning
- **lxml** - HTML parsing

## Deployment

The backend is deployed on Railway:
- Automatic deployment on push to `main`
- Environment variables configured in Railway dashboard
- Health checks ensure service availability

## Development Notes

- The API uses CORS middleware to allow requests from the frontend
- All routes are versioned under `/api/v1`
- Authentication tokens are validated on protected routes
- The ML model is loaded once at startup for efficiency
- Article content is cached to avoid repeated fetching
