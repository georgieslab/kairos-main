// src/components/common/MoodWeather.jsx
// "Inner Aura" — a one-tap daily magical check-in.
// Stored per-day at users/{uid}/moods/{YYYY-MM-DD}.

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { MOODS as AURAS } from '../../constants/moods';
import '../../styles/components/moodWeather.css';

const localDateKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const MoodWeather = () => {
  const { t } = useTranslation('journey');
  const { currentUser } = useAuth();
  const [mood, setMood] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;

    const loadTodaysMood = async () => {
      try {
        const moodRef = doc(db, 'users', currentUser.uid, 'moods', localDateKey());
        const snap = await getDoc(moodRef);
        if (!cancelled && snap.exists()) setMood(snap.data().mood || null);
      } catch (error) {
        console.error('Error loading today\'s aura:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadTodaysMood();
    return () => { cancelled = true; };
  }, [currentUser]);

  const pickMood = async (moodId) => {
    if (!currentUser || isSaving) return;
    const previous = mood;
    setMood(moodId); 
    setIsSaving(true);
    try {
      const moodRef = doc(db, 'users', currentUser.uid, 'moods', localDateKey());
      await setDoc(moodRef, {
        mood: moodId,
        date: localDateKey(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error saving aura:', error);
      setMood(previous);
    } finally {
      setIsSaving(false);
    }
  };

  const moodName = (id) => t(`innerAura.${id}`, id);
  const moodShort = (id) => t(`innerAura.${id}Short`, moodName(id));
  const moodFeeling = (id) => t(`innerAura.${id}Feeling`, moodName(id));
  // Full label pairs the poetic name with a plain-language feeling so it reads
  // clearly for a first-time user, e.g. "Lunar — Calm & reflective".
  const moodLabel = (id) => `${moodName(id)} — ${moodFeeling(id)}`;

  // The subtitle previews whichever aura the user is pointing at / focusing,
  // then settles on their pick — so the meaning is discoverable before tapping.
  const activeId = hovered || mood;
  // The active aura's colour accents the descriptive text (not the whole card).
  const activeColor = AURAS.find((m) => m.id === activeId)?.color || null;
  // Once an aura is chosen, the whole container takes on its colour glow.
  const selectedColor = AURAS.find((m) => m.id === mood)?.color || null;

  return (
    <section
      className={`mood-weather ${isLoading ? 'is-loading' : ''}${mood ? ' has-aura' : ''}`}
      style={selectedColor ? { '--aura-color': selectedColor } : undefined}
      aria-label={t('innerAura.title', "Today's inner aura")}
    >
      <div className="mood-weather-text">
        <span className="mood-weather-title">{t('innerAura.title', "Today's inner aura")}</span>
        <span
          className="mood-weather-subtitle"
          style={activeColor ? { color: `rgb(${activeColor})` } : undefined}
        >
          {activeId
            ? moodLabel(activeId)
            : t('innerAura.prompt', 'How does today feel?')}
        </span>
      </div>
      <div className="mood-weather-options" role="radiogroup" aria-label={t('innerAura.prompt', 'How does today feel?')}>
        {AURAS.map(({ id, icon: Icon, color }) => (
          <div key={id} className="mood-weather-cell" style={{ '--mood-color': color }}>
            <button
              className={`mood-weather-option${mood === id ? ' is-selected' : ''}`}
              onClick={() => pickMood(id)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(id)}
              onBlur={() => setHovered(null)}
              disabled={isLoading}
              role="radio"
              aria-checked={mood === id}
              aria-label={moodLabel(id)}
              title={moodLabel(id)}
            >
              <Icon size={18} />
            </button>
            <span className={`mood-weather-caption${mood === id ? ' is-selected' : ''}`}>
              {moodShort(id)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MoodWeather;