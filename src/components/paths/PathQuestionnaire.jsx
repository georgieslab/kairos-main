// src/components/paths/PathQuestionnaire.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getQuestionnaireRecommendation } from '../../services/pathRecommender';
import { Sparkles, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import KairosLoader from '../common/KairosLoader';
import '../../styles/components/pathQuestionnaire.css';

const QUESTIONS = [
  {
    id: 'mood',
    question: 'How are you feeling right now?',
    subtitle: 'Your current emotional state',
    options: [
      { value: 'calm', label: 'Calm & Peaceful', emoji: '😌' },
      { value: 'anxious', label: 'Anxious or Worried', emoji: '😰' },
      { value: 'excited', label: 'Excited & Energized', emoji: '🤩' },
      { value: 'confused', label: 'Confused or Lost', emoji: '😕' },
      { value: 'sad', label: 'Sad or Down', emoji: '😔' },
      { value: 'motivated', label: 'Motivated & Ready', emoji: '💪' }
    ]
  },
  {
    id: 'needs',
    question: 'What do you need most today?',
    subtitle: 'Your primary intention',
    options: [
      { value: 'clarity', label: 'Clarity & Direction', emoji: '🎯' },
      { value: 'growth', label: 'Personal Growth', emoji: '🌱' },
      { value: 'healing', label: 'Healing & Processing', emoji: '💚' },
      { value: 'adventure', label: 'Adventure & Discovery', emoji: '🗺️' },
      { value: 'peace', label: 'Peace & Calm', emoji: '🕊️' },
      { value: 'creativity', label: 'Creative Expression', emoji: '🎨' }
    ]
  },
  {
    id: 'timeAvailable',
    question: 'How much time do you have?',
    subtitle: 'For this journaling journey',
    options: [
      { value: '5-mins', label: '5-10 minutes', emoji: '⚡' },
      { value: '15-mins', label: '15-20 minutes', emoji: '⏰' },
      { value: '30-mins', label: '30+ minutes', emoji: '🕐' }
    ]
  },
  {
    id: 'experience',
    question: 'What\'s your journaling experience?',
    subtitle: 'Be honest - we\'ll match you perfectly',
    options: [
      { value: 'first-time', label: 'First time journaling', emoji: '🌟' },
      { value: 'beginner', label: 'Some experience', emoji: '🌱' },
      { value: 'experienced', label: 'Regular journaler', emoji: '🎓' }
    ]
  },
  {
    id: 'focus',
    question: 'What\'s your current life focus?',
    subtitle: 'What matters most right now',
    options: [
      { value: 'career', label: 'Career & Purpose', emoji: '💼' },
      { value: 'relationships', label: 'Relationships', emoji: '❤️' },
      { value: 'self-discovery', label: 'Self-Discovery', emoji: '🔍' },
      { value: 'mental-health', label: 'Mental Health', emoji: '🧠' },
      { value: 'creativity', label: 'Creativity & Expression', emoji: '🎨' },
      { value: 'spirituality', label: 'Spirituality', emoji: '✨' }
    ]
  }
];

const PathQuestionnaire = ({ onComplete, onCancel }) => {
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
          message="Finding Your Perfect Path"
          subMessage="Analyzing your answers..."
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
    <div className="questionnaire-container" ref={containerRef}>
      {/* Progress Bar */}
      <div className="questionnaire-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="progress-text">
          Question {currentQuestionIndex + 1} of {QUESTIONS.length}
        </div>
      </div>

      {/* Question Content */}
      <div className="questionnaire-content" key={currentQuestionIndex}>
        <div className="question-header">
          <h2 className="question-title">{currentQuestion.question}</h2>
          <p className="question-subtitle">{currentQuestion.subtitle}</p>
        </div>

        <div className="options-grid">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              className={`option-card ${selectedOption === option.value ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(option.value)}
            >
              <span className="option-emoji">{option.emoji}</span>
              <span className="option-label">{option.label}</span>
              {selectedOption === option.value && (
                <ArrowRight className="option-arrow" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="questionnaire-footer">
        {canGoBack && (
          <button className="nav-button back-button" onClick={handleBack}>
            <ArrowLeft className="button-icon" />
            Back
          </button>
        )}
        <button className="nav-button cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PathQuestionnaire;
