
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserPathProgress, PATHS } from '../utils/userProgress';

/**
 * Custom hook to protect routes that require a selected path
 * Redirects to path selection if no path is selected
 */
const usePathProtection = (navigateToScreen, requiredPathId = null) => {
  const { userProfile, currentUser } = useAuth();
  
  useEffect(() => {
    // Skip if user is not authenticated
    if (!currentUser || !userProfile) return;
    
    const checkPathSelection = async () => {
      const paths = [PATHS.SELF_DISCOVERY, PATHS.EMOTIONAL_INTELLIGENCE, PATHS.MINDFULNESS_AWARENESS];
      
      // If a specific path is required, check only that path
      if (requiredPathId) {
        const pathProgress = getUserPathProgress(userProfile, requiredPathId);
        if (!pathProgress?.completedDays?.length) {
          navigateToScreen('path-selection');
        }
        return;
      }
      
      // Check if user has progress in any path
      const hasPathProgress = paths.some(path => {
        const progress = getUserPathProgress(userProfile, path);
        return progress?.completedDays?.length > 0;
      });
      
      // Also check legacy format
      const hasLegacyProgress = userProfile?.journeyProgress?.completedDays?.length > 0;
      
      // If no progress in any path, redirect to path selection
      if (!hasPathProgress && !hasLegacyProgress) {
        navigateToScreen('path-selection');
      }
    };
    
    checkPathSelection();
  }, [userProfile, currentUser, navigateToScreen, requiredPathId]);
};

export default usePathProtection;