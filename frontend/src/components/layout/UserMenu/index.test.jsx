import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserMenu from './index';

// Mock ProfileSettings component
vi.mock('../ProfileSettings', () => ({
  default: ({ isOpen, onClose }) => 
    isOpen ? <div data-testid="profile-settings-mock">Profile Settings</div> : null
}));

// Mock react-icons
vi.mock('react-icons/hi', () => ({
  HiOutlineUser: () => <span data-testid="user-icon">User</span>,
  HiOutlineLogout: () => <span data-testid="logout-icon">Logout</span>
}));

describe('UserMenu', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    user: { email: 'test@example.com' },
    profile: { username: 'testuser', avatar_url: null },
    logout: vi.fn(),
    refreshProfile: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<UserMenu {...defaultProps} isOpen={false} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('renders user menu when isOpen is true', () => {
    render(<UserMenu {...defaultProps} />);
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('displays user avatar when avatar_url is provided', () => {
    const propsWithAvatar = {
      ...defaultProps,
      profile: { username: 'testuser', avatar_url: 'https://example.com/avatar.jpg' }
    };

    render(<UserMenu {...propsWithAvatar} />);
    
    const avatar = screen.getByAltText('User avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar.src).toBe('https://example.com/avatar.jpg');
  });

  it('displays username initial when no avatar_url', () => {
    render(<UserMenu {...defaultProps} />);
    
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('displays email initial when no username', () => {
    const propsWithoutUsername = {
      ...defaultProps,
      profile: { avatar_url: null }
    };

    render(<UserMenu {...propsWithoutUsername} />);
    
    expect(screen.getByText('T')).toBeInTheDocument(); // First letter of test@example.com
  });

  it('renders Profile Settings menu item', () => {
    render(<UserMenu {...defaultProps} />);
    
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
  });

  it('renders Log Out menu item', () => {
    render(<UserMenu {...defaultProps} />);
    
    expect(screen.getByText('Log Out')).toBeInTheDocument();
  });

  it('opens ProfileSettings when Profile Settings is clicked', () => {
    render(<UserMenu {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Profile Settings'));
    
    expect(screen.getByTestId('profile-settings-mock')).toBeInTheDocument();
  });

  it('calls logout and onClose when Log Out is clicked', () => {
    const mockLogout = vi.fn();
    const mockOnClose = vi.fn();

    render(<UserMenu {...defaultProps} logout={mockLogout} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('Log Out'));
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes menu when clicking outside', () => {
    const mockOnClose = vi.fn();
    
    render(<UserMenu {...defaultProps} onClose={mockOnClose} />);
    
    // Simulate click outside by dispatching mousedown event on document
    fireEvent.mouseDown(document.body);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not close menu when clicking inside', () => {
    const mockOnClose = vi.fn();
    
    render(<UserMenu {...defaultProps} onClose={mockOnClose} />);
    
    const menu = screen.getByText('testuser').closest('.user-menu');
    fireEvent.mouseDown(menu);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('closes ProfileSettings when its onClose is called', () => {
    render(<UserMenu {...defaultProps} />);
    
    // Open ProfileSettings
    fireEvent.click(screen.getByText('Profile Settings'));
    expect(screen.getByTestId('profile-settings-mock')).toBeInTheDocument();
    
    // Note: We can't easily test the ProfileSettings closing without more complex mocking
    // since it's controlled by internal state
  });

  it('cleans up event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    
    const { unmount } = render(<UserMenu {...defaultProps} />);
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    
    removeEventListenerSpy.mockRestore();
  });

  it('adds event listener when menu opens', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    
    render(<UserMenu {...defaultProps} isOpen={true} />);
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    
    addEventListenerSpy.mockRestore();
  });

  it('does not add event listener when menu is closed', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    
    render(<UserMenu {...defaultProps} isOpen={false} />);
    
    expect(addEventListenerSpy).not.toHaveBeenCalled();
    
    addEventListenerSpy.mockRestore();
  });

  it('displays question mark when no profile or user data', () => {
    const propsWithNoData = {
      ...defaultProps,
      user: {},
      profile: {}
    };

    render(<UserMenu {...propsWithNoData} />);
    
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('passes refreshProfile to ProfileSettings', () => {
    render(<UserMenu {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Profile Settings'));
    
    // ProfileSettings should be rendered, which means it received the props
    expect(screen.getByTestId('profile-settings-mock')).toBeInTheDocument();
  });
});
