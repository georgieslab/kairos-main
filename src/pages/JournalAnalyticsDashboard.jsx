import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPreviousEntries, generateProgressReport } from '../services/claudeService';
import { useUserProgress } from '../hooks/useUserProgress';
import { useUserStatistics } from '../hooks/useUserStatistics';
import { 
  ArrowLeft, 
  BarChart2, 
  Calendar as CalendarIcon, 
  Clock, 
  Cloud,
  Heart,
  PieChart,
  RefreshCw,
  Zap,
  Loader,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  BookOpen,
  Flame,
  Map,
  TrendingUp,
  Award,
  MessageCircle,
  CheckCircle,
  Lightbulb,
  List,
  LayoutGrid,
  Target,
  Users,
  Brain,
  FileText,
  Calendar,
  BarChart3,
  Sparkles,
  MoreVertical,
  Share2,
  Download
} from 'lucide-react';

// Import visualization components
import EmotionTrends from '../components/analytics/EmotionTrends';
import ThemeCloud from '../components/analytics/ThemeCloud';
import JournalCalendar from '../components/analytics/JournalCalendar';
import InsightSummary from '../components/analytics/InsightSummary';
import useNavigation from '../hooks/useNavigation';

// Import new AI components
import DailyAIQuestion from '../components/analytics/DailyAIQuestion';
import AIPersonDescription from '../components/analytics/AIPersonDescription';

// ✅ Import the KairosLoader component
import KairosLoader from '../components/common/KairosLoader';

// Import utilities for data processing
import { extractThemesFromEntries, extractEmotionData } from '../utils/textProcessing';

// Import the theme context
import { useTheme } from '../contexts/ThemeContext';

// Import styles
import '../styles/pages/analyticsDashboard.css';
import '../styles/components/analyticsComponents.css';

