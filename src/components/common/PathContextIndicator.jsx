// src/components/common/PathContextIndicator.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Compass, Heart, Brain } from 'lucide-react';
import useNavigation from '../../hooks/useNavigation';
import { getJourneyPath } from '../../data/JourneyData';

/**
 * A component to display the current path and day context
 * @param {Object} props
 * @param {string} props.size - "compact" or "full" size variant
 */
const PathContextIndicator = ({ size = "compact" }) => {
  const { t } = useTranslation('layout');
  const { currentPath, currentDay } = useNavigation();

  // Get path-specific properties
  const getPathInfo = () => {
    switch(currentPath) {
      case 'emotional-intelligence':
        return {
          name: t('pathContext.names.emotionalIntelligence', 'Emotional Intelligence'),
          icon: Heart,
          color: 'path-ei',
          textColor: 'text-pink-100'
        };

      case 'deciding-to-doing':
        return {
          name: t('pathContext.names.decidingToDoing', 'The Gap Between Deciding and Doing'),
          icon: Compass,
          color: 'path-sd',
          textColor: 'text-emerald-100'
        };
      case 'mindfulness-awareness':
        return {
          name: t('pathContext.names.mindfulness', 'Mindfulness'),
          icon: Brain,
          color: 'path-ma',
          textColor: 'text-purple-100'
        };
      case 'self-discovery':
      default:
        return {
          name: t('pathContext.names.selfDiscovery', 'Self-Discovery'),
          icon: Compass,
          color: 'path-sd',
          textColor: 'text-emerald-100'
        };
    }
  };
  
  const { name, icon: Icon, color } = getPathInfo();
  const maxDays = getJourneyPath(currentPath)?.duration || 10;
  
  // Compact version for headers
  if (size === "compact") {
    return (
      <div className={`path-indicator-compact ${color}`}>
        <Icon className="path-indicator-icon" />
        <span className="path-indicator-text">{t('pathContext.dayCompact', '{{name}} • Day {{day}}', { name, day: currentDay })}</span>
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
              style={{ width: `${Math.min(currentDay / maxDays, 1) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">{t('pathContext.dayProgress', 'Day {{day}}/{{maxDays}}', { day: currentDay, maxDays })}</span>
        </div>
      </div>
    </div>
  );
};

export default PathContextIndicator;
