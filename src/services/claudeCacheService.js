// src/services/claudeCacheService.js
/**
 * Optimized Claude API Cache Service
 * 
 * This service improves the efficiency of Claude API calls by:
 * 1. Implementing intelligent caching for expensive API calls
 * 2. Reducing duplicate requests for similar content
 * 3. Optimizing batch analysis operations
 * 4. Implementing tiered caching (memory and IndexedDB)
 * 5. Providing offline support for recent requests
 */

import { formatApiError } from '../utils/apiUtils';
import { openDB } from 'idb';
import { callClaudeApi } from '../utils/apiUtils';

// Cache database name and version
const CACHE_DB_NAME = 'claude-cache-db';
const CACHE_DB_VERSION = 1;
const CACHES = {
  TEXT_EXTRACTION: 'text-extraction',
  ANALYSIS: 'analysis',
  COMPLETION: 'completion',
  PROGRESS: 'progress'
};

// Cache invalidation timeouts (in milliseconds)
const CACHE_TIMEOUTS = {
  TEXT_EXTRACTION: 7 * 24 * 60 * 60 * 1000, // 7 days for text extraction
  ANALYSIS: 30 * 24 * 60 * 60 * 1000,       // 30 days for analysis
  COMPLETION: 60 * 24 * 60 * 60 * 1000,     // 60 days for completion
  PROGRESS: 14 * 24 * 60 * 60 * 1000        // 14 days for progress
};

// In-memory cache for fastest access
const memoryCache = {
  [CACHES.TEXT_EXTRACTION]: new Map(),
  [CACHES.ANALYSIS]: new Map(),
  [CACHES.COMPLETION]: new Map(),
  [CACHES.PROGRESS]: new Map()
};

// Cache hit counters for analytics
let cacheStats = {
  hits: 0,
  misses: 0,
  saved: 0, // Estimated tokens saved
};

/**
 * Initialize the IndexedDB cache database
 * @returns {Promise<IDBDatabase>} - IndexedDB database instance
 */
const initCacheDB = async () => {
  try {
    return await openDB(CACHE_DB_NAME, CACHE_DB_VERSION, {
      upgrade(db) {
        // Create stores for each cache type
        Object.values(CACHES).forEach(cacheName => {
          if (!db.objectStoreNames.contains(cacheName)) {
            db.createObjectStore(cacheName, { keyPath: 'key' });
          }
        });
      }
    });
  } catch (error) {
    console.error('Failed to initialize cache database:', error);
    return null;
  }
};

/**
 * Generate a cache key based on request parameters
 * @param {Object} params - Request parameters
 * @returns {string} - Cache key
 */
const generateCacheKey = (params) => {
  // Use only essential parts of the request to generate key
  const { type, content, model, userId, day, pathId } = params;
  
  // For text extraction
  if (type === 'textExtraction') {
    // Use image hash or first 100 bytes if available
    // For now, use content.slice(0, 100) as a simple hash
    return `${type}:${content.slice(0, 100)}:${model || ''}`;
  }
  
  // For analysis
  if (type === 'analysis') {
    // Custom key based on user, day, path, and content hash
    return `${type}:${userId}:${pathId}:${day}:${typeof content === 'string' ? content.slice(0, 50) : 'img'}:${model || ''}`;
  }
  
  // For completion
  if (type === 'completion') {
    return `${type}:${userId}:${pathId}:${model || ''}`;
  }
  
  // For progress
  if (type === 'progress') {
    return `${type}:${userId}:${model || ''}`;
  }
  
  // Fallback to JSON string
  return `${type}:${JSON.stringify(params).slice(0, 100)}`;
};

/**
 * Check if a cache entry is valid based on its timestamp
 * @param {Object} entry - Cache entry
 * @param {string} cacheType - Cache type
 * @returns {boolean} - Whether the entry is valid
 */
