import { useState, useEffect } from 'react';

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else if (hour >= 17 && hour < 22) {
    return "Good evening";
  } else {
    return "Good night";
  }
};

const WELCOME_MESSAGES = [
  "Hello",
  "Welcome back",
  "How's it going",
  getTimeBasedGreeting
];

export const useWelcomeMessage = (user) => {
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeText, setWelcomeText] = useState('');
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      setShowWelcome(false);
      sessionStorage.removeItem('welcomeMessageShown');
      return;
    }

    const hasSeenWelcome = sessionStorage.getItem('welcomeMessageShown');
    
    if (!hasSeenWelcome) {
      const randomIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length);
      const selected = WELCOME_MESSAGES[randomIndex];
      // If it's a function, call it; otherwise use the string
      const randomMessage = typeof selected === 'function' ? selected() : selected;
      setWelcomeText(randomMessage);
      setShowWelcome(true);
    }
  }, [userId]);

  const hideWelcome = () => {
    setShowWelcome(false);
    sessionStorage.setItem('welcomeMessageShown', 'true');
  };

  return {
    showWelcome,
    welcomeText,
    hideWelcome
  };
};
