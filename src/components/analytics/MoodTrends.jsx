// src/components/analytics/MoodTrends.jsx
// 14-day "inner aura" strip for the Insights dashboard — reads the daily
// mood check-ins written by MoodWeather.jsx (users/{uid}/moods/{YYYY-MM-DD}).

import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CircleDashed } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { MOODS } from '../../constants/moods';
import '../../styles/components/moodWeather.css';

const DAYS_SHOWN = 14;

const dateKeyFor = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return {
    key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    dayOfMonth: d.getDate(),
    isToday: offsetDays === 0
  };
};

// `moods` defaults to the shared constant so this works whether the caller
// passes it explicitly (ProfileScreen) or not (JournalAnalyticsDashboard).
const MoodTrends = ({ moods = MOODS }) => {
  const { t, i18n } = useTranslation('analytics');
  const { currentUser } = useAuth();
  const [moodsByDate, setMoodsByDate] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const moodMeta = useMemo(() => {
    const map = {};
    moods.forEach((m) => { map[m.id] = m; });
    return map;
  }, [moods]);

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;

    const loadMoods = async () => {
      try {
        const snap = await getDocs(collection(db, 'users', currentUser.uid, 'moods'));
        if (cancelled) return;
        const byDate = {};
        snap.forEach((docSnap) => {
          const data = docSnap.data();
          if (data?.mood && moodMeta[data.mood]) byDate[docSnap.id] = data.mood;
        });
        setMoodsByDate(byDate);
      } catch (error) {
        console.error('Error loading mood history:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadMoods();
    return () => { cancelled = true; };
  }, [currentUser]);

  // Last 14 days, oldest → today
  const days = useMemo(() => {
    return Array.from({ length: DAYS_SHOWN }, (_, i) => {
      const { key, dayOfMonth, isToday } = dateKeyFor(DAYS_SHOWN - 1 - i);
      return { key, dayOfMonth, isToday, mood: moodsByDate[key] || null };
    });
  }, [moodsByDate]);

  const checkedInDays = days.filter((d) => d.mood);

  // Most frequent mood across the window (ties resolved by first-seen order)
  const dominantMood = useMemo(() => {
    if (checkedInDays.length === 0) return null;
    const counts = {};
    checkedInDays.forEach((d) => { counts[d.mood] = (counts[d.mood] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }, [checkedInDays]);

  const moodLabel = (id) => t(`journey:innerAura.${id}`, id);

  if (isLoading) {
    return (
      <div className="mood-trends mood-trends-loading" aria-hidden="true">
        {Array.from({ length: DAYS_SHOWN }).map((_, i) => (
          <span key={i} className="mood-trends-skeleton-dot" />
        ))}
      </div>
    );
  }

  if (checkedInDays.length === 0) {
    return (
      <p className="mood-trends-empty">
        {t('moodTrends.emptyState', 'No check-ins yet — tap your inner aura on the Home screen to start tracking.')}
      </p>
    );
  }

  return (
    <div className="mood-trends">
      <div className="mood-trends-strip" role="img" aria-label={t('moodTrends.stripAriaLabel', 'Your inner aura over the last {{days}} days', { days: DAYS_SHOWN })}>
        {days.map(({ key, dayOfMonth, isToday, mood }) => {
          const meta = mood ? moodMeta[mood] : null;
          const Icon = meta ? meta.icon : CircleDashed;
          return (
            <div
              key={key}
              className={`mood-trends-day${isToday ? ' is-today' : ''}${mood ? ' has-mood' : ''}`}
              style={meta ? { '--mood-color': meta.color } : undefined}
              title={mood ? `${dayOfMonth}. — ${moodLabel(mood)}` : undefined}
            >
              <Icon size={16} />
              <span className="mood-trends-day-label">{dayOfMonth}</span>
            </div>
          );
        })}
      </div>

      {dominantMood && (
        <p className="mood-trends-summary">
          {t('moodTrends.summary', 'Mostly {{mood}} — {{count}} check-ins in the last {{days}} days.', {
            mood: moodLabel(dominantMood),
            count: checkedInDays.length,
            days: DAYS_SHOWN
          })}
        </p>
      )}
    </div>
  );
};

export default MoodTrends;
