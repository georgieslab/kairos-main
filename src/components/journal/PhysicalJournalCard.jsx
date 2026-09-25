// src/components/journal/PhysicalJournalCard.jsx
// Luxury Apple Spatial Glass card showing the connected physical Καιρός journal
// Displays edition tier, stamped gold foil serial, and live NFC readiness.

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Crown, Star, Radio, Sparkles, ChevronRight, PenTool, WifiOff, Loader2 } from 'lucide-react';
import { useNFC } from '../../hooks/useNFC';
import { getJournalDetails } from '../../services/journalService';
import hapticService from '../../services/hapticService';
import '../../styles/components/physicalJournalCard.css';

const TIER_META = {
  legacy: {
    name: 'Legacy Collection',
    icon: Crown,
    color: '#C9A961',
    glowRgb: '201, 169, 97',
    badgeClass: 'pjc-tier-legacy'
  },
  insight: {
    name: 'Insight Edition',
    icon: Star,
    color: '#3b82f6',
    glowRgb: '59, 130, 246',
    badgeClass: 'pjc-tier-insight'
  },
  essential: {
    name: 'Essential Edition',
    icon: BookOpen,
    color: '#558B6E',
    glowRgb: '85, 139, 110',
    badgeClass: 'pjc-tier-essential'
  }
};

