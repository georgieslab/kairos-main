// src/constants/moods.js
// Single source of truth for the "Inner Aura" daily check-in — the mood id is
// exactly what gets written to users/{uid}/moods/{date}.mood in Firestore, so
// every consumer (MoodWeather, MoodTrends, exportService's PDF glyphs,
// claudeService's AI context, and the i18n `innerAura.*` translation keys)
// must use these ids verbatim.

import { Moon, Feather, Sparkles, Star, Flame } from 'lucide-react';

export const MOODS = [
  { id: 'lunar',    icon: Moon,     color: '129, 140, 248' }, // Indigo
  { id: 'ethereal', icon: Feather,  color: '56, 189, 248'  }, // Sky Blue
  { id: 'sparkle',  icon: Sparkles, color: '192, 132, 252' }, // Violet
  { id: 'radiant',  icon: Star,     color: '251, 191, 36'  }, // Amber
  { id: 'ember',    icon: Flame,    color: '251, 113, 133' }  // Rose
];
