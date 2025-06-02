// src/components/journey/AnalysisResults.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Brain, 
  Lightbulb, 
  HelpCircle, 
  Play, 
  BookOpen,
  FileText,
  BarChart,
  TrendingUp,
  PieChart,
  Heart,
  Zap,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Download,
  Share2,
  Calendar,
  Cloud,
  BarChart2,
  Activity,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { 
  analyzeJournalEntry, 
  saveAnalysisResult, 
  getJournalEntry,
  getPreviousEntries
} from '../../services/claudeService';
import { useAuth } from '../../contexts/AuthContext';
import JournalEntry from '../../models/JournalEntry';
import useErrorHandler from '../../hooks/useErrorHandler';
import { OFFLINE_OPERATIONS, queueOfflineOperation } from '../../utils/offlineManager';
import apiCacheService from '../../services/apiCacheService';
import AnalysisLoading from './AnalysisLoading';

// Enhanced visualization components
import ThemeCloud from '../analytics/ThemeCloud';
import JournalCalendar from '../analytics/JournalCalendar';
import InsightSummary from '../analytics/InsightSummary';
import EmotionTrends from '../analytics/EmotionTrends';

// Real data processing utilities
import { extractThemesFromEntries, extractEmotionData, analyzeConsistency } from '../../utils/textProcessing';

// Import export functionality
import { downloadFile } from '../../services/exportService';

// Import the new CSS
import '../../styles/components/ar.css';

