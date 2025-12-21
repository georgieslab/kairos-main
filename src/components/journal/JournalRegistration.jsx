// src/components/journal/JournalRegistration.jsx
// Καιρός Smart Journal - Journal Registration Component
// Multi-step flow to register physical journals with NFC

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Radio,
  Smartphone,
  Package,
  Crown,
  Gem,
  Star,
  X,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc, updateDoc, arrayUnion, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { activateJournalSubscription } from '../../services/SubscriptionService';
import useNFC from '../../hooks/useNFC';
import './JournalRegistration.css';

/**
 * Journal tiers configuration
 */
const JOURNAL_TIERS = {
  essential: {
    name: 'Essential',
    icon: BookOpen,
    color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    features: [
      '200 pages cream paper',
      'Dark green leatherette cover',
      'Single ribbon bookmark',
      '3 months digital subscription'
    ]
  },
  insight: {
    name: 'Insight',
    icon: Star,
    color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    features: [
      '250 pages premium paper',
      'Genuine leather with gold accents',
      'Dual ribbon bookmarks',
      '6 months digital subscription'
    ]
  },
  legacy: {
    name: 'Legacy',
    icon: Crown,
    color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    features: [
      '300 pages archival paper',
      'Hand-bound leather with embossing',
      'Three silk ribbon bookmarks',
      '12 months digital subscription'
    ]
  }
};

/**
 * Registration steps
 */
const STEPS = {
  WELCOME: 'welcome',
  SELECT_TIER: 'select_tier',
  SCAN_NFC: 'scan_nfc',
  CONFIRM: 'confirm',
  SUCCESS: 'success'
};

