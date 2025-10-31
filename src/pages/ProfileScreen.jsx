// src/pages/ProfileScreen.jsx - Redesigned to Match HomeScreen Aesthetic

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  HelpCircle, 
  LogOut, 
  BookOpen, 
  ChevronRight, 
  Bell,
  Lock,
  Info,
  Calendar,
  Trophy,
  Target,
  Flame,
  Archive,
  BarChart3,
  Crown,
  CreditCard,
  Shield,
  CheckCircle,
  Compass,
  MapPin,
  Mail,
  User,
  Edit3,
  Award,
  Sparkles,
  Heart,
  Zap
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '../contexts/NavigationContext';

// Import centralized statistics hook
import { useUserStatistics } from '../hooks/useUserStatistics';
import { useUserProgress } from '../hooks/useUserProgress';

// Import subscription services
import { 
  getSubscriptionStatus, 
  startUpgradeProcess,
  openCustomerPortal,
  hasArtisanAccess
} from '../services/subscriptionService';

// Import avatar system
import { SmartAvatar, AvatarSelector } from '../components/common/AvatarComponents';

// Import the KairosLoader component
import KairosLoader from '../components/common/KairosLoader';
import VersionDisplay from '../components/common/VersionDisplay';
import DynamicIcon from '../components/common/DynamicIcon';
import '../styles/components/profile.css';

// Achievement definitions
const ACHIEVEMENT_DEFINITIONS = {
  // Streak Achievements
  firstWeek: {
    id: 'first-week',
    icon: 'Flame',
    title: 'Week Warrior',
    description: '7 day streak',
    requirement: (statistics) => statistics.longestStreak >= 7,
    color: 'achievement-orange',
    points: 100
  },
  twoWeeks: {
    id: 'two-weeks',
    icon: 'Zap',
    title: 'Fortnight Force',
    description: '14 day streak',
    requirement: (statistics) => statistics.longestStreak >= 14,
    color: 'achievement-yellow',
    points: 200
  },
  monthMaster: {
    id: 'month-master',
    icon: 'Trophy',
    title: 'Month Master',
    description: '30 day streak',
    requirement: (statistics) => statistics.longestStreak >= 30,
    color: 'achievement-gold',
    points: 500
  },
  
  // Entry Achievements
  firstEntry: {
    id: 'first-entry',
    icon: 'BookOpen',
    title: 'First Steps',
    description: 'First journal entry',
    requirement: (statistics) => statistics.totalEntries >= 1,
    color: 'achievement-blue',
    points: 50
  },
  tenEntries: {
    id: 'ten-entries',
    icon: 'Heart',
    title: 'Getting Started',
    description: '10 entries',
    requirement: (statistics) => statistics.totalEntries >= 10,
    color: 'achievement-blue',
    points: 100
  },
  
  // Path Completion
  firstPath: {
    id: 'first-path',
    icon: 'Award',
    title: 'Journey Complete',
    description: 'First path completed',
    requirement: (statistics) => statistics.completedPathsCount >= 1,
    color: 'achievement-purple',
    points: 200
  },
  threePaths: {
    id: 'three-paths',
    icon: 'Trophy',
    title: 'Path Explorer',
    description: '3 paths completed',
    requirement: (statistics) => statistics.completedPathsCount >= 3,
    color: 'achievement-gold',
    points: 500
  }
};

