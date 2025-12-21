// src/components/common/PathContextIndicator.jsx

import React from 'react';
import { Compass, Heart, Brain } from 'lucide-react';
import useNavigation from '../../hooks/useNavigation';

/**
 * A component to display the current path and day context
 * @param {Object} props
 * @param {string} props.size - "compact" or "full" size variant
 */
const PathContextIndicator = ({ size = "compact" }) => {
  const { currentPath, currentDay } = useNavigation();
  
  // Get path-specific properties
  const getPathInfo = () => {
    switch(currentPath) {
      case 'emotional-intelligence':
        return {
          name: 'Emotional Intelligence',
          icon: Heart,
          color: 'path-ei',
          textColor: 'text-pink-100'
        };

      case 'deciding-to-doing':
      pathProgress = userProfile?.journeyProgress?.decidingToDoingProgress;
      pathName = 'The Gap Between Deciding and Doing';
      pathMaxDays = 7;
      break;
      case 'mindfulness-awareness':
        return {
          name: 'Mindfulness',
          icon: Brain,
          color: 'path-ma',
          textColor: 'text-purple-100'
        };
      case 'self-discovery':
      default:
        return {
          name: 'Self-Discovery',
          icon: Compass,
          color: 'path-sd',
          textColor: 'text-emerald-100'
        };
    }
  };
  
  const { name, icon: Icon, color } = getPathInfo();
  
  // Compact version for headers
  if (size === "compact") {
    return (
      <div className={`path-indicator-compact ${color}`}>
        <Icon className="path-indicator-icon" />
        <span className="path-indicator-text">{name} • Day {currentDay}</span>
      </div>
    );
  }
  
  // Full version for path selection screen
  return (
    <div className={`path-indicator-full ${color}`}>
      <div className="path-indicator-icon-container">
        <Icon className="path-indicator-icon-large" />
      </div>
      <div className="path-indicator-content">
        <h3 className="path-indicator-title">{name}</h3>
        <div className="path-indicator-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentDay / 10) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">Day {currentDay}/10</span>
        </div>
      </div>
    </div>
  );
};

export default PathContextIndicator;