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
      currentStreak: progressStats.currentStreak || 0,
      longestStreak: progressStats.longestStreak || 0,
      activePathsCount: inProgressPaths.length,
      completedPathsCount: completedPaths.length,
      totalPathsStarted: inProgressPaths.length + completedPaths.length,
      journeyProgress,
      currentPathName,
      lastEntryDate,
      entriesThisWeek,
      entriesThisMonth,
      isConsistent,
      allEntries, // Provide access when needed (for analytics)
      isEmpty: false
    };
  }, [allEntries, progressStats, inProgressPaths, completedPaths]);

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