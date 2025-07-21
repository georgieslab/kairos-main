// src/config/firebase.js - Corrected to use us-central1 (where functions are actually deployed)

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

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
}

export default app;