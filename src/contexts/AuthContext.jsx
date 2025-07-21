// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Auth provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  // Enhanced sign up with additional user data
  async function signup(email, password, name, age, gender, city, additionalData = {}) {
=======
  // Sign up with email and password
  async function signup(email, password, name, birthday, city) {
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
<<<<<<< HEAD
      // Create comprehensive user profile in Firestore
      const userProfileData = {
        uid: user.uid,
        email: user.email,
        displayName: name,
        age: age,
        gender: gender,
        city: city,
        
        // New multi-step signup data
        interests: additionalData.interests || [],
        journalingGoals: additionalData.journalingGoals || [],
        preferredTheme: additionalData.preferredTheme || 'dark',
        
        // Profile completion tracking
        hasCompletedOnboarding: true,
        profileCompletionStep: 'complete',
        
        // Journey progress initialization
        journeyProgress: {
          currentPath: 'self-discovery', // Default first journey
          hasStartedJourney: false,
        },
        
        // User preferences and settings
        settings: {
          enableNotifications: true,
          reminderTime: '20:00',
          weatherEnabled: !!city,
          analyticsEnabled: true,
          themePreference: additionalData.preferredTheme || 'dark',
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        
        // Metadata
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        accountStatus: 'active',
        subscriptionTier: 'free',
        
        // Analytics opt-in (can be customized based on user choice)
        analyticsConsent: {
          functionalAnalytics: true,
          performanceAnalytics: true,
          marketingAnalytics: false, // Default to false, user can opt-in later
          consentDate: serverTimestamp()
        }
      };
      
      await setDoc(doc(db, 'users', user.uid), userProfileData);
      
      // CRITICAL: Immediately set the userProfile state to prevent App.jsx redirect
      setUserProfile(userProfileData);
      
      console.log('✅ User account created successfully with enhanced profile data');
      return user;
    } catch (error) {
      console.error('❌ Error during enhanced signup:', error);
=======
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        birthday: birthday,
        city: city, // Store the city information
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        journeyProgress: {
          currentPath: 'self-discovery', // Default first journey
        }
      });
      
      return user;
    } catch (error) {
      console.error('Error during signup:', error);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      throw error;
    }
  }

  // Sign in with email and password
  async function login(email, password) {
<<<<<<< HEAD
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last active timestamp
      if (result.user) {
        await updateDoc(doc(db, 'users', result.user.uid), {
          lastActive: serverTimestamp()
        });
      }
      
      return result;
    } catch (error) {
      console.error('❌ Error during login:', error);
      throw error;
    }
  }

  // Enhanced sign in with Google
=======
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Sign in with Google
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user profile already exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
<<<<<<< HEAD
        // Create new user profile with enhanced structure for Google users
        const userProfileData = {
=======
        // Create new user profile if it doesn't exist
        await setDoc(doc(db, 'users', user.uid), {
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          profileImage: user.photoURL || '',
<<<<<<< HEAD
          
          // For Google users, we'll need to collect additional info later
          hasCompletedOnboarding: false,
          profileCompletionStep: 'personal-info', // They'll need to complete the profile
          
          // Default values for Google signup
          interests: [],
          journalingGoals: [],
          age: null,
          gender: '',
          city: '',
          preferredTheme: 'dark',
          
          // Journey progress initialization
          journeyProgress: {
            currentPath: 'self-discovery',
            hasStartedJourney: false,
          },
          
          // Default settings
          settings: {
            enableNotifications: true,
            reminderTime: '20:00',
            weatherEnabled: false,
            analyticsEnabled: true,
            themePreference: 'dark',
            language: 'en',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          
          // Metadata
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastActive: serverTimestamp(),
          accountStatus: 'active',
          subscriptionTier: 'free',
          
          // Analytics consent (default for Google users)
          analyticsConsent: {
            functionalAnalytics: true,
            performanceAnalytics: true,
            marketingAnalytics: false,
            consentDate: serverTimestamp()
          }
        };
        
        await setDoc(doc(db, 'users', user.uid), userProfileData);
        console.log('✅ New Google user profile created');
      } else {
        // Update last active for existing user
        await updateDoc(doc(db, 'users', user.uid), {
          lastActive: serverTimestamp()
        });
        console.log('✅ Existing Google user signed in');
=======
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          journeyProgress: {
            currentPath: 'self-discovery', // Default first journey
          }
        });
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      }
      
      return user;
    } catch (error) {
<<<<<<< HEAD
      console.error('❌ Error during Google sign-in:', error);
=======
      console.error('Error during Google sign-in:', error);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      throw error;
    }
  }

  // Sign out
  function logout() {
    return signOut(auth);
  }

  // 🆕 NEW: Refresh user profile from Firebase
  const refreshUserProfile = useCallback(async () => {
    if (!currentUser) {
      console.warn('⚠️ Cannot refresh profile: No user signed in');
      return null;
    }
    
    try {
      console.log('🔄 Refreshing user profile from Firebase...');
      
      // Re-fetch user profile from Firestore
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const freshUserData = userSnap.data();
        setUserProfile(freshUserData);
        console.log('✅ User profile refreshed successfully');
        
        // Also dispatch a custom event to notify components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('userProfileRefreshed', {
            detail: { 
              userId: currentUser.uid, 
              timestamp: Date.now(),
              profile: freshUserData
            }
          }));
        }
        
        return freshUserData;
      } else {
        console.error('❌ User profile document not found');
        return null;
      }
    } catch (error) {
      console.error('❌ Error refreshing user profile:', error);
      throw error;
    }
  }, [currentUser]);

