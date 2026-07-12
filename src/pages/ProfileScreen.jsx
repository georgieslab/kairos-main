// src/pages/ProfileScreen.jsx - Apple Glass Edition
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LogOut, ChevronRight, Mail, MapPin, Calendar,
  Award, Crown, Compass, Camera, Settings, Info, HelpCircle,
  BookOpen, Archive, Radio, Activity, CloudSun
} from 'lucide-react';
import MoodTrends from '../components/analytics/MoodTrends';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useUserStatistics } from '../hooks/useUserStatistics';
import { useUserProgress } from '../hooks/useUserProgress';
import { hasArtisanAccess } from '../services/SubscriptionService';
import { getSubscriptionStatus } from '../services/SubscriptionService';
import VersionDisplay from '../components/common/VersionDisplay';
import DynamicIcon from '../components/common/DynamicIcon';
import ArtisanMonogram, { MonogramPicker } from '../components/common/ArtisanMonogram';
import EditProfile from '../components/profile/EditProfile';
import JournalRegistration from '../components/journal/JournalRegistration';
import MyJournalsList from '../components/journal/MyJournalsList';
import AchievementsModal, { ACHIEVEMENT_DEFINITIONS } from '../components/achievements/AchievementsModal';
import { MOODS } from '../constants/moods'; // <-- NEW: shared moods
import '../styles/components/appleGlassNav.css';
import '../styles/components/profile.css';

