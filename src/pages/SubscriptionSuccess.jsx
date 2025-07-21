// src/pages/SubscriptionSuccess.jsx

import React, { useState, useEffect } from 'react';
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
          throw new Error('No session ID found');
        }
        
        if (!currentUser) {
          throw new Error('No user logged in');
        }
        
        // Process the subscription
        const result = await handleSubscriptionSuccess(sessionId);
        
        // Refresh user profile to get updated subscription status
        await refreshUserProfile();
        
        setSubscription(result);
      } catch (error) {
        console.error('Error processing subscription:', error);
        setError(error.message || 'An error occurred while processing your subscription');
      } finally {
        setIsLoading(false);
      }
    };
    
    processSubscription();
  }, [currentUser, refreshUserProfile]);
  
  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
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
          <h2>Processing Your Subscription</h2>
          <p>Please wait while we confirm your payment...</p>
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
          <h2>Something Went Wrong</h2>
          <p>{error}</p>
          <button 
            className="try-again-button"
            onClick={() => navigateToScreen('path-selection')}
          >
            Return to Journeys
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
        
        <h2>Thank You for Your Subscription!</h2>
        
        <p className="success-message">
          Your subscription to Καιρός Premium is now active. You have access to all premium
          journeys and features.
        </p>
        
        <div className="subscription-details-card">
          <div className="detail-item">
            <span className="detail-label">Subscription Plan:</span>
            <span className="detail-value">{subscription?.plan || 'Premium'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Status:</span>
            <span className="detail-value status-active">Active</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Start Date:</span>
            <span className="detail-value">{formatDate(subscription?.startDate || new Date())}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Next Billing Date:</span>
            <span className="detail-value">{formatDate(subscription?.renewalDate || new Date())}</span>
          </div>
        </div>
        
        <div className="success-actions">
          <button 
            className="primary-button"
            onClick={() => navigateToScreen('path-selection')}
          >
            Explore Premium Journeys
            <ArrowRight className="button-icon" />
          </button>
          
          <button 
            className="secondary-button"
            onClick={() => navigateToScreen('account-settings')}
          >
            Manage Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;