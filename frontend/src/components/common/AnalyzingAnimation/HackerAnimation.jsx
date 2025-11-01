import { useState, useEffect, useRef } from 'react';

/*
    This isn't very React-like, but it's adapted from a tutorial to create a
    Matrix Rain Effect Using HTML, CSS & JavaScript | Digital Code Animation Tutorial
    Credit: Coding Master
    Link: https://www.youtube.com/watch?v=95nZL2jsyxk
*/

export default function HackerAnimation({ stages, currentStage }) {
  const [lines, setLines] = useState([]);
  const canvasRef = useRef(null);
  
  const hackerPhrases = [
    'truth-checker@analyzer:~$ init --protocol fact-check',
    'truth-checker@analyzer:~$ fetch metadata --source article',
    'truth-checker@analyzer:~$ parse --content text',
    'truth-checker@analyzer:~$ scan --bias-detection',
    'truth-checker@analyzer:~$ compute --credibility-score',
    'truth-checker@analyzer:~$ finalize --output report',
    'truth-checker@analyzer:~$ echo "Analysis complete"',
    'truth-checker@analyzer:~$ █'
  ];
  // this one is for the terminal lines based off the stage state
  useEffect(() => {
    const phrasesPerStage = Math.ceil(hackerPhrases.length / stages.length);
    const startIndex = currentStage * phrasesPerStage;
    const endIndex = Math.min(startIndex + phrasesPerStage, hackerPhrases.length);
    
    setLines(hackerPhrases.slice(0, endIndex));
  }, [currentStage]);

  // this one is for the matrix rain effect
  // need to be seperate so it doesnt reset the rain on each stage change of the terminal lines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrixChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const matrix = matrixChars.split('');
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * -100));

    function drawMatrixRain() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0';
      ctx.font = fontSize + 'px monospace';
      
      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(drawMatrixRain, 35);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="matrix-canvas" />

      <div className="hacker-container">
        <div className="terminal">
          <div className="terminal-header">
            <span className="terminal-dot red"></span>
            <span className="terminal-dot yellow"></span>
            <span className="terminal-dot green"></span>
            <span className="terminal-title">truth-analyzer.sh</span>
          </div>
          <div className="terminal-body">
            {lines.map((line, index) => (
              <div key={index} className="terminal-line">
                {line}
                {index === lines.length - 1 && (
                  <span className="cursor">_</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="stage-text">{stages[currentStage].text}</div>
    </>
  );
}
