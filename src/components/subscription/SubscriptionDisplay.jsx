// src/components/subscription/SubscriptionDisplay.jsx - Centralized Component

import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  X, 
  ExternalLink,
  User,
  Zap,
  Shield,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getSubscriptionStatus, 
  formatSubscriptionInfo, 
  getCustomerPortalUrl,
  hasArtisanAccess,
  createCheckoutSession
} from '../../services/subscriptionService';

/**
 * Centralized Subscription Display Component
 * Modes: 'card' | 'badge' | 'compact' | 'header'
 */
const SubscriptionDisplay = ({ 
  mode = 'card',
  showActions = true,
  showBenefits = true,
  onUpgrade,
  className = '',
  size = 'default'
}) => {
  const { currentUser } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingUpgrade, setProcessingUpgrade] = useState(false);
  const [processingPortal, setProcessingPortal] = useState(false);

  // Load subscription status
  useEffect(() => {
    if (currentUser) {
      loadSubscriptionStatus();
    }
  }, [currentUser]);

  const loadSubscriptionStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading subscription status for profile...');
      
      const status = await getSubscriptionStatus(currentUser.uid, true); // Force refresh
      console.log('✅ Subscription status loaded:', status);
      
      setSubscription(status);
    } catch (err) {
      console.error('❌ Error loading subscription:', err);
      setError(err.message);
      // Set fallback free subscription
      setSubscription({ status: 'free' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (onUpgrade) {
      onUpgrade();
      return;
    }

    try {
      setProcessingUpgrade(true);
      console.log('🚀 Starting upgrade process...');
      const { url } = await createCheckoutSession(currentUser.uid);
      window.open(url, '_blank');
    } catch (err) {
      console.error('❌ Error creating checkout session:', err);
      alert('Error starting upgrade process. Please try again.');
    } finally {
      setProcessingUpgrade(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setProcessingPortal(true);
      console.log('🏪 Opening customer portal...');
      const { url } = await getCustomerPortalUrl(currentUser.uid);
      window.open(url, '_blank');
    } catch (err) {
      console.error('❌ Error opening customer portal:', err);
      alert('Error opening subscription management. Please try again.');
    } finally {
      setProcessingPortal(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`subscription-display loading ${mode} ${className}`}>
        {mode === 'badge' ? (
          <div className="subscription-badge loading">
            <div className="loading-spinner-small"></div>
            <span>Loading...</span>
          </div>
        ) : (
          <div className="subscription-loading-card">
            <div className="loading-skeleton-header"></div>
            <div className="loading-skeleton-content"></div>
          </div>
        )}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`subscription-display error ${mode} ${className}`}>
        <div className="subscription-error">
          <AlertCircle size={20} />
          <span>Unable to load subscription status</span>
          <button onClick={loadSubscriptionStatus} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const subscriptionInfo = formatSubscriptionInfo(subscription);
  const isArtisan = hasArtisanAccess(subscription);

  console.log('🎨 Rendering subscription display:', {
    mode,
    isArtisan,
    subscription: subscription?.status,
    displayStatus: subscriptionInfo?.displayStatus
  });

  // Badge Mode - Simple status indicator
  if (mode === 'badge') {
    return (
      <div className={`subscription-badge ${isArtisan ? 'artisan' : 'free'} ${size} ${className}`}>
        {isArtisan ? <Crown size={14} /> : <User size={14} />}
        <span>{isArtisan ? 'Artisan' : 'Free'}</span>
      </div>
    );
  }

  // Header Mode - For navigation/header use
  if (mode === 'header') {
    return (
      <div className={`subscription-header ${isArtisan ? 'artisan' : 'free'} ${className}`}>
        <div className="header-badge">
          {isArtisan ? <Crown size={16} /> : <User size={16} />}
          <span>{isArtisan ? 'Artisan' : 'Free'}</span>
        </div>
      </div>
    );
  }

  // Compact Mode - One line summary
  if (mode === 'compact') {
    return (
      <div className={`subscription-compact ${isArtisan ? 'artisan' : 'free'} ${className}`}>
        <div className="compact-info">
          <div className="compact-icon">
            {isArtisan ? <Crown size={18} /> : <User size={18} />}
          </div>
          <div className="compact-details">
            <span className="compact-status">{subscriptionInfo.displayStatus}</span>
            <span className="compact-description">{subscriptionInfo.description}</span>
          </div>
        </div>
        
        {showActions && (
          <div className="compact-actions">
            {!isArtisan ? (
              <button 
                className="compact-upgrade-btn"
                onClick={handleUpgrade}
                disabled={processingUpgrade}
              >
                {processingUpgrade ? <Zap className="spin" size={14} /> : <Crown size={14} />}
                Upgrade
              </button>
            ) : (
              <button 
                className="compact-manage-btn"
                onClick={handleManageSubscription}
                disabled={processingPortal}
              >
                {processingPortal ? <Zap className="spin" size={14} /> : <CreditCard size={14} />}
                Manage
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Card Mode - Full detailed display (default)
  return (
    <div className={`subscription-display-card ${isArtisan ? 'artisan' : 'free'} ${className}`}>
      {/* Header */}
      <div className="card-header">
        <div className="header-icon">
          {isArtisan ? <Crown size={20} /> : <Shield size={20} />}
        </div>
        <div className="header-content">
          <h3 className="card-title">
            {subscriptionInfo.displayStatus || 'Free Plan'}
          </h3>
          {!isArtisan && showActions && (
            <button 
              className="upgrade-button-small"
              onClick={handleUpgrade}
              disabled={processingUpgrade}
            >
              <Crown size={16} />
              {processingUpgrade ? 'Processing...' : 'Upgrade'}
            </button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="card-content">
        <p className="subscription-description">
          {subscriptionInfo.description || 'Free journeys included'}
        </p>
        
        {/* Benefits */}
        {showBenefits && (
          <div className="subscription-benefits">
            <div className="benefit-item">
              <CheckCircle size={16} className={isArtisan ? 'text-green-500' : 'text-gray-400'} />
              <span className={isArtisan ? '' : 'text-gray-500'}>
                {isArtisan ? 'All 33+ Journey Paths' : '9 Free Journey Paths (10 days)'}
              </span>
            </div>
            <div className="benefit-item">
              <CheckCircle size={16} className={isArtisan ? 'text-green-500' : 'text-gray-400'} />
              <span className={isArtisan ? '' : 'text-gray-500'}>
                {isArtisan ? 'Advanced AI Analysis' : 'Basic AI Analysis'}
              </span>
            </div>
            <div className="benefit-item">
              <CheckCircle size={16} className={isArtisan ? 'text-green-500' : 'text-gray-400'} />
              <span className={isArtisan ? '' : 'text-gray-500'}>
                {isArtisan ? 'Unlimited PDF Exports' : 'Limited PDF Exports'}
              </span>
            </div>
            {isArtisan && (
              <>
                <div className="benefit-item">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Premium Analytics Dashboard</span>
                </div>
                <div className="benefit-item">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Priority Support</span>
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Renewal Information */}
        {subscriptionInfo.renewalDate && (
          <div className="renewal-info">
            <Calendar size={16} />
            <span>
              Renews {new Date(subscriptionInfo.renewalDate.seconds * 1000).toLocaleDateString()}
            </span>
          </div>
        )}
        
        {/* Action Buttons */}
        {showActions && isArtisan && (
          <button 
            className="manage-subscription-button"
            onClick={handleManageSubscription}
            disabled={processingPortal}
          >
            <CreditCard size={16} />
            {processingPortal ? 'Opening...' : 'Manage Subscription'}
            <ExternalLink size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

// Quick access components for different use cases
export const SubscriptionBadge = (props) => (
  <SubscriptionDisplay mode="badge" showActions={false} showBenefits={false} {...props} />
);

export const SubscriptionCompact = (props) => (
  <SubscriptionDisplay mode="compact" showBenefits={false} {...props} />
);

export const SubscriptionCard = (props) => (
  <SubscriptionDisplay mode="card" {...props} />
);

export const SubscriptionHeader = (props) => (
  <SubscriptionDisplay mode="header" showActions={false} showBenefits={false} {...props} />
);

export default SubscriptionDisplay;