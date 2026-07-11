import React from 'react';
import { useTranslation } from 'react-i18next';

const PathProgressBar = ({ completedCount, total = 10 }) => {
  const { t } = useTranslation('paths');
  const percentage = (completedCount / total) * 100;

  return (
    <div className="path-progress-container">
      <div className="path-progress-bar">
        <div 
          className="path-progress-fill" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="path-progress-text">
        {t('pathProgressBar.progressText', '{{completed}} of {{total}} days completed', { completed: completedCount || 0, total })}
      </div>
    </div>
  );
};

export default PathProgressBar;