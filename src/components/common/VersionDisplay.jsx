// src/components/common/VersionDisplay.jsx
import React, { useState } from 'react';
import { Tag, ChevronDown, X } from 'lucide-react';
import { APP_VERSION, VERSION_HISTORY } from '../../utils/versionControl';
import '../../styles/components/versionDisplay.css';

const VersionDisplay = ({ minimal = false }) => {
  const [showChangelog, setShowChangelog] = useState(false);
  
  const toggleChangelog = () => {
    setShowChangelog(!showChangelog);
  };
  
  return (
    <div className="version-display">
      {minimal ? (
        <span className="version-number">v{APP_VERSION}</span>
      ) : (
        <div 
          className="version-badge interactive"
          onClick={toggleChangelog}
          role="button"
          tabIndex={0}
          aria-label="View changelog"
        >
          <Tag className="version-icon" />
          <span>v{APP_VERSION}</span>
          <ChevronDown className={`version-chevron ${showChangelog ? 'rotate-180' : ''}`} />
        </div>
      )}
      
      {showChangelog && (
        <div className="changelog-modal" onClick={() => setShowChangelog(false)}>
          <div className="changelog-content" onClick={(e) => e.stopPropagation()}>
            <div className="changelog-header">
              <h2 className="changelog-title">Changelog</h2>
              <button 
                className="changelog-close"
                onClick={() => setShowChangelog(false)}
                aria-label="Close changelog"
              >
                <X className="close-icon" />
              </button>
            </div>
            
            <div className="changelog-body">
              {VERSION_HISTORY.slice().reverse().map((version, index) => (
                <div className="version-item" key={version.version}>
                  <div className="version-header">
                    <span className={`version-tag ${version.version === APP_VERSION ? 'current' : ''}`}>
                      v{version.version}
                      {version.version === APP_VERSION && ' (Current)'}
                    </span>
                    <span className="version-date">{version.releaseDate}</span>
                  </div>
                  
                  {version.features?.length > 0 && (
                    <div className="version-section">
                      <h3 className="section-title">New Features</h3>
                      <ul className="feature-list">
                        {version.features.map((feature, fidx) => (
                          <li className="feature-item" key={fidx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {version.bugFixes?.length > 0 && (
                    <div className="version-section">
                      <h3 className="section-title">Bug Fixes</h3>
                      <ul className="bugfix-list">
                        {version.bugFixes.map((fix, bidx) => (
                          <li className="bugfix-item" key={bidx}>{fix}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {version.improvements?.length > 0 && (
                    <div className="version-section">
                      <h3 className="section-title">Improvements</h3>
                      <ul className="feature-list">
                        {version.improvements.map((improvement, iidx) => (
                          <li className="feature-item" key={iidx}>{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {version.notes?.length > 0 && (
                    <div className="version-section">
                      <h3 className="section-title">Notes</h3>
                      <ul className="feature-list">
                        {version.notes.map((note, nidx) => (
                          <li className="feature-item" key={nidx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="changelog-footer">
              <p className="copyright">© 2025 Καιρός. All rights reserved.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionDisplay;