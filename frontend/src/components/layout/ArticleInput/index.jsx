import React from 'react';
import { useArticleSubmission } from '../../../hooks/article/useArticleSubmission';
import { HiArrowRight } from 'react-icons/hi';
import './styles.css';

export default function ArticleInput({ onArticleSubmitted }) {
  const { url, setUrl, loading, error, handleSubmit } = useArticleSubmission(() => {
    onArticleSubmitted();
  });

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="article-input-container">
      <div className="article-input-content">
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
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <HiArrowRight size={20} />
            )}
          </button>
        </div>
        
        {error && (
          <div className="article-input-error">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}