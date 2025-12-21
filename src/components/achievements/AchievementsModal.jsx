// src/components/achievements/AchievementsModal.jsx
// Enhanced Achievements Display Component

import React, { useState, useMemo } from 'react';
import { 
  X, 
  Trophy,
  Flame,
  BookOpen,
  Zap,
  Heart,
  Star,
  Target,
  Award,
  Crown,
  Sparkles,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import './AchievementsModal.css';

// Achievement Categories
const ACHIEVEMENT_CATEGORIES = {
  STREAK: 'streak',
  VOLUME: 'volume',
  JOURNEY: 'journey',
  CONSISTENCY: 'consistency',
  DEPTH: 'depth',
  MILESTONE: 'milestone'
};

// Enhanced Achievement Definitions
const ACHIEVEMENT_DEFINITIONS = {
  // Streak Achievements
  firstWeek: {
    id: 'first-week',
    icon: Flame,
    title: 'Week Warrior',
    description: '7 day streak',
    requirement: (stats) => stats.longestStreak >= 7,
    color: 'achievement-orange',
    points: 100,
    category: ACHIEVEMENT_CATEGORIES.STREAK,
    rarity: 'common'
  },
  twoWeeks: {
    id: 'two-weeks',
    icon: Zap,
    title: 'Fortnight Force',
    description: '14 day streak',
    requirement: (stats) => stats.longestStreak >= 14,
    color: 'achievement-yellow',
    points: 200,
    category: ACHIEVEMENT_CATEGORIES.STREAK,
    rarity: 'common'
  },
  monthMaster: {
    id: 'month-master',
    icon: Trophy,
    title: 'Month Master',
    description: '30 day streak',
    requirement: (stats) => stats.longestStreak >= 30,
    color: 'achievement-gold',
    points: 500,
    category: ACHIEVEMENT_CATEGORIES.STREAK,
    rarity: 'rare'
  },
  streakLegend: {
    id: 'streak-legend',
    icon: Crown,
    title: 'Streak Legend',
    description: '100 day streak',
    requirement: (stats) => stats.longestStreak >= 100,
    color: 'achievement-purple',
    points: 2000,
    category: ACHIEVEMENT_CATEGORIES.STREAK,
    rarity: 'legendary'
  },
  
  // Entry Volume Achievements
  firstEntry: {
    id: 'first-entry',
    icon: BookOpen,
    title: 'First Steps',
    description: 'First journal entry',
    requirement: (stats) => stats.totalEntries >= 1,
    color: 'achievement-blue',
    points: 50,
    category: ACHIEVEMENT_CATEGORIES.VOLUME,
    rarity: 'common'
  },
  tenEntries: {
    id: 'ten-entries',
    icon: Heart,
    title: 'Getting Started',
    description: '10 entries',
    requirement: (stats) => stats.totalEntries >= 10,
    color: 'achievement-blue',
    points: 100,
    category: ACHIEVEMENT_CATEGORIES.VOLUME,
    rarity: 'common'
  },
  fiftyEntries: {
    id: 'fifty-entries',
    icon: Star,
    title: 'Dedicated Writer',
    description: '50 entries',
    requirement: (stats) => stats.totalEntries >= 50,
    color: 'achievement-gold',
    points: 300,
    category: ACHIEVEMENT_CATEGORIES.VOLUME,
    rarity: 'rare'
  },
  hundredEntries: {
    id: 'hundred-entries',
    icon: Award,
    title: 'Century Club',
    description: '100 entries',
    requirement: (stats) => stats.totalEntries >= 100,
    color: 'achievement-purple',
    points: 1000,
    category: ACHIEVEMENT_CATEGORIES.VOLUME,
    rarity: 'epic'
  },
  fiveHundredEntries: {
    id: 'five-hundred-entries',
    icon: Crown,
    title: 'Master Chronicler',
    description: '500 entries',
    requirement: (stats) => stats.totalEntries >= 500,
    color: 'achievement-purple',
    points: 5000,
    category: ACHIEVEMENT_CATEGORIES.VOLUME,
    rarity: 'legendary'
  },
  
  // Journey Completion Achievements
  firstJourney: {
    id: 'first-journey',
    icon: Target,
    title: 'Path Finder',
    description: 'Complete your first journey',
    requirement: (stats) => stats.completedJourneys >= 1,
    color: 'achievement-green',
    points: 200,
    category: ACHIEVEMENT_CATEGORIES.JOURNEY,
    rarity: 'common'
  },
  threeJourneys: {
    id: 'three-journeys',
    icon: TrendingUp,
    title: 'Journey Explorer',
    description: 'Complete 3 journeys',
    requirement: (stats) => stats.completedJourneys >= 3,
    color: 'achievement-green',
    points: 500,
    category: ACHIEVEMENT_CATEGORIES.JOURNEY,
    rarity: 'rare'
  },
  allJourneys: {
    id: 'all-journeys',
    icon: Sparkles,
    title: 'Journey Master',
    description: 'Complete all available journeys',
    requirement: (stats) => stats.completedJourneys >= 10,
    color: 'achievement-purple',
    points: 2500,
    category: ACHIEVEMENT_CATEGORIES.JOURNEY,
    rarity: 'epic'
  },
  
  // Consistency Achievements
  weeklyConsistency: {
    id: 'weekly-consistency',
    icon: Calendar,
    title: 'Weekly Warrior',
    description: 'Journal 5+ days per week for 4 weeks',
    requirement: (stats) => stats.weeklyConsistency >= 4,
    color: 'achievement-cyan',
    points: 400,
    category: ACHIEVEMENT_CATEGORIES.CONSISTENCY,
    rarity: 'rare'
  },
  monthlyConsistency: {
    id: 'monthly-consistency',
    icon: Clock,
    title: 'Consistency King',
    description: 'Journal 20+ days per month for 3 months',
    requirement: (stats) => stats.monthlyConsistency >= 3,
    color: 'achievement-cyan',
    points: 800,
    category: ACHIEVEMENT_CATEGORIES.CONSISTENCY,
    rarity: 'epic'
  },
  
  // Depth Achievements
  longFormWriter: {
    id: 'long-form-writer',
    icon: BookOpen,
    title: 'Long Form Writer',
    description: 'Write 10 entries with 500+ words',
    requirement: (stats) => stats.longEntries >= 10,
    color: 'achievement-indigo',
    points: 600,
    category: ACHIEVEMENT_CATEGORIES.DEPTH,
    rarity: 'rare'
  },
  deepThinker: {
    id: 'deep-thinker',
    icon: Sparkles,
    title: 'Deep Thinker',
    description: 'Average 300+ words per entry over 30 entries',
    requirement: (stats) => stats.avgWordsPerEntry >= 300 && stats.totalEntries >= 30,
    color: 'achievement-indigo',
    points: 1000,
    category: ACHIEVEMENT_CATEGORIES.DEPTH,
    rarity: 'epic'
  },
  
  // Milestone Achievements
  firstMonth: {
    id: 'first-month',
    icon: Calendar,
    title: 'One Month Strong',
    description: '30 days as a member',
    requirement: (stats) => stats.daysSinceMember >= 30,
    color: 'achievement-pink',
    points: 150,
    category: ACHIEVEMENT_CATEGORIES.MILESTONE,
    rarity: 'common'
  },
  sixMonths: {
    id: 'six-months',
    icon: Award,
    title: 'Half Year Hero',
    description: '180 days as a member',
    requirement: (stats) => stats.daysSinceMember >= 180,
    color: 'achievement-pink',
    points: 500,
    category: ACHIEVEMENT_CATEGORIES.MILESTONE,
    rarity: 'rare'
  },
  oneYear: {
    id: 'one-year',
    icon: Crown,
    title: 'Annual Achievement',
    description: '365 days as a member',
    requirement: (stats) => stats.daysSinceMember >= 365,
    color: 'achievement-purple',
    points: 2000,
    category: ACHIEVEMENT_CATEGORIES.MILESTONE,
    rarity: 'legendary'
  }
};

function AchievementsModal({ isOpen, onClose, statistics }) {
  const { isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Calculate earned achievements
  const { earnedAchievements, totalPoints, progress } = useMemo(() => {
    const earned = [];
    let points = 0;

    Object.entries(ACHIEVEMENT_DEFINITIONS).forEach(([key, achievement]) => {
      if (achievement.requirement(statistics || {})) {
        earned.push({ key, ...achievement });
        points += achievement.points;
      }
    });

    const totalAchievements = Object.keys(ACHIEVEMENT_DEFINITIONS).length;
    const earnedCount = earned.length;

    return {
      earnedAchievements: earned,
      totalPoints: points,
      progress: {
        earned: earnedCount,
        total: totalAchievements,
        percentage: Math.round((earnedCount / totalAchievements) * 100)
      }
    };
  }, [statistics]);

  // Filter achievements by category
  const filteredAchievements = useMemo(() => {
    const allAchievements = Object.entries(ACHIEVEMENT_DEFINITIONS).map(([key, achievement]) => ({
      key,
      ...achievement,
      isEarned: earnedAchievements.some(a => a.key === key)
    }));

    if (selectedCategory === 'all') {
      return allAchievements;
    }

    return allAchievements.filter(a => a.category === selectedCategory);
  }, [selectedCategory, earnedAchievements]);

  // Get category stats
  const categoryStats = useMemo(() => {
    const stats = {};
    
    Object.values(ACHIEVEMENT_CATEGORIES).forEach(category => {
      const categoryAchievements = Object.values(ACHIEVEMENT_DEFINITIONS).filter(
        a => a.category === category
      );
      const earnedInCategory = earnedAchievements.filter(
        a => a.category === category
      );
      
      stats[category] = {
        earned: earnedInCategory.length,
        total: categoryAchievements.length
      };
    });

    return stats;
  }, [earnedAchievements]);

  if (!isOpen) return null;

  return (
    <div className="am-overlay" onClick={onClose} data-theme={isDarkMode ? 'dark' : 'light'}>
      <div className="am-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="am-header">
          <div className="am-title-wrapper">
            <Trophy className="am-title-icon" size={24} />
            <div>
              <h2 className="am-title">Achievements</h2>
              <p className="am-subtitle">
                {progress.earned} of {progress.total} unlocked · {totalPoints.toLocaleString()} points
              </p>
            </div>
          </div>
          <button 
            className="am-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="am-progress-section">
          <div className="am-progress-bar">
            <div 
              className="am-progress-fill"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <p className="am-progress-text">{progress.percentage}% Complete</p>
        </div>

        {/* Category Filter */}
        <div className="am-categories">
          <button
            className={`am-category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          <button
            className={`am-category-btn ${selectedCategory === ACHIEVEMENT_CATEGORIES.STREAK ? 'active' : ''}`}
            onClick={() => setSelectedCategory(ACHIEVEMENT_CATEGORIES.STREAK)}
          >
            <Flame size={16} />
            Streaks
            <span className="am-category-count">
              {categoryStats[ACHIEVEMENT_CATEGORIES.STREAK]?.earned}/{categoryStats[ACHIEVEMENT_CATEGORIES.STREAK]?.total}
            </span>
          </button>
          <button
            className={`am-category-btn ${selectedCategory === ACHIEVEMENT_CATEGORIES.VOLUME ? 'active' : ''}`}
            onClick={() => setSelectedCategory(ACHIEVEMENT_CATEGORIES.VOLUME)}
          >
            <BookOpen size={16} />
            Volume
            <span className="am-category-count">
              {categoryStats[ACHIEVEMENT_CATEGORIES.VOLUME]?.earned}/{categoryStats[ACHIEVEMENT_CATEGORIES.VOLUME]?.total}
            </span>
          </button>
          <button
            className={`am-category-btn ${selectedCategory === ACHIEVEMENT_CATEGORIES.JOURNEY ? 'active' : ''}`}
            onClick={() => setSelectedCategory(ACHIEVEMENT_CATEGORIES.JOURNEY)}
          >
            <Target size={16} />
            Journeys
            <span className="am-category-count">
              {categoryStats[ACHIEVEMENT_CATEGORIES.JOURNEY]?.earned}/{categoryStats[ACHIEVEMENT_CATEGORIES.JOURNEY]?.total}
            </span>
          </button>
          <button
            className={`am-category-btn ${selectedCategory === ACHIEVEMENT_CATEGORIES.CONSISTENCY ? 'active' : ''}`}
            onClick={() => setSelectedCategory(ACHIEVEMENT_CATEGORIES.CONSISTENCY)}
          >
            <Calendar size={16} />
            Consistency
            <span className="am-category-count">
              {categoryStats[ACHIEVEMENT_CATEGORIES.CONSISTENCY]?.earned}/{categoryStats[ACHIEVEMENT_CATEGORIES.CONSISTENCY]?.total}
            </span>
          </button>
        </div>

        {/* Achievements Grid */}
        <div className="am-content">
          <div className="am-achievements-grid">
            {filteredAchievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.key}
                  className={`am-achievement-card ${achievement.isEarned ? 'earned' : 'locked'} ${achievement.rarity}`}
                >
                  {!achievement.isEarned && (
                    <div className="am-lock-overlay">
                      <Lock size={24} />
                    </div>
                  )}
                  
                  <div className={`am-achievement-icon ${achievement.color}`}>
                    <Icon size={24} />
                  </div>
                  
                  <div className="am-achievement-content">
                    <h3 className="am-achievement-title">{achievement.title}</h3>
                    <p className="am-achievement-description">{achievement.description}</p>
                    <div className="am-achievement-footer">
                      <span className={`am-rarity-badge ${achievement.rarity}`}>
                        {achievement.rarity}
                      </span>
                      <span className="am-points">
                        {achievement.points} pts
                      </span>
                    </div>
                  </div>

                  {achievement.isEarned && (
                    <div className="am-earned-badge">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AchievementsModal;

// Export achievement definitions for use in other components
export { ACHIEVEMENT_DEFINITIONS };
