// src/components/common/InboxComposerModal.jsx
//
// Apple Spatial Glass modal drawer for composing notes to Miro
// or dispatching sanctuary announcements and whispers.

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import {
  X,
  Sparkles,
  Send,
  Radio,
  User,
  Users,
  MessageCircle,
  BookOpen,
  Compass,
  CheckCircle2,
  AlertCircle,
  Eye,
  Loader2,
  Flame,
  ArrowRight,
} from 'lucide-react';
import TimeLetterIcon from './TimeLetterIcon';
import hapticService from '../../services/hapticService';
import {
  sendNoteToMiro,
  sendInboxMessage,
  broadcastInboxMessage,
} from '../../services/inboxService';
import '../../styles/components/inbox.css';

const CATEGORIES = [
  { id: 'whisper', labelKey: 'inbox.categoryWhisper', labelFallback: 'Whisper', icon: Sparkles },
  { id: 'miro_note', labelKey: 'inbox.categoryMiro', labelFallback: 'Miro Note', icon: Sparkles },
  { id: 'capsule', labelKey: 'inbox.categoryCapsule', labelFallback: 'Letter', icon: TimeLetterIcon },
  { id: 'milestone', labelKey: 'inbox.categoryMilestone', labelFallback: 'Milestone', icon: Flame },
];

const ACTIONS = [
  { id: 'none', labelKey: 'inbox.actionNone', labelFallback: 'None' },
  {
    id: 'open_voice',
    labelKey: 'inbox.reflectWithMiroCta',
    labelFallback: 'Reflect with Miro (Voice)',
    actionObj: {
      type: 'open_voice',
      labelKey: 'inbox.reflectWithMiroCta',
      labelFallback: 'Reflect with Miro',
    },
  },
  {
    id: 'open_journal',
    labelKey: 'inbox.actionJournal',
    labelFallback: 'Open Journal',
    actionObj: {
      type: 'open_journal',
      labelFallback: 'Open Journal',
    },
  },
  {
    id: 'navigate_analytics',
    labelKey: 'inbox.viewJourneyStatsCta',
    labelFallback: 'View Journey Stats',
    actionObj: {
      type: 'navigate_analytics',
      labelKey: 'inbox.viewJourneyStatsCta',
      labelFallback: 'View Journey Stats',
    },
  },
];