const PhysicalJournalCard = ({
  userProfile,
  onOpenRegistration,
  onOpenJournalsList,
  navigateToScreen
}) => {
  const { t } = useTranslation(['home', 'journal']);
  const nfc = useNFC();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const journals = userProfile?.journals || [];
  const primaryId = userProfile?.primaryJournalId || journals[0];
  const hasJournals = journals.length > 0 && !!primaryId;

  useEffect(() => {
    if (!hasJournals || !primaryId) return;

    let cancelled = false;
    setLoading(true);

    getJournalDetails(primaryId)
      .then((data) => {
        if (!cancelled) {
          setDetails(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('Could not load physical journal details:', err);
        if (!cancelled) {
          setDetails(null);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [primaryId, hasJournals]);

  // Handle Quick-Write / Tap to Write
  const handleWriteAction = () => {
    hapticService.medium?.();
    if (nfc.isAvailable && nfc.isEnabled && !nfc.isReading) {
      nfc.startReading({ alertMessage: t('physicalJournal.nfcReady', 'Hold phone near journal cover to scan') });
    }
    navigateToScreen('write', { journalId: primaryId, fromPhysicalCard: true });
  };

  const handlePairClick = () => {
    hapticService.light?.();
    if (onOpenRegistration) onOpenRegistration();
  };

  const handleCollectionClick = () => {
    hapticService.light?.();
    if (onOpenJournalsList) onOpenJournalsList();
  };

  // State 1: User has NO registered physical journals yet
  if (!hasJournals) {
    return (
      <section className="pjc-card pjc-card-unregistered">
        <div className="pjc-ambient-aura" aria-hidden="true" />
        
        <div className="pjc-unregistered-inner">
          <div className="pjc-emblem-wrap">
            <div className="pjc-emblem-ring" aria-hidden="true" />
            <div className="pjc-emblem-icon">
              <Radio size={22} />
            </div>
          </div>

          <div className="pjc-unregistered-body">
            <div className="pjc-eyebrow-row">
              <span className="pjc-eyebrow-spark">✦</span>
              <span className="pjc-eyebrow">{t('physicalJournal.title', 'Physical Journal')}</span>
            </div>
            <h3 className="pjc-unregistered-title">
              {t('physicalJournal.pairPromptTitle', 'Connect Your Physical Journal')}
            </h3>
            <p className="pjc-unregistered-desc">
              {t('physicalJournal.pairPromptDesc', "Tap your journal's brass NFC seal to bind your physical pages with Miro AI.")}
            </p>
          </div>

          <button
            type="button"
            className="pjc-pair-btn"
            onClick={handlePairClick}
            aria-label={t('physicalJournal.pairAction', 'Pair Journal')}
          >
            <Sparkles size={14} className="pjc-pair-btn-icon" />
            <span>{t('physicalJournal.pairAction', 'Pair Journal')}</span>
            <ChevronRight size={14} className="pjc-pair-btn-arrow" />
          </button>
        </div>
      </section>
    );
  }

  // State 2: User HAS a registered physical journal
  const tier = details?.tier || 'essential';
  const meta = TIER_META[tier] || TIER_META.essential;
  const TierIcon = meta.icon;
  const serial = details?.metadata?.serialNumber || primaryId;

  // Format Serial cleanly (e.g. KAI-0492 or truncated hash)
  const displaySerial = serial.length > 14 ? `${serial.slice(0, 10)}…` : serial;

  return (
    <section 
      className={`pjc-card pjc-card-registered ${meta.badgeClass}`}
      style={{ '--pjc-glow': meta.glowRgb, '--pjc-color': meta.color }}
    >
      <div className="pjc-ambient-aura" aria-hidden="true" />

      <div className="pjc-content-grid">
        {/* Left: Tactile Journal Silhouette / Medallion */}
        <div className="pjc-medallion-col">
          <div className="pjc-medallion">
            <div className="pjc-medallion-seal">
              <TierIcon size={20} className="pjc-tier-icon" />
            </div>
            <div className="pjc-medallion-lines" aria-hidden="true">
              <span /><span /><span />
            </div>
          </div>
        </div>

        {/* Center: Journal Identity & NFC Status */}
        <div className="pjc-info-col">
          <div className="pjc-title-row">
            <span className="pjc-edition-name">{t(`registration.tiers.${tier}.name`, meta.name)}</span>
            <span className="pjc-serial-badge" title={`Serial: ${serial}`}>
              <span className="pjc-serial-prefix">{t('physicalJournal.serialLabel', 'Serial')}:</span>
              <span className="pjc-serial-number">{displaySerial}</span>
            </span>
          </div>

          {/* Live NFC Status line */}
          <div className="pjc-status-row">
            {nfc.isReading ? (
              <div className="pjc-nfc-status is-scanning">
                <span className="pjc-status-radar" aria-hidden="true" />
                <Loader2 size={13} className="pjc-spin-icon" />
                <span>{t('physicalJournal.nfcScanning', 'Scanning NFC tag...')}</span>
              </div>
            ) : nfc.isAvailable && nfc.isEnabled ? (
              <div className="pjc-nfc-status is-ready">
                <span className="pjc-status-dot pulse-green" aria-hidden="true" />
                <span>{t('physicalJournal.nfcReady', 'NFC Ready · Tap book to write')}</span>
              </div>
            ) : nfc.isAvailable && !nfc.isEnabled ? (
              <button 
                type="button" 
                className="pjc-nfc-status is-disabled-btn" 
                onClick={nfc.openSettings}
              >
                <span className="pjc-status-dot dot-orange" aria-hidden="true" />
                <span>{t('physicalJournal.nfcDisabled', 'NFC Disabled in Settings')}</span>
              </button>
            ) : (
              <div className="pjc-nfc-status is-manual">
                <span className="pjc-status-dot dot-gold" aria-hidden="true" />
                <span>{t('physicalJournal.nfcNotAvailable', 'Manual Sync Available')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions (Write & Manage Collection) */}
        <div className="pjc-actions-col">
          <button
            type="button"
            className="pjc-write-cta"
            onClick={handleWriteAction}
            title={t('physicalJournal.nfcTapToWrite', 'Tap to Write')}
            aria-label={t('physicalJournal.nfcTapToWrite', 'Tap to Write')}
          >
            <PenTool size={14} className="pjc-write-icon" />
            <span className="pjc-write-label">{t('physicalJournal.nfcTapToWrite', 'Tap to Write')}</span>
          </button>

          {journals.length > 1 && (
            <button
              type="button"
              className="pjc-collection-link"
              onClick={handleCollectionClick}
              title={t('physicalJournal.manageCollection', 'My Collection')}
            >
              <span>{journals.length} {t('physicalJournal.title', 'Journals')}</span>
              <ChevronRight size={12} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default PhysicalJournalCard;

