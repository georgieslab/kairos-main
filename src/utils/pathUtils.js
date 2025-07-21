
// src/utils/pathUtils.js
import { getAllJourneyPaths, getJourneyPath } from '../data/JourneyData';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Gets a standardized progress field name for any path
 * @param {string} pathId - The path identifier
 * @returns {string} The standardized progress field name
 */
export const getProgressFieldForPath = (pathId) => {
  if (!pathId) return null;
  
  // Remove any non-alphanumeric characters and convert to camelCase
  const sanitizedId = pathId.replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .map((word, index) => 
      index === 0 
        ? word.toLowerCase() 
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
  
  return `${sanitizedId}Progress`;
};

/**
 * Gets all active journeys for a user
 * @param {Object} userProfile - User profile object
 * @returns {Array} Array of objects with pathId and progress info
 */
export const getAllActiveJourneys = (userProfile) => {
  if (!userProfile || !userProfile.journeyProgress) return [];
  
  const allPaths = getAllJourneyPaths();
  const activeJourneys = [];
  
  allPaths.forEach(path => {
    const progressField = getProgressFieldForPath(path.id);
    const progress = userProfile.journeyProgress[progressField];
    
    if (progress && progress.completedDays && progress.completedDays.length > 0) {
      const isCompleted = progress.completedDays.length >= path.duration;
      
      if (!isCompleted) {
        activeJourneys.push({
          pathId: path.id,
          progress,
          nextDay: getNextDayForPath(userProfile, path.id)
        });
      }
    }
  });
  
  // Sort by most recently active
  return activeJourneys.sort((a, b) => {
    const aTimestamp = a.progress.lastActive 
      ? (a.progress.lastActive.toMillis ? a.progress.lastActive.toMillis() : a.progress.lastActive) 
      : 0;
    const bTimestamp = b.progress.lastActive 
      ? (b.progress.lastActive.toMillis ? b.progress.lastActive.toMillis() : b.progress.lastActive) 
      : 0;
    
    return bTimestamp - aTimestamp;
  });
};

/**
 * Updates the current path in user's profile
 * @param {Object} userProfile - User profile object
 * @param {string} pathId - Path to set as current
 * @returns {Promise} Promise that resolves when update is complete
 */
export const updateCurrentPath = async (userId, pathId) => {
  if (!userId || !pathId) return null;
  
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'journeyProgress.currentPath': pathId
    });
    
    return true;
  } catch (error) {
    console.error('Error updating current path:', error);
    return null;
  }
};

/**
 * Gets the next day for a path
 * @param {Object} userProfile - User profile object
 * @param {string} pathId - Path identifier
 * @returns {number} Next day number
 */
export const getNextDayForPath = (userProfile, pathId) => {
  if (!userProfile || !userProfile.journeyProgress || !pathId) return 1;
  
  // Get the progress field name for this path
  const progressField = getProgressFieldForPath(pathId);
  
  // Get the progress object for this path
  const progress = userProfile.journeyProgress[progressField];
  
  // If no progress yet, return day 1
  if (!progress || !progress.completedDays || progress.completedDays.length === 0) {
    return 1;
  }
  
  // Get the path data to determine max days
  const pathData = getJourneyPath(pathId);
  const maxDays = pathData ? pathData.duration : 10;
  
  // Get the highest completed day
  const completedDays = [...progress.completedDays].sort((a, b) => a - b);
  const highestCompletedDay = Math.max(...completedDays);
  
  // Return the next day, capped at the max days for this path
  return Math.min(highestCompletedDay + 1, maxDays);
};

/**
 * Gets user path progress with fallbacks
 * @param {Object} userProfile - User profile
 * @param {string} pathId - Path identifier
 * @returns {Object} Progress object with completedDays array
 */
export const getUserPathProgress = (userProfile, pathId) => {
  if (!userProfile || !userProfile.journeyProgress || !pathId) {
    return { completedDays: [] };
  }
  
  // Get the progress field name for this path
  const progressField = getProgressFieldForPath(pathId);
  
  // Get the progress object for this path, with fallbacks
  const progress = userProfile.journeyProgress[progressField] || { completedDays: [] };
  
  // Ensure completedDays is an array
  if (!progress.completedDays) {
    progress.completedDays = [];
  }
  
  return progress;
};