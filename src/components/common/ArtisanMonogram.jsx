import React from 'react';
import '../../styles/components/artisanMonogram.css';

// ===== ARTISAN MONOGRAPH THEMES =====
export const MONOGRAM_THEMES = {
  parchment: {
    name: 'Parchment',
    background: '#F5F1E8',
    textColor: '#2C2C2C',
    accentColor: 'rgba(85, 139, 110, 0.8)' // Default KAIros green accent
  },
  slate: {
    name: 'Slate',
    background: '#2F3640',
    textColor: '#F5F5F5',
    accentColor: 'rgba(142, 197, 252, 0.8)'
  },
  obsidian: {
    name: 'Obsidian',
    background: '#0A0A0A',
    textColor: '#E0E0E0',
    accentColor: 'rgba(255, 255, 255, 0.6)'
  },
  terracotta: {
    name: 'Terracotta',
    background: '#C4623A',
    textColor: '#FFF8F0',
    accentColor: 'rgba(255, 255, 255, 0.5)'
  },
  forest: {
    name: 'Forest',
    background: '#1E3A2F',
    textColor: '#D1E8D5',
    accentColor: 'rgba(85, 139, 110, 0.8)'
  },
  indigo: {
    name: 'Indigo',
    background: '#1A1A2E',
    textColor: '#E2E2E2',
    accentColor: 'rgba(139, 92, 246, 0.8)'
  }
};

const ArtisanMonogram = ({ 
  size = 80, 
  source = null, 
  initials = 'K', 
  theme = 'parchment', 
  pathColor = null, // Pass current path color to override accent
  onClick, 
  className = '' 
}) => {
  const themeData = MONOGRAM_THEMES[theme] || MONOGRAM_THEMES.parchment;
  
  const getInitials = (name) => {
    if (!name || name === 'K') return 'K';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // If the user has an active journey, override the accent stripe with that path's color
  const activeAccent = pathColor ? `rgba(${pathColor}, 0.9)` : themeData.accentColor;

  return (
    <div 
      className={`artisan-monogram ${onClick ? 'artisan-monogram--clickable' : ''} ${className}`}
      style={{ 
        width: size, 
        height: size,
        '--mono-bg': themeData.background,
        '--mono-text': themeData.textColor,
        '--mono-accent': activeAccent
      }}
      onClick={onClick}
    >
      {/* Subtle Noise Texture Overlay */}
      <div className="artisan-monogram__texture" />
      
      {/* Bottom Accent Stripe */}
      <div className="artisan-monogram__accent" />

      {/* Content */}
      <div className="artisan-monogram__content">
        {source ? (
          <img src={source} alt="User Avatar" className="artisan-monogram__image" />
        ) : (
          <span className="artisan-monogram__initials" style={{ fontSize: size * 0.38 }}>
            {getInitials(initials)}
          </span>
        )}
      </div>
    </div>
  );
};

// ===== AVATAR PICKER MODAL =====
export const MonogramPicker = ({ currentTheme, onSelect, onClose, initials }) => {
  const [selectedTheme, setSelectedTheme] = React.useState(currentTheme || 'parchment');

  const handleSave = () => {
    if (onSelect) onSelect(selectedTheme);
    if (onClose) onClose();
  };

  return (
    <div className="mono-picker-overlay" onClick={onClose}>
      <div className="mono-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mono-picker-header">
          <h3>Choose Style</h3>
          <button onClick={onClose} className="mono-picker-close">×</button>
        </div>
        
        <div className="mono-picker-preview">
          <ArtisanMonogram 
            theme={selectedTheme} 
            initials={initials} 
            size={100} 
          />
          <p className="mono-preview-name">
            {MONOGRAM_THEMES[selectedTheme].name}
          </p>
        </div>

        <div className="mono-theme-grid">
          {Object.entries(MONOGRAM_THEMES).map(([key, value]) => (
            <button
              key={key}
              className={`mono-theme-option ${selectedTheme === key ? 'active' : ''}`}
              onClick={() => setSelectedTheme(key)}
            >
              <div 
                className="mono-theme-swatch" 
                style={{ background: value.background, color: value.textColor }}
              >
                {initials ? initials.substring(0,1) : 'K'}
              </div>
              <span>{value.name}</span>
            </button>
          ))}
        </div>

        <button className="mono-picker-save" onClick={handleSave}>
          Apply Style
        </button>
      </div>
    </div>
  );
};

export default ArtisanMonogram;