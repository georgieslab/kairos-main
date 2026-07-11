// src/components/paths/PathQuestionnaire.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { getQuestionnaireRecommendation } from '../../services/pathRecommender';
import { Sparkles, ArrowRight, ArrowLeft, X } from 'lucide-react';
import KairosLoader from '../common/KairosLoader';
import '../../styles/components/pathQuestionnaire.css';

const QUESTIONS = [
  {
    id: 'mood',
    questionKey: 'pathQuestionnaire.questions.mood.question',
    question: 'How are you feeling right now?',
    subtitleKey: 'pathQuestionnaire.questions.mood.subtitle',
    subtitle: 'Your current emotional state',
    options: [
      { value: 'calm', labelKey: 'pathQuestionnaire.questions.mood.options.calm', label: 'Calm & Peaceful', emoji: '😌' },
      { value: 'anxious', labelKey: 'pathQuestionnaire.questions.mood.options.anxious', label: 'Anxious or Worried', emoji: '😰' },
      { value: 'excited', labelKey: 'pathQuestionnaire.questions.mood.options.excited', label: 'Excited & Energized', emoji: '🤩' },
      { value: 'confused', labelKey: 'pathQuestionnaire.questions.mood.options.confused', label: 'Confused or Lost', emoji: '😕' },
      { value: 'sad', labelKey: 'pathQuestionnaire.questions.mood.options.sad', label: 'Sad or Down', emoji: '😔' },
      { value: 'motivated', labelKey: 'pathQuestionnaire.questions.mood.options.motivated', label: 'Motivated & Ready', emoji: '💪' }
    ]
  },
  {
    id: 'needs',
    questionKey: 'pathQuestionnaire.questions.needs.question',
    question: 'What do you need most today?',
    subtitleKey: 'pathQuestionnaire.questions.needs.subtitle',
    subtitle: 'Your primary intention',
    options: [
      { value: 'clarity', labelKey: 'pathQuestionnaire.questions.needs.options.clarity', label: 'Clarity & Direction', emoji: '🎯' },
      { value: 'growth', labelKey: 'pathQuestionnaire.questions.needs.options.growth', label: 'Personal Growth', emoji: '🌱' },
      { value: 'healing', labelKey: 'pathQuestionnaire.questions.needs.options.healing', label: 'Healing & Processing', emoji: '💚' },
      { value: 'adventure', labelKey: 'pathQuestionnaire.questions.needs.options.adventure', label: 'Adventure & Discovery', emoji: '🗺️' },
      { value: 'peace', labelKey: 'pathQuestionnaire.questions.needs.options.peace', label: 'Peace & Calm', emoji: '🕊️' },
      { value: 'creativity', labelKey: 'pathQuestionnaire.questions.needs.options.creativity', label: 'Creative Expression', emoji: '🎨' }
    ]
  },
  {
    id: 'timeAvailable',
    questionKey: 'pathQuestionnaire.questions.timeAvailable.question',
    question: 'How much time do you have?',
    subtitleKey: 'pathQuestionnaire.questions.timeAvailable.subtitle',
    subtitle: 'For this journaling journey',
    options: [
      { value: '5-mins', labelKey: 'pathQuestionnaire.questions.timeAvailable.options.5mins', label: '5-10 minutes', emoji: '⚡' },
      { value: '15-mins', labelKey: 'pathQuestionnaire.questions.timeAvailable.options.15mins', label: '15-20 minutes', emoji: '⏰' },
      { value: '30-mins', labelKey: 'pathQuestionnaire.questions.timeAvailable.options.30mins', label: '30+ minutes', emoji: '🕐' }
    ]
  },
  {
    id: 'experience',
    questionKey: 'pathQuestionnaire.questions.experience.question',
    question: 'What\'s your journaling experience?',
    subtitleKey: 'pathQuestionnaire.questions.experience.subtitle',
    subtitle: 'Be honest - we\'ll match you perfectly',
    options: [
      { value: 'first-time', labelKey: 'pathQuestionnaire.questions.experience.options.firstTime', label: 'First time journaling', emoji: '🌟' },
      { value: 'beginner', labelKey: 'pathQuestionnaire.questions.experience.options.beginner', label: 'Some experience', emoji: '🌱' },
      { value: 'experienced', labelKey: 'pathQuestionnaire.questions.experience.options.experienced', label: 'Regular journaler', emoji: '🎓' }
    ]
  },
  {
    id: 'focus',
    questionKey: 'pathQuestionnaire.questions.focus.question',
    question: 'What\'s your current life focus?',
    subtitleKey: 'pathQuestionnaire.questions.focus.subtitle',
    subtitle: 'What matters most right now',
    options: [
      { value: 'career', labelKey: 'pathQuestionnaire.questions.focus.options.career', label: 'Career & Purpose', emoji: '💼' },
      { value: 'relationships', labelKey: 'pathQuestionnaire.questions.focus.options.relationships', label: 'Relationships', emoji: '❤️' },
      { value: 'self-discovery', labelKey: 'pathQuestionnaire.questions.focus.options.selfDiscovery', label: 'Self-Discovery', emoji: '🔍' },
      { value: 'mental-health', labelKey: 'pathQuestionnaire.questions.focus.options.mentalHealth', label: 'Mental Health', emoji: '🧠' },
      { value: 'creativity', labelKey: 'pathQuestionnaire.questions.focus.options.creativity', label: 'Creativity & Expression', emoji: '🎨' },
      { value: 'spirituality', labelKey: 'pathQuestionnaire.questions.focus.options.spirituality', label: 'Spirituality', emoji: '✨' }
    ]
  }
];

