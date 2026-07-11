// src/components/journey/AnalysisResults.jsx
// Apple Spatial Glass design – glass cards, no hard shadows, GPU animations

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, ArrowRight, Brain, Lightbulb, HelpCircle, Play, BookOpen,
  FileText, BarChart, TrendingUp, PieChart, Heart, Zap, ThumbsUp, ThumbsDown,
  AlertCircle, Sparkles, ExternalLink, Download, Share2, Calendar, Cloud,
  BarChart2, Activity, ChevronLeft, ChevronRight, MoreHorizontal, Volume2
} from 'lucide-react';
import {
  analyzeJournalEntry, saveAnalysisResult, getJournalEntry, getPreviousEntries,
  getPathName
} from '../../services/claudeService';
import { downloadFile, exportSingleEntryToPDF, getMoodForDate, dateKeyFromDate } from '../../services/exportService';
import { getJourneyPath } from '../../data/JourneyData';
import { useAuth } from '../../contexts/AuthContext';
import JournalEntry from '../../models/JournalEntry';
import useErrorHandler from '../../hooks/useErrorHandler';
import { OFFLINE_OPERATIONS, queueOfflineOperation } from '../../utils/offlineManager';
import apiCacheService from '../../services/apiCacheService';
import AnalysisLoading from './AnalysisLoading';
import ThemeCloud from '../analytics/ThemeCloud';
import JournalCalendar from '../analytics/JournalCalendar';
import InsightSummary from '../analytics/InsightSummary';
import EmotionTrends from '../analytics/EmotionTrends';
import { extractThemesFromEntries, extractEmotionData, analyzeConsistency } from '../../utils/textProcessing';
import '../../styles/components/ar.css';

// Mobile Tab Navigation (glass styled)
const MobileTabNavigation = ({ tabs, activeTab, onTabChange }) => {
  const { t } = useTranslation('journey');
  const [showAllTabs, setShowAllTabs] = useState(false);
  const visibleTabs = showAllTabs ? tabs : tabs.slice(0, 3);
  const hiddenCount = tabs.length - 3;

  return (
    <div className="glass-tab-nav">
      <div className="glass-tab-nav__container">
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`glass-tab ${activeTab === tab.id ? 'glass-tab--active' : ''}`}
          >
            <tab.icon size={18} className="glass-tab__icon" />
            <span className="glass-tab__label">{tab.label}</span>
          </button>
        ))}
        {hiddenCount > 0 && (
          <button
            onClick={() => setShowAllTabs(!showAllTabs)}
            className="glass-tab glass-tab--more"
          >
            <MoreHorizontal size={18} />
            <span className="glass-tab__label">{showAllTabs ? t('analysisResults.less', 'Less') : `+${hiddenCount}`}</span>
          </button>
        )}
      </div>
    </div>
  );
};

// Enhanced Image Carousel (glass version)
const EnhancedImageCarousel = ({ images, activeIndex, setActiveIndex }) => {
  const [imageLoaded, setImageLoaded] = useState({});
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  if (!images?.length) return null;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeIndex < images.length - 1) setActiveIndex(activeIndex + 1);
      if (diff < 0 && activeIndex > 0) setActiveIndex(activeIndex - 1);
    }
  };

  const handleImageLoad = (idx) => setImageLoaded(prev => ({ ...prev, [idx]: true }));

  if (images.length === 1) {
    return (
      <div className="glass-carousel glass-carousel--single">
        <div className="glass-carousel__wrapper">
          {!imageLoaded[0] && <div className="glass-carousel__skeleton" />}
          <img src={images[0]} alt="Journal" className="glass-carousel__image" onLoad={() => handleImageLoad(0)} />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-carousel">
      <div className="glass-carousel__slider" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        <div className="glass-carousel__wrapper">
          {!imageLoaded[activeIndex] && <div className="glass-carousel__skeleton" />}
          <img src={images[activeIndex]} alt={`Page ${activeIndex+1}`} className="glass-carousel__image" onLoad={() => handleImageLoad(activeIndex)} />
        </div>
        <div className="glass-carousel__indicator">{activeIndex+1} / {images.length}</div>
        <div className="glass-carousel__controls">
          <button onClick={() => setActiveIndex(Math.max(0, activeIndex-1))} disabled={activeIndex===0} className="glass-carousel__nav">‹</button>
          <button onClick={() => setActiveIndex(Math.min(images.length-1, activeIndex+1))} disabled={activeIndex===images.length-1} className="glass-carousel__nav">›</button>
        </div>
      </div>
      <div className="glass-carousel__thumbnails">
        {images.map((img, idx) => (
          <button key={idx} className={`glass-carousel__thumb ${idx===activeIndex ? 'active' : ''}`} onClick={() => setActiveIndex(idx)}>
            <img src={img} alt={`thumb ${idx+1}`} />
          </button>
        ))}
      </div>
    </div>
  );
};

