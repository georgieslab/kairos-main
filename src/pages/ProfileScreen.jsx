// src/pages/ProfileScreen.jsx - Redesigned v3.0 (With Avatar)

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  HelpCircle, 
  LogOut, 
  BookOpen, 
  ChevronRight, 
  Info,
  Trophy,
  Flame,
  Archive,
  BarChart3,
  Crown,
  Compass,
  MapPin,
  Mail,
  Award,
  Zap,
  Activity,
  FileText,
  LayoutGrid,
  Calendar,
  Radio,
  Camera,
  Sun,
  Heart,
  Sparkles,
  Target,
  User
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useUserStatistics } from '../hooks/useUserStatistics';
import { useUserProgress } from '../hooks/useUserProgress';
import { getSubscriptionStatus, hasArtisanAccess } from '../services/SubscriptionService';
import { rebuildUserProgress } from '../utils/rebuildProgress';
import KairosLoader from '../components/common/KairosLoader';
import VersionDisplay from '../components/common/VersionDisplay';
import DynamicIcon from '../components/common/DynamicIcon';
import JournalRegistration from '../components/journal/JournalRegistration';
import MyJournalsList from '../components/journal/MyJournalsList';
import AchievementsModal, { ACHIEVEMENT_DEFINITIONS } from '../components/achievements/AchievementsModal';
import Avatar, { AvatarPicker } from '../components/common/Avatar';
import EditProfile from '../components/profile/EditProfile';
import TopBar from '../components/common/TopBar';
import '../styles/components/profile.css';
import '../styles/components/avatar.css';
import '../styles/components/editProfile.css';

