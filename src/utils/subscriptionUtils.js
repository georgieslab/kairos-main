// src/utils/subscriptionUtils.js

/**
 * Utility functions for subscription management and path access control
 */

// Define which paths are free vs premium based on duration
export const getPathTier = (pathId, pathDuration) => {
  // All 10-day journeys are free
  const freePaths = [
    'self-discovery',
    'gratitude-practice', 
    'shadow-work-exploration',
    'nature-connection',
    'anxiety-alchemy',
    'digital-detox-reflection',
    'nature-sketching-sanctuary',
    'abstract-emotions',
    'mindful-visualization'
  ];
  
  // Explicitly free paths
  if (freePaths.includes(pathId)) {
    return 'free';
  }
  
  // Duration-based logic: 10-day paths are free, longer are premium
  if (pathDuration <= 10) {
    return 'free';
  }
  
  return 'artisan';
};

/**
 * Check if user can access a specific path
 * @param {string} pathId - The journey path ID
 * @param {Object} pathData - The path data object
 * @param {Object} subscription - User's subscription status
 * @returns {boolean} Whether user can access the path
 */
export const canUserAccessPath = (pathId, pathData, subscription) => {
  const tier = getPathTier(pathId, pathData?.duration || 10);
  
  if (tier === 'free') {
    return true;
  }
  
  if (tier === 'artisan') {
    return hasActiveSubscription(subscription);
  }
  
  return false;
};

/**
 * Check if user has an active subscription
 * @param {Object} subscription - User's subscription object
 * @returns {boolean} Whether subscription is active
 */
export const hasActiveSubscription = (subscription) => {
  if (!subscription) return false;
  
  const activeStatuses = ['active', 'trialing'];
  return activeStatuses.includes(subscription.status);
};

/**
 * Get subscription display information
 * @param {Object} subscription - User's subscription object
 * @returns {Object} Display information for subscription
 */
export const getSubscriptionDisplayInfo = (subscription) => {
  if (!subscription || subscription.status === 'free') {
    return {
      tier: 'Free',
      description: '9 free 10-day journeys',
      color: 'gray',
      icon: 'User'
    };
  }
  
  switch (subscription.status) {
    case 'active':
      return {
        tier: 'Artisan',
        description: 'All journeys unlocked',
        color: 'gold',
        icon: 'Crown'
      };
      
    case 'trialing':
      return {
        tier: 'Artisan Trial',
        description: 'Trial period active',
        color: 'blue',
        icon: 'Crown'
      };
      
    case 'past_due':
      return {
        tier: 'Payment Due',
        description: 'Please update payment',
        color: 'orange',
        icon: 'AlertCircle'
      };
      
    case 'canceled':
      return {
        tier: 'Canceled',
        description: 'Access until period end',
        color: 'red',
        icon: 'X'
      };
      
    default:
      return {
        tier: 'Unknown',
        description: 'Contact support',
        color: 'gray',
        icon: 'HelpCircle'
      };
  }
};

/**
 * Calculate subscription benefits based on tier
 * @param {Object} subscription - User's subscription object
 * @returns {Array} Array of benefit objects
 */
export const getSubscriptionBenefits = (subscription) => {
  const isArtisan = hasActiveSubscription(subscription);
  
  const baseBenefits = [
    {
      feature: 'Journey Paths',
      free: '9 Free Paths (10 days each)',
      artisan: '33+ Premium Paths (7-100 days)',
      hasAccess: true
    },
    {
      feature: 'AI Analysis',
      free: 'Basic insights',
      artisan: 'Advanced analysis & patterns',
      hasAccess: true
    },
    {
      feature: 'PDF Exports',
      free: 'Limited exports',
      artisan: 'Unlimited exports',
      hasAccess: true
    }
  ];
  
  const premiumBenefits = [
    {
      feature: 'Analytics Dashboard',
      free: 'Basic analytics',
      artisan: 'Premium analytics & trends',
      hasAccess: isArtisan
    },
    {
      feature: 'Support',
      free: 'Community support',
      artisan: 'Priority email support',
      hasAccess: isArtisan
    },
    {
      feature: 'Journey Length',
      free: 'Up to 10 days',
      artisan: 'Up to 100 days',
      hasAccess: isArtisan
    }
  ];
  
  return [...baseBenefits, ...premiumBenefits];
};

/**
 * Get paths filtered by subscription access
 * @param {Array} allPaths - All available journey paths
 * @param {Object} subscription - User's subscription status
 * @returns {Object} Filtered paths by access level
 */
