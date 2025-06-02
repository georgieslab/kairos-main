// src/contexts/ThemeContext.jsx
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
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;