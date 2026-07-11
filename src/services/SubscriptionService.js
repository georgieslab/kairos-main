// src/services/subscriptionService.js - COMPLETE FIXED VERSION FOR WEB APP POPUP BLOCKING

import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

// Cache for subscription status
let cachedSubscriptionStatus = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * 🔧 FIXED: Create Stripe checkout session with popup blocker prevention
 * @param {string} userId - User ID
 * @param {Window|null} popupWindow - Pre-opened popup window (optional)
 * @returns {Promise<{sessionId: string, url: string}>}
 */
export const createCheckoutSession = async (userId, popupWindow = null) => {
  try {
    console.log(`🛒 Creating checkout session for user: ${userId}`);
    
    // Show loading state in popup if provided
    if (popupWindow && !popupWindow.closed) {
      try {
        popupWindow.document.write(`
          <html>
            <head>
              <title>Καιρός - Redirecting to Payment</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  text-align: center;
                }
                .spinner {
                  width: 40px;
                  height: 40px;
                  border: 4px solid rgba(255, 255, 255, 0.3);
                  border-top: 4px solid white;
                  border-radius: 50%;
                  animation: spin 1s linear infinite;
                  margin-bottom: 20px;
                }
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                h2 { margin: 0 0 10px 0; }
                p { margin: 0; opacity: 0.8; }
              </style>
            </head>
            <body>
              <div class="spinner"></div>
              <h2>Setting up your payment...</h2>
              <p>You'll be redirected to Stripe in just a moment</p>
            </body>
          </html>
        `);
        popupWindow.document.close();
      } catch (error) {
        console.warn('Could not write to popup window:', error);
      }
    }
    
    const createSession = httpsCallable(functions, 'createCheckoutSession');
    const result = await createSession({ userId });
    console.log(`✅ Checkout session created:`, result.data);
    
    // Redirect the popup window if provided
    if (popupWindow && !popupWindow.closed && result.data.url) {
      try {
        popupWindow.location.href = result.data.url;
      } catch (error) {
        console.error('Could not redirect popup window:', error);
        // Fallback: try to open in same tab
        window.location.href = result.data.url;
      }
    }
    
    return result.data;
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    
    // Close popup and show error
    if (popupWindow && !popupWindow.closed) {
      try {
        popupWindow.document.write(`
          <html>
            <head>
              <title>Καιρός - Payment Error</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
                  background: #f8f9fa;
                  color: #333;
                  text-align: center;
                  padding: 20px;
                }
                .error-icon {
                  font-size: 48px;
                  margin-bottom: 20px;
                }
                button {
                  background: #007bff;
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 5px;
                  cursor: pointer;
                  margin-top: 20px;
                }
              </style>
            </head>
            <body>
              <div class="error-icon">⚠️</div>
              <h2>Payment Setup Failed</h2>
              <p>We encountered an error setting up your payment.<br>Please try again or contact support.</p>
              <button onclick="window.close()">Close Window</button>
            </body>
          </html>
        `);
        popupWindow.document.close();
      } catch (writeError) {
        console.warn('Could not write error to popup:', writeError);
        popupWindow.close();
      }
    }
    
    throw error;
  }
};

/**
 * 💎 One-time exclusive path purchase (e.g. Kairos Moments, €2.99).
 * Opens the popup synchronously (before the async call) to dodge popup
 * blockers, same trick as startUpgradeProcess below.
 * @param {string} userId - User ID
 * @param {string} pathId - Exclusive path ID, e.g. 'kairos-moments'
 */
export const startPathPurchase = async (userId, pathId) => {
  const popupWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');

  try {
    const createSession = httpsCallable(functions, 'createPathCheckoutSession');
    const result = await createSession({ userId, pathId });
    const url = result.data?.url;
    if (!url) throw new Error('No checkout URL returned');

    if (popupWindow && !popupWindow.closed) {
      popupWindow.location.href = url;
    } else {
      // Popup blocked — same-tab fallback
      window.location.href = url;
    }
    return result.data;
  } catch (error) {
    if (popupWindow && !popupWindow.closed) popupWindow.close();
    console.error('❌ Error starting path purchase:', error);
    throw error;
  }
};

/**
 * 🔧 FIXED: Enhanced upgrade handler with popup blocker prevention for WEB APPS
 * @param {string} userId - User ID
 * @returns {Promise<Window|null>} Popup window reference
 */
