// src/components/subscription/SubscriptionStatus.jsx - Enhanced and Reusable

import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  CreditCard, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  X, 
  ExternalLink,
  Gift,
  Sparkles,
  User,
  Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getSubscriptionStatus, 
  formatSubscriptionInfo, 
  getCustomerPortalUrl,
  hasArtisanAccess,
  createCheckoutSession,
  getPricingInfo
} from '../../services/subscriptionService';

/**
 * Flexible Subscription Status Component
 * Modes: 'card' | 'badge' | 'compact' | 'detailed'
 */
const SubscriptionStatus = ({ 
  mode = 'card', 
  onUpgrade, 
  showActions = true,
  className = '',
  refreshTrigger = null 
}) => {
  const { currentUser } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [managingSubscription, setManagingSubscription] = useState(false);
  const [processingUpgrade, setProcessingUpgrade] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadSubscriptionStatus();
    }
  }, [currentUser, refreshTrigger]);

  const loadSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const status = await getSubscriptionStatus(currentUser.uid, true);
      setSubscription(status);
    } catch (error) {
      console.error('Error loading subscription:', error);
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
      const { url } = await createCheckoutSession(currentUser.uid);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setProcessingUpgrade(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setManagingSubscription(true);
      const { url } = await getCustomerPortalUrl(currentUser.uid);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
    } finally {
      setManagingSubscription(false);
    }
  };

  if (loading) {
    return (
      <div className={`subscription-status loading ${mode} ${className}`}>
        {mode === 'badge' ? (
          <div className="subscription-badge loading">
            <div className="badge-spinner"></div>
            <span>Loading...</span>
          </div>
        ) : (
          <div className="status-skeleton"></div>
        )}
      </div>
    );
  }

  const subscriptionInfo = formatSubscriptionInfo(subscription);
  const isArtisan = hasArtisanAccess(subscription);
  const pricingInfo = getPricingInfo();

  // Badge Mode - Minimal display
  if (mode === 'badge') {
    return (
      <div className={`subscription-badge ${isArtisan ? 'artisan' : 'free'} ${className}`}>
        {isArtisan ? <Crown size={12} /> : <User size={12} />}
        <span>{isArtisan ? 'Artisan' : 'Free'}</span>
      </div>
    );
  }

  // Compact Mode - One line with action
  if (mode === 'compact') {
    return (
      <div className={`subscription-compact ${isArtisan ? 'artisan' : 'free'} ${className}`}>
        <div className="compact-info">
          <div className="compact-icon">
            {isArtisan ? <Crown size={16} /> : <User size={16} />}
          </div>
          <div className="compact-text">
            <span className="compact-title">{subscriptionInfo.displayStatus}</span>
            {subscriptionInfo.renewalDate && (
              <span className="compact-renewal">
                Renews {new Date(subscriptionInfo.renewalDate.seconds * 1000).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="compact-action">
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
                disabled={managingSubscription}
              >
                {managingSubscription ? <Zap className="spin" size={14} /> : <CreditCard size={14} />}
                Manage
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Card Mode - Default full display
  return (
    <div className={`subscription-status ${isArtisan ? 'artisan' : 'free'} ${className}`}>
      <div className="status-header">
        <div className="status-icon">
          {isArtisan ? (
            <Crown className="crown-icon" />
          ) : (
            <CreditCard className="card-icon" />
          )}
        </div>
        <div className="status-info">
          <h3 className={`status-title ${subscriptionInfo.statusColor}`}>
            {subscriptionInfo.displayStatus}
          </h3>
          <p className="status-description">
            {subscriptionInfo.description}
          </p>
        </div>
      </div>

      {/* Benefits Display */}
      {mode === 'detailed' && (
        <div className="status-benefits">
          <h4 className="benefits-title">Your Benefits</h4>
          <ul className="benefits-list">
            {isArtisan ? (
              <>
                <li className="benefit-item">
                  <CheckCircle size={16} />
                  <span>All 33+ journey paths</span>
                </li>
                <li className="benefit-item">
                  <CheckCircle size={16} />
                  <span>Advanced AI analysis</span>
                </li>
                <li className="benefit-item">
                  <CheckCircle size={16} />
                  <span>Unlimited PDF exports</span>
                </li>
                <li className="benefit-item">
                  <CheckCircle size={16} />
                  <span>Premium analytics</span>
                </li>
              </>
            ) : (
              <>
                <li className="benefit-item">
                  <CheckCircle size={16} />
                  <span>9 free journey paths</span>
                </li>
                <li className="benefit-item limited">
                  <X size={16} />
                  <span>Premium paths locked</span>
                </li>
                <li className="benefit-item limited">
                  <X size={16} />
                  <span>Limited exports</span>
                </li>
              </>
            )}
          </ul>
        </div>
      )}

      {/* Renewal/Trial Information */}
      {subscriptionInfo.renewalDate && (
        <div className="renewal-info">
          <Calendar className="calendar-icon" />
          <span>Renews {new Date(subscriptionInfo.renewalDate.seconds * 1000).toLocaleDateString()}</span>
        </div>
      )}

      {subscriptionInfo.trialEndDate && (
        <div className="trial-info">
          <Gift className="alert-icon" />
          <span>Trial ends {new Date(subscriptionInfo.trialEndDate.seconds * 1000).toLocaleDateString()}</span>
        </div>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="status-actions">
          {!isArtisan ? (
            <button 
              className="upgrade-button"
              onClick={handleUpgrade}
              disabled={processingUpgrade}
            >
              {processingUpgrade ? <Zap className="spin" /> : <Crown className="button-icon" />}
              {processingUpgrade ? 'Processing...' : 'Upgrade to Artisan'}
            </button>
          ) : (
            <button 
              className="manage-button"
              onClick={handleManageSubscription}
              disabled={managingSubscription}
            >
              {managingSubscription ? <Zap className="spin" /> : <CreditCard className="button-icon" />}
              {managingSubscription ? 'Opening...' : 'Manage Subscription'}
              <ExternalLink size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Upgrade Prompt Modal Component
 */
export const UpgradePrompt = ({ pathName, onUpgrade, onCancel, isOpen = false }) => {
  const pricingInfo = getPricingInfo();

  if (!isOpen) return null;

  return (
    <div className="upgrade-prompt-overlay">
      <div className="upgrade-prompt">
        <div className="prompt-header">
          <Crown className="crown-icon-large" />
          <h2>Artisan Access Required</h2>
        </div>
        
        <div className="prompt-content">
          <p className="prompt-message">
            <strong>{pathName}</strong> is an Artisan journey that requires an active subscription.
          </p>
          
          <div className="artisan-benefits">
            <h4>Artisan includes:</h4>
            <ul>
              <li>• All 33+ premium journey paths</li>
              <li>• Advanced AI analysis & insights</li>
              <li>• Unlimited PDF exports</li>
              <li>• Extended analytics dashboard</li>
              <li>• Priority support</li>
            </ul>
          </div>
          
          <div className="pricing-info">
            <div className="price">
              <span className="amount">€{pricingInfo.monthly.price}</span>
              <span className="period">/month</span>
            </div>
            <p className="price-note">Cancel anytime</p>
          </div>
        </div>
        
        <div className="prompt-actions">
          <button 
            className="upgrade-button-primary"
            onClick={onUpgrade}
          >
            <Crown className="button-icon" />
            Upgrade to Artisan
          </button>
          <button 
            className="cancel-button"
            onClick={onCancel}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Subscription Plans Comparison Component
 */
export const SubscriptionPlans = ({ onSelectPlan, currentSubscription }) => {
  const isCurrentlyArtisan = hasArtisanAccess(currentSubscription);
  const pricingInfo = getPricingInfo();

  return (
    <div className="subscription-plans">
      <div className="plans-header">
        <h2>Choose Your Καιρός Experience</h2>
        <p>Start with free journeys or unlock your full potential with Artisan</p>
      </div>

      <div className="plans-grid">
        {/* Free Plan */}
        <div className="plan-card free-plan">
          <div className="plan-header">
            <h3>Free</h3>
            <div className="plan-price">
              <span className="amount">€0</span>
              <span className="period">/month</span>
            </div>
          </div>
          
          <ul className="plan-features">
            <li>• 9 guided 10-day journeys</li>
            <li>• Basic AI analysis</li>
            <li>• Standard analytics</li>
            <li>• PDF exports (limited)</li>
            <li>• Community support</li>
          </ul>
          
          <button 
            className="plan-button free-button"
            disabled
          >
            Current Plan
          </button>
        </div>

        {/* Artisan Plan */}
        <div className={`plan-card artisan-plan ${isCurrentlyArtisan ? 'current-plan' : ''}`}>
          <div className="plan-badge">
            <Crown className="badge-icon" />
            Most Popular
          </div>
          
          <div className="plan-header">
            <h3>Artisan</h3>
            <div className="plan-price">
              <span className="amount">€{pricingInfo.monthly.price}</span>
              <span className="period">/month</span>
            </div>
          </div>
          
          <ul className="plan-features">
            <li>• All 33+ journey paths</li>
            <li>• Advanced AI insights</li>
            <li>• Unlimited PDF exports</li>
            <li>• Premium analytics dashboard</li>
            <li>• Longer journeys (14-100 days)</li>
            <li>• Visual journaling paths</li>
            <li>• Priority support</li>
          </ul>
          
          <button 
            className={`plan-button artisan-button ${isCurrentlyArtisan ? 'manage' : 'upgrade'}`}
            onClick={() => onSelectPlan('artisan')}
          >
            <Crown className="button-icon" />
            {isCurrentlyArtisan ? 'Manage Subscription' : 'Upgrade to Artisan'}
          </button>
        </div>
      </div>
      
      <div className="plans-footer">
        <p>✨ All plans include secure cloud sync and cross-device access</p>
        <p>🔒 Cancel anytime with full data export</p>
      </div>
    </div>
  );
};

/**
 * Simple Subscription Badge for Header/Navigation
 */
export const SubscriptionBadge = ({ size = 'default', className = '' }) => {
  return (
    <SubscriptionStatus 
      mode="badge" 
      showActions={false} 
      className={`subscription-badge-${size} ${className}`}
    />
  );
};

/**
 * Compact Subscription Status for Settings
 */
export const CompactSubscriptionStatus = ({ onUpgrade, className = '' }) => {
  return (
    <SubscriptionStatus 
      mode="compact" 
      onUpgrade={onUpgrade}
      className={className}
    />
  );
};

export default SubscriptionStatus;