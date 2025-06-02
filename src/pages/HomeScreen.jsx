// src/pages/HomeScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getJourneyDay, getAllJourneyPaths, getJourneyPath } from '../data/JourneyData';
import { 
  getNextDayForPath, 
  getUserPathProgress
} from '../utils/userProgress';
import { useTheme } from '../contexts/ThemeContext';

// Import weather components
import WeatherWidget from '../components/weather/WeatherWidget';
import WeatherDialog from '../components/weather/WeatherDialog';
import '../styles/components/weather.css';
import '../styles/components/weatherDialog.css';

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
  Zap
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
  script.onload = () => {
    console.log('Google Maps API loaded for HomeScreen');
    callback();
  };
  script.onerror = () => console.error('Error loading Google Maps API');
  document.head.appendChild(script);
};

// Curated quotes for inspiration
const inspirationalQuotes = [
  {
    text: "The unexamined life is not worth living.",
    author: "Socrates"
  },
  {
    text: "Know thyself.",
    author: "Ancient Greek Aphorism"
  },
  {
    text: "Life is a journey, not a destination.",
    author: "Ralph Waldo Emerson"
  },
  {
    text: "Between stimulus and response there is a space. In that space is our power to choose our response.",
    author: "Viktor Frankl"
  },
  {
    text: "The cave you fear to enter holds the treasure you seek.",
    author: "Joseph Campbell"
  },
  {
    text: "Your vision will become clear only when you can look into your own heart.",
    author: "Carl Jung"
  },
  {
    text: "To know yourself, you must sacrifice the illusion that you already do.",
    author: "Vironika Tugaleva"
  },
  {
    text: "Don't compromise yourself. You're all you've got.",
    author: "Janis Joplin"
  },
  {
    text: "He who has a why to live can bear almost any how.",
    author: "Friedrich Nietzsche"
  },
  {
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde"
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
      <div className="hs-theme-toggle-track">
        <div className={`hs-theme-toggle-thumb ${isDarkMode ? 'hs-theme-toggle-thumb-dark' : 'hs-theme-toggle-thumb-light'}`}>
          {isDarkMode ? (
            <Moon className="hs-theme-icon" size={14} />
          ) : (
            <Sun className="hs-theme-icon" size={14} />
          )}
        </div>
      </div>
    </button>
  );
};

