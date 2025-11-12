import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileSettings from './index';


const mockUseAvatarUpload = vi.fn();
const mockUseUsernameEdit = vi.fn();
const mockUsePasswordChange = vi.fn();
const mockUseAccountDeletion = vi.fn();


vi.mock('../../../hooks/user/useAvatarUpload', () => ({
  useAvatarUpload: () => mockUseAvatarUpload()
}));

vi.mock('../../../hooks/user/useUsernameEdit', () => ({
  useUsernameEdit: () => mockUseUsernameEdit()
}));

vi.mock('../../../hooks/user/usePasswordChange', () => ({
  usePasswordChange: () => mockUsePasswordChange()
}));

vi.mock('../../../hooks/user/useAccountDeletion', () => ({
  useAccountDeletion: () => mockUseAccountDeletion()
}));


vi.mock('../../common/Loading', () => ({
  default: ({ inline }) => <div data-testid="loading">Loading{inline ? ' inline' : ''}</div>
}));


vi.mock('../../common/PasswordInput', () => ({
  default: ({ value, onChange, placeholder, disabled }) => (
    <input
      type="password"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      data-testid="password-input"
    />
  )
}));


vi.mock('../../common/ConfirmModal', () => ({
  default: ({ isOpen, onConfirm, onCancel, message }) => 
    isOpen ? (
      <div data-testid="confirm-modal">
        <p>{message}</p>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null
}));


vi.mock('../../common/ConfirmModal', () => ({
  default: ({ isOpen, onConfirm, onCancel, message }) => 
    isOpen ? (
      <div data-testid="confirm-modal">
        <p>{message}</p>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null
}));


vi.mock('react-icons/hi', () => ({
  HiUpload: () => <span data-testid="upload-icon">Upload</span>,
  HiX: () => <span data-testid="x-icon">X</span>,
  HiPencil: () => <span data-testid="pencil-icon">Edit</span>,
  HiCheck: () => <span data-testid="check-icon">Check</span>,
  HiLockClosed: () => <span data-testid="lock-icon">Lock</span>,
  HiTrash: () => <span data-testid="trash-icon">Trash</span>
}));

describe('ProfileSettings', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    user: { email: 'test@example.com' },
    profile: { username: 'testuser', avatar_url: null },
    refreshProfile: vi.fn()
  };


  const defaultAvatarMock = {
    isUploading: false,
    message: '',
    uploadAvatar: vi.fn()
  };

  const defaultUsernameMock = {
    isEditing: false,
    value: 'testuser',
    error: '',
    success: '',
    isLoading: false,
    setValue: vi.fn(),
    startEdit: vi.fn(),
    cancelEdit: vi.fn(),
    saveUsername: vi.fn()
  };

  const defaultPasswordMock = {
    isChangingPassword: false,
    newPassword: '',
    confirmPassword: '',
    error: '',
    success: '',
    isLoading: false,
    startChange: vi.fn(),
    cancelChange: vi.fn(),
    setNewPassword: vi.fn(),
    setConfirmPassword: vi.fn(),
    savePassword: vi.fn()
  };

  const defaultAccountDeletionMock = {
    showConfirm: false,
    isDeleting: false,
    requestDeletion: vi.fn(),
    cancelDeletion: vi.fn(),
    confirmDeletion: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseAvatarUpload.mockReturnValue(defaultAvatarMock);
    mockUseUsernameEdit.mockReturnValue(defaultUsernameMock);
    mockUsePasswordChange.mockReturnValue(defaultPasswordMock);
    mockUseAccountDeletion.mockReturnValue(defaultAccountDeletionMock);
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<ProfileSettings {...defaultProps} isOpen={false} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('renders profile settings modal when open', () => {
    render(<ProfileSettings {...defaultProps} />);
    
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('testuser')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = vi.fn();
    
    render(<ProfileSettings {...defaultProps} onClose={mockOnClose} />);
    
    fireEvent.click(screen.getByLabelText('Close settings'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
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

  it('shows username edit form when editing', () => {
    mockUseUsernameEdit.mockReturnValue({
      ...defaultUsernameMock,
      isEditing: true
    });

    render(<ProfileSettings {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  it('shows password change form when changing password', () => {
    mockUsePasswordChange.mockReturnValue({
      ...defaultPasswordMock,
      isChangingPassword: true
    });

    render(<ProfileSettings {...defaultProps} />);
    
    expect(screen.getByText('New Password')).toBeInTheDocument();
    expect(screen.getByText('Confirm Password')).toBeInTheDocument();
  });

  it('shows confirm modal when deleting account', () => {
    mockUseAccountDeletion.mockReturnValue({
      ...defaultAccountDeletionMock,
      showConfirm: true
    });

    render(<ProfileSettings {...defaultProps} />);
    
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
  });

  it('shows loading overlay while uploading avatar', () => {
    mockUseAvatarUpload.mockReturnValue({
      ...defaultAvatarMock,
      isUploading: true
    });

    render(<ProfileSettings {...defaultProps} />);
    
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('passes file to uploadAvatar when file is selected', () => {
    const mockUploadAvatar = vi.fn();
    mockUseAvatarUpload.mockReturnValue({
      ...defaultAvatarMock,
      uploadAvatar: mockUploadAvatar
    });

    render(<ProfileSettings {...defaultProps} />);
    
    const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]');
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(mockUploadAvatar).toHaveBeenCalledWith(file);
  });
});
