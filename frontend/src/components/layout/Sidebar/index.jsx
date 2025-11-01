import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useProfile } from '../../../hooks/useProfile';
import UserMenu from '../UserMenu';
import HistoryPanel from './HistoryPanel';
import UserButton from './UserButton';
import { HiX, HiMenu } from 'react-icons/hi';
import './styles.css';
  
export default function Sidebar({ history, isLoading, error, onHistoryChange }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { profile, refreshProfile } = useProfile();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const closeUserMenu = () => setIsUserMenuOpen(false);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button 
        className="sidebar-toggle" 
        onClick={toggleSidebar}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      <div className="sidebar-content">
        <HistoryPanel 
          history={history}
          isLoading={isLoading}
          error={error}
          onHistoryChange={onHistoryChange}
        />
      </div>

      <div className="sidebar-footer">
        <UserButton 
          profile={profile}
          user={user}
          onClick={toggleUserMenu}
        />
        <UserMenu 
          isOpen={isUserMenuOpen} 
          onClose={closeUserMenu}
          user={user}
          profile={profile}
          logout={logout}
          refreshProfile={refreshProfile}
        />
      </div>
    </div>
  );
}