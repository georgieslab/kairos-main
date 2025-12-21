// src/services/nfcService.js
// Καιρός Smart Journal - NFC Service
// Handles all NFC operations: reading, writing, availability checking

import { Capacitor } from '@capacitor/core';
import { NFC } from '@exxili/capacitor-nfc';

/**
 * NFC Service for Καιρός Smart Journal
 * Manages physical journal NFC chips using @exxili/capacitor-nfc
 * 
 * Note: NFC functionality works on native Android and iOS 13+
 * Web/development mode will gracefully degrade.
 */
class NFCService {
  constructor() {
    this.isAvailable = false;
    this.isEnabled = false;
    this.scanActive = false;
    this.readListener = null;
    this.errorListener = null;
    this.writeListener = null;
    
    // Initialize on construction
    this.initialize();
  }

  /**
   * Initialize NFC service and check availability
   */
  async initialize() {
    try {
      console.log('🔷 Initializing NFC Service...');
      
      // Check if we're on a platform that supports NFC
      if (!Capacitor.isNativePlatform()) {
        console.log('📱 Platform does not support NFC (web mode - NFC disabled)');
        this.isAvailable = false;
        return false;
      }

      // Check if NFC is supported on device
      const { supported } = await NFC.isSupported();
      this.isAvailable = supported;
      this.isEnabled = supported; // @exxili plugin considers available = enabled
      
      console.log(`📱 NFC initialized - Supported: ${this.isAvailable}`);
      
      return this.isAvailable;
    } catch (error) {
      console.error('❌ NFC initialization error:', error);
      this.isAvailable = false;
      return false;
    }
  }

  /**
   * Check if NFC is available and enabled
   */
  async checkAvailability() {
    try {
      console.log('🔍 Checking NFC availability...');
      
      if (!Capacitor.isNativePlatform()) {
        console.log('❌ Not native platform');
        return { available: false, enabled: false, reason: 'not_native' };
      }

      const { supported } = await NFC.isSupported();
      this.isAvailable = supported;
      this.isEnabled = supported;

      if (!supported) {
        console.log('❌ NFC not supported on this device');
        return { available: false, enabled: false, reason: 'not_supported' };
      }

      console.log('✅ NFC is available and enabled');
      return { available: true, enabled: true, reason: 'ready' };
      
    } catch (error) {
      console.error('❌ Error checking NFC availability:', error);
      return { available: false, enabled: false, reason: 'error', error };
    }
  }

  /**
   * Start NFC reading session
   * For iOS: starts scanning session
   * For Android: sets up listeners (always listening in foreground)
   */
  async startReadSession(options = {}) {
    try {
      console.log('📖 Starting NFC read session...');

      // Check availability first
      const availability = await this.checkAvailability();
      if (!availability.available) {
        throw new Error('NFC not available on this device');
      }

      // iOS requires explicit scan start
      if (Capacitor.getPlatform() === 'ios') {
        await NFC.startScan();
        console.log('✅ iOS NFC scanning started');
      } else {
        console.log('✅ Android NFC ready (listening in foreground)');
      }

      this.scanActive = true;
      return { success: true, scanActive: true };
    } catch (error) {
      console.error('❌ Error starting NFC session:', error);
      this.scanActive = false;
      throw error;
    }
  }

  /**
   * Stop active NFC reading session
   */
  async stopReadSession() {
    try {
      if (!this.scanActive) {
        console.log('ℹ️ No active NFC session to stop');
        return { success: true };
      }

      // iOS requires explicit scan cancellation
      if (Capacitor.getPlatform() === 'ios') {
        await NFC.cancelScan();
        console.log('✅ iOS NFC scanning stopped');
      }
      
      this.scanActive = false;
      console.log('✅ NFC scanning stopped');

      return { success: true };
    } catch (error) {
      console.error('❌ Error stopping NFC session:', error);
      throw error;
    }
  }