// Journey's total day count, derived from the actual path catalog
const getJourneyTotalDays = (pathId) => getJourneyPath(pathId)?.duration || 10;

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
    'transformation-journey': "Reflect on the changes you're noticing and the patterns you want to continue breaking.",
    'voice-discovery': "Continue exploring the power of vocal expression and the authenticity it brings to your reflections."
  };
  return pathRecommendations[pathId] || "Continue exploring the themes that resonate most deeply with you.";
};

// Real Data Hook – powers the Visualize/Analytics tabs
const useRealJournalData = (userId, pathId, currentDay) => {
  const [data, setData] = useState({
    entries: [], themes: [], emotions: [], calendar: [],
    consistency: null, insights: null, loading: true, error: null
  });

  useEffect(() => {
    if (!userId) return;

    const fetchRealData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        const entries = await getPreviousEntries(userId, pathId);

        if (entries.length === 0) {
          setData({ entries: [], themes: [], emotions: [], calendar: [], consistency: null, insights: null, loading: false, error: null });
          return;
        }

        const themes = extractThemesFromEntries(entries);
        const emotionData = extractEmotionData(entries);
        const consistencyData = analyzeConsistency(entries);

        const calendarData = entries.map(entry => ({
          date: entry.timestamp
            ? new Date(entry.timestamp.toDate()).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
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
        setData(prev => ({ ...prev, loading: false, error: error.message }));
      }
    };

    fetchRealData();
  }, [userId, pathId, currentDay]);

  return data;
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Main Component
const AnalysisResults = ({ dayNumber, pathId, prompt, theme, imageUrl, extractedText = "", textOnly = false, isMultiPage = false, additionalImages = [], imageFiles = null, onBack, onNext, analysisResult: passedAnalysisResult = null, isVoiceEntry = false, voiceData = null }) => {
  const { t, i18n } = useTranslation('journey');
  const { currentUser, userProfile, refreshUserProfile } = useAuth();
  const [analysisResult, setAnalysisResult] = useState(passedAnalysisResult);
  const [isLoading, setIsLoading] = useState(!passedAnalysisResult);
  const [analyzingProgress, setAnalyzingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('insights');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [entryDate, setEntryDate] = useState(null); // real entry date, when known — used to look up that day's mood for the PDF export
  const realData = useRealJournalData(currentUser?.uid, pathId, dayNumber);
  const { error: errorState, handleError, clearError } = useErrorHandler();
  const [error, setError] = useState(null);

  useEffect(() => { setError(errorState?.message || null); }, [errorState]);

  const allImages = useMemo(() => imageUrl ? [imageUrl, ...additionalImages] : [], [imageUrl, additionalImages]);
  const journalEntry = useMemo(() => new JournalEntry({ day: dayNumber, pathId, imageUrl: isVoiceEntry ? null : imageUrl, extractedText: isVoiceEntry ? voiceData?.transcription || extractedText : extractedText, prompt, theme, isTextOnly: isVoiceEntry || textOnly || (!imageUrl && !!extractedText), isVoiceEntry, voiceData }), [dayNumber, pathId, imageUrl, extractedText, prompt, theme, textOnly, isVoiceEntry, voiceData]);

  // Tabs for the mobile tab navigation (icons chosen from lucide-react)
  const tabs = useMemo(() => [
    { id: 'insights', label: t('analysisResults.tabInsights', 'Insights'), icon: Lightbulb },
    { id: 'reflection', label: t('analysisResults.tabReflection', 'Reflection'), icon: BookOpen },
    { id: 'action', label: t('analysisResults.tabAction', 'Action'), icon: Zap },
    { id: 'visualize', label: t('analysisResults.tabVisualize', 'Visualize'), icon: BarChart2 },
    { id: 'analytics', label: t('analysisResults.tabAnalytics', 'Analytics'), icon: BarChart },
    { id: 'journal', label: t('analysisResults.tabJournal', 'Journal'), icon: FileText }
  ], [t]);

  // Analysis effect – fetch cached / existing / freshly-generated analysis
  useEffect(() => {
    if (passedAnalysisResult) { setAnalysisResult(passedAnalysisResult); setIsLoading(false); return; }
    const fetchAnalysis = async () => {
      if (!currentUser) { setError(t('analysisResults.errorLogin', 'Please log in to view analysis.')); setIsLoading(false); return; }
      const hasContent = isVoiceEntry ? (voiceData?.transcription || extractedText) : journalEntry.hasContent();
      if (!hasContent) { setError(t('analysisResults.errorNoEntry', 'No journal entry found.')); setIsLoading(false); return; }
      setIsLoading(true); clearError();
      const progressInterval = setInterval(() => setAnalyzingProgress(p => Math.min(p + (Math.random()*5), 90)), 300);
      try {
        const cacheKey = `analysis_${currentUser.uid}_${pathId}_${dayNumber}_${i18n.language}`;
        const cached = apiCacheService.getFromCache(cacheKey);
        if (cached) { setAnalysisResult(cached); setAnalyzingProgress(100); setTimeout(() => setIsLoading(false), 500); clearInterval(progressInterval); return; }
        const existing = await getJournalEntry(currentUser.uid, dayNumber, pathId);
        if (existing?.analysis) {
          if (existing.timestamp?.toDate) setEntryDate(existing.timestamp.toDate());
          apiCacheService.storeInCache(cacheKey, existing.analysis); setAnalysisResult(existing.analysis); setAnalyzingProgress(100); setTimeout(() => setIsLoading(false), 500); clearInterval(progressInterval); return;
        }
        const result = await analyzeJournalEntry(isVoiceEntry ? null : journalEntry.imageUrl, journalEntry.prompt, journalEntry.theme, userProfile, journalEntry.day, isVoiceEntry ? (voiceData?.transcription || extractedText) : journalEntry.extractedText, journalEntry.pathId, isMultiPage, imageFiles, isVoiceEntry ? voiceData : null);
        apiCacheService.storeInCache(cacheKey, result);
        setAnalysisResult(result);
        setEntryDate(new Date()); // freshly generated — this is happening right now
        if (navigator.onLine) {
          await saveAnalysisResult(currentUser.uid, journalEntry.day, result, isVoiceEntry ? null : journalEntry.imageUrl, journalEntry.pathId, isVoiceEntry);
          // Refresh the in-memory profile so Paths/Profile/Home reflect this
          // entry's progress without a manual reload.
          if (refreshUserProfile) await refreshUserProfile();
        }
        setAnalyzingProgress(100);
      } catch (err) { handleError(err, 'analysis', { day: journalEntry.day, pathId: journalEntry.pathId, isVoiceEntry }); } finally { clearInterval(progressInterval); setTimeout(() => setIsLoading(false), 500); }
    };
    fetchAnalysis();
  }, [currentUser?.uid, journalEntry.day, journalEntry.pathId, imageFiles, isVoiceEntry, voiceData, passedAnalysisResult]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const pathName = getPathName(pathId);
      const entryText = isVoiceEntry ? (voiceData?.transcription || extractedText) : extractedText;

      const pathInfo = getJourneyPath(pathId);
      const pathColor = pathInfo?.color ? pathInfo.color.split(',').map((n) => parseInt(n.trim(), 10)) : null;
      const pathDuration = pathInfo?.duration || null;

      // That day's "inner aura" check-in, if any — reused as the PDF's
      // mood glyph since there's no real per-entry meteorological
      // data stored (see MoodWeather.jsx / the mood check-in feature).
      const moodId = await getMoodForDate(currentUser?.uid, dateKeyFromDate(entryDate || new Date()));
      const mood = moodId ? { id: moodId, label: t(`innerAura.${moodId}`, moodId) } : null;

      // Localized labels — the AI content is already in the user's language;
      // these labels keep the section headings consistent with it.
      const strings = {
        tagline: t('analysisResults.pdfTagline', 'Smart Journal'),
        dayHeading: t('analysisResults.dayLabel', 'Day {{day}}', { day: dayNumber }),
        generatedOn: t('analysisResults.pdfGeneratedOn', 'Generated {{date}}', {
          date: new Date().toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' })
        }),
        promptLabel: t('analysisResults.pdfPromptLabel', 'Prompt'),
        entryLabel: t('analysisResults.pdfEntryLabel', 'Journal Entry'),
        transcriptionLabel: t('analysisResults.voiceTranscription', 'Voice Transcription'),
        voiceMeta: isVoiceEntry
          ? t('analysisResults.durationWords', 'Duration: {{duration}} • Words: {{words}}', {
              duration: formatTime(voiceData?.duration || 0),
              words: voiceData?.wordCount || 0
            })
          : null,
        summaryLabel: t('analysisResults.pdfSummaryLabel', 'Summary'),
        insightsLabel: t('analysisResults.keyInsightsTitle', 'Key Insights'),
        reflectionLabel: t('analysisResults.questionTitle', 'A Question to Explore'),
        actionLabel: t('analysisResults.nextStepTitle', 'Your Next Step'),
        affirmationLabel: t('analysisResults.pdfAffirmationLabel', 'Affirmation'),
        dayChipLabel: t('analysisResults.pdfDayChipLabel', 'Day'),
        wordsChipLabel: t('analysisResults.pdfWordsChipLabel', 'Words'),
        durationChipLabel: t('analysisResults.pdfDurationChipLabel', 'Duration'),
        durationValue: isVoiceEntry ? formatTime(voiceData?.duration || 0) : null,
        completeChipLabel: t('analysisResults.pdfCompleteChipLabel', 'Complete'),
        entryTypeChipLabel: isVoiceEntry
          ? t('analysisResults.pdfVoiceChip', 'Voice')
          : t('analysisResults.pdfWrittenChip', 'Written'),
        progressCaption: t('analysisResults.pdfProgressCaption', '{{percent}}% of journey')
      };

      const blob = exportSingleEntryToPDF({
        dayNumber,
        pathName,
        pathColor,
        pathDuration,
        theme,
        prompt,
        entryText,
        isVoiceEntry,
        analysis: analysisResult,
        mood,
        strings
      });

      const entryType = isVoiceEntry ? 'Voice' : 'Journal';
      const filename = `${pathName}_${entryType}_Day_${dayNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
      await downloadFile(blob, filename, 'application/pdf');
      alert(t('analysisResults.exportSuccess', 'Export completed successfully!'));
    } catch (err) {
      console.error('Export failed:', err);
      alert(t('analysisResults.exportFailed', 'Export failed. Please try again.'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleFallbackShare = (shareText) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        alert(t('analysisResults.shareCopied', 'Share text copied to clipboard!'));
      }).catch(() => {
        window.prompt(t('analysisResults.shareCopyPrompt', 'Copy this text to share:'), shareText);
      });
    } else {
      window.prompt(t('analysisResults.shareCopyPrompt', 'Copy this text to share:'), shareText);
    }
  };

  const handleShare = () => {
    const entryType = isVoiceEntry ? 'voice journal' : 'journal';
    const shareText = `I just completed Day ${dayNumber} of my ${getPathName(pathId)} with a ${entryType} entry using Καιρός Smart Journal! 🎤✨`;
    if (navigator.share) {
      navigator.share({ title: `Day ${dayNumber}: ${theme}`, text: shareText, url: window.location.href })
        .catch(() => handleFallbackShare(shareText));
    } else {
      handleFallbackShare(shareText);
    }
  };

  if (isLoading) return <AnalysisLoading progress={analyzingProgress} />;
  if (error) return ( <div className="glass-container"><div className="glass-error"><AlertCircle size={48} /><h2>{t('analysisResults.errorTitle', 'Analysis Error')}</h2><p>{error}</p><button onClick={onBack}>{t('analysisResults.tryAgain', 'Try Again')}</button></div></div> );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'insights':
        return (
          <div className="glass-content glass-content--insights">
            <div className="glass-card">
              <div className="glass-card__header">
                <Brain className="glass-card__icon" size={24} />
                <div>
                  <h3 className="glass-card__title">{t('analysisResults.discoveredTitle', 'What We Discovered Together')}</h3>
                  <p className="glass-card__subtitle">{t('analysisResults.discoveredSubtitle', 'Your reflection reveals deep insight')}</p>
                </div>
              </div>
              <p className="glass-card__text glass-card__text--emphasis">{analysisResult.summary}</p>
            </div>

            <div className="glass-card">
              <div className="glass-card__header">
                <Lightbulb className="glass-card__icon" size={22} />
                <div>
                  <h3 className="glass-card__title">{t('analysisResults.keyInsightsTitle', 'Key Insights')}</h3>
                  <p className="glass-card__subtitle">{t('analysisResults.keyInsightsSubtitle', 'Patterns and growth emerging from your words')}</p>
                </div>
              </div>
              <div className="glass-insights">
                {analysisResult.insights?.map((insight, index) => (
                  <div key={index} className="glass-insight">
                    <span className="glass-insight__number">{index + 1}</span>
                    <p className="glass-insight__text">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {isVoiceEntry && analysisResult.voiceObservations && (
              <div className="glass-card">
                <div className="glass-card__header">
                  <Volume2 className="glass-card__icon" size={20} />
                  <div>
                    <h3 className="glass-card__title">{t('analysisResults.voiceObservedTitle', 'Your Voice, Observed')}</h3>
                    <p className="glass-card__subtitle">{t('analysisResults.voiceObservedSubtitle', 'What your spoken words reveal')}</p>
                  </div>
                </div>
                <p className="glass-card__text">{analysisResult.voiceObservations}</p>
              </div>
            )}

            <div className="glass-card">
              <div className="glass-card__header">
                <Sparkles className="glass-card__icon" size={22} />
                <div>
                  <h3 className="glass-card__title">{t('analysisResults.honoringTitle', 'Honoring Your Journey')}</h3>
                  <p className="glass-card__subtitle">{t('analysisResults.honoringSubtitle', 'A message for you')}</p>
                </div>
              </div>
              <div className="glass-affirmation">
                <p className="glass-affirmation__quote">"{analysisResult.affirmation}"</p>
              </div>
            </div>
          </div>
        );

      case 'reflection':
        return (
          <div className="glass-content glass-content--reflection">
            <div className="glass-card glass-reflection">
              <HelpCircle size={40} className="glass-card__icon" />
              <h3 className="glass-card__title">{t('analysisResults.questionTitle', 'A Question to Explore')}</h3>
              <p className="glass-reflection__question">{analysisResult.reflectionQuestion}</p>
              <p className="glass-card__text">
                {t('analysisResults.questionIntro', 'This question is designed to open new pathways of self-understanding. There\'s no "right" answer—just honest exploration.')}
              </p>
              <ul className="glass-suggestions-list">
                <li>
                  <BookOpen size={18} />
                  <span><strong>{t('analysisResults.suggestJournalTitle', 'Journal Again')}</strong> {t('analysisResults.suggestJournalText', '— Write a follow-up entry exploring this question')}</span>
                </li>
                {isVoiceEntry && (
                  <li>
                    <Volume2 size={18} />
                    <span><strong>{t('analysisResults.suggestSpeakTitle', 'Speak Your Answer')}</strong> {t('analysisResults.suggestSpeakText', '— Record another voice reflection on this question')}</span>
                  </li>
                )}
                <li>
                  <Heart size={18} />
                  <span><strong>{t('analysisResults.suggestShareTitle', 'Share & Discuss')}</strong> {t('analysisResults.suggestShareText', '— Talk it through with someone you trust')}</span>
                </li>
                <li>
                  <Zap size={18} />
                  <span><strong>{t('analysisResults.suggestMeditateTitle', 'Meditate On It')}</strong> {t('analysisResults.suggestMeditateText', '— Sit with this question in quiet reflection')}</span>
                </li>
              </ul>
            </div>
          </div>
        );

      case 'action':
        return (
          <div className="glass-content glass-content--action">
            <div className="glass-card glass-action">
              <Play size={40} className="glass-card__icon" />
              <h3 className="glass-card__title">{t('analysisResults.nextStepTitle', 'Your Next Step')}</h3>
              <p className="glass-card__subtitle">{t('analysisResults.nextStepSubtitle', "Based on today's insights")}</p>
              <div className="glass-action__text">{analysisResult.practicalAction}</div>
              <p className="glass-card__text">
                <strong>{t('analysisResults.whyMatters', 'Why this matters:')}</strong> {t('analysisResults.whyMattersText', 'Small, consistent actions create meaningful change over time. This suggestion is tailored to your specific reflection today.')}
              </p>
            </div>
          </div>
        );

      case 'visualize':
        return (
          <div className="glass-content glass-content--visualize">
            <div className="glass-card">
              <div className="glass-card__header">
                <BarChart2 className="glass-card__icon" size={20} />
                <h3 className="glass-card__title">{t('analysisResults.emotionTrends', 'Emotion Trends')}</h3>
              </div>
              <EmotionTrends data={realData.emotions} simplified={false} isDarkMode={true} />
            </div>

            <div className="glass-card">
              <div className="glass-card__header">
                <Cloud className="glass-card__icon" size={20} />
                <h3 className="glass-card__title">{t('analysisResults.themeCloud', 'Theme Cloud')}</h3>
              </div>
              <ThemeCloud data={realData.themes} isDarkMode={true} />
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="glass-content glass-content--analytics">
            <div className="glass-card">
              <div className="glass-card__header">
                <Calendar className="glass-card__icon" size={20} />
                <h3 className="glass-card__title">{t('analysisResults.journalActivity', 'Journal Activity')}</h3>
              </div>
              <JournalCalendar data={realData.calendar} loading={realData.loading} />
            </div>

            <div className="glass-card">
              <div className="glass-card__header">
                <Activity className="glass-card__icon" size={20} />
                <h3 className="glass-card__title">{t('analysisResults.journeyInsights', 'Journey Insights')}</h3>
              </div>
              <InsightSummary entries={realData.entries} progressReport={realData.insights} />
            </div>
          </div>
        );

      case 'journal':
        return (
          <div className="glass-content glass-content--journal">
            <div className="glass-card">
              <h3 className="glass-card__title">{isVoiceEntry ? t('analysisResults.yourVoiceJournalEntry', 'Your Voice Journal Entry') : t('analysisResults.yourJournalEntry', 'Your Journal Entry')}</h3>
              <div className="glass-journal__prompt">"{prompt}"</div>

              {isVoiceEntry && voiceData?.audioUrl ? (
                <div>
                  <audio controls src={voiceData.audioUrl} style={{ width: '100%' }}>
                    {t('analysisResults.audioUnsupported', 'Your browser does not support the audio element.')}
                  </audio>
                  <p className="glass-card__subtitle">
                    {t('analysisResults.durationWords', 'Duration: {{duration}} • Words: {{words}}', { duration: formatTime(voiceData.duration || 0), words: voiceData.wordCount || 0 })}
                  </p>
                </div>
              ) : journalEntry.imageUrl ? (
                <EnhancedImageCarousel
                  images={allImages}
                  activeIndex={activeImageIndex}
                  setActiveIndex={setActiveImageIndex}
                />
              ) : (
                <p className="glass-card__subtitle">
                  <FileText size={16} /> {t('analysisResults.textOnlyEntry', 'Text-only journal entry')}
                </p>
              )}

              {(journalEntry.extractedText || (isVoiceEntry && voiceData?.transcription)) && (
                <div className="glass-journal__extracted">
                  <p className="glass-card__subtitle">
                    {isVoiceEntry ? t('analysisResults.voiceTranscription', 'Voice Transcription') : journalEntry.isTextOnly ? t('analysisResults.yourJournalText', 'Your Journal Text') : t('analysisResults.extractedText', 'Extracted Text')}
                  </p>
                  <p className="glass-journal__extracted-text">
                    {isVoiceEntry ? voiceData?.transcription : journalEntry.extractedText}
                  </p>
                </div>
              )}

              <div className="glass-header__meta" style={{ marginTop: 16 }}>
                <span>{getPathName(pathId)}</span>
                <span>•</span>
                <span>{journalEntry.theme}</span>
                <span>•</span>
                <span>{t('analysisResults.dayLabel', 'Day {{day}}', { day: journalEntry.day })}</span>
              </div>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="glass-container">
      <div className="glass-header">
        <button onClick={onBack} className="glass-header__back"><ArrowLeft size={20} /><span>{t('analysisResults.back', 'Back')}</span></button>
        <div className="glass-header__info">
          <h2>{t('analysisResults.dayAnalysis', 'Day {{day}} Analysis', { day: dayNumber })} {isVoiceEntry && <Volume2 size={16} />}</h2>
          <div className="glass-header__meta"><span>{getPathName(pathId)}</span><span>•</span><span>{theme}</span></div>
        </div>
        {isMultiPage && <div className="glass-header__multi">{t('analysisResults.pagesCount', '{{count}} pages', { count: allImages.length })}</div>}
      </div>

      <MobileTabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="glass-main">{renderTabContent()}</div>

      <div className="glass-actions">
        <button className="glass-btn glass-btn--secondary" onClick={handleExport} disabled={isExporting}><Download size={16} />{isExporting ? t('analysisResults.exporting', 'Exporting...') : t('analysisResults.export', 'Export')}</button>
        <button className="glass-btn glass-btn--secondary" onClick={handleShare}><Share2 size={16} />{t('analysisResults.share', 'Share')}</button>
        <button className="glass-btn glass-btn--primary" onClick={onNext}>{t('analysisResults.continueToDay', 'Continue to Day {{day}}', { day: dayNumber+1 })}<ArrowRight size={16} /></button>
      </div>

      <div className="glass-progress">
        <div className="glass-progress__info"><span>{t('analysisResults.journeyProgress', 'Journey Progress')}</span><span>{t('analysisResults.completedCount', '{{count}} completed', { count: dayNumber })}</span></div>
        <div className="glass-progress__bar"><div className="glass-progress__fill" style={{ width: `${(dayNumber / getJourneyTotalDays(pathId)) * 100}%` }} /></div>
      </div>
    </div>
  );
};

export default AnalysisResults;
