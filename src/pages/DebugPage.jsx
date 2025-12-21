import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import DebugConnectivity from '../components/dev/DebugConnectivity';
import NFCTestPanel from '../components/dev/NFCTestPanel';

const DebugPage = () => {
  const { currentUser, userProfile, loading } = useAuth();
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('debug'); // 'debug' or 'nfc'

  useEffect(() => {
    const log = (message) => {
      console.log(message);
      setLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
    };

    log('🔍 DebugPage mounted');
    log(`Auth object exists: ${!!auth}`);
    log(`DB object exists: ${!!db}`);
    log(`Loading: ${loading}`);
    log(`Current user: ${currentUser?.uid || 'null'}`);
    log(`User profile exists: ${!!userProfile}`);
  }, [currentUser, userProfile, loading]);

  return (
    <div style={{ padding: 20, fontFamily: 'monospace', fontSize: 12 }}>
      <h1>🔍 Debug Page</h1>
      
      {/* Tab Switcher */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
        <button
          onClick={() => setActiveTab('debug')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'debug' ? '#4CAF50' : '#ccc',
            color: activeTab === 'debug' ? 'white' : 'black',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🐛 Debug Info
        </button>
        <button
          onClick={() => setActiveTab('nfc')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'nfc' ? '#2196F3' : '#ccc',
            color: activeTab === 'nfc' ? 'white' : 'black',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🏷️ NFC Test
        </button>
      </div>

      {activeTab === 'nfc' ? (
        <NFCTestPanel />
      ) : (
        <>
          <DebugConnectivity />
          
          <div style={{ marginTop: 20, background: '#f0f0f0', padding: 15, borderRadius: 5 }}>
            <h2>Current State</h2>
            <div><strong>Loading:</strong> {loading.toString()}</div>
            <div><strong>User:</strong> {currentUser ? currentUser.uid : 'null'}</div>
            <div><strong>Email:</strong> {currentUser?.email || 'null'}</div>
            <div><strong>Profile Loaded:</strong> {userProfile ? 'Yes' : 'No'}</div>
            {userProfile && (
              <div><strong>Display Name:</strong> {userProfile.displayName || 'N/A'}</div>
            )}
          </div>

          <div style={{ marginTop: 20, background: '#e0e0e0', padding: 15, borderRadius: 5 }}>
            <h2>Logs</h2>
            <div style={{ maxHeight: 300, overflow: 'auto' }}>
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 20, background: '#d0d0d0', padding: 15, borderRadius: 5 }}>
            <h2>Environment</h2>
            <div><strong>DEV mode:</strong> {import.meta.env.DEV ? 'Yes' : 'No'}</div>
            <div><strong>Project ID:</strong> {import.meta.env.VITE_FIREBASE_PROJECT_ID || 'NOT SET'}</div>
            <div><strong>Auth Domain:</strong> {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'NOT SET'}</div>
            <div><strong>Navigator Online:</strong> {navigator.onLine ? 'Yes' : 'No'}</div>
          </div>

          {userProfile?.journeyProgress && (
            <div style={{ marginTop: 20, background: '#c0e0ff', padding: 15, borderRadius: 5 }}>
              <h2>Journey Progress Data</h2>
              <div style={{ maxHeight: 400, overflow: 'auto', fontSize: 11 }}>
                <pre>{JSON.stringify(userProfile.journeyProgress, null, 2)}</pre>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DebugPage;
