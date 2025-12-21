// src/pages/HomeScreen.jsx - v5.1.0-alpha Production Release
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUserProgress } from '../hooks/useUserProgress';
import { useUserStatistics } from '../hooks/useUserStatistics';
import { getJourneyDay } from '../data/JourneyData';

// Import weather components
import WeatherWidget from '../components/weather/WeatherWidget';
import WeatherDialog from '../components/weather/WeatherDialog';
import '../styles/components/weather.css';
import '../styles/components/weatherDialog.css';

// Import VersionDisplay component
import VersionDisplay from '../components/common/VersionDisplay';

// Import Path Recommendations component
import PathRecommendations from '../components/paths/PathRecommendations';
import { getNextDayForPath } from '../utils/pathUtils';

// Import TopBar component
import TopBar from '../components/common/TopBar';

import { 
  ChevronRight, 
  BookOpen, 
  PenTool, 
  Calendar, 
  Bookmark, 
  ArrowRight, 
  Star, 
  Quote, 
  Sun, 
  Moon,
  BarChart2,
  Archive,
  Award,
  CheckCircle,
  ChevronDown,
  Settings,
  LayoutGrid,
  CheckSquare,
  ArrowUpRight,
  MapPin,
  X,
  Sparkles,
  TrendingUp,
  Target,
  Compass,
  Zap,
  FileText,
  Flame,
  Activity,
  Heart,
  Clock,
  Trophy
} from 'lucide-react';

import '../styles/components/homeScreen.css';
import DynamicIcon from '../components/common/DynamicIcon';

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyBrXIv6K7Uto7fwe8MuzgRM_79W5WXsRM8';

const loadGoogleMapsScript = (callback) => {
  if (window.google && window.google.maps) {
    callback();
    return;
  }
  
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onload = callback;
  script.onerror = () => console.error('Error loading Google Maps API');
  document.head.appendChild(script);

};

const scrollDown = () => {
    window.scrollTo({
      top: window.scrollY + 350,
      behavior: 'smooth'
    });
  };

// Enhanced curated quotes for inspiration
const inspirationalQuotes = [
  {
    text: "The unexamined life is not worth living.",
    author: "Socrates",
    theme: "self-reflection"
  },
  {
    text: "Know thyself.",
    author: "Ancient Greek Aphorism",
    theme: "self-discovery"
  },
  {
    text: "Life is a journey, not a destination.",
    author: "Ralph Waldo Emerson",
    theme: "growth"
  },
  {
    text: "Between stimulus and response there is a space. In that space is our power to choose our response.",
    author: "Viktor Frankl",
    theme: "mindfulness"
  },
  {
    text: "The cave you fear to enter holds the treasure you seek.",
    author: "Joseph Campbell",
    theme: "courage"
  },
  {
    text: "Your vision will become clear only when you can look into your own heart.",
    author: "Carl Jung",
    theme: "insight"
  },
  {
    text: "To know yourself, you must sacrifice the illusion that you already do.",
    author: "Vironika Tugaleva",
    theme: "honesty"
  },
  {
    text: "Don't compromise yourself. You're all you've got.",
    author: "Janis Joplin",
    theme: "authenticity"
  },
  {
    text: "He who has a why to live can bear almost any how.",
    author: "Friedrich Nietzsche",
    theme: "purpose"
  },
  {
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
    theme: "individuality"
  }
];

const ModernThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <button 
      className="hs-theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
    >
      {isDarkMode ? (
        <Moon className="hs-theme-icon" size={18} />
      ) : (
        <Sun className="hs-theme-icon" size={18} />
      )}
    </button>
  );
};

const HomeScreen = ({ navigateToScreen, currentDay = 1, currentPath = 'self-discovery' }) => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const { isDarkMode } = useTheme();
  
  // Use centralized statistics and progress hooks
  const { 
    statistics, 
    isLoading: statsLoading, 
    error: statsError 
  } = useUserStatistics();
  
  const {
    inProgressPaths,
    completedPaths,
    stats: progressStats,
    isLoading: progressLoading,
    getPathProgress,
    hasActiveJourneys,
    hasCompletedJourneys,
    hasAnyProgress
  } = useUserProgress();

  console.log('Debug - hasCompletedJourneys:', hasCompletedJourneys);