const ProfileScreen = ({ handleSignOut }) => {
  const { t } = useTranslation('profile');
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const navigation = useNavigation();
  const { statistics } = useUserStatistics();
  const { inProgressPaths, completedPaths } = useUserProgress();

  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showJournalsList, setShowJournalsList] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Load subscription
  useState(() => {
    if (currentUser) {
      getSubscriptionStatus(currentUser.uid, true)
        .then(setSubscription)
        .catch(() => setSubscription({ status: 'free' }));
    }
  }, [currentUser]);

  const displayName = userProfile?.displayName || t('profileScreen.defaultDisplayName', 'Journaler');
  const email = currentUser?.email || '';
  const city = userProfile?.city || null;
  const avatarTheme = userProfile?.avatarTheme || 'parchment';
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'K';
  const memberSince = currentUser?.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : t('profileScreen.recently', 'Recently');

  const isArtisan = hasArtisanAccess(subscription);
  const achievements = Object.values(ACHIEVEMENT_DEFINITIONS).filter(a => a.requirement(statistics));
  const totalScore = achievements.reduce((sum, a) => sum + a.points, 0);
  const activePathColor = inProgressPaths?.[0]?.color || '85, 139, 110';

  const handleProfileSave = async (updated) => {
    await updateUserProfile(updated);
  };

  const handleAvatarSave = async (themeKey) => {
    try {
      await updateUserProfile({ avatarTheme: themeKey });
    } catch (error) {
      console.error("Failed to update avatar theme", error);
    }
  };

  return (
    <div className="glass-profile" style={{ '--path-color': activePathColor }}>
      {/* ===== HEADER ===== */}
      <header className="profile-header">
        <div className="profile-avatar-container" onClick={() => setShowAvatarPicker(true)}>
          <ArtisanMonogram
            source={currentUser?.photoURL}
            initials={initials}
            theme={avatarTheme}
            pathColor={activePathColor}
            size={96}
          />
          <div className="profile-avatar-edit-overlay">
            <Camera size={16} />
          </div>
          {isArtisan && (
            <div className="profile-artisan-pill">
              <Crown size={12} />
              <span>{t('profileScreen.artisan', 'Artisan')}</span>
            </div>
          )}
        </div>

        <h1 className="profile-name">{displayName}</h1>

        <div className="profile-meta">
          <span className="profile-meta-item">
            <Mail size={13} />
            {email}
          </span>
          {city && (
            <span className="profile-meta-item">
              <MapPin size={13} />
              {city}
            </span>
          )}
          <span className="profile-meta-item">
            <Calendar size={13} />
            {t('profileScreen.since', 'Since {{date}}', { date: memberSince })}
          </span>
        </div>

        <button
          className="profile-edit-main-btn"
          onClick={() => setShowEditProfile(true)}
        >
          {t('profileScreen.editProfile', 'Edit Profile')}
        </button>
      </header>

      {/* ===== STATS ===== */}
      <section className="profile-stats-section">
        <div className="glass-stats-row">
          <button
            className="glass-stat-item"
            onClick={() => navigation.navigateToScreen('analytics-dashboard')}
          >
            <div className="glass-stat-icon stat-entries">
              <Activity size={16} />
            </div>
            <div className="glass-stat-data">
              <span className="glass-stat-value">{statistics.totalEntries}</span>
              <span className="glass-stat-label">{t('profileScreen.stats.entries', 'Entries')}</span>
            </div>
          </button>

          <button
            className="glass-stat-item"
            onClick={() => navigation.navigateToScreen('analytics-dashboard')}
          >
            <div className="glass-stat-icon stat-streak">
              <Award size={16} />
            </div>
            <div className="glass-stat-data">
              <span className="glass-stat-value">{statistics.currentStreak || 0}</span>
              <span className="glass-stat-label">{t('profileScreen.stats.dayStreak', 'Day Streak')}</span>
            </div>
          </button>

          <button
            className="glass-stat-item"
            onClick={() => navigation.navigateToScreen('path-selection')}
          >
            <div className="glass-stat-icon stat-active">
              <Compass size={16} />
            </div>
            <div className="glass-stat-data">
              <span className="glass-stat-value">{inProgressPaths.length}</span>
              <span className="glass-stat-label">{t('profileScreen.stats.active', 'Active')}</span>
            </div>
          </button>

          <button
            className="glass-stat-item"
            onClick={() => navigation.navigateToScreen('path-selection')}
          >
            <div className="glass-stat-icon stat-completed">
              <Award size={16} />
            </div>
            <div className="glass-stat-data">
              <span className="glass-stat-value">{completedPaths.length}</span>
              <span className="glass-stat-label">{t('profileScreen.stats.completed', 'Completed')}</span>
            </div>
          </button>
        </div>
      </section>

      {/* ===== ACTIVE JOURNEYS ===== */}
      {inProgressPaths.length > 0 && (
        <section className="profile-section">
          <div className="glass-section-header">
            <h3 className="glass-section-title">{t('profileScreen.activeJourneys', 'Active Journeys')}</h3>
            {inProgressPaths.length > 2 && (
              <button
                className="glass-section-link"
                onClick={() => navigation.navigateToScreen('path-selection')}
              >
                {t('profileScreen.viewAll', 'View All')}
                <ChevronRight size={14} />
              </button>
            )}
          </div>

          <div className="glass-journeys-list">
            {inProgressPaths.slice(0, 2).map((journey, index) => (
              <React.Fragment key={journey.id}>
                {index > 0 && <div className="glass-divider" />}
                <button
                  className="glass-journey-row"
                  onClick={() => navigation.navigateToScreen('daily', {
                    pathId: journey.id,
                    day: journey.nextDay
                  })}
                >
                  <div
                    className="glass-journey-icon"
                    style={{
                      background: `rgba(${journey.color}, 0.12)`,
                      color: `rgb(${journey.color})`
                    }}
                  >
                    <DynamicIcon name={journey.iconName} size={18} />
                  </div>
                  <div className="glass-journey-info">
                    <span className="glass-journey-title">{journey.title}</span>
                    <div className="glass-journey-meta">
                      <span>{t('profileScreen.dayOf', 'Day {{day}} of {{total}}', { day: journey.nextDay, total: journey.totalDays })}</span>
                      <div className="glass-journey-progress-mini">
                        <div
                          className="glass-journey-fill"
                          style={{ width: `${journey.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="glass-journey-chevron" />
                </button>
              </React.Fragment>
            ))}
          </div>
        </section>
      )}

      {/* ===== MOOD BOARD ===== */}
      <section className="profile-section">
        <div className="glass-section-header">
          <h3 className="glass-section-title">
            <CloudSun size={16} />
            {t('profileScreen.moodBoard', 'Mood Board')}
          </h3>
        </div>
        <div className="glass-mood-board-card">
          {/* Pass the shared MOODS to the trend component */}
          <MoodTrends moods={MOODS} />
        </div>
      </section>

      {/* ===== ACHIEVEMENTS PREVIEW ===== */}
      {achievements.length > 0 && (
        <section className="profile-section">
          <div className="glass-section-header">
            <h3 className="glass-section-title">
              <span className="section-icon-glow">🏆</span>
              {t('profileScreen.achievements', 'Achievements')}
            </h3>
            <button
              className="glass-section-link"
              onClick={() => setShowAchievements(true)}
            >
              {t('profileScreen.pts', '{{score}} pts', { score: totalScore })}
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="glass-achievements-preview">
            {achievements.slice(0, 2).map(achievement => (
              <div
                key={achievement.id}
                className="glass-achievement-row"
                style={{ '--achievement-color': achievement.colorRgb || '85, 139, 110' }}
              >
                <div className="achievement-preview-icon">
                  <achievement.icon size={18} />
                </div>
                <div className="achievement-preview-info">
                  <span className="achievement-preview-title">{achievement.title}</span>
                  <span className="achievement-preview-pts">{t('profileScreen.plusPts', '+{{points}} pts', { points: achievement.points })}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== ACTIONS ===== */}
      <section className="profile-section">
        <div className="glass-section-header">
          <h3 className="glass-section-title">{t('profileScreen.journalAndData', 'Journal & Data')}</h3>
        </div>

        <div className="glass-actions-grid">
          {userProfile?.journals?.length > 0 ? (
            <button
              className="glass-action-card featured"
              onClick={() => setShowJournalsList(true)}
            >
              <div className="glass-action-icon featured">
                <BookOpen size={18} />
              </div>
              <div className="glass-action-content">
                <span className="glass-action-label">{t('profileScreen.myJournals', 'My Journals')}</span>
                <span className="glass-action-badge">{userProfile.journals.length}</span>
              </div>
            </button>
          ) : (
            <button
              className="glass-action-card featured"
              onClick={() => setShowRegistration(true)}
            >
              <div className="glass-action-icon featured">
                <Radio size={18} />
              </div>
              <div className="glass-action-content">
                <span className="glass-action-label">{t('profileScreen.registerJournal', 'Register Journal')}</span>
                <span className="glass-action-badge new">{t('profileScreen.new', 'New')}</span>
              </div>
            </button>
          )}

          <button
            className="glass-action-card"
            onClick={() => navigation.navigateToScreen('journal-archive')}
          >
            <div className="glass-action-icon">
              <Archive size={18} />
            </div>
            <span className="glass-action-label">{t('profileScreen.archive', 'Archive')}</span>
          </button>

          <button
            className="glass-action-card"
            onClick={() => navigation.navigateToScreen('settings')}
          >
            <div className="glass-action-icon">
              <Settings size={18} />
            </div>
            <span className="glass-action-label">{t('profileScreen.settings', 'Settings')}</span>
          </button>
        </div>
      </section>

      {/* ===== SUPPORT LINKS ===== */}
      <section className="profile-section">
        <div className="glass-links-card">
          <button
            className="glass-link-row"
            onClick={() => navigation.navigateToScreen('settings', { activeSection: 'help' })}
          >
            <div className="glass-link-icon" style={{ '--link-color': '245, 158, 11' }}>
              <HelpCircle size={16} />
            </div>
            <span className="glass-link-label">{t('profileScreen.helpAndSupport', 'Help & Support')}</span>
            <ChevronRight size={14} className="glass-link-chevron" />
          </button>

          <div className="glass-divider" />

          <button
            className="glass-link-row"
            onClick={() => navigation.navigateToScreen('about')}
          >
            <div className="glass-link-icon">
              <Info size={16} />
            </div>
            <span className="glass-link-label">{t('profileScreen.aboutKairos', 'About Καιρός')}</span>
            <ChevronRight size={14} className="glass-link-chevron" />
          </button>
        </div>
      </section>

      {/* ===== SIGN OUT ===== */}
      <section className="profile-section">
        <button
          className="glass-signout-btn"
          onClick={() => setShowSignOutDialog(true)}
        >
          <LogOut size={16} />
          {t('profileScreen.signOut', 'Sign Out')}
        </button>
      </section>

      {/* Version */}
      <div className="glass-version">
        <VersionDisplay minimal />
      </div>

      {/* ===== MODALS ===== */}

      {/* Sign Out Dialog */}
      {showSignOutDialog && (
        <div className="glass-modal-overlay" onClick={() => setShowSignOutDialog(false)}>
          <div className="glass-modal" onClick={e => e.stopPropagation()}>
            <div className="glass-modal-header">
              <h3>{t('profileScreen.signOut', 'Sign Out')}</h3>
            </div>
            <div className="glass-modal-body">
              <p>{t('profileScreen.signOutConfirm', 'Are you sure you want to sign out of Καιρός?')}</p>
            </div>
            <div className="glass-modal-footer">
              <button
                className="glass-modal-btn glass-modal-btn-secondary"
                onClick={() => setShowSignOutDialog(false)}
              >
                {t('profileScreen.cancel', 'Cancel')}
              </button>
              <button
                className="glass-modal-btn glass-modal-btn-danger"
                onClick={() => {
                  setShowSignOutDialog(false);
                  if (handleSignOut) handleSignOut();
                }}
              >
                {t('profileScreen.signOut', 'Sign Out')}
              </button>
            </div>
          </div>
        </div>
      )}

      <JournalRegistration
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
        onComplete={(data) => {
          setShowRegistration(false);
          window.location.reload();
        }}
      />

      <MyJournalsList
        isOpen={showJournalsList}
        onClose={() => setShowJournalsList(false)}
        onRegisterAnother={() => {
          setShowJournalsList(false);
          setTimeout(() => setShowRegistration(true), 300);
        }}
      />

      <AchievementsModal
        isOpen={showAchievements}
        onClose={() => setShowAchievements(false)}
        statistics={statistics}
      />

      <EditProfile
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        currentProfile={{
          displayName,
          email,
          city,
          avatarTheme
        }}
        onSave={handleProfileSave}
      />

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

export default ProfileScreen;