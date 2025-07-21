<<<<<<< HEAD
// src/components/journey/WriteTab.jsx - Fixed Loading Issues with Voice Support
import React, { useState, useEffect, useRef, useCallback } from 'react';
=======
// src/components/journey/WriteTab.jsx
import React, { useState, useEffect, useRef } from 'react';
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
import { 
  Camera, 
  BookOpen, 
  ArrowRight, 
  MessageSquare, 
  Tag, 
  Award, 
  Lightbulb,
  Info,
<<<<<<< HEAD
  CheckCircle,
  AlertCircle,
  Trophy,
  Mic
} from 'lucide-react';
import { getJourneyDay, getAllJourneyPaths, getJourneyPath } from '../../data/JourneyData';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import DynamicIcon from '../common/DynamicIcon';

// Import path utilities including voice support
import { getNextDayForPath, getProgressFieldForPath, getAllActiveJourneys } from '../../utils/pathUtils';
import { isVoicePath, isVisualPath } from '../../utils/pathTypeUtils';

const WriteTab = ({ navigateToScreen, currentPath, currentDay }) => {
  const { userProfile, currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  
  const [activeDay, setActiveDay] = useState(currentDay || 1);
  const [activePath, setActivePath] = useState(currentPath || 'self-discovery');
=======
  CheckCircle
} from 'lucide-react';
import { getJourneyDay, getAllJourneyPaths } from '../../data/JourneyData';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getProgressFieldForPath, getNextDayForPath } from '../../utils/pathUtils';
import DynamicIcon from '../common/DynamicIcon';

