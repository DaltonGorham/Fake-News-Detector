import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileSettings from './index';

// Mock the user API
vi.mock('../../../api/user', () => ({
  userApi: {
    uploadAvatar: vi.fn(),
    updateProfile: vi.fn()
  }
}));

// Mock validator
vi.mock('../../../util/validator', () => ({
  validateUsername: vi.fn((username) => {
    if (username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }
    if (username.length > 15) {
      throw new Error('Username must be at most 15 characters');
    }
  })
}));

// Mock Loading component
vi.mock('../../common/Loading', () => ({
  default: ({ inline }) => <div data-testid="loading">Loading{inline ? ' inline' : ''}</div>
}));

// Mock react-icons
vi.mock('react-icons/hi', () => ({
  HiUpload: () => <span data-testid="upload-icon">Upload</span>,
  HiX: () => <span data-testid="x-icon">X</span>,
  HiPencil: () => <span data-testid="pencil-icon">Edit</span>,
  HiCheck: () => <span data-testid="check-icon">Check</span>
}));

import { userApi } from '../../../api/user';

describe('ProfileSettings', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    user: { email: 'test@example.com' },
    profile: { username: 'testuser', avatar_url: null },
    refreshProfile: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<ProfileSettings {...defaultProps} isOpen={false} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('renders profile settings modal when open', () => {
    render(<ProfileSettings {...defaultProps} />);
    
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
  });

  it('displays close button', () => {
    render(<ProfileSettings {...defaultProps} />);
    
    expect(screen.getByLabelText('Close settings')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = vi.fn();
    
    render(<ProfileSettings {...defaultProps} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByLabelText('Close settings'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('displays user email', () => {
    render(<ProfileSettings {...defaultProps} />);
    
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('displays username', () => {
    render(<ProfileSettings {...defaultProps} />);
    
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('displays "Not set" when username is not provided', () => {
    const propsWithoutUsername = {
      ...defaultProps,
      profile: { avatar_url: null }
    };
    
    render(<ProfileSettings {...propsWithoutUsername} />);
    
    expect(screen.getByText('Not set')).toBeInTheDocument();
  });

  it('displays avatar when avatar_url is provided', () => {
    const propsWithAvatar = {
      ...defaultProps,
      profile: { username: 'testuser', avatar_url: 'https://example.com/avatar.jpg' }
    };
    
    render(<ProfileSettings {...propsWithAvatar} />);
    
    const avatar = screen.getByAltText('User avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar.src).toBe('https://example.com/avatar.jpg');
  });

  it('displays initial when no avatar', () => {
    render(<ProfileSettings {...defaultProps} />);
    
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('shows edit button for username', () => {
    render(<ProfileSettings {...defaultProps} />);
    
    expect(screen.getByLabelText('Edit username')).toBeInTheDocument();
  });

  it('enters edit mode when edit button is clicked', () => {
    render(<ProfileSettings {...defaultProps} />);
    
    fireEvent.click(screen.getByLabelText('Edit username'));
    
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    expect(screen.getByLabelText('Save username')).toBeInTheDocument();
    expect(screen.getByLabelText('Cancel edit')).toBeInTheDocument();
  });

  it('populates input with current username when editing', () => {
    render(<ProfileSettings {...defaultProps} />);
    
    fireEvent.click(screen.getByLabelText('Edit username'));
    
    const input = screen.getByPlaceholderText('Enter username');
    expect(input.value).toBe('testuser');
  });

  it('updates input value as user types', () => {
    render(<ProfileSettings {...defaultProps} />);
    
    fireEvent.click(screen.getByLabelText('Edit username'));
    
    const input = screen.getByPlaceholderText('Enter username');
    fireEvent.change(input, { target: { value: 'newusername' } });
    
    expect(input.value).toBe('newusername');
  });

  it('cancels edit when cancel button is clicked', () => {
    render(<ProfileSettings {...defaultProps} />);
    
    fireEvent.click(screen.getByLabelText('Edit username'));
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { 
      target: { value: 'newusername' } 
    });
    fireEvent.click(screen.getByLabelText('Cancel edit'));
    
    expect(screen.queryByPlaceholderText('Enter username')).not.toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('saves username successfully', async () => {
    userApi.updateProfile.mockResolvedValue({ data: {}, error: null });
    const mockRefreshProfile = vi.fn();
    
    render(<ProfileSettings {...defaultProps} refreshProfile={mockRefreshProfile} />);
    
    fireEvent.click(screen.getByLabelText('Edit username'));
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { 
      target: { value: 'newusername' } 
    });
    fireEvent.click(screen.getByLabelText('Save username'));
    
    await waitFor(() => {
      expect(userApi.updateProfile).toHaveBeenCalledWith({ username: 'newusername' });
      expect(mockRefreshProfile).toHaveBeenCalled();
    });
  });

  it('displays success message after username update', async () => {
    userApi.updateProfile.mockResolvedValue({ data: {}, error: null });
    
    render(<ProfileSettings {...defaultProps} />);
    
    fireEvent.click(screen.getByLabelText('Edit username'));
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { 
      target: { value: 'newusername' } 
    });
    fireEvent.click(screen.getByLabelText('Save username'));
    
    await waitFor(() => {
      expect(screen.getByText('Username updated successfully')).toBeInTheDocument();
    });
  });

  it('displays error when username is empty', async () => {
    render(<ProfileSettings {...defaultProps} />);
    
    fireEvent.click(screen.getByLabelText('Edit username'));
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { 
      target: { value: '' } 
    });
    fireEvent.click(screen.getByLabelText('Save username'));
    
    await waitFor(() => {
      expect(screen.getByText('Username cannot be empty')).toBeInTheDocument();
    });
  });

  it('displays validation error for invalid username', async () => {
    render(<ProfileSettings {...defaultProps} />);
    
    fireEvent.click(screen.getByLabelText('Edit username'));
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { 
      target: { value: 'ab' } 
    });
    fireEvent.click(screen.getByLabelText('Save username'));
    
    await waitFor(() => {
      expect(screen.getByText('Username must be at least 3 characters')).toBeInTheDocument();
    });
  });

  it('displays error when username is already taken', async () => {
    userApi.updateProfile.mockResolvedValue({ 
      error: 'duplicate key value violates unique constraint' 
    });
    
    render(<ProfileSettings {...defaultProps} />);
    
    fireEvent.click(screen.getByLabelText('Edit username'));
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { 
      target: { value: 'taken' } 
    });
    fireEvent.click(screen.getByLabelText('Save username'));
    
    await waitFor(() => {
      expect(screen.getByText('Username is already taken')).toBeInTheDocument();
    });
  });

  it('does not save if username is unchanged', async () => {
    render(<ProfileSettings {...defaultProps} />);
    
    fireEvent.click(screen.getByLabelText('Edit username'));
    // Don't change the username
    fireEvent.click(screen.getByLabelText('Save username'));
    
    expect(userApi.updateProfile).not.toHaveBeenCalled();
  });

  it('triggers file input when avatar is clicked', () => {
    render(<ProfileSettings {...defaultProps} />);
    
    const fileInput = document.querySelector('input[type="file"]');
    const clickSpy = vi.spyOn(fileInput, 'click');
    
    const avatar = screen.getByText('T').closest('.avatar-upload');
    fireEvent.click(avatar);
    
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('uploads avatar successfully', async () => {
    userApi.uploadAvatar.mockResolvedValue({ data: {}, error: null });
    const mockRefreshProfile = vi.fn();
    
    render(<ProfileSettings {...defaultProps} refreshProfile={mockRefreshProfile} />);
    
    const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]');
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(userApi.uploadAvatar).toHaveBeenCalledWith(file);
      expect(mockRefreshProfile).toHaveBeenCalled();
    });
  });

  it('displays success message after avatar upload', async () => {
    userApi.uploadAvatar.mockResolvedValue({ data: {}, error: null });
    
    render(<ProfileSettings {...defaultProps} />);
    
    const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]');
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText('Avatar uploaded successfully')).toBeInTheDocument();
    });
  });

  it('displays error message on avatar upload failure', async () => {
    userApi.uploadAvatar.mockResolvedValue({ error: 'Upload failed' });
    
    render(<ProfileSettings {...defaultProps} />);
    
    const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]');
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to upload avatar/)).toBeInTheDocument();
    });
  });

  it('shows loading overlay while uploading avatar', async () => {
    userApi.uploadAvatar.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ data: {} }), 100))
    );
    
    render(<ProfileSettings {...defaultProps} />);
    
    const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]');
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  it('disables username input while updating', async () => {
    userApi.updateProfile.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ data: {} }), 100))
    );
    
    render(<ProfileSettings {...defaultProps} />);
    
    fireEvent.click(screen.getByLabelText('Edit username'));
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { 
      target: { value: 'newusername' } 
    });
    fireEvent.click(screen.getByLabelText('Save username'));
    
    const input = screen.getByPlaceholderText('Enter username');
    expect(input).toBeDisabled();
    
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
  });
});