const isCacheValid = (entry, cacheType) => {
  if (!entry || !entry.timestamp) return false;
  
  const now = Date.now();
  const age = now - entry.timestamp;
  
  return age < CACHE_TIMEOUTS[cacheType];
};

/**
 * Get an item from the cache (memory first, then IndexedDB)
 * @param {string} key - Cache key
 * @param {string} cacheType - Cache type
 * @returns {Promise<Object|null>} - Cache entry or null if not found/invalid
 */
const getCacheItem = async (key, cacheType) => {
  // Try memory cache first
  if (memoryCache[cacheType].has(key)) {
    const entry = memoryCache[cacheType].get(key);
    if (isCacheValid(entry, cacheType)) {
      cacheStats.hits++;
      const estimatedTokens = entry.data.length ? Math.ceil(entry.data.length / 4) : 500;
      cacheStats.saved += estimatedTokens;
      console.log(`Cache hit for ${cacheType}:${key.slice(0, 20)}... (saved ~${estimatedTokens} tokens)`);
      return entry.data;
    }
    
    // Remove invalid entry
    memoryCache[cacheType].delete(key);
  }
  
  // Try IndexedDB cache
  try {
    const db = await initCacheDB();
    if (!db) return null;
    
    const entry = await db.get(cacheType, key);
    if (entry && isCacheValid(entry, cacheType)) {
      // Add to memory cache for faster future access
      memoryCache[cacheType].set(key, {
        data: entry.data,
        timestamp: entry.timestamp
      });
      
      cacheStats.hits++;
      const estimatedTokens = entry.data.length ? Math.ceil(entry.data.length / 4) : 500;
      cacheStats.saved += estimatedTokens;
      console.log(`Cache hit from IndexedDB for ${cacheType}:${key.slice(0, 20)}... (saved ~${estimatedTokens} tokens)`);
      return entry.data;
    }
    
    // Remove invalid entry
    if (entry) {
      await db.delete(cacheType, key);
    }
  } catch (error) {
    console.warn('Error accessing IndexedDB cache:', error);
    // Continue without cache
  }
  
  cacheStats.misses++;
  return null;
};

/**
 * Set an item in the cache (both memory and IndexedDB)
 * @param {string} key - Cache key
 * @param {Object} data - Data to cache
 * @param {string} cacheType - Cache type
 * @returns {Promise<void>}
 */
const setCacheItem = async (key, data, cacheType) => {
  const timestamp = Date.now();
  
  // Set in memory cache
  memoryCache[cacheType].set(key, {
    data,
    timestamp
  });
  
  // Limit memory cache size (keep only 20 most recent items)
  if (memoryCache[cacheType].size > 20) {
    const oldestKey = memoryCache[cacheType].keys().next().value;
    memoryCache[cacheType].delete(oldestKey);
  }
  
  // Set in IndexedDB cache
  try {
    const db = await initCacheDB();
    if (db) {
      await db.put(cacheType, {
        key,
        data,
        timestamp
      });
    }
  } catch (error) {
    console.warn('Error writing to IndexedDB cache:', error);
    // Continue without persistent cache
  }
};

/**
 * Clear a specific cache or all caches
 * @param {string|null} cacheType - Cache type to clear or null for all
 * @returns {Promise<void>}
 */
const clearCache = async (cacheType = null) => {
  if (cacheType) {
    // Clear specific cache
    memoryCache[cacheType].clear();
    
    try {
      const db = await initCacheDB();
      if (db) {
        await db.clear(cacheType);
      }
    } catch (error) {
      console.warn(`Error clearing IndexedDB cache ${cacheType}:`, error);
    }
  } else {
    // Clear all caches
    Object.values(CACHES).forEach(cache => {
      memoryCache[cache].clear();
    });
    
    try {
      const db = await initCacheDB();
      if (db) {
        await Promise.all(Object.values(CACHES).map(cache => db.clear(cache)));
      }
    } catch (error) {
      console.warn('Error clearing all IndexedDB caches:', error);
    }
  }
  
  // Reset stats
  cacheStats = {
    hits: 0,
    misses: 0,
    saved: 0
  };
};

