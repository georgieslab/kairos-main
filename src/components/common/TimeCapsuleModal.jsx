// src/components/common/TimeCapsuleModal.jsx
//
// One portal modal with two views:
//   compose — write a letter, choose when it arrives, seal it; below that, the
//             letters already sealed (date only, never contents) and the ones
//             already opened (rereadable).
//   reveal  — break the seal on an arrived letter, read it, then Miro's note
//             on what changed since.

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { X, Mail, MailOpen, Lock, Trash2, ArrowLeft, RotateCcw } from 'lucide-react';
import {
  HORIZONS, devHorizonAvailable, computeDeliverAt, isArrived, daysUntil, toDate,
  sealCapsule, deleteCapsule, markOpened, generateMiroNote
} from '../../services/timeCapsuleService';
import hapticService from '../../services/hapticService';
import MiroMark from './MiroMark';
import MiroThinking from './MiroThinking';
import '../../styles/components/timeCapsule.css';

const formatDate = (d, lng) =>
  d ? d.toLocaleDateString(lng, { day: 'numeric', month: 'long', year: 'numeric' }) : '';

const TimeCapsuleModal = ({
  uid,
  initialView = 'compose',
  initialCapsule = null,
  capsules = [],
  entries = [],
  onClose,
  onChanged
}) => {
  const { t, i18n } = useTranslation('journey');
  const lng = i18n.resolvedLanguage || i18n.language;

  const [view, setView] = useState(initialView);
  const [active, setActive] = useState(initialCapsule);

  // Compose state
  const [body, setBody] = useState('');
  const [horizon, setHorizon] = useState(90);
  const [isSealing, setIsSealing] = useState(false);
  const [sealedInfo, setSealedInfo] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Reveal state
  const [sealBroken, setSealBroken] = useState(initialCapsule?.status === 'opened');
  const [note, setNote] = useState(initialCapsule?.miroNote || null);
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteError, setNoteError] = useState(null);

  const [error, setError] = useState(null);
  const textRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  useEffect(() => {
    if (view === 'compose' && !sealedInfo) textRef.current?.focus();
  }, [view, sealedInfo]);

  // ---------------------------------------------------------------- compose
  const handleSeal = async () => {
    if (!body.trim() || isSealing) return;
    setIsSealing(true);
    setError(null);
    try {
      const { deliverAt } = await sealCapsule(uid, {
        body,
        horizon,
        entries,
        notificationText: {
          title: t('timeCapsule.notifyTitle', 'A letter has arrived'),
          body: t('timeCapsule.notifyBody', 'Something you wrote to yourself is ready to be opened.')
        }
      });
      hapticService.success?.();
      setSealedInfo({ deliverAt });
      setBody('');
      onChanged?.();
    } catch (e) {
      console.error('Could not seal letter:', e);
      setError(t('timeCapsule.sealFailed', "That didn't seal. Your words are still here — try again in a moment."));
    } finally {
      setIsSealing(false);
    }
  };

  const handleDelete = async (capsule) => {
    if (confirmDelete !== capsule.id) {
      setConfirmDelete(capsule.id);
      return;
    }
    try {
      await deleteCapsule(uid, capsule.id);
      hapticService.light?.();
      setConfirmDelete(null);
      onChanged?.();
    } catch (e) {
      console.error('Could not delete letter:', e);
      setError(t('timeCapsule.deleteFailed', "That letter couldn't be deleted. Try again in a moment."));
    }
  };

  // ----------------------------------------------------------------- reveal
  const loadNote = async (capsule) => {
    if (capsule.miroNote) { setNote(capsule.miroNote); return; }
    setNoteLoading(true);
    setNoteError(null);
    try {
      const n = await generateMiroNote(uid, capsule, entries);
      setNote(n);
      onChanged?.();
    } catch (e) {
      console.error('Miro note failed:', e);
      setNoteError(
        e?.code === 'free-allowance-exhausted'
          ? t('timeCapsule.noteAllowance', "Miro can't add a note right now — your free analyses for this month are used. The letter is yours either way; come back next month for the note.")
          : t('timeCapsule.noteFailed', "Miro's note didn't come through. Your letter is safe.")
      );
    } finally {
      setNoteLoading(false);
    }
  };

  const openLetter = (capsule) => {
    setActive(capsule);
    setSealBroken(capsule.status === 'opened');
    setNote(capsule.miroNote || null);
    setNoteError(null);
    setView('reveal');
    if (capsule.status === 'opened') loadNote(capsule);
  };

  const breakSeal = async () => {
    if (!active) return;
    hapticService.medium?.();
    setSealBroken(true);
    try {
      const opened = await markOpened(uid, active);
      setActive(opened);
      onChanged?.();
      loadNote(opened);
    } catch (e) {
      console.error('Could not open letter:', e);
      setError(t('timeCapsule.openFailed', "The seal wouldn't break. Try again in a moment."));
      setSealBroken(false);
    }
  };

  // ------------------------------------------------------------------ lists
  const now = new Date();
  const sealed = capsules.filter((c) => c.status !== 'opened' && !isArrived(c, now));
  const arrived = capsules.filter((c) => c.status !== 'opened' && isArrived(c, now));
  const opened = capsules
    .filter((c) => c.status === 'opened')
    .sort((a, b) => (toDate(b.openedAt)?.getTime() || 0) - (toDate(a.openedAt)?.getTime() || 0));

  const previewDate = computeDeliverAt(horizon);

  const horizonLabel = (h) =>
    h === 'dev'
      ? t('timeCapsule.horizonDev', '1 min (dev)')
      : h === 365
        ? t('timeCapsule.horizonYear', '1 year')
        : t('timeCapsule.horizonDays', '{{count}} days', { count: h });

  // ----------------------------------------------------------------- render
  const renderCompose = () => (
    <>
      <header className="tc-head">
        <div className="tc-head-icon"><Mail size={18} /></div>
        <div>
          <h2 className="tc-title">{t('timeCapsule.composeTitle', 'A letter to your future self')}</h2>
          <p className="tc-sub">{t('timeCapsule.composeSub', "Sealed until the day you choose. You won't be able to read it before then.")}</p>
        </div>
      </header>

      {sealedInfo ? (
        <div className="tc-sealed-confirm" role="status">
          <div className="tc-wax" aria-hidden="true"><Lock size={22} /></div>
          <p className="tc-sealed-title">{t('timeCapsule.sealedTitle', 'Sealed.')}</p>
          <p className="tc-sealed-sub">
            {t('timeCapsule.sealedSub', 'It will find you on {{date}}.', { date: formatDate(sealedInfo.deliverAt, lng) })}
          </p>
          <div className="tc-actions">
            <button type="button" className="tc-btn tc-btn-ghost" onClick={() => setSealedInfo(null)}>
              {t('timeCapsule.writeAnother', 'Write another')}
            </button>
            <button type="button" className="tc-btn tc-btn-primary" onClick={onClose}>
              {t('timeCapsule.done', 'Done')}
            </button>
          </div>
        </div>
      ) : (
        <>
          <textarea
            ref={textRef}
            className="tc-paper"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={8000}
            placeholder={t('timeCapsule.placeholder', "Dear me,\n\nRight now I'm…\nWhat I hope has changed by the time you read this…\nWhat I'm afraid of…")}
            disabled={isSealing}
          />

          <div className="tc-horizon" role="radiogroup" aria-label={t('timeCapsule.whenLabel', 'When should it arrive?')}>
            <span className="tc-horizon-label">{t('timeCapsule.whenLabel', 'When should it arrive?')}</span>
            <div className="tc-horizon-chips">
              {[...HORIZONS, ...(devHorizonAvailable() ? ['dev'] : [])].map((h) => (
                <button
                  key={h}
                  type="button"
                  role="radio"
                  aria-checked={horizon === h}
                  className={`tc-chip${horizon === h ? ' is-active' : ''}`}
                  onClick={() => { setHorizon(h); hapticService.selectionChanged?.(); }}
                  disabled={isSealing}
                >
                  {horizonLabel(h)}
                </button>
              ))}
            </div>
            <span className="tc-horizon-date">
              {t('timeCapsule.arrivesOn', 'Arrives {{date}}', { date: formatDate(previewDate, lng) })}
            </span>
          </div>

          <div className="tc-actions">
            <button
              type="button"
              className="tc-btn tc-btn-primary"
              onClick={handleSeal}
              disabled={!body.trim() || isSealing}
            >
              <Lock size={15} />
              {isSealing ? t('timeCapsule.sealing', 'Sealing…') : t('timeCapsule.seal', 'Seal the letter')}
            </button>
          </div>
        </>
      )}

      {(arrived.length > 0 || sealed.length > 0 || opened.length > 0) && (
        <section className="tc-lists">
          {arrived.length > 0 && (
            <>
              <h3 className="tc-list-title">{t('timeCapsule.arrivedList', 'Arrived')}</h3>
              {arrived.map((c) => (
                <button key={c.id} type="button" className="tc-row is-arrived" onClick={() => openLetter(c)}>
                  <Mail size={15} />
                  <span className="tc-row-main">{t('timeCapsule.fromDate', 'From {{date}}', { date: formatDate(toDate(c.sealedAt || c.createdAt), lng) })}</span>
                  <span className="tc-row-meta">{t('timeCapsule.tapToOpen', 'Tap to open')}</span>
                </button>
              ))}
            </>
          )}

          {sealed.length > 0 && (
            <>
              <h3 className="tc-list-title">{t('timeCapsule.sealedList', 'Sealed')}</h3>
              {sealed.map((c) => {
                const at = toDate(c.deliverAt);
                const days = at ? daysUntil(at, now) : null;
                return (
                  <div key={c.id} className="tc-row is-sealed">
                    <Lock size={14} />
                    <span className="tc-row-main">
                      {days === 0
                        ? t('timeCapsule.arrivesToday', 'Arrives today')
                        : t('timeCapsule.arrivesIn', 'Arrives in {{count}} days', { count: days })}
                    </span>
                    <span className="tc-row-meta">{formatDate(at, lng)}</span>
                    <button
                      type="button"
                      className={`tc-row-delete${confirmDelete === c.id ? ' is-confirm' : ''}`}
                      onClick={() => handleDelete(c)}
                      onBlur={() => setConfirmDelete(null)}
                      aria-label={t('timeCapsule.delete', 'Delete letter')}
                    >
                      {confirmDelete === c.id ? t('timeCapsule.confirmDelete', 'Delete unread?') : <Trash2 size={14} />}
                    </button>
                  </div>
                );
              })}
            </>
          )}

          {opened.length > 0 && (
            <>
              <h3 className="tc-list-title">{t('timeCapsule.openedList', 'Opened')}</h3>
              {opened.map((c) => (
                <button key={c.id} type="button" className="tc-row is-opened" onClick={() => openLetter(c)}>
                  <MailOpen size={15} />
                  <span className="tc-row-main">{t('timeCapsule.fromDate', 'From {{date}}', { date: formatDate(toDate(c.sealedAt || c.createdAt), lng) })}</span>
                  <span className="tc-row-meta">{t('timeCapsule.reread', 'Read again')}</span>
                </button>
              ))}
            </>
          )}
        </section>
      )}
    </>
  );

  const renderReveal = () => {
    if (!active) return null;
    const sealedAt = toDate(active.sealedAt || active.createdAt);
    return (
      <>
        <header className="tc-head">
          <button type="button" className="tc-back" onClick={() => setView('compose')} aria-label={t('timeCapsule.back', 'Back')}>
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="tc-title">{t('timeCapsule.revealTitle', 'A letter from your past self')}</h2>
            <p className="tc-sub">{t('timeCapsule.writtenOn', 'Written {{date}}', { date: formatDate(sealedAt, lng) })}</p>
          </div>
        </header>

        {!sealBroken ? (
          <div className="tc-envelope">
            <div className="tc-envelope-body">
              <button type="button" className="tc-wax tc-wax-button" onClick={breakSeal} aria-label={t('timeCapsule.breakSeal', 'Break the seal')}>
                <Lock size={24} />
              </button>
            </div>
            <button type="button" className="tc-btn tc-btn-primary" onClick={breakSeal}>
              {t('timeCapsule.breakSeal', 'Break the seal')}
            </button>
          </div>
        ) : (
          <div className="tc-reveal">
            <article className="tc-letter">
              {active.body.split('\n').map((line, i) => (
                <p key={i}>{line || '\u00A0'}</p>
              ))}
            </article>

            <div className="tc-miro">
              <div className="tc-miro-head">
                <MiroMark size={22} />
                <span>{t('timeCapsule.miroSince', 'Miro · since then')}</span>
              </div>
              {noteLoading && (
                <div className="tc-miro-loading" role="status" aria-label={t('timeCapsule.miroReading', 'Miro is reading what you wrote since…')}>
                  <MiroThinking size={28} />
                  <span>{t('timeCapsule.miroReading', 'Miro is reading what you wrote since…')}</span>
                </div>
              )}
              {note && <p className="tc-miro-note">{note}</p>}
              {noteError && (
                <div className="tc-miro-error">
                  <p>{noteError}</p>
                  <button type="button" className="tc-btn tc-btn-ghost" onClick={() => loadNote(active)}>
                    <RotateCcw size={13} />
                    {t('timeCapsule.retry', 'Try again')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  return createPortal(
    <div className="tc-overlay" onClick={onClose}>
      <div
        className="tc-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t('timeCapsule.composeTitle', 'A letter to your future self')}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="tc-close" onClick={onClose} aria-label={t('timeCapsule.close', 'Close')}>
          <X size={18} />
        </button>
        {view === 'reveal' ? renderReveal() : renderCompose()}
        {error && <p className="tc-error">{error}</p>}
      </div>
    </div>,
    document.body
  );
};

export default TimeCapsuleModal;