const WriteTab = ({ navigateToScreen, currentPath = 'self-discovery', currentDay = 1 }) => {
  const { userProfile } = useAuth();
  const { isDarkMode } = useTheme(); // Use the centralized theme context
  
  const [activeDay, setActiveDay] = useState(currentDay);
  const [activePath, setActivePath] = useState(currentPath);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  const [journeyData, setJourneyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
<<<<<<< HEAD
  const [completionStatus, setCompletionStatus] = useState('active');
  const [debugInfo, setDebugInfo] = useState({});
  
  // Flag to prevent navigation loops
  const isNavigating = useRef(false);
  const isMounted = useRef(true);
  const initializationRef = useRef(false);
  
  // ✅ FIXED: Stable completion check function
  const checkJourneyCompletion = useCallback((pathId, userProfileData) => {
    if (!pathId || !userProfileData?.journeyProgress) {
      return false;
    }
    
    try {
      const pathData = getJourneyPath(pathId);
      if (!pathData) return false;
      
      const progressField = getProgressFieldForPath(pathId);
      const progress = userProfileData.journeyProgress[progressField];
      const completedDays = progress?.completedDays || [];
      
      return completedDays.length >= pathData.duration;
    } catch (error) {
      console.error('Error checking journey completion:', error);
      return false;
    }
  }, []);
  
  // ✅ FIXED: Stable day completion check
  const checkDayCompletion = useCallback((pathId, dayNum, userProfileData) => {
    if (!pathId || !dayNum || !userProfileData?.journeyProgress) {
      return false;
    }
    
    try {
      const progressField = getProgressFieldForPath(pathId);
      const progress = userProfileData.journeyProgress[progressField];
      const completedDays = progress?.completedDays || [];
      
      return completedDays.includes(dayNum);
    } catch (error) {
      console.error('Error checking day completion:', error);
      return false;
    }
  }, []);
  
  // ✅ FIXED: Simple initialization with better error handling
  useEffect(() => {
    let mounted = true;
    
    const initialize = async () => {
      // Prevent multiple initializations
      if (initializationRef.current) {
        console.log('🔄 WriteTab already initializing, skipping...');
        return;
      }
      initializationRef.current = true;
      
      try {
        console.log('🚀 WriteTab initializing...');
        console.log('Props:', { currentPath, currentDay });
        console.log('UserProfile exists:', !!userProfile);
        
        // Set debug info
        const debug = {
          propsPath: currentPath,
          propsDay: currentDay,
          hasUserProfile: !!userProfile,
          hasJourneyProgress: !!userProfile?.journeyProgress,
          timestamp: new Date().toISOString()
        };
        
        if (mounted) setDebugInfo(debug);
        
        let finalPath = currentPath || 'self-discovery';
        let finalDay = currentDay || 1;
        
        // Only try to get user's path if we have userProfile and no props were provided
        if (!currentPath && userProfile?.journeyProgress) {
          console.log('🔍 No path provided, finding user\'s active path...');
          
          // Check for stored current path
          const storedPath = userProfile.journeyProgress.currentPath;
          if (storedPath) {
            console.log('📍 Found stored current path:', storedPath);
            finalPath = storedPath;
          } else {
            console.log('🔍 No stored path, checking for active journeys...');
            try {
              const activeJourneys = getAllActiveJourneys(userProfile);
              if (activeJourneys && activeJourneys.length > 0) {
                finalPath = activeJourneys[0].pathId;
                console.log('📌 Using most active journey:', finalPath);
              }
            } catch (error) {
              console.error('Error finding active journeys:', error);
            }
          }
        }
        
        // Get the correct day if not provided
        if (!currentDay && userProfile) {
          console.log('📅 No day provided, calculating next day...');
          try {
            finalDay = getNextDayForPath(userProfile, finalPath);
            console.log('📅 Calculated next day:', finalDay);
          } catch (error) {
            console.error('Error calculating next day:', error);
            finalDay = 1;
          }
        }
        
        console.log('🎯 Final values:', { finalPath, finalDay });
        
        // Check completion status
        const isJourneyComplete = checkJourneyCompletion(finalPath, userProfile);
        const isDayComplete = checkDayCompletion(finalPath, finalDay, userProfile);
        
        console.log('✅ Completion status:', { isJourneyComplete, isDayComplete });
        
        // Set completion status
        let status = 'active';
        if (isJourneyComplete) {
          status = 'completed';
        } else if (isDayComplete) {
          status = 'day-completed';
        }
        
        // Get journey data
        let dayData;
        try {
          dayData = getJourneyDay(finalDay, finalPath);
          console.log('📝 Journey data loaded:', dayData?.title);
        } catch (error) {
          console.error('Error getting journey data:', error);
=======
  
  // Flag to prevent navigation loops
  const isNavigating = useRef(false);
  
  // Track if component is mounted
  const isMounted = useRef(true);
  
  // Debug counter to track effect runs
  const effectRuns = useRef(0);
  
  // Single consolidated effect to handle initialization and data loading
  useEffect(() => {
    // Set up initialization
    const initializeTab = async () => {
      if (!isMounted.current) return;
      
      effectRuns.current += 1;
      console.log(`WriteTab useEffect run #${effectRuns.current}`);
      
      setIsLoading(true);
      setLoadError(null);
      
      try {
        // Log the initial context for debugging
        console.log(`WriteTab initializing with props - path: ${currentPath}, day: ${currentDay}`);
        
        // SAFETY CHECK: Make sure we have valid inputs
        const safePath = currentPath || 'self-discovery';
        const safeDay = currentDay || 1;
        
        let finalDay = safeDay;
        let finalPath = safePath;
        
        // Calculate correct day from user profile if available
        if (userProfile && userProfile.journeyProgress) {
          try {
            // Get the correct day using our utility function
            const correctDay = getNextDayForPath(userProfile, safePath);
            console.log(`WriteTab - Calculated day ${correctDay} for path ${safePath} from user progress`);
            
            finalDay = correctDay || safeDay;
            finalPath = safePath;
          } catch (progressError) {
            console.error('Error calculating day from progress:', progressError);
            finalDay = safeDay;
            finalPath = safePath;
          }
        }
        
        // Only update state if different to avoid unnecessary rerenders
        if (finalDay !== activeDay) {
          setActiveDay(finalDay);
        }
                
        if (finalPath !== activePath) {
          setActivePath(finalPath);
        }
        
        // Get journey data for this path/day with error handling
        let dayData;
        try {
          dayData = getJourneyDay(finalDay, finalPath);
          
          if (!dayData) {
            console.warn(`No journey data found for day ${finalDay}, path ${finalPath}. Using default data.`);
            // Provide default journey data
            dayData = {
              day: finalDay,
              title: `Day ${finalDay}`,
              theme: "Reflection",
              prompt: "What's on your mind today?"
            };
          }
        } catch (journeyError) {
          console.error('Error getting journey data:', journeyError);
          // Provide default journey data
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
          dayData = {
            day: finalDay,
            title: `Day ${finalDay}`,
            theme: "Reflection",
            prompt: "What's on your mind today?"
          };
        }
        
<<<<<<< HEAD
        // Update state if component is still mounted
        if (mounted) {
          setActivePath(finalPath);
          setActiveDay(finalDay);
          setJourneyData(dayData);
          setCompletionStatus(status);
          setIsLoading(false);
          
          console.log('✅ WriteTab initialization complete');
          
          // Handle journey completion redirect
          if (status === 'completed') {
            console.log('🏆 Journey completed, redirecting...');
            setTimeout(() => {
              if (mounted && !isNavigating.current) {
                isNavigating.current = true;
                navigateToScreen('journey-complete', { pathId: finalPath, day: finalDay });
              }
            }, 500);
          }
        }
        
      } catch (error) {
        console.error('❌ WriteTab initialization error:', error);
        if (mounted) {
          setLoadError(`Initialization failed: ${error.message}`);
          setIsLoading(false);
        }
      } finally {
        initializationRef.current = false;
      }
    };
    
    // Add a small delay and initialize
    const timer = setTimeout(() => {
      if (mounted) {
        initialize();
      }
    }, 200);
    
    return () => {
      mounted = false;
      clearTimeout(timer);
      isMounted.current = false;
      initializationRef.current = false;
    };
  }, []); // ✅ FIXED: Empty dependency array to prevent re-runs
  
  // ✅ ADDED: Separate effect to handle prop changes
  useEffect(() => {
    // Only update if props actually changed and we're not loading
    if (!isLoading && (
      (currentPath && currentPath !== activePath) || 
      (currentDay && currentDay !== activeDay)
    )) {
      console.log('🔄 Props changed, updating WriteTab...');
      setActivePath(currentPath || activePath);
      setActiveDay(currentDay || activeDay);
      
      // Get new journey data
      try {
        const newDayData = getJourneyDay(currentDay || activeDay, currentPath || activePath);
        setJourneyData(newDayData);
      } catch (error) {
        console.error('Error updating journey data:', error);
      }
    }
  }, [currentPath, currentDay, activePath, activeDay, isLoading]);
  
  // Get path details for display
  const getPathDetails = useCallback(() => {
    const pathData = getJourneyPath(activePath);
=======
        if (isMounted.current) {
          setJourneyData(dayData);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing WriteTab:', error);
        
        if (isMounted.current) {
          setLoadError('Failed to load journal data. Please try again.');
          
          // Emergency fallback - try to get some basic data
          try {
            const fallbackData = {
              day: currentDay || 1,
              title: `Day ${currentDay || 1}`,
              theme: "Reflection",
              prompt: "What's on your mind today?"
            };
            setJourneyData(fallbackData);
          } catch (fallbackError) {
            console.error('Even fallback failed:', fallbackError);
          }
          
          setIsLoading(false);
        }
      }
    };
    
    // Start initialization
    initializeTab();
    
    // Cleanup function to prevent updates on unmounted component
    return () => {
      console.log('WriteTab unmounting, cleaning up');
      isMounted.current = false;
      isNavigating.current = false;
    };
  }, [userProfile, currentPath, currentDay]);
  
  // Handle navigation to journal upload screen
  const handleStartWriting = () => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    
    console.log(`Navigating to journal upload with day: ${activeDay}, path: ${activePath}`);
    navigateToScreen('upload', { 
      pathId: activePath, 
      day: activeDay,
      prompt: journeyData?.prompt,
      theme: journeyData?.theme
    });
  };
  
  // Handle navigation to daily view for more info
  const handleViewDetails = () => {
    // Prevent navigation if already navigating
    if (isNavigating.current) return;
    isNavigating.current = true;
    
    console.log(`Navigating to daily with day: ${activeDay}, path: ${activePath}`);
    navigateToScreen('daily', { 
      pathId: activePath, 
      day: activeDay 
    });
  };
  
  // Get path details for display
  const getPathDetails = () => {
    // Use all paths data to get comprehensive path details
    const allPaths = getAllJourneyPaths();
    const pathData = allPaths.find(path => path.id === activePath);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    
    if (pathData) {
      return {
        title: pathData.title,
        iconName: pathData.iconName,
        color: pathData.color,
        duration: pathData.duration || 10
      };
    }
    
<<<<<<< HEAD
    return {
      title: 'Self-Discovery',
      iconName: 'Compass',
      color: '85, 139, 110',
      duration: 10
    };
  }, [activePath]);
  
  // Handle navigation with voice path support
  const handleStartWriting = useCallback(() => {
    if (isNavigating.current) return;
    
    // Simple completion check
    if (completionStatus === 'completed') {
      console.log('🏆 Journey completed, redirecting to completion');
      isNavigating.current = true;
      navigateToScreen('journey-complete', { pathId: activePath, day: activeDay });
      return;
    }
    
    if (completionStatus === 'day-completed') {
      const confirmed = window.confirm('This day has already been completed. Would you like to view your previous entry instead?');
      if (confirmed) {
        handleViewDetails();
        return;
      }
    }
    
    isNavigating.current = true;
    
    // Check if this is a voice journey
    if (isVoicePath(activePath)) {
      console.log(`🎤 Navigating to voice upload: day ${activeDay}, path ${activePath}`);
      navigateToScreen('voice-upload', { 
        pathId: activePath, 
        day: activeDay,
        prompt: journeyData?.prompt,
        theme: journeyData?.theme
      });
    } else {
      console.log(`📤 Navigating to upload: day ${activeDay}, path ${activePath}`);
      navigateToScreen('upload', { 
        pathId: activePath, 
        day: activeDay,
        prompt: journeyData?.prompt,
        theme: journeyData?.theme
      });
    }
  }, [completionStatus, activePath, activeDay, journeyData, navigateToScreen]);
  
  const handleViewDetails = useCallback(() => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    
    console.log(`📖 Navigating to daily: day ${activeDay}, path ${activePath}`);
    navigateToScreen('daily', { 
      pathId: activePath, 
      day: activeDay 
    });
  }, [activePath, activeDay, navigateToScreen]);
  
  const handleViewCompletion = useCallback(() => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    
    console.log('🏆 Navigating to completion screen');
    navigateToScreen('journey-complete', { pathId: activePath, day: activeDay });
  }, [activePath, activeDay, navigateToScreen]);
  
  // ✅ ADDED: Debug logging
  console.log('WriteTab render:', { 
    isLoading, 
    loadError, 
    activePath, 
    activeDay, 
    completionStatus,
    hasJourneyData: !!journeyData,
    isVoicePath: isVoicePath(activePath),
    debugInfo
  });
  
  // Show loading indicator with debug info
  if (isLoading) {
    return (
      <div className={`write-tab-container ${isDarkMode ? 'dark-theme' : 'light-theme'} loading`}>
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Loading your journal...</p>
          
          {/* Debug information */}
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            background: 'rgba(59, 130, 246, 0.1)', 
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontFamily: 'monospace'
          }}>
            <strong>Debug Info:</strong><br/>
            Current Path: {currentPath || 'null'}<br/>
            Current Day: {currentDay || 'null'}<br/>
            Active Path: {activePath}<br/>
            Active Day: {activeDay}<br/>
            Has User Profile: {userProfile ? 'Yes' : 'No'}<br/>
            Has Journey Progress: {userProfile?.journeyProgress ? 'Yes' : 'No'}<br/>
            Completion Status: {completionStatus}<br/>
            Is Voice Path: {isVoicePath(activePath) ? 'Yes' : 'No'}<br/>
            Initialization Ref: {initializationRef.current ? 'Running' : 'Idle'}<br/>
            Timestamp: {debugInfo.timestamp}
          </div>
          
          {/* Force load button for testing */}
          <button 
            onClick={() => {
              console.log('🔧 Force loading completion');
              setIsLoading(false);
            }}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Force Load (Debug)
          </button>
=======
    // Fallback for legacy paths
    let title, iconName, color, duration;
    
    switch(activePath) {
      case 'emotional-intelligence':
        title = 'Emotional Intelligence';
        iconName = 'Heart';
        color = '216, 76, 147'; // Pink
        duration = 10;
        break;
      case 'mindfulness-awareness':
        title = 'Mindfulness';
        iconName = 'Brain';
        color = '142, 68, 173'; // Purple
        duration = 10;
        break;
      case 'transformation-journey':
        title = 'Transformation Journey';
        iconName = 'RotateCcw';
        color = '26, 155, 155'; // Teal
        duration = 21;
        break;
      case 'self-discovery':
      default:
        title = 'Self-Discovery';
        iconName = 'Compass';
        color = '85, 139, 110'; // Green
        duration = 10;
        break;
    }
    
    return { title, iconName, color, duration };
  };
  
  // Show loading indicator while calculating correct day
  if (isLoading) {
    return (
      <div className={`write-tab-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Loading your journal...</p>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        </div>
      </div>
    );
  }
  
<<<<<<< HEAD
  // Show error with debug info
  if (loadError) {
    return (
      <div className={`write-tab-container ${isDarkMode ? 'dark-theme' : 'light-theme'} error`}>
        <div className="error-indicator">
          <AlertCircle className="error-icon" />
          <p className="error-message">{loadError}</p>
          
          {/* Debug info */}
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            background: 'rgba(239, 68, 68, 0.1)', 
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            textAlign: 'left'
          }}>
            <strong>Debug Info:</strong><br/>
            Props: currentPath={currentPath}, currentDay={currentDay}<br/>
            State: activePath={activePath}, activeDay={activeDay}<br/>
            User Profile: {userProfile ? 'Loaded' : 'Missing'}<br/>
            Journey Progress: {userProfile?.journeyProgress ? 'Exists' : 'Missing'}
          </div>
          
          <button 
            className="retry-button"
            onClick={() => {
              setIsLoading(true);
              setLoadError(null);
              initializationRef.current = false;
              // Trigger re-initialization
              setTimeout(() => {
                window.location.reload();
              }, 100);
            }}
          >
            Reload Page
=======
  // Show error message if loading failed
  if (loadError) {
    return (
      <div className={`write-tab-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
        <div className="error-indicator">
          <p className="error-message">{loadError}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
          </button>
        </div>
      </div>
    );
  }
  
<<<<<<< HEAD
  const pathDetails = getPathDetails();
  
  // Show completion message if journey is completed
  if (completionStatus === 'completed') {
    return (
      <div className={`write-tab-container ${isDarkMode ? 'dark-theme' : 'light-theme'} ${activePath} completed`}>
        <div className="completion-message">
          <div className="completion-icon">
            <Trophy className="trophy-icon" />
          </div>
          <h2 className="completion-title">Journey Completed! 🎉</h2>
          <p className="completion-text">
            You've successfully completed your <strong>{pathDetails.title}</strong> journey!
          </p>
          <div className="completion-actions">
            <button 
              onClick={handleViewCompletion}
              className="completion-button primary"
            >
              <Award className="action-icon" />
              View Completion
            </button>
            <button 
              onClick={() => navigateToScreen('path-selection')}
              className="completion-button secondary"
            >
              <BookOpen className="action-icon" />
              Start New Journey
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`write-tab-container ${isDarkMode ? 'dark-theme' : 'light-theme'} ${activePath} loaded`}>
      {/* Header */}
      <div className="write-tab-header">
        <h1 className="write-tab-title">
          {isVoicePath(activePath) ? "Today's Voice Journal" : "Today's Journal Entry"}
        </h1>
        {completionStatus === 'day-completed' && (
          <div className="day-completed-badge">
            <CheckCircle size={16} />
            <span>Day Completed</span>
          </div>
        )}
=======
  // Safety check - if we somehow don't have journey data, show a fallback
  if (!journeyData) {
    const fallbackData = {
      day: activeDay,
      title: `Day ${activeDay}`,
      theme: "Reflection",
      prompt: "What's on your mind today?"
    };
    
    console.warn("Using fallback journey data - no data available");
    
    // Update state for future renders
    setJourneyData(fallbackData);
  }
  
  // Get path details for consistent styling
  const pathDetails = getPathDetails();
  const progressPercentage = Math.round((activeDay / pathDetails.duration) * 100);
  
  return (
    <div className={`write-tab-container ${isDarkMode ? 'dark-theme' : 'light-theme'} ${activePath}`}>
      {/* Header with path context */}
      <div className="write-tab-header">
        <h1 className="write-tab-title">Today's Journal Entry</h1>
        <div className="header-right">
          {/* Theme toggle button removed */}
        </div>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      </div>
      
      {/* Path context indicator */}
      <div className="write-tab-path-context">
        <div className="path-indicator" style={{ backgroundColor: `rgba(${pathDetails.color}, 0.9)` }}>
          <DynamicIcon name={pathDetails.iconName} className="path-indicator-icon" />
          <span className="path-indicator-text">
            {pathDetails.title} • Day {activeDay} of {pathDetails.duration}
          </span>
        </div>
      </div>
      
<<<<<<< HEAD
      {/* Day completed notification */}
      {completionStatus === 'day-completed' && (
        <div className="day-completed-notification animate-fade-up">
          <div className="notification-content">
            <CheckCircle className="notification-icon" />
            <div className="notification-text">
              <h3>You've already completed this day!</h3>
              <p>You can view your previous entry or {isVoicePath(activePath) ? 'record' : 'upload'} a new one to overwrite it.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Prompt card */}
=======
      {/* Prompt card with enhanced visuals */}
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      <div className="prompt-card animate-fade-up">
        <div className="prompt-day-container">
          <h2 className="prompt-day">Day {activeDay}: {journeyData?.title || `Day ${activeDay}`}</h2>
        </div>
        
        <div className="prompt-content">
          <div className="prompt-label-container">
            <h3 className="prompt-label">
              <MessageSquare className="prompt-label-icon" />
<<<<<<< HEAD
              {isVoicePath(activePath) ? "Today's Voice Prompt:" : "Today's Prompt:"}
=======
              Today's Prompt:
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
            </h3>
            <button
              className="info-button"
              onClick={() => setIsInfoVisible(!isInfoVisible)}
              aria-label="Prompt information"
            >
              <Info size={16} />
            </button>
          </div>
          
          {isInfoVisible && (
            <div className="prompt-info">
<<<<<<< HEAD
              <p>
                {isVoicePath(activePath) 
                  ? "This prompt is designed to guide your vocal reflection for today. Speak your response naturally and authentically - your voice carries wisdom." 
                  : "This prompt is designed to guide your reflection for today. Write in your physical journal in response to this prompt, then upload it for analysis."
                }
              </p>
=======
              <p>This prompt is designed to guide your reflection for today. Write in your physical journal in response to this prompt, then upload it for analysis.</p>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
            </div>
          )}
          
          <p className="prompt-text">
<<<<<<< HEAD
            {journeyData?.prompt || "What's on your mind today? Take a moment to reflect on your thoughts and feelings."}
=======
            {journeyData?.prompt || "What's on your mind today?"}
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
          </p>
          <div className="prompt-theme">
            <Tag className="prompt-theme-icon" />
            <span>Theme: {journeyData?.theme || "Reflection"}</span>
          </div>
        </div>
        
<<<<<<< HEAD
        {/* Action buttons */}
        <div className="prompt-actions-container">
          <h3 className="actions-title">
            {completionStatus === 'day-completed' 
              ? "Day completed - Review or update your entry"
              : isVoicePath(activePath) 
                ? "Ready to record your voice journal?" 
                : "Ready to upload your journal entry?"
            }
          </h3>
=======
        {/* Simplified action - only journal upload */}
        <div className="prompt-actions-container">
          <h3 className="actions-title">Ready to upload your journal entry?</h3>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
          
          <div className="prompt-actions">
            <button 
              onClick={handleStartWriting}
<<<<<<< HEAD
              className={`action-button ${completionStatus === 'day-completed' ? 'secondary' : 'primary'}`}
            >
              {isVoicePath(activePath) ? <Mic className="action-icon" /> : <Camera className="action-icon" />}
              {isVoicePath(activePath) 
                ? (completionStatus === 'day-completed' ? 'Record New Entry' : 'Record Voice Entry')
                : (completionStatus === 'day-completed' ? 'Upload New Entry' : 'Upload Journal Pages')
              }
=======
              className="action-button primary"
            >
              <Camera className="action-icon" />
              Upload Journal Pages
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
            </button>
            
            <button 
              onClick={handleViewDetails}
<<<<<<< HEAD
              className={`action-button ${completionStatus === 'day-completed' ? 'primary' : 'secondary'}`}
            >
              <BookOpen className="action-icon" />
              {completionStatus === 'day-completed' ? 'View Previous Entry' : 'View Details'}
=======
              className="action-button secondary"
            >
              <BookOpen className="action-icon" />
              View Details
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
            </button>
          </div>
        </div>
      </div>
      
<<<<<<< HEAD
      {/* Simple progress display */}
=======
      {/* Journey progress with enhanced visuals */}
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      <div className="journey-progress animate-fade-up" style={{ animationDelay: "0.1s" }}>
        <h3 className="progress-title">
          <Award className="progress-title-icon" />
          Your Journey Progress
        </h3>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
<<<<<<< HEAD
                width: `${(activeDay / pathDetails.duration) * 100}%`,
=======
                width: `${progressPercentage}%`,
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
                backgroundColor: `rgb(${pathDetails.color})`
              }}
            ></div>
          </div>
          <div className="progress-text">
<<<<<<< HEAD
            <span className="progress-percentage">{Math.round((activeDay / pathDetails.duration) * 100)}%</span>
            <span className="progress-days">Day {activeDay} of {pathDetails.duration}</span>
          </div>
        </div>
      </div>
      
      {/* Tips - Updated for voice paths */}
      <div className="journaling-tips animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <h3 className="tips-title">
          <Lightbulb className="tips-title-icon" />
          {isVoicePath(activePath) ? "Voice Journaling Tips" : "Physical Journal Tips"}
=======
            <span className="progress-percentage">{progressPercentage}%</span>
            <span className="progress-days">Day {activeDay} of {pathDetails.duration}</span>
          </div>
        </div>
        
        <div className="days-grid">
          {Array.from({ length: Math.min(pathDetails.duration, 10) }, (_, i) => i + 1).map(day => {
            const completed = day < activeDay;
            const isCurrent = day === activeDay;
            
            return (
              <div 
                key={day}
                className={`day-pill ${completed ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`Day ${day}, ${completed ? 'completed' : isCurrent ? 'current day' : 'upcoming'}`}
              >
                {completed ? <CheckCircle size={12} /> : day}
              </div>
            );
          })}
          {pathDetails.duration > 10 && (
            <div className="day-pill more">
              +{pathDetails.duration - 10}
            </div>
          )}
        </div>
        
        <div className="progress-prompt">
          {activeDay < pathDetails.duration ? (
            <p>Continue your physical journaling journey to gain deeper insights.</p>
          ) : (
            <p>You're on the final day of your journey!</p>
          )}
        </div>
      </div>
      
      {/* Tips for better journaling focused on physical writing */}
      <div className="journaling-tips animate-fade-up" style={{ animationDelay: "0.2s" }}>
        <h3 className="tips-title">
          <Lightbulb className="tips-title-icon" />
          Physical Journal Tips
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        </h3>
        
        <ul className="tips-list">
          <li className="tip-item">
            <div className="tip-icon">✓</div>
            <div className="tip-content">
<<<<<<< HEAD
              {isVoicePath(activePath) 
                ? "Find a quiet space for recording your voice" 
                : "Find a quiet space with your physical Καιρός journal"
              }
=======
              Find a quiet space with your physical Καιρός journal
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
            </div>
          </li>
          <li className="tip-item">
            <div className="tip-icon">✓</div>
            <div className="tip-content">
<<<<<<< HEAD
              {isVoicePath(activePath) 
                ? "Speak naturally and let emotions come through your voice" 
                : "Write by hand to activate deeper reflection and memory"
              }
=======
              Write by hand to activate deeper reflection and memory
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
            </div>
          </li>
          <li className="tip-item">
            <div className="tip-icon">✓</div>
            <div className="tip-content">
<<<<<<< HEAD
              {isVoicePath(activePath) 
                ? "Take pauses when you need time to think - silence is okay" 
                : "Take your time - aim for at least 10 minutes of writing"
              }
=======
              Take your time - aim for at least 10 minutes of writing
            </div>
          </li>
          <li className="tip-item">
            <div className="tip-icon">✓</div>
            <div className="tip-content">
              Scan multiple pages if your response spans several pages
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
            </div>
          </li>
        </ul>
      </div>
      
      {/* Continue button for mobile */}
      <div className="mobile-continue animate-fade-up" style={{ animationDelay: "0.3s" }}>
        <button 
          onClick={handleStartWriting}
          className="continue-button"
          style={{ 
            backgroundColor: `rgb(${pathDetails.color})`,
            boxShadow: `0 4px 12px rgba(${pathDetails.color}, 0.3)`
          }}
        >
<<<<<<< HEAD
          {isVoicePath(activePath) ? 'Record Voice Entry' : 'Upload Journal'}
          {isVoicePath(activePath) ? <Mic className="continue-icon" /> : <ArrowRight className="continue-icon" />}
=======
          Upload Journal
          <ArrowRight className="continue-icon" />
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        </button>
      </div>
    </div>
  );
};

export default WriteTab;