/**
 * Optimized text extraction with caching
 * @param {Object} params - Extraction parameters
 * @returns {Promise<Object>} - Extraction result
 */
const cachedTextExtraction = async (params) => {
  const { image, model } = params;
  
  // Create hash from image for cache key
  // For now use a simple substring of base64 as a hash
  const imageHash = typeof image === 'string' ? image.slice(0, 100) : 'imageObject';
  
  // Generate cache key
  const cacheKey = generateCacheKey({
    type: 'textExtraction',
    content: imageHash,
    model
  });
  
  // Check cache
  const cachedResult = await getCacheItem(cacheKey, CACHES.TEXT_EXTRACTION);
  if (cachedResult) {
    console.log('Using cached text extraction result');
    return cachedResult;
  }
  
  // Proceed with API call
  console.log('Performing text extraction API call...');
  
  try {
    // Here we would call the actual Claude API text extraction
    // For this example, we'll use a placeholder function
    
    // This would be implemented in claudeService.js, calling the actual API
    const extractionResult = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: image
                }
              },
              {
                type: 'text',
                text: 'Please extract the text from this journal entry image.'
              }
            ]
          }
        ]
      })
    });
    
    // Process and format the result
    const result = {
      text: extractionResult.content[0].text,
      wordCount: extractionResult.content[0].text.split(/\s+/).length,
      characterCount: extractionResult.content[0].text.length,
      timestamp: Date.now()
    };
    
    // Cache the result
    await setCacheItem(cacheKey, result, CACHES.TEXT_EXTRACTION);
    
    return result;
  } catch (error) {
    console.error('Error in text extraction:', error);
    throw new Error('Failed to extract text: ' + formatApiError(error));
  }
};

/**
 * Optimized journal entry analysis with caching
 * @param {Object} params - Analysis parameters
 * @returns {Promise<Object>} - Analysis result
 */
