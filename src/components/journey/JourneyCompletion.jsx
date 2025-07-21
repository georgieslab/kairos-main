<<<<<<< HEAD
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
=======
// Modern PathSelection.jsx - Clean Implementation Without Recommended Badges
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Check, 
  Calendar, 
  Archive, 
  Book, 
  Compass, 
  Heart, 
  Brain, 
  Droplet, 
  Palette, 
  RotateCcw, 
  Map, 
  Users,
  ArrowUpRight,
  Clock,
  Zap,
  AlertCircle,
  Star,
  Moon,
  Sun,
  X,
  LayoutGrid,
  List,
  Search,
  TrendingUp,
  Sparkles,
  Award,
  Target,
  Play,
  BookOpen,
  Lightbulb,
  Leaf,
  Coins,
  Brush
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  getAllJourneyPaths, 
  getJourneyPath
} from '../../data/JourneyData';

// Direct import of the CSS file
import '../../styles/components/pathSelection.css';

// Import utilities
import { 
  getNextDayForPath
} from '../../utils/userProgress';

// Import components
import { 
  getUserPathProgress, 
  updateCurrentPath 
} from '../../utils/pathUtils';

// Icon mapping for better performance
const ICON_MAP = {
  'Compass': Compass,
  'Heart': Heart,
  'Brain': Brain,
  'RotateCcw': RotateCcw,
  'Palette': Palette,
  'Users': Users,
  'Map': Map,
  'Moon': Moon,
  'Sun': Sun,
  'Book': Book,
  'Droplet': Droplet,
  'Star': Star,
  'Zap': Zap,
  'Clock': Clock,
  'Archive': Archive,
  'Target': Target,
  'Lightbulb': Lightbulb,
  'Leaf': Leaf,
  'Coins': Coins,
  'Brush': Brush,
  'Sparkles': Sparkles
};

// Difficulty configuration
const DIFFICULTY_CONFIG = {
  'beginner': { icon: Sparkles, label: 'Beginner', color: 'beginner' },
  'intermediate': { icon: Target, label: 'Intermediate', color: 'intermediate' },
  'advanced': { icon: Award, label: 'Advanced', color: 'advanced' }
};

