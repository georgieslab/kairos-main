// src/components/common/FloatingActionButton.jsx

import React, { useState } from 'react';
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
      label: 'Give Feedback',
      icon: <MessageSquare size={18} />,
      action: () => handleItemClick('feedback')
    },
    {
      id: 'bug',
      label: 'Report a Bug',
      icon: <Bug size={18} />,
      action: () => handleItemClick('bug-report')
    },
    {
      id: 'help',
      label: 'Help Center',
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
        aria-label={isOpen ? 'Close menu' : 'Open help menu'}
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