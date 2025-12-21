// src/config/firebase.js - Simplified and Corrected with DEBUG LOGGING

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, enableIndexedDbPersistence, enableNetwork, disableNetwork, onSnapshot, doc } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

console.log('🔍 DEBUG: firebase.js is loading...');
console.log('🔍 DEBUG: import.meta.env:', import.meta.env);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log('🔍 DEBUG: firebaseConfig constructed:', {
  hasApiKey: !!firebaseConfig.apiKey,
  apiKeyLength: firebaseConfig.apiKey?.length,
  hasAuthDomain: !!firebaseConfig.authDomain,
  authDomain: firebaseConfig.authDomain,
  hasProjectId: !!firebaseConfig.projectId,
  projectId: firebaseConfig.projectId,
  hasStorageBucket: !!firebaseConfig.storageBucket,
  storageBucket: firebaseConfig.storageBucket,
  hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
  messagingSenderIdLength: firebaseConfig.messagingSenderId?.length,
  hasAppId: !!firebaseConfig.appId,
  appIdLength: firebaseConfig.appId?.length
});

// Log config in dev mode for verification
if (import.meta.env.DEV) {
  console.log('🔥 Firebase Config (DEV MODE):', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
  });
}

// Initialize Firebase
console.log('🔍 DEBUG: About to initialize Firebase app...');
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ DEBUG: Firebase app initialized successfully');
  console.log('🔍 DEBUG: app.name:', app.name);
  console.log('🔍 DEBUG: app.options.projectId:', app.options.projectId);
} catch (error) {
  console.error('❌ DEBUG: Failed to initialize Firebase app:', error);
  console.error('❌ DEBUG: Error details:', {
    name: error.name,
    message: error.message,
    code: error.code,
    stack: error.stack
  });
  throw error;
}

console.log('🔍 DEBUG: Initializing Firebase services...');
export const auth = getAuth(app);
console.log('✅ DEBUG: Auth initialized');

export const storage = getStorage(app);
console.log('✅ DEBUG: Storage initialized');

export const functions = getFunctions(app, 'us-central1');
console.log('✅ DEBUG: Functions initialized for us-central1');

// --- Firestore Initialization ---
console.log('🔍 DEBUG: About to initialize Firestore...');
const firestoreSettings = {
  experimentalForceLongPolling: true,
  cacheSizeBytes: 50000000, // 50MB
  ignoreUndefinedProperties: true,
};
console.log('🔍 DEBUG: Firestore settings:', firestoreSettings);

let db;
try {
  console.log('🔍 DEBUG: Attempting initializeFirestore...');
  // Use initializeFirestore to apply settings. getFirestore() doesn't always apply them on a hot reload.
  db = initializeFirestore(app, firestoreSettings);
  console.log('✅ DEBUG: Firestore initialized with initializeFirestore');
  console.log('🔍 DEBUG: db type:', db.type);
  console.log('🔍 DEBUG: db.app.name:', db.app?.name);
} catch (error) {
  console.error('❌ DEBUG: initializeFirestore failed:', error);
  console.error('❌ DEBUG: Error details:', {
    name: error.name,
    message: error.message,
    code: error.code
  });
  console.log('🔍 DEBUG: Falling back to getFirestore...');
  // Fallback to existing instance if initialization fails
  try {
    db = getFirestore(app);
    console.log('✅ DEBUG: Firestore retrieved with getFirestore fallback');
  } catch (fallbackError) {
    console.error('❌ DEBUG: getFirestore fallback also failed:', fallbackError);
    throw fallbackError;
  }
}
export { db };

// --- Offline Persistence ---
console.log('🔍 DEBUG: Setting up offline persistence...');
(async () => {
  try {
    console.log('🔍 DEBUG: Calling enableIndexedDbPersistence...');
    await enableIndexedDbPersistence(db);
    console.log('✅ DEBUG: Firestore offline persistence enabled successfully');
  } catch (err) {
    console.error('⚠️ DEBUG: Persistence setup error:', err);
    console.error('⚠️ DEBUG: Error code:', err.code);
    console.error('⚠️ DEBUG: Error message:', err.message);
    
    if (err.code === 'failed-precondition') {
      console.warn('⚠️ Firestore persistence failed: Multiple tabs open.');
    } else if (err.code === 'unimplemented') {
      console.warn('⚠️ Firestore persistence not supported in this environment.');
    } else {
      console.error('❌ Unexpected error enabling persistence:', err);
    }
  }
})();

// --- Simplified Connectivity Management ---
console.log('🔍 DEBUG: Setting up network change handlers...');
const handleNetworkChange = () => {
  const isOnline = navigator.onLine;
  console.log(`🌐 DEBUG: Network status changed. navigator.onLine = ${isOnline}`);
  
  if (isOnline) {
    console.log('🌐 DEBUG: Network is online. Attempting to enable Firestore network...');
    enableNetwork(db)
      .then(() => console.log('✅ DEBUG: Firestore network enabled successfully'))
      .catch(err => {
        console.error('⚠️ DEBUG: Could not enable Firestore network:', err);
        console.error('⚠️ DEBUG: Error details:', {
          name: err.name,
          message: err.message,
          code: err.code
        });
      });
  } else {
    console.log('🌐 DEBUG: Network is offline. Firestore will use cache.');
    // The SDK handles this automatically, but you could explicitly disable if needed.
    // disableNetwork(db);
  }
};

console.log('🔍 DEBUG: Attaching network event listeners...');
window.addEventListener('online', handleNetworkChange);
window.addEventListener('offline', handleNetworkChange);
console.log('✅ DEBUG: Event listeners attached');

// Initial check
console.log('🔍 DEBUG: Running initial network check...');
handleNetworkChange();

console.log('✅ DEBUG: firebase.js initialization complete');
export default app;