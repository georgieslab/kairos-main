// src/services/feedbackService.js

import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp,
  doc, 
  getDoc
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

/**
 * Submit general feedback to the backend
 * @param {Object} feedbackData - Feedback data object
 * @returns {Promise<Object>} - Result including the document ID
 */
export const submitFeedback = async (feedbackData) => {
  try {
    // Upload any attachments first
    const attachmentUrls = await uploadAttachments(
      feedbackData.attachments,
      'feedback',
      feedbackData.userId
    );
    
    // Prepare data for Firestore
    const feedbackDoc = {
      type: 'feedback',
      text: feedbackData.text,
      category: feedbackData.category,
      email: feedbackData.email,
      userId: feedbackData.userId,
      userName: feedbackData.userName,
      attachmentUrls,
      deviceInfo: feedbackData.deviceInfo,
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, 'userFeedback'), feedbackDoc);
    
    return {
      success: true,
      id: docRef.id,
      message: 'Feedback submitted successfully'
    };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw new Error('Failed to submit feedback. Please try again.');
  }
};

/**
 * Submit bug report to the backend
 * @param {Object} bugData - Bug report data object
 * @returns {Promise<Object>} - Result including the document ID
 */
export const submitBugReport = async (bugData) => {
  try {
    // Upload any attachments first
    const attachmentUrls = await uploadAttachments(
      bugData.attachments,
      'bugs',
      bugData.userId
    );
    
    // Prepare data for Firestore
    const bugDoc = {
      type: 'bug',
      text: bugData.text,
      category: bugData.category,
      email: bugData.email,
      userId: bugData.userId,
      userName: bugData.userName,
      attachmentUrls,
      deviceInfo: bugData.deviceInfo,
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, 'userFeedback'), bugDoc);
    
    return {
      success: true,
      id: docRef.id,
      message: 'Bug report submitted successfully'
    };
  } catch (error) {
    console.error('Error submitting bug report:', error);
    throw new Error('Failed to submit bug report. Please try again.');
  }
};

/**
 * Upload attachments to Firebase Storage
 * @param {Array} attachments - Array of attachment objects
 * @param {string} type - Type of upload ('feedback' or 'bugs')
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of download URLs
 */
const uploadAttachments = async (attachments, type, userId) => {
  if (!attachments || attachments.length === 0) {
    return [];
  }
  
  try {
    const uploadPromises = attachments.map(async (attachment) => {
      // Create a unique filename
      const timestamp = Date.now();
      const filename = `${userId}_${timestamp}_${attachment.name}`;
      
      // Create storage reference
      const storageRef = ref(storage, `${type}/${userId}/${filename}`);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, attachment.file);
      
      // Get download URL
      const downloadUrl = await getDownloadURL(snapshot.ref);
      
      return {
        url: downloadUrl,
        name: attachment.name,
        type: attachment.file.type,
        size: attachment.file.size
      };
    });
    
    return Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading attachments:', error);
    throw new Error('Failed to upload attachments. Please try again.');
  }
};

/**
 * Get feedback submission by ID
 * @param {string} id - Feedback document ID
 * @returns {Promise<Object>} - Feedback document data
 */
export const getFeedbackById = async (id) => {
  try {
    const docRef = doc(db, 'userFeedback', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Feedback not found');
    }
  } catch (error) {
    console.error('Error getting feedback:', error);
    throw error;
  }
};

export default {
  submitFeedback,
  submitBugReport,
  getFeedbackById
};