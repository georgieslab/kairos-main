// src/pages/ProfileScreen.jsx - Modern iOS Design with KairosLoader

import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, 
  HelpCircle, 
  LogOut, 
  BookOpen, 
  ChevronRight, 
  Bell,
  Lock,
  Info,
  Moon,
  Sun,
  TrendingUp,
  Calendar,
  Star,
  Award,
  Camera,
  User,
  Archive,
  Sparkles,
  Clock,
  Target,
  Heart,
  Zap,
  BarChart3,
  Flame,
  Trophy,
  CheckCircle2,
  ArrowUpRight,
  Play,
  Plus,
  Eye,
  Crown,
  CreditCard,
  Shield,
  CheckCircle,
  Compass,
  X,
  MapPin,
  Mail,
  Edit3,
  Palette,
  PenTool,
  Coffee,
  Sunrise,
  Feather,
  Mountain,
  Lightbulb,
  Gem,
  Medal,
  Flag,
  Gift,
  Rocket,
  Brain,
  Smile,
  Activity
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
  formatSubscriptionInfo,
  startUpgradeProcess,
  openCustomerPortal,
  hasArtisanAccess
} from '../services/subscriptionService';

// Import avatar system
import { SmartAvatar, AvatarSelector } from '../components/common/AvatarComponents';

// ✅ Import the KairosLoader component
import KairosLoader from '../components/common/KairosLoader';

import VersionDisplay from '../components/common/VersionDisplay';
import DynamicIcon from '../components/common/DynamicIcon';
import '../styles/components/profile.css';

// iOS-style Components
const IOSSubscriptionBadge = ({ isArtisan = false, size = 'default' }) => {
  return (
    <div className={`ios-subscription-badge ${isArtisan ? 'ios-subscription-badge--artisan' : 'ios-subscription-badge--free'} ${size === 'small' ? 'ios-subscription-badge--small' : ''}`}>
      {isArtisan ? <Crown size={size === 'small' ? 12 : 14} /> : <User size={size === 'small' ? 12 : 14} />}
      <span>{isArtisan ? 'Artisan' : 'Free'}</span>
    </div>
  );
};

