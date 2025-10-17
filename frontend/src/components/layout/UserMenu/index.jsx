import { useRef, useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { HiOutlineUser, HiOutlineLogout } from 'react-icons/hi';
import ProfileSettings from '../ProfileSettings';
import './styles.css';

export default function UserMenu({ isOpen, onClose }) {
  const menuRef = useRef(null);
  const { user, signOut } = useAuth();
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
          {user?.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="User avatar" />
          ) : (
            user?.email?.[0]?.toUpperCase() || '?'
          )}
        </div>
        <div className="user-info">
          <div className="user-email">{user?.email}</div>
        </div>
      </div>
      
      <div className="user-menu-items">
        <button className="menu-item" onClick={() => setIsProfileOpen(true)}>
          <HiOutlineUser size={20} />
          Profile Settings
        </button>
        
        <button className="menu-item" onClick={signOut}>
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