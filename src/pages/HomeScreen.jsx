// src/pages/HomeScreen.jsx - Apple Spatial Glass Dashboard (Fixed Layout)
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useUserProgress } from '../hooks/useUserProgress';
import { useUserStatistics } from '../hooks/useUserStatistics';
import KairosAiCard from '../components/common/KairosAiCard';
import TimeCapsuleTile from '../components/common/TimeCapsuleTile';
import TimeCapsuleModal from '../components/common/TimeCapsuleModal';
import { listCapsules } from '../services/timeCapsuleService';
import { getJourneyDay } from '../data/JourneyData';
import { getMostRecentActivePathId, getActiveJourneysCompletion } from '../utils/pathUtils';
import DynamicIcon from '../components/common/DynamicIcon';
import ThemeSwitcher from '../components/common/ThemeSwitcher';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import WhatsNew from '../components/common/WhatsNew';
import VersionNews from '../components/common/VersionNews';
import InboxButton from '../components/common/InboxButton';
import InboxModal from '../components/common/InboxModal';
import { useInbox } from '../services/inboxService';
import MoodWeather from '../components/common/MoodWeather';
import HomeActivityCalendar from '../components/common/HomeActivityCalendar';
import { Sparkles, ArrowRight, Flame, FileText, Target, Quote, X, ChevronRight, Headphones, Mic } from 'lucide-react';
import '../styles/components/homeScreen.css';
import '../styles/pages/analyticsScreen.css';
import { useTheme } from '../contexts/ThemeContext';
import { quotes } from '../data/quotes';
import { canNudge, requestNudgePermission, scheduleNudge } from '../services/nudgeService';
import hapticService from '../services/hapticService';

