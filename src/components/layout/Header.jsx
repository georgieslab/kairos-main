// src/components/layout/Header.jsx

import React from 'react';
import { ArrowLeft, User, Settings, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Import hooks
import useNavigation from '../../hooks/useNavigation';

// Import components
import PathContextIndicator from '../common/PathContextIndicator';

const Header = () => {
  const { currentUser } = useAuth();
  const { 
    currentScreen, 
    navigateToScreen, 
    navigateBack, 
    shouldShowBackButton,
    getBackButtonLabel,
    currentPath
  } = useNavigation();
  
  // Get appropriate header title based on current screen
  const getHeaderTitle = () => {
    switch (currentScreen) {
      case 'home':
        return 'Καιρός';
      case 'path-selection':
        return 'Journaling Paths';
      case 'daily':
        return 'Daily Journal';
      case 'upload':
        return 'Journal Upload';
      case 'analysis':
        return 'Journal Analysis';
      case 'analytics-dashboard':
        return 'Journal Analytics';
      case 'settings':
        return 'Settings';
      case 'profile':
        return 'Your Profile';
      case 'journal-archive':
        return 'Journal Archive';
      case 'feedback':
        return 'Send Feedback';
      case 'bug-report':
        return 'Report a Bug';
      case 'journey-complete':
        return 'Journey Complete';
      default:
        return 'Καιρός';
    }
  };
  
  // Check if current screen should show path context
  const shouldShowPathContext = () => {
    const pathContextScreens = ['daily', 'upload', 'analysis'];
    return pathContextScreens.includes(currentScreen) && currentPath;
  };
  
  // Handle settings navigation
  const handleSettingsClick = () => {
    navigateToScreen('settings');
  };
  
  // Only show header for authenticated users
  if (!currentUser) return null;
  
  // Don't show header on certain screens
  if (['welcome', 'signup', 'loading'].includes(currentScreen)) return null;
  
  return (
    <header className="app-header">
      <div className="header-container">
        {/* Back button - only show when appropriate */}
        {shouldShowBackButton() ? (
          <button 
            onClick={navigateBack} 
            className="header-back-button"
            aria-label="Go back"
          >
            <ArrowLeft className="header-icon" />
            <span className="header-back-label">{getBackButtonLabel()}</span>
          </button>
        ) : (
          <div className="header-logo">Καιρός</div>
        )}
        
        {/* Title */}
        <h1 className="header-title">
          {getHeaderTitle()}
        </h1>
        
        {/* Path context indicator - only show on relevant screens */}
        {shouldShowPathContext() && (
          <div className="header-path-context">
            <PathContextIndicator />
          </div>
        )}
        
        {/* Right-side actions */}
        <div className="header-actions">
          {currentScreen !== 'settings' && (
            <button 
              onClick={handleSettingsClick} 
              className="header-action-button"
              aria-label="Settings"
            >
              <Settings className="header-icon" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;