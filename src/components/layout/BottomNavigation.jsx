// src/components/layout/BottomNavigation.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Route, PenTool, Telescope, User } from 'lucide-react';
import '../../styles/components/bottomNavigation.css';


const navItems = [
  { id: 'home', label: 'Home', labelKey: 'bottomNav.home', icon: Home, screen: 'home', color: '#5B9FD4', glow: '91, 159, 212' },
  { id: 'paths', label: 'Paths', labelKey: 'bottomNav.paths', icon: Route, screen: 'path-selection', color: '#E6B89C', glow: '230, 184, 156' },
  { id: 'write', label: 'Journal', labelKey: 'bottomNav.journal', icon: PenTool, screen: 'write', isCenter: true, color: '#558B6E', glow: '85, 139, 110' },
  { id: 'analytics', label: 'Insights', labelKey: 'bottomNav.insights', icon: Telescope, screen: 'analytics-dashboard', color: '#d8b23f', glow: '216, 178, 63' },
  { id: 'profile', label: 'Profile', labelKey: 'bottomNav.profile', icon: User, screen: 'profile', color: '#9370DB', glow: '147, 112, 219' },
];

const BottomNavigation = ({ currentScreen, navigateToScreen }) => {
  const { t } = useTranslation('layout');
  const trackRef = useRef(null);
  const itemRefs = useRef([]);
  
  const [sliderStyle, setSliderStyle] = useState({ transform: 'translateX(0px)', width: 0, opacity: 0, background: 'transparent', borderColor: 'transparent' });
  const [hoveredId, setHoveredId] = useState(null);

  const getActiveId = () => {
    const match = navItems.find(item => item.screen === currentScreen || item.id === currentScreen);
    return match?.id || 'home';
  };

  const activeId = getActiveId();
  const targetId = hoveredId || activeId;

  // Position the sliding glass pill under the hovered (desktop) or active tab.
  // Runs on every device — so tapping a tab slides the pill into place
  // instead of having the active glass just appear.
  const positionSlider = useCallback(() => {
    const targetIndex = navItems.findIndex(item => item.id === targetId);
    const targetElement = itemRefs.current[targetIndex];
    const targetItem = navItems[targetIndex];
    if (!targetElement || !trackRef.current || !targetItem) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    const itemRect = targetElement.getBoundingClientRect();
    const leftOffset = itemRect.left - trackRect.left;
    const isCurrentlyActive = targetId === activeId;
    const tintOpacity = isCurrentlyActive ? 0.08 : 0.04;

    setSliderStyle({
      transform: `translateX(${leftOffset}px)`,
      width: `${itemRect.width}px`,
      opacity: 1,
      background: `rgba(${targetItem.glow}, ${tintOpacity})`,
      borderColor: `rgba(${targetItem.glow}, ${isCurrentlyActive ? 0.25 : 0.15})`,
    });
  }, [targetId, activeId]);

  // Reposition when the target changes, and keep it aligned on resize.
  //
  // The resize listener is not enough on its own. positionSlider measures the
  // items, so anything that changes an item's width has to re-run it — and two
  // such things fire no resize event and are in no dependency array:
  //
  //   - Switching language. `t()` swaps the labels in place; German "Einblicke"
  //     and Georgian "ინსაითები" are ~45px wider than "Insights". Invisible
  //     while the labels are folded away and item widths are icon-driven, but
  //     the desktop top bar shows labels and lets items size to their content,
  //     and the language switcher sits on the Home screen itself.
  //   - A late webfont load. Noto Sans Georgian arrives over the network; the
  //     same text re-measures wider once it does.
  //
  // Observing the items covers both, and anything else that reflows them,
  // without having to enumerate the causes. Observing the track would not:
  // in a full-width bar the track keeps its size while the items inside it
  // change, and on a phone the track is a fixed-width pill for the same reason.
  useEffect(() => {
    const raf = requestAnimationFrame(positionSlider);
    window.addEventListener('resize', positionSlider);

    let observer;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(positionSlider);
      itemRefs.current.forEach(el => el && observer.observe(el));
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', positionSlider);
      if (observer) observer.disconnect();
    };
  }, [positionSlider]);

  const handleMouseLeaveTrack = () => {
    setHoveredId(null); // Snap back to active tab and its color
  };

  const handleNav = (screen) => {
    if (navigator.vibrate) navigator.vibrate(10);
    navigateToScreen(screen, {}, { isTabNavigation: true });
  };

  return (
    <nav className="apple-glass-nav" role="navigation" aria-label={t('bottomNav.navAriaLabel', 'Main navigation')}>
      <div 
        className="apple-glass-nav-track" 
        ref={trackRef}
        onMouseLeave={handleMouseLeaveTrack}
      >
        {/* The Sliding Tinted Glass Pane */}
        <div className="glass-slider" style={sliderStyle} />

        {navItems.map((item, index) => {
          const isActive = activeId === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              ref={el => itemRefs.current[index] = el}
              onClick={() => handleNav(item.screen)}
              onMouseEnter={() => setHoveredId(item.id)}
              // Pass the specific color to CSS via custom properties
              style={{ '--item-color': item.color, '--item-glow': item.glow }}
              className={`glass-nav-item ${isActive ? 'is-active' : ''} ${item.isCenter ? 'is-center' : ''}`}
              aria-label={t(item.labelKey, item.label)}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="glass-nav-icon-wrap">
                <Icon className="glass-nav-icon" strokeWidth={isActive ? 2.2 : 1.8} />
              </div>
              <span className="glass-nav-label">{t(item.labelKey, item.label)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );

}

export default BottomNavigation;