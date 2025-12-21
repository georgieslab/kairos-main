// src/components/common/Avatar.jsx

import React from 'react';
import '../../styles/components/avatar.css';

const AVATAR_FONTS = {
  sans: {
    name: 'Sans Serif',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    weight: '600'
  },
  serif: {
    name: 'Serif',
    fontFamily: 'Georgia, "Times New Roman", serif',
    weight: '600'
  },
  mono: {
    name: 'Monospace',
    fontFamily: '"Courier New", Courier, monospace',
    weight: '700'
  },
  rounded: {
    name: 'Rounded',
    fontFamily: 'ui-rounded, "SF Pro Rounded", system-ui, sans-serif',
    weight: '700'
  },
  display: {
    name: 'Display',
    fontFamily: 'Impact, "Arial Black", sans-serif',
    weight: '700'
  },
  elegant: {
    name: 'Elegant',
    fontFamily: '"Palatino Linotype", Palatino, serif',
    weight: '600'
  }
};

const AVATAR_STYLES = {
  forest: {
    name: 'Forest',
    background: 'linear-gradient(135deg, #2d5016 0%, #558B6E 50%, #7BA888 100%)',
    primaryColor: '#2d5016',
    secondaryColor: '#7BA888',
    accentColor: '#F5F5F0',
    patternColor: '#ffffff'
  },
  sunset: {
    name: 'Sunset',
    background: 'linear-gradient(135deg, #E85D04 0%, #F48C06 50%, #FAA307 100%)',
    primaryColor: '#E85D04',
    secondaryColor: '#FAA307',
    accentColor: '#FFFFFF',
    patternColor: '#FFE5CC'
  },
  ocean: {
    name: 'Ocean',
    background: 'linear-gradient(135deg, #023E8A 0%, #0077B6 50%, #00B4D8 100%)',
    primaryColor: '#023E8A',
    secondaryColor: '#00B4D8',
    accentColor: '#FFFFFF',
    patternColor: '#CAF0F8'
  },
  lavender: {
    name: 'Lavender',
    background: 'linear-gradient(135deg, #6A4C93 0%, #8B5FBF 50%, #B185DB 100%)',
    primaryColor: '#6A4C93',
    secondaryColor: '#B185DB',
    accentColor: '#FFFFFF',
    patternColor: '#E5D4FF'
  },
  amber: {
    name: 'Amber',
    background: 'linear-gradient(135deg, #D4A574 0%, #E6B89C 50%, #F2D3BC 100%)',
    primaryColor: '#D4A574',
    secondaryColor: '#F2D3BC',
    accentColor: '#3D3522',
    patternColor: '#FFF8F0'
  },
  sage: {
    name: 'Sage',
    background: 'linear-gradient(135deg, #5F7A61 0%, #8C9B7C 50%, #A8B89B 100%)',
    primaryColor: '#5F7A61',
    secondaryColor: '#A8B89B',
    accentColor: '#FFFFFF',
    patternColor: '#E8F0E6'
  }
};

const AVATAR_PATTERNS = {
  dots: (colors) => (
    <g>
      <circle cx="16" cy="16" r="4" fill={colors.patternColor} opacity="0.7" />
      <circle cx="48" cy="16" r="4" fill={colors.patternColor} opacity="0.6" />
      <circle cx="32" cy="24" r="3.5" fill={colors.patternColor} opacity="0.8" />
      <circle cx="20" cy="36" r="4.5" fill={colors.patternColor} opacity="0.65" />
      <circle cx="44" cy="36" r="3" fill={colors.patternColor} opacity="0.75" />
      <circle cx="16" cy="48" r="3.5" fill={colors.patternColor} opacity="0.7" />
      <circle cx="48" cy="48" r="4" fill={colors.patternColor} opacity="0.6" />
      <circle cx="32" cy="52" r="3" fill={colors.patternColor} opacity="0.8" />
    </g>
  ),
  waves: (colors) => (
    <g>
      <path
        d="M0 24 Q 16 18, 32 24 T 64 24"
        stroke={colors.patternColor}
        strokeWidth="3"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M0 36 Q 16 30, 32 36 T 64 36"
        stroke={colors.patternColor}
        strokeWidth="3"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M0 48 Q 16 42, 32 48 T 64 48"
        stroke={colors.patternColor}
        strokeWidth="3"
        fill="none"
        opacity="0.5"
      />
    </g>
  ),
  circles: (colors) => (
    <g>
      <circle cx="32" cy="32" r="18" fill="none" stroke={colors.patternColor} strokeWidth="2.5" opacity="0.6" />
      <circle cx="32" cy="32" r="24" fill="none" stroke={colors.patternColor} strokeWidth="2" opacity="0.5" />
      <circle cx="32" cy="32" r="12" fill="none" stroke={colors.patternColor} strokeWidth="2" opacity="0.7" />
    </g>
  ),
  geometric: (colors) => (
    <g>
      <polygon points="32,12 50,26 44,46 20,46 14,26" fill={colors.patternColor} opacity="0.5" />
      <polygon points="32,20 42,30 38,44 26,44 22,30" fill={colors.patternColor} opacity="0.6" />
      <rect x="28" y="28" width="8" height="8" fill={colors.patternColor} opacity="0.7" />
    </g>
  ),
  sparkles: (colors) => (
    <g>
      <path d="M20 16 L22 20 L26 22 L22 24 L20 28 L18 24 L14 22 L18 20 Z" fill={colors.patternColor} opacity="0.8" />
      <path d="M48 20 L50 24 L54 26 L50 28 L48 32 L46 28 L42 26 L46 24 Z" fill={colors.patternColor} opacity="0.7" />
      <path d="M16 44 L18 48 L22 50 L18 52 L16 56 L14 52 L10 50 L14 48 Z" fill={colors.patternColor} opacity="0.65" />
      <path d="M50 48 L52 52 L56 54 L52 56 L50 60 L48 56 L44 54 L48 52 Z" fill={colors.patternColor} opacity="0.75" />
      <path d="M32 40 L33 42 L35 43 L33 44 L32 46 L31 44 L29 43 L31 42 Z" fill={colors.patternColor} opacity="0.9" />
    </g>
  ),
  none: () => null
};

