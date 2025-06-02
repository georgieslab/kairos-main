// src/services/apiCacheService.js

/**
 * Enhanced caching service for API calls with persistence
 * Caches data until invalidated by new journal entries
 * Uses both memory caching and localStorage for persistence
 */

// In-memory cache storage
const memoryCache = {};

// Cache version - increment when cache structure changes
const CACHE_VERSION = 1;

// LocalStorage keys
const CACHE_KEYS_KEY = 'kairos_cache_keys';
const CACHE_VERSION_KEY = 'kairos_cache_version';
const CACHE_PREFIX = 'kairos_cache_';
const LAST_ENTRY_KEY = 'kairos_last_entry_timestamp';

/**
 * Initialize cache - check version and clear if needed
 */
const initializeCache = () => {
  try {
    // Check cache version
    const storedVersion = localStorage.getItem(CACHE_VERSION_KEY);
    
    // If version mismatch or doesn't exist, clear cache
    if (!storedVersion || parseInt(storedVersion) !== CACHE_VERSION) {
      clearAllStorage();
      localStorage.setItem(CACHE_VERSION_KEY, CACHE_VERSION.toString());
    }
    
    // Load cache keys
    const cacheKeys = JSON.parse(localStorage.getItem(CACHE_KEYS_KEY) || '[]');
    
    // Load each cached item into memory
    cacheKeys.forEach(key => {
      try {
        const item = localStorage.getItem(`${CACHE_PREFIX}${key}`);
        if (item) {
          memoryCache[key] = JSON.parse(item);
        }
      } catch (err) {
        console.warn(`Failed to load cached item ${key}:`, err);
      }
    });
    
    console.log(`Initialized cache with ${cacheKeys.length} items`);
  } catch (err) {
    console.error("Error initializing cache:", err);
    // Reset cache on error
    clearAllStorage();
  }
};

/**
 * Generates a cache key from request parameters
 * @param {string} endpoint - API endpoint or identifier
 * @param {Object} params - Request parameters
 * @returns {string} - Cache key
 */
const generateCacheKey = (endpoint, params = {}) => {
  return `${endpoint}_${JSON.stringify(params)}`;
};

/**
 * Gets data from cache if available and not expired
 * @param {string} key - Cache key
 * @returns {any|null} - Cached data or null if not found/expired
 */
const getFromCache = (key) => {
  // Try memory cache first
  const memoryCacheItem = memoryCache[key];
  
  if (memoryCacheItem) {
    // Check expiration
    const now = Date.now();
    const isExpired = memoryCacheItem.ttl > 0 && now - memoryCacheItem.timestamp > memoryCacheItem.ttl;
    
    if (isExpired) {
      // Clean up expired item
      delete memoryCache[key];
      removeFromStorage(key);
      return null;
    }
    
    console.log(`Cache hit (memory) for ${key}`);
    return memoryCacheItem.data;
  }
  
  // Try localStorage
  try {
    const storedItem = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (storedItem) {
      const parsedItem = JSON.parse(storedItem);
      
      // Check expiration
      const now = Date.now();
      const isExpired = parsedItem.ttl > 0 && now - parsedItem.timestamp > parsedItem.ttl;
      
      if (isExpired) {
        // Clean up expired item
        removeFromStorage(key);
        return null;
      }
      
      // Update memory cache
      memoryCache[key] = parsedItem;
      
      console.log(`Cache hit (storage) for ${key}`);
      return parsedItem.data;
    }
  } catch (err) {
    console.warn(`Error reading from localStorage for key ${key}:`, err);
  }
  
  return null;
};

/**
 * Stores data in cache with optional TTL
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in milliseconds, 0 for no expiration
 */
