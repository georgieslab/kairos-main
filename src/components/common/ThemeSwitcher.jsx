// src/components/common/ThemeSwitcher.jsx
// Apple Spatial Glass theme toggle – smooth, animated, minimal

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/components/themeSwitcher.css';

const ThemeSwitcher = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      className={`liquid-theme-switch ${isDarkMode ? 'dark' : 'light'}`}
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="glass-thumb">
        {isDarkMode ? <Moon size={14} className="theme-icon" /> : <Sun size={14} className="theme-icon" />}
      </div>
    </button>
  );
};

export default ThemeSwitcher;