const ProfileScreen = ({ handleSignOut }) => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();
  const { statistics, isLoading: statsLoading } = useUserStatistics();
  const { inProgressPaths, hasActiveJourneys } = useUserProgress();

  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [rebuildingProgress, setRebuildingProgress] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showJournalsList, setShowJournalsList] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const displayName = userProfile?.displayName || 'Journaler';
  const email = currentUser?.email || '';
  const city = userProfile?.city || null;
  const avatarStyle = userProfile?.avatarStyle || 'forest';
  const avatarPattern = userProfile?.avatarPattern || 'dots';
  const avatarFont = userProfile?.avatarFont || 'sans';
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'K';
  const memberSince = currentUser?.metadata?.creationTime 
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      })
    : 'Recently';

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        setLoadingSubscription(true);
        const status = await getSubscriptionStatus(currentUser.uid, true);
        console.log('🔍 ProfileScreen - Loaded subscription:', status);
        setSubscription(status);
      } catch (error) {
        console.error('Error loading subscription:', error);
        setSubscription({ status: 'free' });
      } finally {
        setLoadingSubscription(false);
      }
    };

    if (currentUser) {
      loadSubscription();
    }
  }, [currentUser]);

  useEffect(() => {
    const loadProfile = async () => {
      setLoadingProgress(20);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (!statsLoading) {
        setLoadingProgress(60);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      if (!loadingSubscription) {
        setLoadingProgress(85);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      setLoadingProgress(100);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setShowLoader(false);
      setIsLoaded(true);
    };
    
    if (currentUser && !statsLoading && !loadingSubscription) {
      loadProfile();
    }
  }, [currentUser, statsLoading, loadingSubscription]);

  useEffect(() => {
    document.body.style.overflow = showSignOutDialog ? 'hidden' : 'unset';
  }, [showSignOutDialog]);

  const isArtisan = hasArtisanAccess(subscription);
  console.log('🔍 ProfileScreen - isArtisan:', isArtisan, 'subscription:', subscription);
  
  // Calculate earned achievements for preview
  const achievements = Object.values(ACHIEVEMENT_DEFINITIONS).filter(achievement => 
    achievement.requirement(statistics)
  );
  
  const totalAchievementScore = achievements.reduce((sum, achievement) => sum + achievement.points, 0);

  const handleSignOutClick = () => setShowSignOutDialog(true);
  const handleConfirmSignOut = async () => {
    setShowSignOutDialog(false);
    if (handleSignOut) {
      await handleSignOut();
    }
  };

  const goToSettings = () => navigation.navigateToScreen('settings');

  const handleAvatarSave = async ({ style, pattern, font }) => {
    try {
      await updateUserProfile({
        avatarStyle: style,
        avatarPattern: pattern,
        avatarFont: font
      });
      setShowAvatarPicker(false);
    } catch (error) {
      console.error('Error saving avatar:', error);
      alert('Failed to save avatar. Please try again.');
    }
  };

  const handleProfileSave = async (updatedProfile) => {
    try {
      await updateUserProfile(updatedProfile);
      console.log('✅ Profile updated successfully');
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      throw error; // Re-throw to let EditProfile handle the error
    }
  };

  const handleRebuildProgress = async () => {
    if (!currentUser?.uid) return;
    
    try {
      setRebuildingProgress(true);
      console.log('🔄 Starting progress rebuild...');
      
      const result = await rebuildUserProgress(currentUser.uid);
      
      console.log('✅ Rebuild complete:', result);
      alert(`Progress rebuilt successfully!\n\nRebuilt ${result.pathsRebuilt} paths with ${result.totalEntries} total entries.\n\nPlease refresh the page to see your updated progress.`);
      
      // Reload the page to refresh all data
      window.location.reload();
    } catch (error) {
      console.error('❌ Rebuild failed:', error);
      alert('Failed to rebuild progress. Please try again or contact support.');
    } finally {
      setRebuildingProgress(false);
    }
  };

  return (
    <>
      {showLoader && (
        <KairosLoader 
          message="Loading your profile..."
          progress={loadingProgress}
        />
      )}

      <div className={`profile-container ${isLoaded ? 'profile-loaded' : ''} ${isDarkMode ? 'profile-dark' : 'profile-light'}`}>
        {/* Top Bar */}
        <TopBar 
          title="Profile"
          subtitle="Track your journaling journey"
          colorClass="profile-color"
        />

        {/* Header */}
        <header className="profile-header">
          {/* User Info Card - Centered Layout */}
          <div className="profile-header-card">
            {/* Avatar - Centered on Top */}
            <div className="profile-avatar-section-centered">
              <div className="profile-avatar-wrapper">
                <Avatar 
                  style={avatarStyle} 
                  pattern={avatarPattern}
                  font={avatarFont}
                  initials={initials}
                  size={120}
                  onClick={() => setShowEditProfile(true)}
                />
                <button 
                  className="profile-avatar-edit-btn" 
                  onClick={() => setShowEditProfile(true)}
                  title="Edit profile"
                >
                  <Camera size={18} />
                </button>
              </div>
            </div>

            {/* Buttons Row - Artisan & Edit Profile */}
            <div className="profile-header-buttons">
              {isArtisan && (
                <div className="profile-artisan-badge-header">
                  <Crown size={18} />
                  <span>Artisan</span>
                </div>
              )}
              
              <button 
                className="profile-edit-btn-header"
                onClick={() => setShowEditProfile(true)}
              >
                <User size={18} />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* User Details */}
            <div className="profile-user-details-centered">
              <h2 className="profile-name-centered">{displayName}</h2>
              
              <div className="profile-details-list">
                <div className="profile-detail-item-centered">
                  <Mail size={16} />
                  <span>{email}</span>
                </div>
                {city && (
                  <div className="profile-detail-item-centered">
                    <MapPin size={16} />
                    <span>{city}</span>
                  </div>
                )}
                <div className="profile-detail-item-centered">
                  <Calendar size={16} />
                  <span>Member since {memberSince}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <section className="profile-section profile-stats-section">
          <div className="profile-section-header">
            <h2 className="profile-section-title">
              <Activity className="profile-section-icon" />
              Journey Stats
            </h2>
            <button 
              className="profile-view-all-btn"
              onClick={() => navigation.navigateToScreen('analytics-dashboard')}
            >
              <span>View Analytics</span>
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="profile-stats-grid">
            <div className="profile-stat-card">
              <div className="profile-stat-header">
                <FileText className="profile-stat-icon" />
                <h4>Total Entries</h4>
              </div>
              <div className="profile-stat-value">{statistics.totalEntries}</div>
              <div className="profile-stat-subtext">journal entries</div>
            </div>
            
            <div className="profile-stat-card profile-stat-highlight">
              <div className="profile-stat-header">
                <Flame className="profile-stat-icon" />
                <h4>Current Streak</h4>
              </div>
              <div className="profile-stat-value">{statistics.currentStreak}</div>
              <div className="profile-stat-subtext">consecutive days</div>
            </div>
            
            <div className="profile-stat-card">
              <div className="profile-stat-header">
                <Activity className="profile-stat-icon" />
                <h4>Active Days</h4>
              </div>
              <div className="profile-stat-value">{statistics.activeDays}</div>
              <div className="profile-stat-subtext">days journaling</div>
            </div>
            
            <div className="profile-stat-card">
              <div className="profile-stat-header">
                <Award className="profile-stat-icon" />
                <h4>Completed</h4>
              </div>
              <div className="profile-stat-value">{statistics.completedPathsCount}</div>
              <div className="profile-stat-subtext">journeys finished</div>
            </div>
          </div>
        </section>

        {/* Active Journeys */}
        {hasActiveJourneys && inProgressPaths.length > 0 && (
          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">
                <Compass className="profile-section-icon" />
                Active Journeys ({inProgressPaths.length})
              </h2>
              {inProgressPaths.length > 3 && (
                <button 
                  className="profile-view-all-btn"
                  onClick={() => navigation.navigateToScreen('home')}
                >
                  <span>View All</span>
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
            
            <div className="profile-journeys-list">
              {inProgressPaths.slice(0, 3).map((path, index) => (
                <div key={path.id}>
                  <button 
                    className="profile-journey-card"
                    onClick={() => navigation.navigateToScreen('daily-view', { 
                      path: path.id, 
                      day: path.nextDay 
                    })}
                  >
                    <div className="profile-journey-left">
                      <div 
                        className="profile-journey-icon"
                        style={{ 
                          backgroundColor: `rgba(${path.color}, 0.15)`,
                          color: `rgb(${path.color})`
                        }}
                      >
                        <DynamicIcon name={path.iconName} size={20} />
                      </div>
                      <div className="profile-journey-info">
                        <h4 className="profile-journey-title">{path.title}</h4>
                        <p className="profile-journey-progress">
                          Day {path.nextDay} of {path.totalDays} • {path.percentage}% complete
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="profile-journey-chevron" />
                  </button>
                  {index < inProgressPaths.slice(0, 3).length - 1 && (
                    <div className="profile-separator" />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">
                <Award className="profile-section-icon" />
                Achievements ({achievements.length})
              </h2>
              <div className="profile-achievement-score">
                <Trophy size={16} />
                <span>{totalAchievementScore} pts</span>
              </div>
            </div>
            
            {/* Achievement Preview Cards - First 3 */}
            <div className="profile-achievements-grid">
              {achievements.slice(0, 3).map(achievement => {
                const IconComponent = achievement.icon;
                return (
                  <div key={achievement.id} className={`profile-achievement ${achievement.color}`}>
                    <div className="profile-achievement-icon">
                      <IconComponent size={20} />
                    </div>
                    <div className="profile-achievement-content">
                      <h4 className="profile-achievement-title">{achievement.title}</h4>
                      <p className="profile-achievement-description">{achievement.description}</p>
                      <span className="profile-achievement-points">+{achievement.points} pts</span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* View All Button */}
            {achievements.length > 3 && (
              <button 
                className="profile-view-all-achievements-btn"
                onClick={() => setShowAchievementsModal(true)}
              >
                <Award size={16} />
                View All Achievements ({achievements.length})
              </button>
            )}
            
            {achievements.length <= 3 && (
              <button 
                className="profile-view-all-achievements-btn"
                onClick={() => setShowAchievementsModal(true)}
              >
                <Award size={16} />
                View Achievement Details
              </button>
            )}
          </section>
        )}
        
        {/* Show button even if no achievements yet */}
        {achievements.length === 0 && (
          <section className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">
                <Award className="profile-section-icon" />
                Achievements
              </h2>
            </div>
            
            <button 
              className="profile-view-all-achievements-btn"
              onClick={() => setShowAchievementsModal(true)}
            >
              <Award size={16} />
              View All Achievements
            </button>
          </section>
        )}

        {/* Quick Actions */}
        <section className="profile-section profile-actions-section">
          <div className="profile-section-header">
            <h2 className="profile-section-title">
              <LayoutGrid className="profile-section-icon" />
              Quick Actions
            </h2>
          </div>
          
          <div className="profile-actions-grid">
            <button 
              className="profile-action-card"
              onClick={() => navigation.navigateToScreen('path-selection')}
            >
              <div className="profile-action-icon-wrapper">
                <Compass className="profile-action-icon" />
              </div>
              <span className="profile-action-label">Journeys</span>
              <ChevronRight className="profile-action-chevron" />
            </button>
            
            {/* Show Register Journal only if user has no journals */}
            {(!userProfile?.journals || userProfile.journals.length === 0) && (
              <button 
                className="profile-action-card profile-action-featured"
                onClick={() => setShowRegistration(true)}
              >
                <div className="profile-action-icon-wrapper">
                  <Radio className="profile-action-icon" />
                </div>
                <span className="profile-action-label">Register Journal</span>
                <ChevronRight className="profile-action-chevron" />
              </button>
            )}
            
            {/* Show My Journals if user has registered journals */}
            {userProfile?.journals && userProfile.journals.length > 0 && (
              <button 
                className="profile-action-card profile-action-featured"
                onClick={() => setShowJournalsList(true)}
              >
                <div className="profile-action-icon-wrapper">
                  <BookOpen className="profile-action-icon" />
                </div>
                <span className="profile-action-label">
                  My Journals ({userProfile.journals.length})
                </span>
                <ChevronRight className="profile-action-chevron" />
              </button>
            )}
            
            <button 
              className="profile-action-card"
              onClick={() => navigation.navigateToScreen('journal-archive')}
            >
              <div className="profile-action-icon-wrapper">
                <Archive className="profile-action-icon" />
              </div>
              <span className="profile-action-label">Archive</span>
              <ChevronRight className="profile-action-chevron" />
            </button>
            
            <button 
              className="profile-action-card"
              onClick={() => navigation.navigateToScreen('analytics-dashboard')}
            >
              <div className="profile-action-icon-wrapper">
                <BarChart3 className="profile-action-icon" />
              </div>
              <span className="profile-action-label">Analytics</span>
              <ChevronRight className="profile-action-chevron" />
            </button>
            
            <button 
              className="profile-action-card"
              onClick={goToSettings}
            >
              <div className="profile-action-icon-wrapper">
                <Settings className="profile-action-icon" />
              </div>
              <span className="profile-action-label">Settings</span>
              <ChevronRight className="profile-action-chevron" />
            </button>
            
            {/* Rebuild Progress Button - Only show if progress seems missing */}
            {statistics.totalEntries > 0 && !hasActiveJourneys && (
              <button 
                className="profile-action-card profile-action-warning"
                onClick={handleRebuildProgress}
                disabled={rebuildingProgress}
              >
                <div className="profile-action-icon-wrapper">
                  <Activity className="profile-action-icon" />
                </div>
                <span className="profile-action-label">
                  {rebuildingProgress ? 'Rebuilding...' : 'Rebuild Progress'}
                </span>
                <ChevronRight className="profile-action-chevron" />
              </button>
            )}
          </div>
        </section>

        {/* Settings Menu */}
        <section className="profile-section">
          <div className="profile-settings-card">
            <button 
              className="profile-list-item"
              onClick={() => navigation.navigateToScreen('settings', { activeSection: 'help' })}
            >
              <div className="profile-list-icon profile-list-icon-orange">
                <HelpCircle size={20} />
              </div>
              <span className="profile-list-title">Help & Support</span>
              <ChevronRight size={20} className="profile-list-chevron" />
            </button>
            
            <div className="profile-separator" />
            
            <button 
              className="profile-list-item"
              onClick={() => navigation.navigateToScreen('about')}
            >
              <div className="profile-list-icon profile-list-icon-gray">
                <Info size={20} />
              </div>
              <span className="profile-list-title">About Καιρός</span>
              <ChevronRight size={20} className="profile-list-chevron" />
            </button>
          </div>
        </section>

        {/* Sign Out */}
        <section className="profile-section">
          <div className="profile-signout-card">
            <button 
              className="profile-signout-button"
              onClick={handleSignOutClick}
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </section>

        {/* App Version */}
        <div className="profile-version">
          <VersionDisplay minimal={false} />
        </div>
      </div>

      {/* Sign Out Dialog */}
      {showSignOutDialog && (
        <div className="profile-modal-overlay" onClick={() => setShowSignOutDialog(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h2 className="profile-modal-title">Sign Out</h2>
            </div>
            
            <div className="profile-modal-content">
              <p className="profile-modal-message">
                Are you sure you want to sign out of your account?
              </p>
            </div>
            
            <div className="profile-modal-actions">
              <button 
                className="profile-modal-button profile-modal-button-cancel"
                onClick={() => setShowSignOutDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="profile-modal-button profile-modal-button-destructive"
                onClick={handleConfirmSignOut}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Journal Registration Modal */}
      <JournalRegistration
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
        onComplete={(journalData) => {
          console.log('✅ Journal registered:', journalData);
          setShowRegistration(false);
          // Show success message
          alert(`Journal registered successfully!\n\nJournal ID: ${journalData.journalId}\nTier: ${journalData.tier}`);
        }}
      />

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <div className="profile-modal-overlay" onClick={() => setShowAvatarPicker(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
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

      {/* My Journals List Modal */}
      <MyJournalsList
        isOpen={showJournalsList}
        onClose={() => setShowJournalsList(false)}
        onRegisterAnother={() => setShowRegistration(true)}
      />

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        statistics={statistics}
      />

      {/* Edit Profile Modal */}
      <EditProfile
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        currentProfile={{
          displayName,
          email,
          city,
          avatarStyle,
          avatarPattern,
          avatarFont
        }}
        onSave={handleProfileSave}
      />
    </>
  );
};

export default ProfileScreen;