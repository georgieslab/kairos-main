//
// src/pages/CompletedPathsScreen.jsx - Dedicated Completed Journeys Page
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useUserProgress } from '../hooks/useUserProgress';
import { 
  Award, 
  Calendar, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Trophy,
  BarChart3,
  FileText,
  RotateCcw,
  Eye,
  Sparkles,
  Target,
  Clock,
  TrendingUp,
  Home,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Grid,
  List,
  Share2,
  Download,
  ChevronLeft,
  Crown,
  Zap,
  Heart,
  BookOpen
} from 'lucide-react';

// Import components
import DynamicIcon from '../components/common/DynamicIcon';
import VersionDisplay from '../components/common/VersionDisplay';

// Import styles
import '../styles/pages/completedPaths.css';

const CompletedPathsScreen = ({ navigateToScreen }) => {
  const { t } = useTranslation('pages');
  const { userProfile } = useAuth();
  const { isDarkMode } = useTheme();
  const {
    completedPaths,
    stats,
    isLoading,
    hasCompletedJourneys
  } = useUserProgress();

  // Local state
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'duration', 'alphabetical'
  const [filterBy, setFilterBy] = useState('all'); // 'all', 'beginner', 'intermediate', 'advanced'
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 150);
  }, []);

  // Filter and sort completed paths
  const getFilteredAndSortedPaths = () => {
    let filtered = [...completedPaths];

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(path =>
        path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        path.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (path.tags && path.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Apply difficulty filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(path => path.difficulty === filterBy);
    }

    // Apply sorting
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => {
          const aDate = new Date(a.completedAt || 0);
          const bDate = new Date(b.completedAt || 0);
          return bDate - aDate;
        });
        break;
      case 'duration':
        filtered.sort((a, b) => b.totalDays - a.totalDays);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredPaths = getFilteredAndSortedPaths();

  // Navigation functions
  const goToJourneyCompletion = (pathId) => {
    navigateToScreen('journey-complete', { pathId });
  };

  const restartJourney = (pathId) => {
    navigateToScreen('journey-preview', { pathId });
  };

  const viewJourneyDetails = (pathId) => {
    navigateToScreen('daily', { day: 1, pathId, fromCompletion: true });
  };

  const goToHome = () => {
    navigateToScreen('home');
  };

  const goToArchive = () => {
    navigateToScreen('journal-archive');
  };

  const goToAnalytics = () => {
    navigateToScreen('analytics-dashboard');
  };

  // Calculate completion stats
  const getCompletionStats = () => {
    const totalDaysCompleted = completedPaths.reduce((sum, path) => sum + path.totalDays, 0);
    const averageJourneyLength = completedPaths.length > 0 ? Math.round(totalDaysCompleted / completedPaths.length) : 0;
    
    // Get difficulty breakdown
    const difficultyBreakdown = completedPaths.reduce((acc, path) => {
      acc[path.difficulty] = (acc[path.difficulty] || 0) + 1;
      return acc;
    }, {});

    return {
      totalJourneys: completedPaths.length,
      totalDaysCompleted,
      averageJourneyLength,
      difficultyBreakdown
    };
  };

  const completionStats = getCompletionStats();

  // Loading state
  if (isLoading) {
    return (
      <div className={`cp-container ${isDarkMode ? 'cp-dark' : 'cp-light'}`}>
        <div className="cp-loading-container">
          <div className="cp-loading-spinner"></div>
          <p>{t('completedPaths.loading', 'Loading your completed journeys...')}</p>
        </div>
      </div>
    );
  }

  // No completed paths state
  if (!hasCompletedJourneys || completedPaths.length === 0) {
    return (
      <div className={`cp-container ${isDarkMode ? 'cp-dark' : 'cp-light'}`}>
        <div className="cp-version-banner">
          <VersionDisplay minimal={true} />
        </div>

        <header className="cp-header">
          <div className="cp-header-content">
            <button className="cp-back-btn" onClick={goToHome}>
              <ChevronLeft size={20} />
              <span>{t('completedPaths.home', 'Home')}</span>
            </button>
            <div className="cp-header-main">
              <h1 className="cp-title">
                <Trophy className="cp-title-icon" />
                {t('completedPaths.pageTitle', 'Completed Journeys')}
              </h1>
            </div>
          </div>
        </header>

        <div className="cp-empty-state">
          <div className="cp-empty-icon">
            <Award size={64} />
          </div>
          <h2 className="cp-empty-title">{t('completedPaths.emptyTitle', 'No Completed Journeys Yet')}</h2>
          <p className="cp-empty-text">
            {t('completedPaths.emptyText', 'Complete your first journey to start building your achievement collection')}
          </p>
          <button
            className="cp-empty-btn"
            onClick={() => navigateToScreen('path-selection')}
          >
            <Sparkles size={18} />
            <span>{t('completedPaths.exploreJourneys', 'Explore Journeys')}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`cp-container ${isLoaded ? 'cp-loaded' : ''} ${isDarkMode ? 'cp-dark' : 'cp-light'}`}>
      {/* Version Display Banner */}
      <div className="cp-version-banner">
        <VersionDisplay minimal={true} />
      </div>

      {/* Header */}
      <header className="cp-header">
        <div className="cp-header-content">
          <button className="cp-back-btn" onClick={goToHome}>
            <ChevronLeft size={20} />
            <span>{t('completedPaths.home', 'Home')}</span>
          </button>

          <div className="cp-header-main">
            <h1 className="cp-title">
              <Trophy className="cp-title-icon" />
              {t('completedPaths.pageTitle', 'Completed Journeys')}
            </h1>
            <p className="cp-subtitle">
              {completedPaths.length === 1
                ? t('completedPaths.subtitleSingular', '1 journey completed')
                : t('completedPaths.subtitlePlural', '{{count}} journeys completed', { count: completedPaths.length })}
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="cp-stats-overview">
          <div className="cp-stats-grid">
            <div className="cp-stat-card">
              <div className="cp-stat-icon-wrapper">
                <Crown className="cp-stat-icon" />
              </div>
              <div className="cp-stat-content">
                <div className="cp-stat-number">{completionStats.totalJourneys}</div>
                <div className="cp-stat-label">{t('completedPaths.statCompleted', 'Completed')}</div>
              </div>
            </div>

            <div className="cp-stat-card">
              <div className="cp-stat-icon-wrapper">
                <Calendar className="cp-stat-icon" />
              </div>
              <div className="cp-stat-content">
                <div className="cp-stat-number">{completionStats.totalDaysCompleted}</div>
                <div className="cp-stat-label">{t('completedPaths.statTotalDays', 'Total Days')}</div>
              </div>
            </div>

            <div className="cp-stat-card">
              <div className="cp-stat-icon-wrapper">
                <TrendingUp className="cp-stat-icon" />
              </div>
              <div className="cp-stat-content">
                <div className="cp-stat-number">{completionStats.averageJourneyLength}</div>
                <div className="cp-stat-label">{t('completedPaths.statAvgLength', 'Avg Length')}</div>
              </div>
            </div>

            <div className="cp-stat-card">
              <div className="cp-stat-icon-wrapper">
                <Target className="cp-stat-icon" />
              </div>
              <div className="cp-stat-content">
                <div className="cp-stat-number">100%</div>
                <div className="cp-stat-label">{t('completedPaths.statSuccessRate', 'Success Rate')}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <section className="cp-controls">
        <div className="cp-controls-row">
          {/* Search */}
          <div className="cp-search-wrapper">
            <Search className="cp-search-icon" />
            <input
              type="text"
              placeholder={t('completedPaths.searchPlaceholder', 'Search completed journeys...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cp-search-input"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="cp-view-toggle">
            <button
              className={`cp-view-btn ${viewMode === 'grid' ? 'cp-view-btn-active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={18} />
            </button>
            <button
              className={`cp-view-btn ${viewMode === 'list' ? 'cp-view-btn-active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="cp-controls-row">
          {/* Filter */}
          <div className="cp-filter-wrapper">
            <Filter className="cp-filter-icon" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="cp-filter-select"
            >
              <option value="all">{t('completedPaths.filterAll', 'All Difficulties')}</option>
              <option value="beginner">{t('completedPaths.filterBeginner', 'Beginner')}</option>
              <option value="intermediate">{t('completedPaths.filterIntermediate', 'Intermediate')}</option>
              <option value="advanced">{t('completedPaths.filterAdvanced', 'Advanced')}</option>
            </select>
          </div>

          {/* Sort */}
          <div className="cp-sort-wrapper">
            <SortDesc className="cp-sort-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="cp-sort-select"
            >
              <option value="recent">{t('completedPaths.sortRecent', 'Recently Completed')}</option>
              <option value="duration">{t('completedPaths.sortDuration', 'Journey Length')}</option>
              <option value="alphabetical">{t('completedPaths.sortAlphabetical', 'Alphabetical')}</option>
            </select>
          </div>
        </div>
      </section>

      {/* Completed Journeys */}
      <section className="cp-journeys-section">
        {filteredPaths.length === 0 ? (
          <div className="cp-no-results">
            <Search size={48} />
            <h3>{t('completedPaths.noResultsTitle', 'No journeys found')}</h3>
            <p>{t('completedPaths.noResultsText', 'Try adjusting your search or filters')}</p>
          </div>
        ) : (
          <div className={`cp-journeys-${viewMode}`}>
            {filteredPaths.map((path, index) => (
              <div
                key={`${path.id}-${index}`}
                className={`cp-journey-card cp-journey-${path.id}`}
                style={{
                  '--path-color': path.color,
                  '--path-color-rgb': path.color
                }}
              >
                {/* Completion Badge */}
                <div className="cp-completion-badge">
                  <Crown className="cp-completion-icon" />
                  <span>{t('completedPaths.badgeCompleted', 'Completed')}</span>
                </div>

                {/* Journey Header */}
                <div className="cp-journey-header">
                  <div
                    className="cp-journey-icon-wrapper"
                    style={{
                      backgroundColor: `rgba(${path.color}, 0.15)`,
                      color: `rgb(${path.color})`
                    }}
                  >
                    <DynamicIcon name={path.iconName} className="cp-journey-icon" />
                  </div>
                  
                  <div className="cp-journey-meta">
                    <div className="cp-journey-duration">
                      <Calendar size={14} />
                      <span>{t('completedPaths.daysCount', '{{count}} days', { count: path.totalDays })}</span>
                    </div>
                    <div className="cp-journey-difficulty">
                      <Target size={14} />
                      <span className={`cp-difficulty cp-difficulty-${path.difficulty}`}>
                        {path.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Journey Content */}
                <div className="cp-journey-content">
                  <h3 className="cp-journey-title">{path.title}</h3>
                  <p className="cp-journey-description">{path.description}</p>
                  
                  {/* Completion Stats */}
                  <div className="cp-completion-stats">
                    <div className="cp-completion-stat">
                      <CheckCircle size={16} />
                      <span>{t('completedPaths.daysCompleted', '{{total}}/{{total}} days completed', { total: path.totalDays })}</span>
                    </div>
                    {path.completedAt && (
                      <div className="cp-completion-stat">
                        <Clock size={16} />
                        <span>{t('completedPaths.finishedOn', 'Finished {{date}}', { date: new Date(path.completedAt).toLocaleDateString() })}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {path.tags && path.tags.length > 0 && (
                    <div className="cp-journey-tags">
                      {path.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span key={tagIndex} className="cp-journey-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Journey Actions */}
                <div className="cp-journey-actions">
                  <button
                    className="cp-action-btn cp-action-primary"
                    onClick={() => goToJourneyCompletion(path.id)}
                  >
                    <Star size={16} />
                    <span>{t('completedPaths.actionViewSummary', 'View Summary')}</span>
                  </button>

                  <button
                    className="cp-action-btn cp-action-secondary"
                    onClick={() => viewJourneyDetails(path.id)}
                  >
                    <Eye size={16} />
                    <span>{t('completedPaths.actionViewEntries', 'View Entries')}</span>
                  </button>

                  <button
                    className="cp-action-btn cp-action-tertiary"
                    onClick={() => restartJourney(path.id)}
                  >
                    <RotateCcw size={16} />
                    <span>{t('completedPaths.actionRestart', 'Restart')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions Footer */}
      <footer className="cp-footer">
        <div className="cp-footer-actions">
          <button
            className="cp-footer-btn"
            onClick={goToArchive}
          >
            <FileText size={18} />
            <span>{t('completedPaths.footerViewEntries', 'View All Entries')}</span>
          </button>

          <button
            className="cp-footer-btn"
            onClick={goToAnalytics}
          >
            <BarChart3 size={18} />
            <span>{t('completedPaths.footerViewAnalytics', 'View Analytics')}</span>
          </button>

          <button
            className="cp-footer-btn"
            onClick={() => navigateToScreen('path-selection')}
          >
            <Sparkles size={18} />
            <span>{t('completedPaths.footerStartNew', 'Start New Journey')}</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CompletedPathsScreen;