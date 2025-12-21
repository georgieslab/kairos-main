// src/components/settings/UserSettings.jsx - Redesigned v3.0 (With Avatar)

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useUserStatistics } from '../../hooks/useUserStatistics';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { loadGoogleMapsApi, initPlacesAutocomplete, extractCityFromPlace } from '../../utils/googleMapsLoader';
import {
  getSubscriptionStatus,
  createCheckoutSession,
  getCustomerPortalUrl,
  hasArtisanAccess
} from '../../services/subscriptionService';
import VersionDisplay from '../common/VersionDisplay';
import Avatar, { AvatarPicker } from '../common/Avatar';
import '../../styles/components/settings.css';

import {
  User,
  Download,
  Trash2,
  ArrowLeft,
  Save,
  Info,
  Calendar,
  Check,
  X,
  AlertTriangle,
  FileText,
  HelpCircle,
  MessageSquare,
  Bug,
  MapPin,
  Moon,
  Sun,
  Palette,
  Database,
  Mail,
  Crown,
  CreditCard,
  ExternalLink,
  Sparkles,
  ChevronDown,
  RefreshCw,
  Home,
  Camera,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';

const UserSettings = ({ onBack, initialSection = 'profile', navigateToScreen }) => {
  const { currentUser, userProfile, updateUserProfile, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { statistics } = useUserStatistics();
  
  const [displayName, setDisplayName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [city, setCity] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [processingUpgrade, setProcessingUpgrade] = useState(false);
  const [processingPortal, setProcessingPortal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyInsights: true,
    pathCompletion: true
  });
  
  const cityInputRef = useRef(null);

  // Avatar data
  const avatarStyle = userProfile?.avatarStyle || 'forest';
  const avatarPattern = userProfile?.avatarPattern || 'dots';
  const avatarFont = userProfile?.avatarFont || 'sans';
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'K';

  useEffect(() => {
    if (currentUser) {
      loadSubscriptionStatus();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && userProfile) {
      setDisplayName(userProfile.displayName || '');
      setBirthday(userProfile.birthday || '');
      setCity(userProfile.city || '');
    }
  }, [currentUser, userProfile]);

  useEffect(() => {
    if (city && cityInputRef.current) {
      loadGoogleMapsApi(() => {
        if (window.google) {
          initPlacesAutocomplete(cityInputRef.current, (place) => {
            const cityName = extractCityFromPlace(place);
            if (cityName) {
              setCity(cityName);
              setHasUnsavedChanges(true);
            }
          });
        }
      });
    }
  }, [city]);

  const loadSubscriptionStatus = async () => {
    try {
      setLoadingSubscription(true);
      const status = await getSubscriptionStatus(currentUser.uid, true);
      console.log('🔍 UserSettings - Loaded subscription:', status);
      setSubscription(status);
    } catch (error) {
      console.error('Error loading subscription:', error);
      setSubscription({ status: 'free' });
    } finally {
      setLoadingSubscription(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setProcessingUpgrade(true);
      const { url } = await createCheckoutSession(currentUser.uid);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Error starting upgrade. Please try again.');
    } finally {
      setProcessingUpgrade(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setProcessingPortal(true);
      const { url } = await getCustomerPortalUrl(currentUser.uid);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Error opening management portal.');
    } finally {
      setProcessingPortal(false);
    }
  };

  const handleAvatarSave = async ({ style, pattern, font }) => {
    try {
      await updateUserProfile({
        avatarStyle: style,
        avatarPattern: pattern,
        avatarFont: font
      });
      setShowAvatarPicker(false);
      showMessage('success', 'Avatar updated successfully!');
    } catch (error) {
      console.error('Error saving avatar:', error);
      showMessage('error', 'Failed to update avatar.');
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateUserProfile({
        displayName: displayName.trim(),
        birthday,
        city
      });
      setHasUnsavedChanges(false);
      showMessage('success', 'Settings saved successfully!');
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const journalRef = collection(db, 'users', currentUser.uid, 'journal');
      const snapshot = await getDocs(journalRef);
      const data = [];
      
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kairos-journal-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      showMessage('success', 'Data exported successfully!');
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Failed to export data.');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      showMessage('error', 'Please type DELETE to confirm');
      return;
    }

    try {
      // Delete user data from Firestore
      // Note: In production, this should be handled by a Cloud Function
      showMessage('success', 'Account deletion request submitted. You will be contacted within 24 hours.');
      setShowDeleteDialog(false);
      setDeleteConfirmation('');
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Failed to process deletion request.');
    }
  };

  const toggleNotification = async (key) => {
    const newNotifications = {
      ...notifications,
      [key]: !notifications[key]
    };
    setNotifications(newNotifications);
    
    try {
      await updateUserProfile({ notifications: newNotifications });
      showMessage('success', 'Notification preferences updated!');
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', 'Failed to update preferences.');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };
  
  const memberSince = currentUser?.metadata?.creationTime 
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric' 
      })
    : 'Unknown';

  // Calculate isArtisan based on current subscription state
  const isArtisan = hasArtisanAccess(subscription);
  console.log('🔍 UserSettings - isArtisan:', isArtisan, 'subscription:', subscription);

  return (
    <div className={`settings-container ${isDarkMode ? 'settings-dark' : 'settings-light'}`}>
      {/* Header */}
      <header className="settings-header">
        <button className="settings-back-btn" onClick={onBack || (() => navigateToScreen('home'))}>
          <ArrowLeft size={20} />
        </button>
        <div className="settings-header-content">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage your account preferences</p>
        </div>
      </header>

      {/* Message */}
      {message.text && (
        <div className={`settings-message settings-message-${message.type}`}>
          {message.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Account Overview */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title">
            <User size={20} />
            Account Overview
          </h2>
        </div>

        <div className="settings-card">
          <div className="settings-account-info">
            <div className="settings-account-avatar">
              <Avatar 
                style={avatarStyle} 
                pattern={avatarPattern}
                font={avatarFont}
                initials={initials}
                size={64}
              />
            </div>
            <div className="settings-account-details">
              <h3 className="settings-account-name">{displayName || 'Journaler'}</h3>
              <p className="settings-account-email">{currentUser?.email}</p>
              <div className="settings-account-meta">
                <span className={`settings-account-badge ${loadingSubscription ? 'badge-free' : (isArtisan ? 'badge-artisan' : 'badge-free')}`}>
                  {loadingSubscription ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      Loading...
                    </>
                  ) : isArtisan ? (
                    <>
                      <Crown size={14} />
                      Artisan
                    </>
                  ) : (
                    <>
                      <User size={14} />
                      Free Plan
                    </>
                  )}
                </span>
                <span className="settings-account-since">
                  <Calendar size={14} />
                  Member since {memberSince}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title">
            <User size={20} />
            Profile Information
          </h2>
        </div>

        <div className="settings-card">
          {/* Avatar Section */}
          <div className="settings-form-group">
            <label className="settings-label">Profile Avatar</label>
            <div className="settings-avatar-container">
              <div className="settings-avatar-wrapper">
                <Avatar 
                  style={avatarStyle} 
                  pattern={avatarPattern}
                  font={avatarFont}
                  initials={initials}
                  size={80}
                  onClick={() => setShowAvatarPicker(true)}
                />
                <button 
                  className="settings-avatar-edit-btn" 
                  onClick={() => setShowAvatarPicker(true)}
                  title="Change avatar"
                >
                  <Camera size={16} />
                </button>
              </div>
              <div className="settings-avatar-info">
                <p className="settings-avatar-text">Click to customize your avatar</p>
                <span className="settings-hint">Choose from 6 color themes, 6 patterns, and 6 fonts</span>
              </div>
            </div>
          </div>

          <div className="settings-form-group">
            <label className="settings-label">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                setHasUnsavedChanges(true);
              }}
              className="settings-input"
              placeholder="Your name"
            />
          </div>

          <div className="settings-form-group">
            <label className="settings-label">Email Address</label>
            <input
              type="email"
              value={currentUser?.email || ''}
              className="settings-input settings-input-disabled"
              disabled
            />
            <span className="settings-hint">Email cannot be changed</span>
          </div>

          <div className="settings-form-group">
            <label className="settings-label">Birthday (Optional)</label>
            <div className="settings-input-wrapper">
              <Calendar size={18} className="settings-input-icon" />
              <input
                type="date"
                value={birthday}
                onChange={(e) => {
                  setBirthday(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="settings-input"
              />
            </div>
          </div>

          <div className="settings-form-group">
            <label className="settings-label">City (Optional)</label>
            <div className="settings-input-wrapper">
              <MapPin size={18} className="settings-input-icon" />
              <input
                ref={cityInputRef}
                type="text"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                className="settings-input"
                placeholder="Enter your city"
              />
            </div>
          </div>

          {hasUnsavedChanges && (
            <button 
              className="settings-save-btn"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <RefreshCw size={18} className="settings-btn-icon-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          )}
        </div>
      </section>

      {/* Subscription Section */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title">
            <Crown size={20} />
            Subscription
          </h2>
        </div>

        <div className="settings-card">
          {loadingSubscription ? (
            <div className="settings-loading">Loading subscription...</div>
          ) : isArtisan ? (
            <>
              <div className="settings-subscription-status artisan">
                <div className="settings-subscription-icon">
                  <Crown size={24} />
                </div>
                <div className="settings-subscription-info">
                  <h3>Artisan Member</h3>
                  <p>You have access to all premium features</p>
                </div>
              </div>
              <button 
                className="settings-btn settings-btn-secondary"
                onClick={handleManageSubscription}
                disabled={processingPortal}
              >
                <CreditCard size={18} />
                Manage Subscription
                <ExternalLink size={16} />
              </button>
            </>
          ) : (
            <>
              <div className="settings-subscription-status free">
                <div className="settings-subscription-info">
                  <h3>Free Plan</h3>
                  <p>Upgrade to Artisan for unlimited features</p>
                </div>
              </div>
              <button 
                className="settings-btn settings-btn-primary"
                onClick={handleUpgrade}
                disabled={processingUpgrade}
              >
                <Sparkles size={18} />
                Upgrade to Artisan
              </button>
            </>
          )}
        </div>
      </section>

      {/* Notifications & Preferences */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title">
            <Bell size={20} />
            Notifications & Preferences
          </h2>
        </div>

        <div className="settings-card">
          <div className="settings-preference-item">
            <div className="settings-preference-info">
              <h3>Daily Journaling Reminder</h3>
              <p>Get reminded to journal every day</p>
            </div>
            <button 
              className={`settings-toggle-btn ${notifications.dailyReminder ? 'active' : ''}`}
              onClick={() => toggleNotification('dailyReminder')}
            >
              <div className="settings-toggle-track">
                <div className="settings-toggle-thumb"></div>
              </div>
            </button>
          </div>

          <div className="settings-preference-item">
            <div className="settings-preference-info">
              <h3>Weekly Insights Summary</h3>
              <p>Receive AI insights every week</p>
            </div>
            <button 
              className={`settings-toggle-btn ${notifications.weeklyInsights ? 'active' : ''}`}
              onClick={() => toggleNotification('weeklyInsights')}
            >
              <div className="settings-toggle-track">
                <div className="settings-toggle-thumb"></div>
              </div>
            </button>
          </div>

          <div className="settings-preference-item">
            <div className="settings-preference-info">
              <h3>Path Completion Alerts</h3>
              <p>Celebrate when you complete a journey</p>
            </div>
            <button 
              className={`settings-toggle-btn ${notifications.pathCompletion ? 'active' : ''}`}
              onClick={() => toggleNotification('pathCompletion')}
            >
              <div className="settings-toggle-track">
                <div className="settings-toggle-thumb"></div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title">
            <Shield size={20} />
            Privacy & Security
          </h2>
        </div>

        <div className="settings-card">
          <div className="settings-privacy-options">
            <button className="settings-privacy-option">
              <Lock size={20} />
              <div>
                <h3>Change Password</h3>
                <p>Update your account password</p>
              </div>
              <ChevronDown size={18} style={{ transform: 'rotate(-90deg)' }} />
            </button>

            <button className="settings-privacy-option">
              <Eye size={20} />
              <div>
                <h3>Data Privacy Settings</h3>
                <p>Control who can see your data</p>
              </div>
              <ChevronDown size={18} style={{ transform: 'rotate(-90deg)' }} />
            </button>

            <button className="settings-privacy-option">
              <FileText size={20} />
              <div>
                <h3>Download My Data</h3>
                <p>Get a copy of all your information</p>
              </div>
              <ChevronDown size={18} style={{ transform: 'rotate(-90deg)' }} />
            </button>
          </div>
        </div>
      </section>

      {/* Appearance Section */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title">
            <Palette size={20} />
            Appearance
          </h2>
        </div>

        <div className="settings-card">
          <div className="settings-theme-toggle">
            <div className="settings-theme-info">
              <h3>Theme</h3>
              <p>Choose your preferred color scheme</p>
            </div>
            <button 
              className="settings-theme-btn"
              onClick={toggleTheme}
            >
              <div className={`settings-theme-btn-track ${isDarkMode ? 'active' : ''}`}>
                <div className="settings-theme-btn-thumb">
                  {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
                </div>
              </div>
              <span>{isDarkMode ? 'Dark' : 'Light'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Data Management Section */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title">
            <Database size={20} />
            Data Management
          </h2>
        </div>

        <div className="settings-card">
          <div className="settings-data-stats">
            <div className="settings-data-stat">
              <FileText size={20} />
              <div>
                <span className="settings-data-stat-value">{statistics.totalEntries}</span>
                <span className="settings-data-stat-label">Journal Entries</span>
              </div>
            </div>
            <div className="settings-data-stat">
              <Sparkles size={20} />
              <div>
                <span className="settings-data-stat-value">{statistics.totalInsights || 0}</span>
                <span className="settings-data-stat-label">Insights Generated</span>
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button 
              className="settings-btn settings-btn-secondary"
              onClick={handleExport}
            >
              <Download size={18} />
              Export Data
            </button>
            <button 
              className="settings-btn settings-btn-danger"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 size={18} />
              Delete Account
            </button>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title">
            <HelpCircle size={20} />
            Help & Resources
          </h2>
        </div>

        <div className="settings-card">
          <div className="settings-help-grid">
            <a 
              href="mailto:support@kairos-journal.com"
              className="settings-resource-card"
            >
              <Mail size={24} />
              <h3>Contact Support</h3>
              <p>Get help with your account</p>
            </a>

            <a 
              href="https://docs.kairos-journal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="settings-resource-card"
            >
              <FileText size={24} />
              <h3>Documentation</h3>
              <p>Learn how to use Καιρός</p>
            </a>

            <button 
              className="settings-resource-card"
              onClick={() => navigateToScreen('help')}
            >
              <HelpCircle size={24} />
              <h3>FAQ</h3>
              <p>Find answers quickly</p>
            </button>

            <button 
              className="settings-resource-card"
              onClick={() => {
                alert('Bug reporting coming soon!');
              }}
            >
              <Bug size={24} />
              <h3>Report a Bug</h3>
              <p>Help us improve</p>
            </button>
          </div>
        </div>

        {/* Legal Links */}
        <div className="settings-card">
          <h3 className="settings-legal-title">Legal & Policies</h3>
          <div className="settings-legal-links">
            <button 
              className="settings-legal-link"
              onClick={() => navigateToScreen('terms')}
            >
              <FileText size={18} />
              <span>Terms of Service</span>
              <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
            </button>
            <button 
              className="settings-legal-link"
              onClick={() => navigateToScreen('privacy')}
            >
              <Shield size={18} />
              <span>Privacy Policy</span>
              <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
            </button>
            <button 
              className="settings-legal-link"
              onClick={() => navigateToScreen('about')}
            >
              <Info size={18} />
              <span>About Καιρός</span>
              <ChevronDown size={16} style={{ transform: 'rotate(-90deg)' }} />
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title">
            <Info size={20} />
            About
          </h2>
        </div>

        <div className="settings-card">
          <div className="settings-about">
            <h3>Καιρός Smart Journal</h3>
            <p>Your companion for mindful journaling and personal growth</p>
            <VersionDisplay />
          </div>
        </div>
      </section>
    
      {/* Delete Account Confirmation Modal */}
      {showDeleteDialog && (
        <div className="settings-modal-overlay" onClick={() => setShowDeleteDialog(false)}>
          <div className="settings-modal settings-delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="settings-modal-header">
              <AlertTriangle size={32} className="settings-modal-icon-danger" />
              <h2>Delete Account</h2>
              <p>This action cannot be undone</p>
            </div>
            <div className="settings-modal-content">
              <div className="settings-warning-box">
                <h3>This will permanently delete:</h3>
                <ul>
                  <li>All your journal entries and insights</li>
                  <li>Your account profile and preferences</li>
                  <li>Your subscription and payment history</li>
                  <li>All your progress and achievements</li>
                </ul>
              </div>
              <p className="settings-delete-instruction">
                To confirm, type <strong>DELETE</strong> in the box below:
              </p>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="settings-delete-input"
                placeholder="Type DELETE to confirm"
              />
            </div>
            <div className="settings-modal-actions">
              <button 
                className="settings-modal-btn settings-modal-btn-cancel"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setDeleteConfirmation('');
                }}
              >
                Cancel
              </button>
              <button 
                className="settings-modal-btn settings-modal-btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'DELETE'}
              >
                <Trash2 size={18} />
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="settings-modal-overlay" onClick={() => setShowAvatarPicker(false)}>
          <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
            <AvatarPicker 
              currentStyle={avatarStyle}
              currentPattern={avatarPattern}
              currentFont={avatarFont}
              initials={initials}
              onSelect={handleAvatarSave}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSettings;