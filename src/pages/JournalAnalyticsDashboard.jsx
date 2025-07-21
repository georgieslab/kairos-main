import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPreviousEntries, generateProgressReport } from '../services/claudeService';
<<<<<<< HEAD
import { useUserProgress } from '../hooks/useUserProgress';
import { useUserStatistics } from '../hooks/useUserStatistics';
=======
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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
<<<<<<< HEAD
  BarChart3,
  Sparkles,
  MoreVertical,
  Share2,
  Download
=======
  BarChart3
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
} from 'lucide-react';

// Import visualization components
import EmotionTrends from '../components/analytics/EmotionTrends';
import ThemeCloud from '../components/analytics/ThemeCloud';
import JournalCalendar from '../components/analytics/JournalCalendar';
import InsightSummary from '../components/analytics/InsightSummary';
import useNavigation from '../hooks/useNavigation';

<<<<<<< HEAD
// Import new AI components
import DailyAIQuestion from '../components/analytics/DailyAIQuestion';
import AIPersonDescription from '../components/analytics/AIPersonDescription';

// ✅ Import the KairosLoader component
import KairosLoader from '../components/common/KairosLoader';

=======
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
// Import utilities for data processing
import { extractThemesFromEntries, extractEmotionData } from '../utils/textProcessing';

// Import the theme context
import { useTheme } from '../contexts/ThemeContext';

// Import styles
import '../styles/pages/analyticsDashboard.css';
<<<<<<< HEAD
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
=======
import '../styles/components/analyticsComponents.css'

