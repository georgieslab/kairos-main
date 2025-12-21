// src/components/paths/PathRecommendationCard.jsx
import React, { useState } from 'react';
import { Sparkles, ArrowRight, Star, TrendingUp, Compass, Zap } from 'lucide-react';
import DynamicIcon from '../common/DynamicIcon';
import '../../styles/components/pathRecommendation.css';

const PathRecommendationCard = ({ recommendation, index, onStart }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!recommendation || !recommendation.path) {
    return null;
  }
  
  const { path, reason, benefit, timing, category, matchScore } = recommendation;
  
  // Category icons and colors
  const categoryConfig = {
    growth: { icon: TrendingUp, color: '#10b981', label: 'Build on Progress' },
    exploration: { icon: Compass, color: '#6366f1', label: 'New Territory' },
    challenge: { icon: Zap, color: '#f59e0b', label: 'Stretch Goal' }
  };
  
  const config = categoryConfig[category] || categoryConfig.growth;
  const CategoryIcon = config.icon;
  
  // Difficulty badge color
  const difficultyColors = {
    beginner: '#10b981',
    intermediate: '#3b82f6',
    advanced: '#8b5cf6'
  };
  
  const difficultyColor = difficultyColors[path.difficulty] || difficultyColors.intermediate;
  
  const handleStartPath = () => {
    if (onStart) {
      onStart(path);
    }
  };
  
  return (
    <div 
      className={`path-recommendation-card path-recommendation-${index + 1}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Match Score Badge */}
      <div className="path-rec-match-badge">
        <Star size={14} />
        <span>{matchScore}% Match</span>
      </div>
      
      {/* Category Badge */}
      <div 
        className="path-rec-category-badge"
        style={{ backgroundColor: config.color }}
      >
        <CategoryIcon size={14} />
        <span>{config.label}</span>
      </div>
      
      {/* Header */}
      <div className="path-rec-header">
        <div className="path-rec-icon">
          <DynamicIcon name={path.iconName || 'Compass'} size={32} />
        </div>
        <div className="path-rec-title-section">
          <h3 className="path-rec-title">{path.title}</h3>
          <p className="path-rec-subtitle">{path.subtitle}</p>
        </div>
      </div>
      
      {/* Meta Info */}
      <div className="path-rec-meta">
        <div className="path-rec-meta-item">
          <span className="path-rec-meta-label">Duration</span>
          <span className="path-rec-meta-value">{path.days} days</span>
        </div>
        <div className="path-rec-meta-item">
          <span className="path-rec-meta-label">Difficulty</span>
          <span 
            className="path-rec-meta-badge"
            style={{ backgroundColor: difficultyColor }}
          >
            {path.difficulty || 'intermediate'}
          </span>
        </div>
      </div>
      
      {/* AI Explanation */}
      <div className={`path-rec-explanation ${isExpanded ? 'expanded' : ''}`}>
        <div className="path-rec-section">
          <div className="path-rec-section-header">
            <Sparkles size={16} className="path-rec-sparkle" />
            <h4>Why This Path?</h4>
          </div>
          <p className="path-rec-reason">{reason}</p>
        </div>
        
        {isExpanded && (
          <>
            <div className="path-rec-section">
              <h4>What You'll Gain</h4>
              <p className="path-rec-benefit">{benefit}</p>
            </div>
            
            <div className="path-rec-section">
              <h4>Why Now?</h4>
              <p className="path-rec-timing">{timing}</p>
            </div>
            
            {path.tags && path.tags.length > 0 && (
              <div className="path-rec-tags">
                {path.tags.slice(0, 4).map((tag, idx) => (
                  <span key={idx} className="path-rec-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Action Button */}
      <button 
        className="path-rec-start-btn"
        onClick={(e) => {
          e.stopPropagation();
          handleStartPath();
        }}
      >
        <span>Start Journey</span>
        <ArrowRight size={18} />
      </button>
      
      {/* Expand Indicator */}
      {!isExpanded && (
        <div className="path-rec-expand-hint">
          <span>Tap to see why this is perfect for you</span>
        </div>
      )}
    </div>
  );
};

export default PathRecommendationCard;
