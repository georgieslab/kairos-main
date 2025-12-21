// src/components/journey/WriteTab.jsx - Fixed Loading Issues with Voice Support
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, 
  BookOpen, 
  ArrowRight, 
  MessageSquare, 
  Tag, 
  Award, 
  Lightbulb,
  Info,
  CheckCircle,
  AlertCircle,
  Trophy,
  Mic
} from 'lucide-react';
import { getJourneyDay, getAllJourneyPaths, getJourneyPath } from '../../data/JourneyData';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import DynamicIcon from '../common/DynamicIcon';
import TopBar from '../common/TopBar';

// Import path utilities including voice support
import { getNextDayForPath, getProgressFieldForPath, getAllActiveJourneys } from '../../utils/pathUtils';
import { isVoicePath, isVisualPath } from '../../utils/pathTypeUtils';

const WriteTab = ({ navigateToScreen, currentPath, currentDay }) => {
  const { userProfile, currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  
  const [activeDay, setActiveDay] = useState(currentDay || 1);
  const [activePath, setActivePath] = useState(currentPath || 'self-discovery');
  const [journeyData, setJourneyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
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
          dayData = {
            day: finalDay,
            title: `Day ${finalDay}`,
            theme: "Reflection",
            prompt: "What's on your mind today?"
          };
        }
        
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
  
  // Determine the color class for the top bar (write tab)
  // Use the same color as the 'write' tab in BottomNavigation
  const topBarColorClass = 'write-color';

  // Get path details for subtitle
  const pathDetails = getJourneyPath(activePath) || {};
  const subtitle = pathDetails.title ? `${pathDetails.title} • Day ${activeDay} of ${pathDetails.duration || ''}` : undefined;

  // Get path details for display
  const getPathDetails = useCallback(() => {
    const pathData = getJourneyPath(activePath);
    
    if (pathData) {
      return {
        title: pathData.title,
        iconName: pathData.iconName,
        color: pathData.color,
        duration: pathData.duration || 10
      };
    }
    
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
        </div>
      </div>
    );
  }
  
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
          </button>
        </div>
      </div>
    );
  }
  
  // const pathDetails = getPathDetails(); // Removed duplicate declaration
  
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
      {/* Top Bar */}
      <TopBar
        title="Write"
        subtitle={subtitle}
        colorClass={topBarColorClass}
      />
      {/* Header */}
      <div className="write-tab-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <h1 className="write-tab-title" style={{ textAlign: 'center', marginBottom: completionStatus === 'day-completed' ? '0.5rem' : undefined }}>
          {isVoicePath(activePath) ? "Today's Voice Journal" : "Today's Journal Entry"}
        </h1>
        {completionStatus === 'day-completed' && (
          <div className="day-completed-badge" style={{ margin: '0.25rem auto 0 auto' }}>
            <CheckCircle size={16} />
            <span>Day Completed</span>
          </div>
        )}
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
      <div className="prompt-card animate-fade-up">
        <div className="prompt-day-container">
          <h2 className="prompt-day">Day {activeDay}: {journeyData?.title || `Day ${activeDay}`}</h2>
        </div>
        
        <div className="prompt-content">
          <div className="prompt-label-container">
            <h3 className="prompt-label">
              <MessageSquare className="prompt-label-icon" />
              {isVoicePath(activePath) ? "Today's Voice Prompt:" : "Today's Prompt:"}
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
              <p>
                {isVoicePath(activePath) 
                  ? "This prompt is designed to guide your vocal reflection for today. Speak your response naturally and authentically - your voice carries wisdom." 
                  : "This prompt is designed to guide your reflection for today. Write in your physical journal in response to this prompt, then upload it for analysis."
                }
              </p>
            </div>
          )}
          
          <p className="prompt-text">
            {journeyData?.prompt || "What's on your mind today? Take a moment to reflect on your thoughts and feelings."}
          </p>
          <div className="prompt-theme">
            <Tag className="prompt-theme-icon" />
            <span>Theme: {journeyData?.theme || "Reflection"}</span>
          </div>
        </div>
        
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
          
          <div className="prompt-actions">
            <button 
              onClick={handleStartWriting}
              className={`action-button ${completionStatus === 'day-completed' ? 'secondary' : 'primary'}`}
            >
              {isVoicePath(activePath) ? <Mic className="action-icon" /> : <Camera className="action-icon" />}
              {isVoicePath(activePath) 
                ? (completionStatus === 'day-completed' ? 'Record New Entry' : 'Record Voice Entry')
                : (completionStatus === 'day-completed' ? 'Upload New Entry' : 'Upload Journal Pages')
              }
            </button>
            
            <button 
              onClick={handleViewDetails}
              className={`action-button ${completionStatus === 'day-completed' ? 'primary' : 'secondary'}`}
            >
              <BookOpen className="action-icon" />
              {completionStatus === 'day-completed' ? 'View Previous Entry' : 'View Details'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Simple progress display */}
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
                width: `${(activeDay / pathDetails.duration) * 100}%`,
                backgroundColor: `rgb(${pathDetails.color})`
              }}
            ></div>
          </div>
          <div className="progress-text">
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
        </h3>
        
        <ul className="tips-list">
          <li className="tip-item">
            <div className="tip-icon">✓</div>
            <div className="tip-content">
              {isVoicePath(activePath) 
                ? "Find a quiet space for recording your voice" 
                : "Find a quiet space with your physical Καιρός journal"
              }
            </div>
          </li>
          <li className="tip-item">
            <div className="tip-icon">✓</div>
            <div className="tip-content">
              {isVoicePath(activePath) 
                ? "Speak naturally and let emotions come through your voice" 
                : "Write by hand to activate deeper reflection and memory"
              }
            </div>
          </li>
          <li className="tip-item">
            <div className="tip-icon">✓</div>
            <div className="tip-content">
              {isVoicePath(activePath) 
                ? "Take pauses when you need time to think - silence is okay" 
                : "Take your time - aim for at least 10 minutes of writing"
              }
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WriteTab;