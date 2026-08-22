// src/components/common/KairosLoader.jsx - Enhanced Version

import React, { useEffect, useState } from 'react';
import LoadingQuote from './LoadingQuote';
import '../../styles/components/loader.css';

/* The sand clock, for waits long enough that an orb stops reassuring anyone.
 *
 * Two symmetric bulbs. Sand drains from the upper one into the lower, and when
 * it has run through, the whole glass turns over and it starts again — which
 * is why the bulbs are drawn identical: after a 180 degree turn the lower bulb
 * IS the upper one, so a single mask pair serves both halves of the cycle and
 * the sand can simply reset.
 *
 * Everything moves by transform. The obvious approach — animating the `height`
 * or `y` of the sand rectangles — is an SVG geometry property, which is
 * animatable in CSS only in newer browsers and repaints rather than composites.
 * Translating a masked rectangle costs nothing and works everywhere.
 */
const KairosHourglass = ({ sandColor = null }) => (
  <svg
    className="kairos-hourglass"
    viewBox="0 0 100 140"
    role="presentation"
    style={sandColor ? { '--kh-c': sandColor } : undefined}
  >
    <defs>
      <mask id="kh-upper">
        <path d="M22 22 L78 22 C78 45 55 62 50 70 C45 62 22 45 22 22 Z" fill="#fff" />
      </mask>
      <mask id="kh-lower">
        <path d="M50 70 C55 78 78 95 78 118 L22 118 C22 95 45 78 50 70 Z" fill="#fff" />
      </mask>
      <linearGradient id="kh-sand" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="rgb(var(--kh-c, 212, 175, 55))" stopOpacity="0.95" />
        <stop offset="100%" stopColor="rgb(var(--kh-c, 212, 175, 55))" stopOpacity="0.65" />
      </linearGradient>
    </defs>

    <g className="kh-glass">
      {/* Caps */}
      <rect x="16" y="14" width="68" height="7" rx="3.5" className="kh-frame" />
      <rect x="16" y="119" width="68" height="7" rx="3.5" className="kh-frame" />

      {/* The two vessels */}
      <path d="M22 22 L78 22 C78 45 55 62 50 70 C45 62 22 45 22 22 Z" className="kh-vessel" />
      <path d="M50 70 C55 78 78 95 78 118 L22 118 C22 95 45 78 50 70 Z" className="kh-vessel" />

      {/* Sand. Each rect is larger than its bulb and clipped by the mask, so
          translating it reveals or hides a level without resizing anything. */}
      <g mask="url(#kh-upper)">
        <rect className="kh-sand-top" x="20" y="20" width="60" height="52" fill="url(#kh-sand)" />
      </g>
      <g mask="url(#kh-lower)">
        <rect className="kh-sand-bottom" x="20" y="68" width="60" height="52" fill="url(#kh-sand)" />
      </g>

      {/* The falling stream, and the small heap it lands on */}
      <rect className="kh-stream" x="48.6" y="66" width="2.8" height="52" fill="url(#kh-sand)" />
      <ellipse className="kh-heap" cx="50" cy="117" rx="13" ry="3.5" fill="url(#kh-sand)" />
    </g>
  </svg>
);

const KairosLoader = ({
  size = 'medium',
  fullScreen = false,
  message = '',
  subMessage = '',
  showProgress = false,
  progress = 0,
  duration = null,
  isFading = false,
  showQuote = false,
  variant = 'default', // 'default', 'minimal', 'detailed', 'hourglass'
  sandColor = null     // 'r, g, b' — tints the hourglass to the active path
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  const [localProgress, setLocalProgress] = useState(0);
  
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
  
  // Smooth progress animation
  useEffect(() => {
    if (showProgress) {
      const diff = progress - localProgress;
      if (Math.abs(diff) > 0.1) {
        const timer = setTimeout(() => {
          setLocalProgress(prev => prev + diff * 0.1);
        }, 16); // 60fps
        return () => clearTimeout(timer);
      } else {
        setLocalProgress(progress);
      }
    }
  }, [progress, localProgress, showProgress]);
  
  // Hide if not visible
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className={`kairos-loader-container 
      ${fullScreen ? 'fullscreen' : ''} 
      ${!isAnimating ? 'fade-out' : ''} 
      loader-${size}
      loader-${variant}`}
    >
      <div className="loader-content-wrapper">
        {variant === 'hourglass' ? (
          <div className={`orb-wrapper ${isAnimating ? 'scale-in' : 'scale-out'}`}>
            <KairosHourglass sandColor={sandColor} />
          </div>
        ) : (
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
        )}
        
        {message && (
          <div className="loader-message">
            <h2 className="loader-title">{message}</h2>
            {subMessage && <p className="loader-subtitle">{subMessage}</p>}
          </div>
        )}
        
        {showProgress && (
          <div className="loader-progress-container">
            <div 
              className="loader-progress-bar" 
              style={{ width: `${localProgress}%` }}
            >
              <div className="loader-progress-shimmer"></div>
            </div>
            {variant === 'detailed' && (
              <span className="loader-progress-text">{Math.round(localProgress)}%</span>
            )}
          </div>
        )}

        {showQuote && <LoadingQuote />}
      </div>
    </div>
  );
};

export default KairosLoader;