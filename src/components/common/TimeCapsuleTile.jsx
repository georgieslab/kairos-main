// src/components/common/TimeCapsuleTile.jsx
//
// Prominent, tactile Apple Spatial Glass card for "Letters to your future self".
// Seamlessly adapts to three states:
//   1. Arrived: Unopened letter ready to reveal with celebration styling
//   2. Sealed: Shows countdown and delivery details ("24 days until delivery")
//   3. Empty: Inspiring invitation card with wax seal emblem

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, Sparkles, ArrowRight, Clock, Plus, PenTool } from 'lucide-react';
import TimeLetterIcon from './TimeLetterIcon';
import { isArrived, daysUntil, toDate } from '../../services/timeCapsuleService';
import hapticService from '../../services/hapticService';
import '../../styles/components/timeCapsule.css';

const formatDate = (d, lng) =>
  d ? d.toLocaleDateString(lng, { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const TimeCapsuleTile = ({ capsules = [], onOpenCompose, onOpenReveal, loading = false }) => {
  const { t, i18n } = useTranslation('journey');
  const lng = i18n.resolvedLanguage || i18n.language;

  if (loading) {
    return (
      <div className="tc-card tc-card-skeleton" aria-hidden="true">
        <div className="tc-card-skel-head" />
        <div className="tc-card-skel-body" />
        <div className="tc-card-skel-btn" />
      </div>
    );
  }

  const now = new Date();

  // Find arrived, unopened letters first
  const arrived = capsules.filter((c) => c.status !== 'opened' && isArrived(c, now));
  
  // Find sealed, unarrived letters sorted by soonest delivery
  const sealed = capsules
    .filter((c) => c.status !== 'opened' && !isArrived(c, now))
    .sort((a, b) => (toDate(a.deliverAt)?.getTime() || 0) - (toDate(b.deliverAt)?.getTime() || 0));

  const nearestSealed = sealed[0];
  const nearestDays = nearestSealed ? daysUntil(toDate(nearestSealed.deliverAt), now) : null;
  const writtenDate = nearestSealed ? toDate(nearestSealed.sealedAt || nearestSealed.createdAt) : null;
  const deliverDate = nearestSealed ? toDate(nearestSealed.deliverAt) : null;

  // 1. ARRIVED STATE: Priority celebratory card
  if (arrived.length > 0) {
    const letterToOpen = arrived[0];
    const letterWrittenDate = toDate(letterToOpen.sealedAt || letterToOpen.createdAt);
    return (
      <section className="tc-card is-arrived" aria-label={t('timeCapsule.tileArrivedAria', 'A letter from your past self has arrived')}>
        <div className="tc-card-ambient" aria-hidden="true" />
        
        <div className="tc-card-head">
          <div className="tc-card-badge is-arrived-badge">
            <TimeLetterIcon size={14} variant="arrived" />
            <span>{t('timeCapsule.readyBadge', 'Ready to Open')}</span>
          </div>
          <span className="tc-card-count">
            {arrived.length > 1
              ? t('timeCapsule.lettersArrivedCount', '{{count}} letters waiting', { count: arrived.length })
              : t('timeCapsule.deliveredToday', 'Delivered')}
          </span>
        </div>

        <div className="tc-card-body">
          <div
            className="tc-card-seal-wrap"
            onClick={() => { hapticService.medium?.(); onOpenReveal?.(letterToOpen); }}
            role="button"
            tabIndex={0}
            aria-label={t('timeCapsule.breakSeal', 'Break the seal')}
          >
            <div className="tc-card-wax-seal is-arrived-seal">
              <TimeLetterIcon size={28} variant="arrived" />
              <span className="tc-card-seal-glow" aria-hidden="true" />
            </div>
          </div>
          <div className="tc-card-content">
            <h3 className="tc-card-title">{t('timeCapsule.tileArrivedTitle', 'A letter has arrived')}</h3>
            <p className="tc-card-desc">
              {letterWrittenDate
                ? t('timeCapsule.tileArrivedDescWithDate', 'Written on {{date}}. Break the seal to read your past thoughts and discover what Miro observed since.', { date: formatDate(letterWrittenDate, lng) })
                : t('timeCapsule.tileArrivedSub', 'From your past self · Tap to break the seal')}
            </p>
          </div>
        </div>

        <div className="tc-card-actions">
          <button
            type="button"
            className="tc-card-btn tc-card-btn-primary is-arrived-btn"
            onClick={() => {
              hapticService.medium?.();
              onOpenReveal?.(letterToOpen);
            }}
          >
            <Sparkles size={16} />
            <span>{t('timeCapsule.breakSealCta', 'Break Seal & Reveal')}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </section>
    );
  }

  // 2. SEALED STATE: Prominent in-transit countdown card
  if (nearestSealed) {
    return (
      <section className="tc-card is-sealed" aria-label={t('timeCapsule.tileSealedAria', 'You have a letter sealed in time')}>
        <div className="tc-card-ambient" aria-hidden="true" />

        <div className="tc-card-head">
          <div className="tc-card-badge is-sealed-badge">
            <TimeLetterIcon size={13} variant="sealed" />
            <span>{t('timeCapsule.sealedBadge', 'Sealed in Time')}</span>
          </div>
          <span className="tc-card-count">
            {sealed.length > 1
              ? t('timeCapsule.sealedCount', '{{count}} sealed', { count: sealed.length })
              : t('timeCapsule.horizonDays', '{{count}} days', { count: nearestSealed.horizonDays || 30 })}
          </span>
        </div>

        <div className="tc-card-body">
          <div
            className="tc-card-seal-wrap"
            onClick={() => { hapticService.light?.(); onOpenCompose?.(); }}
            role="button"
            tabIndex={0}
            aria-label={t('timeCapsule.tileSealedAria', 'View sealed letter')}
          >
            <div className="tc-card-wax-seal is-sealed-seal">
              <TimeLetterIcon size={26} variant="sealed" />
            </div>
          </div>
          <div className="tc-card-content">
            <div className="tc-card-countdown-row">
              <span className="tc-card-countdown-num">
                {nearestDays === 0 ? '0' : nearestDays}
              </span>
              <span className="tc-card-countdown-label">
                {nearestDays === 0
                  ? t('timeCapsule.arrivesToday', 'Arrives today')
                  : t('timeCapsule.daysRemaining', 'days until delivery')}
              </span>
            </div>
            <p className="tc-card-desc">
              {deliverDate
                ? t('timeCapsule.sealedDescDetailed', 'Stored in quiet safety until {{date}}. Miro will add a reflection on what changed.', { date: formatDate(deliverDate, lng) })
                : t('timeCapsule.tileSealedSub', 'Stored in quiet safety · Tap to manage or write another')}
            </p>
          </div>
        </div>

        <div className="tc-card-actions">
          <button
            type="button"
            className="tc-card-btn tc-card-btn-glass"
            onClick={() => {
              hapticService.light?.();
              onOpenCompose?.();
            }}
          >
            <Clock size={15} />
            <span>{t('timeCapsule.viewCapsulesCta', 'View Sealed Letters')}</span>
          </button>

          <button
            type="button"
            className="tc-card-btn tc-card-btn-secondary"
            onClick={() => {
              hapticService.light?.();
              onOpenCompose?.();
            }}
            title={t('timeCapsule.writeAnother', 'Write another')}
          >
            <Plus size={15} />
            <span>{t('timeCapsule.writeAnotherShort', 'Write New')}</span>
          </button>
        </div>
      </section>
    );
  }

  // 3. EMPTY STATE: Large, inspiring invitation card
  return (
    <section className="tc-card is-empty" aria-label={t('timeCapsule.tileEmptyAria', 'Write a letter to your future self')}>
      <div className="tc-card-ambient" aria-hidden="true" />

      <div className="tc-card-head">
        <div className="tc-card-badge is-empty-badge">
          <TimeLetterIcon size={14} variant="empty" />
          <span>{t('timeCapsule.newBadge', 'Time Capsule')}</span>
        </div>
        <span className="tc-card-horizon-hint">
          {t('timeCapsule.horizonChoices', '30 · 90 · 365 Days')}
        </span>
      </div>

      <div className="tc-card-body">
        <div
          className="tc-card-seal-wrap"
          onClick={() => { hapticService.light?.(); onOpenCompose?.(); }}
          role="button"
          tabIndex={0}
          aria-label={t('timeCapsule.tileEmptyAria', 'Write a letter to your future self')}
        >
          <div className="tc-card-wax-seal is-empty-seal">
            <TimeLetterIcon size={26} variant="empty" />
          </div>
        </div>
        <div className="tc-card-content">
          <h3 className="tc-card-title">{t('timeCapsule.tileEmptyTitle', 'Letter to your future self')}</h3>
          <p className="tc-card-desc">
            {t('timeCapsule.tileEmptyExpandedDesc', 'Write down what you hope, what you fear, and what you want to remember. Miro seals it in time and reflects with you on the day it arrives.')}
          </p>
        </div>
      </div>

      <div className="tc-card-actions">
        <button
          type="button"
          className="tc-card-btn tc-card-btn-primary"
          onClick={() => {
            hapticService.light?.();
            onOpenCompose?.();
          }}
        >
          <PenTool size={15} />
          <span>{t('timeCapsule.writeLetterCta', 'Write to Future Self')}</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </section>
  );
};

export default TimeCapsuleTile;
