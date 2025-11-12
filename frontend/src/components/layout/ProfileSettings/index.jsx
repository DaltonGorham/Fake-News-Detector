import { useRef } from 'react';
import { HiUpload, HiX, HiPencil, HiCheck, HiTrash, HiLockClosed } from 'react-icons/hi';
import Loading from '../../common/Loading';
import ConfirmModal from '../../common/ConfirmModal';
import PasswordInput from '../../common/PasswordInput';
import { useAvatarUpload } from '../../../hooks/user/useAvatarUpload';
import { useUsernameEdit } from '../../../hooks/user/useUsernameEdit';
import { usePasswordChange } from '../../../hooks/user/usePasswordChange';
import { useAccountDeletion } from '../../../hooks/user/useAccountDeletion';
import './styles.css';

export default function ProfileSettings({ isOpen, onClose, user, profile, refreshProfile }) {
  const fileInputRef = useRef(null);
  
  const avatar = useAvatarUpload(refreshProfile);
  const username = useUsernameEdit(profile?.username, refreshProfile);
  const password = usePasswordChange();
  const accountDeletion = useAccountDeletion();

  if (!isOpen) return null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    await avatar.uploadAvatar(file);
  };

  return (
    <div className="profile-settings-overlay">
      {(avatar.isUploading || accountDeletion.isDeleting) && (
        <div className="upload-loading-overlay">
          <Loading inline />
        </div>
      )}
      <div className="profile-settings-modal">
        <button className="close-button" onClick={onClose} aria-label="Close settings">
          <HiX size={20} />
        </button>

        <div className="profile-settings-content">
          <h2>Profile Settings</h2>
          
          <div className="avatar-section">
            <div className="avatar-upload" onClick={handleAvatarClick}>
              <div className="avatar-preview">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="User avatar" />
                ) : (
                  <span className="avatar-placeholder">
                    {(profile?.username?.[0] || user?.email?.[0] || '').toUpperCase()}
                  </span>
                )}
                <div className="upload-overlay">
                  <HiUpload size={20} />
                </div>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <span className="upload-text">
              Click to upload avatar
            </span>
            <span className="upload-message">{avatar.message}</span>
          </div>

          <div className="profile-info">
            <div className="profile-info-item">
              <label>Email</label>
              <span>{user?.email}</span>
            </div>
            
            <div className="profile-info-item">
              <label>Username</label>
              {username.isEditing ? (
                <div className="username-edit-container">
                  <input
                    type="text"
                    value={username.value}
                    onChange={(e) => username.setValue(e.target.value)}
                    className="username-input"
                    placeholder="Enter username"
                    disabled={username.isLoading}
                    autoFocus
                  />
                  <div className="username-edit-buttons">
                    <button
                      onClick={username.saveUsername}
                      className="username-save-button"
                      disabled={username.isLoading}
                      aria-label="Save username"
                    >
                      {username.isLoading ? <Loading inline /> : <HiCheck size={18} />}
                    </button>
                    <button
                      onClick={username.cancelEdit}
                      className="username-cancel-button"
                      disabled={username.isLoading}
                      aria-label="Cancel edit"
                    >
                      <HiX size={18} />
                    </button>
                  </div>
                  {username.error && (
                    <span className="username-error">{username.error}</span>
                  )}
                </div>
              ) : (
                <div className="username-display">
                  <span>{profile?.username || 'Not set'}</span>
                  <button
                    onClick={username.startEdit}
                    className="username-edit-button"
                    aria-label="Edit username"
                  >
                    <HiPencil size={16} />
                  </button>
                </div>
              )}
              {username.success && (
                <span className="username-success">{username.success}</span>
              )}
            </div>
          </div>

          <div className="account-actions">
            {password.isChangingPassword ? (
              <div className="password-change-form">
                <div className="password-input-group">
                  <label>New Password</label>
                  <PasswordInput
                    name="newPassword"
                    value={password.newPassword}
                    onChange={(e) => password.setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    disabled={password.isLoading}
                    showStrength={true}
                  />
                </div>
                <div className="password-input-group">
                  <label>Confirm Password</label>
                  <PasswordInput
                    name="confirmPassword"
                    value={password.confirmPassword}
                    onChange={(e) => password.setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    disabled={password.isLoading}
                  />
                </div>
                {password.error && (
                  <span className="password-error">{password.error}</span>
                )}
                <div className="password-buttons">
                  <button
                    onClick={password.savePassword}
                    className="password-save-button"
                    disabled={password.isLoading}
                  >
                    {password.isLoading ? <Loading inline /> : 'Update Password'}
                  </button>
                  <button
                    onClick={password.cancelChange}
                    className="password-cancel-button"
                    disabled={password.isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={password.startChange}
                  className="change-password-button"
                >
                  <HiLockClosed size={18} />
                  Change Password
                </button>
                {password.success && (
                  <span className="password-success">{password.success}</span>
                )}
              </>
            )}

            <button
              onClick={accountDeletion.requestDeletion}
              className="delete-account-button"
              disabled={accountDeletion.isDeleting}
            >
              <HiTrash size={18} />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {accountDeletion.showConfirm && (
        <ConfirmModal
          isOpen={accountDeletion.showConfirm}
          onCancel={accountDeletion.cancelDeletion}
          onConfirm={accountDeletion.confirmDeletion}
          title="Delete Account"
          message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted."
          confirmText="Delete Account"
          isDangerous={true}
        />
      )}
    </div>
  );
}