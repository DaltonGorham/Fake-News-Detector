# Fake News Detector

A tool that checks if news articles might be fake. Paste a URL, get an analysis.

## Getting Started

First time setup:
```bash
# Get the code
git clone https://github.com/DaltonGorham/fake-news-detector.git
cd fake-news-detector

# Frontend
cd frontend
npm install
npm run dev

# Backend
cd ../backend
pip install -r requirements.txt
python -m uvicorn src.main:app --reload
```

## What It Does

Put in a news article URL and the app will:
- Check if it seems reliable
- Show you a trust score
- Save it to your history

## How It's Built

Frontend:
- React for the UI (hosted on Vercel)
- Vite for development
- Supabase for user accounts

Backend:
- FastAPI server (hosted on Render)
- Custom ML model for article analysis
- Supabase for the database

## File Layout

```
├── frontend/    # All the React stuff
├── backend/     # Server code
└── docs/        # Extra documentation
```

Want more details? Check:
- [Frontend details](frontend/README.md)
- [Backend details](backend/README.md)

## API Basics

Here's what you can do:

```bash
# Check an article
POST /api/v1/analyze
{"url": "https://example.com/article"}

# See your history
GET /api/v1/user/history

# Look up a specific analysis
GET /api/v1/results/{id}
```

## Setting Up for Development

1. Copy `.env.example` to `.env`
2. Add your Supabase details
3. Start frontend and backend (see commands above)
4. Open `http://localhost:5173`