const HomeScreen = ({ navigateToScreen }) => {
  const { t, i18n } = useTranslation(['journey', 'settings', 'home']);
  const { currentUser, userProfile } = useAuth();
  const { isDarkMode } = useTheme();
  const { statistics, isLoading: statsLoading } = useUserStatistics();
  const { inProgressPaths, hasActiveJourneys } = useUserProgress();
  
  const [quote, setQuote] = useState(quotes[0]);
  const [isQuoteChanging, setIsQuoteChanging] = useState(false);
  const [timeGradient, setTimeGradient] = useState('');
  const [showJourneys, setShowJourneys] = useState(false);

  // Time Capsule (Letters to your future self) state
  const [capsules, setCapsules] = useState([]);
  const [capsulesLoading, setCapsulesLoading] = useState(true);
  const [capsuleModal, setCapsuleModal] = useState(null);

  const loadCapsules = useCallback(async () => {
    if (!currentUser?.uid) {
      setCapsulesLoading(false);
      return;
    }
    try {
      const list = await listCapsules(currentUser.uid);
      setCapsules(list);
    } catch (err) {
      console.warn('Could not load time capsules:', err);
    } finally {
      setCapsulesLoading(false);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    loadCapsules();
  }, [loadCapsules]);

  useEffect(() => {
    const handleOpenCapsule = () => setCapsuleModal('compose');
    window.addEventListener('kairos:open-time-capsule', handleOpenCapsule);
    return () => window.removeEventListener('kairos:open-time-capsule', handleOpenCapsule);
  }, []);

  const handleOpenVoiceReflection = useCallback(() => {
    hapticService.medium?.();
    window.dispatchEvent(new CustomEvent('kairos:open-voice-modal'));
  }, []);

  // Sanctuary Inbox state & reactive hook
  const [showInbox, setShowInbox] = useState(false);
  const {
    items: inboxItems,
    unreadCount: inboxUnreadCount,
    markAsRead: markInboxAsRead,
    markAllAsRead: markAllInboxAsRead,
    archiveItem: archiveInboxItem,
    refresh: refreshInbox,
  } = useInbox(currentUser?.uid, capsules, statistics);

  const handleInboxAction = useCallback((action, item) => {
    setShowInbox(false);
    if (!action) return;
    if (action.type === 'open_capsule') {
      if (action.capsule) {
        setCapsuleModal({ view: 'reveal', capsule: action.capsule });
      } else {
        setCapsuleModal({ view: 'compose', capsule: null });
      }
      return;
    }
    if (action.type === 'open_voice') {
      handleOpenVoiceReflection();
      return;
    }
    if (action.type === 'navigate_analytics') {
      navigateToScreen('analytics-dashboard');
      return;
    }
    if (action.type === 'open_journal') {
      navigateToScreen('journal');
      return;
    }
  }, [handleOpenVoiceReflection, navigateToScreen]);

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

  // Overall completion across every active journey (weighted by days), shown on
  // the "% Complete" vital — which opens the full journeys list on tap.
  const activeCompletion = getActiveJourneysCompletion(inProgressPaths);

  // The two-day reminder. Rebuilt whenever the entries change, which is
  // exactly when the answer can change: the pending notification is a pure
  // function of when they last wrote, so nothing else can invalidate it. No
  // resume listener is needed for the same reason — if no entry was added,
  // what is already scheduled is still right.
  useEffect(() => {
    if (!canNudge()) return;                       // web: nothing to schedule
    const all = statistics.allEntries || [];
    if (!all.length) return;                       // nothing to be reminded of yet

    let cancelled = false;
    (async () => {
      // Asked only once someone has actually written something. A permission
      // prompt on first launch, before the app has shown what it is for, is
      // the one most people refuse — and a refusal here is permanent.
      const ok = await requestNudgePermission();
      if (!ok || cancelled) return;

      const times = all
        .map((e) => {
          const d = e?.timestamp;
          if (!d) return null;
          if (d.toDate) return d.toDate().getTime();
          if (d.seconds != null) return d.seconds * 1000;
          const parsed = new Date(d).getTime();
          return isNaN(parsed) ? null : parsed;
        })
        .filter(Boolean);
      if (!times.length || cancelled) return;

      await scheduleNudge(new Date(Math.max(...times)), {
        title: t('nudge.title', 'Kairos'),
        body: t('nudge.body', 'The page is still open, whenever you want it.'),
      });
    })();
    return () => { cancelled = true; };
  }, [statistics.allEntries, t]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.greetingMorning', 'Good morning');
    if (hour < 18) return t('home.greetingAfternoon', 'Good afternoon');
    return t('home.greetingEvening', 'Good evening');
  };

  const glowColor = currentPath?.color || '85, 139, 110';

  const hasWrittenToday = useMemo(() => {
    const all = statistics.allEntries || [];
    if (!all.length) return false;
    const midnightToday = new Date();
    midnightToday.setHours(0, 0, 0, 0);
    return all.some((e) => {
      const ts = e?.timestamp;
      if (!ts) return false;
      const d = ts.toDate ? ts.toDate() : ts.seconds != null ? new Date(ts.seconds * 1000) : new Date(ts);
      return !isNaN(d.getTime()) && d >= midnightToday;
    });
  }, [statistics.allEntries]);

  // First-day celebration: completed their 1st entry today! Miro is unlocked!
  const isFirstEntryCelebration = statistics.totalEntries === 1 && hasWrittenToday;

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
        <div className="header-actions-cluster">
          {/* Main Controls Pillar */}
          <div className="header-controls-dock" role="toolbar" aria-label={t('home.quickControls', 'Quick controls')}>
            <InboxButton unreadCount={inboxUnreadCount} onClick={() => setShowInbox(true)} />
            <WhatsNew navigateToScreen={navigateToScreen} />
            <ThemeSwitcher />
            <LanguageSwitcher />
            <VersionNews />
          </div>
        </div>
      </div>

      {/* ========== 2. HERO CARD (Focus & Today's Reflection) ========== */}
      <div 
        className={`hero-card ${timeGradient}`}
        style={{ '--glow-color': glowColor }}
      >
        {isFirstEntryCelebration ? (
          <div className="hero-first-entry-celebration">
            <div 
              className="hero-path-badge is-celebration" 
              style={{ color: `rgb(${glowColor})`, borderColor: `rgba(${glowColor}, 0.35)` }}
            >
              <Sparkles size={14} />
              <span>{t('home.firstEntryCompleteBadge', 'Day 1 Complete · Miro Unlocked')}</span>
            </div>

            <div className="hero-prompt-block">
              <p className="hero-prompt-label">{t('home.firstEntryMilestone', 'A New Practice Begins')}</p>
              <h2 className="hero-prompt-text">
                "{t('home.firstEntryCongrats', 'You took the first step. Miro has read your words and is ready to reflect whenever you are.')}"
              </h2>
            </div>

            <div className="hero-cta-cluster">
              <button
                type="button"
                className="hero-cta"
                onClick={handleOpenVoiceReflection}
                style={{ '--cta-color': glowColor }}
              >
                <Mic size={18} />
                {t('home.talkToMiroCta', 'Reflect with Miro')}
                <ArrowRight size={16} className="cta-arrow" />
              </button>

              {currentPath && (
                <button
                  type="button"
                  className="hero-voice-cta"
                  onClick={() => navigateToScreen('write', { pathId: currentPath.id, day: currentPath.nextDay })}
                  title={t('home.previewDay2', 'Preview Day {{day}}', { day: currentPath.nextDay })}
                  aria-label={t('home.previewDay2', 'Preview Day {{day}}', { day: currentPath.nextDay })}
                >
                  <Sparkles size={16} className="hero-voice-icon" />
                  <span>{t('home.dayLabel', 'Day {{day}}', { day: currentPath.nextDay })}</span>
                </button>
              )}
            </div>
          </div>
        ) : hasActiveJourneys && currentPath ? (
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

            <div className="hero-cta-cluster">
              <button
                className="hero-cta"
                onClick={() => navigateToScreen('write', { pathId: currentPath.id, day: currentPath.nextDay })}
                style={{ '--cta-color': currentPath.color }}
              >
                <Sparkles size={18} />
                {t('home.beginJournaling', 'Begin Journaling')}
                <ArrowRight size={16} className="cta-arrow" />
              </button>
            </div>
          </>
        ) : (
          <div className="hero-empty">
            <h2>{t('home.welcomeTitle', 'Your Journal Awaits')}</h2>
            <p>{t('home.welcomeSubtitle', 'The first entry is the hardest one. Choose a guided path and take three quiet minutes for yourself.')}</p>
            <div className="hero-cta-cluster">
              <button
                className="hero-cta"
                onClick={() => navigateToScreen('path-selection')}
                style={{ '--cta-color': '85, 139, 110' }}
              >
                <Sparkles size={18} />
                {t('home.startFirstEntry', 'Begin First Entry')}
                <ArrowRight size={16} className="cta-arrow" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========== 3. ACTIVITY CALENDAR (Week on mobile, Month on tablet & desktop) ========== */}
      <HomeActivityCalendar
        allEntries={statistics.allEntries}
        totalEntries={statistics.totalEntries}
        currentStreak={statistics.currentStreak}
        pathColor={glowColor}
        statsLoading={statsLoading}
      />

      {/* ========== 4. INNER AURA (Daily Mood Check-in) ========== */}
      <MoodWeather />

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
            <button className="vital-card vital-progress" onClick={() => setShowJourneys(true)}>
              <div className="vital-icon-wrap progress-glow" style={{ color: `rgb(${currentPath.color})` }}>
                <Target size={18} />
              </div>
              <div className="vital-data">
                <span className="vital-number">{activeCompletion.percentage}%</span>
                <span className="vital-label">{t('home.complete', 'Complete')}</span>
              </div>
            </button>
          )}
        </section>
      )}

      {/* ========== 5. KAIROS AI ========== */}
      <KairosAiCard
        entries={statistics.allEntries || []}
        totalEntries={statistics.totalEntries || 0}
        statistics={statistics}
      />

      {/* ========== 5.5 TIME CAPSULE (Letters to your future self) ========== */}
      <TimeCapsuleTile
        capsules={capsules}
        loading={capsulesLoading}
        onOpenCompose={() => setCapsuleModal({ view: 'compose', capsule: null })}
        onOpenReveal={(letter) => setCapsuleModal({ view: 'reveal', capsule: letter })}
      />

      {/* ========== 6. BENTO PAIR (Listen & Spark) ========== */}
      <div className="home-bento-grid">
        <button className="home-listen-card" onClick={() => navigateToScreen('listen')}>
          <div className="home-listen-icon">
            <Headphones size={22} />
            <span className="home-listen-pulse" aria-hidden="true" />
          </div>
          <div className="home-listen-text">
            <span className="home-listen-eyebrow">{t('home.listenEyebrow', 'New · Podcast')}</span>
            <span className="home-listen-title">{t('home.listenTitle', 'Listen')}</span>
            <span className="home-listen-sub">{t('home.listenSubtitle', 'Episodes on handwriting & journaling')}</span>
          </div>
          <div className="home-listen-eq" aria-hidden="true">
            <span></span><span></span><span></span><span></span>
          </div>
        </button>

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

      {/* Current-journeys popup — opened from the "% Complete" card. Lists every
          started journey with its progress; the most recent one is featured.
          Portaled to <body> so it isn't clipped by the home layout. */}
      {showJourneys && createPortal(
        <div className="hj-overlay" onClick={() => setShowJourneys(false)}>
          <div className="hj-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="hj-modal-header">
              <h3 className="hj-modal-title">{t('home.yourJourneys', 'Your Journeys')}</h3>
              <button
                className="hj-close"
                onClick={() => setShowJourneys(false)}
                aria-label={t('home.close', 'Close')}
              >
                <X size={18} />
              </button>
            </div>

            <div className="hj-list">
              {(inProgressPaths || []).map((p) => (
                <button
                  key={p.id}
                  className={`hj-row${p.id === currentPath?.id ? ' is-current' : ''}`}
                  style={{ '--c': p.color }}
                  onClick={() => {
                    setShowJourneys(false);
                    navigateToScreen('write', { pathId: p.id, day: p.nextDay });
                  }}
                >
                  <div className="hj-row-icon">
                    <DynamicIcon name={p.iconName} size={18} />
                  </div>
                  <div className="hj-row-body">
                    <div className="hj-row-top">
                      <span className="hj-row-title">{p.title}</span>
                      <span className="hj-row-pct">{p.percentage}%</span>
                    </div>
                    <div className="hj-row-bar">
                      <div className="hj-row-fill" style={{ width: `${p.percentage}%` }} />
                    </div>
                    <span className="hj-row-meta">
                      {t('home.dayOfTotal', 'Day {{day}} of {{total}}', { day: p.nextDay, total: p.totalDays })}
                    </span>
                  </div>
                  <ChevronRight size={16} className="hj-row-chevron" />
                </button>
              ))}
            </div>

            <button
              className="hj-footer-btn"
              onClick={() => { setShowJourneys(false); navigateToScreen('path-selection'); }}
            >
              {t('home.viewAllPaths', 'View all paths')}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Time Capsule Modal (Compose & Reveal) */}
      {capsuleModal && currentUser && (
        <TimeCapsuleModal
          uid={currentUser.uid}
          initialView={capsuleModal.view}
          initialCapsule={capsuleModal.capsule}
          capsules={capsules}
          entries={statistics.allEntries || []}
          onClose={() => setCapsuleModal(null)}
          onChanged={loadCapsules}
        />
      )}

      {/* Sanctuary Inbox Modal */}
      <InboxModal
        isOpen={showInbox}
        onClose={() => setShowInbox(false)}
        userId={currentUser?.uid}
        onRefresh={refreshInbox}
        items={inboxItems}
        unreadCount={inboxUnreadCount}
        onMarkAsRead={markInboxAsRead}
        onMarkAllAsRead={markAllInboxAsRead}
        onArchiveItem={archiveInboxItem}
        onExecuteAction={handleInboxAction}
      />

    </div>
  );
};

export default HomeScreen;