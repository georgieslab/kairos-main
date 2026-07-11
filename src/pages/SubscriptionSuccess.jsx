// src/pages/SubscriptionSuccess.jsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { handleSubscriptionSuccess } from '../services/stripeService';
import {
  CheckCircle,
  ArrowRight,
  Loader,
  AlertTriangle
} from 'lucide-react';
import '../styles/components/subscription.css';

const SubscriptionSuccess = ({ navigateToScreen }) => {
  const { t } = useTranslation('pages');
  const { currentUser, refreshUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscription, setSubscription] = useState(null);
  
  // Get session ID from URL
  const getSessionId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('session_id');
  };
  
  // Process subscription success
  useEffect(() => {
    const processSubscription = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const sessionId = getSessionId();
        
        if (!sessionId) {
          throw new Error(t('subscriptionSuccess.errorNoSessionId', 'No session ID found'));
        }

        if (!currentUser) {
          throw new Error(t('subscriptionSuccess.errorNoUser', 'No user logged in'));
        }

        // Process the subscription
        const result = await handleSubscriptionSuccess(sessionId);

        // Refresh user profile to get updated subscription status
        await refreshUserProfile();

        setSubscription(result);
      } catch (error) {
        console.error('Error processing subscription:', error);
        setError(error.message || t('subscriptionSuccess.errorGeneric', 'An error occurred while processing your subscription'));
      } finally {
        setIsLoading(false);
      }
    };
    
    processSubscription();
  }, [currentUser, refreshUserProfile]);
  
  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return t('subscriptionSuccess.unknownDate', 'Unknown');
    
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="subscription-success-container">
        <div className="success-content loading">
          <Loader className="loading-icon" />
          <h2>{t('subscriptionSuccess.loadingTitle', 'Processing Your Subscription')}</h2>
          <p>{t('subscriptionSuccess.loadingText', 'Please wait while we confirm your payment...')}</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="subscription-success-container">
        <div className="success-content error">
          <AlertTriangle className="error-icon" />
          <h2>{t('subscriptionSuccess.errorTitle', 'Something Went Wrong')}</h2>
          <p>{error}</p>
          <button
            className="try-again-button"
            onClick={() => navigateToScreen('path-selection')}
          >
            {t('subscriptionSuccess.returnToJourneys', 'Return to Journeys')}
          </button>
        </div>
      </div>
    );
  }
  
  // Success state
  return (
    <div className="subscription-success-container">
      <div className="success-content">
        <div className="success-icon-wrapper">
          <CheckCircle className="success-icon" />
        </div>
        
        <h2>{t('subscriptionSuccess.thankYouTitle', 'Thank You for Your Subscription!')}</h2>

        <p className="success-message">
          {t('subscriptionSuccess.thankYouText', 'Your subscription to Καιρός Premium is now active. You have access to all premium journeys and features.')}
        </p>

        <div className="subscription-details-card">
          <div className="detail-item">
            <span className="detail-label">{t('subscriptionSuccess.planLabel', 'Subscription Plan:')}</span>
            <span className="detail-value">{subscription?.plan || t('subscriptionSuccess.planDefault', 'Premium')}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">{t('subscriptionSuccess.statusLabel', 'Status:')}</span>
            <span className="detail-value status-active">{t('subscriptionSuccess.statusActive', 'Active')}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">{t('subscriptionSuccess.startDateLabel', 'Start Date:')}</span>
            <span className="detail-value">{formatDate(subscription?.startDate || new Date())}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">{t('subscriptionSuccess.nextBillingLabel', 'Next Billing Date:')}</span>
            <span className="detail-value">{formatDate(subscription?.renewalDate || new Date())}</span>
          </div>
        </div>

        <div className="success-actions">
          <button
            className="primary-button"
            onClick={() => navigateToScreen('path-selection')}
          >
            {t('subscriptionSuccess.explorePremium', 'Explore Premium Journeys')}
            <ArrowRight className="button-icon" />
          </button>

          <button
            className="secondary-button"
            onClick={() => navigateToScreen('account-settings')}
          >
            {t('subscriptionSuccess.manageSubscription', 'Manage Subscription')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;