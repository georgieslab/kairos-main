// src/components/analytics/DailyReflection.jsx - Glass Edition
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useUserStatistics } from '../../hooks/useUserStatistics';
import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import '../../styles/components/appleGlassNav.css';

const DailyReflection = () => {
  const { t } = useTranslation('analytics');
  const { userProfile } = useAuth();
  const { statistics } = useUserStatistics();

  const REFLECTIONS = [
    t('dailyReflection.prompts.grateful', "Take a moment to notice one thing you're grateful for today."),
    t('dailyReflection.prompts.emotionThisWeek', 'What emotion has been most present for you this week?'),
    t('dailyReflection.prompts.adviceToPastSelf', 'If you could give advice to your past self, what would it be?'),
    t('dailyReflection.prompts.challengePattern', 'What pattern do you notice in how you respond to challenges?'),
    t('dailyReflection.prompts.doDifferently', "What's one small thing you could do differently tomorrow?"),
    t('dailyReflection.prompts.dailyJoy', 'What brings you the most joy in your daily routine?'),
    t('dailyReflection.prompts.prioritiesShift', 'How have your priorities shifted since you started journaling?')
  ];

  const [currentReflection, setCurrentReflection] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Pick a random reflection on mount
    const randomIndex = Math.floor(Math.random() * REFLECTIONS.length);
    setCurrentReflection({
      text: REFLECTIONS[randomIndex],
      index: randomIndex
    });
  }, []);

  const generateNewReflection = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      // Pick a different reflection
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * REFLECTIONS.length);
      } while (newIndex === currentReflection?.index && REFLECTIONS.length > 1);
      
      setCurrentReflection({
        text: REFLECTIONS[newIndex],
        index: newIndex
      });
    } catch (error) {
      console.error('Error generating reflection:', error);
    } finally {
      setTimeout(() => setIsGenerating(false), 300);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      await generateNewReflection();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  if (statistics.totalEntries < 3) return null;

  return (
    <div className="glass-reflection-card">
      <div className="reflection-header">
        <div className="reflection-icon-wrap">
          <Sparkles size={16} />
        </div>
        <div className="reflection-header-text">
          <h3>{t('dailyReflection.title', 'Daily Reflection')}</h3>
          <p>{t('dailyReflection.basedOnEntries', 'Based on your {{count}} journal entries', { count: statistics.totalEntries })}</p>
        </div>
        <button
          onClick={handleRefresh}
          className="reflection-refresh"
          disabled={isRefreshing}
          aria-label={t('dailyReflection.getNewReflection', 'Get new reflection')}
        >
          <RefreshCw size={14} className={isRefreshing ? 'spin' : ''} />
        </button>
      </div>

      <div className="reflection-content">
        {isGenerating ? (
          <div className="reflection-loading">
            <div className="reflection-loading-dots">
              <div className="reflection-dot" />
              <div className="reflection-dot" />
              <div className="reflection-dot" />
            </div>
          </div>
        ) : (
          <p className="reflection-text">
            "{currentReflection?.text}"
          </p>
        )}
      </div>

      <button 
        className="reflection-cta"
        onClick={() => {
          // Navigate to upload/write
        }}
      >
        <span>{t('dailyReflection.writeNow', 'Write Now')}</span>
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default DailyReflection;