import { useState } from 'react';
import '../styles/Sidebar.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button 
        className="sidebar-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {isOpen ? (
            // X icon for closing
            <>
                <path d="M18 6L6 18" />
                <path d="M6 6L18 18" />
            </>
            ) : (
            // Hamburger menu icon for opening
            <>
                <path d="M3 12h18" />
                <path d="M3 6h18" />
                <path d="M3 18h18" />
            </>
            )}
        </svg>
      </button>

      <div className="sidebar-header">
        <button className="new-article-button">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Article
        </button>
      </div>

      <div className="sidebar-content">
        <div className="history-list">
          {/* History items will go here */}
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="user-button">
          <div className="user-avatar">D</div>
          <span>Your Account</span>
        </button>
      </div>
    </div>
  );
}