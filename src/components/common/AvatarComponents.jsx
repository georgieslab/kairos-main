// src/components/common/AvatarComponents.jsx - SHARED AVATAR SYSTEM

import React from 'react';

// 🎨 COMPLETE AVATAR COLLECTION - 9 Different SVG Art Styles
export const PROFILE_AVATARS = {
  'geometric-1': {
    id: 'geometric-1',
    name: 'Geometric Circles',
    component: (props) => (
      <svg viewBox="0 0 100 100" className="profile-avatar-svg" {...props}>
        <defs>
          <linearGradient id="grad-geo1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="40" fill="url(#grad-geo1)" />
        <circle cx="35" cy="35" r="15" fill="#f093fb" opacity="0.8" />
        <circle cx="65" cy="35" r="10" fill="#f5f7fa" opacity="0.6" />
        <circle cx="50" cy="65" r="12" fill="#c471ed" opacity="0.7" />
      </svg>
    )
  },
  
  'abstract-1': {
    id: 'abstract-1',
    name: 'Abstract Waves',
    component: (props) => (
      <svg viewBox="0 0 100 100" className="profile-avatar-svg" {...props}>
        <defs>
          <linearGradient id="grad-abs1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#11998e" />
            <stop offset="100%" stopColor="#38ef7d" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#grad-abs1)" rx="20" />
        <path d="M0,50 Q25,20 50,50 T100,50 V100 H0 Z" fill="#fff" opacity="0.3" />
        <path d="M0,70 Q25,40 50,70 T100,70 V100 H0 Z" fill="#fff" opacity="0.2" />
      </svg>
    )
  },
  
  'minimal-1': {
    id: 'minimal-1',
    name: 'Minimal Face',
    component: (props) => (
      <svg viewBox="0 0 100 100" className="profile-avatar-svg" {...props}>
        <defs>
          <linearGradient id="grad-min1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffecd2" />
            <stop offset="100%" stopColor="#fcb69f" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#grad-min1)" />
        <circle cx="35" cy="40" r="3" fill="#333" />
        <circle cx="65" cy="40" r="3" fill="#333" />
        <path d="M35,65 Q50,75 65,65" stroke="#333" strokeWidth="2" fill="none" />
      </svg>
    )
  },
  
  'nature-1': {
    id: 'nature-1',
    name: 'Nature Leaf',
    component: (props) => (
      <svg viewBox="0 0 100 100" className="profile-avatar-svg" {...props}>
        <defs>
          <linearGradient id="grad-nat1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#56ab2f" />
            <stop offset="100%" stopColor="#a8e6cf" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#grad-nat1)" />
        <path d="M30,30 Q50,10 70,30 Q60,50 50,70 Q40,50 30,30" fill="#fff" opacity="0.8" />
        <path d="M50,30 L50,70" stroke="#56ab2f" strokeWidth="2" />
      </svg>
    )
  },
  
  'cosmic-1': {
    id: 'cosmic-1',
    name: 'Cosmic Space',
    component: (props) => (
      <svg viewBox="0 0 100 100" className="profile-avatar-svg" {...props}>
        <defs>
          <radialGradient id="grad-cos1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#grad-cos1)" />
        <circle cx="30" cy="25" r="2" fill="#fff" opacity="0.9" />
        <circle cx="70" cy="30" r="1.5" fill="#fff" opacity="0.7" />
        <circle cx="25" cy="60" r="1" fill="#fff" opacity="0.8" />
        <circle cx="75" cy="70" r="2.5" fill="#fff" opacity="0.6" />
        <circle cx="60" cy="20" r="1" fill="#fff" opacity="0.9" />
        <circle cx="40" cy="75" r="1.5" fill="#fff" opacity="0.7" />
      </svg>
    )
  },
  
  'artistic-1': {
    id: 'artistic-1',
    name: 'Artistic Brush',
    component: (props) => (
      <svg viewBox="0 0 100 100" className="profile-avatar-svg" {...props}>
        <defs>
          <linearGradient id="grad-art1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f093fb" />
            <stop offset="100%" stopColor="#f5576c" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#grad-art1)" rx="20" />
        <path d="M20,80 Q40,20 60,40 Q80,20 90,60" stroke="#fff" strokeWidth="6" fill="none" opacity="0.8" />
        <path d="M10,40 Q30,60 50,30 Q70,50 90,30" stroke="#fff" strokeWidth="4" fill="none" opacity="0.6" />
      </svg>
    )
  },
  
  'tech-1': {
    id: 'tech-1',
    name: 'Tech Circuit',
    component: (props) => (
      <svg viewBox="0 0 100 100" className="profile-avatar-svg" {...props}>
        <defs>
          <linearGradient id="grad-tech1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4facfe" />
            <stop offset="100%" stopColor="#00f2fe" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#grad-tech1)" rx="15" />
        <rect x="20" y="20" width="60" height="60" fill="none" stroke="#fff" strokeWidth="2" opacity="0.7" />
        <rect x="30" y="30" width="20" height="20" fill="#fff" opacity="0.6" />
        <rect x="55" y="30" width="15" height="15" fill="#fff" opacity="0.5" />
        <rect x="30" y="55" width="15" height="15" fill="#fff" opacity="0.5" />
        <rect x="50" y="50" width="20" height="20" fill="#fff" opacity="0.6" />
      </svg>
    )
  },
  
  'floral-1': {
    id: 'floral-1',
    name: 'Floral Pattern',
    component: (props) => (
      <svg viewBox="0 0 100 100" className="profile-avatar-svg" {...props}>
        <defs>
          <linearGradient id="grad-flor1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffecd2" />
            <stop offset="100%" stopColor="#fcb69f" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#grad-flor1)" />
        <circle cx="50" cy="30" r="8" fill="#ff6b6b" opacity="0.8" />
        <circle cx="30" cy="50" r="8" fill="#4ecdc4" opacity="0.8" />
        <circle cx="70" cy="50" r="8" fill="#45b7d1" opacity="0.8" />
        <circle cx="50" cy="70" r="8" fill="#96ceb4" opacity="0.8" />
        <circle cx="50" cy="50" r="5" fill="#ffeaa7" opacity="0.9" />
      </svg>
    )
  },
  
  'sunset-1': {
    id: 'sunset-1',
    name: 'Sunset Gradient',
    component: (props) => (
      <svg viewBox="0 0 100 100" className="profile-avatar-svg" {...props}>
        <defs>
          <linearGradient id="grad-sun1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff9a9e" />
            <stop offset="50%" stopColor="#fecfef" />
            <stop offset="100%" stopColor="#fecfef" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="url(#grad-sun1)" />
        <circle cx="50" cy="30" r="15" fill="#fff" opacity="0.6" />
        <path d="M20,60 Q50,40 80,60 Q70,80 50,75 Q30,80 20,60" fill="#fff" opacity="0.4" />
      </svg>
    )
  }
};

// 🎯 MAIN AVATAR COMPONENT
export const UserAvatar = ({ 
  avatarId = 'geometric-1', 
  size = 'medium', 
  className = '', 
  showBorder = true,
  onClick,
  ...props 
}) => {
  // Get avatar data with fallback
  const avatarData = PROFILE_AVATARS[avatarId] || PROFILE_AVATARS['geometric-1'];
  const AvatarComponent = avatarData.component;
  
  // Size classes
  const sizeClasses = {
    small: 'user-avatar--small',
    medium: 'user-avatar--medium', 
    large: 'user-avatar--large',
    xlarge: 'user-avatar--xlarge'
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.medium;
  
  return (
    <div 
      className={`user-avatar ${sizeClass} ${showBorder ? 'user-avatar--bordered' : ''} ${onClick ? 'user-avatar--clickable' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      <AvatarComponent />
    </div>
  );
};

// 🎨 AVATAR SELECTOR GRID
export const AvatarSelector = ({ 
  selectedAvatar = 'geometric-1', 
  onSelect, 
  onClose,
  size = 'medium' 
}) => {
  return (
    <div className="avatar-selector-overlay">
      <div className="avatar-selector-modal">
        <div className="avatar-selector-header">
          <h3>Choose Your Avatar</h3>
          <button onClick={onClose} className="avatar-selector-close">×</button>
        </div>
        
        <div className="avatar-selector-grid">
          {Object.entries(PROFILE_AVATARS).map(([key, avatarData]) => (
            <button
              key={key}
              className={`avatar-selector-option ${selectedAvatar === key ? 'selected' : ''}`}
              onClick={() => onSelect(key)}
            >
              <UserAvatar 
                avatarId={key} 
                size={size} 
                showBorder={false}
              />
              <span className="avatar-option-name">{avatarData.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// 🔤 INITIALS FALLBACK COMPONENT
export const InitialsAvatar = ({ 
  name = '', 
  size = 'medium', 
  className = '',
  ...props 
}) => {
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  const sizeClasses = {
    small: 'user-avatar--small',
    medium: 'user-avatar--medium',
    large: 'user-avatar--large', 
    xlarge: 'user-avatar--xlarge'
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.medium;
  
  return (
    <div 
      className={`user-avatar user-avatar--initials ${sizeClass} ${className}`}
      {...props}
    >
      <span className="user-avatar-initials">{getInitials(name)}</span>
    </div>
  );
};

// 🎭 SMART AVATAR COMPONENT - Automatically chooses between custom avatar and initials
export const SmartAvatar = ({ 
  userProfile, 
  size = 'medium', 
  className = '',
  onClick,
  showBorder = true,
  ...props 
}) => {
  // Determine which avatar to show
  const avatarId = userProfile?.avatar || userProfile?.avatarId;
  const displayName = userProfile?.displayName || userProfile?.name || '';
  
  if (avatarId && PROFILE_AVATARS[avatarId]) {
    return (
      <UserAvatar 
        avatarId={avatarId}
        size={size}
        className={className}
        onClick={onClick}
        showBorder={showBorder}
        {...props}
      />
    );
  }
  
  // Fallback to initials
  return (
    <InitialsAvatar 
      name={displayName}
      size={size}
      className={className}
      onClick={onClick}
      {...props}
    />
  );
};

export default {
  PROFILE_AVATARS,
  UserAvatar,
  AvatarSelector,
  InitialsAvatar,
  SmartAvatar
};