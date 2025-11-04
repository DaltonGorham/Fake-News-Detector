# Testing Guide

## Running Tests

```bash
# Run tests in watch mode (recommended for development)
npm test

# Run tests once
npm test -- run

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Writing More Tests

When adding a new feat please also write a test for it like so: 
Create test files next to your components with `.test.jsx` extension:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
  
  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Testing Utilities that we can use

- `screen.getByRole()` - Find by ARIA role 
- `screen.getByText()` - Find by text content
- `screen.getByLabelText()` - Find by label
- `screen.getByTestId()` - Find by data-testid attribute
- `fireEvent` - Trigger DOM events
- `waitFor` - Wait for async changes
- `vi.fn()` - Create mock functions
- `vi.mock()` - Mock modules

## Coverage

View coverage report after running:
```bash
npm run test:coverage
```

Open `coverage/index.html` in your browser to see detailed coverage report.

Make sure to add this to your .gitignore if ran
```
frontend/coverage/
coverage/
```
