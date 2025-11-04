import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import SignupModal from './index';

// Mock the validator functions
vi.mock('../../../util/validator', () => ({
  validateEmail: vi.fn((email) => {
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email format');
    }
  }),
  validatePassword: vi.fn((password) => {
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      throw new Error('Password must contain uppercase, lowercase, and number');
    }
  }),
  validateUsername: vi.fn((username) => {
    if (!username || username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }
  }),
  getPasswordStrength: vi.fn((password) => {
    if (!password) return { strength: 0, label: '', color: '#ccc' };
    if (password.length < 8) return { strength: 25, label: 'Weak', color: '#ff4444' };
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return { strength: 50, label: 'Fair', color: '#ffa500' };
    }
    return { strength: 100, label: 'Strong', color: '#00aa00' };
  })
}));

// Mock react-icons
vi.mock('react-icons/hi', () => ({
  HiEye: () => <span data-testid="eye-icon">Eye</span>,
  HiEyeOff: () => <span data-testid="eye-off-icon">EyeOff</span>
}));

describe('SignupModal', () => {
  const defaultProps = {
    onClose: vi.fn(),
    onSignup: vi.fn(),
    status: ''
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders signup form', () => {
    render(<SignupModal {...defaultProps} />);
    
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('renders signup and cancel buttons', () => {
    render(<SignupModal {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('updates form data when user types', () => {
    render(<SignupModal {...defaultProps} />);
    
    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    
    expect(usernameInput.value).toBe('testuser');
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('Password123');
  });

  it('toggles password visibility', () => {
    render(<SignupModal {...defaultProps} />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    const toggleButton = screen.getByLabelText(/password/i);
    
    // Initially hidden
    expect(passwordInput.type).toBe('password');
    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
    
    // Click to show
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument();
    
    // Click to hide again
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('displays password strength indicator when password is entered', () => {
    render(<SignupModal {...defaultProps} />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    
    // No strength indicator initially
    expect(screen.queryByText('Weak')).not.toBeInTheDocument();
    
    // Enter weak password
    fireEvent.change(passwordInput, { target: { value: 'pass' } });
    expect(screen.getByText('Weak')).toBeInTheDocument();
    
    // Enter strong password
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    const mockOnClose = vi.fn();
    render(<SignupModal {...defaultProps} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('validates all fields and calls onSignup when form is valid', () => {
    const mockOnSignup = vi.fn();
    render(<SignupModal {...defaultProps} onSignup={mockOnSignup} />);
    
    // Fill in valid data
    fireEvent.change(screen.getByPlaceholderText('Username'), { 
      target: { value: 'testuser' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), { 
      target: { value: 'Password123' } 
    });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    expect(mockOnSignup).toHaveBeenCalledWith('test@example.com', 'Password123', 'testuser');
  });

  it('does not call onSignup when username is invalid', () => {
    const mockOnSignup = vi.fn();
    render(<SignupModal {...defaultProps} onSignup={mockOnSignup} />);
    
    // Fill in data with invalid username
    fireEvent.change(screen.getByPlaceholderText('Username'), { 
      target: { value: 'ab' } // Too short
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), { 
      target: { value: 'Password123' } 
    });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    expect(mockOnSignup).not.toHaveBeenCalled();
    expect(screen.getByText('Username must be at least 3 characters')).toBeInTheDocument();
  });

  it('does not call onSignup when email is invalid', () => {
    const mockOnSignup = vi.fn();
    render(<SignupModal {...defaultProps} onSignup={mockOnSignup} />);
    
    // Fill in data with invalid email
    fireEvent.change(screen.getByPlaceholderText('Username'), { 
      target: { value: 'testuser' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), { 
      target: { value: 'invalid-email' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), { 
      target: { value: 'Password123' } 
    });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    expect(mockOnSignup).not.toHaveBeenCalled();
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
  });

  it('does not call onSignup when password is invalid', () => {
    const mockOnSignup = vi.fn();
    render(<SignupModal {...defaultProps} onSignup={mockOnSignup} />);
    
    // Fill in data with invalid password
    fireEvent.change(screen.getByPlaceholderText('Username'), { 
      target: { value: 'testuser' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), { 
      target: { value: 'weak' } 
    });
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    expect(mockOnSignup).not.toHaveBeenCalled();
    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  it('clears error when user starts typing', () => {
    render(<SignupModal {...defaultProps} />);
    
    // Submit with empty email to trigger error
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    
    // Start typing - error should clear
    fireEvent.change(screen.getByPlaceholderText('Email'), { 
      target: { value: 't' } 
    });
    expect(screen.queryByText('Invalid email format')).not.toBeInTheDocument();
  });

  it('displays status message when provided', () => {
    render(<SignupModal {...defaultProps} status="Account created successfully!" />);
    
    expect(screen.getByText('Account created successfully!')).toBeInTheDocument();
  });

  it('applies error class to inputs with errors', () => {
    render(<SignupModal {...defaultProps} />);
    
    // Submit to trigger validation
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    const emailInput = screen.getByPlaceholderText('Email');
    expect(emailInput).toHaveClass('error');
  });

  it('displays input hints', () => {
    render(<SignupModal {...defaultProps} />);
    
    expect(screen.getByText(/3-15 characters, letters, numbers/)).toBeInTheDocument();
    expect(screen.getByText(/Min 8 characters, uppercase, lowercase, number/)).toBeInTheDocument();
  });
});
