// src/contexts/AuthContext.jsx - Simplified and Corrected with DEBUG LOGGING

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
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

console.log('🔍 DEBUG: AuthContext.jsx is loading...');
console.log('🔍 DEBUG: auth object:', auth);
console.log('🔍 DEBUG: db object:', db);

const AuthContext = createContext();

export function useAuth() {
  console.log('🔍 DEBUG: useAuth() called');
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  console.log('🔍 DEBUG: AuthProvider component mounting...');
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUserProfile = useCallback(async (user) => {
    console.log('🔍 DEBUG: refreshUserProfile called with user:', user?.uid || 'null');
    
    if (!user) {
      console.log('🔍 DEBUG: No user provided, clearing profile');
      setUserProfile(null);
      return;
    }

    try {
      console.log(`🔄 DEBUG: Refreshing profile for user: ${user.uid}`);
      const userRef = doc(db, 'users', user.uid);
      console.log('🔍 DEBUG: userRef created:', userRef.path);
      
      console.log('🔍 DEBUG: Calling getDoc...');
      const userSnap = await getDoc(userRef);
      console.log('🔍 DEBUG: getDoc completed. exists:', userSnap.exists());

      if (userSnap.exists()) {
        const profileData = userSnap.data();
        console.log('✅ DEBUG: Profile data retrieved:', {
          uid: profileData.uid,
          email: profileData.email,
          displayName: profileData.displayName
        });
        setUserProfile(profileData);
        console.log('✅ DEBUG: Profile state updated');
      } else {
        console.warn(`⚠️ DEBUG: No profile document found for user ${user.uid}`);
        setUserProfile(null);
        return null;
      }
    } catch (error) {
      console.error('❌ DEBUG: Error in refreshUserProfile:', error);
      console.error('❌ DEBUG: Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      // Don't throw here, allow app to function in offline mode
    }
  }, []);

  useEffect(() => {
    console.log('🔍 DEBUG: Setting up onAuthStateChanged listener...');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log(`🔐 DEBUG: Auth state changed. User: ${user ? user.uid : 'null'}`);
      console.log('🔍 DEBUG: User details:', user ? {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName
      } : 'null');
      
      setCurrentUser(user);
      console.log('🔍 DEBUG: currentUser state updated');
      
      console.log('🔍 DEBUG: About to call refreshUserProfile...');
      await refreshUserProfile(user);
      console.log('🔍 DEBUG: refreshUserProfile completed');
      
      setLoading(false);
      console.log('✅ DEBUG: Auth state change handled, loading set to false');
    });

    console.log('✅ DEBUG: onAuthStateChanged listener setup complete');
    return () => {
      console.log('🔍 DEBUG: Cleaning up onAuthStateChanged listener');
      unsubscribe();
    };
  }, [refreshUserProfile]);

  async function signup(email, password, name, additionalData = {}) {
    console.log('🔍 DEBUG: signup called with email:', email);
    try {
      console.log('🔍 DEBUG: Calling createUserWithEmailAndPassword...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ DEBUG: User created in Firebase Auth:', user.uid);

      const userProfileData = {
        uid: user.uid,
        email: user.email,
        displayName: name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        ...additionalData,
      };
      console.log('🔍 DEBUG: Creating user profile document...');

      await setDoc(doc(db, 'users', user.uid), userProfileData);
      console.log('✅ DEBUG: User profile document created');
      
      setUserProfile(userProfileData);
      console.log('✅ DEBUG: Local profile state updated');
      
      return user;
    } catch (error) {
      console.error('❌ DEBUG: Error in signup:', error);
      console.error('❌ DEBUG: Error details:', {
        name: error.name,
        message: error.message,
        code: error.code
      });
      throw error;
    }
  }

  async function login(email, password) {
    console.log('🔍 DEBUG: login called with email:', email);
    try {
      console.log('🔍 DEBUG: Calling signInWithEmailAndPassword...');
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ DEBUG: Login successful for user:', result.user.uid);
      // onAuthStateChanged will handle the profile refresh
      return result;
    } catch (error) {
      console.error('❌ DEBUG: Error in login:', error);
      console.error('❌ DEBUG: Error details:', {
        name: error.name,
        message: error.message,
        code: error.code
      });
      throw error;
    }
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      const userProfileData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        profileImage: user.photoURL || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastActive: serverTimestamp(),
      };
      await setDoc(doc(db, 'users', user.uid), userProfileData);
    }
    // onAuthStateChanged will handle the profile refresh
    return user;
  }

  async function logout() {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  }

  async function updateUserProfile(profileData) {
    if (!currentUser) throw new Error('No user signed in');
    const userRef = doc(db, 'users', currentUser.uid);
    const updateData = {
      ...profileData,
      updatedAt: serverTimestamp(),
    };
    await updateDoc(userRef, updateData);
    // Refresh local profile state after update
    await refreshUserProfile(currentUser);
  }

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    signInWithGoogle,
    updateUserProfile,
    refreshUserProfile: () => refreshUserProfile(currentUser), // Expose a simple refresh function
  };

  console.log('🔍 DEBUG: AuthProvider rendering. Loading:', loading);
  console.log('🔍 DEBUG: Current user:', currentUser?.uid || 'null');
  console.log('🔍 DEBUG: User profile loaded:', !!userProfile);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

console.log('✅ DEBUG: AuthContext.jsx module loaded');
export default AuthContext;