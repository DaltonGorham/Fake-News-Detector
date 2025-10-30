import { useState, useMemo, useRef } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useProfile } from '../../../hooks/useProfile';
import { useKeyboardShortcuts } from '../../../hooks/useKeyboardShortcuts';
import { articleApi } from '../../../api/articles';
import UserMenu from '../UserMenu';
import ArticleDetails from '../ArticleDetails';
import ConfirmModal from '../../common/ConfirmModal';
import Loading from '../../common/Loading';
import { 
  HiX, 
  HiMenu, 
  HiSearch,
  HiFilter,
  HiTrash
} from 'react-icons/hi';
import './styles.css';
  
export default function Sidebar({ history, isLoading, error, onHistoryChange }) {
  /*
    TODO:
    This a lotttt of state here. Perhaps we break this into another component?
    Its easy to find all right here but this is just confusing and hard
    debug if something goes wrong
  */
  const [isOpen, setIsOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [isArticleDetailsOpen, setIsArticleDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLabel, setFilterLabel] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isClearing, setIsClearing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearError, setClearError] = useState(null);
  const { user, logout } = useAuth();
  const { profile, refreshProfile } = useProfile();
  const searchInputRef = useRef(null);

  useKeyboardShortcuts({
    'ctrl+k': () => {
      searchInputRef.current?.focus();
    }
  });

  // using usememo doesnt run the filtering on every render. 
  const filteredHistory = useMemo(() => {
    let filtered = [...history];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        const title = item.article?.title?.toLowerCase() || '';
        const source = item.article?.source?.toLowerCase() || '';
        const url = item.article?.url?.toLowerCase() || '';
        return title.includes(query) || source.includes(query) || url.includes(query);
      });
    }

    if (filterLabel !== 'all') {
      filtered = filtered.filter(item => {
        const aiResult = item.article?.ai_result?.[0];
        const label = aiResult?.truthness_label?.toLowerCase() || '';
        if (filterLabel === 'reliable') {
          return label.includes('reliable') && !label.includes('unreliable');
        } else if (filterLabel === 'unreliable') {
          return label.includes('unreliable');
        }
        return true;
      });
    }

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === 'score') {
        const scoreA = a.article?.ai_result?.[0]?.truthness_score || 0;
        const scoreB = b.article?.ai_result?.[0]?.truthness_score || 0;
        return scoreB - scoreA;
      }
      return 0;
    });

    return filtered;
  }, [history, searchQuery, filterLabel, sortBy]);

  const handleArticleClick = (articleId) => {
    setSelectedArticleId(articleId);
    setIsArticleDetailsOpen(true);
  };

  const handleCloseArticleDetails = () => {
    setIsArticleDetailsOpen(false);
    setSelectedArticleId(null);
  };

  const handleClearHistoryClick = () => {
    setShowClearConfirm(true);
  };

  const handleConfirmClearHistory = async () => {
    setShowClearConfirm(false);
    setIsClearing(true);
    setClearError(null);
    try {
      const { error } = await articleApi.clearHistory();
      if (error) {
        setClearError(error);
      } else {
        // Refresh the history to show empty state
        onHistoryChange?.();
      }
    } catch (err) {
      setClearError(err.message);
    } finally {
      setIsClearing(false);
    }
  };

  const handleCancelClearHistory = () => {
    setShowClearConfirm(false);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button 
        className="sidebar-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      <div className="sidebar-content">
        <div className="history-header">
          <h2>History</h2>
          {history.length > 0 && (
            <button
              className="clear-history-button"
              onClick={handleClearHistoryClick}
              disabled={isClearing}
              title="Clear all history"
            >
              <HiTrash size={14} />
              <span>Clear History</span>
            </button>
          )}
        </div>

        <div className="history-controls">
          <div className="search-box">
            <HiSearch className="search-icon" size={18} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search articles... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <HiX size={16} />
              </button>
            )}
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <HiFilter size={16} />
              <select 
                value={filterLabel} 
                onChange={(e) => setFilterLabel(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Articles</option>
                <option value="reliable">Reliable</option>
                <option value="unreliable">Unreliable</option>
              </select>
            </div>

            <div className="sort-group">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="date">Latest First</option>
                <option value="score">Highest Score</option>
              </select>
            </div>
          </div>
        </div>
        
        {clearError && (
          <div className="clear-error-message">
            Failed to clear history: {clearError}
          </div>
        )}
        
        {error ? (
          <div className="history-error">
            {error}
          </div>
        ) : isLoading ? (
          <Loading inline />
        ) : filteredHistory.length === 0 ? (
          <div className="history-empty">
            {searchQuery || filterLabel !== 'all' 
              ? 'No articles match your filters.'
              : 'No articles checked yet.'}
          </div>
        ) : (
          <div className="history-list">
            {filteredHistory.map((item, index) => {
              const aiResult = item.article?.ai_result?.[0];
              if (!aiResult) return null;
              return (
                <button 
                  key={item.id} 
                  className={`history-item ${aiResult?.truthness_label.toLowerCase()}`}
                  onClick={() => handleArticleClick(item.article.id)}
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

      <ArticleDetails 
        articleId={selectedArticleId}
        isOpen={isArticleDetailsOpen}
        onClose={handleCloseArticleDetails}
      />

      <ConfirmModal
        isOpen={showClearConfirm}
        title="Clear History"
        message="Are you sure you want to clear all your article history? This action cannot be undone."
        confirmText="Clear History"
        cancelText="Cancel"
        onConfirm={handleConfirmClearHistory}
        onCancel={handleCancelClearHistory}
        isDangerous={true}
      />
    </div>
  );
}