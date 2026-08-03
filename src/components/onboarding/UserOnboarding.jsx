// src/components/onboarding/UserOnboarding.jsx

import React, { useState, useEffect } from 'react';
import { BookOpen, Camera, Sparkles, Calendar, Bell, Settings, ChevronLeft, ChevronRight, Check, Mic, Palette, Smartphone, User, Compass, PenTool, Heart, Brain, Zap, BookMarked, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import claudeLogo from '../../icons/claude.png';
import '../../styles/components/onboarding.css';

const UserOnboarding = ({ onComplete }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    userName: currentUser?.displayName || '',
    enableNotifications: true,
    reminderTime: '20:00',
    journalingGoals: [],
    preferredModality: 'text',
    selectedPaths: []
  });

  // Sample journey paths for preview
  const samplePaths = [
    { 
      id: 'self-discovery', 
      name: 'Self-Discovery', 
      duration: 10, 
      type: 'text',
      category: 'Foundational',
      description: 'Transform your values, fears, and aspirations',
      icon: <Compass />
    },
    { 
      id: 'anxiety-alchemy', 
      name: 'Anxiety Alchemy', 
      duration: 10, 
      type: 'text',
      category: 'Emotional',
      description: 'Transform anxiety into wisdom and strength',
      icon: <Heart />
    },
    { 
      id: 'voice-discovery', 
      name: 'Voice Discovery', 
      duration: 10, 
      type: 'voice',
      category: 'Voice',
      description: 'Find your authentic voice through spoken reflection',
      icon: <Mic />,
      isNew: true
    },
    { 
      id: 'mindful-visualization', 
      name: 'Mindful Art', 
      duration: 33, 
      type: 'visual',
      category: 'Visual',
      description: 'Express yourself through drawing and painting',
      icon: <Palette />
    },
    { 
      id: 'inner-elements', 
      name: 'Inner Elements', 
      duration: 9, 
      type: 'multi',
      category: 'Multi-Modal',
      description: 'Explore earth, water, fire, air through all modalities',
      icon: <Zap />,
      isSpecial: true
    },
    {
      id: 'transformation-journey',
      name: '4-Day Breakthrough',
      duration: 4,
      type: 'text',
      category: 'Intensive',
      description: 'Rapid pattern-breaking transformation',
      icon: <Brain />
    }
  ];

  // Example insights for showcase
  const exampleInsights = {
    emotional: "I notice you're expressing more confidence in your decisions compared to Day 1. Your writing shows clearer boundaries.",
    pattern: "You mention 'not enough time' in 3 of your last 5 entries. This might be a key stress pattern to explore.",
    growth: "Your shift from 'I have to' to 'I choose to' shows you're reclaiming your personal agency."
  };

  // Onboarding steps content
  const steps = [
    {
      title: `Welcome to Καιρός`,
      description: "Let's personalize your transformative journaling experience. What should we call you?",
      icon: <User />,
      hasPreference: true,
      preferenceType: 'name'
    },
    {
      title: "Your Smart Journal",
      description: "Your premium NFC-enabled journal instantly connects to our app. Just tap your phone to begin each session—bridging the timeless practice of handwriting with AI insights.",
      icon: <Smartphone />,
      hasNFC: true
    },
    {
      title: "Express Your Way",
      description: "Καιρός is the only journaling system supporting all three modalities. Choose how you want to express yourself today.",
      icon: <Compass />,
      hasPreference: true,
      preferenceType: 'modality'
    },
    {
      title: "45 Transformative Paths",
      description: "From 4-day breakthroughs to 100-day transformations. Each journey is crafted for specific growth areas.",
      icon: <BookOpen />,
      hasPreference: true,
      preferenceType: 'pathPreview'
    },
    {
      title: "AI That Understands You",
      description: "Claude AI analyzes your entries across all modalities, revealing patterns and insights you might miss.",
      icon: <Sparkles />,
      hasExample: true
    },
    {
      title: "Daily Gentle Nudges",
      description: `Great job personalizing, ${preferences.userName || 'there'}! Would you like daily reminders for your journaling practice?`,
      icon: <Bell />,
      hasPreference: true,
      preferenceType: 'notifications'
    },
    {
      title: "Your Growth Goals",
      description: "Tell us what you're seeking, and we'll recommend the perfect journey paths from our collection of 45.",
      icon: <Settings />,
      hasPreference: true,
      preferenceType: 'goals'
    }
  ];

  // Handle preference changes
  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle journaling goal selection
  const handleGoalToggle = (goal) => {
    const newGoals = [...preferences.journalingGoals];
    
    if (newGoals.includes(goal)) {
      const index = newGoals.indexOf(goal);
      newGoals.splice(index, 1);
    } else {
      newGoals.push(goal);
    }
    
    setPreferences(prev => ({
      ...prev,
      journalingGoals: newGoals
    }));
  };

  // Handle path interest
  const handlePathInterest = (pathId) => {
    const newPaths = [...preferences.selectedPaths];
    
    if (newPaths.includes(pathId)) {
      const index = newPaths.indexOf(pathId);
      newPaths.splice(index, 1);
    } else {
      newPaths.push(pathId);
    }
    
    setPreferences(prev => ({
      ...prev,
      selectedPaths: newPaths
    }));
  };

  // Get recommended paths based on goals
  const getRecommendedPaths = () => {
    const recommendations = [];
    
    if (preferences.journalingGoals.includes('Anxiety & stress')) {
      recommendations.push('anxiety-alchemy');
    }
    if (preferences.journalingGoals.includes('Self-discovery')) {
      recommendations.push('self-discovery');
    }
    if (preferences.journalingGoals.includes('Creative expression')) {
      recommendations.push('mindful-visualization', 'voice-discovery');
    }
    if (preferences.journalingGoals.includes('Quick breakthrough')) {
      recommendations.push('transformation-journey');
    }
    
    return recommendations;
  };

  // Handle completion of onboarding
  const handleFinish = async () => {
    try {
      if (currentUser) {
        await updateUserProfile({
          displayName: preferences.userName || currentUser.displayName,
          hasCompletedOnboarding: true,
          settings: {
            enableNotifications: preferences.enableNotifications,
            reminderTime: preferences.reminderTime,
            preferredModality: preferences.preferredModality,
            lastUpdated: new Date().toISOString()
          },
          journalingGoals: preferences.journalingGoals,
          interestedPaths: preferences.selectedPaths
        });
      }
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving onboarding preferences:', error);
    }
  };

  // Handle navigation between steps
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const recommendedPaths = getRecommendedPaths();

  return (
    <div className="onboarding-container">
      <div className="onboarding-main">
        <div className="onboarding-content">
          {/* Progress Indicator */}
          <div className="onboarding-progress">
            <div className="onboarding-progress-dots">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`onboarding-progress-dot ${
                    index < currentStep ? 'completed' : ''
                  } ${
                    index === currentStep ? 'active' : ''
                  }`}
                ></div>
              ))}
            </div>
            <div className="onboarding-progress-text">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          
          {/* Content Card */}
          <div className="onboarding-card">
            {/* Icon */}
            <div className="onboarding-icon-wrapper">
              {React.cloneElement(steps[currentStep].icon, { className: 'onboarding-icon' })}
            </div>
            
            {/* Title */}
            <h2 className="onboarding-title">
              {steps[currentStep].title}
            </h2>
            
            {/* Description */}
            <p className="onboarding-description">
              {steps[currentStep].description}
            </p>
            
            {/* NFC Feature Showcase */}
            {steps[currentStep].hasNFC && (
              <div className="onboarding-nfc-showcase">
                <div className="onboarding-nfc-demo">
                  <div className="nfc-phone"><Smartphone size={30} strokeWidth={1.6} aria-hidden="true" /></div>
                  <div className="nfc-signal">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="nfc-journal"><BookMarked size={30} strokeWidth={1.6} aria-hidden="true" /></div>
                </div>
                <p className="onboarding-nfc-text">Tap to Connect • Write to Reflect • AI to Understand</p>
              </div>
            )}

            {/* Modality Selection */}
            {steps[currentStep].preferenceType === 'modality' && (
              <div className="onboarding-modality-grid">
                <button
                  onClick={() => handlePreferenceChange('preferredModality', 'text')}
                  className={`onboarding-modality-card ${preferences.preferredModality === 'text' ? 'selected' : ''}`}
                >
                  <PenTool className="modality-icon" />
                  <h4>Written</h4>
                  <p>Traditional handwritten journaling with AI text analysis</p>
                </button>
                <button
                  onClick={() => handlePreferenceChange('preferredModality', 'voice')}
                  className={`onboarding-modality-card ${preferences.preferredModality === 'voice' ? 'selected' : ''}`}
                >
                  <Mic className="modality-icon" />
                  <h4>Voice</h4>
                  <p>Speak your thoughts with live transcription</p>
                  <span className="modality-badge">NEW</span>
                </button>
                <button
                  onClick={() => handlePreferenceChange('preferredModality', 'visual')}
                  className={`onboarding-modality-card ${preferences.preferredModality === 'visual' ? 'selected' : ''}`}
                >
                  <Palette className="modality-icon" />
                  <h4>Visual</h4>
                  <p>Express through art, colors, and drawings</p>
                </button>
              </div>
            )}

            {/* Path Preview */}
            {steps[currentStep].preferenceType === 'pathPreview' && (
              <div className="onboarding-paths-preview">
                <div className="onboarding-paths-scroll">
                  {samplePaths.map(path => (
                    <div
                      key={path.id}
                      className={`onboarding-path-card ${
                        preferences.selectedPaths.includes(path.id) ? 'interested' : ''
                      } ${
                        recommendedPaths.includes(path.id) ? 'recommended' : ''
                      }`}
                      onClick={() => handlePathInterest(path.id)}
                    >
                      <div className="path-card-header">
                        <div className={`path-icon-circle ${path.type}`}>
                          {path.icon}
                        </div>
                        <div className="path-duration">{path.duration} days</div>
                      </div>
                      <h4>{path.name}</h4>
                      <p className="path-description">{path.description}</p>
                      <div className="path-badges">
                        <span className={`path-type-badge ${path.type}`}>
                          {path.category}
                        </span>
                        {path.isNew && <span className="path-new-badge">NEW</span>}
                        {path.isSpecial && <span className="path-special-badge">UNIQUE</span>}
                        {recommendedPaths.includes(path.id) && (
                          <span className="path-recommended-badge">For You</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="onboarding-paths-note">
                  Click paths you're interested in • View all 45 paths after setup
                </p>
              </div>
            )}
            
            {/* Example Insights */}
            {steps[currentStep].hasExample && (
              <div className="onboarding-insights-preview">
                <div className="insight-card">
                  <div className="insight-type">Emotional Pattern</div>
                  <p className="insight-text">{exampleInsights.emotional}</p>
                </div>
                <div className="insight-card">
                  <div className="insight-type">Recurring Theme</div>
                  <p className="insight-text">{exampleInsights.pattern}</p>
                </div>
                <div className="insight-card">
                  <div className="insight-type">Growth Marker</div>
                  <p className="insight-text">{exampleInsights.growth}</p>
                </div>
                
                {/* Powered by Claude AI */}
                <div className="onboarding-powered-by">
                  <img 
                    src={claudeLogo} 
                    alt="Claude AI" 
                    className="onboarding-claude-logo"
                  />
                  <span className="onboarding-powered-text">
                    Powered by Claude AI (Sonnet 4 & Opus 4)
                  </span>
                </div>
              </div>
            )}

            {/* Name Input */}
            {steps[currentStep].preferenceType === 'name' && (
              <div className="onboarding-name-input-wrapper">
                <input
                  type="text"
                  className="onboarding-name-input"
                  placeholder="Your first name..."
                  value={preferences.userName}
                  onChange={(e) => handlePreferenceChange('userName', e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && preferences.userName) {
                      goToNextStep();
                    }
                  }}
                  autoFocus
                />
                <p className="onboarding-privacy-note">
                  <Lock size={14} strokeWidth={1.7} aria-hidden="true" /> Your privacy matters. This is only for personalization.
                </p>
              </div>
            )}
            
            {/* Notifications Preference */}
            {steps[currentStep].preferenceType === 'notifications' && (
              <div className="onboarding-preferences">
                <div className="onboarding-preference-item">
                  <span className="onboarding-preference-label">Enable daily reminders</span>
                  <label className="onboarding-toggle">
                    <input
                      type="checkbox"
                      className="onboarding-toggle-input"
                      checked={preferences.enableNotifications}
                      onChange={() => handlePreferenceChange(
                        'enableNotifications', 
                        !preferences.enableNotifications
                      )}
                    />
                    <div className="onboarding-toggle-slider"></div>
                  </label>
                </div>
                
                {preferences.enableNotifications && (
                  <div className="onboarding-time-input-wrapper">
                    <label className="onboarding-time-label">
                      When's your ideal journaling time?
                    </label>
                    <input
                      type="time"
                      className="onboarding-time-input"
                      value={preferences.reminderTime}
                      onChange={(e) => handlePreferenceChange('reminderTime', e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* Goals Selection */}
            {steps[currentStep].preferenceType === 'goals' && (
              <div className="onboarding-goals-section">
                <p className="onboarding-goals-header">Select all that resonate with you:</p>
                
                <div className="onboarding-goals-grid">
                  {[
                    'Self-discovery',
                    'Anxiety & stress',
                    'Personal growth',
                    'Creative expression',
                    'Emotional healing',
                    'Gratitude practice',
                    'Career clarity',
                    'Relationship insights',
                    'Life transitions',
                    'Quick breakthrough',
                    'Shadow work',
                    'Voice confidence'
                  ].map(goal => (
                    <button
                      key={goal}
                      onClick={() => handleGoalToggle(goal)}
                      className={`onboarding-goal-button ${
                        preferences.journalingGoals.includes(goal) ? 'selected' : ''
                      }`}
                    >
                      <span className="onboarding-goal-text">{goal}</span>
                      <Check className="onboarding-goal-check" />
                    </button>
                  ))}
                </div>
                
                {preferences.journalingGoals.length > 0 && (
                  <div className="onboarding-recommendation-note">
                    <Sparkles size={14} strokeWidth={1.7} aria-hidden="true" /> We'll recommend specific paths based on your selections
                  </div>
                )}
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="onboarding-navigation">
              <button
                onClick={goToPreviousStep}
                className={`onboarding-button onboarding-button-back ${currentStep === 0 ? 'hidden' : ''}`}
              >
                <ChevronLeft className="onboarding-button-icon" />
                Back
              </button>
              
              <button
                onClick={goToNextStep}
                className={`onboarding-button onboarding-button-next ${
                  currentStep === 0 && !preferences.userName ? 'disabled' : ''
                }`}
                disabled={currentStep === 0 && !preferences.userName}
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    Start My Journey
                    <Sparkles className="onboarding-button-icon" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="onboarding-button-icon" />
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Skip Button */}
          {currentStep < steps.length - 1 && (
            <div className="onboarding-skip-wrapper">
              <button
                onClick={handleFinish}
                className="onboarding-skip-button"
              >
                Skip for now
              </button>
            </div>
          )}
        </div>
      </div>
      
      <footer className="onboarding-footer">
        © 2025 ΚΑΙΡΟΣ. All rights reserved. • Built with Claude AI
      </footer>
    </div>
  );
};

export default UserOnboarding;