// src/components/common/TimeLetterIcon.jsx
//
// Custom iconic SVG glyph blending TIME and LETTER (Time Capsule).
// Combines an epistolary envelope silhouette with an integrated
// precision clock dial, hands, and orbital temporal arcs.

import React from 'react';

const TimeLetterIcon = ({
  size = 24,
  className = '',
  variant = 'default', // 'default' | 'sealed' | 'arrived' | 'empty'
  strokeWidth = 1.75,
  ...props
}) => {
  if (variant === 'arrived') {
    // Open envelope with radiating temporal clock / sunburst
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`time-letter-icon is-arrived ${className}`}
        {...props}
      >
        {/* Open envelope flap */}
        <path d="M2.5 9L12 3l9.5 6" />
        {/* Envelope base pocket */}
        <path d="M2.5 9v9.5c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V9" />
        <path d="M2.5 19.5l7-6" />
        <path d="M21.5 19.5l-7-6" />
        
        {/* Radiating central time clock rising from within */}
        <circle cx="12" cy="11.5" r="4.5" fill="currentColor" fillOpacity="0.14" />
        <circle cx="12" cy="11.5" r="4.5" />
        {/* Clock hands pointing at 10 and 2 (golden ratio of time) */}
        <path d="M12 9.5v2l1.6 1" />
        
        {/* Small sparks of arrival / realization */}
        <line x1="12" y1="5.2" x2="12" y2="4.2" />
        <line x1="7.5" y1="7" x2="6.8" y2="6.3" />
        <line x1="16.5" y1="7" x2="17.2" y2="6.3" />
      </svg>
    );
  }

  if (variant === 'sealed') {
    // Envelope sealed tightly in time, with clock dial seal & temporal orbital arc
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`time-letter-icon is-sealed ${className}`}
        {...props}
      >
        {/* Envelope body */}
        <rect x="2.5" y="6.5" width="19" height="13" rx="2.5" />
        
        {/* Flap creases leading into the time seal */}
        <path d="M3 7.5L8.2 11.5" />
        <path d="M21 7.5L15.8 11.5" />

        {/* Central clock seal */}
        <circle cx="12" cy="13" r="4.2" fill="currentColor" fillOpacity="0.16" />
        <circle cx="12" cy="13" r="4.2" />
        {/* Clock hands indicating the passage of hours */}
        <path d="M12 11v2l1.5.8" />
        
        {/* Temporal orbital arc over top representing travel through time */}
        <path d="M6 4.2A9.5 9.5 0 0 1 18 4.2" strokeDasharray="1.8 2.2" opacity="0.75" />
        {/* Forward arrowhead on the time arc */}
        <path d="M17.5 2.5L19.2 4.2L17.5 5.9" opacity="0.85" />
      </svg>
    );
  }

  // Default / Empty variant: Harmonious fusion of envelope and timepiece
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`time-letter-icon ${className}`}
      {...props}
    >
      {/* Outer Envelope Body with elegant radius */}
      <rect x="2.5" y="6" width="19" height="13.5" rx="2.5" />

      {/* Creases pointing toward central timepiece */}
      <path d="M3 7.2L8.5 11.8" />
      <path d="M21 7.2L15.5 11.8" />
      <path d="M3 18.5L7.8 14.5" opacity="0.4" />
      <path d="M21 18.5L16.2 14.5" opacity="0.4" />

      {/* Integrated Timepiece Dial / Wax Seal */}
      <circle cx="12" cy="12.75" r="4.5" fill="currentColor" fillOpacity="0.14" />
      <circle cx="12" cy="12.75" r="4.5" />

      {/* Clock Hands pointing forward */}
      <path d="M12 10.5v2.25l1.6 1.1" />

      {/* Celestial orbital time arc above letter */}
      <path d="M8 3.5a8 8 0 0 1 8 0" opacity="0.6" strokeDasharray="2 2" />
      <circle cx="12" cy="2.2" r="0.8" fill="currentColor" />
    </svg>
  );
};

export default TimeLetterIcon;
