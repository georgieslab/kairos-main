// src/components/paths/PathSuggestionCard.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, ArrowRight } from 'lucide-react';

const PathSuggestionCard = ({ onStartQuestionnaire }) => {
  const { t } = useTranslation('paths');
  return (
    <button
      type="button"
      className="glass-suggestion-card"
      onClick={onStartQuestionnaire}
    >
      <div className="suggestion-glow" aria-hidden="true" />

      <div className="suggestion-glass-icon">
        <Sparkles size={20} />
      </div>

      <div className="suggestion-content">
        <span className="suggestion-tag">
          <Sparkles size={11} />
          {t('pathSuggestionCard.aiMatchedTag', 'AI-matched')}
        </span>
        <h3>{t('pathSuggestionCard.title', 'Not sure where to start?')}</h3>
        <p>{t('pathSuggestionCard.description', "Answer a few quick questions and we'll find your perfect path.")}</p>
      </div>

      <span className="suggestion-cta" aria-hidden="true">
        <ArrowRight size={16} />
      </span>
    </button>
  );
};

export default PathSuggestionCard;