<<<<<<< HEAD
  // Enhanced update user profile
=======
  // Update user profile in Firestore
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  async function updateUserProfile(profileData) {
    if (!currentUser) throw new Error('No user signed in');
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      
<<<<<<< HEAD
      // Prepare update data with proper structure
      const updateData = {
        ...profileData,
        updatedAt: serverTimestamp()
      };
      
      // Handle nested updates for settings
      if (profileData.settings) {
        updateData.settings = {
          ...userProfile?.settings,
          ...profileData.settings
        };
      }
      
      // Handle analytics consent updates
      if (profileData.analyticsConsent) {
        updateData.analyticsConsent = {
          ...userProfile?.analyticsConsent,
          ...profileData.analyticsConsent,
          consentDate: serverTimestamp()
        };
      }
      
      // Update the document
      await updateDoc(userRef, updateData);
=======
      // Update the document
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      
      // Update local state
      setUserProfile(prevProfile => ({
        ...prevProfile,
<<<<<<< HEAD
        ...updateData
      }));
      
      console.log('✅ User profile updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw error;
    }
  }

  // 🆕 NEW: Complete profile for Google users or profile updates
  async function completeUserProfile(additionalData) {
    if (!currentUser) throw new Error('No user signed in');
    
    try {
      const completionData = {
        ...additionalData,
        hasCompletedOnboarding: true,
        profileCompletionStep: 'complete',
        updatedAt: serverTimestamp()
      };
      
      // Update settings if theme preference is provided
      if (additionalData.preferredTheme) {
        completionData.settings = {
          ...userProfile?.settings,
          themePreference: additionalData.preferredTheme,
          weatherEnabled: !!additionalData.city
        };
      }
      
      await updateUserProfile(completionData);
      console.log('✅ User profile completion successful');
      return true;
    } catch (error) {
      console.error('❌ Error completing user profile:', error);
=======
        ...profileData
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      throw error;
    }
  }

  // 🆕 NEW: Expose refresh function globally for claudeService
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.authContextRefresh = refreshUserProfile;
      console.log('🌍 Global auth refresh function registered');
    }
    
    // Cleanup on unmount
    return () => {
      if (typeof window !== 'undefined') {
        delete window.authContextRefresh;
        console.log('🧹 Global auth refresh function cleanup');
      }
    };
  }, [refreshUserProfile]);

  // Effect to handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
<<<<<<< HEAD
            const userData = userDoc.data();
            setUserProfile(userData);
            
            // Check if profile needs completion (for Google users or incomplete profiles)
            if (!userData.hasCompletedOnboarding) {
              console.log('👤 User profile needs completion');
            }
            
          } else {
            // Create basic profile if it doesn't exist (should not happen normally)
            console.warn('⚠️ User auth exists but no profile found. Creating basic profile.');
=======
            setUserProfile(userDoc.data());
          } else {
            // Create basic profile if it doesn't exist (should not happen normally)
            console.warn('User auth exists but no profile found. Creating basic profile.');
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
            
            const basicProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || '',
              profileImage: user.photoURL || '',
<<<<<<< HEAD
              hasCompletedOnboarding: false,
              profileCompletionStep: 'personal-info',
              
              // Default empty values
              interests: [],
              journalingGoals: [],
              birthday: '',
              age: null,
              city: '',
              preferredTheme: 'dark',
              
              journeyProgress: {
                currentPath: 'self-discovery',
                hasStartedJourney: false,
              },
              
              settings: {
                enableNotifications: true,
                reminderTime: '20:00',
                weatherEnabled: false,
                analyticsEnabled: true,
                themePreference: 'dark',
                language: 'en',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              },
              
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastActive: serverTimestamp(),
              accountStatus: 'active',
              subscriptionTier: 'free',
              
              analyticsConsent: {
                functionalAnalytics: true,
                performanceAnalytics: true,
                marketingAnalytics: false,
                consentDate: serverTimestamp()
=======
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              journeyProgress: {
                currentPath: 'self-discovery',
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
              }
            };
            
            await setDoc(doc(db, 'users', user.uid), basicProfile);
            setUserProfile(basicProfile);
          }
        } catch (error) {
<<<<<<< HEAD
          console.error('❌ Error fetching user profile:', error);
=======
          console.error('Error fetching user profile:', error);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    signInWithGoogle,
    updateUserProfile,
<<<<<<< HEAD
    completeUserProfile, // 🆕 NEW: For completing profiles
=======
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    refreshUserProfile, // 🆕 NEW: Add refresh function to context
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;