const cachedJournalAnalysis = async (params) => {
  const { 
    userId, 
    day, 
    pathId, 
    imageUrl, 
    extractedText, 
    prompt, 
    theme, 
    userProfile,
    model
  } = params;
  
  // Generate cache key
  const cacheKey = generateCacheKey({
    type: 'analysis',
    userId,
    day,
    pathId,
    content: extractedText || (imageUrl ? 'image' : ''),
    model
  });
  
  // Check cache
  const cachedResult = await getCacheItem(cacheKey, CACHES.ANALYSIS);
  if (cachedResult) {
    console.log('Using cached analysis result');
    return cachedResult;
  }
  
  // Proceed with API call
  console.log('Performing journal analysis API call...');
  
  try {
    // Here we would call the actual Claude API analysis
    // This would be implemented in claudeService.js
    const analysisResult = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Please analyze this journal entry that responds to the prompt: "${prompt}" under the theme "${theme}".\n\nJournal text:\n${extractedText}`
              }
            ]
          }
        ]
      })
    });
    
    // Process and format the result
    const content = analysisResult.content[0].text;
    
    // Parse response and extract analysis data
    const result = JSON.parse(content);
    
    // Add metadata
    result.prompt = prompt;
    result.theme = theme;
    result.extractedText = extractedText;
    result.pathId = pathId;
    
    // Cache the result
    await setCacheItem(cacheKey, result, CACHES.ANALYSIS);
    
    return result;
  } catch (error) {
    console.error('Error in journal analysis:', error);
    throw new Error('Failed to analyze journal: ' + formatApiError(error));
  }
};

/**
 * Optimized journey completion analysis with caching
 * @param {Object} params - Completion parameters
 * @returns {Promise<Object>} - Completion result
 */
const cachedJourneyCompletion = async (params) => {
  const { userId, pathId, entries, model } = params;
  
  // Generate cache key
  const cacheKey = generateCacheKey({
    type: 'completion',
    userId,
    pathId,
    model
  });
  
  // Check cache
  const cachedResult = await getCacheItem(cacheKey, CACHES.COMPLETION);
  if (cachedResult) {
    console.log('Using cached journey completion result');
    return cachedResult;
  }
  
  // Proceed with API call
  console.log('Performing journey completion API call...');
  
  try {
    // Prepare data from all entries
    const entriesData = entries.map(entry => ({
      day: entry.day,
      prompt: entry.prompt || '',
      theme: entry.theme || '',
      summary: entry.analysis?.summary || '',
      insights: entry.analysis?.insights || []
    }));
    
    // Get path name
    const pathName = pathId === 'emotional-intelligence' ? 'Emotional Intelligence Expedition' :
                     pathId === 'mindfulness-awareness' ? 'Mindfulness & Present Awareness' :
                     'Self-Discovery Journey';
    
    // Call Claude API
    const completionResult = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Please create a comprehensive analysis of my completed 10-day "${pathName}" journaling journey.`
              }
            ]
          }
        ],
        system: `You are an AI journey analysis assistant for the Καιρός app. Your task is to create a comprehensive analysis of the user's completed journaling journey.
        
        Here is the data from their journal entries:
        ${JSON.stringify(entriesData)}
        
        Provide the following in your response as a JSON object:
        1. journeyOverview: A summary of their overall journey (3-4 sentences)
        2. growthNarrative: Identify their progress and development throughout the journey
        3. keyThemes: The major themes that emerged across their entries (3-5 themes)
        4. personalStrengths: Positive attributes you've observed in their writing
        5. growthOpportunities: Areas where they might benefit from further reflection
        6. meaningfulAffirmation: A powerful, personalized affirmation that captures their journey
        7. nextSteps: Suggestions for continuing their journey
        
        ALWAYS use second-person language ("you", "your") throughout the analysis.
        Make the affirmation especially meaningful and personal.`
      })
    });
    
    // Process and format the result
    const content = completionResult.content[0].text;
    const result = JSON.parse(content);
    
    // Cache the result
    await setCacheItem(cacheKey, result, CACHES.COMPLETION);
    
    return result;
  } catch (error) {
    console.error('Error in journey completion:', error);
    throw new Error('Failed to generate journey completion: ' + formatApiError(error));
  }
};

/**
 * Optimized progress report with caching
 * @param {Object} params - Progress parameters
 * @returns {Promise<Object>} - Progress result
 */
