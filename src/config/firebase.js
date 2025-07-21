<<<<<<< HEAD
// src/config/firebase.js - Corrected to use us-central1 (where functions are actually deployed)

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

=======
// src/config/firebase.js - Updated with emulator connections

import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
<<<<<<< HEAD

// FIXED: Initialize Functions with the region where they're actually deployed
export const functions = getFunctions(app, 'us-central1'); // FIXED: Use us-central1

// FIXED: More explicit emulator control
// Only connect to emulators if explicitly enabled via environment variable
const useEmulators = import.meta.env.VITE_USE_EMULATORS === 'true';

if (useEmulators) {
  console.log('🔧 Connecting to Firebase emulators...');
  try {
    // Check if we're already connected to avoid double connection
    if (!functions._delegate._url) {
      connectFunctionsEmulator(functions, 'localhost', 5001);
      console.log('✅ Connected to Functions emulator on localhost:5001');
    }
  } catch (error) {
    console.warn('⚠️ Functions emulator connection failed:', error.message);
  }
} else {
  console.log('🚀 Using live Firebase Functions in us-central1');
=======
export const functions = getFunctions(app);

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV || 
                      import.meta.env.MODE === 'development' || 
                      window.location.hostname === 'localhost';

// Connect to emulators in development mode
if (isDevelopment && import.meta.env.VITE_USE_EMULATORS === 'true') {
  console.log('🔥 Using Firebase Emulators');
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

// Enable persistence for offline support
if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_PERSISTENCE === 'true') {
  enableIndexedDbPersistence(db)
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.warn('Firestore persistence failed to enable: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        // The current browser does not support all of the features required for persistence
        console.warn('Firestore persistence is not available in this browser');
      }
    });
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
}

export default app;