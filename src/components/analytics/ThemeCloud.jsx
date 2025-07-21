// src/components/analytics/ThemeCloud.jsx - Enhanced version with better positioning

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { AlertCircle, TrendingUp, Heart, Brain } from 'lucide-react';

/**
 * Enhanced ThemeCloud component with better word positioning and visual design
 * @param {Array} data - Array of theme objects with text and value properties
 * @param {boolean} simplified - Whether to show simplified view
 * @param {boolean} isDarkMode - Whether the app is in dark mode
 */
const ThemeCloud = ({ 
  data = [], 
  simplified = false,
  isDarkMode = true 
}) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });
  const [processedWords, setProcessedWords] = useState([]);
  const [isCalculating, setIsCalculating] = useState(true);
  
  // Update dimensions when component mounts and on window resize
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(rect.width, 300),
          height: simplified ? 200 : 300
        });
      }
    };
    
    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [simplified]);
  
  // Enhanced color system based on theme importance
  const getThemeColor = (value, maxValue, isDarkMode) => {
    const intensity = value / maxValue;
    
    if (isDarkMode) {
      // Dark theme: lighter colors for better contrast
      if (intensity > 0.7) return '#A8E6A3';      // High importance - bright green
      if (intensity > 0.5) return '#88D982';      // Medium-high - medium green  
      if (intensity > 0.3) return '#68CC61';      // Medium - darker green
      return '#9CAF88';                           // Low - muted green
    } else {
      // Light theme: darker colors
      if (intensity > 0.7) return '#2D5016';      // High importance - dark green
      if (intensity > 0.5) return '#3E6B23';      // Medium-high - medium dark green
      if (intensity > 0.3) return '#4F8530';      // Medium - medium green
      return '#5A9F3D';                           // Low - lighter green
    }
  };
  
  // Get font weight based on importance
  const getFontWeight = (value, maxValue) => {
    const intensity = value / maxValue;
    if (intensity > 0.7) return 700;  // Bold
    if (intensity > 0.5) return 600;  // Semi-bold
    if (intensity > 0.3) return 500;  // Medium
    return 400;                       // Regular
  };
  
  // Enhanced word positioning algorithm
  const calculateWordPositions = useMemo(() => {
    if (!data || data.length === 0 || !dimensions.width || !dimensions.height) {
      return [];
    }
    
    setIsCalculating(true);
    
    // Limit data for better display and performance
    const limitedData = simplified ? data.slice(0, 12) : data.slice(0, 20);
    
    if (limitedData.length === 0) return [];
    
    // Find min and max values for scaling
    const values = limitedData.map(item => item.value);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const valueRange = maxValue - minValue || 1;
    
    // Define font size range based on container size
    const containerSize = Math.min(dimensions.width, dimensions.height);
    const minFontSize = Math.max(simplified ? 12 : 14, containerSize * 0.03);
    const maxFontSize = Math.min(simplified ? 24 : 32, containerSize * 0.08);
    
    // Sort words by value (highest first for better placement)
    const sortedWords = [...limitedData].sort((a, b) => b.value - a.value);
    
    // Calculate word properties
    const words = sortedWords.map((item, index) => {
      // Calculate normalized value (0-1 range)
      const normalizedValue = valueRange > 0 ? (item.value - minValue) / valueRange : 0.5;
      
      // Calculate font size
      const fontSize = minFontSize + normalizedValue * (maxFontSize - minFontSize);
      
      // Estimate text dimensions (more accurate estimation)
      const avgCharWidth = fontSize * 0.55; // Adjusted for better accuracy
      const width = item.text.length * avgCharWidth;
      const height = fontSize * 1.2;
      
      return {
        text: item.text,
        value: item.value,
        fontSize: Math.round(fontSize),
        width: Math.ceil(width),
        height: Math.ceil(height),
        normalizedValue,
        index
      };
    });
    
    // Enhanced positioning algorithm
    const placedWords = [];
    const padding = 8; // Minimum space between words
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    // Place the most important word in the center
    if (words.length > 0) {
      const firstWord = words[0];
      placedWords.push({
        ...firstWord,
        x: centerX,
        y: centerY,
        rotation: 0
      });
    }
    
    // Place remaining words using improved spiral algorithm
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      let position = null;
      let attempts = 0;
      const maxAttempts = 1000;
      
      // Try different strategies based on word importance
      const isImportant = word.normalizedValue > 0.6;
      const spiralStep = isImportant ? 1 : 2;
      const maxRadius = Math.min(dimensions.width, dimensions.height) * 0.4;
      
      // Spiral parameters
      let angle = 0;
      let radius = word.height;
      
      while (attempts < maxAttempts && !position) {
        // Calculate spiral position
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        // Check if position is within bounds
        const withinBounds = 
          x - word.width / 2 > padding &&
          x + word.width / 2 < dimensions.width - padding &&
          y - word.height / 2 > padding &&
          y + word.height / 2 < dimensions.height - padding;
        
        if (withinBounds) {
          // Check for collisions with existing words
          const hasCollision = placedWords.some(placedWord => {
            const dx = Math.abs(placedWord.x - x);
            const dy = Math.abs(placedWord.y - y);
            const minDistanceX = (word.width + placedWord.width) / 2 + padding;
            const minDistanceY = (word.height + placedWord.height) / 2 + padding;
            
            return dx < minDistanceX && dy < minDistanceY;
          });
          
          if (!hasCollision) {
            // Small rotation for visual interest (but keep readable)
            const rotation = (Math.random() - 0.5) * (isImportant ? 10 : 25);
            
            position = { x, y, rotation };
          }
        }
        
        // Update spiral parameters
        angle += spiralStep * 0.1;
        radius += spiralStep * 0.5;
        
        // If spiral gets too large, try a grid-based approach
        if (radius > maxRadius) {
          const gridX = padding + (attempts % 5) * (dimensions.width / 5);
          const gridY = padding + Math.floor(attempts / 5) * (word.height + padding);
          
          if (gridX + word.width < dimensions.width - padding && 
              gridY + word.height < dimensions.height - padding) {
            position = { x: gridX + word.width / 2, y: gridY + word.height / 2, rotation: 0 };
          }
        }
        
        attempts++;
      }
      
      // If no position found, place at edge
      if (!position) {
        const edgeX = padding + word.width / 2;
        const edgeY = padding + word.height / 2 + (i * (word.height + padding / 2));
        
        if (edgeY < dimensions.height - padding) {
          position = { x: edgeX, y: edgeY, rotation: 0 };
        }
      }
      
      if (position) {
        placedWords.push({
          ...word,
          x: position.x,
          y: position.y,
          rotation: position.rotation
        });
      }
    }
    
    setTimeout(() => setIsCalculating(false), 100);
    return placedWords;
  }, [data, dimensions, simplified]);
  
  useEffect(() => {
    setProcessedWords(calculateWordPositions);
  }, [calculateWordPositions]);
  
  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="theme-cloud-empty">
        <AlertCircle size={32} className="empty-icon" />
        <p>Write more journal entries to see your themes!</p>
      </div>
    );
  }
  
  // Get max value for color scaling
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="theme-cloud-container" ref={containerRef}>
      {/* Loading indicator */}
      {isCalculating && (
        <div className="theme-cloud-loading">
          <div className="loading-spinner"></div>
          <span>Organizing themes...</span>
        </div>
      )}
      
      {/* SVG for word cloud */}
      <svg 
        width="100%" 
        height="100%" 
        className="theme-cloud-svg"
        style={{ opacity: isCalculating ? 0.3 : 1 }}
      >
        {processedWords.map((word, index) => (
          <g 
            key={index}
            transform={`translate(${word.x}, ${word.y}) rotate(${word.rotation})`}
            className="theme-cloud-word"
          >
            <text
              x={0}
              y={0}
              fontSize={`${word.fontSize}px`}
              fill={getThemeColor(word.value, maxValue, isDarkMode)}
              textAnchor="middle"
              dominantBaseline="central"
              fontWeight={getFontWeight(word.value, maxValue)}
              fontFamily="'Inter', 'Segoe UI', system-ui, sans-serif"
              className="theme-word-text"
              style={{
                filter: `drop-shadow(1px 1px 2px ${isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'})`
              }}
            >
              {word.text}
            </text>
          </g>
        ))}
      </svg>
      
      {/* Enhanced legend */}
      {!simplified && (
        <div className="theme-cloud-legend">
          <div className="legend-header">
            <TrendingUp size={16} className="legend-icon" />
            <span>Theme Importance</span>
          </div>
          <div className="legend-items">
            <div className="legend-item">
              <div 
                className="legend-color" 
                style={{ 
                  backgroundColor: getThemeColor(maxValue, maxValue, isDarkMode),
                  fontWeight: 700
                }}
              ></div>
              <span className="legend-label">Most important</span>
            </div>
            <div className="legend-item">
              <div 
                className="legend-color" 
                style={{ 
                  backgroundColor: getThemeColor(maxValue * 0.5, maxValue, isDarkMode),
                  fontWeight: 500
                }}
              ></div>
              <span className="legend-label">Moderate</span>
            </div>
            <div className="legend-item">
              <div 
                className="legend-color" 
                style={{ 
                  backgroundColor: getThemeColor(maxValue * 0.2, maxValue, isDarkMode),
                  fontWeight: 400
                }}
              ></div>
              <span className="legend-label">Less frequent</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Improved explanation */}
      {!simplified && (
        <div className="theme-cloud-explanation">
          <div className="explanation-header">
            <Brain size={16} className="explanation-icon" />
            <h4 className="explanation-title">Your Journal's Key Themes</h4>
          </div>
          <p className="explanation-text">
            This word cloud shows the main topics you write about. Larger, bolder words appear more 
            frequently in your entries, revealing what matters most to you in your journaling practice.
          </p>
        </div>
      )}
      
      {/* Stats for simplified view */}
      {simplified && processedWords.length > 0 && (
        <div className="theme-stats">
          <div className="stat-item">
            <Heart size={14} />
            <span>{processedWords.length} themes discovered</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeCloud;