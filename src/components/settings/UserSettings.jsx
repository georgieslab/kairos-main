<<<<<<< HEAD
// src/components/settings/UserSettings.jsx - UPDATED WITH SHARED AVATAR SYSTEM

import React, { useState, useEffect, useRef, useCallback } from 'react';
=======
// src/components/settings/UserSettings.jsx - Enhanced Mobile-First Design
import React, { useState, useEffect, useRef } from 'react';
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { doc, setDoc, deleteDoc, collection, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { loadGoogleMapsApi, initPlacesAutocomplete, extractCityFromPlace } from '../../utils/googleMapsLoader';
<<<<<<< HEAD

// Import subscription services
import { 
  getSubscriptionStatus, 
  formatSubscriptionInfo,
  createCheckoutSession,
  getCustomerPortalUrl,
  hasArtisanAccess,
  getPricingInfo
} from '../../services/subscriptionService';

// 🎨 IMPORT SHARED AVATAR SYSTEM
import { SmartAvatar, AvatarSelector } from '../../components/common/AvatarComponents';

=======
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
import '../../styles/components/settings.css';

import {
  Settings,
  User,
  Bell,
  Download,
  Trash2,
  Shield,
  ArrowLeft,
  Save,
  Info,
  LogOut,
  Camera,
  Calendar,
  Check,
  X,
  AlertTriangle,
  FileText,
  HelpCircle,
  MessageSquare,
  Bug,
  MapPin,
  Smartphone,
  Share,
  Moon,
  Sun,
  Palette,
  Eye,
  Lock as LockIcon,
  Globe,
  Zap,
  Database,
  Cloud,
  Wifi,
<<<<<<< HEAD
  WifiOff,
  ChevronRight,
  Home,
  Mail,
  UserCircle,
  Crown,
  CreditCard,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Gift,
  ChevronDown,
  Edit3,
  RefreshCw
=======
  WifiOff
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
} from 'lucide-react';

import VersionDisplay from '../common/VersionDisplay';

const UserSettings = ({ onBack, initialSection = 'profile', navigateToScreen }) => {
  const { currentUser, userProfile, updateUserProfile, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Settings state
  const [displayName, setDisplayName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [city, setCity] = useState('');
<<<<<<< HEAD
  const [selectedAvatar, setSelectedAvatar] = useState('geometric-1');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
=======
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');
<<<<<<< HEAD
=======
  const [profileImage, setProfileImage] = useState(null);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  const [autoBackup, setAutoBackup] = useState(true);
  const [biometricLock, setBiometricLock] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  
<<<<<<< HEAD
  // Subscription state
  const [subscription, setSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [processingUpgrade, setProcessingUpgrade] = useState(false);
  const [processingPortal, setProcessingPortal] = useState(false);
  
=======
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  // UI state
  const [activeSection, setActiveSection] = useState(initialSection !== 'appearance' ? initialSection : 'profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [dataStats, setDataStats] = useState({ entries: 0, insights: 0, storageUsed: 0 });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
<<<<<<< HEAD
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  
  // Mobile state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [sectionHistory, setSectionHistory] = useState([initialSection]);
  
  // Refs
  const cityInputRef = useRef(null);
  const modalRef = useRef(null);
=======
  
  // PWA install state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Refs
  const fileInputRef = useRef(null);
  const cityInputRef = useRef(null);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  const [autocompleteInitialized, setAutocompleteInitialized] = useState(false);

  // Settings sections configuration
  const settingsSections = [
    {
      id: 'profile',
      title: 'Profile',
      icon: User,
<<<<<<< HEAD
      description: 'Personal information and avatar',
      mobileTitle: 'Profile',
      color: '#558B6E'
    },
    {
      id: 'subscription',
      title: 'Subscription',
      icon: Crown,
      description: 'Manage your Artisan plan',
      mobileTitle: 'Plan',
      color: '#FFD700'
=======
      description: 'Personal information and preferences'
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
<<<<<<< HEAD
      description: 'Theme and display settings',
      mobileTitle: 'Theme',
      color: '#8B5CF6'
=======
      description: 'Theme and display settings'
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
<<<<<<< HEAD
      description: 'Reminders and alerts',
      mobileTitle: 'Alerts',
      color: '#F59E0B'
=======
      description: 'Manage alerts and reminders'
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Shield,
<<<<<<< HEAD
      description: 'Data protection settings',
      mobileTitle: 'Privacy',
      color: '#EF4444'
=======
      description: 'Data protection and security features'
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    },
    {
      id: 'data',
      title: 'Data Management',
      icon: Database,
<<<<<<< HEAD
      description: 'Export and backup options',
      mobileTitle: 'Data',
      color: '#10B981'
=======
      description: 'Export, backup, and storage'
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
<<<<<<< HEAD
      description: 'Get help and contact us',
      mobileTitle: 'Help',
      color: '#3B82F6'
    }
  ];

  // Detect mobile vs desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load subscription status
  useEffect(() => {
    if (currentUser) {
      loadSubscriptionStatus();
    }
  }, [currentUser]);

  const loadSubscriptionStatus = async () => {
    try {
      setLoadingSubscription(true);
      const status = await getSubscriptionStatus(currentUser.uid, true);
      setSubscription(status);
    } catch (error) {
      console.error('Error loading subscription:', error);
      setSubscription({ status: 'free' });
    } finally {
      setLoadingSubscription(false);
    }
  };

  // Handle subscription upgrade
  const handleUpgrade = async () => {
    try {
      setProcessingUpgrade(true);
      const { url } = await createCheckoutSession(currentUser.uid);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error creating checkout session:', error);
      showMessage('error', 'Error starting upgrade process. Please try again.');
    } finally {
      setProcessingUpgrade(false);
    }
  };

  // Handle subscription management
  const handleManageSubscription = async () => {
    try {
      setProcessingPortal(true);
      const { url } = await getCustomerPortalUrl(currentUser.uid);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      showMessage('error', 'Error opening subscription management. Please try again.');
    } finally {
      setProcessingPortal(false);
    }
  };

  // Helper function to show messages
  const showMessage = useCallback((type, text, duration = 3000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), duration);
  }, []);
=======
      description: 'Get help and contact support'
    }
  ];

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check PWA installation status
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone 
      || document.referrer.includes('android-app://');
    
    setIsAppInstalled(isStandalone);
    
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);
    
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    });
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Load Google Maps API for city autocomplete
  useEffect(() => {
    if (activeSection === 'profile') {
      loadGoogleMapsApi(() => {
        console.log('Google Maps API loaded for settings');
      });
    }
  }, [activeSection]);

  // Initialize Places autocomplete
  useEffect(() => {
    const initializeAutocomplete = async () => {
      if (activeSection === 'profile' && cityInputRef.current && !autocompleteInitialized) {
        try {
          await initPlacesAutocomplete(
            cityInputRef.current,
            { types: ['(cities)'] },
            (place) => {
              if (place && place.address_components) {
                const cityName = extractCityFromPlace(place);
                setCity(cityName);
              }
            }
          );
          setAutocompleteInitialized(true);
        } catch (error) {
          console.error('Error initializing Places Autocomplete:', error);
        }
      }
    };

    initializeAutocomplete();
  }, [activeSection, cityInputRef.current, autocompleteInitialized]);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188

  // Load user settings
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      
      try {
        if (currentUser && userProfile) {
          setDisplayName(userProfile.displayName || '');
          setBirthday(userProfile.birthday || '');
          setCity(userProfile.city || '');
<<<<<<< HEAD
          setSelectedAvatar(userProfile.avatar || 'geometric-1');
          
=======
          setProfileImage(userProfile.photoURL || null);
          
          // Load settings
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
          const settings = userProfile.settings || {};
          setEnableNotifications(settings.enableNotifications || false);
          setReminderTime(settings.reminderTime || '20:00');
          setIsPrivateMode(settings.isPrivateMode || false);
          setExportFormat(settings.exportFormat || 'json');
<<<<<<< HEAD
          setAutoBackup(settings.autoBackup !== false);
          setBiometricLock(settings.biometricLock || false);
          setAnalyticsEnabled(settings.analyticsEnabled !== false);
=======
          setAutoBackup(settings.autoBackup !== false); // Default to true
          setBiometricLock(settings.biometricLock || false);
          setAnalyticsEnabled(settings.analyticsEnabled !== false); // Default to true
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
          
          await loadDataStats();
        }
      } catch (error) {
        console.error('Error loading settings:', error);
<<<<<<< HEAD
        showMessage('error', 'Failed to load settings. Please try again.');
=======
        setMessage({
          type: 'error',
          text: 'Failed to load settings. Please try again.'
        });
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [currentUser, userProfile]);

  // Load data statistics
  const loadDataStats = async () => {
    try {
      if (!currentUser) return;
      
      const journalRef = collection(db, 'users', currentUser.uid, 'journal');
      const journalSnap = await getDocs(journalRef);
      
      let insightCount = 0;
      let totalSize = 0;
      
      journalSnap.forEach(doc => {
        const entry = doc.data();
        if (entry.analysis && entry.analysis.insights) {
          insightCount += entry.analysis.insights.length;
        }
<<<<<<< HEAD
=======
        // Estimate storage size (rough calculation)
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        totalSize += JSON.stringify(entry).length;
      });
      
      setDataStats({
        entries: journalSnap.size,
        insights: insightCount,
<<<<<<< HEAD
        storageUsed: Math.round(totalSize / 1024)
=======
        storageUsed: Math.round(totalSize / 1024) // KB
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      });
    } catch (error) {
      console.error('Error loading data stats:', error);
    }
  };

  // Handle settings save
  const handleSaveSettings = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      if (!currentUser) throw new Error('User not authenticated');
      
      if (activeSection === 'profile' && !displayName.trim()) {
<<<<<<< HEAD
        showMessage('error', 'Display name cannot be empty');
=======
        setMessage({
          type: 'error',
          text: 'Display name cannot be empty'
        });
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        setIsSaving(false);
        return;
      }
      
      const updatedProfile = {
        ...(activeSection === 'profile' && {
          displayName,
          birthday,
          city,
<<<<<<< HEAD
          avatar: selectedAvatar,
=======
          photoURL: profileImage,
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        }),
        settings: {
          ...userProfile.settings,
          enableNotifications,
          reminderTime,
          isPrivateMode,
          exportFormat,
          autoBackup,
          biometricLock,
          analyticsEnabled,
          updatedAt: new Date().toISOString()
        }
      };
      
      await updateUserProfile(updatedProfile);
