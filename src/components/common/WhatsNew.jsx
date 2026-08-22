// src/components/common/WhatsNew.jsx
// "What's New" pill under the theme/language toggles on the Home screen.
// Opens a glassy announcement sheet. Rendered through a portal: the hero
// header is transform-animated, which would otherwise trap this fixed overlay
// inside it and let later sections (week strip dots etc.) paint on top.
// A small dot marks the pill until the newest announcement has been opened
// once (localStorage).
//
// This was a single hardcoded announcement. It is a deck now, newest first,
// because announcements accumulate — the Kairos Collection is still worth
// showing to someone who has never seen it, and replacing it outright would
// have thrown that away every time something new shipped.

import React, { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
  Gift, X, Hourglass, Shuffle, Sparkles, ArrowRight, Ticket,
  Plane, MessagesSquare, Home, ChevronLeft, ChevronRight, Route,
  HeartCrack, Scale, Infinity as InfinityIcon, Activity,
  MessageCircle, BookOpen, CalendarDays
} from 'lucide-react';
import '../../styles/components/whatsNew.css';

const SEEN_KEY = 'kairos_whats_new_seen';

// Bump to the newest slide's id when something ships. The unseen dot compares
// against this, so it reappears for everyone exactly once per announcement.
const ANNOUNCEMENT_ID = 'kairos-ai';

// Newest first. Path names are brand and stay untranslated; everything else
// runs through i18n with the English as fallback. Colours mirror each path's
// registry colour so a row here matches the card in the Paths tab.
//
// A slide is no longer necessarily a pack of paths for sale. Kairos AI is a
// feature, not a purchase, so `price` and the CTA's destination are per-slide —
// the deck used to hardcode "EUR 2.99, all three paths" beneath every slide,
// which would have priced a subscription feature as a one-off path bundle.
// Rows carry an optional nameKey: path names are brand and stay as written,
// feature names are prose and are translated.
// The three path packs are all the same one-off purchase, so it is written
// once. Kairos AI carries its own.
const PACK_PRICE = {
  icon: Ticket,
  badgeKey: 'whatsNew.priceMain', badge: '€2.99',
  noteKey: 'whatsNew.priceNote',  note: 'once — all three paths, yours forever. Or unlock with a promo code.',
};

