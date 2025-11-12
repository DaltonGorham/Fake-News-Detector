import React from 'react';
import { useArticleSubmission } from '../../../hooks/article/useArticleSubmission';
import { HiArrowRight } from 'react-icons/hi';
import AnalyzingAnimation from '../../common/AnalyzingAnimation';
import { useAuth } from '../../../hooks/auth/useAuth';
import { useProfile } from '../../../hooks/user/useProfile';
import { useWelcomeMessage } from '../../../hooks/ui/useWelcomeMessage';
import './styles.css';

export default function ArticleInput({ onArticleSubmitted, history = [] }) {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { showWelcome, welcomeText, hideWelcome } = useWelcomeMessage(user);
  
  const { url, setUrl, loading, error, handleSubmit } = useArticleSubmission(() => {
    onArticleSubmitted();
    // Hide welcome message after first submission
    hideWelcome();
  }, history);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="article-input-container">
      <div className="article-input-content">
        {loading ? (
          <AnalyzingAnimation />
        ) : (
          <>
            {showWelcome && user && profile?.username && (
              <div className="welcome-message">
                {welcomeText}, {profile.username}!
              </div>
            )}
            
            <label className="article-input-label">
              Paste your article's url below:
            </label>
            
            <div className="article-input-wrapper">
              <input
                type="text"
                className="article-url-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter a URL to analyze"
                disabled={loading}
              />
              
              <button 
                className={`article-submit-button ${loading ? 'loading' : ''}`}
                onClick={handleSubmit}
                disabled={loading}
                aria-label="Submit URL"
              >
                <HiArrowRight size={20} />
              </button>
            </div>
          </>
        )}
        
        {error && (
          <div className="article-input-error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}