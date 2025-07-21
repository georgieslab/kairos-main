<<<<<<< HEAD
// src/App.jsx - v5.1.0-alpha - Complete Production Ready Version
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useNavigation } from './contexts/NavigationContext';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType } from '@capacitor/camera';

// Core Services
import { 
  analyzeJournalEntry, 
  saveAnalysisResult, 
  getJournalEntry,
  getPreviousEntries
} from './services/claudeService';
import apiCacheService from './services/apiCacheService.js';
import useJourneyCompletion from './hooks/useJourneyCompletion';
import EnhancedJourneyCompletion from './components/journey/EnhancedJourneyCompletion';


// Core Components
=======
// src/App.jsx - Updated with direct subscription modal rendering
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './contexts/AuthContext'
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import InstallPrompt from './components/common/InstallPrompt';

// Import ThemeProvider
import { ThemeProvider } from './contexts/ThemeContext';

// Import all components
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
import WelcomeScreen from './pages/WelcomeScreen';
import SignUpScreen from './components/auth/SignUpScreen';
import UserProfile from './components/auth/UserProfile';
import JourneyPreview from './components/journey/JourneyPreview';
import DailyJourneyView from './components/journey/DailyJourneyView';
<<<<<<< HEAD
import VoiceJournalUpload from './components/voice/VoiceJournalUpload';
import JournalUpload from './components/journey/JournalUpload';
import JourneyCompletion from './components/journey/JourneyCompletion';
import Header from './components/layout/Header';
import BottomNavigation from './components/layout/BottomNavigation';
import HomeScreen from './pages/HomeScreen';
import ProfileScreen from './pages/ProfileScreen';
import WriteTab from './components/journey/WriteTab';
import FeedbackForm from './components/feedback/FeedbackForm';
import FloatingActionButton from './components/common/FloatingActionButton';
import KairosLoader from './components/common/KairosLoader';

// Static Pages
=======
import JournalUpload from './components/journey/JournalUpload';
import JourneyCompletion from './components/journey/JourneyCompletion';
import UserSettings from './components/settings/UserSettings';
import Header from './components/layout/Header';
import JournalArchive from './components/journal/JournalArchive';
import PathSelection from './components/paths/PathSelection';
import BottomNavigation from './components/layout/BottomNavigation';
import HomeScreen from './pages/HomeScreen';
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
import PrivacyPolicy from './pages/Privacy';
import TermsOfService from './pages/Terms';
import ContactUs from './pages/Contact';
import About from './pages/About';
<<<<<<< HEAD

// Lazy Loaded Components
const PathSelection = lazy(() => import('./components/paths/PathSelection'));
const JournalAnalyticsDashboard = lazy(() => import('./pages/JournalAnalyticsDashboard'));
const JournalArchive = lazy(() => import('./components/journal/JournalArchive'));
const AnalysisResults = lazy(() => import('./components/journey/AnalysisResults'));
const UserSettings = lazy(() => import('./components/settings/UserSettings'));
const CompletedPathsScreen = lazy(() => import('./pages/CompletedPathsScreen'));

// Data and Utils
import { getJourneyDay, getJourneyPath } from './data/JourneyData';
=======
import { getJourneyDay } from './data/JourneyData';
import AnalysisResults from './components/journey/AnalysisResults';
import JournalAnalyticsDashboard from './pages/JournalAnalyticsDashboard';
import FeedbackForm from './components/feedback/FeedbackForm';
import FloatingActionButton from './components/common/FloatingActionButton';
import WriteTab from './components/journey/WriteTab';

import apiCacheService from './services/apiCacheService.js';
import { useNavigation } from './contexts/NavigationContext';
import { getAllJourneyPaths, getJourneyPath } from './data/JourneyData';
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
import { 
  getProgressFieldForPath, 
  getAllActiveJourneys, 
  getNextDayForPath,
  updateCurrentPath 
} from './utils/pathUtils';

<<<<<<< HEAD
// Styles
import './styles/components/lazyLoading.css';
import './styles/components/pathIndicator.css';
import './styles/components/WriteTab.css';
import './styles/components/pageTransitions.css';
import './styles/components/theme.css';

// Initialize API Cache Service
if (!window.apiCacheService) {
  window.apiCacheService = apiCacheService;
}

// Offline Status Provider
=======
// Import CSS
import './styles/components/pathIndicator.css';
import './styles/components/WriteTab.css';
import './styles/components/pageTransitions.css';
import './styles/components/theme.css'; // Import global theme CSS

// Import loader components
import KairosLoader from './components/common/KairosLoader';

if (!window.apiCacheService) {
  window.apiCacheService = apiCacheService;
  console.log('API cache service initialized in App.jsx');
}

// Add the offline status provider
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
const OfflineStatusProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return children({ isOnline });
};

<<<<<<< HEAD
// Loading Screen Component
const LazyLoadingScreen = () => (
  <div className="lazy-loading-screen">
    <div className="loading-shimmer">
      <div className="shimmer-circle" />
      <div className="shimmer-text" />
      <div className="shimmer-text short" />
    </div>
  </div>
);

// Camera Integration
const takePhoto = async () => {
  if (Capacitor.isNativePlatform()) {
=======
const takePhoto = async () => {
  if (Capacitor.isNativePlatform()) {
    // Use native camera
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl
    });
    return image.dataUrl;
<<<<<<< HEAD
  }
};

// Main App Component
=======
  } else {
    // Use web implementation
    // Your existing web camera code
  }
};

