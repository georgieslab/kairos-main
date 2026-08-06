// src/utils/apiUtils.js
//
// SECURITY FIX: callClaudeApi no longer uses an API key in the browser.
// It now calls the server-side Firebase Function "callClaude", which holds
// the Anthropic key. The VITE_CLAUDE_API_KEY / VITE_CLAUDE_API_ENDPOINT
// variables are NO LONGER USED and should be deleted from your .env.
//
// The function's input/output contract is unchanged, so claudeService.js
// does not need any edits — it keeps calling callClaudeApi({ method, body })
// and reading data.content[0].text exactly as before.

import { getFunctions, httpsCallable } from 'firebase/functions';

// Define supported models and fallback options
const SUPPORTED_MODELS = {
  DEFAULT: 'claude-sonnet-4-6',
  FALLBACKS: {
    // Old / retired model IDs map to current ones
    'claude-3-haiku-20231023': 'claude-haiku-4-5',
    'claude-3-5-sonnet-20240229': 'claude-sonnet-4-6',
    'claude-3-7-sonnet-20250219': 'claude-sonnet-4-6',
    'claude-opus-4-20250514': 'claude-sonnet-4-6',
    'claude-sonnet-4-20250514': 'claude-sonnet-4-6',
    // Current models pass through unchanged
    'claude-sonnet-4-6': 'claude-sonnet-4-6',
    'claude-haiku-4-5': 'claude-haiku-4-5',
    'claude-haiku-4-5-20251001': 'claude-haiku-4-5-20251001'
  }
};

// Keep track of which models have failed
let failedModels = new Set();

/**
 * Get a compatible model, falling back if necessary
 * @param {string} requestedModel - The model requested by the application
 * @returns {string} - A compatible model to use
 */
const getCompatibleModel = (requestedModel) => {
  // If no model requested or it's already failed, use the default
  if (!requestedModel || failedModels.has(requestedModel)) {
    return SUPPORTED_MODELS.DEFAULT;
  }

  // If the model has a specific fallback, use it
  if (SUPPORTED_MODELS.FALLBACKS[requestedModel]) {
    console.log(`Using model fallback: ${requestedModel} -> ${SUPPORTED_MODELS.FALLBACKS[requestedModel]}`);
    return SUPPORTED_MODELS.FALLBACKS[requestedModel];
  }

  // Otherwise use the requested model
  return requestedModel;
};

/**
 * Mark a model as failed
 * @param {string} model - The model that failed
 */
const markModelAsFailed = (model) => {
  failedModels.add(model);
  console.warn(`Marked model as failed: ${model}`);
};

/**
 * Utility function to handle API calls with retry logic and error handling
 * @param {Function} apiCall - Async function that makes the API call
 * @param {Object} options - Options for retry behavior
 * @returns {Promise<any>} - Response data from the API
 */
export const withRetry = async (apiCall, options = {}) => {
  const {
    retries = 3,
    baseDelay = 1000,
    maxDelay = 5000,
    shouldRetry = () => true
  } = options;

  let lastError;
  let delay = baseDelay;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;

      // Check if we should retry
      if (!shouldRetry(error, attempt)) {
        console.log('Not retrying due to shouldRetry condition');
        throw error;
      }

      // Log the retry attempt
      console.error(`Error: ${error.message}, retrying in ${delay}ms...`);

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));

      // Increase delay for next attempt (with cap)
      delay = Math.min(delay * 1.5, maxDelay);
    }
  }

  // All retries failed
  throw lastError;
};

/**
 * Formats error messages from API responses
 * @param {Error} error - The error object
 * @param {string} fallbackMessage - Fallback message if error doesn't contain details
 * @returns {string} - Formatted error message
 */
export const formatApiError = (error, fallbackMessage = 'An error occurred') => {
  // Check if it's an API response error with details
  if (error.response && error.response.data) {
    const data = error.response.data;

    // Check for Claude-specific error format
    if (data.error && data.error.message) {
      return `API Error: ${data.error.message}`;
    }

    // Generic error with message
    if (data.message) {
      return `API Error: ${data.message}`;
    }
  }

  // Network or other errors
  if (error.message) {
    return `Error: ${error.message}`;
  }

  // Fallback
  return fallbackMessage;
};

