import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useProfile } from '../../../hooks/useProfile';
import UserMenu from '../UserMenu';
import { 
  HiX, 
  HiMenu, 
  HiPlus 
} from 'react-icons/hi';
import './styles.css';
  
export default function Sidebar({ history, isLoading, error }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { profile, refreshProfile } = useProfile();

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
        <div className="history-header">
          <h2>History</h2>
        </div>
        
        {error ? (
          <div className="history-error">
            Failed to load history. Please try again.
          </div>
        ) : isLoading ? (
          <div className="history-loading">
            <div className="loading-spinner" />
            Loading history...
          </div>
        ) : history.length === 0 ? (
          <div className="history-empty">
            No articles checked yet.
          </div>
        ) : (
          <div className="history-list">
            {history.map(item => {
              const aiResult = item.article?.ai_result?.[0]; // hacky fix because backend returns array
              if (!aiResult) return null;
              return ( // only need this return because of the aiResult var
                <button 
                  key={item.id} 
                  className={`history-item ${aiResult?.truthness_label.toLowerCase()}`}
                  onClick={() => {
                    // TODO: Navigate to article details or reopen for editing
                    console.log('Open article:', item.article.id);
                  }}
                >
                  <div className="history-details">
                    <div className="history-title">{item.article.title}</div>
                    <div className="history-meta">
                      <div className="history-info">
                        <span className="history-date">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <span className="history-source">
                          {item.article.source}
                        </span>
                      </div>
                      <div className="history-result">
                        <span className="history-label">
                          {aiResult?.truthness_label.toLowerCase()}
                        </span>
                        <span className="history-score">
                          {(aiResult?.truthness_score * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
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
        <UserMenu 
          isOpen={isUserMenuOpen} 
          onClose={() => setIsUserMenuOpen(false)} 
          user={user}
          profile={profile}
          logout={logout}
          refreshProfile={refreshProfile}
        />
      </div>
    </div>
  );
}