// src/services/firestoreWrapper.js
import { initializeFirestore, getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { connectFirestoreEmulator } from 'firebase/firestore';

export class FirestoreWrapper {
    constructor(app) {
        this.app = app;
        this.db = null;
        this.initialized = false;
        this._initializePromise = null;
    }

    async initialize() {
        if (this._initializePromise) {
            return this._initializePromise;
        }

        this._initializePromise = (async () => {
            try {
                console.log('🔥 Initializing Firestore with enhanced settings...');

                // Force long polling connection
                const settings = {
                    experimentalForceLongPolling: true,
                    experimentalAutoDetectLongPolling: false,
                    cacheSizeBytes: 50000000,
                    ignoreUndefinedProperties: true,
                    ssl: true
                };

                // Initialize Firestore with settings
                this.db = initializeFirestore(this.app, settings);

                // Enable offline persistence
                try {
                    await enableIndexedDbPersistence(this.db);
                    console.log('✅ Offline persistence enabled');
                } catch (err) {
                    if (err.code === 'failed-precondition') {
                        console.warn('❌ Multiple tabs open, persistence enabled in first tab only');
                    } else if (err.code === 'unimplemented') {
                        console.warn('❌ Browser doesn\'t support persistence');
                    } else {
                        console.error('❌ Error enabling persistence:', err);
                    }
                }

                // Test connection by attempting to write to a special document
                try {
                    const testDoc = this.db.collection('_connection_test').doc('test');
                    await testDoc.set({ timestamp: new Date() });
                    console.log('✅ Firestore connection test successful');
                } catch (error) {
                    console.error('❌ Firestore connection test failed:', error);
                    // Don't throw - allow offline mode to work
                }

                this.initialized = true;
                return this.db;

            } catch (error) {
                console.error('❌ Error initializing Firestore:', error);
                throw error;
            }
        })();

        return this._initializePromise;
    }

    getInstance() {
        if (!this.initialized) {
            throw new Error('Firestore not initialized. Call initialize() first.');
        }
        return this.db;
    }

    // Add retry logic for operations
    async withRetry(operation, maxAttempts = 3) {
        let lastError;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                if (attempt < maxAttempts) {
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
                    console.log(`Retry attempt ${attempt} after ${delay}ms`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        throw lastError;
    }
}