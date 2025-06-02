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

  // Sign up with email and password
  async function signup(email, password, name, birthday, city) {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
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
      throw error;
    }
  }

  // Sign in with email and password
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Sign in with Google
  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user profile already exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user profile if it doesn't exist
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
          profileImage: user.photoURL || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          journeyProgress: {
            currentPath: 'self-discovery', // Default first journey
          }
        });
      }
      
      return user;
    } catch (error) {
      console.error('Error during Google sign-in:', error);
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

  // Update user profile in Firestore
  async function updateUserProfile(profileData) {
    if (!currentUser) throw new Error('No user signed in');
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      
      // Update the document
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });
      
      // Update local state
      setUserProfile(prevProfile => ({
        ...prevProfile,
        ...profileData
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
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
            setUserProfile(userDoc.data());
          } else {
            // Create basic profile if it doesn't exist (should not happen normally)
            console.warn('User auth exists but no profile found. Creating basic profile.');
            
            const basicProfile = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || '',
              profileImage: user.photoURL || '',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              journeyProgress: {
                currentPath: 'self-discovery',
              }
            };
            
            await setDoc(doc(db, 'users', user.uid), basicProfile);
            setUserProfile(basicProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
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