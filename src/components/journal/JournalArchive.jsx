import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  ArrowRight, 
  Calendar, 
  Eye, 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  SortDesc, 
  Hash,
  X,
  Heart,
  ArrowLeft,
  Map,
  Layers3,
  Clock,
  Star,
  Bookmark,
  Plus,
  Mic,
  Archive
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getPreviousEntries } from '../../services/claudeService';
import { getJourneyPath } from '../../data/JourneyData';
import { useTheme } from '../../contexts/ThemeContext';
import TopBar from '../common/TopBar';

import '../../styles/components/journal-archive.css';

const JournalArchive = ({ onBack, onSelectDay }) => {
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simplified state management
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'recent', 'favorites'
  const [selectedPath, setSelectedPath] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  // Quick filters
  const quickFilters = [
    { id: 'all', label: 'All', icon: Layers3 },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'favorites', label: 'Favorites', icon: Star }
  ];

  const [uniquePaths, setUniquePaths] = useState([]);
  const [stats, setStats] = useState({
    totalEntries: 0,
    currentStreak: 0,
    totalPaths: 0,
    thisWeek: 0
  });

  useEffect(() => {
    const fetchEntries = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoading(true);
        const journalEntries = await getPreviousEntries(currentUser.uid);
        
        const processedEntries = journalEntries.map(entry => ({
          ...entry,
          pathId: entry.pathId || 'self-discovery',
          isFavorite: entry.isFavorite || false // Add favorite status
        }));
        
        const sortedEntries = processedEntries.sort((a, b) => b.day - a.day);
        
        setEntries(sortedEntries);
        setFilteredEntries(sortedEntries);
        
        // Extract unique paths
        const paths = [...new Set(processedEntries.map(entry => entry.pathId).filter(Boolean))];
        setUniquePaths(paths);
        
        // Calculate stats
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thisWeekEntries = processedEntries.filter(entry => {
          const entryDate = entry.timestamp?.toDate ? entry.timestamp.toDate() : new Date(entry.timestamp);
          return entryDate >= oneWeekAgo;
        });
        
        setStats({
          totalEntries: processedEntries.length,
          currentStreak: calculateStreak(processedEntries),
          totalPaths: paths.length,
          thisWeek: thisWeekEntries.length
        });
        
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntries();
  }, [currentUser]);

  // Calculate current streak
  const calculateStreak = (entries) => {
    if (entries.length === 0) return 0;
    
    const sortedByDate = entries.sort((a, b) => {
      const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
      const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
      return dateB - dateA;
    });
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedByDate.length; i++) {
      const entryDate = sortedByDate[i].timestamp?.toDate ? 
        sortedByDate[i].timestamp.toDate() : new Date(sortedByDate[i].timestamp);
      entryDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000));
      
      if (entryDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Filter entries based on active filters
  useEffect(() => {
    let result = [...entries];
    
    // Apply quick filters
    if (activeFilter === 'recent') {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      result = result.filter(entry => {
        const entryDate = entry.timestamp?.toDate ? entry.timestamp.toDate() : new Date(entry.timestamp);
        return entryDate >= oneWeekAgo;
      });
    } else if (activeFilter === 'favorites') {
      result = result.filter(entry => entry.isFavorite);
    }
    
    // Apply path filter
    if (selectedPath !== 'all') {
      result = result.filter(entry => entry.pathId === selectedPath);
    }
    
    // Apply search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(entry => 
        (entry.theme && entry.theme.toLowerCase().includes(term)) ||
        (entry.prompt && entry.prompt.toLowerCase().includes(term)) ||
        (entry.analysis && entry.analysis.summary && entry.analysis.summary.toLowerCase().includes(term)) ||
        (entry.transcription && entry.transcription.toLowerCase().includes(term)) // Include voice transcriptions
      );
    }
    
    // Apply sorting
    if (sortOrder === 'newest') {
      result.sort((a, b) => {
        const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
        return dateB - dateA;
      });
    } else if (sortOrder === 'oldest') {
      result.sort((a, b) => {
        const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
        const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
        return dateA - dateB;
      });
    }
    
    setFilteredEntries(result);
  }, [entries, activeFilter, selectedPath, searchTerm, sortOrder]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'No date';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    }).format(date);
  };

  const getPathInfo = (pathId) => {
    try {
      const pathData = getJourneyPath(pathId);
      return pathData || { 
        title: 'Unknown Path', 
        color: '43, 70, 60',
        iconName: 'Book'
      };
    } catch (error) {
      return { 
        title: 'Unknown Path', 
        color: '43, 70, 60',
        iconName: 'Book'
      };
    }
  };

  const getSentimentIcon = (entry) => {
    if (!entry.analysis) return null;
    
    const summary = entry.analysis.summary?.toLowerCase() || '';
    
    if (summary.includes('gratitude') || summary.includes('happy') || summary.includes('positive')) {
      return <Heart className="ja-sentiment-positive" />;
    }
    
    return null;
  };

  const toggleFavorite = (entryId) => {
    // This would update the favorite status in the database
    setEntries(prev => prev.map(entry => 
      entry.id === entryId ? { ...entry, isFavorite: !entry.isFavorite } : entry
    ));
  };

  if (isLoading) {
    return (
      <div className={`ja-container ${isDarkMode ? 'ja-dark' : 'ja-light'}`}>
        <div className="ja-header">
          <button className="ja-back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="ja-title">Your Journal</h1>
          <div className="ja-header-placeholder"></div>
        </div>
        
        <div className="ja-loading-container">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="ja-entry-card ja-skeleton">
              <div className="ja-card-header">
                <div className="ja-skeleton-circle"></div>
                <div className="ja-skeleton-content">
                  <div className="ja-skeleton-line"></div>
                  <div className="ja-skeleton-line ja-short"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className={`ja-container ${isDarkMode ? 'ja-dark' : 'ja-light'}`}>
        <div className="ja-header">
          <button className="ja-back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="ja-title">Your Journal</h1>
          <div className="ja-header-placeholder"></div>
        </div>
        
        <div className="ja-empty-state">
          <div className="ja-empty-icon">
            <BookOpen size={48} />
          </div>
          <h2 className="ja-empty-title">No Entries Yet</h2>
          <p className="ja-empty-message">
            Start journaling to see your entries here
          </p>
          <button className="ja-start-btn" onClick={onBack}>
            <Plus size={16} />
            Start Writing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`ja-container ${isDarkMode ? 'ja-dark' : 'ja-light'}`}>
      {/* Top Bar */}
      <TopBar 
        title="Journal Archive"
        subtitle={`${stats.totalEntries} entries across ${stats.totalPaths} paths`}
        icon={Archive}
        actions={
          <>
            <button className="ja-back-btn" onClick={onBack}>
              <ArrowLeft size={20} />
            </button>
            <button 
              className="icon-button"
              onClick={() => setShowFilterModal(true)}
            >
              <Filter size={18} />
            </button>
          </>
        }
      />

      {/* Header */}
      <div className="ja-header">
        {/* Stats Cards */}
        <div className="ja-stats-grid">
        <div className="ja-stat-card">
          <div className="ja-stat-value">{stats.totalEntries}</div>
          <div className="ja-stat-label">Total Entries</div>
        </div>
        <div className="ja-stat-card">
          <div className="ja-stat-value">{stats.currentStreak}</div>
          <div className="ja-stat-label">Day Streak</div>
        </div>
        <div className="ja-stat-card">
          <div className="ja-stat-value">{stats.totalPaths}</div>
          <div className="ja-stat-label">Paths</div>
        </div>
        <div className="ja-stat-card">
          <div className="ja-stat-value">{stats.thisWeek}</div>
          <div className="ja-stat-label">This Week</div>
        </div>
      </div>
      </div>

      {/* Search */}
      <div className="ja-search-section">
        <div className="ja-search-bar">
          <Search size={18} className="ja-search-icon" />
          <input
            type="text"
            placeholder="Search your entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ja-search-input"
          />
          {searchTerm && (
            <button 
              className="ja-clear-btn"
              onClick={() => setSearchTerm('')}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="ja-quick-filters">
        {quickFilters.map(filter => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.id}
              className={`ja-filter-chip ${activeFilter === filter.id ? 'ja-active' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              <Icon size={16} />
              <span>{filter.label}</span>
            </button>
          );
        })}
      </div>

      {/* Entries List */}
      <div className="ja-entries-section">
        {filteredEntries.length === 0 ? (
          <div className="ja-no-results">
            <p>No entries match your search</p>
            <button 
              className="ja-clear-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('all');
                setSelectedPath('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="ja-entries-list">
            {filteredEntries.map((entry) => {
              const pathInfo = getPathInfo(entry.pathId);
              return (
                <div 
                  key={`${entry.pathId}-${entry.day}`} 
                  className="ja-entry-card"
                  onClick={() => onSelectDay(entry.day, entry.pathId)}
                >
                  <div className="ja-card-header">
                    <div 
                      className="ja-day-badge"
                      style={{
                        backgroundColor: `rgba(${pathInfo.color}, 0.2)`,
                        color: `rgb(${pathInfo.color})`
                      }}
                    >
                      {entry.day}
                    </div>
                    
                    <div className="ja-entry-content">
                      <div className="ja-entry-title-row">
                        <h3 className="ja-entry-title">
                          {entry.isVoiceEntry && <Mic size={14} style={{ marginRight: '4px', display: 'inline' }} />}
                          {entry.theme || `Day ${entry.day}`}
                        </h3>
                        <div className="ja-entry-actions">
                          {getSentimentIcon(entry)}
                          <button
                            className={`ja-favorite-btn ${entry.isFavorite ? 'ja-active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(entry.id);
                            }}
                          >
                            <Star size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <p className="ja-entry-preview">
                        {entry.isVoiceEntry && entry.transcription ? 
                          entry.transcription.substring(0, 80) + '...' :
                          entry.analysis?.summary ? 
                            entry.analysis.summary.substring(0, 80) + '...' :
                            entry.prompt?.substring(0, 80) + '...'
                        }
                      </p>
                      
                      <div className="ja-entry-meta">
                        <span className="ja-entry-path" style={{ color: `rgb(${pathInfo.color})` }}>
                          {pathInfo.title}
                        </span>
                        <span className="ja-entry-date">
                          {formatDate(entry.timestamp)}
                        </span>
                        {entry.isVoiceEntry && (
                          <span className="ja-entry-type" style={{ color: `rgb(${pathInfo.color})` }}>
                            🎤 Voice
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <ChevronRight size={16} className="ja-entry-arrow" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="ja-modal-overlay" onClick={() => setShowFilterModal(false)}>
          <div className="ja-filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ja-modal-header">
              <h3>Filter & Sort</h3>
              <button onClick={() => setShowFilterModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="ja-modal-content">
              <div className="ja-filter-section">
                <label className="ja-section-label">Journey Path</label>
                <select 
                  value={selectedPath}
                  onChange={(e) => setSelectedPath(e.target.value)}
                  className="ja-select-input"
                >
                  <option value="all">All Paths</option>
                  {uniquePaths.map(pathId => {
                    const pathInfo = getPathInfo(pathId);
                    return (
                      <option key={pathId} value={pathId}>
                        {pathInfo.title}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              <div className="ja-filter-section">
                <label className="ja-section-label">Sort Order</label>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="ja-select-input"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
            
            <div className="ja-modal-footer">
              <button 
                className="ja-clear-btn-modal"
                onClick={() => {
                  setSelectedPath('all');
                  setSortOrder('newest');
                  setActiveFilter('all');
                  setSearchTerm('');
                }}
              >
                Clear All
              </button>
              <button 
                className="ja-apply-btn"
                onClick={() => setShowFilterModal(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalArchive;