// src/components/common/WhatsNew.jsx
// "What's New" pill under the theme/language toggles on the Home screen.
// Opens a glassy announcement for the new Kairos Moments path.
// Rendered through a portal: the hero header is transform-animated, which
// would otherwise trap this fixed overlay inside it and let later sections
// (week strip dots etc.) paint on top.
// A small dot marks the pill until opened once per announcement (localStorage).

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Gift, X, Hourglass, Mic, Palette, Ticket, ArrowRight } from 'lucide-react';
import '../../styles/components/whatsNew.css';

const SEEN_KEY = 'kairos_whats_new_seen';
const ANNOUNCEMENT_ID = 'kairos-moments'; // bump when announcing something new

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
        className="whats-new-sheet"
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
          <Hourglass size={28} />
        </div>

        <span className="whats-new-eyebrow">{t('whatsNew.eyebrow', 'New exclusive path')}</span>
        <h2 className="whats-new-title">{t('whatsNew.pathTitle', 'Kairos Moments')}</h2>
        <p className="whats-new-text">
          {t('whatsNew.pathText', 'The path the app is named for — 9 days on the art of the opportune moment: recognizing it, waiting for it, seizing it.')}
        </p>

        <ul className="whats-new-perks">
          <li>
            <Mic size={15} />
            <span>{t('whatsNew.perkChoice', 'You choose each day: speak it or draw it')}</span>
          </li>
          <li>
            <Palette size={15} />
            <span>{t('whatsNew.perkPrompts', 'Nine carefully crafted prompts, one arc')}</span>
          </li>
          <li>
            <Ticket size={15} />
            <span>{t('whatsNew.perkPrice', 'One-time unlock for €2.99 — or an invite code')}</span>
          </li>
        </ul>

        <button className="whats-new-cta" onClick={goToPath}>
          {t('whatsNew.cta', 'See the path')}
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
