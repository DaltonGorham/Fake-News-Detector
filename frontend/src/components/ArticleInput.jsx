import React, { useState } from 'react';
import '../styles/ArticleInput.css';

export default function ArticleInput() {
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    if (url.trim()) {
      console.log('Submitted URL:', url);
      // we will add functionality here later
    }
  };

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
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}