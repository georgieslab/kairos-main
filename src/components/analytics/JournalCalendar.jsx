import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Info, AlertCircle } from 'lucide-react';

/**
 * Visualizes journal entry frequency on a calendar
 * @param {Array} data - Array of objects with date and count properties
 * @param {boolean} simplified - Whether to show simplified view
 */
const JournalCalendar = ({ 
  data = [], 
  simplified = false 
}) => {
  const [calendarData, setCalendarData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthStats, setMonthStats] = useState({ 
    total: 0, 
    average: 0, 
    daysWithEntries: 0,
    consistencyRate: 0 
  });
  const [hoveredDay, setHoveredDay] = useState(null);
  
  // Process data when it changes or month/year changes
  useEffect(() => {
    if (!data || data.length === 0) {
      setCalendarData([]);
      setMonthStats({ 
        total: 0, 
        average: 0, 
        daysWithEntries: 0,
        consistencyRate: 0 
      });
      return;
    }
    
    // Generate calendar data for the selected month
    const processMonthData = () => {
      // Get days in month and first day of month
      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
      
      // Initialize empty cells array
      const cells = [];
      
      // Add empty cells for days before first of month
      for (let i = 0; i < firstDayOfMonth; i++) {
        cells.push({ 
          day: null, 
          date: null,
          entries: 0, 
          isPreviousMonth: true 
        });
      }
      
      // Add cells for current month with entry data
      let totalEntries = 0;
      let daysWithEntries = 0;
      
      for (let day = 1; day <= daysInMonth; day++) {
        // Format date as YYYY-MM-DD for matching
        const dateObj = new Date(selectedYear, selectedMonth, day);
        const dateStr = dateObj.toISOString().split('T')[0];
        
        // Find entry count for this day
        const dayData = data.find(item => item.date === dateStr);
        const entryCount = dayData ? dayData.count : 0;
        
        // Update statistics
        totalEntries += entryCount;
        if (entryCount > 0) daysWithEntries++;
        
        // Add cell data
        cells.push({
          day,
          date: dateStr,
          entries: entryCount,
          isToday: isToday(day)
        });
      }
      
      // Calculate month statistics
      const avgEntries = daysInMonth > 0 ? totalEntries / daysInMonth : 0;
      const consistency = daysInMonth > 0 ? (daysWithEntries / daysInMonth) * 100 : 0;
      
      // Update state
      setCalendarData(cells);
      setMonthStats({
        total: totalEntries,
        average: parseFloat(avgEntries.toFixed(1)),
        daysWithEntries,
        consistencyRate: parseFloat(consistency.toFixed(0))
      });
    };
    
    processMonthData();
  }, [data, selectedMonth, selectedYear]);
  
  // Check if a day is today
  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      selectedMonth === today.getMonth() &&
      selectedYear === today.getFullYear()
    );
  };
  
  // Get month name
  const getMonthName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };
  
  // Navigate to next month
  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };
  
  // Get color intensity based on entry count
  const getColorIntensity = (entries) => {
    if (entries === 0) return 'color-0';
    
    // Find max entries across all data for relative scaling
    const maxEntries = Math.max(
      ...calendarData.filter(cell => cell.day !== null)
        .map(cell => cell.entries || 0),
      1
    );
    
    // Scale from 1 to 5 based on relative intensity
    const intensity = Math.min(Math.ceil((entries / maxEntries) * 5), 5);
    return `color-${intensity}`;
  };
  
  // Handle day hover - set hovered day info
  const handleDayHover = (cell) => {
    if (!cell.day) return;
    
    setHoveredDay({
      day: cell.day,
      date: cell.date,
      entries: cell.entries
    });
  };
  
  // Handle day hover leave - clear hovered day info
  const handleDayLeave = () => {
    setHoveredDay(null);
  };
  
  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div className="calendar-empty-state">
        <AlertCircle className="empty-state-icon" />
        <p className="empty-state-message">No journaling data available</p>
      </div>
    );
  }
  
  // Simplified view for overview tab
  if (simplified) {
    // Process data for monthly summary (current month and previous two)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Get data for last 3 months
    const monthlyData = [0, 1, 2].map(monthsAgo => {
      const month = (currentMonth - monthsAgo + 12) % 12;
      const year = currentMonth - monthsAgo < 0 ? currentYear - 1 : currentYear;
      
      // Count entries in this month
      const entriesInMonth = data.filter(item => {
        try {
          const date = new Date(item.date);
          return date.getMonth() === month && date.getFullYear() === year;
        } catch (err) {
          return false;
        }
      }).reduce((sum, item) => sum + item.count, 0);
      
      return {
        month,
        year,
        entries: entriesInMonth,
        name: getMonthName(month)
      };
    });
    
    return (
      <div className="simplified-calendar">
        {monthlyData.map((monthData, index) => (
          <div key={index} className="month-summary">
            <div className="month-summary-header">
              <span className="month-name">
                {index === 0 ? 'This Month' : index === 1 ? 'Last Month' : '2 Months Ago'}
              </span>
              <span className="month-entries">{monthData.entries} entries</span>
            </div>
            <div className="month-progress-bar">
              <div 
                className="month-progress-fill"
                style={{ width: `${Math.min(monthData.entries * 5, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Full calendar view
  return (
    <div className="journal-calendar-container">
      {/* Calendar header with month navigation */}
      <div className="calendar-header">
        <button 
          className="month-nav-button" 
          onClick={prevMonth}
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="calendar-title">
          {getMonthName(selectedMonth)} {selectedYear}
        </h3>
        <button 
          className="month-nav-button" 
          onClick={nextMonth}
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Month statistics */}
      <div className="month-statistics">
        <div className="stat-item">
          <div className="stat-label">Total Entries:</div>
          <div className="stat-value">{monthStats.total}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Daily Average:</div>
          <div className="stat-value">{monthStats.average}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Consistency:</div>
          <div className="stat-value">{monthStats.consistencyRate}%</div>
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="calendar-grid">
        {/* Day names header */}
        <div className="day-name-row">
          <div className="day-name">Sun</div>
          <div className="day-name">Mon</div>
          <div className="day-name">Tue</div>
          <div className="day-name">Wed</div>
          <div className="day-name">Thu</div>
          <div className="day-name">Fri</div>
          <div className="day-name">Sat</div>
        </div>
        
        {/* Calendar cells */}
        <div className="calendar-cells">
          {calendarData.map((cell, index) => (
            <div 
              key={index} 
              className={`calendar-cell ${cell.isPreviousMonth ? 'prev-month' : ''} 
                ${cell.isToday ? 'today' : ''} 
                ${cell.entries > 0 ? getColorIntensity(cell.entries) : ''}`}
              onMouseEnter={() => handleDayHover(cell)}
              onMouseLeave={handleDayLeave}
            >
              {cell.day && (
                <>
                  <div className="day-number">{cell.day}</div>
                  {cell.entries > 0 && (
                    <div className="entry-count-badge">
                      {cell.entries}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Hover tooltip */}
      {hoveredDay && (
        <div className="day-tooltip">
          <div className="tooltip-date">
            {new Date(hoveredDay.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
          <div className="tooltip-entries">
            {hoveredDay.entries} {hoveredDay.entries === 1 ? 'entry' : 'entries'}
          </div>
        </div>
      )}
      
      {/* Color legend */}
      <div className="calendar-legend">
        <div className="legend-header">
          <Info size={14} className="legend-icon" />
          <span>Entry Count</span>
        </div>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color color-0"></div>
            <span className="legend-label">0</span>
          </div>
          <div className="legend-item">
            <div className="legend-color color-1"></div>
            <span className="legend-label">1</span>
          </div>
          <div className="legend-item">
            <div className="legend-color color-2"></div>
            <span className="legend-label">2</span>
          </div>
          <div className="legend-item">
            <div className="legend-color color-3"></div>
            <span className="legend-label">3</span>
          </div>
          <div className="legend-item">
            <div className="legend-color color-4"></div>
            <span className="legend-label">4</span>
          </div>
          <div className="legend-item">
            <div className="legend-color color-5"></div>
            <span className="legend-label">5+</span>
          </div>
        </div>
      </div>
      
      {/* Explanation text */}
      <div className="calendar-explanation">
        <h4 className="explanation-title">Your Journaling Habits</h4>
        <p className="explanation-text">
          This calendar visualizes your journaling activity over time. 
          Darker colors indicate days with more entries. 
          Consistent journaling leads to deeper insights and more effective personal growth.
        </p>
      </div>
    </div>
  );
};

export default JournalCalendar;