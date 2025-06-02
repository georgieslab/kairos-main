// src/components/journey/WriteTab.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  BookOpen, 
  ArrowRight, 
  MessageSquare, 
  Tag, 
  Award, 
  Lightbulb,
  Info,
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
  const [journeyData, setJourneyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  
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
          dayData = {
            day: finalDay,
            title: `Day ${finalDay}`,
            theme: "Reflection",
            prompt: "What's on your mind today?"
          };
        }
        
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
    
    if (pathData) {
      return {
        title: pathData.title,
        iconName: pathData.iconName,
        color: pathData.color,
        duration: pathData.duration || 10
      };
    }
    
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
        </div>
      </div>
    );
  }
  
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
          </button>
        </div>
      </div>
    );
  }
  
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
      
      {/* Prompt card with enhanced visuals */}
      <div className="prompt-card animate-fade-up">
        <div className="prompt-day-container">
          <h2 className="prompt-day">Day {activeDay}: {journeyData?.title || `Day ${activeDay}`}</h2>
        </div>
        
        <div className="prompt-content">
          <div className="prompt-label-container">
            <h3 className="prompt-label">
              <MessageSquare className="prompt-label-icon" />
              Today's Prompt:
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
              <p>This prompt is designed to guide your reflection for today. Write in your physical journal in response to this prompt, then upload it for analysis.</p>
            </div>
          )}
          
          <p className="prompt-text">
            {journeyData?.prompt || "What's on your mind today?"}
          </p>
          <div className="prompt-theme">
            <Tag className="prompt-theme-icon" />
            <span>Theme: {journeyData?.theme || "Reflection"}</span>
          </div>
        </div>
        
        {/* Simplified action - only journal upload */}
        <div className="prompt-actions-container">
          <h3 className="actions-title">Ready to upload your journal entry?</h3>
          
          <div className="prompt-actions">
            <button 
              onClick={handleStartWriting}
              className="action-button primary"
            >
              <Camera className="action-icon" />
              Upload Journal Pages
            </button>
            
            <button 
              onClick={handleViewDetails}
              className="action-button secondary"
            >
              <BookOpen className="action-icon" />
              View Details
            </button>
          </div>
        </div>
      </div>
      
      {/* Journey progress with enhanced visuals */}
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
                width: `${progressPercentage}%`,
                backgroundColor: `rgb(${pathDetails.color})`
              }}
            ></div>
          </div>
          <div className="progress-text">
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
        </h3>
        
        <ul className="tips-list">
          <li className="tip-item">
            <div className="tip-icon">✓</div>
            <div className="tip-content">
              Find a quiet space with your physical Καιρός journal
            </div>
          </li>
          <li className="tip-item">
            <div className="tip-icon">✓</div>
            <div className="tip-content">
              Write by hand to activate deeper reflection and memory
            </div>
          </li>
          <li className="tip-item">
            <div className="tip-icon">✓</div>
            <div className="tip-content">
              Take your time - aim for at least 10 minutes of writing
            </div>
          </li>
          <li className="tip-item">
            <div className="tip-icon">✓</div>
            <div className="tip-content">
              Scan multiple pages if your response spans several pages
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
          Upload Journal
          <ArrowRight className="continue-icon" />
        </button>
      </div>
    </div>
  );
};

export default WriteTab;