// Mobile Tab Navigation Component
const MobileTabNavigation = ({ tabs, activeTab, onTabChange, className }) => {
  const [showAllTabs, setShowAllTabs] = useState(false);
  const tabsContainerRef = useRef(null);
  
  const visibleTabs = showAllTabs ? tabs : tabs.slice(0, 3);
  const hiddenTabsCount = tabs.length - 3;

  return (
    <div className={`ar-tab-nav ${className || ''}`}>
      <div className="ar-tab-nav__container" ref={tabsContainerRef}>
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`ar-tab-nav__tab ${activeTab === tab.id ? 'ar-tab-nav__tab--active' : ''}`}
            aria-selected={activeTab === tab.id}
          >
            <tab.icon className="ar-tab-nav__icon" size={18} />
            <span className="ar-tab-nav__label">{tab.label}</span>
          </button>
        ))}
        
        {hiddenTabsCount > 0 && (
          <button
            onClick={() => setShowAllTabs(!showAllTabs)}
            className="ar-tab-nav__tab ar-tab-nav__tab--more"
            aria-label={showAllTabs ? 'Show fewer tabs' : `Show ${hiddenTabsCount} more tabs`}
          >
            <MoreHorizontal className="ar-tab-nav__icon" size={18} />
            <span className="ar-tab-nav__label">
              {showAllTabs ? 'Less' : `+${hiddenTabsCount}`}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

// Enhanced Image Carousel Component
const EnhancedImageCarousel = ({ images, activeIndex, setActiveIndex, className }) => {
  const [imageLoaded, setImageLoaded] = useState({});
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  if (!images || images.length === 0) return null;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && activeIndex < images.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
    if (isRightSwipe && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleImageLoad = (index) => {
    setImageLoaded(prev => ({ ...prev, [index]: true }));
  };

  if (images.length <= 1) {
    return (
      <div className={`ar-image-carousel ar-image-carousel--single ${className || ''}`}>
        <div className="ar-image-carousel__wrapper">
          {!imageLoaded[0] && <div className="ar-image-carousel__skeleton" />}
          <img 
            src={images[0]} 
            alt="Journal page" 
            className="ar-image-carousel__image"
            onLoad={() => handleImageLoad(0)}
            style={{ opacity: imageLoaded[0] ? 1 : 0 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`ar-image-carousel ar-image-carousel--multi ${className || ''}`}>
      <div 
        className="ar-image-carousel__slider"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="ar-image-carousel__wrapper">
          {!imageLoaded[activeIndex] && <div className="ar-image-carousel__skeleton" />}
          <img 
            src={images[activeIndex]} 
            alt={`Journal page ${activeIndex + 1}`} 
            className="ar-image-carousel__image"
            onLoad={() => handleImageLoad(activeIndex)}
            style={{ opacity: imageLoaded[activeIndex] ? 1 : 0 }}
          />
        </div>
        
        <div className="ar-image-carousel__indicator">
          <span className="ar-image-carousel__current">{activeIndex + 1}</span>
          <span className="ar-image-carousel__separator">/</span>
          <span className="ar-image-carousel__total">{images.length}</span>
        </div>
        
        <div className="ar-image-carousel__controls">
          <button 
            onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className="ar-image-carousel__nav ar-image-carousel__nav--prev"
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            onClick={() => setActiveIndex(Math.min(images.length - 1, activeIndex + 1))}
            disabled={activeIndex === images.length - 1}
            className="ar-image-carousel__nav ar-image-carousel__nav--next"
            aria-label="Next page"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      {images.length > 1 && (
        <div className="ar-image-carousel__thumbnails">
          {images.map((img, index) => (
            <button
              key={index}
              className={`ar-image-carousel__thumb ${index === activeIndex ? 'ar-image-carousel__thumb--active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to page ${index + 1}`}
            >
              <img src={img} alt={`Page ${index + 1} thumbnail`} />
              {!imageLoaded[index] && <div className="ar-image-carousel__thumb-skeleton" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Real Data Processing Hook
const useRealJournalData = (userId, pathId, currentDay) => {
  const [data, setData] = useState({
    entries: [],
    themes: [],
    emotions: [],
    calendar: [],
    consistency: null,
    insights: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!userId) return;

    const fetchRealData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        const entries = await getPreviousEntries(userId, pathId);
        
        if (entries.length === 0) {
          setData({
            entries: [],
            themes: [],
            emotions: [],
            calendar: [],
            consistency: null,
            insights: null,
            loading: false,
            error: null
          });
          return;
        }

        const themes = extractThemesFromEntries(entries);
        const emotionData = extractEmotionData(entries);
        const consistencyData = analyzeConsistency(entries);
        
        const calendarData = entries.map(entry => ({
          date: entry.timestamp ? 
            new Date(entry.timestamp.toDate()).toISOString().split('T')[0] :
            new Date().toISOString().split('T')[0],
          count: 1,
          day: entry.day,
          pathId: entry.pathId
        }));

        const insights = {
          totalEntries: entries.length,
          completionRate: Math.round((entries.length / getJourneyTotalDays(pathId)) * 100),
          commonThemes: themes.slice(0, 5).map(theme => theme.text),
          emotionalInsight: generateEmotionalInsight(emotionData),
          growthAreas: generateGrowthAreas(entries),
          recommendation: generateRecommendation(entries, pathId)
        };

        setData({
          entries,
          themes,
          emotions: emotionData.emotions || [],
          calendar: calendarData,
          consistency: consistencyData,
          insights,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error fetching real journal data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    };

    fetchRealData();
  }, [userId, pathId, currentDay]);

  return data;
};

// Helper functions
const getJourneyTotalDays = (pathId) => {
  const pathDays = {
    'transformation-journey': 21,
    'habit-formation': 30,
    'creative-expression': 14,
    'life-vision': 100,
    'emotional-intelligence': 10,
    'mindfulness-awareness': 10,
    'self-discovery': 10
  };
  return pathDays[pathId] || 10;
};

const generateEmotionalInsight = (emotionData) => {
  if (!emotionData.emotions || emotionData.emotions.length === 0) {
    return "Continue journaling to track your emotional patterns over time.";
  }
  
  const topEmotion = emotionData.emotions[0];
  const emotionCount = emotionData.emotions.length;
  
  return `Your writing shows ${topEmotion.name.toLowerCase()} as a prominent emotion, along with ${emotionCount - 1} other emotional themes. This emotional awareness is a key part of your growth journey.`;
};

const generateGrowthAreas = (entries) => {
  if (entries.length < 3) {
    return ["Continue building your journaling habit for deeper insights"];
  }
  
  return [
    "You've shown consistent engagement with self-reflection",
    "Your emotional awareness is developing through regular practice",
    "Continue exploring deeper connections between thoughts and feelings"
  ];
};

const generateRecommendation = (entries, pathId) => {
  if (entries.length < 5) {
    return "Keep writing regularly to build momentum and discover deeper patterns in your thoughts and feelings.";
  }
  
  const pathRecommendations = {
    'emotional-intelligence': "Focus on identifying emotional triggers and developing regulation strategies in your future entries.",
    'mindfulness-awareness': "Try incorporating more present-moment observations and sensory details in your writing.",
    'self-discovery': "Consider exploring how your values and beliefs influence your daily experiences.",
    'transformation-journey': "Reflect on the changes you're noticing and the patterns you want to continue breaking."
  };
  
  return pathRecommendations[pathId] || "Continue exploring the themes that resonate most deeply with you.";
};

const getPathName = (pathId) => {
  const pathNames = {
    'emotional-intelligence': 'Emotional Intelligence Expedition',
    'mindfulness-awareness': 'Mindfulness & Present Awareness',
    'transformation-journey': 'Transformation Journey: Breaking Patterns',
    'creative-expression': 'Creative Expression',
    'habit-formation': 'Habit Formation',
    'life-vision': 'Life Vision & Purpose',
    'self-discovery': 'Self-Discovery Journey'
  };
  return pathNames[pathId] || 'Self-Discovery Journey';
};

// Export single entry as text
const exportSingleEntryAsText = (dayNumber, pathId, prompt, theme, extractedText, analysisResult) => {
  const pathName = getPathName(pathId);
  const date = new Date().toLocaleDateString();
  
  let content = `# ${pathName} - Day ${dayNumber}\n\n`;
  content += `Generated on ${date}\n\n`;
  content += `## ${theme}\n\n`;
  
  if (prompt) {
    content += `**Prompt:** ${prompt}\n\n`;
  }
  
  if (extractedText) {
    content += `**Journal Entry:**\n${extractedText}\n\n`;
  }
  
  if (analysisResult) {
    content += `## Analysis\n\n`;
    
    if (analysisResult.summary) {
      content += `**Summary:**\n${analysisResult.summary}\n\n`;
    }
    
    if (analysisResult.insights && analysisResult.insights.length > 0) {
      content += `**Key Insights:**\n`;
      analysisResult.insights.forEach((insight, index) => {
        content += `${index + 1}. ${insight}\n`;
      });
      content += '\n';
    }
    
    if (analysisResult.reflectionQuestion) {
      content += `**Reflection Question:**\n${analysisResult.reflectionQuestion}\n\n`;
    }
    
    if (analysisResult.practicalAction) {
      content += `**Suggested Action:**\n${analysisResult.practicalAction}\n\n`;
    }
    
    if (analysisResult.affirmation) {
      content += `**Affirmation:**\n"${analysisResult.affirmation}"\n\n`;
    }
  }
  
  content += `---\n\nGenerated by Καιρός Smart Journal\nwww.kairos-journal.com`;
  
  return content;
};

// Main Enhanced AnalysisResults Component
const AnalysisResults = ({ 
  dayNumber, 
  pathId,
  prompt,
  theme,
  imageUrl,
  extractedText = "",
  textOnly = false,
  isMultiPage = false,
  additionalImages = [],
  imageFiles = null,
  onBack,
  onNext
}) => {
  const { currentUser, userProfile } = useAuth();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analyzingProgress, setAnalyzingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('insights');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  
  const realData = useRealJournalData(currentUser?.uid, pathId, dayNumber);
  
  const { error: errorState, handleError, clearError } = useErrorHandler();
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (errorState) {
      setError(errorState.message);
    } else {
      setError(null);
    }
  }, [errorState]);

  const allImages = useMemo(() => {
    return imageUrl ? [imageUrl, ...additionalImages] : [];
  }, [imageUrl, additionalImages]);

  const journalEntry = useMemo(() => {
    return new JournalEntry({
      day: dayNumber,
      pathId,
      imageUrl,
      extractedText,
      prompt,
      theme,
      isTextOnly: textOnly || (!imageUrl && !!extractedText)
    });
  }, [dayNumber, pathId, imageUrl, extractedText, prompt, theme, textOnly]);

  const tabs = [
    { id: 'insights', label: 'Insights', icon: Lightbulb },
    { id: 'reflection', label: 'Reflect', icon: HelpCircle },
    { id: 'action', label: 'Action', icon: Play },
    { id: 'visualize', label: 'Charts', icon: BarChart },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'journal', label: 'Entry', icon: BookOpen }
  ];

  // Analysis effect with improved caching
  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!currentUser || !journalEntry.hasContent()) {
        setError('No journal entry provided. Please go back and upload your journal entry or enter text manually.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      clearError();
      
      const progressInterval = setInterval(() => {
        setAnalyzingProgress(prev => Math.min(prev + (Math.random() * 5), 90));
      }, 300);

      try {
        const cacheKey = `analysis_${currentUser.uid}_${pathId}_${dayNumber}`;
        const cachedAnalysis = apiCacheService.getFromCache(cacheKey);
        
        if (cachedAnalysis) {
          setAnalysisResult(cachedAnalysis);
          setAnalyzingProgress(100);
          setTimeout(() => setIsLoading(false), 500);
          clearInterval(progressInterval);
          return;
        }

        const existingEntry = await getJournalEntry(currentUser.uid, dayNumber, pathId);
        if (existingEntry?.analysis) {
          apiCacheService.storeInCache(cacheKey, existingEntry.analysis);
          setAnalysisResult(existingEntry.analysis);
          setAnalyzingProgress(100);
          setTimeout(() => setIsLoading(false), 500);
          clearInterval(progressInterval);
          return;
        }

        const result = await analyzeJournalEntry(
          journalEntry.imageUrl,
          journalEntry.prompt,
          journalEntry.theme,
          userProfile,
          journalEntry.day,
          journalEntry.extractedText,
          journalEntry.pathId,
          isMultiPage,
          imageFiles
        );

        apiCacheService.storeInCache(cacheKey, result);
        setAnalysisResult(result);

        if (navigator.onLine) {
          await saveAnalysisResult(
            currentUser.uid, 
            journalEntry.day, 
            result, 
            journalEntry.imageUrl, 
            journalEntry.pathId
          );
        } else {
          queueOfflineOperation(OFFLINE_OPERATIONS.SAVE_ANALYSIS, {
            userId: currentUser.uid,
            day: journalEntry.day,
            analysisResult: result,
            imageUrl: journalEntry.imageUrl,
            pathId: journalEntry.pathId
          });
        }

        setAnalyzingProgress(100);
      } catch (error) {
        handleError(error, 'analysis', { 
          day: journalEntry.day, 
          pathId: journalEntry.pathId
        });
      } finally {
        clearInterval(progressInterval);
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    fetchAnalysis();
  }, [currentUser?.uid, journalEntry.day, journalEntry.pathId, imageFiles]);

  // Export functionality
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const content = exportSingleEntryAsText(
        dayNumber, 
        pathId, 
        prompt, 
        theme, 
        extractedText, 
        analysisResult
      );
      
      const pathName = getPathName(pathId);
      const filename = `${pathName}_Day_${dayNumber}_${new Date().toISOString().split('T')[0]}.txt`;
      
      await downloadFile(content, filename, 'text/plain');
      
      // Show success feedback
      alert('Export completed successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Share functionality
  const handleShare = () => {
    if (navigator.share) {
      const shareData = {
        title: `Day ${dayNumber}: ${theme}`,
        text: `I just completed Day ${dayNumber} of my ${getPathName(pathId)} with Καιρός Smart Journal!`,
        url: window.location.href
      };
      
      navigator.share(shareData).catch(err => {
        console.log('Error sharing:', err);
        handleFallbackShare();
      });
    } else {
      handleFallbackShare();
    }
  };

  const handleFallbackShare = () => {
    const shareText = `I just completed Day ${dayNumber} of my ${getPathName(pathId)} with Καιρός Smart Journal! 🌟`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Share text copied to clipboard!');
      }).catch(() => {
        prompt('Copy this text to share:', shareText);
      });
    } else {
      prompt('Copy this text to share:', shareText);
    }
  };

  // Loading state
  if (isLoading) {
    return <AnalysisLoading progress={analyzingProgress} />;
  }

  // Error state
  if (error) {
    return (
      <div className="ar-container">
        <div className="ar-header">
          <button onClick={onBack} className="ar-header__back-btn">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>
        
        <div className="ar-error">
          <AlertCircle className="ar-error__icon" size={48} />
          <h2 className="ar-error__title">Analysis Error</h2>
          <p className="ar-error__message">{error}</p>
          <button onClick={onBack} className="ar-error__retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'insights':
        return (
          <div className="ar-content ar-content--insights">
            <div className="ar-card ar-card--summary">
              <div className="ar-card__header">
                <Brain className="ar-card__icon" size={20} />
                <h3 className="ar-card__title">Summary</h3>
              </div>
              <div className="ar-card__content">
                <p className="ar-card__text">{analysisResult.summary}</p>
              </div>
            </div>
            
            <div className="ar-card ar-card--insights">
              <div className="ar-card__header">
                <Lightbulb className="ar-card__icon" size={20} />
                <h3 className="ar-card__title">Key Insights</h3>
              </div>
              <div className="ar-card__content">
                <div className="ar-insights">
                  {analysisResult.insights.map((insight, index) => (
                    <div key={index} className="ar-insights__item">
                      <span className="ar-insights__number">{index + 1}</span>
                      <span className="ar-insights__text">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="ar-card ar-card--affirmation">
              <div className="ar-card__header">
                <div className="ar-sparkle-wrapper">
                  <Sparkles className="ar-card__icon" size={20} />
                  <div className="ar-sparkle-1"></div>
                  <div className="ar-sparkle-2"></div>
                  <div className="ar-sparkle-3"></div>
                </div>
                <h3 className="ar-card__title">Your Affirmation</h3>
              </div>
              <div className="ar-card__content">
                <div className="ar-affirmation">
                  {analysisResult.affirmation}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'reflection':
        return (
          <div className="ar-content ar-content--reflection">
            <div className="ar-reflection">
              <div className="ar-reflection__icon-wrapper">
                <HelpCircle size={32} />
              </div>
              <h3 className="ar-reflection__title">Reflection Question</h3>
              <p className="ar-reflection__question">{analysisResult.reflectionQuestion}</p>
              
              <div className="ar-reflection__suggestions">
                <h4 className="ar-reflection__suggestions-title">Consider exploring this through:</h4>
                <ul className="ar-reflection__suggestions-list">
                  <li className="ar-reflection__suggestion">
                    <BookOpen size={16} /> 
                    <span>Writing a follow-up response</span>
                  </li>
                  <li className="ar-reflection__suggestion">
                    <Heart size={16} /> 
                    <span>Discussing with a trusted friend</span>
                  </li>
                  <li className="ar-reflection__suggestion">
                    <Zap size={16} /> 
                    <span>Quiet meditation or mindfulness</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
        
      case 'action':
        return (
          <div className="ar-content ar-content--action">
            <div className="ar-action">
              <div className="ar-action__icon-wrapper">
                <Play size={32} />
              </div>
              <h3 className="ar-action__title">Suggested Action</h3>
              <div className="ar-action__text">{analysisResult.practicalAction}</div>
              <p className="ar-action__description">
                Small, consistent actions create meaningful change over time.
              </p>
              <button className="ar-action__btn">
                <Play size={16} />
                <span>Set a Reminder</span>
              </button>
            </div>
          </div>
        );
        
      case 'visualize':
        return (
          <div className="ar-content ar-content--visualize">
            <div className="ar-viz-grid">
              <div className="ar-card ar-card--viz">
                <div className="ar-card__header">
                  <BarChart2 className="ar-card__icon" size={20} />
                  <h3 className="ar-card__title">Emotion Trends</h3>
                </div>
                <div className="ar-card__content">
                  <EmotionTrends 
                    data={realData.emotions} 
                    simplified={false}
                    isDarkMode={true}
                  />
                </div>
              </div>
              
              <div className="ar-card ar-card--viz">
                <div className="ar-card__header">
                  <Cloud className="ar-card__icon" size={20} />
                  <h3 className="ar-card__title">Theme Cloud</h3>
                </div>
                <div className="ar-card__content">
                  <ThemeCloud 
                    data={realData.themes} 
                    simplified={false}
                    isDarkMode={true}
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'analytics':
        return (
          <div className="ar-content ar-content--analytics">
            <div className="ar-analytics-grid">
              <div className="ar-card ar-card--analytics">
                <div className="ar-card__header">
                  <Calendar className="ar-card__icon" size={20} />
                  <h3 className="ar-card__title">Journal Activity</h3>
                </div>
                <div className="ar-card__content">
                  <JournalCalendar 
                    data={realData.calendar} 
                    simplified={false}
                  />
                </div>
              </div>
              
              <div className="ar-card ar-card--analytics">
                <div className="ar-card__header">
                  <Activity className="ar-card__icon" size={20} />
                  <h3 className="ar-card__title">Journey Insights</h3>
                </div>
                <div className="ar-card__content">
                  <InsightSummary 
                    entries={realData.entries} 
                    progressReport={realData.insights}
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'journal':
        return (
          <div className="ar-content ar-content--journal">
            <div className="ar-card ar-card--journal">
              <div className="ar-journal__header">
                <h3 className="ar-journal__title">Your Journal Entry</h3>
                <div className="ar-journal__prompt">
                  <span className="ar-journal__prompt-label">Today's Prompt</span>
                  <span className="ar-journal__prompt-text">"{prompt}"</span>
                </div>
              </div>
              
              {journalEntry.imageUrl ? (
                <EnhancedImageCarousel 
                  images={allImages}
                  activeIndex={activeImageIndex}
                  setActiveIndex={setActiveImageIndex}
                />
              ) : (
                <div className="ar-journal__text-only">
                  <FileText size={32} />
                  <p>Text-only journal entry</p>
                </div>
              )}
              
              {journalEntry.extractedText && (
                <div className="ar-journal__extracted">
                  <h4 className="ar-journal__extracted-title">
                    <FileText size={18} />
                    {journalEntry.isTextOnly ? "Your Journal Text" : "Extracted Text"}
                  </h4>
                  <div className="ar-journal__extracted-text">{journalEntry.extractedText}</div>
                </div>
              )}
              
              <div className="ar-journal__footer">
                <div className="ar-journal__info">
                  <span className="ar-journal__path">{getPathName(pathId)}</span>
                  <span className="ar-journal__theme">{journalEntry.theme}</span>
                </div>
                <div className="ar-journal__day">Day {journalEntry.day}</div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="ar-container">
      {/* Header */}
      <div className="ar-header">
        <button onClick={onBack} className="ar-header__back-btn">
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        
        <div className="ar-header__info">
          <h2 className="ar-header__title">Day {dayNumber} Analysis</h2>
          <div className="ar-header__meta">
            <span className="ar-header__path">{getPathName(pathId)}</span>
            <span className="ar-header__separator">•</span>
            <span className="ar-header__theme">{theme}</span>
          </div>
        </div>

        {isMultiPage && (
          <div className="ar-header__multi-indicator">
            <BookOpen size={16} />
            <span>{allImages.length} pages</span>
          </div>
        )}
      </div>
      
      {/* Tab Navigation */}
      <MobileTabNavigation 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {/* Tab Content */}
      <div className="ar-main">
        {renderTabContent()}
      </div>
      
      {/* Action Buttons */}
      <div className="ar-actions">
        <button 
          className="ar-actions__btn ar-actions__btn--secondary"
          onClick={handleExport}
          disabled={isExporting}
        >
          <Download size={16} />
          <span>{isExporting ? 'Exporting...' : 'Export'}</span>
        </button>
        <button 
          className="ar-actions__btn ar-actions__btn--secondary"
          onClick={handleShare}
        >
          <Share2 size={16} />
          <span>Share</span>
        </button>
        <button onClick={onNext} className="ar-actions__btn ar-actions__btn--primary">
          <span>Continue to Day {dayNumber + 1}</span>
          <ArrowRight size={16} />
        </button>
      </div>
      
      {/* Progress Indicator */}
      <div className="ar-progress">
        <div className="ar-progress__info">
          <span className="ar-progress__label">Journey Progress</span>
          <span className="ar-progress__value">{dayNumber} completed</span>
        </div>
        <div className="ar-progress__bar">
          <div 
            className="ar-progress__fill"
            style={{ width: `${(dayNumber / getJourneyTotalDays(pathId)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;