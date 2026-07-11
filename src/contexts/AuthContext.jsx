// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUserProfile = useCallback(async (user) => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const profileData = userSnap.data();
        setUserProfile(profileData);
      } else {
        console.warn('No profile document found for authenticated user.');
        setUserProfile(null);
        return null;
      }
    } catch (error) {
      // Don't throw here, allow app to function in offline mode
      console.error('Error refreshing user profile:', error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      await refreshUserProfile(user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [refreshUserProfile]);

  async function signup(email, password, name, additionalData = {}) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userProfileData = {
        uid: user.uid,
        email: user.email,
        displayName: name,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        ...additionalData,
      };

      await setDoc(doc(db, 'users', user.uid), userProfileData);
      setUserProfile(userProfileData);
      
      return user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle the profile refresh
      return result;
    } catch (error) {
      console.error('Error logging in:', error);
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

  async function resetPassword(email) {
    await sendPasswordResetEmail(auth, email);
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
    resetPassword,
    updateUserProfile,
    refreshUserProfile: () => refreshUserProfile(currentUser), // Expose a simple refresh function
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
