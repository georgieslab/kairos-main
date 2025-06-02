// src/hooks/useJourneyCompletion.js

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Custom hook to manage journey completion navigation logic
 * This extends the navigation system to handle completed journeys properly
 */
const useJourneyCompletion = (currentPath, navigateToScreen) => {
  // State for tracking completed journeys
  const [completedJourneys, setCompletedJourneys] = useState({});
  
  // Get auth context for user data
  const { currentUser, userProfile } = useAuth();
  
  // Load completed journeys from user profile
  useEffect(() => {
    const loadCompletedJourneys = async () => {
      if (!currentUser || !userProfile) return;
      
      try {
        const completedJourneysObj = {};
        
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
        }
        
        // Also check Firebase for stored completion preferences
        if (currentUser.uid) {
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
          }
        }
        
        setCompletedJourneys(completedJourneysObj);
      } catch (error) {
        console.error('Error loading completed journeys:', error);
      }
    };
    
    loadCompletedJourneys();
  }, [currentUser, userProfile]);
  
  // Mark a journey as viewed
  const markJourneyAsViewed = useCallback((pathId) => {
    if (!pathId) return;
    
    const timestamp = new Date().getTime();
    
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
    localStorage.setItem(`completion_viewed_${pathId}`, timestamp);
    
    // Update Firestore if user is logged in
    if (currentUser?.uid) {
      const completionPrefsRef = doc(db, 'users', currentUser.uid, 'preferences', 'completion-prefs');
      getDoc(completionPrefsRef).then(snap => {
        const data = snap.exists() ? snap.data() : {};
        
        setDoc(completionPrefsRef, {
          ...data,
          [pathId]: {
            isCompleted: true,
            lastViewed: timestamp
          }
        }, { merge: true });
      }).catch(err => {
        console.error('Error updating completion prefs:', err);
      });
    }
  }, [currentUser]);
  
  // Check if a journey has been recently viewed (within 24 hours)
  const hasJourneyBeenRecentlyViewed = useCallback((pathId) => {
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
      const completionPrefsRef = doc(db, 'users', currentUser.uid, 'preferences', 'completion-prefs');
      getDoc(completionPrefsRef).then(snap => {
        if (snap.exists()) {
          const data = snap.data();
          if (data[pathId]) {
            delete data[pathId].lastViewed;
            setDoc(completionPrefsRef, data, { merge: true });
          }
        }
      }).catch(err => {
        console.error('Error resetting completion prefs:', err);
      });
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
        completedJourneys[pathId]?.isCompleted && 
        !hasJourneyBeenRecentlyViewed(pathId)) {
      // Show completion screen instead if it hasn't been viewed recently
      console.log(`Path ${pathId} is completed but completion screen not viewed recently. Redirecting to completion.`);
      
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
  }, [currentPath, completedJourneys, hasJourneyBeenRecentlyViewed, markJourneyAsViewed]);
  
  // Enhanced navigation function that checks for completion redirect
  const navigateWithCompletionCheck = useCallback((screen, params = {}) => {
    const { screen: redirectScreen, params: redirectParams } = checkCompletionRedirect(screen, params);
    navigateToScreen(redirectScreen, redirectParams);
  }, [checkCompletionRedirect, navigateToScreen]);
  
  return {
    completedJourneys,
    markJourneyAsViewed,
    hasJourneyBeenRecentlyViewed,
    resetJourneyViewStatus,
    checkCompletionRedirect,
    navigateWithCompletionCheck
  };
};

export default useJourneyCompletion;