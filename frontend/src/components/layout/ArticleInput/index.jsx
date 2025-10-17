import React from 'react';
import { useArticleSubmission } from '../../../hooks/article/useArticleSubmission';
import { HiArrowRight } from 'react-icons/hi';
import './styles.css';

export default function ArticleInput() {
  const { url, setUrl, handleSubmit } = useArticleSubmission();

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
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
            placeholder=""
          />
          
          <button 
            className="article-submit-button"
            onClick={handleSubmit}
            aria-label="Submit URL"
          >
            <HiArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}