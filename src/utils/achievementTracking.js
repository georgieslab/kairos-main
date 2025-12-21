// src/utils/achievementTracking.js
// Helper functions for tracking secret achievement progress

import { doc, updateDoc, arrayUnion, increment, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Track when a user completes a random/recommended path
 */
export const trackRandomPathCompletion = async (userId, pathId) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      randomPathsCompleted: increment(1),
      lastRandomPathCompleted: new Date().toISOString(),
      completedRandomPaths: arrayUnion(pathId)
    });
    
    console.log('✨ Random path completion tracked:', pathId);
    return true;
  } catch (error) {
    console.error('Error tracking random path completion:', error);
    return false;
  }
};

/**
 * Track when a user achieves a personal goal
 */
export const trackGoalAchievement = async (userId, goalData) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    const goal = {
      id: Date.now().toString(),
      description: goalData.description,
      achievedDate: new Date().toISOString(),
      category: goalData.category || 'general'
    };
    
    await updateDoc(userRef, {
      achievedGoals: arrayUnion(goal)
    });
    
    console.log('🎯 Goal achievement tracked:', goal.description);
    return true;
  } catch (error) {
    console.error('Error tracking goal achievement:', error);
    return false;
  }
};

/**
 * Check if a specific achievement has been unlocked
 */
export const checkAchievementUnlocked = async (userId, achievementId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return false;
    }
    
    const unlockedAchievements = userDoc.data().unlockedAchievements || [];
    return unlockedAchievements.includes(achievementId);
  } catch (error) {
    console.error('Error checking achievement:', error);
    return false;
  }
};

/**
 * Unlock an achievement and save to user profile
 */
export const unlockAchievement = async (userId, achievementId, achievementData) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Check if already unlocked
    const alreadyUnlocked = await checkAchievementUnlocked(userId, achievementId);
    if (alreadyUnlocked) {
      console.log('Achievement already unlocked:', achievementId);
      return { success: true, alreadyUnlocked: true };
    }
    
    const achievement = {
      id: achievementId,
      unlockedAt: new Date().toISOString(),
      title: achievementData.title,
      points: achievementData.points,
      rarity: achievementData.rarity || 'common'
    };
    
    await updateDoc(userRef, {
      unlockedAchievements: arrayUnion(achievementId),
      achievements: arrayUnion(achievement),
      totalAchievementPoints: increment(achievementData.points || 0)
    });
    
    console.log('🏆 Achievement unlocked:', achievementId);
    return { success: true, alreadyUnlocked: false, achievement };
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get all unlocked achievements for a user
 */
export const getUnlockedAchievements = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return [];
    }
    
    return userDoc.data().achievements || [];
  } catch (error) {
    console.error('Error getting unlocked achievements:', error);
    return [];
  }
};

/**
 * Track entry time for Night & Day achievement
 */
export const trackEntryTime = async (userId, timestamp) => {
  try {
    const date = new Date(timestamp);
    const hour = date.getHours();
    const dayKey = date.toDateString();
    
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return false;
    }
    
    const entryTimes = userDoc.data().entryTimes || {};
    const dayData = entryTimes[dayKey] || { morning: false, night: false };
    
    // Early morning: 5 AM - 9 AM
    if (hour >= 5 && hour < 9) {
      dayData.morning = true;
    }
    
    // Late night: 10 PM - 5 AM
    if (hour >= 22 || hour < 5) {
      dayData.night = true;
    }
    
    entryTimes[dayKey] = dayData;
    
    await updateDoc(userRef, {
      entryTimes,
      lastEntryTime: timestamp
    });
    
    // Check if both morning and night achieved for this day
    if (dayData.morning && dayData.night) {
      console.log('🎭 Night & Day achievement unlocked for day:', dayKey);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error tracking entry time:', error);
    return false;
  }
};

export default {
  trackRandomPathCompletion,
  trackGoalAchievement,
  checkAchievementUnlocked,
  unlockAchievement,
  getUnlockedAchievements,
  trackEntryTime
};