function JournalRegistration({ isOpen, onClose, onComplete }) {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const nfc = useNFC();

  // State
  const [currentStep, setCurrentStep] = useState(STEPS.WELCOME);
  const [selectedTier, setSelectedTier] = useState(null);
  const [journalId, setJournalId] = useState(null);
  const [serialNumber, setSerialNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [registeredJournalData, setRegisteredJournalData] = useState(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  /**
   * Reset state when modal opens/closes
   */
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(STEPS.WELCOME);
      setSelectedTier(null);
      setJournalId(null);
      setSerialNumber('');
      setError(null);
      setRegisteredJournalData(null);
    }
  }, [isOpen]);

  /**
   * Clear errors when changing steps
   */
  useEffect(() => {
    setError(null);
  }, [currentStep]);

  /**
   * Handle NFC scan result
   */
  const handleNFCScan = async (scannedData) => {
    try {
      console.log('NFC scanned:', scannedData);
      console.log('📋 Detected tier from chip:', scannedData.tier);
      console.log('📋 Detected journalId from chip:', scannedData.journalId);

      // Check if journal already registered
      if (scannedData.journalId) {
        // Journal has been registered before
        const journalRef = doc(db, 'journals', scannedData.journalId);
        const journalSnap = await getDoc(journalRef);

        if (journalSnap.exists()) {
          const journalData = journalSnap.data();
          
          if (journalData.userId === currentUser.uid) {
            // User is re-registering their own journal
            setError({
              type: 'already_owned',
              message: 'This journal is already registered to your account!'
            });
          } else {
            // Journal belongs to someone else
            setError({
              type: 'already_registered',
              message: 'This journal is already registered to another account. Contact support if this is your journal.'
            });
          }
          return;
        }
      }

      // Generate new journal ID if not present
      const newJournalId = scannedData.journalId || nfc.generateJournalId();
      setJournalId(newJournalId);
      
      // Set serial number if available
      if (scannedData.serialNumber) {
        setSerialNumber(scannedData.serialNumber);
      }

      // Auto-detect tier from chip data if available
      if (scannedData.tier) {
        console.log('✅ Tier detected from chip:', scannedData.tier);
        setSelectedTier(scannedData.tier);
        // Skip tier selection, go directly to confirmation
        setCurrentStep(STEPS.CONFIRM);
      } else {
        console.log('⚠️ No tier found on chip, asking user to select');
        // No tier on chip, need user to select
        setCurrentStep(STEPS.SELECT_TIER);
      }

    } catch (err) {
      console.error('Error handling NFC scan:', err);
      setError({
        type: 'scan_error',
        message: 'Error processing journal. Please try again.'
      });
    }
  };

  /**
   * Handle journal registration
   */
  const handleRegister = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      if (!selectedTier || !journalId) {
        throw new Error('Missing required information');
      }

      // Create journal document in Firestore
      const journalRef = doc(db, 'journals', journalId);
      const journalData = {
        journalId,
        userId: currentUser.uid,
        tier: selectedTier,
        registeredAt: serverTimestamp(),
        lastUsed: serverTimestamp(),
        totalEntries: 0,
        metadata: {
          serialNumber: serialNumber || `KJ2025-${Date.now().toString().slice(-6)}`,
          batchNumber: 'BATCH-2025-01',
          manufactureDate: new Date().toISOString().split('T')[0]
        },
        isActive: true
      };

      await setDoc(journalRef, journalData);

      // Update user profile with journal reference
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        journals: arrayUnion(journalId),
        primaryJournalId: journalId,
        lastNFCScan: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Refresh user profile
      await updateUserProfile({});

      // Activate journal bundle subscription
      console.log('🎁 Activating journal bundle subscription...');
      try {
        const subscriptionResult = await activateJournalSubscription(
          currentUser.uid,
          journalId,
          selectedTier
        );
        console.log('✅ Subscription activated:', subscriptionResult);
        setSubscriptionInfo(subscriptionResult.subscription);
      } catch (subscriptionError) {
        console.error('⚠️ Failed to activate subscription:', subscriptionError);
        // Don't fail registration if subscription activation fails
        // User can contact support
      }

      // Save registered data for success screen
      setRegisteredJournalData(journalData);

      // Go directly to success
      console.log('✅ Registration complete, moving to SUCCESS step');
      setCurrentStep(STEPS.SUCCESS);
      setIsProcessing(false);

      // DON'T call onComplete here - it will close the modal
      // We'll call it in the SUCCESS step instead

    } catch (err) {
      console.error('Error registering journal:', err);
      setError({
        type: 'registration_error',
        message: err.message || 'Failed to register journal. Please try again.'
      });
      setIsProcessing(false);
    }
  };

  /**
   * Handle writing to NFC tag
   */
  /**
   * Get progress percentage and step number
   */
  const getStepInfo = () => {
    // Define the actual flow order (SELECT_TIER might be skipped)
    const allSteps = [STEPS.WELCOME, STEPS.SCAN_NFC, STEPS.SELECT_TIER, STEPS.CONFIRM, STEPS.SUCCESS];
    const currentIndex = allSteps.indexOf(currentStep);
    
    // Calculate actual step number based on whether SELECT_TIER was skipped
    let stepNumber;
    let totalSteps;
    
    if (selectedTier && currentStep !== STEPS.SELECT_TIER) {
      // Tier was auto-detected, 4 steps total (skip SELECT_TIER)
      const flowWithoutTier = [STEPS.WELCOME, STEPS.SCAN_NFC, STEPS.CONFIRM, STEPS.SUCCESS];
      stepNumber = flowWithoutTier.indexOf(currentStep) + 1;
      totalSteps = 4;
    } else {
      // Manual flow, 5 steps total (includes SELECT_TIER)
      const flowWithTier = [STEPS.WELCOME, STEPS.SCAN_NFC, STEPS.SELECT_TIER, STEPS.CONFIRM, STEPS.SUCCESS];
      stepNumber = flowWithTier.indexOf(currentStep) + 1;
      totalSteps = 5;
    }
    
    const progress = (stepNumber / totalSteps) * 100;
    
    return { stepNumber, totalSteps, progress };
  };

  /**
   * Render current step
   */
  const renderStep = () => {
    switch (currentStep) {
      case STEPS.WELCOME:
        return renderWelcomeStep();
      case STEPS.SELECT_TIER:
        return renderSelectTierStep();
      case STEPS.SCAN_NFC:
        return renderScanNFCStep();
      case STEPS.CONFIRM:
        return renderConfirmStep();
      case STEPS.SUCCESS:
        return renderSuccessStep();
      default:
        return null;
    }
  };

  /**
   * Welcome Step
   */
  const renderWelcomeStep = () => (
    <div className="jr-step">
      <div className="jr-header">
        <div className="jr-icon-wrapper">
          <Sparkles className="jr-header-icon" size={32} />
        </div>
        <h2 className="jr-title">Register Your Καιρός Journal</h2>
        <p className="jr-subtitle">
          Connect your physical journal to the digital app for seamless journaling
        </p>
      </div>

      <div className="jr-features">
        <div className="jr-feature">
          <Smartphone className="jr-feature-icon" size={20} />
          <div>
            <h4>NFC Quick Upload</h4>
            <p>Tap your journal to instantly open the camera and capture entries</p>
          </div>
        </div>

        <div className="jr-feature">
          <Package className="jr-feature-icon" size={20} />
          <div>
            <h4>Progress Tracking</h4>
            <p>See your journaling journey, entry counts, and patterns over time</p>
          </div>
        </div>

        <div className="jr-feature">
          <CheckCircle2 className="jr-feature-icon" size={20} />
          <div>
            <h4>AI Analysis</h4>
            <p>Get personalized insights and emotional pattern recognition</p>
          </div>
        </div>
      </div>

      <div className="jr-actions">
        <button
          className="jr-btn jr-btn-secondary"
          onClick={onClose}
        >
          Maybe Later
        </button>
        <button
          className="jr-btn jr-btn-primary"
          onClick={() => setCurrentStep(STEPS.SCAN_NFC)}
        >
          Get Started
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  /**
   * Select Tier Step
   */
  const renderSelectTierStep = () => (
    <div className="jr-step">
      <div className="jr-header">
        <div className="jr-icon-wrapper">
          <Gem className="jr-header-icon" size={28} />
        </div>
        <h2 className="jr-title">Select Your Journal Tier</h2>
        <p className="jr-subtitle">
          Choose the tier that matches your physical journal
        </p>
      </div>

      <div className="jr-tiers">
        {Object.entries(JOURNAL_TIERS).map(([tierId, tier]) => {
          const TierIcon = tier.icon;
          return (
            <div
              key={tierId}
              className={`jr-tier-card ${selectedTier === tierId ? 'selected' : ''}`}
              onClick={() => setSelectedTier(tierId)}
              style={{ '--tier-color': tier.color }}
            >
              <div className="jr-tier-header">
                <div
                  className="jr-tier-icon"
                  style={{ background: tier.color }}
                >
                  <TierIcon size={20} />
                </div>
                <h3 className="jr-tier-name">{tier.name}</h3>
              </div>

              <ul className="jr-tier-features">
                {tier.features.map((feature, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="jr-error">
          <AlertCircle size={16} />
          <span>{error.message}</span>
        </div>
      )}

      <div className="jr-actions">
        <button
          className="jr-btn jr-btn-secondary"
          onClick={() => setCurrentStep(STEPS.SCAN_NFC)}
        >
          <ChevronLeft size={18} />
          Back
        </button>
        <button
          className="jr-btn jr-btn-primary"
          onClick={() => setCurrentStep(STEPS.CONFIRM)}
          disabled={!selectedTier}
        >
          Continue
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  /**
   * Scan NFC Step
   */
  const renderScanNFCStep = () => (
    <div className="jr-step">
      <div className="jr-header">
        <div className="jr-icon-wrapper">
          <Radio className="jr-header-icon" size={28} />
        </div>
        <h2 className="jr-title">Scan Your Journal</h2>
        <p className="jr-subtitle">
          Hold your phone near the NFC chip on your journal cover
        </p>
      </div>

      {nfc.isReading ? (
        <div className="jr-scanning">
          <div className="jr-scanning-animation">
            <Radio size={48} />
          </div>
          <p>Waiting for journal...</p>
          <p className="jr-scanning-hint">Hold your phone steady near the journal cover</p>
        </div>
      ) : (
        <>
          <div className="jr-nfc-instructions">
            <h3>How to scan:</h3>
            <ol>
              <li>Open your journal to the front cover</li>
              <li>Place your phone on the NFC chip area (usually center or top)</li>
              <li>Hold steady for 2-3 seconds</li>
              <li>Wait for the confirmation</li>
            </ol>
          </div>

          {!nfc.isAvailable && (
            <div className="jr-error">
              <AlertCircle size={16} />
              <span>
                NFC not available on this device. You can still register manually.
              </span>
            </div>
          )}

          {nfc.isAvailable && !nfc.isEnabled && (
            <div className="jr-error">
              <AlertCircle size={16} />
              <span>
                NFC is disabled. 
                <button
                  onClick={nfc.openSettings}
                  style={{ textDecoration: 'underline', marginLeft: '4px' }}
                >
                  Enable it in settings
                </button>
              </span>
            </div>
          )}

          {error && error.type !== 'already_owned' && error.type !== 'already_registered' && (
            <div className="jr-error">
              <AlertCircle size={16} />
              <span>{error.message}</span>
            </div>
          )}

          {(error?.type === 'already_owned' || error?.type === 'already_registered') && (
            <div className="jr-error">
              <AlertCircle size={16} />
              <span>{error.message}</span>
            </div>
          )}
        </>
      )}

      <div className="jr-actions">
        <button
          className="jr-btn jr-btn-secondary"
          onClick={() => {
            nfc.stopReading();
            setCurrentStep(STEPS.WELCOME);
          }}
        >
          <ChevronLeft size={18} />
          Back
        </button>
        
        {nfc.isReady && !nfc.isReading && (
          <button
            className="jr-btn jr-btn-primary"
            onClick={async () => {
              setError(null);
              const result = await nfc.readTag({
                alertMessage: 'Hold phone near journal NFC chip'
              });
              if (result.success && result.data) {
                handleNFCScan(result.data);
              }
            }}
          >
            <Radio size={18} />
            Start Scanning
          </button>
        )}

        {nfc.isReading && (
          <button
            className="jr-btn jr-btn-secondary"
            onClick={() => nfc.stopReading()}
          >
            Cancel Scan
          </button>
        )}

        {!nfc.isAvailable && (
          <button
            className="jr-btn jr-btn-primary"
            onClick={() => {
              // Generate journal ID for manual registration
              const newId = nfc.generateJournalId();
              setJournalId(newId);
              setCurrentStep(STEPS.CONFIRM);
            }}
          >
            Register Manually
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );

  /**
   * Confirm Step
   */
  /**
   * Format NFC Step
   */
  /**
   * Confirm Step
   */
  const renderConfirmStep = () => {
    const tierInfo = JOURNAL_TIERS[selectedTier];
    const TierIcon = tierInfo?.icon;

    return (
      <div className="jr-step">
        <div className="jr-header">
          <div
            className="jr-icon-wrapper"
            style={{ background: tierInfo?.color }}
          >
            {TierIcon && <TierIcon className="jr-header-icon" size={28} />}
          </div>
          <h2 className="jr-title">Confirm Registration</h2>
          <p className="jr-subtitle">
            Review your journal details before registering
          </p>
        </div>

        <div className="jr-registration-info">
          <div className="jr-info-item">
            <span>Journal Tier</span>
            <strong>{tierInfo?.name}</strong>
          </div>

          <div className="jr-info-item">
            <span>Journal ID</span>
            <strong style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {journalId}
            </strong>
          </div>

          {serialNumber && (
            <div className="jr-info-item">
              <span>Serial Number</span>
              <strong>{serialNumber}</strong>
            </div>
          )}

          <div className="jr-info-item">
            <span>Owner</span>
            <strong>{userProfile?.displayName || currentUser?.email}</strong>
          </div>
        </div>

        {error && (
          <div className="jr-error">
            <AlertCircle size={16} />
            <span>{error.message}</span>
          </div>
        )}

        <div className="jr-actions">
          <button
            className="jr-btn jr-btn-secondary"
            onClick={() => setCurrentStep(STEPS.SCAN_NFC)}
            disabled={isProcessing}
          >
            <ChevronLeft size={18} />
            Back
          </button>
          <button
            className="jr-btn jr-btn-primary"
            onClick={handleRegister}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Registering...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Register Journal
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  /**
   * Success Step
   */
  const renderSuccessStep = () => {
    const tierInfo = JOURNAL_TIERS[selectedTier];

    return (
      <div className="jr-step">
        <div className="jr-header">
          <div className="jr-icon-wrapper jr-success jr-celebration">
            <CheckCircle2 className="jr-header-icon" size={32} />
          </div>
          <h2 className="jr-title">Journal Registered!</h2>
          <p className="jr-subtitle">
            Your {tierInfo?.name} journal is now connected to your account
          </p>
        </div>

        <div className="jr-registration-success">
          <div className="jr-success-item">
            <strong>Journal Tier</strong>
            <code style={{ 
              background: `linear-gradient(135deg, ${tierInfo?.color}, ${tierInfo?.color}15)`,
              border: `1px solid ${tierInfo?.color}40`
            }}>
              {tierInfo?.name}
            </code>
          </div>

          <div className="jr-success-item">
            <strong>Journal ID</strong>
            <code>{journalId}</code>
          </div>

          {serialNumber && (
            <div className="jr-success-item">
              <strong>Serial Number</strong>
              <code>{serialNumber}</code>
            </div>
          )}

          {subscriptionInfo && (
            <div className="jr-success-item jr-subscription-highlight">
              <strong>🎁 Artisan Subscription Activated!</strong>
              <div className="jr-subscription-details">
                <p>
                  <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  <strong>{subscriptionInfo.months} months</strong> of premium access included
                </p>
                <p className="jr-subscription-end">
                  Valid until: {new Date(subscriptionInfo.currentPeriodEnd).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="jr-completion-info">
          <div className="jr-next-steps">
            <h3>What's Next?</h3>
            <ul>
              <li>Tap your journal to instantly upload entries</li>
              <li>Start your first journey path</li>
              <li>Get personalized AI insights on your writing</li>
              <li>Track your emotional patterns over time</li>
            </ul>
          </div>
        </div>

        <div className="jr-actions">
          <button
            className="jr-btn jr-btn-primary"
            onClick={() => {
              onClose();
              if (onComplete) {
                onComplete(registeredJournalData);
              }
            }}
          >
            <CheckCircle2 size={18} />
            Start Journaling
          </button>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  const { stepNumber, totalSteps, progress } = getStepInfo();

  return (
    <div className="jr-overlay">
      <div className="jr-modal">
        <button className="jr-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="jr-content">
          {renderStep()}
        </div>

        <div className="jr-progress">
          <div className="jr-progress-bar">
            <div
              className="jr-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="jr-progress-text">
            Step {stepNumber} of {totalSteps}
          </p>
        </div>
      </div>
    </div>
  );
}

export default JournalRegistration;