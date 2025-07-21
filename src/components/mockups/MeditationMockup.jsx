// src/components/mockups/MeditationMockup.jsx

import React, { useEffect, useState } from 'react';
import '../../styles/components/mockups/MeditationMockup.css';

const MeditationMockup = () => {
  // Animation states for the audio visualization bars
  const [barHeights, setBarHeights] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(38);
  
  // Animation for audio visualizer bars
  useEffect(() => {
    // Initialize bar heights
    const initialHeights = Array.from({ length: 16 }, () => 
      Math.floor(Math.random() * 10) + 5
    );
    setBarHeights(initialHeights);
    
    // Animate bar heights only if playing
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setBarHeights(prev => 
          prev.map(() => Math.floor(Math.random() * 10) + 5)
        );
      }, 500);
      
      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 0.2;
          return newProgress > 100 ? 100 : newProgress;
        });
      }, 1000);
      
      return () => {
        clearInterval(interval);
        clearInterval(progressInterval);
      };
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="meditation-mockup-container">
      <div className="mockup-phone">
        <div className="mockup-screen">
          {/* App Header */}
          <div className="mockup-header">
            <div className="back-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="app-name">Καιρός Meditation</span>
            <div className="header-icon">
              <span></span>
              <span></span>
            </div>
          </div>
          
          {/* Meditation Info */}
          <div className="meditation-info">
            <div className="meditation-image">
              <div className="image-overlay"></div>
              <div className="image-content">
                <div className="meditation-type">PERSONALIZED</div>
                <h3 className="meditation-title">Finding Inner Clarity</h3>
                <p className="meditation-subtitle">Based on your journal entries</p>
              </div>
            </div>
          </div>
          
          {/* Audio Visualization */}
          <div className="audio-container">
            <div className="audio-visualizer">
              {barHeights.map((height, index) => (
                <div 
                  key={index} 
                  className="visualizer-bar"
                  style={{ 
                    height: `${height}px`,
                    opacity: isPlaying ? '1' : '0.5'
                  }}
                ></div>
              ))}
            </div>
            
            {/* Current Text */}
            <div className="meditation-text">
              "Focus on your breath flowing in and out. Notice how your body feels in this moment, without judgment."
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="time-indicators">
              <span>3:12</span>
              <span>8:00</span>
            </div>
          </div>
          
          {/* Player Controls */}
          <div className="player-controls">
            <button className="control-button skip-back">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 20L9 12L19 4V20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button className="control-button rewind">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 17L6 12L11 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 17L13 12L18 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button 
              className={`control-button ${isPlaying ? 'pause' : 'play'}`}
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/>
                  <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
                </svg>
              )}
            </button>
            
            <button className="control-button forward">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 17L18 12L13 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 17L11 12L6 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <button className="control-button skip-forward">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 4L15 12L5 20V4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          {/* Meditation Info Cards */}
          <div className="meditation-info-cards">
            <div className="info-card">
              <div className="info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="info-content">
                <div className="info-label">Reminders</div>
                <div className="info-value">Daily, 7am</div>
              </div>
            </div>
            
            <div className="info-card">
              <div className="info-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="info-content">
                <div className="info-label">Theme</div>
                <div className="info-value">Anxiety Relief</div>
              </div>
            </div>
          </div>
          
          {/* Bottom Navigation Hint */}
          <div className="bottom-nav-hint">
            <div className="nav-pill"></div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements for Decoration */}
      <div className="floating-element bubble-1"></div>
      <div className="floating-element bubble-2"></div>
      <div className="floating-element bubble-3"></div>
      <div className="floating-element leaf-1"></div>
      <div className="floating-element leaf-2"></div>
    </div>
  );
};

export default MeditationMockup;