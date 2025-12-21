// src/components/common/TopBar.jsx - Unified top bar component for all tabs
import React from 'react';
import './topBar.css';

const TopBar = ({ title, subtitle, icon: Icon, actions, className = '', colorClass = '' }) => {
  return (
    <div className={`top-bar ${className} ${colorClass}`}>
      <div className="top-bar-content">
        <div className="top-bar-main">
          {Icon && <Icon className="top-bar-icon" size={24} />}
          <div className="top-bar-text">
            <h1 className="top-bar-title">{title}</h1>
            {subtitle && <p className="top-bar-subtitle">{subtitle}</p>}
          </div>
        </div>
        {actions && (
          <div className="top-bar-actions">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