/**
 * Safely parse JSON with fallback for invalid JSON
 * @param {string} jsonString - JSON string to parse
 * @param {Object} fallback - Fallback object if parsing fails
 * @returns {Object} - Parsed JSON or fallback object
 */
export const safeJsonParse = (jsonString, fallback = {}) => {
  try {
    // Try to extract a JSON object if the string contains markdown or additional text
    const jsonPattern = /\{[\s\S]*\}/;
    const match = jsonString.match(jsonPattern);

    let jsonToParse = jsonString;
    if (match && match[0]) {
      jsonToParse = match[0];
      console.log('Extracted JSON object from response');
    }

    // Clean any common formatting issues
    jsonToParse = jsonToParse.replace(/```json/g, '').replace(/```/g, '');

    // Parse the JSON
    return JSON.parse(jsonToParse);
  } catch (error) {
    console.error('Error parsing JSON:', error, 'Original string:', jsonString);

    // Create a fallback object with content from the response
    if (jsonString.includes('summary') || jsonString.includes('Summary')) {
      console.log('Using fallback parsing for non-JSON response');

      // Extract sections using regex - this is a simplified version
      const extractSection = (text, sectionName, nextSection = null) => {
        const pattern = new RegExp(`${sectionName}[:\\s]+(.*?)(?:${nextSection || '$'}[:\\s]|$)`, 'is');
        const match = text.match(pattern);
        return match ? match[1].trim() : null;
      };

      // Extract insights as array
      const extractInsights = (text) => {
        const insightsSection = extractSection(text, 'insights', 'reflectionQuestion') ||
                               extractSection(text, 'Insights', 'Reflection');

        if (!insightsSection) return fallback.insights;

        // Look for numbered or bulleted lists
        const insights = [];
        const lines = insightsSection.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.match(/^(\d+[\.\)]\s+|\*\s+|\-\s+)/)) {
            insights.push(trimmed.replace(/^(\d+[\.\)]\s+|\*\s+|\-\s+)/, ''));
          }
        }

        // If we found insights, return them, otherwise default to fallback
        return insights.length > 0 ? insights : fallback.insights;
      };

      return {
        summary: extractSection(jsonString, 'summary', 'insights') ||
                extractSection(jsonString, 'Summary', 'Insights') ||
                fallback.summary,
        insights: extractInsights(jsonString) || fallback.insights,
        reflectionQuestion: extractSection(jsonString, 'reflectionQuestion', 'affirmation') ||
                          extractSection(jsonString, 'Reflection Question', 'Affirmation') ||
                          fallback.reflectionQuestion,
        affirmation: extractSection(jsonString, 'affirmation', 'practicalAction') ||
                    extractSection(jsonString, 'Affirmation', 'Practical Action') ||
                    fallback.affirmation,
        practicalAction: extractSection(jsonString, 'practicalAction') ||
                        extractSection(jsonString, 'Practical Action') ||
                        fallback.practicalAction
      };
    }

    return fallback;
  }
};

/**
 * Extract a section of text between two headings
 * @param {string} text - Text to extract from
 * @param {string} sectionName - Section name to extract (e.g., 'Summary')
 * @param {string|null} nextSectionName - Next section name, or null for end of text
 * @returns {string|null} - Extracted section or null if not found
 */
