# Fake News Detector Frontend

React app for analyzing articles and detecting potential fake news. Built with Vite and uses Supabase for auth.

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── api/                 # API communication layer
│   │   ├── index.js        # API exports 
│   │   ├── client.js       # Base API client configuration
│   │   └── articles.js     # Article-specific API endpoints
│   │
│   ├── components/         # UI Components
│   │   ├── auth/          # Authentication related components
│   │   ├── common/        # Shared/reusable components
│   │   └── layout/        # Layout and structural components
│   │
│   ├── hooks/             # Custom React hooks
│   │   └── article/       # Article-related hooks
│   │
│   ├── lib/              # Library configurations
│   │   └── supabaseClient.js
│   │
│   ├── pages/            # Page components
│   ├── styles/           # Global styles
│   └── util/             # Utility functions
```

## Architecture Design

### How It Works

The app is built with a few simple pieces:

#### Base Client (`client.js`)
```javascript
const apiClient = async (endpoint, options) => {
  // 1. Handles authentication headers from Supabase
  // 2. Manages common request configurations
  // 3. Processes responses
  // 4. Returns consistent { data, error } structure
}
```

#### Feature-Specific APIs (`articles.js`)
Currently implemented with mock data for development:
```javascript
const articleApi = {
  analyzeArticle: async (url) => {
    // Returns mock analysis data
    return {
      data: {
        id: "123",
        credibility_score: 0.85,
        classification: "reliable"
      },
      error: null
    };
  }
}
```

#### API Barrel File (`index.js`)
Provides clean imports throughout the application:
```javascript
export { apiClient } from './client';
export { articleApi } from './articles';
```

### Components

Components are grouped by feature to keep things organized:

- `auth/` - Login and signup stuff
- `common/` - Reusable components like loading spinners
- `layout/` - Main page layout components

Each component has its own CSS file right next to it to make styling easier:

```
components/
└── auth/
    └── LoginForm/
        ├── index.jsx
        └── styles.css
```

### Custom Hooks

The complex stuff is handled in hooks. For example, article submission looks like:

```javascript
const useArticleSubmission = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitArticle = async (url) => {
    // Handle submission
  };

  return { loading, error, submitArticle };
};
```

### Error Handling

All API calls return either data or an error:
```javascript
const { data, error } = await articleApi.analyze(url);
if (error) {
  // Show error message
}
```

## Development Notes

Right now:
- API calls return mock data
- Added small delays to test loading states
- Error handling is ready for real API
- Components are set up for real data

## TODO

When the backend is ready:
1. Remove mock data in `articles.js`
2. Point to real API endpoints
3. Test everything works