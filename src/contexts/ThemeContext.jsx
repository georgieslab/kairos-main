// src/contexts/ThemeContext.jsx
<<<<<<< HEAD

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Theme Context
const ThemeContext = createContext();

// Custom hook to use theme context
=======
import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

// Create theme context
const ThemeContext = createContext(null);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [theme, setThemeState] = useState(() => {
    // Try to get theme from localStorage on initial render
    return localStorage.getItem('kairos-theme') || 'dark';
  });
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);

  // Load theme from user profile when user is authenticated
  useEffect(() => {
    const loadThemeFromProfile = async () => {
      if (!currentUser) {
        setIsLoadingTheme(false);
        return;
      }

      try {
        // Get user document from Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          // Check if user has a theme preference in their profile
          if (userData.settings?.theme) {
            // Update state and localStorage if different from current
            const profileTheme = userData.settings.theme;
            if (profileTheme !== theme) {
              setThemeState(profileTheme);
              localStorage.setItem('kairos-theme', profileTheme);
            }
          } else {
            // If no theme in profile, save current theme to profile
            await updateUserThemePreference(theme);
          }
        }
      } catch (error) {
        console.error("Error loading theme from profile:", error);
      } finally {
        setIsLoadingTheme(false);
      }
    };

    loadThemeFromProfile();
  }, [currentUser]);

  // Save theme preference to user profile
  const updateUserThemePreference = async (newTheme) => {
    if (!currentUser) return;

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      
      // Update the theme in user settings
      await updateDoc(userRef, {
        'settings.theme': newTheme,
        'settings.updatedAt': new Date().toISOString()
      });
    } catch (error) {
      console.error("Error saving theme to profile:", error);
    }
  };

  // Apply theme whenever it changes
  useEffect(() => {
    // Apply theme class to root HTML element
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    } else {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    }
    
    // Store theme preference in localStorage for persistence
    localStorage.setItem('kairos-theme', theme);
  }, [theme]);

  // Set theme explicitly with persistence
  const setTheme = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setThemeState(newTheme);
      // Also update user profile
      updateUserThemePreference(newTheme);
    }
  };

  // Toggle theme between light/dark
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(newTheme);
    // Also update user profile
    updateUserThemePreference(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      isDarkMode: theme === 'dark', 
      isLightMode: theme === 'light',
      toggleTheme, 
      setTheme,
      isLoadingTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for accessing theme context
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

<<<<<<< HEAD
// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const initializeTheme = () => {
      try {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('kairos-theme');
        
        if (savedTheme) {
          setIsDarkMode(savedTheme === 'dark');
        } else {
          // Fallback to system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setIsDarkMode(prefersDark);
        }
      } catch (error) {
        console.warn('Error accessing localStorage for theme:', error);
        // Default to dark mode if there's an error
        setIsDarkMode(true);
      }
      
      setIsInitialized(true);
    };

    initializeTheme();
  }, []);

  // Apply theme to document and save to localStorage
  useEffect(() => {
    if (!isInitialized) return;

    try {
      // Apply theme to document
      if (isDarkMode) {
        document.documentElement.classList.remove('light-theme');
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
        document.documentElement.classList.add('light-theme');
      }

      // Update CSS custom property for dynamic theming
      document.documentElement.style.setProperty(
        '--theme-mode',
        isDarkMode ? 'dark' : 'light'
      );

      // Save to localStorage
      localStorage.setItem('kairos-theme', isDarkMode ? 'dark' : 'light');

      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content',
          isDarkMode ? '#0f172a' : '#ffffff' // slate-900 for dark, white for light
        );
      }

      console.log(`🎨 Theme applied: ${isDarkMode ? 'dark' : 'light'} mode`);
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [isDarkMode, isInitialized]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      // Only apply system theme if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('kairos-theme');
      if (!savedTheme) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Set specific theme
  const setTheme = (theme) => {
    if (theme === 'dark' || theme === 'light') {
      setIsDarkMode(theme === 'dark');
    } else {
      console.warn('Invalid theme provided. Use "dark" or "light".');
    }
  };

  // Get current theme as string
  const currentTheme = isDarkMode ? 'dark' : 'light';

  // Check if theme matches system preference
  const isSystemTheme = () => {
    try {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return isDarkMode === systemPrefersDark;
    } catch (error) {
      return false;
    }
  };

  // Reset to system theme
  const resetToSystemTheme = () => {
    try {
      localStorage.removeItem('kairos-theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemPrefersDark);
    } catch (error) {
      console.error('Error resetting to system theme:', error);
    }
  };

  const value = {
    isDarkMode,
    currentTheme,
    isInitialized,
    toggleTheme,
    setTheme,
    isSystemTheme,
    resetToSystemTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

=======
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
export default ThemeContext;