const storeInCache = (key, data, ttl = 0) => { // Default to no expiration
  const cacheItem = {
    data,
    timestamp: Date.now(),
    ttl
  };
  
  // Store in memory cache
  memoryCache[key] = cacheItem;
  
  // Store in localStorage for persistence
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheItem));
    
    // Update cache keys
    const cacheKeys = JSON.parse(localStorage.getItem(CACHE_KEYS_KEY) || '[]');
    if (!cacheKeys.includes(key)) {
      cacheKeys.push(key);
      localStorage.setItem(CACHE_KEYS_KEY, JSON.stringify(cacheKeys));
    }
  } catch (err) {
    console.warn(`Error storing in localStorage for key ${key}:`, err);
  }
};

/**
 * Removes item from localStorage
 * @param {string} key - Cache key to remove
 */
const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    
    // Update cache keys
    const cacheKeys = JSON.parse(localStorage.getItem(CACHE_KEYS_KEY) || '[]');
    const updatedKeys = cacheKeys.filter(k => k !== key);
    localStorage.setItem(CACHE_KEYS_KEY, JSON.stringify(updatedKeys));
  } catch (err) {
    console.warn(`Error removing from localStorage for key ${key}:`, err);
  }
};

/**
 * Invalidates a specific cache entry
 * @param {string} key - Cache key to invalidate
 */
const invalidateCache = (key) => {
  // Remove from memory cache
  if (memoryCache[key]) {
    delete memoryCache[key];
  }
  
  // Remove from localStorage
  removeFromStorage(key);
};

/**
 * Invalidates all cache entries that match a prefix
 * @param {string} prefix - Prefix to match
 */
const invalidateCacheByPrefix = (prefix) => {
  // Get all cache keys
  const cacheKeys = Object.keys(memoryCache).concat(
    JSON.parse(localStorage.getItem(CACHE_KEYS_KEY) || '[]')
  );
  
  // Remove duplicates
  const uniqueKeys = [...new Set(cacheKeys)];
  
  // Invalidate matching keys
  uniqueKeys.forEach(key => {
    if (key.startsWith(prefix)) {
      invalidateCache(key);
    }
  });
};

/**
 * Clears all cache entries
 */
const clearCache = () => {
  // Clear memory cache
  Object.keys(memoryCache).forEach(key => {
    delete memoryCache[key];
  });
  
  // Clear localStorage
  clearAllStorage();
};

/**
 * Clears all cache items from localStorage
 */
const clearAllStorage = () => {
  try {
    // Get all cache keys
    const cacheKeys = JSON.parse(localStorage.getItem(CACHE_KEYS_KEY) || '[]');
    
    // Remove each item
    cacheKeys.forEach(key => {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    });
    
    // Clear cache keys
    localStorage.removeItem(CACHE_KEYS_KEY);
    
    console.log('Cache storage cleared');
  } catch (err) {
    console.error("Error clearing cache storage:", err);
  }
};

/**
 * Record a new journal entry to invalidate analytics caches
 * @param {string} userId - User ID
 * @param {string} pathId - Path ID
 * @param {number} day - Day number
 */
const recordNewJournalEntry = (userId, pathId, day) => {
  // Store last entry timestamp
  try {
    const entryData = {
      timestamp: Date.now(),
      userId,
      pathId,
      day
    };
    
    localStorage.setItem(LAST_ENTRY_KEY, JSON.stringify(entryData));
    
    // Invalidate analytics cache
    invalidateCacheByPrefix(`analytics_${userId}`);
    
    console.log('Recorded new journal entry, analytics cache invalidated');
  } catch (err) {
    console.warn('Error recording journal entry:', err);
  }
};

/**
 * Check if analytics data should be refreshed based on new entries
 * @param {string} userId - User ID
 * @returns {boolean} - Whether analytics should be refreshed
 */