  /**
   * Add listener for NFC tag scans
   * @param {Function} callback - Called when tag is scanned (data, error)
   * @returns {Function} - Cleanup function to remove listener
   */
  addScanListener(callback) {
    console.log('📡 Adding NFC scan listener...');

    // Remove previous listener if exists
    if (this.readListener) {
      this.readListener();
      this.readListener = null;
    }

    // Add read listener
    this.readListener = NFC.onRead((data) => {
      console.log('🏷️ NFC Tag Detected:', data);
      
      try {
        // Parse the tag data
        const parsedData = this.parseNFCTag(data);
        callback(parsedData, null);
      } catch (error) {
        console.error('❌ Error parsing NFC tag:', error);
        callback(null, error);
      }
    });

    // Add error listener
    if (this.errorListener) {
      this.errorListener();
    }
    this.errorListener = NFC.onError((error) => {
      console.error('❌ NFC Error:', error);
      callback(null, new Error(error.error || 'NFC error occurred'));
    });

    console.log('✅ NFC listeners added');

    // Return cleanup function
    return () => {
      if (this.readListener) {
        this.readListener();
        this.readListener = null;
      }
      if (this.errorListener) {
        this.errorListener();
        this.errorListener = null;
      }
      console.log('✅ NFC listeners removed');
    };
  }

  /**
   * Remove NFC scan listener
   * @param {string} listenerId - ID returned from addScanListener
   */
  removeScanListener(listenerId) {
    const listener = this.listeners.get(listenerId);
    if (listener) {
      listener.remove();
      this.listeners.delete(listenerId);
      console.log(`✅ NFC listener removed: ${listenerId}`);
    }
  }

  /**
   * Remove all NFC listeners
   */
  removeAllListeners() {
    this.listeners.forEach((listener) => listener.remove());
    this.listeners.clear();
    console.log('✅ All NFC listeners removed');
  }

