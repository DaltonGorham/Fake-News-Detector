import { useRef, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useProfile } from '../../../hooks/useProfile';
import { HiOutlineUser, HiOutlineLogout } from 'react-icons/hi';
import ProfileSettings from '../ProfileSettings';
import './styles.css';

export default function UserMenu({ isOpen, onClose }) {
  const menuRef = useRef(null);
  const { user, logout } = useAuth();
  const { profile } = useProfile();
  const [isProfileOpen, setIsProfileOpen] = useState(false);



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="user-menu" ref={menuRef}>
      <div className="user-menu-header">
        <div className="user-avatar-large">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="User avatar" />
          ) : (
            (profile?.username?.[0] || user?.email?.[0] || '?').toUpperCase()
          )}
        </div>
        <div className="user-info">
          {profile?.username && <div className="user-name">{profile.username}</div>}
          <div className="user-email">{user?.email}</div>
        </div>
      </div>
      
      <div className="user-menu-items">
        <button className="menu-item" onClick={() => setIsProfileOpen(true)}>
          <HiOutlineUser size={20} />
          Profile Settings
        </button>
        
        <button className="menu-item" onClick={() => {
          logout();
          onClose();
        }}>
          <HiOutlineLogout size={20} />
          Log Out
        </button>
      </div>

      <ProfileSettings 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}