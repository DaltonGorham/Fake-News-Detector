import { useState, useEffect, useMemo } from 'react';
import PacmanAnimation from './PacmanAnimation';
import DotsAnimation from './DotsAnimation';
import HackerAnimation from './HackerAnimation';
import './styles.css';

export default function AnalyzingAnimation() {
  const stages = [
    { text: "Reading article...", duration: 1500 },
    { text: "Analyzing text...", duration: 2000 },
    { text: "Checking sources...", duration: 1800 },
    { text: "Calculating score...", duration: 1500 },
    { text: "Almost done!", duration: 1000 }
  ];

  const [currentStage, setCurrentStage] = useState(0);
  
  // Randomly select animation once on mount
  const AnimationComponent = useMemo(() => {
    const animations = [HackerAnimation, PacmanAnimation, DotsAnimation];
    return animations[Math.floor(Math.random() * animations.length)];
  }, []);

  useEffect(() => {
    if (currentStage >= stages.length) return;

    const timer = setTimeout(() => {
      setCurrentStage(prev => Math.min(prev + 1, stages.length - 1));
    }, stages[currentStage].duration);

    return () => clearTimeout(timer);
  }, [currentStage]);

  return (
    <div className="analyzing-animation">
      <AnimationComponent stages={stages} currentStage={currentStage} />
    </div>
  );
}
