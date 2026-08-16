// src/services/subscriptionService.js - COMPLETE FIXED VERSION FOR WEB APP POPUP BLOCKING

import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';
import { preOpenPopup, openCheckout } from './checkoutLauncher';

// Cache for subscription status
let cachedSubscriptionStatus = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * 🔧 FIXED: Create Stripe checkout session with popup blocker prevention
 * @param {string} userId - User ID
 * @param {Window|null} popupWindow - Pre-opened popup window (optional)
 * @param {'month'|'year'} interval - Billing period. The server falls back to
 *   monthly on anything unrecognised, so an older client cannot break signup.
 * @returns {Promise<{sessionId: string, url: string}>}
 */
export const createCheckoutSession = async (userId, popupWindow = null, interval = 'month') => {
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
    const result = await createSession({ userId, interval });
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
              <div class="error-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></div>
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
  // Web only, and it must happen before the await below or the popup blocker
  // kills it. Returns null on native, where there is no popup to block.
  const popupWindow = preOpenPopup();

  try {
    const createSession = httpsCallable(functions, 'createPathCheckoutSession');
    const result = await createSession({ userId, pathId });
    const url = result.data?.url;
    if (!url) throw new Error('No checkout URL returned');

    // Resolves when the user is done with checkout, however they got there:
    // popup closed on web, in-app browser dismissed on native. The caller
    // refreshes then — the webhook has already granted access server-side, so
    // the app only needs to re-read its own state.
    const finished = openCheckout(url, popupWindow);

    return { ...result.data, finished };
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
Popup Blocked

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
Popup Blocked

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
  if (!activeStatuses.includes(subscription.status)) return false;

  // Expiry used to go unchecked here, and validateSubscriptionData in
  // utils/subscriptionUtils.js — the one place that did compare
  // currentPeriodEnd against the clock — is called by nothing. Journal bundles
  // set autoRenew:false and an end date, then never actually ran out.
  // A missing currentPeriodEnd means no expiry: that is the Legacy grant,
  // which carries Premium for the life of the service.
  const end = subscription.currentPeriodEnd;
  if (!end) return true;

  const endDate = end.toDate ? end.toDate() : new Date(end);
  return endDate > new Date();
};

/**
 * Classify a path for display and filtering:
 *  - 'exclusive' → one-time purchase (path.isExclusive, the €2.99 Kairos
 *                  Moments pack). Genuinely gated: PathSelection routes these
 *                  through PathUnlockModal until purchased.
 *  - 'included'  → everything else. Ships with the app for everyone.
 *
 * There used to be a free/artisan split here — 9 curated paths free, the other
 * 41 marked as requiring a subscription. It was never enforced: nothing called
 * canAccessPath, and PathSelection only ever locked isExclusive paths, so the
 * Artisan crown promised a paywall that did not exist. It also contradicted
 * the pricing page, which says all 50 ship with every journal.
 *
 * The split is gone rather than wired up, because path content costs nothing
 * to serve — the prompts are written and translated once, so serving path 43
 * costs exactly what path 1 costs. What has a real per-use cost is AI
 * analysis, and that is what the free plan meters (FREE_MONTHLY_ANALYSES in
 * functions/index.js). Gate what costs money, not what doesn't.
 *
 * @param {Object} path - A journey path object from JourneyData
 * @returns {'included'|'exclusive'}
 */
export const getPathTier = (path) => {
  if (!path) return 'included';
  return path.isExclusive ? 'exclusive' : 'included';
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
/**
 * Displayed subscription pricing. This said €0.99/month and "All 33+ journey
 * paths" — a price that was never charged and a path count that was never
 * right. It only escaped notice because its one consumer, SubscriptionStatus,
 * is imported by nothing; wiring that component up would have advertised a
 * ninety-nine-cent subscription. Keep in step with the Stripe price.
 */
export const getPricingInfo = () => {
  const monthly = 11.99;
  const yearly = 111.99; // Stripe product prod_SL33owKsKNM6jq

  return {
    monthly: {
      price: monthly,
      currency: 'EUR',
      period: 'month',
      description: 'Kairos Premium',
      features: [
        'Unlimited reflections',
        'All 50 journey paths',
        'Handwriting, voice and visual entries',
        'Unlimited PDF exports',
        'Progress reports and personal insights'
      ]
    },
    yearly: {
      price: yearly,
      currency: 'EUR',
      period: 'year',
      description: 'Kairos Premium, annual',
      // Two months and change off twelve monthly payments. Derived rather
      // than written down so it cannot drift from the prices above.
      savingPercent: Math.round((1 - yearly / (monthly * 12)) * 100),
      monthsFree: Math.round((monthly * 12 - yearly) / monthly)
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
  getPathTier,
  startPathPurchase,
  clearSubscriptionCache,
  formatSubscriptionInfo,
  getPricingInfo,
  activateJournalSubscription
};