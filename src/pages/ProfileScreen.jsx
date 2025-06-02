// src/pages/ProfileScreen.jsx - Unified and Enhanced Version
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  HelpCircle, 
  LogOut, 
  BookOpen, 
  ChevronRight, 
  Edit2,
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
  Download,
  Archive,
  Sparkles,
  Clock,
  Target,
  Heart,
  Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '../contexts/NavigationContext';
import { getAllJourneyPaths, getJourneyPath } from '../data/JourneyData';
import { 
  getProgressFieldForPath, 
  getAllActiveJourneys, 
  calculateUserStats 
} from '../utils/pathUtils';
import VersionDisplay from '../components/common/VersionDisplay';
import DynamicIcon from '../components/common/DynamicIcon';
import '../styles/components/profile.css';

const ProfileScreen = ({ handleSignOut }) => {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation();
  
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalEntries: 0,
    currentStreak: 0,
    completedPaths: 0,
    totalDaysActive: 0,
    averageEntriesPerWeek: 0,
    longestStreak: 0
  });
  const [achievements, setAchievements] = useState([]);
  const [activeJourney, setActiveJourney] = useState(null);

  // Load user data and stats
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      
      try {
        if (currentUser && userProfile) {
          // Calculate comprehensive user stats
          const stats = calculateUserStats(userProfile);
          setUserStats(stats);
          
          // Get active journey
          const activeJourneys = getAllActiveJourneys(userProfile);
          if (activeJourneys && activeJourneys.length > 0) {
            const journey = activeJourneys[0];
            const pathData = getJourneyPath(journey.pathId);
            
            setActiveJourney({
              ...journey,
              pathData,
              progressPercent: Math.round((journey.progress?.completedDays?.length || 0) / pathData.duration * 100)
            });
          }
          
          // Calculate achievements
          const userAchievements = calculateAchievements(stats, userProfile);
          setAchievements(userAchievements);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [currentUser, userProfile]);

  // Calculate user achievements
  const calculateAchievements = (stats, profile) => {
    const achievements = [];
    
    // Streak achievements
    if (stats.longestStreak >= 7) {
      achievements.push({
        id: 'week-streak',
        icon: 'Zap',
        title: 'Week Warrior',
        description: 'Journaled for 7 days straight',
        color: 'text-yellow-500'
      });
    }
    
    if (stats.longestStreak >= 30) {
      achievements.push({
        id: 'month-streak',
        icon: 'Target',
        title: 'Month Master',
        description: 'Journaled for 30 days straight',
        color: 'text-orange-500'
      });
    }
    
    // Entry achievements
    if (stats.totalEntries >= 10) {
      achievements.push({
        id: 'ten-entries',
        icon: 'BookOpen',
        title: 'Getting Started',
        description: 'Completed 10 journal entries',
        color: 'text-blue-500'
      });
    }
    
    if (stats.totalEntries >= 50) {
      achievements.push({
        id: 'fifty-entries',
        title: 'Dedicated Writer',
        icon: 'Heart',
        description: 'Completed 50 journal entries',
        color: 'text-pink-500'
      });
    }
    
    // Path completion achievements
    if (stats.completedPaths >= 1) {
      achievements.push({
        id: 'first-path',
        icon: 'Award',
        title: 'Path Finder',
        description: 'Completed your first journey',
        color: 'text-green-500'
      });
    }
    
    return achievements;
  };

  const getUserInfo = () => {
    const name = userProfile?.displayName || userProfile?.name || 'User';
    const email = currentUser?.email || '';
    const initials = name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
    
    return { name, email, initials };
  };

  const { name, email, initials } = getUserInfo();

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="loading-spinner-large"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`profile-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Header */}
      <div className="profile-header">
        <h1 className="profile-title">Profile</h1>
        <div className="profile-header-actions">
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} theme`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            className="edit-profile-btn"
            onClick={() => navigation.navigateToScreen('edit-profile')}
            aria-label="Edit profile"
          >
            <Edit2 size={20} />
          </button>
        </div>
      </div>

      {/* User Card */}
      <div className="profile-card user-card">
        <div className="user-avatar-section">
          <div className="user-avatar">
            {userProfile?.photoURL ? (
              <img src={userProfile.photoURL} alt="Profile" className="avatar-image" />
            ) : (
              <span className="avatar-initials">{initials}</span>
            )}
          </div>
          
          <div className="user-info">
            <h2 className="user-name">{name}</h2>
            <p className="user-email">{email}</p>
            <p className="user-member-since">
              Member since {userProfile?.createdAt ? 
                new Date(userProfile.createdAt.toDate()).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                }) : 'recently'}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="stats-grid enhanced-stats">
        <div className="stat-card primary">
          <div className="stat-icon-wrapper">
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{userStats.totalEntries}</div>
            <div className="stat-label">Journal Entries</div>
          </div>
        </div>
        
        <div className="stat-card secondary">
          <div className="stat-icon-wrapper">
            <Zap size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{userStats.longestStreak}</div>
            <div className="stat-label">Best Streak</div>
          </div>
        </div>
        
        <div className="stat-card tertiary">
          <div className="stat-icon-wrapper">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{userStats.completedPaths}</div>
            <div className="stat-label">Completed Paths</div>
          </div>
        </div>
        
        <div className="stat-card quaternary">
          <div className="stat-icon-wrapper">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-number">{userStats.totalDaysActive}</div>
            <div className="stat-label">Days Active</div>
          </div>
        </div>
      </div>

      {/* Current Journey Card */}
      {activeJourney && (
        <div className="profile-card current-journey-card">
          <div className="card-header">
            <div className="header-icon">
              <TrendingUp size={20} />
            </div>
            <h3 className="card-title">Current Journey</h3>
            <span className="journey-progress-badge">{activeJourney.progressPercent}%</span>
          </div>
          
          <div className="journey-content">
            <div className="journey-info">
              <div className="journey-icon-wrapper">
                <DynamicIcon name={activeJourney.pathData.iconName} size={24} />
              </div>
              <div className="journey-details">
                <h4 className="journey-name">{activeJourney.pathData.title}</h4>
                <p className="journey-progress-text">
                  Day {activeJourney.nextDay} of {activeJourney.pathData.duration}
                </p>
                <div className="journey-tags">
                  {activeJourney.pathData.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className="journey-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="progress-section">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${activeJourney.progressPercent}%`,
                    backgroundColor: `rgb(${activeJourney.pathData.color})`
                  }}
                ></div>
              </div>
              
              {activeJourney.progress?.currentStreak > 0 && (
                <div className="streak-indicator">
                  <Star size={16} />
                  <span>{activeJourney.progress.currentStreak} day streak!</span>
                </div>
              )}
            </div>
            
            <button 
              className="continue-journey-btn"
              onClick={() => navigation.navigateToScreen('daily', { 
                pathId: activeJourney.pathId, 
                day: activeJourney.nextDay 
              })}
              style={{ backgroundColor: `rgb(${activeJourney.pathData.color})` }}
            >
              Continue Journey
            </button>
          </div>
        </div>
      )}

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <div className="profile-card achievements-card">
          <div className="card-header">
            <div className="header-icon">
              <Award size={20} />
            </div>
            <h3 className="card-title">Recent Achievements</h3>
          </div>
          
          <div className="achievements-grid">
            {achievements.slice(0, 4).map(achievement => (
              <div key={achievement.id} className="achievement-item">
                <div className={`achievement-icon ${achievement.color}`}>
                  <DynamicIcon name={achievement.icon} size={20} />
                </div>
                <div className="achievement-content">
                  <h4 className="achievement-title">{achievement.title}</h4>
                  <p className="achievement-description">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="profile-card quick-actions-card">
        <div className="card-header">
          <div className="header-icon">
            <Sparkles size={20} />
          </div>
          <h3 className="card-title">Quick Actions</h3>
        </div>
        
        <div className="quick-actions-grid">
          <button 
            className="quick-action-btn"
            onClick={() => navigation.navigateToScreen('path-selection')}
          >
            <div className="action-icon">
              <BookOpen size={20} />
            </div>
            <span>Explore Paths</span>
          </button>
          
          <button 
            className="quick-action-btn"
            onClick={() => navigation.navigateToScreen('journal-archive')}
          >
            <div className="action-icon">
              <Archive size={20} />
            </div>
            <span>View Archive</span>
          </button>
          
          <button 
            className="quick-action-btn"
            onClick={() => navigation.navigateToScreen('analytics-dashboard')}
          >
            <div className="action-icon">
              <TrendingUp size={20} />
            </div>
            <span>Analytics</span>
          </button>
          
          <button 
            className="quick-action-btn"
            onClick={() => navigation.navigateToScreen('settings')}
          >
            <div className="action-icon">
              <Settings size={20} />
            </div>
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Settings Menu */}
      <div className="profile-card settings-menu-card">
        <div className="card-header">
          <div className="header-icon">
            <Settings size={20} />
          </div>
          <h3 className="card-title">Settings & Support</h3>
        </div>
        
        <div className="settings-menu">
          <button 
            className="menu-item"
            onClick={() => navigation.navigateToScreen('settings', { activeSection: 'notifications' })}
          >
            <div className="menu-item-content">
              <Bell size={18} />
              <span>Notifications</span>
            </div>
            <ChevronRight size={18} />
          </button>
          
          <button 
            className="menu-item"
            onClick={() => navigation.navigateToScreen('settings', { activeSection: 'privacy' })}
          >
            <div className="menu-item-content">
              <Lock size={18} />
              <span>Privacy & Security</span>
            </div>
            <ChevronRight size={18} />
          </button>
          
          <button 
            className="menu-item"
            onClick={() => navigation.navigateToScreen('settings', { activeSection: 'help' })}
          >
            <div className="menu-item-content">
              <HelpCircle size={18} />
              <span>Help & Support</span>
            </div>
            <ChevronRight size={18} />
          </button>
          
          <button 
            className="menu-item"
            onClick={() => navigation.navigateToScreen('about')}
          >
            <div className="menu-item-content">
              <Info size={18} />
              <span>About Καιρός</span>
            </div>
            <ChevronRight size={18} />
          </button>
          
          <div className="menu-divider"></div>
          
          <button 
            className="menu-item danger"
            onClick={handleSignOut}
          >
            <div className="menu-item-content">
              <LogOut size={18} />
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      </div>

      {/* App Version */}
      <div className="app-info">
        <p className="app-name">Καιρός Journal</p>
        <VersionDisplay minimal={true} />
      </div>
    </div>
  );
};

export default ProfileScreen;