console.log('Debug - completedPaths:', completedPaths);
  
  const [currentDate] = useState(new Date());
  const [quote, setQuote] = useState(inspirationalQuotes[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Weather state
  const [weatherData, setWeatherData] = useState(null);
  const [showWeatherDialog, setShowWeatherDialog] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const locationInputRef = useRef(null);
  
  // Animation states
  const [isQuoteChanging, setIsQuoteChanging] = useState(false);
  
  // Set random quote on load
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
    setQuote(inspirationalQuotes[randomIndex]);
    
    setTimeout(() => setIsLoaded(true), 150);
  }, []);

  // Check if user has location and show prompt if needed
  useEffect(() => {
    if (userProfile && !userProfile.city && !showLocationPrompt) {
      setShowLocationPrompt(true);
    }
  }, [userProfile]);

  // Load Google Maps API when location prompt is shown
  useEffect(() => {
    if (showLocationPrompt) {
      loadGoogleMapsScript(() => {
        if (locationInputRef.current && window.google && window.google.maps) {
          try {
            const autocomplete = new window.google.maps.places.Autocomplete(locationInputRef.current, {
              types: ['(cities)'],
              fields: ['address_components', 'formatted_address', 'geometry', 'name']
            });
            
            autocomplete.addListener('place_changed', () => {
              const place = autocomplete.getPlace();
              if (place && place.address_components) {
                const cityComponent = place.address_components.find(
                  component => component.types.includes('locality')
                );
                
                if (cityComponent) {
                  setCityInput(cityComponent.long_name);
                } else {
                  setCityInput(place.formatted_address || place.name);
                }
              }
            });
          } catch (error) {
            console.error('Error initializing autocomplete:', error);
          }
        }
      });
    }
  }, [showLocationPrompt]);
  
  // Format date
  const formatDate = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return currentDate.toLocaleDateString(undefined, options);
  };
  
  const getGreeting = () => {
    const hour = currentDate.getHours();
    
    if (hour < 12) {
      return 'Good morning';
    } else if (hour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };
  
  // Handle saving user's city
  const handleSaveCity = async () => {
    if (!cityInput.trim()) return;
    
    setIsSavingLocation(true);
    try {
      await updateUserProfile({
        city: cityInput.trim()
      });
      setShowLocationPrompt(false);
    } catch (error) {
      console.error('Error saving city:', error);
    } finally {
      setIsSavingLocation(false);
    }
  };
  
  const handleSkipLocation = () => {
    setShowLocationPrompt(false);
  };

  // Get current path info using centralized progress
  // NOTE: This dynamically works with ALL paths in the JOURNEY_PATHS registry,
  // including new multi-modal paths (shadow-light-integration, life-chapters-trilogy, 
  // sensory-spectrum, emotion-color-sound). No hardcoded switch statements needed!
  const getCurrentPathInfo = () => {
    if (hasActiveJourneys && inProgressPaths.length > 0) {
      const mostAdvanced = inProgressPaths[0];
      return {
        pathId: mostAdvanced.id,
        pathName: mostAdvanced.title,
        nextDay: mostAdvanced.nextDay,
        completedDays: mostAdvanced.completedDaysList,
        pathMaxDays: mostAdvanced.totalDays,
        progressPercentage: mostAdvanced.percentage,
        isCompleted: mostAdvanced.isCompleted
      };
    }
    
    const pathProgress = getPathProgress(currentPath);
    if (pathProgress) {
      return {
        pathId: currentPath,
        pathName: pathProgress.title,
        nextDay: pathProgress.nextDay,
        completedDays: pathProgress.completedDaysList,
        pathMaxDays: pathProgress.totalDays,
        progressPercentage: pathProgress.percentage,
        isCompleted: pathProgress.isCompleted
      };
    }
    
    return {
      pathId: currentPath,
      pathName: 'Self-Discovery Journey',
      nextDay: 1,
      completedDays: [],
      pathMaxDays: 10,
      progressPercentage: 0,
      isCompleted: false
    };
  };

  const currentPathInfo = getCurrentPathInfo();
  const currentPrompt = getJourneyDay(currentPathInfo.nextDay, currentPathInfo.pathId);
  
  // Navigation functions
  const goToDailyView = (day, pathId = currentPathInfo.pathId) => {
    navigateToScreen('daily', { day, pathId });
  };
  
  const goToUpload = () => {
    navigateToScreen('upload', { day: currentPathInfo.nextDay, pathId: currentPathInfo.pathId });
  };

  const continueJourney = (pathId) => {
    const pathData = getPathProgress(pathId);
    if (pathData) {
      navigateToScreen('write', { day: pathData.nextDay, pathId });
    }
  };

  const goToSettings = () => {
    navigateToScreen('settings');
  };

  // Change quote with animation
  const changeQuote = () => {
    setIsQuoteChanging(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
      setQuote(inspirationalQuotes[randomIndex]);
      setIsQuoteChanging(false);
    }, 300);
  };
  
  // Enhanced stats component using centralized statistics
  // src/pages/HomeScreen.jsx - Updated StatsOverview Component