export const filterPathsByAccess = (allPaths, subscription) => {
  const freePaths = [];
  const premiumPaths = [];
  const accessiblePaths = [];
  const lockedPaths = [];
  
  allPaths.forEach(path => {
    const tier = getPathTier(path.id, path.duration);
    const canAccess = canUserAccessPath(path.id, path, subscription);
    
    if (tier === 'free') {
      freePaths.push(path);
    } else {
      premiumPaths.push(path);
    }
    
    if (canAccess) {
      accessiblePaths.push(path);
    } else {
      lockedPaths.push(path);
    }
  });
  
  return {
    free: freePaths,
    premium: premiumPaths,
    accessible: accessiblePaths,
    locked: lockedPaths
  };
};

/**
 * Generate upgrade prompt message for locked path
 * @param {Object} pathData - The locked path data
 * @param {Object} subscription - User's current subscription
 * @returns {Object} Upgrade prompt information
 */
export const getUpgradePromptInfo = (pathData, subscription) => {
  const pathTier = getPathTier(pathData.id, pathData.duration);
  
  if (pathTier === 'free') {
    return null; // No upgrade needed for free paths
  }
  
  return {
    title: 'Upgrade to Artisan',
    message: `"${pathData.title}" is a premium ${pathData.duration}-day journey that requires an Artisan subscription.`,
    benefits: [
      `Access to all ${pathData.duration}+ day journeys`,
      'Advanced AI analysis and insights',
      'Unlimited PDF exports',
      'Premium analytics dashboard',
      'Priority support'
    ],
    pricing: {
      amount: '€11.99',
      period: 'month',
      note: 'Cancel anytime'
    }
  };
};

/**
 * Track subscription events for analytics
 * @param {string} event - Event name
 * @param {Object} data - Event data
 */
export const trackSubscriptionEvent = (event, data = {}) => {
  // Integration with analytics service
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'subscription',
      ...data
    });
  }
  
  // Log for debugging
  console.log(`Subscription Event: ${event}`, data);
};

/**
 * Validate subscription status from server
 * @param {Object} subscription - Subscription object to validate
 * @returns {boolean} Whether subscription data is valid
 */
export const validateSubscriptionData = (subscription) => {
  if (!subscription) return true; // Free tier is valid
  
  const requiredFields = ['status'];
  const validStatuses = ['active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired'];
  
  // Check required fields
  for (const field of requiredFields) {
    if (!subscription[field]) {
      console.warn(`Subscription missing required field: ${field}`);
      return false;
    }
  }
  
  // Check valid status
  if (!validStatuses.includes(subscription.status)) {
    console.warn(`Invalid subscription status: ${subscription.status}`);
    return false;
  }
  
  // Check expiration for active subscriptions
  if (subscription.currentPeriodEnd && subscription.status === 'active') {
    const expirationDate = new Date(subscription.currentPeriodEnd.seconds * 1000);
    const now = new Date();
    
    if (expirationDate < now) {
      console.warn('Subscription appears to be expired');
      return false;
    }
  }
  
  return true;
};

/**
 * Format subscription date for display
 * @param {Object} timestamp - Firestore timestamp
 * @returns {string} Formatted date string
 */
export const formatSubscriptionDate = (timestamp) => {
  if (!timestamp) return 'Unknown';
  
  const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Calculate subscription metrics for analytics
 * @param {Object} subscription - User's subscription object
 * @param {Date} signupDate - User's signup date
 * @returns {Object} Subscription metrics
 */
export const calculateSubscriptionMetrics = (subscription, signupDate) => {
  const metrics = {
    isSubscriber: hasActiveSubscription(subscription),
    subscriptionAge: 0,
    timeToSubscribe: 0,
    lifetimeValue: 0
  };
  
  if (!subscription || !subscription.status || subscription.status === 'free') {
    return metrics;
  }
  
  const now = new Date();
  
  // Calculate subscription age
  if (subscription.currentPeriodStart) {
    const startDate = new Date(subscription.currentPeriodStart.seconds * 1000);
    metrics.subscriptionAge = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)); // days
  }
  
  // Calculate time to subscribe
  if (signupDate && subscription.currentPeriodStart) {
    const signup = new Date(signupDate);
    const subscribeDate = new Date(subscription.currentPeriodStart.seconds * 1000);
    metrics.timeToSubscribe = Math.floor((subscribeDate - signup) / (1000 * 60 * 60 * 24)); // days
  }
  
  // Estimate lifetime value (simple calculation)
  if (metrics.subscriptionAge > 0) {
    const monthlyValue = 11.99;
    const months = metrics.subscriptionAge / 30;
    metrics.lifetimeValue = Math.round(months * monthlyValue * 100) / 100;
  }
  
  return metrics;
};

export default {
  getPathTier,
  canUserAccessPath,
  hasActiveSubscription,
  getSubscriptionDisplayInfo,
  getSubscriptionBenefits,
  filterPathsByAccess,
  getUpgradePromptInfo,
  trackSubscriptionEvent,
  validateSubscriptionData,
  formatSubscriptionDate,
  calculateSubscriptionMetrics
};