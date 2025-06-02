// src/hooks/useNavigationState.js

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import useLoader from './useLoader';
import { PATHS, getUserPathProgress, getNextDayForPath } from '../utils/userProgress';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Enhanced hook for managing navigation state with improved context persistence
 * and journey completion tracking
 */
const useNavigationState = (initialScreen = 'loading') => {
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
  
  // Completion tracking state - NEW
  const [completedJourneys, setCompletedJourneys] = useState({});
  
  // Generate a session ID for this instance
  const sessionId = useRef(Date.now().toString(36) + Math.random().toString(36).substring(2));
  
  // Reference to store last active path/day - this persists across renders
  const lastActiveContextRef = useRef({
    path: 'self-discovery',
    day: 1,
    sessionId: sessionId.current
  });
  
  // Flag to prevent multiple update cycles and navigation loops
  const isNavigating = useRef(false);
  const hasInitialized = useRef(false);
  const hasLoadedCompletionStatus = useRef(false);
  
  // Use the loader hook
  const { isLoading, loaderProps, showLoader, hideLoader } = useLoader({
    initialState: true,
    defaultDuration: 0
  });
  
  // NEW: Load completed journeys status
  useEffect(() => {
    const loadCompletedJourneys = async () => {
      if (!currentUser || !userProfile || hasLoadedCompletionStatus.current) return;
      
      try {
        console.log('Loading journey completion status...');
        const completedJourneysObj = {};
        
        // Check all paths in user profile for completion status
        if (userProfile.journeyProgress) {
          // Check self-discovery path (10 days)
          if (userProfile.journeyProgress.selfDiscoveryProgress?.completedDays?.length >= 10) {
            completedJourneysObj['self-discovery'] = {
              isCompleted: true,
              lastViewed: localStorage.getItem('completion_viewed_self-discovery') || null
            };
          }
          
          // Check emotional-intelligence path (10 days)
          if (userProfile.journeyProgress.emotionalIntelligenceProgress?.completedDays?.length >= 10) {
            completedJourneysObj['emotional-intelligence'] = {
              isCompleted: true,
              lastViewed: localStorage.getItem('completion_viewed_emotional-intelligence') || null
            };
          }
          
          // Check mindfulness-awareness path (10 days)
          if (userProfile.journeyProgress.mindfulnessAwarenessProgress?.completedDays?.length >= 10) {
            completedJourneysObj['mindfulness-awareness'] = {
              isCompleted: true,
              lastViewed: localStorage.getItem('completion_viewed_mindfulness-awareness') || null
            };
          }
          
          // Check transformation-journey path (21 days)
          if (userProfile.journeyProgress.transformationJourneyProgress?.completedDays?.length >= 21) {
            completedJourneysObj['transformation-journey'] = {
              isCompleted: true,
              lastViewed: localStorage.getItem('completion_viewed_transformation-journey') || null
            };
          }
          
          // Check for other journeys based on durations from path registry
          // Creative Expression (14 days)
          if (userProfile.journeyProgress.creativeExpressionProgress?.completedDays?.length >= 14) {
            completedJourneysObj['creative-expression'] = {
              isCompleted: true,
              lastViewed: localStorage.getItem('completion_viewed_creative-expression') || null
            };
          }
          
          // Habit Formation (30 days)
          if (userProfile.journeyProgress.habitFormationProgress?.completedDays?.length >= 30) {
            completedJourneysObj['habit-formation'] = {
              isCompleted: true,
              lastViewed: localStorage.getItem('completion_viewed_habit-formation') || null
            };
          }
          
          // Life Vision (100 days)
          if (userProfile.journeyProgress.lifeVisionProgress?.completedDays?.length >= 100) {
            completedJourneysObj['life-vision'] = {
              isCompleted: true,
              lastViewed: localStorage.getItem('completion_viewed_life-vision') || null
            };
          }
        }
        
        // Also check Firebase for stored completion preferences
        if (currentUser.uid) {
          const completionPrefsRef = doc(db, 'users', currentUser.uid, 'preferences', 'completion-prefs');
          const completionPrefsSnap = await getDoc(completionPrefsRef);
          
          if (completionPrefsSnap.exists()) {
            const storedPrefs = completionPrefsSnap.data();
            
            // Merge stored preferences with local state
            Object.keys(storedPrefs).forEach(pathId => {
              if (completedJourneysObj[pathId]) {
                // Only use stored lastViewed if it's more recent than localStorage
                const localTimestamp = localStorage.getItem(`completion_viewed_${pathId}`);
                if (storedPrefs[pathId].lastViewed > (localTimestamp || 0)) {
                  completedJourneysObj[pathId].lastViewed = storedPrefs[pathId].lastViewed;
                  // Update localStorage with the most recent value
                  localStorage.setItem(`completion_viewed_${pathId}`, storedPrefs[pathId].lastViewed);
                }
              } else {
                completedJourneysObj[pathId] = storedPrefs[pathId];
                // Update localStorage
                if (storedPrefs[pathId].lastViewed) {
                  localStorage.setItem(`completion_viewed_${pathId}`, storedPrefs[pathId].lastViewed);
                }
              }
            });
          }
        }
        
        console.log('Completed journeys status loaded:', completedJourneysObj);
        setCompletedJourneys(completedJourneysObj);
        hasLoadedCompletionStatus.current = true;
      } catch (error) {
        console.error('Error loading completed journeys:', error);
      }
    };
    
    loadCompletedJourneys();
  }, [currentUser, userProfile]);
  
  // NEW: Update completion preferences in Firestore when they change
  useEffect(() => {
    const updateCompletionPrefs = async () => {
      if (!currentUser || !Object.keys(completedJourneys).length || !hasLoadedCompletionStatus.current) return;
      
      try {
        // Store completion preferences in Firestore
        const completionPrefsRef = doc(db, 'users', currentUser.uid, 'preferences', 'completion-prefs');
        await setDoc(completionPrefsRef, completedJourneys, { merge: true });
        console.log('Updated completion preferences in Firestore');
      } catch (error) {
        console.error('Error updating completion preferences:', error);
      }
    };
    
    // Only update when completedJourneys changes and has values
    if (Object.keys(completedJourneys).length > 0 && hasLoadedCompletionStatus.current) {
      updateCompletionPrefs();
    }
  }, [currentUser, completedJourneys]);
  
  // Initialize user's progress from their profile - this is critical for correct navigation
  useEffect(() => {
    if (userProfile?.journeyProgress && !hasInitialized.current) {
      console.log('Initializing navigation from user profile...');
      // Determine which path the user is actively working on
      let activePath = PATHS.SELF_DISCOVERY;
      let activeDay = 1;
      
      try {
        // For each path, get the next day they should work on
        const paths = [
          PATHS.SELF_DISCOVERY, 
          PATHS.EMOTIONAL_INTELLIGENCE, 
          PATHS.MINDFULNESS_AWARENESS,
          PATHS.TRANSFORMATION_JOURNEY
        ];
        
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
        
        console.log(`Initialized navigation with path: ${activePath}, day: ${activeDay}`);
        console.log('Path progress data:', pathProgress);
        
        // Update state and ref with user's progress
        setCurrentPath(activePath);
        setCurrentDay(activeDay);
        lastActiveContextRef.current = { 
          path: activePath, 
          day: activeDay,
          sessionId: sessionId.current
        };
        
        // Mark as initialized to prevent repeated initialization
        hasInitialized.current = true;
      } catch (error) {
        console.error('Error initializing navigation from user profile:', error);
        // Fall back to default values
        setCurrentPath(PATHS.SELF_DISCOVERY);
        setCurrentDay(1);
      }
    }
  }, [userProfile]);
  
  // Load persisted context on mount - only if not initialized from user profile
  useEffect(() => {
    try {
      if (!hasInitialized.current) {
        console.log('Checking for persisted navigation context...');
        const persistedContext = localStorage.getItem('kairosContext');
        
        if (persistedContext) {
          const parsedContext = JSON.parse(persistedContext);
          console.log('Found persisted context:', parsedContext);
          
          // Check if context is recent (within last 48 hours)
          const lastActive = new Date(parsedContext.lastActive || 0);
          const now = new Date();
          const hoursSinceActive = (now - lastActive) / (1000 * 60 * 60);
          
          if (hoursSinceActive < 48) {
            console.log('Using persisted context (less than 48 hours old)');
            
            // Set the path and day from persisted context
            lastActiveContextRef.current = { 
              path: parsedContext.path || PATHS.SELF_DISCOVERY, 
              day: parsedContext.day || 1,
              sessionId: sessionId.current
            };
            
            setCurrentPath(parsedContext.path || PATHS.SELF_DISCOVERY);
            setCurrentDay(parsedContext.day || 1);
            
            // Don't set screen from storage - always start at loading
          } else {
            console.log('Persisted context too old, using defaults');
          }
        } else {
          console.log('No persisted context found, using defaults');
        }
      }
    } catch (error) {
      console.error('Error loading persisted navigation context:', error);
    }
  }, []);
  
  // Track screen views for potential analytics
  const logScreenView = useCallback((screen, data = {}) => {
    console.log(`Screen transition: ${screen}`, { 
      ...data,
      currentPath: data.pathId || currentPath,
      currentDay: data.day || currentDay,
      sessionId: sessionId.current
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
      const contextData = {
        path: currentPath,
        day: currentDay,
        screen: currentScreen,
        lastActive: new Date().toISOString(),
        sessionId: sessionId.current
      };
      
      localStorage.setItem('kairosContext', JSON.stringify(contextData));
      
      // Also update window.appState
      if (window.appState) {
        window.appState.currentPath = currentPath;
        window.appState.currentDay = currentDay;
        window.appState.currentScreen = currentScreen;
      }
    } catch (e) {
      console.warn('Could not persist navigation context:', e);
    }
  }, [currentPath, currentDay, currentScreen]);
  
  // NEW: Mark a journey as viewed
  const markJourneyAsViewed = useCallback((pathId) => {
    if (!pathId) return;
    
    const timestamp = new Date().getTime();
    
    // Update state
    setCompletedJourneys(prev => ({
      ...prev,
      [pathId]: {
        ...prev[pathId],
        isCompleted: true,
        lastViewed: timestamp,
        // Add viewCount to track multiple views
        viewCount: (prev[pathId]?.viewCount || 0) + 1
      }
    }));
    
    // Store in both localStorage and sessionStorage for better persistence
    sessionStorage.setItem(`completion_viewed_${pathId}`, timestamp);
    localStorage.setItem(`completion_viewed_${pathId}`, timestamp);
    
    console.log(`Marked journey ${pathId} as viewed at ${timestamp}`);
  }, []);
  
  // NEW: Check if a journey has been recently viewed (within 24 hours)
  const hasJourneyBeenRecentlyViewed = useCallback((pathId) => {
    if (!pathId || !completedJourneys[pathId]) return false;
    
    // Check session storage first (indicates current browsing session)
    const sessionValue = sessionStorage.getItem(`completion_viewed_${pathId}`);
    if (sessionValue) return true;
    
    const lastViewed = completedJourneys[pathId].lastViewed;
    if (!lastViewed) return false;
    
    // Check if viewed within the last 24 hours
    const twentyFourHoursAgo = new Date().getTime() - (24 * 60 * 60 * 1000);
    return lastViewed > twentyFourHoursAgo;
  }, [completedJourneys]);

  // NEW: Reset journey completion view status
  const resetJourneyViewStatus = useCallback((pathId) => {
    if (!pathId) return;
    
    // Update state
    setCompletedJourneys(prev => {
      const updated = { ...prev };
      if (updated[pathId]) {
        delete updated[pathId].lastViewed;
      }
      return updated;
    });
    
    // Remove from localStorage
    localStorage.removeItem(`completion_viewed_${pathId}`);
    console.log(`Reset view status for journey ${pathId}`);
  }, []);
  
  const checkCompletionRedirect = useCallback((screen, data = {}) => {
    // If already going to completion screen, just mark as viewed
    if (screen === 'journey-complete') {
      const pathId = data.pathId || currentPath;
      markJourneyAsViewed(pathId);
      return { screen, params: data };
    }
    
    // Handle daily view for a completed journey
    const pathId = data.pathId || currentPath;
    
    // NEW: More specific conditions to prevent unwanted redirects
    if (screen === 'daily' && 
        completedJourneys[pathId]?.isCompleted && 
        !hasJourneyBeenRecentlyViewed(pathId) && 
        !sessionStorage.getItem(`completion_viewed_${pathId}`) &&
        // CRITICAL: Only redirect in specific cases, not when viewing archive entries
        // or explicitly viewing day information from path selection
        !data.fromArchive && 
        !data.fromPathSelection &&
        !data.skipCompletionCheck
    ) {
      
      console.log(`Redirecting to completion screen for path ${pathId}`);
      
      // Return the modified navigation
      return {
        screen: 'journey-complete',
        params: { ...data, pathId }
      };
    }
    
    // No redirect needed
    return { screen, params: data };
  }, [currentPath, completedJourneys, hasJourneyBeenRecentlyViewed, markJourneyAsViewed]);
  
  // Enhanced navigate to screen with context preservation and completion checks
  const navigateToScreen = useCallback(async (screen, data = {}, options = {}) => {
    // Prevent navigation loops
    if (isNavigating.current) {
      console.log('Navigation already in progress, ignoring request');
      return;
    }
    
    // Set flag to prevent loops
    isNavigating.current = true;
    
    // Extract options
    const { skipCompletionCheck = false } = options;
    
    // Log navigation request
    console.log('Navigating to screen:', screen, 'with data:', data, 'options:', options);
    
    // Check if this is tab navigation (coming from bottom nav)
    const isTabNavigation = data.isTabNavigation || false;
    
    // NEW: Check for completion redirect only if not skipped
    const { screen: redirectScreen, params: redirectData } = 
      skipCompletionCheck ? { screen, params: data } : checkCompletionRedirect(screen, data);
    
    if (redirectScreen !== screen) {
      console.log(`Navigation redirected: ${screen} → ${redirectScreen}`);
    }
    
    // Use redirected values for navigation
    screen = redirectScreen;
    data = redirectData;
    
    // Store previous context before navigation
    const prevPath = currentPath;
    const prevDay = currentDay;
    
    // Save current context before navigation
    lastActiveContextRef.current = { 
      path: prevPath, 
      day: prevDay,
      sessionId: sessionId.current 
    };
    
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
    
    // NEW: Only show loader during navigation if not tab navigation
    if (!isTabNavigation) {
      // Show loader during navigation
      await showLoader({ 
        size: 'medium', 
        duration: 200
      });
    }
    
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
    }
    
    if (data.day !== undefined) {
      console.log('Setting day to:', data.day);
      setCurrentDay(data.day);
      lastActiveContextRef.current.day = data.day;
    }
    
    // Special case for tab navigation - restore last active path/day
    // This ensures context is preserved when switching tabs
    if (isRootTabScreen(screen)) {
      // These are tab screens - preserve path context if not explicitly set
      if (data.pathId === undefined) {
        setCurrentPath(lastActiveContextRef.current.path);
      }
      
      if (data.day === undefined) {
        setCurrentDay(lastActiveContextRef.current.day);
      }
    }
    
    // Journal entry specific data
    if (data.journalImage !== undefined) setJournalImage(data.journalImage);
    if (data.additionalImages !== undefined) setAdditionalImages(data.additionalImages);
    if (data.extractedText !== undefined) setExtractedText(data.extractedText);
    
    // Persist navigation context
    persistContext();
    
    // Reset scroll position to top
    window.scrollTo(0, 0);
    
    // Reset navigation flag after a short delay
    setTimeout(() => {
      isNavigating.current = false;
      
      // Only hide loader if we showed it (not for tab navigation)
      if (!isTabNavigation) {
        hideLoader();
      }
    }, 300);
  }, [
    currentScreen, 
    screenData, 
    currentPath, 
    currentDay, 
    journalImage,
    additionalImages,
    extractedText,
    showLoader, 
    hideLoader,
    logScreenView,
    persistContext,
    isRootTabScreen,
    checkCompletionRedirect
  ]);
  
  // Navigate back with improved history management
  const navigateBack = useCallback(async () => {
    // Prevent navigation loops
    if (isNavigating.current) {
      console.log('Navigation already in progress, ignoring back request');
      return;
    }
    
    // Set flag to prevent loops
    isNavigating.current = true;
    
    // Show loader
    await showLoader({ 
      size: 'small', 
      duration: 200
    });
    
    if (navigationHistory.length > 0) {
      // Get last item from history
      const previousState = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      
      console.log('Navigating back to:', previousState.screen, 'with data:', previousState.data);
      
      // Apply previous state
      setCurrentScreen(previousState.screen);
      setScreenData(previousState.data || {});
      
      // Restore path/day context if available
      if (previousState.data?.pathId) {
        setCurrentPath(previousState.data.pathId);
      }
      
      if (previousState.data?.day) {
        setCurrentDay(previousState.data.day);
      }
      
      // Update context ref
      lastActiveContextRef.current = { 
        path: previousState.data?.pathId || currentPath,
        day: previousState.data?.day || currentDay,
        sessionId: sessionId.current
      };
      
      // Restore other data if available
      if (previousState.data?.journalImage !== undefined) {
        setJournalImage(previousState.data.journalImage);
      }
      
      if (previousState.data?.additionalImages !== undefined) {
        setAdditionalImages(previousState.data.additionalImages);
      }
      
      if (previousState.data?.extractedText !== undefined) {
        setExtractedText(previousState.data.extractedText);
      }
      
      // Log screen view
      logScreenView(previousState.screen, previousState.data);
      
      // Reset scroll position to top
      window.scrollTo(0, 0);
      
      // Persist context
      persistContext();
    } else {
      // Default back behavior if no history
      handleDefaultBack();
    }
    
    // Reset navigation flag after a short delay
    setTimeout(() => {
      isNavigating.current = false;
      
      // Hide loader
      hideLoader();
    }, 300);
  }, [
    navigationHistory, 
    showLoader, 
    hideLoader,
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
      'bug-report': 'home',
      'terms-of-service': 'signup',
      'privacy-policy': 'signup',
      'contact-us': 'home',
      'about': 'home',
      'journey-complete': 'path-selection' // NEW: Add back behavior from completion screen
    };
    
    const defaultScreen = defaultBackMap[currentScreen] || 'home';
    setCurrentScreen(defaultScreen);
    
    // Reset scroll position to top
    window.scrollTo(0, 0);
    
    return true;
  }, [currentScreen]);
  
  // Helper to get path name
  const getPathName = useCallback(() => {
    switch(currentPath) {
      case PATHS.EMOTIONAL_INTELLIGENCE:
        return 'Emotional Intelligence';
      case PATHS.MINDFULNESS_AWARENESS:
        return 'Mindfulness';
      case PATHS.TRANSFORMATION_JOURNEY:
        return 'Transformation Journey';
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
      case PATHS.TRANSFORMATION_JOURNEY:
        return 'path-tj';
      case PATHS.SELF_DISCOVERY:
      default:
        return 'path-sd';
    }
  }, [currentPath]);
  
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
    
    // NEW: Completion tracking
    completedJourneys,
    markJourneyAsViewed,
    hasJourneyBeenRecentlyViewed,
    resetJourneyViewStatus,
    
    // Refs for debugging
    lastActiveContext: lastActiveContextRef.current,
    sessionId: sessionId.current
  };
};

export default useNavigationState;