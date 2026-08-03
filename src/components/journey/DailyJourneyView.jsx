// src/components/journey/DailyJourneyView.jsx - Mobile-first, no image display
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, ArrowLeft, ArrowRight, BookOpen, CheckCircle, Bookmark, ChevronRight, Edit3, Target, Lightbulb, Heart, AlertCircle, Mic, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import '../../styles/components/journey.css';
import { getJourneyDay, getJourneyPath } from '../../data/JourneyData';
import { isDayCompleted } from '../../utils/userProgress';
import { Book, Compass, Brain, Droplet, Palette, RotateCcw, Map, ArrowUpRight, Lock } from 'lucide-react';

const DailyJourneyView = ({ currentDay, pathId = 'self-discovery', onUpload, onNavigate, onBack }) => {
  const { t } = useTranslation('journey');
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
          const completedDaysArray = [];
          const collectEntryDays = (snap) => {
            snap.forEach((docSnap) => {
              const data = docSnap.data();
              if (data.day && typeof data.day === 'number') {
                if (!completedDaysArray.includes(data.day)) {
                  completedDaysArray.push(data.day);
                }
                return;
              }

              const matches = docSnap.id.match(/day-(\d+)$/);
              if (matches && matches[1]) {
                const dayNumber = parseInt(matches[1]);
                if (!isNaN(dayNumber) && !completedDaysArray.includes(dayNumber)) {
                  completedDaysArray.push(dayNumber);
                }
              }
            });
          };

          // Written/painted entries live in `journal`; voice entries live in
          // `voice_journal`. Merge both so voice-only days count as completed.
          const [writtenSnap, voiceSnap] = await Promise.all([
            getDocs(query(collection(db, 'users', currentUser.uid, 'journal'), where("pathId", "==", pathId))),
            getDocs(query(collection(db, 'users', currentUser.uid, 'voice_journal'), where("pathId", "==", pathId)))
          ]);
          collectEntryDays(writtenSnap);
          collectEntryDays(voiceSnap);

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
        // Look up a day's entry in a given collection: field query first,
        // then fall back to the known document-id formats.
        const findInCollection = async (collectionName) => {
          const ref = collection(db, 'users', currentUser.uid, collectionName);
          const q = query(ref, where("pathId", "==", pathId), where("day", "==", currentDay));
          const snap = await getDocs(q);
          if (!snap.empty) return snap.docs[0].data();

          const candidateIds = [`${pathId}_day-${currentDay}`, `${pathId}-day-${currentDay}`];
          for (const id of candidateIds) {
            const docSnap = await getDoc(doc(db, 'users', currentUser.uid, collectionName, id));
            if (docSnap.exists()) return docSnap.data();
          }
          return null;
        };

        // Written/painted entries take priority; otherwise show the voice entry
        // (voice docs carry isVoiceEntry / transcription / audioUrl).
        const writtenEntry = await findInCollection('journal');
        const voiceEntry = writtenEntry ? null : await findInCollection('voice_journal');
        const entryData = writtenEntry || voiceEntry;

        if (entryData) {
          setJournalEntry(entryData);
          setEntryFetchError(null);
        } else {
          setJournalEntry(null);
          setEntryFetchError('Entry not found');
        }
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
          <span className="djv-progress-total">{t('dailyJourney.daysCount', '{{count}} days', { count: pathData.duration })}</span>
          <span className="djv-progress-percentage">({progressPercentage}%)</span>
        </div>
      </div>
    );
  };

  // The journey "map": every day laid out with its prompt, so View Details
  // actually shows the details. Completed / current / upcoming are visually
  // distinct; unlocked days are tappable to jump straight there.
  const renderJourneyDays = () => {
    if (!pathData?.days?.length) return null;

    const days = [...pathData.days].sort((a, b) => a.day - b.day);
    const rgb = pathData.color || '85, 139, 110';

    return (
      <div className="djv-card djv-journey-map">
        <div className="djv-card-header">
          <div className="djv-card-icon" style={{ backgroundColor: `${pathColor}20` }}>
            <Map size={18} style={{ color: pathColor }} />
          </div>
          <h3 className="djv-card-title">{t('dailyJourney.allPrompts', 'All Prompts')}</h3>
          <span className="djv-map-count">
            {t('dailyJourney.daysCount', '{{count}} days', { count: pathData.duration })}
          </span>
        </div>

        <div className="djv-days-list">
          {days.map((d) => {
            const isCompleted = completedDays.includes(d.day);
            const isCurrent = d.day === currentDay;
            const isUnlocked = isDayUnlocked(d.day);
            const canOpen = isUnlocked || isCompleted;

            return (
              <button
                key={d.day}
                className={`djv-day-row${isCurrent ? ' is-current' : ''}${isCompleted ? ' is-completed' : ''}${!isUnlocked ? ' is-locked' : ''}`}
                style={{ '--row-color': rgb }}
                onClick={() => canOpen && onNavigate(pathId, d.day)}
                disabled={!canOpen}
                aria-current={isCurrent ? 'true' : undefined}
              >
                <span className="djv-day-row-badge">
                  {isCompleted
                    ? <CheckCircle size={16} />
                    : !isUnlocked
                      ? <Lock size={13} />
                      : d.day}
                </span>

                <span className="djv-day-row-body">
                  <span className="djv-day-row-title">
                    {t('dailyJourney.dayLabel', 'Day {{day}}', { day: d.day })}
                    {d.theme ? <span className="djv-day-row-theme"> · {d.theme}</span> : null}
                  </span>
                  {d.prompt && <span className="djv-day-row-prompt">{d.prompt}</span>}
                </span>

                {canOpen && <ChevronRight size={16} className="djv-day-row-chevron" />}
              </button>
            );
          })}
        </div>
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
          <h3 className="djv-loading-title">{t('dailyJourney.loadingTitle', 'Loading Journey')}</h3>
          <p className="djv-loading-subtitle">{t('dailyJourney.loadingSubtitle', 'Preparing your reflection space...')}</p>
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
            <h1 className="djv-day-title">{t('dailyJourney.dayLabel', 'Day {{day}}', { day: currentDay })}</h1>
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

      {/* Content */}
      <div className="djv-content">
        {/* Prompt Card */}
        <div className="djv-card djv-prompt-card">
          <div className="djv-card-header">
            <div className="djv-card-icon" style={{ backgroundColor: `${pathColor}20` }}>
              <Edit3 size={18} style={{ color: pathColor }} />
            </div>
            <h3 className="djv-card-title">{t('dailyJourney.todaysPrompt', "Today's Prompt")}</h3>
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
                {journalEntry.isVoiceEntry
                  ? <Mic size={18} style={{ color: pathColor }} />
                  : <BookOpen size={18} style={{ color: pathColor }} />}
              </div>
              <h3 className="djv-card-title">
                {journalEntry.isVoiceEntry
                  ? t('dailyJourney.yourVoiceEntry', 'Your Voice Entry')
                  : t('dailyJourney.yourEntry', 'Your Entry')}
              </h3>
              {isCurrentDayCompleted && (
                <div className="djv-completed-badge">
                  <CheckCircle size={16} />
                  <span>{t('dailyJourney.complete', 'Complete')}</span>
                </div>
              )}
            </div>

            <div className="djv-entry-content">
              {/* Voice entry: audio playback + transcription */}
              {journalEntry.isVoiceEntry && (journalEntry.audioUrl || journalEntry.transcription) && (
                <div className="djv-entry-text djv-voice-entry">
                  {journalEntry.audioUrl && (
                    <audio
                      className="djv-voice-audio"
                      src={journalEntry.audioUrl}
                      controls
                      preload="metadata"
                    />
                  )}
                  {journalEntry.transcription && (
                    <p className="djv-voice-transcription">{journalEntry.transcription}</p>
                  )}
                </div>
              )}

              {/* Text Content Only */}
              {!journalEntry.isVoiceEntry && journalEntry.extractedText && (
                <div className="djv-entry-text">
                  <p>{journalEntry.extractedText}</p>
                </div>
              )}

              {/* Show message if entry has image but we don't display it */}
              {!journalEntry.isVoiceEntry && journalEntry.imageUrl && !journalEntry.extractedText && (
                <div className="djv-entry-text">
                  <p className="djv-image-note"><FileText size={14} strokeWidth={1.7} aria-hidden="true" /> {t('dailyJourney.uploadedNoText', 'You uploaded a journal entry for this day.')}</p>
                </div>
              )}

              {/* Analysis Section */}
              {journalEntry.analysis && (
                <div className="djv-analysis-section">
                  <div className="djv-analysis-header">
                    <Lightbulb size={18} style={{ color: pathColor }} />
                    <h4>{t('dailyJourney.insightsAndAnalysis', 'Insights & Analysis')}</h4>
                  </div>

                  {journalEntry.analysis.summary && (
                    <div className="djv-analysis-item">
                      <h5>{t('dailyJourney.summary', 'Summary')}</h5>
                      <p>{journalEntry.analysis.summary}</p>
                    </div>
                  )}

                  {journalEntry.analysis.insights && journalEntry.analysis.insights.length > 0 && (
                    <div className="djv-analysis-item">
                      <h5>{t('dailyJourney.keyInsights', 'Key Insights')}</h5>
                      <ul className="djv-insights-list">
                        {journalEntry.analysis.insights.map((insight, index) => (
                          <li key={index}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {journalEntry.analysis.practicalAction && (
                    <div className="djv-analysis-item djv-action-item">
                      <h5>{t('dailyJourney.suggestedAction', 'Suggested Action')}</h5>
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
              <h3>{t('dailyJourney.readyToReflect', 'Ready to reflect?')}</h3>
              <p>{t('dailyJourney.readyToReflectSubtitle', "Take a moment to explore today's prompt and share your thoughts.")}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {entryFetchError && !journalEntry && screenData?.fromArchive && (
          <div className="djv-card djv-error-card">
            <div className="djv-error-content">
              <AlertCircle size={32} />
              <h3>{t('dailyJourney.entryNotFoundTitle', 'Entry not found')}</h3>
              <p>{t('dailyJourney.entryNotFoundSubtitle', "We couldn't load this journal entry. Please try returning to the archive.")}</p>
            </div>
          </div>
        )}

        {/* Journey map — every day's prompt */}
        {renderJourneyDays()}
      </div>

      {/* Action Button */}
      <div className="djv-action-container">
        {screenData?.fromArchive ? (
          <button onClick={handleBack} className="djv-action-btn djv-secondary">
            <ArrowLeft size={18} />
            {t('dailyJourney.backToArchive', 'Back to Archive')}
          </button>
        ) : journalEntry ? (
          (() => {
            // Total days is authoritative from the path's day catalog, and the
            // next day must actually exist — guards against offering a
            // non-existent "Day N+1" if duration/day ever disagree.
            const totalDays = pathData.days?.length || pathData.duration || 0;
            const nextDay = currentDay + 1;
            const hasNextDay =
              nextDay <= totalDays &&
              (!pathData.days || pathData.days.some(d => d.day === nextDay));

            return (
              <button
                onClick={() => {
                  if (hasNextDay) {
                    onNavigate(pathId, nextDay);
                  } else {
                    navigateToScreen('journey-complete', { pathId });
                  }
                }}
                className="djv-action-btn djv-primary"
                style={{ backgroundColor: pathColor }}
              >
                {hasNextDay ? (
                  <>
                    {t('dailyJourney.continueToDay', 'Continue to Day {{day}}', { day: nextDay })}
                    <ChevronRight size={18} />
                  </>
                ) : (
                  <>
                    {t('dailyJourney.completeJourney', 'Complete Journey')}
                    <ArrowUpRight size={18} />
                  </>
                )}
              </button>
            );
          })()
        ) : (
          <button
            onClick={() => onUpload(pathId)}
            className="djv-action-btn djv-primary"
            style={{ backgroundColor: pathColor }}
          >
            {pathData.isVoiceJourney ? <Mic size={18} /> : <Camera size={18} />}
            {pathData.isVoiceJourney
              ? t('dailyJourney.startRecording', 'Start Recording')
              : t('dailyJourney.startWriting', 'Start Writing')}
          </button>
        )}
      </div>
    </div>
  );
};

export default DailyJourneyView;