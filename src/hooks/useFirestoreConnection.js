import { useEffect, useState } from 'react';
import { onSnapshot, collection, query, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Custom hook to monitor Firestore connection status.
 * Returns: { isConnected: boolean, error: string|null }
 * 
 * This hook monitors a lightweight system collection to check connectivity.
 * It doesn't require a user to be logged in.
 */
export function useFirestoreConnection() {
  const [isConnected, setIsConnected] = useState(true); // Assume connected initially
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔍 DEBUG: useFirestoreConnection - Setting up connectivity monitor...');
    
    // Monitor any Firestore collection to check connectivity
    // We'll use a minimal query that works even without auth
    let unsubscribe;
    
    try {
      // Create a minimal query - even if it fails due to permissions, 
      // we'll know if we're connected based on the error type
      const q = query(collection(db, 'users'), limit(1));
      
      unsubscribe = onSnapshot(
        q,
        () => {
          console.log('✅ DEBUG: Firestore connection active');
          setIsConnected(true);
          setError(null);
        },
        (err) => {
          console.error('⚠️ DEBUG: Firestore connection error:', err);
          
          // Permission denied OR missing/insufficient permissions means we're connected but not authenticated - that's OK!
          if (err.code === 'permission-denied' || err.message?.includes('Missing or insufficient permissions')) {
            console.log('✅ DEBUG: Firestore connected (permission error is expected when not logged in)');
            setIsConnected(true);
            setError(null);
          } else if (err.code === 'unavailable') {
            console.error('❌ DEBUG: Firestore unavailable');
            setIsConnected(false);
            setError('Firestore service unavailable');
          } else {
            console.warn('⚠️ DEBUG: Firestore error but assuming connected:', err.code, err.message);
            // For other errors, assume we're still connected
            setIsConnected(true);
            setError(err?.message || 'Unknown error');
          }
        }
      );
    } catch (err) {
      console.error('❌ DEBUG: Failed to set up Firestore listener:', err);
      // If we can't even set up a listener, we're likely connected but misconfigured
      setIsConnected(true);
      setError(err?.message || 'Setup error');
    }

    return () => {
      console.log('🔍 DEBUG: useFirestoreConnection - Cleaning up...');
      if (unsubscribe) unsubscribe();
    };
  }, []);

  console.log('🔍 DEBUG: useFirestoreConnection returning:', { isConnected, error });
  return { isConnected, error };
}
