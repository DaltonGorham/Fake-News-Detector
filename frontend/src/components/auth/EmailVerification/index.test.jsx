import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmailVerification from './index';

describe('EmailVerification', () => {
  const defaultProps = {
    email: 'test@example.com',
    onBack: vi.fn(),
    onResend: vi.fn()
  };

  it('renders with provided email', () => {
    render(<EmailVerification {...defaultProps} />);
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('displays verification instructions', () => {
    render(<EmailVerification {...defaultProps} />);
    
    expect(screen.getByText(/We've sent a confirmation link to:/)).toBeInTheDocument();
    expect(screen.getByText(/Please check your inbox/)).toBeInTheDocument();
  });

  it('shows resend button', () => {
    render(<EmailVerification {...defaultProps} />);
    
    expect(screen.getByText('Resend Email')).toBeInTheDocument();
  });

  it('shows back to login button', () => {
    render(<EmailVerification {...defaultProps} />);
    
    expect(screen.getByText('Back to Login')).toBeInTheDocument();
  });

  it('calls onBack when back button is clicked', () => {
    const mockOnBack = vi.fn();
    render(<EmailVerification {...defaultProps} onBack={mockOnBack} />);
    
    fireEvent.click(screen.getByText('Back to Login'));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('calls onResend when resend button is clicked', async () => {
    const mockOnResend = vi.fn().mockResolvedValue({});
    render(<EmailVerification {...defaultProps} onResend={mockOnResend} />);
    
    fireEvent.click(screen.getByText('Resend Email'));
    
    await waitFor(() => {
      expect(mockOnResend).toHaveBeenCalledTimes(1);
    });
  });

  it('shows loading state while resending', async () => {
    const mockOnResend = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<EmailVerification {...defaultProps} onResend={mockOnResend} />);
    
    fireEvent.click(screen.getByText('Resend Email'));
    
    expect(screen.getByText('Sending...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Resend Email')).toBeInTheDocument();
    });
  });

  it('disables resend button while sending', async () => {
    const mockOnResend = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<EmailVerification {...defaultProps} onResend={mockOnResend} />);
    
    const resendButton = screen.getByText('Resend Email');
    fireEvent.click(resendButton);
    
    await waitFor(() => {
      expect(screen.getByText('Sending...')).toBeDisabled();
    });
  });

  it('displays success message after successful resend', async () => {
    const mockOnResend = vi.fn().mockResolvedValue({});
    render(<EmailVerification {...defaultProps} onResend={mockOnResend} />);
    
    fireEvent.click(screen.getByText('Resend Email'));
    
    await waitFor(() => {
      expect(screen.getByText('Verification email sent!')).toBeInTheDocument();
    });
  });

  it('displays error message when resend fails with error object', async () => {
    const mockOnResend = vi.fn().mockResolvedValue({
      error: { message: 'Rate limit exceeded' }
    });
    render(<EmailVerification {...defaultProps} onResend={mockOnResend} />);
    
    fireEvent.click(screen.getByText('Resend Email'));
    
    await waitFor(() => {
      expect(screen.getByText('Rate limit exceeded')).toBeInTheDocument();
    });
  });

  it('displays generic error message when resend throws exception', async () => {
    const mockOnResend = vi.fn().mockRejectedValue(new Error('Network error'));
    render(<EmailVerification {...defaultProps} onResend={mockOnResend} />);
    
    fireEvent.click(screen.getByText('Resend Email'));
    
    await waitFor(() => {
      expect(screen.getByText('Failed to resend verification email.')).toBeInTheDocument();
    });
  });

  it('clears previous status message before new resend attempt', async () => {
    const mockOnResend = vi.fn()
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});
    
    render(<EmailVerification {...defaultProps} onResend={mockOnResend} />);
    
    // First resend
    fireEvent.click(screen.getByText('Resend Email'));
    await waitFor(() => {
      expect(screen.getByText('Verification email sent!')).toBeInTheDocument();
    });
    
    // Second resend - status should briefly disappear
    fireEvent.click(screen.getByText('Resend Email'));
    
    // After second resend completes, success message should appear again
    await waitFor(() => {
      expect(screen.getByText('Verification email sent!')).toBeInTheDocument();
    });
  });
});
