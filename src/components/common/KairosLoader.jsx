// src/components/common/KairosLoader.jsx

import React, { useEffect, useState } from 'react';
import '../../styles/components/loader.css';

const KairosLoader = ({ 
  size = 'medium',
  fullScreen = false,
  message = '',
  subMessage = '',
  showProgress = false,
  progress = 0,
  duration = null,
  isFading = false
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  
  // Handle auto-hide based on duration
  useEffect(() => {
    let timer;
    
    if (duration && duration > 0) {
      timer = setTimeout(() => {
        setIsAnimating(false);
        
        // Add a small delay before hiding to allow for fade-out animation
        setTimeout(() => {
          setIsVisible(false);
        }, 500);
      }, duration);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [duration]);
  
  // Handle manual fade state
  useEffect(() => {
    if (isFading) {
      setIsAnimating(false);
      
      // Add a small delay before hiding to allow for fade-out animation
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isFading]);
  
  // Hide if not visible
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className={`kairos-loader-container 
      ${fullScreen ? 'fullscreen' : ''} 
      ${!isAnimating ? 'fade-out' : ''} 
      loader-${size}`}
    >
      <div className={`orb-wrapper ${isAnimating ? 'scale-in' : 'scale-out'}`}>
        <div className="center">
          <div className="ball"></div>
          <div className="blubb-1"></div>
          <div className="blubb-2"></div>
          <div className="blubb-3"></div>
          <div className="blubb-4"></div>
          <div className="blubb-5"></div>
          <div className="blubb-6"></div>
          <div className="sparkle-1"></div>
          <div className="sparkle-2"></div>
          <div className="sparkle-3"></div>
          <div className="sparkle-4"></div>
          <div className="sparkle-5"></div>
          <div className="sparkle-6"></div>
          <div className="sparkle-7"></div>
          <div className="sparkle-8"></div>
        </div>
      </div>
      
      {message && (
        <div className="loader-message">
          <h2 className="loader-title">{message}</h2>
          {subMessage && <p className="loader-subtitle">{subMessage}</p>}
        </div>
      )}
      
      {showProgress && progress > 0 && (
        <div className="loader-progress-container">
          <div 
            className="loader-progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default KairosLoader;