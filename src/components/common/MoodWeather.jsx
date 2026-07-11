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

  const selected = AURAS.find((m) => m.id === mood);
  const moodLabel = (id) => t(`innerAura.${id}`, id);

  return (
    <section
      className={`mood-weather ${isLoading ? 'is-loading' : ''}`}
      aria-label={t('innerAura.title', "Today's inner aura")}
    >
      <div className="mood-weather-text">
        <span className="mood-weather-title">{t('innerAura.title', "Today's inner aura")}</span>
        <span className="mood-weather-subtitle">
          {selected
            ? moodLabel(selected.id)
            : t('innerAura.prompt', 'What is your magic like today?')}
        </span>
      </div>
      <div className="mood-weather-options" role="radiogroup" aria-label={t('innerAura.prompt', 'What is your magic like today?')}>
        {AURAS.map(({ id, icon: Icon, color }) => (
          <button
            key={id}
            className={`mood-weather-option${mood === id ? ' is-selected' : ''}`}
            style={{ '--mood-color': color }}
            onClick={() => pickMood(id)}
            disabled={isLoading}
            role="radio"
            aria-checked={mood === id}
            aria-label={moodLabel(id)}
            title={moodLabel(id)}
          >
            <Icon size={18} />
          </button>
        ))}
      </div>
    </section>
  );
};

export default MoodWeather;