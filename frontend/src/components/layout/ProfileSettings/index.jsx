import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { HiUpload, HiX } from 'react-icons/hi';
import { userApi } from '../../../api/user';
import './styles.css';

export default function ProfileSettings({ isOpen, onClose }) {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      console.log('Uploading file:', file);
      error = "This is a test error";
     // const { data, error } = await userApi.uploadAvatar(file);
     // if (error) throw error;

    } catch (error) {
   //   console.error('Error:', error.message);
      // TODO: Show error message to user
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="profile-settings-overlay">
      <div className="profile-settings-modal">
        <button className="close-button" onClick={onClose} aria-label="Close settings">
          <HiX size={20} />
        </button>

        <div className="profile-settings-content">
          <h2>Profile Settings</h2>
          
          <div className="avatar-section">
            <div className="avatar-upload" onClick={handleAvatarClick}>
              <div className="avatar-preview">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="User avatar" />
                ) : (
                  <span className="avatar-placeholder">
                    {user?.email?.[0]?.toUpperCase() || ''}
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
              {isUploading ? 'Uploading...' : 'Click to upload avatar'}
            </span>
          </div>

          <div className="profile-info">
            <div className="info-item">
              <label>Email</label>
              <span>{user?.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}