<<<<<<< HEAD
      setHasUnsavedChanges(false);
      
      showMessage('success', 'Settings saved successfully!');
      
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showMessage('error', 'Failed to save settings: ' + error.message);
=======
      
      setMessage({
        type: 'success',
        text: 'Settings saved successfully!'
      });
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({
        type: 'error',
        text: 'Failed to save settings: ' + error.message
      });
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    } finally {
      setIsSaving(false);
    }
  };

<<<<<<< HEAD
  // Handle section navigation
  const navigateToSection = (sectionId) => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Continue?')) {
      return;
    }
    
    setSectionHistory(prev => [...prev, sectionId]);
    setActiveSection(sectionId);
    
    if ('vibrate' in navigator && isMobile) {
      navigator.vibrate(30);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (sectionHistory.length > 1) {
      const newHistory = [...sectionHistory];
      newHistory.pop();
      const previousSection = newHistory[newHistory.length - 1];
      setSectionHistory(newHistory);
      setActiveSection(previousSection);
      return;
    }
    
    if (hasUnsavedChanges) {
      const shouldLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!shouldLeave) return;
    }
    
    if (onBack) onBack();
  };

  // 🎨 UPDATED AVATAR SELECTION HANDLER
  const handleAvatarSelect = async (avatarKey) => {
    try {
      setUpdatingAvatar(true);
      setSelectedAvatar(avatarKey);
      setShowAvatarSelector(false);
      setHasUnsavedChanges(true);
      
      // Provide haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      console.log('✅ Avatar selected:', avatarKey);
    } catch (error) {
      console.error('❌ Error selecting avatar:', error);
    } finally {
      setUpdatingAvatar(false);
    }
  };

  // Toggle card expansion
  const toggleCardExpansion = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // Get subscription info
  const subscriptionInfo = subscription ? formatSubscriptionInfo(subscription) : null;
  const isArtisan = hasArtisanAccess(subscription);
  const pricingInfo = getPricingInfo();

  // Render section content
  const renderSectionContent = () => {
    const currentSectionData = settingsSections.find(s => s.id === activeSection);

    switch (activeSection) {
      case 'profile':
        return (
          <div className="user-settings__content">
            <div className="user-settings__section-header">
              <div className="user-settings__section-icon" style={{ backgroundColor: currentSectionData.color + '20', color: currentSectionData.color }}>
                <currentSectionData.icon size={24} />
              </div>
              <div>
                <h2 className="user-settings__section-title">{currentSectionData.title}</h2>
                <p className="user-settings__section-description">{currentSectionData.description}</p>
              </div>
            </div>

            {/* Avatar Section */}
            <div className="user-settings__card">
              <h3 className="user-settings__card-title">
                <Camera size={20} />
                Profile Picture
              </h3>
              
              <div className="user-settings__avatar-section">
                <div className="user-settings__avatar-current">
                  <SmartAvatar 
                    userProfile={{ ...userProfile, avatar: selectedAvatar }}
                    size="large"
                    onClick={() => setShowAvatarSelector(true)}
                    className="user-settings__avatar-preview"
                  />
                  <div className="user-settings__avatar-overlay">
                    <Camera size={24} />
                    <span>Change Avatar</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowAvatarSelector(true)}
                  disabled={updatingAvatar}
                  className="user-settings__btn user-settings__btn--secondary"
                >
                  <Camera size={18} />
                  {updatingAvatar ? 'Updating...' : 'Change Avatar'}
                </button>
              </div>
            </div>

            {/* Personal Information */}
            <div className="user-settings__card">
              <h3 className="user-settings__card-title">
                <User size={20} />
                Personal Information
              </h3>
              
              <div className="user-settings__form-group">
                <label className="user-settings__form-label">Display Name</label>
                <div className="user-settings__input-wrapper">
                  <User className="user-settings__input-icon" size={18} />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    className="user-settings__form-input"
                    placeholder="Enter your display name"
                    required
                  />
                </div>
                <span className="user-settings__form-hint">
                  This is how your name appears throughout the app
                </span>
              </div>

              <div className="user-settings__form-group">
                <label className="user-settings__form-label">Email Address</label>
                <div className="user-settings__input-wrapper">
                  <Mail className="user-settings__input-icon" size={18} />
                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    className="user-settings__form-input user-settings__form-input--disabled"
                    disabled
                  />
                </div>
                <span className="user-settings__form-hint">
                  Email cannot be changed. Contact support if you need to update it.
                </span>
              </div>

              <div className="user-settings__form-group">
                <label className="user-settings__form-label">Birthday (Optional)</label>
                <div className="user-settings__input-wrapper">
                  <Calendar className="user-settings__input-icon" size={18} />
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => {
                      setBirthday(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    className="user-settings__form-input"
                  />
                </div>
                <span className="user-settings__form-hint">
                  Used to provide age-appropriate content and insights
                </span>
              </div>

              <div className="user-settings__form-group">
                <label className="user-settings__form-label">City (Optional)</label>
                <div className="user-settings__input-wrapper">
                  <MapPin className="user-settings__input-icon" size={18} />
                  <input
                    ref={cityInputRef}
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    className="user-settings__form-input"
                    placeholder="Enter your city"
                  />
                </div>
                <span className="user-settings__form-hint">
                  Used for weather information and local content
                </span>
              </div>
            </div>

            {/* Account Information */}
            <div className="user-settings__card">
              <h3 className="user-settings__card-title">
                <Shield size={20} />
                Account Information
              </h3>
              
              <div className="user-settings__info-item">
                <span className="user-settings__info-label">Account Created:</span>
                <span className="user-settings__info-value">
                  {userProfile?.createdAt ? 
                    new Date(userProfile.createdAt.toDate()).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric' 
                    }) : 'Recently'
                  }
                </span>
              </div>
              
              <div className="user-settings__info-item">
                <span className="user-settings__info-label">User ID:</span>
                <span className="user-settings__info-value user-settings__info-value--mono">
                  {currentUser?.uid?.substring(0, 8)}...
                </span>
              </div>

              <div className="user-settings__info-item">
                <span className="user-settings__info-label">Account Type:</span>
                <span className="user-settings__info-value">
                  {isArtisan ? (
                    <div className="user-settings__subscription-badge artisan">
                      <Crown size={14} />
                      <span>Artisan</span>
                    </div>
                  ) : (
                    <div className="user-settings__subscription-badge free">
                      <User size={14} />
                      <span>Free</span>
                    </div>
                  )}
                </span>
              </div>
=======
  // Handle app installation
  const handleInstallApp = async () => {
    if (isAppInstalled) {
      setMessage({
        type: 'success',
        text: 'App is already installed!'
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    if (isIOS) {
      setShowInstallInstructions(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setMessage({
          type: 'success',
          text: 'App installed successfully!'
        });
      } else {
        setMessage({
          type: 'info',
          text: 'App installation cancelled'
        });
      }
      
      setDeferredPrompt(null);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({
        type: 'info',
        text: 'To install: Look for the install button in your browser\'s address bar'
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  // Handle data export
  const handleExportData = async () => {
    try {
      setIsLoading(true);
      
      if (!currentUser) throw new Error('User not authenticated');
      
      const journalRef = collection(db, 'users', currentUser.uid, 'journal');
      const journalSnap = await getDocs(journalRef);
      
      const entries = [];
      journalSnap.forEach(doc => {
        entries.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      entries.sort((a, b) => a.day - b.day);
      
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists() ? userSnap.data() : {};
      
      const exportData = {
        userProfile: {
          displayName: userData.displayName,
          email: currentUser.email,
          createdAt: userData.createdAt,
          journeyProgress: userData.journeyProgress
        },
        journalEntries: entries.map(entry => ({
          day: entry.day,
          prompt: entry.prompt,
          theme: entry.theme,
          timestamp: entry.timestamp,
          analysis: entry.analysis
        }))
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `kairos_journal_export_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      window.URL.revokeObjectURL(url);
      
      setMessage({
        type: 'success',
        text: 'Data exported successfully!'
      });
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error exporting data:', error);
      setMessage({
        type: 'error',
        text: 'Failed to export data: ' + error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setIsLoading(true);
    
    try {
      if (!currentUser) throw new Error('User not authenticated');
      
      const journalRef = collection(db, 'users', currentUser.uid, 'journal');
      const journalSnap = await getDocs(journalRef);
      
      const deletionPromises = [];
      journalSnap.forEach(document => {
        deletionPromises.push(deleteDoc(doc(db, 'users', currentUser.uid, 'journal', document.id)));
      });
      
      const reportsRef = collection(db, 'users', currentUser.uid, 'reports');
      const reportsSnap = await getDocs(reportsRef);
      
      reportsSnap.forEach(document => {
        deletionPromises.push(deleteDoc(doc(db, 'users', currentUser.uid, 'reports', document.id)));
      });
      
      deletionPromises.push(deleteDoc(doc(db, 'users', currentUser.uid)));
      
      await Promise.all(deletionPromises);
      await logout();
      
      if (onBack) onBack();
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage({
        type: 'error',
        text: 'Failed to delete account: ' + error.message
      });
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  // Render section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="settings-section-content">
            <div className="settings-form-group">
              <label className="settings-form-label" htmlFor="displayName">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="settings-form-input"
                placeholder="Your name"
              />
            </div>
            
            <div className="settings-form-group">
              <label className="settings-form-label" htmlFor="birthday">
                Birthday
              </label>
              <input
                id="birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="settings-form-input"
              />
              <span className="settings-form-hint">Used to personalize your experience</span>
            </div>
            
            <div className="settings-form-group">
              <label className="settings-form-label" htmlFor="city">
                City
              </label>
              <div className="settings-form-input-group">
                <MapPin className="settings-input-icon" size={16} />
                <input
                  id="city"
                  type="text"
                  ref={cityInputRef}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="settings-form-input settings-form-input-with-icon"
                  placeholder="Your city"
                />
              </div>
              <span className="settings-form-hint">Used for weather and local content</span>
            </div>
            
            <div className="settings-form-group">
              <label className="settings-form-label">Email</label>
              <input
                type="email"
                value={currentUser?.email || ''}
                disabled
                className="settings-form-input settings-form-input-disabled"
              />
              <span className="settings-form-hint">Email cannot be changed</span>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
            </div>
          </div>
        );

<<<<<<< HEAD
      case 'subscription':
        return (
          <div className="user-settings__content">
            <div className="user-settings__section-header">
              <div className="user-settings__section-icon" style={{ backgroundColor: currentSectionData.color + '20', color: currentSectionData.color }}>
                <currentSectionData.icon size={24} />
              </div>
              <div>
                <h2 className="user-settings__section-title">{currentSectionData.title}</h2>
                <p className="user-settings__section-description">{currentSectionData.description}</p>
              </div>
            </div>

            {loadingSubscription ? (
              <div className="user-settings__card">
                <div className="user-settings__loading">
                  <RefreshCw className="user-settings__loading-spinner" size={24} />
                  <p>Loading subscription details...</p>
                </div>
              </div>
            ) : (
              <div className={`user-settings__subscription-card ${isArtisan ? 'artisan' : 'free'}`}>
                <div className="user-settings__subscription-header">
                  <div className="user-settings__subscription-icon">
                    {isArtisan ? <Crown size={32} /> : <Shield size={32} />}
                  </div>
                  <div className="user-settings__subscription-info">
                    <h3 className="user-settings__subscription-title">
                      {isArtisan ? 'Artisan Plan' : 'Free Plan'}
                    </h3>
                    <p className="user-settings__subscription-description">
                      {isArtisan ? 'All journeys unlocked with advanced features' : '9 free journeys available'}
                    </p>
                  </div>
                  <div className={`user-settings__subscription-badge ${isArtisan ? 'artisan' : 'free'}`}>
                    {isArtisan ? <Crown size={16} /> : <User size={16} />}
                    <span>{isArtisan ? 'Artisan' : 'Free'}</span>
                  </div>
                </div>

                <div className="user-settings__subscription-benefits">
                  <h4 className="user-settings__benefits-title">Plan Benefits</h4>
                  <ul className="user-settings__benefits-list">
                    <li className={`user-settings__benefit-item ${isArtisan ? '' : 'limited'}`}>
                      <CheckCircle size={16} />
                      <span>{isArtisan ? 'All 34 Journey Paths' : '9 Free Paths'}</span>
                    </li>
                    <li className={`user-settings__benefit-item ${isArtisan ? '' : 'limited'}`}>
                      <CheckCircle size={16} />
                      <span>{isArtisan ? 'Advanced AI Analysis' : 'Basic AI Analysis'}</span>
                    </li>
                    <li className={`user-settings__benefit-item ${isArtisan ? '' : 'limited'}`}>
                      <CheckCircle size={16} />
                      <span>{isArtisan ? 'Unlimited Exports' : 'Limited Exports'}</span>
                    </li>
                    <li className={`user-settings__benefit-item ${isArtisan ? '' : 'limited'}`}>
                      <CheckCircle size={16} />
                      <span>{isArtisan ? 'Priority Support' : 'Community Support'}</span>
                    </li>
                  </ul>
                </div>

                <div className="user-settings__subscription-actions">
                  {isArtisan ? (
                    <button 
                      onClick={handleManageSubscription}
                      disabled={processingPortal}
                      className="user-settings__btn user-settings__btn--primary"
                    >
                      {processingPortal ? <RefreshCw className="spin" size={18} /> : <CreditCard size={18} />}
                      <span>{processingPortal ? 'Opening...' : 'Manage Subscription'}</span>
                    </button>
                  ) : (
                    <button 
                      onClick={handleUpgrade}
                      disabled={processingUpgrade}
                      className="user-settings__btn user-settings__btn--primary"
                    >
                      {processingUpgrade ? <RefreshCw className="spin" size={18} /> : <Crown size={18} />}
                      <span>{processingUpgrade ? 'Processing...' : 'Upgrade to Artisan'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 'appearance':
        return (
          <div className="user-settings__content">
            <div className="user-settings__section-header">
              <div className="user-settings__section-icon" style={{ backgroundColor: currentSectionData.color + '20', color: currentSectionData.color }}>
                <currentSectionData.icon size={24} />
              </div>
              <div>
                <h2 className="user-settings__section-title">{currentSectionData.title}</h2>
                <p className="user-settings__section-description">{currentSectionData.description}</p>
              </div>
            </div>

            <div className="user-settings__card">
              <h3 className="user-settings__card-title">Theme</h3>
              
              <div className="user-settings__theme-selector">
                <button
                  onClick={() => {
                    if (isDarkMode) toggleTheme();
                    setHasUnsavedChanges(true);
                  }}
                  className={`user-settings__theme-option ${!isDarkMode ? 'active' : ''}`}
                >
                  <Sun size={32} />
                  <span>Light</span>
                  <div className="user-settings__theme-preview user-settings__theme-preview--light"></div>
                </button>
                
                <button
                  onClick={() => {
                    if (!isDarkMode) toggleTheme();
                    setHasUnsavedChanges(true);
                  }}
                  className={`user-settings__theme-option ${isDarkMode ? 'active' : ''}`}
                >
                  <Moon size={32} />
                  <span>Dark</span>
                  <div className="user-settings__theme-preview user-settings__theme-preview--dark"></div>
                </button>
=======
      case 'appearance':
        return (
          <div className="settings-section-content">
            <div className="settings-appearance-section">
              <h3 className="settings-subsection-title">Theme Settings</h3>
              
              <div className="theme-selection">
                <div className="theme-option-group">
                  <button
                    className={`theme-option ${!isDarkMode ? 'active' : ''}`}
                    onClick={() => !isDarkMode || toggleTheme()}
                  >
                    <Sun className="theme-icon" size={24} />
                    <span>Light Theme</span>
                    <div className="theme-preview light-preview"></div>
                  </button>
                  
                  <button
                    className={`theme-option ${isDarkMode ? 'active' : ''}`}
                    onClick={() => isDarkMode || toggleTheme()}
                  >
                    <Moon className="theme-icon" size={24} />
                    <span>Dark Theme</span>
                    <div className="theme-preview dark-preview"></div>
                  </button>
                </div>
              </div>
              
              <div className="settings-info-card">
                <Eye className="settings-info-icon" size={20} />
                <div>
                  <h4>Visual Comfort</h4>
                  <p>Dark theme reduces eye strain in low light conditions and may help save battery on OLED displays.</p>
                </div>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
              </div>
            </div>
          </div>
        );

<<<<<<< HEAD
      // Add other cases for notifications, privacy, data, help...
      default:
        return (
          <div className="user-settings__content">
            <div className="user-settings__section-header">
              <div className="user-settings__section-icon" style={{ backgroundColor: currentSectionData.color + '20', color: currentSectionData.color }}>
                <currentSectionData.icon size={24} />
              </div>
              <div>
                <h2 className="user-settings__section-title">{currentSectionData.title}</h2>
                <p className="user-settings__section-description">{currentSectionData.description}</p>
              </div>
            </div>
            <div className="user-settings__card">
              <p>This section is being enhanced. Coming soon!</p>
            </div>
          </div>
        );
=======
      case 'notifications':
        return (
          <div className="settings-section-content">
            <div className="settings-toggle-row">
              <div className="settings-toggle-label">
                <h3 className="settings-toggle-title">Daily Reminders</h3>
                <p className="settings-toggle-description">Receive a reminder to journal each day</p>
              </div>
              <button
                onClick={() => setEnableNotifications(!enableNotifications)}
                className={`settings-toggle-button ${enableNotifications ? 'active' : ''}`}
              >
                <div className="toggle-handle"></div>
              </button>
            </div>
            
            {enableNotifications && (
              <div className="settings-form-group">
                <label className="settings-form-label" htmlFor="reminderTime">
                  Reminder Time
                </label>
                <input
                  id="reminderTime"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="settings-form-input"
                />
                <span className="settings-form-hint">When should we remind you to journal?</span>
              </div>
            )}
            
            <div className="settings-info-card">
              <Bell className="settings-info-icon" size={20} />
              <div>
                <h4>Notification Policy</h4>
                <p>We only send helpful reminders to support your journaling practice. No promotional content ever.</p>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="settings-section-content">
            <div className="settings-toggle-row">
              <div className="settings-toggle-label">
                <h3 className="settings-toggle-title">Private Mode</h3>
                <p className="settings-toggle-description">Hide journal content from app switcher</p>
              </div>
              <button
                onClick={() => setIsPrivateMode(!isPrivateMode)}
                className={`settings-toggle-button ${isPrivateMode ? 'active' : ''}`}
              >
                <div className="toggle-handle"></div>
              </button>
            </div>
            
            <div className="settings-toggle-row">
              <div className="settings-toggle-label">
                <h3 className="settings-toggle-title">Auto Backup</h3>
                <p className="settings-toggle-description">Automatically backup your journal data</p>
              </div>
              <button
                onClick={() => setAutoBackup(!autoBackup)}
                className={`settings-toggle-button ${autoBackup ? 'active' : ''}`}
              >
                <div className="toggle-handle"></div>
              </button>
            </div>
            
            <div className="settings-toggle-row">
              <div className="settings-toggle-label">
                <h3 className="settings-toggle-title">Analytics</h3>
                <p className="settings-toggle-description">Help improve the app with usage analytics</p>
              </div>
              <button
                onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                className={`settings-toggle-button ${analyticsEnabled ? 'active' : ''}`}
              >
                <div className="toggle-handle"></div>
              </button>
            </div>
            
            <div className="settings-info-card">
              <Shield className="settings-info-icon" size={20} />
              <div>
                <h4>Your Data is Protected</h4>
                <p>All journal entries are encrypted and stored securely. We never share your personal content with third parties.</p>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="settings-section-content">
            <div className="settings-info-card">
              <Database className="settings-info-icon" size={20} />
              <div>
                <h4>Your Journal Data</h4>
                <div className="settings-stats-grid">
                  <div className="settings-stat-item">
                    <div className="settings-stat-value">{dataStats.entries}</div>
                    <div className="settings-stat-label">Journal Entries</div>
                  </div>
                  <div className="settings-stat-item">
                    <div className="settings-stat-value">{dataStats.insights}</div>
                    <div className="settings-stat-label">AI Insights</div>
                  </div>
                  <div className="settings-stat-item">
                    <div className="settings-stat-value">{dataStats.storageUsed} KB</div>
                    <div className="settings-stat-label">Storage Used</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="settings-form-group">
              <label className="settings-form-label">Export Format</label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="settings-form-select"
              >
                <option value="json">JSON (Complete Data)</option>
                <option value="pdf">PDF (Readable Format)</option>
                <option value="txt">Text (Simple Format)</option>
              </select>
            </div>
            
            <div className="settings-button-group">
              <button
                onClick={handleExportData}
                className="settings-btn settings-btn-secondary"
                disabled={isLoading || !isOnline}
              >
                <Download className="settings-btn-icon" />
                Export Data
                {!isOnline && <WifiOff size={16} />}
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="settings-btn settings-btn-danger"
              >
                <Trash2 className="settings-btn-icon" />
                Delete Account
              </button>
            </div>
            
            <div className="settings-connection-status">
              <div className={`connection-indicator ${isOnline ? 'online' : 'offline'}`}>
                {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
                <span>{isOnline ? 'Connected' : 'Offline'}</span>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="settings-section-content">
            <div className="settings-info-card">
              <Smartphone className="settings-info-icon" size={20} />
              <div>
                <h4>Install Καιρός App</h4>
                <p>
                  {isAppInstalled 
                    ? 'Καιρός is installed on your device.'
                    : 'Install for offline access and better performance.'
                  }
                </p>
                <button 
                  onClick={handleInstallApp}
                  className={`settings-btn ${isAppInstalled ? 'settings-btn-secondary' : 'settings-btn-primary'}`}
                >
                  {isAppInstalled ? (
                    <>
                      <Check className="settings-btn-icon" />
                      Installed
                    </>
                  ) : (
                    <>
                      <Download className="settings-btn-icon" />
                      Install App
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="settings-info-card">
              <MessageSquare className="settings-info-icon" size={20} />
              <div>
                <h4>Feedback & Support</h4>
                <p>Help us improve Καιρός with your feedback.</p>
                <div className="settings-button-group">
                  <button 
                    onClick={() => navigateToScreen('feedback')}
                    className="settings-btn settings-btn-secondary"
                  >
                    <MessageSquare className="settings-btn-icon" />
                    Give Feedback
                  </button>
                  
                  <button 
                    onClick={() => navigateToScreen('bug-report')}
                    className="settings-btn settings-btn-outline"
                  >
                    <Bug className="settings-btn-icon" />
                    Report Bug
                  </button>
                </div>
              </div>
            </div>
            
            <div className="settings-version-container">
              <VersionDisplay showChangelog={true} />
            </div>
          </div>
        );

      default:
        return null;
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    }
  };

  if (isLoading && !message.text) {
    return (
<<<<<<< HEAD
      <div className="user-settings">
        <div className="user-settings__loading">
          <RefreshCw className="user-settings__loading-spinner" size={32} />
=======
      <div className="settings-container">
        <div className="settings-loading">
          <div className="settings-loading-spinner"></div>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className={`user-settings ${isDarkMode ? 'user-settings--dark' : 'user-settings--light'}`}>
      {/* Header */}
      <div className="user-settings__header">
        <button 
          onClick={handleBack}
          className="user-settings__back-btn"
        >
          <ArrowLeft size={20} />
          {!isMobile && <span>Back</span>}
        </button>
        
        <h1 className="user-settings__title">Settings</h1>
        
        <div className="user-settings__header-actions">
          {hasUnsavedChanges && (
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="user-settings__save-btn"
            >
              {isSaving ? <RefreshCw className="spin" size={16} /> : <Save size={16} />}
              {!isMobile && <span>Save</span>}
=======
    <div className="settings-container">
      {/* Header */}
      <div className="settings-header">
        <button 
          onClick={onBack}
          className="settings-back-button"
        >
          <ArrowLeft className="settings-back-icon" />
          <span>Back</span>
        </button>
        
        <h1 className="settings-title">Settings</h1>
        
        <div className="settings-header-actions">
          {['profile', 'notifications', 'privacy'].includes(activeSection) && (
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="settings-save-button"
            >
              {isSaving ? <Zap className="spin" size={16} /> : <Save size={16} />}
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
            </button>
          )}
        </div>
      </div>
      
<<<<<<< HEAD
      {/* Message Alert */}
      {message.text && (
        <div className={`user-settings__message user-settings__message--${message.type}`}>
          {message.type === 'error' ? (
            <AlertTriangle size={18} />
          ) : message.type === 'success' ? (
            <Check size={18} />
          ) : (
            <Info size={18} />
=======
      {/* Message alert */}
      {message.text && (
        <div className={`settings-message-alert ${message.type}`}>
          {message.type === 'error' ? (
            <AlertTriangle className="settings-alert-icon" />
          ) : message.type === 'info' ? (
            <Info className="settings-alert-icon" />
          ) : (
            <Check className="settings-alert-icon" />
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
          )}
          <span>{message.text}</span>
        </div>
      )}
      
<<<<<<< HEAD
      {/* Navigation */}
      {isMobile ? (
        // Mobile: Show current section content
        renderSectionContent()
      ) : (
        // Desktop: Show navigation grid + content
        <div className="user-settings__layout">
          <div className="user-settings__navigation">
            <div className="user-settings__nav-grid">
              {settingsSections.map(section => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => navigateToSection(section.id)}
                    className={`user-settings__nav-card ${activeSection === section.id ? 'active' : ''}`}
                    style={{ '--section-color': section.color }}
                  >
                    <div className="user-settings__nav-icon">
                      <IconComponent size={24} />
                    </div>
                    <div className="user-settings__nav-content">
                      <h3 className="user-settings__nav-title">{section.title}</h3>
                      <p className="user-settings__nav-description">{section.description}</p>
                    </div>
                    <ChevronRight className="user-settings__nav-chevron" size={18} />
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="user-settings__main">
            {renderSectionContent()}
          </div>
        </div>
      )}

      {/* Mobile FAB for section navigation */}
      {isMobile && (
        <div className="user-settings__mobile-nav">
          <div className="user-settings__mobile-nav-scroll">
            {settingsSections.map(section => {
              const IconComponent = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => navigateToSection(section.id)}
                  className={`user-settings__mobile-nav-item ${activeSection === section.id ? 'active' : ''}`}
                  style={{ '--section-color': section.color }}
                  title={section.title}
                >
                  <IconComponent size={20} />
                  <span>{section.mobileTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 🎨 SHARED AVATAR SELECTOR MODAL */}
      {showAvatarSelector && (
        <AvatarSelector
          selectedAvatar={selectedAvatar}
          onSelect={handleAvatarSelect}
          onClose={() => setShowAvatarSelector(false)}
          size="medium"
        />
      )}
=======
      {/* Settings Navigation */}
      <div className="settings-navigation">
        <div className="settings-nav-grid">
          {settingsSections.map(section => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`settings-nav-card ${activeSection === section.id ? 'active' : ''}`}
              >
                <div className="nav-card-icon">
                  <IconComponent size={24} />
                </div>
                <div className="nav-card-content">
                  <h3 className="nav-card-title">{section.title}</h3>
                  <p className="nav-card-description">{section.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Active Section Content */}
      <div className="settings-content">
        <div className="settings-section">
          <div className="settings-section-header">
            <h2 className="settings-section-title">
              {settingsSections.find(s => s.id === activeSection)?.title}
            </h2>
          </div>
          
          {renderSectionContent()}
        </div>
      </div>
      
      {/* Modals */}
      {showDeleteConfirm && (
        <div className="settings-modal-overlay">
          <div className="settings-modal">
            <div className="settings-modal-header">
              <AlertTriangle className="settings-modal-icon danger" />
              <h3 className="settings-modal-title">Delete Account</h3>
              <p className="settings-modal-description">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
            
            <div className="settings-modal-actions">
              <button
                onClick={handleDeleteAccount}
                className="settings-btn settings-btn-danger"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Zap className="spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="settings-btn-icon" /> Delete Account
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="settings-btn settings-btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showInstallInstructions && (
        <div className="settings-modal-overlay">
          <div className="settings-modal">
            <div className="settings-modal-header">
              <Smartphone className="settings-modal-icon" />
              <h3 className="settings-modal-title">Install on iOS</h3>
              <p className="settings-modal-description">
                Add Καιρός to your home screen for the best experience
              </p>
            </div>
            
            <div className="settings-ios-instructions">
              <div className="settings-instruction-step">
                <span className="settings-step-number">1</span>
                <div className="settings-step-content">
                  <span>Tap the share button</span>
                  <Share size={18} />
                  <span>in Safari</span>
                </div>
              </div>
              
              <div className="settings-instruction-step">
                <span className="settings-step-number">2</span>
                <div className="settings-step-content">
                  <span>Select "Add to Home Screen"</span>
                </div>
              </div>
              
              <div className="settings-instruction-step">
                <span className="settings-step-number">3</span>
                <div className="settings-step-content">
                  <span>Tap "Add" to install</span>
                </div>
              </div>
            </div>
            
            <div className="settings-modal-actions">
              <button
                onClick={() => setShowInstallInstructions(false)}
                className="settings-btn settings-btn-primary"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    </div>
  );
};

export default UserSettings;