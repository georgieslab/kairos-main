// src/components/settings/UserSettings.jsx - Apple Glass Edition (modernized)

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useUserStatistics } from '../../hooks/useUserStatistics';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { loadGoogleMapsApi, initPlacesAutocomplete, extractCityFromPlace } from '../../utils/googleMapsLoader';
import {
  getSubscriptionStatus,
  createCheckoutSession,
  getCustomerPortalUrl,
  hasArtisanAccess
} from '../../services/SubscriptionService';
import { deleteUserAccount, getDataDeletionSummary } from '../../services/deleteAccountService';

import VersionDisplay from '../common/VersionDisplay';
import ArtisanMonogram, { MonogramPicker } from '../common/ArtisanMonogram';
import '../../styles/components/settings.css';

import {
  ArrowLeft, User, Crown, Calendar, MapPin, Save, RefreshCw, Sparkles,
  CreditCard, ExternalLink, Bell, Moon, Sun, Database, FileText, Download,
  Trash2, Check, AlertTriangle, HelpCircle, Mail, Info, ChevronRight,
  Camera, Lock, Loader, Image, Mic, Shield
} from 'lucide-react';

const UserSettings = ({ onBack, initialSection = 'profile', navigateToScreen }) => {
  const { t, i18n } = useTranslation('settings');
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

  // Delete account flow state
  const [deleteStep, setDeleteStep] = useState(1); // 1: Warning, 2: Password, 3: Confirm, 4: Deleting, 5: Done
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionProgress, setDeletionProgress] = useState('');
  const [dataSummary, setDataSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const cityInputRef = useRef(null);

  // Avatar (unified with the Profile screen — uses avatarTheme + ArtisanMonogram)
  const avatarTheme = userProfile?.avatarTheme || 'parchment';
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'K';

  useEffect(() => {
    if (currentUser) loadSubscriptionStatus();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && userProfile) {
      setDisplayName(userProfile.displayName || '');
      setBirthday(userProfile.birthday || '');
      setCity(userProfile.city || '');
      // Reflect saved notification preferences (fixes always-on toggles)
      if (userProfile.notifications) {
        setNotifications(prev => ({ ...prev, ...userProfile.notifications }));
      }
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

  useEffect(() => {
    if (showDeleteDialog && currentUser) loadDataSummary();
  }, [showDeleteDialog, currentUser]);

  const loadDataSummary = async () => {
    setLoadingSummary(true);
    try {
      const summary = await getDataDeletionSummary(currentUser.uid);
      setDataSummary(summary);
    } catch (err) {
      console.error('Error loading summary:', err);
    } finally {
      setLoadingSummary(false);
    }
  };

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

  const handleUpgrade = async () => {
    try {
      setProcessingUpgrade(true);
      const { url } = await createCheckoutSession(currentUser.uid);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', t('subscriptionSection.upgradeError', 'Error starting upgrade. Please try again.'));
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
      showMessage('error', t('subscriptionSection.portalError', 'Error opening management portal.'));
    } finally {
      setProcessingPortal(false);
    }
  };

  const handleAvatarSave = async (themeKey) => {
    try {
      await updateUserProfile({ avatarTheme: themeKey });
      setShowAvatarPicker(false);
      showMessage('success', t('profile.avatarUpdateSuccess', 'Avatar updated successfully!'));
    } catch (error) {
      console.error('Error saving avatar:', error);
      showMessage('error', t('profile.avatarUpdateError', 'Failed to update avatar.'));
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateUserProfile({ displayName: displayName.trim(), birthday, city });
      setHasUnsavedChanges(false);
      showMessage('success', t('profile.saveSuccess', 'Settings saved successfully!'));
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', t('profile.saveError', 'Failed to save settings.'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const journalRef = collection(db, 'users', currentUser.uid, 'journal');
      const snapshot = await getDocs(journalRef);
      const data = [];
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kairos-journal-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      showMessage('success', t('dataPrivacy.exportSuccess', 'Data exported successfully!'));
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', t('dataPrivacy.exportError', 'Failed to export data.'));
    }
  };

  const resetDeleteModal = () => {
    setDeleteStep(1);
    setDeletePassword('');
    setDeleteConfirmation('');
    setDeleteError('');
    setIsDeleting(false);
    setDeletionProgress('');
  };

  const handleOpenDeleteDialog = () => {
    resetDeleteModal();
    setShowDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setShowDeleteDialog(false);
      resetDeleteModal();
    }
  };

  const handleDeleteNextStep = () => {
    setDeleteError('');
    if (deleteStep === 2 && !deletePassword) {
      setDeleteError(t('deleteAccount.errorEnterPassword', 'Please enter your password'));
      return;
    }
    setDeleteStep(deleteStep + 1);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setDeleteError(t('deleteAccount.errorTypeDelete', 'Please type DELETE to confirm'));
      return;
    }

    setIsDeleting(true);
    setDeleteStep(4);
    setDeleteError('');

    try {
      setDeletionProgress(t('deleteAccount.progressVerifying', 'Verifying your identity...'));
      await new Promise(resolve => setTimeout(resolve, 500));
      setDeletionProgress(t('deleteAccount.progressDeletingEntries', 'Deleting journal entries...'));
      await new Promise(resolve => setTimeout(resolve, 500));
      setDeletionProgress(t('deleteAccount.progressRemovingFiles', 'Removing uploaded files...'));
      await new Promise(resolve => setTimeout(resolve, 500));
      setDeletionProgress(t('deleteAccount.progressDeletingProfile', 'Deleting your profile...'));

      const result = await deleteUserAccount(currentUser.uid, deletePassword);

      if (result.success) {
        setDeletionProgress(t('deleteAccount.progressDone', 'Account deleted successfully'));
        setDeleteStep(5);
        setTimeout(async () => { await logout(); }, 3000);
      } else {
        setDeleteError(result.error || t('deleteAccount.errorGeneric', 'Failed to delete account'));
        setDeleteStep(3);
        setIsDeleting(false);
      }
    } catch (err) {
      console.error('Delete account error:', err);
      setDeleteError(t('deleteAccount.errorUnexpected', 'An unexpected error occurred. Please try again.'));
      setDeleteStep(3);
      setIsDeleting(false);
    }
  };

  const toggleNotification = async (key) => {
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);
    try {
      await updateUserProfile({ notifications: newNotifications });
      showMessage('success', t('notifications.updateSuccess', 'Notification preferences updated!'));
    } catch (error) {
      console.error('Error:', error);
      showMessage('error', t('notifications.updateError', 'Failed to update preferences.'));
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const memberSince = currentUser?.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : t('account.unknown', 'Unknown');

  const isArtisan = hasArtisanAccess(subscription);

  const renderDeleteModalContent = () => {
    switch (deleteStep) {
      case 1:
        return (
          <>
            <div className="settings-modal-header">
              <AlertTriangle size={32} className="settings-modal-icon-danger" />
              <h2>{t('deleteAccount.step1Title', 'Delete Account')}</h2>
              <p>{t('deleteAccount.step1Subtitle', 'This action cannot be undone')}</p>
            </div>
            <div className="settings-modal-content">
              <div className="settings-warning-box">
                <h3>{t('deleteAccount.willDeleteTitle', 'This will permanently delete:')}</h3>
                {loadingSummary ? (
                  <div className="settings-loading-summary">
                    <Loader size={20} className="animate-spin" />
                    <span>{t('deleteAccount.calculating', 'Calculating your data...')}</span>
                  </div>
                ) : (
                  <ul>
                    <li><FileText size={16} />{t('deleteAccount.journalEntriesCount', '{{count}} journal entries', { count: dataSummary?.journalEntries || statistics.totalEntries || 0 })}</li>
                    <li><Image size={16} />{t('deleteAccount.allPhotos', 'All uploaded photos and images')}</li>
                    <li><Mic size={16} />{t('deleteAccount.allVoice', 'All voice recordings')}</li>
                    <li><User size={16} />{t('deleteAccount.profileAndPrefs', 'Your profile and preferences')}</li>
                    <li><Sparkles size={16} />{t('deleteAccount.aiInsights', 'All AI-generated insights')}</li>
                  </ul>
                )}
              </div>
            </div>
            <div className="settings-modal-actions">
              <button className="settings-modal-btn settings-modal-btn-cancel" onClick={handleCloseDeleteDialog}>{t('deleteAccount.cancel', 'Cancel')}</button>
              <button className="settings-modal-btn settings-modal-btn-danger" onClick={handleDeleteNextStep}>{t('deleteAccount.continue', 'Continue')}</button>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="settings-modal-header">
              <Lock size={32} className="settings-modal-icon-lock" />
              <h2>{t('deleteAccount.step2Title', 'Verify Your Identity')}</h2>
              <p>{t('deleteAccount.step2Subtitle', 'Enter your password to continue')}</p>
            </div>
            <div className="settings-modal-content">
              <div className="settings-delete-input-group">
                <label>{t('deleteAccount.passwordLabel', 'Password')}</label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder={t('deleteAccount.passwordPlaceholder', 'Enter your password')}
                  className="settings-delete-input"
                  autoComplete="current-password"
                />
              </div>
              {deleteError && (
                <div className="settings-delete-error">
                  <AlertTriangle size={16} />
                  <span>{deleteError}</span>
                </div>
              )}
            </div>
            <div className="settings-modal-actions">
              <button className="settings-modal-btn settings-modal-btn-cancel" onClick={() => setDeleteStep(1)}>{t('deleteAccount.back', 'Back')}</button>
              <button className="settings-modal-btn settings-modal-btn-danger" onClick={handleDeleteNextStep} disabled={!deletePassword}>{t('deleteAccount.continue', 'Continue')}</button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="settings-modal-header">
              <AlertTriangle size={32} className="settings-modal-icon-danger" />
              <h2>{t('deleteAccount.step3Title', 'Final Confirmation')}</h2>
              <p>{t('deleteAccount.step3Subtitle', 'This is your last chance to cancel')}</p>
            </div>
            <div className="settings-modal-content">
              <p className="settings-delete-instruction">{t('deleteAccount.typeToConfirmPrefix', 'To confirm deletion, type')} <strong>DELETE</strong> {t('deleteAccount.typeToConfirmSuffix', 'below:')}</p>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value.toUpperCase())}
                className="settings-delete-input settings-delete-input-confirm"
                placeholder={t('deleteAccount.confirmPlaceholder', 'Type DELETE to confirm')}
                autoComplete="off"
              />
              {deleteError && (
                <div className="settings-delete-error">
                  <AlertTriangle size={16} />
                  <span>{deleteError}</span>
                </div>
              )}
            </div>
            <div className="settings-modal-actions">
              <button className="settings-modal-btn settings-modal-btn-cancel" onClick={() => setDeleteStep(2)}>{t('deleteAccount.back', 'Back')}</button>
              <button className="settings-modal-btn settings-modal-btn-danger" onClick={handleDeleteAccount} disabled={deleteConfirmation !== 'DELETE'}>
                <Trash2 size={18} />
                {t('deleteAccount.deleteForever', 'Delete My Account Forever')}
              </button>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className="settings-modal-header">
              <Loader size={32} className="animate-spin settings-modal-icon-loading" />
              <h2>{t('deleteAccount.step4Title', 'Deleting Account...')}</h2>
              <p>{t('deleteAccount.step4Subtitle', "Please don't close this window")}</p>
            </div>
            <div className="settings-modal-content settings-modal-content-center">
              <p className="settings-delete-progress-text">{deletionProgress}</p>
              <div className="settings-delete-progress-bar"><div className="settings-delete-progress-fill" /></div>
            </div>
          </>
        );
      case 5:
        return (
          <>
            <div className="settings-modal-header">
              <Check size={32} className="settings-modal-icon-success" />
              <h2>{t('deleteAccount.step5Title', 'Account Deleted')}</h2>
              <p>{t('deleteAccount.step5Subtitle', 'Your data has been permanently removed')}</p>
            </div>
            <div className="settings-modal-content settings-modal-content-center">
              <p>{t('deleteAccount.thankYou', 'Thank you for using Καιρός.')}</p>
              <p className="settings-delete-redirect">{t('deleteAccount.redirecting', 'Redirecting to welcome screen...')}</p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`settings-container ${isDarkMode ? 'settings-dark' : 'settings-light'}`}>
      {/* Header */}
      <header className="settings-header">
        <button className="settings-back-btn" onClick={onBack || (() => navigateToScreen('home'))}>
          <ArrowLeft size={20} />
        </button>
        <div className="settings-header-content">
          <h1 className="settings-title">{t('header.title', 'Settings')}</h1>
          <p className="settings-subtitle">{t('header.subtitle', 'Manage your account & preferences')}</p>
        </div>
      </header>

      {/* Toast */}
      {message.text && (
        <div className={`settings-message settings-message-${message.type}`}>
          {message.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Account */}
      <section className="settings-section">
        <div className="settings-card settings-account-card">
          <button className="settings-account-avatar" onClick={() => setShowAvatarPicker(true)}>
            <ArtisanMonogram
              source={currentUser?.photoURL}
              initials={initials}
              theme={avatarTheme}
              size={72}
            />
            <span className="settings-avatar-edit-badge"><Camera size={14} /></span>
          </button>
          <div className="settings-account-details">
            <h3 className="settings-account-name">{displayName || t('account.defaultName', 'Journaler')}</h3>
            <p className="settings-account-email">{currentUser?.email}</p>
            <div className="settings-account-meta">
              <span className={`settings-account-badge ${isArtisan ? 'badge-artisan' : 'badge-free'}`}>
                {loadingSubscription ? (
                  <><RefreshCw size={13} className="animate-spin" />{t('account.loading', 'Loading…')}</>
                ) : isArtisan ? (
                  <><Crown size={13} />{t('account.artisan', 'Artisan')}</>
                ) : (
                  <><User size={13} />{t('account.freePlan', 'Free Plan')}</>
                )}
              </span>
              <span className="settings-account-since"><Calendar size={13} />{t('account.since', 'Since {{date}}', { date: memberSince })}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Profile */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title"><User size={18} />{t('profile.sectionTitle', 'Profile')}</h2>
        </div>
        <div className="settings-card">
          <div className="settings-form-group">
            <label className="settings-label">{t('profile.displayNameLabel', 'Display Name')}</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => { setDisplayName(e.target.value); setHasUnsavedChanges(true); }}
              className="settings-input"
              placeholder={t('profile.displayNamePlaceholder', 'Your name')}
            />
          </div>

          <div className="settings-form-group">
            <label className="settings-label">{t('profile.emailLabel', 'Email Address')}</label>
            <input type="email" value={currentUser?.email || ''} className="settings-input settings-input-disabled" disabled />
            <span className="settings-hint">{t('profile.emailHint', 'Email cannot be changed')}</span>
          </div>

          <div className="settings-form-group">
            <label className="settings-label">{t('profile.birthdayLabel', 'Birthday')} <span className="settings-optional">{t('profile.optional', 'Optional')}</span></label>
            <div className="settings-input-wrapper">
              <Calendar size={18} className="settings-input-icon" />
              <input
                type="date"
                value={birthday}
                onChange={(e) => { setBirthday(e.target.value); setHasUnsavedChanges(true); }}
                className="settings-input"
              />
            </div>
          </div>

          <div className="settings-form-group">
            <label className="settings-label">{t('profile.cityLabel', 'City')} <span className="settings-optional">{t('profile.optional', 'Optional')}</span></label>
            <div className="settings-input-wrapper">
              <MapPin size={18} className="settings-input-icon" />
              <input
                ref={cityInputRef}
                type="text"
                value={city}
                onChange={(e) => { setCity(e.target.value); setHasUnsavedChanges(true); }}
                className="settings-input"
                placeholder={t('profile.cityPlaceholder', 'Enter your city')}
              />
            </div>
          </div>

          {hasUnsavedChanges && (
            <button className="settings-save-btn" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (<><RefreshCw size={18} className="animate-spin" />{t('profile.saving', 'Saving…')}</>) : (<><Save size={18} />{t('profile.saveChanges', 'Save Changes')}</>)}
            </button>
          )}
        </div>
      </section>

      {/* Subscription */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title"><Crown size={18} />{t('subscriptionSection.sectionTitle', 'Subscription')}</h2>
        </div>
        <div className="settings-card">
          {loadingSubscription ? (
            <div className="settings-loading">{t('subscriptionSection.loading', 'Loading subscription…')}</div>
          ) : isArtisan ? (
            <>
              <div className="settings-subscription-status artisan">
                <div className="settings-subscription-icon"><Crown size={22} /></div>
                <div className="settings-subscription-info">
                  <h3>{t('subscriptionSection.artisanTitle', 'Artisan Member')}</h3>
                  <p>{t('subscriptionSection.artisanDescription', 'You have access to all premium features')}</p>
                </div>
              </div>
              <button className="settings-btn settings-btn-secondary" onClick={handleManageSubscription} disabled={processingPortal}>
                <CreditCard size={18} />{t('subscriptionSection.manageButton', 'Manage Subscription')}<ExternalLink size={15} />
              </button>
            </>
          ) : (
            <>
              <div className="settings-subscription-status free">
                <div className="settings-subscription-info">
                  <h3>{t('subscriptionSection.freeTitle', 'Free Plan')}</h3>
                  <p>{t('subscriptionSection.freeDescription', 'Upgrade to Artisan for unlimited features')}</p>
                </div>
              </div>
              <button className="settings-btn settings-btn-primary" onClick={handleUpgrade} disabled={processingUpgrade}>
                <Sparkles size={18} />{t('subscriptionSection.upgradeButton', 'Upgrade to Artisan')}
              </button>
            </>
          )}
        </div>
      </section>

      {/* Preferences (Appearance + Notifications) */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title"><Bell size={18} />{t('preferences.sectionTitle', 'Preferences')}</h2>
        </div>
        <div className="settings-card">
          {/* Theme */}
          <div className="settings-preference-item">
            <div className="settings-preference-info">
              <h3>{t('preferences.themeTitle', 'Theme')}</h3>
              <p>{t('preferences.themeDescription', 'Choose your preferred color scheme')}</p>
            </div>
            <button className="settings-theme-btn" onClick={toggleTheme}>
              <div className={`settings-theme-btn-track ${isDarkMode ? 'active' : ''}`}>
                <div className="settings-theme-btn-thumb">{isDarkMode ? <Moon size={13} /> : <Sun size={13} />}</div>
              </div>
              <span>{isDarkMode ? t('theme.dark', 'Dark') : t('theme.light', 'Light')}</span>
            </button>
          </div>

          <div className="settings-divider" />

          {/* Language */}
          <div className="settings-preference-item">
            <div className="settings-preference-info">
              <h3>{t('language.title', 'Language')}</h3>
              <p>{t('language.description', 'Choose your preferred app language')}</p>
            </div>
            <button
              className="settings-theme-btn"
              onClick={() => i18n.changeLanguage(i18n.resolvedLanguage === 'de' ? 'en' : 'de')}
            >
              <div className={`settings-theme-btn-track ${i18n.resolvedLanguage === 'de' ? 'active' : ''}`}>
                <div className="settings-theme-btn-thumb">{i18n.resolvedLanguage === 'de' ? 'DE' : 'EN'}</div>
              </div>
              <span>{i18n.resolvedLanguage === 'de' ? t('language.german', 'Deutsch') : t('language.english', 'English')}</span>
            </button>
          </div>

          <div className="settings-divider" />

          {[
            { key: 'dailyReminder', title: t('notifications.dailyReminderTitle', 'Daily Journaling Reminder'), desc: t('notifications.dailyReminderDescription', 'Get reminded to journal every day') },
            { key: 'weeklyInsights', title: t('notifications.weeklyInsightsTitle', 'Weekly Insights Summary'), desc: t('notifications.weeklyInsightsDescription', 'Receive AI insights every week') },
            { key: 'pathCompletion', title: t('notifications.pathCompletionTitle', 'Path Completion Alerts'), desc: t('notifications.pathCompletionDescription', 'Celebrate when you complete a journey') }
          ].map(({ key, title, desc }) => (
            <div className="settings-preference-item" key={key}>
              <div className="settings-preference-info">
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
              <button
                className={`settings-toggle-btn ${notifications[key] ? 'active' : ''}`}
                onClick={() => toggleNotification(key)}
                aria-pressed={notifications[key]}
              >
                <div className="settings-toggle-track"><div className="settings-toggle-thumb" /></div>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Data Management */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title"><Database size={18} />{t('dataPrivacy.sectionTitle', 'Data & Privacy')}</h2>
        </div>
        <div className="settings-card">
          <div className="settings-data-stats">
            <div className="settings-data-stat">
              <FileText size={18} />
              <div>
                <span className="settings-data-stat-value">{statistics.totalEntries}</span>
                <span className="settings-data-stat-label">{t('dataPrivacy.journalEntriesLabel', 'Journal Entries')}</span>
              </div>
            </div>
            <div className="settings-data-stat">
              <Sparkles size={18} />
              <div>
                <span className="settings-data-stat-value">{statistics.totalInsights || 0}</span>
                <span className="settings-data-stat-label">{t('dataPrivacy.insightsGeneratedLabel', 'Insights Generated')}</span>
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button className="settings-btn settings-btn-secondary" onClick={handleExport}>
              <Download size={18} />{t('dataPrivacy.exportButton', 'Export My Data')}
            </button>
            <button className="settings-btn settings-btn-danger" onClick={handleOpenDeleteDialog}>
              <Trash2 size={18} />{t('dataPrivacy.deleteAccountButton', 'Delete Account')}
            </button>
          </div>
        </div>
      </section>

      {/* Help & About */}
      <section className="settings-section">
        <div className="settings-section-header">
          <h2 className="settings-section-title"><HelpCircle size={18} />{t('helpAbout.sectionTitle', 'Help & About')}</h2>
        </div>
        <div className="settings-card">
          <div className="settings-link-list">
            <a href="mailto:support@kairos-journal.com" className="settings-link-row">
              <div className="settings-link-icon" style={{ '--lc': '245, 158, 11' }}><Mail size={16} /></div>
              <span>{t('helpAbout.contactSupport', 'Contact Support')}</span>
              <ChevronRight size={16} className="settings-link-chevron" />
            </a>
            <button className="settings-link-row" onClick={() => navigateToScreen('help')}>
              <div className="settings-link-icon" style={{ '--lc': '59, 130, 246' }}><HelpCircle size={16} /></div>
              <span>{t('helpAbout.faqHelpCenter', 'FAQ & Help Center')}</span>
              <ChevronRight size={16} className="settings-link-chevron" />
            </button>
            <button className="settings-link-row" onClick={() => navigateToScreen('terms')}>
              <div className="settings-link-icon" style={{ '--lc': '148, 163, 184' }}><FileText size={16} /></div>
              <span>{t('helpAbout.termsOfService', 'Terms of Service')}</span>
              <ChevronRight size={16} className="settings-link-chevron" />
            </button>
            <button className="settings-link-row" onClick={() => navigateToScreen('privacy')}>
              <div className="settings-link-icon" style={{ '--lc': '16, 185, 129' }}><Shield size={16} /></div>
              <span>{t('helpAbout.privacyPolicy', 'Privacy Policy')}</span>
              <ChevronRight size={16} className="settings-link-chevron" />
            </button>
            <button className="settings-link-row" onClick={() => navigateToScreen('about')}>
              <div className="settings-link-icon" style={{ '--lc': '139, 92, 246' }}><Info size={16} /></div>
              <span>{t('helpAbout.aboutKairos', 'About Καιρός')}</span>
              <ChevronRight size={16} className="settings-link-chevron" />
            </button>
          </div>
        </div>

        <div className="settings-version">
          <VersionDisplay minimal />
        </div>
      </section>

      {/* Delete Account Modal */}
      {showDeleteDialog && (
        <div className="settings-modal-overlay" onClick={handleCloseDeleteDialog}>
          <div className="settings-modal settings-delete-modal" onClick={(e) => e.stopPropagation()}>
            {renderDeleteModalContent()}
          </div>
        </div>
      )}

      {/* Avatar Picker */}
      {showAvatarPicker && (
        <MonogramPicker
          currentTheme={avatarTheme}
          initials={initials}
          onSelect={handleAvatarSave}
          onClose={() => setShowAvatarPicker(false)}
        />
      )}
    </div>
  );
};

export default UserSettings;
