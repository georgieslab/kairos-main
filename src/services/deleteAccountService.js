// src/services/deleteAccountService.js
// Handles complete user data deletion for GDPR/Play Store compliance

import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc,
  writeBatch
} from 'firebase/firestore';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { ref, deleteObject, listAll } from 'firebase/storage';
import { db, auth, storage } from '../config/firebase';

/**
 * Deletes all user data from Firestore, Storage, and Auth
 * @param {string} userId - The user's UID
 * @param {string} password - User's password for re-authentication
 * @returns {Promise<{success: boolean, deletedItems: object, error?: string}>}
 */
export const deleteUserAccount = async (userId, password) => {
  const deletedItems = {
    journalEntries: 0,
    analysisResults: 0,
    userProfile: false,
    storageFiles: 0,
    authAccount: false
  };

  try {
    console.log('🗑️ Starting account deletion for user:', userId);

    // Step 1: Re-authenticate user (required by Firebase for account deletion)
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user found');
    }

    if (password) {
      console.log('🔐 Re-authenticating user...');
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      console.log('✅ Re-authentication successful');
    }

    // Step 2: Delete all journal entries
    console.log('📝 Deleting journal entries...');
    const entriesRef = collection(db, 'journalEntries');
    const entriesQuery = query(entriesRef, where('userId', '==', userId));
    const entriesSnapshot = await getDocs(entriesQuery);
    
    const batch1 = writeBatch(db);
    entriesSnapshot.docs.forEach((docSnap) => {
      batch1.delete(docSnap.ref);
      deletedItems.journalEntries++;
    });
    
    if (deletedItems.journalEntries > 0) {
      await batch1.commit();
      console.log(`✅ Deleted ${deletedItems.journalEntries} journal entries`);
    }

    // Step 3: Delete all analysis results
    console.log('🔬 Deleting analysis results...');
    const analysisRef = collection(db, 'analysisResults');
    const analysisQuery = query(analysisRef, where('userId', '==', userId));
    const analysisSnapshot = await getDocs(analysisQuery);
    
    const batch2 = writeBatch(db);
    analysisSnapshot.docs.forEach((docSnap) => {
      batch2.delete(docSnap.ref);
      deletedItems.analysisResults++;
    });
    
    if (deletedItems.analysisResults > 0) {
      await batch2.commit();
      console.log(`✅ Deleted ${deletedItems.analysisResults} analysis results`);
    }

    // Step 4: Delete user's uploaded files from Storage
    console.log('📁 Deleting uploaded files...');
    try {
      const userStorageRef = ref(storage, `users/${userId}`);
      const fileList = await listAll(userStorageRef);
      
      for (const item of fileList.items) {
        await deleteObject(item);
        deletedItems.storageFiles++;
      }
      
      // Also check for nested folders (images, voice, etc.)
      for (const folder of fileList.prefixes) {
        const folderFiles = await listAll(folder);
        for (const item of folderFiles.items) {
          await deleteObject(item);
          deletedItems.storageFiles++;
        }
      }
      
      console.log(`✅ Deleted ${deletedItems.storageFiles} storage files`);
    } catch (storageError) {
      // Storage might be empty or not exist - that's okay
      console.log('ℹ️ No storage files found or already deleted');
    }

    // Step 5: Delete user profile document
    console.log('👤 Deleting user profile...');
    const userProfileRef = doc(db, 'users', userId);
    await deleteDoc(userProfileRef);
    deletedItems.userProfile = true;
    console.log('✅ Deleted user profile');

    // Step 6: Delete any additional user-related collections
    // Add more collections here if your app uses them
    const additionalCollections = [
      'userProgress',
      'userSettings', 
      'userAchievements',
      'userJournals'
    ];

    for (const collectionName of additionalCollections) {
      try {
        const colRef = collection(db, collectionName);
        const colQuery = query(colRef, where('userId', '==', userId));
        const colSnapshot = await getDocs(colQuery);
        
        if (!colSnapshot.empty) {
          const batch = writeBatch(db);
          colSnapshot.docs.forEach((docSnap) => {
            batch.delete(docSnap.ref);
          });
          await batch.commit();
          console.log(`✅ Deleted documents from ${collectionName}`);
        }
      } catch (e) {
        // Collection might not exist - that's okay
        console.log(`ℹ️ Collection ${collectionName} not found or empty`);
      }
    }

    // Step 7: Delete Firebase Auth account (must be last!)
    console.log('🔥 Deleting authentication account...');
    await deleteUser(user);
    deletedItems.authAccount = true;
    console.log('✅ Authentication account deleted');

    console.log('🎉 Account deletion complete!', deletedItems);
    
    return {
      success: true,
      deletedItems
    };

  } catch (error) {
    console.error('❌ Account deletion failed:', error);
    
    // Provide user-friendly error messages
    let errorMessage = 'Failed to delete account. Please try again.';
    
    if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many attempts. Please wait a few minutes and try again.';
    } else if (error.code === 'auth/requires-recent-login') {
      errorMessage = 'For security, please sign out and sign back in, then try again.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your connection and try again.';
    }
    
    return {
      success: false,
      deletedItems,
      error: errorMessage
    };
  }
};

/**
 * Get a summary of what data will be deleted (for confirmation dialog)
 * @param {string} userId - The user's UID
 * @returns {Promise<object>} Summary of data to be deleted
 */
export const getDataDeletionSummary = async (userId) => {
  try {
    const summary = {
      journalEntries: 0,
      analysisResults: 0,
      hasProfile: false,
      estimatedFiles: 0
    };

    // Count journal entries
    const entriesRef = collection(db, 'journalEntries');
    const entriesQuery = query(entriesRef, where('userId', '==', userId));
    const entriesSnapshot = await getDocs(entriesQuery);
    summary.journalEntries = entriesSnapshot.size;

    // Count analysis results
    const analysisRef = collection(db, 'analysisResults');
    const analysisQuery = query(analysisRef, where('userId', '==', userId));
    const analysisSnapshot = await getDocs(analysisQuery);
    summary.analysisResults = analysisSnapshot.size;

    // Check for profile
    const userProfileRef = doc(db, 'users', userId);
    summary.hasProfile = true; // Assume exists if user is logged in

    // Estimate files (rough count based on entries)
    summary.estimatedFiles = summary.journalEntries; // At least one image per entry

    return summary;
  } catch (error) {
    console.error('Error getting deletion summary:', error);
    return null;
  }
};

export default {
  deleteUserAccount,
  getDataDeletionSummary
};