// Find the StatsOverview component and update the completed paths stat card

const StatsOverview = () => {
  if (!hasAnyProgress || statistics.totalEntries === 0) return null;
  
  return (
    <div className="hs-stats-overview">
      <div className="hs-stats-grid">
        <div 
          className="hs-stat-card hs-stat-clickable" 
          onClick={() => navigateToScreen('journal-archive')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigateToScreen('journal-archive');
            }
          }}
          aria-label={`View ${statistics.totalEntries} journal entries in archive`}
        >
          <div className="hs-stat-icon-wrapper">
            <FileText className="hs-stat-icon" />
          </div>
          <div className="hs-stat-content">
            <div className="hs-stat-number">
              {statsLoading ? (
                <div className="hs-stat-loading">...</div>
              ) : (
                statistics.totalEntries
              )}
            </div>
            <div className="hs-stat-label">Entries</div>
          </div>
          {/* Add hover indicator */}
          <div className="hs-stat-hover-indicator">
            <ChevronRight size={14} />
          </div>
        </div>
        
        {statistics.currentStreak > 0 && (
          <div className="hs-stat-card hs-stat-highlight">
            <div className="hs-stat-icon-wrapper hs-stat-icon-highlight">
              <Flame className="hs-stat-icon" />
            </div>
            <div className="hs-stat-content">
              <div className="hs-stat-number">{statistics.currentStreak}</div>
              <div className="hs-stat-label">Day Streak</div>
            </div>
          </div>
        )}
        
        {inProgressPaths.length > 0 && (
          <div className="hs-stat-card">
            <div className="hs-stat-icon-wrapper">
              <Activity className="hs-stat-icon" />
            </div>
            <div className="hs-stat-content">
              <div className="hs-stat-number">{inProgressPaths.length}</div>
              <div className="hs-stat-label">IN PROGRESS</div>
            </div>
          </div>
        )}
        
        {/* 🎯 UPDATED: Make completed journeys stat card clickable */}
        {completedPaths.length > 0 && (
          <div 
            className="hs-stat-card hs-stat-clickable hs-stat-highlight" 
            onClick={() => navigateToScreen('completed-paths')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigateToScreen('completed-paths');
              }
            }}
            aria-label={`View ${completedPaths.length} completed journeys`}
          >
            <div className="hs-stat-icon-wrapper hs-stat-icon-highlight">
              <Award className="hs-stat-icon" />
            </div>
            <div className="hs-stat-content">
              <div className="hs-stat-number">{completedPaths.length}</div>
              <div className="hs-stat-label">Complete</div>
            </div>
            {/* Optional: Add hover indicator */}
            <div className="hs-stat-hover-indicator">
              <ChevronRight size={14} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
  };
  const scrollDown = () => {
      window.scrollTo({
        top: window.scrollY + 350,
        behavior: 'smooth'
      });
    };
  
  // Render location prompt modal
  const renderLocationPrompt = () => (
    <div className="hs-location-overlay" onClick={handleSkipLocation}>
      <div className="hs-location-modal" onClick={(e) => e.stopPropagation()}>
        <div className="hs-location-header">
          <div className="hs-location-icon-wrapper">
            <MapPin className="hs-location-icon" />
          </div>
          <h2 className="hs-location-title">Add Your Location</h2>
          <p className="hs-location-subtitle">Get personalized weather insights for your journaling</p>
        </div>
        
        <div className="hs-location-form">
          <div className="hs-input-group">
            <div className="hs-input-wrapper">
              <MapPin className="hs-input-icon" size={20} />
              <input
                ref={locationInputRef}
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="hs-location-input"
                placeholder="Enter your city"
                autoComplete="off"
              />
              {cityInput && (
                <button 
                  className="hs-input-clear" 
                  onClick={() => setCityInput('')}
                  aria-label="Clear input"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <p className="hs-input-hint">
              We'll use this to show relevant weather information and seasonal journaling prompts
            </p>
          </div>
          
          <div className="hs-location-actions">
            <button
              onClick={handleSaveCity}
              disabled={isSavingLocation || !cityInput.trim()}
              className="hs-btn hs-btn-primary"
            >
              {isSavingLocation ? (
                <>
                  <div className="hs-spinner" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <MapPin size={18} />
                  <span>Save Location</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleSkipLocation}
              className="hs-btn hs-btn-secondary"
            >
              <span>Skip for Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Loading check
  if (progressLoading || statsLoading) {
    return (
      <div className={`hs-container ${isDarkMode ? 'hs-dark' : 'hs-light'}`}>
        <div className="hs-loading-container">
          <div className="hs-loading-spinner"></div>
          <p>Loading your journeys...</p>
        </div>
      </div>
    );
  }
  
  // Error handling for stats
  if (statsError) {
    console.warn('Statistics loading error:', statsError);
  }
  
  return (
    <div className={`hs-container ${isLoaded ? 'hs-loaded' : ''} ${isDarkMode ? 'hs-dark' : 'hs-light'}`}>
      {/* Top Bar */}
      <TopBar 
        title="Home"
        subtitle={formatDate()}
        colorClass="home-color"
        actions={
          <div className="hs-top-bar-actions">
            <WeatherWidget 
              city={userProfile?.city} 
              onWeatherData={setWeatherData}
              onClick={() => weatherData && setShowWeatherDialog(true)}
            />
            <ModernThemeToggle />
          </div>
        }
      />

      {/* Version Display Banner */}
      <div className="hs-version-banner">
        <VersionDisplay minimal={true} />
      </div>

      {/* Enhanced Header */}
      <header className="hs-header">
        <div className="hs-header-content">
          <div className="hs-header-main">
            <h1 className="hs-greeting">
              {getGreeting()}, <span className="hs-username">{userProfile?.displayName?.split(' ')[0] || 'there'}</span>
              <div className="hs-greeting-emoji">
                {getGreeting() === 'Good morning' ? '🌅' : 
                 getGreeting() === 'Good afternoon' ? '☀️' : '🌙'}
              </div>
            </h1>
          </div>
        </div>
        
        {/* Enhanced Stats Overview */}
        <StatsOverview />
      </header>
      
      {/* Journey Progress Section */}
      <section className="hs-section hs-journeys-section">
        <div className="hs-section-header">
          <h2 className="hs-section-title">
            <TrendingUp className="hs-section-icon" />
            Your Journeys
          </h2>
          <button
            className="hs-view-all-btn"
            onClick={() => navigateToScreen('path-selection')}
            aria-label="View all journeys"
          >
            <span>View All</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* In-Progress Journeys */}
        {hasActiveJourneys && (
          <div className="hs-journey-category">
            <h3 className="hs-category-title">
              <Target className="hs-category-icon" />
              In Progress ({inProgressPaths.length})
            </h3>
            <div className="hs-journeys-grid">
              {inProgressPaths.map((path, index) => (
                <div 
                  className={`hs-journey-card hs-journey-${path.id}`} 
                  key={`${path.id}-${index}`}
                  onClick={() => continueJourney(path.id)}
                  style={{
                    '--path-color': path.color,
                    '--path-color-rgb': path.color
                  }}
                >
                  <div className="hs-journey-header">
                    <div 
                      className="hs-journey-icon-wrapper"
                      style={{ 
                        backgroundColor: `rgba(${path.color}, 0.15)`,
                        color: `rgb(${path.color})` 
                      }}
                    >
                      <DynamicIcon name={path.iconName} className="hs-journey-icon" />
                    </div>
                    <div className="hs-journey-meta">
                      <span className="hs-journey-day">Day {path.nextDay} of {path.totalDays}</span>
                    </div>
                  </div>
                  <h4 className="hs-journey-title">{path.title}</h4>
                  
                  <div className="hs-progress-bar">
                    <div 
                      className="hs-progress-fill" 
                      style={{ 
                        width: `${path.percentage}%`,
                        backgroundColor: `rgb(${path.color})`,
                        boxShadow: `0 0 8px rgba(${path.color}, 0.4)`
                      }}
                    />
                  </div>
                  
                  <div className="hs-journey-footer">
                    <span className="hs-progress-text">{path.percentage}% complete</span>
                    <button className="hs-continue-btn">
                      <span>Continue</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI-Powered Path Recommendations */}
        {userProfile && (
          <PathRecommendations 
            onPathSelect={(path) => {
              console.log('Selected recommended path:', path.id);
              const nextDay = getNextDayForPath(userProfile, path.id);
              navigateToScreen('write', { pathId: path.id, day: nextDay });
            }}
            maxRecommendations={3}
          />
        )}

        {/* Completed Journeys */}
        {hasCompletedJourneys && (
          <div className="hs-journey-category">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 className="hs-category-title">
                <CheckSquare className="hs-category-icon" />
                Completed ({completedPaths.length})
              </h3>
              <button
                className="hs-view-all-btn"
                onClick={() => navigateToScreen('completed-paths')}
                aria-label="View all completed journeys"
              >
                <span>View All</span>
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="hs-journeys-grid">
              {completedPaths.slice(0, 3).map((path, index) => (
                <div 
                  className={`hs-journey-card hs-journey-completed hs-journey-${path.id}`} 
                  key={`completed-${path.id}-${index}`}
                  onClick={() => navigateToScreen('journey-complete', { pathId: path.id })}
                  style={{
                    '--path-color': path.color,
                    '--path-color-rgb': path.color
                  }}
                >
                  <div className="hs-journey-header">
                    <div 
                      className="hs-journey-icon-wrapper"
                      style={{ 
                        backgroundColor: `rgba(${path.color}, 0.15)`,
                        color: `rgb(${path.color})` 
                      }}
                    >
                      <DynamicIcon name={path.iconName} className="hs-journey-icon" />
                    </div>
                    <div className="hs-journey-badge">
                      <CheckCircle size={14} />
                      <span>Completed</span>
                    </div>
                  </div>
                  <h4 className="hs-journey-title">{path.title}</h4>
                  
                  <div className="hs-progress-bar">
                    <div 
                      className="hs-progress-fill" 
                      style={{ 
                        width: '100%',
                        backgroundColor: `rgb(${path.color})`,
                        boxShadow: `0 0 8px rgba(${path.color}, 0.4)`
                      }}
                    />
                  </div>
                  
                  <div className="hs-journey-footer">
                    <span className="hs-progress-text">{path.totalDays} days completed</span>
                    <button className="hs-view-btn">
                      <span>View</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Journeys Started */}
        {!hasAnyProgress && (
          <div className="hs-no-journeys">
            <div className="hs-no-journeys-icon">
              <Compass size={64} />
            </div>
            <h3 className="hs-no-journeys-title">Ready to Begin?</h3>
            <p className="hs-no-journeys-text">Start your journaling adventure by choosing a path that speaks to you</p>
            <button 
              className="hs-explore-btn"
              onClick={() => navigateToScreen('path-selection')}
            >
              <Sparkles size={18} />
              <span>Explore Paths</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </section>
      
      {/* Today's Prompt Section */}
      {hasAnyProgress && (
        <section className="hs-section hs-prompt-section">
          <div className="hs-section-header">
            <h2 className="hs-section-title">
              {currentPathInfo.isCompleted ? (
                <>
                  <Award className="hs-section-icon" />
                  Journey Complete!
                </>
              ) : (
                <>
                  <PenTool className="hs-section-icon" />
                  Today's Reflection
                </>
              )}
            </h2>
            <div className="hs-prompt-day-badge">
              {currentPathInfo.isCompleted ? (
                <div className="hs-completed-badge">
                  <CheckCircle size={16} />
                  <span>Complete</span>
                </div>
              ) : (
                <span>Day {currentPathInfo.nextDay}</span>
              )}
            </div>
          </div>
          
          {currentPathInfo.isCompleted ? (
            <div className="hs-prompt-card hs-journey-complete-card">
              <div className="hs-complete-celebration">
                <div className="hs-complete-icon">
                  <Award className="hs-award-icon" />
                  <div className="hs-award-glow" />
                </div>
                <h3 className="hs-complete-title">Congratulations!</h3>
                <p className="hs-complete-text">
                  You've completed all {currentPathInfo.pathMaxDays} days of the {currentPathInfo.pathName}. 
                  View your journey summary or explore another path.
                </p>
              </div>
              
              <div className="hs-prompt-actions">
                <button 
                  className="hs-action-btn hs-action-primary"
                  onClick={() => navigateToScreen('journey-complete', { pathId: currentPathInfo.pathId })}
                >
                  <Star size={18} />
                  <span>View Summary</span>
                </button>
                
                <button 
                  className="hs-action-btn hs-action-secondary"
                  onClick={() => navigateToScreen('path-selection')}
                >
                  <Calendar size={18} />
                  <span>New Journey</span>
                </button>
              </div>
            </div>
          ) : (
            <div className={`hs-prompt-card hs-prompt-${currentPathInfo.pathId}`}>
              <div className="hs-prompt-theme">
                <Bookmark className="hs-theme-icon" />
                <span className="hs-theme-text">{currentPrompt?.theme || 'Reflection'}</span>
              </div>
              
              <h3 className="hs-prompt-title">{currentPrompt?.title || `Day ${currentPathInfo.nextDay}`}</h3>
              <p className="hs-prompt-text">{currentPrompt?.prompt || 'Take a moment to reflect on your journey so far.'}</p>
              
              <div className="hs-prompt-actions">
                <button 
                  className={`hs-action-btn hs-action-primary hs-pulse-btn hs-action-${currentPathInfo.pathId}`}
                  onClick={() => goToUpload()}
                >
                  <Zap size={18} />
                  <span>Journal Now</span>
                </button>
                
                <button 
                  className="hs-action-btn hs-action-secondary"
                  onClick={() => goToDailyView(currentPathInfo.nextDay)}
                >
                  <BookOpen size={18} />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          )}
        </section>
      )}
      
      {/* Quick Actions Section */}
      <section className="hs-section hs-actions-section">
        <div className="hs-section-header">
          <h2 className="hs-section-title">
            <LayoutGrid className="hs-section-icon" />
            Quick Actions
          </h2>
        </div>
        
        <div className="hs-actions-grid">          
          <button 
            className="hs-action-card"
            onClick={() => navigateToScreen('journal-archive')}
          >
            <div className="hs-action-icon-wrapper">
              <Archive className="hs-action-icon" />
            </div>
            <span className="hs-action-label">Archive</span>
            <ChevronRight className="hs-action-chevron" />
          </button>

          <button 
            className="hs-action-card"
            onClick={() => navigateToScreen('analytics-dashboard')}
          >
            <div className="hs-action-icon-wrapper">
              <BarChart2 className="hs-action-icon" />
            </div>
            <span className="hs-action-label">Analytics</span>
            <ChevronRight className="hs-action-chevron" />
          </button>
          
          <button 
            className="hs-action-card"
            onClick={() => navigateToScreen('path-selection')}
          >
            <div className="hs-action-icon-wrapper">
              <Compass className="hs-action-icon" />
            </div>
            <span className="hs-action-label">Journeys</span>
            <ChevronRight className="hs-action-chevron" />
          </button>

          {hasCompletedJourneys && (
            <button 
              className="hs-action-card"
              onClick={() => navigateToScreen('completed-paths')}
            >
              <div className="hs-action-icon-wrapper">
                <Trophy className="hs-action-icon" />
              </div>
              <span className="hs-action-label">Completed</span>
              <ChevronRight className="hs-action-chevron" />
            </button>
          )}

          <button 
            className="hs-action-card"
            onClick={goToSettings}
          >
            <div className="hs-action-icon-wrapper">
              <Settings className="hs-action-icon" />
            </div>
            <span className="hs-action-label">Settings</span>
            <ChevronRight className="hs-action-chevron" />
          </button>
          
          {hasCompletedJourneys && (
            <button 
              className="hs-action-card hs-action-highlight"
              onClick={() => navigateToScreen('completed-paths')}
            >
              <div className="hs-action-icon-wrapper hs-action-icon-highlight">
                <Award className="hs-action-icon" />
              </div>
              <span className="hs-action-label">Achievements</span>
              <ChevronRight className="hs-action-chevron" />
            </button>
          )}

          {!userProfile?.city && (
            <button 
              className="hs-action-card hs-action-highlight"
              onClick={() => setShowLocationPrompt(true)}
            >
              <div className="hs-action-icon-wrapper hs-action-icon-highlight">
                <MapPin className="hs-action-icon" />
              </div>
              <span className="hs-action-label">Add Location</span>
              <ChevronRight className="hs-action-chevron" />
            </button>
          )}
        </div>
      </section>
      
      {/* Enhanced Analytics Preview Section */}
      {hasAnyProgress && statistics.totalEntries >= 3 && (
        <section className="hs-section hs-analytics-preview-section">
          <div className="hs-section-header">
            <h2 className="hs-section-title">
              <BarChart2 className="hs-section-icon" />
              Journal Insights
            </h2>
            <button
              className="hs-view-all-btn"
              onClick={() => navigateToScreen('analytics-dashboard')}
              aria-label="View full analytics"
            >
              <span>View Full Analytics</span>
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="hs-analytics-preview-grid">
            <div className="hs-analytics-preview-card">
              <div className="hs-analytics-preview-header">
                <FileText className="hs-analytics-preview-icon" />
                <h4>Total Entries</h4>
              </div>
              <div className="hs-analytics-preview-value">{statistics.totalEntries}</div>
              <div className="hs-analytics-preview-subtext">journal entries analyzed</div>
            </div>
            
            <div className="hs-analytics-preview-card">
              <div className="hs-analytics-preview-header">
                <Flame className="hs-analytics-preview-icon" />
                <h4>Current Streak</h4>
              </div>
              <div className="hs-analytics-preview-value">{statistics.currentStreak}</div>
              <div className="hs-analytics-preview-subtext">consecutive days</div>
            </div>
            
            <div className="hs-analytics-preview-card">
              <div className="hs-analytics-preview-header">
                <Activity className="hs-analytics-preview-icon" />
                <h4>Active Journeys</h4>
              </div>
              <div className="hs-analytics-preview-value">{inProgressPaths.length}</div>
              <div className="hs-analytics-preview-subtext">paths in progress</div>
            </div>
            
            <div className="hs-analytics-preview-card">
              <div className="hs-analytics-preview-header">
                <Award className="hs-analytics-preview-icon" />
                <h4>Completed</h4>
              </div>
              <div className="hs-analytics-preview-value">{completedPaths.length}</div>
              <div className="hs-analytics-preview-subtext">journeys finished</div>
            </div>
          </div>
          
          <div className="hs-analytics-cta">
            <p className="hs-analytics-cta-text">
              Discover patterns in your {statistics.totalEntries} journal entries and unlock deeper insights about your growth journey.
            </p>
            <button 
              className="hs-analytics-cta-btn"
              onClick={() => navigateToScreen('analytics-dashboard')}
            >
              <BarChart2 size={18} />
              <span>Explore Your Analytics</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}
      
      {/* Enhanced Inspirational Quote Section */}
      <section className="hs-section hs-quote-section">
        <div className="hs-quote-card" onClick={changeQuote}>
          <div className="hs-quote-theme-badge">
            <Heart size={14} />
            <span>{quote.theme}</span>
          </div>
          <Quote className="hs-quote-icon" />
          <div className={`hs-quote-content ${isQuoteChanging ? 'hs-quote-changing' : ''}`}>
            <p className="hs-quote-text">"{quote.text}"</p>
            <p className="hs-quote-author">— {quote.author}</p>
          </div>
          <div className="hs-quote-tap-hint">
            <Sparkles size={14} />
            <span>Tap for new quote</span>
          </div>
        </div>
      </section>
      
      {/* Scroll Indicator for Longer Content */}
      <button 
  className="hs-scroll-indicator"
  onClick={() => {
    window.scrollTo({
      top: window.scrollY + 350,
      behavior: 'smooth'
    });
  }}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.scrollTo({
        top: window.scrollY + 350,
        behavior: 'smooth'
      });
    }
  }}
  aria-label="Scroll down to see more content"
  title="Scroll down"
  type="button"
>
  <ChevronDown className="hs-scroll-icon" />
</button>

      {/* Weather Dialog */}
      {showWeatherDialog && weatherData && (
        <WeatherDialog 
          weather={weatherData} 
          onClose={() => setShowWeatherDialog(false)} 
        />
      )}

      {/* Location Prompt Dialog */}
      {showLocationPrompt && renderLocationPrompt()}
    </div>
  );
};

export default HomeScreen;