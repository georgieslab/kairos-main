// src/components/paths/PathSelection.jsx - Premium Glass Edition
import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search, X, Play, ArrowRight, BookOpen, Clock, Target, Compass, Heart, Brain, RotateCcw, Palette, Users, Map, Moon, Sun,
  Book, Droplet, Star, Zap, Archive, Lightbulb, Leaf, Coins, Brush, Feather,
  Sparkles, CheckCircle, ChevronRight, Layers, Hourglass, Lock, Crown, Shuffle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProgress } from '../../hooks/useUserProgress';
import { getAllJourneyPaths } from '../../data/JourneyData';
import { getPathTier } from '../../services/SubscriptionService';
import { isExclusivePathUnlocked } from '../../constants/pathBundles';
import { getNextDayForPath } from '../../utils/userProgress';
import PathSuggestionCard from './PathSuggestionCard';
import PathQuestionnaire from './PathQuestionnaire';
import PathQuestionnaireResults from './PathQuestionnaireResults';
import PathUnlockModal from '../subscription/PathUnlockModal';
import JourneyPreviewModal from '../journey/JourneyPreviewModal';
import '../../styles/components/pathSelection.css';
import '../../styles/components/appleGlassNav.css';

// Icon map
const ICON_MAP = {
  Compass, Heart, Brain, RotateCcw, Palette, Users, Map, Moon, Sun,
  Book, Droplet, Star, Zap, Clock, Archive, Target, Lightbulb, Leaf,
  Coins, Brush, Sparkles, Feather, Hourglass, Shuffle, Layers
};