const ProfileScreen = ({ handleSignOut }) => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();

  // Statistics and progress hooks
  const { statistics, isLoading: statsLoading } = useUserStatistics();
  const {
    inProgressPaths,
    hasActiveJourneys
  } = useUserProgress();

  // Component state
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Subscription state
  const [subscription, setSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [processingUpgrade, setProcessingUpgrade] = useState(false);
  const [processingPortal, setProcessingPortal] = useState(false);

  // User info
  const displayName = userProfile?.displayName || 'Journaler';
  const email = currentUser?.email || '';
  const city = userProfile?.city || null;
  const memberSince = currentUser?.metadata?.creationTime 
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      })
    : 'Recently';

  // Load subscription status from Firestore
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        setLoadingSubscription(true);
        // Force refresh from Firestore to get latest status
        const status = await getSubscriptionStatus(currentUser.uid, true);
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

  // Determine if user has Artisan access
  const isArtisan = hasArtisanAccess(subscription);

  // Load animation
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 150);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showSignOutDialog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSignOutDialog]);

  // Calculate achievements
  const achievements = Object.values(ACHIEVEMENT_DEFINITIONS)
    .filter(achievement => achievement.requirement(statistics))
    .sort((a, b) => b.points - a.points);

  const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);

  // Calculate user level
  const getUserLevel = (points) => {
    if (points >= 3000) return { level: 'Master', progress: 100, nextLevel: null };
    if (points >= 1500) return { level: 'Expert', progress: ((points - 1500) / 1500) * 100, nextLevel: 3000 };
    if (points >= 500) return { level: 'Advanced', progress: ((points - 500) / 1000) * 100, nextLevel: 1500 };
    if (points >= 100) return { level: 'Intermediate', progress: ((points - 100) / 400) * 100, nextLevel: 500 };
    return { level: 'Beginner', progress: (points / 100) * 100, nextLevel: 100 };
  };

  const userLevel = getUserLevel(totalPoints);

  // Handlers
  const handleAvatarChange = async (newAvatar) => {
    try {
      await updateUserProfile({ avatar: newAvatar });
      setShowAvatarSelector(false);
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  const handleSignOutClick = () => {
    setShowSignOutDialog(true);
  };

  const handleConfirmSignOut = async () => {
    try {
      await handleSignOut();
      navigation.navigateToScreen('welcome');
    } catch (error) {
      console.error('Sign out error:', error);
      alert('Error signing out. Please try again.');
    } finally {
      setShowSignOutDialog(false);
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showSignOutDialog) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSignOutDialog]);

  const handleUpgrade = async () => {
    try {
      setProcessingUpgrade(true);
      await startUpgradeProcess(currentUser.uid, currentUser.email);
    } catch (error) {
      console.error('Error during upgrade:', error);
      if (error.message && error.message.includes('Popup blocked')) {
        alert('Please allow popups for this site to complete the upgrade process.');
      } else {
        alert('Unable to start upgrade process. Please try again.');
      }
    } finally {
      setProcessingUpgrade(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setProcessingPortal(true);
      await openCustomerPortal(currentUser.uid);
    } catch (error) {
      console.error('Error opening portal:', error);
      if (error.message && error.message.includes('Popup blocked')) {
        alert('Please allow popups for this site to manage your subscription.');
      } else {
        alert('Unable to open customer portal. Please try again.');
      }
    } finally {
      setProcessingPortal(false);
    }
  };

  if (statsLoading || loadingSubscription) {
    return <KairosLoader />;
  }

  return (
    <>
    <div className={`profile-container ${isDarkMode ? 'profile-dark' : 'profile-light'} ${isLoaded ? 'profile-loaded' : ''}`}>
      
      {/* Profile Header */}
      <section className="profile-header">
        <div className="profile-header-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrapper" onClick={() => setShowAvatarSelector(true)}>
              <SmartAvatar 
                avatar={userProfile?.avatar || 'geometric-1'} 
                size={100}
              />
              <button className="profile-avatar-edit">
                <Edit3 size={16} />
              </button>
            </div>
            
            <div className="profile-info">
              <h1 className="profile-name">{displayName}</h1>
              
              <div className="profile-details">
                <div className="profile-detail-item">
                  <Mail size={14} />
                  <span>{email}</span>
                </div>
                {city && (
                  <div className="profile-detail-item">
                    <MapPin size={14} />
                    <span>{city}</span>
                  </div>
                )}
                <div className="profile-detail-item">
                  <Calendar size={14} />
                  <span>Since {memberSince}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="profile-section">
        <div className="profile-section-header">
          <h2 className="profile-section-title">
            <BarChart3 className="profile-section-icon" />
            Your Journey
          </h2>
          <button 
            className="profile-view-all-btn"
            onClick={() => navigation.navigateToScreen('analytics-dashboard')}
          >
            <span>View Details</span>
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="profile-stats-grid">
          <div className="profile-stat-card">
            <div className="profile-stat-icon-wrapper profile-stat-blue">
              <BookOpen className="profile-stat-icon" />
            </div>
            <div className="profile-stat-content">
              <div className="profile-stat-number">{statistics.totalEntries}</div>
              <div className="profile-stat-label">Entries</div>
            </div>
          </div>
          
          <div className="profile-stat-card profile-stat-highlight">
            <div className="profile-stat-icon-wrapper profile-stat-orange">
              <Flame className="profile-stat-icon" />
            </div>
            <div className="profile-stat-content">
              <div className="profile-stat-number">{statistics.longestStreak}</div>
              <div className="profile-stat-label">Best Streak</div>
            </div>
          </div>
          
          <div className="profile-stat-card">
            <div className="profile-stat-icon-wrapper profile-stat-gold">
              <Trophy className="profile-stat-icon" />
            </div>
            <div className="profile-stat-content">
              <div className="profile-stat-number">{statistics.completedPathsCount}</div>
              <div className="profile-stat-label">Completed</div>
            </div>
          </div>
          
          <div className="profile-stat-card">
            <div className="profile-stat-icon-wrapper profile-stat-green">
              <Target className="profile-stat-icon" />
            </div>
            <div className="profile-stat-content">
              <div className="profile-stat-number">{statistics.activeDays}</div>
              <div className="profile-stat-label">Active Days</div>
            </div>
          </div>
        </div>
      </section>

      {/* Level Card */}
      <section className="profile-section">
        <div className="profile-level-card">
          <div className="profile-level-header">
            <div className="profile-level-icon">
              <Trophy size={24} />
            </div>
            <div className="profile-level-info">
              <h3 className="profile-level-title">{userLevel.level} Journalist</h3>
              <p className="profile-level-points">{totalPoints} points earned</p>
            </div>
          </div>
          
          {userLevel.nextLevel && (
            <div className="profile-level-progress">
              <div className="profile-progress-bar">
                <div 
                  className="profile-progress-fill"
                  style={{ width: `${userLevel.progress}%` }}
                />
              </div>
              <span className="profile-level-next">
                {Math.round(userLevel.nextLevel - totalPoints)} points to next level
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Subscription Card - Keep original styling */}
      {!loadingSubscription && (
        <section className="profile-section">
          <div className="profile-subscription-card">
            <div className="profile-subscription-header">
              <div className="profile-subscription-icon">
                {isArtisan ? <Crown size={28} /> : <Shield size={28} />}
              </div>
              <div className="profile-subscription-info">
                <h3 className="profile-subscription-title">
                  {isArtisan ? 'Artisan Plan' : 'Free Plan'}
                </h3>
                <p className="profile-subscription-subtitle">
                  {isArtisan ? 'All journeys unlocked' : '9 free journeys available'}
                </p>
              </div>
              <div className={`profile-subscription-badge ${isArtisan ? 'profile-subscription-badge-artisan' : ''}`}>
                {isArtisan ? <Crown size={12} /> : <User size={12} />}
                <span>{isArtisan ? 'Artisan' : 'Free'}</span>
              </div>
            </div>
            
            <div className="profile-subscription-features">
              <div className={`profile-feature-item ${isArtisan ? 'profile-feature-active' : ''}`}>
                <CheckCircle size={16} />
                <span>{isArtisan ? 'All 34 Journey Paths' : '9 Free Paths'}</span>
              </div>
              <div className={`profile-feature-item ${isArtisan ? 'profile-feature-active' : ''}`}>
                <CheckCircle size={16} />
                <span>{isArtisan ? 'Advanced AI Analysis' : 'Basic AI Analysis'}</span>
              </div>
              <div className={`profile-feature-item ${isArtisan ? 'profile-feature-active' : ''}`}>
                <CheckCircle size={16} />
                <span>{isArtisan ? 'Unlimited Exports' : 'Limited Exports'}</span>
              </div>
            </div>
            
            <div className="profile-subscription-action">
              {isArtisan ? (
                <button 
                  onClick={handleManageSubscription}
                  disabled={processingPortal}
                  className="profile-button profile-button-secondary"
                >
                  <CreditCard size={18} />
                  <span>{processingPortal ? 'Opening...' : 'Manage Subscription'}</span>
                </button>
              ) : (
                <button 
                  onClick={handleUpgrade}
                  disabled={processingUpgrade}
                  className="profile-button profile-button-primary"
                >
                  <Crown size={18} />
                  <span>{processingUpgrade ? 'Processing...' : 'Upgrade to Artisan'}</span>
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Active Journeys */}
      {hasActiveJourneys && (
        <section className="profile-section">
          <div className="profile-section-header">
            <h2 className="profile-section-title">
              <Compass className="profile-section-icon" />
              Active Journeys
            </h2>
            <button 
              className="profile-view-all-btn"
              onClick={() => navigation.navigateToScreen('path-selection')}
            >
              <span>View All</span>
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="profile-journeys-card">
            {inProgressPaths.slice(0, 3).map((path, index) => (
              <div key={path.id}>
                <button 
                  className="profile-journey-item"
                  onClick={() => navigation.navigateToScreen('daily', { 
                    pathId: path.id, 
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
            {achievements.length > 3 && (
              <button 
                className="profile-view-all-btn"
                onClick={() => setShowAllAchievements(!showAllAchievements)}
              >
                <span>{showAllAchievements ? 'Show Less' : 'View All'}</span>
                <ChevronRight size={16} />
              </button>
            )}
          </div>
          
          <div className="profile-achievements-grid">
            {(showAllAchievements ? achievements : achievements.slice(0, 3)).map(achievement => (
              <div key={achievement.id} className={`profile-achievement ${achievement.color}`}>
                <div className="profile-achievement-icon">
                  <DynamicIcon name={achievement.icon} size={20} />
                </div>
                <div className="profile-achievement-content">
                  <h4 className="profile-achievement-title">{achievement.title}</h4>
                  <p className="profile-achievement-description">{achievement.description}</p>
                  <span className="profile-achievement-points">+{achievement.points} pts</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="profile-section">
        <div className="profile-actions-grid">
          <button 
            className="profile-action-card"
            onClick={() => navigation.navigateToScreen('path-selection')}
          >
            <div className="profile-action-icon-wrapper">
              <Compass className="profile-action-icon" />
            </div>
            <span className="profile-action-label">Explore</span>
            <ChevronRight className="profile-action-chevron" />
          </button>
          
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
            onClick={() => navigation.navigateToScreen('settings')}
          >
            <div className="profile-action-icon-wrapper">
              <Settings className="profile-action-icon" />
            </div>
            <span className="profile-action-label">Settings</span>
            <ChevronRight className="profile-action-chevron" />
          </button>
        </div>
      </section>

      {/* Settings Menu */}
      <section className="profile-section">
        <div className="profile-settings-card">
          <button 
            className="profile-list-item"
            onClick={() => navigation.navigateToScreen('settings', { activeSection: 'notifications' })}
          >
            <div className="profile-list-icon profile-list-icon-red">
              <Bell size={20} />
            </div>
            <span className="profile-list-title">Notifications</span>
            <ChevronRight size={20} className="profile-list-chevron" />
          </button>
          
          <div className="profile-separator" />
          
          <button 
            className="profile-list-item"
            onClick={() => navigation.navigateToScreen('settings', { activeSection: 'privacy' })}
          >
            <div className="profile-list-icon profile-list-icon-blue">
              <Lock size={20} />
            </div>
            <span className="profile-list-title">Privacy & Security</span>
            <ChevronRight size={20} className="profile-list-chevron" />
          </button>
          
          <div className="profile-separator" />
          
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
            <span className="profile-list-title">About</span>
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
        <VersionDisplay minimal={true} />
      </div>

      {/* Avatar Selector Modal */}
      {showAvatarSelector && (
        <AvatarSelector
          selectedAvatar={userProfile?.avatar || 'geometric-1'}
          onSelect={handleAvatarChange}
          onClose={() => setShowAvatarSelector(false)}
          size="medium"
        />
      )}

    </div>

    {/* Sign Out Dialog - Outside container to avoid stacking context issues */}
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
    </>
  );
};

export default ProfileScreen;