const InboxComposerModal = ({
  isOpen = false,
  onClose,
  userId,
  onMessageSent,
}) => {
  const { t } = useTranslation('journey');
  const { isDarkMode } = useTheme();

  // Mode: 'miro_note' (Note to Miro / Self) | 'dispatch' (Announcement Dispatch)
  const [mode, setMode] = useState('miro_note');

  // Miro Note Form State
  const [miroTitle, setMiroTitle] = useState('');
  const [miroBody, setMiroBody] = useState('');
  const [askMiro, setAskMiro] = useState(true);

  // Dispatch Form State
  const [dispatchTarget, setDispatchTarget] = useState('self'); // 'self' | 'user' | 'broadcast'
  const [targetUid, setTargetUid] = useState('');
  const [dispatchCategory, setDispatchCategory] = useState('whisper');
  const [dispatchAuthor, setDispatchAuthor] = useState('Miro');
  const [dispatchTitle, setDispatchTitle] = useState('');
  const [dispatchSubtitle, setDispatchSubtitle] = useState('');
  const [dispatchBody, setDispatchBody] = useState('');
  const [selectedActionId, setSelectedActionId] = useState('open_voice');

  // Status & UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // { type: 'success'|'error', message: string }
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const closeTimerRef = useRef(null);

  // Sync open state
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      setSubmitStatus(null);
    } else if (shouldRender && !isClosing) {
      setShouldRender(false);
    }
  }, [isOpen]);

  const triggerClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    hapticService.light?.();
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
      onClose?.();
    }, 220);
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Escape key
  useEffect(() => {
    if (!shouldRender || isClosing) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) triggerClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shouldRender, isClosing, isSubmitting]);

  // Derived preview data
  const previewData = useMemo(() => {
    if (mode === 'miro_note') {
      return {
        type: 'user_note',
        title: miroTitle.trim() || t('inbox.previewDefaultTitle', 'Personal Contemplation'),
        preview: miroBody.trim()
          ? miroBody.slice(0, 120) + (miroBody.length > 120 ? '...' : '')
          : t('inbox.previewDefaultBody', 'Your words and thoughts shared with Miro...'),
        author: t('inbox.authorYou', 'You'),
        date: new Date(),
        action: askMiro
          ? {
              labelFallback: t('inbox.previewMiroReplyBadge', 'Miro reflection pending'),
              type: 'open_voice',
            }
          : null,
      };
    } else {
      const actObj = ACTIONS.find((a) => a.id === selectedActionId)?.actionObj;
      return {
        type: dispatchCategory,
        title: dispatchTitle.trim() || t('inbox.previewDefaultTitle', 'Announcement Title'),
        preview: (dispatchSubtitle.trim() || dispatchBody.trim())
          ? (dispatchSubtitle.trim() || dispatchBody.slice(0, 120))
          : t('inbox.previewDefaultBody', 'Preview of the announcement or whisper...'),
        author: dispatchAuthor.trim() || 'Miro',
        date: new Date(),
        action: actObj,
      };
    }
  }, [
    mode,
    miroTitle,
    miroBody,
    askMiro,
    dispatchCategory,
    dispatchTitle,
    dispatchSubtitle,
    dispatchBody,
    dispatchAuthor,
    selectedActionId,
    t,
  ]);

  // Handle Note to Miro Submit
  const handleSubmitMiroNote = async (e) => {
    e.preventDefault();
    if (!miroBody.trim()) {
      setSubmitStatus({
        type: 'error',
        message: t('inbox.bodyRequiredError', 'Please write your reflection note before sending.'),
      });
      return;
    }

    if (!userId) {
      setSubmitStatus({
        type: 'error',
        message: t('inbox.userAuthRequired', 'Please sign in to send notes.'),
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    hapticService.medium?.();

    try {
      await sendNoteToMiro(userId, {
        title: miroTitle.trim() || t('inbox.defaultNoteTitle', 'Personal Note'),
        text: miroBody.trim(),
        askMiro,
      });

      hapticService.success?.();
      setSubmitStatus({
        type: 'success',
        message: askMiro
          ? t('inbox.noteToMiroSuccessWithAi', 'Note sent! Miro has observed your words and dropped a reflection note in your inbox.')
          : t('inbox.noteToMiroSuccess', 'Note saved to your sanctuary inbox.'),
      });

      setMiroTitle('');
      setMiroBody('');
      onMessageSent?.();

      setTimeout(() => {
        triggerClose();
      }, 1600);
    } catch (err) {
      console.error('Failed to send note to Miro:', err);
      hapticService.error?.();
      setSubmitStatus({
        type: 'error',
        message: err.message || t('inbox.sendFailed', 'Could not send note. Please try again.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Dispatch Announcement Submit
  const handleSubmitDispatch = async (e) => {
    e.preventDefault();
    if (!dispatchTitle.trim()) {
      setSubmitStatus({
        type: 'error',
        message: t('inbox.titleRequiredError', 'Please enter a title for the announcement.'),
      });
      return;
    }

    if (dispatchTarget === 'user' && !targetUid.trim()) {
      setSubmitStatus({
        type: 'error',
        message: t('inbox.uidRequiredError', 'Please provide a recipient User ID.'),
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    hapticService.medium?.();

    const actObj = ACTIONS.find((a) => a.id === selectedActionId)?.actionObj;

    const messageData = {
      title: dispatchTitle.trim(),
      subtitle: dispatchSubtitle.trim(),
      preview: dispatchSubtitle.trim() || dispatchBody.slice(0, 140).trim(),
      body: dispatchBody.trim(),
      type: dispatchCategory,
      author: dispatchAuthor.trim() || 'Miro',
      action: actObj || null,
    };

    try {
      if (dispatchTarget === 'broadcast') {
        const res = await broadcastInboxMessage(messageData, userId);
        if (res?.fallbackToSelf) {
          setSubmitStatus({
            type: 'success',
            message: t(
              'inbox.broadcastPreviewDelivered',
              'Delivered to your Sanctuary Inbox as a preview! (Deploy Cloud Function to broadcast across all accounts).'
            ),
          });
        } else {
          setSubmitStatus({
            type: 'success',
            message: t('inbox.broadcastSuccess', 'Broadcast delivered to {{count}} sanctuary inboxes!', {
              count: res?.count || 'all',
            }),
          });
        }
      } else {
        const destUid = dispatchTarget === 'self' ? userId : targetUid.trim();
        await sendInboxMessage(destUid, messageData);
        setSubmitStatus({
          type: 'success',
          message: dispatchTarget === 'self'
            ? t('inbox.testDispatchSuccess', 'Test note delivered to your Sanctuary Inbox!')
            : t('inbox.userDispatchSuccess', 'Message delivered to user {{uid}}.', { uid: destUid.slice(0, 8) }),
        });
      }

      hapticService.success?.();
      setDispatchTitle('');
      setDispatchSubtitle('');
      setDispatchBody('');
      onMessageSent?.();

      setTimeout(() => {
        triggerClose();
      }, 1600);
    } catch (err) {
      console.error('Failed to dispatch inbox message:', err);
      hapticService.error?.();
      setSubmitStatus({
        type: 'error',
        message: err.message || t('inbox.dispatchFailed', 'Could not dispatch message. Please check permissions.'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!shouldRender) return null;

  const modalContent = (
    <div
      className={`inbox-overlay${!isDarkMode ? ' light-theme' : ''}${isClosing ? ' is-closing' : ''}`}
      onClick={!isSubmitting ? triggerClose : undefined}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`inbox-sheet composer-sheet${!isDarkMode ? ' light-theme' : ''}${isClosing ? ' is-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
        aria-label={t('inbox.composerTitle', 'Sanctuary Composer')}
      >
        {/* Header */}
        <div className="inbox-header">
          <div className="inbox-header-titles">
            <h2 className="inbox-title">
              <Sparkles size={19} className="composer-sparkle-icon" />
              <span>{t('inbox.composerTitle', 'Sanctuary Composer')}</span>
            </h2>
            <p className="inbox-subtitle">
              {t('inbox.composerSubtitle', 'Write a note to Miro or dispatch an announcement to sanctuary inboxes.')}
            </p>
          </div>

          <button
            type="button"
            className="inbox-close-btn"
            onClick={triggerClose}
            disabled={isSubmitting}
            aria-label={t('inbox.close', 'Close')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Operational Mode Segmented Bar */}
        <div className="composer-mode-bar">
          <button
            type="button"
            className={`composer-mode-tab${mode === 'miro_note' ? ' is-active' : ''}`}
            onClick={() => {
              hapticService.light?.();
              setMode('miro_note');
              setSubmitStatus(null);
            }}
          >
            <Sparkles size={14} />
            <span>{t('inbox.modeMiro', 'Note to Miro')}</span>
          </button>

          <button
            type="button"
            className={`composer-mode-tab${mode === 'dispatch' ? ' is-active' : ''}`}
            onClick={() => {
              hapticService.light?.();
              setMode('dispatch');
              setSubmitStatus(null);
            }}
          >
            <Radio size={14} />
            <span>{t('inbox.modeDispatch', 'Dispatch Announcement')}</span>
          </button>
        </div>

        {/* Composer Form Body */}
        <div className="composer-body">
          {mode === 'miro_note' ? (
            /* Mode 1: Note to Miro / Personal Reflection */
            <form onSubmit={handleSubmitMiroNote} className="composer-form">
              <div className="composer-guidance-box">
                <Sparkles size={16} className="guidance-icon" />
                <p className="guidance-text">
                  {t(
                    'inbox.miroNoteDesc',
                    'Share a thought, feeling, or contemplation. When requested, Miro will reflect deeply and leave an observation note in your inbox.'
                  )}
                </p>
              </div>

              <div className="composer-field">
                <label className="composer-label">
                  {t('inbox.titleLabel', 'Title / Theme')}
                </label>
                <input
                  type="text"
                  className="composer-input"
                  placeholder={t('inbox.miroTitlePlaceholder', 'e.g. An evening question, finding patience...')}
                  value={miroTitle}
                  onChange={(e) => setMiroTitle(e.target.value)}
                  maxLength={100}
                />
              </div>

              <div className="composer-field">
                <label className="composer-label">
                  {t('inbox.bodyLabel', 'Your Reflection / Note')}
                  <span className="required-star">*</span>
                </label>
                <textarea
                  className="composer-textarea"
                  rows={4}
                  placeholder={t('inbox.miroBodyPlaceholder', 'Write whatever is alive in you right now...')}
                  value={miroBody}
                  onChange={(e) => setMiroBody(e.target.value)}
                  required
                />
              </div>

              {/* Ask Miro Toggle */}
              <div
                className="composer-toggle-card"
                onClick={() => {
                  hapticService.light?.();
                  setAskMiro(!askMiro);
                }}
              >
                <div className="toggle-card-info">
                  <span className="toggle-title">
                    {t('inbox.askMiroToggle', 'Ask Miro to reflect on this note')}
                  </span>
                  <span className="toggle-subtitle">
                    {t('inbox.askMiroHint', 'Miro uses Moonshot Kimi / Bedrock to observe your thoughts and drop a response note in your inbox.')}
                  </span>
                </div>
                <div className={`composer-switch${askMiro ? ' is-on' : ''}`}>
                  <div className="switch-thumb" />
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="composer-preview-section">
                <div className="preview-header">
                  <Eye size={13} />
                  <span>{t('inbox.previewHeader', 'Live Inbox Preview')}</span>
                </div>
                <div className="inbox-card type-whisper is-unread preview-card">
                  <div className="inbox-card-header">
                    <div className="inbox-card-badge-wrap">
                      <span className="inbox-card-badge badge-miro">
                        <Sparkles size={11} />
                        <span>{t('inbox.badgeUserNote', 'Your Note')}</span>
                      </span>
                      <span className="inbox-card-date">Just now</span>
                    </div>
                    <span className="inbox-unread-glow-dot" />
                  </div>
                  <div className="inbox-card-content">
                    <h4 className="inbox-card-title">{previewData.title}</h4>
                    <p className="inbox-card-preview">{previewData.preview}</p>
                  </div>
                </div>
              </div>

              {/* Submit Status Banner */}
              {submitStatus && (
                <div className={`composer-status-banner banner-${submitStatus.type}`}>
                  {submitStatus.type === 'success' ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  <span>{submitStatus.message}</span>
                </div>
              )}

              {/* Footer Actions */}
              <div className="composer-footer">
                <button
                  type="button"
                  className="composer-btn-cancel"
                  onClick={triggerClose}
                  disabled={isSubmitting}
                >
                  {t('inbox.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="composer-btn-submit"
                  disabled={isSubmitting || !miroBody.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="spinner" />
                      <span>
                        {askMiro
                          ? t('inbox.reflectingBtn', 'Miro is reflecting...')
                          : t('inbox.sendingBtn', 'Saving note...')}
                      </span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>{t('inbox.sendToMiroBtn', 'Save & Send to Miro')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Mode 2: Dispatch Announcement */
            <form onSubmit={handleSubmitDispatch} className="composer-form">
              {/* Target Selector */}
              <div className="composer-field">
                <label className="composer-label">
                  {t('inbox.targetLabel', 'Dispatch Target')}
                </label>
                <div className="target-pill-group">
                  <button
                    type="button"
                    className={`target-pill${dispatchTarget === 'self' ? ' is-active' : ''}`}
                    onClick={() => {
                      hapticService.light?.();
                      setDispatchTarget('self');
                    }}
                  >
                    <User size={13} />
                    <span>{t('inbox.targetSelf', 'Myself (Test)')}</span>
                  </button>
                  <button
                    type="button"
                    className={`target-pill${dispatchTarget === 'user' ? ' is-active' : ''}`}
                    onClick={() => {
                      hapticService.light?.();
                      setDispatchTarget('user');
                    }}
                  >
                    <User size={13} />
                    <span>{t('inbox.targetUser', 'Specific UID')}</span>
                  </button>
                  <button
                    type="button"
                    className={`target-pill broadcast-pill${dispatchTarget === 'broadcast' ? ' is-active' : ''}`}
                    onClick={() => {
                      hapticService.light?.();
                      setDispatchTarget('broadcast');
                    }}
                  >
                    <Users size={13} />
                    <span>{t('inbox.targetBroadcast', 'Broadcast All')}</span>
                  </button>
                </div>

                {dispatchTarget === 'user' && (
                  <input
                    type="text"
                    className="composer-input target-uid-input"
                    placeholder={t('inbox.targetUserPlaceholder', 'Paste target User ID (Firebase UID)...')}
                    value={targetUid}
                    onChange={(e) => setTargetUid(e.target.value)}
                    required
                  />
                )}

                {dispatchTarget === 'broadcast' && (
                  <div className="broadcast-warning-box">
                    <Radio size={14} className="broadcast-warning-icon" />
                    <span>
                      {t(
                        'inbox.broadcastWarning',
                        'This announcement will be delivered to every user’s Sanctuary Inbox across Kairos.'
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Category Pills */}
              <div className="composer-field">
                <label className="composer-label">
                  {t('inbox.categoryLabel', 'Message Category')}
                </label>
                <div className="category-chip-group">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = dispatchCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        className={`category-chip chip-${cat.id}${isActive ? ' is-active' : ''}`}
                        onClick={() => {
                          hapticService.light?.();
                          setDispatchCategory(cat.id);
                        }}
                      >
                        <Icon size={12} />
                        <span>{t(cat.labelKey, cat.labelFallback)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Author & Title Row */}
              <div className="composer-row">
                <div className="composer-field composer-field-author">
                  <label className="composer-label">{t('inbox.authorLabel', 'Author')}</label>
                  <input
                    type="text"
                    className="composer-input"
                    value={dispatchAuthor}
                    onChange={(e) => setDispatchAuthor(e.target.value)}
                    maxLength={40}
                  />
                </div>
                <div className="composer-field composer-field-title">
                  <label className="composer-label">
                    {t('inbox.titleLabel', 'Title')}
                    <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="composer-input"
                    placeholder={t('inbox.titlePlaceholder', 'e.g. Solstice Whisper, New Reflection Path...')}
                    value={dispatchTitle}
                    onChange={(e) => setDispatchTitle(e.target.value)}
                    maxLength={100}
                    required
                  />
                </div>
              </div>

              {/* Subtitle / Excerpt */}
              <div className="composer-field">
                <label className="composer-label">
                  {t('inbox.subtitleLabel', 'Subtitle / Excerpt (Optional)')}
                </label>
                <input
                  type="text"
                  className="composer-input"
                  placeholder={t('inbox.subtitlePlaceholder', 'Brief one-line summary for the inbox list card...')}
                  value={dispatchSubtitle}
                  onChange={(e) => setDispatchSubtitle(e.target.value)}
                  maxLength={160}
                />
              </div>

              {/* Message Body */}
              <div className="composer-field">
                <label className="composer-label">
                  {t('inbox.bodyLabel', 'Message Body')}
                </label>
                <textarea
                  className="composer-textarea"
                  rows={4}
                  placeholder={t('inbox.bodyPlaceholder', 'Write the full contemplation, letter, or announcement...')}
                  value={dispatchBody}
                  onChange={(e) => setDispatchBody(e.target.value)}
                />
              </div>

              {/* Action CTA Dropdown */}
              <div className="composer-field">
                <label className="composer-label">
                  {t('inbox.actionLabel', 'Action Button (CTA)')}
                </label>
                <select
                  className="composer-select"
                  value={selectedActionId}
                  onChange={(e) => setSelectedActionId(e.target.value)}
                >
                  {ACTIONS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {t(a.labelKey, a.labelFallback)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Preview Box */}
              <div className="composer-preview-section">
                <div className="preview-header">
                  <Eye size={13} />
                  <span>{t('inbox.previewHeader', 'Live Inbox Preview')}</span>
                </div>
                <div className={`inbox-card type-${dispatchCategory} is-unread preview-card`}>
                  <div className="inbox-card-header">
                    <div className="inbox-card-badge-wrap">
                      <span className={`inbox-card-badge badge-${dispatchCategory}`}>
                        {dispatchCategory === 'capsule' ? (
                          <TimeLetterIcon size={12} variant="sealed" />
                        ) : dispatchCategory === 'milestone' ? (
                          <Flame size={11} />
                        ) : (
                          <Sparkles size={11} />
                        )}
                        <span>
                          {CATEGORIES.find((c) => c.id === dispatchCategory)?.labelFallback || 'Notice'}
                        </span>
                      </span>
                      <span className="inbox-card-date">Just now</span>
                    </div>
                    <span className="inbox-unread-glow-dot" />
                  </div>
                  <div className="inbox-card-content">
                    <h4 className="inbox-card-title">{previewData.title}</h4>
                    <p className="inbox-card-preview">{previewData.preview}</p>
                  </div>
                  {previewData.action && (
                    <div className="inbox-card-footer">
                      <div className={`inbox-action-btn action-${previewData.action.type}`}>
                        {previewData.action.type === 'open_voice' ? (
                          <MessageCircle size={13} />
                        ) : previewData.action.type === 'open_journal' ? (
                          <BookOpen size={13} />
                        ) : (
                          <Compass size={13} />
                        )}
                        <span>{t(previewData.action.labelKey, previewData.action.labelFallback)}</span>
                        <ArrowRight size={12} className="inbox-btn-arrow" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Status Banner */}
              {submitStatus && (
                <div className={`composer-status-banner banner-${submitStatus.type}`}>
                  {submitStatus.type === 'success' ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <AlertCircle size={16} />
                  )}
                  <span>{submitStatus.message}</span>
                </div>
              )}

              {/* Footer Actions */}
              <div className="composer-footer">
                <button
                  type="button"
                  className="composer-btn-cancel"
                  onClick={triggerClose}
                  disabled={isSubmitting}
                >
                  {t('inbox.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="composer-btn-submit"
                  disabled={isSubmitting || !dispatchTitle.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="spinner" />
                      <span>{t('inbox.dispatchingBtn', 'Dispatching...')}</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>{t('inbox.dispatchBtn', 'Dispatch Message')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default InboxComposerModal;
