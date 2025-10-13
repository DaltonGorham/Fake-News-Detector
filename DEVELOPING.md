# Repository Guidelines

This document outlines the **project structure**, **code style**, and **development conventions** for this repository.  
Following these standards ensures consistency, readability, and maintainability across both frontend and backend codebases.

---

## Expected Project Structure

The repository should maintain the following layout:

```
project-root/
│
├── frontend/               # Frontend React/Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── styles/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                # Backend API (Python/FastAPI)
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── services/
│   │   ├── utils/
│   │   └── __init__.py
│   ├── tests/
│   ├── requirements.txt
│   └── main.py
│
├── scripts/                # Dev tools, setup scripts, automation
│   ├── setup.sh
│   ├── start_local.sh
│   └── deploy.py
│
├── docs/                   # Documentation (architecture, API reference, design)
│   ├── api-reference.md
│   └── architecture.md
│
├── .github/                # CODEOWNERS
│   └── CODEOWNERS
│
├── .env.example            # Template for environment variables
├── README.md
├── DEVOLOPING.md
```

## Code Style Guidelines

### Frontend (JavaScript)
* Use camelCase for variable and function names
```JavaScript
const userProfile = getUserProfile();
```
* Use PascalCase for React component names
```JavaScript
function UserProfileCard() { ... }
```

### Backend (Python)
* Use snake_case for variables, functions, and file names
```Python
def get_user_profile():
```
* Use PascalCase for class names
```Python
class UserProfileService:
```
* Use type hints whenever possible:
```Python
def fetch_user(id: int) -> User:
```

## Branching & Git
- We use a two-branch workflow for development and production:
- main → Production-ready branch
- develop → Integration branch for completed features

### Workflow 
1. Create a feature branch from develop:
```
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```
2. Once the feature is complete, open a *Pull Request* into develop.
3. After testing and validation, develop is merged into main for a release.

### Branch Naming Conventions:
- `feature/<name>` → new features
- `bugfix/<name>` → bug fixes
- `refactor/<name>` → refactoring existing code

### Use conventional commits:
```
feat: add login button
fix: resolve API timeout issue
refactor: improve user service structure
```


### GitHub Actions Overview

This repository includes automated CI/CD pipelines under .github/workflows/:

`deploy-frontend.yml`

Triggers on merges to develop that modify the frontend/ directory.

Builds the Vite project and deploys to Vercel.

Production deployments occur only on merges to main.