const PathSelection = ({ navigateToScreen, currentPath, screenData }) => {
  const { t } = useTranslation('paths');
  const { userProfile, currentUser } = useAuth();
  const { inProgressPaths, completedPaths } = useUserProgress();

  const [activeTab, setActiveTab] = useState('explore');
  const [tierFilter, setTierFilter] = useState('all'); // 'all' | 'free' | 'artisan' | 'exclusive'
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [unlockPath, setUnlockPath] = useState(null);
  // The restart flows (JourneyCompletion, CompletedPathsScreen) come back here
  // with a previewPathId so the sheet has a single host rather than one
  // presentation per caller.
  const [previewPathId, setPreviewPathId] = useState(screenData?.previewPathId || null);

  // Exclusive paths are one-time purchases stored on the user doc
  // Exclusive paths are one-time purchases stored on the user doc. Bundle
  // members (e.g. Kairos Cards) also unlock when the user owns the package
  // anchor (kairos-moments) — see constants/pathBundles.js.
  const isPathUnlocked = useCallback((path) => {
    if (!path?.isExclusive) return true;
    return isExclusivePathUnlocked(path.id, userProfile?.purchasedPaths || []);
  }, [userProfile?.purchasedPaths]);

  // Exclusive and new paths surface at the top of the grid (stable sort keeps
  // the registry order for everything else)
  const allPaths = useMemo(() => {
    return [...getAllJourneyPaths()].sort(
      (a, b) =>
        (b.isExclusive === true) - (a.isExclusive === true) ||
        (b.isNew === true) - (a.isNew === true)
    );
  }, []);

  // Filter logic
  const filteredPaths = useMemo(() => {
    let paths = allPaths;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      paths = paths.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Tier filter — each chip shows exactly its own tier:
    // 'free', 'artisan' (subscription), 'exclusive' (Kairos one-time paths).
    if (tierFilter !== 'all') {
      paths = paths.filter(p => getPathTier(p) === tierFilter);
    }

    if (activeTab === 'completed') return paths.filter(p => completedPaths.some(cp => cp.id === p.id));
    // Explore: every path except completed ones (which have their own tab).
    // In-progress paths ARE included so the grid is comprehensive — their cards
    // show a progress bar and an "In Progress" label (they also appear in the
    // Current Journeys carousel above for quick continue).
    return paths.filter(p => !completedPaths.some(cp => cp.id === p.id));
  }, [allPaths, activeTab, tierFilter, searchQuery, completedPaths]);

  const getIcon = (name) => {
    const Icon = ICON_MAP[name] || Compass;
    return <Icon size={22} />;
  };

  const handleAction = useCallback((pathId) => {
    const path = allPaths.find(p => p.id === pathId);
    if (path?.isExclusive && !isPathUnlocked(path)) {
      setUnlockPath(path);
      return;
    }

    const nextDay = getNextDayForPath(userProfile, pathId);
    const isActive = inProgressPaths.some(p => p.id === pathId);
    const isCompleted = completedPaths.some(p => p.id === pathId);

    if (isCompleted) {
      navigateToScreen('daily', { pathId, day: 1, fromArchive: true });
    } else if (isActive) {
      // Already underway — go straight to the next day. The introduction is
      // not a gate you pass through every morning.
      navigateToScreen('write', { pathId, day: nextDay });
    } else {
      // Starting fresh: introduce the journey first, as a sheet over the grid
      // so backing out costs one tap and comparing two paths is cheap.
      setPreviewPathId(pathId);
    }
  }, [userProfile, navigateToScreen, inProgressPaths, completedPaths, allPaths, isPathUnlocked]);

  // --- Renderers ---

  const renderActiveJourney = (journey) => (
    <div 
      key={journey.id} 
      className="glass-active-carousel-card"
      style={{ '--c': journey.color }}
      onClick={() => handleAction(journey.id)}
    >
      <div className="carousel-card-header">
        <div className="carousel-icon">{getIcon(journey.iconName)}</div>
        <div className="carousel-status">
          <span className="carousel-day">{t('pathSelection.dayLabel', 'Day {{day}}', { day: journey.nextDay })}</span>
          <span className="carousel-divider">•</span>
          <span className="carousel-total">{t('pathSelection.totalDaysAbbrev', '{{count}}d', { count: journey.totalDays })}</span>
        </div>
      </div>
      <h4 className="carousel-title">{journey.title}</h4>
      <div className="carousel-progress-track">
        <div
          className="carousel-progress-fill"
          style={{ width: `${journey.percentage}%` }}
        />
      </div>
      <button className="carousel-cta">
        <Play size={14} fill="currentColor" />
        {t('pathSelection.continue', 'Continue')}
      </button>
    </div>
  );

  const renderPathCard = (path) => {
    const progress = inProgressPaths.find(p => p.id === path.id);
    const isCompleted = completedPaths.some(p => p.id === path.id);
    const isActive = !!progress;
    const completionPct = isActive ? (progress?.percentage || 0) : (isCompleted ? 100 : 0);
    const isLocked = path.isExclusive && !isPathUnlocked(path);
    const tier = getPathTier(path); // 'free' | 'artisan' | 'exclusive'

    const getDifficultyLabel = (diff) => {
      if (!diff) return null;
      const d = diff.toLowerCase();
      if (d === 'beginner') return t('pathSelection.difficulty.beginner', 'Beginner');
      if (d === 'intermediate') return t('pathSelection.difficulty.intermediate', 'Intermediate');
      if (d === 'advanced') return t('pathSelection.difficulty.advanced', 'Advanced');
      return null;
    };

    return (
      <div
        className={`glass-path-card${path.isExclusive ? ' is-exclusive' : ''}`}
        style={{ '--c': path.color }}
        onClick={() => handleAction(path.id)}
      >
        {/* Top Accent Line */}
        <div className="card-accent-line" />

        {path.isNew && (
          <span className="card-new-badge" aria-label={t('pathSelection.newBadge', 'New path')}>
            {t('pathSelection.new', 'NEW')}
          </span>
        )}

        <div className="card-main-content">
          {/* Icon */}
          <div className="card-icon-wrap">
            {getIcon(path.iconName)}
            {isActive && <div className="active-pulse-dot" />}
          </div>

          {/* Text */}
          <div className="card-text-wrap">
            <h3 className="card-title">{path.title}</h3>
            <p className="card-subtitle">{path.subtitle}</p>
            
            {/* Meta Pills */}
            <div className="card-meta-row">
              <span className="meta-pill">
                <Clock size={12} />
                {t('pathSelection.durationDays', '{{count}} Days', { count: path.duration })}
              </span>
              {getDifficultyLabel(path.difficulty) && (
                <span className="meta-pill">
                  <Target size={12} />
                  {getDifficultyLabel(path.difficulty)}
                </span>
              )}
              {tier === 'free' && (
                <span className="meta-pill meta-pill-free">
                  {t('pathSelection.free', 'Free')}
                </span>
              )}
              {tier === 'artisan' && (
                <span className="meta-pill meta-pill-artisan">
                  <Crown size={12} />
                  {t('pathSelection.artisan', 'Artisan')}
                </span>
              )}
              {tier === 'exclusive' && (
                <span className="meta-pill meta-pill-kairos">
                  <Sparkles size={12} />
                  {t('pathSelection.kairos', 'Kairos')}
                </span>
              )}
              {isLocked && path.price && (
                <span className="meta-pill meta-pill-price">
                  <Lock size={12} />
                  {path.price}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress Section */}
        {(isActive || isCompleted) && (
          <div className="card-progress-section">
            <div className="card-progress-track">
              <div className="card-progress-fill" style={{ width: `${completionPct}%` }} />
            </div>
            <div className="card-progress-stats">
              <span>{t('pathSelection.percentComplete', '{{pct}}% complete', { pct: completionPct })}</span>
              {isActive && (
                <span className="in-progress-label">
                  <span className="in-progress-dot" aria-hidden="true" />
                  {t('pathSelection.inProgress', 'In Progress')}
                </span>
              )}
              {isCompleted && <span className="completed-check"><CheckCircle size={12} /> {t('pathSelection.done', 'Done')}</span>}
            </div>
          </div>
        )}

        {/* Tags */}
        {path.tags?.length > 0 && (
          <div className="card-tags-row">
            {path.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="card-tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Footer / CTA */}
        <div className="card-footer">
          {isActive ? (
            <button className="card-cta-btn active" onClick={(e) => { e.stopPropagation(); handleAction(path.id); }}>
              <Play size={14} fill="currentColor" />
              {t('pathSelection.continueDay', 'Continue Day {{day}}', { day: progress?.nextDay })}
              <ArrowRight size={14} />
            </button>
          ) : isCompleted ? (
            <button className="card-cta-btn completed" onClick={(e) => { e.stopPropagation(); handleAction(path.id); }}>
              <BookOpen size={14} />
              {t('pathSelection.reviewJourney', 'Review Journey')}
              <ArrowRight size={14} />
            </button>
          ) : isLocked ? (
            <button className="card-cta-btn unlock" onClick={(e) => { e.stopPropagation(); handleAction(path.id); }}>
              <Lock size={14} />
              {t('pathSelection.unlockFor', 'Unlock for {{price}}', { price: path.price })}
              <ArrowRight size={14} />
            </button>
          ) : (
            <button className="card-cta-btn start" onClick={(e) => { e.stopPropagation(); handleAction(path.id); }}>
              <Sparkles size={14} />
              {t('pathSelection.startJourney', 'Start Journey')}
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="paths-container">
      {/* Search */}
      <div className="paths-search-bar">
        <Search size={16} className="search-bar-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('pathSelection.searchPlaceholder', 'Search journeys...')}
          className="search-bar-input"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="search-bar-clear">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Active Journeys Carousel */}
      {inProgressPaths.length > 0 && (
        <section className="active-section">
          <div className="active-section-header">
            <Layers size={16} className="active-section-icon" />
            <h3>{t('pathSelection.currentJourneys', 'Current Journeys')}</h3>
          </div>
          <div className="active-carousel">
            {inProgressPaths.map(renderActiveJourney)}
          </div>
        </section>
      )}

      {/* AI Suggestion */}
      {!searchQuery && (activeTab === 'explore' || activeTab === 'all') && (
        <PathSuggestionCard onStartQuestionnaire={() => setShowQuestionnaire(true)} />
      )}

      {/* Tabs */}
      <div className="paths-tabs">
        <button
          className={`path-tab ${activeTab === 'explore' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('explore')}
        >
          {t('pathSelection.exploreTab', 'Explore')}
        </button>
        <button
          className={`path-tab ${activeTab === 'completed' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          {t('pathSelection.completedTab', 'Completed')}
          {completedPaths.length > 0 && <span className="tab-badge completed">{completedPaths.length}</span>}
        </button>
      </div>

      {/* Tier filter chips (Free vs. paid) */}
      <div className="paths-tier-filters" role="tablist" aria-label={t('pathSelection.filterByTier', 'Filter by tier')}>
        <button
          className={`tier-chip ${tierFilter === 'all' ? 'is-active' : ''}`}
          onClick={() => setTierFilter('all')}
          role="tab"
          aria-selected={tierFilter === 'all'}
        >
          {t('pathSelection.filterAll', 'All')}
        </button>
        <button
          className={`tier-chip ${tierFilter === 'free' ? 'is-active' : ''}`}
          onClick={() => setTierFilter('free')}
          role="tab"
          aria-selected={tierFilter === 'free'}
        >
          {t('pathSelection.filterFree', 'Free')}
        </button>
        <button
          className={`tier-chip tier-chip-artisan ${tierFilter === 'artisan' ? 'is-active' : ''}`}
          onClick={() => setTierFilter('artisan')}
          role="tab"
          aria-selected={tierFilter === 'artisan'}
        >
          <Crown size={13} />
          {t('pathSelection.filterArtisan', 'Artisan')}
        </button>
        <button
          className={`tier-chip tier-chip-kairos ${tierFilter === 'exclusive' ? 'is-active' : ''}`}
          onClick={() => setTierFilter('exclusive')}
          role="tab"
          aria-selected={tierFilter === 'exclusive'}
        >
          <Sparkles size={13} />
          {t('pathSelection.filterKairos', 'Kairos')}
        </button>
      </div>

      {/* Grid */}
      <div className="paths-grid">
        {filteredPaths.length > 0 ? (
          filteredPaths.map(renderPathCard)
        ) : (
          <div className="paths-empty-state">
            <Search size={40} />
            <h3>{t('pathSelection.noPathsFound', 'No paths found')}</h3>
            <p>{t('pathSelection.tryAdjusting', 'Try adjusting your search or filters')}</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showQuestionnaire && (
        <PathQuestionnaire
          onComplete={(rec, err) => {
            setShowQuestionnaire(false);
            if (rec) { setRecommendation(rec); setShowResults(true); }
          }}
          onCancel={() => setShowQuestionnaire(false)}
        />
      )}

      {showResults && recommendation && (
        <PathQuestionnaireResults
          recommendation={recommendation}
          onStartPath={(path) => { setShowResults(false); setRecommendation(null); handleAction(path.id); }}
          onRetake={() => { setShowResults(false); setShowQuestionnaire(true); }}
          onBrowseAll={() => { setShowResults(false); setRecommendation(null); }}
        />
      )}

      {unlockPath && (
        <PathUnlockModal
          path={unlockPath}
          userId={currentUser?.uid}
          onClose={() => setUnlockPath(null)}
        />
      )}

      {previewPathId && (
        <JourneyPreviewModal
          pathId={previewPathId}
          onClose={() => setPreviewPathId(null)}
          onStart={() => {
            const pathId = previewPathId;
            setPreviewPathId(null);
            navigateToScreen('write', { pathId, day: getNextDayForPath(userProfile, pathId) });
          }}
        />
      )}
    </div>
  );
};

export default PathSelection;