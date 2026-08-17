// src/components/journey/JourneyPreviewModal.jsx
// Introduction sheet shown when starting a journey that hasn't been begun.
//
// This is a sheet rather than a screen because the surrounding task is
// browsing 53 paths: the grid stays behind it, dismissing costs one tap, and
// comparing two paths is two taps instead of four navigations. The commitment
// happens on the next screen, not here — this step is information, and an
// information step that interrupts browsing should be cheap to leave.

import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ArrowRight, Check, Clock, Target } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getJourneyPath } from '../../data/JourneyData';
import DynamicIcon from '../common/DynamicIcon';
import JourneyDisclaimerModal from '../paths/components/JourneyDisclaimerModal';
import { getUserPathProgress, getNextDayForPath } from '../../utils/userProgress';
import '../../styles/components/journeyPreviewModal.css';

// Paths that show a disclaimer before starting, and which one. Kept short on
// purpose: a warning before every path is a warning before none, and these are
// the only two subjects where a journal alone is the wrong tool for some of
// the people who will open it.
const DISCLAIMER_VARIANTS = {
  'transformation-journey': 'substance',   // habits, substances, behaviour
  'starting-over': 'displacement',         // the Starting Over pack
  'learning-to-speak': 'displacement',
  'two-homes': 'displacement',
  'moral-pain': 'moralInjury',             // what you did, or failed to prevent
  'existential-pain': 'existential',       // dying, choosing, being alone, meaning
  'body-pain': 'chronicPain',              // chronic pain, and not being believed
};

