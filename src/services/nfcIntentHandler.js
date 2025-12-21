// src/services/nfcIntentHandler.js
// Handles NFC intents when app is launched by tapping an NFC tag

import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import nfcService from './nfcService';

/**
 * NFC Intent Handler Service
 * Processes NFC tags when app is opened via NFC tap
 */
class NFCIntentHandler {
  constructor() {
    this.isInitialized = false;
    this.onTagTapCallback = null;
    this.lastProcessedIntent = null;
  }

  /**
   * Initialize NFC intent handling
   * Call this in App.jsx on mount
   */
  async initialize(onTagTap) {
    if (this.isInitialized) {
      console.log('ℹ️ NFC intent handler already initialized');
      return;
    }

    if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
      console.log('📱 NFC intent handling not available on this platform');
      return;
    }

    this.onTagTapCallback = onTagTap;

    // Listen for app URL opens (includes NFC intents)
    CapacitorApp.addListener('appUrlOpen', (event) => {
      this.handleAppOpen(event);
    });

    // Check if app was already opened with NFC intent
    const launchUrl = await CapacitorApp.getLaunchUrl();
    if (launchUrl) {
      this.handleAppOpen({ url: launchUrl.url });
    }

    this.isInitialized = true;
    console.log('✅ NFC intent handler initialized');
  }

  /**
   * Handle app open event
   * Could be from NFC tap, deep link, or normal launch
   */
  async handleAppOpen(event) {
    try {
      console.log('🔍 App opened:', event);

      // Prevent processing same intent twice
      if (this.lastProcessedIntent === event.url) {
        console.log('⏭️ Intent already processed, skipping');
        return;
      }

      // Check if this is an NFC-triggered open
      // Android NFC intents come with specific data
      const nfcData = await this.extractNFCData(event);
      
      if (nfcData) {
        console.log('🏷️ NFC tag detected on app launch:', nfcData);
        this.lastProcessedIntent = event.url;
        
        // Call the registered callback
        if (this.onTagTapCallback) {
          this.onTagTapCallback(nfcData);
        }
      }
    } catch (error) {
      console.error('❌ Error handling app open:', error);
    }
  }

  /**
   * Extract NFC data from app open event
   * Parses the NFC tag data from Android intent extras
   */
  async extractNFCData(event) {
    try {
      // Method 1: Check URL scheme for deep link (MOST COMMON)
      // Example: https://reflection-writer.web.app/nfc/KAIROS_20251112_ABC12?tier=insight
      if (event.url) {
        console.log('🔗 Checking URL:', event.url);
        
        // Match pattern: reflection-writer.web.app/nfc/{journalId}
        const nfcMatch = event.url.match(/reflection-writer\.web\.app\/nfc\/([^?]+)/);
        if (nfcMatch) {
          const journalId = nfcMatch[1];
          
          // Extract query parameters if present
          const urlParams = new URLSearchParams(event.url.split('?')[1] || '');
          
          return {
            source: 'nfc_deep_link',
            journalId: journalId,
            tier: urlParams.get('tier') || null,
            type: 'kairos',
            timestamp: new Date().toISOString()
          };
        }

        // Legacy pattern: Direct journal ID in URL
        if (event.url.includes('reflection-writer.web.app/journal/')) {
          const journalId = event.url.split('/journal/')[1].split('?')[0];
          return {
            source: 'url',
            journalId,
            type: 'kairos'
          };
        }
      }

      // Method 2: Check for NFC extras in the event
      // This would come from the native plugin
      if (event.nfcData || event.extras) {
        const nfcData = event.nfcData || event.extras;
        return this.parseNFCData(nfcData);
      }

      // Method 3: Try to read from pending NFC scan
      // Some plugins store the last NFC scan in a queue
      try {
        const pendingNFC = await nfcService.getPendingTag?.();
        if (pendingNFC) {
          return this.parseNFCData(pendingNFC);
        }
      } catch (e) {
        // Method not available
      }

      return null;
    } catch (error) {
      console.error('❌ Error extracting NFC data:', error);
      return null;
    }
  }

  /**
   * Parse NFC data into consistent format
   */
  parseNFCData(data) {
    try {
      // If data is string, try parsing as JSON
      if (typeof data === 'string') {
        try {
          const parsed = JSON.parse(data);
          return {
            source: 'nfc_tap',
            ...parsed,
            type: 'kairos'
          };
        } catch (e) {
          // Not JSON, treat as plain text
          return {
            source: 'nfc_tap',
            text: data,
            type: 'plain_text'
          };
        }
      }

      // If data is object, return as-is with source
      if (typeof data === 'object') {
        return {
          source: 'nfc_tap',
          ...data
        };
      }

      return null;
    } catch (error) {
      console.error('❌ Error parsing NFC data:', error);
      return null;
    }
  }

  /**
   * Register callback for NFC tag taps
   */
  onTagTap(callback) {
    this.onTagTapCallback = callback;
  }

  /**
   * Clear last processed intent (for testing)
   */
  reset() {
    this.lastProcessedIntent = null;
  }

  /**
   * Clean up listeners
   */
  destroy() {
    CapacitorApp.removeAllListeners();
    this.isInitialized = false;
    this.onTagTapCallback = null;
    console.log('🧹 NFC intent handler destroyed');
  }
}

// Export singleton
const nfcIntentHandler = new NFCIntentHandler();
export default nfcIntentHandler;
