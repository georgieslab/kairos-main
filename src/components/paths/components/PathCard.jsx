// src/components/paths/components/PathCard.jsx - Updated for direct approach
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

const PathCard = ({
  pathId,
  title,
  subtitle,
  description,
  icon: Icon,
  days,
  progress,
  onShowDetails,
  onSelectDay,
  onContinue,
  currentDay,
  hasStarted
}) => {
  const [showDays, setShowDays] = useState(false);
  
  // Calculate completion percentage
  const completedDays = progress?.completedDays || [];
  const completionPercentage = (completedDays.length / 10) * 100;
  
  // Determine which days are completed and unlocked
  const isDayCompleted = (day) => completedDays.includes(day);
  
  const isDayUnlocked = (day) => {
    // First day is always unlocked
    if (day === 1) return true;
    
    // If no completed days, only day 1 is unlocked
    if (completedDays.length === 0) return false;
    
    // Otherwise, check if a day is unlocked based on progress
    const maxCompletedDay = Math.max(...completedDays);
    return day <= maxCompletedDay + 1;
  };
  
  // Toggle showing days
  const toggleDays = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDays(!showDays);
  };
  
  // Handle continue button click with debugging
  const handleContinueClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('[CARD] Continue button clicked for path:', pathId);
    console.log('[CARD] Current day:', currentDay);
    console.log('[CARD] Has started:', hasStarted);
    console.log('[CARD] Completed days:', completedDays);
    
    // Direct call to continue handler - no additional params needed
    onContinue(pathId);
  };
  
  return (
    <div className={`path-card ${pathId}`}>
      <div className="path-card-header">
        <div className="path-icon-wrapper">
          <Icon className="path-icon" />
        </div>
        <div className="path-title-container">
          <h3 className="path-card-title">{title}</h3>
          <p className="path-card-subtitle">{subtitle}</p>
        </div>
      </div>
      
      <p className="path-card-description">{description}</p>
      
      {/* Progress bar */}
      <div className="path-progress-container">
        <div className="path-progress-bar">
          <div 
            className="path-progress-fill"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="path-progress-text">
          {completedDays.length} of 10 days completed
        </div>
      </div>
      
      {/* Day pills - shown when expanded */}
      {showDays && (
        <div className="day-pills-container">
          {(days || Array(10).fill({})).map((_, index) => {
            const dayNumber = index + 1;
            const completed = isDayCompleted(dayNumber);
            const unlocked = isDayUnlocked(dayNumber);
            
            return (
              <button
                key={dayNumber}
                onClick={() => unlocked && onSelectDay(pathId, dayNumber)}
                className={`day-pill ${completed ? 'completed' : ''} ${!unlocked ? 'locked' : ''} ${dayNumber === currentDay ? 'current' : ''}`}
                disabled={!unlocked}
              >
                {completed ? (
                  <Check className="day-check-icon" />
                ) : (
                  dayNumber
                )}
              </button>
            );
          })}
        </div>
      )}
      
      {/* Action buttons */}
      <div className="path-card-actions">
        <button
          onClick={(e) => {
            e.preventDefault();
            onShowDetails(pathId);
          }}
          className="path-action-button secondary"
        >
          Details
        </button>
        
        <button
          onClick={handleContinueClick}
          className="path-action-button primary"
          data-testid={`continue-${pathId}`}
        >
          {hasStarted ? 'Continue Journey' : 'Start Journey'}
        </button>
        
        <button
          onClick={toggleDays}
          className="path-toggle-button"
          aria-expanded={showDays}
        >
          {showDays ? (
            <ChevronUp className="path-toggle-icon" />
          ) : (
            <ChevronDown className="path-toggle-icon" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PathCard;