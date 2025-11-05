# Fake News Detector

An application that analyzes news articles for credibility. Users can submit article URLs, get credibility scores, and track their analysis history.

Live at: https://articleverify.net

## Quick Start

Clone and set up:
```bash
git clone https://github.com/DaltonGorham/fake-news-detector.git
cd fake-news-detector

# Frontend setup
cd frontend
npm install
npm run dev

# Backend setup
cd ../backend
pip install -r requirements.txt
python -m uvicorn src.main:app --reload
```

The frontend runs at `http://localhost:5173` and the backend at `http://localhost:8000`.

## What It Does

This app analyzes news articles for potential misinformation:
- Submit any article URL for analysis
- Get a credibility score and classification
- View detailed analysis results
- Track your article history
- User authentication and profiles

## Tech Stack

**Frontend**
- React with Vite
- Deployed on Vercel
- Supabase for authentication
- Vitest for testing (152 tests)

**Backend**
- FastAPI server
- Deployed on Render
- Custom ML model for article analysis
- Supabase for database

**CI/CD**
- GitHub Actions for automated testing
- Automated deployments to Vercel and Render
- Test coverage reports

## Project Structure

```
├── frontend/       # React application
├── backend/        # FastAPI server
├── docs/           # Documentation
└── .github/        # CI/CD workflows
```

See the individual READMEs for more details:
- [Frontend README](frontend/README.md)
- [Backend README](backend/README.md)
- [Testing Documentation](frontend/TESTING.md)

## API Overview

The backend provides these main endpoints:

```
POST   /api/v1/articles/analyze     # Analyze an article
GET    /api/v1/articles/history     # Get user's analysis history
GET    /api/v1/articles/{id}        # Get specific analysis
GET    /api/v1/user/profile         # Get user profile
PUT    /api/v1/user/profile         # Update user profile
```

## Development Setup

1. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend
   - Add your Supabase credentials
   - Add any other required API keys

2. Install dependencies and run:
   ```bash
   # Frontend
   cd frontend && npm install && npm run dev
   
   # Backend
   cd backend && pip install -r requirements.txt && uvicorn src.main:app --reload
   ```

3. Run tests:
   ```bash
   cd frontend
   npm test              # Run tests in watch mode
   npm run test:coverage # Generate coverage report
   ```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests to make sure everything passes
4. Push and create a pull request

The CI/CD pipeline will automatically run tests on your PR.

