<<<<<<< HEAD
// REPLACE your entire useJourneyCompletion.js file with this:
=======
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
// src/hooks/useJourneyCompletion.js

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
<<<<<<< HEAD
import { getAllJourneyPaths } from '../data/JourneyData';
import { getProgressFieldForPath, getUserPathProgress } from '../utils/pathUtils';
=======
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188

/**
 * Custom hook to manage journey completion navigation logic
 * This extends the navigation system to handle completed journeys properly
 */
const useJourneyCompletion = (currentPath, navigateToScreen) => {
  // State for tracking completed journeys
  const [completedJourneys, setCompletedJourneys] = useState({});
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(true);
=======
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  
  // Get auth context for user data
  const { currentUser, userProfile } = useAuth();
  
  // Load completed journeys from user profile
  useEffect(() => {
    const loadCompletedJourneys = async () => {
<<<<<<< HEAD
      if (!currentUser || !userProfile) {
        setIsLoading(false);
        return;
      }
=======
      if (!currentUser || !userProfile) return;
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      
      try {
        const completedJourneysObj = {};
        
<<<<<<< HEAD
        // ✅ FIXED: Get all journey paths dynamically
        const allPaths = getAllJourneyPaths();
        
        if (userProfile.journeyProgress && allPaths) {
          // Check each path for completion status
          allPaths.forEach(pathData => {
            const pathId = pathData.id;
            const pathDuration = pathData.duration;
            
            try {
              const progressField = getProgressFieldForPath(pathId);
              const progress = userProfile.journeyProgress[progressField];
              const completedDays = progress?.completedDays || [];
              
              if (completedDays.length >= pathDuration) {
                completedJourneysObj[pathId] = {
                  isCompleted: true,
                  lastViewed: localStorage.getItem(`completion_viewed_${pathId}`) || null,
                  pathDuration: pathDuration,
                  completedDays: completedDays.length
                };
                
                console.log(`✅ Journey ${pathId} is completed: ${completedDays.length}/${pathDuration} days`);
              } else {
                console.log(`⏳ Journey ${pathId} in progress: ${completedDays.length}/${pathDuration} days`);
              }
            } catch (error) {
              console.error(`Error checking completion for path ${pathId}:`, error);
            }
          });
=======
        // Check all paths in user profile for completion status
        if (userProfile.journeyProgress) {
          // Check self-discovery path
          if (userProfile.journeyProgress.selfDiscoveryProgress?.completedDays?.length >= 10) {
            completedJourneysObj['self-discovery'] = {
              isCompleted: true,
              lastViewed: localStorage.getItem('completion_viewed_self-discovery') || null
            };
          }
          
          // Check emotional-intelligence path
          if (userProfile.journeyProgress.emotionalIntelligenceProgress?.completedDays?.length >= 10) {
            completedJourneysObj['emotional-intelligence'] = {
              isCompleted: true,
              lastViewed: localStorage.getItem('completion_viewed_emotional-intelligence') || null
            };
          }
          
          // Check mindfulness-awareness path
          if (userProfile.journeyProgress.mindfulnessAwarenessProgress?.completedDays?.length >= 10) {
            completedJourneysObj['mindfulness-awareness'] = {
              isCompleted: true,
              lastViewed: localStorage.getItem('completion_viewed_mindfulness-awareness') || null
            };
          }
          
          // Check transformation-journey path (21 days)
          if (userProfile.journeyProgress.transformationJourneyProgress?.completedDays?.length >= 21) {
            completedJourneysObj['transformation-journey'] = {
              isCompleted: true,
              lastViewed: localStorage.getItem('completion_viewed_transformation-journey') || null
            };
          }
          
          // Check creative-expression path (14 days)
          if (userProfile.journeyProgress.creativeExpressionProgress?.completedDays?.length >= 14) {
            completedJourneysObj['creative-expression'] = {
              isCompleted: true,
              lastViewed: localStorage.getItem('completion_viewed_creative-expression') || null
            };
          }
          
          // Check habit-formation path (30 days)
          if (userProfile.journeyProgress.habitFormationProgress?.completedDays?.length >= 30) {
            completedJourneysObj['habit-formation'] = {
              isCompleted: true,
              lastViewed: localStorage.getItem('completion_viewed_habit-formation') || null
            };
          }
          
          // Check life-vision path (100 days)
          if (userProfile.journeyProgress.lifeVisionProgress?.completedDays?.length >= 100) {
            completedJourneysObj['life-vision'] = {
              isCompleted: true,
              lastViewed: localStorage.getItem('completion_viewed_life-vision') || null
            };
          }
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        }
        
        // Also check Firebase for stored completion preferences
        if (currentUser.uid) {
<<<<<<< HEAD
          try {
            const completionPrefsRef = doc(db, 'users', currentUser.uid, 'preferences', 'completion-prefs');
            const completionPrefsSnap = await getDoc(completionPrefsRef);
            
            if (completionPrefsSnap.exists()) {
              const storedPrefs = completionPrefsSnap.data();
              
              // Merge stored preferences with local state
              Object.keys(storedPrefs).forEach(pathId => {
                if (completedJourneysObj[pathId]) {
                  // Only use stored lastViewed if it's more recent
                  const storedViewed = storedPrefs[pathId].lastViewed;
                  const localViewed = completedJourneysObj[pathId].lastViewed;
                  
                  if (storedViewed && (!localViewed || storedViewed > localViewed)) {
                    completedJourneysObj[pathId].lastViewed = storedViewed;
                    // Update localStorage with the most recent value
                    localStorage.setItem(`completion_viewed_${pathId}`, storedViewed);
                  }
                } else if (storedPrefs[pathId].isCompleted) {
                  // Add from stored prefs if not in local (edge case)
                  completedJourneysObj[pathId] = storedPrefs[pathId];
                  localStorage.setItem(`completion_viewed_${pathId}`, storedPrefs[pathId].lastViewed || '');
                }
              });
            }
          } catch (error) {
            console.error('Error loading completion preferences from Firebase:', error);
=======
          const completionPrefsRef = doc(db, 'users', currentUser.uid, 'preferences', 'completion-prefs');
          const completionPrefsSnap = await getDoc(completionPrefsRef);
          
          if (completionPrefsSnap.exists()) {
            const storedPrefs = completionPrefsSnap.data();
            
            // Merge stored preferences with local state
            Object.keys(storedPrefs).forEach(pathId => {
              if (completedJourneysObj[pathId]) {
                // Only use stored lastViewed if it's more recent
                if (storedPrefs[pathId].lastViewed > (completedJourneysObj[pathId].lastViewed || 0)) {
                  completedJourneysObj[pathId].lastViewed = storedPrefs[pathId].lastViewed;
                  // Update localStorage with the most recent value
                  localStorage.setItem(`completion_viewed_${pathId}`, storedPrefs[pathId].lastViewed);
                }
              } else {
                completedJourneysObj[pathId] = storedPrefs[pathId];
                // Update localStorage
                localStorage.setItem(`completion_viewed_${pathId}`, storedPrefs[pathId].lastViewed || null);
              }
            });
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
          }
        }
        
        setCompletedJourneys(completedJourneysObj);
<<<<<<< HEAD
        console.log('📊 Completed journeys loaded:', completedJourneysObj);
        
      } catch (error) {
        console.error('Error loading completed journeys:', error);
      } finally {
        setIsLoading(false);
=======
      } catch (error) {
        console.error('Error loading completed journeys:', error);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      }
    };
    
    loadCompletedJourneys();
  }, [currentUser, userProfile]);
  
  // Mark a journey as viewed
<<<<<<< HEAD
  const markJourneyAsViewed = useCallback(async (pathId) => {
    if (!pathId) return;
    
    const timestamp = new Date().getTime();
    console.log(`🔖 Marking journey ${pathId} as viewed at ${new Date(timestamp).toISOString()}`);
=======
  const markJourneyAsViewed = useCallback((pathId) => {
    if (!pathId) return;
    
    const timestamp = new Date().getTime();
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    
    // Update state
    setCompletedJourneys(prev => ({
      ...prev,
      [pathId]: {
        ...prev[pathId],
        isCompleted: true,
        lastViewed: timestamp
      }
    }));
    
    // Update localStorage
<<<<<<< HEAD
    localStorage.setItem(`completion_viewed_${pathId}`, timestamp.toString());
    
    // Update Firestore if user is logged in
    if (currentUser?.uid) {
      try {
        const completionPrefsRef = doc(db, 'users', currentUser.uid, 'preferences', 'completion-prefs');
        const snap = await getDoc(completionPrefsRef);
        const data = snap.exists() ? snap.data() : {};
        
        await setDoc(completionPrefsRef, {
=======
    localStorage.setItem(`completion_viewed_${pathId}`, timestamp);
    
    // Update Firestore if user is logged in
    if (currentUser?.uid) {
      const completionPrefsRef = doc(db, 'users', currentUser.uid, 'preferences', 'completion-prefs');
      getDoc(completionPrefsRef).then(snap => {
        const data = snap.exists() ? snap.data() : {};
        
        setDoc(completionPrefsRef, {
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
          ...data,
          [pathId]: {
            isCompleted: true,
            lastViewed: timestamp
          }
        }, { merge: true });
<<<<<<< HEAD
        
        console.log(`💾 Saved completion view status for ${pathId} to Firebase`);
      } catch (error) {
        console.error('Error updating completion prefs in Firebase:', error);
      }
=======
      }).catch(err => {
        console.error('Error updating completion prefs:', err);
      });
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    }
  }, [currentUser]);
  
  // Check if a journey has been recently viewed (within 24 hours)
  const hasJourneyBeenRecentlyViewed = useCallback((pathId) => {
<<<<<<< HEAD
    if (!pathId || !completedJourneys[pathId]) {
      console.log(`❓ Journey ${pathId} not found in completed journeys`);
      return false;
    }
    
    const lastViewed = completedJourneys[pathId].lastViewed;
    if (!lastViewed) {
      console.log(`❓ Journey ${pathId} has no lastViewed timestamp`);
      return false;
    }
    
    // Check if viewed within the last 24 hours
    const twentyFourHoursAgo = new Date().getTime() - (24 * 60 * 60 * 1000);
    const recentlyViewed = parseInt(lastViewed) > twentyFourHoursAgo;
    
    console.log(`🕐 Journey ${pathId} recently viewed: ${recentlyViewed} (viewed: ${new Date(parseInt(lastViewed)).toISOString()})`);
    
    return recentlyViewed;
  }, [completedJourneys]);
  
  // Check if a journey is completed
  const isJourneyCompleted = useCallback((pathId) => {
    if (!pathId || !userProfile?.journeyProgress) return false;
    
    try {
      const pathData = getAllJourneyPaths().find(p => p.id === pathId);
      if (!pathData) return false;
      
      const progressField = getProgressFieldForPath(pathId);
      const progress = userProfile.journeyProgress[progressField];
      const completedDays = progress?.completedDays || [];
      
      return completedDays.length >= pathData.duration;
    } catch (error) {
      console.error(`Error checking if journey ${pathId} is completed:`, error);
      return false;
    }
  }, [userProfile]);
  
  // Reset journey completion view status
  const resetJourneyViewStatus = useCallback(async (pathId) => {
    if (!pathId) return;
    
    console.log(`🔄 Resetting completion view status for ${pathId}`);
    
=======
    if (!pathId || !completedJourneys[pathId]) return false;
    
    const lastViewed = completedJourneys[pathId].lastViewed;
    if (!lastViewed) return false;
    
    // Check if viewed within the last 24 hours
    const twentyFourHoursAgo = new Date().getTime() - (24 * 60 * 60 * 1000);
    return lastViewed > twentyFourHoursAgo;
  }, [completedJourneys]);
  
  // Reset journey completion view status
  const resetJourneyViewStatus = useCallback((pathId) => {
    if (!pathId) return;
    
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    // Update state
    setCompletedJourneys(prev => {
      const updated = { ...prev };
      if (updated[pathId]) {
        delete updated[pathId].lastViewed;
      }
      return updated;
    });
    
    // Remove from localStorage
    localStorage.removeItem(`completion_viewed_${pathId}`);
    
    // Update Firestore if user is logged in
    if (currentUser?.uid) {
<<<<<<< HEAD
      try {
        const completionPrefsRef = doc(db, 'users', currentUser.uid, 'preferences', 'completion-prefs');
        const snap = await getDoc(completionPrefsRef);
        
=======
      const completionPrefsRef = doc(db, 'users', currentUser.uid, 'preferences', 'completion-prefs');
      getDoc(completionPrefsRef).then(snap => {
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        if (snap.exists()) {
          const data = snap.data();
          if (data[pathId]) {
            delete data[pathId].lastViewed;
<<<<<<< HEAD
            await setDoc(completionPrefsRef, data, { merge: true });
            console.log(`💾 Reset completion view status for ${pathId} in Firebase`);
          }
        }
      } catch (error) {
        console.error('Error resetting completion prefs in Firebase:', error);
      }
=======
            setDoc(completionPrefsRef, data, { merge: true });
          }
        }
      }).catch(err => {
        console.error('Error resetting completion prefs:', err);
      });
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    }
  }, [currentUser]);
  
  // Check if navigation should be redirected to completion screen
  const checkCompletionRedirect = useCallback((screen, params = {}) => {
    // If already going to completion screen, just mark as viewed
    if (screen === 'journey-complete') {
      const pathId = params.pathId || currentPath;
      markJourneyAsViewed(pathId);
      return { screen, params };
    }
    
    // When navigating to daily view for a completed journey
    const pathId = params.pathId || currentPath;
    if (screen === 'daily' && 
<<<<<<< HEAD
        isJourneyCompleted(pathId) && 
        !hasJourneyBeenRecentlyViewed(pathId)) {
      // Show completion screen instead if it hasn't been viewed recently
      console.log(`🎯 Path ${pathId} is completed but completion screen not viewed recently. Redirecting to completion.`);
=======
        completedJourneys[pathId]?.isCompleted && 
        !hasJourneyBeenRecentlyViewed(pathId)) {
      // Show completion screen instead if it hasn't been viewed recently
      console.log(`Path ${pathId} is completed but completion screen not viewed recently. Redirecting to completion.`);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      
      // Mark as viewed now
      markJourneyAsViewed(pathId);
      
      // Return the modified navigation
      return {
        screen: 'journey-complete',
        params: { ...params, pathId }
      };
    }
    
    // No redirect needed
    return { screen, params };
<<<<<<< HEAD
  }, [currentPath, isJourneyCompleted, hasJourneyBeenRecentlyViewed, markJourneyAsViewed]);
=======
  }, [currentPath, completedJourneys, hasJourneyBeenRecentlyViewed, markJourneyAsViewed]);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  
  // Enhanced navigation function that checks for completion redirect
  const navigateWithCompletionCheck = useCallback((screen, params = {}) => {
    const { screen: redirectScreen, params: redirectParams } = checkCompletionRedirect(screen, params);
    navigateToScreen(redirectScreen, redirectParams);
  }, [checkCompletionRedirect, navigateToScreen]);
  
  return {
    completedJourneys,
<<<<<<< HEAD
    isLoading,
    markJourneyAsViewed,
    hasJourneyBeenRecentlyViewed,
    isJourneyCompleted,
=======
    markJourneyAsViewed,
    hasJourneyBeenRecentlyViewed,
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    resetJourneyViewStatus,
    checkCompletionRedirect,
    navigateWithCompletionCheck
  };
};

export default useJourneyCompletion;