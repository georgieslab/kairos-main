// src/components/paths/PathQuestionnaireResults.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DynamicIcon from '../common/DynamicIcon';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Star,
  Clock,
  TrendingUp,
  Heart,
  CheckCircle,
  X
} from 'lucide-react';
import '../../styles/components/pathQuestionnaireResults.css';

const PathQuestionnaireResults = ({ recommendation, onStartPath, onRetake, onBrowseAll }) => {
  const { t } = useTranslation('paths');
  const [isExpanded, setIsExpanded] = useState(false);

  if (!recommendation) {
    return (
      <div className="results-container">
        <div className="results-error">
          <p>{t('pathQuestionnaireResults.errorText', 'Unable to generate recommendation. Please try again.')}</p>
          <button className="retry-button" onClick={onRetake}>
            <RotateCcw className="button-icon" />
            {t('pathQuestionnaireResults.retakeButton', 'Retake Questionnaire')}
          </button>
        </div>
      </div>
    );
  }

  const { path, matchScore, headline, reason, benefit, timing, personalNote } = recommendation;

  return (
    <div className="results-container">
      {/* Close — return to the Paths tab */}
      <button className="results-close" onClick={onBrowseAll} aria-label={t('pathQuestionnaireResults.closeAriaLabel', 'Close')}>
        <X size={20} />
      </button>

      {/* Header */}
      <div className="results-header">
        <svg
          className="header-icon"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="ppStarGrad" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ddd6fe" />
              <stop offset="0.5" stopColor="#a78bfa" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          {/* Main guiding sparkle */}
          <path
            d="M32 6c1.8 13.7 4.6 19.9 26 24-21.4 4.1-24.2 10.3-26 24-1.8-13.7-4.6-19.9-26-24 21.4-4.1 24.2-10.3 26-24Z"
            fill="url(#ppStarGrad)"
          />
          {/* Small accent sparkle */}
          <path
            d="M50 12c.7 4.6 1.5 6.6 6 7.3-4.5.7-5.3 2.7-6 7.3-.7-4.6-1.5-6.6-6-7.3 4.5-.7 5.3-2.7 6-7.3Z"
            fill="#ede9fe"
          />
        </svg>
        <h1 className="results-title">{t('pathQuestionnaireResults.title', 'Your Perfect Path')}</h1>
        <p className="results-subtitle">{t('pathQuestionnaireResults.subtitle', 'Chosen just for you, right now')}</p>
      </div>

      {/* Main Recommendation Card */}
      <div className="recommendation-card" style={{ '--pc': path.color || '139, 92, 246' }}>
        {/* Match Score Badge */}
        <div className="match-badge">
          <Star className="badge-icon" />
          <span className="badge-text">{t('pathQuestionnaireResults.matchBadge', '{{score}}% Match', { score: matchScore })}</span>
        </div>

        {/* Path Icon & Title */}
        <div className="path-header">
          <div className="path-icon-wrapper">
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
            <span>{t('pathQuestionnaireResults.daysCount', '{{count}} days', { count: path.days })}</span>
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
            {isExpanded ? t('pathQuestionnaireResults.showLess', 'Show Less') : t('pathQuestionnaireResults.whyThisPath', 'Why This Path?')}
            <ArrowRight className={`expand-icon ${isExpanded ? 'rotated' : ''}`} />
          </button>

          {isExpanded && (
            <div className="details-content">
              <div className="detail-section">
                <h3 className="detail-title">
                  <CheckCircle className="title-icon" />
                  {t('pathQuestionnaireResults.whyThisPath', 'Why This Path?')}
                </h3>
                <p className="detail-text">{reason}</p>
              </div>

              <div className="detail-section">
                <h3 className="detail-title">
                  <Sparkles className="title-icon" />
                  {t('pathQuestionnaireResults.whatYoullGain', "What You'll Gain")}
                </h3>
                <p className="detail-text">{benefit}</p>
              </div>

              <div className="detail-section">
                <h3 className="detail-title">
                  <Clock className="title-icon" />
                  {t('pathQuestionnaireResults.whyNow', 'Why Now?')}
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
          {t('pathQuestionnaireResults.startJourney', 'Start This Journey')}
          <ArrowRight className="button-arrow" />
        </button>
      </div>

      {/* Alternative Actions */}
      <div className="alternative-actions">
        <button className="alt-button" onClick={onRetake}>
          <RotateCcw className="alt-icon" />
          {t('pathQuestionnaireResults.retakeButton', 'Retake Questionnaire')}
        </button>
        <button className="alt-button" onClick={onBrowseAll}>
          {t('pathQuestionnaireResults.browseAll', 'Browse All Paths')}
        </button>
      </div>
    </div>
  );
};

export default PathQuestionnaireResults;
