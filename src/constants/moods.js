// src/constants/moods.js
// Single source of truth for the "Inner Aura" daily check-in — the mood id is
// exactly what gets written to users/{uid}/moods/{date}.mood in Firestore, so
// every consumer (MoodWeather, MoodTrends, exportService's PDF glyphs,
// claudeService's AI context, and the i18n `innerAura.*` translation keys)
// must use these ids verbatim.

import { Moon, Feather, Sparkles, Star, Flame } from 'lucide-react';

export const MOODS = [
  { 
    id: 'lunar',    
    icon: Moon,     
    color: '129, 140, 248', // Indigo
    secondaryColor: '99, 102, 241', // Deep Indigo
    accentColor: '199, 210, 254'    // Soft Periwinkle
  },
  { 
    id: 'ethereal', 
    icon: Feather,  
    color: '56, 189, 248',  // Sky Blue
    secondaryColor: '45, 212, 191', // Aquamarine / Teal
    accentColor: '186, 230, 253'    // Celestial Ice
  },
  { 
    id: 'sparkle',  
    icon: Sparkles, 
    color: '192, 132, 252', // Violet
    secondaryColor: '244, 114, 182', // Pink Rose
    accentColor: '245, 208, 254'    // Ethereal Lavender
  },
  { 
    id: 'radiant',  
    icon: Star,     
    color: '251, 191, 36',  // Amber
    secondaryColor: '245, 158, 11', // Solar Gold
    accentColor: '254, 240, 138'    // Sunbeam
  },
  { 
    id: 'ember',    
    icon: Flame,    
    color: '251, 113, 133', // Rose Coral
    secondaryColor: '249, 115, 22', // Hearth Flame
    accentColor: '254, 205, 211'    // Warm Spark
  }
];