const JournalAnalyticsDashboard = ({ onBack, navigateToScreen }) => {
  const { currentUser, userProfile } = useAuth();
  // Use the centralized theme context instead of local state
  const { isDarkMode } = useTheme();
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  const [activeSection, setActiveSection] = useState('overview');
  const [timePeriod, setTimePeriod] = useState('all');
  const [progressReport, setProgressReport] = useState(null);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
<<<<<<< HEAD
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
=======
  const [animateStats, setAnimateStats] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const { currentPath } = useNavigation();
  
  // Refs for animation
  const statsRef = useRef(null);
  
  // Get API cache service from window global
  const apiCacheService = window.apiCacheService;
  
  // Toggle view mode between grid and list
  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid');
  }, []);
  
  // Cache keys
  const getEntriesCacheKey = () => `analytics_entries_${currentUser?.uid}_${timePeriod}_${selectedJourney}`;
  const getReportCacheKey = () => `analytics_report_${currentUser?.uid}_${selectedJourney}`;
  
  // Observe stats section for animation on scroll
  useEffect(() => {
    if (!statsRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimateStats(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    observer.observe(statsRef.current);
    
    return () => observer.disconnect();
  }, [statsRef.current, isLoading]);
  
  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if apiCacheService is available
        if (!apiCacheService) {
          console.error('API cache service not found!');
        } else {
          console.log('Using API cache service for analytics');
          
          // Check if we should refresh analytics based on new journal entries
          const shouldRefresh = apiCacheService.shouldRefreshAnalytics(currentUser.uid);
          console.log('Should refresh analytics:', shouldRefresh);
          
          // Try to get cached data first
          const entriesCacheKey = getEntriesCacheKey();
          const reportCacheKey = getReportCacheKey();
          
          const cachedEntries = apiCacheService.getFromCache(entriesCacheKey);
          const cachedReport = apiCacheService.getFromCache(reportCacheKey);
          
          // If we have cached data and shouldn't refresh, use it
          if (cachedEntries && cachedReport && !shouldRefresh) {
            console.log("Using cached analytics data");
            setEntries(cachedEntries.data || []);
            setProgressReport(cachedReport);
            
            // Record analytics view
            apiCacheService.recordAnalyticsView(currentUser.uid);
            
            setIsLoading(false);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
            return;
          }
        }
        
<<<<<<< HEAD
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
=======
        // If we reach here, we need fresh data
        console.log("Fetching fresh analytics data");
        
        // First record the analytics view timestamp before fetching
        if (apiCacheService) {
          apiCacheService.recordAnalyticsView(currentUser.uid);
        }
        
        // Fetch journal entries
        const journalEntries = await getPreviousEntries(currentUser.uid,'all');
        
        // Apply filters
        const filteredEntries = filterEntries(journalEntries);
        
        // Cache entries if cache service is available
        if (apiCacheService) {
          apiCacheService.storeInCache(getEntriesCacheKey(), {
            data: filteredEntries,
            timePeriod: timePeriod,
            selectedJourney: selectedJourney,
            timestamp: Date.now()
          });
        }
        
        setEntries(filteredEntries);
        
        // Get progress report
        try {
          const report = await generateProgressReport(currentUser.uid, selectedJourney);
          setProgressReport(report);
          
          // Cache report if cache service is available
          if (apiCacheService) {
            apiCacheService.storeInCache(getReportCacheKey(), report);
          }
        } catch (reportError) {
          console.error('Error generating progress report:', reportError);
        }
        
      } catch (err) {
        console.error('Error loading analytics data:', err);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentUser, timePeriod, selectedJourney]);
  
  // Filter entries based on time period and journey
  const filterEntries = (allEntries) => {
    if (!allEntries?.length) return [];
    
    let filtered = [...allEntries];
    
    // Filter by time period
    if (timePeriod !== 'all') {
      const now = new Date();
      let cutoffDate;
      
      switch (timePeriod) {
        case 'week':
          cutoffDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'quarter':
          cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
          break;
        default:
          break;
      }
      
      if (cutoffDate) {
        filtered = filtered.filter(entry => {
          if (!entry.timestamp) return false;
          let entryDate;
          
          try {
            // Handle different timestamp formats
            if (entry.timestamp.toDate) {
              entryDate = entry.timestamp.toDate();
            } else if (entry.timestamp.seconds) {
              entryDate = new Date(entry.timestamp.seconds * 1000);
            } else {
              entryDate = new Date(entry.timestamp);
            }
            
            return entryDate >= cutoffDate;
          } catch (err) {
            console.warn('Error parsing date:', err);
            return false;
          }
        });
      }
    }
    
    // Filter by journey
    if (selectedJourney !== 'all') {
      filtered = filtered.filter(entry => entry.pathId === selectedJourney);
    }
    
    return filtered;
  };
  
  // Force refresh analytics data - ignores cache
  const handleRefresh = async () => {
    setIsRefreshing(true);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    
    try {
      // Clear analytics caches to force refresh
      if (apiCacheService) {
<<<<<<< HEAD
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
=======
        apiCacheService.invalidateCacheByPrefix(`analytics_${currentUser.uid}`);
      }
      
      // Fetch journal entries
      const journalEntries = await getPreviousEntries(currentUser.uid);
      
      // Apply filters
      const filteredEntries = filterEntries(journalEntries);
      
      // Cache entries if cache service is available
      if (apiCacheService) {
        apiCacheService.storeInCache(getEntriesCacheKey(), {
          data: filteredEntries,
          timePeriod: timePeriod,
          selectedJourney: selectedJourney,
          timestamp: Date.now()
        });
      }
      
      setEntries(filteredEntries);
      
      // Regenerate progress report
      const report = await generateProgressReport(currentUser.uid, selectedJourney);
      setProgressReport(report);
      
      // Cache report if cache service is available
      if (apiCacheService) {
        apiCacheService.storeInCache(getReportCacheKey(), report);
        
        // Record analytics view
        apiCacheService.recordAnalyticsView(currentUser.uid);
      }
      
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      setError(null);
    } catch (err) {
      console.error('Error refreshing analytics data:', err);
      setError('Failed to refresh analytics data. Please try again.');
    } finally {
      setIsRefreshing(false);
<<<<<<< HEAD
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
=======
    }
  };
  
  // Process data for calendar view
  const processCalendarData = () => {
    if (!entries.length) return [];
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    
    const calendarData = {};
    
    // Process each entry
<<<<<<< HEAD
    filteredEntries.forEach(entry => {
=======
    entries.forEach(entry => {
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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
  
<<<<<<< HEAD
  const calendarData = processCalendarData();
  
=======
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
<<<<<<< HEAD
  // Get available journey paths for filter
  const getAvailableJourneys = () => {
    if (!filteredEntries || filteredEntries.length === 0) return [];
    
    // Get unique path IDs
    const uniquePaths = [...new Set(filteredEntries.map(entry => entry.pathId))].filter(Boolean);
=======
  // Enhanced function to generate detailed emotional insights
  const generateDetailedEmotionalInsights = (emotionData, entriesCount) => {
    if (!emotionData || emotionData.length === 0) {
      return {
        primary: `Based on analysis of your ${entriesCount} journal entries, we're still building a complete picture of your emotional landscape. As you continue journaling, we'll be able to identify your dominant emotional patterns and provide more personalized insights about your emotional journey. Each entry adds depth to our understanding of your unique emotional signature.`,
        balance: `Your emotional profile is still developing. With ${entriesCount} entries analyzed, we need more data points to assess your emotional balance and range. Continue expressing yourself authentically in your journal - both positive and challenging emotions are valuable for developing emotional intelligence and self-awareness.`,
        growth: `To enhance your emotional awareness, try being more specific about your feelings in future entries. Instead of writing 'I felt bad,' explore whether you felt disappointed, frustrated, overwhelmed, or something else entirely. This emotional granularity will help us provide more targeted insights and support your emotional growth journey.`
      };
    }

    const totalEmotions = emotionData.length;
    const topEmotion = emotionData[0];
    const secondEmotion = emotionData.length > 1 ? emotionData[1] : null;
    const emotionalRange = emotionData.length;

    // Calculate emotional diversity
    const positiveEmotions = emotionData.filter(e => 
      ['joy', 'happiness', 'excitement', 'love', 'gratitude', 'peace', 'confidence', 'hope'].includes(e.name.toLowerCase())
    ).length;
    
    const challengingEmotions = emotionData.filter(e => 
      ['sadness', 'anger', 'fear', 'anxiety', 'frustration', 'disappointment', 'stress', 'worry'].includes(e.name.toLowerCase())
    ).length;

    const neutralEmotions = totalEmotions - positiveEmotions - challengingEmotions;

    return {
      primary: `After analyzing ${entriesCount} of your journal entries, I've discovered that ${topEmotion.name.toLowerCase()} emerges as your most prominent emotional theme, appearing with significant intensity in your writing. ${secondEmotion ? `This is closely followed by ${secondEmotion.name.toLowerCase()}, which suggests these two emotional states form the core of your current inner experience.` : ''} 

Your emotional expression shows a ${emotionalRange > 5 ? 'rich and complex' : emotionalRange > 3 ? 'developing' : 'focused'} range across ${emotionalRange} distinct emotional themes. This emotional vocabulary demonstrates your growing self-awareness and willingness to explore the nuances of your inner world. The fact that ${topEmotion.name.toLowerCase()} appears so prominently suggests this emotion is playing a significant role in your current life chapter and deserves deeper exploration in your future journaling.`,

      balance: `Your emotional landscape reveals an interesting balance: ${positiveEmotions > challengingEmotions ? 
        `you express ${positiveEmotions} positive emotional themes compared to ${challengingEmotions} challenging ones, suggesting you're in a generally positive phase or naturally focus on uplifting aspects of your experiences. This positive emotional bias can be a strength, though don't hesitate to also explore and process any difficult emotions that arise.` : 
        challengingEmotions > positiveEmotions ? 
        `you're processing ${challengingEmotions} challenging emotional themes alongside ${positiveEmotions} positive ones. This suggests you're courageously working through some difficult experiences or life transitions. Remember that exploring challenging emotions through journaling is incredibly healthy and shows emotional maturity.` : 
        `you maintain a balanced emotional expression with roughly equal representation of positive and challenging emotions. This balance suggests you're authentically processing the full spectrum of human experience, which is essential for emotional growth and resilience.`}

${neutralEmotions > 0 ? `Additionally, ${neutralEmotions} neutral emotional themes appear in your writing, indicating you also spend time in contemplative or observational states, which provides important emotional stability and perspective.` : ''}`,

      growth: `To deepen your emotional intelligence journey, I recommend focusing on the emotional themes that appear less frequently in your writing. ${emotionalRange < 5 ? 
        `Since you currently express ${emotionalRange} distinct emotional themes, try expanding this range by being more specific about your feelings. For example, if you often write about feeling 'good' or 'bad,' explore the subtle differences - are you feeling grateful, content, excited, or peaceful? Are you experiencing disappointment, frustration, sadness, or anxiety?` : 
        `With ${emotionalRange} emotional themes already present in your writing, you demonstrate excellent emotional awareness. Consider exploring the connections between different emotions - how does ${topEmotion.name.toLowerCase()} relate to other feelings you experience? What triggers these emotional states, and how do they influence each other?`}

Your journey toward emotional mastery is well underway. The ${entriesCount} entries you've completed show remarkable commitment to self-understanding, and each additional entry will continue to reveal new layers of your emotional world.`
    };
  };

  // Enhanced function to generate detailed theme insights
  const generateDetailedThemeInsights = (themeData, entriesCount, commonThemes) => {
    if (!themeData || themeData.length === 0) {
      return {
        focus: `From analyzing your ${entriesCount} journal entries, we're still identifying your core thematic patterns. As you continue writing, clearer themes will emerge that reveal what matters most to you. Each entry contributes to a growing picture of your values, interests, and areas of focus. The themes that eventually surface will provide valuable insights into your authentic self and life priorities.`,
        exploration: `With ${entriesCount} entries under analysis, we're in the early stages of understanding your thematic landscape. Continue writing authentically about whatever feels important to you - relationships, work, personal growth, daily experiences, dreams, or challenges. The themes that naturally emerge from your authentic expression will be the most meaningful and revealing.`,
        development: `To help develop clearer thematic patterns, try occasionally reflecting on what topics you find yourself returning to in your writing. Are there certain relationships, goals, values, or experiences that frequently appear in your entries? These recurring elements will become the foundation of your personal theme profile.`
      };
    }

    const topThemes = themeData.slice(0, 5);
    const themeCount = themeData.length;
    const mostFrequentTheme = topThemes[0];

    // Analyze theme categories
    const personalGrowthThemes = themeData.filter(t => 
      ['growth', 'development', 'learning', 'self', 'improvement', 'goals', 'change', 'progress'].some(keyword => 
        t.text.toLowerCase().includes(keyword)
      )
    ).length;

    const relationshipThemes = themeData.filter(t => 
      ['family', 'friends', 'relationship', 'love', 'connection', 'people', 'social', 'partner'].some(keyword => 
        t.text.toLowerCase().includes(keyword)
      )
    ).length;

    const workLifeThemes = themeData.filter(t => 
      ['work', 'career', 'job', 'professional', 'business', 'success', 'achievement', 'productivity'].some(keyword => 
        t.text.toLowerCase().includes(keyword)
      )
    ).length;

    return {
      focus: `After deep analysis of your ${entriesCount} journal entries, I've identified ${themeCount} distinct thematic threads weaving through your writing. Your most prominent theme centers around "${mostFrequentTheme.text}," which appears with notable frequency and suggests this area holds significant importance in your current life experience.

${commonThemes && commonThemes.length > 0 ? 
  `Your core thematic focus areas include: ${commonThemes.slice(0, 3).join(', ')}. These themes represent the primary areas where your mind and heart are currently invested, revealing your authentic priorities and concerns.` : 
  `The top themes emerging from your writing are: ${topThemes.slice(0, 3).map(t => t.text).join(', ')}. These recurring topics demonstrate where your attention and energy naturally flow.`}

This thematic concentration isn't random - it reflects your subconscious mind processing and working through the most significant aspects of your life right now. The prominence of "${mostFrequentTheme.text}" particularly suggests this theme deserves continued exploration and attention in your future journaling sessions.`,

      exploration: `Your thematic landscape reveals fascinating insights about your current life focus. ${personalGrowthThemes > 0 ? 
        `${personalGrowthThemes} of your themes relate to personal growth and development, indicating you're in an active phase of self-improvement and conscious evolution. This suggests you're someone who takes ownership of your personal development journey.` : ''}
        
${relationshipThemes > 0 ? 
  `${relationshipThemes} themes center around relationships and connections, showing that your social world and interpersonal dynamics play a crucial role in your inner life. This relational focus indicates you value deep connections and are processing important relationship dynamics.` : ''}

${workLifeThemes > 0 ? 
  `${workLifeThemes} themes relate to work and career matters, suggesting your professional life is currently demanding significant mental and emotional energy. This career focus indicates you're either navigating important professional decisions or working toward meaningful career goals.` : ''}

The diversity of your ${themeCount} themes demonstrates a well-rounded approach to self-reflection, touching on multiple life areas rather than becoming fixated on a single concern. This balanced thematic distribution suggests emotional and intellectual maturity in your journaling practice.`,

      development: `To maximize the insights from your thematic patterns, I recommend several approaches for your continued journaling journey. First, when you notice yourself writing about "${mostFrequentTheme.text}" again, dig deeper - ask yourself why this theme keeps surfacing and what aspects of it still need exploration or resolution.

Consider dedicating entire journal sessions to your less frequent themes to ensure you're maintaining balance in your self-reflection. While "${mostFrequentTheme.text}" clearly needs attention, your other important themes deserve space too.

Finally, try connecting themes together in your writing. How does your focus on "${mostFrequentTheme.text}" relate to other areas of your life? These thematic connections often reveal the most profound insights about your inner world and can lead to breakthrough moments in self-understanding.

Your ${entriesCount} entries have created a rich thematic tapestry that will only become more meaningful as you continue this practice. Each new entry adds depth and nuance to your personal theme profile.`
    };
  };

  // Enhanced function to generate detailed consistency insights  
  const generateDetailedConsistencyInsights = (calendarData, streak, journeyProgress, entriesCount, activePathsCount, currentPathName) => {
    const daysWithEntries = calendarData.length;
    const totalPossibleDays = 365; // Could be more sophisticated
    const consistencyRate = Math.round((daysWithEntries / totalPossibleDays) * 100);
    
    // Analyze activity patterns
    const entriesByDay = {};
    calendarData.forEach(entry => {
      const dayOfWeek = new Date(entry.date).getDay();
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
      entriesByDay[dayName] = (entriesByDay[dayName] || 0) + entry.count;
    });
    
    const mostActiveDay = Object.entries(entriesByDay).sort((a, b) => b[1] - a[1])[0];
    const leastActiveDay = Object.entries(entriesByDay).sort((a, b) => a[1] - b[1])[0];

    // Calculate average gap between entries
    const sortedDates = calendarData.map(d => new Date(d.date)).sort((a, b) => a - b);
    let totalGaps = 0;
    let gapCount = 0;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const gap = Math.floor((sortedDates[i] - sortedDates[i-1]) / (1000 * 60 * 60 * 24));
      totalGaps += gap;
      gapCount++;
    }
    
    const averageGap = gapCount > 0 ? Math.round(totalGaps / gapCount) : 0;

    return {
      pattern: `Your journaling consistency analysis reveals impressive commitment to your reflection practice. Based on ${entriesCount} total entries across ${daysWithEntries} different days, you've maintained a ${consistencyRate}% consistency rate.

Your focused approach to ${currentPathName} shows dedication to sustained self-reflection. This consistent engagement demonstrates your commitment to personal growth and inner exploration.

${mostActiveDay ? 
  `Your most productive journaling day is ${mostActiveDay[0]}, where you've completed ${mostActiveDay[1]} entries. This pattern suggests that ${mostActiveDay[0]}s provide optimal conditions for your writing - perhaps due to having more time, mental space, or emotional readiness for introspection.` : ''}

${leastActiveDay && mostActiveDay && leastActiveDay[0] !== mostActiveDay[0] ? 
  `In contrast, ${leastActiveDay[0]} appears to be your most challenging day for journaling, with only ${leastActiveDay[1]} entries. Understanding this pattern can help you either adjust expectations or find ways to make journaling more accessible on these days.` : ''}

${averageGap > 0 ? 
  `The average gap between your journal entries is ${averageGap} days, which ${averageGap <= 2 ? 'shows excellent momentum and habit formation.' : averageGap <= 7 ? 'indicates a healthy, sustainable practice.' : 'suggests there\'s room to develop more frequent habits if that aligns with your goals.'}` : ''}`,

      streak: `Your current streak of ${streak} consecutive days ${streak > 0 ? 
        `represents remarkable commitment to your personal development journey. Maintaining consistency for ${streak} days requires discipline, intention, and prioritization of your inner development.

${streak >= 7 ? 
  streak >= 30 ? 
    `Achieving a 30+ day streak puts you in an elite category of dedicated personal development practitioners. This level of consistency creates profound neural pathways that support ongoing self-awareness, emotional regulation, and deep personal growth. Your streak represents a lifestyle of intentional self-development.` : 
    streak >= 14 ? 
      `Your two-week streak indicates you've successfully moved beyond initial motivation into genuine habit formation. This is where real transformation begins, as journaling becomes integrated into your routine.` : 
      `Your week-long streak shows you've established initial momentum. You're past the hardest part and building toward automatic habit formation.` 
  : `shows promise for developing sustained consistency. Each day you maintain this streak strengthens the neural pathways associated with self-reflection and emotional awareness.`}` : 
        `represents an opportunity to build momentum in your journaling practice. Starting a streak can be transformative for establishing consistency and deepening the benefits of regular self-reflection.`}

${streak > 0 ? 
  `To protect and extend your ${streak}-day streak, consider identifying the specific conditions that have supported your success. What time of day works best? What environment supports your writing? What keeps you motivated? Understanding these success factors will help you maintain consistency even when motivation fluctuates.` : 
  `Building your first streak could be transformative. Start with a modest goal - perhaps 3 consecutive days - and gradually extend as the habit strengthens.`}`,

      milestone: `Your journey progress of ${journeyProgress}% represents significant achievement in your self-development journey. Your focused progress in ${currentPathName} shows dedication to deep development in this specific area.

${journeyProgress >= 75 ? 
  `At ${journeyProgress}% completion, you're in the final stretch of your current journey, where individual insights connect into larger patterns and breakthrough realizations become possible.` : 
  journeyProgress >= 50 ? 
    `Reaching ${journeyProgress}% completion is a major milestone. You've moved beyond initial exploration into deeper territory where patterns become clear and insights become more profound.` : 
    journeyProgress >= 25 ? 
      `Your ${journeyProgress}% progress shows you've established solid foundations in your journaling practice. You're past the initial adjustment period and beginning to see deeper benefits.` : 
      `At ${journeyProgress}% progress, you're in the important foundation-building phase. Each entry establishes the groundwork for deeper insights that will emerge as you continue.`}

The ${entriesCount} total entries you've completed represent hours of dedicated self-reflection and conscious personal development. This investment in understanding yourself creates compound returns - each entry builds on previous insights, creating an ever-deepening well of self-knowledge.

${journeyProgress < 100 ? 
  `To reach your next major milestone, continue your consistent practice. Consider this not as a burden, but as an opportunity to discover what insights and transformations await in your continued practice.` : 
  `Having reached completion, you've achieved something remarkable. This represents not just finished assignments, but a transformed relationship with self-reflection. Consider beginning a new journey to continue this momentum.`}

Your consistency patterns reveal someone who understands the value of inner work and is committed to personal development. This dedication to self-understanding is one of the most valuable investments you can make in your life satisfaction, relationships, and overall well-being.`
    };
  };
  
  // Calculate basic stats with improved path support
  const calculateStats = () => {
    if (!entries.length) {
      return {
        totalEntries: 0,
        averageLength: 0,
        journeyProgress: 0,
        longestStreak: 0,
        commonThemes: [],
        wordsWritten: 0,
        activePathsCount: 0,
        currentPathName: 'No Active Path'
      };
    }
    
    const totalEntries = entries.length;
    
    // Calculate average length of entries
    const totalTextLength = entries.reduce((sum, entry) => {
      const entryText = entry.extractedText || '';
      return sum + entryText.length;
    }, 0);
    
    const averageLength = Math.round(totalTextLength / totalEntries);
    
    // Estimate total words written (rough approximation)
    const wordsWritten = Math.round(totalTextLength / 5);
    
    // Get all active paths from user profile
    const getActivePathsFromProfile = () => {
      if (!userProfile?.journeyProgress) return [];
      
      const activePaths = [];
      
      // Check for legacy self-discovery structure
      if (userProfile.journeyProgress.completedDays && 
          userProfile.journeyProgress.completedDays.length > 0) {
        activePaths.push({
          pathId: 'self-discovery',
          completedDays: userProfile.journeyProgress.completedDays,
          totalDays: 10
        });
      }
      
      // Loop through all progress fields
      Object.entries(userProfile.journeyProgress).forEach(([field, progress]) => {
        if (!field.endsWith('Progress') || !progress?.completedDays?.length) return;
        
        // Convert progress field back to path ID
        const pathId = field.replace('Progress', '')
          .replace(/([A-Z])/g, '-$1')
          .toLowerCase()
          .substring(1); // Remove leading dash
        
        // Skip if we already added self-discovery
        if (pathId === 'self-discovery' && activePaths.some(p => p.pathId === 'self-discovery')) {
          return;
        }
        
        activePaths.push({
          pathId,
          completedDays: progress.completedDays,
          totalDays: getJourneyLength(pathId)
        });
      });
      
      return activePaths;
    };
    
    const activePaths = getActivePathsFromProfile();
    const activePathsCount = activePaths.length;
    
    // Calculate journey progress based on selected journey or active paths
    let journeyProgress = 0;
    let currentPathName = 'No Active Path';
    
    if (selectedJourney !== 'all') {
      // Calculate progress for specific selected journey
      const progressField = getProgressFieldForPath(selectedJourney);
      const completedDays = userProfile?.journeyProgress?.[progressField]?.completedDays || [];
      const pathDayCount = getJourneyLength(selectedJourney);
      
      journeyProgress = Math.min(Math.round((completedDays.length / pathDayCount) * 100), 100);
      currentPathName = getPathDisplayName(selectedJourney);
    } else if (activePathsCount > 0) {
      // Calculate aggregate progress across all active paths
      if (activePathsCount === 1) {
        // Single active path - show its progress
        const singlePath = activePaths[0];
        journeyProgress = Math.min(Math.round((singlePath.completedDays.length / singlePath.totalDays) * 100), 100);
        currentPathName = getPathDisplayName(singlePath.pathId);
      } else {
        // Multiple active paths - show weighted average progress
        let totalProgress = 0;
        let totalWeight = 0;
        
        activePaths.forEach(path => {
          const pathProgress = (path.completedDays.length / path.totalDays) * 100;
          const weight = path.totalDays; // Weight by path length
          totalProgress += pathProgress * weight;
          totalWeight += weight;
        });
        
        journeyProgress = Math.min(Math.round(totalProgress / totalWeight), 100);
        currentPathName = `${activePathsCount} Active Paths`;
      }
    } else {
      // No active paths - fallback calculation
      journeyProgress = Math.min(Math.round((totalEntries / 10) * 100), 100);
      currentPathName = 'Getting Started';
    }
    
    // Get longest streak (global across all paths)
    const longestStreak = userProfile?.journeyProgress?.streak || 
                        Math.max(...activePaths.map(p => 
                          userProfile?.journeyProgress?.[getProgressFieldForPath(p.pathId)]?.currentStreak || 0
                        ), 0);
    
    // Get common themes from progress report or calculate from entries
    let commonThemes = progressReport?.commonThemes || [];
    
    if (commonThemes.length === 0 && entries.length > 0) {
      // Extract themes from entries
      const extractedThemes = extractThemesFromEntries(entries);
      commonThemes = extractedThemes.slice(0, 3).map(theme => theme.text);
    }
    
    return {
      totalEntries,
      averageLength,
      journeyProgress,
      longestStreak,
      commonThemes,
      wordsWritten,
      activePathsCount,
      currentPathName
    };
  };
  
  // Helper function to get journey length
  const getJourneyLength = (pathId) => {
    switch(pathId) {
      case 'transformation-journey':
        return 21;
      case 'habit-formation':
        return 30;
      case 'creative-expression':
        return 14;
      case 'life-vision':
        return 100;
      case 'emotional-intelligence':
      case 'mindfulness-awareness':
      case 'self-discovery':
      default:
        return 10;
    }
  };
  
  // Helper function to get progress field name for a path
  const getProgressFieldForPath = (pathId) => {
    switch(pathId) {
      case 'self-discovery':
        return 'selfDiscoveryProgress';
      case 'emotional-intelligence':
        return 'emotionalIntelligenceProgress';
      case 'mindfulness-awareness':
        return 'mindfulnessAwarenessProgress';
      case 'transformation-journey':
        return 'transformationJourneyProgress';
      case 'creative-expression':
        return 'creativeExpressionProgress';
      case 'habit-formation':
        return 'habitFormationProgress';
      case 'life-vision':
        return 'lifeVisionProgress';
      default:
        return pathId.replace(/-/g, '') + 'Progress';
    }
  };
  
  // Calculate stats outside render for better performance
  const stats = calculateStats();
  
  // Process data for visualizations
  const emotionData = entries.length > 0 ? extractEmotionData(entries).emotions : [];
  const themeData = entries.length > 0 ? extractThemesFromEntries(entries) : [];
  const calendarData = processCalendarData();
  
  // Generate detailed insights
  const emotionalInsights = generateDetailedEmotionalInsights(emotionData, entries.length);
  const themeInsights = generateDetailedThemeInsights(themeData, entries.length, stats.commonThemes);
  const consistencyInsights = generateDetailedConsistencyInsights(
    calendarData, 
    stats.longestStreak, 
    stats.journeyProgress, 
    entries.length,
    stats.activePathsCount,
    stats.currentPathName
  );
  
  // Get available journey paths for filter
  const getAvailableJourneys = () => {
    if (!entries || entries.length === 0) return [];
    
    // Get unique path IDs
    const uniquePaths = [...new Set(entries.map(entry => entry.pathId))].filter(Boolean);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    
    // Map path IDs to display names
    return uniquePaths.map(pathId => ({
      id: pathId,
      name: getPathDisplayName(pathId)
    }));
  };
  
<<<<<<< HEAD
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
=======
  // Get display name for a path
  const getPathDisplayName = (pathId) => {
    switch(pathId) {
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      case 'self-discovery':
        return 'Self-Discovery Journey';
      case 'emotional-intelligence':
        return 'Emotional Intelligence Expedition';
      case 'mindfulness-awareness':
        return 'Mindfulness & Present Awareness';
<<<<<<< HEAD
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
=======
      case 'transformation-journey':
        return 'Transformation Journey';
      case 'creative-expression':
        return 'Creative Expression';
      case 'habit-formation':
        return 'Habit Formation';
      case 'life-vision':
        return 'Life Vision & Purpose';
      case 'life-values':
        return 'Life Values & Core Principles';
      case 'relationship-mastery':
        return 'Relationship Mastery';
      case 'financial-mindfulness':
        return 'Financial Mindfulness';
      case 'gratitude-practice':
        return 'Gratitude Practice';
      case 'shadow-work':
        return 'Shadow Work';
      case 'nature-connection':
        return 'Nature Connection';
      case 'holistic-transformation':
        return 'Holistic Transformation';
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      default:
        return pathId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };
  
  const availableJourneys = getAvailableJourneys();
  
<<<<<<< HEAD
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
=======
  // If there's not enough data, show a message
  const notEnoughData = entries.length < 2;
  
  return (
    <div className={`analytics-dashboard ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Header with mobile-optimized design */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <span className="title-icon">
              <BarChart2 />
            </span>
            Journal Analytics
          </h1>
          <p className="dashboard-subtitle">Discover insights and patterns in your journaling practice</p>
          
          {/* Analysis Info Bar - Mobile optimized */}
          <div className="analysis-info-bar">
            <div className="analysis-info-item">
              <FileText size={14} />
              <span>{entries.length} entries</span>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
            </div>
            <div className="analysis-info-item">
              <Calendar size={14} />
              <span>{calendarData.length} active days</span>
            </div>
            <div className="analysis-info-item">
              <Brain size={14} />
              <span>AI insights</span>
            </div>
<<<<<<< HEAD
            {displayStats.isFiltered && (
              <div className="analysis-info-item">
                <Filter size={14} />
                <span>Filtered: {displayStats.displayEntries}/{displayStats.totalEntries}</span>
=======
            {timePeriod !== 'all' && (
              <div className="analysis-info-item">
                <Clock size={14} />
                <span>{timePeriod}</span>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
              </div>
            )}
          </div>
        </div>
<<<<<<< HEAD
      </div>
      
      {/* Mobile filters */}
=======
        
        <div className="header-actions">
          <button 
            onClick={handleRefresh}
            className={`refresh-button ${isRefreshing ? 'refreshing' : ''}`}
            disabled={isRefreshing}
            aria-label="Refresh analytics"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>
      
      {/* Mobile-friendly filters */}
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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
      
<<<<<<< HEAD
      {/* Error state */}
      {(error || statsError) && !shouldShowLoader && (
        <div className="error-container">
          <AlertCircle size={32} />
          <h2 className="message-title">Something went wrong</h2>
          <p className="message-text">{error || statsError}</p>
=======
      {/* Loading state */}
      {isLoading && (
        <div className="loading-container">
          <div className="loading-shimmer">
            <Loader className="loading-icon" />
          </div>
          <p className="loading-text">Analyzing your journal entries...</p>
        </div>
      )}
      
      {/* Error state */}
      {error && !isLoading && (
        <div className="error-container">
          <div className="error-icon-container">
            <AlertCircle className="error-icon" />
          </div>
          <h2 className="message-title">Something went wrong</h2>
          <p className="error-text">{error}</p>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
          <button 
            onClick={handleRefresh}
            className="retry-button"
          >
<<<<<<< HEAD
            <RefreshCw size={16} />
=======
            <RefreshCw className="retry-icon" />
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
            Try Again
          </button>
        </div>
      )}
      
      {/* Not enough data */}
<<<<<<< HEAD
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
=======
      {notEnoughData && !isLoading && !error && (
        <div className="not-enough-data">
          <div className="message-container">
            <div className="message-icon-container">
              <BarChart2 className="message-icon" />
            </div>
            <h2 className="message-title">Not Enough Data</h2>
            <p className="message-text">
              Complete at least 2 journal entries to see analytics.
              The more you journal, the richer and more personalized your insights become!
            </p>
            <button 
              className="action-button"
              onClick={() => navigateToScreen('upload')}
            >
              <MessageCircle size={18} />
              Write a Journal Entry
            </button>
          </div>
        </div>
      )}
      
      {/* Dashboard content */}
      {!isLoading && !error && !notEnoughData && (
        <>
          {/* Mobile-optimized stats overview */}
          <div className="stats-overview" ref={statsRef}>
            <div 
              className={`stat-card ${animateStats ? 'animate' : ''}`} 
              style={{"--delay": "0s"}}
            >
              <div className="stat-icon-container">
                <BookOpen className="stat-icon" />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Entries</div>
                <div className="stat-value">{stats.totalEntries}</div>
                <div className="stat-subtext">analyzed by Claude</div>
              </div>
            </div>
            
            <div 
              className={`stat-card ${animateStats ? 'animate' : ''}`} 
              style={{"--delay": "0.1s"}}
            >
              <div className="stat-icon-container">
                <Map className="stat-icon" />
              </div>
              <div className="stat-content">
                <div className="stat-label">Journey Progress</div>
                <div className="stat-value">{stats.journeyProgress}%</div>
                <div className="stat-subtext">{stats.currentPathName}</div>
              </div>
            </div>
            
            <div 
              className={`stat-card ${animateStats ? 'animate' : ''}`} 
              style={{"--delay": "0.2s"}}
            >
              <div className="stat-icon-container">
                <Award className="stat-icon" />
              </div>
              <div className="stat-content">
                <div className="stat-label">Words Written</div>
                <div className="stat-value">{stats.wordsWritten.toLocaleString()}</div>
                <div className="stat-subtext">across all entries</div>
              </div>
            </div>
            
            <div 
              className={`stat-card ${animateStats ? 'animate' : ''}`} 
              style={{"--delay": "0.3s"}}
            >
              <div className="stat-icon-container">
                <Flame className="stat-icon" />
              </div>
              <div className="stat-content">
                <div className="stat-label">Longest Streak</div>
                <div className="stat-value">{stats.longestStreak} days</div>
                <div className="stat-subtext">consecutive entries</div>
              </div>
            </div>
          </div>
          
          {/* Mobile-optimized tabs */}
          <div className="dashboard-tabs-container">
            <div className="dashboard-tabs">
              <button 
                className={`dashboard-tab ${activeSection === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveSection('overview')}
              >
                Overview
              </button>
              <button 
                className={`dashboard-tab ${activeSection === 'emotions' ? 'active' : ''}`}
                onClick={() => setActiveSection('emotions')}
              >
                Emotions
              </button>
              <button 
                className={`dashboard-tab ${activeSection === 'themes' ? 'active' : ''}`}
                onClick={() => setActiveSection('themes')}
              >
                Themes
              </button>
              <button 
                className={`dashboard-tab ${activeSection === 'consistency' ? 'active' : ''}`}
                onClick={() => setActiveSection('consistency')}
              >
                Consistency
              </button>
            </div>
          </div>
          
          {/* Dashboard sections */}
          <div className="dashboard-content">
            {/* Overview section */}
            {activeSection === 'overview' && (
              <div className="dashboard-section fade-in">
                <div className="section-header">
                  <h2 className="section-title">
                    Journal Overview
                    <span className="section-title-decoration"></span>
                  </h2>
                  <p className="analysis-context">Based on analysis of {entries.length} journal entries</p>
                </div>
                
                {/* Insight summary */}
                <div className="insight-container slide-in-right" style={{"--delay": "0.1s"}}>
                  <InsightSummary 
                    entries={entries} 
                    progressReport={progressReport}
                  />
                </div>
                
                {/* Mobile-optimized visualizations - stacked layout */}
                <div className="visualization-grid">
                  {/* Emotion trends */}
                  <div className="visualization-card slide-in-bottom" style={{"--delay": "0.2s"}}>
                    <h3 className="visualization-title">
                      <Heart className="visualization-title-icon" />
                      Emotion Trends
                      <span className="data-count">({emotionData.length} emotions)</span>
                    </h3>
                    <div className="visualization-content small">
                      <EmotionTrends data={emotionData} simplified={true} chartType="pie" isDarkMode={isDarkMode} />
                    </div>
                    <button 
                      className="view-more-button"
                      onClick={() => setActiveSection('emotions')}
                    >
                      View Detailed Analysis
                    </button>
                  </div>
                  
                  {/* Theme cloud */}
                  <div className="visualization-card slide-in-bottom" style={{"--delay": "0.3s"}}>
                    <h3 className="visualization-title">
                      <Cloud className="visualization-title-icon" />
                      Common Themes
                      <span className="data-count">({themeData.length} themes)</span>
                    </h3>
                    <div className="visualization-content small">
                      <ThemeCloud data={themeData} simplified={true} isDarkMode={isDarkMode} />
                    </div>
                    <button 
                      className="view-more-button"
                      onClick={() => setActiveSection('themes')}
                    >
                      Explore Your Themes
                    </button>
                  </div>
                </div>
                
                {/* Calendar */}
                <div className="visualization-card slide-in-bottom" style={{"--delay": "0.4s"}}>
                  <h3 className="visualization-title">
                    <CalendarIcon className="visualization-title-icon" />
                    Journaling Activity
                    <span className="data-count">({calendarData.length} active days)</span>
                  </h3>
                  <div className="visualization-content medium">
                    <JournalCalendar data={calendarData} simplified={true} />
                  </div>
                  <button 
                    className="view-more-button"
                    onClick={() => setActiveSection('consistency')}
                  >
                    View Consistency Analysis
                  </button>
                </div>
                
                {/* Achievement badges */}
                <div className="progress-badges-section slide-in-bottom" style={{"--delay": "0.5s"}}>
                  <h3 className="section-subtitle">
                    <Award className="section-subtitle-icon" />
                    Your Achievements
                  </h3>
                  
                  <div className="progress-badges">
                    {stats.totalEntries >= 1 && (
                      <div className="badge">
                        <div className="badge-icon">
                          <CheckCircle />
                        </div>
                        <div className="badge-label">First Entry</div>
                      </div>
                    )}
                    
                    {stats.totalEntries >= 5 && (
                      <div className="badge">
                        <div className="badge-icon">
                          <CheckCircle />
                        </div>
                        <div className="badge-label">5 Entries</div>
                      </div>
                    )}
                    
                    {stats.totalEntries >= 10 && (
                      <div className="badge">
                        <div className="badge-icon">
                          <CheckCircle />
                        </div>
                        <div className="badge-label">10 Entries</div>
                      </div>
                    )}
                    
                    {stats.longestStreak >= 3 && (
                      <div className="badge">
                        <div className="badge-icon">
                          <Flame />
                        </div>
                        <div className="badge-label">3-Day Streak</div>
                      </div>
                    )}
                    
                    {stats.longestStreak >= 7 && (
                      <div className="badge">
                        <div className="badge-icon">
                          <Flame />
                        </div>
                        <div className="badge-label">Weekly Warrior</div>
                      </div>
                    )}
                    
                    {stats.wordsWritten >= 1000 && (
                      <div className="badge">
                        <div className="badge-icon">
                          <BookOpen />
                        </div>
                        <div className="badge-label">1000+ Words</div>
                      </div>
                    )}
                    
                    {stats.journeyProgress >= 50 && (
                      <div className="badge">
                        <div className="badge-icon">
                          <Map />
                        </div>
                        <div className="badge-label">Halfway There</div>
                      </div>
                    )}
                    
                    {stats.journeyProgress >= 100 && (
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
            )}
            
            {/* Emotions section */}
            {activeSection === 'emotions' && (
              <div className="dashboard-section fade-in">
                <div className="section-header">
                  <h2 className="section-title">
                    Emotional Patterns
                    <span className="section-title-decoration"></span>
                  </h2>
                  <p className="analysis-context">
                    Deep analysis of {entries.length} entries revealing {emotionData.length} distinct emotional themes
                  </p>
                </div>
                
                <div className="visualization-card full slide-in-bottom" style={{"--delay": "0.1s"}}>
                  <h3 className="visualization-title">
                    <Heart className="visualization-title-icon" />
                    Emotional Analysis
                    <span className="data-count">Based on {entries.length} journal entries</span>
                  </h3>
                  <div className="visualization-content large">
                    <EmotionTrends data={emotionData} hideTitle={true} isDarkMode={isDarkMode} />
                  </div>
                  
                  <div className="visualization-explanation">
                    <h4 className="explanation-title">Understanding Your Emotional Patterns</h4>
                    <p className="explanation-text">
                      This visualization represents the emotional intensity detected across your {entries.length} journal entries.
                      Higher values indicate stronger presence of that emotion in your writing.
                    </p>
                  </div>
                </div>
      
                {/* Mobile-stacked emotion insights */}
                <div className="emotion-insights slide-in-bottom" style={{"--delay": "0.2s"}}>
                  <h3 className="section-subtitle">
                    <Brain className="section-subtitle-icon" />
                    Your Emotional Journey - Detailed Analysis
                  </h3>
                  
                  <div className="detailed-insights-container">
                    <div className="detailed-insight-card">
                      <h4 className="detailed-insight-title">
                        <Target className="detailed-insight-icon" />
                        Primary Emotional Patterns
                      </h4>
                      <div className="detailed-insight-content">
                        <p>{emotionalInsights.primary}</p>
                      </div>
                    </div>
                    
                    <div className="detailed-insight-card">
                      <h4 className="detailed-insight-title">
                        <BarChart3 className="detailed-insight-icon" />
                        Emotional Balance Assessment
                      </h4>
                      <div className="detailed-insight-content">
                        <p>{emotionalInsights.balance}</p>
                      </div>
                    </div>
                    
                    <div className="detailed-insight-card">
                      <h4 className="detailed-insight-title">
                        <TrendingUp className="detailed-insight-icon" />
                        Growth Recommendations
                      </h4>
                      <div className="detailed-insight-content">
                        <p>{emotionalInsights.growth}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Entry emotions list */}
                <div className="entries-list-container slide-in-bottom" style={{"--delay": "0.3s"}}>
                  <h3 className="entries-list-title">
                    <MessageCircle className="entries-list-icon" />
                    Most Emotionally Rich Entries
                    <span className="data-count">From {entries.length} total entries</span>
                  </h3>
                  
                  {entries.length > 0 ? (
                    <div className="entries-list">
                      {entries
                        .filter(entry => entry.analysis && entry.analysis.summary)
                        .slice(0, 5)
                        .map((entry, index) => (
                          <div 
                            key={entry.day || index} 
                            className="entry-item detailed"
                            onClick={() => navigateToScreen('daily', { day: entry.day, pathId: entry.pathId })}
                            style={{"--delay": `${0.15 * index}s`}}
                          >
                            <div className="entry-day">Day {entry.day}</div>
                            <div className="entry-content">
                              <div className="entry-theme">{entry.theme || 'Reflection'}</div>
                              <div className="entry-summary">{entry.analysis.summary}</div>
                              <div className="entry-meta">
                                {entry.extractedText && (
                                  <span className="entry-word-count">
                                    ~{Math.round(entry.extractedText.length / 5)} words
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ) : (
                    <p className="no-entries-message">No entries with emotional analysis available.</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Themes section */}
            {activeSection === 'themes' && (
              <div className="dashboard-section fade-in">
                <div className="section-header">
                  <h2 className="section-title">
                    Recurring Themes
                    <span className="section-title-decoration"></span>
                  </h2>
                  <p className="analysis-context">
                    Thematic analysis of {entries.length} entries identifying {themeData.length} unique themes
                  </p>
                </div>
                
                <div className="visualization-card full slide-in-bottom" style={{"--delay": "0.1s"}}>
                  <h3 className="visualization-title">
                    <Cloud className="visualization-title-icon" />
                    Theme Cloud
                    <span className="data-count">Generated from {entries.length} journal entries</span>
                  </h3>
                  <div className="visualization-content large theme-cloud">
                    <ThemeCloud data={themeData} isDarkMode={isDarkMode} />
                  </div>
                  
                  <div className="visualization-explanation">
                    <h4 className="explanation-title">Discovering What Matters Most to You</h4>
                    <p className="explanation-text">
                      This word cloud represents the thematic DNA of your journaling practice, extracted from {entries.length} entries 
                      using advanced text analysis. Larger words represent themes that appear more frequently across your writing.
                    </p>
                  </div>
                </div>
                
                {/* Theme insights */}
                <div className="theme-insights slide-in-bottom" style={{"--delay": "0.2s"}}>
                  <h3 className="section-subtitle">
                    <Lightbulb className="section-subtitle-icon" />
                    Your Thematic Landscape - Deep Dive Analysis
                  </h3>
                  
                  <div className="detailed-insights-container">
                    <div className="detailed-insight-card">
                      <h4 className="detailed-insight-title">
                        <Target className="detailed-insight-icon" />
                        Current Life Focus Areas
                      </h4>
                      <div className="detailed-insight-content">
                        <p>{themeInsights.focus}</p>
                      </div>
                    </div>
                    
                    <div className="detailed-insight-card">
                      <h4 className="detailed-insight-title">
                        <Map className="detailed-insight-icon" />
                        Thematic Exploration & Patterns
                      </h4>
                      <div className="detailed-insight-content">
                        <p>{themeInsights.exploration}</p>
                      </div>
                    </div>
                    
                    <div className="detailed-insight-card">
                      <h4 className="detailed-insight-title">
                        <TrendingUp className="detailed-insight-icon" />
                        Development Opportunities
                      </h4>
                      <div className="detailed-insight-content">
                        <p>{themeInsights.development}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Theme frequency breakdown */}
                {themeData.length > 0 && (
                  <div className="themes-breakdown-container slide-in-bottom" style={{"--delay": "0.3s"}}>
                    <h3 className="themes-list-title">
                      <BarChart3 className="themes-list-icon" />
                      Theme Frequency Analysis
                      <span className="data-count">Top themes from {entries.length} entries</span>
                    </h3>
                    <div className="themes-frequency-list">
                      {themeData.slice(0, 10).map((theme, index) => (
                        <div key={index} className="theme-frequency-item" style={{"--delay": `${0.1 * index}s`}}>
                          <div className="theme-name">{theme.text}</div>
                          <div className="theme-frequency-bar">
                            <div 
                              className="theme-frequency-fill" 
                              style={{ 
                                width: `${(theme.size / themeData[0].size) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <div className="theme-mentions">
                            {Math.round(theme.size * 10)} mentions
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Consistency section */}
            {activeSection === 'consistency' && (
              <div className="dashboard-section fade-in">
                <div className="section-header">
                  <h2 className="section-title">
                    Journaling Consistency
                    <span className="section-title-decoration"></span>
                  </h2>
                  <p className="analysis-context">
                    Consistency analysis based on {entries.length} entries across {calendarData.length} active days
                  </p>
                </div>

                {/* Calendar Section */}
                <div className="visualization-card full slide-in-bottom" style={{"--delay": "0.1s"}}>
                  <h3 className="visualization-title">
                    <CalendarIcon className="visualization-title-icon" />
                    Activity Heatmap
                    <span className="data-count">{calendarData.length} days with journal entries</span>
                  </h3>
                  <JournalCalendar data={calendarData} />
                </div>
                
                {/* Consistency Insights */}
                <div className="consistency-insights slide-in-bottom" style={{"--delay": "0.2s"}}>
                  <h3 className="section-subtitle">
                    <Brain className="section-subtitle-icon" />
                    Your Consistency Journey - Comprehensive Analysis
                  </h3>
                  
                  <div className="detailed-insights-container">
                    <div className="detailed-insight-card">
                      <h4 className="detailed-insight-title">
                        <Calendar className="detailed-insight-icon" />
                        Activity Pattern Analysis
                      </h4>
                      <div className="detailed-insight-content">
                        <p>{consistencyInsights.pattern}</p>
                      </div>
                    </div>
                    
                    <div className="detailed-insight-card">
                      <h4 className="detailed-insight-title">
                        <Flame className="detailed-insight-icon" />
                        Streak Performance & Momentum
                      </h4>
                      <div className="detailed-insight-content">
                        <p>{consistencyInsights.streak}</p>
                      </div>
                    </div>
                    
                    <div className="detailed-insight-card">
                      <h4 className="detailed-insight-title">
                        <Award className="detailed-insight-icon" />
                        Progress Milestones & Future Goals
                      </h4>
                      <div className="detailed-insight-content">
                        <p>{consistencyInsights.milestone}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Consistency Metrics */}
                <div className="consistency-stats-container slide-in-bottom" style={{"--delay": "0.3s"}}>
                  <h3 className="section-subtitle">
                    <BarChart3 className="section-subtitle-icon" />
                    Detailed Consistency Metrics
                    <span className="data-count">From {entries.length} total entries</span>
                  </h3>
                  
                  <div className="consistency-stats enhanced">
                    <div className="consistency-stat">
                      <h4 className="consistency-stat-label">Current Streak</h4>
                      <div className="consistency-stat-value">{userProfile?.journeyProgress?.streak || 0} days</div>
                      <div className="stat-bar-container">
                        <div 
                          className="stat-bar-fill" 
                          style={{
                            width: `${Math.min(100, ((userProfile?.journeyProgress?.streak || 0) / 10) * 100)}%`
                          }}
                        ></div>
                      </div>
                      <div className="stat-description">
                        {userProfile?.journeyProgress?.streak > 0 ? 
                          `${userProfile?.journeyProgress?.streak} consecutive days of reflection` : 
                          'Ready to start your first streak!'}
                      </div>
                    </div>
                    
                    <div className="consistency-stat">
                      <h4 className="consistency-stat-label">Journey Progress</h4>
                      <div className="consistency-stat-value">{stats.journeyProgress}%</div>
                      <div className="stat-bar-container">
                        <div 
                          className="stat-bar-fill"
                          style={{
                            width: `${stats.journeyProgress}%`
                          }}
                        ></div>
                      </div>
                      <div className="stat-description">
                        of your current journaling path completed
                      </div>
                    </div>
                    
                    <div className="consistency-stat">
                      <h4 className="consistency-stat-label">Active Days</h4>
                      <div className="consistency-stat-value">{calendarData.length}</div>
                      <div className="stat-bar-container">
                        <div 
                          className="stat-bar-fill"
                          style={{
                            width: `${Math.min(100, (calendarData.length / 30) * 100)}%`
                          }}
                        ></div>
                      </div>
                      <div className="stat-description">
                        days with journal activity tracked
                      </div>
                    </div>
                    
                    <div className="consistency-stat">
                      <h4 className="consistency-stat-label">Average Entry Length</h4>
                      <div className="consistency-stat-value">{stats.averageLength}</div>
                      <div className="stat-bar-container">
                        <div 
                          className="stat-bar-fill"
                          style={{
                            width: `${Math.min(100, (stats.averageLength / 500) * 100)}%`
                          }}
                        ></div>
                      </div>
                      <div className="stat-description">
                        characters per journal entry on average
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
          </div>
        </>
      )}
    </div>
  );
};

export default JournalAnalyticsDashboard;