const SLIDES = [
  {
    id: 'kairos-ai',
    halo: MessageCircle,
    // The app's own green, cooling through teal into blue — its palette, not a
    // pack's. This slide is about the app itself rather than something to buy.
    accent: ['85, 139, 110', '92, 138, 154', '108, 132, 176'],
    eyebrowKey: 'whatsNew.aiEyebrow',   eyebrow: 'New — Kairos AI',
    titleKey: 'whatsNew.aiTitle',       title: 'It talks back now',
    textKey: 'whatsNew.aiText',         text: 'Kairos AI has read your journal, and it answers from what is actually in it. On the Home screen.',
    ctaKey: 'whatsNew.aiCta',           cta: 'Try it',
    action: 'kairos-ai',
    rows: [
      { icon: BookOpen,      color: '85, 139, 110',  nameKey: 'whatsNew.aiReadsName',  name: 'It has read your entries',
        descKey: 'whatsNew.aiReadsDesc',  desc: 'Answers cite what you wrote, not generic advice' },
      { icon: MessagesSquare, color: '92, 138, 154', nameKey: 'whatsNew.aiThreadName', name: 'A real conversation',
        descKey: 'whatsNew.aiThreadDesc', desc: 'Ask again and go deeper — it remembers the thread' },
      { icon: CalendarDays,  color: '108, 132, 176', nameKey: 'whatsNew.aiKeptName',   name: 'Kept by the day',
        descKey: 'whatsNew.aiKeptDesc',   desc: "Today's conversation is still there when you come back" },
    ],
    price: {
      icon: Sparkles,
      badgeKey: 'whatsNew.aiPriceMain', badge: 'Free daily',
      noteKey: 'whatsNew.aiPriceNote',  note: 'one message every day at no cost. Unlimited with a subscription.',
    },
  },
  {
    id: 'pain',
    halo: HeartCrack,
    // Three sources of suffering rather than three shades of one: oxblood for
    // what you did, slate for what is true of being alive, ember for what your
    // body does. Sombre without being alarming — this pack should not look
    // like a warning.
    accent: ['134, 106, 106', '88, 96, 122', '168, 124, 116'],
    eyebrowKey: 'whatsNew.painEyebrow',    eyebrow: 'New — Pain',
    titleKey: 'whatsNew.painTitle',        title: 'Three kinds of pain',
    textKey: 'whatsNew.painText',          text: 'Divided by where the suffering comes from: what you did, what is true of being alive, and what your body does to you.',
    ctaKey: 'whatsNew.painCta',            cta: 'See the paths',
    rows: [
      { icon: Scale,        color: '134, 106, 106', name: 'Moral Pain',         descKey: 'whatsNew.moralDesc',       desc: 'What you did, or failed to prevent' },
      { icon: InfinityIcon, color: '88, 96, 122',   name: 'Existential Pain',   descKey: 'whatsNew.existentialDesc', desc: 'Dying, choosing, and whether it matters' },
      { icon: Activity,     color: '168, 124, 116', name: 'The Body That Hurts', descKey: 'whatsNew.bodyDesc',       desc: 'Chronic pain, and not being believed' },
    ],
    price: PACK_PRICE,
    action: 'paths',
  },
  {
    id: 'starting-over',
    halo: Route,
    // The three path colours, in the order the pack is meant to be read:
    // departure blue, the uncertain middle, settled amber. The sheet paints
    // them as one gradient, so the arc is visible before a word is read.
    accent: ['96, 125, 173', '142, 122, 178', '191, 145, 106'],
    eyebrowKey: 'whatsNew.soEyebrow',      eyebrow: 'New — Starting Over',
    titleKey: 'whatsNew.soTitle',          title: 'For anyone who began again',
    textKey: 'whatsNew.soText',            text: 'Three paths for people who moved country and started over. Written from the inside.',
    ctaKey: 'whatsNew.soCta',              cta: 'See the paths',
    rows: [
      { icon: Plane,          color: '96, 125, 173',  name: 'The Crossing',      descKey: 'whatsNew.crossingDesc', desc: 'Leaving, and the week nothing worked' },
      { icon: MessagesSquare, color: '142, 122, 178', name: 'Learning to Speak', descKey: 'whatsNew.speakDesc',    desc: 'Who you are without the words' },
      { icon: Home,           color: '191, 145, 106', name: 'Two Homes',         descKey: 'whatsNew.twoHomesDesc', desc: 'Belonging to neither, then to both' },
    ],
    price: PACK_PRICE,
    action: 'paths',
  },
  {
    id: 'kairos-collection',
    halo: Sparkles,
    accent: ['212, 175, 55', '230, 145, 90', '244, 197, 102'],
    eyebrowKey: 'whatsNew.eyebrow',         eyebrow: 'The Kairos Collection',
    titleKey: 'whatsNew.collectionTitle',   title: 'Three paths, one moment',
    textKey: 'whatsNew.collectionText',     text: 'Three ways to meet the moment — the collection is complete.',
    ctaKey: 'whatsNew.ctaCollection',       cta: 'Explore the collection',
    rows: [
      { icon: Hourglass, color: '212, 175, 55',  name: 'Kairos Moments', descKey: 'whatsNew.momentsDesc', desc: 'Recognize the opportune moment' },
      { icon: Shuffle,   color: '230, 145, 90',  name: 'Kairos Cards',   descKey: 'whatsNew.cardsDesc',   desc: 'Deal yourself the prompt' },
      { icon: Sparkles,  color: '244, 197, 102', name: 'Kairos Sparks',  descKey: 'whatsNew.sparksDesc',  desc: 'One spark — wherever it takes you' },
    ],
    price: PACK_PRICE,
    action: 'paths',
  },
];

