// src/models/JournalEntry.js

/**
 * Unified model for journal entries that standardizes handling
 * between text-only entries and image-based entries
 */
export class JournalEntry {
    /**
     * Create a journal entry
     * @param {Object} options - Journal entry options
     * @param {number} options.day - Day number in the journey
     * @param {string} options.pathId - Path ID ('self-discovery', 'emotional-intelligence', 'mindfulness-awareness')
     * @param {string|null} options.imageUrl - URL of the journal image (null for text-only entries)
     * @param {string} options.extractedText - Text extracted from image or entered manually
     * @param {string} options.prompt - Journal prompt for this day
     * @param {string} options.theme - Theme for this day's journal entry
     * @param {boolean} options.isTextOnly - Flag to explicitly mark as text-only entry
     */
    constructor({
      day, 
      pathId = 'self-discovery',
      imageUrl = null,
      extractedText = '',
      prompt = '',
      theme = '',
      isTextOnly = false
    }) {
      this.day = day;
      this.pathId = pathId;
      this.imageUrl = imageUrl;
      this.extractedText = extractedText;
      this.prompt = prompt;
      this.theme = theme;
      this.isTextOnly = isTextOnly || (!imageUrl && !!extractedText);
      this.timestamp = new Date();
      this.analysis = null; // Will be populated after analysis
    }
    
    /**
     * Check if the entry has content (either image or text)
     * @returns {boolean} - Whether the entry has content
     */
    hasContent() {
      return !!this.imageUrl || !!this.extractedText;
    }
    
    /**
     * Get the display type of the entry
     * @returns {string} - 'text-only' or 'image'
     */
    getDisplayType() {
      return this.isTextOnly ? 'text-only' : 'image';
    }
    
    /**
     * Prepare entry for analysis
     * @returns {Object} - Entry data formatted for analysis
     */
    prepareForAnalysis() {
      return {
        imageUrl: this.imageUrl,
        extractedText: this.extractedText,
        prompt: this.prompt,
        theme: this.theme,
        day: this.day,
        pathId: this.pathId,
        isTextOnly: this.isTextOnly
      };
    }
    
    /**
     * Store analysis results
     * @param {Object} analysis - Analysis results from Claude
     */
    setAnalysis(analysis) {
      this.analysis = analysis;
      return this;
    }
    
    /**
     * Convert to Firestore document format
     * @returns {Object} - Document format for Firestore
     */
    toFirestoreDoc() {
      return {
        day: this.day,
        pathId: this.pathId,
        imageUrl: this.imageUrl,
        extractedText: this.extractedText,
        prompt: this.prompt,
        theme: this.theme,
        isTextOnly: this.isTextOnly,
        timestamp: this.timestamp,
        analysis: this.analysis
      };
    }
    
    /**
     * Create JournalEntry from Firestore document
     * @param {Object} doc - Firestore document
     * @returns {JournalEntry} - JournalEntry instance
     */
    static fromFirestoreDoc(doc) {
      const data = doc.data ? doc.data() : doc;
      const entry = new JournalEntry({
        day: data.day,
        pathId: data.pathId || 'self-discovery',
        imageUrl: data.imageUrl,
        extractedText: data.extractedText || '',
        prompt: data.prompt || '',
        theme: data.theme || '',
        isTextOnly: data.isTextOnly || (!data.imageUrl && !!data.extractedText)
      });
      
      if (data.timestamp) {
        entry.timestamp = data.timestamp.toDate ? data.timestamp.toDate() : data.timestamp;
      }
      
      if (data.analysis) {
        entry.analysis = data.analysis;
      }
      
      return entry;
    }
  }
  
  export default JournalEntry;