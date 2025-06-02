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
  
  const navItems = [
    { 
      id: 'home', 
      label: 'Home', 
      icon: Home, 
      action: () => navigateToTabScreen('home'),
      matches: ['home', 'dashboard'],
      color: '#558B6E' // Green
    },
    { 
      id: 'paths', 
      label: 'Paths', 
      icon: BookOpen, 
      action: () => navigateToTabScreen('path-selection', {}),
      matches: ['path-selection', 'journey-preview', 'daily'],
      color: '#E6B89C' // Orange/amber
    },
    { 
      id: 'write', 
      label: 'Write', 
      icon: PenTool, 
      action: () => navigateToTabScreen('write', {}),
      isPrimary: true,
      matches: ['upload', 'write'],
      color: '#FFF' // White for primary action
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart2, 
      action: () => navigateToTabScreen('analytics-dashboard'),
      matches: ['analytics-dashboard'],
      color: '#d8b23f' // yellowish
    },
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: User, 
      action: () => navigateToTabScreen('profile'),
      matches: ['profile', 'settings'],
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
    if (currentId) {
      setPreviousTab(currentId);
    }
    
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
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Show ripple with unique ID to force re-render
      setRippleEffect({
        show: true,
        x,
        y,
        id: item.id + Date.now()
      });
      
      // Hide ripple after animation
      setTimeout(() => {
        setRippleEffect({ show: false, x: 0, y: 0, id: null });
      }, 700);
    }
    
    // Navigate to the tab
    item.action();
  };
  
  // Find current active item
  const activeItem = navItems.find(item => isActive(item));
  const activeTab = activeItem ? activeItem.id : null;
  
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
            
            return (
              <button
                key={item.id}
                ref={el => tabRefs.current[item.id] = el}
                onClick={(e) => handleTabClick(item, e)}
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
                    }}
                  ></span>
                )}
                
                {/* Primary action (Write) gets a special treatment */}
                {item.isPrimary ? (
                  <div className="primary-action-button">
                    <item.icon className="primary-action-icon" />
                  </div>
                ) : (
                  <div className="nav-icon-container">
                    <item.icon className={`nav-item-icon ${isActiveTab ? 'nav-icon-active' : ''}`} />
                  </div>
                )}
                
                <span className={`nav-item-label ${isActiveTab ? 'nav-label-active' : ''}`}>
                  {item.label}
                </span>
                
                {/* Active indicator with animated sliding based on direction */}
                {isActiveTab && !item.isPrimary && (
                  <div 
                    className={`nav-item-indicator ${getSlideDirection()}`}
                    style={{ background: item.color }}
                  ></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;