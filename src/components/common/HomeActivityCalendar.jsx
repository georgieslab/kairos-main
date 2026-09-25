// src/components/common/HomeActivityCalendar.jsx
//
// Journaling Activity section on the Home Screen:
// - On mobile (< 768px): streamlined 7-day rolling activity strip.
// - On tablet and desktop (>= 768px): full interactive monthly calendar view
//   with month navigation, active day highlights, streaks, and stats.

import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Flame, RotateCcw } from 'lucide-react';
import '../../styles/components/homeActivityCalendar.css';

const HomeActivityCalendar = ({
  allEntries = [],
  totalEntries = 0,
  currentStreak = 0,
  pathColor = '85, 139, 110',
  statsLoading = false,
}) => {
  const { t, i18n } = useTranslation(['journey', 'analytics']);
  const now = useMemo(() => new Date(), []);

  // Selected month/year for desktop & tablet monthly view
  const [viewDate, setViewDate] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  // Parse all entries into a map for fast lookup
  const { entriesByDate, activeDatesSet } = useMemo(() => {
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

    const map = new Map(); // 'YYYY-MM-DD' -> count
    const set = new Set(); // date.toDateString()

    (allEntries || []).forEach((e) => {
      const d = toDate(e.timestamp);
      if (d) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        map.set(key, (map.get(key) || 0) + 1);
        set.add(d.toDateString());
      }
    });

    return { entriesByDate: map, activeDatesSet: set };
  }, [allEntries]);

  // 1. Mobile 7-day rolling strip calculation
  const weekActivity = useMemo(() => {
    const weekdayInitials = t('home.weekdayInitials', {
      returnObjects: true,
      defaultValue: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    });
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      const mondayFirstIndex = (d.getDay() + 6) % 7; // Sun(0)->6, Mon(1)->0, ... Sat(6)->5
      return {
        label: weekdayInitials[mondayFirstIndex],
        active: activeDatesSet.has(d.toDateString()),
        isToday: i === 6,
      };
    });
    // Mark trailing streak
    for (let i = days.length - 1; i >= 0 && days[i].active; i--) {
      days[i].inStreak = true;
    }
    return days;
  }, [activeDatesSet, now, t]);

  // 2. Desktop/Tablet Month Calculation
  const monthData = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    // Monday-first indexing: Sunday (0) -> 6, Monday (1) -> 0 ... Saturday (6) -> 5
    const firstDayRaw = new Date(viewYear, viewMonth, 1).getDay();
    const startOffset = (firstDayRaw + 6) % 7;

    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    let activeDaysCount = 0;
    let monthEntriesTotal = 0;
    const cells = [];

    // Leading empty cells
    for (let i = 0; i < startOffset; i++) {
      cells.push({ type: 'empty', key: `empty-${i}` });
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const count = entriesByDate.get(dateStr) || 0;
      const isToday = dateStr === todayStr;
      const cellDate = new Date(viewYear, viewMonth, day);
      const isFuture = cellDate > now && !isToday;
      const isActive = count > 0;
      if (isActive) {
        activeDaysCount++;
        monthEntriesTotal += count;
      }

      cells.push({
        type: 'day',
        day,
        dateStr,
        count,
        isActive,
        isToday,
        isFuture,
        key: dateStr,
      });
    }

    const monthName = viewDate.toLocaleDateString(i18n.language, {
      month: 'long',
      year: 'numeric',
    });
    const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();

    return {
      cells,
      daysInMonth,
      activeDaysCount,
      monthEntriesTotal,
      monthName,
      isCurrentMonth,
    };
  }, [viewYear, viewMonth, viewDate, now, entriesByDate, i18n.language]);

  const prevMonth = () => {
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const resetToToday = () => {
    setViewDate(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  // Weekday column header abbreviations (Mon, Tue, Wed, Thu, Fri, Sat, Sun)
  const weekdayHeaders = useMemo(() => {
    const raw = t('journalCalendar.weekdayAbbr', {
      returnObjects: true,
      defaultValue: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    });
    // Reorder from Sun-first to Mon-first: Mon(1), Tue(2), Wed(3), Thu(4), Fri(5), Sat(6), Sun(0)
    if (Array.isArray(raw) && raw.length === 7) {
      return [raw[1], raw[2], raw[3], raw[4], raw[5], raw[6], raw[0]];
    }
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }, [t]);

  // Loading skeleton state
  if (statsLoading) {
    return (
      <div className="home-week home-activity-container is-loading" aria-hidden="true">
        {/* Mobile Skeleton */}
        <div className="home-week-strip home-week-loading">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="home-week-day">
              <span className="home-week-dot is-skeleton" />
              <span className="home-week-label-skeleton skeleton-bar" />
            </div>
          ))}
        </div>

        {/* Desktop / Tablet Skeleton */}
        <div className="home-month-view is-skeleton-view">
          <div className="hmv-header">
            <span className="skeleton-bar hmv-skel-title" />
            <div className="hmv-stats">
              <span className="skeleton-bar hmv-skel-pill" />
            </div>
          </div>
          <div className="hmv-grid">
            <div className="hmv-weekdays-row">
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={`skel-hdr-${i}`} className="skeleton-bar hmv-skel-hdr" />
              ))}
            </div>
            <div className="hmv-cells-grid">
              {Array.from({ length: 35 }).map((_, i) => (
                <span key={`skel-cell-${i}`} className="skeleton-bar hmv-skel-cell" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no entries at all, don't render (maintains original behavior)
  if (totalEntries === 0) return null;

  return (
    <div
      className="home-week home-activity-container"
      aria-label={t('home.weekActivityAriaLabel', 'Your journaling activity')}
    >
      {/* ── 1. Mobile 7-Day Strip (< 768px) ────────────────────────── */}
      <div className="home-week-strip">
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

      {/* ── 2. Desktop & Tablet Monthly Calendar View (>= 768px) ───── */}
      <div className="home-month-view">
        <div className="hmv-header">
          <div className="hmv-title-group">
            <div className="hmv-nav-group">
              <button
                type="button"
                className="hmv-nav-btn"
                onClick={prevMonth}
                aria-label={t('journalCalendar.prevMonth', 'Previous month')}
              >
                <ChevronLeft size={16} />
              </button>
              <h3 className="hmv-title">{monthData.monthName}</h3>
              <button
                type="button"
                className="hmv-nav-btn"
                onClick={nextMonth}
                aria-label={t('journalCalendar.nextMonth', 'Next month')}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {!monthData.isCurrentMonth && (
              <button
                type="button"
                className="hmv-today-chip"
                onClick={resetToToday}
                aria-label={t('home.today', 'Today')}
              >
                <RotateCcw size={12} />
                <span>{t('home.today', 'Today')}</span>
              </button>
            )}
          </div>

          <div className="hmv-stats">
            <div className="hmv-stat-badge">
              <CalendarIcon size={13} className="hmv-badge-icon" />
              <span>
                {monthData.activeDaysCount === 1
                  ? t('journalCalendar.legendOneEntry', '1 active day')
                  : t('journalCalendar.activeDaysCount', '{{count}} active days', { count: monthData.activeDaysCount })}
              </span>
            </div>
            {currentStreak > 0 && (
              <div className="hmv-stat-badge is-streak">
                <Flame size={13} className="hmv-badge-icon streak-flame" />
                <span>{t('home.dayStreakCount', '{{count}} day streak', { count: currentStreak })}</span>
              </div>
            )}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="hmv-grid" role="grid">
          {/* Weekday column headers */}
          <div className="hmv-weekdays-row" role="row">
            {weekdayHeaders.map((dayName, idx) => (
              <div key={idx} className="hmv-weekday-col" role="columnheader">
                {dayName}
              </div>
            ))}
          </div>

          {/* Month day cells */}
          <div className="hmv-cells-grid">
            {monthData.cells.map((cell) => {
              if (cell.type === 'empty') {
                return <div key={cell.key} className="hmv-cell is-empty" aria-hidden="true" />;
              }

              return (
                <div
                  key={cell.key}
                  className={`hmv-cell${cell.isActive ? ' is-active' : ''}${cell.isToday ? ' is-today' : ''}${cell.isFuture ? ' is-future' : ''}`}
                  title={`${cell.dateStr}: ${cell.count > 0 ? `${cell.count} ${cell.count === 1 ? 'entry' : 'entries'}` : 'No entries'}`}
                  role="gridcell"
                >
                  <span className="hmv-cell-day">{cell.day}</span>
                  <span className="hmv-cell-dot" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeActivityCalendar;

