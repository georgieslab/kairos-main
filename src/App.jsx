// src/App.jsx - v5.1.0-alpha - Complete Production Ready Version
import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './contexts/AuthContext';
import { useFirestoreConnection } from './hooks/useFirestoreConnection';
import { ThemeProvider } from './contexts/ThemeContext';
import { useNavigation } from './contexts/NavigationContext';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { StatusBar, Style } from '@capacitor/status-bar';

// NFC Integration
import { useNFCQuickUpload } from './hooks/useNFC';
import JournalRegistration from './components/journal/JournalRegistration';

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
import useNFCQuickAccess from './hooks/useNFCQuickAccess';


// Core Components
import WelcomeScreen from './pages/WelcomeScreen';
import SignUpScreen from './components/auth/SignUpScreen';
import UserProfile from './components/auth/UserProfile';
import JourneyPreview from './components/journey/JourneyPreview';
import DailyJourneyView from './components/journey/DailyJourneyView';
import VoiceJournalUpload from './components/voice/VoiceJournalUpload';
import JournalUpload from './components/journey/JournalUpload';
import JourneyCompletion from './components/journey/JourneyCompletion';
import Header from './components/layout/Header';
import BottomNavigation from './components/layout/BottomNavigation';
import HomeScreen from './pages/HomeScreen';
import ProfileScreen from './pages/ProfileScreen';
import WriteTab from './components/journey/WriteTab';
import KairosLoader from './components/common/KairosLoader';
import AmbientBackground from './components/common/AmbientBackground';
import AnalyticsSkeleton from './components/analytics/AnalyticsSkeleton';

// Static Pages
import PrivacyPolicy from './pages/Privacy';
import TermsOfService from './pages/Terms';
import ContactUs from './pages/Contact';
import About from './pages/About';

// Lazy Loaded Components
const PathSelection = lazy(() => import('./components/paths/PathSelection'));
const JournalAnalyticsDashboard = lazy(() => import('./pages/JournalAnalyticsDashboard'));
const JournalArchive = lazy(() => import('./components/journal/JournalArchive'));
const AnalysisResults = lazy(() => import('./components/journey/AnalysisResults'));
const UserSettings = lazy(() => import('./components/settings/UserSettings'));
const CompletedPathsScreen = lazy(() => import('./pages/CompletedPathsScreen'));

// Data and Utils
import { getJourneyDay, getJourneyPath } from './data/JourneyData';
import {
  getProgressFieldForPath,
  getAllActiveJourneys,
  getNextDayForPath,
  getMostRecentActivePathId,
  updateCurrentPath
} from './utils/pathUtils';
import { isFlexPath } from './utils/pathTypeUtils';

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
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl
    });
    return image.dataUrl;
  }
};

