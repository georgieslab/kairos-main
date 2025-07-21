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
import { useNavigation } from '../../contexts/NavigationContext';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import '../../styles/components/journey.css';
import { getJourneyDay, getJourneyPath } from '../../data/JourneyData';
import { isDayCompleted } from '../../utils/userProgress';
import { Book, Compass, Brain, Droplet, Palette, RotateCcw, Map, ArrowUpRight } from 'lucide-react';

const DailyJourneyView = ({ currentDay, pathId = 'self-discovery', onUpload, onNavigate, onBack }) => {
  const { currentUser, userProfile } = useAuth();
  const { screenData, navigateToScreen } = useNavigation();
  const [journeyData, setJourneyData] = useState(null);
  const [completedDays, setCompletedDays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pathData, setPathData] = useState(null);
  const [journalEntry, setJournalEntry] = useState(null);
  const [entryFetchError, setEntryFetchError] = useState(null);

  const viewContextId = `${pathId}-day-${currentDay}-${screenData?.fromArchive ? 'archive' : 'normal'}`;
  const viewContextIdRef = useRef(viewContextId);

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
  }, [currentUser, currentDay, pathId, viewContextId]);

  useEffect(() => {
    const fetchJournalEntry = async () => {
      if (!currentUser || !pathId || !currentDay) return;

      try {
        console.log('=== FETCHING JOURNAL ENTRY ===');
        console.log('Path ID:', pathId);
        console.log('Day:', currentDay);
        console.log('User ID:', currentUser.uid);

        const journalRef = collection(db, 'users', currentUser.uid, 'journal');
        const q = query(
          journalRef,
          where("pathId", "==", pathId),
          where("day", "==", currentDay)
        );

        const journalSnap = await getDocs(q);

        if (!journalSnap.empty) {
          const entryData = journalSnap.docs[0].data();
          console.log('=== FOUND ENTRY DATA ===');
          console.log('Entry data:', entryData);
          
          setJournalEntry(entryData);
          setEntryFetchError(null);
          return;
        }

        // Fallback to old document ID format
        const docId = `${pathId}-day-${currentDay}`;
        console.log('Trying fallback document ID:', docId);
        const docRef = doc(db, 'users', currentUser.uid, 'journal', docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const entryData = docSnap.data();
          console.log('=== FOUND FALLBACK ENTRY DATA ===');
          console.log('Entry data:', entryData);
          
          setJournalEntry(entryData);
          setEntryFetchError(null);
          return;
        }

        console.log('=== NO ENTRY FOUND ===');
        setJournalEntry(null);
        setEntryFetchError('Entry not found');
      } catch (error) {
        console.error('Error fetching journal entry:', error);
        setEntryFetchError(`Error: ${error.message}`);
      }
    };

    fetchJournalEntry();
  }, [currentUser, currentDay, pathId, viewContextId]);

  const handlePreviousDay = () => {
    if (currentDay > 1) {
      onNavigate(pathId, currentDay - 1);
    }
  };

  const handleNextDay = () => {
    if (!pathData) return;
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
    const maxCompletedDay = Math.max(...completedDays, 0);
    return day <= maxCompletedDay + 1;
  };

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
                  <p>{journalEntry.extractedText}</p>
                </div>
              )}

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
                    </div>
                  )}

                  {journalEntry.analysis.insights && journalEntry.analysis.insights.length > 0 && (
                    <div className="djv-analysis-item">
                      <h5>Key Insights</h5>
                      <ul className="djv-insights-list">
                        {journalEntry.analysis.insights.map((insight, index) => (
                          <li key={index}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {journalEntry.analysis.practicalAction && (
                    <div className="djv-analysis-item djv-action-item">
                      <h5>Suggested Action</h5>
                      <p>{journalEntry.analysis.practicalAction}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

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
        )}
      </div>
    </div>
  );
};

export default DailyJourneyView;