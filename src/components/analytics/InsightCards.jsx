// src/components/analytics/InsightCards.jsx - Glass Edition
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Lightbulb, TrendingUp, Heart, Target, ArrowRight } from 'lucide-react';
import '../../styles/components/appleGlassNav.css';

const INSIGHT_ICONS = {
  growth: TrendingUp,
  emotion: Heart,
  action: Target,
  reflection: Lightbulb
};

const InsightCards = ({ entries, totalEntries }) => {
  const { t } = useTranslation('analytics');
  // Extract recent insights from entries
  const recentEntries = entries.slice(-5).filter(e => e.analysis?.summary);
  
  if (recentEntries.length === 0) return null;

  // Get the most valuable insights
  const insights = recentEntries.map(entry => {
    const insights = entry.analysis?.insights || [];
    const summary = entry.analysis?.summary;
    
    // Get first non-empty insight or summary
    const insight = insights[0] || summary;
    
    if (!insight) return null;

    // Determine type based on content
    let type = 'reflection';
    if (insight.toLowerCase().includes('grow') || insight.toLowerCase().includes('progress')) type = 'growth';
    else if (insight.toLowerCase().includes('feel') || insight.toLowerCase().includes('emotion')) type = 'emotion';
    else if (insight.toLowerCase().includes('try') || insight.toLowerCase().includes('recommend')) type = 'action';
    
    return {
      id: `${entry.day}-${entry.pathId}`,
      type,
      text: insight.length > 120 ? insight.substring(0, 117) + '...' : insight,
      day: entry.day,
      pathId: entry.pathId
    };
  }).filter(Boolean);

  const handleViewEntry = (pathId, day) => {
    // Navigate to that specific entry
    console.log('Navigate to:', pathId, day);
  };

  if (insights.length === 0) return null;

  return (
    <div className="insight-cards-list">
      {insights.map((insight, index) => {
        const Icon = INSIGHT_ICONS[insight.type] || Lightbulb;
        
        return (
          <button
            key={insight.id}
            className="glass-insight-card"
            onClick={() => handleViewEntry(insight.pathId, insight.day)}
          >
            <div className="insight-icon-wrap">
              <Icon size={16} />
            </div>
            <div className="insight-content">
              <p className="insight-text">"{insight.text}"</p>
              <div className="insight-meta">
                <span className="insight-day">{t('insightCards.day', 'Day {{day}}', { day: insight.day })}</span>
                <ArrowRight size={14} className="insight-arrow" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default InsightCards;