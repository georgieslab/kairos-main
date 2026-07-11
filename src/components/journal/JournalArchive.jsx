// src/components/journal/JournalArchive.jsx
// Apple Spatial Glass design – no hard shadows, RGB theming, GPU animations

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  ChevronRight,
  Calendar,
  Search,
  Filter,
  SortDesc,
  X,
  Layers,
  Clock,
  Star,
  Mic,
  TrendingUp,
  Flame,
  BookMarked,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getPreviousEntries } from '../../services/claudeService';
import { getJourneyPath } from '../../data/JourneyData';
import { useTheme } from '../../contexts/ThemeContext';
import TopBar from '../common/TopBar';
import '../../styles/components/journal-archive.css';

const JournalArchive = ({ onBack, onSelectDay }) => {
  const { t } = useTranslation('journal');
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();

  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedPath, setSelectedPath] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const quickFilters = [
    { id: 'all', label: t('archive.filters.all', 'All Entries'), icon: Layers },
    { id: 'recent', label: t('archive.filters.recent', 'This Week'), icon: Clock },
    { id: 'favorites', label: t('archive.filters.favorites', 'Favorites'), icon: Star },
  ];

  const [uniquePaths, setUniquePaths] = useState([]);
  const [stats, setStats] = useState({
    totalEntries: 0,
    currentStreak: 0,
    totalPaths: 0,
    thisWeek: 0,
  });

  // Helper: calculate streak
  const calculateStreak = (entriesArray) => {
    if (entriesArray.length === 0) return 0;
    const sorted = [...entriesArray].sort((a, b) => {
      const da = a.timestamp?.toDate?.() || new Date(a.timestamp);
      const db = b.timestamp?.toDate?.() || new Date(b.timestamp);
      return db - da;
    });
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < sorted.length; i++) {
      const entryDate = sorted[i].timestamp?.toDate?.() || new Date(sorted[i].timestamp);
      entryDate.setHours(0, 0, 0, 0);
      const expected = new Date(today.getTime() - i * 86400000);
      if (entryDate.getTime() === expected.getTime()) streak++;
      else break;
    }
    return streak;
  };

  // Fetch entries
  useEffect(() => {
    const fetchEntries = async () => {
      if (!currentUser) return;
      try {
        setIsLoading(true);
        const journalEntries = await getPreviousEntries(currentUser.uid);
        const processed = journalEntries.map(entry => ({
          ...entry,
          pathId: entry.pathId || 'self-discovery',
          isFavorite: entry.isFavorite || false,
        }));
        const sorted = processed.sort((a, b) => b.day - a.day);
        setEntries(sorted);
        setFilteredEntries(sorted);

        const paths = [...new Set(processed.map(e => e.pathId).filter(Boolean))];
        setUniquePaths(paths);

        const oneWeekAgo = new Date(Date.now() - 7 * 86400000);
        const thisWeekEntries = processed.filter(entry => {
          const d = entry.timestamp?.toDate?.() || new Date(entry.timestamp);
          return d >= oneWeekAgo;
        });

        setStats({
          totalEntries: processed.length,
          currentStreak: calculateStreak(processed),
          totalPaths: paths.length,
          thisWeek: thisWeekEntries.length,
        });
      } catch (err) {
        console.error('Error fetching entries:', err);
      } finally {
        setIsLoading(false);
        setTimeout(() => setIsLoaded(true), 100);
      }
    };
    fetchEntries();
  }, [currentUser]);

  // Filter & sort logic
  useEffect(() => {
    let result = [...entries];
    if (activeFilter === 'recent') {
      const weekAgo = new Date(Date.now() - 7 * 86400000);
      result = result.filter(e => {
        const d = e.timestamp?.toDate?.() || new Date(e.timestamp);
        return d >= weekAgo;
      });
    } else if (activeFilter === 'favorites') {
      result = result.filter(e => e.isFavorite);
    }
    if (selectedPath !== 'all') {
      result = result.filter(e => e.pathId === selectedPath);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(e =>
        (e.theme && e.theme.toLowerCase().includes(term)) ||
        (e.prompt && e.prompt.toLowerCase().includes(term)) ||
        (e.analysis?.summary && e.analysis.summary.toLowerCase().includes(term)) ||
        (e.transcription && e.transcription.toLowerCase().includes(term))
      );
    }
    result.sort((a, b) => {
      const da = a.timestamp?.toDate?.() || new Date(a.timestamp);
      const db = b.timestamp?.toDate?.() || new Date(b.timestamp);
      return sortOrder === 'newest' ? db - da : da - db;
    });
    setFilteredEntries(result);
  }, [entries, activeFilter, selectedPath, searchTerm, sortOrder]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'No date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / 86400000);
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    }).format(date);
  };

  const getPathInfo = (pathId) => {
    try {
      const data = getJourneyPath(pathId);
      return data || { title: 'Unknown Path', color: '168,85,247', iconName: 'Book' };
    } catch {
      return { title: 'Unknown Path', color: '168,85,247', iconName: 'Book' };
    }
  };

  const toggleFavorite = async (entryId) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.id === entryId ? { ...entry, isFavorite: !entry.isFavorite } : entry
      )
    );
    // Optionally persist to backend here
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={`ja-container glass ${isDarkMode ? 'dark' : 'light'}`}>
        <div className="glass-loading">
          <div className="glass-spinner" />
          <p>{t('archive.loading', 'Loading your journal archive…')}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (entries.length === 0) {
    return (
      <div className={`ja-container glass ${isDarkMode ? 'dark' : 'light'}`}>
        <TopBar title={t('archive.title', 'Journal Archive')} onBack={onBack} showBack />
        <div className="glass-empty-state">
          <BookOpen size={48} className="empty-icon" />
          <h2>{t('archive.emptyState.title', 'No Entries Yet')}</h2>
          <p>{t('archive.emptyState.description', 'Start your journaling journey – your entries will appear here.')}</p>
          <button className="glass-button primary" onClick={onBack}>
            <Sparkles size={18} /> {t('archive.emptyState.cta', 'Begin Writing')}
          </button>
        </div>
      </div>
    );
  }

  // Main archive UI
  return (
    <div className={`ja-container glass ${isDarkMode ? 'dark' : 'light'} ${isLoaded ? 'loaded' : ''}`}>
      <TopBar
        title={t('archive.title', 'Journal Archive')}
        onBack={onBack}
        showBack
        rightElement={
          <button className="glass-icon-btn" onClick={() => setShowFilterModal(true)}>
            <Filter size={18} />
          </button>
        }
      />

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <BookMarked size={20} className="stat-icon" />
          <div className="stat-info">
            <span className="stat-value">{stats.totalEntries}</span>
            <span className="stat-label">{t('archive.stats.entries', 'Entries')}</span>
          </div>
        </div>
        <div className="stat-card">
          <Flame size={20} className="stat-icon" />
          <div className="stat-info">
            <span className="stat-value">{stats.currentStreak}</span>
            <span className="stat-label">{t('archive.stats.dayStreak', 'Day Streak')}</span>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp size={20} className="stat-icon" />
          <div className="stat-info">
            <span className="stat-value">{stats.totalPaths}</span>
            <span className="stat-label">{t('archive.stats.paths', 'Paths')}</span>
          </div>
        </div>
        <div className="stat-card">
          <Calendar size={20} className="stat-icon" />
          <div className="stat-info">
            <span className="stat-value">{stats.thisWeek}</span>
            <span className="stat-label">{t('archive.stats.thisWeek', 'This Week')}</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="glass-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder={t('archive.search.placeholder', 'Search entries…')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="filters-section">
        <div className="quick-filters">
          {quickFilters.map(filter => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                className={`filter-chip ${isActive ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                <Icon size={16} />
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>
        {selectedPath !== 'all' && (
          <div className="active-path-filter">
            <span>{t('archive.filters.pathFilter', 'Path: {{path}}', { path: getPathInfo(selectedPath).title })}</span>
            <button onClick={() => setSelectedPath('all')}>
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="results-info">
        <span>
          {t('archive.results.count', '{{count}} {{noun}}', {
            count: filteredEntries.length,
            noun: filteredEntries.length === 1
              ? t('archive.results.entrySingular', 'entry')
              : t('archive.results.entryPlural', 'entries'),
          })}
        </span>
        {sortOrder === 'oldest' && <span> • {t('archive.results.oldestFirstNote', 'Oldest first')}</span>}
      </div>

      {/* Entries List */}
      <div className="entries-section">
        {filteredEntries.length === 0 ? (
          <div className="no-results">
            <Search size={32} />
            <p>{t('archive.noResults.message', 'No entries match your search')}</p>
            <button
              className="glass-button secondary"
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('all');
                setSelectedPath('all');
              }}
            >
              {t('archive.noResults.clearFilters', 'Clear Filters')}
            </button>
          </div>
        ) : (
          <div className="entries-list">
            {filteredEntries.map((entry, idx) => {
              const pathInfo = getPathInfo(entry.pathId);
              const pathColor = pathInfo.color || '168,85,247';
              return (
                <div
                  key={`${entry.pathId}-${entry.day}-${idx}`}
                  className="entry-card"
                  onClick={() => onSelectDay(entry.day, entry.pathId)}
                  style={{ '--entry-color': pathColor, animationDelay: `${idx * 0.03}s` }}
                >
                  <div className="entry-accent" style={{ backgroundColor: `rgb(${pathColor})` }} />
                  <div className="entry-main">
                    <div className="entry-day">
                      <span className="day-number">{entry.day}</span>
                      <span className="day-label">{t('archive.entry.day', 'Day')}</span>
                    </div>
                    <div className="entry-content">
                      <div className="entry-header">
                        <h3 className="entry-title">
                          {entry.isVoiceEntry && <Mic size={14} className="voice-icon" />}
                          {entry.theme || t('archive.entry.dayFallback', 'Day {{day}}', { day: entry.day })}
                        </h3>
                        <button
                          className={`favorite-btn ${entry.isFavorite ? 'favorited' : ''}`}
                          onClick={e => {
                            e.stopPropagation();
                            toggleFavorite(entry.id);
                          }}
                        >
                          <Star size={16} />
                        </button>
                      </div>
                      <p className="entry-preview">
                        {entry.isVoiceEntry && entry.transcription
                          ? entry.transcription.substring(0, 100) + (entry.transcription.length > 100 ? '…' : '')
                          : entry.analysis?.summary
                          ? entry.analysis.summary.substring(0, 100) + (entry.analysis.summary.length > 100 ? '…' : '')
                          : entry.prompt?.substring(0, 100) + (entry.prompt?.length > 100 ? '…' : '')}
                      </p>
                      <div className="entry-meta">
                        <span
                          className="entry-path"
                          style={{
                            color: `rgb(${pathColor})`,
                            backgroundColor: `rgba(${pathColor}, 0.12)`,
                          }}
                        >
                          {pathInfo.title}
                        </span>
                        <span className="entry-date">{formatDate(entry.timestamp)}</span>
                        {entry.isVoiceEntry && (
                          <span className="entry-type">
                            <Mic size={12} /> {t('archive.entry.voice', 'Voice')}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={18} className="entry-arrow" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Sheet Modal */}
      {showFilterModal && (
        <div className="modal-overlay" onClick={() => setShowFilterModal(false)}>
          <div className="glass-bottom-sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-header">
              <h3>{t('archive.filters.filterAndSort', 'Filter & Sort')}</h3>
              <button className="sheet-close" onClick={() => setShowFilterModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="sheet-content">
              <div className="filter-group">
                <label className="filter-label">{t('archive.filters.journeyPath', 'Journey Path')}</label>
                <div className="select-wrapper">
                  <select value={selectedPath} onChange={e => setSelectedPath(e.target.value)}>
                    <option value="all">{t('archive.filters.allPaths', 'All Paths')}</option>
                    {uniquePaths.map(pathId => {
                      const info = getPathInfo(pathId);
                      return (
                        <option key={pathId} value={pathId}>
                          {info.title}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown size={18} className="select-arrow" />
                </div>
              </div>
              <div className="filter-group">
                <label className="filter-label">{t('archive.filters.sortOrder', 'Sort Order')}</label>
                <div className="select-wrapper">
                  <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                    <option value="newest">{t('archive.filters.newestFirst', 'Newest First')}</option>
                    <option value="oldest">{t('archive.filters.oldestFirst', 'Oldest First')}</option>
                  </select>
                  <ChevronDown size={18} className="select-arrow" />
                </div>
              </div>
            </div>
            <div className="sheet-footer">
              <button
                className="glass-button secondary"
                onClick={() => {
                  setSelectedPath('all');
                  setSortOrder('newest');
                  setActiveFilter('all');
                  setSearchTerm('');
                }}
              >
                {t('archive.filters.resetAll', 'Reset All')}
              </button>
              <button className="glass-button primary" onClick={() => setShowFilterModal(false)}>
                {t('archive.filters.applyFilters', 'Apply Filters')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalArchive;