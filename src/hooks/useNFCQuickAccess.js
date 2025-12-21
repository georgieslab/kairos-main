// src/hooks/useNFCQuickAccess.js
// Hook to handle NFC tag taps for quick journal access

import { useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import nfcIntentHandler from '../services/nfcIntentHandler';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Hook for handling NFC quick access
 * Automatically navigates to appropriate screen when NFC tag is tapped
 * 
 * @param {Object} options - Configuration options
 * @returns {Object} - Status and methods
 */
export function useNFCQuickAccess(options = {}) {
  const { navigateToScreen } = useNavigation();
  const { currentUser, userProfile } = useAuth();

  const {
    enableQuickUpload = true,      // Navigate to upload screen
    enableContextAware = true,      // Smart navigation based on context
    showNotification = true,        // Show toast notification
    onTagDetected = null,          // Custom callback
  } = options;

  /**
   * Handle NFC tag tap
   */
  const handleNFCTap = useCallback(async (nfcData) => {
    try {
      console.log('🏷️ NFC Quick Access - Tag tapped:', nfcData);

      if (!currentUser) {
        console.warn('⚠️ User not logged in, cannot process NFC tag');
        return;
      }

      // Call custom callback if provided
      if (onTagDetected) {
        onTagDetected(nfcData);
      }

      // Extract journal ID and action
      const journalId = nfcData.journalId || nfcData.id;
      const action = nfcData.action || 'write'; // Default to write action
      
      if (!journalId) {
        console.warn('⚠️ No journal ID in NFC data');
        // Navigate to registration
        if (showNotification) {
          // Show toast: "Journal not registered. Register it now?"
        }
        navigateToScreen('profile', { action: 'register' });
        return;
      }

      // Verify journal exists and belongs to user
      const journalRef = doc(db, 'journals', journalId);
      const journalSnap = await getDoc(journalRef);

      if (!journalSnap.exists()) {
        console.warn('⚠️ Journal not found in database');
        if (showNotification) {
          // Show toast: "Journal not found. Register it first."
        }
        navigateToScreen('profile', { action: 'register' });
        return;
      }

      const journalData = journalSnap.data();

      // Check if journal belongs to this user
      if (journalData.userId !== currentUser.uid) {
        console.error('❌ Journal belongs to another user');
        if (showNotification) {
          // Show toast: "This journal belongs to another account"
        }
        return;
      }

      // Update last used timestamp
      await updateDoc(journalRef, {
        lastUsed: serverTimestamp(),
        lastNFCScan: serverTimestamp()
      });

      // Determine where to navigate based on context
      if (enableContextAware) {
        const destination = await determineSmartNavigation(journalData, currentUser, action);
        
        if (showNotification) {
          // Show toast: "Opening journal..."
        }
        
        navigateToScreen(destination.screen, { 
          journalId,
          journalData,
          fromNFC: true,
          ...destination.state 
        });
      } else if (enableQuickUpload || action === 'write') {
        // Direct to upload/write screen
        if (showNotification) {
          // Show toast: "📷 Ready to write entry"
        }
        
        navigateToScreen('upload', {
          journalId,
          journalData,
          fromNFC: true,
          autoOpenCamera: true // Auto-open camera for quick capture
        });
      }

    } catch (error) {
      console.error('❌ Error handling NFC tap:', error);
      
      if (showNotification) {
        // Show toast: "Error processing journal tap"
      }
    }
  }, [currentUser, navigateToScreen, enableContextAware, enableQuickUpload, showNotification, onTagDetected]);

  /**
   * Determine smart navigation based on context
   */
  const determineSmartNavigation = async (journalData, user, action) => {
    try {
      // If explicit write action, go to upload
      if (action === 'write') {
        return {
          screen: 'upload',
          state: {
            autoOpenCamera: true,
            suggestPrompt: true
          }
        };
      }

      // Check if user has entries from today
      const today = new Date().toISOString().split('T')[0];
      
      // Query user's entries for today
      // (You might want to add this query to your existing services)
      const hasEntryToday = false; // TODO: Implement actual check

      if (hasEntryToday) {
        // View today's entry
        return {
          screen: 'journalArchive',
          state: {
            filterDate: today,
            highlightJournal: journalData.journalId
          }
        };
      } else {
        // Upload new entry
        return {
          screen: 'upload',
          state: {
            suggestPrompt: true // Could show daily prompt
          }
        };
      }
    } catch (error) {
      console.error('Error determining navigation:', error);
      // Default to upload
      return {
        screen: 'upload',
        state: {}
      };
    }
  };

  /**
   * Initialize NFC intent handler
   */
  useEffect(() => {
    if (currentUser) {
      nfcIntentHandler.initialize(handleNFCTap);
      console.log('✅ NFC Quick Access initialized for user:', currentUser.uid);
    }

    return () => {
      // Clean up on unmount
      nfcIntentHandler.reset();
    };
  }, [currentUser, handleNFCTap]);

  return {
    isReady: !!currentUser,
    handleNFCTap, // Expose for manual triggering
  };
}

export default useNFCQuickAccess;
