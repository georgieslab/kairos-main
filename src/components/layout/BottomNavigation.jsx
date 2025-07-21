<<<<<<< HEAD
// src/components/layout/BottomNavigation.jsx - Enhanced with modern UX
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Home, BookOpen, PenTool, BarChart2, User, Plus } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

// Import the enhanced CSS file
import '../../styles/components/bottomNavigation.css';

const BottomNavigation = ({ currentScreen, navigateToScreen }) => {
  const { isDarkMode } = useTheme();
  const { userProfile } = useAuth();
  
  // Enhanced state management
  const [previousTab, setPreviousTab] = useState(null);
  const [rippleEffect, setRippleEffect] = useState({ show: false, x: 0, y: 0, id: null });
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hapticFeedback, setHapticFeedback] = useState({ show: false, tabId: null });
  const [badges, setBadges] = useState({});
  
  // References for animations and measurements
  const tabRefs = useRef({});
  const navRef = useRef(null);
  const animationRef = useRef(null);
  
  // Enhanced navigation items with more sophisticated configuration
=======
// src/components/layout/BottomNavigation.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Home, BookOpen, PenTool, BarChart2, User } from 'lucide-react';
// Import the CSS file
import '../../styles/components/bottomNavigation.css';

const BottomNavigation = ({ currentScreen, navigateToScreen }) => {
  // Store the previous active tab to create animation direction
  const [previousTab, setPreviousTab] = useState(null);
  const [rippleEffect, setRippleEffect] = useState({ show: false, x: 0, y: 0, id: null });
  
  // References to measure position for indicator animation
  const tabRefs = useRef({});
  
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  const navItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: Home, 
      action: () => navigateToTabScreen('home'),
      matches: ['home', 'dashboard'],
<<<<<<< HEAD
      color: '#558B6E',
      gradient: ['#558B6E', '#2D5A3D'],
      description: 'Your journey dashboard'
=======
      color: '#558B6E' // Green
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    },
    { 
      id: 'paths', 
      label: 'Paths', 
      icon: BookOpen, 
      action: () => navigateToTabScreen('path-selection', {}),
      matches: ['path-selection', 'journey-preview', 'daily'],
<<<<<<< HEAD
      color: '#E6B89C',
      gradient: ['#E6B89C', '#D4956F'],
      description: 'Explore journaling paths'
    },
    { 
      id: 'write', 
      label: 'Journal', 
=======
      color: '#E6B89C' // Orange/amber
    },
    { 
      id: 'write', 
      label: 'Write', 
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      icon: PenTool, 
      action: () => navigateToTabScreen('write', {}),
      isPrimary: true,
      matches: ['upload', 'write'],
<<<<<<< HEAD
      color: '#FFF',
      gradient: ['#558B6E', '#2D5A3D'],
      description: 'Start writing',
      pulseOnInactive: true
=======
      color: '#FFF' // White for primary action
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart2, 
      action: () => navigateToTabScreen('analytics-dashboard'),
<<<<<<< HEAD
      matches: ['analytics-dashboard', 'journal-archive'],
      color: '#d8b23f',
      gradient: ['#d8b23f', '#B8941F'],
      description: 'View your insights'
=======
      matches: ['analytics-dashboard'],
      color: '#d8b23f' // yellowish
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      action: () => navigateToTabScreen('profile'),
      matches: ['profile', 'settings'],
<<<<<<< HEAD
      color: '#9370DB',
      gradient: ['#9370DB', '#7B68EE'],
      description: 'Manage your account'
    }
  ];

  // Auto-hide navigation on scroll (optional enhancement)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Uncomment to enable auto-hide on scroll
    // window.addEventListener('scroll', handleScroll);
    // return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Initialize active tab
  useEffect(() => {
    const activeItem = navItems.find(item => isActive(item));
    if (activeItem && previousTab !== activeItem.id) {
      setPreviousTab(activeItem.id);
    }
  }, [currentScreen, previousTab]);

  // Enhanced badge calculation
  useEffect(() => {
    const calculateBadges = () => {
      const newBadges = {};
      
      // Example: Add badge for analytics if user has new insights
      if (userProfile?.journeyProgress) {
        const allProgress = Object.values(userProfile.journeyProgress);
        const hasRecentActivity = allProgress.some(progress => 
          progress.lastUpdated && 
          new Date(progress.lastUpdated.toDate?.() || progress.lastUpdated) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        );
        
        if (hasRecentActivity && currentScreen !== 'analytics-dashboard') {
          newBadges.analytics = 1;
        }
      }
      
      setBadges(newBadges);
    };
    
    calculateBadges();
  }, [userProfile, currentScreen]);

  // Enhanced navigation function
  const navigateToTabScreen = useCallback((screen, params = {}) => {
    const currentItem = navItems.find(item => isActive(item));
    const currentId = currentItem ? currentItem.id : null;
    
=======
      color: '#9370DB' // Purple
    }
  ];

  // When component mounts, find the active tab
  useEffect(() => {
    const activeItem = navItems.find(item => isActive(item));
    if (activeItem) {
      setPreviousTab(activeItem.id);
    }
  }, []);

  // Custom navigation function that skips loader for tab navigation
  const navigateToTabScreen = (screen, params = {}) => {
    // Find the active tab before changing
    const currentItem = navItems.find(item => isActive(item));
    const currentId = currentItem ? currentItem.id : null;
    
    // Store current active tab before changing
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    if (currentId) {
      setPreviousTab(currentId);
    }
    
<<<<<<< HEAD
    // Trigger haptic feedback simulation
    triggerHapticFeedback(screen);
    
    navigateToScreen(screen, {
      ...params,
      isTabNavigation: true
    });
  }, [navigateToScreen]);
  
  // Helper function to check if a nav item is active
  const isActive = useCallback((item) => {
    return item.matches.includes(currentScreen);
  }, [currentScreen]);
  
  // Enhanced haptic feedback simulation
  const triggerHapticFeedback = useCallback((tabId) => {
    setHapticFeedback({ show: true, tabId });
    
    // Web Vibration API (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    setTimeout(() => {
      setHapticFeedback({ show: false, tabId: null });
    }, 150);
  }, []);
  
  // Enhanced ripple effect handler
  const handleTabClick = useCallback((item, e) => {
    e.preventDefault();
    
    if (!isActive(item)) {
=======
    // Special handling for tab navigation to avoid loader
    navigateToScreen(screen, {
      ...params,
      isTabNavigation: true // This flag will be used in NavigationContext to skip loader
    });
  };
  
  // Helper function to check if a nav item is active
  const isActive = (item) => {
    return item.matches.includes(currentScreen);
  };
  
  // Handle ripple effect on click
  const handleTabClick = (item, e) => {
    // Only show ripple effect if not already active
    if (!isActive(item)) {
      // Get click position relative to the button
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
<<<<<<< HEAD
=======
      // Show ripple with unique ID to force re-render
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
      setRippleEffect({
        show: true,
        x,
        y,
        id: item.id + Date.now()
      });
      
<<<<<<< HEAD
      setTimeout(() => {
        setRippleEffect({ show: false, x: 0, y: 0, id: null });
      }, 800);
    }
    
    item.action();
  }, [isActive]);
  
  // Enhanced animation direction calculation
  const getSlideDirection = useCallback(() => {
    if (!previousTab || !activeTab) return '';
    
    const prevIndex = navItems.findIndex(item => item.id === previousTab);
    const activeIndex = navItems.findIndex(item => item.id === activeTab);
    
    if (prevIndex < activeIndex) return 'slide-right';
    if (prevIndex > activeIndex) return 'slide-left';
    return '';
  }, [previousTab]);
=======
      // Hide ripple after animation
      setTimeout(() => {
        setRippleEffect({ show: false, x: 0, y: 0, id: null });
      }, 700);
    }
    
    // Navigate to the tab
    item.action();
  };
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  
  // Find current active item
  const activeItem = navItems.find(item => isActive(item));
  const activeTab = activeItem ? activeItem.id : null;
  
