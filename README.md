# Fake News Detector

Web application that analyzes the realism of submitted articles using natural language processing and machine learning.  
Built with **React (Vercel)** for the frontend, **FastAPI (Render)** for the backend, and **Supabase** for authentication and storage.

---

## Overview

The Fake News Detector allows users to:
- Log in and submit news article URLs for analysis.
- Receive a realism **score** and **verdict** (e.g., "Likely Real" or "Possibly Fake").
- View a history of past analyses.
- Explore related articles and classification trends using our ML pipeline.


## Architecture
**Core components:**
- **Frontend (Vercel)** — React app that handles UI, user authentication, and API requests.
- **Backend (Render)** — FastAPI service exposing REST endpoints for login, analysis, and results.
- **Database (Supabase)** — Stores user accounts, article history, and analysis results.
- **Machine Learning Module** — model providing embeddings and realism scoring.

---

## API Endpoints
### **Analysis**
| Method | Endpoint | Description |
|---------|-----------|-------------|
| `POST` | `/v1/analyze` | Analyze a news article by URL |
| `GET`  | `/v1/results/{analysisId}` | Fetch analysis result |
| `GET`  | `/v1/user/history` | Fetch user’s past analyses |
| `DELETE` | `/v1/user/history/{analysisID}` | Delete a specific analysis record from the user’s history
**Response Example:**
```json
{
  "analysisId": 101,
  "score": 83,
  "verdict": "Likely Real"
}
```

## Local Setup
### 1. Clone the repo
```bash
git clone https://github.com/DaltonGorham/fake-news-detector.git
cd fake-news-detector
```
### 2. Setup environment variables
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
```
### 3. How to Run Locally
### Frontend
```bash
cd frontend
npm install
npm run dev
```
### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
### Then visit: http://localhost:5173
