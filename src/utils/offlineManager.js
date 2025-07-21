// src/utils/offlineManager.js

import { uploadJournalImage, saveAnalysisResult } from '../services/claudeService';

// Queue operation types
export const OFFLINE_OPERATIONS = {
  UPLOAD_JOURNAL: 'uploadJournal',
  SAVE_ANALYSIS: 'saveAnalysis',
  UPDATE_PROFILE: 'updateProfile'
};

/**
 * Queue an operation to be performed when online
 * @param {string} operation - Operation type from OFFLINE_OPERATIONS
 * @param {Object} data - Data needed for the operation
 * @returns {string} - ID of the queued operation
 */
export const queueOfflineOperation = (operation, data) => {
  // Get existing queue
  const offlineQueue = JSON.parse(localStorage.getItem('kairosOfflineQueue') || '[]');
  
  // Create operation with unique ID
  const operationId = `${operation}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const queueItem = {
    id: operationId,
    operation,
    data,
    timestamp: Date.now(),
    attempts: 0
  };
  
  // Add to queue
  offlineQueue.push(queueItem);
  localStorage.setItem('kairosOfflineQueue', JSON.stringify(offlineQueue));
  
  return operationId;
};

/**
 * Process queued offline operations
 * @param {Function} updateCallback - Optional callback for operation progress updates
 * @returns {Promise<{success: number, failed: number}>} - Count of successful and failed operations
 */
export const processOfflineQueue = async (updateCallback = null) => {
  // Skip if offline
  if (!navigator.onLine) {
    return { success: 0, failed: 0, remaining: 0 };
  }
  
  // Get queue
  const offlineQueue = JSON.parse(localStorage.getItem('kairosOfflineQueue') || '[]');
  if (offlineQueue.length === 0) {
    return { success: 0, failed: 0, remaining: 0 };
  }
  
  let success = 0;
  let failed = 0;
  const remainingQueue = [];
  
  // Process queue items
  for (const [index, item] of offlineQueue.entries()) {
    try {
      // Skip items that have already been retried too many times
      if (item.attempts >= 3) {
        failed++;
        continue;
      }
      
      // Update callback with progress
      if (updateCallback) {
        updateCallback({
          current: index + 1,
          total: offlineQueue.length,
          operation: item.operation
        });
      }
      
      // Process based on operation type
      switch (item.operation) {
        case OFFLINE_OPERATIONS.UPLOAD_JOURNAL:
          await uploadJournalImage(
            item.data.file,
            item.data.userId,
            item.data.day,
            item.data.extractedText,
            item.data.pathId
          );
          success++;
          break;
          
        case OFFLINE_OPERATIONS.SAVE_ANALYSIS:
          await saveAnalysisResult(
            item.data.userId,
            item.data.day,
            item.data.analysisResult,
            item.data.imageUrl,
            item.data.pathId
          );
          success++;
          break;
          
        case OFFLINE_OPERATIONS.UPDATE_PROFILE:
          // Implementation would depend on your updateUserProfile function
          // await updateUserProfile(item.data.userId, item.data.profileData);
          // success++;
          
          // For now, just mark as failed
          failed++;
          break;
          
        default:
          // Unknown operation type
          console.error(`Unknown offline operation type: ${item.operation}`);
          failed++;
      }
    } catch (error) {
      console.error(`Error processing offline operation ${item.operation}:`, error);
      
      // Increment attempts and keep in queue
      item.attempts += 1;
      if (item.attempts < 3) {
        remainingQueue.push(item);
      } else {
        failed++;
      }
    }
  }
  
  // Update queue
  localStorage.setItem('kairosOfflineQueue', JSON.stringify(remainingQueue));
  
  return {
    success,
    failed,
    remaining: remainingQueue.length
  };
};

/**
 * Get the current offline queue
 * @returns {Array} - Array of queued operations
 */
export const getOfflineQueue = () => {
  return JSON.parse(localStorage.getItem('kairosOfflineQueue') || '[]');
};

/**
 * Clear the offline queue
 */
export const clearOfflineQueue = () => {
  localStorage.setItem('kairosOfflineQueue', '[]');
};

/**
 * Check if there are any pending offline operations
 * @returns {boolean} - Whether there are pending operations
 */
export const hasPendingOperations = () => {
  const queue = getOfflineQueue();
  return queue.length > 0;
};

/**
 * Create a file blob from a data URL
 * @param {string} dataUrl - Data URL
 * @param {string} filename - Filename
 * @returns {File} - File object
 */
export const dataUrlToFile = (dataUrl, filename) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};

/**
 * Hook to add to JournalUpload to handle offline uploads
 */
export const useOfflineUpload = () => {
  const handleOfflineUpload = (image, userId, day, extractedText, pathId) => {
    // Convert image to data URL if it's a file
    if (image && image instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        
        // Queue operation with data URL
        queueOfflineOperation(OFFLINE_OPERATIONS.UPLOAD_JOURNAL, {
          file: null, // Can't store File objects in localStorage
          fileDataUrl: dataUrl,
          fileName: image.name,
          userId,
          day,
          extractedText,
          pathId,
          timestamp: Date.now()
        });
      };
      reader.readAsDataURL(image);
    } else {
      // Text-only entry
      queueOfflineOperation(OFFLINE_OPERATIONS.UPLOAD_JOURNAL, {
        file: null,
        fileDataUrl: null,
        userId,
        day,
        extractedText,
        pathId,
        timestamp: Date.now()
      });
    }
    
    // Return true to indicate the operation was queued
    return true;
  };
  
  return { handleOfflineUpload };
};

/**
 * React hook for offline sync
 * @param {Function} onSyncComplete - Callback when sync completes
 */
export const useOfflineSync = (onSyncComplete = null) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });
  
  // Function to trigger sync
  const syncOfflineOperations = useCallback(async () => {
    if (!navigator.onLine || isSyncing) return;
    
    setIsSyncing(true);
    
    try {
      const result = await processOfflineQueue((progress) => {
        setSyncProgress(progress);
      });
      
      if (onSyncComplete) {
        onSyncComplete(result);
      }
    } catch (error) {
      console.error('Error during offline sync:', error);
    } finally {
      setIsSyncing(false);
      setSyncProgress({ current: 0, total: 0 });
    }
  }, [isSyncing, onSyncComplete]);
  
  // Auto-sync when coming online
  useEffect(() => {
    const handleOnline = () => {
      if (hasPendingOperations()) {
        syncOfflineOperations();
      }
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [syncOfflineOperations]);
  
  return {
    isSyncing,
    syncProgress,
    syncOfflineOperations,
    pendingOperations: getOfflineQueue().length
  };
};

export default {
  queueOfflineOperation,
  processOfflineQueue,
  getOfflineQueue,
  clearOfflineQueue,
  hasPendingOperations,
  useOfflineUpload,
  useOfflineSync,
  OFFLINE_OPERATIONS
};