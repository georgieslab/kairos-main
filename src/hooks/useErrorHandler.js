// src/hooks/useErrorHandler.jsx

import { useState, useCallback } from 'react';
import { queueOfflineOperation } from '../utils/offlineManager';

/**
 * Error types for categorizing errors
 */
export const ERROR_TYPES = {
  NETWORK: 'network',
  AUTH: 'auth',
  VALIDATION: 'validation',
  API: 'api',
  UPLOAD: 'upload',
  ANALYSIS: 'analysis',
  GENERAL: 'general'
};

/**
 * Custom hook for standardized error handling across the app
 * @param {Object} options - Configuration options
 * @param {Function} options.onError - Optional callback when an error occurs
 * @returns {Object} - Error handling utilities
 */
const useErrorHandler = (options = {}) => {
  const [error, setError] = useState(null);
  
  /**
   * Handle an error
   * @param {Error|string} errorData - Error object or message
   * @param {string} context - Where the error occurred
   * @param {Object} additionalInfo - Additional information about the error
   */
  const handleError = useCallback((errorData, context = '', additionalInfo = {}) => {
    // Log the error
    console.error(`Error in ${context}:`, errorData, additionalInfo);
    
    // Extract error message
    const errorMessage = errorData?.message || errorData?.toString() || 'An unknown error occurred';
    
    // Create standardized error object
    let errorObj = {
      type: ERROR_TYPES.GENERAL,
      message: 'Something went wrong. Please try again.',
      details: errorMessage,
      context,
      timestamp: new Date(),
      ...additionalInfo,
      retry: true
    };
    
    // Categorize error based on message and context
    if (!navigator.onLine || errorMessage.includes('network') || errorMessage.includes('offline')) {
      errorObj = {
        ...errorObj,
        type: ERROR_TYPES.NETWORK,
        message: 'Network error. Please check your connection and try again.',
        offline: true
      };
    } else if (errorMessage.includes('auth') || errorMessage.includes('unauthenticated') || errorMessage.includes('permission') || context.includes('auth')) {
      errorObj = {
        ...errorObj,
        type: ERROR_TYPES.AUTH,
        message: 'Authentication error. Please sign in again.',
        retry: false
      };
    } else if (errorMessage.includes('validation') || errorMessage.includes('invalid') || context.includes('validation')) {
      errorObj = {
        ...errorObj,
        type: ERROR_TYPES.VALIDATION,
        message: 'Please check your input and try again.',
        retry: true
      };
    } else if (context.includes('upload') || errorMessage.includes('upload')) {
      errorObj = {
        ...errorObj,
        type: ERROR_TYPES.UPLOAD,
        message: 'Failed to upload journal entry. Please try again.',
        retry: true
      };
    } else if (context.includes('analysis') || errorMessage.includes('analysis')) {
      errorObj = {
        ...errorObj,
        type: ERROR_TYPES.ANALYSIS,
        message: 'Failed to analyze journal entry. Please try again.',
        retry: true
      };
    } else if (errorMessage.includes('api') || context.includes('api')) {
      errorObj = {
        ...errorObj,
        type: ERROR_TYPES.API,
        message: 'There was a problem communicating with the server. Please try again later.',
        retry: false
      };
    }
    
    // Set the error state
    setError(errorObj);
    
    // Call onError callback if provided
    if (options.onError) {
      options.onError(errorObj);
    }
    
    // Save error to analytics or logging service
    logErrorToAnalytics(errorObj);
    
    return errorObj;
  }, [options]);
  
  /**
   * Clear the current error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  /**
   * Retry the operation that caused the error
   * @param {Function} retryFn - Function to retry
   */
  const retryOperation = useCallback(async (retryFn) => {
    if (!error?.retry) return;
    
    clearError();
    
    try {
      if (typeof retryFn === 'function') {
        await retryFn();
      }
    } catch (retryError) {
      handleError(retryError, `retry-${error?.context}`, { previousError: error });
    }
  }, [error, clearError, handleError]);
  
  /**
   * Queue an operation for when the user is back online
   * @param {string} operation - Operation type
   * @param {Object} data - Operation data
   */
  const queueForOffline = useCallback((operation, data) => {
    if (error?.type === ERROR_TYPES.NETWORK) {
      queueOfflineOperation(operation, data);
      setError(prev => ({
        ...prev,
        queued: true,
        message: 'Operation queued for when you are back online.'
      }));
    }
  }, [error]);
  
  /**
   * Get a user-friendly message for the current error
   * @returns {string} - User-friendly error message
   */
  const getUserFriendlyMessage = useCallback(() => {
    if (!error) return '';
    
    // Return specific message or the default message
    return error.message;
  }, [error]);
  
  return {
    error,
    handleError,
    clearError,
    retryOperation,
    queueForOffline,
    getUserFriendlyMessage,
    isError: !!error
  };
};

/**
 * Log error to analytics service
 * @param {Object} error - Error object
 */
const logErrorToAnalytics = (error) => {
  // This would be replaced with actual analytics tracking
  console.log('Error logged to analytics:', error);
  // Example: analytics.logEvent('error', error);
};

export default useErrorHandler;