// Main App Component
const App = () => {
  const { t } = useTranslation('common');
  const { currentUser, userProfile, logout, loading, refreshUserProfile } = useAuth();
  const navigation = useNavigation();
  const firestoreState = useFirestoreConnection();
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
  
  // Journey Completion Hook
  const { 
    navigateWithCompletionCheck, 
    hasJourneyBeenRecentlyViewed,
    completedJourneys,
    isJourneyCompleted 
  } = useJourneyCompletion(currentPath, navigateToScreen);
  
  // NFC Quick Access Hook - handles NFC taps when app opens
  useNFCQuickAccess({
    enableQuickUpload: true,
    enableContextAware: true,
    onTagDetected: (nfcData) => {
      console.log('📱 NFC tag detected in app:', nfcData);
      // Could show a toast notification here
    }
  });
  
  // Local State
  const [pendingUploads, setPendingUploads] = useState([]);
  const [settingsData, setSettingsData] = useState({ activeSection: 'profile' });
  const [previousScreen, setPreviousScreen] = useState(null);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [isBackNavigation, setIsBackNavigation] = useState(false);
  const [isTabNavigation, setIsTabNavigation] = useState(false);
  const pageRef = useRef(null);
  
  // NFC Registration State
  const [showRegistration, setShowRegistration] = useState(false);

  // NFC Quick Upload - Auto-detect journal taps
  const nfcQuickUpload = useNFCQuickUpload((journalData) => {
    console.log('📖 Journal scanned via NFC:', journalData.journalId);
    
    // Check if journal is registered to this user
    if (userProfile?.journals?.includes(journalData.journalId)) {
      // Journal is registered - navigate to upload screen
      console.log('✅ Journal registered, navigating to upload...');
      // Flex paths (choose write/speak/draw per day) need the WriteTab picker
      // first — jumping straight to 'upload' silently defaults to the draw
      // flow and skips voice/write entirely.
      if (isFlexPath(currentPath)) {
        navigateToScreen('write', {
          pathId: currentPath,
          day: currentDay,
          journalId: journalData.journalId,
          fromNFC: true
        });
      } else {
        navigateToScreen('upload', {
          journalId: journalData.journalId,
          fromNFC: true
        });
      }
    } else {
      // Journal not registered - show registration modal
      console.log('📝 Journal not registered, showing registration modal...');
      setShowRegistration(true);
    }
  });

  // Development Mode Setup
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem('devPremium', 'false');
    }
  }, []);

  // NFC Quick Upload Listener - Start when user is logged in
  useEffect(() => {
    if (currentUser && userProfile) {
      console.log('🔷 Starting NFC quick upload listener...');
      nfcQuickUpload.startListening();
    }
    
    // Cleanup on unmount or logout
    return () => {
      if (nfcQuickUpload.isListening) {
        console.log('🔷 Stopping NFC quick upload listener...');
        nfcQuickUpload.stopListening();
      }
    };
  }, [currentUser, userProfile]);

  // Logout handler with navigation
  const handleLogout = async () => {
    console.log('👋 Logging out and navigating to welcome screen...');
    await logout();
    navigateToScreen('welcome');
  };

  // Configure StatusBar for Android
  useEffect(() => {
    const setupStatusBar = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await StatusBar.setOverlaysWebView({ overlay: true });
          await StatusBar.hide();
        } catch (error) {
          console.error('Error configuring StatusBar:', error);
        }
      }
    };
    
    setupStatusBar();
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
      console.log('🔄 Showing loader for loading screen');
      showLoader({ 
        size: 'large', 
        fullScreen: true
      });
    }
  }, [showLoader, currentScreen]);
  
  useEffect(() => {
    console.log('🔍 Auth state update:', {
      loading,
      currentScreen,
      hasCurrentUser: !!currentUser,
      hasUserProfile: !!userProfile
    });

    if (loading) {
      console.log('⏳ Still loading auth state, showing loading screen');
      navigateToScreen('loading');
      return;
    }
    
    if (currentScreen === 'loading') {
      const handleInitialLoad = async () => {
        console.log('🚀 Starting initial load handler');
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (!currentUser) {
          console.log('👤 No user found, navigating to welcome screen');
          // Clear persisted navigation context when no user is logged in
          console.log('🧹 Clearing persisted navigation context (no user)');
          localStorage.removeItem('kairosContext');
          navigateToScreen('welcome');
          return;
        } 
        
        if (!userProfile) {
          console.log('⚠️ No user profile found, waiting...');
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

  // Reset Scroll Position — also reset element scrollers directly: on browsers
  // without overflow-x:clip support, body falls back to being the scroll
  // container and window.scrollTo alone doesn't reach it.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentScreen]);

  // Get Current Journey Day
  const getCurrentJourneyDay = () => {
    const safePath = currentPath || 'self-discovery';
    
    try {
      const journeyData = getJourneyDay(currentDay, safePath);
      
      if (!journeyData) {
        return {
          day: currentDay,
          title: t('journeyDayFallback.title', 'Day {{day}}', { day: currentDay }),
          theme: t('journeyDayFallback.theme', 'Reflection'),
          prompt: t('journeyDayFallback.prompt', 'What are you thinking and feeling today?')
        };
      }

      return journeyData;
    } catch (error) {
      return {
        day: currentDay,
        title: t('journeyDayFallback.title', 'Day {{day}}', { day: currentDay }),
        theme: t('journeyDayFallback.theme', 'Reflection'),
        prompt: t('journeyDayFallback.prompt', 'What are you thinking and feeling today?')
      };
    }
  };

  // Handle Journal Upload
  const handleJournalUpload = async (imageUrl, extractedText, pathId, isTextOnly, isMultiPage, additionalImages, imageFiles, voiceData) => {
    if (!currentUser) {
      return;
    }

    try {
      showLoader({
        size: 'medium',
        message: voiceData ? 'Analyzing your voice journal...' : 'Analyzing your journal...',
        showQuote: true
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

        // Refresh the in-memory profile so Home/Paths/Profile reflect the new
        // progress without needing a manual reload (userProfile is a one-time
        // getDoc snapshot, not a live listener).
        await refreshUserProfile();

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

        // Refresh the in-memory profile so Home/Paths/Profile reflect the new
        // progress without needing a manual reload.
        await refreshUserProfile();

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
        ? t('errors.voiceAnalysisFailed', 'Failed to analyze voice journal. Please try again.')
        : t('errors.analysisFailed', 'Failed to analyze journal entry. Please try again.');
        
      alert(errorMessage);
      navigateBack();
    } finally {
      hideLoader();
    }
  };

  // Render Application
  return (
    <ThemeProvider>
      <OfflineStatusProvider>
        {({ isOnline }) => {
          // 🤖 ANDROID FIX: On mobile, be more lenient with connectivity checks
          const isMobile = Capacitor.isNativePlatform();
          const showOfflineWarning = !isMobile 
            ? (!isOnline || !firestoreState.isConnected) 
            : (!isOnline && !firestoreState.isConnected); // Both must be false on mobile
          
          return (
          <div className="min-h-screen bg-gray-950 text-white flex flex-col">
            <AmbientBackground />
            {/* Global Loader */}
            {isLoading && <KairosLoader {...loaderProps} isFading={loaderProps.isFading} />}
            
            {/* Network Status Indicators - More lenient on mobile */}
            {showOfflineWarning && (
              <div className={`text-center py-1 text-sm ${
                !isOnline ? 'bg-yellow-700 text-yellow-100' : 
                !firestoreState.isConnected ? 'bg-orange-700 text-orange-100' : ''
              }`}>
                {!isOnline ? (
                  t('offlineWarning')
                ) : !firestoreState.isConnected ? (
                  t('reconnecting')
                ) : null}
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
                    onStart={() => navigateToScreen('signup', { authMode: 'signin' })}
                    onNavigate={(screen) => navigateToScreen(screen)}
                  />
                )}

                {/* Authentication Screens */}
                {currentScreen === 'signup' && (
                  <SignUpScreen
                    onNext={() => {
                      console.log('🔄 SignUpScreen onNext triggered, navigating to home screen...');
                      navigateToScreen('home', {}, { skipCompletionCheck: true });
                    }}
                    onBack={() => navigateToScreen('welcome')}
                    navigateToScreen={navigateToScreen}
                    initialMode={screenData?.authMode || 'signin'}
                  />
                )}
                
                {currentScreen === 'profile' && (
                  <ProfileScreen 
                    handleSignOut={handleLogout}
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
                          skipCompletionCheck: true
                        });
                      }}
                      navigateToScreen={navigateToScreen}
                      currentPath={currentPath}
                      currentDay={currentDay}
                    />
                  </Suspense>
                )}

                {/* Writing Interface */}
                {currentScreen === 'write' && (
                  <WriteTab
                    currentPath={screenData?.pathId || getMostRecentActivePathId(userProfile) || currentPath}
                    currentDay={screenData?.day}
                    navigateToScreen={navigateToScreen}
                  />
                )}
                        
                {/* Daily Journey View */}
                {currentScreen === 'daily' && (
                  <DailyJourneyView
                    currentDay={screenData?.day || currentDay}
                    pathId={screenData?.pathId || currentPath}
                    onUpload={(pathId) => {
                      const targetPath = pathId || screenData?.pathId || currentPath;
                      const targetDay = screenData?.day || currentDay;
                      const p = getJourneyPath(targetPath);
                      if (p?.isVoiceJourney) {
                        navigateToScreen('voice-upload', {
                          pathId: targetPath,
                          day: targetDay,
                          prompt: getCurrentJourneyDay().prompt,
                          theme: getCurrentJourneyDay().theme
                        });
                      } else if (isFlexPath(targetPath)) {
                        // Flex paths need the WriteTab write/speak/draw picker —
                        // going straight to 'upload' has no flexMode to pass and
                        // silently defaults to the draw (visual) instructions.
                        navigateToScreen('write', {
                          pathId: targetPath,
                          day: targetDay
                        });
                      } else {
                        navigateToScreen('upload', {
                          pathId: targetPath,
                          day: targetDay
                        });
                      }
                    }}
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
                  <Suspense fallback={<AnalyticsSkeleton />}>
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
                    flexMode={screenData?.flexMode || null}
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
                    <UserSettings 
                      onBack={navigateBack}
                      initialSection={settingsData.activeSection}
                      navigateToScreen={navigateToScreen}
                    />
                  </Suspense>
                )}
              </div>
            </main>

            {/* Floating Action Button removed per UX request */}
            
            {/* Bottom Navigation */}
            {currentUser && (
              (() => {
                const hideBottomNavScreens = [
                  'welcome',
                  'signup',
                  'privacy-policy',
                  'terms-of-service',
                  'contact-us',
                  'about',
                  'upload',        // Journal/Artwork upload — focused capture flow
                  'voice-upload',  // Voice journal — focused capture flow
                  'analysis'       // Analysis — has its own back/tab nav
                ];

                // Nav stays visible during loading states so users can always
                // jump elsewhere (changed by request; it was hidden before).
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
                  <p>{t('footerRights')}</p>
                  <p className="mt-2">{t('footerTagline')}</p>
                </div>
              </footer>
            )}

            {/* NFC Journal Registration Modal */}
            {currentUser && (
              <JournalRegistration
                isOpen={showRegistration}
                onClose={() => setShowRegistration(false)}
                onComplete={(journalData) => {
                  console.log('✅ Journal registration complete:', journalData);
                  setShowRegistration(false);

                  // Flex paths need the WriteTab picker first (see NFC handler
                  // above for why going straight to 'upload' is wrong here).
                  if (isFlexPath(currentPath)) {
                    navigateToScreen('write', {
                      pathId: currentPath,
                      day: currentDay,
                      journalId: journalData.journalId,
                      fromNFC: true,
                      newlyRegistered: true
                    });
                  } else {
                    // Navigate to upload screen with new journal
                    navigateToScreen('upload', {
                      journalId: journalData.journalId,
                      fromNFC: true,
                      newlyRegistered: true
                    });
                  }
                }}
              />
            )}
          </div>
          );
        }}
      </OfflineStatusProvider>
    </ThemeProvider>
  );
};

export default App;