>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
const App = () => {
  const { currentUser, userProfile, logout, loading } = useAuth();
  const navigation = useNavigation();
  const { 
    currentScreen,
    currentPath, 
    currentDay,
    journalImage,
    additionalImages,
    isMultiPage,
    screenData, 
    extractedText,
    navigateToScreen,
    navigateBack,
    isRootTabScreen,
    isLoading,
    loaderProps,
    showLoader,
    hideLoader,
    navigationHistory,
    onNext
  } = navigation;
  
<<<<<<< HEAD
  // Journey Completion Hook
  const { 
    navigateWithCompletionCheck, 
    hasJourneyBeenRecentlyViewed,
    completedJourneys,
    isJourneyCompleted 
  } = useJourneyCompletion(currentPath, navigateToScreen);
  
  // Local State
=======
  // Keep these states that aren't part of navigation
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  const [pendingUploads, setPendingUploads] = useState([]);
  const [settingsData, setSettingsData] = useState({ activeSection: 'profile' });
  const [feedbackType, setFeedbackType] = useState('feedback');
  const [previousScreen, setPreviousScreen] = useState(null);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [isBackNavigation, setIsBackNavigation] = useState(false);
  const [isTabNavigation, setIsTabNavigation] = useState(false);
  const pageRef = useRef(null);

<<<<<<< HEAD
  // Development Mode Setup
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem('devPremium', 'false');
    }
  }, []);

  // Page Transitions
  useEffect(() => {
    if (previousScreen && previousScreen !== currentScreen) {
      const isBack = navigationHistory.some(item => item.screen === currentScreen);
      const isTab = screenData && screenData.isTabNavigation;
      
      setIsBackNavigation(isBack);
      setIsTabNavigation(isTab);
      setIsPageTransitioning(true);
      
      const transitionTimer = setTimeout(() => {
        setIsPageTransitioning(false);
      }, 300);
      
      return () => clearTimeout(transitionTimer);
    }
  }, [currentScreen]);

  useEffect(() => {
    if (currentScreen !== 'loading') {
      setPreviousScreen(currentScreen);
    }
  }, [currentScreen]);

  // Initial Loading and Authentication Flow
  useEffect(() => {
    if (currentScreen === 'loading') {
      showLoader({ 
        size: 'large', 
        fullScreen: true
      });
    }
  }, [showLoader, currentScreen]);
  
  useEffect(() => {
    if (loading) {
      navigateToScreen('loading');
      return;
    }
    
    if (currentScreen === 'loading') {
      const handleInitialLoad = async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (!currentUser) {
          navigateToScreen('welcome');
          return;
        } 
        
        if (!userProfile) {
          return;
        }
        
        if (userProfile.journeyProgress) {
          const storedPath = userProfile.journeyProgress.currentPath;
          let activePath = storedPath || 'self-discovery';
          let activeDay = 1;
          
          if (!storedPath) {
            try {
              const activeJourneys = getAllActiveJourneys(userProfile);
              
              if (activeJourneys && activeJourneys.length > 0) {
                const mostRecentJourney = activeJourneys[0];
                activePath = mostRecentJourney.pathId;
                activeDay = mostRecentJourney.nextDay;
                
                await updateCurrentPath(currentUser.uid, activePath);
              }
            } catch (error) {
              activePath = 'self-discovery';
              activeDay = 1;
            }
          }
          
          try {
            activeDay = getNextDayForPath(userProfile, activePath);
          } catch (error) {
            // Keep default day 1 if calculation fails
          }
          
          const pathData = getJourneyPath(activePath);
          const pathDuration = pathData ? pathData.duration : 10;
          
          const progressField = getProgressFieldForPath(activePath);
          const progress = userProfile.journeyProgress[progressField];
          const completedDays = progress?.completedDays || [];
          
          if (completedDays.length >= pathDuration) {
            if (!hasJourneyBeenRecentlyViewed(activePath)) {
              navigateToScreen('journey-complete', { pathId: activePath, day: activeDay });
            } else {
              navigateToScreen('home', { pathId: activePath, day: activeDay });
            }
          } else {
            navigateToScreen('home', { pathId: activePath, day: activeDay });
          }
        } else {
          navigateToScreen('journey-preview');
        }
        
        await hideLoader();
      };
      
      handleInitialLoad();
    } else if (!currentUser && ['signup', 'profile'].includes(currentScreen)) {
      // Stay on current screen during auth flow
    }
    
  }, [currentUser, userProfile, loading, hideLoader, currentScreen, navigateToScreen, hasJourneyBeenRecentlyViewed]);

  // Process Pending Uploads
  useEffect(() => {
    const processPendingUploads = async () => {
      if (pendingUploads.length > 0 && navigator.onLine) {
        await showLoader({ 
          size: 'medium',
          fullScreen: false
        });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          setPendingUploads([]);
        } finally {
          await hideLoader();
        }
      }
    };
    
    processPendingUploads();
  }, [pendingUploads, showLoader, hideLoader]);

  // Reset Scroll Position
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]);

  // Get Current Journey Day
  const getCurrentJourneyDay = () => {
    const safePath = currentPath || 'self-discovery';
    
    try {
      const journeyData = getJourneyDay(currentDay, safePath);
      
      if (!journeyData) {
=======
  // Define getCurrentJourneyDay before the return statement
  const getCurrentJourneyDay = () => {
    // Make sure we have a valid path, defaulting to 'self-discovery' if not
    const safePath = currentPath || 'self-discovery';
    
    try {
      // Get journey day data with fallbacks for errors
      const journeyData = getJourneyDay(currentDay, safePath);
      
      // If journey data is not found, provide default values
      if (!journeyData) {
        console.warn(`Journey data not found for day ${currentDay} and path ${safePath}`);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        return {
          day: currentDay,
          title: `Day ${currentDay}`,
          theme: "Reflection",
          prompt: "What are you thinking and feeling today?"
        };
      }
      
      return journeyData;
    } catch (error) {
<<<<<<< HEAD
=======
      console.error("Error getting journey day data:", error);
      // Return default data in case of error
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      return {
        day: currentDay,
        title: `Day ${currentDay}`,
        theme: "Reflection",
        prompt: "What are you thinking and feeling today?"
      };
    }
  };

<<<<<<< HEAD
  // Handle Journal Upload
  const handleJournalUpload = async (imageUrl, extractedText, pathId, isTextOnly, isMultiPage, additionalImages, imageFiles, voiceData) => {
    if (!currentUser) {
      return;
    }

    try {
      showLoader({ 
        size: 'medium',
        message: voiceData ? 'Analyzing your voice journal...' : 'Analyzing your journal...'
      });

      const journeyDay = getCurrentJourneyDay();
      const prompt = journeyDay.prompt || '';
      const theme = journeyDay.theme || '';

      let analysisResult;

      if (voiceData && voiceData.transcription) {
        analysisResult = await analyzeJournalEntry(
          null,
          prompt,
          theme,
          userProfile,
          voiceData.day || currentDay,
          '',
          voiceData.pathId || currentPath,
          false,
          null,
          voiceData
        );

        await saveAnalysisResult(
          currentUser.uid,
          voiceData.day || currentDay,
          analysisResult,
          null,
          voiceData.pathId || currentPath,
          true
        );

        navigateToScreen('analysis', {
          pathId: voiceData.pathId || currentPath,
          day: voiceData.day || currentDay,
          prompt: prompt,
          theme: theme,
          imageUrl: null,
          extractedText: voiceData.transcription,
          textOnly: false,
          isMultiPage: false,
          additionalImages: [],
          imageFiles: null,
          analysisResult: analysisResult,
          isVoiceEntry: true,
          voiceData: voiceData
        });
        
      } else {
        analysisResult = await analyzeJournalEntry(
          imageUrl,
          prompt,
          theme,
          userProfile,
          currentDay,
          extractedText,
          pathId || currentPath,
          isMultiPage,
          imageFiles,
          null
        );

        await saveAnalysisResult(
          currentUser.uid,
          currentDay,
          analysisResult,
          imageUrl,
          pathId || currentPath,
          false
        );

        navigateToScreen('analysis', {
          pathId: pathId || currentPath,
          day: currentDay,
          prompt: prompt,
          theme: theme,
          imageUrl: imageUrl,
          extractedText: extractedText,
          textOnly: isTextOnly,
          isMultiPage: isMultiPage,
          additionalImages: additionalImages,
          imageFiles: imageFiles,
          analysisResult: analysisResult,
          isVoiceEntry: false,
          voiceData: null
        });
      }

    } catch (error) {
      const errorMessage = voiceData 
        ? 'Failed to analyze voice journal. Please try again.'
        : 'Failed to analyze journal entry. Please try again.';
        
      alert(errorMessage);
      navigateBack();
    } finally {
      hideLoader();
    }
  };

  // Render Application
=======
  // For development mode, set premium access flag - CHANGED: default to false for testing
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem('devPremium', 'false');
    }
  }, []);

  // NEW: Debug logging for screen transitions
  useEffect(() => {
    console.log('Current screen changed to:', currentScreen);
    console.log('Screen data:', screenData);
  }, [currentScreen, screenData]);

  useEffect(() => {
    if (previousScreen && previousScreen !== currentScreen) {
      // Determine if this is a back navigation or tab navigation
      const isBack = navigationHistory.some(item => item.screen === currentScreen);
      const isTab = screenData && screenData.isTabNavigation;
      
      setIsBackNavigation(isBack);
      setIsTabNavigation(isTab);
      setIsPageTransitioning(true);
      
      // Reset transition state after animation completes
      const transitionTimer = setTimeout(() => {
        setIsPageTransitioning(false);
      }, 300); // Match with CSS animation duration
      
      return () => clearTimeout(transitionTimer);
    }
  }, [currentScreen]);

  // Update previous screen after each render
  useEffect(() => {
    if (currentScreen !== 'loading') {
      setPreviousScreen(currentScreen);
    }
  }, [currentScreen]);

  // Effect to handle the initial app loading state
  useEffect(() => {
    // Show initial loader when app starts
    if (currentScreen === 'loading') {
      showLoader({ 
        size: 'large', 
        fullScreen: true
      });
    }
  }, [showLoader, currentScreen]);
  
  // Effect to determine which screen to show based on authentication state
  useEffect(() => {
    if (loading) {
      // Use navigation context to change screen
      navigateToScreen('loading');
      return;
    }
    
    console.log('Auth state changed:', { currentUser, currentScreen, loading });
    
    if (currentScreen === 'loading') {
      // Use async function to handle loader hide with Promise
      const handleInitialLoad = async () => {
        // Keep loader visible for at least 1.5 seconds for smooth experience
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (!currentUser) {
          navigateToScreen('welcome');
          return;
        } 
        
        if (!userProfile) {
          navigateToScreen('profile');
          return;
        } 
        
        if (userProfile.journeyProgress) {
          // Determine active path and day from user profile dynamically
          const storedPath = userProfile.journeyProgress.currentPath;
          let activePath = storedPath || 'self-discovery';
          let activeDay = 1;
          
          console.log('Initializing with stored path:', storedPath);
          
          // Find path with most recent activity if no current path is set
          if (!storedPath) {
            try {
              const activeJourneys = getAllActiveJourneys(userProfile);
              console.log('Active journeys found:', activeJourneys);
              
              if (activeJourneys && activeJourneys.length > 0) {
                // Use the most recently active journey
                const mostRecentJourney = activeJourneys[0];
                activePath = mostRecentJourney.pathId;
                activeDay = mostRecentJourney.nextDay;
                
                // Update the current path in Firebase since it wasn't set
                await updateCurrentPath(currentUser.uid, activePath);
              }
            } catch (error) {
              console.error('Error finding active journeys:', error);
              // Fall back to self-discovery
              activePath = 'self-discovery';
              activeDay = 1;
            }
          }
          
          // Calculate the next day to display regardless of path source
          try {
            activeDay = getNextDayForPath(userProfile, activePath);
            console.log(`Calculated next day: ${activeDay} for path: ${activePath}`);
          } catch (error) {
            console.error('Error calculating next day:', error);
            // Keep default day 1 if calculation fails
          }
          
          console.log(`Initialized navigation with path: ${activePath}, day: ${activeDay}`);
          
          // Get path data to check if journey is complete
          const pathData = getJourneyPath(activePath);
          const pathDuration = pathData ? pathData.duration : 10;
          
          // Check if all days are completed for this path
          const progressField = getProgressFieldForPath(activePath);
          const progress = userProfile.journeyProgress[progressField];
          const completedDays = progress?.completedDays || [];
          
          // Navigate to appropriate screen based on completion status
          if (completedDays.length >= pathDuration) {
            navigateToScreen('journey-complete', { pathId: activePath, day: activeDay });
          } else {
            navigateToScreen('home', { pathId: activePath, day: activeDay });
          }
        } else {
          navigateToScreen('journey-preview');
        }
        
        // Hide loader after determining the correct screen
        await hideLoader();
      };
      
      handleInitialLoad();
    } else if (!currentUser && ['signup', 'profile'].includes(currentScreen)) {
      // Don't redirect back to welcome, stay on the current screen
      console.log('Staying on current screen during auth flow:', currentScreen);
    }
    
  }, [currentUser, userProfile, loading, hideLoader, currentScreen, navigateToScreen]);

  // Effect to process pending uploads when online
  useEffect(() => {
    const processPendingUploads = async () => {
      if (pendingUploads.length > 0 && navigator.onLine) {
        // Show loader while processing uploads
        await showLoader({ 
          size: 'medium',
          fullScreen: false
        });
        
        try {
          // Process uploads here (in a real app)
          console.log('Processing pending uploads:', pendingUploads);
          // Simulate processing time
          await new Promise(resolve => setTimeout(resolve, 1500));
          setPendingUploads([]);
        } finally {
          // Hide loader when done
          await hideLoader();
        }
      }
    };
    
    processPendingUploads();
  }, [pendingUploads, showLoader, hideLoader]);

  // Reset scroll position on screen change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentScreen]);

  const handleJournalUpload = async (
  image, 
  text = '', 
  pathId = currentPath,
  isTextOnly = false,
  isMultiPage = false,
  additionalImages = [],
  imageFiles = null
) => {
  console.log('=== JOURNAL UPLOAD STARTED ===');
  console.log('Upload params:', {
    pathId,
    day: currentDay,
    isTextOnly,
    isMultiPage,
    hasImage: !!image,
    hasText: !!text,
    hasImageFiles: !!imageFiles,
    userId: currentUser?.uid
  });

  // Show loader during processing
  await showLoader({ 
    size: 'medium',
    duration: 1200
  });
  
  // If offline, store for later processing
  if (!navigator.onLine) {
    setPendingUploads([...pendingUploads, { 
      day: currentDay, 
      pathId, 
      image, 
      extractedText: text,
      isMultiPage,
      additionalImages,
      imageFiles
    }]);
    alert('You are offline. Your journal will be uploaded when you reconnect.');
    navigateToScreen('daily', { day: currentDay, pathId });
  } else {
    console.log('=== NAVIGATING TO ANALYSIS ===');
    console.log('Analysis navigation params:', {
      pathId,
      day: currentDay,
      journalImage: image,
      extractedText: text,
      textOnly: isTextOnly,
      isMultiPage,
      additionalImages,
      imageFiles
    });

    // Navigate to analysis with current path
    navigateToScreen('analysis', { 
      pathId, 
      day: currentDay,
      journalImage: image,
      extractedText: text, 
      textOnly: isTextOnly,
      isMultiPage: isMultiPage,
      additionalImages: additionalImages,
      imageFiles: imageFiles
    });
  }
};


  // Wrap the app with the ThemeProvider and SubscriptionProvider
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  return (
    <ThemeProvider>
      <OfflineStatusProvider>
        {({ isOnline }) => (
<<<<<<< HEAD
          <div className="min-h-screen bg-gray-950 text-white flex flex-col">
            {/* Global Loader */}
            {isLoading && <KairosLoader {...loaderProps} isFading={loaderProps.isFading} />}
            
            {/* Offline Indicator */}
            {!isOnline && (
              <div className="bg-yellow-700 text-yellow-100 text-center py-1 text-sm">
                You are offline. Some features may be limited.
              </div>
            )}
            
            {/* Header */}
            {currentUser && currentScreen !== 'welcome' && currentScreen !== 'signup' && (
              <Header 
                navigateToScreen={navigateToScreen}
                currentScreen={currentScreen}
                currentPath={currentPath}
                currentDay={currentDay}
                isRootTabScreen={isRootTabScreen}
                navigateBack={navigateBack}
              />
            )}
            
            {/* Main Content */}
            <main 
              className={`page-transition-container ${isPageTransitioning ? 'transitioning' : ''}`} 
              ref={pageRef}
            >
              <div 
                className={`page-content ${isPageTransitioning ? 
                  (isTabNavigation ? 'page-tab-enter' : 
                    (isBackNavigation ? 'page-enter-back' : 'page-enter')) 
                  : ''}`}
              >
                {/* Welcome Screen */}
                {currentScreen === 'welcome' && (
                  <WelcomeScreen 
                    onStart={() => navigateToScreen('signup')} 
                    onNavigate={(screen) => navigateToScreen(screen)}
                  />
                )}
                        
                {/* Authentication Screens */}
                {currentScreen === 'signup' && (
                  <SignUpScreen 
                    onNext={() => navigateToScreen('home')} 
                    onBack={() => navigateToScreen('welcome')}
                    navigateToScreen={navigateToScreen}
                  />
                )}
                
                {currentScreen === 'profile' && (
                  <ProfileScreen 
                    handleSignOut={logout}
                    navigateToScreen={navigateToScreen}
                  />
                )}
                
                {/* Core Screens */}
                {currentScreen === 'home' && (
                  <HomeScreen 
                    currentDay={currentDay}
                    currentPath={currentPath}
                    navigateToScreen={navigateToScreen}
                  />
                )}
                
                {currentScreen === 'journey-preview' && (
                  <JourneyPreview 
                    pathId={currentPath}
                    onStart={() => {
                      const pathProgressField = currentPath === 'emotional-intelligence' 
                        ? 'emotionalIntelligenceProgress' 
                        : currentPath === 'mindfulness-awareness' 
                          ? 'mindfulnessAwarenessProgress' 
                          : 'selfDiscoveryProgress';
                          
                      const pathProgress = userProfile?.journeyProgress?.[pathProgressField];
                      let dayToView = 1;

                      if (pathProgress) {
                        const completedDays = pathProgress.completedDays || [];
                        
                        if (completedDays.length > 0) {
                          const maxCompletedDay = Math.max(...completedDays);
                          const maxDays = currentPath === 'transformation-journey' ? 21 : 
                                        currentPath === 'creative-expression' ? 14 :
                                        currentPath === 'habit-formation' ? 30 :
                                        currentPath === 'life-vision' ? 100 : 10;
                                        
                          dayToView = Math.min(maxCompletedDay + 1, maxDays);
                        }
                      }
                      
                      navigateToScreen('daily', { day: dayToView, pathId: currentPath });
                    }} 
                  />
                )}

                {/* Path Selection */}
                {currentScreen === 'path-selection' && (
                  <Suspense fallback={<LazyLoadingScreen />}>
                    <PathSelection 
                      onSelectPath={(pathId) => {
                        navigateToScreen('journey-preview', { pathId });
                      }}
                      onSelectDay={(pathId, day) => {
                        navigateToScreen('daily', { 
                          pathId, 
                          day,
                          fromPathSelection: true
                        }, {
=======
          
          
            <div className="min-h-screen bg-gray-950 text-white flex flex-col">
              {/* Render the loader when isLoading is true */}
              {isLoading && <KairosLoader {...loaderProps} isFading={loaderProps.isFading} />}
              
              {/* Offline indicator */}
              {!isOnline && (
                <div className="bg-yellow-700 text-yellow-100 text-center py-1 text-sm">
                  You are offline. Some features may be limited.
                </div>
              )}
              
              {/* Header - only show on certain screens when authenticated */}
              {currentUser && currentScreen !== 'welcome' && currentScreen !== 'signup' && (
                <Header 
                  navigateToScreen={navigateToScreen}
                  currentScreen={currentScreen}
                  currentPath={currentPath}
                  currentDay={currentDay}
                  isRootTabScreen={isRootTabScreen}
                  navigateBack={navigateBack}
                />
              )}
              
              <main 
                className={`page-transition-container ${isPageTransitioning ? 'transitioning' : ''}`} 
                ref={pageRef}
              >
                <div 
                  className={`page-content ${isPageTransitioning ? 
                    (isTabNavigation ? 'page-tab-enter' : 
                      (isBackNavigation ? 'page-enter-back' : 'page-enter')) 
                    : ''}`}
                >
                  {/* Render the appropriate screen */}
                  {currentScreen === 'welcome' && (
                    <WelcomeScreen 
                      onStart={() => navigateToScreen('signup')} 
                      onNavigate={(screen) => navigateToScreen(screen)}
                    />
                  )}
                          
                  {currentScreen === 'signup' && (
                    <SignUpScreen 
                      onNext={() => navigateToScreen('profile')} 
                      onBack={() => navigateToScreen('welcome')}
                      navigateToScreen={navigateToScreen} // Add this prop for Terms/Privacy links
                    />
                  )}
                  
                  {currentScreen === 'profile' && (
                    <UserProfile 
                      onNext={onNext}
                      navigateToScreen={navigateToScreen}
                    />
                  )}
                  
                  {currentScreen === 'home' && (
                    <HomeScreen 
                      currentDay={currentDay}
                      currentPath={currentPath}
                      navigateToScreen={navigateToScreen}
                    />
                  )}
                  
                  {currentScreen === 'journey-preview' && (
                    <JourneyPreview 
                      pathId={currentPath}
                      onStart={() => {
                        // Get the correct day based on user progress
                        const pathProgressField = currentPath === 'emotional-intelligence' 
                          ? 'emotionalIntelligenceProgress' 
                          : currentPath === 'mindfulness-awareness' 
                            ? 'mindfulnessAwarenessProgress' 
                            : 'selfDiscoveryProgress';
                            
                        // Get the path progress
                        const pathProgress = userProfile?.journeyProgress?.[pathProgressField];
                        
                        // Calculate the next day to view
                        let dayToView = 1; // Default to day 1

                        if (pathProgress) {
                          const completedDays = pathProgress.completedDays || [];
                          
                          if (completedDays.length > 0) {
                            // If they have progress, go to the next uncompleted day
                            const maxCompletedDay = Math.max(...completedDays);
                            
                            // Different max days for different paths
                            const maxDays = currentPath === 'transformation-journey' ? 21 : 
                                          currentPath === 'creative-expression' ? 14 :
                                          currentPath === 'habit-formation' ? 30 :
                                          currentPath === 'life-vision' ? 100 : 10;
                                          
                            dayToView = Math.min(maxCompletedDay + 1, maxDays);
                          }
                        }
                        
                        console.log(`JourneyPreview - Navigating to day ${dayToView} for path ${currentPath}`);
                        navigateToScreen('daily', { day: dayToView, pathId: currentPath });
                      }} 
                    />
                  )}

                  {currentScreen === 'path-selection' && (
                    <PathSelection 
                      onSelectPath={(pathId) => {
                        console.log('App.jsx - Path selected:', pathId);
                        
                        // Always go to journey preview for new paths
                        navigateToScreen('journey-preview', { pathId });
                      }}
                      onSelectDay={(pathId, day) => {
                        console.log(`App.jsx - Selected day ${day} for path ${pathId}`);
                        
                        // Always navigate to daily view for any day, completed or not
                        // The DailyJourneyView will handle showing the appropriate content
                        navigateToScreen('daily', { 
                          pathId, 
                          day,
                          // Add a flag to indicate this is coming from path selection
                          fromPathSelection: true
                        }, {
                          // Skip completion check to prevent redirects
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
                          skipCompletionCheck: true
                        });
                      }}
                      navigateToScreen={navigateToScreen}
                      currentPath={currentPath}
                      currentDay={currentDay}
                    />
<<<<<<< HEAD
                  </Suspense>
                )}

                {/* Writing Interface */}
                {currentScreen === 'write' && (
                  <WriteTab 
                    currentPath={screenData?.pathId || currentPath}
                    currentDay={screenData?.day || currentDay}
                    navigateToScreen={navigateToScreen}
                  />
                )}
                        
                {/* Daily Journey View */}
                {currentScreen === 'daily' && (
                  <DailyJourneyView 
                    currentDay={currentDay}
                    pathId={currentPath}
                    onUpload={() => navigateToScreen('upload')}
                    onNavigate={(pathId, day) => navigateToScreen('daily', { pathId, day })}
                    onBack={navigateBack}
                  />
                )}

                {/* Voice Upload */}
                {currentScreen === 'voice-upload' && (
                  <VoiceJournalUpload
                    pathId={screenData?.pathId || currentPath}
                    dayNumber={screenData?.day || currentDay}
                    prompt={screenData?.prompt}
                    onBack={navigateBack}
                    onUploadComplete={async (voiceData) => {
                      navigateToScreen('analysis', {
                        pathId: voiceData.pathId || currentPath,
                        day: voiceData.day || currentDay,
                        prompt: screenData?.prompt || getCurrentJourneyDay().prompt,
                        theme: screenData?.theme || getCurrentJourneyDay().theme,
                        imageUrl: null,
                        extractedText: voiceData.transcription,
                        textOnly: false,
                        isMultiPage: false,
                        additionalImages: [],
                        imageFiles: null,
                        analysisResult: null,
                        isVoiceEntry: true,
                        voiceData: voiceData
                      });
                    }}
                  />
                )}

                {/* Analytics Dashboard */}
                {currentScreen === 'analytics-dashboard' && (
                  <Suspense fallback={<LazyLoadingScreen />}>
                    <JournalAnalyticsDashboard 
                      navigateToScreen={navigateToScreen}
                    />
                  </Suspense>
                )}

                {/* Completed Paths */}
                {currentScreen === 'completed-paths' && (
                  <Suspense fallback={<LazyLoadingScreen />}>
                    <CompletedPathsScreen 
                      navigateToScreen={navigateToScreen}
                    />
                  </Suspense>
                )}

                {/* Feedback Screens */}
                {currentScreen === 'feedback' && (
                  <FeedbackForm 
                    type={feedbackType}
                    onBack={navigateBack}
                    onSubmitSuccess={(result) => {
                      setTimeout(() => {
                        navigateToScreen('home');
                      }, 500);
                    }}
                  />
                )}

                {currentScreen === 'bug-report' && (
                  <FeedbackForm 
                    type="bug"
                    onBack={navigateBack}
                    onSubmitSuccess={(result) => {
                      setTimeout(() => {
                        navigateToScreen('home');
                      }, 500);
                    }}
                  />
                )}

                {/* Journal Archive */}
                {currentScreen === 'journal-archive' && (
                  <Suspense fallback={<LazyLoadingScreen />}>
                    <JournalArchive 
                      onBack={navigateBack}
                      onSelectDay={(day, pathId) => {
                        navigateToScreen('daily', { 
                          day, 
                          pathId: pathId || currentPath,
                          fromArchive: true
                        }, { 
                          skipCompletionCheck: true
                        });
                      }}
                    />
                  </Suspense>
                )}

                {/* Upload Interface */}
                {currentScreen === 'upload' && (
                  <JournalUpload 
                    dayNumber={currentDay}
                    pathId={currentPath}
                    onBack={navigateBack}
                    textOnly={screenData?.textOnly || false}
                    unifiedUpload={screenData?.unifiedUpload || false}
                    onUploadComplete={(imageUrl, extractedText, pathId, isTextOnly, isMultiPage, additionalImages, imageFiles) => {
                      handleJournalUpload(
                        imageUrl, 
                        extractedText, 
                        pathId, 
                        isTextOnly, 
                        isMultiPage, 
                        additionalImages,
                        imageFiles,
                        

                      );
                    }}
                  />
                )}

                {/* Static Pages */}
                {currentScreen === 'privacy-policy' && (
                  <PrivacyPolicy onBack={navigateBack} />
                )}

                {currentScreen === 'terms-of-service' && (
                  <TermsOfService onBack={navigateBack} />
                )}

                {currentScreen === 'contact-us' && (
                  <ContactUs onBack={navigateBack} />
                )}

                {currentScreen === 'about' && (
                  <About onBack={navigateBack} />
                )}
                        
                {/* Analysis Results */}
                {currentScreen === 'analysis' && (
                  <Suspense fallback={<LazyLoadingScreen />}>
                    <AnalysisResults 
                      dayNumber={screenData?.day || currentDay}
                      pathId={screenData?.pathId || currentPath}
                      prompt={screenData?.prompt || getCurrentJourneyDay().prompt}
                      theme={screenData?.theme || getCurrentJourneyDay().theme}
                      imageUrl={screenData?.imageUrl || journalImage}
                      extractedText={screenData?.extractedText || extractedText}
                      textOnly={screenData?.textOnly || (!journalImage && !!extractedText)}
                      isMultiPage={screenData?.isMultiPage || false}
                      additionalImages={screenData?.additionalImages || []}
                      imageFiles={screenData?.imageFiles || null}
                      analysisResult={screenData?.analysisResult || null}
                      isVoiceEntry={screenData?.isVoiceEntry || false}
                      voiceData={screenData?.voiceData || null}
                      onBack={navigateBack}
                      onNext={() => {
                        const nextDay = (screenData?.day || currentDay) + 1;
                        const pathToUse = screenData?.pathId || currentPath;
                        
                        const pathData = getJourneyPath(pathToUse);
                        const pathMaxDays = pathData ? pathData.duration : 10;
                        
                        if ((screenData?.day || currentDay) >= pathMaxDays) {
                          navigateToScreen('journey-complete', { pathId: pathToUse, day: screenData?.day || currentDay });
                        } else {
                          navigateToScreen('write', { day: nextDay, pathId: pathToUse });
                        }
                      }}
                    />
                  </Suspense>
                )}
              
                {/* Journey Completion */}
                {currentScreen === 'journey-complete' && (
                  <EnhancedJourneyCompletion 
                    pathId={screenData?.pathId || currentPath}
                    navigateToScreen={navigateToScreen}
                    onRestart={() => navigateToScreen('journey-preview', { pathId: screenData?.pathId || currentPath })}
                    onViewDay={(day) => navigateToScreen('daily', { 
                      day, 
                      pathId: screenData?.pathId || currentPath,
                      fromCompletion: true 
                    })}
                  />
                )}
                
                {/* Settings */}
                {currentScreen === 'settings' && (
                  <Suspense fallback={<LazyLoadingScreen />}>
=======
                  )}

                  {currentScreen === 'write' && (
                    <WriteTab 
                      currentPath={currentPath}
                      currentDay={currentDay}
                      navigateToScreen={navigateToScreen}
                    />
                  )}
                          
                  {currentScreen === 'daily' && (
                    <DailyJourneyView 
                      currentDay={currentDay}
                      pathId={currentPath}
                      onUpload={() => navigateToScreen('upload')}
                      onNavigate={(pathId, day) => navigateToScreen('daily', { pathId, day })}
                      onBack={navigateBack}
                    />
                  )}

                  {currentScreen === 'analytics-dashboard' && (
                    <JournalAnalyticsDashboard 
                      navigateToScreen={navigateToScreen}
                    />
                  )}

                  {currentScreen === 'feedback' && (
                    <FeedbackForm 
                      type={feedbackType}
                      onBack={navigateBack}
                      onSubmitSuccess={(result) => {
                        console.log('Feedback submitted:', result);
                        setTimeout(() => {
                          navigateToScreen('home');
                        }, 500);
                      }}
                    />
                  )}

                  {currentScreen === 'bug-report' && (
                    <FeedbackForm 
                      type="bug"
                      onBack={navigateBack}
                      onSubmitSuccess={(result) => {
                        console.log('Bug report submitted:', result);
                        setTimeout(() => {
                          navigateToScreen('home');
                        }, 500);
                      }}
                    />
                  )}

                  {currentScreen === 'journal-archive' && (
                    <JournalArchive 
                      onBack={navigateBack}
                      onSelectDay={(day, pathId) => {
                        console.log(`Navigating to day ${day} for path ${pathId || currentPath}`);
                        // Add the fromArchive flag to inform DailyJourneyView this is coming from archive
                        navigateToScreen('daily', { 
                          day, 
                          pathId: pathId || currentPath,
                          fromArchive: true  // Critical flag
                        }, { 
                          skipCompletionCheck: true // Prevent completion redirect
                        });
                      }}
                    />
                  )}

                  {currentScreen === 'upload' && (
  <JournalUpload 
    dayNumber={currentDay}
    pathId={currentPath}
    onBack={navigateBack}
    textOnly={screenData?.textOnly || false}
    unifiedUpload={screenData?.unifiedUpload || false}
    onUploadComplete={(imageUrl, extractedText, pathId, isTextOnly, isMultiPage, additionalImages, imageFiles) => {
      console.log('JournalUpload onUploadComplete called with:', {
        imageUrl,
        extractedText,
        pathId,
        isTextOnly,
        isMultiPage,
        additionalImages,
        imageFiles // Log the file objects
      });
      handleJournalUpload(
        imageUrl, 
        extractedText, 
        pathId, 
        isTextOnly, 
        isMultiPage, 
        additionalImages,
        imageFiles // Pass the file objects
      );
    }}
  />
)}

                  {currentScreen === 'privacy-policy' && (
                    <PrivacyPolicy onBack={navigateBack} />
                  )}

                  {currentScreen === 'terms-of-service' && (
                    <TermsOfService onBack={navigateBack} />
                  )}

                  {currentScreen === 'contact-us' && (
                    <ContactUs onBack={navigateBack} />
                  )}

                  {currentScreen === 'about' && (
                    <About onBack={navigateBack} />
                  )}
                          
                  {currentScreen === 'analysis' && (
  <AnalysisResults 
    dayNumber={currentDay}
    pathId={currentPath}
    prompt={getCurrentJourneyDay().prompt}
    theme={getCurrentJourneyDay().theme}
    imageUrl={journalImage}
    extractedText={extractedText}
    textOnly={!journalImage && !!extractedText}
    isMultiPage={navigation.screenData?.isMultiPage || false}
    additionalImages={navigation.screenData?.additionalImages || []}
    imageFiles={navigation.screenData?.imageFiles || null} // ADD THIS LINE
    onBack={navigateBack}
    onNext={() => {
      const nextDay = currentDay + 1;
      const pathMaxDays = currentPath === 'transformation-journey' ? 21 : 
                        currentPath === 'creative-expression' ? 14 :
                        currentPath === 'habit-formation' ? 30 :
                        currentPath === 'life-vision' ? 100 : 10;
      
      if (nextDay <= pathMaxDays) {
        navigateToScreen('daily', { day: nextDay, pathId: currentPath });
      } else {
        navigateToScreen('journey-complete', { pathId: currentPath });
      }
    }}
  />
)}
                
                  {currentScreen === 'journey-complete' && (
                    <JourneyCompletion 
                      onRestart={() => navigateToScreen('journey-preview')}
                      onViewDay={(day) => navigateToScreen('daily', { day })}
                    />
                  )}
                  
                  {currentScreen === 'settings' && (
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
                    <UserSettings 
                      onBack={navigateBack}
                      initialSection={settingsData.activeSection}
                      navigateToScreen={navigateToScreen}
                    />
<<<<<<< HEAD
                  </Suspense>
                )}
              </div>
            </main>

            {/* Floating Action Button */}
            {currentUser && !['welcome', 'signup', 'feedback', 'bug-report'].includes(currentScreen) && (
              <FloatingActionButton navigateToScreen={navigateToScreen} />
            )}
            
            {/* Bottom Navigation */}
            {currentUser && (
              (() => {
                const hideBottomNavScreens = [
                  'welcome', 
                  'signup', 
                  'feedback', 
                  'bug-report',
                  'loading',
                  'privacy-policy',
                  'terms-of-service',
                  'contact-us',
                  'about'
                ];
                
                const shouldShowBottomNav = !hideBottomNavScreens.includes(currentScreen);
                
                return shouldShowBottomNav ? (
                  <BottomNavigation 
                    currentScreen={currentScreen}
                    navigateToScreen={navigateToScreen}
                  />
                ) : null;
              })()
            )}
            
            {/* Footer */}
            {(currentScreen === 'welcome' || currentScreen === 'signup') && (
              <footer className="bg-gray-950 border-t border-gray-800 py-8">
                <div className="container mx-auto text-center text-gray-500 text-sm">
                  <p>© 2025 Καιρός. All rights reserved.</p>
                  <p className="mt-2">Empowering personal growth through mindful journaling and AI insights.</p>
                </div>
              </footer>
            )}
          </div>
=======
                  )}
                </div>
              </main>

              {currentUser && !['welcome', 'signup', 'feedback', 'bug-report'].includes(currentScreen) && (
                <FloatingActionButton navigateToScreen={navigateToScreen} />
              )}
              
              {/* Bottom Navigation - only show on authenticated screens */}
              {currentUser && currentScreen !== 'welcome' && currentScreen !== 'signup' && (
                <BottomNavigation 
                  currentScreen={currentScreen}
                  navigateToScreen={navigateToScreen}
                />
              )}
              
              {/* Only show footer on welcome screen */}
              {(currentScreen === 'welcome' || currentScreen === 'signup') && (
                <footer className="bg-gray-950 border-t border-gray-800 py-8">
                  <div className="container mx-auto text-center text-gray-500 text-sm">
                    <p>© 2025 Καιρός. All rights reserved.</p>
                    <p className="mt-2">Empowering personal growth through mindful journaling and AI insights.</p>
                  </div>
                </footer>
              )}
            </div>
           
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        )}
      </OfflineStatusProvider>
    </ThemeProvider>
  );
};

export default App;