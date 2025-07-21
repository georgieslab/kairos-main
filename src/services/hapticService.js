// src/services/hapticService.js - Haptic Feedback Service for Android

import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

class HapticService {
  constructor() {
    this.isAvailable = Capacitor.isNativePlatform();
    this.isEnabled = true; // Can be toggled in settings
  }

  // Check if haptics are available and enabled
  canVibrate() {
    return this.isAvailable && this.isEnabled;
  }

  // Enable/disable haptic feedback
  setEnabled(enabled) {
    this.isEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('hapticEnabled', enabled ? 'true' : 'false');
    }
  }

  // Load preference from storage
  loadPreference() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hapticEnabled');
      this.isEnabled = saved !== 'false'; // Default to true
    }
  }

  // Light impact - for button presses, toggles
  async light() {
    if (!this.canVibrate()) return;
    
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  // Medium impact - for tab changes, selections
  async medium() {
    if (!this.canVibrate()) return;
    
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  // Heavy impact - for important actions, confirmations
  async heavy() {
    if (!this.canVibrate()) return;
    
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  // Success notification - for completed actions
  async success() {
    if (!this.canVibrate()) return;
    
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  // Warning notification - for warnings, confirmations
  async warning() {
    if (!this.canVibrate()) return;
    
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  // Error notification - for errors, failures
  async error() {
    if (!this.canVibrate()) return;
    
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  // Selection changed - for slider changes, scrolling
  async selectionChanged() {
    if (!this.canVibrate()) return;
    
    try {
      await Haptics.selectionChanged();
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  // Custom vibration pattern (Android only)
  async vibrate(duration = 50) {
    if (!this.canVibrate()) return;
    
    try {
      await Haptics.vibrate({ duration });
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  // Double tap pattern
  async doubleTap() {
    if (!this.canVibrate()) return;
    
    try {
      await this.light();
      setTimeout(() => this.light(), 100);
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  // Long press pattern
  async longPress() {
    if (!this.canVibrate()) return;
    
    try {
      await this.vibrate(100);
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  // Page transition pattern
  async pageTransition() {
    if (!this.canVibrate()) return;
    
    try {
      await this.medium();
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  // Achievement unlocked pattern
  async achievement() {
    if (!this.canVibrate()) return;
    
    try {
      await this.success();
      setTimeout(() => this.light(), 200);
      setTimeout(() => this.light(), 400);
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  // Pull to refresh pattern
  async pullToRefresh() {
    if (!this.canVibrate()) return;
    
    try {
      await this.medium();
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }

  // Swipe action pattern
  async swipe() {
    if (!this.canVibrate()) return;
    
    try {
      await this.selectionChanged();
    } catch (error) {
      console.log('Haptic feedback not available:', error);
    }
  }
}

// Create singleton instance
const hapticService = new HapticService();
hapticService.loadPreference();

// Export for use throughout app
export default hapticService;

// React Hook for haptic feedback
export const useHaptic = () => {
  return hapticService;
};