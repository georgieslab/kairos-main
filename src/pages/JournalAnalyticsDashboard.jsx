// src/pages/AnalyticsScreen.jsx - Apple Glass v4.1 (Fixed)
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useUserStatistics } from '../hooks/useUserStatistics';
import { useUserProgress } from '../hooks/useUserProgress';
import { extractThemesFromEntries, extractEmotionData } from '../utils/textProcessing';
import { useTheme } from '../contexts/ThemeContext';
import AnalyticsSkeleton from '../components/analytics/AnalyticsSkeleton';
import AIPersonDescription from '../components/analytics/AIPersonDescription';
import DailyAIQuestion from '../components/analytics/DailyAIQuestion';
import EmotionTrends from '../components/analytics/EmotionTrends';
import ThemeCloud from '../components/analytics/ThemeCloud';
import JournalCalendar from '../components/analytics/JournalCalendar';
import InsightSummary from '../components/analytics/InsightSummary';
import MoodTrends from '../components/analytics/MoodTrends';
import {
  Flame, FileText, Target, TrendingUp, Sparkles, Heart, Calendar,
  ChevronRight, RefreshCw, Brain, Eye, EyeOff, Cloud, Moon
} from 'lucide-react';
import '../styles/pages/analyticsScreen.css';

// Reusable Glass Card with prefixed class
const AsGlass = ({ children, className = '', onClick, ariaExpanded, style }) => (
  <div 
    className={`as-glass ${className}`}
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    aria-expanded={ariaExpanded}
    style={style}
  >
    {children}
  </div>
);

// Expandable Section
const AsExpandable = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  sectionId, 
  isOpen, 
  onToggle, 
  children,
  colorRgb = '85, 139, 110'
}) => (
  <AsGlass 
    className="as-expandable"
    onClick={() => onToggle(sectionId)}
    ariaExpanded={isOpen}
  >
    <div className="as-expand-header">
      <div 
        className="as-expand-icon"
        style={{ 
          background: `rgba(${colorRgb}, 0.15)`,
          color: `rgb(${colorRgb})`
        }}
      >
        <Icon size={18} />
      </div>
      <div className="as-expand-info">
        <h3 className="as-expand-title">{title}</h3>
        <p className="as-expand-subtitle">{subtitle}</p>
      </div>
      <div className={`as-expand-chevron ${isOpen ? 'as-open' : ''}`}>
        <ChevronRight size={16} />
      </div>
    </div>
    
    <div 
      className={`as-expand-body ${isOpen ? 'as-open' : ''}`}
      aria-hidden={!isOpen}
    >
      {children}
    </div>
  </AsGlass>
);

// Pulse Stat
const AsPulseStat = ({ icon: Icon, value, label }) => (
  <div className="as-pulse-stat">
    <Icon size={14} className="as-pulse-icon" />
    <span className="as-pulse-value">{value}</span>
    <span className="as-pulse-label">{label}</span>
  </div>
);

