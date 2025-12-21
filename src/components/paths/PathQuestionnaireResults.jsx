// src/components/paths/PathQuestionnaireResults.jsx
import React, { useState } from 'react';
import DynamicIcon from '../common/DynamicIcon';
import { 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Star, 
  Clock, 
  TrendingUp,
  Heart,
  CheckCircle
} from 'lucide-react';
import '../../styles/components/pathQuestionnaireResults.css';

const PathQuestionnaireResults = ({ recommendation, onStartPath, onRetake, onBrowseAll }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!recommendation) {
    return (
      <div className="results-container">
        <div className="results-error">
          <p>Unable to generate recommendation. Please try again.</p>
          <button className="retry-button" onClick={onRetake}>
            <RotateCcw className="button-icon" />
            Retake Questionnaire
          </button>
        </div>
      </div>
    );
  }

  const { path, matchScore, headline, reason, benefit, timing, personalNote } = recommendation;

  return (
    <div className="results-container">
      {/* Header */}
      <div className="results-header">
        <Sparkles className="header-icon" />
        <h1 className="results-title">Your Perfect Path</h1>
        <p className="results-subtitle">Chosen just for you, right now</p>
      </div>

      {/* Main Recommendation Card */}
      <div className="recommendation-card">
        {/* Match Score Badge */}
        <div className="match-badge">
          <Star className="badge-icon" />
          <span className="badge-text">{matchScore}% Match</span>
        </div>

        {/* Path Icon & Title */}
        <div className="path-header">
          <div className="path-icon-wrapper" style={{ background: path.color }}>
            <DynamicIcon iconName={path.iconName} className="path-icon" />
          </div>
          <div className="path-info">
            <h2 className="path-title">{path.title}</h2>
            <p className="path-subtitle">{path.subtitle}</p>
          </div>
        </div>

        {/* Headline */}
        <div className="headline-section">
          <Heart className="section-icon pulse" />
          <p className="headline-text">{headline}</p>
        </div>

        {/* Path Details */}
        <div className="path-details">
          <div className="detail-item">
            <Clock className="detail-icon" />
            <span>{path.days} days</span>
          </div>
          <div className="detail-item">
            <TrendingUp className="detail-icon" />
            <span className="difficulty-badge">{path.difficulty || 'intermediate'}</span>
          </div>
        </div>

        {/* Tags */}
        {path.tags && path.tags.length > 0 && (
          <div className="path-tags">
            {path.tags.slice(0, 4).map(tag => (
              <span key={tag} className="path-tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Expandable Details */}
        <div className={`expandable-details ${isExpanded ? 'expanded' : ''}`}>
          <button 
            className="expand-button"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Show Less' : 'Why This Path?'}
            <ArrowRight className={`expand-icon ${isExpanded ? 'rotated' : ''}`} />
          </button>

          {isExpanded && (
            <div className="details-content">
              <div className="detail-section">
                <h3 className="detail-title">
                  <CheckCircle className="title-icon" />
                  Why This Path?
                </h3>
                <p className="detail-text">{reason}</p>
              </div>

              <div className="detail-section">
                <h3 className="detail-title">
                  <Sparkles className="title-icon" />
                  What You'll Gain
                </h3>
                <p className="detail-text">{benefit}</p>
              </div>

              <div className="detail-section">
                <h3 className="detail-title">
                  <Clock className="title-icon" />
                  Why Now?
                </h3>
                <p className="detail-text">{timing}</p>
              </div>

              {personalNote && (
                <div className="personal-note">
                  <Heart className="note-icon" />
                  <p className="note-text">{personalNote}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button 
          className="start-path-button"
          onClick={() => onStartPath(path)}
        >
          <Sparkles className="button-icon" />
          Start This Journey
          <ArrowRight className="button-arrow" />
        </button>
      </div>

      {/* Alternative Actions */}
      <div className="alternative-actions">
        <button className="alt-button" onClick={onRetake}>
          <RotateCcw className="alt-icon" />
          Retake Questionnaire
        </button>
        <button className="alt-button" onClick={onBrowseAll}>
          Browse All Paths
        </button>
      </div>
    </div>
  );
};

export default PathQuestionnaireResults;
