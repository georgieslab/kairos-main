// src/hooks/useUserStatistics.js
// Centralized hook to eliminate data duplication across components

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPreviousEntries } from '../services/claudeService';
import { useUserProgress } from './useUserProgress';

export const useUserStatistics = () => {
  const { currentUser, userProfile } = useAuth();
  const { 
    inProgressPaths, 
    completedPaths, 
    stats: progressStats 
  } = useUserProgress();
  
  // Single source of truth for all entries
  const [allEntries, setAllEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch all entries once and cache them
  useEffect(() => {
    const fetchAllEntries = async () => {
      if (!currentUser) {
        setAllEntries([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const entries = await getPreviousEntries(currentUser.uid, 'all');
        setAllEntries(entries);
        setLastUpdated(new Date());
        
        console.log('📊 Centralized Stats - Fetched entries:', entries.length);
      } catch (err) {
        console.error('Error fetching user entries:', err);
        setError(err.message);
        // Fallback to empty array
        setAllEntries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllEntries();
  }, [currentUser]);

  // Memoized comprehensive statistics
  const statistics = useMemo(() => {
    const totalEntries = allEntries.length;
    
    if (totalEntries === 0) {
      return {
        totalEntries: 0,
        totalWords: 0,
        averageLength: 0,
        activeDays: 0,
        currentStreak: progressStats.currentStreak || 0,
        longestStreak: progressStats.longestStreak || 0,
        activePathsCount: inProgressPaths.length,
        completedPathsCount: completedPaths.length,
        totalPathsStarted: inProgressPaths.length + completedPaths.length,
        journeyProgress: 0,
        currentPathName: 'No Active Path',
        lastEntryDate: null,
        entriesThisWeek: 0,
        entriesThisMonth: 0,
        isConsistent: false,
        // Secret Achievement Stats
        nightAndDayCount: 0,
        uniqueEmotionsCount: 0,
        randomPathsCompleted: 0,
        achievedGoalsCount: 0,
        totalInsights: 0,
        allEntries: [], // Provide access to raw data when needed
        isEmpty: true
      };
    }

    // Calculate comprehensive stats
    const totalTextLength = allEntries.reduce((sum, entry) => {
      return sum + (entry.extractedText?.length || 0);
    }, 0);

    const averageLength = Math.round(totalTextLength / totalEntries);
    const totalWords = Math.round(totalTextLength / 5); // Approximate words

    // Calculate total insights
    const totalInsights = allEntries.reduce((sum, entry) => {
      return sum + (entry.analysis?.insights?.length || 0);
    }, 0);

    // 🎭 SECRET ACHIEVEMENT TRACKING 🎭
    
    // 1. Night & Day Achievement - Journal both early morning & late night same day
    const nightAndDayCount = (() => {
      const dayEntries = {};
      
      allEntries.forEach(entry => {
        if (!entry.timestamp) return;
        
        try {
          let date;
          if (entry.timestamp.toDate) {
            date = entry.timestamp.toDate();
          } else if (entry.timestamp.seconds) {
            date = new Date(entry.timestamp.seconds * 1000);
          } else {
            date = new Date(entry.timestamp);
          }
          
          const dayKey = date.toDateString();
          const hour = date.getHours();
          
          if (!dayEntries[dayKey]) {
            dayEntries[dayKey] = { morning: false, night: false };
          }
          
          // Early morning: before 9 AM
          if (hour >= 5 && hour < 9) {
            dayEntries[dayKey].morning = true;
          }
          // Late night: after 10 PM
          if (hour >= 22 || hour < 5) {
            dayEntries[dayKey].night = true;
          }
        } catch (err) {
          console.error('Error processing timestamp:', err);
        }
      });
      
      // Count days with both morning and night entries
      return Object.values(dayEntries).filter(day => day.morning && day.night).length;
    })();

    // 2. Mood Master Achievement - Experience all emotion categories
    const uniqueEmotionsCount = (() => {
      const emotionCategories = new Set();
      const emotionKeywords = {
        joy: ['happy', 'joyful', 'excited', 'delighted', 'cheerful', 'elated', 'content', 'pleased'],
        sadness: ['sad', 'down', 'depressed', 'melancholy', 'grief', 'sorrow', 'unhappy', 'blue'],
        anger: ['angry', 'frustrated', 'irritated', 'annoyed', 'furious', 'mad', 'upset', 'rage'],
        fear: ['afraid', 'scared', 'anxious', 'worried', 'nervous', 'fearful', 'terrified', 'panic'],
        surprise: ['surprised', 'amazed', 'astonished', 'shocked', 'startled', 'unexpected'],
        disgust: ['disgusted', 'repulsed', 'revolted', 'appalled', 'sick'],
        trust: ['trusting', 'confident', 'secure', 'safe', 'comfortable', 'relaxed'],
        anticipation: ['anticipating', 'expecting', 'hopeful', 'eager', 'looking forward']
      };
      
      allEntries.forEach(entry => {
        const text = [
          entry.extractedText || '',
          entry.transcription || '',
          entry.analysis?.summary || '',
          ...(entry.analysis?.insights || [])
        ].join(' ').toLowerCase();
        
        // Check which emotion categories appear in the text
        Object.entries(emotionKeywords).forEach(([category, keywords]) => {
          if (keywords.some(keyword => text.includes(keyword))) {
            emotionCategories.add(category);
          }
        });
      });
      
      return emotionCategories.size;
    })();

    // 3. Random Explorer Achievement - Complete a random path suggestion
    const randomPathsCompleted = (() => {
      // Check if user has completed any paths marked as "random" or "recommended"
      // This would need to be tracked when a user starts a path from random suggestion
      // For now, check if they've completed paths that aren't the default "self-discovery"
      const nonDefaultCompletedPaths = completedPaths.filter(path => 
        path.id !== 'self-discovery' && 
        path.id !== 'journey' &&
        !path.id.includes('voice') // Exclude voice paths for this achievement
      );
      
      // Check user profile for random path tracking
      const randomPathsFromProfile = userProfile?.randomPathsCompleted || 0;
      
      return Math.max(nonDefaultCompletedPaths.length, randomPathsFromProfile);
    })();

    // 4. Fortune Teller Achievement - Set and achieve 3 personal goals
    const achievedGoalsCount = (() => {
      // Check user profile for goals tracking
      const goalsFromProfile = userProfile?.achievedGoals || [];
      
      // Also check for goal-related entries or insights
      let goalMentions = 0;
      const goalKeywords = ['achieved', 'accomplished', 'completed', 'reached my goal', 'met my goal', 'goal achieved'];
      
      allEntries.forEach(entry => {
        const text = [
          entry.extractedText || '',
          entry.transcription || '',
          entry.analysis?.summary || ''
        ].join(' ').toLowerCase();
        
        if (goalKeywords.some(keyword => text.includes(keyword))) {
          goalMentions++;
        }
      });
      
      return Math.max(goalsFromProfile.length, Math.floor(goalMentions / 2)); // Divide by 2 to avoid over-counting
    })();

    // Calculate active days (unique dates)
    const uniqueDates = new Set(
      allEntries
        .map(entry => {
          if (!entry.timestamp) return null;
          try {
            let date;
            if (entry.timestamp.toDate) {
              date = entry.timestamp.toDate();
            } else if (entry.timestamp.seconds) {
              date = new Date(entry.timestamp.seconds * 1000);
            } else {
              date = new Date(entry.timestamp);
            }
            return date.toDateString();
          } catch {
            return null;
          }
        })
        .filter(Boolean)
    );
    const activeDays = uniqueDates.size;

    // Real day-streak from actual entry dates across ALL paths (incl. voice),
    // rather than the per-path streak stored in journeyProgress. A user who
    // journals on consecutive calendar days expects those days to count even
    // if they switched paths or wrote multiple entries per day.
    const { currentStreak: computedCurrentStreak, longestStreak: computedLongestStreak } = (() => {
      const dayMs = 24 * 60 * 60 * 1000;
      const days = [...uniqueDates]
        .map(ds => {
          const d = new Date(ds);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
        .sort((a, b) => a - b); // ascending, one entry per unique calendar day

      if (days.length === 0) return { currentStreak: 0, longestStreak: 0 };

      // Longest run of consecutive calendar days
      let longest = 1;
      let run = 1;
      for (let i = 1; i < days.length; i++) {
        if (days[i] === days[i - 1] + dayMs) {
          run += 1;
        } else {
          run = 1;
        }
        if (run > longest) longest = run;
      }

      // Current streak: consecutive days ending today (or yesterday, so the
      // streak doesn't visually break until a full day has been missed)
      const midnightToday = new Date();
      midnightToday.setHours(0, 0, 0, 0);
      const todayMs = midnightToday.getTime();
      const mostRecent = days[days.length - 1];

      let current = 0;
      if (mostRecent === todayMs || mostRecent === todayMs - dayMs) {
        current = 1;
        for (let i = days.length - 2; i >= 0; i--) {
          if (days[i] === days[i + 1] - dayMs) {
            current += 1;
          } else {
            break;
          }
        }
      }

      return { currentStreak: current, longestStreak: longest };
    })();

    // Calculate recent activity
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const entriesThisWeek = allEntries.filter(entry => {
      if (!entry.timestamp) return false;
      try {
        let date;
        if (entry.timestamp.toDate) {
          date = entry.timestamp.toDate();
        } else if (entry.timestamp.seconds) {
          date = new Date(entry.timestamp.seconds * 1000);
        } else {
          date = new Date(entry.timestamp);
        }
        return date >= weekAgo;
      } catch {
        return false;
      }
    }).length;

    const entriesThisMonth = allEntries.filter(entry => {
      if (!entry.timestamp) return false;
      try {
        let date;
        if (entry.timestamp.toDate) {
          date = entry.timestamp.toDate();
        } else if (entry.timestamp.seconds) {
          date = new Date(entry.timestamp.seconds * 1000);
        } else {
          date = new Date(entry.timestamp);
        }
        return date >= monthAgo;
      } catch {
        return false;
      }
    }).length;

    // Journey progress calculation
    let journeyProgress = 0;
    let currentPathName = 'No Active Path';
    
    if (inProgressPaths.length === 1) {
      journeyProgress = inProgressPaths[0].percentage;
      currentPathName = inProgressPaths[0].title;
    } else if (inProgressPaths.length > 1) {
      const totalProgress = inProgressPaths.reduce((sum, path) => sum + path.percentage, 0);
      journeyProgress = Math.round(totalProgress / inProgressPaths.length);
      currentPathName = `${inProgressPaths.length} Active Paths`;
    } else if (completedPaths.length > 0) {
      journeyProgress = 100;
      currentPathName = `${completedPaths.length} Completed Path${completedPaths.length > 1 ? 's' : ''}`;
    }

    // Last entry date
    const lastEntryDate = allEntries.length > 0 ? (() => {
      const sorted = [...allEntries].sort((a, b) => {
        const aTime = a.timestamp?.seconds || a.timestamp?.getTime?.() || 0;
        const bTime = b.timestamp?.seconds || b.timestamp?.getTime?.() || 0;
        return bTime - aTime;
      });
      return sorted[0]?.timestamp;
    })() : null;

    // Consistency check (at least 3 entries in last 2 weeks)
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const recentEntries = allEntries.filter(entry => {
      if (!entry.timestamp) return false;
      try {
        let date;
        if (entry.timestamp.toDate) {
          date = entry.timestamp.toDate();
        } else if (entry.timestamp.seconds) {
          date = new Date(entry.timestamp.seconds * 1000);
        } else {
          date = new Date(entry.timestamp);
        }
        return date >= twoWeeksAgo;
      } catch {
        return false;
      }
    }).length;
    const isConsistent = recentEntries >= 3;

    return {
      totalEntries,
      totalWords,
      averageLength,
      activeDays,
      currentStreak: computedCurrentStreak,
      longestStreak: Math.max(computedLongestStreak, progressStats.longestStreak || 0),
      activePathsCount: inProgressPaths.length,
      completedPathsCount: completedPaths.length,
      totalPathsStarted: inProgressPaths.length + completedPaths.length,
      journeyProgress,
      currentPathName,
      lastEntryDate,
      entriesThisWeek,
      entriesThisMonth,
      isConsistent,
      // Secret Achievement Statistics
      nightAndDayCount,
      uniqueEmotionsCount,
      randomPathsCompleted,
      achievedGoalsCount,
      totalInsights,
      allEntries, // Provide access when needed (for analytics)
      isEmpty: false
    };
  }, [allEntries, progressStats, inProgressPaths, completedPaths, userProfile]);

  // Refresh function for manual updates
  const refreshStatistics = async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      const entries = await getPreviousEntries(currentUser.uid, 'all');
      setAllEntries(entries);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to filter entries by criteria (for analytics)
  const getFilteredEntries = (filters = {}) => {
    if (!allEntries.length) return [];
    
    let filtered = [...allEntries];
    
    // Time period filter
    if (filters.timePeriod && filters.timePeriod !== 'all') {
      const now = new Date();
      let cutoffDate;
      
      switch (filters.timePeriod) {
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
          cutoffDate = null;
      }
      
      if (cutoffDate) {
        filtered = filtered.filter(entry => {
          if (!entry.timestamp) return true;
          try {
            let entryDate;
            if (entry.timestamp.toDate) {
              entryDate = entry.timestamp.toDate();
            } else if (entry.timestamp.seconds) {
              entryDate = new Date(entry.timestamp.seconds * 1000);
            } else {
              entryDate = new Date(entry.timestamp);
            }
            return entryDate >= cutoffDate;
          } catch {
            return true; // Keep entries with invalid dates
          }
        });
      }
    }
    
    // Journey filter
    if (filters.journeyId && filters.journeyId !== 'all') {
      filtered = filtered.filter(entry => {
        const entryPathId = entry.pathId || 'self-discovery';
        return entryPathId === filters.journeyId;
      });
    }
    
    return filtered;
  };

  return {
    statistics,
    isLoading,
    error,
    lastUpdated,
    refreshStatistics,
    getFilteredEntries,
    
    // Convenience getters for backward compatibility
    get totalEntries() { return statistics.totalEntries; },
    get allEntries() { return statistics.allEntries; },
    get isEmpty() { return statistics.isEmpty; },
    get isConsistent() { return statistics.isConsistent; }
  };
};

export default useUserStatistics;