// src/components/common/AmbientBackground.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/components/ambientBackground.css';

const AmbientBackground = () => {
  const { isDarkMode } = useTheme();
  const [timeOfDay, setTimeOfDay] = useState('morning');
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 17) setTimeOfDay('afternoon');
    else if (hour >= 17 && hour < 21) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);

  // Color palettes for each time of day (dark theme — dark gradient middle)
  const darkPalettes = {
    morning: {
      gradient: 'linear-gradient(135deg, rgba(251, 191, 36, 0.06) 0%, rgba(28, 28, 30, 0.95) 50%, rgba(245, 158, 11, 0.04) 100%)',
      orb1: 'rgba(251, 191, 36, 0.25)',
      orb2: 'rgba(245, 158, 11, 0.2)',
      orb3: 'rgba(234, 179, 8, 0.15)'
    },
    afternoon: {
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(28, 28, 30, 0.98) 50%, rgba(6, 182, 212, 0.06) 100%)',
      orb1: 'rgba(59, 130, 246, 0.2)',
      orb2: 'rgba(6, 182, 212, 0.15)',
      orb3: 'rgba(59, 130, 246, 0.1)'
    },
    evening: {
      gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.06) 0%, rgba(28, 28, 30, 0.98) 50%, rgba(236, 72, 153, 0.06) 100%)',
      orb1: 'rgba(168, 85, 247, 0.2)',
      orb2: 'rgba(236, 72, 153, 0.15)',
      orb3: 'rgba(168, 85, 247, 0.1)'
    },
    night: {
      gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(15, 15, 20, 0.98) 50%, rgba(55, 48, 163, 0.06) 100%)',
      orb1: 'rgba(99, 102, 241, 0.2)',
      orb2: 'rgba(55, 48, 163, 0.15)',
      orb3: 'rgba(99, 102, 241, 0.1)'
    }
  };

  // Light theme — light gradient middle so transparent screens (e.g. Paths)
  // get a clean light backdrop with a soft time-of-day tint.
  const lightPalettes = {
    morning: {
      gradient: 'linear-gradient(135deg, rgba(251, 191, 36, 0.14) 0%, #f5f6f8 55%, rgba(245, 158, 11, 0.1) 100%)',
      orb1: 'rgba(251, 191, 36, 0.2)',
      orb2: 'rgba(245, 158, 11, 0.15)',
      orb3: 'rgba(234, 179, 8, 0.12)'
    },
    afternoon: {
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, #f5f6f8 55%, rgba(6, 182, 212, 0.12) 100%)',
      orb1: 'rgba(59, 130, 246, 0.18)',
      orb2: 'rgba(6, 182, 212, 0.14)',
      orb3: 'rgba(59, 130, 246, 0.1)'
    },
    evening: {
      gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.14) 0%, #f5f6f8 55%, rgba(236, 72, 153, 0.12) 100%)',
      orb1: 'rgba(168, 85, 247, 0.18)',
      orb2: 'rgba(236, 72, 153, 0.14)',
      orb3: 'rgba(168, 85, 247, 0.1)'
    },
    night: {
      gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.14) 0%, #eef0f4 55%, rgba(55, 48, 163, 0.1) 100%)',
      orb1: 'rgba(99, 102, 241, 0.18)',
      orb2: 'rgba(55, 48, 163, 0.14)',
      orb3: 'rgba(99, 102, 241, 0.1)'
    }
  };

  const palette = (isDarkMode ? darkPalettes : lightPalettes)[timeOfDay];

  return (
    <div className={`ambient-bg ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="ambient-gradient" style={{ background: palette.gradient }} />
      
      {/* Orb 1 - Top Right */}
      <div className="ambient-orb ambient-orb-1" style={{ background: palette.orb1 }} />
      
      {/* Orb 2 - Bottom Left */}
      <div className="ambient-orb ambient-orb-2" style={{ background: palette.orb2 }} />
      
      {/* Orb 3 - Center */}
      <div className="ambient-orb ambient-orb-3" style={{ background: palette.orb3 }} />
    </div>
  );
};

export default AmbientBackground;