const PathQuestionnaire = ({ onComplete, onCancel }) => {
  const { t } = useTranslation('paths');
  const { userProfile } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const containerRef = useRef(null);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;
  const canGoBack = currentQuestionIndex > 0;

  // Scroll to top when question changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentQuestionIndex]);

  const handleOptionSelect = (value) => {
    setSelectedOption(value);
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));

    // Auto-advance after brief delay for visual feedback
    setTimeout(() => {
      if (isLastQuestion) {
        handleComplete(value);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
      }
    }, 300);
  };

  const handleComplete = async (lastAnswer) => {
    setIsLoading(true);
    try {
      const finalAnswers = {
        ...answers,
        [currentQuestion.id]: lastAnswer
      };

      const recommendation = await getQuestionnaireRecommendation(userProfile, finalAnswers);
      onComplete(recommendation);
    } catch (error) {
      console.error('Error getting recommendation:', error);
      // Still call onComplete with error so parent can handle it
      onComplete(null, error);
    }
  };

  const handleBack = () => {
    if (canGoBack) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
    }
  };

  if (isLoading) {
    return (
      <div className="questionnaire-container questionnaire-loading-container" ref={containerRef}>
        <KairosLoader
          fullScreen={false}
          size="large"
          message={t('pathQuestionnaire.loading.message', 'Finding Your Perfect Path')}
          subMessage={t('pathQuestionnaire.loading.subMessage', 'Analyzing your answers...')}
          variant="detailed"
        />
      </div>
    );
  }

  // Safety check: if currentQuestion is undefined, return null
  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="questionnaire-container">
      {/* Pinned top — stays fixed while options scroll */}
      <div className="qn-top">
      {/* Header */}
      <div className="qn-header">
        <div className="qn-brand">
          <span className="qn-brand-icon"><Sparkles size={15} /></span>
          {t('pathQuestionnaire.brand', 'Find your path')}
        </div>
        <button className="qn-close" onClick={onCancel} aria-label={t('pathQuestionnaire.closeAriaLabel', 'Close')}>
          <X size={18} />
        </button>
      </div>

      {/* Progress */}
      <div className="qn-progress">
        <div className="qn-progress-head">
          <span className="qn-step-label">
            {t('pathQuestionnaire.stepLabel', 'Question {{current}} of {{total}}', { current: currentQuestionIndex + 1, total: QUESTIONS.length })}
          </span>
          <span className="qn-percent">{Math.round(progress)}%</span>
        </div>
        <div className="qn-dots">
          {QUESTIONS.map((q, i) => (
            <span
              key={q.id}
              className={`qn-dot ${i < currentQuestionIndex ? 'done' : ''} ${i === currentQuestionIndex ? 'current' : ''}`}
            />
          ))}
        </div>
      </div>
      </div>

      {/* Scrollable question area */}
      <div className="qn-scroll" ref={containerRef}>
      {/* Question Content */}
      <div className="questionnaire-content" key={currentQuestionIndex}>
        <div className="question-header">
          <h2 className="question-title">{t(currentQuestion.questionKey, currentQuestion.question)}</h2>
          <p className="question-subtitle">{t(currentQuestion.subtitleKey, currentQuestion.subtitle)}</p>
        </div>

        <div className="options-grid">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              className={`option-card ${selectedOption === option.value ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(option.value)}
            >
              <span className="option-emoji">{option.emoji}</span>
              <span className="option-label">{t(option.labelKey, option.label)}</span>
              {selectedOption === option.value && (
                <ArrowRight className="option-arrow" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      {canGoBack && (
        <div className="questionnaire-footer">
          <button className="nav-button back-button" onClick={handleBack}>
            <ArrowLeft className="button-icon" />
            {t('pathQuestionnaire.back', 'Back')}
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default PathQuestionnaire;
