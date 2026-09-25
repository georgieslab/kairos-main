// src/components/common/HomeActivityCalendar.jsx
//
// 7-day rolling activity strip on the Home screen.
// Consistent compact spatial glass tile across all screen sizes (mobile, tablet, desktop).

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/homeActivityCalendar.css';

const HomeActivityCalendar = ({
  allEntries = [],
  totalEntries = 0,
  currentStreak = 0,
  pathColor = '85, 139, 110',
  statsLoading = false,
}) => {
  const { t } = useTranslation(['journey', 'analytics']);
  const now = useMemo(() => new Date(), []);

  // Parse all entries into a set of active date strings for fast O(1) lookup
  const activeDatesSet = useMemo(() => {
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

    const set = new Set();
    (allEntries || []).forEach((e) => {
      const d = toDate(e?.timestamp);
      if (d) set.add(d.toDateString());
    });

    return set;
  }, [allEntries]);

  // 7-day rolling strip calculation (Monday-first)
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

  // Loading skeleton state
  if (statsLoading) {
    return (
      <div className="home-week home-activity-container is-loading" aria-hidden="true">
        <div className="home-week-strip home-week-loading">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="home-week-day">
              <span className="home-week-dot is-skeleton" />
              <span className="home-week-label-skeleton skeleton-bar" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // If no entries at all, don't render
  if (totalEntries === 0) return null;

  return (
    <div
      className="home-week home-activity-container"
      aria-label={t('home.weekActivityAriaLabel', 'Your journaling activity')}
    >
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
    </div>
  );
};

export default HomeActivityCalendar;
