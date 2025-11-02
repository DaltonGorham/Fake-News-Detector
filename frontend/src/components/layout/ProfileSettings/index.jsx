import { useState, useRef, useEffect } from 'react';
import { HiUpload, HiX, HiPencil, HiCheck } from 'react-icons/hi';
import { userApi } from '../../../api/user';
import { validateUsername } from '../../../util/validator';
import Loading from '../../common/Loading';
import './styles.css';

export default function ProfileSettings({ isOpen, onClose, user, profile, refreshProfile }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameSuccess, setUsernameSuccess] = useState('');
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadMessage, setUploadMessage] = useState('');

  if (!isOpen) return null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      
      const { data, error } = await userApi.uploadAvatar(file);

      if (error) throw new Error(error);
      
      await refreshProfile();
      setUploadMessage('Avatar uploaded successfully');
    } catch (error) {
      setUploadMessage(`Failed to upload avatar: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditUsername = () => {
    setNewUsername(profile?.username || '');
    setUsernameError('');
    setUsernameSuccess('');
    setIsEditingUsername(true);
  };

  const handleCancelEdit = () => {
    setIsEditingUsername(false);
    setNewUsername('');
    setUsernameError('');
    setUsernameSuccess('');
  };

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      setUsernameError('Username cannot be empty');
      return;
    }

    try {
      validateUsername(newUsername.trim());
    } catch (error) {
      setUsernameError(error.message);
      return;
    }

    if (newUsername.trim() === profile?.username) {
      setIsEditingUsername(false);
      return;
    }

    setIsUpdatingUsername(true);
    setUsernameError('');
    setUsernameSuccess('');

    try {
      const { error } = await userApi.updateProfile({ username: newUsername.trim() });
      
      if (error) throw new Error(error);
      
      await refreshProfile();
      setIsEditingUsername(false);
      setUsernameSuccess('Username updated successfully');
      setTimeout(() => setUsernameSuccess(''), 3000);
    } catch (error) {
      const errorMessage = error.message.toLowerCase();
      if (errorMessage.includes('duplicate') || 
          errorMessage.includes('unique') || 
          errorMessage.includes('already taken') ||
          errorMessage.includes('database error')) {
        setUsernameError('Username is already taken');
      } else {
        setUsernameError(`Failed to update username: ${error.message}`);
      }
    } finally {
      setIsUpdatingUsername(false);
    }
  };

  return (
    <div className="profile-settings-overlay">
      {isUploading && (
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
            <span className="upload-message">{uploadMessage}</span>
          </div>

          <div className="profile-info">
            <div className="profile-info-item">
              <label>Email</label>
              <span>{user?.email}</span>
            </div>
            
            <div className="profile-info-item">
              <label>Username</label>
              {isEditingUsername ? (
                <div className="username-edit-container">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="username-input"
                    placeholder="Enter username"
                    disabled={isUpdatingUsername}
                    autoFocus
                  />
                  <div className="username-edit-buttons">
                    <button
                      onClick={handleSaveUsername}
                      className="username-save-button"
                      disabled={isUpdatingUsername}
                      aria-label="Save username"
                    >
                      {isUpdatingUsername ? <Loading inline /> : <HiCheck size={18} />}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="username-cancel-button"
                      disabled={isUpdatingUsername}
                      aria-label="Cancel edit"
                    >
                      <HiX size={18} />
                    </button>
                  </div>
                  {usernameError && (
                    <span className="username-error">{usernameError}</span>
                  )}
                </div>
              ) : (
                <div className="username-display">
                  <span>{profile?.username || 'Not set'}</span>
                  <button
                    onClick={handleEditUsername}
                    className="username-edit-button"
                    aria-label="Edit username"
                  >
                    <HiPencil size={16} />
                  </button>
                </div>
              )}
              {usernameSuccess && (
                <span className="username-success">{usernameSuccess}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}