const JourneyPreviewModal = ({ pathId, onStart, onClose }) => {
  const { t, i18n } = useTranslation('journey');
  const { userProfile } = useAuth();
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Edge fades marking that the body scrolls. Driven by real scroll position
  // rather than shown permanently, so a short path with nothing below the fold
  // doesn't advertise content that isn't there.
  const bodyRef = useRef(null);
  const [edges, setEdges] = useState({ above: false, below: false });

  const path = pathId ? getJourneyPath(pathId) : null;

  const updateEdges = useCallback(() => {
    const el = bodyRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    // A few px of slack: sub-pixel layout means scrollTop rarely lands exactly
    // on 0 or on max, which would leave a fade stuck on at either end.
    setEdges({
      above: el.scrollTop > 4,
      below: max > 4 && el.scrollTop < max - 4
    });
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    updateEdges();
    // Observe the children too, not just the scroller: the scroller's own box
    // doesn't change when content reflows (fonts finishing, a language switch
    // re-wrapping the description), but that's exactly when the answer changes.
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    Array.from(el.children).forEach((child) => ro.observe(child));
    return () => ro.disconnect();
  }, [updateEdges, pathId]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose?.();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    // The sheet scrolls internally; letting the grid behind it scroll too
    // makes the whole thing feel unanchored on touch devices.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [handleKeyDown]);

  if (!path) return null;

  const totalDays = path.duration || path.days?.length || 10;
  const pathProgress = getUserPathProgress(userProfile, pathId);
  const nextDay = getNextDayForPath(userProfile, pathId);
  const hasStarted = pathProgress?.completedDays?.length > 0;

  // getJourneyPath returns localized title/subtitle/description — JourneyData
  // mutates JOURNEY_PATHS in place on language change. recommendedFor and tags
  // are NOT in that translation set (252 unique strings, several of them full
  // phrases), so they are shown only in English rather than leaking English
  // into the German and Georgian UI. Delete the guard once translated.
  const metadataIsLocalized = i18n.language?.split('-')[0] === 'en';
  const recommendedFor = metadataIsLocalized ? (path.recommendedFor || []) : [];
  const tags = metadataIsLocalized ? (path.tags || []) : [];

  const difficultyLabel = path.difficulty
    ? t(`journeyPreview.difficulty.${path.difficulty}`, path.difficulty)
    : null;

  const begin = () => {
    if (DISCLAIMER_VARIANTS[pathId]) {
      setShowDisclaimer(true);
      return;
    }
    onStart?.();
  };

  return (
    <div
      className="jpm-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={path.title}
    >
      <div
        className="jpm-sheet"
        style={{ '--c': path.color || '139, 92, 246' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="jpm-close" onClick={onClose} aria-label={t('journeyPreview.close', 'Close')}>
          <X size={18} />
        </button>

        <div className="jpm-grabber" aria-hidden="true" />

        <header className="jpm-hero">
          <div className="jpm-icon-halo">
            <DynamicIcon name={path.iconName} size={28} />
          </div>
          <h2 className="jpm-title">{path.title}</h2>
          {path.subtitle && <p className="jpm-subtitle">{path.subtitle}</p>}

          <div className="jpm-meta-row">
            <span className="jpm-pill">
              <Clock size={12} />
              {t('journeyPreview.dayCount', '{{count}} days', { count: totalDays })}
            </span>
            {difficultyLabel && (
              <span className="jpm-pill">
                <Target size={12} />
                {difficultyLabel}
              </span>
            )}
          </div>
        </header>

        <div className={`jpm-scroll${edges.above ? ' has-above' : ''}${edges.below ? ' has-below' : ''}`}>
          <div className="jpm-body" ref={bodyRef} onScroll={updateEdges}>
            {path.description && (
              <section className="jpm-section">
                <h3 className="jpm-section-title">{t('journeyPreview.whatToExpect', 'What to Expect')}</h3>
                <p className="jpm-description">{path.description}</p>
              </section>
            )}

            {recommendedFor.length > 0 && (
              <section className="jpm-section">
                <h3 className="jpm-section-title">{t('journeyPreview.recommendedFor', 'Recommended for')}</h3>
                <ul className="jpm-reco-list">
                  {recommendedFor.map((who) => (
                    <li key={who} className="jpm-reco-item">
                      <Check size={14} className="jpm-reco-check" />
                      <span>{who}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {tags.length > 0 && (
              <section className="jpm-section">
                <h3 className="jpm-section-title">{t('journeyPreview.themes', 'Themes')}</h3>
                <div className="jpm-tags">
                  {tags.map((tag) => (
                    <span key={tag} className="jpm-tag">{tag}</span>
                  ))}
                </div>
              </section>
            )}

            <section className="jpm-section">
              <h3 className="jpm-section-title">
                {t('journeyPreview.theShape', 'The shape of it')}
              </h3>
              <div className="jpm-days">
                {Array.from({ length: Math.min(totalDays, 14) }, (_, i) => {
                  const day = i + 1;
                  const done = pathProgress?.completedDays?.includes(day);
                  return (
                    <span
                      key={day}
                      className={`jpm-day${done ? ' is-done' : ''}${day === nextDay && hasStarted ? ' is-next' : ''}`}
                    >
                      {day}
                    </span>
                  );
                })}
                {totalDays > 14 && <span className="jpm-day-more">+{totalDays - 14}</span>}
              </div>
              <p className="jpm-note">
                {hasStarted
                  ? t('journeyPreview.onDayContinue', "You're on day {{day}} of your {{name}}. Continue your journey!", { day: nextDay, name: path.title })
                  : t('journeyPreview.eachDayBuilds', 'Each day builds upon the previous, guiding you through a structured {{days}}-day reflection experience.', { days: totalDays })}
              </p>
            </section>
          </div>
        </div>

        <footer className="jpm-footer">
          <button className="jpm-start" onClick={begin}>
            {hasStarted
              ? t('journeyPreview.continueToDay', 'Continue to Day {{day}}', { day: nextDay })
              : t('journeyPreview.beginYourJourney', 'Begin Your Journey')}
            <ArrowRight size={16} />
          </button>
        </footer>
      </div>

      {showDisclaimer && (
        <JourneyDisclaimerModal
          variant={DISCLAIMER_VARIANTS[pathId]}
          onAccept={() => { setShowDisclaimer(false); onStart?.(); }}
          onCancel={() => setShowDisclaimer(false)}
        />
      )}
    </div>
  );
};

export default JourneyPreviewModal;
