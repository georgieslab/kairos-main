// src/components/common/InboxModal.jsx
//
// The Kairos Sanctuary Inbox Modal.
// Apple Spatial Glass drawer rendering arrived time capsules,
// Miro's reflection notes, and contemplative milestones.

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
  X,
  Check,
  CheckCheck,
  Sparkles,
  Flame,
  ArrowRight,
  Archive,
  Inbox as InboxIcon,
  Compass,
  MessageCircle,
} from 'lucide-react';
import TimeLetterIcon from './TimeLetterIcon';
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
  { id: 'milestone', labelKey: 'inbox.filterMilestones', labelFallback: 'Milestones' },
];

const InboxModal = ({
  isOpen = false,
  onClose,
  items = [],
  unreadCount = 0,
  onMarkAsRead,
  onMarkAllAsRead,
  onArchiveItem,
  onExecuteAction,
}) => {
  const { t, i18n } = useTranslation('journey');
  const lng = i18n.resolvedLanguage || i18n.language;
  const [filter, setFilter] = useState('all');

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter items
  const filteredItems = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((item) => item.type === filter);
  }, [items, filter]);

  const handleCardClick = (item) => {
    if (!item.read) {
      onMarkAsRead?.(item);
    }
  };

  const handleActionClick = (e, item) => {
    e.stopPropagation();
    hapticService.medium?.();
    if (!item.read) {
      onMarkAsRead?.(item);
    }
    onExecuteAction?.(item.action, item);
  };

  const handleArchiveClick = (e, item) => {
    e.stopPropagation();
    hapticService.light?.();
    onArchiveItem?.(item);
  };

  const handleMarkAll = () => {
    hapticService.light?.();
    onMarkAllAsRead?.();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="inbox-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="inbox-sheet"
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
              onClick={onClose}
              aria-label={t('inbox.close', 'Close')}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="inbox-filters-bar" role="tablist">
          {CATEGORIES.map((cat) => {
            const count = cat.id === 'all'
              ? items.length
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

        {/* List Content */}
        <div className="inbox-body">
          {filteredItems.length === 0 ? (
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
                      <h4 className="inbox-card-title">
                        {t(item.titleKey, item.titleFallback)}
                      </h4>
                      <p className="inbox-card-preview">
                        {t(item.previewKey, item.previewFallback)}
                      </p>
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
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default InboxModal;
