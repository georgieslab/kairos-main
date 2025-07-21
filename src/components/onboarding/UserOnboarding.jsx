// src/components/onboarding/UserOnboarding.jsx

import React, { useState } from 'react';
import { 
  BookOpen, 
  Camera, 
  Sparkles, 
  Calendar, 
  Bell, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Check
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const UserOnboarding = ({ onComplete }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    enableNotifications: true,
    reminderTime: '20:00',
    journalingGoals: []
  });

  // Onboarding steps content
  const steps = [
    {
      title: "Welcome to Καιρός Journal",
      description: "Your personal journey of self-discovery begins here. Let's get you set up in a few quick steps.",
      icon: <BookOpen className="w-12 h-12 text-emerald-500" />
    },
    {
      title: "10-Day Guided Journey",
      description: "Καιρός guides you through a structured 10-day journaling experience, with thoughtful prompts for each day.",
      icon: <Calendar className="w-12 h-12 text-emerald-500" />
    },
    {
      title: "How It Works",
      description: "Write your thoughts in a physical journal, take a photo of your entry, and receive AI-powered insights.",
      icon: <Camera className="w-12 h-12 text-emerald-500" />
    },
    {
      title: "Personalized Insights",
      description: "Claude AI analyzes your writing to identify patterns, provide reflections, and suggest actions.",
      icon: <Sparkles className="w-12 h-12 text-emerald-500" />
    },
    {
      title: "Daily Reminders",
      description: "Set up gentle reminders to help you maintain a consistent journaling practice.",
      icon: <Bell className="w-12 h-12 text-emerald-500" />,
      hasPreference: true,
      preferenceType: 'notifications'
    },
    {
      title: "Your Journaling Goals",
      description: "What do you hope to achieve through journaling?",
      icon: <Settings className="w-12 h-12 text-emerald-500" />,
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
      // Remove goal if already selected
      const index = newGoals.indexOf(goal);
      newGoals.splice(index, 1);
    } else {
      // Add goal if not already selected
      newGoals.push(goal);
    }
    
    setPreferences(prev => ({
      ...prev,
      journalingGoals: newGoals
    }));
  };

  // Handle completion of onboarding
  const handleFinish = async () => {
    try {
      // Update user profile with onboarding preferences
      if (currentUser) {
        await updateUserProfile({
          hasCompletedOnboarding: true,
          settings: {
            enableNotifications: preferences.enableNotifications,
            reminderTime: preferences.reminderTime,
            lastUpdated: new Date().toISOString()
          },
          journalingGoals: preferences.journalingGoals
        });
      }
      
      // Call the completion callback
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

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Progress Indicator */}
          <div className="mb-8 flex items-center justify-center">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-emerald-500' : 'bg-gray-700'
                  }`}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Content Card */}
          <div className="glass-card p-8 shadow-lg shadow-emerald-900/10">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              {steps[currentStep].icon}
            </div>
            
            {/* Title */}
            <h2 className="text-2xl font-bold text-center mb-4">
              {steps[currentStep].title}
            </h2>
            
            {/* Description */}
            <p className="text-gray-300 text-center mb-8">
              {steps[currentStep].description}
            </p>
            
            {/* Preferences (if applicable) */}
            {steps[currentStep].hasPreference && (
              <div className="mb-8">
                {steps[currentStep].preferenceType === 'notifications' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Enable daily reminders</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={preferences.enableNotifications}
                          onChange={() => handlePreferenceChange(
                            'enableNotifications', 
                            !preferences.enableNotifications
                          )}
                        />
                        <div className={`w-11 h-6 rounded-full peer ${
                          preferences.enableNotifications 
                            ? 'bg-emerald-600' 
                            : 'bg-gray-700'
                        } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                          preferences.enableNotifications 
                            ? 'after:translate-x-5' 
                            : ''
                        }`}></div>
                      </label>
                    </div>
                    
                    {preferences.enableNotifications && (
                      <div>
                        <label className="block text-gray-300 mb-2">Reminder time</label>
                        <input
                          type="time"
                          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md"
                          value={preferences.reminderTime}
                          onChange={(e) => handlePreferenceChange('reminderTime', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}
                
                {steps[currentStep].preferenceType === 'goals' && (
                  <div className="space-y-2">
                    <p className="text-gray-300 mb-3">Select all that apply:</p>
                    
                    {[
                      'Self-discovery',
                      'Stress reduction',
                      'Personal growth',
                      'Memory keeping',
                      'Emotional processing',
                      'Gratitude practice',
                      'Goal setting',
                      'Creative writing'
                    ].map(goal => (
                      <button
                        key={goal}
                        onClick={() => handleGoalToggle(goal)}
                        className={`flex items-center justify-between w-full p-3 rounded-lg border ${
                          preferences.journalingGoals.includes(goal)
                            ? 'bg-emerald-900/30 border-emerald-700/50 text-emerald-400'
                            : 'bg-gray-800 border-gray-700 text-gray-300'
                        }`}
                      >
                        <span>{goal}</span>
                        {preferences.journalingGoals.includes(goal) && (
                          <Check className="w-5 h-5" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={goToPreviousStep}
                className={`btn-secondary flex items-center ${currentStep === 0 ? 'invisible' : ''}`}
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </button>
              
              <button
                onClick={goToNextStep}
                className="btn-base flex items-center"
              >
                {currentStep === steps.length - 1 ? (
                  'Get Started'
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Skip Button */}
          <div className="text-center mt-4">
            <button
              onClick={handleFinish}
              className="text-gray-500 text-sm hover:text-gray-300"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
      
      <footer className="py-4 text-center text-gray-600 text-xs">
        © 2025 ΚΑΙΡΌΣ. All rights reserved.
      </footer>
    </div>
  );
};

export default UserOnboarding;