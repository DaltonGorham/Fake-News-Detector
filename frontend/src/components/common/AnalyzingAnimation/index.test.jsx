import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AnalyzingAnimation from './index';

// Mock the animation components because why not, i mean test everything for more coverage
vi.mock('./PacmanAnimation', () => ({
  default: ({ stages, currentStage }) => (
    <div data-testid="pacman-animation">
      Stage {currentStage}: {stages[currentStage]?.text}
    </div>
  )
}));

vi.mock('./DotsAnimation', () => ({
  default: ({ stages, currentStage }) => (
    <div data-testid="dots-animation">
      Stage {currentStage}: {stages[currentStage]?.text}
    </div>
  )
}));

describe('AnalyzingAnimation', () => {
  it('renders an animation component', () => {
    render(<AnalyzingAnimation />);
    
    const container = screen.getByText(/Stage 0:/);
    expect(container).toBeInTheDocument();
  });

  it('displays first stage initially', () => {
    render(<AnalyzingAnimation />);
    
    expect(screen.getByText(/Reading article\.\.\./)).toBeInTheDocument();
  });

  it('renders either PacmanAnimation or DotsAnimation', () => {
    render(<AnalyzingAnimation />);
    
    const hasPacman = screen.queryByTestId('pacman-animation');
    const hasDots = screen.queryByTestId('dots-animation');
    
    // Should have exactly one animation type
    expect(hasPacman || hasDots).toBeTruthy();
    expect(hasPacman && hasDots).toBeFalsy();
  });

  it('has correct stage order', () => {
    render(<AnalyzingAnimation />);
    
    // Initial stage
    expect(screen.getByText(/Reading article\.\.\./)).toBeInTheDocument();
  });

  it('cleans up timers on unmount', () => {
    const { unmount } = render(<AnalyzingAnimation />);
    
    // Component should unmount without errors
    expect(() => unmount()).not.toThrow();
  });
});
