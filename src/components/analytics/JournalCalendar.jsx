// src/components/analytics/JournalCalendar.jsx – Apple Spatial Glass
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp } from 'lucide-react';
import './JournalCalendar.css';

const JournalCalendar = ({
  data = [],
  simplified = true,
  pathColor = '85, 139, 110',
  isDarkMode = true,
  loading = false
}) => {
  const { t } = useTranslation('analytics');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfWeek = (month, year) => new Date(year, month, 1).getDay();

  const monthNames = t('journalCalendar.months', {
    returnObjects: true,
    defaultValue: ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
  });
  const weekdayShort = t('journalCalendar.weekdayShort', { returnObjects: true, defaultValue: ['S', 'M', 'T', 'W', 'T', 'F', 'S'] });
  const weekdayAbbr = t('journalCalendar.weekdayAbbr', { returnObjects: true, defaultValue: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] });

  const getMonthName = (month) => monthNames[month];

  if (loading) {
    const skeletonHeaders = simplified ? weekdayShort : weekdayAbbr;
    return (
      <div className={`glass-calendar ${simplified ? 'simplified' : 'full'} skeleton`} aria-hidden="true">
        <div className="calendar-header">
          <span className="skeleton-bar skeleton-icon-btn" />
          <span className="skeleton-bar skeleton-title" />
          <span className="skeleton-bar skeleton-icon-btn" />
        </div>
        <div className="calendar-stats-row">
          <span className="skeleton-bar skeleton-pill" />
          <span className="skeleton-bar skeleton-pill" />
        </div>
        <div className={`calendar-grid ${simplified ? '' : 'full-grid'}`}>
          {skeletonHeaders.map((day, i) => (
            <div key={i} className="grid-day-header">{day}</div>
          ))}
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="calendar-cell skeleton-cell skeleton-bar" />
          ))}
        </div>
      </div>
    );
  }

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Calculate intensity level (1-4) based on count relative to max
  const getIntensityLevel = (count) => {
    if (!count) return 0;
    const maxCount = Math.max(...data.map(d => d.count), 1);
    // create 4 levels: 25%, 50%, 75%, 100%
    const ratio = count / maxCount;
    if (ratio >= 0.75) return 4;
    if (ratio >= 0.5) return 3;
    if (ratio >= 0.25) return 2;
    return 1;
  };

  // Build calendar cells
  const cells = [];
  // Empty cells before month start
  for (let i = 0; i < getFirstDayOfWeek(currentMonth, currentYear); i++) {
    cells.push({ day: null, entries: 0 });
  }
  // Month days
  for (let day = 1; day <= getDaysInMonth(currentMonth, currentYear); day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayData = data.find(d => d.date === dateStr);
    cells.push({
      day,
      date: dateStr,
      entries: dayData ? dayData.count : 0,
      isToday: day === new Date().getDate() && 
               currentMonth === new Date().getMonth() && 
               currentYear === new Date().getFullYear()
    });
  }

  // Month stats
  const totalEntries = cells.reduce((sum, cell) => sum + (cell.entries || 0), 0);
  const activeDays = cells.filter(cell => cell.entries > 0).length;
  const totalDaysInMonth = getDaysInMonth(currentMonth, currentYear);
  const consistency = totalDaysInMonth > 0 ? Math.round((activeDays / totalDaysInMonth) * 100) : 0;

  if (data.length === 0) return null;

  // Simplified view (used in AnalyticsDashboard)
  if (simplified) {
    return (
      <div 
        className="glass-calendar simplified"
        style={{ '--c': pathColor }}
      >
        <div className="calendar-header">
          <button className="glass-icon-btn" onClick={prevMonth}>
            <ChevronLeft size={18} />
          </button>
          <h3 className="calendar-title">{getMonthName(currentMonth)} {currentYear}</h3>
          <button className="glass-icon-btn" onClick={nextMonth}>
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="calendar-stats-row">
          <div className="stat-pill">
            <Calendar size={14} />
            <span>{t('journalCalendar.entriesCount', '{{count}} entries', { count: totalEntries })}</span>
          </div>
          <div className="stat-pill">
            <TrendingUp size={14} />
            <span>{t('journalCalendar.consistentPercent', '{{percent}}% consistent', { percent: consistency })}</span>
          </div>
        </div>

        <div className="calendar-grid">
          {weekdayShort.map((day, i) => (
            <div key={i} className="grid-day-header">{day}</div>
          ))}
          {cells.map((cell, idx) => (
            <div
              key={idx}
              className={`calendar-cell intensity-${cell.entries > 0 ? getIntensityLevel(cell.entries) : 0} ${cell.isToday ? 'is-today' : ''}`}
            >
              {cell.day && <span>{cell.day}</span>}
            </div>
          ))}
        </div>

        <div className="legend-row">
          <div className="legend-item">
            <div className="legend-dot intensity-1" />
            <span>{t('journalCalendar.less', 'Less')}</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot intensity-3" />
            <span>{t('journalCalendar.more', 'More')}</span>
          </div>
        </div>
      </div>
    );
  }

  // Full calendar view (if needed)
  return (
    <div 
      className="glass-calendar full"
      style={{ '--c': pathColor }}
    >
      <div className="calendar-header">
        <button className="glass-icon-btn" onClick={prevMonth}>
          <ChevronLeft size={20} />
        </button>
        <h2 className="calendar-title-large">{getMonthName(currentMonth)} {currentYear}</h2>
        <button className="glass-icon-btn" onClick={nextMonth}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="calendar-stats-large">
        <div className="stat-card">
          <span className="stat-value">{totalEntries}</span>
          <span className="stat-label">{t('journalCalendar.totalEntries', 'Total entries')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{activeDays}</span>
          <span className="stat-label">{t('journalCalendar.activeDays', 'Active days')}</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{consistency}%</span>
          <span className="stat-label">{t('journalCalendar.consistency', 'Consistency')}</span>
        </div>
      </div>

      <div className="calendar-grid full-grid">
        {weekdayAbbr.map((day, i) => (
          <div key={i} className="full-day-header">{day}</div>
        ))}
        {cells.map((cell, idx) => (
          <div
            key={idx}
            className={`calendar-cell intensity-${cell.entries > 0 ? getIntensityLevel(cell.entries) : 0} ${cell.isToday ? 'is-today' : ''}`}
          >
            {cell.day && <span>{cell.day}</span>}
            {cell.entries > 0 && <span className="entry-count">{cell.entries}</span>}
          </div>
        ))}
      </div>

      <div className="legend-grid">
        {[0, 1, 2, 3, 4].map(level => (
          <div key={level} className="legend-item">
            <div className={`legend-dot intensity-${level}`} />
            <span>
              {level === 0 && t('journalCalendar.legendNone', 'None')}
              {level === 1 && t('journalCalendar.legendOneEntry', '1 entry')}
              {level === 2 && t('journalCalendar.legendEntries', '{{count}} entries', { count: 2 })}
              {level === 3 && t('journalCalendar.legendEntries', '{{count}} entries', { count: 3 })}
              {level === 4 && t('journalCalendar.legendFourPlusEntries', '4+ entries')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JournalCalendar;