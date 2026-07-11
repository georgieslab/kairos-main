// src/components/analytics/AnalyticsSkeleton.jsx
// Cohesive loading skeleton that mirrors the Insights dashboard layout.
// Used both as the lazy-load (Suspense) fallback and while statistics load,
// so the user sees one consistent placeholder instead of two different loaders.
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const AnalyticsSkeleton = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`analytics-screen ${!isDarkMode ? 'light-mode' : ''}`}
      aria-hidden="true"
    >
      <div className="as-content as-skeleton">
        {/* PULSE */}
        <section className="as-section">
          <div className="as-glass as-pulse">
            <div className="as-pulse-row">
              <div className="as-skel-pulse-stat">
                <span className="as-skel-bar as-skel-icon" />
                <span className="as-skel-bar as-skel-value" />
                <span className="as-skel-bar as-skel-label" />
              </div>
              <div className="as-skel-pulse-stat">
                <span className="as-skel-bar as-skel-icon" />
                <span className="as-skel-bar as-skel-value" />
                <span className="as-skel-bar as-skel-label" />
              </div>
              <div className="as-skel-pulse-stat">
                <span className="as-skel-bar as-skel-icon" />
                <span className="as-skel-bar as-skel-value" />
                <span className="as-skel-bar as-skel-label" />
              </div>
            </div>
            <div className="as-skel-filter-row">
              <span className="as-skel-bar as-skel-pill" />
              <span className="as-skel-bar as-skel-pill" />
              <span className="as-skel-bar as-skel-pill" />
              <span className="as-skel-bar as-skel-pill" />
            </div>
          </div>
        </section>

        {/* SECTION CARDS */}
        {[0, 1, 2, 3].map((i) => (
          <section className="as-section" key={i}>
            <div className="as-glass as-skel-expand">
              <span className="as-skel-bar as-skel-expand-icon" />
              <div className="as-skel-expand-info">
                <span className="as-skel-bar as-skel-title" />
                <span className="as-skel-bar as-skel-subtitle" />
              </div>
              <span className="as-skel-bar as-skel-chevron" />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsSkeleton;
