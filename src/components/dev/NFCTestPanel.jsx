// src/components/dev/NFCTestPanel.jsx
// Development panel for testing NFC functionality

import React, { useState, useEffect } from 'react';
import { Radio, Wifi, WifiOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import useNFC from '../../hooks/useNFC';
import NFCStatusBadge, { NFCStatusCard } from '../journal/NFCStatusBadge';

function NFCTestPanel() {
  const [logs, setLogs] = useState([]);
  const [lastScanData, setLastScanData] = useState(null);

  const nfc = useNFC({
    onScan: (data) => {
      addLog('✅ Scan Success', JSON.stringify(data, null, 2), 'success');
      setLastScanData(data);
    },
    onError: (error) => {
      addLog('❌ Scan Error', error.message, 'error');
    }
  });

  const addLog = (title, message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [{
      id: Date.now(),
      timestamp,
      title,
      message,
      type
    }, ...prev].slice(0, 20)); // Keep last 20 logs
  };

  useEffect(() => {
    addLog('📱 NFC Panel Loaded', `Support Level: ${nfc.supportLevel}`, 'info');
  }, []);

  const handleCheckAvailability = async () => {
    addLog('🔍 Checking Availability...', '', 'info');
    const result = await nfc.checkAvailability();
    addLog('📊 Availability Result', JSON.stringify(result, null, 2), 'info');
  };

  const handleStartReading = async () => {
    try {
      addLog('📖 Starting NFC Reading...', '', 'info');
      await nfc.startReading();
      addLog('✅ Reading Started', 'Waiting for tag...', 'success');
    } catch (error) {
      addLog('❌ Start Failed', error.message, 'error');
    }
  };

  const handleStopReading = async () => {
    try {
      addLog('⏹️ Stopping NFC Reading...', '', 'info');
      await nfc.stopReading();
      addLog('✅ Reading Stopped', '', 'success');
    } catch (error) {
      addLog('❌ Stop Failed', error.message, 'error');
    }
  };

  const handleReadOneTag = async () => {
    try {
      addLog('🏷️ Reading Tag (30s timeout)...', '', 'info');
      const result = await nfc.readTag();
      addLog('✅ Tag Read', JSON.stringify(result.data, null, 2), 'success');
    } catch (error) {
      addLog('❌ Read Failed', error.message, 'error');
    }
  };

  const handleGenerateId = () => {
    const id = nfc.generateJournalId();
    addLog('🆔 Generated ID', id, 'info');
  };

  const handleWriteTag = async () => {
    try {
      const journalData = {
        journalId: nfc.generateJournalId(),
        tier: 'premium',
        serialNumber: 'KJ-TEST-001',
        metadata: { test: true, timestamp: new Date().toISOString() }
      };
      
      addLog('✍️ Writing to Tag...', JSON.stringify(journalData, null, 2), 'info');
      const result = await nfc.writeTag(journalData);
      addLog('✅ Write Success', JSON.stringify(result, null, 2), 'success');
    } catch (error) {
      addLog('❌ Write Failed', error.message, 'error');
    }
  };

  const handleOpenSettings = async () => {
    try {
      addLog('⚙️ Opening NFC Settings...', '', 'info');
      await nfc.openSettings();
    } catch (error) {
      addLog('❌ Settings Failed', error.message, 'error');
    }
  };

  const getLogColor = (type) => {
    switch(type) {
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-orange-600 dark:text-orange-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">🏷️ NFC Test Panel</h1>
        <p className="text-blue-100">Development tool for testing NFC functionality</p>
      </div>

      {/* Status Card */}
      <NFCStatusCard />

      {/* Status Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatusBox 
          label="Available" 
          value={nfc.isAvailable ? 'Yes' : 'No'}
          color={nfc.isAvailable ? 'green' : 'red'}
        />
        <StatusBox 
          label="Enabled" 
          value={nfc.isEnabled ? 'Yes' : 'No'}
          color={nfc.isEnabled ? 'green' : 'orange'}
        />
        <StatusBox 
          label="Reading" 
          value={nfc.isReading ? 'Active' : 'Idle'}
          color={nfc.isReading ? 'blue' : 'gray'}
        />
        <StatusBox 
          label="Support" 
          value={nfc.supportLevel}
          color={nfc.supportLevel === 'full' ? 'green' : 'gray'}
        />
      </div>

      {/* Action Buttons */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <ActionButton 
            onClick={handleCheckAvailability}
            icon="🔍"
            label="Check Availability"
          />
          <ActionButton 
            onClick={handleStartReading}
            icon="📖"
            label="Start Reading"
            disabled={!nfc.isReady || nfc.isReading}
          />
          <ActionButton 
            onClick={handleStopReading}
            icon="⏹️"
            label="Stop Reading"
            disabled={!nfc.isReading}
          />
          <ActionButton 
            onClick={handleReadOneTag}
            icon="🏷️"
            label="Read One Tag"
            disabled={!nfc.isReady || nfc.isReading}
          />
          <ActionButton 
            onClick={handleGenerateId}
            icon="🆔"
            label="Generate ID"
          />
          <ActionButton 
            onClick={handleWriteTag}
            icon="✍️"
            label="Write Test Tag"
            disabled={!nfc.isReady || nfc.isReading}
          />
          <ActionButton 
            onClick={handleOpenSettings}
            icon="⚙️"
            label="Open Settings"
          />
        </div>
      </div>

      {/* Last Scan Data */}
      {lastScanData && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Last Scan Data</h2>
          <pre className="bg-gray-100 dark:bg-gray-900 rounded p-4 overflow-auto text-sm">
            {JSON.stringify(lastScanData, null, 2)}
          </pre>
        </div>
      )}

      {/* Error Message */}
      {nfc.error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 dark:text-red-100">Error</h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {nfc.getErrorMessage()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Event Logs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Event Logs</h2>
          <button 
            onClick={() => setLogs([])}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Clear
          </button>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No logs yet</p>
          ) : (
            logs.map(log => (
              <div 
                key={log.id}
                className="bg-gray-50 dark:bg-gray-900/50 rounded p-3 text-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium ${getLogColor(log.type)}`}>
                    {log.title}
                  </span>
                  <span className="text-xs text-gray-500">{log.timestamp}</span>
                </div>
                {log.message && (
                  <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap overflow-auto">
                    {log.message}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatusBox({ label, value, color }) {
  const colors = {
    green: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700',
    red: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700',
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700',
    orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-700',
    gray: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700'
  };

  return (
    <div className={`rounded-xl p-4 border ${colors[color]}`}>
      <p className="text-xs opacity-75 mb-1">{label}</p>
      <p className="font-semibold text-lg">{value}</p>
    </div>
  );
}

function ActionButton({ onClick, icon, label, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-2
        px-4 py-3 rounded-lg font-medium text-sm
        transition-all duration-200
        ${disabled 
          ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
          : 'bg-blue-500 hover:bg-blue-600 text-white active:scale-95'
        }
      `}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default NFCTestPanel;