<<<<<<< HEAD
  // Enhanced gesture detection for mobile
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    navRef.current.touchStartX = touch.clientX;
  }, []);
  
  const handleTouchEnd = useCallback((e) => {
    const touch = e.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchStartX = navRef.current.touchStartX;
    
    if (!touchStartX) return;
    
    const swipeDistance = touchEndX - touchStartX;
    const minSwipeDistance = 50;
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      const currentIndex = navItems.findIndex(item => isActive(item));
      let newIndex;
      
      if (swipeDistance > 0 && currentIndex > 0) {
        // Swipe right - go to previous tab
        newIndex = currentIndex - 1;
      } else if (swipeDistance < 0 && currentIndex < navItems.length - 1) {
        // Swipe left - go to next tab
        newIndex = currentIndex + 1;
      }
      
      if (newIndex !== undefined && navItems[newIndex] && !navItems[newIndex].isPrimary) {
        navItems[newIndex].action();
      }
    }
  }, [navItems, isActive]);

  return (
    <nav 
      ref={navRef}
      className={`bottom-navigation ${isDarkMode ? 'dark-theme' : 'light-theme'} ${
        isVisible ? 'nav-visible' : 'nav-hidden'
      }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="bottom-navigation-container">
        <div className="bottom-navigation-items">
          {navItems.map((item, index) => {
            const isActiveTab = isActive(item);
            const hasBadge = badges[item.id] > 0;
            const isHapticActive = hapticFeedback.show && hapticFeedback.tabId === item.id;
=======
  // Determine animation direction
  const getSlideDirection = () => {
    if (!previousTab || !activeTab) return '';
    
    const prevIndex = navItems.findIndex(item => item.id === previousTab);
    const activeIndex = navItems.findIndex(item => item.id === activeTab);
    
    if (prevIndex < activeIndex) return 'slide-left';
    if (prevIndex > activeIndex) return 'slide-right';
    return '';
  };
  
  return (
    <div className="bottom-navigation">
      <div className="bottom-navigation-container">
        <div className="bottom-navigation-items">
          {navItems.map((item) => {
            const isActiveTab = isActive(item);
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
            
            return (
              <button
                key={item.id}
                ref={el => tabRefs.current[item.id] = el}
                onClick={(e) => handleTabClick(item, e)}
<<<<<<< HEAD
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTabClick(item, e);
                  }
                }}
                className={`nav-item ${isActiveTab ? 'nav-item-active' : ''} ${
                  item.isPrimary ? 'primary-action' : ''
                } ${isHapticActive ? 'haptic-feedback' : ''} ${
                  item.pulseOnInactive && !isActiveTab ? 'pulse-hint' : ''
                }`}
                style={isActiveTab && !item.isPrimary ? { 
                  '--active-color': item.color,
                  '--active-gradient-start': item.gradient[0],
                  '--active-gradient-end': item.gradient[1]
                } : {}}
                data-tab={item.id}
                aria-label={`${item.label}: ${item.description}`}
                aria-current={isActiveTab ? 'page' : undefined}
              >
                {/* Enhanced ripple effect */}
                {rippleEffect.show && rippleEffect.id && rippleEffect.id.startsWith(item.id) && (
                  <span 
                    className="ripple-effect enhanced-ripple"
                    style={{
                      left: rippleEffect.x + 'px',
                      top: rippleEffect.y + 'px',
                      '--ripple-color': item.color
=======
                className={`nav-item ${isActiveTab ? 'nav-item-active' : ''} ${
                  item.isPrimary ? 'primary-action' : ''
                }`}
                style={isActiveTab && !item.isPrimary ? { 
                  '--active-color': item.color
                } : {}}
              >
                {/* Ripple effect container */}
                {rippleEffect.show && rippleEffect.id && rippleEffect.id.startsWith(item.id) && (
                  <span 
                    className="ripple-effect"
                    style={{
                      left: rippleEffect.x + 'px',
                      top: rippleEffect.y + 'px'
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
                    }}
                  ></span>
                )}
                
<<<<<<< HEAD
                {/* Primary action (Write) with enhanced styling */}
                {item.isPrimary ? (
                  <div className="primary-action-container">
                    <div 
                      className="primary-action-button"
                      style={{
                        background: `linear-gradient(135deg, ${item.gradient[0]}, ${item.gradient[1]})`
                      }}
                    >
                      <item.icon className="primary-action-icon" />
                      {/* Floating particles effect */}
                      <div className="floating-particles">
                        <span className="particle particle-1"></span>
                        <span className="particle particle-2"></span>
                        <span className="particle particle-3"></span>
                      </div>
                    </div>
                    {/* Primary action glow */}
                    <div className="primary-action-glow"></div>
=======
                {/* Primary action (Write) gets a special treatment */}
                {item.isPrimary ? (
                  <div className="primary-action-button">
                    <item.icon className="primary-action-icon" />
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
                  </div>
                ) : (
                  <div className="nav-icon-container">
                    <item.icon className={`nav-item-icon ${isActiveTab ? 'nav-icon-active' : ''}`} />
<<<<<<< HEAD
                    
                    {/* Badge notification */}
                    {hasBadge && (
                      <span className="nav-badge" aria-label={`${badges[item.id]} notifications`}>
                        {badges[item.id]}
                      </span>
                    )}
                    
                    {/* Icon background glow for active state */}
                    {isActiveTab && (
                      <div 
                        className="icon-glow"
                        style={{ backgroundColor: item.color }}
                      ></div>
                    )}
=======
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
                  </div>
                )}
                
                <span className={`nav-item-label ${isActiveTab ? 'nav-label-active' : ''}`}>
                  {item.label}
                </span>
                
<<<<<<< HEAD
                {/* Enhanced active indicator */}
                {isActiveTab && !item.isPrimary && (
                  <div 
                    className={`nav-item-indicator enhanced-indicator ${getSlideDirection()}`}
                    style={{ 
                      background: `linear-gradient(90deg, ${item.gradient[0]}, ${item.gradient[1]})`,
                      boxShadow: `0 0 8px ${item.color}40`
                    }}
=======
                {/* Active indicator with animated sliding based on direction */}
                {isActiveTab && !item.isPrimary && (
                  <div 
                    className={`nav-item-indicator ${getSlideDirection()}`}
                    style={{ background: item.color }}
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
                  ></div>
                )}
              </button>
            );
          })}
        </div>
<<<<<<< HEAD
        
        {/* Background blur effect */}
        <div className="nav-background-blur"></div>
        
        {/* Dynamic gradient overlay */}
        <div 
          className="nav-gradient-overlay"
          style={{
            background: activeItem ? 
              `linear-gradient(90deg, transparent, ${activeItem.color}15, transparent)` : 
              'transparent'
          }}
        ></div>
      </div>
    </nav>
=======
      </div>
    </div>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
  );
};

export default BottomNavigation;