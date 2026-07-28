// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  sendPasswordResetEmail
} from 'firebase/auth';
import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
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

  // Google sign-in has to take two different routes.
  //
  // On the web, signInWithPopup works: the popup shares an origin with the
  // parent page, so Firebase can hand the credential back via postMessage.
  //
  // In the Capacitor WebView it cannot. The app is served from localhost and a
  // WebView can't open a real popup, so Firebase falls back to launching the
  // system browser at <authDomain>/__/auth/handler. OAuth then completes in the
  // browser's process — separate storage, no window handle, no postMessage
  // channel back to us — so the credential is stranded there and the promise
  // never settles (the UI hangs on "Connecting..." forever).
  //
  // Natively we therefore go through Google Play Services via the plugin, which
  // never opens a browser, and exchange the returned idToken for a JS SDK
  // session. The plugin is configured with skipNativeAuth so it only returns
  // credentials rather than holding its own separate native session; signing in
  // through the JS SDK here is what keeps onAuthStateChanged and every existing
  // Firestore call working unchanged.
  async function signInWithGoogle() {
    let user;

    if (Capacitor.isNativePlatform()) {
      const { credential } = await FirebaseAuthentication.signInWithGoogle();

      if (!credential?.idToken) {
        throw new Error('Google sign-in did not return an ID token.');
      }

      const googleCredential = GoogleAuthProvider.credential(
        credential.idToken,
        credential.accessToken
      );
      const result = await signInWithCredential(auth, googleCredential);
      user = result.user;
    } else {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      user = result.user;
    }

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

    // Google Play Services caches the account chosen at sign-in. Without also
    // clearing it natively, the next sign-in silently reuses that account and
    // never shows the picker, so a user can't switch accounts after logging
    // out. Best-effort: a failure here shouldn't block the actual sign-out.
    if (Capacitor.isNativePlatform()) {
      try {
        await FirebaseAuthentication.signOut();
      } catch (error) {
        console.warn('Native Google sign-out failed (continuing):', error);
      }
    }

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