const JournalAnalyticsDashboard = ({ onBack, navigateToScreen }) => {
  const { currentUser, userProfile } = useAuth();
  const { isDarkMode } = useTheme();
  
  // ✅ NEW: Use centralized statistics instead of duplicate entry management
  const { 
    statistics, 
    isLoading: statsLoading, 
    error: statsError,
    getFilteredEntries,
    refreshStatistics 
  } = useUserStatistics();
  
  // Use centralized progress data for consistency
  const { stats: progressStats, inProgressPaths, completedPaths } = useUserProgress();
  
  // Simplified state management - mobile-focused
  const [activeSection, setActiveSection] = useState('overview');
  const [timePeriod, setTimePeriod] = useState('all');
  const [progressReport, setProgressReport] = useState(null);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState('all');
  
  // ✅ NEW: Loading states for more granular control
  const [loadingStage, setLoadingStage] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const { currentPath } = useNavigation();
  
  // Get API cache service from window global
  const apiCacheService = window.apiCacheService;
  
  // ✅ NEW: Get entries using centralized hook - single source of truth
  const allEntries = statistics.allEntries; // Complete dataset for AI analysis
  const filteredEntries = getFilteredEntries({ 
    timePeriod: timePeriod === 'all' ? undefined : timePeriod,
    journeyId: selectedJourney === 'all' ? undefined : selectedJourney 
  }); // Filtered dataset for display
  
  // ✅ SIMPLIFIED: Load only progress report, entries come from centralized hook
  useEffect(() => {
    const loadProgressReport = async () => {
      if (!currentUser || statistics.isEmpty) return;
      
      try {
        setError(null);
        setLoadingStage('Analyzing your journal patterns...');
        setLoadingProgress(25);
        
        console.log('📊 Analytics loading - Total entries:', statistics.totalEntries);
        
        // Check cache first
        if (apiCacheService) {
          setLoadingStage('Checking for cached insights...');
          setLoadingProgress(50);
          
          const reportCacheKey = `analytics_report_${currentUser.uid}_${selectedJourney}`;
          const cachedReport = apiCacheService.getFromCache(reportCacheKey);
          
          if (cachedReport) {
            console.log("✅ Using cached progress report");
            setProgressReport(cachedReport);
            setLoadingProgress(100);
            return;
          }
        }
        
        // Generate fresh progress report
        setLoadingStage('Generating personalized insights...');
        setLoadingProgress(75);
        console.log("🔄 Generating fresh progress report");
        
        const report = await generateProgressReport(currentUser.uid, selectedJourney);
        setProgressReport(report);
        setLoadingProgress(100);
        
        // Cache report if cache service is available
        if (apiCacheService) {
          const reportCacheKey = `analytics_report_${currentUser.uid}_${selectedJourney}`;
          apiCacheService.storeInCache(reportCacheKey, report);
        }
        
      } catch (err) {
        console.error('Error loading progress report:', err);
        setError('Failed to load analytics insights. Please try again.');
        setLoadingStage('');
        setLoadingProgress(0);
      }
    };
    
    // Only load if we have statistics ready and not empty
    if (!statsLoading && !statistics.isEmpty) {
      loadProgressReport();
    }
  }, [currentUser, selectedJourney, statistics.isEmpty, statsLoading]);
  
  // ✅ SIMPLIFIED: Refresh function with enhanced loading feedback
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setLoadingStage('Refreshing your analytics...');
    setLoadingProgress(0);
    
    try {
      // Clear analytics caches to force refresh
      if (apiCacheService) {
        console.log('🧹 Clearing analytics cache');
        setLoadingStage('Clearing cache...');
        setLoadingProgress(20);
        apiCacheService.invalidateCacheByPrefix(`analytics_${currentUser.uid}`);
      }
      
      // Refresh centralized statistics
      setLoadingStage('Reloading journal entries...');
      setLoadingProgress(40);
      await refreshStatistics();
      
      // Regenerate progress report
      setLoadingStage('Regenerating insights...');
      setLoadingProgress(70);
      const report = await generateProgressReport(currentUser.uid, selectedJourney);
      setProgressReport(report);
      
      setLoadingProgress(100);
      setError(null);
    } catch (err) {
      console.error('Error refreshing analytics data:', err);
      setError('Failed to refresh analytics data. Please try again.');
    } finally {
      setIsRefreshing(false);
      setLoadingStage('');
      setLoadingProgress(0);
    }
  };
  
  // ✅ SIMPLIFIED: Stats calculation using centralized data
  const calculateDisplayStats = () => {
    // Base stats from centralized source
    const baseStats = {
      totalEntries: statistics.totalEntries,
      averageLength: statistics.averageLength,
      journeyProgress: statistics.journeyProgress,
      longestStreak: statistics.longestStreak,
      commonThemes: progressReport?.commonThemes || [],
      wordsWritten: statistics.totalWords,
      activePathsCount: statistics.activePathsCount,
      currentPathName: statistics.currentPathName
    };
    
    // If we're showing filtered view, calculate filtered-specific stats
    if (filteredEntries.length !== statistics.totalEntries) {
      const filteredTextLength = filteredEntries.reduce((sum, entry) => {
        const entryText = entry.extractedText || '';
        return sum + entryText.length;
      }, 0);
      
      const filteredAverageLength = filteredEntries.length > 0 ? 
        Math.round(filteredTextLength / filteredEntries.length) : 0;
      
      return {
        ...baseStats,
        displayEntries: filteredEntries.length,
        averageLength: filteredAverageLength,
        isFiltered: true
      };
    }
    
    return {
      ...baseStats,
      displayEntries: statistics.totalEntries,
      isFiltered: false
    };
  };
  
  const displayStats = calculateDisplayStats();
  
  // Process data for visualizations using filtered entries
  const emotionData = filteredEntries.length > 0 ? extractEmotionData(filteredEntries).emotions : [];
  const themeData = filteredEntries.length > 0 ? extractThemesFromEntries(filteredEntries) : [];
  
  // Process data for calendar view
  const processCalendarData = () => {
    if (!filteredEntries.length) return [];
    
    const calendarData = {};
    
    // Process each entry
    filteredEntries.forEach(entry => {
      if (!entry.timestamp) return;
      
      try {
        // Handle different timestamp formats safely
        let entryDate;
        
        if (typeof entry.timestamp === 'object') {
          if (entry.timestamp.toDate) {
            // Firestore Timestamp with method
            entryDate = entry.timestamp.toDate();
          } else if (entry.timestamp.seconds !== undefined) {
            // Serialized Firestore Timestamp (from cache)
            entryDate = new Date(entry.timestamp.seconds * 1000);
          } else if (entry.timestamp instanceof Date) {
            // Date object
            entryDate = entry.timestamp;
          } else {
            // Other object format, try to convert
            entryDate = new Date(entry.timestamp);
          }
        } else if (typeof entry.timestamp === 'string') {
          // ISO string or other string format
          entryDate = new Date(entry.timestamp);
        } else if (typeof entry.timestamp === 'number') {
          // Unix timestamp in milliseconds
          entryDate = new Date(entry.timestamp);
        } else {
          // Skip invalid timestamps
          console.warn('Invalid timestamp format:', entry.timestamp);
          return;
        }
        
        // Validate the date before using it
        if (isNaN(entryDate.getTime())) {
          console.warn('Invalid date created from timestamp:', entry.timestamp);
          return;
        }
        
        // Create a valid YYYY-MM-DD format
        const year = entryDate.getFullYear();
        const month = String(entryDate.getMonth() + 1).padStart(2, '0');
        const day = String(entryDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        if (!calendarData[dateStr]) {
          calendarData[dateStr] = 0;
        }
        
        calendarData[dateStr] += 1;
      } catch (err) {
        console.warn('Error processing date for calendar:', err, entry.timestamp);
      }
    });
    
    // Convert to array format for calendar heatmap
    return Object.entries(calendarData).map(([date, count]) => ({
      date,
      count,
    }));
  };
  
  const calendarData = processCalendarData();
  
  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Get available journey paths for filter
  const getAvailableJourneys = () => {
    if (!filteredEntries || filteredEntries.length === 0) return [];
    
    // Get unique path IDs
    const uniquePaths = [...new Set(filteredEntries.map(entry => entry.pathId))].filter(Boolean);
    
    // Map path IDs to display names
    return uniquePaths.map(pathId => ({
      id: pathId,
      name: getPathDisplayName(pathId)
    }));
  };
  
  // Get display name for a path - Complete list of all 34 journey paths
  const getPathDisplayName = (pathId) => {
    switch(pathId) {
      // ===== Visual/Artistic Paths (8 paths) =====
      case 'mindful-visualization':
        return 'Mindful Visualization';
      case 'artistic-soul-expression':
        return 'Artistic Soul Expression';
      case 'color-psychology':
        return 'Color Psychology Journey';
      case 'sacred-geometry':
        return 'Sacred Geometry Soul';
      case 'nature-sketching':
        return 'Nature Sketching Sanctuary';
      case 'abstract-emotions':
        return 'Abstract Emotions';
      case 'visual-storytelling':
        return 'Visual Storytelling';
      case 'ink-essence':
        return 'Ink & Essence: Black Ink Mastery';
      
      // ===== Foundational Personal Growth (10-14 days) =====
      case 'self-discovery':
        return 'Self-Discovery Journey';
      case 'emotional-intelligence':
        return 'Emotional Intelligence Expedition';
      case 'mindfulness-awareness':
        return 'Mindfulness & Present Awareness';
      case 'gratitude-practice':
        return 'Gratitude Practice';
      case 'shadow-work':
        return 'Shadow Work Exploration';
      case 'nature-connection':
        return 'Nature Connection';
      case 'anxiety-alchemy':
        return 'Anxiety Alchemy';
      case 'courage-cultivation':
        return 'Courage Cultivation';
      case 'inner-child':
        return 'Inner Child Healing';
      case 'creative-expression':
        return 'Creative Expression';
      case 'dream-decoder':
        return 'Dream Journal Decoder';
      
      // ===== Specialized Focus Areas (17-22 days) =====
      case 'forgiveness-freedom':
        return 'Forgiveness Freedom';
      case 'career-compass':
        return 'Career Compass';
      case 'transitions-navigator':
        return 'Life Transitions Navigator';
      case 'transformation-journey':
        return 'Transformation Journey: Breaking Patterns';
      case 'financial-mindfulness':
        return 'Financial Mindfulness';
      case 'life-values':
        return 'Life Values & Core Principles';
      
      // ===== Extended Journeys (28-30 days) =====
      case 'seasonal-rhythms':
        return 'Seasonal Soul Rhythms';
      case 'habit-formation':
        return 'Habit Formation';
      case 'relationship-mastery':
        return 'Relationship Mastery';
      case 'grief-growth':
        return 'Grief & Growth';
      
      // ===== Micro Journeys (7 days) =====
      case 'digital-detox':
        return 'Digital Detox Reflection';
      
      // ===== Comprehensive Life Journeys (100 days) =====
      case 'holistic-transformation':
        return 'Holistic Transformation';
      case 'life-vision':
        return 'Life Vision & Purpose';
      
      // ===== Fallback for any new paths =====
      default:
        return pathId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };
  
  const availableJourneys = getAvailableJourneys();
  
  // Use centralized data to determine if there's enough data
  const notEnoughData = statistics.totalEntries < 2;

  // ✅ NEW: Determine if we should show the KairosLoader
  const shouldShowLoader = statsLoading || isRefreshing || (loadingStage && loadingProgress < 100);
  
  // Tab configuration for mobile
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'emotions', label: 'Emotions', icon: Heart },
    { id: 'themes', label: 'Themes', icon: Cloud },
    { id: 'habits', label: 'Habits', icon: Calendar },
    { id: 'ai', label: 'AI Insights', icon: Sparkles }
  ];

  // Mobile-optimized section rendering
  const renderMobileSection = () => {
    switch(activeSection) {
      case 'overview':
        return renderOverviewSection();
      case 'emotions':
        return renderEmotionsSection();
      case 'themes':
        return renderThemesSection();
      case 'habits':
        return renderHabitsSection();
      case 'ai':
        return renderAISection();
      default:
        return renderOverviewSection();
    }
  };

  const renderOverviewSection = () => (
    <div className="dashboard-section fade-in">
      <div className="section-header">
        <h2 className="section-title">
          <BarChart2 className="section-title-icon" />
          Your Journal Overview
        </h2>
        <p className="analysis-context">
          Based on {displayStats.totalEntries} journal entries
        </p>
      </div>
      
      {/* AI Features Section - Featured prominently */}
      <div className="daily-ai-section slide-in-bottom" style={{"--delay": "0.1s"}}>
        <DailyAIQuestion 
          entries={allEntries}
          totalEntries={statistics.totalEntries}
          progressStats={progressStats}
        />
      </div>
      
      <div className="ai-person-section slide-in-bottom" style={{"--delay": "0.2s"}}>
        <AIPersonDescription 
          entries={allEntries}
          totalEntries={statistics.totalEntries}
          progressStats={progressStats}
        />
      </div>
      
      {/* Quick insights */}
      <div className="visualization-card slide-in-bottom" style={{"--delay": "0.3s"}}>
        <h3 className="visualization-title">
          <Lightbulb className="visualization-title-icon" />
          Quick Insights
          <span className="data-count">Latest trends</span>
        </h3>
        <div className="visualization-content">
          <InsightSummary 
            entries={filteredEntries} 
            progressReport={progressReport}
          />
        </div>
      </div>

      {/* Achievement badges */}
      <div className="progress-badges-section slide-in-bottom" style={{"--delay": "0.4s"}}>
        <h3 className="section-subtitle">
          <Award className="section-subtitle-icon" />
          Your Achievements
        </h3>
        
        <div className="progress-badges">
          {displayStats.totalEntries >= 1 && (
            <div className="badge">
              <div className="badge-icon">
                <CheckCircle />
              </div>
              <div className="badge-label">First Entry</div>
            </div>
          )}
          
          {displayStats.totalEntries >= 5 && (
            <div className="badge">
              <div className="badge-icon">
                <BookOpen />
              </div>
              <div className="badge-label">5 Entries</div>
            </div>
          )}
          
          {displayStats.totalEntries >= 10 && (
            <div className="badge">
              <div className="badge-icon">
                <Target />
              </div>
              <div className="badge-label">10 Entries</div>
            </div>
          )}
          
          {displayStats.longestStreak >= 3 && (
            <div className="badge">
              <div className="badge-icon">
                <Flame />
              </div>
              <div className="badge-label">3-Day Streak</div>
            </div>
          )}
          
          {displayStats.longestStreak >= 7 && (
            <div className="badge">
              <div className="badge-icon">
                <Calendar />
              </div>
              <div className="badge-label">Weekly Warrior</div>
            </div>
          )}
          
          {displayStats.wordsWritten >= 1000 && (
            <div className="badge">
              <div className="badge-icon">
                <FileText />
              </div>
              <div className="badge-label">1000+ Words</div>
            </div>
          )}
          
          {displayStats.journeyProgress >= 50 && (
            <div className="badge">
              <div className="badge-icon">
                <Map />
              </div>
              <div className="badge-label">Halfway There</div>
            </div>
          )}
          
          {displayStats.journeyProgress >= 100 && (
            <div className="badge">
              <div className="badge-icon">
                <Award />
              </div>
              <div className="badge-label">Journey Complete</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderEmotionsSection = () => (
    <div className="dashboard-section fade-in">
      <div className="section-header">
        <h2 className="section-title">
          <Heart className="section-title-icon" />
          Emotional Patterns
        </h2>
        <p className="analysis-context">
          Analysis of {displayStats.displayEntries} entries
        </p>
      </div>
      
      <div className="visualization-card slide-in-bottom" style={{"--delay": "0.1s"}}>
        <h3 className="visualization-title">
          <Heart className="visualization-title-icon" />
          Emotion Trends
          <span className="data-count">{emotionData.length} emotions detected</span>
        </h3>
        <div className="visualization-content">
          <EmotionTrends data={emotionData} hideTitle={true} isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Most emotional entries */}
      {filteredEntries.length > 0 && (
        <div className="visualization-card slide-in-bottom" style={{"--delay": "0.2s"}}>
          <h3 className="visualization-title">
            <MessageCircle className="visualization-title-icon" />
            Most Emotional Entries
            <span className="data-count">Recent highlights</span>
          </h3>
          <div className="entries-list">
            {filteredEntries
              .filter(entry => entry.analysis && entry.analysis.summary)
              .slice(0, 3)
              .map((entry, index) => (
                <div 
                  key={entry.day || index} 
                  className="entry-item"
                  onClick={() => navigateToScreen('daily', { day: entry.day, pathId: entry.pathId })}
                >
                  <div className="entry-header">
                    <div className="entry-day">Day {entry.day}</div>
                    <div className="entry-theme">{entry.theme || 'Reflection'}</div>
                  </div>
                  <div className="entry-summary">{entry.analysis.summary}</div>
                  <div className="entry-meta">
                    {entry.extractedText && (
                      <span className="entry-word-count">
                        {Math.round(entry.extractedText.length / 5)} words
                      </span>
                    )}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );

  const renderThemesSection = () => (
    <div className="dashboard-section fade-in">
      <div className="section-header">
        <h2 className="section-title">
          <Cloud className="section-title-icon" />
          Recurring Themes
        </h2>
        <p className="analysis-context">
          {themeData.length} themes from {displayStats.displayEntries} entries
        </p>
      </div>
      
      <div className="visualization-card slide-in-bottom" style={{"--delay": "0.1s"}}>
        <h3 className="visualization-title">
          <Cloud className="visualization-title-icon" />
          Theme Cloud
          <span className="data-count">Your focus areas</span>
        </h3>
        <div className="visualization-content">
          <ThemeCloud data={themeData} isDarkMode={isDarkMode} />
        </div>
      </div>
      
      {/* Theme frequency breakdown */}
      {themeData.length > 0 && (
        <div className="themes-breakdown-container slide-in-bottom" style={{"--delay": "0.2s"}}>
          <h3 className="visualization-title">
            <BarChart3 className="visualization-title-icon" />
            Top Themes
            <span className="data-count">Most frequent topics</span>
          </h3>
          <div className="themes-frequency-list">
            {themeData.slice(0, 6).map((theme, index) => (
              <div key={index} className="theme-frequency-item">
                <div className="theme-frequency-header">
                  <div className="theme-name">{theme.text}</div>
                  <div className="theme-mentions">
                    {Math.round(theme.size * 10)} mentions
                  </div>
                </div>
                <div className="theme-frequency-bar">
                  <div 
                    className="theme-frequency-fill" 
                    style={{ 
                      width: `${(theme.size / themeData[0].size) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderHabitsSection = () => (
    <div className="dashboard-section fade-in">
      <div className="section-header">
        <h2 className="section-title">
          <Calendar className="section-title-icon" />
          Journaling Habits
        </h2>
        <p className="analysis-context">
          {calendarData.length} active days tracked
        </p>
      </div>

      {/* Calendar Section */}
      <div className="visualization-card slide-in-bottom" style={{"--delay": "0.1s"}}>
        <h3 className="visualization-title">
          <CalendarIcon className="visualization-title-icon" />
          Activity Heatmap
          <span className="data-count">{calendarData.length} days active</span>
        </h3>
        <div className="visualization-content">
          <JournalCalendar data={calendarData} />
        </div>
      </div>
      
      {/* Consistency Metrics */}
      <div className="consistency-stats slide-in-bottom" style={{"--delay": "0.2s"}}>
        <div className="consistency-stat">
          <h4 className="consistency-stat-label">Current Streak</h4>
          <div className="consistency-stat-value">{progressStats?.currentStreak || 0} days</div>
          <div className="stat-bar-container">
            <div 
              className="stat-bar-fill" 
              style={{
                width: `${Math.min(100, ((progressStats?.currentStreak || 0) / 10) * 100)}%`
              }}
            ></div>
          </div>
          <div className="stat-description">
            {progressStats?.currentStreak > 0 ? 
              `${progressStats.currentStreak} consecutive days` : 
              'Ready to start your streak!'}
          </div>
        </div>
        
        <div className="consistency-stat">
          <h4 className="consistency-stat-label">Journey Progress</h4>
          <div className="consistency-stat-value">{displayStats.journeyProgress}%</div>
          <div className="stat-bar-container">
            <div 
              className="stat-bar-fill"
              style={{
                width: `${displayStats.journeyProgress}%`
              }}
            ></div>
          </div>
          <div className="stat-description">
            of your current path completed
          </div>
        </div>
        
        <div className="consistency-stat">
          <h4 className="consistency-stat-label">Average Length</h4>
          <div className="consistency-stat-value">{displayStats.averageLength}</div>
          <div className="stat-bar-container">
            <div 
              className="stat-bar-fill"
              style={{
                width: `${Math.min(100, (displayStats.averageLength / 500) * 100)}%`
              }}
            ></div>
          </div>
          <div className="stat-description">
            characters per entry
          </div>
        </div>
      </div>
    </div>
  );

  const renderAISection = () => (
    <div className="dashboard-section fade-in">
      <div className="section-header">
        <h2 className="section-title">
          <Sparkles className="section-title-icon" />
          AI-Powered Insights
        </h2>
        <p className="analysis-context">
          Personalized analysis of your {statistics.totalEntries} entries
        </p>
      </div>
      
      {/* Daily AI Question - Featured */}
      <div className="ai-insight-card slide-in-bottom" style={{"--delay": "0.1s"}}>
        <DailyAIQuestion 
          entries={allEntries}
          totalEntries={statistics.totalEntries}
          progressStats={progressStats}
        />
      </div>
      
      {/* AI Person Description - Featured */}
      <div className="ai-insight-card slide-in-bottom" style={{"--delay": "0.2s"}}>
        <AIPersonDescription 
          entries={allEntries}
          totalEntries={statistics.totalEntries}
          progressStats={progressStats}
        />
      </div>
      
      {/* Coming Soon */}
      <div className="coming-soon-card slide-in-bottom" style={{"--delay": "0.3s"}}>
        <div className="coming-soon-content">
          <div className="coming-soon-icon">
            <Sparkles size={24} />
          </div>
          <h3 className="coming-soon-title">More AI Features Coming</h3>
          <p className="coming-soon-description">
            We're working on mood predictions, writing style analysis, and personalized recommendations.
          </p>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className={`analytics-dashboard ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* ✅ NEW: KairosLoader replaces the old loading state */}
      {shouldShowLoader && (
        <KairosLoader
          size="large"
          fullScreen={true}
          message={loadingStage || "Analyzing your journal..."}
          subMessage={
            loadingStage ? "This may take a moment" : 
            statsLoading ? "Loading your entries" : 
            "Preparing insights"
          }
          showProgress={loadingProgress > 0}
          progress={loadingProgress}
        />
      )}
      
      {/* Mobile-native header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-top">
            <h1 className="dashboard-title">
              <BarChart2 className="title-icon" />
              Analytics
            </h1>
            <div className="header-actions">
              <button 
                onClick={handleRefresh}
                className={`header-action-btn ${isRefreshing ? 'refreshing' : ''}`}
                disabled={isRefreshing}
                aria-label="Refresh analytics"
              >
                <RefreshCw size={18} />
              </button>
            </div>
          </div>
          
          <p className="dashboard-subtitle">
            Discover insights and patterns in your journaling practice
          </p>
          
          {/* Analysis Info Bar */}
          <div className="analysis-info-bar">
            <div className="analysis-info-item">
              <FileText size={14} />
              <span>{displayStats.totalEntries} entries</span>
            </div>
            <div className="analysis-info-item">
              <Calendar size={14} />
              <span>{calendarData.length} active days</span>
            </div>
            <div className="analysis-info-item">
              <Brain size={14} />
              <span>AI insights</span>
            </div>
            {displayStats.isFiltered && (
              <div className="analysis-info-item">
                <Filter size={14} />
                <span>Filtered: {displayStats.displayEntries}/{displayStats.totalEntries}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile filters */}
      <div className="filters-section">
        <button 
          className="filters-toggle"
          onClick={toggleFilters}
          aria-label="Toggle filters"
          aria-expanded={showFilters}
        >
          <Filter size={16} />
          <span>Filters</span>
          {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {showFilters && (
          <div className="filters-container">
            <div className="filter-group">
              <label className="filter-label">Time Period</label>
              <div className="filter-options">
                <button 
                  className={`filter-option ${timePeriod === 'all' ? 'active' : ''}`}
                  onClick={() => setTimePeriod('all')}
                >
                  All Time
                </button>
                <button 
                  className={`filter-option ${timePeriod === 'week' ? 'active' : ''}`}
                  onClick={() => setTimePeriod('week')}
                >
                  Past Week
                </button>
                <button 
                  className={`filter-option ${timePeriod === 'month' ? 'active' : ''}`}
                  onClick={() => setTimePeriod('month')}
                >
                  Past Month
                </button>
                <button 
                  className={`filter-option ${timePeriod === 'quarter' ? 'active' : ''}`}
                  onClick={() => setTimePeriod('quarter')}
                >
                  Past 3 Months
                </button>
              </div>
            </div>
            
            {availableJourneys.length > 1 && (
              <div className="filter-group">
                <label className="filter-label">Journey Path</label>
                <div className="filter-options">
                  <button 
                    className={`filter-option ${selectedJourney === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedJourney('all')}
                  >
                    All Journeys
                  </button>
                  
                  {availableJourneys.map(journey => (
                    <button 
                      key={journey.id}
                      className={`filter-option ${selectedJourney === journey.id ? 'active' : ''}`}
                      onClick={() => setSelectedJourney(journey.id)}
                    >
                      {journey.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Error state */}
      {(error || statsError) && !shouldShowLoader && (
        <div className="error-container">
          <AlertCircle size={32} />
          <h2 className="message-title">Something went wrong</h2>
          <p className="message-text">{error || statsError}</p>
          <button 
            onClick={handleRefresh}
            className="retry-button"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      )}
      
      {/* Not enough data */}
      {notEnoughData && !shouldShowLoader && !error && !statsError && (
        <div className="not-enough-data">
          <BarChart2 size={48} />
          <h2 className="message-title">Not Enough Data</h2>
          <p className="message-text">
            Complete at least 2 journal entries to see analytics.
            The more you journal, the richer your insights become!
          </p>
          <button 
            className="action-button"
            onClick={() => navigateToScreen('upload')}
          >
            <MessageCircle size={16} />
            Write a Journal Entry
          </button>
        </div>
      )}
      
      {/* Main content */}
      {!shouldShowLoader && !error && !statsError && !notEnoughData && (
        <>
          {/* Mobile stats overview */}
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-icon-container">
                <BookOpen className="stat-icon" />
              </div>
              <div className="stat-label">Total Entries</div>
              <div className="stat-value">{displayStats.totalEntries}</div>
              <div className="stat-subtext">analyzed by AI</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon-container">
                <Map className="stat-icon" />
              </div>
              <div className="stat-label">Progress</div>
              <div className="stat-value">{displayStats.journeyProgress}%</div>
              <div className="stat-subtext">{displayStats.currentPathName}</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon-container">
                <FileText className="stat-icon" />
              </div>
              <div className="stat-label">Words Written</div>
              <div className="stat-value">{displayStats.wordsWritten > 999 ? `${Math.round(displayStats.wordsWritten/1000)}k` : displayStats.wordsWritten}</div>
              <div className="stat-subtext">total words</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon-container">
                <Flame className="stat-icon" />
              </div>
              <div className="stat-label">Best Streak</div>
              <div className="stat-value">{displayStats.longestStreak}</div>
              <div className="stat-subtext">days in a row</div>
            </div>
          </div>
          
          {/* Mobile-native tabs */}
          <div className="dashboard-tabs-container">
            <div className="dashboard-tabs">
              {tabs.map(tab => (
                <button 
                  key={tab.id}
                  className={`dashboard-tab ${activeSection === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Dynamic section content */}
          <div className="dashboard-content">
            {renderMobileSection()}
          </div>
        </>
      )}
    </div>
  );
};

export default JournalAnalyticsDashboard;