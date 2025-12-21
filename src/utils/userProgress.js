// src/utils/userProgress.js - Updated for flexible path lengths

import { getJourneyPath, getJourneyDaysCount, getAllJourneyPaths } from '../data/JourneyData';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Import and re-export functions from pathUtils
import { 
  getProgressFieldForPath as getPathProgressField,
  getNextDayForPath as getPathNextDay,
  getAllActiveJourneys as getActiveJourneys,
  getUserPathProgress as getPathProgress,
  updateCurrentPath as updatePath
} from './pathUtils';

// Re-export with original names for backward compatibility
export const getProgressFieldForPath = getPathProgressField;
export const getNextDayForPath = getPathNextDay;
export const getAllActiveJourneys = getActiveJourneys;
export const getUserPathProgress = getPathProgress;
export const updateCurrentPath = updatePath;

/**
 * Path constants for consistent reference
 * NOTE: Consider migrating away from these constants and using path IDs directly
 */
export const PATHS = {
  SELF_DISCOVERY: 'self-discovery',
  EMOTIONAL_INTELLIGENCE: 'emotional-intelligence',
  MINDFULNESS_AWARENESS: 'mindfulness-awareness',
  TRANSFORMATION_JOURNEY: 'transformation-journey',
  CREATIVE_EXPRESSION: 'creative-expression',
  HABIT_FORMATION: 'habit-formation',
  LIFE_VISION: 'life-vision',
  MINDFUL_VISUALIZATION: 'mindful-visualization',
  LIFE_VALUES: 'life-values',
  RELATIONSHIP_MASTERY: 'relationship-mastery',
  FINANCIAL_MINDFULNESS: 'financial-mindfulness',
  GRATITUDE_PRACTICE: 'gratitude-practice',
  SHADOW_WORK: 'shadow-work',
  NATURE_CONNECTION: 'nature-connection',
  HOLISTIC_TRANSFORMATION: 'holistic-transformation',
  VOCAL_CONFIDENCE: 'vocal-confidence',
  MEDITATION_SPEAKING: 'meditation-speaking',
  DECIDING_TO_DOING: 'deciding-to-doing'

};

/**
 * Check if a specific day is completed
 * @param {Object} userProfile - User profile data
 * @param {string} pathId - Path ID
 * @param {number} day - Day to check
 * @returns {boolean} - Whether the day is completed
 */
export const isDayCompleted = (userProfile, pathId, day) => {
  const pathProgress = getUserPathProgress(userProfile, pathId);
  const completedDays = pathProgress?.completedDays || [];
  
  return completedDays.includes(day);
};

/**
 * Get completion percentage for a path
 * @param {Object} userProfile - User profile data
 * @param {string} pathId - Path ID
 * @returns {number} - Completion percentage (0-100)
 */
export const getPathCompletionPercentage = (userProfile, pathId = PATHS.SELF_DISCOVERY) => {
  const pathProgress = getUserPathProgress(userProfile, pathId);
  const completedDays = pathProgress?.completedDays || [];
  
  // Get total days for this specific journey
  const totalDays = getJourneyDaysCount(pathId);
  
  return Math.round((completedDays.length / totalDays) * 100);
};

/**
 * Check if a day is accessible (either completed or the next day)
 * @param {Object} userProfile - User profile data
 * @param {string} pathId - Path ID
 * @param {number} day - Day to check
 * @returns {boolean} - Whether the day is accessible
 */
export const isDayAccessible = (userProfile, pathId, day) => {
  const nextDay = getNextDayForPath(userProfile, pathId);
  return isDayCompleted(userProfile, pathId, day) || day <= nextDay;
};

/**
 * Get current streak for a path (consecutive days completed)
 * @param {Object} userProfile - User profile data
 * @param {string} pathId - Path ID
 * @returns {number} - Current streak count
 */
export const getCurrentStreak = (userProfile, pathId = PATHS.SELF_DISCOVERY) => {
  const pathProgress = getUserPathProgress(userProfile, pathId);
  return pathProgress?.currentStreak || 0;
};

/**
 * Get best streak for a path
 * @param {Object} userProfile - User profile data
 * @param {string} pathId - Path ID
 * @returns {number} - Best streak count
 */
export const getBestStreak = (userProfile, pathId = PATHS.SELF_DISCOVERY) => {
  const pathProgress = getUserPathProgress(userProfile, pathId);
  return pathProgress?.bestStreak || 0;
};

/**
 * Get user's active paths (paths with at least one completed day)
 * @param {Object} userProfile - User profile data
 * @returns {Array} - Array of path IDs that have been started
 */
export const getActivePaths = (userProfile) => {
  if (!userProfile || !userProfile.journeyProgress) {
    return [];
  }
  
  const activePaths = [];
  
  // Check for legacy self-discovery structure
  if (userProfile.journeyProgress.completedDays && 
      userProfile.journeyProgress.completedDays.length > 0) {
    activePaths.push(PATHS.SELF_DISCOVERY);
  }
  
  // Loop through all paths in the journey progress
  Object.entries(userProfile.journeyProgress).forEach(([field, progress]) => {
    // Skip non-progress fields
    if (!field.endsWith('Progress')) return;
    
    // Check if this path has completed days
    if (progress && progress.completedDays && progress.completedDays.length > 0) {
      // Convert progressField back to pathId
      const pathId = field.replace('Progress', '').replace(/([A-Z])/g, '-$1').toLowerCase();
      if (pathId !== 'self-discovery' || !activePaths.includes(PATHS.SELF_DISCOVERY)) {
        activePaths.push(pathId);
      }
    }
  });
  
  return activePaths;
};

export default {
  PATHS,
  getUserPathProgress,
  getNextDayForPath,
  isDayCompleted,
  getPathCompletionPercentage,
  isDayAccessible,
  getCurrentStreak,
  getBestStreak,
  getActivePaths,
  getProgressFieldForPath,
  getAllActiveJourneys,
  updateCurrentPath
};