// src/components/journey/JourneyCompletion.jsx - CORRECT COMPLETION COMPONENT
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Award, 
  Calendar, 
  CheckCircle, 
  ArrowRight, 
  RotateCcw, 
  Share2, 
  Download, 
  Book,
  Star,
  Sparkles,
  Target,
  Trophy,
  Heart,
  ChevronRight,
  FileText,
  BarChart3,
  Play,
  BookOpen,
  Compass
} from 'lucide-react';

// Import path data utilities
import { getJourneyPath } from '../../data/JourneyData';
import { getUserPathProgress, getProgressFieldForPath } from '../../utils/pathUtils';

// Import dynamic icon component
import DynamicIcon from '../common/DynamicIcon';

// Import completion hook
import useJourneyCompletion from '../../hooks/useJourneyCompletion';

// Import styles
import '../../styles/components/journeyCompletion.css';

const JourneyCompletion = ({ 
  navigateToScreen,
  pathId: propPathId, // ✅ NEW: Accept pathId as prop
  onRestart, 
  onViewDay 
}) => {
  const { userProfile } = useAuth();
  const { isDarkMode } = useTheme();
  
  // Get the completed path from props or fallback methods
  const [pathId, setPathId] = useState(propPathId || null);
  const [pathData, setPathData] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [achievementUnlocked, setAchievementUnlocked] = useState(false);

  // Use the journey completion hook
  const { 
    markJourneyAsViewed,
    completedJourneys,
    isJourneyCompleted 
  } = useJourneyCompletion(pathId, navigateToScreen);

  // Initialize path data from props or fallback methods
  useEffect(() => {
    // Priority: prop > URL params > app state
    let targetPathId = propPathId;
    
    if (!targetPathId) {
      // Try URL params
      const urlParams = new URLSearchParams(window.location.search);
      targetPathId = urlParams.get('pathId');
    }
    
    if (!targetPathId) {
      // Try app state
      targetPathId = window.appState?.completionPathId || 
                   window.appState?.currentPath;
    }

    if (targetPathId) {
      console.log('JourneyCompletion: Setting pathId to:', targetPathId);
      setPathId(targetPathId);
      
      // Mark this journey as viewed when the component loads
      markJourneyAsViewed(targetPathId);
    } else {
      console.warn('JourneyCompletion: No pathId found, redirecting to home');
      // If no path ID found, redirect to home or path selection
      setTimeout(() => {
        navigateToScreen('home');
      }, 100);
    }
  }, [propPathId, markJourneyAsViewed, navigateToScreen]); // ✅ NEW: Include propPathId in dependencies

  // Load path data and user progress
  useEffect(() => {
    if (pathId && userProfile) {
      try {
        const path = getJourneyPath(pathId);
        const progress = getUserPathProgress(userProfile, pathId);
        
        console.log('JourneyCompletion: Path data loaded:', { path, progress });
        
        setPathData(path);
        setUserProgress(progress);
        
        // Show celebration animation
        setTimeout(() => setCelebrationVisible(true), 500);
        
        // Check for achievement unlock
        const completedCount = Object.values(userProfile.journeyProgress || {})
          .filter(p => p?.completedDays?.length >= 10).length;
        
        if (completedCount >= 3) {
          setTimeout(() => setAchievementUnlocked(true), 1500);
        }
      } catch (error) {
        console.error('Error loading path data:', error);
        navigateToScreen('home');
      }
    }
  }, [pathId, userProfile, navigateToScreen]);

  // If no path data yet, show loading
  if (!pathData || !userProgress) {
    return (
      <div className={`journey-completion-container loading ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Loading your journey completion...</p>
        </div>
      </div>
    );
  }

  const completedDays = userProgress.completedDays || [];
  const totalDays = pathData.duration;
  const completionPercentage = Math.round((completedDays.length / totalDays) * 100);

  // Get path info for styling
  const getPathInfo = (pathId) => {
    const pathColorMap = {
      'self-discovery': '43, 70, 60',
      'emotional-intelligence': '168, 85, 247',
      'mindfulness-awareness': '34, 197, 94',
      'transformation-journey': '239, 68, 68',
      'creative-expression': '236, 72, 153',
      'habit-formation': '59, 130, 246',
      'life-vision': '251, 146, 60',
      'gratitude-practice': '34, 197, 94',
      'shadow-work': '168, 85, 247',
      'nature-connection': '34, 197, 94',
      'anxiety-alchemy': '168, 85, 247',
      'courage-cultivation': '239, 68, 68',
      'inner-child': '236, 72, 153',
      'dream-decoder': '168, 85, 247',
      'forgiveness-freedom': '34, 197, 94',
      'career-compass': '59, 130, 246',
      'transitions-navigator': '251, 146, 60',
      'financial-mindfulness': '34, 197, 94',
      'life-values': '59, 130, 246',
      'seasonal-rhythms': '34, 197, 94',
      'relationship-mastery': '236, 72, 153',
      'grief-growth': '168, 85, 247',
      'digital-detox': '59, 130, 246',
      'holistic-transformation': '251, 146, 60',
      // Visual paths
      'mindful-visualization': '168, 85, 247',
      'artistic-soul-expression': '236, 72, 153',
      'color-psychology': '251, 146, 60',
      'sacred-geometry': '168, 85, 247',
      'nature-sketching': '34, 197, 94',
      'abstract-emotions': '239, 68, 68',
      'visual-storytelling': '59, 130, 246',
      'ink-essence': '107, 114, 128'
    };

    const color = pathColorMap[pathId] || '43, 70, 60';
    
    return {
      title: pathData.title,
      subtitle: `You've completed your ${totalDays}-day ${pathData.title}!`,
      color: color,
      iconName: pathData.iconName || 'Award',
      description: pathData.description,
      duration: totalDays
    };
  };

  const pathInfo = getPathInfo(pathId);

  // Calculate statistics
  const getJourneyStats = () => {
    const stats = {
      totalDays: totalDays,
      completedDays: completedDays.length,
      completionDate: new Date().toLocaleDateString(),
      timeSpent: `${totalDays} days`, // Could calculate actual time if tracking
      consistency: Math.round((completedDays.length / totalDays) * 100)
    };

    return stats;
  };

  const stats = getJourneyStats();

  // Handle navigation
  const handleExploreMore = () => {
    navigateToScreen('path-selection');
  };

  const handleViewJournal = () => {
    navigateToScreen('journal-archive');
  };

  const handleRestartJourney = () => {
    if (onRestart) {
      onRestart();
    } else {
      // Reset progress and restart (you might want to add confirmation)
      navigateToScreen('journey-preview', { pathId });
    }
  };

  const handleAnalytics = () => {
    navigateToScreen('analytics-dashboard');
  };

  const handleViewDay = (day) => {
    if (onViewDay) {
      onViewDay(day);
    } else {
      navigateToScreen('daily', { 
        day, 
        pathId,
        fromCompletion: true,
        skipCompletionCheck: true 
      });
    }
  };

  return (
    <div 
      className={`journey-completion-container ${isDarkMode ? 'dark' : 'light'} ${pathId}`}
      style={{
        '--path-color': pathInfo.color,
        '--path-color-rgb': pathInfo.color
      }}
    >
      {/* Celebration Animation */}
      {celebrationVisible && (
        <div className="celebration-overlay">
          <div className="confetti"></div>
          <div className="celebration-burst"></div>
        </div>
      )}

      {/* Achievement Notification */}
      {achievementUnlocked && (
        <div className="achievement-notification">
          <Trophy className="achievement-icon" />
          <div className="achievement-text">
            <h4>Achievement Unlocked!</h4>
            <p>Journey Master - Complete 3 journeys</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="completion-content">
        {/* Header Section */}
        <header className="completion-header">
          <div className="completion-icon-wrapper">
            <div className="icon-background">
              <DynamicIcon name={pathInfo.iconName} className="completion-icon" />
            </div>
            <div className="completion-badge">
              <Award className="badge-icon" />
            </div>
          </div>
          
          <div className="completion-title-section">
            <h1 className="completion-title">Journey Complete!</h1>
            <h2 className="path-title">{pathInfo.title}</h2>
            <p className="completion-subtitle">{pathInfo.subtitle}</p>
          </div>

          <div className="completion-stats-quick">
            <div className="stat-item">
              <Calendar className="stat-icon" />
              <span className="stat-value">{stats.totalDays}</span>
              <span className="stat-label">Days</span>
            </div>
            <div className="stat-item">
              <CheckCircle className="stat-icon" />
              <span className="stat-value">{completionPercentage}%</span>
              <span className="stat-label">Complete</span>
            </div>
            <div className="stat-item">
              <Star className="stat-icon" />
              <span className="stat-value">Done</span>
              <span className="stat-label">Status</span>
            </div>
          </div>
        </header>

        {/* Journey Summary */}
        <section className="journey-summary">
          <h3>
            <Sparkles className="section-icon" />
            Your Journey Summary
          </h3>
          
          <div className="summary-grid">
            <div className="summary-card">
              <Target className="summary-icon" />
              <h4>Days Completed</h4>
              <p className="summary-value">{completedDays.length} of {totalDays}</p>
              <p className="summary-description">
                You've successfully completed this entire journey!
              </p>
            </div>

            <div className="summary-card">
              <Heart className="summary-icon" />
              <h4>Consistency</h4>
              <p className="summary-value">{stats.consistency}%</p>
              <p className="summary-description">
                Amazing dedication to your personal growth
              </p>
            </div>

            <div className="summary-card">
              <Trophy className="summary-icon" />
              <h4>Achievement</h4>
              <p className="summary-value">Journey Master</p>
              <p className="summary-description">
                You've completed a full journaling journey
              </p>
            </div>
          </div>
        </section>

        {/* Journey Timeline Preview */}
        <section className="journey-timeline-preview">
          <h3>
            <Book className="section-icon" />
            Your Journey Timeline
          </h3>
          
          <div className="timeline-container">
            {pathData.days && pathData.days.slice(0, 5).map((day, index) => (
              <div 
                key={day.day} 
                className="timeline-day completed"
                onClick={() => handleViewDay(day.day)}
              >
                <div className="timeline-marker">
                  <CheckCircle className="timeline-check" />
                </div>
                <div className="timeline-content">
                  <h5>Day {day.day}: {day.title}</h5>
                  <p>{day.theme}</p>
                </div>
              </div>
            ))}
            
            {pathData.days && pathData.days.length > 5 && (
              <div className="timeline-more">
                <button 
                  className="view-all-days-btn"
                  onClick={handleViewJournal}
                >
                  <span>View All {totalDays} Days</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Action Buttons */}
        <section className="completion-actions">
          <h3>What's Next?</h3>
          
          <div className="actions-grid">
            <button 
              className="action-button primary"
              onClick={handleExploreMore}
            >
              <Compass className="action-icon" />
              <div className="action-content">
                <h4>Explore More Journeys</h4>
                <p>Discover new paths for continued growth</p>
              </div>
              <ArrowRight className="action-arrow" />
            </button>

            <button 
              className="action-button secondary"
              onClick={handleViewJournal}
            >
              <FileText className="action-icon" />
              <div className="action-content">
                <h4>View Your Journal</h4>
                <p>Revisit your entries and insights</p>
              </div>
              <ArrowRight className="action-arrow" />
            </button>

            <button 
              className="action-button secondary"
              onClick={handleAnalytics}
            >
              <BarChart3 className="action-icon" />
              <div className="action-content">
                <h4>View Analytics</h4>
                <p>See patterns and progress over time</p>
              </div>
              <ArrowRight className="action-arrow" />
            </button>

            <button 
              className="action-button tertiary"
              onClick={handleRestartJourney}
            >
              <RotateCcw className="action-icon" />
              <div className="action-content">
                <h4>Restart Journey</h4>
                <p>Begin this path again</p>
              </div>
              <ArrowRight className="action-arrow" />
            </button>
          </div>
        </section>

        {/* Motivational Quote */}
        <section className="completion-quote">
          <div className="quote-content">
            <blockquote>
              "The journey of a thousand miles begins with a single step. You've taken {totalDays} steps on your path of self-discovery."
            </blockquote>
            <cite>— Inspired by Lao Tzu</cite>
          </div>
        </section>
      </div>
    </div>
  );
};

export default JourneyCompletion;