import React from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const PathDaysList = ({ days, completedDays = [], currentDay, onSelectDay, pathId }) => {
  const isDayCompleted = (day) => {
    return (completedDays || []).includes(day);
  };
  
  return (
    <div className="journey-days-list">
      {days.map((day) => (
        <div 
          key={day.day} 
          className={`day-item ${isDayCompleted(day.day) ? 'completed' : ''} ${currentDay === day.day ? 'current' : ''}`}
          onClick={() => onSelectDay(pathId, day.day)}
        >
          <div className="day-number">
            {isDayCompleted(day.day) && (
              <CheckCircle className="day-completed-icon" />
            )}
            Day {day.day}
          </div>
          <div className="day-content">
            <div className="day-title">{day.title}</div>
            <div className="day-theme">{day.theme}</div>
          </div>
          <ArrowRight className="day-arrow-icon" />
        </div>
      ))}
    </div>
  );
};

export default PathDaysList;