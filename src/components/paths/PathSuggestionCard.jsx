// src/components/paths/PathSuggestionCard.jsx
import React from 'react';
import { Lightbulb, Sparkles, ArrowRight } from 'lucide-react';
import '../../styles/components/pathSuggestionCard.css';

const PathSuggestionCard = ({ onStartQuestionnaire }) => {
  return (
    <div className="path-suggestion-card">
      <div className="suggestion-icon-wrapper">
        <Lightbulb className="suggestion-icon" />
        <Sparkles className="sparkle-icon sparkle-1" />
        <Sparkles className="sparkle-icon sparkle-2" />
      </div>
      
      <div className="suggestion-content">
        <h3 className="suggestion-title">Need help choosing?</h3>
        <p className="suggestion-subtitle">
          Answer 5 quick questions and our AI will find your perfect path
        </p>
      </div>

      <button 
        className="suggestion-button"
        onClick={onStartQuestionnaire}
      >
        <Sparkles className="button-icon" />
        Get Personalized Suggestion
        <ArrowRight className="button-arrow" />
      </button>

      <div className="suggestion-decorations">
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
        <div className="decoration decoration-3"></div>
      </div>
    </div>
  );
};

export default PathSuggestionCard;
