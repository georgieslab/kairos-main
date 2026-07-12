// src/pages/HomeScreen.jsx - Apple Spatial Glass Dashboard (Fixed Layout)
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useUserProgress } from '../hooks/useUserProgress';
import { useUserStatistics } from '../hooks/useUserStatistics';
import { getJourneyDay } from '../data/JourneyData';
import { getMostRecentActivePathId } from '../utils/pathUtils';
import DynamicIcon from '../components/common/DynamicIcon';
import ThemeSwitcher from '../components/common/ThemeSwitcher';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import WhatsNew from '../components/common/WhatsNew';
import MoodWeather from '../components/common/MoodWeather';
import { Sparkles, ArrowRight, Flame, FileText, Target, Quote } from 'lucide-react';
import '../styles/components/homeScreen.css';
import '../styles/pages/analyticsScreen.css';
import { useTheme } from '../contexts/ThemeContext';
import { quotes } from '../data/quotes';

const HomeScreen = ({ navigateToScreen }) => {
  const { t, i18n } = useTranslation('journey');
  const { userProfile } = useAuth();
  const { isDarkMode } = useTheme();
  const { statistics, isLoading: statsLoading } = useUserStatistics();
  const { inProgressPaths, hasActiveJourneys } = useUserProgress();
  
  const [quote, setQuote] = useState(quotes[0]);
  const [isQuoteChanging, setIsQuoteChanging] = useState(false);
  const [timeGradient, setTimeGradient] = useState('');

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeGradient('morning');
    else if (hour >= 12 && hour < 17) setTimeGradient('afternoon');
    else if (hour >= 17 && hour < 21) setTimeGradient('evening');
    else setTimeGradient('night');
  }, []);

  const changeQuote = () => {
    setIsQuoteChanging(true);
    setTimeout(() => {
      setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      setIsQuoteChanging(false);
    }, 300);
  };

  // Pick the journey the user worked on most recently (by lastActive timestamp),
  // shared with the Journal tab so both show the same journey + prompt.
  // Falls back to the highest-progress active journey when no timestamps exist.
  const lastActivePathId = getMostRecentActivePathId(userProfile);
  const currentPath =
    (lastActivePathId && inProgressPaths?.find((p) => p.id === lastActivePathId)) ||
    inProgressPaths?.[0];
  const currentPrompt = currentPath ? getJourneyDay(currentPath.nextDay, currentPath.id) : null;

  // Rolling last-7-days journaling activity (oldest → today), for the activity
  // strip — a fixed Mon-Sun window meant today's progress was invisible until
  // it showed up on the right edge again next Monday.
  const weekActivity = useMemo(() => {
    const toDate = (ts) => {
      if (!ts) return null;
      try {
        if (ts.toDate) return ts.toDate();
        if (ts.seconds != null) return new Date(ts.seconds * 1000);
        const d = new Date(ts);
        return isNaN(d.getTime()) ? null : d;
      } catch {
        return null;
      }
    };
    const daysWithEntries = new Set();
    (statistics.allEntries || []).forEach((e) => {
      const d = toDate(e.timestamp);
      if (d) daysWithEntries.add(d.toDateString());
    });
    const now = new Date();
    // Mon-first weekday initials, e.g. ['M','T','W','T','F','S','S']
    const weekdayInitials = t('home.weekdayInitials', { returnObjects: true, defaultValue: ['M', 'T', 'W', 'T', 'F', 'S', 'S'] });
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      const mondayFirstIndex = (d.getDay() + 6) % 7; // Sun(0)->6, Mon(1)->0, ... Sat(6)->5
      return {
        label: weekdayInitials[mondayFirstIndex],
        active: daysWithEntries.has(d.toDateString()),
        isToday: i === 6
      };
    });
    // Mark the trailing run of consecutive active days ending today — those
    // dots carry the traveling streak-heartbeat animation (see homeScreen.css).
    for (let i = days.length - 1; i >= 0 && days[i].active; i--) {
      days[i].inStreak = true;
    }
    return days;
  }, [statistics.allEntries, t]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.greetingMorning', 'Good morning');
    if (hour < 18) return t('home.greetingAfternoon', 'Good afternoon');
    return t('home.greetingEvening', 'Good evening');
  };

  const glowColor = currentPath?.color || '85, 139, 110';

  // Streak milestones (7/30/100/365) get a celebratory treatment on the flame card — CSS only
  const isStreakMilestone = [7, 30, 100, 365].includes(statistics.currentStreak || 0);
  // Any active streak gets a subtler ambient glow; milestones layer a stronger one on top
  const hasStreak = (statistics.currentStreak || 0) > 0;

  return (
    <div
      className={`spatial-home analytics-screen ${timeGradient} ${!isDarkMode ? 'hs-light' : ''}`}
      style={{ '--journey-color': glowColor }}
    >
      
      {/* ========== 1. HEADER (Greeting + Theme Toggle + Weather) ========== */}
          <div className="hero-header">
            <div className="hero-text">
          <h1 className="hero-greeting">
            {getGreeting()}, <span className="hero-name">{userProfile?.displayName?.split(' ')[0] || t('home.greetingFallbackName', 'there')}</span>
          </h1>
          <p className="hero-subtitle">
            {new Date().toLocaleDateString(i18n.language, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
            <div className="header-controls">
              <LanguageSwitcher />
              <ThemeSwitcher />
              <WhatsNew navigateToScreen={navigateToScreen} />
            </div>
      </div>

      {/* ========== WEEK ACTIVITY STRIP ========== */}
      {statsLoading ? (
        <div className="home-week home-week-loading" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="home-week-day">
              <span className="home-week-dot is-skeleton" />
              <span className="home-week-label-skeleton skeleton-bar" />
            </div>
          ))}
        </div>
      ) : statistics.totalEntries > 0 && (
        <div className="home-week" aria-label={t('home.weekActivityAriaLabel', 'Your last 7 days of journaling')}>
          {weekActivity.map((d, i) => (
            <div
              key={i}
              className={`home-week-day${d.active ? ' is-active' : ''}${d.isToday ? ' is-today' : ''}${d.inStreak ? ' in-streak' : ''}`}
              style={{ '--d': `${i * 60}ms` }}
            >
              <span className="home-week-dot" />
              <span className="home-week-label">{d.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ========== INNER AURA (Daily Mood Check-in) ========== */}
      <MoodWeather />

      {/* ========== 2. HERO CARD (Focus) ========== */}
      <div 
        className={`hero-card ${timeGradient}`}
        style={{ '--glow-color': glowColor }}
      >
        {hasActiveJourneys && currentPath ? (
          <>
            <div 
              className="hero-path-badge" 
              style={{ color: `rgb(${currentPath.color})`, borderColor: `rgba(${currentPath.color}, 0.3)` }}
            >
              <DynamicIcon name={currentPath.iconName} size={14} />
              <span>{currentPath.title} · {t('home.dayLabel', 'Day {{day}}', { day: currentPath.nextDay })}</span>
            </div>

            <div className="hero-prompt-block">
              <p className="hero-prompt-label">{t('home.todaysReflection', "Today's Reflection")}</p>
              <h2 className="hero-prompt-text">"{currentPrompt?.prompt || t('home.reflectFallback', 'Take a moment to reflect...')}"</h2>
            </div>

            <button
              className="hero-cta"
              onClick={() => navigateToScreen('write', { pathId: currentPath.id, day: currentPath.nextDay })}
              style={{ '--cta-color': currentPath.color }}
            >
              <Sparkles size={18} />
              {t('home.beginJournaling', 'Begin Journaling')}
              <ArrowRight size={16} className="cta-arrow" />
            </button>
          </>
        ) : (
          <div className="hero-empty">
            <h2>{t('home.beginYourJourney', 'Begin your journey')}</h2>
            <p>{t('home.discoverPaths', 'Discover guided paths to unlock your potential.')}</p>
            <button
              className="hero-cta"
              onClick={() => navigateToScreen('path-selection')}
              style={{ '--cta-color': '85, 139, 110' }}
            >
              {t('home.explorePaths', 'Explore Paths')}
              <ArrowRight size={16} className="cta-arrow" />
            </button>
          </div>
        )}
      </div>

      {/* Weather widget moved into the header for compact layout */}

      {/* ========== 4. VITALS (Glass Stat Cards – only 3 items) ========== */}
      {statsLoading ? (
        <section className="vitals-section vitals-loading" aria-hidden="true">
          <div className="vital-card vital-skeleton">
            <div className="vital-icon-wrap" />
            <div className="vital-data">
              <span className="vital-number skeleton-bar" />
              <span className="vital-label skeleton-bar" />
            </div>
          </div>
          <div className="vital-card vital-skeleton">
            <div className="vital-icon-wrap" />
            <div className="vital-data">
              <span className="vital-number skeleton-bar" />
              <span className="vital-label skeleton-bar" />
            </div>
          </div>
          {currentPath && (
            <div className="vital-card vital-skeleton">
              <div className="vital-icon-wrap" />
              <div className="vital-data">
                <span className="vital-number skeleton-bar" />
                <span className="vital-label skeleton-bar" />
              </div>
            </div>
          )}
        </section>
      ) : statistics.totalEntries > 0 && (
        <section className="vitals-section">
          <button className={`vital-card vital-streak${hasStreak ? ' has-streak' : ''}${isStreakMilestone ? ' is-milestone' : ''}`} onClick={() => navigateToScreen('analytics-dashboard')}>
            <div className="vital-icon-wrap flame-glow">
              <Flame size={18} />
            </div>
            <div className="vital-data">
              <span className="vital-number">{statistics.currentStreak || 0}</span>
              <span className="vital-label">{t('home.dayStreak', 'Day Streak')}</span>
            </div>
          </button>

          <button className="vital-card vital-entries" onClick={() => navigateToScreen('journal-archive')}>
            <div className="vital-icon-wrap entries-glow">
              <FileText size={18} />
            </div>
            <div className="vital-data">
              <span className="vital-number">{statistics.totalEntries}</span>
              <span className="vital-label">{t('home.entries', 'Entries')}</span>
            </div>
          </button>

          {currentPath && (
            <button className="vital-card vital-progress" onClick={() => navigateToScreen('path-selection')}>
              <div className="vital-icon-wrap progress-glow" style={{ color: `rgb(${currentPath.color})` }}>
                <Target size={18} />
              </div>
              <div className="vital-data">
                <span className="vital-number">{currentPath.percentage}%</span>
                <span className="vital-label">{t('home.complete', 'Complete')}</span>
              </div>
            </button>
          )}
        </section>
      )}

      {/* ========== 5. SPARK (Ambient Quote) ========== */}
      <section className={`spark-section ${timeGradient}`} onClick={changeQuote}>
        <div className="spark-glass-card">
          <div className="spark-decoration">
            <Quote size={40} />
          </div>
          
          <div className={`spark-content ${isQuoteChanging ? 'is-changing' : ''}`}>
            <p className="spark-text">"{quote.text}"</p>
            <p className="spark-author">— {quote.author}</p>
          </div>
          
          <span className="spark-interact-hint">{t('home.tapForReflection', 'Tap for reflection')}</span>
        </div>
      </section>

    </div>
  );
};

export default HomeScreen;