export const startUpgradeProcess = async (userId) => {
  // ✅ CRITICAL: Open popup immediately to prevent blocking
  const popupWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
  
  // Check if popup was blocked
  if (!popupWindow || popupWindow.closed || typeof popupWindow.closed === 'undefined') {
    console.warn('❌ Popup was blocked by browser');
    
    // 🌐 WEB APP FALLBACK: Try form submission method
    try {
      console.log('🔄 Trying form submission fallback for web...');
      const result = await createCheckoutSession(userId);
      
      // Create hidden form that opens in new tab
      const form = document.createElement('form');
      form.method = 'GET';
      form.action = result.url;
      form.target = '_blank';
      form.style.display = 'none';
      document.body.appendChild(form);
      
      // Submit form (browsers usually allow this)
      form.submit();
      
      // Clean up
      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
      }, 1000);
      
      console.log('✅ Form submission successful');
      return null;
      
    } catch (formError) {
      console.error('Form fallback failed:', formError);
      
      // Final fallback: same-tab navigation with user confirmation
      const confirmed = confirm(`
🚫 Popup Blocked

Your browser is blocking popups. 

Click OK to open the payment page in the same tab.
(You can return to Καιρός after completing payment)
      `);
      
      if (confirmed) {
        try {
          const result = await createCheckoutSession(userId);
          window.location.href = result.url;
          return null;
        } catch (error) {
          throw new Error('All payment methods failed. Please disable popup blocker and try again.');
        }
      } else {
        throw new Error('Payment cancelled by user.');
      }
    }
  }
  
  // Continue with checkout session creation if popup opened successfully
  try {
    await createCheckoutSession(userId, popupWindow);
    return popupWindow;
  } catch (error) {
    // Close popup on error
    if (popupWindow && !popupWindow.closed) {
      popupWindow.close();
    }
    throw error;
  }
};

/**
 * Get user's subscription status
 * @param {string} userId - User ID
 * @param {boolean} forceRefresh - Force refresh cache
 * @returns {Promise<{status: string, currentPeriodEnd?: Date, paymentFailed?: boolean}>}
 */
export const getSubscriptionStatus = async (userId, forceRefresh = false) => {
  // Return cached result if valid and not forcing refresh
  if (!forceRefresh && cachedSubscriptionStatus && cacheTimestamp) {
    const now = Date.now();
    if (now - cacheTimestamp < CACHE_DURATION) {
      console.log(`📋 Using cached subscription status:`, cachedSubscriptionStatus);
      return cachedSubscriptionStatus;
    }
  }

  try {
    console.log(`🔍 Getting subscription status for user: ${userId}`);
    const getStatus = httpsCallable(functions, 'getSubscriptionStatus');
    const result = await getStatus({ userId });
    console.log(`✅ Subscription status received:`, result.data);
    
    // Cache the result
    cachedSubscriptionStatus = result.data;
    cacheTimestamp = Date.now();
    
    return result.data;
  } catch (error) {
    console.error('❌ Error getting subscription status:', error);
    // Return free status as fallback
    const fallback = { status: 'free' };
    console.log(`🔄 Using fallback status:`, fallback);
    return fallback;
  }
};

/**
 * Cancel user's subscription
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const cancelSubscription = async (userId) => {
  try {
    console.log(`❌ Canceling subscription for user: ${userId}`);
    const cancelSub = httpsCallable(functions, 'cancelSubscription');
    const result = await cancelSub({ userId });
    
    // Clear cache
    cachedSubscriptionStatus = null;
    cacheTimestamp = null;
    
    console.log(`✅ Subscription canceled:`, result.data);
    return result.data;
  } catch (error) {
    console.error('❌ Error canceling subscription:', error);
    throw error;
  }
};

/**
 * 🔧 FIXED: Get customer portal URL with popup handling
 * @param {string} userId - User ID
 * @returns {Promise<{url: string}>}
 */
export const getCustomerPortalUrl = async (userId) => {
  try {
    console.log(`🏪 Getting customer portal URL for user: ${userId}`);
    const getPortalUrl = httpsCallable(functions, 'getCustomerPortalUrl');
    const result = await getPortalUrl({ userId });
    console.log(`✅ Customer portal URL received:`, result.data);
    return result.data;
  } catch (error) {
    console.error('❌ Error getting customer portal URL:', error);
    throw error;
  }
};

/**
 * 🔧 FIXED: Enhanced portal manager with popup prevention for WEB APPS
 * @param {string} userId - User ID
 * @returns {Promise<Window|null>} Popup window reference
 */
