import React from 'react';
import { Compass, ArrowRight } from 'lucide-react';

const PathRecommendation = ({ onStartJourney }) => {
  return (
    <div className="path-recommendation">
      <div className="recommendation-icon-container">
        <Compass className="recommendation-icon" />
      </div>
      <div className="recommendation-content">
        <h3 className="recommendation-title">Begin Your Journey</h3>
        <p className="recommendation-text">
          We recommend starting with the Self-Discovery journey to establish a strong 
          foundation for your journaling practice.
        </p>
        <button 
          className="recommendation-button"
          onClick={() => onStartJourney('self-discovery')}
        >
          Start Self-Discovery
          <ArrowRight className="recommendation-button-icon" />
        </button>
      </div>
    </div>
  );
};

export default PathRecommendation;