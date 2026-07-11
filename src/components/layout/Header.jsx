// src/components/layout/Header.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import useNavigation from '../../hooks/useNavigation';
import PathContextIndicator from '../common/PathContextIndicator';

// Clean title mapping (English fallbacks)
const screenTitles = {
  'home': 'Καιρός',
  'path-selection': 'Journaling Paths',
  'daily': 'Daily Journal',
  'upload': 'Journal Upload',
  'analysis': 'Journal Analysis',
  'analytics-dashboard': 'Journal Analytics',
  'settings': 'Settings',
  'profile': 'Your Profile',
  'journal-archive': 'Journal Archive',
  'feedback': 'Send Feedback',
  'bug-report': 'Report a Bug',
  'journey-complete': 'Journey Complete',
};

// Maps screen ids to translation keys under header.screenTitles
const screenTitleKeys = {
  'home': 'header.screenTitles.home',
  'path-selection': 'header.screenTitles.pathSelection',
  'daily': 'header.screenTitles.daily',
  'upload': 'header.screenTitles.upload',
  'analysis': 'header.screenTitles.analysis',
  'analytics-dashboard': 'header.screenTitles.analyticsDashboard',
  'settings': 'header.screenTitles.settings',
  'profile': 'header.screenTitles.profile',
  'journal-archive': 'header.screenTitles.journalArchive',
  'feedback': 'header.screenTitles.feedback',
  'bug-report': 'header.screenTitles.bugReport',
  'journey-complete': 'header.screenTitles.journeyComplete',
};

const Header = () => {
  const { t } = useTranslation('layout');
  const { currentUser } = useAuth();
  const { currentScreen, navigateBack, shouldShowBackButton, currentPath, screenData } = useNavigation();

  // Dynamic title for daily view
  const getTitle = () => {
    if (currentScreen === 'daily' && screenData?.day) {
      return t('header.dayTitle', 'Day {{day}}', { day: screenData.day });
    }
    const key = screenTitleKeys[currentScreen] || screenTitleKeys['home'];
    const fallback = screenTitles[currentScreen] || screenTitles['home'];
    return t(key, fallback);
  };

  if (!currentUser) return null;
  if (['welcome', 'signup', 'loading'].includes(currentScreen)) return null;

  const showPathContext = ['daily', 'upload', 'analysis'].includes(currentScreen) && currentPath;
  const showBack = shouldShowBackButton();

  return (
    <header className="spatial-header">
      <div className="spatial-header-inner">
        {/* Left Side: Back or Logo */}
        <div className="spatial-header-left">
          {showBack ? (
            <button onClick={navigateBack} className="spatial-back-btn" aria-label={t('header.goBackAria', 'Go back')}>
              <ArrowLeft size={20} strokeWidth={2} />
            </button>
          ) : (
            <span className="spatial-logo">Κ</span>
          )}
          
          {showPathContext && <PathContextIndicator />}
        </div>

        {/* Center: Title */}
        <h1 className="spatial-header-title">{getTitle()}</h1>

        {/* Right Side: Settings */}
        <div className="spatial-header-right">
          {currentScreen !== 'settings' && (
            <button 
              onClick={() => useNavigation().navigateToScreen('settings')}
              className="spatial-icon-btn"
              aria-label={t('header.settingsAria', 'Settings')}
            >
              <Settings size={18} strokeWidth={1.8} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;