export const openCustomerPortal = async (userId) => {
  // ✅ CRITICAL: Open popup immediately
  const popupWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
  
  // Check if popup was blocked
  if (!popupWindow || popupWindow.closed || typeof popupWindow.closed === 'undefined') {
    console.warn('❌ Popup was blocked by browser');
    
    // 🌐 WEB APP FALLBACK: Try form submission method
    try {
      console.log('🔄 Trying form submission fallback for portal...');
      const result = await getCustomerPortalUrl(userId);
      
      // Create hidden form that opens in new tab
      const form = document.createElement('form');
      form.method = 'GET';
      form.action = result.url;
      form.target = '_blank';
      form.style.display = 'none';
      document.body.appendChild(form);
      
      // Submit form (browsers usually allow this)
      form.submit();
      
      // Clean up
      setTimeout(() => {
        if (document.body.contains(form)) {
          document.body.removeChild(form);
        }
      }, 1000);
      
      console.log('✅ Portal form submission successful');
      return null;
      
    } catch (formError) {
      console.error('Portal form fallback failed:', formError);
      
      // Final fallback: same-tab navigation with user confirmation
      const confirmed = confirm(`
🚫 Popup Blocked

Your browser is blocking popups. 

Click OK to open subscription management in the same tab.
(You can return to Καιρός after managing your subscription)
      `);
      
      if (confirmed) {
        try {
          const result = await getCustomerPortalUrl(userId);
          window.location.href = result.url;
          return null;
        } catch (error) {
          throw new Error('All portal access methods failed. Please disable popup blocker and try again.');
        }
      } else {
        throw new Error('Portal access cancelled by user.');
      }
    }
  }
  
  // Show loading state if popup opened successfully
  try {
    popupWindow.document.write(`
      <html>
        <head>
          <title>Καιρός - Managing Subscription</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
            }
            .spinner {
              width: 40px;
              height: 40px;
              border: 4px solid rgba(255, 255, 255, 0.3);
              border-top: 4px solid white;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin-bottom: 20px;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="spinner"></div>
          <h2>Opening subscription manager...</h2>
          <p>Redirecting to Stripe Customer Portal</p>
        </body>
      </html>
    `);
    popupWindow.document.close();
  } catch (error) {
    console.warn('Could not write to popup window:', error);
  }
  
  // Get portal URL and redirect
  try {
    const result = await getCustomerPortalUrl(userId);
    popupWindow.location.href = result.url;
    return popupWindow;
  } catch (error) {
    // Close popup on error
    if (popupWindow && !popupWindow.closed) {
      popupWindow.close();
    }
    throw error;
  }
};

/**
 * Check if user has premium access
 * @param {Object} subscription - Subscription object
 * @returns {boolean}
 */
export const hasArtisanAccess = (subscription) => {
  if (!subscription) return false;
  
  const activeStatuses = ['active', 'trialing'];
  return activeStatuses.includes(subscription.status);
};

/**
 * 🔧 FIXED: Get path access information with CORRECT path IDs matching JourneyData.js
 * @param {string} pathId - Journey path ID
 * @returns {Object} Path access info
 */
export const getPathAccessInfo = (pathId) => {
  // ✅ CORRECTED: Free paths with EXACT IDs from JourneyData.js registry
  const freePaths = [
    // Traditional 10-day journeys
    'self-discovery',
    'gratitude-practice', 
    'shadow-work',              // 🔧 FIXED: was 'shadow-work-exploration'
    'nature-connection',
    'anxiety-alchemy',
    // Visual/artistic 10-day journeys  
    'nature-sketching',         // 🔧 FIXED: was 'nature-sketching-sanctuary'
    'abstract-emotions',
    'mindful-visualization',
    // Additional free paths
    'digital-detox'             // 🔧 FIXED: was 'digital-detox-reflection'
  ];
  
  // All other paths are premium/artisan
  const artisanPaths = [
    // 14+ day journeys
    'transformation-journey',
    'emotional-intelligence', 
    'mindfulness-awareness',
    'creative-expression',
    'habit-formation',
    'life-vision',
    'relationship-mastery',
    'financial-mindfulness',
    'life-values',
    'career-compass',
    'inner-child',
    'dream-decoder',
    'seasonal-rhythms',
    'forgiveness-freedom',
    'transitions-navigator',
    'grief-growth',
    'courage-cultivation',
    'color-psychology',
    'sacred-geometry',
    'visual-storytelling',
    'ink-essence',
    'artistic-soul-expression',
    'holistic-transformation'
  ];
  
  console.log(`🔍 Checking path access for: ${pathId}`);
  
  if (freePaths.includes(pathId)) {
    console.log(`✅ ${pathId} is FREE path`);
    return {
      tier: 'free',
      requiresUpgrade: false
    };
  }
  
  if (artisanPaths.includes(pathId)) {
    console.log(`💎 ${pathId} is ARTISAN path`);
    return {
      tier: 'artisan',
      requiresUpgrade: true
    };
  }
  
  // FIXED: Default to free for unknown paths (safer fallback)
  console.warn(`⚠️  Unknown path ID: ${pathId}, defaulting to free access`);
  return {
    tier: 'free',
    requiresUpgrade: false
  };
};

