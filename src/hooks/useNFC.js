// src/hooks/useNFC.js
// React hook for NFC operations in Καιρός app

import { useState, useEffect, useCallback, useRef } from 'react';
import nfcService from '../services/nfcService';

/**
 * React hook for NFC operations
 * Provides easy interface to NFC service
 * 
 * @param {Object} options - Configuration options
 * @returns {Object} - NFC state and methods
 */
export function useNFC(options = {}) {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [error, setError] = useState(null);
  const [lastScan, setLastScan] = useState(null);
  const [supportLevel, setSupportLevel] = useState('none');

  const listenerIdRef = useRef(null);
  const cleanupRef = useRef(null);
  const autoStartRef = useRef(options.autoStart || false);

  /**
   * Check NFC availability on mount
   */
  useEffect(() => {
    checkAvailability();
  }, []);

  /**
   * Auto-start reading if enabled
   */
  useEffect(() => {
    if (autoStartRef.current && isAvailable && isEnabled && !isReading) {
      startReading();
    }
  }, [isAvailable, isEnabled]);

  /**
   * Clean up on unmount
   */
  useEffect(() => {
    return () => {
      stopReading();
    };
  }, []);

  /**
   * Check if NFC is available and enabled
   */
  const checkAvailability = useCallback(async () => {
    try {
      const status = await nfcService.checkAvailability();
      setIsAvailable(status.available);
      setIsEnabled(status.enabled);
      setSupportLevel(status.available ? 'full' : 'none');
      
      if (!status.available) {
        setError({ type: 'not_available', message: 'NFC not available on this device' });
      } else if (!status.enabled) {
        setError({ type: 'disabled', message: 'NFC is disabled in device settings' });
      } else {
        setError(null);
      }

      return status;
    } catch (err) {
      setError({ type: 'error', message: err.message });
      return { available: false, enabled: false };
    }
  }, []);

  /**
   * Start reading NFC tags
   */
  const startReading = useCallback(async (customOptions = {}) => {
    try {
      setError(null);
      setIsReading(true);

      // Check availability first
      const status = await checkAvailability();
      if (!status.available || !status.enabled) {
        setIsReading(false);
        return { success: false, error: 'NFC not ready' };
      }

      // Start NFC session
      await nfcService.startReadSession({
        alertMessage: customOptions.alertMessage,
        invalidateAfterFirstRead: customOptions.singleRead !== false
      });

      // Add listener for scans
      if (!cleanupRef.current) {
        cleanupRef.current = nfcService.addScanListener((data, err) => {
          if (err) {
            setError({ type: 'scan_error', message: err.message });
            if (options.onError) options.onError(err);
          } else {
            setLastScan(data);
            if (options.onScan) options.onScan(data);
          }

          // Stop after single read if configured
          if (customOptions.singleRead !== false) {
            stopReading();
          }
        });
      }

      return { success: true };
    } catch (err) {
      console.error('Error starting NFC reading:', err);
      setError({ type: 'start_error', message: err.message });
      setIsReading(false);
      return { success: false, error: err.message };
    }
  }, [checkAvailability, options]);

  /**
   * Stop reading NFC tags
   */
  const stopReading = useCallback(async () => {
    try {
      // Remove listener using cleanup function
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      // Stop session
      await nfcService.stopReadSession();
      setIsReading(false);

      return { success: true };
    } catch (err) {
      console.error('Error stopping NFC reading:', err);
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Read a single NFC tag (one-shot operation)
   */
  const readTag = useCallback(async (customOptions = {}) => {
    try {
      setError(null);
      setIsReading(true);

      const data = await nfcService.readTag({
        alertMessage: customOptions.alertMessage || 'Hold phone near journal NFC chip'
      });

      setLastScan(data);
      setIsReading(false);

      if (options.onScan) {
        options.onScan(data);
      }

      return { success: true, data };
    } catch (err) {
      console.error('Error reading NFC tag:', err);
      setError({ type: 'read_error', message: err.message });
      setIsReading(false);

      if (options.onError) {
        options.onError(err);
      }

      return { success: false, error: err.message };
    }
  }, [options]);

  /**
   * Write data to NFC tag
   */
  const writeTag = useCallback(async (journalData) => {
    try {
      setError(null);
      setIsReading(true);

      const result = await nfcService.writeTag(journalData);
      setIsReading(false);

      return { success: true, data: result.data };
    } catch (err) {
      console.error('Error writing to NFC tag:', err);
      setError({ type: 'write_error', message: err.message });
      setIsReading(false);

      // Preserve needsFormat property if present
      if (err.needsFormat) {
        const formatError = new Error(err.message);
        formatError.needsFormat = true;
        throw formatError;
      }

      throw err;
    }
  }, []);

  /**
   * Open device NFC settings
   */
  const openSettings = useCallback(async () => {
    try {
      await nfcService.openNFCSettings();
      // Re-check availability after settings opened
      setTimeout(checkAvailability, 1000);
    } catch (err) {
      console.error('Error opening NFC settings:', err);
    }
  }, [checkAvailability]);

  /**
   * Generate a new journal ID
   */
  const generateJournalId = useCallback(() => {
    return nfcService.generateJournalId();
  }, []);

  /**
   * Validate journal ID format
   */
  const isValidJournalId = useCallback((journalId) => {
    return nfcService.isValidJournalId(journalId);
  }, []);

  /**
   * Get user-friendly error message
   */
  const getErrorMessage = useCallback(() => {
    if (!error) return null;

    switch (error.type) {
      case 'not_available':
        return 'NFC is not available on this device. You can still use Καιρός by manually uploading photos.';
      case 'disabled':
        return 'NFC is disabled. Please enable it in your device settings to use journal scanning.';
      case 'scan_error':
        return `Scan error: ${error.message}. Try holding your phone steady over the journal.`;
      case 'read_error':
        return `Couldn't read the journal: ${error.message}. Make sure it's a Καιρός journal.`;
      case 'write_error':
        return `Couldn't write to journal: ${error.message}. The tag might be locked or incompatible.`;
      default:
        return error.message || 'An unexpected error occurred with NFC.';
    }
  }, [error]);

  /**
   * Get status badge info
   */
  const getStatusBadge = useCallback(() => {
    if (!isAvailable) {
      return {
        text: 'NFC Not Available',
        color: 'gray',
        icon: 'wifi-off'
      };
    }

    if (!isEnabled) {
      return {
        text: 'NFC Disabled',
        color: 'orange',
        icon: 'alert-circle'
      };
    }

    if (isReading) {
      return {
        text: 'Scanning...',
        color: 'blue',
        icon: 'radio',
        animated: true
      };
    }

    return {
      text: 'NFC Ready',
      color: 'green',
      icon: 'check-circle'
    };
  }, [isAvailable, isEnabled, isReading]);

  return {
    // State
    isAvailable,
    isEnabled,
    isReading,
    error,
    lastScan,
    supportLevel,

    // Methods
    checkAvailability,
    startReading,
    stopReading,
    readTag,
    writeTag,
    openSettings,
    generateJournalId,
    isValidJournalId,

    // Helpers
    getErrorMessage,
    getStatusBadge,

    // Computed
    isReady: isAvailable && isEnabled,
    canRead: isAvailable && isEnabled && !isReading,
    canWrite: isAvailable && isEnabled && !isReading,
  };
}

/**
 * Hook for quick NFC scan (one-time use)
 * Simpler interface for basic scanning
 */
export function useNFCScan(onScan, onError) {
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);

  const scan = useCallback(async () => {
    try {
      setScanning(true);
      const data = await nfcService.readTag();
      setScannedData(data);
      setScanning(false);
      
      if (onScan) onScan(data);
      
      return data;
    } catch (err) {
      setScanning(false);
      if (onError) onError(err);
      throw err;
    }
  }, [onScan, onError]);

  return {
    scan,
    scanning,
    scannedData
  };
}

/**
 * Hook for NFC quick upload flow
 * Auto-triggers upload when journal is scanned
 */
export function useNFCQuickUpload(onJournalScanned) {
  const [isListening, setIsListening] = useState(false);
  const listenerIdRef = useRef(null);

  const startListening = useCallback(async () => {
    try {
      // Check if NFC is available
      const status = await nfcService.checkAvailability();
      if (!status.available || !status.enabled) {
        console.warn('NFC not ready for quick upload');
        return false;
      }

      // Start session
      await nfcService.startReadSession({
        alertMessage: 'Tap your Καιρός journal to start',
        invalidateAfterFirstRead: false // Keep listening
      });

      // Add listener
      listenerIdRef.current = nfcService.addScanListener((data, error) => {
        if (error) {
          console.error('NFC scan error:', error);
        } else if (data && data.journalId) {
          console.log('Journal scanned:', data.journalId);
          if (onJournalScanned) {
            onJournalScanned(data);
          }
        }
      });

      setIsListening(true);
      return true;
    } catch (err) {
      console.error('Error starting NFC quick upload:', err);
      return false;
    }
  }, [onJournalScanned]);

  const stopListening = useCallback(async () => {
    if (listenerIdRef.current) {
      nfcService.removeScanListener(listenerIdRef.current);
      listenerIdRef.current = null;
    }
    
    await nfcService.stopReadSession();
    setIsListening(false);
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isListening,
    startListening,
    stopListening
  };
}

export default useNFC;