const WhatsNew = ({ navigateToScreen }) => {
  const { t } = useTranslation('journey');
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [seen, setSeen] = useState(() => {
    try { return localStorage.getItem(SEEN_KEY); } catch { return ANNOUNCEMENT_ID; }
  });

  const hasUnseen = seen !== ANNOUNCEMENT_ID;
  const slide = SLIDES[index];
  const count = SLIDES.length;
  const HaloIcon = slide.halo;
  const PriceIcon = slide.price?.icon || Ticket;

  const open = () => {
    setIndex(0);                       // always land on the newest
    setIsOpen(true);
    try { localStorage.setItem(SEEN_KEY, ANNOUNCEMENT_ID); } catch { /* private mode */ }
    setSeen(ANNOUNCEMENT_ID);
  };

  const go = useCallback((delta) => {
    setIndex((i) => Math.min(count - 1, Math.max(0, i + delta)));
  }, [count]);

  // Escape closes, arrows move between slides. Bound only while open so the
  // Home screen keeps its own key handling the rest of the time.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, go]);

  // Where the CTA goes depends on what is being announced. A pack sends you to
  // the Paths tab to buy it; Kairos AI is already on the screen behind this
  // sheet, so it closes and brings the card into view instead of navigating
  // somewhere the user already is.
  const onCta = () => {
    setIsOpen(false);
    if (slide.action === 'kairos-ai') {
      // After the sheet unmounts, or the scroll competes with the overlay.
      setTimeout(() => {
        document.querySelector('.kai-card')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 140);
      return;
    }
    navigateToScreen && navigateToScreen('path-selection');
  };

  const modal = (
    <div className="whats-new-overlay" onClick={() => setIsOpen(false)}>
      <div
        className="whats-new-sheet whats-new-sheet--collection"
        style={{
          '--wn-a': slide.accent[0],
          '--wn-b': slide.accent[1],
          '--wn-c': slide.accent[2],
        }}
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

        {/* Keyed so the icon swaps with its slide rather than persisting
            across the transition. */}
        <div className="whats-new-halo" key={slide.id + '-halo'}>
          <HaloIcon size={26} />
        </div>

        {/* Keyed on the slide id so React swaps the subtree rather than
            mutating it in place, which lets the entrance animation replay. */}
        <div className="wn-slide" key={slide.id}>
          <span className="whats-new-eyebrow">{t(slide.eyebrowKey, slide.eyebrow)}</span>
          <h2 className="whats-new-title">{t(slide.titleKey, slide.title)}</h2>
          <p className="whats-new-text">{t(slide.textKey, slide.text)}</p>

          <div className="wn-collection">
            {slide.rows.map(({ icon: Icon, color, name, nameKey, descKey, desc }) => (
              <div key={name} className="wn-path-row" style={{ '--pc': color }}>
                <div className="wn-path-icon"><Icon size={18} /></div>
                <div className="wn-path-text">
                  {/* Path names are brand and stay as written. Feature names
                      are prose, so they carry a key and get translated. */}
                  <span className="wn-path-name">{nameKey ? t(nameKey, name) : name}</span>
                  <span className="wn-path-desc">{t(descKey, desc)}</span>
                </div>
              </div>
            ))}
          </div>

          {slide.price && (
            <div className="wn-price">
              <span className="wn-price-badge">{t(slide.price.badgeKey, slide.price.badge)}</span>
              <span className="wn-price-note">
                <PriceIcon size={13} />
                {t(slide.price.noteKey, slide.price.note)}
              </span>
            </div>
          )}
        </div>

        <button className="whats-new-cta" onClick={onCta}>
          {t(slide.ctaKey, slide.cta)}
          <ArrowRight size={16} />
        </button>

        {count > 1 && (
          <div className="wn-nav" role="group" aria-label={t('whatsNew.navLabel', 'Announcements')}>
            <button
              className="wn-arrow"
              onClick={() => go(-1)}
              disabled={index === 0}
              aria-label={t('whatsNew.prev', 'Previous')}
            >
              <ChevronLeft size={16} />
            </button>

            <div className="wn-dots">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  className={`wn-dot${i === index ? ' is-active' : ''}`}
                  onClick={() => setIndex(i)}
                  aria-label={t('whatsNew.goTo', 'Announcement {{n}}', { n: i + 1 })}
                  aria-current={i === index}
                />
              ))}
            </div>

            <button
              className="wn-arrow"
              onClick={() => go(1)}
              disabled={index === count - 1}
              aria-label={t('whatsNew.next', 'Next')}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
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