  /**
   * Read NFC tag data
   * One-time read operation
   */
  async readTag(options = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('📖 Reading NFC tag...');
        
        // Check availability
        const availability = await this.checkAvailability();
        if (!availability.available) {
          throw new Error('NFC not available or not enabled');
        }

        // Start scanning session
        await this.startReadSession(options);

        // Set up one-time listener
        const cleanup = this.addScanListener((data, error) => {
          // Clean up
          cleanup();
          this.stopReadSession();

          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });

        // Timeout after 30 seconds
        setTimeout(() => {
          cleanup();
          this.stopReadSession();
          reject(new Error('NFC scan timeout - no tag detected'));
        }, 30000);

      } catch (error) {
        console.error('❌ Error reading NFC tag:', error);
        reject(error);
      }
    });
  }

  /**
   * Parse NFC tag data into Καιρός journal format
   * @param {NDEFMessagesTransformable} data - Data from NFC.onRead
   */
  parseNFCTag(data) {
    try {
      console.log('🔍 Parsing NFC tag data...');

      // Get different representations
      const stringData = data.string(); // Decoded text (T & U records handled)
      const rawData = data.uint8Array(); // Raw bytes
      const tagInfo = stringData.tagInfo; // Tag metadata

      console.log('📋 Tag Info:', tagInfo);
      console.log('📊 Messages:', stringData.messages);

      // Extract first message and first record
      const firstMessage = stringData.messages[0];
      if (!firstMessage || !firstMessage.records || firstMessage.records.length === 0) {
        console.warn('⚠️ No NDEF records found on tag');
        return {
          success: false,
          error: 'No NDEF data on tag',
          tagInfo: tagInfo || null
        };
      }

      const firstRecord = firstMessage.records[0];
      console.log('� First Record Type:', firstRecord.type);
      console.log('📄 First Record Payload:', firstRecord.payload);

      // Try to parse as JSON (for journal data)
      let journalData = null;
      try {
        // The payload should already be decoded text for Text records
        const payloadText = firstRecord.payload;
        console.log('� Payload Text:', payloadText);
        
        if (typeof payloadText === 'string' && payloadText.trim().startsWith('{')) {
          journalData = JSON.parse(payloadText);
          console.log('✅ Parsed journal JSON:', journalData);
        }
      } catch (jsonError) {
        console.log('ℹ️ Payload is not JSON:', jsonError.message);
      }

      // Extract URL if it's a URI record
      let url = null;
      if (firstRecord.type === 'U') {
        url = firstRecord.payload; // Already decoded by plugin
        console.log('🔗 URL found:', url);
      }

      // Build result
      const result = {
        success: true,
        
        // Tag metadata
        tagId: tagInfo?.uid || null,
        techTypes: tagInfo?.techTypes || [],
        maxSize: tagInfo?.maxSize || null,
        isWritable: tagInfo?.isWritable || false,
        tagType: tagInfo?.type || null,

        // Record data
        recordType: firstRecord.type,
        payload: firstRecord.payload,
        
        // Parsed data
        journalData: journalData,
        url: url,

        // Additional records
        allRecords: stringData.messages[0].records,
        
        // Raw for debugging
        rawMessages: stringData.messages
      };

      // If journal data exists, extract specific fields
      if (journalData) {
        result.journalId = journalData.journalId || null;
        result.tier = journalData.tier || null;
        result.serialNumber = journalData.serialNumber || null;
      }

      console.log('✅ Parsed NFC data:', result);
      return result;

    } catch (error) {
      console.error('❌ Error parsing NFC tag:', error);
      return {
        success: false,
        error: error.message,
        rawData: data
      };
    }
  }

  /**
   * Write data to NFC tag
   * Used during journal registration
   * 
   * IMPORTANT: Writes an Android App Link (Deep Link) that:
   * 1. Automatically launches the Καιρός app when tapped
   * 2. Passes the journal ID to the app
   * 3. Works even if app is not installed (shows Play Store)
   */
  async writeTag(journalData) {
    try {
      console.log('✍️ Writing to NFC tag:', journalData);

      // Check availability
      const availability = await this.checkAvailability();
      if (!availability.available || !availability.enabled) {
        throw new Error('NFC not available for writing');
      }

      if (!this.nfc) {
        throw new Error('NFC plugin not loaded');
      }

      // Construct deep link URL with write action
      // This will open the app directly to the journal upload/write screen
      const deepLinkUrl = `https://reflection-writer.web.app/nfc/${journalData.journalId}?tier=${journalData.tier}&action=write`;
      
      console.log('📝 Writing deep link URL:', deepLinkUrl);

      // Encode URL as NDEF URI record
      const encoder = new TextEncoder();
      const urlBytes = Array.from(encoder.encode(deepLinkUrl));
      
      // NDEF URI Record structure:
      // - TNF: 0x01 (Well-known)
      // - Type: [0x55] = 'U' (URI)
      // - Payload: [prefix_code, ...url_bytes]
      //   prefix_code 0x04 = "https://"
      
      const payload = [0x04, ...urlBytes]; // 0x04 = https:// prefix

      console.log('🏷️ Preparing NDEF record...');
      console.log('  - URL:', deepLinkUrl);
      console.log('  - Payload length:', payload.length);

      // Write URI record to NFC tag
      // This will prompt the user to tap their device to the tag
      const writeResult = await this.nfc.write({ 
        records: [
          {
            tnf: 0x01, // Well-known type (TNF_WELL_KNOWN)
            type: [0x55], // 'U' for URI
            id: [],
            payload: payload
          }
        ]
      });

      console.log('✅ Successfully wrote deep link to NFC tag:', writeResult);
      
      return { success: true, data: journalData, url: deepLinkUrl };

    } catch (error) {
      console.error('❌ Error writing to NFC tag:', error);
      
      // Provide more specific error messages
      if (error.message && error.message.includes('Tag is not writable')) {
        throw new Error('This NFC tag is read-only and cannot be written to');
      } else if (error.message && error.message.includes('Tag was lost')) {
        throw new Error('Lost connection to NFC tag. Please hold your phone steady and try again');
      } else if (error.message && error.message.includes('cancelled')) {
        throw new Error('NFC write was cancelled');
      } else if (error.message && error.message.includes('does not support NDEF')) {
        // Tag needs formatting - return special error code
        const formatError = new Error('Tag needs to be formatted for NDEF. Would you like to format it now?');
        formatError.needsFormat = true;
        throw formatError;
      }
      
      throw error;
    }
  }

  /**
   * Write multiple NDEF records to tag (advanced)
   * Writes both URL (primary) and JSON (backup) to same tag
   */
  async writeMultipleRecords(url, journalData) {
    try {
      const records = [
        {
          type: 'url',
          payload: url
        },
        {
          type: 'text',
          payload: JSON.stringify({
            journalId: journalData.journalId,
            tier: journalData.tier,
            serialNumber: journalData.serialNumber,
            registeredAt: new Date().toISOString()
          })
        }
      ];

      await this.nfc.write({ 
        records: records
      });

      console.log('✅ Wrote multiple records to NFC tag');
    } catch (error) {
      console.error('❌ Error writing multiple records:', error);
      throw error;
    }
  }

  /**
   * Generate unique journal ID
   * Format: KAIROS_YYYYMMDD_XXXXX
   */
  generateJournalId() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    
    return `KAIROS_${dateStr}_${random}`;
  }

  /**
   * Validate journal ID format
   */
  isValidJournalId(journalId) {
    if (!journalId || typeof journalId !== 'string') {
      return false;
    }
    
    // Check format: KAIROS_YYYYMMDD_XXXXX
    const pattern = /^KAIROS_\d{8}_[A-Z0-9]{5}$/;
    return pattern.test(journalId);
  }

  /**
   * Open device NFC settings
   */
  async openNFCSettings() {
    try {
      if (Capacitor.getPlatform() === 'android' && this.nfc) {
        // Open Android NFC settings using @capgo/capacitor-nfc
        await this.nfc.showSettings();
        return { success: true };
      }
      return { success: false, reason: 'not_supported' };
    } catch (error) {
      console.error('❌ Error opening NFC settings:', error);
      throw error;
    }
  }

  /**
   * Erase/format NFC tag
   * Clears all data from tag and formats it for NDEF
   */
  async eraseTag() {
    try {
      console.log('🗑️ Formatting NFC tag for NDEF...');

      if (!this.nfc) {
        throw new Error('NFC plugin not available');
      }

      // Instead of erase(), write a properly formatted empty NDEF message
      // This initializes the tag for NDEF and makes it writable
      console.log('📝 Writing empty NDEF message to initialize tag...');
      
      await this.nfc.write({
        records: [
          {
            tnf: 0x00, // TNF_EMPTY - properly formatted empty record
            type: [],
            id: [],
            payload: []
          }
        ]
      });
      
      console.log('✅ NFC tag formatted and ready for NDEF');
      return { success: true };

    } catch (error) {
      console.error('❌ Error formatting NFC tag:', error);
      
      // If even empty write fails, the tag might be locked or incompatible
      if (error.message && error.message.includes('does not support NDEF')) {
        throw new Error('This NFC chip cannot be formatted. It may be locked or incompatible. Try using NFC Tools app to format it first.');
      }
      
      throw error;
    }
  }

  /**
   * Format tag for NDEF and then write data
   * Used when tag doesn't support NDEF yet
   */
  async formatAndWrite(journalData) {
    try {
      console.log('🔧 Starting formatAndWrite for journal:', journalData.journalId);
      console.log('📋 Step 1: Formatting tag for NDEF...');
      
      // First erase/format the tag
      const eraseResult = await this.eraseTag();
      console.log('✅ Erase result:', eraseResult);
      
      console.log('📋 Step 2: Writing journal data...');
      
      // Now write the journal data
      const writeResult = await this.writeTag(journalData);
      console.log('✅ Write result:', writeResult);
      
      return writeResult;
      
    } catch (error) {
      console.error('❌ Error in formatAndWrite:', error);
      throw error;
    }
  }

  /**
   * Make tag read-only (lock it)
   * WARNING: This is permanent!
   */
  async makeReadOnly() {
    try {
      console.log('🔒 Making NFC tag read-only...');

      if (!this.nfc) {
        throw new Error('NFC plugin not available');
      }

      await this.nfc.makeReadOnly();

      console.log('✅ NFC tag is now read-only');
      return { success: true };

    } catch (error) {
      console.error('❌ Error making tag read-only:', error);
      throw error;
    }
  }

  /**
   * Get NFC support level
   */
  getSupportLevel() {
    if (!Capacitor.isNativePlatform()) {
      return 'none'; // Web/PWA
    }
    
    if (Capacitor.getPlatform() !== 'android') {
      return 'none'; // iOS doesn't support our NFC use case
    }
    
    if (!this.isAvailable) {
      return 'no_hardware'; // Android device without NFC chip
    }
    
    if (!this.isEnabled) {
      return 'disabled'; // NFC hardware present but disabled
    }
    
    return 'full'; // Full NFC support
  }

  /**
   * Clean up service
   */
  destroy() {
    console.log('🧹 Cleaning up NFC service...');
    this.removeAllListeners();
    if (this.sessionActive) {
      this.stopReadSession();
    }
  }
}

// Export singleton instance
const nfcService = new NFCService();
export default nfcService;

// Also export class for testing
export { NFCService };
