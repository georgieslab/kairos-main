// src/components/settings/UserSettings.jsx - UPDATED WITH SHARED AVATAR SYSTEM

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { doc, setDoc, deleteDoc, collection, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { loadGoogleMapsApi, initPlacesAutocomplete, extractCityFromPlace } from '../../utils/googleMapsLoader';

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
} from 'lucide-react';

import VersionDisplay from '../common/VersionDisplay';

const UserSettings = ({ onBack, initialSection = 'profile', navigateToScreen }) => {
  const { currentUser, userProfile, updateUserProfile, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Settings state
  const [displayName, setDisplayName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [city, setCity] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('geometric-1');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(false);
  const [reminderTime, setReminderTime] = useState('20:00');
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');
  const [autoBackup, setAutoBackup] = useState(true);
  const [biometricLock, setBiometricLock] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  
  // Subscription state
  const [subscription, setSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [processingUpgrade, setProcessingUpgrade] = useState(false);
  const [processingPortal, setProcessingPortal] = useState(false);
  
  // UI state
  const [activeSection, setActiveSection] = useState(initialSection !== 'appearance' ? initialSection : 'profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [dataStats, setDataStats] = useState({ entries: 0, insights: 0, storageUsed: 0 });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
  const [autocompleteInitialized, setAutocompleteInitialized] = useState(false);

  // Settings sections configuration
  const settingsSections = [
    {
      id: 'profile',
      title: 'Profile',
      icon: User,
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
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      description: 'Theme and display settings',
      mobileTitle: 'Theme',
      color: '#8B5CF6'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Reminders and alerts',
      mobileTitle: 'Alerts',
      color: '#F59E0B'
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Shield,
      description: 'Data protection settings',
      mobileTitle: 'Privacy',
      color: '#EF4444'
    },
    {
      id: 'data',
      title: 'Data Management',
      icon: Database,
      description: 'Export and backup options',
      mobileTitle: 'Data',
      color: '#10B981'
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: HelpCircle,
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

  // Load user settings
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      
      try {
        if (currentUser && userProfile) {
          setDisplayName(userProfile.displayName || '');
          setBirthday(userProfile.birthday || '');
          setCity(userProfile.city || '');
          setSelectedAvatar(userProfile.avatar || 'geometric-1');
          
          const settings = userProfile.settings || {};
          setEnableNotifications(settings.enableNotifications || false);
          setReminderTime(settings.reminderTime || '20:00');
          setIsPrivateMode(settings.isPrivateMode || false);
          setExportFormat(settings.exportFormat || 'json');
          setAutoBackup(settings.autoBackup !== false);
          setBiometricLock(settings.biometricLock || false);
          setAnalyticsEnabled(settings.analyticsEnabled !== false);
          
          await loadDataStats();
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        showMessage('error', 'Failed to load settings. Please try again.');
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
        totalSize += JSON.stringify(entry).length;
      });
      
      setDataStats({
        entries: journalSnap.size,
        insights: insightCount,
        storageUsed: Math.round(totalSize / 1024)
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
        showMessage('error', 'Display name cannot be empty');
        setIsSaving(false);
        return;
      }
      
      const updatedProfile = {
        ...(activeSection === 'profile' && {
          displayName,
          birthday,
          city,
          avatar: selectedAvatar,
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
      setHasUnsavedChanges(false);
      
      showMessage('success', 'Settings saved successfully!');
      
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showMessage('error', 'Failed to save settings: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

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
            </div>
          </div>
        );

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
              </div>
            </div>
          </div>
        );

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
    }
  };

  if (isLoading && !message.text) {
    return (
      <div className="user-settings">
        <div className="user-settings__loading">
          <RefreshCw className="user-settings__loading-spinner" size={32} />
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
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
            </button>
          )}
        </div>
      </div>
      
      {/* Message Alert */}
      {message.text && (
        <div className={`user-settings__message user-settings__message--${message.type}`}>
          {message.type === 'error' ? (
            <AlertTriangle size={18} />
          ) : message.type === 'success' ? (
            <Check size={18} />
          ) : (
            <Info size={18} />
          )}
          <span>{message.text}</span>
        </div>
      )}
      
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
    </div>
  );
};

export default UserSettings;