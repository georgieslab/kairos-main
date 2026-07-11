// src/components/dashboard/UserDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  PieChart, 
  Calendar, 
  Award, 
  TrendingUp, 
  Clock, 
  BookOpen,
  ChevronRight,
  Download,
  Search
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getPreviousEntries, generateProgressReport } from '../../services/claudeService';

const UserDashboard = () => {
  const { t } = useTranslation('dashboard');
  const { currentUser, userProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [journalEntries, setJournalEntries] = useState([]);
  const [progressReport, setProgressReport] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalEntries: 0,
    streakDays: 0,
    completionRate: 0,
    avgWordCount: 0,
    mostProductiveDay: 'Sunday',
    mostCommonThemes: []
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        if (!currentUser) return;
        
        // Get journal entries
        const entries = await getPreviousEntries(currentUser.uid);
        setJournalEntries(entries);
        
        // Get or generate progress report
        let report = await generateProgressReport(currentUser.uid);
        setProgressReport(report);
        
        // Calculate statistics
        calculateStats(entries, report);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [currentUser]);
  
  // Calculate statistics based on entries and report
  const calculateStats = (entries, report) => {
    if (!entries || !report) return;
    
    // Sort entries by date
    const sortedEntries = [...entries].sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
    
    // Calculate streak
    let streakDays = 0;
    let lastDate = null;
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.timestamp);
      
      if (!lastDate) {
        lastDate = entryDate;
        streakDays = 1;
        continue;
      }
      
      const dayDiff = Math.floor((lastDate - entryDate) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        streakDays++;
        lastDate = entryDate;
      } else {
        break;
      }
    }
    
    // Calculate average word count (assuming each entry has a summary with words)
    const totalWords = entries.reduce((sum, entry) => {
      const summary = entry.analysis?.summary || '';
      const wordCount = summary.split(' ').length;
      return sum + wordCount;
    }, 0);
    
    const avgWordCount = entries.length > 0 ? Math.round(totalWords / entries.length) : 0;
    
    // Determine most productive day
    const dayCount = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    
    entries.forEach(entry => {
      if (entry.timestamp) {
        const day = new Date(entry.timestamp).getDay();
        dayCount[day]++;
      }
    });
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const mostProductiveDay = days[Object.keys(dayCount).reduce((a, b) => dayCount[a] > dayCount[b] ? a : b, 0)];
    
    // Update stats
    setStats({
      totalEntries: entries.length,
      streakDays,
      completionRate: report.completionRate || 0,
      avgWordCount,
      mostProductiveDay,
      mostCommonThemes: report.commonThemes || []
    });
  };
  
  // Filter entries based on search query
  const filteredEntries = journalEntries.filter(entry => {
    if (!searchQuery) return true;
    
    const summary = entry.analysis?.summary || '';
    const theme = entry.theme || '';
    const prompt = entry.prompt || '';
    
    return (
      summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-800 rounded w-2/3 mb-8"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="h-32 bg-gray-800 rounded"></div>
              <div className="h-32 bg-gray-800 rounded"></div>
              <div className="h-32 bg-gray-800 rounded"></div>
            </div>
            
            <div className="h-64 bg-gray-800 rounded mb-8"></div>
            
            <div className="h-4 bg-gray-800 rounded w-1/4 mb-4"></div>
            <div className="h-20 bg-gray-800 rounded mb-4"></div>
            <div className="h-20 bg-gray-800 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('header.title', 'Your Journal Dashboard')}</h1>
          <p className="text-gray-400">
            {t('header.subtitle', 'Track your journaling progress and insights')}
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Entries */}
          <div className="glass-card p-4 flex flex-col">
            <div className="flex items-center mb-2">
              <BookOpen className="w-5 h-5 text-emerald-500 mr-2" />
              <span className="text-sm text-gray-400">{t('stats.totalEntries', 'Total Entries')}</span>
            </div>
            <span className="text-3xl font-bold">{stats.totalEntries}</span>
            <span className="text-xs text-gray-500 mt-2">
              {stats.totalEntries === 10 ? t('stats.journeyCompleted', 'Journey Completed!') : t('stats.percentComplete', '{{percent}}% of journey complete', { percent: stats.completionRate })}
            </span>
          </div>

          {/* Current Streak */}
          <div className="glass-card p-4 flex flex-col">
            <div className="flex items-center mb-2">
              <Award className="w-5 h-5 text-emerald-500 mr-2" />
              <span className="text-sm text-gray-400">{t('stats.currentStreak', 'Current Streak')}</span>
            </div>
            <span className="text-3xl font-bold">{stats.streakDays}</span>
            <span className="text-xs text-gray-500 mt-2">
              {stats.streakDays > 1 ? t('stats.daysInARowCount', '{{count}} days in a row', { count: stats.streakDays }) : t('stats.daysInARow', 'days in a row')}
            </span>
          </div>

          {/* Most Common Theme */}
          <div className="glass-card p-4 flex flex-col">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-500 mr-2" />
              <span className="text-sm text-gray-400">{t('stats.topTheme', 'Top Theme')}</span>
            </div>
            <span className="text-lg font-bold truncate">
              {stats.mostCommonThemes[0] || t('stats.noneYet', 'None yet')}
            </span>
            <span className="text-xs text-gray-500 mt-2">
              {t('stats.basedOnJournalContent', 'Based on your journal content')}
            </span>
          </div>

          {/* Most Productive Day */}
          <div className="glass-card p-4 flex flex-col">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-emerald-500 mr-2" />
              <span className="text-sm text-gray-400">{t('stats.bestJournalingDay', 'Best Journaling Day')}</span>
            </div>
            <span className="text-lg font-bold">{t(`days.${stats.mostProductiveDay}`, stats.mostProductiveDay)}</span>
            <span className="text-xs text-gray-500 mt-2">
              {t('stats.mostFrequentDay', 'You journal most frequently on this day')}
            </span>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-800 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BarChart className="w-4 h-4 mr-2" />
            {t('tabs.overview', 'Overview')}
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'insights'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <PieChart className="w-4 h-4 mr-2" />
            {t('tabs.keyInsights', 'Key Insights')}
          </button>

          <button
            onClick={() => setActiveTab('entries')}
            className={`px-4 py-3 font-medium text-sm flex items-center whitespace-nowrap ${
              activeTab === 'entries'
                ? 'text-emerald-400 border-b-2 border-emerald-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {t('tabs.pastEntries', 'Past Entries')}
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="mb-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Journey Progress */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Journey Progress</h2>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Day 1</span>
                    <span>Day 10</span>
                  </div>
                  
                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                      style={{ width: `${stats.completionRate}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{stats.completionRate}% Complete</span>
                    <span>{stats.totalEntries} / 10 Days</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(day => {
                    const isCompleted = journalEntries.some(entry => entry.day === day);
                    
                    return (
                      <div 
                        key={day}
                        className={`flex items-center justify-center h-12 rounded-md ${
                          isCompleted 
                            ? 'bg-emerald-900/40 border border-emerald-700/50 text-emerald-400' 
                            : 'bg-gray-800 text-gray-500'
                        }`}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Common Themes */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Most Common Themes</h2>
                
                {stats.mostCommonThemes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {stats.mostCommonThemes.map((theme, index) => (
                      <div 
                        key={index}
                        className="px-3 py-1 rounded-full bg-emerald-900/40 border border-emerald-700/50 text-emerald-400 text-sm"
                      >
                        {theme}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">
                    Complete more journal entries to see your common themes.
                  </p>
                )}
              </div>
              
              {/* Recommendation */}
              {progressReport && progressReport.recommendation && (
                <div className="glass-card p-6 border border-emerald-900/30 bg-gradient-to-br from-gray-900 to-emerald-950/20">
                  <h2 className="text-xl font-semibold mb-4">Your Personal Recommendation</h2>
                  <p className="text-gray-300 italic">
                    "{progressReport.recommendation}"
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              {/* Growth Areas */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Growth Areas</h2>
                
                {progressReport && progressReport.growthAreas && progressReport.growthAreas.length > 0 ? (
                  <ul className="space-y-3">
                    {progressReport.growthAreas.map((area, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-emerald-500 mr-2">•</span>
                        <span className="text-gray-300">{area}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">
                    Complete more journal entries to unlock growth insights.
                  </p>
                )}
              </div>
              
              {/* Word Cloud - Placeholder */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Frequently Used Words</h2>
                
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <p className="text-gray-400">
                    Word cloud visualization would appear here, showing the words you use most frequently in your journal entries.
                  </p>
                  
                  <button className="btn-secondary mt-4">
                    Generate Word Cloud
                  </button>
                </div>
              </div>
              
              {/* Emotional Trends - Placeholder */}
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4">Emotional Trends</h2>
                
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <p className="text-gray-400">
                    Emotional trend analysis would appear here, tracking the emotional tone of your journal entries over time.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Entries Tab */}
          {activeTab === 'entries' && (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-800 rounded-md leading-5 bg-gray-900 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Search journal entries..."
                />
              </div>
              
              {/* Entry List */}
              {filteredEntries.length > 0 ? (
                <div className="space-y-3">
                  {filteredEntries.map((entry) => (
                    <div 
                      key={entry.day || entry.id}
                      className="glass-card overflow-hidden group hover:border-emerald-700/50 transition-all cursor-pointer"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-emerald-900/40 flex items-center justify-center mr-4 text-emerald-400 font-medium">
                              {entry.day || '?'}
                            </div>
                            
                            <div>
                              <h3 className="font-medium">{entry.theme || `Day ${entry.day}`}</h3>
                              <p className="text-gray-500 text-sm">
                                {entry.timestamp ? new Date(entry.timestamp).toLocaleDateString() : 'No date'}
                              </p>
                            </div>
                          </div>
                          
                          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-emerald-500" />
                        </div>
                        
                        {entry.analysis && entry.analysis.summary && (
                          <div className="mt-3 pl-14">
                            <p className="text-gray-400 text-sm line-clamp-2">
                              {entry.analysis.summary}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-8 text-center">
                  <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Entries Found</h3>
                  <p className="text-gray-400 mb-6">
                    {searchQuery 
                      ? `No entries matching "${searchQuery}"`
                      : "You haven't created any journal entries yet."}
                  </p>
                  
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="btn-secondary"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}
              
              {/* Export Button */}
              {filteredEntries.length > 0 && (
                <div className="text-center mt-8">
                  <button className="btn-secondary flex items-center justify-center mx-auto">
                    <Download className="w-4 h-4 mr-2" />
                    Export Journal Entries
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
