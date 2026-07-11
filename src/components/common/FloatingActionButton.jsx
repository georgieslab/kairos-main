// src/components/common/FloatingActionButton.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  Bug,
  HelpCircle,
  MoreVertical,
  X
} from 'lucide-react';
import '../../styles/components/floatingActionButton.css';

/**
 * Floating action button with a menu for quick access to feedback and bug reporting
 */
const FloatingActionButton = ({ navigateToScreen }) => {
  const { t } = useTranslation('layout');
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (screen) => {
    setIsOpen(false);
    navigateToScreen(screen);
  };

  const menuItems = [
    {
      id: 'feedback',
      label: t('fab.giveFeedback', 'Give Feedback'),
      icon: <MessageSquare size={18} />,
      action: () => handleItemClick('feedback')
    },
    {
      id: 'bug',
      label: t('fab.reportBug', 'Report a Bug'),
      icon: <Bug size={18} />,
      action: () => handleItemClick('bug-report')
    },
    {
      id: 'help',
      label: t('fab.helpCenter', 'Help Center'),
      icon: <HelpCircle size={18} />,
      action: () => handleItemClick('help')
    }
  ];
  
  return (
    <div className="floating-action-container">
      {isOpen && (
        <div className="fab-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="fab-menu-item"
              onClick={item.action}
              aria-label={item.label}
            >
              {item.icon}
              <span className="fab-menu-label">{item.label}</span>
            </button>
          ))}
        </div>
      )}
      
      <button
        className={`floating-action-button ${isOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label={isOpen ? t('fab.closeMenu', 'Close menu') : t('fab.openMenu', 'Open help menu')}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MoreVertical size={24} />
        )}
      </button>
    </div>
  );
};

export default FloatingActionButton;