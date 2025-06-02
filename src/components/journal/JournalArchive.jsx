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
  Map
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getPreviousEntries } from '../../services/claudeService';
import { getJourneyPath } from '../../data/JourneyData';
// Import the theme context
import { useTheme } from '../../contexts/ThemeContext';

// Import the dedicated CSS
import '../../styles/components/journal-archive.css';

const JournalArchive = ({ onBack, onSelectDay }) => {
  const { currentUser } = useAuth();
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

  useEffect(() => {
    const fetchEntries = async () => {
      if (!currentUser) return;
      
      try {
        setIsLoading(true);
        const journalEntries = await getPreviousEntries(currentUser.uid);
        
        // Ensure all entries have a pathId, defaulting to 'self-discovery'
        const processedEntries = journalEntries.map(entry => ({
          ...entry,
          pathId: entry.pathId || 'self-discovery' // Ensure pathId exists
        }));
        
        // Sort entries by day (default: newest first)
        const sortedEntries = processedEntries.sort((a, b) => b.day - a.day);
        
        setEntries(sortedEntries);
        setFilteredEntries(sortedEntries);
        
        // Extract unique themes
        const themes = [...new Set(processedEntries.map(entry => entry.theme).filter(Boolean))];
        setUniqueThemes(themes);
        
        // Extract unique paths
        const paths = [...new Set(processedEntries.map(entry => entry.pathId).filter(Boolean))];
        setUniquePaths(paths);
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntries();
  }, [currentUser]);

  // Filter and sort entries whenever filter conditions change
  useEffect(() => {
    if (entries.length === 0) return;
    
    let result = [...entries];
    
    // Apply theme filter
    if (selectedTheme !== 'all') {
      result = result.filter(entry => entry.theme === selectedTheme);
    }
    
    // Apply path filter
    if (selectedPath !== 'all') {
      result = result.filter(entry => entry.pathId === selectedPath);
    }
    
    // Apply search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(entry => 
        (entry.theme && entry.theme.toLowerCase().includes(term)) ||
        (entry.prompt && entry.prompt.toLowerCase().includes(term)) ||
        (entry.analysis && entry.analysis.summary && entry.analysis.summary.toLowerCase().includes(term)) ||
        (entry.analysis && entry.analysis.insights && 
          entry.analysis.insights.some(insight => insight.toLowerCase().includes(term)))
      );
    }
    
    // Apply sorting
    if (sortOrder === 'newest') {
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

  const formatDate = (timestamp) => {
    if (!timestamp) return 'No date';
    
    // If timestamp is a Firebase timestamp, convert it to JS Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
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
  const getSentimentIcon = (entry) => {
    if (!entry.analysis) return null;
    
    const summary = entry.analysis.summary?.toLowerCase() || '';
    
    if (summary.includes('gratitude') || 
        summary.includes('happy') || 
        summary.includes('positive') ||
        summary.includes('thankful')) {
      return <Heart className="sentiment-icon positive" />;
    }
    
    return null;
  };

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
  };

  if (isLoading) {
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
        
        <div className="journal-entries-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="journal-entry-card animate-pulse">
              <div className="journal-entry-header">
                <div className="journal-entry-day bg-gray-800"></div>
                <div className="journal-entry-content">
                  <div className="h-5 bg-gray-800 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded w-1/4"></div>
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
          </button>
        </div>
      </div>
    );
  }

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
            >
              Clear Filters
            </button>
          </div>
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
        </div>
      )}
    </div>
  );
};

export default JournalArchive;