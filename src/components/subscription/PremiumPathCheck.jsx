import React, { useState, useEffect } from 'react';
import { getJourneyPath } from '../../data/JourneyData';
import { useSubscription } from '../../contexts/SubscriptionContext';
import SubscriptionModal from './SubscriptionModal';

// Helper function to check premium path access
const PremiumPathCheck = ({ 
  pathId, 
  onAccessGranted,
  onAccessDenied,
  navigateToScreen,
  children
}) => {
  const { canAccessPremiumPath, loading } = useSubscription();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [path, setPath] = useState(null);

  // Load path data and check access
  useEffect(() => {
    async function checkAccess() {
      if (loading) return;
      
      // Get the path data
      const pathData = getJourneyPath(pathId);
      setPath(pathData);
      
      if (!pathData) {
        console.error(`Path not found: ${pathId}`);
        setIsChecking(false);
        return;
      }
      
      // Check if it's a premium path
      if (pathData.isPremium) {
        console.log(`Checking premium access for path: ${pathId}`);
        const hasAccess = await canAccessPremiumPath(pathId);
        
        if (hasAccess) {
          console.log(`Access granted for premium path: ${pathId}`);
          onAccessGranted && onAccessGranted();
        } else {
          console.log(`Access denied for premium path: ${pathId}`);
          setShowSubscriptionModal(true);
          onAccessDenied && onAccessDenied();
        }
      } else {
        // Not a premium path, grant access
        console.log(`Path is not premium: ${pathId}`);
        onAccessGranted && onAccessGranted();
      }
      
      setIsChecking(false);
    }
    
    checkAccess();
  }, [pathId, loading, canAccessPremiumPath, onAccessGranted, onAccessDenied]);
  
  // Handle when subscription modal is closed
  const handleSubscriptionModalClose = () => {
    setShowSubscriptionModal(false);
    navigateToScreen('path-selection');
  };
  
  // If still checking access, show loading state
  if (isChecking || loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-300">Checking access...</span>
      </div>
    );
  }
  
  return (
    <>
      {children}
      
      {/* Subscription Modal */}
      {showSubscriptionModal && (
        <SubscriptionModal
          navigateToScreen={navigateToScreen}
          pathId={pathId}
          pathName={path?.title || 'Premium Path'}
        />
      )}
    </>
  );
};

export default PremiumPathCheck;