<<<<<<< HEAD
// src/components/journey/DailyJourneyView.jsx - Mobile-first, no image display
import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  CheckCircle, 
  Bookmark, 
  ChevronRight,
  Edit3,
  Target,
  Lightbulb,
  Heart,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
=======
// src/components/journey/DailyJourneyView.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Camera, ArrowLeft, ArrowRight, BookOpen, CheckCircle, Bookmark, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
// REMOVED: import { useSubscription } from '../../contexts/SubscriptionContext';
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
import { useNavigation } from '../../contexts/NavigationContext';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import '../../styles/components/journey.css';
import { getJourneyDay, getJourneyPath } from '../../data/JourneyData';
import { isDayCompleted } from '../../utils/userProgress';
<<<<<<< HEAD
import { Book, Compass, Brain, Droplet, Palette, RotateCcw, Map, ArrowUpRight } from 'lucide-react';
=======
import { Book, Compass, Heart, Brain, Droplet, Palette, RotateCcw, Map, ArrowUpRight } from 'lucide-react';
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188

const DailyJourneyView = ({ currentDay, pathId = 'self-discovery', onUpload, onNavigate, onBack }) => {
  const { currentUser, userProfile } = useAuth();
  const { screenData, navigateToScreen } = useNavigation();
<<<<<<< HEAD
=======
  // REMOVED: const { canAccessPremiumPath } = useSubscription();
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  const [journeyData, setJourneyData] = useState(null);
  const [completedDays, setCompletedDays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pathData, setPathData] = useState(null);
  const [journalEntry, setJournalEntry] = useState(null);
  const [entryFetchError, setEntryFetchError] = useState(null);
<<<<<<< HEAD
=======
  // REMOVED: const [hasAccess, setHasAccess] = useState(true);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188

  const viewContextId = `${pathId}-day-${currentDay}-${screenData?.fromArchive ? 'archive' : 'normal'}`;
  const viewContextIdRef = useRef(viewContextId);

<<<<<<< HEAD
=======
  // REMOVED: Premium access check useEffect - no longer needed since no subscriptions

>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  useEffect(() => {
    if (viewContextId !== viewContextIdRef.current) {
      viewContextIdRef.current = viewContextId;
      setJournalEntry(null);
      setEntryFetchError(null);
      setIsLoading(true);
    }
  }, [viewContextId]);

  useEffect(() => {
    try {
      const path = getJourneyPath(pathId);
      setPathData(path);
    } catch (error) {
      console.error(`Error loading path data for ${pathId}:`, error);
    }
  }, [pathId]);

  useEffect(() => {
    const fetchData = async () => {
<<<<<<< HEAD
=======
      // REMOVED: if (!hasAccess) return; - no longer needed

>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      try {
        setIsLoading(true);

        if (!currentUser) {
          console.warn('No user is signed in');
          return;
        }

        const dayData = getJourneyDay(currentDay, pathId);
        setJourneyData(dayData);

        try {
          const journalRef = collection(db, 'users', currentUser.uid, 'journal');
          const q = query(journalRef, where("pathId", "==", pathId));
          const journalSnap = await getDocs(q);

          const completedDaysArray = [];
          journalSnap.forEach((doc) => {
            const data = doc.data();
            if (data.day && typeof data.day === 'number') {
              if (!completedDaysArray.includes(data.day)) {
                completedDaysArray.push(data.day);
              }
              return;
            }

            const dayId = doc.id;
            const matches = dayId.match(/day-(\d+)$/);
            if (matches && matches[1]) {
              const dayNumber = parseInt(matches[1]);
              if (!isNaN(dayNumber) && !completedDaysArray.includes(dayNumber)) {
                completedDaysArray.push(dayNumber);
              }
            }
          });

          setCompletedDays(completedDaysArray);
        } catch (error) {
          console.error('Error fetching completed days:', error);
          setCompletedDays([]);
        }
      } catch (error) {
        console.error('Error fetching journey data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
<<<<<<< HEAD
  }, [currentUser, currentDay, pathId, viewContextId]);

  useEffect(() => {
    const fetchJournalEntry = async () => {
      if (!currentUser || !pathId || !currentDay) return;

      try {
        console.log('=== FETCHING JOURNAL ENTRY ===');
        console.log('Path ID:', pathId);
        console.log('Day:', currentDay);
        console.log('User ID:', currentUser.uid);

=======
  }, [currentUser, currentDay, pathId, viewContextId]); // REMOVED: hasAccess dependency

  useEffect(() => {
    const fetchJournalEntry = async () => {
      if (!currentUser || !pathId || !currentDay) return; // REMOVED: !hasAccess condition

      try {
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        const journalRef = collection(db, 'users', currentUser.uid, 'journal');
        const q = query(
          journalRef,
          where("pathId", "==", pathId),
          where("day", "==", currentDay)
        );

        const journalSnap = await getDocs(q);

        if (!journalSnap.empty) {
          const entryData = journalSnap.docs[0].data();
<<<<<<< HEAD
          console.log('=== FOUND ENTRY DATA ===');
          console.log('Entry data:', entryData);
          
=======
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
          setJournalEntry(entryData);
          setEntryFetchError(null);
          return;
        }

<<<<<<< HEAD
        // Fallback to old document ID format
        const docId = `${pathId}-day-${currentDay}`;
        console.log('Trying fallback document ID:', docId);
=======
        const docId = `${pathId}-day-${currentDay}`;
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        const docRef = doc(db, 'users', currentUser.uid, 'journal', docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const entryData = docSnap.data();
<<<<<<< HEAD
          console.log('=== FOUND FALLBACK ENTRY DATA ===');
          console.log('Entry data:', entryData);
          
=======
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
          setJournalEntry(entryData);
          setEntryFetchError(null);
          return;
        }

<<<<<<< HEAD
        console.log('=== NO ENTRY FOUND ===');
=======
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        setJournalEntry(null);
        setEntryFetchError('Entry not found');
      } catch (error) {
        console.error('Error fetching journal entry:', error);
        setEntryFetchError(`Error: ${error.message}`);
      }
    };

    fetchJournalEntry();
<<<<<<< HEAD
  }, [currentUser, currentDay, pathId, viewContextId]);
=======
  }, [currentUser, currentDay, pathId, viewContextId]); // REMOVED: hasAccess dependency
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188

  const handlePreviousDay = () => {
    if (currentDay > 1) {
      onNavigate(pathId, currentDay - 1);
    }
  };

  const handleNextDay = () => {
    if (!pathData) return;
<<<<<<< HEAD
=======

>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    const totalDays = pathData.duration;
    if (currentDay < totalDays) {
      onNavigate(pathId, currentDay + 1);
    }
  };

  const isCurrentDayCompleted = completedDays.includes(currentDay);

  const isDayUnlocked = (day) => {
    if (day === 1) return true;
    if (screenData?.fromArchive) return true;
    if (completedDays.length === 0) return false;
<<<<<<< HEAD
=======

>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    const maxCompletedDay = Math.max(...completedDays, 0);
    return day <= maxCompletedDay + 1;
  };

<<<<<<< HEAD
  const renderProgressBar = () => {
    if (!pathData) return null;
    
    const progressPercentage = Math.round((completedDays.length / pathData.duration) * 100);
    
    return (
      <div className="djv-progress-container">
        <div className="djv-progress-bar">
          <div 
            className="djv-progress-fill"
            style={{ 
              width: `${progressPercentage}%`,
              backgroundColor: pathData.color ? `rgb(${pathData.color})` : '#558B6E'
            }}
          />
        </div>
        <div className="djv-progress-text">
          <span className="djv-progress-completed">{completedDays.length}</span>
          <span className="djv-progress-separator">/</span>
          <span className="djv-progress-total">{pathData.duration} days</span>
          <span className="djv-progress-percentage">({progressPercentage}%)</span>
        </div>
      </div>
    );
  };

  const renderCompactDayIndicators = () => {
    if (!pathData) return null;

    const totalDays = pathData.duration;
    const maxVisible = 7;
    
    // Calculate which days to show around current day
    let startDay = Math.max(1, currentDay - Math.floor(maxVisible / 2));
    let endDay = Math.min(totalDays, startDay + maxVisible - 1);
    
    // Adjust if we're near the end
    if (endDay - startDay + 1 < maxVisible) {
      startDay = Math.max(1, endDay - maxVisible + 1);
    }

    const visibleDays = [];
    for (let day = startDay; day <= endDay; day++) {
      visibleDays.push(day);
    }

    return (
      <div className="djv-day-indicators">
        {startDay > 1 && (
          <button
            onClick={() => onNavigate(pathId, 1)}
            className="djv-day-nav djv-day-first"
          >
            1
          </button>
        )}
        
        {startDay > 2 && <div className="djv-day-ellipsis">•••</div>}
        
        {visibleDays.map((day) => {
          const isCompleted = completedDays.includes(day);
          const isUnlocked = isDayUnlocked(day);
          const isCurrent = day === currentDay;

          return (
            <button
              key={day}
              onClick={() => isUnlocked ? onNavigate(pathId, day) : null}
              className={`djv-day-indicator ${isCurrent ? 'djv-current' : ''} ${isCompleted ? 'djv-completed' : ''} ${!isUnlocked ? 'djv-locked' : ''}`}
              disabled={!isUnlocked}
              style={pathData.color && isCurrent ? { backgroundColor: `rgb(${pathData.color})` } : {}}
            >
              {isCompleted ? (
                <CheckCircle className="djv-check-icon" />
              ) : (
                day
              )}
            </button>
          );
        })}
        
        {endDay < totalDays - 1 && <div className="djv-day-ellipsis">•••</div>}
        
        {endDay < totalDays && (
          <button
            onClick={() => onNavigate(pathId, totalDays)}
            className="djv-day-nav djv-day-last"
          >
            {totalDays}
          </button>
        )}
      </div>
    );
=======
  const renderDayIndicators = () => {
    if (!pathData) return null;

    const totalDays = pathData.duration;

    if (totalDays <= 14) {
      return (
        <div className="day-indicator-container">
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
            const isCompleted = completedDays.includes(day);
            const isUnlocked = isDayUnlocked(day);
            const isCurrent = day === currentDay;

            return (
              <button
                key={day}
                onClick={() => isUnlocked ? onNavigate(pathId, day) : null}
                className={`day-indicator ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
                disabled={!isUnlocked}
                style={pathData.color && isCurrent ? { backgroundColor: `rgb(${pathData.color})` } : {}}
              >
                {isCompleted ? (
                  <CheckCircle className="day-check-icon" />
                ) : (
                  day
                )}
              </button>
            );
          })}
        </div>
      );
    } else if (totalDays <= 30) {
      return (
        <div className="day-indicator-container">
          {generateSmartDayIndicators(totalDays, 5)}
        </div>
      );
    } else {
      return (
        <div className="day-indicator-container">
          {generateSmartDayIndicators(totalDays, 10)}
        </div>
      );
    }
  };

  const generateSmartDayIndicators = (totalDays, step) => {
    const indicators = [];

    const shouldShowDay = (day) => {
      if (day === 1) return true;
      if (day === totalDays) return true;
      if (Math.abs(day - currentDay) <= 1) return true;
      if (day % step === 0) return true;
      return false;
    };

    let lastDay = 0;

    for (let day = 1; day <= totalDays; day++) {
      if (shouldShowDay(day)) {
        if (lastDay > 0 && day - lastDay > 1) {
          indicators.push(
            <div key={`separator-${lastDay}-${day}`} className="day-separator">•••</div>
          );
        }

        const isCompleted = completedDays.includes(day);
        const isUnlocked = isDayUnlocked(day);
        const isCurrent = day === currentDay;

        indicators.push(
          <button
            key={day}
            onClick={() => isUnlocked ? onNavigate(pathId, day) : null}
            className={`day-indicator ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`}
            disabled={!isUnlocked}
            style={pathData.color && isCurrent ? { backgroundColor: `rgb(${pathData.color})` } : {}}
          >
            {isCompleted ? (
              <CheckCircle className="day-check-icon" />
            ) : (
              day
            )}
          </button>
        );

        lastDay = day;
      }
    }

    return indicators;
  };

  // REMOVED: hasAccess check - no longer needed
  // if (!hasAccess) {
  //   return null; // Redirect handled in useEffect
  // }

  if (isLoading || !journeyData || !pathData) {
    return (
      <div className="journey-loading-container">
        <div className="journey-loading-circle"></div>
        <p className="journey-loading-text">Loading your journey...</p>
      </div>
    );
  }

  const totalDays = pathData.duration;
  const pathColor = pathData.color ? `rgb(${pathData.color})` : null;
  const pathColorLight = pathData.color ? `rgba(${pathData.color}, 0.15)` : null;
  const pathColorBg = pathData.color ? `linear-gradient(135deg, rgba(${pathData.color}, 0.05) 0%, rgba(${pathData.color}, 0.1) 100%)` : null;
  const pathColorBorder = pathData.color ? `rgba(${pathData.color}, 0.3)` : null;

  const handleBack = () => {
    if (screenData?.fromArchive) {
      navigateToScreen('journal-archive');
    } else if (screenData?.fromPathSelection) {
      navigateToScreen('path-selection');
    } else {
      navigateToScreen('path-selection');
    }
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  };

  const getPathIcon = () => {
    const iconMap = {
      'Compass': Compass,
      'Heart': Heart,
      'Brain': Brain,
      'Droplet': Droplet,
      'Palette': Palette,
      'RotateCcw': RotateCcw,
      'Map': Map,
      'Book': Book
    };

<<<<<<< HEAD
    const IconComponent = iconMap[pathData?.iconName] || Book;
    return <IconComponent className="djv-path-icon" />;
  };

  const handleBack = () => {
    if (screenData?.fromArchive) {
      navigateToScreen('journal-archive');
    } else if (screenData?.fromPathSelection) {
      navigateToScreen('path-selection');
    } else {
      navigateToScreen('path-selection');
    }
  };

  if (isLoading || !journeyData || !pathData) {
    return (
      <div className="djv-container">
        <div className="djv-loading">
          <div className="djv-loading-spinner"></div>
          <h3 className="djv-loading-title">Loading Journey</h3>
          <p className="djv-loading-subtitle">Preparing your reflection space...</p>
        </div>
      </div>
    );
  }

  const pathColor = pathData.color ? `rgb(${pathData.color})` : '#558B6E';

  return (
    <div className="djv-container">
      {/* Header */}
      <div className="djv-header">
        <button onClick={handleBack} className="djv-back-btn">
          <ArrowLeft size={20} />
        </button>
        
        <div className="djv-header-content">
          <div className="djv-path-badge">
            {getPathIcon()}
            <span>{pathData.title}</span>
          </div>
          
          <div className="djv-day-info">
            <h1 className="djv-day-title">Day {currentDay}</h1>
            <h2 className="djv-day-subtitle">{journeyData.title}</h2>
          </div>
        </div>

        <div className="djv-day-nav-compact">
          <button 
            onClick={handlePreviousDay}
            disabled={currentDay === 1}
            className="djv-nav-btn djv-prev"
          >
            <ArrowLeft size={16} />
          </button>
          <button 
            onClick={handleNextDay}
            disabled={currentDay === pathData.duration}
            className="djv-nav-btn djv-next"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Progress */}
      {renderProgressBar()}

      {/* Day Navigation */}
      {renderCompactDayIndicators()}

      {/* Content */}
      <div className="djv-content">
        {/* Prompt Card */}
        <div className="djv-card djv-prompt-card">
          <div className="djv-card-header">
            <div className="djv-card-icon" style={{ backgroundColor: `${pathColor}20` }}>
              <Edit3 size={18} style={{ color: pathColor }} />
            </div>
            <h3 className="djv-card-title">Today's Prompt</h3>
          </div>
          
          <div className="djv-prompt-content">
            <p className="djv-prompt-text">"{journeyData.prompt}"</p>
          </div>
        </div>

        {/* Journal Entry Card - NO IMAGE DISPLAY */}
        {journalEntry && (
          <div className="djv-card djv-entry-card">
            <div className="djv-card-header">
              <div className="djv-card-icon" style={{ backgroundColor: `${pathColor}20` }}>
                <BookOpen size={18} style={{ color: pathColor }} />
              </div>
              <h3 className="djv-card-title">Your Entry</h3>
              {isCurrentDayCompleted && (
                <div className="djv-completed-badge">
                  <CheckCircle size={16} />
                  <span>Complete</span>
                </div>
              )}
            </div>

            <div className="djv-entry-content">
              {/* Text Content Only */}
              {journalEntry.extractedText && (
                <div className="djv-entry-text">
=======
    const IconComponent = iconMap[pathData.iconName] || Book;
    return <IconComponent className="journey-path-icon" style={pathColor ? { color: pathColor } : {}} />;
  };

  return (
    <div className="journey-view-container">
      <div className="back-button-container">
        <button
          onClick={handleBack}
          className="journey-back-button"
          style={pathColor ? { borderColor: pathColorBorder, color: pathColor } : {}}
        >
          <ArrowLeft className="back-icon" />
          {screenData?.fromArchive ? 'Return to Archive' : 'Back to Paths'}
        </button>
      </div>

      <div className="journey-content-container">
        <div
          className="journey-path-header"
          style={{ background: pathColorBg || 'rgba(43, 70, 60, 0.2)' }}
        >
          <div className="journey-path-icon-wrapper" style={pathColorLight ? { backgroundColor: pathColorLight } : {}}>
            {getPathIcon()}
          </div>

          <div className="journey-path-info">
            <h1 className="journey-path-title">{pathData.title}</h1>
            <div className="journey-path-meta">
              <span className="journey-path-duration">{totalDays}-day journey</span>
              <span className="journey-path-separator">•</span>
              <span className="journey-path-theme">{journeyData.theme}</span>
            </div>
          </div>
        </div>

        <div className="day-navigation-container">
          <button
            onClick={handlePreviousDay}
            disabled={currentDay === 1}
            className={`navigation-arrow ${currentDay === 1 ? 'disabled' : ''}`}
            style={pathColor ? { borderColor: pathColorBorder } : {}}
          >
            <ArrowLeft className="navigation-icon" style={pathColor ? { color: pathColor } : {}} />
          </button>

          <div className="day-heading">
            <h2 className="day-number">Day {currentDay}</h2>
            <h3 className="day-title">{journeyData.title}</h3>
          </div>

          <button
            onClick={handleNextDay}
            disabled={currentDay === totalDays}
            className={`navigation-arrow ${currentDay === totalDays ? 'disabled' : ''}`}
            style={pathColor ? { borderColor: pathColorBorder } : {}}
          >
            <ArrowRight className="navigation-icon" style={pathColor ? { color: pathColor } : {}} />
          </button>
        </div>

        {renderDayIndicators()}

        <div
          className="journey-prompt-card"
          style={{
            borderColor: pathColorBorder || 'rgba(85, 139, 110, 0.2)',
            background: pathColorBg || 'rgba(43, 70, 60, 0.1)'
          }}
        >
          <div className="journey-prompt-header">
            <Bookmark className="journey-prompt-icon" style={pathColor ? { color: pathColor } : {}} />
            <h3 className="journey-prompt-title">Today's Reflection</h3>
          </div>

          <div
            className="journey-prompt-container"
            style={pathColor ? { borderLeftColor: pathColor } : {}}
          >
            <p className="journey-prompt-text">"{journeyData.prompt}"</p>
          </div>
        </div>

        {journalEntry && (
          <div className="journal-entry-card">
            <div className="journal-entry-header">
              <BookOpen className="journal-entry-icon" style={pathColor ? { color: pathColor } : {}} />
              <h3 className="journal-entry-title">Your Journal Entry</h3>
            </div>

            <div
              className="journal-entry-container"
              style={pathColor ? { borderColor: pathColorBorder } : {}}
            >
              {journalEntry.extractedText && (
                <div className="journal-entry-text">
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
                  <p>{journalEntry.extractedText}</p>
                </div>
              )}

<<<<<<< HEAD
              {/* Show message if entry has image but we don't display it */}
              {journalEntry.imageUrl && !journalEntry.extractedText && (
                <div className="djv-entry-text">
                  <p className="djv-image-note">📝 You uploaded a journal entry for this day.</p>
                </div>
              )}

              {/* Analysis Section */}
              {journalEntry.analysis && (
                <div className="djv-analysis-section">
                  <div className="djv-analysis-header">
                    <Lightbulb size={18} style={{ color: pathColor }} />
                    <h4>Insights & Analysis</h4>
                  </div>

                  {journalEntry.analysis.summary && (
                    <div className="djv-analysis-item">
                      <h5>Summary</h5>
                      <p>{journalEntry.analysis.summary}</p>
=======
              {journalEntry.imageUrl && (
                <div className="journal-entry-image">
                  <img
                    src={journalEntry.imageUrl}
                    alt="Journal entry"
                    className="journal-image"
                  />
                </div>
              )}

              {journalEntry.analysis && (
                <div
                  className="journal-analysis-container"
                  style={pathColor ? { borderTopColor: pathColorBorder } : {}}
                >
                  <h4
                    className="journal-analysis-title"
                    style={pathColor ? { color: pathColor } : {}}
                  >
                    Analysis & Insights
                  </h4>

                  {journalEntry.analysis.summary && (
                    <div className="analysis-section">
                      <h5 className="analysis-section-title">Summary</h5>
                      <p className="analysis-section-content">{journalEntry.analysis.summary}</p>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
                    </div>
                  )}

                  {journalEntry.analysis.insights && journalEntry.analysis.insights.length > 0 && (
<<<<<<< HEAD
                    <div className="djv-analysis-item">
                      <h5>Key Insights</h5>
                      <ul className="djv-insights-list">
                        {journalEntry.analysis.insights.map((insight, index) => (
                          <li key={index}>{insight}</li>
=======
                    <div className="analysis-section">
                      <h5 className="analysis-section-title">Key Insights</h5>
                      <ul className="analysis-insights-list">
                        {journalEntry.analysis.insights.map((insight, index) => (
                          <li key={index} className="analysis-insight-item">{insight}</li>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
                        ))}
                      </ul>
                    </div>
                  )}

                  {journalEntry.analysis.practicalAction && (
<<<<<<< HEAD
                    <div className="djv-analysis-item djv-action-item">
                      <h5>Suggested Action</h5>
                      <p>{journalEntry.analysis.practicalAction}</p>
=======
                    <div className="analysis-section">
                      <h5 className="analysis-section-title">Suggested Action</h5>
                      <p className="analysis-section-content">{journalEntry.analysis.practicalAction}</p>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

<<<<<<< HEAD
        {/* No Entry State */}
        {!journalEntry && !entryFetchError && (
          <div className="djv-card djv-empty-card">
            <div className="djv-empty-content">
              <div className="djv-empty-icon">
                <Edit3 size={32} />
              </div>
              <h3>Ready to reflect?</h3>
              <p>Take a moment to explore today's prompt and share your thoughts.</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {entryFetchError && !journalEntry && screenData?.fromArchive && (
          <div className="djv-card djv-error-card">
            <div className="djv-error-content">
              <AlertCircle size={32} />
              <h3>Entry not found</h3>
              <p>We couldn't load this journal entry. Please try returning to the archive.</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="djv-action-container">
        {screenData?.fromArchive ? (
          <button onClick={handleBack} className="djv-action-btn djv-secondary">
            <ArrowLeft size={18} />
            Back to Archive
          </button>
        ) : journalEntry ? (
          <button
            onClick={() => {
              const nextDay = currentDay + 1;
              if (nextDay <= pathData.duration) {
                onNavigate(pathId, nextDay);
              } else {
                navigateToScreen('journey-complete', { pathId });
              }
            }}
            className="djv-action-btn djv-primary"
            style={{ backgroundColor: pathColor }}
          >
            {currentDay < pathData.duration ? (
              <>
                Continue to Day {currentDay + 1}
                <ChevronRight size={18} />
              </>
            ) : (
              <>
                Complete Journey
                <ArrowUpRight size={18} />
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => onUpload(pathId)}
            className="djv-action-btn djv-primary"
            style={{ backgroundColor: pathColor }}
          >
            <Camera size={18} />
            Start Writing
          </button>
=======
        {entryFetchError && !journalEntry && screenData?.fromArchive && (
          <div className="error-message">
            <p>Could not load the journal entry. Please try again or return to the archive.</p>
          </div>
        )}

        {!screenData?.fromArchive && !journalEntry && (
          <div
            className="journey-approach-card"
            style={{
              borderColor: pathColorBorder || 'rgba(85, 139, 110, 0.2)',
              background: pathColorBg || 'rgba(43, 70, 60, 0.1)'
            }}
          >
            <h3 className="journey-approach-title">How to Approach This</h3>

            <ul className="journey-approach-list">
              <li className="journey-approach-item">
                <span
                  className="journey-approach-bullet"
                  style={pathColor ? { color: pathColor } : {}}
                >
                  •
                </span>
                <span className="journey-approach-text">Find a quiet space where you won't be interrupted</span>
              </li>
              <li className="journey-approach-item">
                <span
                  className="journey-approach-bullet"
                  style={pathColor ? { color: pathColor } : {}}
                >
                  •
                </span>
                <span className="journey-approach-text">Write freely for at least 10-15 minutes</span>
              </li>
              <li className="journey-approach-item">
                <span
                  className="journey-approach-bullet"
                  style={pathColor ? { color: pathColor } : {}}
                >
                  •
                </span>
                <span className="journey-approach-text">Be honest with yourself - this is your private journey</span>
              </li>
              <li className="journey-approach-item">
                <span
                  className="journey-approach-bullet"
                  style={pathColor ? { color: pathColor } : {}}
                >
                  •
                </span>
                <span className="journey-approach-text">Don't worry about perfect writing - focus on authentic expression</span>
              </li>
            </ul>
          </div>
        )}

        <div className="journey-actions-container">
          {screenData?.fromArchive && (
            <button
              onClick={handleBack}
              className="journey-action-button secondary"
              style={pathColor ? { borderColor: pathColorBorder, color: pathColor } : {}}
            >
              <ArrowLeft className="button-icon" />
              Return to Archive
            </button>
          )}

          {screenData?.fromPathSelection && !journalEntry && (
            <div className="journey-actions-column">
              <button
                onClick={() => onUpload(pathId)}
                className="journey-action-button primary"
                style={pathColor ? { backgroundColor: pathColor } : {}}
              >
                <Camera className="button-icon" />
                Start Journaling
              </button>

              <button
                onClick={handleBack}
                className="journey-action-button secondary"
                style={pathColor ? { borderColor: pathColorBorder, color: pathColor } : {}}
              >
                Back to Paths
              </button>
            </div>
          )}

          {!screenData?.fromArchive && !screenData?.fromPathSelection && journalEntry && (
            <button
              onClick={() => {
                const nextDay = currentDay + 1;
                if (nextDay <= totalDays) {
                  onNavigate(pathId, nextDay);
                } else {
                  if (typeof navigateToScreen === 'function') {
                    navigateToScreen('journey-complete', { pathId });
                  } else {
                    onNavigate(pathId, currentDay);
                  }
                }
              }}
              className="journey-action-button primary"
              style={pathColor ? { backgroundColor: pathColor } : {}}
            >
              {currentDay < totalDays ? (
                <>
                  Continue to Next Day
                  <ChevronRight className="button-icon-right" />
                </>
              ) : (
                <>
                  Review Your Journey
                  <ArrowUpRight className="button-icon-right" />
                </>
              )}
            </button>
          )}

          {!screenData?.fromArchive && !screenData?.fromPathSelection && !journalEntry && (
            <button
              onClick={() => onUpload(pathId)}
              className="journey-action-button primary"
              style={pathColor ? { backgroundColor: pathColor } : {}}
            >
              <Camera className="button-icon" />
              Upload Journal Entry
            </button>
          )}
        </div>

        {!screenData?.fromArchive && (
          <div
            className="journey-tips-card"
            style={{
              borderColor: pathColorBorder || 'rgba(85, 139, 110, 0.2)',
              background: pathColorBg || 'rgba(43, 70, 60, 0.1)'
            }}
          >
            <h3
              className="journey-tips-title"
              style={pathColor ? { color: pathColor } : {}}
            >
              Tips for Deeper Reflection
            </h3>

            <div className="journey-tips-grid">
              <div
                className="journey-tip-card"
                style={pathColor ? { borderColor: pathColorBorder } : {}}
              >
                <h4
                  className="journey-tip-title"
                  style={pathColor ? { color: pathColor } : {}}
                >
                  Create a Ritual
                </h4>
                <p className="journey-tip-text">
                  Set the mood with soft lighting, quiet music, or a cup of tea to create a dedicated journaling environment.
                </p>
              </div>

              <div
                className="journey-tip-card"
                style={pathColor ? { borderColor: pathColorBorder } : {}}
              >
                <h4
                  className="journey-tip-title"
                  style={pathColor ? { color: pathColor } : {}}
                >
                  Avoid Distractions
                </h4>
                <p className="journey-tip-text">
                  Turn off notifications and set aside 20-30 minutes of uninterrupted time for your journaling practice.
                </p>
              </div>

              <div
                className="journey-tip-card"
                style={pathColor ? { borderColor: pathColorBorder } : {}}
              >
                <h4
                  className="journey-tip-title"
                  style={pathColor ? { color: pathColor } : {}}
                >
                  Follow-Up Questions
                </h4>
                <p className="journey-tip-text">
                  After addressing the prompt, ask yourself "why?" to explore your initial responses more deeply.
                </p>
              </div>

              <div
                className="journey-tip-card"
                style={pathColor ? { borderColor: pathColorBorder } : {}}
              >
                <h4
                  className="journey-tip-title"
                  style={pathColor ? { color: pathColor } : {}}
                >
                  Be Compassionate
                </h4>
                <p className="journey-tip-text">
                  Approach your thoughts and feelings with kindness and without judgment as you explore them.
                </p>
              </div>
            </div>
          </div>
        )}

        {totalDays > 14 && !screenData?.fromArchive && (
          <div className="journey-progress-stats">
            <h3 className="journey-progress-title">Your Journey Progress</h3>
            <div className="journey-progress-metrics">
              <div
                className="journey-progress-metric"
                style={{ borderColor: pathColorBorder || 'rgba(85, 139, 110, 0.2)' }}
              >
                <div
                  className="journey-metric-value"
                  style={pathColor ? { color: pathColor } : {}}
                >
                  {completedDays.length}
                </div>
                <div className="journey-metric-label">Days Completed</div>
              </div>

              <div
                className="journey-progress-metric"
                style={{ borderColor: pathColorBorder || 'rgba(85, 139, 110, 0.2)' }}
              >
                <div
                  className="journey-metric-value"
                  style={pathColor ? { color: pathColor } : {}}
                >
                  {totalDays - completedDays.length}
                </div>
                <div className="journey-metric-label">Days Remaining</div>
              </div>

              <div
                className="journey-progress-metric"
                style={{ borderColor: pathColorBorder || 'rgba(85, 139, 110, 0.2)' }}
              >
                <div
                  className="journey-metric-value"
                  style={pathColor ? { color: pathColor } : {}}
                >
                  {Math.round((completedDays.length / totalDays) * 100)}%
                </div>
                <div className="journey-metric-label">Journey Complete</div>
              </div>
            </div>
          </div>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        )}
      </div>
    </div>
  );
};

export default DailyJourneyView;