const shouldRefreshAnalytics = (userId) => {
  try {
    // Get the last entry timestamp
    const lastEntryStr = localStorage.getItem(LAST_ENTRY_KEY);
    if (!lastEntryStr) {
      console.log('No last entry timestamp found, initializing now');
      // If no last entry timestamp exists, create one with current time
      // This prevents refreshing on first load after initialization
      localStorage.setItem(LAST_ENTRY_KEY, JSON.stringify({
        timestamp: Date.now(),
        userId
      }));
      return false; // No need to refresh on first run
    }
    
    const lastEntryData = JSON.parse(lastEntryStr);
    
    // Get the last analytics timestamp for this user
    const analyticsKey = `last_analytics_${userId}`;
    const analyticsStr = localStorage.getItem(analyticsKey);
    
    // If no analytics timestamp, we should refresh
    if (!analyticsStr) {
      console.log('No analytics timestamp, should refresh');
      return true;
    }
    
    const lastAnalyticsData = JSON.parse(analyticsStr);
    
    // Refresh if new entry is after last analytics view
    const shouldRefresh = lastEntryData.timestamp > lastAnalyticsData.timestamp;
    console.log(`Last entry: ${new Date(lastEntryData.timestamp).toLocaleString()}`);
    console.log(`Last analytics view: ${new Date(lastAnalyticsData.timestamp).toLocaleString()}`);
    console.log(`Should refresh: ${shouldRefresh}`);
    
    return shouldRefresh;
  } catch (err) {
    console.warn('Error checking analytics refresh:', err);
    return false; // Don't refresh on error, use cache instead
  }
};

/**
 * Record analytics view timestamp
 * @param {string} userId - User ID
 */
const recordAnalyticsView = (userId) => {
  try {
    const analyticsKey = `last_analytics_${userId}`;
    const timestamp = Date.now();
    localStorage.setItem(analyticsKey, JSON.stringify({
      timestamp,
      userId
    }));
    console.log(`Recorded analytics view at ${new Date(timestamp).toLocaleString()}`);
  } catch (err) {
    console.warn('Error recording analytics view:', err);
  }
};

/**
 * Wraps an async function with caching
 * @param {Function} fn - Async function to cache
 * @param {string} cacheKey - Cache key
 * @param {number} ttl - Time to live in milliseconds, 0 for no expiration
 * @returns {Promise<any>} - Function result, from cache if available
 */
const withCache = async (fn, cacheKey, ttl = 0) => {
  // Try to get from cache first
  const cachedData = getFromCache(cacheKey);
  
  if (cachedData) {
    console.log(`Using cached data for ${cacheKey}`);
    return cachedData;
  }
  
  // Not in cache or expired, call the function
  console.log(`Cache miss for ${cacheKey}, calling function`);
  const data = await fn();
  
  // Store the result in cache
  storeInCache(cacheKey, data, ttl);
  
  return data;
};

/**
 * Gets cache stats for debugging
 * @returns {Object} - Cache statistics
 */
const getCacheStats = () => {
  // Memory cache stats
  const memoryCacheSize = Object.keys(memoryCache).length;
  const memoryCacheKeys = Object.keys(memoryCache);
  const memoryCacheBytes = JSON.stringify(memoryCache).length;
  
  // Storage cache stats
  let storageCacheKeys = [];
  try {
    storageCacheKeys = JSON.parse(localStorage.getItem(CACHE_KEYS_KEY) || '[]');
  } catch (err) {
    console.warn('Error getting storage cache keys:', err);
  }
  
  return {
    memory: {
      size: memoryCacheSize,
      keys: memoryCacheKeys,
      bytes: memoryCacheBytes,
      readableSize: `${(memoryCacheBytes / 1024).toFixed(2)} KB`
    },
    storage: {
      size: storageCacheKeys.length,
      keys: storageCacheKeys
    },
    version: CACHE_VERSION
  };
};

// Initialize cache when the service is imported
initializeCache();

export default {
  generateCacheKey,
  getFromCache,
  storeInCache,
  invalidateCache,
  invalidateCacheByPrefix,
  clearCache,
  withCache,
  getCacheStats,
  recordNewJournalEntry,
  shouldRefreshAnalytics,
  recordAnalyticsView
};