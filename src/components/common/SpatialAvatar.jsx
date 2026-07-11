import React from 'react';
import '../../styles/components/spatialAvatar.css';

// ===== SPATIAL AURA THEMES =====
export const AVATAR_THEMES = {
  aurora: {
    name: 'Aurora',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 50%, #4facfe 100%)',
    glow: 'rgba(67, 233, 123, 0.6)'
  },
  violet: {
    name: 'Violet',
    gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 50%, #8e44ad 100%)',
    glow: 'rgba(142, 68, 173, 0.6)'
  },
  solar: {
    name: 'Solar',
    gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 50%, #f5576c 100%)',
    glow: 'rgba(245, 87, 108, 0.6)'
  },
  frost: {
    name: 'Frost',
    gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 50%, #ffffff 100%)',
    glow: 'rgba(142, 197, 252, 0.6)'
  },
  obsidian: {
    name: 'Obsidian',
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 50%, #000000 100%)',
    glow: 'rgba(76, 161, 175, 0.6)'
  }
};

// ===== MAIN SPATIAL AVATAR COMPONENT =====
const SpatialAvatar = ({ 
  size = 80, 
  source = null, 
  initials = 'K', 
  theme = 'aurora', 
  onClick, 
  className = '' 
}) => {
  const themeData = AVATAR_THEMES[theme] || AVATAR_THEMES.aurora;
  
  const getInitials = (name) => {
    if (!name || name === 'K') return 'K';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div 
      className={`spatial-avatar ${onClick ? 'spatial-avatar--clickable' : ''} ${className}`}
      style={{ 
        width: size, 
        height: size,
        '--avatar-gradient': themeData.gradient,
        '--avatar-glow': themeData.glow
      }}
      onClick={onClick}
    >
      {/* Outer ambient glow */}
      <div className="spatial-avatar__glow" />
      
      {/* Glass Ring */}
      <div className="spatial-avatar__ring" />
      
      {/* Inner Content */}
      <div className="spatial-avatar__content">
        {source ? (
          <img src={source} alt="User Avatar" className="spatial-avatar__image" />
        ) : (
          <span className="spatial-avatar__initials" style={{ fontSize: size * 0.35 }}>
            {getInitials(initials)}
          </span>
        )}
      </div>

      {/* Glass Shine Sweep */}
      <div className="spatial-avatar__shine" />
    </div>
  );
};

// ===== AVATAR PICKER MODAL =====
export const SpatialAvatarPicker = ({ currentTheme, onSelect, onClose, initials }) => {
  const [selectedTheme, setSelectedTheme] = React.useState(currentTheme || 'aurora');

  const handleSave = () => {
    if (onSelect) onSelect(selectedTheme);
    if (onClose) onClose();
  };

  return (
    <div className="avatar-picker-overlay" onClick={onClose}>
      <div className="avatar-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="avatar-picker-header">
          <h3>Choose Aura</h3>
          <button onClick={onClose} className="avatar-picker-close">×</button>
        </div>
        
        <div className="avatar-picker-preview">
          <SpatialAvatar 
            theme={selectedTheme} 
            initials={initials} 
            size={120} 
          />
          <p className="avatar-preview-name">
            {AVATAR_THEMES[selectedTheme].name} Aura
          </p>
        </div>

        <div className="avatar-theme-grid">
          {Object.entries(AVATAR_THEMES).map(([key, value]) => (
            <button
              key={key}
              className={`avatar-theme-option ${selectedTheme === key ? 'active' : ''}`}
              onClick={() => setSelectedTheme(key)}
            >
              <div 
                className="avatar-theme-swatch" 
                style={{ background: value.gradient, boxShadow: `0 0 15px ${value.glow}` }}
              />
              <span>{value.name}</span>
            </button>
          ))}
        </div>

        <button className="avatar-picker-save" onClick={handleSave}>
          Apply Aura
        </button>
      </div>
    </div>
  );
};

export default SpatialAvatar;