const cachedProgressReport = async (params) => {
  const { userId, entries, model } = params;
  
  // Generate cache key
  const cacheKey = generateCacheKey({
    type: 'progress',
    userId,
    model
  });
  
  // Check cache
  const cachedResult = await getCacheItem(cacheKey, CACHES.PROGRESS);
  if (cachedResult) {
    console.log('Using cached progress report result');
    return cachedResult;
  }
  
  // For small number of entries, generate a basic report without API call
  if (entries.length < 3) {
    const basicReport = {
      completionRate: Math.round((entries.length / 10) * 100),
      totalEntries: entries.length,
      commonThemes: extractCommonWords(entries, 3),
      growthAreas: ["Continue building your journaling habit for deeper insights"],
      recommendation: "Try journaling consistently for at least 5 minutes each day to establish a reflective practice."
    };
    
    // Cache the result
    await setCacheItem(cacheKey, basicReport, CACHES.PROGRESS);
    
    return basicReport;
  }
  
  // Proceed with API call for more entries
  console.log('Performing progress report API call...');
  
  try {
    // Prepare content for analysis
    const entriesContent = entries.map(entry => ({
      day: entry.day,
      pathId: entry.pathId || 'self-discovery',
      summary: entry.analysis?.summary || '',
      insights: entry.analysis?.insights || [],
      theme: entry.theme || ''
    }));
    
    // Call Claude API
    const progressResult = await callClaudeApi({
      method: 'POST',
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: "Please generate a progress report based on my journal entries."
              }
            ]
          }
        ],
        system: `You are an AI journal analysis assistant. Generate a holistic progress report based on the user's journal entries.
        
        Here are the entries (summaries and insights):
        ${JSON.stringify(entriesContent)}
        
        Provide the following in your response as a JSON object:
        - completionRate (percentage of 10-day journey completed)
        - totalEntries (number of entries)
        - commonThemes (array of strings, limit 5)
        - growthAreas (array of strings, limit 4)
        - recommendation (a string with personalized advice)`
      })
    });
    
    // Process and format the result
    const content = progressResult.content[0].text;
    const result = JSON.parse(content);
    
    // Cache the result
    await setCacheItem(cacheKey, result, CACHES.PROGRESS);
    
    return result;
  } catch (error) {
    console.error('Error in progress report:', error);
    
    // Return a basic report on error
    const fallbackReport = {
      completionRate: Math.round((entries.length / 10) * 100),
      totalEntries: entries.length,
      commonThemes: extractCommonWords(entries, 3),
      growthAreas: ["Continue your journaling practice"],
      recommendation: "We encountered an issue analyzing your entries. Please try again later."
    };
    
    return fallbackReport;
  }
};

/**
 * Extract common words from journal entries
 * @param {Array} entries - Array of journal entries
 * @param {number} limit - Maximum number of themes to extract
 * @returns {Array} - Array of common themes
 */
