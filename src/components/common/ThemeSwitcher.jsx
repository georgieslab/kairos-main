// src/components/common/ThemeSwitcher.jsx
import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/components/themeSwitcher.css';

const ThemeSwitcher = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleToggle = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    toggleTheme();
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <button 
      className={`theme-switcher ${isAnimating ? 'animating' : ''}`}
      onClick={handleToggle}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className={`retro-switcher ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="retro-switch-track">
          <div className="retro-switch-handle"></div>
        </div>
        <div className="retro-icons">
          <Sun size={14} className="retro-sun" />
          <Moon size={14} className="retro-moon" />
        </div>
      </div>
    </button>
  );
};

export default ThemeSwitcher;