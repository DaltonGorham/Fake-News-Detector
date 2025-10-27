import { useState, useRef, useEffect } from 'react';
import { HiUpload, HiX } from 'react-icons/hi';
import { userApi } from '../../../api/user';
import Loading from '../../common/Loading';
import './styles.css';

export default function ProfileSettings({ isOpen, onClose, user, profile, refreshProfile }) {
  const [isUploading, setIsUploading] = useState(false);
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
            <div className="info-item">
              <label>Email</label>
              <span>{user?.email}</span>
              <label>Username</label>
              <span>{profile?.username || 'Not set'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}