import { useState, useEffect } from 'react';

export default function PacmanAnimation({ stages, currentStage }) {
  return (
    <>
      <div className="pacman-container">
        <div className="pacman-wrapper">
          <div className="pacman">
            <div className="pacman-top"></div>
            <div className="pacman-bottom"></div>
          </div>
        </div>

        <div 
          className="pellets" 
          style={{ '--eaten': currentStage }}
        >
          {Array.from({ length: stages.length }).map((_, index) => (
            <div
              key={index}
              className={`pellet ${index <= currentStage ? 'eaten' : ''}`}
              style={{ display: index === 0 ? 'none' : 'block' }}
            />
          ))}
        </div>
      </div>
      
      <div className="stage-text">{stages[currentStage].text}</div>
    </>
  );
}
