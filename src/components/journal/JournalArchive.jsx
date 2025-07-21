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
<<<<<<< HEAD
  Map,
  Layers3,
  Clock,
  Star,
  Bookmark,
  Plus
=======
  Map
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getPreviousEntries } from '../../services/claudeService';
import { getJourneyPath } from '../../data/JourneyData';
<<<<<<< HEAD
import { useTheme } from '../../contexts/ThemeContext';

=======
// Import the theme context
import { useTheme } from '../../contexts/ThemeContext';

// Import the dedicated CSS
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
import '../../styles/components/journal-archive.css';

const JournalArchive = ({ onBack, onSelectDay }) => {
  const { currentUser } = useAuth();
<<<<<<< HEAD
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
=======
  // Use the centralized theme context
  const { isDarkMode } = useTheme();
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [expandedEntryId, setExpandedEntryId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // New state for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [selectedPath, setSelectedPath] = useState('all'); // New filter for paths
  const [sortOrder, setSortOrder] = useState('newest');
  const [groupBy, setGroupBy] = useState('path'); // Default to group by path
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique themes and paths from entries
  const [uniqueThemes, setUniqueThemes] = useState([]);
  const [uniquePaths, setUniquePaths] = useState([]);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188

  useEffect(() => {
    const fetchEntries = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoading(true);
        const journalEntries = await getPreviousEntries(currentUser.uid);
        
<<<<<<< HEAD
        const processedEntries = journalEntries.map(entry => ({
          ...entry,
          pathId: entry.pathId || 'self-discovery',
          isFavorite: entry.isFavorite || false // Add favorite status
        }));
        
=======
        // Ensure all entries have a pathId, defaulting to 'self-discovery'
        const processedEntries = journalEntries.map(entry => ({
          ...entry,
          pathId: entry.pathId || 'self-discovery' // Ensure pathId exists
        }));
        
        // Sort entries by day (default: newest first)
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        const sortedEntries = processedEntries.sort((a, b) => b.day - a.day);
        
        setEntries(sortedEntries);
        setFilteredEntries(sortedEntries);
        
<<<<<<< HEAD
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
        
=======
        // Extract unique themes
        const themes = [...new Set(processedEntries.map(entry => entry.theme).filter(Boolean))];
        setUniqueThemes(themes);
        
        // Extract unique paths
        const paths = [...new Set(processedEntries.map(entry => entry.pathId).filter(Boolean))];
        setUniquePaths(paths);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntries();
  }, [currentUser]);

<<<<<<< HEAD
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
=======
  // Filter and sort entries whenever filter conditions change
  useEffect(() => {
    if (entries.length === 0) return;
    
    let result = [...entries];
    
    // Apply theme filter
    if (selectedTheme !== 'all') {
      result = result.filter(entry => entry.theme === selectedTheme);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    }
    
    // Apply path filter
    if (selectedPath !== 'all') {
      result = result.filter(entry => entry.pathId === selectedPath);
    }
    
<<<<<<< HEAD
    // Apply search
    if (searchTerm.trim()) {
=======
    // Apply search term
    if (searchTerm.trim() !== '') {
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      const term = searchTerm.toLowerCase();
      result = result.filter(entry => 
        (entry.theme && entry.theme.toLowerCase().includes(term)) ||
        (entry.prompt && entry.prompt.toLowerCase().includes(term)) ||
<<<<<<< HEAD
        (entry.analysis && entry.analysis.summary && entry.analysis.summary.toLowerCase().includes(term))
=======
        (entry.analysis && entry.analysis.summary && entry.analysis.summary.toLowerCase().includes(term)) ||
        (entry.analysis && entry.analysis.insights && 
          entry.analysis.insights.some(insight => insight.toLowerCase().includes(term)))
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      );
    }
    
    // Apply sorting
    if (sortOrder === 'newest') {
<<<<<<< HEAD
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
=======
      result.sort((a, b) => b.day - a.day);
    } else if (sortOrder === 'oldest') {
      result.sort((a, b) => a.day - b.day);
    }
    
    setFilteredEntries(result);
  }, [entries, searchTerm, selectedTheme, selectedPath, sortOrder]);

  const toggleExpandEntry = (entryId) => {
    if (expandedEntryId === entryId) {
      setExpandedEntryId(null);
    } else {
      setExpandedEntryId(entryId);
    }
  };
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188

  const formatDate = (timestamp) => {
    if (!timestamp) return 'No date';
    
<<<<<<< HEAD
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
=======
    // If timestamp is a Firebase timestamp, convert it to JS Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
<<<<<<< HEAD
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

=======
      year: 'numeric'
    }).format(date);
  };

  // Get path information including name and color
  const getPathInfo = (pathId) => {
    const defaultInfo = { 
      title: 'Unknown Path', 
      color: '43, 70, 60',
      iconName: 'Book'
    };
    
    try {
      const pathData = getJourneyPath(pathId);
      return pathData || defaultInfo;
    } catch (error) {
      console.error(`Error getting path info for ${pathId}:`, error);
      return defaultInfo;
    }
  };

  // Get sentiment icon based on content analysis
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  const getSentimentIcon = (entry) => {
    if (!entry.analysis) return null;
    
    const summary = entry.analysis.summary?.toLowerCase() || '';
    
<<<<<<< HEAD
    if (summary.includes('gratitude') || summary.includes('happy') || summary.includes('positive')) {
      return <Heart className="ja-sentiment-positive" />;
=======
    if (summary.includes('gratitude') || 
        summary.includes('happy') || 
        summary.includes('positive') ||
        summary.includes('thankful')) {
      return <Heart className="sentiment-icon positive" />;
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    }
    
    return null;
  };

<<<<<<< HEAD
  const toggleFavorite = (entryId) => {
    // This would update the favorite status in the database
    setEntries(prev => prev.map(entry => 
      entry.id === entryId ? { ...entry, isFavorite: !entry.isFavorite } : entry
    ));
=======
  // Function to group entries
  const getGroupedEntries = () => {
    if (groupBy === 'none') return { 'All Entries': filteredEntries };
    
    if (groupBy === 'theme') {
      const groups = {};
      filteredEntries.forEach(entry => {
        const theme = entry.theme || 'Uncategorized';
        if (!groups[theme]) groups[theme] = [];
        groups[theme].push(entry);
      });
      return groups;
    }
    
    if (groupBy === 'path') {
      const groups = {};
      filteredEntries.forEach(entry => {
        // Get the path name from the path info
        const pathInfo = getPathInfo(entry.pathId);
        const pathName = pathInfo.title || 'Unknown Path';
        
        if (!groups[pathName]) {
          groups[pathName] = {
            entries: [],
            pathId: entry.pathId,
            color: pathInfo.color,
            iconName: pathInfo.iconName
          };
        }
        groups[pathName].entries.push(entry);
      });
      return groups;
    }
    
    if (groupBy === 'week') {
      const groups = {};
      filteredEntries.forEach(entry => {
        // Group by week (1-10 days journey split into 2 weeks)
        const week = entry.day <= 5 ? 'Week 1 (Days 1-5)' : 'Week 2 (Days 6-10)';
        if (!groups[week]) groups[week] = [];
        groups[week].push(entry);
      });
      return groups;
    }
    
    return { 'All Entries': filteredEntries };
  };

  // Get dynamic icon component based on name
  const getDynamicIcon = (iconName) => {
    const IconComponents = {
      Book: BookOpen,
      Compass: Map,
      Heart: Heart,
      // Add more icon mappings as needed
    };
    
    const IconComponent = IconComponents[iconName] || BookOpen;
    return <IconComponent className="path-icon" />;
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTheme('all');
    setSelectedPath('all');
    setSortOrder('newest');
    setGroupBy('path');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  };

  if (isLoading) {
    return (
<<<<<<< HEAD
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
=======
      <div className={`journal-archive-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
        <div className="journal-archive-header">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft className="back-icon" />
            <span>Back</span>
          </button>
          <h1 className="journal-archive-title">Journal Archive</h1>
          <p className="journal-archive-subtitle">Review your past entries and insights</p>
        </div>
        
        <div className="journal-entries-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="journal-entry-card animate-pulse">
              <div className="journal-entry-header">
                <div className="journal-entry-day bg-gray-800"></div>
                <div className="journal-entry-content">
                  <div className="h-5 bg-gray-800 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/4"></div>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
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
<<<<<<< HEAD
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
=======
      <div className={`journal-archive-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
        <div className="journal-archive-header">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft className="back-icon" />
            <span>Back</span>
          </button>
          <h1 className="journal-archive-title">Journal Archive</h1>
          <p className="journal-archive-subtitle">Review your past entries and insights</p>
        </div>
        
        <div className="journal-empty-state">
          <BookOpen className="journal-empty-state-icon" />
          <h2 className="journal-empty-state-title">No Journal Entries Yet</h2>
          <p className="journal-empty-state-message">
            Start your journaling journey to see your entries here.
          </p>
          <button 
            className="journal-start-button"
            onClick={onBack}
          >
            <Calendar className="journal-start-button-icon" />
            Start Journaling
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
          </button>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  return (
    <div className={`ja-container ${isDarkMode ? 'ja-dark' : 'ja-light'}`}>
      {/* Header */}
      <div className="ja-header">
        <button className="ja-back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="ja-title">Your Journal</h1>
        <button 
          className="ja-filter-btn"
          onClick={() => setShowFilterModal(true)}
        >
          <Filter size={18} />
        </button>
      </div>

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
=======
  const groupedEntries = getGroupedEntries();

  return (
    <div className={`journal-archive-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <div className="journal-archive-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft className="back-icon" />
          <span>Back</span>
        </button>
        <h1 className="journal-archive-title">Journal Archive</h1>
        <p className="journal-archive-subtitle">Review your past entries and insights</p>
      </div>
      
      {/* Search and Filter Controls */}
      <div className="archive-controls">
        <div className="search-container">
          <Search className="search-icon" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search entries..."
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <X className="clear-icon" />
            </button>
          )}
        </div>
        
        <button 
          className={`filter-toggle-button ${showFilters ? 'active' : ''}`}
          onClick={toggleFilters}
        >
          <Filter className="filter-icon" />
          <span>Filters</span>
        </button>
      </div>
      
      {/* Expanded Filters */}
      {showFilters && (
        <div className="expanded-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label">
                <Map className="filter-label-icon" />
                Path
              </label>
              <select 
                value={selectedPath}
                onChange={(e) => setSelectedPath(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Paths</option>
                {uniquePaths.map(pathId => {
                  const pathInfo = getPathInfo(pathId);
                  return (
                    <option key={pathId} value={pathId}>
                      {pathInfo.title || pathId}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">
                <Hash className="filter-label-icon" />
                Theme
              </label>
              <select 
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Themes</option>
                {uniqueThemes.map(theme => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="filter-row">
            <div className="filter-group">
              <label className="filter-label">
                <SortDesc className="filter-label-icon" />
                Sort By
              </label>
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="filter-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label className="filter-label">
                <CalendarIcon className="filter-label-icon" />
                Group By
              </label>
              <select 
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="filter-select"
              >
                <option value="path">By Path</option>
                <option value="theme">By Theme</option>
                <option value="week">By Week</option>
                <option value="none">No Grouping</option>
              </select>
            </div>
            
            <button 
              className="clear-filters-button"
              onClick={clearFilters}
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
            >
              Clear Filters
            </button>
          </div>
<<<<<<< HEAD
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
                        {entry.analysis?.summary ? 
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
=======
        </div>
      )}
      
      {/* Filter Summary */}
      {(searchTerm || selectedTheme !== 'all' || selectedPath !== 'all') && (
        <div className="filter-summary">
          <p className="filter-summary-text">
            Showing {filteredEntries.length} of {entries.length} entries
            {selectedPath !== 'all' && ` in path "${getPathInfo(selectedPath).title}"`}
            {selectedTheme !== 'all' && ` with theme "${selectedTheme}"`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      )}
      
      {/* Grouped Entries */}
      {groupBy === 'path' ? (
        // Special handling for path grouping with enhanced styling
        Object.entries(groupedEntries).map(([groupName, groupData]) => {
          if (!groupData.entries || groupData.entries.length === 0) return null;
          
          const pathColor = groupData.color || '43, 70, 60';
          const iconName = groupData.iconName || 'Book';
          
          return (
            <div key={groupName} className="entry-group">
              <div 
                className="entry-group-title-container" 
                style={{
                  borderLeftColor: `rgb(${pathColor})`,
                  backgroundColor: `rgba(${pathColor}, 0.1)`
                }}
              >
                {getDynamicIcon(iconName)}
                <h2 className="entry-group-title">{groupName}</h2>
              </div>
              
              <div className="journal-entries-list">
                {groupData.entries.map((entry) => (
                  <div key={`${entry.pathId}-${entry.day}`} className="journal-entry-card">
                    <div 
                      className="journal-entry-header"
                      onClick={() => toggleExpandEntry(`${entry.pathId}-${entry.day}`)}
                    >
                      <div 
                        className="journal-entry-day"
                        style={{
                          backgroundColor: `rgba(${pathColor}, 0.2)`,
                          color: `rgb(${pathColor})`
                        }}
                      >
                        {entry.day}
                      </div>
                      
                      <div className="journal-entry-content">
                        <div className="journal-entry-title-row">
                          <h3 className="journal-entry-title">
                            {entry.theme || `Day ${entry.day}`}
                          </h3>
                          {getSentimentIcon(entry)}
                        </div>
                        <p className="journal-entry-theme">
                          {entry.prompt ? entry.prompt.substring(0, 60) + (entry.prompt.length > 60 ? '...' : '') : 'No prompt'}
                        </p>
                        <p className="journal-entry-date">
                          {formatDate(entry.timestamp)}
                        </p>
                      </div>
                      
                      <ChevronRight className={`journal-entry-chevron ${expandedEntryId === `${entry.pathId}-${entry.day}` ? 'expanded' : ''}`} />
                    </div>
                    
                    {expandedEntryId === `${entry.pathId}-${entry.day}` && entry.analysis && (
                      <div className="journal-entry-details">
                        {entry.analysis.summary && (
                          <div className="journal-entry-summary">
                            <h4 className="summary-title">Summary</h4>
                            {entry.analysis.summary}
                          </div>
                        )}
                        
                        {entry.analysis.insights && entry.analysis.insights.length > 0 && (
                          <div className="journal-entry-insights">
                            <h4 className="journal-entry-insights-title">Key Insights</h4>
                            <ul className="journal-entry-insights-list">
                              {entry.analysis.insights.map((insight, index) => (
                                <li key={index} className="journal-entry-insights-item">
                                  {insight}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {entry.analysis.practicalAction && (
                          <div className="journal-entry-action">
                            <h4 className="action-title">Suggested Action</h4>
                            <p className="action-text">{entry.analysis.practicalAction}</p>
                          </div>
                        )}
                        
                        <button 
                          className="journal-entry-view-button"
                          onClick={() => {
                            console.log(`Viewing full entry for path ${entry.pathId}, day ${entry.day}`);
                            onSelectDay(entry.day, entry.pathId);
                          }}
                          style={{
                            backgroundColor: `rgba(${pathColor}, 0.2)`,
                            color: `rgb(${pathColor})`
                          }}
                        >
                          View Full Entry
                          <Eye className="journal-entry-view-button-icon" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        // Standard grouping for other group types
        Object.entries(groupedEntries).map(([groupName, groupEntries]) => {
          // Handle regular arrays (non-path grouping)
          const entries = Array.isArray(groupEntries) ? groupEntries : 
                         (groupEntries.entries ? groupEntries.entries : []);
          
          if (entries.length === 0) return null;
          
          return (
            <div key={groupName} className="entry-group">
              {groupBy !== 'none' && (
                <h2 className="entry-group-title">{groupName}</h2>
              )}
              
              <div className="journal-entries-list">
                {entries.map((entry) => {
                  const pathInfo = getPathInfo(entry.pathId);
                  const pathColor = pathInfo.color || '43, 70, 60';
                  
                  return (
                    <div key={`${entry.pathId}-${entry.day}`} className="journal-entry-card">
                      <div 
                        className="journal-entry-header"
                        onClick={() => toggleExpandEntry(`${entry.pathId}-${entry.day}`)}
                      >
                        <div 
                          className="journal-entry-day"
                          style={{
                            backgroundColor: `rgba(${pathColor}, 0.2)`,
                            color: `rgb(${pathColor})`
                          }}
                        >
                          {entry.day}
                        </div>
                        
                        <div className="journal-entry-content">
                          <div className="journal-entry-title-row">
                            <h3 className="journal-entry-title">
                              {entry.theme || `Day ${entry.day}`}
                            </h3>
                            {getSentimentIcon(entry)}
                          </div>
                          <p className="journal-entry-theme">
                            {entry.prompt ? entry.prompt.substring(0, 60) + (entry.prompt.length > 60 ? '...' : '') : 'No prompt'}
                          </p>
                          <div className="journal-entry-meta">
                            <span className="journal-entry-date">
                              {formatDate(entry.timestamp)}
                            </span>
                            <span className="journal-entry-path-badge" style={{ backgroundColor: `rgba(${pathColor}, 0.2)` }}>
                              {pathInfo.title}
                            </span>
                          </div>
                        </div>
                        
                        <ChevronRight className={`journal-entry-chevron ${expandedEntryId === `${entry.pathId}-${entry.day}` ? 'expanded' : ''}`} />
                      </div>
                      
                      {expandedEntryId === `${entry.pathId}-${entry.day}` && entry.analysis && (
                        <div className="journal-entry-details">
                          {entry.analysis.summary && (
                            <div className="journal-entry-summary">
                              <h4 className="summary-title">Summary</h4>
                              {entry.analysis.summary}
                            </div>
                          )}
                          
                          {entry.analysis.insights && entry.analysis.insights.length > 0 && (
                            <div className="journal-entry-insights">
                              <h4 className="journal-entry-insights-title">Key Insights</h4>
                              <ul className="journal-entry-insights-list">
                                {entry.analysis.insights.map((insight, index) => (
                                  <li key={index} className="journal-entry-insights-item">
                                    {insight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {entry.analysis.practicalAction && (
                            <div className="journal-entry-action">
                              <h4 className="action-title">Suggested Action</h4>
                              <p className="action-text">{entry.analysis.practicalAction}</p>
                            </div>
                          )}
                          
                          <button 
                            className="journal-entry-view-button"
                            onClick={() => onSelectDay(entry.day, entry.pathId)}
                            style={{
                              backgroundColor: `rgba(${pathColor}, 0.2)`,
                              color: `rgb(${pathColor})`
                            }}
                          >
                            View Full Entry
                            <Eye className="journal-entry-view-button-icon" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
      
      {filteredEntries.length === 0 && (
        <div className="no-results">
          <p className="no-results-text">No entries match your search criteria</p>
          <button 
            className="clear-filters-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
        </div>
      )}
    </div>
  );
};

export default JournalArchive;