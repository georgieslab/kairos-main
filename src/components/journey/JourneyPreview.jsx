// src/components/journey/JourneyPreview.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check, Tag, CalendarDays, Gauge } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getJourneyPath } from '../../data/JourneyData';
import DynamicIcon from '../common/DynamicIcon';
import JourneyDisclaimerModal from '../paths/components/JourneyDisclaimerModal';
import { getUserPathProgress, getNextDayForPath } from '../../utils/userProgress';
import '../../styles/components/journeyPreview.css';

const JourneyPreview = ({ pathId = 'self-discovery', onStart }) => {
  const { t, i18n } = useTranslation('journey');
  const { userProfile } = useAuth();
  const [pathProgress, setPathProgress] = useState(null);
  const [nextDay, setNextDay] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Everything on this screen comes from JourneyData. There used to be a
  // switch here that hardcoded name/description/benefits/icon for five paths
  // and fell through to Self-Discovery's copy for the other ~49 — so most
  // paths advertised Self-Discovery's benefits under their own title. The
  // data has had per-path description, subtitle, recommendedFor, tags,
  // difficulty and iconName all along.
  const path = getJourneyPath(pathId) || {};
  const totalDays = path.duration || path.days?.length || 10;

  // getJourneyPath returns localized title/subtitle/description — JourneyData
  // mutates JOURNEY_PATHS in place when the language changes. `recommendedFor`
  // and `tags` are NOT part of that translation set (252 unique strings across
  // the 53 paths, several of them full phrases), so they are English-only.
  // Rather than leak English into the German and Georgian UI, these two
  // sections are shown only in English. Delete the guard once the vocabulary
  // is translated.
  const metadataIsLocalized = i18n.language?.split('-')[0] === 'en';
  const recommendedFor = metadataIsLocalized ? (path.recommendedFor || []) : [];
  const tags = metadataIsLocalized ? (path.tags || []) : [];

  useEffect(() => {
    if (userProfile) {
      setPathProgress(getUserPathProgress(userProfile, pathId));
      setNextDay(getNextDayForPath(userProfile, pathId));
    }
  }, [userProfile, pathId]);

  // Access is gated upstream in PathSelection (getPathTier + PathUnlockModal)
  // before this screen is ever reached, so there is no check here. There used
  // to be one, calling a useSubscription() that was never imported and whose
  // contexts/SubscriptionContext module does not exist — a ReferenceError on
  // every render, which is why this screen has never actually displayed.
  const handleStartJourney = () => {
    if (pathId === 'transformation-journey') {
      setShowConfirmation(true);
      return;
    }
    if (typeof onStart === 'function') onStart();
  };

  const handleConfirmation = () => {
    setShowConfirmation(false);
    if (typeof onStart === 'function') onStart();
  };

  const hasStarted = pathProgress?.completedDays?.length > 0;

  // The stylesheet used to hardcode an emerald accent with overrides for three
  // named paths. JourneyData carries a per-path `color` as an "r, g, b" string,
  // so the accent is handed to CSS as a custom property and every path gets its
  // own without a rule per path.
  const accentStyle = path.color ? { '--path-accent': `rgb(${path.color})` } : undefined;

  const difficultyLabel = t(
    `journeyPreview.difficulty.${path.difficulty || 'intermediate'}`,
    path.difficulty || 'intermediate'
  );

  return (
    <div className={`journey-preview-container ${pathId}`} style={accentStyle}>
      <div className="journey-preview-header">
        <div className="icon-container">
          <DynamicIcon name={path.iconName} className="journey-icon" />
        </div>
        <h1 className="journey-title">{path.title}</h1>
        {path.subtitle && <p className="journey-subtitle">{path.subtitle}</p>}
      </div>

      <div className="journey-content">
        <div className="journey-card">
          {path.description && (
            <div className="card-section">
              <h2 className="section-title">{t('journeyPreview.whatToExpect', 'What to Expect')}</h2>
              <p className="journey-description">{path.description}</p>
            </div>
          )}

          {recommendedFor.length > 0 && (
            <div className="card-section">
              <h2 className="section-title">{t('journeyPreview.recommendedFor', 'Recommended for')}</h2>
              <ul className="benefits-list">
                {recommendedFor.map((who) => (
                  <li key={who} className="benefit-item">
                    <Check className="benefit-icon" />
                    <span>{who}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tags.length > 0 && (
            <div className="card-section">
              <h2 className="section-title">{t('journeyPreview.themes', 'Themes')}</h2>
              <ul className="journey-details tag-row">
                {tags.map((tag) => (
                  <li key={tag} className="journey-detail-item tag-chip">
                    <Tag className="detail-icon" />
                    <span>{tag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="card-section">
            <div className="commitment-info">
              <div className="commitment-item">
                <CalendarDays className="commitment-icon" />
                <div className="commitment-details">
                  <span className="commitment-value">{totalDays}</span>
                  <span className="commitment-label">{t('journeyPreview.daysLabel', 'Days')}</span>
                </div>
              </div>
              <div className="commitment-item">
                <Gauge className="commitment-icon" />
                <div className="commitment-details">
                  <span className="commitment-value">{difficultyLabel}</span>
                  <span className="commitment-label">{t('journeyPreview.difficultyLabel', 'Difficulty')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card-section">
            <h2 className="section-title">
              {t('journeyPreview.yourDayJourney', 'Your {{days}}-Day Journey', { days: totalDays })}
            </h2>
            <div className="days-row">
              {Array.from({ length: Math.min(totalDays, 10) }, (_, i) => {
                const day = i + 1;
                const completed = pathProgress?.completedDays?.includes(day);
                return (
                  <div
                    key={day}
                    className={`day-circle ${completed ? 'completed' : ''} ${day === nextDay ? 'next' : ''}`}
                  >
                    {day}
                  </div>
                );
              })}
              {totalDays > 10 && <div className="day-ellipsis">…</div>}
            </div>
            <p className="journey-note">
              {hasStarted
                ? t('journeyPreview.onDayContinue', "You're on day {{day}} of your {{name}}. Continue your journey!", { day: nextDay, name: path.title })
                : t('journeyPreview.eachDayBuilds', 'Each day builds upon the previous, guiding you through a structured {{days}}-day reflection experience.', { days: totalDays })}
            </p>
          </div>

          <div className="card-section cta-section">
            <button className="start-journey-button" onClick={handleStartJourney}>
              {hasStarted
                ? t('journeyPreview.continueToDay', 'Continue to Day {{day}}', { day: nextDay })
                : t('journeyPreview.beginYourJourney', 'Begin Your Journey')}
              <ArrowRight className="button-icon" />
            </button>
          </div>
        </div>
      </div>

      {/* The Transformation Journey is explicitly about substance and
          behavioural patterns, so it gets the disclaimer carrying the SAMHSA,
          AA and SMART Recovery contacts. It is deliberately the only path that
          does — showing it before Gratitude Practice would dilute it where it
          matters. Its "I Understand & Want to Begin" action is the commitment. */}
      {showConfirmation && (
        <JourneyDisclaimerModal
          onAccept={handleConfirmation}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default JourneyPreview;