const IOSSubscriptionCard = ({ isArtisan = false, onUpgrade, onManage, loading = false }) => {
  return (
    <div className="ios-card ios-subscription-card">
      <div className="ios-subscription-card__content">
        <div className="ios-subscription-card__header">
          <div className="ios-subscription-card__icon">
            {isArtisan ? <Crown size={28} /> : <Shield size={28} />}
          </div>
          <div className="ios-subscription-card__info">
            <h3 className="ios-subscription-card__title">
              {isArtisan ? 'Artisan Plan' : 'Free Plan'}
            </h3>
            <p className="ios-subscription-card__subtitle">
              {isArtisan ? 'All journeys unlocked' : '9 free journeys available'}
            </p>
          </div>
          <IOSSubscriptionBadge isArtisan={isArtisan} />
        </div>
        
        <div className="ios-subscription-card__features">
          <div className={`ios-feature-item ${isArtisan ? 'ios-feature-item--active' : ''}`}>
            <CheckCircle size={16} />
            <span>{isArtisan ? 'All 34 Journey Paths' : '9 Free Paths'}</span>
          </div>
          <div className={`ios-feature-item ${isArtisan ? 'ios-feature-item--active' : ''}`}>
            <CheckCircle size={16} />
            <span>{isArtisan ? 'Advanced AI Analysis' : 'Basic AI Analysis'}</span>
          </div>
          <div className={`ios-feature-item ${isArtisan ? 'ios-feature-item--active' : ''}`}>
            <CheckCircle size={16} />
            <span>{isArtisan ? 'Unlimited Exports' : 'Limited Exports'}</span>
          </div>
        </div>
        
        <div className="ios-subscription-card__action">
          {isArtisan ? (
            <button 
              onClick={onManage}
              disabled={loading}
              className="ios-button ios-button--secondary"
            >
              <CreditCard size={18} />
              <span>{loading ? 'Opening...' : 'Manage Subscription'}</span>
            </button>
          ) : (
            <button 
              onClick={onUpgrade}
              disabled={loading}
              className="ios-button ios-button--primary"
            >
              <Crown size={18} />
              <span>{loading ? 'Processing...' : 'Upgrade to Artisan'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Achievement definitions remain the same...
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
  streakLegend: {
    id: 'streak-legend',
    icon: 'Crown',
    title: 'Streak Legend',
    description: '100 day streak',
    requirement: (statistics) => statistics.longestStreak >= 100,
    color: 'achievement-purple',
    points: 1000
  },
  
  // Entry Achievements
  firstEntry: {
    id: 'first-entry',
    icon: 'Feather',
    title: 'First Words',
    description: 'Your first entry',
    requirement: (statistics) => statistics.totalEntries >= 1,
    color: 'achievement-green',
    points: 50
  },
  tenEntries: {
    id: 'ten-entries',
    icon: 'BookOpen',
    title: 'Getting Started',
    description: '10 entries',
    requirement: (statistics) => statistics.totalEntries >= 10,
    color: 'achievement-blue',
    points: 100
  },
  twentyFive: {
    id: 'twenty-five',
    icon: 'PenTool',
    title: 'Consistent Writer',
    description: '25 entries',
    requirement: (statistics) => statistics.totalEntries >= 25,
    color: 'achievement-teal',
    points: 250
  },
  fiftyEntries: {
    id: 'fifty-entries',
    icon: 'Heart',
    title: 'Dedicated Journalist',
    description: '50 entries',
    requirement: (statistics) => statistics.totalEntries >= 50,
    color: 'achievement-pink',
    points: 500
  },
  hundredEntries: {
    id: 'hundred-entries',
    icon: 'Star',
    title: 'Century Club',
    description: '100 entries',
    requirement: (statistics) => statistics.totalEntries >= 100,
    color: 'achievement-purple',
    points: 1000
  },
  
  // Path Achievements
  firstPath: {
    id: 'first-path',
    icon: 'Award',
    title: 'Path Finder',
    description: 'First path completed',
    requirement: (statistics) => statistics.completedPathsCount >= 1,
    color: 'achievement-green',
    points: 200
  },
  threePaths: {
    id: 'three-paths',
    icon: 'Medal',
    title: 'Journey Expert',
    description: '3 paths completed',
    requirement: (statistics) => statistics.completedPathsCount >= 3,
    color: 'achievement-blue',
    points: 600
  },
  fivePaths: {
    id: 'five-paths',
    icon: 'Gem',
    title: 'Path Master',
    description: '5 paths completed',
    requirement: (statistics) => statistics.completedPathsCount >= 5,
    color: 'achievement-purple',
    points: 1000
  },
  tenPaths: {
    id: 'ten-paths',
    icon: 'Rocket',
    title: 'Journey Legend',
    description: '10 paths completed',
    requirement: (statistics) => statistics.completedPathsCount >= 10,
    color: 'achievement-gold',
    points: 2000
  },
  
  // Special Achievements
  earlyBird: {
    id: 'early-bird',
    icon: 'Sunrise',
    title: 'Early Bird',
    description: 'Morning journaler',
    requirement: (statistics, profile) => profile?.preferences?.journalTime === 'morning',
    color: 'achievement-orange',
    points: 150
  },
  nightOwl: {
    id: 'night-owl',
    icon: 'Moon',
    title: 'Night Owl',
    description: 'Evening journaler',
    requirement: (statistics, profile) => profile?.preferences?.journalTime === 'evening',
    color: 'achievement-indigo',
    points: 150
  },
  explorer: {
    id: 'explorer',
    icon: 'Compass',
    title: 'Path Explorer',
    description: 'Tried 5+ different paths',
    requirement: (statistics) => statistics.totalPathsStarted >= 5,
    color: 'achievement-teal',
    points: 300
  },
  deepThinker: {
    id: 'deep-thinker',
    icon: 'Brain',
    title: 'Deep Thinker',
    description: 'Long reflections',
    requirement: (statistics) => statistics.averageLength > 500,
    color: 'achievement-purple',
    points: 400
  },
  speedWriter: {
    id: 'speed-writer',
    icon: 'Zap',
    title: 'Speed Writer',
    description: 'Quick daily entries',
    requirement: (statistics) => statistics.totalEntries >= 30 && statistics.averageLength < 200,
    color: 'achievement-yellow',
    points: 300
  },
  emotionalExplorer: {
    id: 'emotional-explorer',
    icon: 'Heart',
    title: 'Emotional Explorer',
    description: 'Completed emotional paths',
    requirement: (statistics, profile, progress) => {
      const emotionalPaths = ['emotional-intelligence', 'inner-child', 'anxiety-alchemy'];
      const completed = progress?.completedPaths || [];
      return completed.some(p => emotionalPaths.includes(p.id));
    },
    color: 'achievement-pink',
    points: 400
  },
  creativeSpirit: {
    id: 'creative-spirit',
    icon: 'Palette',
    title: 'Creative Spirit',
    description: 'Completed visual paths',
    requirement: (statistics, profile, progress) => {
      const visualPaths = ['mindful-visualization', 'artistic-soul-expression', 'visual-storytelling'];
      const completed = progress?.completedPaths || [];
      return completed.some(p => visualPaths.includes(p.id));
    },
    color: 'achievement-purple',
    points: 400
  },
  transformationSeeker: {
    id: 'transformation-seeker',
    icon: 'Activity',
    title: 'Transformation Seeker',
    description: '21-day journey completed',
    requirement: (statistics, profile, progress) => {
      const completed = progress?.completedPaths || [];
      return completed.some(p => p.id === 'transformation-journey');
    },
    color: 'achievement-green',
    points: 600
  },
  consistent: {
    id: 'consistent',
    icon: 'CheckCircle',
    title: 'Consistency Master',
    description: 'Regular journaling habit',
    requirement: (statistics) => statistics.isConsistent && statistics.entriesThisMonth >= 10,
    color: 'achievement-blue',
    points: 300
  },
  wordsmith: {
    id: 'wordsmith',
    icon: 'Edit3',
    title: 'Wordsmith',
    description: '10,000+ words written',
    requirement: (statistics) => statistics.totalWords >= 10000,
    color: 'achievement-purple',
    points: 800
  }
};

// Calculate achievements function remains the same...
const calculateAllAchievements = (statistics, userProfile, progressData) => {
  const earnedAchievements = [];
  
  for (const [key, achievement] of Object.entries(ACHIEVEMENT_DEFINITIONS)) {
    if (achievement.requirement(statistics, userProfile, progressData)) {
      earnedAchievements.push(achievement);
    }
  }
  
  earnedAchievements.sort((a, b) => b.points - a.points);
  return earnedAchievements;
};

const ProfileScreen = ({ handleSignOut }) => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation();
  
  // Use centralized statistics hook
  const { statistics, isLoading: statsLoading, error: statsError } = useUserStatistics();
  
  // Centralized progress data for path-specific information
  const {
    inProgressPaths,
    completedPaths,
    allPaths,
    stats: progressStats,
    isLoading: progressLoading,
    hasActiveJourneys,
    hasCompletedJourneys,
    hasAnyProgress
  } = useUserProgress();
  
  // State
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [processingUpgrade, setProcessingUpgrade] = useState(false);
  const [processingPortal, setProcessingPortal] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  // ✅ NEW: Loading state management for different operations
  const [loadingState, setLoadingState] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Load subscription status
  useEffect(() => {
    if (currentUser) {
      loadSubscriptionStatus();
    }
  }, [currentUser]);

  // Calculate achievements using centralized statistics
  useEffect(() => {
    if (statistics && userProfile && !statistics.isEmpty) {
      const progressData = {
        inProgressPaths,
        completedPaths,
        allPaths
      };
      
      const userAchievements = calculateAllAchievements(statistics, userProfile, progressData);
      setAchievements(userAchievements);
      
      const points = userAchievements.reduce((total, achievement) => total + achievement.points, 0);
      setTotalPoints(points);
    }
  }, [statistics, userProfile, inProgressPaths, completedPaths, allPaths]);

  const loadSubscriptionStatus = async () => {
    try {
      setLoadingSubscription(true);
      setLoadingState('Loading subscription status...');
      setLoadingProgress(30);
      
      const status = await getSubscriptionStatus(currentUser.uid, true);
      setSubscription(status);
      setLoadingProgress(100);
      
      // Clear loading state after a brief moment
      setTimeout(() => {
        setLoadingState('');
        setLoadingProgress(0);
      }, 500);
    } catch (error) {
      console.error('Error loading subscription:', error);
      setSubscription({ status: 'free' });
      setLoadingState('');
      setLoadingProgress(0);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      setProcessingUpgrade(true);
      setLoadingState('Redirecting to upgrade...');
      setLoadingProgress(50);
      
      await startUpgradeProcess(currentUser.uid);
      setLoadingProgress(100);
    } catch (error) {
      console.error('Error during upgrade:', error);
      if (error.message.includes('Popup blocked')) {
        alert('Please allow popups for this site to complete the upgrade process.');
      }
      setLoadingState('');
      setLoadingProgress(0);
    } finally {
      setProcessingUpgrade(false);
      // Clear loading state
      setTimeout(() => {
        setLoadingState('');
        setLoadingProgress(0);
      }, 1000);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setProcessingPortal(true);
      setLoadingState('Opening customer portal...');
      setLoadingProgress(50);
      
      await openCustomerPortal(currentUser.uid);
      setLoadingProgress(100);
    } catch (error) {
      console.error('Error opening portal:', error);
      if (error.message.includes('Popup blocked')) {
        alert('Please allow popups for this site to manage your subscription.');
      }
      setLoadingState('');
      setLoadingProgress(0);
    } finally {
      setProcessingPortal(false);
      // Clear loading state
      setTimeout(() => {
        setLoadingState('');
        setLoadingProgress(0);
      }, 1000);
    }
  };

  const handleAvatarChange = async (avatarId) => {
    try {
      setUpdatingAvatar(true);
      setLoadingState('Updating your avatar...');
      setLoadingProgress(25);
      
      await updateUserProfile({ avatar: avatarId });
      setLoadingProgress(100);
      
      setShowAvatarSelector(false);
      
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      // Clear loading state
      setTimeout(() => {
        setLoadingState('');
        setLoadingProgress(0);
      }, 800);
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert('Failed to update avatar. Please try again.');
      setLoadingState('');
      setLoadingProgress(0);
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const handleSignOutClick = () => {
    setShowSignOutDialog(true);
  };

  const handleConfirmSignOut = async () => {
    try {
      setLoadingState('Signing you out...');
      setLoadingProgress(50);
      
      await handleSignOut();
      navigation.navigateToScreen('welcome');
      setLoadingProgress(100);
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Error signing out. Please try again.');
      setLoadingState('');
      setLoadingProgress(0);
    } finally {
      setShowSignOutDialog(false);
      // Clear loading state
      setTimeout(() => {
        setLoadingState('');
        setLoadingProgress(0);
      }, 500);
    }
  };

  const getUserInfo = () => {
    const name = userProfile?.displayName || userProfile?.name || 'User';
    const email = currentUser?.email || '';
    const city = userProfile?.city || '';
    const memberSince = userProfile?.createdAt ? 
      new Date(userProfile.createdAt.toDate()).toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      }) : 'recently';
    
    return { name, email, city, memberSince };
  };

  const { name, email, city, memberSince } = getUserInfo();
  const isArtisan = hasArtisanAccess(subscription);

  // Calculate user level based on points
  const getUserLevel = (points) => {
    if (points >= 5000) return { level: 'Master', nextLevel: null, progress: 100 };
    if (points >= 3000) return { level: 'Expert', nextLevel: 5000, progress: ((points - 3000) / 2000) * 100 };
    if (points >= 1500) return { level: 'Advanced', nextLevel: 3000, progress: ((points - 1500) / 1500) * 100 };
    if (points >= 500) return { level: 'Intermediate', nextLevel: 1500, progress: ((points - 500) / 1000) * 100 };
    return { level: 'Beginner', nextLevel: 500, progress: (points / 500) * 100 };
  };

  const userLevel = getUserLevel(totalPoints);

  // ✅ NEW: Determine when to show the KairosLoader
  const shouldShowLoader = (
    progressLoading || 
    statsLoading || 
    loadingState || 
    updatingAvatar || 
    processingUpgrade || 
    processingPortal
  );

  // ✅ NEW: Show KairosLoader instead of simple loading state
  if (shouldShowLoader) {
    let message = 'Loading your profile...';
    let subMessage = 'Gathering your journey data';
    
    if (loadingState) {
      message = loadingState;
      subMessage = 'This may take a moment';
    } else if (statsLoading) {
      message = 'Loading your statistics...';
      subMessage = 'Analyzing your progress';
    } else if (progressLoading) {
      message = 'Loading your journeys...';
      subMessage = 'Tracking your paths';
    }
    
    return (
      <div className={`ios-profile ${isDarkMode ? 'ios-profile--dark' : 'ios-profile--light'}`}>
        <KairosLoader
          size="large"
          fullScreen={true}
          message={message}
          subMessage={subMessage}
          showProgress={loadingProgress > 0}
          progress={loadingProgress}
        />
      </div>
    );
  }

  if (statsError) {
    console.warn('Statistics loading error:', statsError);
  }

  return (
    <div className={`ios-profile ${isDarkMode ? 'ios-profile--dark' : 'ios-profile--light'}`}>
      {/* Header */}
      <div className="ios-header">
        <h1 className="ios-header__title">Profile</h1>
      </div>

      <div className="ios-content">
        {/* User Info Card */}
        <div className="ios-card ios-user-card">
          <div className="ios-user-card__content">
            <div className="ios-user-card__avatar-section">
              <div className="ios-user-card__avatar-wrapper">
                <SmartAvatar 
                  userProfile={userProfile}
                  size="large"
                  onClick={() => setShowAvatarSelector(true)}
                  className="ios-user-card__avatar"
                />
                <button 
                  className="ios-user-card__avatar-edit"
                  onClick={() => setShowAvatarSelector(true)}
                  disabled={updatingAvatar}
                >
                  <Camera size={18} />
                </button>
              </div>
              
              <div className="ios-user-card__info">
                <div className="ios-user-card__name-row">
                  <h2 className="ios-user-card__name">{name}</h2>
                  {!loadingSubscription && (
                    <IOSSubscriptionBadge isArtisan={isArtisan} size="small" />
                  )}
                </div>
                
                <div className="ios-user-card__details">
                  <div className="ios-user-card__detail">
                    <Mail size={16} />
                    <span>{email}</span>
                  </div>
                  {city && (
                    <div className="ios-user-card__detail">
                      <MapPin size={16} />
                      <span>{city}</span>
                    </div>
                  )}
                  <div className="ios-user-card__detail">
                    <Calendar size={16} />
                    <span>Since {memberSince}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="ios-card ios-stats-card">
          <div className="ios-stats-card__header">
            <h3 className="ios-stats-card__title">Your Journey</h3>
            <button 
              className="ios-text-button"
              onClick={() => navigation.navigateToScreen('analytics-dashboard')}
            >
              View Details
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="ios-stats-grid">
            <div className="ios-stat-item">
              <div className="ios-stat-item__icon ios-stat-item__icon--blue">
                <BookOpen size={24} />
              </div>
              <div className="ios-stat-item__content">
                <div className="ios-stat-item__value">{statistics.totalEntries}</div>
                <div className="ios-stat-item__label">Entries</div>
              </div>
            </div>
            
            <div className="ios-stat-item">
              <div className="ios-stat-item__icon ios-stat-item__icon--orange">
                <Flame size={24} />
              </div>
              <div className="ios-stat-item__content">
                <div className="ios-stat-item__value">{statistics.longestStreak}</div>
                <div className="ios-stat-item__label">Best Streak</div>
              </div>
            </div>
            
            <div className="ios-stat-item">
              <div className="ios-stat-item__icon ios-stat-item__icon--gold">
                <Trophy size={24} />
              </div>
              <div className="ios-stat-item__content">
                <div className="ios-stat-item__value">{statistics.completedPathsCount}</div>
                <div className="ios-stat-item__label">Completed</div>
              </div>
            </div>
            
            <div className="ios-stat-item">
              <div className="ios-stat-item__icon ios-stat-item__icon--green">
                <Target size={24} />
              </div>
              <div className="ios-stat-item__content">
                <div className="ios-stat-item__value">{statistics.activeDays}</div>
                <div className="ios-stat-item__label">Active Days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Level & Achievement Card */}
        <div className="ios-card ios-level-card">
          <div className="ios-level-card__header">
            <div className="ios-level-card__icon">
              <Trophy size={24} />
            </div>
            <div className="ios-level-card__info">
              <h3 className="ios-level-card__title">{userLevel.level} Journalist</h3>
              <p className="ios-level-card__points">{totalPoints} points earned</p>
            </div>
          </div>
          
          {userLevel.nextLevel && (
            <div className="ios-level-card__progress">
              <div className="ios-progress-bar">
                <div 
                  className="ios-progress-bar__fill"
                  style={{ width: `${userLevel.progress}%` }}
                />
              </div>
              <span className="ios-level-card__next">
                {Math.round(userLevel.nextLevel - totalPoints)} points to {userLevel.nextLevel > 3000 ? 'Master' : userLevel.nextLevel > 1500 ? 'Expert' : userLevel.nextLevel > 500 ? 'Advanced' : 'Intermediate'}
              </span>
            </div>
          )}
        </div>

        {/* Subscription Card */}
        {!loadingSubscription && (
          <IOSSubscriptionCard 
            isArtisan={isArtisan}
            onUpgrade={handleUpgrade}
            onManage={handleManageSubscription}
            loading={processingUpgrade || processingPortal}
          />
        )}

        {/* Active Journeys */}
        {hasActiveJourneys && (
          <div className="ios-card ios-journeys-card">
            <div className="ios-card__header">
              <h3 className="ios-card__title">Active Journeys</h3>
              <button 
                className="ios-text-button"
                onClick={() => navigation.navigateToScreen('path-selection')}
              >
                View All
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="ios-journey-list">
              {inProgressPaths.slice(0, 3).map((path, index) => (
                <div key={path.id}>
                  <div 
                    className="ios-journey-item"
                    onClick={() => navigation.navigateToScreen('daily', { 
                      pathId: path.id, 
                      day: path.nextDay 
                    })}
                  >
                    <div className="ios-journey-item__left">
                      <div 
                        className="ios-journey-item__icon"
                        style={{ 
                          backgroundColor: `rgba(${path.color}, 0.15)`,
                          color: `rgb(${path.color})`
                        }}
                      >
                        <DynamicIcon name={path.iconName} size={20} />
                      </div>
                      <div className="ios-journey-item__info">
                        <h4 className="ios-journey-item__title">{path.title}</h4>
                        <p className="ios-journey-item__progress">
                          Day {path.nextDay} of {path.totalDays} • {path.percentage}% complete
                        </p>
                      </div>
                    </div>
                    
                    <ChevronRight size={20} className="ios-journey-item__chevron" />
                  </div>
                  {index < inProgressPaths.slice(0, 3).length - 1 && <div className="ios-separator" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="ios-card ios-achievements-card">
            <div className="ios-card__header">
              <h3 className="ios-card__title">Achievements ({achievements.length})</h3>
              {achievements.length > 3 && (
                <button 
                  className="ios-text-button"
                  onClick={() => setShowAllAchievements(!showAllAchievements)}
                >
                  {showAllAchievements ? 'Show Less' : `View All`}
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
            
            <div className="ios-achievements-grid">
              {(showAllAchievements ? achievements : achievements.slice(0, 3)).map(achievement => (
                <div key={achievement.id} className={`ios-achievement ${achievement.color}`}>
                  <div className="ios-achievement__icon">
                    <DynamicIcon name={achievement.icon} size={20} />
                  </div>
                  <div className="ios-achievement__content">
                    <h4 className="ios-achievement__title">{achievement.title}</h4>
                    <p className="ios-achievement__description">{achievement.description}</p>
                    <span className="ios-achievement__points">+{achievement.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="ios-card ios-quick-actions">
          <div className="ios-quick-actions__grid">
            <button 
              className="ios-quick-action"
              onClick={() => navigation.navigateToScreen('path-selection')}
            >
              <div className="ios-quick-action__icon ios-quick-action__icon--purple">
                <Compass size={20} />
              </div>
              <span>Explore</span>
            </button>
            
            <button 
              className="ios-quick-action"
              onClick={() => navigation.navigateToScreen('journal-archive')}
            >
              <div className="ios-quick-action__icon ios-quick-action__icon--blue">
                <Archive size={20} />
              </div>
              <span>Archive</span>
            </button>
            
            <button 
              className="ios-quick-action"
              onClick={() => navigation.navigateToScreen('analytics-dashboard')}
            >
              <div className="ios-quick-action__icon ios-quick-action__icon--green">
                <BarChart3 size={20} />
              </div>
              <span>Analytics</span>
            </button>
            
            <button 
              className="ios-quick-action"
              onClick={() => navigation.navigateToScreen('settings')}
            >
              <div className="ios-quick-action__icon ios-quick-action__icon--gray">
                <Settings size={20} />
              </div>
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Settings Menu */}
        <div className="ios-card ios-settings-menu">
          <div className="ios-list">
            <button 
              className="ios-list-item"
              onClick={() => navigation.navigateToScreen('settings', { activeSection: 'notifications' })}
            >
              <div className="ios-list-item__icon ios-list-item__icon--red">
                <Bell size={20} />
              </div>
              <span className="ios-list-item__title">Notifications</span>
              <ChevronRight size={20} className="ios-list-item__chevron" />
            </button>
            
            <div className="ios-separator" />
            
            <button 
              className="ios-list-item"
              onClick={() => navigation.navigateToScreen('settings', { activeSection: 'privacy' })}
            >
              <div className="ios-list-item__icon ios-list-item__icon--blue">
                <Lock size={20} />
              </div>
              <span className="ios-list-item__title">Privacy & Security</span>
              <ChevronRight size={20} className="ios-list-item__chevron" />
            </button>
            
            <div className="ios-separator" />
            
            <button 
              className="ios-list-item"
              onClick={() => navigation.navigateToScreen('settings', { activeSection: 'help' })}
            >
              <div className="ios-list-item__icon ios-list-item__icon--orange">
                <HelpCircle size={20} />
              </div>
              <span className="ios-list-item__title">Help & Support</span>
              <ChevronRight size={20} className="ios-list-item__chevron" />
            </button>
            
            <div className="ios-separator" />
            
            <button 
              className="ios-list-item"
              onClick={() => navigation.navigateToScreen('about')}
            >
              <div className="ios-list-item__icon ios-list-item__icon--gray">
                <Info size={20} />
              </div>
              <span className="ios-list-item__title">About</span>
              <ChevronRight size={20} className="ios-list-item__chevron" />
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <div className="ios-card ios-sign-out-card">
          <button 
            className="ios-sign-out-button"
            onClick={handleSignOutClick}
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>

        {/* App Version */}
        <div className="ios-app-version">
          <VersionDisplay minimal={true} />
        </div>
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

      {/* Sign Out Dialog */}
      {showSignOutDialog && (
        <div className="ios-modal-overlay" onClick={() => setShowSignOutDialog(false)}>
          <div className="ios-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ios-modal__header">
              <h2 className="ios-modal__title">Sign Out</h2>
            </div>
            
            <div className="ios-modal__content">
              <p className="ios-modal__message">
                Are you sure you want to sign out of your account?
              </p>
            </div>
            
            <div className="ios-modal__actions">
              <button 
                className="ios-modal__button ios-modal__button--cancel"
                onClick={() => setShowSignOutDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="ios-modal__button ios-modal__button--destructive"
                onClick={handleConfirmSignOut}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;