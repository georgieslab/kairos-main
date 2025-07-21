// WaterClockElements.jsx
import React from 'react';

export const UpperVessel = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" fill="none">
    <path d="M50 5 C35 5, 20 15, 20 25 L20 75 C20 85, 15 100, 50 110 C85 100, 80 85, 80 75 L80 25 C80 15, 65 5, 50 5Z" fill="#558B6E" opacity="0.8" />
    <path d="M50 105 C75 95, 70 85, 70 75 L70 30 C70 22, 60 15, 50 15 M50 105 C25 95, 30 85, 30 75 L30 30 C30 22, 40 15, 50 15" stroke="#2B463C" strokeWidth="1" opacity="0.9" />
    <path d="M30 40 L70 40" stroke="#2B463C" strokeWidth="0.8" opacity="0.6" strokeDasharray="2 1" />
    <path d="M30 60 L70 60" stroke="#2B463C" strokeWidth="0.8" opacity="0.8" strokeDasharray="2 1" />
    <path d="M30 80 L70 80" stroke="#2B463C" strokeWidth="0.8" opacity="1" strokeDasharray="2 1" />
    <circle cx="50" cy="12" r="7" fill="#2B463C" opacity="0.9" />
    <path d="M47 12 L53 12 L50 17 Z" fill="#E6B89C" />
  </svg>
);

export const LowerVessel = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" fill="none">
    <path d="M50 15 C30 15, 20 25, 20 40 L20 80 C20 95, 30 105, 50 105 C70 105, 80 95, 80 80 L80 40 C80 25, 70 15, 50 15Z" fill="#558B6E" opacity="0.7" />
    <path d="M30 40 L70 40" stroke="#2B463C" strokeWidth="0.8" opacity="0.6" strokeDasharray="2 1" />
    <path d="M28 60 L72 60" stroke="#2B463C" strokeWidth="0.8" opacity="0.8" strokeDasharray="2 1" />
    <path d="M25 80 L75 80" stroke="#2B463C" strokeWidth="0.8" opacity="1" strokeDasharray="2 1" />
    <circle cx="50" cy="100" r="5" fill="#2B463C" opacity="0.9" />
    <line x1="50" y1="5" x2="50" y2="15" stroke="#E6B89C" strokeWidth="1.5" />
    <path d="M45 5 L55 5 L50 10 Z" fill="#E6B89C" />
  </svg>
);

export const MeasuringScale = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120" fill="none">
    <rect x="35" y="10" width="10" height="100" rx="1" fill="#2B463C" opacity="0.7" />
    <line x1="35" y1="25" x2="45" y2="25" stroke="#E6B89C" strokeWidth="1" />
    <line x1="32" y1="40" x2="48" y2="40" stroke="#E6B89C" strokeWidth="1" />
    <line x1="35" y1="55" x2="45" y2="55" stroke="#E6B89C" strokeWidth="1" />
    <line x1="32" y1="70" x2="48" y2="70" stroke="#E6B89C" strokeWidth="1" />
    <line x1="35" y1="85" x2="45" y2="85" stroke="#E6B89C" strokeWidth="1" />
    <line x1="32" y1="100" x2="48" y2="100" stroke="#E6B89C" strokeWidth="1" />
    <circle cx="40" cy="25" r="1.5" fill="#E6B89C" />
    <circle cx="40" cy="40" r="1.5" fill="#E6B89C" />
    <circle cx="40" cy="55" r="1.5" fill="#E6B89C" />
    <circle cx="40" cy="70" r="1.5" fill="#E6B89C" />
    <circle cx="40" cy="85" r="1.5" fill="#E6B89C" />
    <circle cx="40" cy="100" r="1.5" fill="#E6B89C" />
    <text x="50" y="40" fontFamily="serif" fontSize="5" fill="#E6B89C">χρόνος</text>
    <text x="50" y="70" fontFamily="serif" fontSize="5" fill="#E6B89C">καιρός</text>
    <text x="50" y="100" fontFamily="serif" fontSize="5" fill="#E6B89C">σοφία</text>
  </svg>
);

// Add one more water clock element for better distribution
export const SmallVessel = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 90" fill="none">
    <path d="M40 10 C30 10, 25 15, 25 25 L25 55 C25 65, 30 70, 40 70 C50 70, 55 65, 55 55 L55 25 C55 15, 50 10, 40 10Z" fill="#558B6E" opacity="0.6" />
    <path d="M30 25 L50 25" stroke="#2B463C" strokeWidth="0.8" opacity="0.6" strokeDasharray="2 1" />
    <path d="M28 40 L52 40" stroke="#2B463C" strokeWidth="0.8" opacity="0.8" strokeDasharray="2 1" />
    <path d="M27 55 L53 55" stroke="#2B463C" strokeWidth="0.8" opacity="1" strokeDasharray="2 1" />
    <circle cx="40" cy="65" r="4" fill="#2B463C" opacity="0.9" />
    <text x="32" y="35" fontFamily="serif" fontSize="6" fill="#E6B89C">νῦν</text>
  </svg>
);

const WaterClockElements = () => {
  return (
    <>
      <div className="floating-element element-1">
        <UpperVessel />
      </div>
      <div className="floating-element element-2">
        <LowerVessel />
      </div>
      <div className="floating-element element-3">
        <MeasuringScale />
      </div>
      <div className="floating-element element-4">
        <SmallVessel />
      </div>
    </>
  );
};

export default WaterClockElements;