function extractCommonWords(entries, limit = 5) {
  const stopWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'for', 'with', 
                     'on', 'at', 'from', 'by', 'an', 'this', 'that', 'it', 'each'];
  
  const wordCount = {};
  
  // Process each entry
  entries.forEach(entry => {
    // Get text from all available sources
    const text = [
      entry.extractedText || '',
      entry.analysis?.summary || '',
      ...(entry.analysis?.insights || [])
    ].join(' ').toLowerCase();
    
    // Split into words and count frequencies
    const words = text
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(/\s+/);
    
    words.forEach(word => {
      // Skip short words and stop words
      if (word.length <= 3 || stopWords.includes(word)) return;
      
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
  });
  
  // Sort by frequency and return top themes
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

/**
 * Get cache statistics
 * @returns {Object} - Cache statistics
 */
const getCacheStats = () => {
  return {
    ...cacheStats,
    memoryCacheSizes: {
      textExtraction: memoryCache[CACHES.TEXT_EXTRACTION].size,
      analysis: memoryCache[CACHES.ANALYSIS].size,
      completion: memoryCache[CACHES.COMPLETION].size,
      progress: memoryCache[CACHES.PROGRESS].size
    }
  };
};

/**
 * Prefetch analysis for the next day
 * @param {Object} params - Analysis parameters for the next day
 * @returns {Promise<void>}
 */
const prefetchNextDayAnalysis = async (params) => {
  const { userId, day, pathId, theme, prompt } = params;
  
  // Only prefetch if we have necessary data
  if (!userId || !day || !pathId || !theme || !prompt) {
    return;
  }
  
  // Check if we already have this in cache
  const nextDay = day + 1;
  if (nextDay > 10) return; // Don't prefetch beyond journey end
  
  // Generate cache key for the next day
  const cacheKey = generateCacheKey({
    type: 'analysis',
    userId,
    day: nextDay,
    pathId,
    content: 'prefetch'
  });
  
  // Check if already in cache
  const cachedResult = await getCacheItem(cacheKey, CACHES.ANALYSIS);
  if (cachedResult) {
    console.log(`Next day (${nextDay}) analysis already in cache`);
    return;
  }
  
  // Prefetch in background without waiting
  setTimeout(async () => {
    try {
      console.log(`Prefetching analysis for day ${nextDay}`);
      
      // Generate a placeholder/general analysis
      const prefetchedAnalysis = {
        summary: "Your day's reflection shows thoughtful engagement with the prompt.",
        insights: [
          "You're developing self-awareness through consistent journaling.",
          "Your writing reveals a willingness to explore challenging topics.",
          "You're building a valuable habit of reflection."
        ],
        reflectionQuestion: `How has your perspective on ${theme.toLowerCase()} evolved since you began this journey?`,
        affirmation: "Your commitment to self-reflection is creating meaningful change in your life.",
        practicalAction: "Consider revisiting earlier entries to notice patterns in your thoughts and feelings.",
        prompt,
        theme,
        pathId,
        prefetched: true
      };
      
      // Cache this generic analysis
      await setCacheItem(cacheKey, prefetchedAnalysis, CACHES.ANALYSIS);
      
      console.log(`Successfully prefetched analysis for day ${nextDay}`);
    } catch (error) {
      console.warn(`Failed to prefetch analysis for day ${nextDay}:`, error);
      // Don't rethrow - this is a background operation
    }
  }, 3000); // Wait 3 seconds before prefetching
};

/**
 * Cache bust based on last API version, regenerate for latest model
 * @param {string} model - New model version
 * @returns {Promise<void>}
 */
const cacheBustForModelVersion = async (model) => {
  if (!model) return;
  
  // Only bust cache for specific caches and if model is better than cached versions
  try {
    const db = await initCacheDB();
    if (!db) return;
    
    // Check cache entries and determine if they were generated with an older model
    const tx = db.transaction([CACHES.ANALYSIS, CACHES.COMPLETION], 'readwrite');
    
    // Get the analysis store
    const analysisStore = tx.objectStore(CACHES.ANALYSIS);
    const completionStore = tx.objectStore(CACHES.COMPLETION);
    
    // Function to check if model version is older
    const isOlderModel = (cacheKey, currentModel) => {
      // Parse model from cache key if available
      const modelMatch = cacheKey.match(/:([^:]+)$/);
      if (!modelMatch) return true; // No model info, assume older
      
      const cachedModel = modelMatch[1];
      
      // If cached model is older Sonnet and current is Opus, bust cache
      if (cachedModel.includes('claude-3-sonnet') && currentModel.includes('claude-3-opus')) {
        return true;
      }
      
      // If cached model is older Haiku and current is Sonnet or Opus, bust cache
      if (cachedModel.includes('claude-3-haiku') && (currentModel.includes('claude-3-sonnet') || currentModel.includes('claude-3-opus'))) {
        return true;
      }
      
      return false;
    };
    
    // Process analysis cache
    const analysisCursor = await analysisStore.openCursor();
    while (analysisCursor) {
      if (isOlderModel(analysisCursor.key, model)) {
        await analysisCursor.delete();
      }
      await analysisCursor.continue();
    }
    
    // Process completion cache
    const completionCursor = await completionStore.openCursor();
    while (completionCursor) {
      if (isOlderModel(completionCursor.key, model)) {
        await completionCursor.delete();
      }
      await completionCursor.continue();
    }
    
    // Commit transaction
    await tx.done;
    
    console.log(`Cache entries for older models cleared`);
  } catch (error) {
    console.warn('Error clearing cache for older models:', error);
  }
};

// Initialize the DB when module is imported
initCacheDB().then(() => {
  console.log('Cache database initialized');
}).catch(error => {
  console.warn('Could not initialize cache database:', error);
});

// Export the API
export default {
  // Main API functions
  extractText: cachedTextExtraction,
  analyzeJournal: cachedJournalAnalysis,
  generateCompletion: cachedJourneyCompletion,
  generateProgress: cachedProgressReport,
  
  // Cache management
  clearCache,
  getCacheStats,
  
  // Optimization helpers
  prefetchNextDayAnalysis,
  cacheBustForModelVersion,
  
  // Cache constants
  CACHES
};