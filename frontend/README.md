# Fake News Detector - Frontend

React application for analyzing news articles and detecting potential misinformation. Users can submit articles, view credibility scores, and manage their analysis history.

Live at: https://articleverify.net

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Generate coverage report
npm run test:coverage

# Build for production
npm run build
```

## Testing

This project has comprehensive test coverage using Vitest and React Testing Library. We have 152 tests covering all major components.

Run tests:
```bash
npm test              # Watch mode
npm run test:ui       # Visual test UI
npm run test:coverage # Coverage report
```

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## Project Structure

```
frontend/
├── src/
│   ├── api/                 # API client and endpoints
│   │   ├── client.js        # Base HTTP client
│   │   ├── articles.js      # Article endpoints
│   │   └── user.js          # User endpoints
│   │
│   ├── components/          # React components
│   │   ├── auth/           # Authentication components
│   │   ├── common/         # Reusable UI components
│   │   └── layout/         # Page layout components
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useProfile.js
│   │   └── article/        # Article-specific hooks
│   │
│   ├── lib/                # Third-party library configs
│   │   └── supabaseClient.js
│   │
│   ├── pages/              # Page components
│   │   ├── LoginPage.jsx
│   │   ├── MainPage.jsx
│   │   └── VerifyEmail.jsx
│   │
│   ├── styles/             # Component styles
│   ├── util/               # Helper functions
│   └── test/               # Test configuration
│       └── setup.js        # Vitest setup
│
└── coverage/               # Test coverage reports
```


### Components

Components are organized by feature:

**auth/** - Authentication flows
- EmailVerification
- SignupModal

**common/** - Reusable UI components
- Loading spinner
- UserAvatar
- TruthnessGauge
- AnalyzingAnimation
- ConfirmModal

**layout/** - Main application layout
- ArticleInput
- ArticleDetails
- ProfileSettings
- Sidebar
- UserMenu

Each component includes its own CSS file for styling.

### Custom Hooks

Hooks encapsulate complex logic and state management:

**useAuth** - Authentication state and actions
**useProfile** - User profile data and updates
**article/useArticleSubmission** - Article submission logic
**article/useAnalysisPolling** - Polling for analysis results

### State Management

The app uses React's built-in state management:
- Component state for UI interactions
- Context for global auth state
- Custom hooks for shared logic
- Local storage for caching

## Environment Variables

Required variables (create a `.env` file):

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_API_BASE_URL=your_backend_url
```

## Deployment

The frontend is deployed on Vercel with automatic deployments:
- Push to `main` triggers production deployment
- Push to `develop` triggers preview deployment
- Pull requests create preview deployments
- Tests must pass before deployment

## Development Notes

- The app uses Vite for fast development and building
- All API calls return consistent `{ data, error }` objects
- Components are tested with Vitest and React Testing Library
- Authentication is handled through Supabase
- Article analysis results are cached for better performance