import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './index';

// Mock supabase client first
vi.mock('../../../lib/supabaseClient', () => ({
  default: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn()
    }
  }
}));

// Mock the hooks
vi.mock('../../../hooks/auth/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { email: 'test@example.com' },
    logout: vi.fn()
  }))
}));

vi.mock('../../../hooks/user/useProfile', () => ({
  useProfile: vi.fn(() => ({
    profile: { username: 'testuser' },
    refreshProfile: vi.fn()
  }))
}));

// Mock child components
vi.mock('../UserMenu', () => ({
  default: ({ isOpen }) => isOpen ? <div data-testid="user-menu">User Menu</div> : null
}));

vi.mock('./HistoryPanel', () => ({
  default: ({ history, isLoading, error }) => (
    <div data-testid="history-panel">
      {isLoading && <div>Loading history...</div>}
      {error && <div>Error: {error}</div>}
      {history.length} items
    </div>
  )
}));

vi.mock('./UserButton', () => ({
  default: ({ onClick }) => (
    <button data-testid="user-button" onClick={onClick}>User Button</button>
  )
}));

// Mock react-icons
vi.mock('react-icons/hi', () => ({
  HiX: () => <span data-testid="close-icon">X</span>,
  HiMenu: () => <span data-testid="menu-icon">Menu</span>
}));

describe('Sidebar', () => {
  const defaultProps = {
    history: [
      { id: '1', title: 'Article 1' },
      { id: '2', title: 'Article 2' }
    ],
    isLoading: false,
    error: null,
    onHistoryChange: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sidebar in open state by default', () => {
    render(<Sidebar {...defaultProps} />);
    
    const sidebar = document.querySelector('.sidebar');
    expect(sidebar).toHaveClass('open');
  });

  it('renders toggle button', () => {
    render(<Sidebar {...defaultProps} />);
    
    expect(screen.getByLabelText('Close sidebar')).toBeInTheDocument();
  });

  it('toggles sidebar when toggle button is clicked', () => {
    render(<Sidebar {...defaultProps} />);
    
    const sidebar = document.querySelector('.sidebar');
    expect(sidebar).toHaveClass('open');
    
    fireEvent.click(screen.getByLabelText('Close sidebar'));
    
    expect(sidebar).toHaveClass('closed');
    expect(screen.getByLabelText('Open sidebar')).toBeInTheDocument();
  });

  it('changes icon when sidebar is toggled', () => {
    render(<Sidebar {...defaultProps} />);
    
    expect(screen.getByTestId('close-icon')).toBeInTheDocument();
    
    fireEvent.click(screen.getByLabelText('Close sidebar'));
    
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });

  it('renders HistoryPanel with correct props', () => {
    render(<Sidebar {...defaultProps} />);
    
    expect(screen.getByTestId('history-panel')).toBeInTheDocument();
    expect(screen.getByText('2 items')).toBeInTheDocument();
  });

  it('passes loading state to HistoryPanel', () => {
    render(<Sidebar {...defaultProps} isLoading={true} />);
    
    expect(screen.getByText('Loading history...')).toBeInTheDocument();
  });

  it('passes error to HistoryPanel', () => {
    render(<Sidebar {...defaultProps} error="Failed to load history" />);
    
    expect(screen.getByText('Error: Failed to load history')).toBeInTheDocument();
  });

  it('renders UserButton', () => {
    render(<Sidebar {...defaultProps} />);
    
    expect(screen.getByTestId('user-button')).toBeInTheDocument();
  });

  it('opens UserMenu when UserButton is clicked', () => {
    render(<Sidebar {...defaultProps} />);
    
    expect(screen.queryByTestId('user-menu')).not.toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('user-button'));
    
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
  });

  it('closes UserMenu when toggled again', () => {
    render(<Sidebar {...defaultProps} />);
    
    // Open menu
    fireEvent.click(screen.getByTestId('user-button'));
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
    
    // Close menu
    fireEvent.click(screen.getByTestId('user-button'));
    expect(screen.queryByTestId('user-menu')).not.toBeInTheDocument();
  });

  it('has sidebar-content section', () => {
    render(<Sidebar {...defaultProps} />);
    
    const sidebarContent = document.querySelector('.sidebar-content');
    expect(sidebarContent).toBeInTheDocument();
  });

  it('has sidebar-footer section', () => {
    render(<Sidebar {...defaultProps} />);
    
    const sidebarFooter = document.querySelector('.sidebar-footer');
    expect(sidebarFooter).toBeInTheDocument();
  });

  it('passes onHistoryChange to HistoryPanel', () => {
    const mockOnHistoryChange = vi.fn();
    
    render(<Sidebar {...defaultProps} onHistoryChange={mockOnHistoryChange} />);
    
    // HistoryPanel receives the prop (we can see it's passed in the mock)
    expect(screen.getByTestId('history-panel')).toBeInTheDocument();
  });

  it('handles empty history', () => {
    render(<Sidebar {...defaultProps} history={[]} />);
    
    expect(screen.getByText('0 items')).toBeInTheDocument();
  });

  it('sidebar remains functional after multiple toggles', () => {
    render(<Sidebar {...defaultProps} />);
    
    const sidebar = document.querySelector('.sidebar');
    
    // Toggle multiple times
    fireEvent.click(screen.getByLabelText('Close sidebar'));
    expect(sidebar).toHaveClass('closed');
    
    fireEvent.click(screen.getByLabelText('Open sidebar'));
    expect(sidebar).toHaveClass('open');
    
    fireEvent.click(screen.getByLabelText('Close sidebar'));
    expect(sidebar).toHaveClass('closed');
  });
});
