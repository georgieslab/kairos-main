// src/components/dev/DebugConnectivity.jsx - Simplified and Corrected

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { enableNetwork } from 'firebase/firestore';

const DebugConnectivity = () => {
  const { currentUser, userProfile, loading } = useAuth();
  const [probeResult, setProbeResult] = useState(null);

  const runProbe = async () => {
    const result = {
      timestamp: new Date().toISOString(),
      navigatorOnline: navigator.onLine,
      firebaseUser: !!currentUser,
      firestoreProfile: !!userProfile,
      loadingState: loading,
    };
    setProbeResult(result);
    console.log('🔍 Debug Probe:', result);
  };

  const forceEnable = () => {
    console.log('Attempting to force-enable Firestore network...');
    enableNetwork(db)
      .then(() => console.log('✅ Firestore network enabled by debug button.'))
      .catch(err => console.error('❌ Failed to enable network from debug:', err));
  };

  return (
    <div style={{ padding: 16, background: 'rgba(0,0,0,0.8)', color: 'white', fontFamily: 'monospace', fontSize: 12 }}>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>� Connectivity Debug</div>
      <div><strong>Project ID:</strong> {import.meta.env.VITE_FIREBASE_PROJECT_ID}</div>
      <div><strong>User:</strong> {currentUser ? currentUser.uid : 'null'}</div>
      <div><strong>Profile Loaded:</strong> {userProfile ? 'Yes' : 'No'}</div>
      <div><strong>Auth Loading:</strong> {loading.toString()}</div>
      <div style={{ marginTop: 8 }}>
        <button onClick={runProbe}>Run Probe</button>
        <button onClick={forceEnable} style={{ marginLeft: 8 }}>Force Enable Network</button>
      </div>
      {probeResult && (
        <pre style={{ background: 'rgba(255,255,255,0.1)', padding: 8, marginTop: 8, borderRadius: 4 }}>
          {JSON.stringify(probeResult, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default DebugConnectivity;