// Main PathSelection component
const PathSelection = ({ navigateToScreen, currentPath = 'self-discovery', currentDay = 1 }) => {
  // Theme and auth hooks
  const { isDarkMode } = useTheme();
  const { userProfile, currentUser } = useAuth();

  // Core state management
  const [state, setState] = useState({
    // UI state
    viewMode: 'grid',
    activeTab: 'all',
    searchQuery: '',
    filterOption: 'all',
    isLoading: true,
    isMobile: false,
    
    // Modal state
    showPathDetails: false,
    selectedPath: null,
    showDisclaimerModal: false,
    selectedTransformationPath: null,
    activePathSwitch: { show: false, newPathId: null },
    
    // Data state
    pathsProgress: {},
    favoritePaths: [],
    disclaimerBypass: {},
    
    // Interaction state
    isNavigating: false,
    hoveredPath: null
  });

  // Destructure state for cleaner access
  const {
    viewMode, activeTab, searchQuery, filterOption, isLoading, isMobile,
    showPathDetails, selectedPath, showDisclaimerModal, selectedTransformationPath,
    activePathSwitch, pathsProgress, favoritePaths, disclaimerBypass,
    isNavigating, hoveredPath
  } = state;

  // State updater helper
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Get all available paths
  const allPaths = useMemo(() => getAllJourneyPaths(), []);

  // Check device type on mount and resize
  useEffect(() => {
    const checkDevice = () => {
      updateState({ isMobile: window.innerWidth <= 640 });
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, [updateState]);

  // Load favorite paths from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteJourneyPaths');
    if (savedFavorites) {
      updateState({ favoritePaths: JSON.parse(savedFavorites) });
    }
  }, [updateState]);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => updateState({ isLoading: false }), 800);
    return () => clearTimeout(timer);
  }, [updateState]);

  // Calculate paths progress
  useEffect(() => {
    if (userProfile && allPaths?.length > 0) {
      const progressData = {};
      allPaths.forEach(path => {
        progressData[path.id] = getUserPathProgress(userProfile, path.id);
      });
      updateState({ pathsProgress: progressData });
    }
  }, [userProfile, allPaths, updateState]);

  // Helper function to get icon component
  const getIconComponent = useCallback((iconName) => {
    const IconComponent = ICON_MAP[iconName] || Book;
    return <IconComponent className="path-icon" />;
  }, []);

  // Helper function to get difficulty info
  const getDifficultyInfo = useCallback((difficulty) => {
    const config = DIFFICULTY_CONFIG[difficulty?.toLowerCase()] || DIFFICULTY_CONFIG['beginner'];
    const IconComponent = config.icon;
    
    return {
      ...config,
      element: <IconComponent className={`difficulty-icon ${config.color}`} size={16} />
    };
  }, []);

  // Check if path has been started
  const hasStartedPath = useCallback((pathId) => {
    const progress = pathsProgress[pathId];
    return progress && progress.completedDays && progress.completedDays.length > 0;
  }, [pathsProgress]);

  // Check if path is active
  const isActivePath = useCallback((pathId) => {
    if (currentPath === pathId) return true;
    
    const progress = pathsProgress[pathId];
    if (!progress || !progress.completedDays) return false;
    
    const completedDays = progress.completedDays;
    const path = getJourneyPath(pathId);
    if (!path) return false;
    
    return completedDays.length > 0 && completedDays.length < path.duration;
  }, [currentPath, pathsProgress]);

  // Check for active journey
  const hasActiveJourney = useCallback((excludePathId = null) => {
    if (!userProfile?.journeyProgress) return false;
    
    for (const pathId of Object.keys(pathsProgress)) {
      if (pathId === excludePathId) continue;
      
      const progress = getUserPathProgress(userProfile, pathId);
      const completedDays = progress?.completedDays || [];
      const path = getJourneyPath(pathId);
      
      if (!path) continue;
      
      if (completedDays.length > 0 && completedDays.length < path.duration) {
        return true;
      }
    }
    
    return false;
  }, [userProfile, pathsProgress]);

  // Toggle favorite path
  const toggleFavorite = useCallback((pathId, e) => {
    e.stopPropagation();
    
    const newFavorites = favoritePaths.includes(pathId) 
      ? favoritePaths.filter(id => id !== pathId)
      : [...favoritePaths, pathId];
    
    localStorage.setItem('favoriteJourneyPaths', JSON.stringify(newFavorites));
    updateState({ favoritePaths: newFavorites });
  }, [favoritePaths, updateState]);

  // Toggle view mode
  const toggleViewMode = useCallback(() => {
    updateState({ viewMode: viewMode === 'grid' ? 'list' : 'grid' });
  }, [viewMode, updateState]);

  // Filter paths based on current filters
  const filteredPaths = useMemo(() => {
    if (!allPaths?.length) return [];
    
    let filtered = [...allPaths];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(path => 
        path.title.toLowerCase().includes(query) ||
        path.subtitle.toLowerCase().includes(query) ||
        path.description?.toLowerCase().includes(query) ||
        path.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply tab filters
    switch (activeTab) {
      case 'active':
        filtered = filtered.filter(path => {
          const progress = pathsProgress[path.id];
          return progress && progress.completedDays && progress.completedDays.length > 0 && 
                 progress.completedDays.length < path.duration;
        });
        break;
      case 'completed':
        filtered = filtered.filter(path => {
          const progress = pathsProgress[path.id];
          const completedDays = progress?.completedDays || [];
          return completedDays.length >= path.duration;
        });
        break;
      case 'not-started':
        filtered = filtered.filter(path => {
          const progress = pathsProgress[path.id];
          return !progress || !progress.completedDays || progress.completedDays.length === 0;
        });
        break;
      case 'favorites':
        filtered = filtered.filter(path => favoritePaths.includes(path.id));
        break;
    }
    
    // Apply duration filters
    switch (filterOption) {
      case 'short':
        filtered = filtered.filter(path => path.duration <= 14);
        break;
      case 'medium':
        filtered = filtered.filter(path => path.duration > 14 && path.duration <= 30);
        break;
      case 'long':
        filtered = filtered.filter(path => path.duration > 30);
        break;
    }
    
    return filtered;
  }, [allPaths, searchQuery, activeTab, filterOption, pathsProgress, favoritePaths]);

  // Calculate tab counts
  const tabCounts = useMemo(() => {
    if (!allPaths?.length || !pathsProgress) return {};
    
    return {
      active: allPaths.filter(path => {
        const progress = pathsProgress[path.id];
        return progress && progress.completedDays && 
               progress.completedDays.length > 0 && 
               progress.completedDays.length < path.duration;
      }).length,
      completed: allPaths.filter(path => {
        const progress = pathsProgress[path.id];
        const completedDays = progress?.completedDays || [];
        return completedDays.length >= path.duration;
      }).length,
      favorites: favoritePaths.length
    };
  }, [allPaths, pathsProgress, favoritePaths]);

  // Handle special path disclaimer
  const handleSpecialPathStart = useCallback((pathId) => {
    if (pathId === 'transformation-journey' && !hasStartedPath(pathId) && !disclaimerBypass[pathId]) {
      updateState({ 
        selectedTransformationPath: pathId,
        showDisclaimerModal: true 
      });
      return true;
    }
    return false;
  }, [hasStartedPath, disclaimerBypass, updateState]);

  // Handle disclaimer acceptance
  const handleAcceptDisclaimer = useCallback(() => {
    if (!selectedTransformationPath) {
      updateState({ showDisclaimerModal: false });
      return;
    }
    
    updateState({
      disclaimerBypass: { ...disclaimerBypass, [selectedTransformationPath]: true },
      showDisclaimerModal: false
    });
    
    const pathId = selectedTransformationPath;
    updateState({ selectedTransformationPath: null });
    
    setTimeout(() => {
      const nextDay = getNextDayForPath(userProfile, pathId);
      navigateToScreen('write', { pathId, day: nextDay });
    }, 300);
  }, [selectedTransformationPath, disclaimerBypass, userProfile, navigateToScreen, updateState]);

  // Handle journey continuation
  const handleContinueJourney = useCallback(async (pathId) => {
    if (isNavigating) return;
    updateState({ isNavigating: true });
    
    if (handleSpecialPathStart(pathId)) {
      updateState({ isNavigating: false });
      return;
    }
    
    const progress = pathsProgress[pathId] || { completedDays: [] };
    const pathData = getJourneyPath(pathId);
    const isCompleted = progress.completedDays?.length >= pathData.duration;
    
    if (!isCompleted && !hasStartedPath(pathId) && hasActiveJourney(pathId)) {
      updateState({
        activePathSwitch: { show: true, newPathId: pathId },
        isNavigating: false
      });
      return;
    }
    
    const nextDay = getNextDayForPath(userProfile, pathId);
    
    if (!hasStartedPath(pathId) || currentPath !== pathId) {
      try {
        await updateCurrentPath(userProfile.uid, pathId);
      } catch (error) {
        console.error('Error updating current path:', error);
      }
    }
    
    setTimeout(() => {
      navigateToScreen('write', { pathId, day: nextDay });
      updateState({ isNavigating: false });
    }, 100);
  }, [isNavigating, handleSpecialPathStart, pathsProgress, hasStartedPath, hasActiveJourney, userProfile, currentPath, navigateToScreen, updateState]);

  // Modal handlers
  const openPathDetails = useCallback((path) => {
    updateState({ selectedPath: path, showPathDetails: true });
  }, [updateState]);

  const closePathDetails = useCallback(() => {
    updateState({ selectedPath: null, showPathDetails: false });
  }, [updateState]);

  // Event handlers
  const handleTabChange = useCallback((tab) => {
    updateState({ activeTab: tab });
  }, [updateState]);

  const handleFilterChange = useCallback((filter) => {
    updateState({ filterOption: filter });
  }, [updateState]);

  const handleSearchChange = useCallback((e) => {
    updateState({ searchQuery: e.target.value });
  }, [updateState]);

  const handleSearchClear = useCallback(() => {
    updateState({ searchQuery: '' });
  }, [updateState]);

  const handleResetFilters = useCallback(() => {
    updateState({
      activeTab: 'all',
      filterOption: 'all',
      searchQuery: ''
    });
  }, [updateState]);

  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <div className={`paths-${viewMode}`}>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className={`path-card skeleton ${viewMode}`}>
          <div className="skeleton-shimmer" />
        </div>
      ))}
    </div>
  );

  // Render path card
  const renderPathCard = useCallback((pathData) => {
    const { id, title, subtitle, iconName, duration, difficulty = 'beginner', tags = [] } = pathData;
    
    const progress = pathsProgress[id] || { completedDays: [] };
    const completedDays = progress.completedDays || [];
    const completionPercentage = (completedDays.length / duration) * 100;
    const hasStarted = hasStartedPath(id);
    const nextDay = getNextDayForPath(userProfile, id);
    const isCompleted = completedDays.length >= duration;
    const isActive = isActivePath(id);
    const isFavorite = favoritePaths.includes(id);
    const isHovered = hoveredPath === id;
    const isPremium = duration > 10;
    
    const classNames = [
      'path-card',
      id,
      isCompleted ? 'completed' : '',
      isActive ? 'active-journey' : '',
      isHovered ? 'hovered' : '',
      isPremium ? 'premium' : '',
      viewMode
    ].filter(Boolean).join(' ');
    
    const difficultyInfo = getDifficultyInfo(difficulty);
    
    return (
      <div 
        key={id}
        className={classNames}
        onClick={() => openPathDetails(pathData)}
        onMouseEnter={() => updateState({ hoveredPath: id })}
        onMouseLeave={() => updateState({ hoveredPath: null })}
        tabIndex={0}
        role="button"
        aria-label={`${title} journey, ${completedDays.length} of ${duration} days completed`}
      >
        {/* Premium indicator - positioned at top center */}
        {isPremium && !isCompleted && (
          <div className="premium-indicator">
            <Star size={12} />
            <span>Premium</span>
          </div>
        )}

        {/* Status badges - positioned below favorite button */}
        <div className="path-badges">
          {isCompleted && (
            <div className="path-completion-badge">
              <Award size={14} />
              <span>Completed</span>
            </div>
          )}
          {isActive && !isCompleted && (
            <div className="path-active-badge">
              <TrendingUp size={14} />
              <span>Active</span>
            </div>
          )}
        </div>

        {/* Favorite button - positioned top right */}
        <button 
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          onClick={(e) => toggleFavorite(id, e)}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star size={16} />
        </button>

        {/* Path card header */}
        <div className="path-card-header">
          <div className={`path-icon-wrapper ${id}`}>
            {getIconComponent(iconName)}
            {isActive && !isCompleted && (
              <div className="active-indicator" />
            )}
          </div>
          
          {viewMode === 'list' && (
            <div className="path-metadata">
              <div className="path-difficulty">
                {difficultyInfo.element}
                <span>{difficultyInfo.label}</span>
              </div>
              <div className="path-duration">
                <Calendar size={14} />
                <span>{duration} days</span>
              </div>
            </div>
          )}
        </div>

        {/* Path card content */}
        <div className="path-card-content">
          <h3 className="path-card-title">{title}</h3>
          {viewMode === 'grid' && <p className="path-card-subtitle">{subtitle}</p>}
          
          {/* Tags */}
          {viewMode === 'grid' && tags.length > 0 && (
            <div className="path-tags">
              {tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="path-tag">{tag}</span>
              ))}
            </div>
          )}
          
          {/* Progress indicator */}
          <div className="path-progress-indicator">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="progress-text">
              <span className="progress-fraction">{completedDays.length}/{duration}</span>
              <span className="progress-percentage">{Math.round(completionPercentage)}%</span>
            </div>
          </div>
          
          {/* Metadata for grid view */}
          {viewMode === 'grid' && (
            <div className="path-metadata">
              <div className="path-difficulty">
                {difficultyInfo.element}
                <span>{difficultyInfo.label}</span>
              </div>
              <div className="path-duration">
                <Calendar size={14} />
                <span>{duration} days</span>
              </div>
            </div>
          )}
        </div>

        {/* Action button */}
        <div className="path-action">
          <button 
            className={`continue-button ${isActive ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleContinueJourney(id);
            }}
            disabled={isNavigating}
            aria-label={!hasStarted ? 'Start Journey' : isCompleted ? 'Review Journey' : 'Continue Journey'}
          >
            {!hasStarted ? (
              <>
                <Play size={16} />
                <span>Start</span>
              </>
            ) : isCompleted ? (
              <>
                <BookOpen size={16} />
                <span>Review</span>
              </>
            ) : (
              <>
                <ArrowUpRight size={16} />
                <span>Continue</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }, [pathsProgress, hasStartedPath, userProfile, isActivePath, favoritePaths, hoveredPath, getDifficultyInfo, getIconComponent, openPathDetails, updateState, toggleFavorite, handleContinueJourney, isNavigating, viewMode]);

  // Render path details modal
  const renderPathDetailsModal = () => {
    if (!selectedPath) return null;
    
    const { id, title, subtitle, description, iconName, days, duration, difficulty = 'beginner', tags = [], recommendedFor = [] } = selectedPath;
    
    const progress = pathsProgress[id] || { completedDays: [] };
    const completedDays = progress.completedDays || [];
    const completionPercentage = (completedDays.length / duration) * 100;
    const hasStarted = hasStartedPath(id);
    const nextDay = getNextDayForPath(userProfile, id);
    const isCompleted = completedDays.length >= duration;
    const isFavorite = favoritePaths.includes(id);
    const isPremium = duration > 10;
    const difficultyInfo = getDifficultyInfo(difficulty);
    
    return (
      <div className="path-details-modal-overlay" onClick={closePathDetails}>
        <div 
          className={`path-details-modal ${id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className={`path-icon-wrapper-large ${id}`}>
              {getIconComponent(iconName)}
            </div>
            <div className="header-content">
              <h2>{title}</h2>
              <p className="path-subtitle">{subtitle}</p>
            </div>
            <button 
              className={`favorite-button-large ${isFavorite ? 'active' : ''}`}
              onClick={(e) => toggleFavorite(id, e)}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star size={20} />
            </button>
            <button 
              className="close-button" 
              onClick={closePathDetails}
              aria-label="Close details"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="modal-content">
            <div className="path-metadata-row">
              <div className="metadata-item">
                <Calendar size={16} />
                <span>{duration} days</span>
              </div>
              <div className="metadata-item">
                {difficultyInfo.element}
                <span>{difficultyInfo.label}</span>
              </div>
              {isPremium && (
                <div className="metadata-item premium">
                  <Star size={16} />
                  <span>Premium</span>
                </div>
              )}
              {isCompleted && (
                <div className="metadata-item completed">
                  <Award size={16} />
                  <span>Completed</span>
                </div>
              )}
            </div>
            
            {tags.length > 0 && (
              <div className="path-tags-detailed">
                {tags.map((tag, index) => (
                  <span key={index} className="path-tag">{tag}</span>
                ))}
              </div>
            )}
            
            <p className="path-description">{description}</p>
            
            {recommendedFor.length > 0 && (
              <div className="recommended-for-section">
                <h4>Recommended for:</h4>
                <ul>
                  {recommendedFor.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="path-progress-container">
              <h3>Your Progress</h3>
              <div className="progress-visual">
                <div className="progress-bar-large">
                  <div 
                    className="progress-fill"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <div className="progress-stats">
                  <div className="stat">
                    <span className="stat-value">{completedDays.length}</span>
                    <span className="stat-label">Days Complete</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{duration - completedDays.length}</span>
                    <span className="stat-label">Days Remaining</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{Math.round(completionPercentage)}%</span>
                    <span className="stat-label">Progress</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="days-overview-section">
              <h3>Journey Timeline</h3>
              <div className="days-timeline">
                {days.map((day, index) => {
                  const dayNumber = day.day;
                  const completed = completedDays.includes(dayNumber);
                  const isCurrent = dayNumber === nextDay;
                  const isPast = dayNumber < nextDay;
                  
                  return (
                    <div 
                      key={dayNumber}
                      className={`timeline-item ${completed ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isPast && !completed ? 'missed' : ''}`}
                    >
                      <div className="timeline-marker">
                        {completed ? <Check size={12} /> : <span>{dayNumber}</span>}
                      </div>
                      {index < days.length - 1 && <div className="timeline-line" />}
                      <div className="timeline-content">
                        <h5>{day.title}</h5>
                        <p>{day.theme}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="featured-days">
              <h3>Key Milestones</h3>
              <div className="milestones-grid">
                <div className="milestone">
                  <div className="milestone-icon">
                    <Play size={18} />
                  </div>
                  <div className="milestone-content">
                    <h4>Day 1: {days[0]?.title || 'Introduction'}</h4>
                    <p>{days[0]?.theme || 'Begin your journey'}</p>
                  </div>
                </div>
                
                {days.length > 1 && (
                  <div className="milestone">
                    <div className="milestone-icon">
                      <Target size={18} />
                    </div>
                    <div className="milestone-content">
                      <h4>Day {Math.ceil(days.length / 2)}: {days[Math.ceil(days.length / 2) - 1]?.title || 'Middle Path'}</h4>
                      <p>{days[Math.ceil(days.length / 2) - 1]?.theme || 'Deepen your practice'}</p>
                    </div>
                  </div>
                )}
                
                <div className="milestone">
                  <div className="milestone-icon">
                    <Award size={18} />
                  </div>
                  <div className="milestone-content">
                    <h4>Day {days.length}: {days[days.length - 1]?.title || 'Completion'}</h4>
                    <p>{days[days.length - 1]?.theme || 'Reflect on your journey'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              className="secondary-button"
              onClick={closePathDetails}
            >
              Close
            </button>
            
            <button 
              className={`primary-button ${id}`}
              onClick={() => {
                closePathDetails();
                setTimeout(() => handleContinueJourney(id), 100);
              }}
              disabled={isNavigating}
            >
              {!hasStarted ? (
                <>
                  <Play size={16} />
                  <span>Start Journey</span>
                </>
              ) : isCompleted ? (
                <>
                  <BookOpen size={16} />
                  <span>Review Journey</span>
                </>
              ) : (
                <>
                  <ArrowUpRight size={16} />
                  <span>Continue Journey</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render path switching confirmation modal
  const renderPathSwitchModal = () => {
    if (!activePathSwitch.show) return null;
    
    return (
      <div className="modal-overlay" onClick={() => updateState({ activePathSwitch: { show: false, newPathId: null } })}>
        <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <AlertCircle className="modal-warning-icon" size={20} />
            <h3 className="modal-title">Switch Active Journey?</h3>
          </div>
          
          <div className="modal-content">
            <p className="modal-message">
              You currently have an active journey in progress. Starting a new journey will pause your current one.
            </p>
            <p className="modal-note">
              Don't worry - your progress will be saved and you can return to it anytime.
            </p>
          </div>
          
          <div className="modal-footer">
            <button 
              className="secondary-button"
              onClick={() => updateState({ activePathSwitch: { show: false, newPathId: null } })}
            >
              Keep Current Journey
            </button>
            
            <button 
              className="primary-button"
              onClick={async () => {
                const pathId = activePathSwitch.newPathId;
                updateState({ activePathSwitch: { show: false, newPathId: null } });
                
                const nextDay = getNextDayForPath(userProfile, pathId);
                
                try {
                  await updateCurrentPath(userProfile.uid, pathId);
                } catch (error) {
                  console.error('Error updating current path:', error);
                }
                
                setTimeout(() => {
                  navigateToScreen('write', { pathId, day: nextDay });
                }, 100);
              }}
            >
              <RotateCcw size={14} />
              <span>Switch Journey</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render empty state
  const renderEmptyState = () => {
    const isSearchEmpty = searchQuery.trim().length > 0;
    
    return (
      <div className="empty-state">
        <div className="empty-icon">
          {isSearchEmpty ? <Search size={48} /> : <Compass size={48} />}
        </div>
        <h3>{isSearchEmpty ? 'No results found' : 'No journeys found'}</h3>
        <p>
          {isSearchEmpty 
            ? `We couldn't find any journeys matching "${searchQuery}"`
            : 'No journeys match your current filters. Try adjusting your filters to see more options.'
          }
        </p>
        <button
          className="reset-button"
          onClick={handleResetFilters}
        >
          <RotateCcw size={14} />
          <span>Reset Filters</span>
        </button>
      </div>
    );
  };

  return (
    <div className={`path-selection-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Skip to content for accessibility */}
      <a className="skip-to-content sr-only" href="#main-content">
        Skip to main content
      </a>

      {/* Header Section */}
      <header className="header-container">
        <div className="page-header">
          <div className="header-text">
            <h1>Your Journaling Paths</h1>
            <p className="page-subtitle">
              Explore guided journaling experiences for personal growth and reflection
            </p>
          </div>
          <div className="header-actions">
            {!isMobile && (
              <button 
                className="view-toggle-button" 
                onClick={toggleViewMode}
                title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
                aria-label={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
              >
                {viewMode === 'grid' ? <List size={18} /> : <LayoutGrid size={18} />}
              </button>
            )}
          </div>
        </div>
        
        {/* Search bar */}
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input 
            type="text"
            className="search-input"
            placeholder="Search journeys by name, topic, or keyword..."
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search journeys"
          />
          {searchQuery && (
            <button 
              className="search-clear"
              onClick={handleSearchClear}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </header>
      
      {/* Navigation tabs */}
      <nav className="tabs-container" role="tablist" aria-label="Journey categories">
        <div className="tabs-scroll-container">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabChange('all')}
            role="tab"
            aria-selected={activeTab === 'all'}
            aria-controls="paths-content"
          >
            <span>All Paths</span>
          </button>
          <button 
            className={`tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => handleTabChange('active')}
            role="tab"
            aria-selected={activeTab === 'active'}
            aria-controls="paths-content"
          >
            <span>In Progress</span>
            {tabCounts.active > 0 && (
              <span className="tab-badge">{tabCounts.active}</span>
            )}
          </button>
          <button 
            className={`tab ${activeTab === 'not-started' ? 'active' : ''}`}
            onClick={() => handleTabChange('not-started')}
            role="tab"
            aria-selected={activeTab === 'not-started'}
            aria-controls="paths-content"
          >
            <span>Not Started</span>
          </button>
          <button 
            className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => handleTabChange('completed')}
            role="tab" 
            aria-selected={activeTab === 'completed'}
            aria-controls="paths-content"
          >
            <span>Completed</span>
            {tabCounts.completed > 0 && (
              <span className="tab-badge completed">{tabCounts.completed}</span>
            )}
          </button>
          <button 
            className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => handleTabChange('favorites')}
            role="tab"
            aria-selected={activeTab === 'favorites'}
            aria-controls="paths-content"
          >
            <Star size={14} />
            <span>Favorites</span>
            {tabCounts.favorites > 0 && (
              <span className="tab-badge favorite">{tabCounts.favorites}</span>
            )}
          </button>
        </div>
      </nav>
      
      {/* Filters */}
      <div className="filters-container" role="group" aria-label="Journey filters">
        <button 
          className={`filter-chip ${filterOption === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
          aria-pressed={filterOption === 'all'}
        >
          All Lengths
        </button>
        <button 
          className={`filter-chip ${filterOption === 'short' ? 'active' : ''}`}
          onClick={() => handleFilterChange('short')}
          aria-pressed={filterOption === 'short'}
        >
          <Zap size={14} />
          <span>Short (≤14 days)</span>
        </button>
        <button 
          className={`filter-chip ${filterOption === 'medium' ? 'active' : ''}`}
          onClick={() => handleFilterChange('medium')}
          aria-pressed={filterOption === 'medium'}
        >
          <Clock size={14} />
          <span>Medium (15-30 days)</span>
        </button>
        <button 
          className={`filter-chip ${filterOption === 'long' ? 'active' : ''}`}
          onClick={() => handleFilterChange('long')}
          aria-pressed={filterOption === 'long'}
        >
          <Target size={14} />
          <span>Long (30+ days)</span>
        </button>
      </div>
      
      {/* Main content */}
      <main id="main-content">
        {/* Path grid/list */}
        <section className="paths-section" aria-labelledby="paths-heading">
          {isLoading ? (
            renderLoadingSkeleton()
          ) : filteredPaths.length > 0 ? (
            <>
              {/* Section header */}
              <div className="section-header">
                <h2 id="paths-heading">
                  {activeTab === 'active' && 'Active Journeys'}
                  {activeTab === 'completed' && 'Completed Journeys'}
                  {activeTab === 'not-started' && 'Available Journeys'}
                  {activeTab === 'favorites' && 'Favorite Journeys'}
                  {activeTab === 'all' && (searchQuery ? 'Search Results' : 'All Journeys')}
                </h2>
              </div>
              
              {/* Paths container */}
              <div 
                className={`paths-${viewMode}`}
                role="grid"
                aria-label="Journey paths"
                id="paths-content"
              >
                {filteredPaths.map(pathData => renderPathCard(pathData))}
              </div>
            </>
          ) : (
            renderEmptyState()
          )}
        </section>
      </main>
      
      {/* Modals */}
      {showPathDetails && renderPathDetailsModal()}
      {renderPathSwitchModal()}
      
      {/* Transformation Journey Disclaimer Modal */}
      {showDisclaimerModal && (
        <JourneyDisclaimerModal 
          onAccept={handleAcceptDisclaimer}
          onCancel={() => {
            updateState({ 
              showDisclaimerModal: false, 
              selectedTransformationPath: null 
            });
          }}
        />
      )}
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    </div>
  );
};

<<<<<<< HEAD
export default JourneyCompletion;
=======
export default PathSelection;
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
