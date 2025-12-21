// src/utils/rebuildProgress.js
// Utility to rebuild journeyProgress from existing journal entries

import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getProgressFieldForPath } from './pathUtils';

/**
 * Rebuild user's journeyProgress from existing journal entries
 * This scans all journal entries and reconstructs the progress tracking data
 */
export const rebuildUserProgress = async (userId) => {
  console.log('🔄 Starting progress rebuild for user:', userId);
  
  try {
    // Get all journal entries for this user
    const journalRef = collection(db, 'users', userId, 'journal');
    const snapshot = await getDocs(journalRef);
    
    console.log(`📊 Found ${snapshot.size} journal entries`);
    
    // Group entries by pathId
    const entriesByPath = {};
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const pathId = data.pathId || 'self-discovery'; // Default to self-discovery for old entries
      const day = data.day;
      
      if (!day || typeof day !== 'number') {
        console.warn(`⚠️ Entry ${doc.id} has invalid day:`, day);
        return;
      }
      
      if (!entriesByPath[pathId]) {
        entriesByPath[pathId] = [];
      }
      
      if (!entriesByPath[pathId].includes(day)) {
        entriesByPath[pathId].push(day);
      }
    });
    
    console.log('📋 Entries grouped by path:', Object.keys(entriesByPath));
    
    // Build the journeyProgress object
    const journeyProgress = {
      hasStartedJourney: true,
      currentPath: Object.keys(entriesByPath)[0] || 'self-discovery'
    };
    
    // For each path, create the progress field
    Object.entries(entriesByPath).forEach(([pathId, days]) => {
      const progressField = getProgressFieldForPath(pathId);
      const sortedDays = days.sort((a, b) => a - b);
      
      journeyProgress[progressField] = {
        completedDays: sortedDays,
        currentDay: Math.max(...sortedDays),
        lastActive: new Date(), // Use current date as approximation
        streak: 0, // Will need to be recalculated based on actual dates
        totalEntries: sortedDays.length
      };
      
      console.log(`✅ Rebuilt progress for ${pathId}:`, {
        field: progressField,
        completedDays: sortedDays.length,
        days: sortedDays
      });
    });
    
    // Update the user's profile
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { journeyProgress });
    
    console.log('✨ Progress rebuild complete!');
    console.log('📊 Final journeyProgress:', journeyProgress);
    
    return {
      success: true,
      pathsRebuilt: Object.keys(entriesByPath).length,
      totalEntries: snapshot.size,
      journeyProgress
    };
    
  } catch (error) {
    console.error('❌ Error rebuilding progress:', error);
    throw error;
  }
};

/**
 * Check if user needs progress rebuild
 * Returns true if user has journal entries but no progress fields
 */
export const needsProgressRebuild = async (userId, userProfile) => {
  if (!userProfile?.journeyProgress) {
    return true; // No progress at all
  }
  
  // Check if journeyProgress only has metadata fields (no actual progress fields)
  const progressKeys = Object.keys(userProfile.journeyProgress);
  const hasProgressFields = progressKeys.some(key => key.endsWith('Progress'));
  
  if (!hasProgressFields) {
    // Check if there are journal entries
    const journalRef = collection(db, 'users', userId, 'journal');
    const snapshot = await getDocs(journalRef);
    return snapshot.size > 0; // Need rebuild if entries exist but no progress
  }
  
  return false;
};