const Avatar = ({ 
  style = 'forest', 
  pattern = 'dots',
  font = 'sans',
  initials = 'K', 
  size = 80,
  className = '',
  onClick = null
}) => {
  const avatarStyle = AVATAR_STYLES[style] || AVATAR_STYLES.forest;
  const PatternComponent = AVATAR_PATTERNS[pattern] || AVATAR_PATTERNS.dots;
  const fontStyle = AVATAR_FONTS[font] || AVATAR_FONTS.sans;
  
  const fontSize = size * 0.35;
  const strokeWidth = size * 0.03;

  return (
    <div 
      className={`avatar-wrapper ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        className="avatar-svg"
      >
        <defs>
          <linearGradient id={`gradient-${style}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={avatarStyle.primaryColor} />
            <stop offset="100%" stopColor={avatarStyle.secondaryColor} />
          </linearGradient>
          
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3"/>
          </filter>
        </defs>
        
        {/* Background Circle */}
        <circle
          cx="32"
          cy="32"
          r="30"
          fill={`url(#gradient-${style})`}
          filter="url(#shadow)"
        />
        
        {/* Pattern Overlay */}
        {PatternComponent(avatarStyle)}
        
        {/* Initials */}
        <text
          x="32"
          y="32"
          textAnchor="middle"
          dominantBaseline="central"
          fill={avatarStyle.accentColor}
          fontSize={fontSize}
          fontWeight={fontStyle.weight}
          fontFamily={fontStyle.fontFamily}
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
        >
          {initials}
        </text>
        
        {/* Outer Ring */}
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="none"
          stroke={avatarStyle.accentColor}
          strokeWidth={strokeWidth}
          opacity="0.4"
        />
      </svg>
    </div>
  );
};

export const AvatarPicker = ({ currentStyle, currentPattern, currentFont, onSelect, initials }) => {
  const [selectedStyle, setSelectedStyle] = React.useState(currentStyle || 'forest');
  const [selectedPattern, setSelectedPattern] = React.useState(currentPattern || 'dots');
  const [selectedFont, setSelectedFont] = React.useState(currentFont || 'sans');

  const handleSave = () => {
    if (onSelect) {
      onSelect({ style: selectedStyle, pattern: selectedPattern, font: selectedFont });
    }
  };

  return (
    <div className="avatar-picker">
      <div className="avatar-picker-preview">
        <h3>Preview</h3>
        <Avatar 
          style={selectedStyle} 
          pattern={selectedPattern}
          font={selectedFont}
          initials={initials}
          size={120}
        />
      </div>

      <div className="avatar-picker-section">
        <h3>Choose Color Theme</h3>
        <div className="avatar-style-grid">
          {Object.entries(AVATAR_STYLES).map(([key, value]) => (
            <button
              key={key}
              className={`avatar-style-option ${selectedStyle === key ? 'selected' : ''}`}
              onClick={() => setSelectedStyle(key)}
            >
              <div 
                className="avatar-style-preview"
                style={{ background: value.background }}
              />
              <span>{value.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="avatar-picker-section">
        <h3>Choose Pattern</h3>
        <div className="avatar-pattern-grid">
          {Object.entries(AVATAR_PATTERNS).map(([key, _]) => (
            <button
              key={key}
              className={`avatar-pattern-option ${selectedPattern === key ? 'selected' : ''}`}
              onClick={() => setSelectedPattern(key)}
            >
              <Avatar 
                style={selectedStyle} 
                pattern={key}
                font={selectedFont}
                initials={initials}
                size={60}
              />
              <span className="avatar-pattern-name">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="avatar-picker-section">
        <h3>Choose Font Style</h3>
        <div className="avatar-font-grid">
          {Object.entries(AVATAR_FONTS).map(([key, value]) => (
            <button
              key={key}
              className={`avatar-font-option ${selectedFont === key ? 'selected' : ''}`}
              onClick={() => setSelectedFont(key)}
            >
              <Avatar 
                style={selectedStyle} 
                pattern={selectedPattern}
                font={key}
                initials={initials}
                size={60}
              />
              <span className="avatar-font-name">{value.name}</span>
            </button>
          ))}
        </div>
      </div>

      <button className="avatar-picker-save-btn" onClick={handleSave}>
        Save Avatar
      </button>
    </div>
  );
};

export { AVATAR_FONTS, AVATAR_STYLES, AVATAR_PATTERNS };
export default Avatar;
