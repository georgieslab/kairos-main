// src/components/common/WhatsNew.jsx
// "What's New" pill under the theme/language toggles on the Home screen.
// Opens a glassy announcement — now the complete 3-path Kairos Collection.
// Rendered through a portal: the hero header is transform-animated, which
// would otherwise trap this fixed overlay inside it and let later sections
// (week strip dots etc.) paint on top.
// A small dot marks the pill until opened once per announcement (localStorage).

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Gift, X, Hourglass, Shuffle, Sparkles, ArrowRight, Ticket } from 'lucide-react';
import '../../styles/components/whatsNew.css';

const SEEN_KEY = 'kairos_whats_new_seen';
const ANNOUNCEMENT_ID = 'kairos-collection'; // bump when announcing something new

// The complete Kairos trilogy — names are brand (untranslated); descriptions
// and framing come from i18n. Colours mirror each path's registry colour.
const COLLECTION = [
  { icon: Hourglass, color: '212, 175, 55', name: 'Kairos Moments', descKey: 'whatsNew.momentsDesc', desc: 'Recognize the opportune moment' },
  { icon: Shuffle, color: '230, 145, 90', name: 'Kairos Cards', descKey: 'whatsNew.cardsDesc', desc: 'Deal yourself the prompt' },
  { icon: Sparkles, color: '244, 197, 102', name: 'Kairos Sparks', descKey: 'whatsNew.sparksDesc', desc: 'One spark — wherever it takes you' },
];

const WhatsNew = ({ navigateToScreen }) => {
  const { t } = useTranslation('journey');
  const [isOpen, setIsOpen] = useState(false);
  const [seen, setSeen] = useState(() => {
    try { return localStorage.getItem(SEEN_KEY); } catch { return ANNOUNCEMENT_ID; }
  });

  const hasUnseen = seen !== ANNOUNCEMENT_ID;

  const open = () => {
    setIsOpen(true);
    try { localStorage.setItem(SEEN_KEY, ANNOUNCEMENT_ID); } catch { /* private mode */ }
    setSeen(ANNOUNCEMENT_ID);
  };

  const goToPath = () => {
    setIsOpen(false);
    navigateToScreen && navigateToScreen('path-selection');
  };

  const modal = (
    <div className="whats-new-overlay" onClick={() => setIsOpen(false)}>
      <div
        className="whats-new-sheet whats-new-sheet--collection"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t('whatsNew.title', "What's New")}
      >
        <button
          className="whats-new-close"
          onClick={() => setIsOpen(false)}
          aria-label={t('whatsNew.close', 'Close')}
        >
          <X size={18} />
        </button>

        <div className="whats-new-halo">
          <Sparkles size={26} />
        </div>

        <span className="whats-new-eyebrow">{t('whatsNew.eyebrow', 'The Kairos Collection')}</span>
        <h2 className="whats-new-title">{t('whatsNew.collectionTitle', 'Three paths, one moment')}</h2>
        <p className="whats-new-text">
          {t('whatsNew.collectionText', 'Three ways to meet the moment — the collection is complete.')}
        </p>

        <div className="wn-collection">
          {COLLECTION.map(({ icon: Icon, color, name, descKey, desc }) => (
            <div key={name} className="wn-path-row" style={{ '--pc': color }}>
              <div className="wn-path-icon"><Icon size={18} /></div>
              <div className="wn-path-text">
                <span className="wn-path-name">{name}</span>
                <span className="wn-path-desc">{t(descKey, desc)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="wn-price">
          <span className="wn-price-badge">{t('whatsNew.priceMain', '€2.99')}</span>
          <span className="wn-price-note">
            <Ticket size={13} />
            {t('whatsNew.priceNote', 'once — all three paths, yours forever. Or unlock with a promo code.')}
          </span>
        </div>

        <button className="whats-new-cta" onClick={goToPath}>
          {t('whatsNew.ctaCollection', 'Explore the collection')}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        className={`whats-new-pill${hasUnseen ? ' has-unseen' : ''}`}
        onClick={open}
        aria-label={t('whatsNew.title', "What's New")}
      >
        <Gift size={14} />
        {hasUnseen && <span className="whats-new-dot" aria-hidden="true" />}
      </button>

      {isOpen && createPortal(modal, document.body)}
    </>
  );
};

export default WhatsNew;
