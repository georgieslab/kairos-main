// src/services/journalService.js
// Service for managing journal operations

import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Get journal details from Firestore
 * @param {string} journalId - The ID of the journal to fetch
 * @returns {Promise<Object>} Journal data
 */
export async function getJournalDetails(journalId) {
  try {
    const journalRef = doc(db, 'journals', journalId);
    const journalDoc = await getDoc(journalRef);
    
    if (!journalDoc.exists()) {
      throw new Error('Journal not found');
    }
    
    return journalDoc.data();
  } catch (error) {
    console.error('❌ Error fetching journal details:', error);
    throw error;
  }
}

/**
 * Delete a journal from Firestore
 * @param {string} journalId - The ID of the journal to delete
 * @param {string} userId - The ID of the user who owns the journal
 * @returns {Promise<void>}
 */
export async function deleteJournal(journalId, userId) {
  try {
    const journalRef = doc(db, 'journals', journalId);
    
    // Verify the journal exists and belongs to the user
    const journalDoc = await getDoc(journalRef);
    
    if (!journalDoc.exists()) {
      throw new Error('Journal not found');
    }
    
    if (journalDoc.data().userId !== userId) {
      throw new Error('Unauthorized: Journal does not belong to this user');
    }
    
    // Delete the journal document
    await deleteDoc(journalRef);
    
    console.log('✅ Journal deleted:', journalId);
  } catch (error) {
    console.error('❌ Error deleting journal:', error);
    throw error;
  }
}
