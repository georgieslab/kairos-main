// src/components/common/InboxButton.jsx
//
// Apple Spatial Glass pill button situated in the header controls dock,
// directly adjacent to What's New. Pulses an unread pip when new
// letters, Miro notes, or milestones are waiting.

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Inbox } from 'lucide-react';
import hapticService from '../../services/hapticService';
import '../../styles/components/inbox.css';

const InboxButton = ({ unreadCount = 0, onClick }) => {
  const { t } = useTranslation('journey');
  const hasUnread = unreadCount > 0;

  const handleClick = (e) => {
    hapticService.light?.();
    onClick?.(e);
  };

  const label = hasUnread
    ? t('inbox.dockAriaUnread', 'Inbox ({{count}} unread)', { count: unreadCount })
    : t('inbox.dockAria', 'Inbox');

  return (
    <button
      type="button"
      className={`inbox-pill${hasUnread ? ' has-unread' : ''}`}
      onClick={handleClick}
      title={label}
      aria-label={label}
    >
      <Inbox size={15} className="inbox-pill-icon" />
      {hasUnread && (
        <span className="inbox-dot" aria-hidden="true">
          {unreadCount > 9 ? '9+' : unreadCount > 1 ? unreadCount : ''}
        </span>
      )}
    </button>
  );
};

export default InboxButton;
