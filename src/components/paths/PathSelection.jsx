<<<<<<< HEAD
// src/components/paths/PathSelection.jsx - Complete Implementation with Unlimited Active Journeys
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
=======
// Clean PathSelection.jsx - Production Ready (Debug messages removed)

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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
<<<<<<< HEAD
  AlertCircle,
  Star,
  Moon,
  Sun,
  X,
=======
  Filter,
  AlertCircle,
  ChevronRight,
  Star,
  Moon,
  Sun,
  PlusCircle,
  X,
  Info,
  Bookmark,
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  LayoutGrid,
  List,
  Search,
  TrendingUp,
  Sparkles,
  Award,
  Target,
<<<<<<< HEAD
=======
  Lock,
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  Play,
  BookOpen,
  Lightbulb,
  Leaf,
  Coins,
<<<<<<< HEAD
  Brush,
  Feather
=======
  Brush
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  getAllJourneyPaths, 
  getJourneyPath
} from '../../data/JourneyData';

<<<<<<< HEAD
// ✅ CRITICAL: Import the CSS file
=======
// Direct import of the CSS file
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
import '../../styles/components/pathSelection.css';

// Import utilities
import { 
  getNextDayForPath
} from '../../utils/userProgress';

// Import components
<<<<<<< HEAD
import { 
=======
import JourneyDisclaimerModal from './components/JourneyDisclaimerModal';
import { 
  getProgressFieldForPath, 
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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
<<<<<<< HEAD
=======
  'Bookmark': Bookmark,
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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

<<<<<<< HEAD
// Journey Disclaimer Modal Component (only for Transformation Journey)
const JourneyDisclaimerModal = ({ onAccept, onCancel }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div className="disclaimer-modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <AlertCircle className="modal-warning-icon" size={24} />
        <h3>Important Notice</h3>
      </div>
      
      <div className="modal-content">
        <p>
          The Transformation Journey is an intensive 21-day program designed for deep personal work. 
          Please ensure you have the time and emotional capacity to engage fully with this journey.
        </p>
        <p>
          This journey may bring up challenging emotions and requires consistent daily commitment.
        </p>
      </div>
      
      <div className="modal-footer">
        <button className="secondary-button" onClick={onCancel}>
          Cancel
        </button>
        <button className="primary-button" onClick={onAccept}>
          I Understand, Continue
        </button>
      </div>
    </div>
  </div>
);

=======
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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
<<<<<<< HEAD
=======
    activePathSwitch: { show: false, newPathId: null },
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    
    // Data state
    pathsProgress: {},
    favoritePaths: [],
    disclaimerBypass: {},
    
    // Interaction state
    isNavigating: false,
<<<<<<< HEAD
    hoveredPath: null
=======
    hoveredPath: null,
    expandedPath: null
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  });

  // Destructure state for cleaner access
  const {
    viewMode, activeTab, searchQuery, filterOption, isLoading, isMobile,
    showPathDetails, selectedPath, showDisclaimerModal, selectedTransformationPath,
<<<<<<< HEAD
    pathsProgress, favoritePaths, disclaimerBypass,
    isNavigating, hoveredPath
=======
    activePathSwitch, pathsProgress, favoritePaths, disclaimerBypass,
    isNavigating, hoveredPath, expandedPath
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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

<<<<<<< HEAD
  // ✅ REMOVED: hasActiveJourney function completely - no more journey switching restrictions
=======
  // Check for active journey - FIXED VERSION
  const hasActiveJourney = useCallback((excludePathId = null) => {
    if (!userProfile?.journeyProgress) return false;
    
    // Check ALL paths for active progress, not just currentPath
    const activeJourneys = [];
    
    // Loop through all paths to find any with active progress
    allPaths.forEach(path => {
      if (path.id === excludePathId) return; // Skip the path we're trying to start
      
      const progress = pathsProgress[path.id];
      if (progress && progress.completedDays && progress.completedDays.length > 0) {
        const completedDays = progress.completedDays.length;
        const isCompleted = completedDays >= path.duration;
        
        if (!isCompleted) {
          activeJourneys.push({
            pathId: path.id,
            completedDays,
            totalDays: path.duration
          });
        }
      }
    });
    
    // Only return true if there are genuinely active journeys
    // AND the user has made significant progress (more than 1 day)
    const significantActiveJourneys = activeJourneys.filter(journey => journey.completedDays > 1);
    
    return significantActiveJourneys.length > 0;
  }, [userProfile, allPaths, pathsProgress]);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188

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

<<<<<<< HEAD
=======
  // Get recommended paths
  const recommendedPaths = useMemo(() => {
    if (!allPaths?.length) return [];
    
    const notStarted = allPaths.filter(path => {
      const progress = pathsProgress[path.id];
      return !progress || !progress.completedDays || progress.completedDays.length === 0;
    });
    
    const completedCount = Object.values(pathsProgress).filter(p => 
      p?.completedDays?.length >= getJourneyPath(p.pathId)?.duration
    ).length;
    
    if (completedCount === 0) {
      return notStarted.filter(p => p.difficulty === 'beginner').slice(0, 3);
    }
    
    return notStarted.slice(0, 3);
  }, [allPaths, pathsProgress]);

>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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

<<<<<<< HEAD
  // Handle special path disclaimer (only for transformation-journey)
=======
  // Handle special path disclaimer
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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

<<<<<<< HEAD
  // ✅ SIMPLIFIED: Handle journey continuation - removed all switching logic
  const handleContinueJourney = useCallback(async (pathId) => {
    if (isNavigating) return;
    updateState({ isNavigating: true });
    
    // Handle special disclaimer for transformation journey
=======
  // Handle journey continuation with improved logic
  const handleContinueJourney = useCallback(async (pathId) => {
    if (isNavigating) return;
    
    // Defensive checks
    if (!pathId || !userProfile || !navigateToScreen) {
      return;
    }
    
    updateState({ isNavigating: true });
    
    // Handle special disclaimer paths first
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    if (handleSpecialPathStart(pathId)) {
      updateState({ isNavigating: false });
      return;
    }
    
    const progress = pathsProgress[pathId] || { completedDays: [] };
    const pathData = getJourneyPath(pathId);
<<<<<<< HEAD
    const isCompleted = progress.completedDays?.length >= pathData.duration;
    
    const nextDay = getNextDayForPath(userProfile, pathId);
    
    // Update current path if this isn't the current one or if it hasn't been started
    if (!hasStartedPath(pathId) || currentPath !== pathId) {
      try {
        await updateCurrentPath(userProfile.uid, pathId);
        console.log(`✅ Updated current path to: ${pathId}`);
      } catch (error) {
        console.error('Error updating current path:', error);
      }
    }
    
    // Navigate directly to the journey
    setTimeout(() => {
      navigateToScreen('write', { pathId, day: nextDay });
      updateState({ isNavigating: false });
    }, 100);
  }, [isNavigating, handleSpecialPathStart, pathsProgress, userProfile, currentPath, hasStartedPath, navigateToScreen, updateState]);
=======
    
    if (!pathData) {
      updateState({ isNavigating: false });
      return;
    }
    
    const isCompleted = progress.completedDays?.length >= pathData.duration;
    const hasStarted = hasStartedPath(pathId);
    
    // Only check for active journey conflicts for NEW journeys
    // and only if there are significant active journeys
    if (!isCompleted && !hasStarted) {
      const hasConflictingJourney = hasActiveJourney(pathId);
      
      if (hasConflictingJourney) {
        updateState({
          activePathSwitch: { show: true, newPathId: pathId },
          isNavigating: false
        });
        return;
      }
    }
    
    const nextDay = getNextDayForPath(userProfile, pathId);
    
    // Update current path if starting new or switching
    if (!hasStarted || currentPath !== pathId) {
      try {
        await updateCurrentPath(userProfile.uid, pathId);
      } catch (error) {
        updateState({ isNavigating: false });
        return;
      }
    }
    
    // Navigate to WriteTab
    setTimeout(() => {
      try {
        navigateToScreen('write', { pathId, day: nextDay });
        updateState({ isNavigating: false });
      } catch (error) {
        updateState({ isNavigating: false });
      }
    }, 100);
  }, [isNavigating, handleSpecialPathStart, pathsProgress, hasStartedPath, hasActiveJourney, userProfile, currentPath, navigateToScreen, updateState]);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188

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
<<<<<<< HEAD
  const renderPathCard = useCallback((pathData) => {
=======
  const renderPathCard = useCallback((pathData, isRecommended = false) => {
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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
<<<<<<< HEAD
=======
      isRecommended ? 'recommended' : '',
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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
<<<<<<< HEAD
        {/* Premium indicator */}
=======
        {/* Premium indicator - positioned on left */}
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        {isPremium && !isCompleted && (
          <div className="premium-indicator">
            <Star size={12} />
            <span>Premium</span>
          </div>
        )}

<<<<<<< HEAD
        {/* Status badges */}
=======
        {/* Status badges - positioned on right */}
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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
<<<<<<< HEAD
        </div>

        {/* Favorite button */}
=======
          {isRecommended && (
            <div className="path-recommended-badge">
              <Lightbulb size={14} />
                <span>Recommended</span>
            </div>
          )}
        </div>

        {/* Favorite button - positioned bottom right */}
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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

<<<<<<< HEAD
  // ✅ REMOVED: renderPathSwitchModal function completely - no more switching modal
=======
  // Render path switching confirmation modal with better visibility
  const renderPathSwitchModal = () => {
    if (!activePathSwitch.show) return null;
    
    const newPathData = getJourneyPath(activePathSwitch.newPathId);
    const newPathTitle = newPathData?.title || activePathSwitch.newPathId;
    
    return (
      <div 
        className="modal-overlay active-path-switch-modal" 
        onClick={() => updateState({ activePathSwitch: { show: false, newPathId: null } })}
        style={{ zIndex: 9999 }}
      >
        <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <AlertCircle className="modal-warning-icon" size={20} />
            <h3 className="modal-title">Switch Active Journey?</h3>
          </div>
          
          <div className="modal-content">
            <p className="modal-message">
              You currently have an active journey in progress. Starting "{newPathTitle}" will pause your current journey.
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
                  // Handle error silently
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
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188

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
<<<<<<< HEAD
=======
        {/* Recommendations section */}
        {activeTab === 'all' && recommendedPaths.length > 0 && !searchQuery && (
          <section className="recommendations-section">
            <div className="section-header">
              <h2>
                <Lightbulb size={18} />
                Recommended for You
              </h2>
              <p>Based on your progress and interests</p>
            </div>
            <div className={`paths-${viewMode} recommendations`}>
              {recommendedPaths.map(pathData => renderPathCard(pathData, true))}
            </div>
          </section>
        )}
        
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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
<<<<<<< HEAD
      
      {/* ✅ REMOVED: Path switch modal completely - no more journey switching restrictions */}
      
      {/* Transformation Journey Disclaimer Modal (only for transformation journey) */}
=======
      {renderPathSwitchModal()}
      
      {/* Transformation Journey Disclaimer Modal */}
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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
    </div>
  );
};

export default PathSelection;