/**
 * ✅ ENHANCED: Check if specific journey path is accessible to user
 * @param {string} pathId - Journey path ID
 * @param {Object} subscription - User's subscription status
 * @returns {boolean}
 */
export const canAccessPath = (pathId, subscription) => {
  // Get path information first
  const pathInfo = getPathAccessInfo(pathId);
  
  console.log(`🔍 Access check for ${pathId}:`, {
    tier: pathInfo.tier,
    subscription: subscription?.status || 'null/loading'
  });
  
  // ✅ ALWAYS allow free paths regardless of subscription status
  if (pathInfo.tier === 'free') {
    console.log(`✅ ${pathId} is free - access granted`);
    return true;
  }
  
  // For premium paths, check subscription
  if (pathInfo.tier === 'artisan') {
    // Allow access if subscription is loading (fail open temporarily)
    if (!subscription) {
      console.log(`⏳ Subscription loading for premium path ${pathId} - temporarily allow`);
      return false; // Actually, be strict for premium paths
    }
    
    const hasAccess = hasArtisanAccess(subscription);
    console.log(`💎 Premium path ${pathId} access:`, hasAccess);
    return hasAccess;
  }
  
  return false;
};

/**
 * Clear subscription cache
 */
export const clearSubscriptionCache = () => {
  cachedSubscriptionStatus = null;
  cacheTimestamp = null;
};

/**
 * Format subscription status for display
 * @param {Object} subscription - Subscription object
 * @returns {Object} Formatted subscription info
 */
export const formatSubscriptionInfo = (subscription) => {
  if (!subscription || subscription.status === 'free') {
    return {
      displayStatus: 'Free',
      statusColor: 'text-gray-600',
      description: '9 free journeys included'
    };
  }
  
  switch (subscription.status) {
    case 'active':
      return {
        displayStatus: 'Artisan',
        statusColor: 'text-green-600',
        description: 'All journeys included',
        renewalDate: subscription.currentPeriodEnd
      };
      
    case 'trialing':
      return {
        displayStatus: 'Artisan Trial',
        statusColor: 'text-blue-600',
        description: 'Trial active',
        trialEndDate: subscription.currentPeriodEnd
      };
      
    case 'past_due':
      return {
        displayStatus: 'Payment Due',
        statusColor: 'text-orange-600',
        description: 'Please update payment method'
      };
      
    case 'canceled':
      return {
        displayStatus: 'Canceled',
        statusColor: 'text-red-600',
        description: 'Access until period end',
        accessUntil: subscription.currentPeriodEnd
      };
      
    case 'incomplete':
    case 'incomplete_expired':
      return {
        displayStatus: 'Incomplete',
        statusColor: 'text-red-600',
        description: 'Payment required'
      };
      
    default:
      return {
        displayStatus: 'Unknown',
        statusColor: 'text-gray-600',
        description: 'Contact support'
      };
  }
};

/**
 * Activate journal bundle subscription
 * @param {string} userId - User ID
 * @param {string} journalId - Journal ID
 * @param {string} tier - Journal tier (essential, insight, legacy)
 * @returns {Promise<Object>} Activation result
 */
export const activateJournalSubscription = async (userId, journalId, tier) => {
  try {
    console.log(`📔 Activating journal subscription for user: ${userId}, journal: ${journalId}, tier: ${tier}`);
    const activate = httpsCallable(functions, 'activateJournalSubscription');
    const result = await activate({ userId, journalId, tier });
    
    // Clear cache since subscription changed
    clearSubscriptionCache();
    
    console.log(`✅ Journal subscription activated:`, result.data);
    return result.data;
  } catch (error) {
    console.error('❌ Error activating journal subscription:', error);
    throw error;
  }
};

/**
 * Get pricing information
 * @returns {Object} Pricing details
 */
export const getPricingInfo = () => {
  return {
    monthly: {
      price: 0.99,
      currency: 'EUR',
      period: 'month',
      description: 'Artisan Monthly',
      features: [
        'All 33+ journey paths',
        'Advanced AI analysis',
        'Unlimited PDF exports',
        'Premium analytics',
        'Priority support'
      ]
    }
  };
};

export default {
  createCheckoutSession,
  startUpgradeProcess,
  getSubscriptionStatus,
  cancelSubscription,
  getCustomerPortalUrl,
  openCustomerPortal,
  hasArtisanAccess,
  canAccessPath,
  getPathAccessInfo,
  clearSubscriptionCache,
  formatSubscriptionInfo,
  getPricingInfo,
  activateJournalSubscription
};