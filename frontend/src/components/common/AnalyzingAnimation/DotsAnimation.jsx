export default function DotsAnimation({ stages, currentStage }) {
  return (
    <>
      <div className="dots-container">
        <div className="loading-dots">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`dot ${index <= currentStage ? 'active' : ''}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            />
          ))}
        </div>
      </div>
      
      <div className="stage-text">{stages[currentStage].text}</div>
    </>
  );
}
