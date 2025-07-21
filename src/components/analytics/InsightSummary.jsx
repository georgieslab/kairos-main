// src/components/analytics/InsightSummary.jsx

import React from 'react';
import { 
  Lightbulb, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Target,
  AlertCircle,
  Heart,
  Book
} from 'lucide-react';

/**
 * Displays AI-generated insights from journal entries
 * @param {Array} entries - Journal entries data
 * @param {Object} progressReport - Progress report with insights
 */
const InsightSummary = ({ entries, progressReport }) => {
  // If no data, show a message
  if (!entries || entries.length === 0) {
    return (
      <div className="insight-empty-state">
        <AlertCircle className="empty-state-icon" />
        <p className="empty-state-message">
          Add journal entries to generate insights
        </p>
      </div>
    );
  }
  
  // If no progress report, show limited insights
  if (!progressReport) {
    return (
      <div className="insight-summary-container">
        <div className="insight-header">
          <Sparkles className="insight-header-icon" />
          <h3 className="insight-title">Journal Insights</h3>
        </div>
        
        <div className="insight-limited">
          <p className="limited-message">
            Complete more journal entries to unlock advanced insights.
          </p>
          
          <div className="basic-insights">
            <div className="basic-insight">
              <Book className="basic-insight-icon" />
              <p className="basic-insight-text">
                You've written {entries.length} journal {entries.length === 1 ? 'entry' : 'entries'} so far. Keep going!
              </p>
            </div>
            
            {entries.length >= 3 && (
              <div className="basic-insight">
                <TrendingUp className="basic-insight-icon" />
                <p className="basic-insight-text">
                  Your journaling consistency is building a foundation for valuable self-reflection.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Function to get icon based on insight type
  const getInsightIcon = (type) => {
    switch(type) {
      case 'progress': return <Target size={18} />;
      case 'emotion': return <Heart size={18} />;
      case 'theme': return <Book size={18} />;
      case 'growth': return <TrendingUp size={18} />;
      default: return <Lightbulb size={18} />;
    }
  };
  
  // With progress report, show full insights
  return (
    <div className="insight-summary-container">
      <div className="insight-header">
        <Sparkles className="insight-header-icon" />
        <h3 className="insight-title">AI-Generated Insights</h3>
      </div>
      
      <div className="insight-content">
        {/* Completion rate insight */}
        <div className="insight-item">
          <div className="insight-icon-container">
            <Target className="insight-icon" />
          </div>
          <div className="insight-text-container">
            <h4 className="insight-item-title">Journey Progress</h4>
            <p className="insight-text">
              {progressReport.completionRate < 30 && 
                `You're at the beginning of your journaling journey, with ${progressReport.completionRate}% completion.`}
              {progressReport.completionRate >= 30 && progressReport.completionRate < 70 && 
                `You're making good progress in your journaling journey, with ${progressReport.completionRate}% completion.`}
              {progressReport.completionRate >= 70 && 
                `You're nearing completion of your journaling journey, with ${progressReport.completionRate}% completion.`}
            </p>
          </div>
        </div>
        
        {/* Common themes insight */}
        {progressReport.commonThemes && progressReport.commonThemes.length > 0 && (
          <div className="insight-item">
            <div className="insight-icon-container">
              <Book className="insight-icon" />
            </div>
            <div className="insight-text-container">
              <h4 className="insight-item-title">Recurring Themes</h4>
              <p className="insight-text">
                Your journal often focuses on 
                <span className="highlight-text"> {progressReport.commonThemes.slice(0, 3).join(', ')}</span>
                {progressReport.commonThemes.length > 3 && ' and other themes'}.
              </p>
            </div>
          </div>
        )}
        
        {/* Emotional patterns insight */}
        {progressReport.emotionalInsight && (
          <div className="insight-item">
            <div className="insight-icon-container">
              <Heart className="insight-icon" />
            </div>
            <div className="insight-text-container">
              <h4 className="insight-item-title">Emotional Patterns</h4>
              <p className="insight-text">
                {progressReport.emotionalInsight}
              </p>
            </div>
          </div>
        )}
        
        {/* Growth areas insight */}
        {progressReport.growthAreas && progressReport.growthAreas.length > 0 && (
          <div className="insight-item">
            <div className="insight-icon-container">
              <TrendingUp className="insight-icon" />
            </div>
            <div className="insight-text-container">
              <h4 className="insight-item-title">Growth Opportunities</h4>
              <p className="insight-text">
                {progressReport.growthAreas[0]}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Recommendation section */}
      {progressReport.recommendation && (
        <div className="recommendation-container">
          <div className="recommendation-header">
            <Lightbulb className="recommendation-icon" />
            <h4 className="recommendation-title">Personalized Recommendation</h4>
          </div>
          
          <p className="recommendation-text">
            {progressReport.recommendation}
          </p>
          
          {/* Next steps if available */}
          {progressReport.nextSteps && progressReport.nextSteps.length > 0 && (
            <div className="next-steps">
              <h5 className="next-steps-title">Try these next:</h5>
              <ul className="next-steps-list">
                {progressReport.nextSteps.slice(0, 2).map((step, index) => (
                  <li key={index} className="next-step-item">
                    <span className="next-step-arrow"><ArrowRight size={14} /></span>
                    <span className="next-step-text">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InsightSummary;