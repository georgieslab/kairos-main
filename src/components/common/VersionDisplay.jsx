// src/components/common/VersionDisplay.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag, ChevronDown, X } from 'lucide-react';
import { APP_VERSION, VERSION_HISTORY } from '../../utils/versionControl';
import '../../styles/components/versionDisplay.css';

const VersionDisplay = ({ minimal = false }) => {
  const { t } = useTranslation('layout');
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
          aria-label={t('versionDisplay.viewChangelogAria', 'View changelog')}
        >
          <Tag className="version-icon" />
          <span>v{APP_VERSION}</span>
          <ChevronDown className={`version-chevron ${showChangelog ? 'rotate-180' : ''}`} />
        </div>
      )}
      
      {showChangelog && (
        <div className="profile-modal-overlay" onClick={() => setShowChangelog(false)}>
          <div className="profile-modal changelog-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h2 className="profile-modal-title">{t('versionDisplay.changelog', 'Changelog')}</h2>
              <button
                className="changelog-close-btn"
                onClick={() => setShowChangelog(false)}
                aria-label={t('versionDisplay.closeChangelogAria', 'Close changelog')}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="profile-modal-content changelog-scrollable">
              {VERSION_HISTORY.slice().reverse().map((version, index) => (
                <div className="version-item" key={version.version}>
                  <div className="version-header">
                    <span className={`version-tag ${version.version === APP_VERSION ? 'current' : ''}`}>
                      v{version.version}
                      {version.version === APP_VERSION && ` (${t('versionDisplay.current', 'Current')})`}
                    </span>
                    <span className="version-date">{version.releaseDate}</span>
                  </div>
                  
                  {version.features?.length > 0 && (
                    <div className="version-section">
                      <h3 className="section-title">{t('versionDisplay.newFeatures', 'New Features')}</h3>
                      <ul className="feature-list">
                        {version.features.map((feature, fidx) => (
                          <li className="feature-item" key={fidx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {version.bugFixes?.length > 0 && (
                    <div className="version-section">
                      <h3 className="section-title">{t('versionDisplay.bugFixes', 'Bug Fixes')}</h3>
                      <ul className="bugfix-list">
                        {version.bugFixes.map((fix, bidx) => (
                          <li className="bugfix-item" key={bidx}>{fix}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {version.improvements?.length > 0 && (
                    <div className="version-section">
                      <h3 className="section-title">{t('versionDisplay.improvements', 'Improvements')}</h3>
                      <ul className="feature-list">
                        {version.improvements.map((improvement, iidx) => (
                          <li className="feature-item" key={iidx}>{improvement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {version.notes?.length > 0 && (
                    <div className="version-section">
                      <h3 className="section-title">{t('versionDisplay.notes', 'Notes')}</h3>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default VersionDisplay;