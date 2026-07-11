// src/components/journey/WriteTab.jsx - Apple Spatial Glass Edition
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Camera,
  BookOpen,
  MessageSquare,
  Tag,
  Award,
  Lightbulb,
  Info,
  CheckCircle,
  AlertCircle,
  Trophy,
  Mic,
  ChevronRight,
} from 'lucide-react';
import { getJourneyDay, getJourneyPath } from '../../data/JourneyData';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import DynamicIcon from '../common/DynamicIcon';
import { getNextDayForPath, getProgressFieldForPath } from '../../utils/pathUtils';
import { isVoicePath } from '../../utils/pathTypeUtils';
import '../../styles/components/WriteTab.css';

const WriteTab = ({ navigateToScreen, currentPath, currentDay }) => {
  const { t } = useTranslation('journey');
  const { userProfile } = useAuth();
  const { isDarkMode } = useTheme();

  const [activeDay, setActiveDay] = useState(currentDay || 1);
  const [activePath, setActivePath] = useState(currentPath || 'self-discovery');
  const [journeyData, setJourneyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [showTip, setShowTip] = useState(true);
  const [completionStatus, setCompletionStatus] = useState('active');

  const isNavigating = useRef(false);
  const initRef = useRef(false);

  const isDayCompleted = useCallback((path, day) => {
    if (!userProfile?.journeyProgress) return false;
    const field = getProgressFieldForPath(path);
    return (userProfile.journeyProgress[field]?.completedDays || []).includes(day);
  }, [userProfile]);

  const isJourneyCompleted = useCallback((path) => {
    if (!userProfile?.journeyProgress) return false;
    const pathData = getJourneyPath(path);
    if (!pathData) return false;
    const field = getProgressFieldForPath(path);
    return (userProfile.journeyProgress[field]?.completedDays || []).length >= pathData.duration;
  }, [userProfile]);

  // Load data
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    try {
      let finalPath = currentPath || userProfile?.journeyProgress?.currentPath || 'self-discovery';
      let finalDay = currentDay || getNextDayForPath(userProfile, finalPath) || 1;

      const pathData = getJourneyPath(finalPath);
      const dayData = getJourneyDay(finalDay, finalPath) || {
        day: finalDay,
        title: t('writeTab.dayFallback.title', 'Day {{day}}', { day: finalDay }),
        theme: t('writeTab.dayFallback.theme', 'Reflection'),
        prompt: t('writeTab.dayFallback.prompt', "What's on your mind today?"),
      };

      let status = 'active';
      if (isJourneyCompleted(finalPath)) status = 'completed';
      else if (isDayCompleted(finalPath, finalDay)) status = 'day-completed';

      setActivePath(finalPath);
      setActiveDay(finalDay);
      setJourneyData(dayData);
      setCompletionStatus(status);
      setIsLoading(false);

      if (status === 'completed') {
        setTimeout(() => {
          if (!isNavigating.current) {
            isNavigating.current = true;
            navigateToScreen('journey-complete', { pathId: finalPath, day: finalDay });
          }
        }, 600);
      }
    } catch (err) {
      console.error('WriteTab init error:', err);
      setLoadError(err.message);
      setIsLoading(false);
    }

    return () => { initRef.current = false; };
  }, [currentPath, currentDay, userProfile, isJourneyCompleted, isDayCompleted, navigateToScreen]);

  // Sync with external prop changes
  useEffect(() => {
    if (isLoading) return;
    const newPath = currentPath || activePath;
    const newDay = currentDay || activeDay;
    if (newPath !== activePath || newDay !== activeDay) {
      setActivePath(newPath);
      setActiveDay(newDay);
      setJourneyData(getJourneyDay(newDay, newPath));
      setCompletionStatus(
        isJourneyCompleted(newPath) ? 'completed' :
        isDayCompleted(newPath, newDay) ? 'day-completed' : 'active'
      );
    }
  }, [currentPath, currentDay, activePath, activeDay, isLoading, isJourneyCompleted, isDayCompleted]);

  const pathDetails = getJourneyPath(activePath) || { 
    title: 'Self-Discovery', iconName: 'Compass', color: '85,139,110', duration: 10 
  };
  const pathColorRgb = pathDetails.color || '85,139,110';
  const isVoice = isVoicePath(activePath);

  const handleStart = () => {
    if (isNavigating.current) return;
    
    if (completionStatus === 'completed') {
      isNavigating.current = true;
      navigateToScreen('journey-complete', { pathId: activePath, day: activeDay });
      return;
    }
    
    isNavigating.current = true;
    navigateToScreen(isVoice ? 'voice-upload' : 'upload', {
      pathId: activePath,
      day: activeDay,
      prompt: journeyData?.prompt,
      theme: journeyData?.theme,
    });
  };

  const handleViewDetails = () => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    navigateToScreen('daily', { pathId: activePath, day: activeDay });
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="write-tab-container">
        <div className="write-loading">
          <div className="write-loading-spinner" style={{ '--c': pathColorRgb }} />
          <p>{t('writeTab.preparingSpace', 'Preparing your space...')}</p>
        </div>
      </div>
    );
  }

  // Error State
  if (loadError) {
    return (
      <div className="write-tab-container">
        <div className="write-error">
          <AlertCircle size={32} />
          <h3>{t('writeTab.errorTitle', 'Something went wrong')}</h3>
          <p>{loadError}</p>
          <button className="glass-button-secondary" onClick={() => window.location.reload()}>
            {t('writeTab.tryAgain', 'Try Again')}
          </button>
        </div>
      </div>
    );
  }

  // Completed State
  if (completionStatus === 'completed') {
    return (
      <div className="write-tab-container" style={{ '--c': pathColorRgb }}>
        <div className="write-completed">
          <div className="completed-icon-wrap">
            <Trophy size={32} />
          </div>
          <h2>{t('writeTab.journeyComplete', 'Journey Complete')}</h2>
          <p>{t('writeTab.youFinished', 'You finished')} <strong>{pathDetails.title}</strong></p>
          <div className="completed-actions">
            <button className="glass-button-primary" onClick={() => {
              isNavigating.current = true;
              navigateToScreen('journey-complete', { pathId: activePath, day: activeDay });
            }}>
              <Award size={18} />
              {t('writeTab.viewSummary', 'View Summary')}
            </button>
            <button className="glass-button-secondary" onClick={() => {
              isNavigating.current = true;
              navigateToScreen('path-selection');
            }}>
              <BookOpen size={18} />
              {t('writeTab.newJourney', 'New Journey')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round((activeDay / pathDetails.duration) * 100);

  return (
    <div className="write-tab-container" style={{ '--c': pathColorRgb }}>
      
      {/* Header */}
      <div className="write-header">
        <div className="write-header-top">
          <div className="write-path-chip" style={{ backgroundColor: `rgba(${pathColorRgb}, 0.12)`, borderColor: `rgba(${pathColorRgb}, 0.2)` }}>
            <DynamicIcon name={pathDetails.iconName} size={16} />
            <span>{pathDetails.title}</span>
          </div>
          
          {completionStatus === 'day-completed' && (
            <div className="write-completed-chip">
              <CheckCircle size={12} />
              <span>{t('writeTab.completed', 'Completed')}</span>
            </div>
          )}
        </div>

        <h1 className="write-title">
          {isVoice ? t('writeTab.voiceJournal', 'Voice Journal') : t('writeTab.journalEntry', 'Journal Entry')}
        </h1>
        <p className="write-subtitle">{t('writeTab.dayOf', 'Day {{day}} of {{total}}', { day: activeDay, total: pathDetails.duration })}</p>
      </div>

      {/* Progress */}
      <div className="write-progress">
        <div className="write-progress-bar">
          <div 
            className="write-progress-fill" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="write-progress-text">{progressPercent}%</span>
      </div>

      {/* Main Prompt Card */}
      <div className="write-prompt-card">
        <div className="write-prompt-header">
          <span className="write-day-badge">{t('writeTab.dayLabel', 'Day {{day}}', { day: activeDay })}</span>
          <h2 className="write-prompt-title">{journeyData?.title || t('writeTab.dayLabel', 'Day {{day}}', { day: activeDay })}</h2>
        </div>

        <div className="write-prompt-body">
          <div className="write-prompt-label">
            <MessageSquare size={16} />
            <span>{isVoice ? t('writeTab.voicePrompt', 'Voice prompt') : t('writeTab.writingPrompt', 'Writing prompt')}</span>
          </div>

          <p className="write-prompt-text">
            "{journeyData?.prompt || t('writeTab.promptFallback', 'What is present for you today?')}"
          </p>

          <div className="write-theme-chip">
            <Tag size={12} />
            <span>{journeyData?.theme || t('writeTab.themeFallback', 'Reflection')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="write-actions">
          <button 
            className="write-action-primary"
            onClick={handleStart}
            style={{ 
              backgroundColor: `rgba(${pathColorRgb}, 0.15)`,
              borderColor: `rgba(${pathColorRgb}, 0.25)`,
              color: `rgb(${pathColorRgb})`
            }}
          >
            {isVoice ? <Mic size={20} /> : <Camera size={20} />}
            <span>
              {completionStatus === 'day-completed'
                ? isVoice ? t('writeTab.recordAgain', 'Record Again') : t('writeTab.uploadAgain', 'Upload Again')
                : isVoice ? t('writeTab.startRecording', 'Start Recording') : t('writeTab.uploadJournal', 'Upload Journal')}
            </span>
            <ChevronRight size={16} />
          </button>

          <button
            className="write-action-secondary"
            onClick={handleViewDetails}
          >
            <BookOpen size={16} />
            <span>{completionStatus === 'day-completed' ? t('writeTab.viewEntry', 'View Entry') : t('writeTab.viewDetails', 'View Details')}</span>
          </button>
        </div>
      </div>

      {/* Day Completed Notice */}
      {completionStatus === 'day-completed' && (
        <div className="write-notice">
          <CheckCircle size={18} />
          <div>
            <p>{t('writeTab.alreadyCompleted', "You've already completed this day.")}</p>
            <p className="write-notice-sub">{t('writeTab.uploadOrView', 'Upload again or view your previous entry.')}</p>
          </div>
        </div>
      )}

      {/* Tips Card */}
      {showTip && (
        <div className="write-tips-card">
          <button
            className="write-tips-close"
            onClick={() => setShowTip(false)}
            aria-label={t('writeTab.closeTips', 'Close tips')}
          >
            ×
          </button>

          <div className="write-tips-header">
            <Lightbulb size={16} style={{ color: `rgb(${pathColorRgb})` }} />
            <h3>{isVoice ? t('writeTab.voiceTips', 'Voice Tips') : t('writeTab.journalingTips', 'Journaling Tips')}</h3>
          </div>

          <ul className="write-tips-list">
            <li>
              {isVoice
                ? t('writeTab.tip1Voice', 'Find a quiet space – your voice deserves clarity.')
                : t('writeTab.tip1Write', 'Find a comfortable, quiet space with your Kairos journal.')}
            </li>
            <li>
              {isVoice
                ? t('writeTab.tip2Voice', 'Let emotions flow naturally – authenticity over perfection.')
                : t('writeTab.tip2Write', 'Write by hand for deeper reflection and memory retention.')}
            </li>
            <li>
              {isVoice
                ? t('writeTab.tip3Voice', 'Pauses are welcome – silence is part of the process.')
                : t('writeTab.tip3Write', 'Aim for 10+ minutes of uninterrupted, honest writing.')}
            </li>
          </ul>
        </div>
      )}

      {/* Bottom spacing for nav */}
      <div style={{ height: 40 }} />
    </div>
  );
};

export default WriteTab;