const HomeScreen = ({ navigateToScreen, currentDay = 1, currentPath = 'self-discovery' }) => {
  const { userProfile, updateUserProfile } = useAuth();
  const { isDarkMode } = useTheme();
  const [currentDate] = useState(new Date());
  const [quote, setQuote] = useState(inspirationalQuotes[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [completedPaths, setCompletedPaths] = useState([]);
  const [inProgressPaths, setInProgressPaths] = useState([]);
  
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
  }, [showLocationPrompt, locationInputRef.current]);

  // Load user's path progress
  useEffect(() => {
    if (userProfile) {
      const allPaths = getAllJourneyPaths();
      const completed = [];
      const inProgress = [];
      
      Object.values(allPaths).forEach(path => {
        const pathProgress = getUserPathProgress(userProfile, path.id);
        const completedDays = pathProgress?.completedDays || [];
        
        if (completedDays.length > 0) {
          const percentage = Math.round((completedDays.length / path.duration) * 100);
          const nextDay = getNextDayForPath(userProfile, path.id);
          
          const pathData = {
            id: path.id,
            title: path.title,
            iconName: path.iconName,
            color: path.color,
            completedDays: completedDays.length,
            totalDays: path.duration,
            percentage,
            nextDay
          };
          
          if (completedDays.length >= path.duration) {
            completed.push(pathData);
          } else {
            inProgress.push(pathData);
          }
        }
      });
      
      inProgress.sort((a, b) => b.percentage - a.percentage);
      completed.sort((a, b) => b.completedDays - a.completedDays);
      
      setCompletedPaths(completed);
      setInProgressPaths(inProgress);
    }
  }, [userProfile]);
  
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
  
  // Get path progress
  const getPathProgress = () => {
    try {
      const pathData = getJourneyPath(currentPath);
      
      if (!pathData) {
        return {
          completedDays: [],
          progressPercentage: 0,
          pathName: 'Unknown Journey',
          pathMaxDays: 10
        };
      }
      
      const pathProgress = getUserPathProgress(userProfile, currentPath);
      
      if (!pathProgress) {
        return {
          completedDays: [],
          progressPercentage: 0,
          pathName: pathData.title,
          pathMaxDays: pathData.duration
        };
      }
      
      const completedDays = pathProgress.completedDays || [];
      const progressPercentage = Math.round((completedDays.length / pathData.duration) * 100);
      
      return {
        completedDays,
        progressPercentage,
        pathName: pathData.title,
        pathMaxDays: pathData.duration
      };
    } catch (error) {
      console.error('Error getting path progress:', error);
      return {
        completedDays: [],
        progressPercentage: 0,
        pathName: 'Journey',
        pathMaxDays: 10
      };
    }
  };

  const { completedDays, progressPercentage, pathName, pathMaxDays } = getPathProgress();
  
  // Determine next day
  const getNextDay = () => {
    if (userProfile && userProfile.journeyProgress) {
      return getNextDayForPath(userProfile, currentPath);
    }
    
    if (!completedDays || completedDays.length === 0) return 1;
    if (completedDays.length >= pathMaxDays) return pathMaxDays;
    
    const sortedCompletedDays = [...completedDays].sort((a, b) => a - b);
    
    for (let day = 1; day <= pathMaxDays; day++) {
      if (!sortedCompletedDays.includes(day)) {
        return day;
      }
    }
    
    return Math.min(sortedCompletedDays[sortedCompletedDays.length - 1] + 1, pathMaxDays);
  };
  
  const nextDay = getNextDay();
  const currentPrompt = getJourneyDay(nextDay, currentPath);
  const isJourneyComplete = completedDays.length >= pathMaxDays;
  
  // Navigation functions
  const goToDailyView = (day, pathId = currentPath) => {
    navigateToScreen('daily', { day, pathId });
  };
  
  const goToUpload = () => {
    navigateToScreen('upload', { day: nextDay, pathId: currentPath });
  };

  const continueJourney = (pathId) => {
    const nextDay = getNextDayForPath(userProfile, pathId);
    navigateToScreen('write', { day: nextDay, pathId });
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
  
  return (
    <div className={`hs-container ${isLoaded ? 'hs-loaded' : ''} ${isDarkMode ? 'hs-dark' : 'hs-light'}`}>
      {/* Modern Header */}
      <header className="hs-header">
        <div className="hs-header-content">
          <div className="hs-header-main">
            <div className="hs-date-wrapper">
              <p className="hs-date">{formatDate()}</p>
            </div>
            <h1 className="hs-greeting">
              {getGreeting()}, <span className="hs-username">{userProfile?.displayName?.split(' ')[0] || 'there'}</span>
            </h1>
          </div>
          
          <div className="hs-header-actions">
            <div className="hs-weather-wrapper">
              <WeatherWidget 
                city={userProfile?.city} 
                onWeatherData={setWeatherData}
                onClick={() => weatherData && setShowWeatherDialog(true)}
              />
            </div>
            <ModernThemeToggle />
          </div>
        </div>
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
        {inProgressPaths.length > 0 && (
          <div className="hs-journey-category">
            <h3 className="hs-category-title">
              <Target className="hs-category-icon" />
              In Progress
            </h3>
            <div className="hs-journeys-grid">
              {inProgressPaths.map(path => (
                <div 
                  className={`hs-journey-card hs-journey-${path.id}`} 
                  key={path.id}
                  onClick={() => continueJourney(path.id)}
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
                      <span className="hs-journey-day">Day {getNextDayForPath(userProfile, path.id)} of {path.totalDays}</span>
                    </div>
                  </div>
                  <h4 className="hs-journey-title">{path.title}</h4>
                  <div className="hs-progress-bar">
                    <div 
                      className="hs-progress-fill" 
                      style={{ 
                        width: `${path.percentage}%`,
                        backgroundColor: `rgb(${path.color})`
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

        {/* Completed Journeys */}
        {completedPaths.length > 0 && (
          <div className="hs-journey-category">
            <h3 className="hs-category-title">
              <CheckSquare className="hs-category-icon" />
              Completed
            </h3>
            <div className="hs-journeys-grid">
              {completedPaths.map(path => (
                <div 
                  className={`hs-journey-card hs-journey-completed hs-journey-${path.id}`} 
                  key={path.id}
                  onClick={() => navigateToScreen('journey-complete', { pathId: path.id })}
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
                        backgroundColor: `rgb(${path.color})`
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
        {inProgressPaths.length === 0 && completedPaths.length === 0 && (
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
      {currentPath && (
        <section className="hs-section hs-prompt-section">
          <div className="hs-section-header">
            <h2 className="hs-section-title">
              {isJourneyComplete ? (
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
              {isJourneyComplete ? (
                <div className="hs-completed-badge">
                  <CheckCircle size={16} />
                  <span>Complete</span>
                </div>
              ) : (
                <span>Day {nextDay}</span>
              )}
            </div>
          </div>
          
          {isJourneyComplete ? (
            <div className="hs-prompt-card hs-journey-complete-card">
              <div className="hs-complete-celebration">
                <div className="hs-complete-icon">
                  <Award className="hs-award-icon" />
                  <div className="hs-award-glow" />
                </div>
                <h3 className="hs-complete-title">Congratulations!</h3>
                <p className="hs-complete-text">
                  You've completed all {pathMaxDays} days of the {pathName}. 
                  View your journey summary or explore another path.
                </p>
              </div>
              
              <div className="hs-prompt-actions">
                <button 
                  className="hs-action-btn hs-action-primary"
                  onClick={() => navigateToScreen('journey-complete', { pathId: currentPath })}
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
            <div className={`hs-prompt-card hs-prompt-${currentPath}`}>
              <div className="hs-prompt-theme">
                <Bookmark className="hs-theme-icon" />
                <span className="hs-theme-text">{currentPrompt?.theme || 'Reflection'}</span>
              </div>
              
              <h3 className="hs-prompt-title">{currentPrompt?.title || `Day ${nextDay}`}</h3>
              <p className="hs-prompt-text">{currentPrompt?.prompt || 'Take a moment to reflect on your journey so far.'}</p>
              
              <div className="hs-prompt-actions">
                <button 
                  className={`hs-action-btn hs-action-primary hs-pulse-btn hs-action-${currentPath}`}
                  onClick={() => goToUpload()}
                >
                  <Zap size={18} />
                  <span>Journal Now</span>
                </button>
                
                <button 
                  className="hs-action-btn hs-action-secondary"
                  onClick={() => goToDailyView(nextDay)}
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
          
          {completedPaths.length > 0 && (
            <button 
              className="hs-action-card hs-action-highlight"
              onClick={() => navigateToScreen('journey-complete', { pathId: completedPaths[0].id })}
            >
              <div className="hs-action-icon-wrapper hs-action-icon-highlight">
                <Award className="hs-action-icon" />
              </div>
              <span className="hs-action-label">Achievement</span>
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
      
      {/* Inspirational Quote Section */}
      <section className="hs-section hs-quote-section">
        <div className="hs-quote-card" onClick={changeQuote}>
          <Quote className="hs-quote-icon" />
          <div className={`hs-quote-content ${isQuoteChanging ? 'hs-quote-changing' : ''}`}>
            <p className="hs-quote-text">"{quote.text}"</p>
            <p className="hs-quote-author">— {quote.author}</p>
          </div>
          <div className="hs-quote-tap-hint">
            <span>Tap for new quote</span>
          </div>
        </div>
      </section>
      
      {/* Scroll Indicator for Longer Content */}
      <div className="hs-scroll-indicator">
        <ChevronDown className="hs-scroll-icon" />
      </div>

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