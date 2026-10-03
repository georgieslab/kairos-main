// src/components/common/InboxModal.jsx
//
// The Kairos Sanctuary Inbox Modal.
// Apple Spatial Glass drawer rendering arrived time capsules,
// Miro's reflection notes, and contemplative milestones.

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import {
  X,
  Check,
  CheckCheck,
  Sparkles,
  Flame,
  ArrowRight,
  ArrowLeft,
  Archive,
  Inbox as InboxIcon,
  Compass,
  MessageCircle,
  PenLine,
  BookOpen,
  User,
} from 'lucide-react';
import TimeLetterIcon from './TimeLetterIcon';
import InboxComposerModal from './InboxComposerModal';
import hapticService from '../../services/hapticService';
import '../../styles/components/inbox.css';

const formatDate = (d, lng) => {
  if (!d) return '';
  const dateObj = d instanceof Date ? d : d.toDate ? d.toDate() : new Date(d);
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toLocaleDateString(lng, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const CATEGORIES = [
  { id: 'all', labelKey: 'inbox.filterAll', labelFallback: 'All' },
  { id: 'capsule', labelKey: 'inbox.filterLetters', labelFallback: 'Letters' },
  { id: 'miro_note', labelKey: 'inbox.filterMiro', labelFallback: 'Miro' },
  { id: 'whisper', labelKey: 'inbox.filterWhispers', labelFallback: 'Whispers' },
  { id: 'milestone', labelKey: 'inbox.filterMilestones', labelFallback: 'Milestones' },
];

const InboxModal = ({
  isOpen = false,
  onClose,
  userId,
  onRefresh,
  items = [],
  unreadCount = 0,
  onMarkAsRead,
  onMarkAllAsRead,
  onArchiveItem,
  onExecuteAction,
}) => {
  const { t, i18n } = useTranslation('journey');
  const { isDarkMode } = useTheme();
  const lng = i18n.resolvedLanguage || i18n.language;
  const [filter, setFilter] = useState('all');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [readingItem, setReadingItem] = useState(null);

  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const closeTimerRef = useRef(null);

  // Sync rendering with isOpen prop
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender && !isClosing) {
      setShouldRender(false);
    }
  }, [isOpen]);

  const triggerClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    hapticService.light?.();
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
      onClose?.();
    }, 220);
  }, [isClosing, onClose]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!shouldRender || isClosing) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') triggerClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shouldRender, isClosing, triggerClose]);

  // Filter items
  const filteredItems = useMemo(() => {
    if (filter === 'all') return items;
    if (filter === 'miro_note') {
      return items.filter((item) => item.type === 'miro_note' || item.type === 'user_note');
    }
    return items.filter((item) => item.type === filter);
  }, [items, filter]);

  const handleCardClick = (item) => {
    if (!item.read) {
      onMarkAsRead?.(item);
    }
    hapticService.light?.();
    setReadingItem(item);
  };

  const handleActionClick = (e, item) => {
    e.stopPropagation();
    hapticService.medium?.();
    if (!item.read) {
      onMarkAsRead?.(item);
    }
    triggerClose();
    setTimeout(() => {
      onExecuteAction?.(item.action, item);
    }, 220);
  };

  const handleArchiveClick = (e, item) => {
    e.stopPropagation();
    hapticService.light?.();
    onArchiveItem?.(item);
    if (readingItem?.id === item.id) {
      setReadingItem(null);
    }
  };

  const handleMarkAll = () => {
    hapticService.light?.();
    onMarkAllAsRead?.();
  };

  if (!shouldRender) return null;

  const modalContent = (
    <div
      className={`inbox-overlay${!isDarkMode ? ' light-theme' : ''}${isClosing ? ' is-closing' : ''}`}
      onClick={triggerClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`inbox-sheet${!isDarkMode ? ' light-theme' : ''}${isClosing ? ' is-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
        aria-label={t('inbox.modalTitle', 'Sanctuary Inbox')}
      >
        {/* Header */}
        <div className="inbox-header">
          <div className="inbox-header-titles">
            <div className="inbox-title-row">
              <h2 className="inbox-title">{t('inbox.title', 'Sanctuary Inbox')}</h2>
              {unreadCount > 0 && (
                <span className="inbox-unread-pill">
                  {t('inbox.unreadCountBadge', '{{count}} new', { count: unreadCount })}
                </span>
              )}
            </div>
            <p className="inbox-subtitle">
              {t('inbox.subtitle', 'Letters across time, Miro’s observations, and milestone markers.')}
            </p>
          </div>

          <div className="inbox-header-actions">
            <button
              type="button"
              className="inbox-header-btn inbox-compose-header-btn"
              onClick={() => {
                hapticService.light?.();
                setIsComposerOpen(true);
              }}
              title={t('inbox.composeBtn', 'Write Note')}
            >
              <PenLine size={14} />
              <span className="inbox-header-btn-text">{t('inbox.composeBtn', 'Write Note')}</span>
            </button>

            {unreadCount > 0 && (
              <button
                type="button"
                className="inbox-header-btn"
                onClick={handleMarkAll}
                title={t('inbox.markAllRead', 'Mark all as read')}
              >
                <CheckCheck size={16} />
                <span className="inbox-header-btn-text">{t('inbox.markAllRead', 'Mark all read')}</span>
              </button>
            )}

            <button
              type="button"
              className="inbox-close-btn"
              onClick={triggerClose}
              aria-label={t('inbox.close', 'Close')}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filter Pills (shown when not in reading view) */}
        {!readingItem && (
          <div className="inbox-filters-bar" role="tablist">
            {CATEGORIES.map((cat) => {
              const count = cat.id === 'all'
                ? items.length
                : cat.id === 'miro_note'
                ? items.filter((i) => i.type === 'miro_note' || i.type === 'user_note').length
                : items.filter((i) => i.type === cat.id).length;
              const isActive = filter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`inbox-filter-tab${isActive ? ' is-active' : ''}`}
                  onClick={() => {
                    hapticService.light?.();
                    setFilter(cat.id);
                  }}
                >
                  <span>{t(cat.labelKey, cat.labelFallback)}</span>
                  <span className="inbox-tab-count">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* List Content or Reading View */}
        <div className="inbox-body">
          {readingItem ? (
            /* Expanded Reading Card View */
            <div className="inbox-reading-view">
              <div className="inbox-reading-nav">
                <button
                  type="button"
                  className="inbox-reading-back-btn"
                  onClick={() => {
                    hapticService.light?.();
                    setReadingItem(null);
                  }}
                >
                  <ArrowLeft size={15} />
                  <span>{t('inbox.backToList', 'All Messages')}</span>
                </button>

                <div className="inbox-reading-meta-actions">
                  <span className="inbox-reading-date">
                    {formatDate(readingItem.createdAt, lng)}
                  </span>
                  <button
                    type="button"
                    className="inbox-card-dismiss-btn"
                    onClick={(e) => handleArchiveClick(e, readingItem)}
                    title={t('inbox.dismiss', 'Archive item')}
                  >
                    <Archive size={15} />
                  </button>
                </div>
              </div>

              <div className="inbox-reading-body">
                <div className="inbox-reading-badge-row">
                  <span className={`inbox-card-badge badge-${readingItem.type}`}>
                    {readingItem.type === 'capsule' ? (
                      <TimeLetterIcon size={13} variant={readingItem.capsule?.status === 'opened' ? 'arrived' : 'sealed'} />
                    ) : readingItem.type === 'milestone' ? (
                      <Flame size={12} />
                    ) : readingItem.type === 'user_note' ? (
                      <User size={12} />
                    ) : (
                      <Sparkles size={12} />
                    )}
                    <span>
                      {readingItem.type === 'user_note'
                        ? t('inbox.badgeUserNote', 'Your Note')
                        : readingItem.type === 'whisper'
                        ? t('inbox.badgeWhisper', 'Sanctuary Whisper')
                        : readingItem.type === 'capsule'
                        ? t('inbox.badgeLetter', 'Future Self Letter')
                        : readingItem.type === 'milestone'
                        ? t('inbox.badgeMilestone', 'Milestone')
                        : t('inbox.badgeMiro', 'Miro Observation')}
                    </span>
                  </span>
                  {readingItem.author && (
                    <span className="inbox-reading-author">
                      {t('inbox.byAuthor', 'By {{author}}', { author: readingItem.author })}
                    </span>
                  )}
                </div>

                <h3 className="inbox-reading-title">
                  {readingItem.title || t(readingItem.titleKey, readingItem.titleFallback)}
                </h3>

                {readingItem.subtitle && (
                  <p className="inbox-reading-subtitle">{readingItem.subtitle}</p>
                )}

                <div className="inbox-reading-content">
                  {(readingItem.body || readingItem.preview || t(readingItem.previewKey, readingItem.previewFallback) || '')
                    .split('\n')
                    .filter((p) => p.trim())
                    .map((para, idx) => (
                      <p key={idx} className="inbox-reading-paragraph">
                        {para}
                      </p>
                    ))}
                </div>

                {readingItem.action && (
                  <div className="inbox-reading-footer">
                    <button
                      type="button"
                      className={`inbox-action-btn action-${readingItem.action.type}`}
                      onClick={(e) => handleActionClick(e, readingItem)}
                    >
                      {readingItem.action.type === 'open_voice' ? (
                        <MessageCircle size={14} />
                      ) : readingItem.action.type === 'open_journal' ? (
                        <BookOpen size={14} />
                      ) : (
                        <Compass size={14} />
                      )}
                      <span>
                        {t(readingItem.action.labelKey, readingItem.action.labelFallback)}
                      </span>
                      <ArrowRight size={13} className="inbox-btn-arrow" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="inbox-empty-state">
              <div className="inbox-empty-icon-wrap">
                <TimeLetterIcon size={38} variant="empty" />
              </div>
              <h3 className="inbox-empty-title">
                {filter === 'capsule'
                  ? t('inbox.emptyLettersTitle', 'No arrived letters yet')
                  : filter === 'miro_note'
                  ? t('inbox.emptyMiroTitle', 'No reflections filed yet')
                  : t('inbox.emptyTitle', 'All quiet at your desk')}
              </h3>
              <p className="inbox-empty-desc">
                {filter === 'capsule'
                  ? t('inbox.emptyLettersDesc', 'When a letter to your future self reaches its delivery date, it will arrive here with a wax seal.')
                  : t('inbox.emptyDesc', 'Letters from your past self, Miro’s weekly observations, and personal milestones will quietly gather here.')}
              </p>
            </div>
          ) : (
            <div className="inbox-card-list">
              {filteredItems.map((item) => {
                const isCapsule = item.type === 'capsule';
                const isMilestone = item.type === 'milestone';
                const isMiro = item.type === 'miro_note';
                const isUserNote = item.type === 'user_note';
                const isWhisper = item.type === 'whisper';

                const titleText = item.title || t(item.titleKey, item.titleFallback);
                const previewText =
                  item.preview ||
                  (item.body ? (item.body.length > 140 ? item.body.slice(0, 140) + '...' : item.body) : '') ||
                  t(item.previewKey, item.previewFallback);

                return (
                  <article
                    key={item.id}
                    className={`inbox-card type-${item.type}${item.read ? ' is-read' : ' is-unread'}`}
                    onClick={() => handleCardClick(item)}
                  >
                    <div className="inbox-card-header">
                      <div className="inbox-card-badge-wrap">
                        {isCapsule && (
                          <span className="inbox-card-badge badge-capsule">
                            <TimeLetterIcon size={13} variant={item.capsule?.status === 'opened' ? 'arrived' : 'sealed'} />
                            <span>{t('inbox.badgeLetter', 'Future Self Letter')}</span>
                          </span>
                        )}
                        {isMilestone && (
                          <span className="inbox-card-badge badge-milestone">
                            <Flame size={12} />
                            <span>{t('inbox.badgeMilestone', 'Milestone')}</span>
                          </span>
                        )}
                        {isMiro && (
                          <span className="inbox-card-badge badge-miro">
                            <Sparkles size={12} />
                            <span>{t('inbox.badgeMiro', 'Miro Observation')}</span>
                          </span>
                        )}
                        {isUserNote && (
                          <span className="inbox-card-badge badge-user_note">
                            <User size={12} />
                            <span>{t('inbox.badgeUserNote', 'Your Note')}</span>
                          </span>
                        )}
                        {isWhisper && (
                          <span className="inbox-card-badge badge-whisper">
                            <Sparkles size={12} />
                            <span>{t('inbox.badgeWhisper', 'Sanctuary Whisper')}</span>
                          </span>
                        )}
                        <span className="inbox-card-date">
                          {formatDate(item.createdAt, lng)}
                        </span>
                      </div>

                      <div className="inbox-card-quick-actions">
                        {!item.read && (
                          <span className="inbox-unread-glow-dot" title={t('inbox.unreadDot', 'Unread')} />
                        )}
                        <button
                          type="button"
                          className="inbox-card-dismiss-btn"
                          onClick={(e) => handleArchiveClick(e, item)}
                          title={t('inbox.dismiss', 'Archive item')}
                          aria-label={t('inbox.dismiss', 'Archive item')}
                        >
                          <Archive size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="inbox-card-content">
                      <h4 className="inbox-card-title">{titleText}</h4>
                      <p className="inbox-card-preview">{previewText}</p>
                    </div>

                    {item.action && (
                      <div className="inbox-card-footer">
                        <button
                          type="button"
                          className={`inbox-action-btn action-${item.action.type}`}
                          onClick={(e) => handleActionClick(e, item)}
                        >
                          {isCapsule ? (
                            <Sparkles size={14} />
                          ) : isMilestone ? (
                            <Compass size={14} />
                          ) : item.action.type === 'open_journal' ? (
                            <BookOpen size={14} />
                          ) : (
                            <MessageCircle size={14} />
                          )}
                          <span>
                            {t(item.action.labelKey, item.action.labelFallback)}
                          </span>
                          <ArrowRight size={13} className="inbox-btn-arrow" />
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Composer Modal Drawer */}
      <InboxComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        userId={userId}
        onMessageSent={() => {
          onRefresh?.();
        }}
      />
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default InboxModal;