const extractSection = (text, sectionName, nextSectionName) => {
  try {
    // Look for section header patterns (## Section or **Section** or Section:)
    const patterns = [
      new RegExp(`##\\s*${sectionName}[:\\s]+(.*?)(?:##\\s*${nextSectionName}|$)`, 's'),
      new RegExp(`\\*\\*${sectionName}\\*\\*[:\\s]+(.*?)(?:\\*\\*${nextSectionName}\\*\\*|$)`, 's'),
      new RegExp(`${sectionName}[:\\s]+(.*?)(?:${nextSectionName}[:\\s]|$)`, 's')
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting section:', error);
    return null;
  }
};

/**
 * Extract list items from text (lines starting with - or * or numbers)
 * @param {string} text - Text to extract from
 * @returns {Array<string>|null} - Array of list items or null if not found
 */
const extractListItems = (text) => {
  try {
    // Look for list patterns (- Item or * Item or 1. Item)
    const listPattern = /(?:^|\n)(?:\d+\.|\-|\*)\s*(.+?)(?=\n|$)/g;
    const items = [];
    let match;

    while ((match = listPattern.exec(text)) !== null) {
      if (match[1]) {
        items.push(match[1].trim());
      }
    }

    // If we found items, return them
    if (items.length > 0) {
      return items;
    }

    // If no list items found, try to find "insights" or "key points" section
    // and split it into separate lines
    const insightsSection = extractSection(text, 'Insights', 'Reflection') ||
                           extractSection(text, 'insights', 'reflection') ||
                           extractSection(text, 'Key Points', null) ||
                           extractSection(text, 'key points', null);

    if (insightsSection) {
      return insightsSection
        .split(/\n/)
        .map(line => line.trim())
        .filter(line => line.length > 10) // Filter out very short lines
        .slice(0, 3); // Take up to 3 items
    }

    return null;
  } catch (error) {
    console.error('Error extracting list items:', error);
    return null;
  }
};

/**
 * Wraps the Claude API call. SECURITY FIX: this now calls the server-side
 * Firebase Function "callClaude" instead of calling Anthropic directly from
 * the browser. The API key lives only on the server and is never shipped to
 * the client bundle.
 *
 * The contract is unchanged for callers:
 *   - Input:  { method, body } where body is a JSON string of the Anthropic
 *             request ({ model, messages, max_tokens, system, ... })
 *   - Output: the raw Anthropic response object, e.g. { content: [...], usage }
 *             so existing code can still read data.content[0].text
 *
 * @param {Object} requestOptions - { method, body, headers? } (only body is used)
 * @returns {Promise<Object>} - Raw Anthropic response
 */
/**
 * Last allowance figures seen from the server, for showing "N of 10 left"
 * without an extra round trip. Null for subscribers, who are never metered.
 */
let lastKnownAllowance = null;

export const callClaudeApi = async (requestOptions) => {
  // Parse the request body that claudeService built (it passes a JSON string)
  let requestBody;
  try {
    requestBody = typeof requestOptions.body === 'string'
      ? JSON.parse(requestOptions.body)
      : (requestOptions.body || {});
  } catch (error) {
    console.error('Invalid request body passed to callClaudeApi:', error);
    throw new Error('Invalid request body passed to callClaudeApi');
  }

  // Ensure a model is set. claudeService already uses current model IDs,
  // but this is a safe default in case one is missing.
  requestBody.model = getCompatibleModel(requestBody.model);

  try {
    // Uses the default Firebase app (already initialized by your firebase config)
    // and the default region (us-central1), which matches your other functions.
    const functions = getFunctions();

    // 5-minute client timeout to allow longer analysis/insight generations.
    const callClaude = httpsCallable(functions, 'callClaude', { timeout: 300000 });

    const result = await callClaude(requestBody);

    // httpsCallable returns { data: <function return value> }.
    // Our function returns the raw Anthropic JSON, so result.data has .content.
    // On the free plan it also carries kairosAllowance so the UI can show what
    // is left; it is absent for subscribers.
    if (result.data && result.data.kairosAllowance) {
      lastKnownAllowance = result.data.kairosAllowance;
    }
    return result.data;
  } catch (error) {
    console.error('callClaudeApi (via Cloud Function) error:', error);

    // The free monthly allowance is spent. This is an expected state, not a
    // fault, and it has to survive as something the UI can branch on — by the
    // time formatApiError has turned it into a string it is indistinguishable
    // from a network failure, and the user gets "something went wrong" for a
    // situation that needs a specific explanation and an upgrade route.
    if (error.code === 'functions/resource-exhausted') {
      const details = error.details || {};
      lastKnownAllowance = { used: details.used, limit: details.limit };
      const quotaError = new Error(
        `Free plan allowance reached: ${details.limit ?? ''} analyses this month.`
      );
      quotaError.code = 'free-allowance-exhausted';
      quotaError.used = details.used;
      quotaError.limit = details.limit;
      throw quotaError;
    }

    throw new Error(formatApiError(error, 'Claude request failed'));
  }
};

export const getLastKnownAllowance = () => lastKnownAllowance;

/**
 * Debounce function - limits how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function - ensures a function is called at most once in a specified time period
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;

  return function(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export default {
  withRetry,
  formatApiError,
  safeJsonParse,
  callClaudeApi,
  debounce,
  throttle
};