const AnalyticsScreen = ({ navigateToScreen }) => {
  const { t } = useTranslation('analytics');
  const { currentUser, userProfile } = useAuth();
  const { isDarkMode } = useTheme(); // ADD THIS
  const { 
    statistics, 
    isLoading: statsLoading, 
    error: statsError,
    getFilteredEntries,
    refreshStatistics 
  } = useUserStatistics();
  
  const { progressStats, inProgressPaths, completedPaths } = useUserProgress();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [timePeriod, setTimePeriod] = useState('all');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshStatistics();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const toggleSection = useCallback((sectionId) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId);
  }, []);

  const filteredEntries = getFilteredEntries({ 
    timePeriod: timePeriod === 'all' ? undefined : timePeriod
  });
  
  const emotionData = filteredEntries.length > 0 ? extractEmotionData(filteredEntries).emotions : [];
  const themeData = filteredEntries.length > 0 ? extractThemesFromEntries(filteredEntries) : [];
  
  const calendarData = filteredEntries.length > 0 ? (() => {
    const calData = {};
    filteredEntries.forEach(entry => {
      if (!entry.timestamp) return;
      try {
        let entryDate;
        if (entry.timestamp?.toDate) {
          entryDate = entry.timestamp.toDate();
        } else if (entry.timestamp?.seconds !== undefined) {
          entryDate = new Date(entry.timestamp.seconds * 1000);
        } else if (typeof entry.timestamp === 'string') {
          entryDate = new Date(entry.timestamp);
        } else if (typeof entry.timestamp === 'number') {
          entryDate = new Date(entry.timestamp);
        } else {
          return;
        }
        
        if (isNaN(entryDate.getTime())) return;
        
        const dateStr = entryDate.toISOString().split('T')[0];
        calData[dateStr] = (calData[dateStr] || 0) + 1;
      } catch (err) {
        return;
      }
    });
    return Object.entries(calData).map(([date, count]) => ({ date, count }));
  })() : [];

  if (statsLoading) {
    return <AnalyticsSkeleton />;
  }

  if (statsError) {
    return (
      <div className="as-state-wrap">
        <AsGlass className="as-state-card">
          <Brain size={40} strokeWidth={1} className="as-state-icon" />
          <h2>{t('dashboard.errorTitle', "Couldn't load insights")}</h2>
          <p>{statsError}</p>
          <button onClick={handleRefresh} className="as-action-btn">
            <RefreshCw size={16} />
            {t('dashboard.tryAgain', 'Try Again')}
          </button>
        </AsGlass>
      </div>
    );
  }

  if (statistics.totalEntries < 2) {
    return (
      <div className="as-state-wrap">
        <AsGlass className="as-state-card">
          <Target size={40} strokeWidth={1} className="as-state-icon" />
          <h2>{t('dashboard.notEnoughDataTitle', 'Not Enough Data Yet')}</h2>
          <p>{t('dashboard.notEnoughDataText', 'Complete at least 2 journal entries to unlock your personal insights.')}</p>
          <button
            onClick={() => navigateToScreen('write')}
            className="as-action-btn as-primary"
          >
            <Sparkles size={16} />
            {t('dashboard.writeFirstEntry', 'Write Your First Entry')}
            <ChevronRight size={16} />
          </button>
        </AsGlass>
      </div>
    );
  }

  return (
    <div className={`analytics-screen ${!isDarkMode ? 'light-mode' : ''}`}>
      

      <div className="as-content">
        {/* PULSE */}
        <section className="as-section">
          <AsGlass className="as-pulse">
            <div className="as-pulse-row">
              <AsPulseStat icon={FileText} value={filteredEntries.length} label={t('dashboard.pulseEntries', 'Entries')} />
              <div className="as-pulse-divider" />
              <AsPulseStat icon={Flame} value={statistics.currentStreak || 0} label={t('dashboard.pulseStreak', 'Streak')} />
              <div className="as-pulse-divider" />
              <AsPulseStat icon={Target} value={`${inProgressPaths[0]?.percentage || 0}%`} label={t('dashboard.pulseProgress', 'Progress')} />
            </div>
            {/* Refresh action moved from TopBar into page content */}
            <div className="as-pulse-actions">
              <button 
                onClick={handleRefresh}
                className={`as-refresh-btn ${isRefreshing ? 'as-refreshing' : ''}`}
                disabled={isRefreshing}
                aria-label={t('dashboard.refreshInsights', 'Refresh insights')}
              >
                <RefreshCw size={16} />
              </button>
            </div>
            
            <div className="as-time-filter">
              {[
                { key: 'all', label: t('dashboard.filterAllTime', 'All Time') },
                { key: 'week', label: t('dashboard.filter7Days', '7 Days') },
                { key: 'month', label: t('dashboard.filter30Days', '30 Days') },
                { key: 'quarter', label: t('dashboard.filter90Days', '90 Days') }
              ].map(({ key, label }) => (
                <button 
                  key={key}
                  className={`as-time-pill ${timePeriod === key ? 'as-active' : ''}`}
                  onClick={() => setTimePeriod(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </AsGlass>
        </section>

        {/* CURRENT JOURNEY */}
        {inProgressPaths.length > 0 && (
          <section className="as-section">
            <AsGlass 
              className="as-focus"
              style={{ '--as-focus-color': inProgressPaths[0].color }}
              onClick={() => navigateToScreen('daily', { 
                pathId: inProgressPaths[0].id, 
                day: inProgressPaths[0].nextDay 
              })}
            >
              <div className="as-focus-header">
                <span className="as-focus-badge">
                  <TrendingUp size={12} />
                  {t('dashboard.currentJourney', 'Current Journey')}
                </span>
                <span className="as-focus-action">
                  {t('dashboard.view', 'View')}
                  <ChevronRight size={14} />
                </span>
              </div>
              <h3 className="as-focus-title">{inProgressPaths[0].title}</h3>
              <div className="as-focus-track">
                <div 
                  className="as-focus-fill"
                  style={{ 
                    transform: `translateX(${inProgressPaths[0].percentage - 100}%)`,
                    backgroundColor: `rgb(${inProgressPaths[0].color})`
                  }}
                />
              </div>
              <div className="as-focus-meta">
                <span>{t('dashboard.dayOf', 'Day {{current}} of {{total}}', { current: inProgressPaths[0].nextDay, total: inProgressPaths[0].totalDays })}</span>
                <span className="as-focus-dot">•</span>
                <span>{t('dashboard.completedCount', '{{count}} completed', { count: inProgressPaths[0].completedDaysList?.length || 0 })}</span>
              </div>
            </AsGlass>
          </section>
        )}

        {/* AI PERSONALITY */}
        {statistics.totalEntries >= 5 && (
          <section className="as-section">
            <AIPersonDescription 
              entries={statistics.allEntries}
              totalEntries={statistics.totalEntries}
              progressStats={progressStats}
            />
          </section>
        )}

        {/* DAILY AI QUESTION */}
        {statistics.totalEntries >= 3 && (
          <section className="as-section">
            <DailyAIQuestion 
              entries={statistics.allEntries}
              totalEntries={statistics.totalEntries}
              progressStats={progressStats}
            />
          </section>
        )}

        {/* EMOTIONS */}
        <section className="as-section">
          <AsExpandable
            icon={Heart}
            title={t('dashboard.emotionsTitle', 'Emotional Patterns')}
            subtitle={emotionData.length > 0
              ? t('dashboard.emotionsSubtitle', '{{emotions}} emotions in {{entries}} entries', { emotions: emotionData.length, entries: filteredEntries.length })
              : t('dashboard.emotionsSubtitleEmpty', 'Emotional analysis of your writing')
            }
            sectionId="emotions"
            isOpen={expandedSection === 'emotions'}
            onToggle={toggleSection}
            colorRgb="239, 68, 68"
          >
            <EmotionTrends
              data={emotionData}
              isDarkMode={isDarkMode}
              hideTitle={true}
              simplified={true}
            />
          </AsExpandable>
        </section>

        {/* THEMES */}
        <section className="as-section">
          <AsExpandable
            icon={Cloud}
            title={t('dashboard.themesTitle', 'Recurring Themes')}
            subtitle={themeData.length > 0
              ? t('dashboard.themesSubtitle', '{{themes}} themes from {{entries}} entries', { themes: themeData.length, entries: filteredEntries.length })
              : t('dashboard.themesSubtitleEmpty', 'Topics that appear frequently')
            }
            sectionId="themes"
            isOpen={expandedSection === 'themes'}
            onToggle={toggleSection}
            colorRgb="59, 130, 246"
          >
            <ThemeCloud data={themeData} isDarkMode={isDarkMode} />
          </AsExpandable>
        </section>

        {/* RHYTHM */}
        <section className="as-section">
          <AsExpandable
            icon={Calendar}
            title={t('dashboard.rhythmTitle', 'Journaling Rhythm')}
            subtitle={t('dashboard.rhythmSubtitle', '{{count}} active days tracked', { count: calendarData.length })}
            sectionId="habits"
            isOpen={expandedSection === 'habits'}
            onToggle={toggleSection}
            colorRgb="16, 185, 129"
          >
            <div className="as-habits-stats">
              <div className="as-habit-stat">
                <span className="as-habit-value">{progressStats?.currentStreak || 0}</span>
                <span className="as-habit-label">{t('dashboard.habitCurrent', 'Current')}</span>
              </div>
              <div className="as-habit-stat">
                <span className="as-habit-value">{statistics.longestStreak}</span>
                <span className="as-habit-label">{t('dashboard.habitBest', 'Best')}</span>
              </div>
              <div className="as-habit-stat">
                <span className="as-habit-value">{statistics.averageLength}</span>
                <span className="as-habit-label">{t('dashboard.habitAvgLength', 'Avg Length')}</span>
              </div>
            </div>
            <JournalCalendar data={calendarData} />
          </AsExpandable>
        </section>

        {/* INNER AURA (mood check-ins) */}
        <section className="as-section">
          <AsExpandable
            icon={Moon}
            title={t('dashboard.innerAuraTitle', 'Inner Aura')}
            subtitle={t('dashboard.innerAuraSubtitle', 'Your daily mood check-ins')}
            sectionId="inner-aura"
            isOpen={expandedSection === 'inner-aura'}
            onToggle={toggleSection}
            colorRgb="129, 140, 248"
          >
            <MoodTrends />
          </AsExpandable>
        </section>

        {/* AI INSIGHTS */}
        <section className="as-section">
          <AsExpandable
            icon={Sparkles}
            title={t('dashboard.aiInsightsTitle', 'AI Insights')}
            subtitle={t('dashboard.aiInsightsSubtitle', 'Smart analysis of your entries')}
            sectionId="ai"
            isOpen={expandedSection === 'ai'}
            onToggle={toggleSection}
            colorRgb="139, 92, 246"
          >
            <InsightSummary entries={filteredEntries} progressReport={null} />
          </AsExpandable>
        </section>

        {/* COMPLETED */}
        {completedPaths.length > 0 && (
          <section className="as-section">
            <AsExpandable
              icon={Target}
              title={t('dashboard.completedTitle', 'Completed Journeys')}
              subtitle={t('dashboard.completedSubtitle', '{{count}} paths finished', { count: completedPaths.length })}
              sectionId="completed"
              isOpen={expandedSection === 'completed'}
              onToggle={toggleSection}
              colorRgb="245, 158, 11"
            >
              <div className="as-completed-list">
                {completedPaths.slice(0, 10).map((path, index) => (
                  <div key={index} className="as-completed-item">
                    <div 
                      className="as-completed-dot"
                      style={{ backgroundColor: `rgb(${path.color})` }}
                    />
                    <span className="as-completed-name">{path.title}</span>
                    <span className="as-completed-days">{t('dashboard.daysCount', '{{count}} days', { count: path.totalDays })}</span>
                  </div>
                ))}
              </div>
            </AsExpandable>
          </section>
        )}

        {/* ARCHIVE */}
        <section className="as-section">
          <AsGlass className="as-archive" onClick={() => navigateToScreen('journal-archive')}>
            <div className="as-archive-inner">
              <div 
                className="as-archive-icon"
                style={{ 
                  background: 'rgba(148, 163, 184, 0.15)',
                  color: 'rgb(148, 163, 184)'
                }}
              >
                <FileText size={18} />
              </div>
              <div className="as-archive-info">
                <h3 className="as-archive-title">{t('dashboard.archiveTitle', 'Entry Archive')}</h3>
                <p className="as-archive-subtitle">{t('dashboard.archiveSubtitle', 'Browse all {{count}} past entries', { count: statistics.totalEntries })}</p>
              </div>
              <ChevronRight size={16} className="as-archive-chevron" />
            </div>
          </AsGlass>
        </section>

        {/* FOOTER */}
        <section className="as-section as-footer">
          <div className="as-privacy-row">
            <Eye size={12} />
            <span>{t('dashboard.privacyOnDevice', 'All insights are private and processed securely on-device')}</span>
          </div>
          <div className="as-privacy-row">
            <EyeOff size={12} />
            <span>{t('dashboard.privacyNeverShared', 'Your journal entries are never shared or sold')}</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalyticsScreen;