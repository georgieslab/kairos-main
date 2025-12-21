// src/components/journal/NFCStatusBadge.jsx
// Καιρός Smart Journal - NFC Status Badge Component
// Shows current NFC availability status

import React from 'react';
import { Radio, WifiOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import useNFC from '../../hooks/useNFC';

/**
 * Badge size variants
 */
const SIZES = {
  sm: {
    badge: 'px-2 py-1 text-xs',
    icon: 14,
    gap: 'gap-1'
  },
  md: {
    badge: 'px-3 py-1.5 text-sm',
    icon: 16,
    gap: 'gap-1.5'
  },
  lg: {
    badge: 'px-4 py-2 text-base',
    icon: 18,
    gap: 'gap-2'
  }
};

/**
 * Status configurations
 */
const STATUS_CONFIG = {
  not_available: {
    icon: WifiOff,
    text: 'NFC Not Available',
    color: 'bg-gray-100 text-gray-600 border-gray-200',
    darkColor: 'dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
  },
  disabled: {
    icon: AlertCircle,
    text: 'NFC Disabled',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    darkColor: 'dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-700'
  },
  ready: {
    icon: CheckCircle2,
    text: 'NFC Ready',
    color: 'bg-green-100 text-green-700 border-green-200',
    darkColor: 'dark:bg-green-900/20 dark:text-green-400 dark:border-green-700'
  },
  scanning: {
    icon: Radio,
    text: 'Scanning...',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    darkColor: 'dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700',
    animated: true
  }
};

function NFCStatusBadge({ 
  size = 'md',
  showLabel = true,
  onClick = null,
  className = ''
}) {
  const nfc = useNFC();

  /**
   * Determine current status
   */
  const getStatus = () => {
    if (nfc.isReading) return 'scanning';
    if (!nfc.isAvailable) return 'not_available';
    if (!nfc.isEnabled) return 'disabled';
    return 'ready';
  };

  const status = getStatus();
  const config = STATUS_CONFIG[status];
  const sizeConfig = SIZES[size];
  const StatusIcon = config.icon;

  /**
   * Handle click
   */
  const handleClick = () => {
    if (onClick) {
      onClick(status);
    } else if (status === 'disabled') {
      // Auto-open NFC settings if disabled
      nfc.openSettings();
    }
  };

  return (
    <div
      className={`
        inline-flex items-center ${sizeConfig.gap}
        ${sizeConfig.badge}
        rounded-full border
        ${config.color} ${config.darkColor}
        ${onClick || status === 'disabled' ? 'cursor-pointer hover:opacity-80' : ''}
        transition-all duration-200
        ${className}
      `}
      onClick={handleClick}
      title={status === 'disabled' ? 'Click to open NFC settings' : config.text}
    >
      <StatusIcon 
        size={sizeConfig.icon}
        className={config.animated ? 'animate-pulse' : ''}
      />
      {showLabel && <span className="font-medium">{config.text}</span>}
    </div>
  );
}

/**
 * Detailed NFC Status Card
 * More comprehensive status display with actions
 */
export function NFCStatusCard({ className = '' }) {
  const nfc = useNFC();

  /**
   * Get detailed status message
   */
  const getDetailedMessage = () => {
    if (!nfc.isAvailable) {
      return {
        title: 'NFC Not Supported',
        message: 'Your device doesn\'t support NFC. You can still use Καιρός by manually uploading journal photos.',
        action: null
      };
    }

    if (!nfc.isEnabled) {
      return {
        title: 'Enable NFC',
        message: 'NFC is available but disabled on your device. Enable it to quickly scan and upload journal entries.',
        action: {
          text: 'Open Settings',
          onClick: nfc.openSettings
        }
      };
    }

    if (nfc.isReading) {
      return {
        title: 'Ready to Scan',
        message: 'Hold your phone near the NFC chip on your journal cover to instantly start uploading.',
        action: {
          text: 'Stop Scanning',
          onClick: nfc.stopReading
        }
      };
    }

    return {
      title: 'NFC Ready',
      message: 'Your device is ready to scan Καιρός journals. Tap your journal to instantly upload entries.',
      action: null
    };
  };

  const statusInfo = getDetailedMessage();
  const config = STATUS_CONFIG[nfc.isReading ? 'scanning' : !nfc.isAvailable ? 'not_available' : !nfc.isEnabled ? 'disabled' : 'ready'];
  const StatusIcon = config.icon;

  return (
    <div className={`
      bg-white dark:bg-gray-800 
      rounded-xl border border-gray-200 dark:border-gray-700
      p-4 
      ${className}
    `}>
      <div className="flex items-start gap-3">
        <div className={`
          p-2 rounded-lg
          ${config.color} ${config.darkColor}
        `}>
          <StatusIcon 
            size={20}
            className={config.animated ? 'animate-pulse' : ''}
          />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            {statusInfo.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {statusInfo.message}
          </p>

          {statusInfo.action && (
            <button
              onClick={statusInfo.action.onClick}
              className="
                mt-3 px-4 py-2
                bg-blue-500 hover:bg-blue-600
                text-white text-sm font-medium
                rounded-lg
                transition-colors duration-200
              "
            >
              {statusInfo.action.text}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Inline NFC Status with Action Button
 * Compact version with optional action
 */
export function NFCStatusInline({ 
  onScanClick = null,
  className = '' 
}) {
  const nfc = useNFC();

  if (!nfc.isAvailable) {
    return null; // Don't show anything if NFC not available
  }

  return (
    <div className={`
      flex items-center justify-between
      px-4 py-3
      bg-gray-50 dark:bg-gray-800/50
      rounded-lg border border-gray-200 dark:border-gray-700
      ${className}
    `}>
      <div className="flex items-center gap-2">
        <NFCStatusBadge size="sm" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {nfc.isEnabled ? 'Tap journal to scan' : 'Enable NFC to scan journals'}
        </span>
      </div>

      {nfc.isEnabled && onScanClick && (
        <button
          onClick={onScanClick}
          className="
            px-3 py-1.5
            bg-blue-500 hover:bg-blue-600
            text-white text-sm font-medium
            rounded-lg
            transition-colors duration-200
          "
        >
          Start Scan
        </button>
      )}

      {!nfc.isEnabled && (
        <button
          onClick={nfc.openSettings}
          className="
            px-3 py-1.5
            bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
            text-gray-700 dark:text-gray-300 text-sm font-medium
            rounded-lg
            transition-colors duration-200
          "
        >
          Enable
        </button>
      )}
    </div>
  );
}

export default NFCStatusBadge;