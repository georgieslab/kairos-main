// src/contexts/NavigationContext.jsx

import React, { createContext, useContext, useEffect } from 'react';
import useNavigationState from '../hooks/useNavigationState';

// Create context
const NavigationContext = createContext(null);

// Hook for using navigation context
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

// Provider component
export const NavigationProvider = ({ children }) => {
  // Use the navigation hook for state management
  const navigationState = useNavigationState();
  
  // Sync with window.appState for legacy components - with improved safety
  useEffect(() => {
    // Safe assignment to window - wrapped in try/catch
    try {
      // Check if window is defined (for SSR safety)
      if (typeof window !== 'undefined') {
        // Create appState object if it doesn't exist
        if (!window.appState) {
          window.appState = {};
        }
        
        // Assign properties individually for safety
        window.appState.currentPath = navigationState.currentPath;
        window.appState.currentDay = navigationState.currentDay;
        
        // Wrap function reference in a safe wrapper function to avoid direct binding
        window.appState.navigateToScreen = (...args) => {
          if (navigationState.navigateToScreen) {
            return navigationState.navigateToScreen(...args);
          } else {
            console.warn('navigateToScreen is not available');
            return null;
          }
        };
        
        window.appState._stale = false;
        
        // Debugging - use less verbose logging
        if (process.env.NODE_ENV !== 'production') {
          console.log('Navigation state synchronized with window.appState');
        }
      }
    } catch (error) {
      console.error('Error updating window.appState:', error);
    }
    
    // Cleanup function
    return () => {
      try {
        if (typeof window !== 'undefined' && window.appState) {
          window.appState._stale = true;
        }
      } catch (error) {
        console.error('Error in NavigationContext cleanup:', error);
      }
    };
  }, [
    navigationState.currentPath, 
    navigationState.currentDay,
    navigationState.navigateToScreen
  ]);
  
  return (
    <NavigationContext.Provider value={navigationState}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContext;