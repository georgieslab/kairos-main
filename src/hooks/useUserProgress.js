// src/hooks/useUserProgress.js - Clean Production Version
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAllJourneyPaths, getJourneyPath } from '../data/JourneyData';
import { getUserPathProgress, getNextDayForPath } from '../utils/pathUtils';

/**
 * Centralized hook for managing user progress across all journey paths
 * This ensures consistent data across all components
 */
export const useUserProgress = () => {
  const { userProfile, currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Force refresh function for when data changes
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Memoized calculation of all paths progress
  const progressData = useMemo(() => {
    console.log('🔍 DEBUG useUserProgress: Calculating progress data...');
    console.log('🔍 DEBUG useUserProgress: userProfile exists:', !!userProfile);
    console.log('🔍 DEBUG useUserProgress: currentUser exists:', !!currentUser);
    
    if (!userProfile || !currentUser) {
      console.log('⚠️ DEBUG useUserProgress: No userProfile or currentUser, returning empty data');
      return {
        allPaths: [],
        inProgressPaths: [],
        completedPaths: [],
        notStartedPaths: [],
        totalStats: {
          totalEntries: 0,
          totalPathsStarted: 0,
          totalPathsCompleted: 0,
          currentStreak: 0,
          longestStreak: 0
        }
      };
    }

    console.log('🔍 DEBUG useUserProgress: userProfile.journeyProgress:', userProfile.journeyProgress);

    try {
      const allJourneyPaths = getAllJourneyPaths();
      const pathsArray = Object.values(allJourneyPaths);
      
      console.log('🔍 DEBUG useUserProgress: Total paths to process:', pathsArray.length);
      
      const allPaths = [];
      const inProgressPaths = [];
      const completedPaths = [];
      const notStartedPaths = [];
      
      let totalEntries = 0;
      let totalPathsStarted = 0;
      let totalPathsCompleted = 0;
      let maxStreak = 0;
      let currentStreaks = [];

      pathsArray.forEach((path) => {
        try {
          const pathProgress = getUserPathProgress(userProfile, path.id);
          
          console.log(`🔍 DEBUG useUserProgress: Path ${path.id} progress:`, pathProgress);
          
          const completedDays = pathProgress?.completedDays || [];
          const currentStreak = pathProgress?.currentStreak || 0;
          const bestStreak = pathProgress?.bestStreak || 0;
          
          console.log(`🔍 DEBUG useUserProgress: Path ${path.id} - completedDays:`, completedDays.length, '/', path.duration);
          console.log(`🔍 DEBUG useUserProgress: Path ${path.id} - completedDaysList:`, completedDays);
          
          // Enhanced completion detection
          // Check if the user has completed enough days (count-based)
          const hasEnoughDays = completedDays.length >= path.duration;
          
          // Check if the highest completed day equals the path duration
          const highestDay = completedDays.length > 0 ? Math.max(...completedDays) : 0;
          const completedFinalDay = highestDay >= path.duration;
          
          // Path is complete if EITHER condition is met:
          // 1. They've completed the required number of days (even with gaps)
          // 2. They've completed the final day of the path
          const isCompleted = hasEnoughDays || completedFinalDay;
          const isStarted = completedDays.length > 0;
          
          console.log(`🔍 DEBUG useUserProgress: Path ${path.id} - hasEnoughDays:`, hasEnoughDays, 'completedFinalDay:', completedFinalDay, 'highestDay:', highestDay);
          console.log(`🔍 DEBUG useUserProgress: Path ${path.id} - isCompleted:`, isCompleted, 'isStarted:', isStarted);
          
          // Additional validation for edge cases
          const hasAllDays = path.duration > 0 && completedDays.length === path.duration;
          const isDefinitelyComplete = hasAllDays || isCompleted;
          
          // Calculate next day
          const nextDay = isDefinitelyComplete ? path.duration : getNextDayForPath(userProfile, path.id);
          
          // Calculate percentage based on completed days count
          // Cap at 100% if the journey is marked as complete
          let percentage = Math.round((completedDays.length / path.duration) * 100);
          if (isDefinitelyComplete && percentage < 100) {
            percentage = 100; // Ensure completed journeys show 100%
          }
          
          console.log(`🔍 DEBUG useUserProgress: Path ${path.id} - percentage:`, percentage, '% (', completedDays.length, '/', path.duration, ')');

          const pathData = {
            id: path.id,
            title: path.title,
            subtitle: path.subtitle || '',
            description: path.description || '',
            iconName: path.iconName,
            color: path.color,
            duration: path.duration,
            difficulty: path.difficulty || 'beginner',
            tags: path.tags || [],
            
            // Progress data
            completedDays: completedDays.length,
            completedDaysList: completedDays,
            totalDays: path.duration,
            percentage,
            nextDay,
            currentStreak,
            bestStreak,
            isCompleted: isDefinitelyComplete,
            isStarted,
            isActive: isStarted && !isDefinitelyComplete,
            
            // Additional metadata
            lastActive: pathProgress?.lastActive || null,
            lastActivity: pathProgress?.lastActive || null,
            startedAt: pathProgress?.startedAt || null,
            completedAt: pathProgress?.completedAt || null
          };

          // Add to appropriate arrays
          allPaths.push(pathData);
          
          if (isDefinitelyComplete) {
            completedPaths.push(pathData);
            totalPathsCompleted++;
            console.log(`✅ DEBUG useUserProgress: Path ${path.id} marked as COMPLETED`);
          } else if (isStarted) {
            inProgressPaths.push(pathData);
            totalPathsStarted++;
            console.log(`🔄 DEBUG useUserProgress: Path ${path.id} marked as IN PROGRESS`);
          } else {
            notStartedPaths.push(pathData);
            console.log(`⭕ DEBUG useUserProgress: Path ${path.id} marked as NOT STARTED`);
          }

          // Update stats
          if (isStarted) {
            totalEntries += completedDays.length;
            maxStreak = Math.max(maxStreak, bestStreak);
            if (currentStreak > 0) {
              currentStreaks.push(currentStreak);
            }
          }

        } catch (pathError) {
          console.error(`Error processing path ${path.id}:`, pathError);
        }
      });

      console.log('📊 DEBUG useUserProgress: Final stats:', {
        totalPaths: allPaths.length,
        inProgress: inProgressPaths.length,
        completed: completedPaths.length,
        notStarted: notStartedPaths.length,
        totalEntries,
        totalPathsCompleted
      });

      // Sort arrays
      inProgressPaths.sort((a, b) => b.percentage - a.percentage);
      completedPaths.sort((a, b) => b.completedDays - a.completedDays);
      notStartedPaths.sort((a, b) => {
        // Sort by difficulty, then by duration
        const difficultyOrder = { 'beginner': 0, 'intermediate': 1, 'advanced': 2 };
        const diffA = difficultyOrder[a.difficulty] || 0;
        const diffB = difficultyOrder[b.difficulty] || 0;
        
        if (diffA !== diffB) return diffA - diffB;
        return a.duration - b.duration;
      });

      const totalStats = {
        totalEntries,
        totalPathsStarted,
        totalPathsCompleted,
        currentStreak: currentStreaks.length > 0 ? Math.max(...currentStreaks) : 0,
        longestStreak: maxStreak,
        totalDaysActive: totalEntries,
        averageEntriesPerWeek: totalEntries > 0 ? Math.round(totalEntries / Math.max(1, totalEntries / 7)) : 0
      };

      return {
        allPaths,
        inProgressPaths,
        completedPaths,
        notStartedPaths,
        totalStats
      };

    } catch (error) {
      console.error('Error calculating user progress:', error);
      setError(error);
      return {
        allPaths: [],
        inProgressPaths: [],
        completedPaths: [],
        notStartedPaths: [],
        totalStats: {
          totalEntries: 0,
          totalPathsStarted: 0,
          totalPathsCompleted: 0,
          currentStreak: 0,
          longestStreak: 0
        }
      };
    }
  }, [userProfile, currentUser, lastUpdated, refreshCounter]);

  // Set loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setLastUpdated(Date.now());
    }, 500);

    return () => clearTimeout(timer);
  }, [userProfile]);

  // Listen for profile changes and refresh when needed
  useEffect(() => {
    if (userProfile?.journeyProgress) {
      setRefreshCounter(prev => prev + 1);
    }
  }, [userProfile?.journeyProgress]);

  // Helper functions
  const getPathProgress = (pathId) => {
    return progressData.allPaths.find(path => path.id === pathId) || null;
  };

  const getActiveJourneys = () => {
    return progressData.inProgressPaths;
  };

  const getCompletedJourneys = () => {
    return progressData.completedPaths;
  };

  const getRecommendedPaths = () => {
    const { notStartedPaths, totalStats } = progressData;
    
    if (totalStats.totalPathsCompleted === 0) {
      // First-time users - recommend beginner paths
      return notStartedPaths
        .filter(path => path.difficulty === 'beginner')
        .slice(0, 3);
    }
    
    // Experienced users - mix of difficulties
    return notStartedPaths.slice(0, 3);
  };

  // Force refresh function for external use
  const refreshProgress = () => {
    setRefreshCounter(prev => prev + 1);
    setLastUpdated(Date.now());
  };

  // Debug function to check specific path completion (development only)
  const debugPathCompletion = (pathId) => {
    if (process.env.NODE_ENV === 'development') {
      const pathData = getPathProgress(pathId);
      if (pathData) {
        console.log(`Debug info for ${pathId}:`, {
          completedDays: pathData.completedDaysList,
          completedCount: pathData.completedDays,
          totalDays: pathData.totalDays,
          percentage: pathData.percentage,
          isCompleted: pathData.isCompleted,
          isActive: pathData.isActive,
          nextDay: pathData.nextDay
        });
      } else {
        console.log(`No data found for path: ${pathId}`);
      }
    }
  };

  return {
    // Data
    ...progressData,
    
    // State
    isLoading,
    error,
    lastUpdated,
    
    // Helper functions
    getPathProgress,
    getActiveJourneys,
    getCompletedJourneys,
    getRecommendedPaths,
    refreshProgress,
    debugPathCompletion,
    
    // Quick access to common data
    hasActiveJourneys: progressData.inProgressPaths.length > 0,
    hasCompletedJourneys: progressData.completedPaths.length > 0,
    hasAnyProgress: progressData.totalStats.totalEntries > 0,
    
    // Stats shortcuts
    stats: progressData.totalStats
  };
};

export default useUserProgress;