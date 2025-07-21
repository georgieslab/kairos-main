import React from 'react';

const PathProgressBar = ({ completedCount, total = 10 }) => {
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
        {completedCount || 0} of {total} days completed
      </div>
    </div>
  );
};

export default PathProgressBar;