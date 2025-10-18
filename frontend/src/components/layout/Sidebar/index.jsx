import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useProfile } from '../../../hooks/useProfile';
import UserMenu from '../UserMenu';
import { HiX, HiMenu, HiPlus } from 'react-icons/hi';
import './styles.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user } = useAuth();
  const { profile, isLoading } = useProfile();

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button 
        className="sidebar-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      <div className="sidebar-header">
        <button className="new-article-button">
          <HiPlus size={16} />
          New Article
        </button>
      </div>

      <div className="sidebar-content">
        <div className="history-list">
          {/* History items will go here */}
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="user-button"
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        >
          <div className="user-avatar">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="User avatar" />
            ) : (
              (profile?.username?.[0] || user?.email?.[0] || '?').toUpperCase()
            )}
          </div>
          <span className={`username ${
            profile?.username 
              ? profile.username.length <= 12 
                ? 'username-short'
                : profile.username.length >= 20 
                  ? 'username-long' 
                  : ''
              : ''
          }`}>
            {profile?.username || 'Your Account'}
          </span>
        </button>
        <UserMenu isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} />
      </div>
    </div>
  );
}