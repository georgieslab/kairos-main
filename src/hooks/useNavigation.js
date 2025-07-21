// src/hooks/useNavigation.js

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import useLoader from './useLoader';
import { PATHS, getUserPathProgress, getNextDayForPath } from '../utils/userProgress';

/**
 * Enhanced custom hook for managing navigation state and transitions
 * with persistent path and day context
 */
const useNavigation = (initialScreen = 'loading') => {
  const { currentUser, userProfile } = useAuth();
  const [currentScreen, setCurrentScreen] = useState(initialScreen);
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [screenData, setScreenData] = useState({});
  
  // Path and journey context - these need to persist across tab navigation
  const [currentPath, setCurrentPath] = useState('self-discovery');
  const [currentDay, setCurrentDay] = useState(1);
  const [journalImage, setJournalImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [extractedText, setExtractedText] = useState('');
  
  // Reference to store last active path/day
  const lastActiveContextRef = useRef({
    path: 'self-discovery',
    day: 1
  });
  
  // Flag to prevent multiple update cycles
  const hasInitialized = useRef(false);
  
  // Use the loader hook
  const { isLoading, loaderProps, showLoader, hideLoader } = useLoader({
    initialState: true,
    defaultDuration: 0
  });
  
  // Initialize user's progress from their profile - this is critical for correct navigation
  useEffect(() => {
    if (userProfile?.journeyProgress && !hasInitialized.current) {
      // Determine which path the user is actively working on
      let activePath = PATHS.SELF_DISCOVERY;
      let activeDay = 1;
      
      // For each path, get the next day they should work on
      const paths = [PATHS.SELF_DISCOVERY, PATHS.EMOTIONAL_INTELLIGENCE, PATHS.MINDFULNESS_AWARENESS];
      const pathProgress = {};
      
      // Find the path with most progress (highest day number)
      let maxProgress = -1;
      let maxProgressPathId = null;
      
      paths.forEach(pathId => {
        // Get next day for this path
        const nextDay = getNextDayForPath(userProfile, pathId);
        
        // Store for debugging
        pathProgress[pathId] = {
          nextDay,
          progress: getUserPathProgress(userProfile, pathId)
        };
        
        // Check if this path has more progress
        const completedDays = pathProgress[pathId].progress.completedDays || [];
        if (completedDays.length > maxProgress) {
          maxProgress = completedDays.length;
          maxProgressPathId = pathId;
          activeDay = nextDay;
        }
      });
      
      // Use the path with most progress
      if (maxProgressPathId) {
        activePath = maxProgressPathId;
      }
      
      console.log(`Initializing navigation with path: ${activePath}, day: ${activeDay}`);
      console.log('Path progress data:', pathProgress);
      
      // Update state and ref with user's progress
      setCurrentPath(activePath);
      setCurrentDay(activeDay);
      lastActiveContextRef.current = { path: activePath, day: activeDay };
      
      // Update window.appState for global access
      if (window.appState) {
        window.appState.currentPath = activePath;
        window.appState.currentDay = activeDay;
      }
      
      // Mark as initialized
      hasInitialized.current = true;
    }
  }, [userProfile]);
  
  // Track screen views for potential analytics
  const logScreenView = useCallback((screen, data = {}) => {
    console.log(`Screen transition: ${screen}`, { 
      ...data,
      currentPath: data.pathId || currentPath,
      currentDay: data.day || currentDay
    });
    // Here you could add actual analytics tracking
  }, [currentPath, currentDay]);
  
  // Define root tab screens that shouldn't show back buttons
  const isRootTabScreen = useCallback((screen) => {
    // Complete list of root tab screens that should NEVER show back buttons
    const rootScreens = [
      'home',
      'path-selection',
      'write',
      'analytics-dashboard',
      'journal-analytics',
      'profile'
    ];
    
    return rootScreens.includes(screen);
  }, []);
  
  // Save current context to storage for persistence across sessions
  const persistContext = useCallback(() => {
    try {
      localStorage.setItem('kairosContext', JSON.stringify({
        path: currentPath,
        day: currentDay,
        lastActive: new Date().toISOString()
      }));
      
      // Also update window.appState
      if (window.appState) {
        window.appState.currentPath = currentPath;
        window.appState.currentDay = currentDay;
      }
    } catch (e) {
      console.warn('Could not persist navigation context:', e);
    }
  }, [currentPath, currentDay]);
  
  // Navigate to a screen with transition and history tracking
  const navigateToScreen = useCallback(async (screen, data = {}) => {
    // Avoid duplicate navigation
    if (screen === currentScreen && JSON.stringify(data) === JSON.stringify(screenData)) {
      return;
    }
    
    console.log('Navigating to screen:', screen, 'with data:', data);
    
    // Store last active path and day before navigation
    const prevPath = currentPath;
    const prevDay = currentDay;
    
    // Save current context before navigation
    lastActiveContextRef.current = { path: prevPath, day: prevDay };
    persistContext();
    
    // Update navigation history with full context
    if (currentScreen !== 'loading') {
      setNavigationHistory(prev => [...prev, { 
        screen: currentScreen, 
        data: { 
          ...screenData,
          pathId: prevPath,
          day: prevDay,
          journalImage,
          additionalImages,
          extractedText
        } 
      }]);
    }
    
    // Show loader during navigation
    await showLoader({ 
      size: 'medium', 
      duration: 400
    });
    
    // Log screen view for analytics
    logScreenView(screen, data);
    
    // Update screen and data
    setCurrentScreen(screen);
    setScreenData(data || {});
    
    // Handle path/day context preservation
    
    // If explicit path/day are provided in data, use those
    if (data.pathId !== undefined) {
      console.log('Setting path to:', data.pathId);
      setCurrentPath(data.pathId);
      lastActiveContextRef.current.path = data.pathId;
      
      // Update window.appState
      if (window.appState) {
        window.appState.currentPath = data.pathId;
      }
    }
    
    if (data.day !== undefined) {
      console.log('Setting day to:', data.day);
      setCurrentDay(data.day);
      lastActiveContextRef.current.day = data.day;
      
      // Update window.appState
      if (window.appState) {
        window.appState.currentDay = data.day;
      }
    }
    
    // Special case for tab navigation - restore last active path/day
    // This ensures context is preserved when switching tabs
    if (['home', 'path-selection', 'write', 'analytics-dashboard', 'profile'].includes(screen)) {
      // These are tab screens - preserve path context if not explicitly set
      if (data.pathId === undefined) {
        setCurrentPath(lastActiveContextRef.current.path);
        
        // Update window.appState
        if (window.appState) {
          window.appState.currentPath = lastActiveContextRef.current.path;
        }
      }
      
      if (data.day === undefined) {
        setCurrentDay(lastActiveContextRef.current.day);
        
        // Update window.appState
        if (window.appState) {
          window.appState.currentDay = lastActiveContextRef.current.day;
        }
      }
    }
    
    // Journal entry specific data
    if (data.journalImage !== undefined) setJournalImage(data.journalImage);
    if (data.additionalImages !== undefined) setAdditionalImages(data.additionalImages);
    if (data.extractedText !== undefined) setExtractedText(data.extractedText);
    
    // Reset scroll position to top
    window.scrollTo(0, 0);
  }, [
    currentScreen, 
    screenData, 
    currentPath, 
    currentDay, 
    journalImage,
    additionalImages,
    extractedText,
    showLoader, 
    logScreenView,
    persistContext
  ]);
  
  // Navigate back with history
  const navigateBack = useCallback(async () => {
    // Show loader
    await showLoader({ 
      size: 'small', 
      duration: 400
    });
    
    if (navigationHistory.length > 0) {
      // Get last item from history
      const previousState = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      
      // Apply previous state
      setCurrentScreen(previousState.screen);
      setScreenData(previousState.data || {});
      
      // Restore path/day context if available
      if (previousState.data?.pathId) {
        setCurrentPath(previousState.data.pathId);
        
        // Update window.appState
        if (window.appState) {
          window.appState.currentPath = previousState.data.pathId;
        }
      }
      
      if (previousState.data?.day) {
        setCurrentDay(previousState.data.day);
        
        // Update window.appState
        if (window.appState) {
          window.appState.currentDay = previousState.data.day;
        }
      }
      
      // Update context ref
      lastActiveContextRef.current = { 
        path: previousState.data?.pathId || currentPath,
        day: previousState.data?.day || currentDay
      };
      
      // Restore other data if available
      if (previousState.data?.journalImage !== undefined) setJournalImage(previousState.data.journalImage);
      if (previousState.data?.additionalImages !== undefined) setAdditionalImages(previousState.data.additionalImages);
      if (previousState.data?.extractedText !== undefined) setExtractedText(previousState.data.extractedText);
      
      // Log screen view
      logScreenView(previousState.screen, previousState.data);
      
      // Reset scroll position to top
      window.scrollTo(0, 0);
      
      // Persist context
      persistContext();
      
      return true;
    } else {
      // Default back behavior if no history
      const result = handleDefaultBack();
      return result;
    }
  }, [
    navigationHistory, 
    showLoader, 
    logScreenView,
    currentPath,
    currentDay,
    persistContext
  ]);
  
  // Default back behavior based on current screen
  const handleDefaultBack = useCallback(() => {
    const defaultBackMap = {
      'signup': 'welcome',
      'profile': 'signup',
      'upload': 'daily',
      'analysis': 'upload',
      'journal-archive': 'home',
      'settings': 'profile',
      'daily': 'path-selection',
      'feedback': 'home',
      'bug-report': 'home'
    };
    
    const defaultScreen = defaultBackMap[currentScreen] || 'home';
    setCurrentScreen(defaultScreen);
    return true;
  }, [currentScreen]);
  
  // Helper to get path name
  const getPathName = useCallback(() => {
    switch(currentPath) {
      case PATHS.EMOTIONAL_INTELLIGENCE:
        return 'Emotional Intelligence';
      case PATHS.MINDFULNESS_AWARENESS:
        return 'Mindfulness';
      case PATHS.SELF_DISCOVERY:
      default:
        return 'Self-Discovery';
    }
  }, [currentPath]);
  
  // Get path color class based on current path
  const getPathColorClass = useCallback(() => {
    switch(currentPath) {
      case PATHS.EMOTIONAL_INTELLIGENCE:
        return 'path-ei';
      case PATHS.MINDFULNESS_AWARENESS:
        return 'path-ma';
      case PATHS.SELF_DISCOVERY:
      default:
        return 'path-sd';
    }
  }, [currentPath]);
  
  // Load persisted context on first render
  useEffect(() => {
    if (!hasInitialized.current) {
      try {
        const persistedContext = localStorage.getItem('kairosContext');
        if (persistedContext) {
          const { path, day } = JSON.parse(persistedContext);
          
          // Use persisted context as fallback
          lastActiveContextRef.current = { path, day };
          
          // Only update state if we're on the loading screen to avoid unnecessary renders
          if (currentScreen === 'loading') {
            setCurrentPath(path);
            setCurrentDay(day);
            
            // Update window.appState
            if (window.appState) {
              window.appState.currentPath = path;
              window.appState.currentDay = day;
            }
          }
        }
      } catch (e) {
        console.warn('Could not load persisted navigation context:', e);
      }
    }
  }, [currentScreen]);
  
  return {
    // Screen state
    currentScreen,
    screenData,
    navigationHistory,
    isLoading,
    loaderProps,
    
    // Journey state
    currentPath,
    currentDay,
    
    // Journal state
    journalImage,
    additionalImages,
    extractedText,
    
    // Navigation methods
    navigateToScreen,
    navigateBack,
    showLoader,
    hideLoader,
    
    // Helper methods
    getPathName,
    getPathColorClass,
    isRootTabScreen,
    
    // Context management
    persistContext,
    
    // Refs for debugging
    lastActiveContext: lastActiveContextRef.current
  };
};

export default useNavigation;