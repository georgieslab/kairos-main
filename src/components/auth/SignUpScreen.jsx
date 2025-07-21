// src/components/auth/SignUpScreen.jsx - FIXED VERSION

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  User, 
  Calendar, 
  X, 
  MapPin, 
  Eye, 
  EyeOff,
  ChevronRight,
  ChevronLeft,
  Check,
  Sun,
  Moon,
  Heart,
  BookOpen,
  Target,
  Sparkles,
  Brain,
  Leaf,
  Camera,
  PenTool
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/components/signup.css';

// Google Maps API Key - Replace with your actual key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBrXIv6K7Uto7fwe8MuzgRM_79W5WXsRM8';

// Function to load Google Maps API script
const loadGoogleMapsScript = (callback) => {
  if (window.google && window.google.maps) {
    callback();
    return;
  }
  
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onload = callback;
  script.onerror = () => console.error('Error loading Google Maps API');
  document.head.appendChild(script);
};

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="su-social-icon">
    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
    <path d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.22 13.48 18.58 12 18.58C9.11 18.58 6.67 16.67 5.76 14.09H2.07V16.94C3.87 20.45 7.62 23 12 23Z" fill="#34A853"/>
    <path d="M5.76 14.09C5.54 13.47 5.42 12.79 5.42 12.09C5.42 11.39 5.54 10.71 5.76 10.09V7.24H2.07C1.39 8.69 1 10.35 1 12.09C1 13.83 1.39 15.49 2.07 16.94L5.76 14.09Z" fill="#FBBC05"/>
    <path d="M12 5.58C13.62 5.58 15.06 6.15 16.21 7.24L19.36 4.09C17.45 2.32 14.97 1.3 12 1.3C7.62 1.3 3.87 3.85 2.07 7.36L5.76 10.21C6.67 7.63 9.11 5.58 12 5.58Z" fill="#EA4335"/>
  </svg>
);

const SignUpScreen = ({ onNext, onBack, navigateToScreen }) => {
  const { signup, login, signInWithGoogle } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Step management - FIXED: Only for sign-up mode
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState('right');
  
  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: 25,
    gender: '',
    city: '',
    interests: [],
    journalingGoals: [],
    preferredTheme: isDarkMode ? 'dark' : 'light'
  });
  
  // UI state
  const [isSignIn, setIsSignIn] = useState(false); // FIXED: This now properly controls the entire flow
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigatingFrom, setIsNavigatingFrom] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  
  // Google Places
  const [autocompleteInitialized, setAutocompleteInitialized] = useState(false);
  const cityInputRef = useRef(null);
  const stepRefs = useRef([]);

  // Available interests and goals
  const availableInterests = [
    { id: 'self-discovery', label: 'Self-Discovery', icon: User },
    { id: 'mindfulness', label: 'Mindfulness', icon: Leaf },
    { id: 'creativity', label: 'Creative Expression', icon: PenTool },
    { id: 'personal-growth', label: 'Personal Growth', icon: Target },
    { id: 'emotional-health', label: 'Emotional Health', icon: Heart },
    { id: 'goal-setting', label: 'Goal Setting', icon: Target },
    { id: 'gratitude', label: 'Gratitude Practice', icon: Sparkles },
    { id: 'memory-keeping', label: 'Memory Keeping', icon: Camera }
  ];

  const availableGoals = [
    { id: 'stress-reduction', label: 'Reduce Stress & Anxiety', icon: Leaf },
    { id: 'self-awareness', label: 'Increase Self-Awareness', icon: Brain },
    { id: 'emotional-processing', label: 'Process Emotions', icon: Heart },
    { id: 'personal-growth', label: 'Personal Development', icon: Target },
    { id: 'creativity', label: 'Boost Creativity', icon: PenTool },
    { id: 'habit-tracking', label: 'Track Habits & Goals', icon: Check },
    { id: 'gratitude', label: 'Practice Gratitude', icon: Sparkles },
    { id: 'memory-preservation', label: 'Preserve Memories', icon: BookOpen }
  ];

  // FIXED: Separate step configurations for sign-up vs sign-in
  const signUpSteps = [
    {
      id: 'account',
      title: 'Create Account',
      subtitle: 'Begin your journaling journey',
      fields: ['email', 'password', 'name']
    },
    {
      id: 'personal',
      title: 'Tell Us About You',
      subtitle: 'Help us personalize your experience',
      fields: ['age', 'gender']
    },
    {
      id: 'interests',
      title: 'Your Interests',
      subtitle: 'What areas would you like to explore?',
      fields: ['interests']
    },
    {
      id: 'goals',
      title: 'Journaling Goals',
      subtitle: 'What do you hope to achieve?',
      fields: ['journalingGoals']
    },
    {
      id: 'location',
      title: 'Your Location',
      subtitle: 'For personalized weather and insights',
      fields: ['city']
    },
    {
      id: 'theme',
      title: 'Choose Your Theme',
      subtitle: 'Select your preferred app appearance',
      fields: ['preferredTheme']
    },
    {
      id: 'welcome',
      title: 'Welcome to Καιρός!',
      subtitle: 'You\'re all set to begin your journaling journey',
      fields: []
    }
  ];

  // FIXED: Get the appropriate steps based on mode
  const getCurrentSteps = () => {
    if (isSignIn) {
      return [{
        id: 'signin',
        title: 'Welcome Back',
        subtitle: 'Sign in to continue your journey',
        fields: ['email', 'password']
      }];
    }
    return signUpSteps;
  };

  const steps = getCurrentSteps();

  // Google Maps setup with better error handling
  useEffect(() => {
    if (!isSignIn && currentStep === 4) { // Location step - only for sign-up
      // Only load if we have a valid API key
      if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY_HERE') {
        loadGoogleMapsScript(() => {
          console.log('Google Maps API loaded successfully');
          setAutocompleteInitialized(false);
        });
      } else {
        console.warn('Google Maps API key not configured - using basic text input');
      }
    }
  }, [isSignIn, currentStep]);
  
  useEffect(() => {
    if (!autocompleteInitialized && !isSignIn && currentStep === 4 && cityInputRef.current) {
      if (window.google && window.google.maps && window.google.maps.places) {
        try {
          const autocomplete = new window.google.maps.places.Autocomplete(cityInputRef.current, {
            types: ['(cities)'],
            fields: ['address_components', 'formatted_address', 'geometry', 'name']
          });
          
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.address_components) {
              const cityComponent = place.address_components.find(
                component => component.types.includes('locality')
              );
              
              if (cityComponent) {
                handleFieldChange('city', cityComponent.long_name);
              } else {
                handleFieldChange('city', place.formatted_address || place.name);
              }
            }
          });
          
          setAutocompleteInitialized(true);
          console.log('Google Places autocomplete initialized');
        } catch (error) {
          console.error('Error initializing Google Places:', error);
          console.log('Falling back to basic text input');
        }
      } else {
        console.log('Google Places not available, using basic text input');
      }
    }
  }, [cityInputRef, autocompleteInitialized, isSignIn, currentStep]);

  // FIXED: Reset to first step when toggling between modes
  useEffect(() => {
    setCurrentStep(0);
    setError('');
    setFieldErrors({});
    setTouchedFields({});
  }, [isSignIn]);

  // Field validation
  const validateField = (fieldName, value) => {
    let error = '';
    
    switch (fieldName) {
      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Please enter a valid email';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
      case 'name':
        if (!isSignIn && !value) {
          error = 'Name is required';
        }
        break;
      case 'age':
        if (!isSignIn && (!value || value < 13 || value > 120)) {
          error = 'Please select a valid age (13-120)';
        }
        break;
      case 'gender':
        if (!isSignIn && !value) {
          error = 'Please select your gender';
        }
        break;
      case 'city':
        if (!isSignIn && !value) {
          error = 'City is required';
        }
        break;
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    
    return error === '';
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear general error when user starts typing
    if (error) {
      setError('');
    }

    // Validate field if it has been touched
    if (touchedFields[fieldName]) {
      validateField(fieldName, value);
    }
  };

  const handleFieldBlur = (fieldName, value) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
    validateField(fieldName, value);
  };

  // Handle array field changes (interests, goals)
  const handleArrayFieldToggle = (fieldName, value) => {
    const currentArray = formData[fieldName] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleFieldChange(fieldName, newArray);
  };

  // FIXED: Handle sign-in directly without steps
  const handleSignIn = async () => {
    if (isNavigatingFrom) return;

    // Validate email and password
    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);
    
    setTouchedFields({
      email: true,
      password: true
    });

    if (!emailValid || !passwordValid) {
      return;
    }

    try {
      setIsLoading(true);
      setIsNavigatingFrom(true);
      
      await login(formData.email, formData.password);
      onNext();
    } catch (error) {
      console.error('Sign-in error:', error);
      setIsNavigatingFrom(false);
      
      switch (error.code) {
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email. Please sign up instead.');
          setIsSignIn(false);
          break;
        case 'auth/invalid-credential':
          setError('Invalid email or password. Please try again.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        default:
          setError(`Sign-in failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // FIXED: Step navigation - only for sign-up mode
  const goToNextStep = async () => {
    // FIXED: Handle sign-in mode directly
    if (isSignIn) {
      await handleSignIn();
      return;
    }

    // Validate current step for sign-up
    const currentStepConfig = steps[currentStep];
    const fieldsToValidate = currentStepConfig.fields;
    
    let hasErrors = false;
    
    // Skip validation for welcome step
    if (currentStepConfig.id !== 'welcome') {
      fieldsToValidate.forEach(field => {
        if (!validateField(field, formData[field])) {
          hasErrors = true;
        }
      });

      // Mark fields as touched
      const newTouched = {};
      fieldsToValidate.forEach(field => {
        newTouched[field] = true;
      });
      setTouchedFields(prev => ({ ...prev, ...newTouched }));

      if (hasErrors) {
        return;
      }
    }

    // Handle final step (create account) for sign-up
    if (currentStep === steps.length - 1) {
      await handleFinalSubmit();
      return;
    }

    // Navigate to next step for sign-up
    if (currentStep < steps.length - 1) {
      await transitionToStep(currentStep + 1, 'right');
    }
  };

  const goToPreviousStep = async () => {
    if (currentStep > 0) {
      await transitionToStep(currentStep - 1, 'left');
    }
  };

  const transitionToStep = async (newStep, direction) => {
    setIsTransitioning(true);
    setSlideDirection(direction);
    
    // Wait for slide-out animation
    await new Promise(resolve => setTimeout(resolve, 150));
    
    setCurrentStep(newStep);
    
    // Wait for slide-in animation
    await new Promise(resolve => setTimeout(resolve, 150));
    
    setIsTransitioning(false);
  };

  // Handle final account creation for sign-up
  const handleFinalSubmit = async () => {
    if (isNavigatingFrom) return;

    try {
      setIsLoading(true);
      setIsNavigatingFrom(true);
      
      // Apply theme preference before creating account
      if (formData.preferredTheme !== (isDarkMode ? 'dark' : 'light')) {
        toggleTheme();
      }
      
      await signup(
        formData.email, 
        formData.password, 
        formData.name, 
        formData.age,
        formData.gender,
        formData.city,
        {
          interests: formData.interests,
          journalingGoals: formData.journalingGoals,
          preferredTheme: formData.preferredTheme
        }
      );
      
      onNext();
    } catch (error) {
      console.error('Sign-up error:', error);
      setIsNavigatingFrom(false);
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('An account with this email already exists. Please sign in instead.');
          setIsSignIn(true);
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        default:
          setError(`Registration failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      if (isNavigatingFrom) return;
      
      setIsLoading(true);
      setIsNavigatingFrom(true);
      
      await signInWithGoogle();
      onNext();
    } catch (error) {
      console.error('Google auth error:', error);
      setError('Google authentication failed. Please try again.');
      setIsNavigatingFrom(false);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToTerms = (e) => {
    e.preventDefault();
    if (navigateToScreen) {
      navigateToScreen('terms-of-service');
    }
  };
  
  const navigateToPrivacy = (e) => {
    e.preventDefault();
    if (navigateToScreen) {
      navigateToScreen('privacy-policy');
    }
  };

  // FIXED: Render step content with proper sign-in handling
  const renderStepContent = () => {
    const stepConfig = steps[currentStep];

    // FIXED: Handle sign-in mode
    if (isSignIn) {
      return (
        <div className="step-content">
          {/* Social Sign-In Button */}
          <div className="su-social-section">
            <button 
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="su-social-button su-social-button-google"
              aria-label="Continue with Google"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
              {isLoading && (
                <div className="su-button-spinner">
                  <div className="su-spinner-ring"></div>
                </div>
              )}
            </button>
          </div>
          
          {/* Divider */}
          <div className="su-divider">
            <div className="su-divider-line"></div>
            <div className="su-divider-text">
              <span className="su-divider-text-inner">or continue with email</span>
            </div>
          </div>
          
          <div className="su-floating-label-group">
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              onBlur={(e) => handleFieldBlur('email', e.target.value)}
              className={`su-floating-input ${fieldErrors.email && touchedFields.email ? 'su-input-error' : ''}`}
              placeholder=" "
              autoComplete="email"
            />
            <label htmlFor="email" className="su-floating-label">Email Address</label>
            <Mail className="su-input-icon" />
            {fieldErrors.email && touchedFields.email && (
              <span className="su-field-error">{fieldErrors.email}</span>
            )}
          </div>
          
          <div className="su-floating-label-group">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleFieldChange('password', e.target.value)}
              onBlur={(e) => handleFieldBlur('password', e.target.value)}
              className={`su-floating-input su-password-input ${fieldErrors.password && touchedFields.password ? 'su-input-error' : ''}`}
              placeholder=" "
              autoComplete="current-password"
            />
            <label htmlFor="password" className="su-floating-label">Password</label>
            <Lock className="su-input-icon" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="su-password-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {fieldErrors.password && touchedFields.password && (
              <span className="su-field-error">{fieldErrors.password}</span>
            )}
          </div>

          {/* Toggle to Sign Up */}
          <div className="su-toggle-section">
            <button
              type="button"
              onClick={() => {
                setIsSignIn(false);
                setError('');
                setFieldErrors({});
                setTouchedFields({});
              }}
              className="su-toggle-button"
            >
              Don't have an account? {' '}
              <span className="su-toggle-action">Sign up</span>
            </button>
          </div>
        </div>
      );
    }

    // Sign-up mode - existing multi-step logic
    switch (stepConfig.id) {
      case 'account':
        return (
          <div className="step-content">
            {/* Social Sign-In Button */}
            <div className="su-social-section">
              <button 
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="su-social-button su-social-button-google"
                aria-label="Continue with Google"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
                {isLoading && (
                  <div className="su-button-spinner">
                    <div className="su-spinner-ring"></div>
                  </div>
                )}
              </button>
            </div>
            
            {/* Divider */}
            <div className="su-divider">
              <div className="su-divider-line"></div>
              <div className="su-divider-text">
                <span className="su-divider-text-inner">or continue with email</span>
              </div>
            </div>

            <div className="su-floating-label-group">
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                onBlur={(e) => handleFieldBlur('name', e.target.value)}
                className={`su-floating-input ${fieldErrors.name && touchedFields.name ? 'su-input-error' : ''}`}
                placeholder=" "
                autoComplete="given-name"
              />
              <label htmlFor="name" className="su-floating-label">Full Name</label>
              <User className="su-input-icon" />
              {fieldErrors.name && touchedFields.name && (
                <span className="su-field-error">{fieldErrors.name}</span>
              )}
            </div>
            
            <div className="su-floating-label-group">
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onBlur={(e) => handleFieldBlur('email', e.target.value)}
                className={`su-floating-input ${fieldErrors.email && touchedFields.email ? 'su-input-error' : ''}`}
                placeholder=" "
                autoComplete="email"
              />
              <label htmlFor="email" className="su-floating-label">Email Address</label>
              <Mail className="su-input-icon" />
              {fieldErrors.email && touchedFields.email && (
                <span className="su-field-error">{fieldErrors.email}</span>
              )}
            </div>
            
            <div className="su-floating-label-group">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                onBlur={(e) => handleFieldBlur('password', e.target.value)}
                className={`su-floating-input su-password-input ${fieldErrors.password && touchedFields.password ? 'su-input-error' : ''}`}
                placeholder=" "
                autoComplete="new-password"
              />
              <label htmlFor="password" className="su-floating-label">Create Password</label>
              <Lock className="su-input-icon" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="su-password-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              {fieldErrors.password && touchedFields.password && (
                <span className="su-field-error">{fieldErrors.password}</span>
              )}
            </div>

            {/* Toggle Sign In/Sign Up */}
            <div className="su-toggle-section">
              <button
                type="button"
                onClick={() => {
                  setIsSignIn(true);
                  setError('');
                  setFieldErrors({});
                  setTouchedFields({});
                }}
                className="su-toggle-button"
              >
                Already have an account? {' '}
                <span className="su-toggle-action">Sign in</span>
              </button>
            </div>
          </div>
        );

      case 'personal':
        return (
          <div className="step-content">
            {/* Age Selector */}
            <div className="age-selector-container">
              <label className="age-selector-label">Your Age</label>
              <div className="age-selector-wrapper">
                <div className="age-selector">
                  <select
                    value={formData.age}
                    onChange={(e) => handleFieldChange('age', parseInt(e.target.value))}
                    onBlur={(e) => handleFieldBlur('age', parseInt(e.target.value))}
                    className={`age-select ${fieldErrors.age && touchedFields.age ? 'error' : ''}`}
                  >
                    {Array.from({ length: 108 }, (_, i) => i + 13).map(age => (
                      <option key={age} value={age}>{age} years old</option>
                    ))}
                  </select>
                </div>
                <span className="age-hint">
                  This helps us provide age-appropriate insights
                </span>
                {fieldErrors.age && touchedFields.age && (
                  <span className="su-field-error">{fieldErrors.age}</span>
                )}
              </div>
            </div>

            {/* Gender Selection */}
            <div className="gender-selection-container">
              <label className="gender-selection-label">Gender</label>
              <div className="gender-options">
                {[
                  { id: 'female', label: 'Female', icon: '♀' },
                  { id: 'male', label: 'Male', icon: '♂' },
                  { id: 'non-binary', label: 'Non-binary', icon: '⚧' },
                  { id: 'prefer-not-to-say', label: 'Prefer not to say', icon: '◦' }
                ].map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleFieldChange('gender', option.id)}
                    className={`gender-option ${formData.gender === option.id ? 'selected' : ''}`}
                  >
                    <span className="gender-icon">{option.icon}</span>
                    <span className="gender-label">{option.label}</span>
                    {formData.gender === option.id && <Check className="gender-check" />}
                  </button>
                ))}
              </div>
              {fieldErrors.gender && touchedFields.gender && (
                <span className="su-field-error">{fieldErrors.gender}</span>
              )}
            </div>
          </div>
        );

      case 'interests':
        return (
          <div className="step-content">
            <p className="step-description">Select the areas you're most interested in exploring through journaling:</p>
            <div className="selection-grid">
              {availableInterests.map(interest => {
                const IconComponent = interest.icon;
                const isSelected = formData.interests.includes(interest.id);
                
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => handleArrayFieldToggle('interests', interest.id)}
                    className={`selection-item ${isSelected ? 'selected' : ''}`}
                  >
                    <IconComponent className="selection-icon" />
                    <span className="selection-label">{interest.label}</span>
                    {isSelected && <Check className="selection-check" />}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="step-content">
            <p className="step-description">What do you hope to achieve through journaling?</p>
            <div className="selection-grid">
              {availableGoals.map(goal => {
                const IconComponent = goal.icon;
                const isSelected = formData.journalingGoals.includes(goal.id);
                
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => handleArrayFieldToggle('journalingGoals', goal.id)}
                    className={`selection-item ${isSelected ? 'selected' : ''}`}
                  >
                    <IconComponent className="selection-icon" />
                    <span className="selection-label">{goal.label}</span>
                    {isSelected && <Check className="selection-check" />}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'location':
        return (
          <div className="step-content">
            <div className="su-floating-label-group">
              <input
                id="city"
                type="text"
                ref={cityInputRef}
                value={formData.city}
                onChange={(e) => handleFieldChange('city', e.target.value)}
                onBlur={(e) => handleFieldBlur('city', e.target.value)}
                className={`su-floating-input ${fieldErrors.city && touchedFields.city ? 'su-input-error' : ''}`}
                placeholder=" "
                autoComplete="address-level2"
              />
              <label htmlFor="city" className="su-floating-label">City</label>
              <MapPin className="su-input-icon" />
              <span className="su-form-hint">
                {window.google && window.google.maps 
                  ? "Start typing your city name for suggestions" 
                  : "Enter your city name (e.g., Vienna, London, New York)"}
              </span>
              {fieldErrors.city && touchedFields.city && (
                <span className="su-field-error">{fieldErrors.city}</span>
              )}
            </div>
            
            {/* Popular cities as fallback */}
            <div className="popular-cities">
              <p className="popular-cities-label">Popular cities:</p>
              <div className="popular-cities-grid">
                {['Vienna', 'London', 'New York', 'Paris', 'Tokyo', 'Sydney'].map(city => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleFieldChange('city', city)}
                    className="popular-city-button"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'theme':
        return (
          <div className="step-content">
            <p className="step-description">Choose your preferred app appearance:</p>
            <div className="theme-selection">
              <button
                type="button"
                onClick={() => handleFieldChange('preferredTheme', 'dark')}
                className={`theme-option ${formData.preferredTheme === 'dark' ? 'selected' : ''}`}
              >
                <div className="theme-preview theme-preview-dark">
                  <Moon className="theme-icon" />
                  <div className="theme-mockup">
                    <div className="theme-mockup-header"></div>
                    <div className="theme-mockup-content">
                      <div className="theme-mockup-line"></div>
                      <div className="theme-mockup-line short"></div>
                      <div className="theme-mockup-line"></div>
                    </div>
                  </div>
                </div>
                <span className="theme-label">Dark Theme</span>
                <span className="theme-description">Easy on the eyes, perfect for evening journaling</span>
                {formData.preferredTheme === 'dark' && <Check className="theme-check" />}
              </button>

              <button
                type="button"
                onClick={() => handleFieldChange('preferredTheme', 'light')}
                className={`theme-option ${formData.preferredTheme === 'light' ? 'selected' : ''}`}
              >
                <div className="theme-preview theme-preview-light">
                  <Sun className="theme-icon" />
                  <div className="theme-mockup">
                    <div className="theme-mockup-header"></div>
                    <div className="theme-mockup-content">
                      <div className="theme-mockup-line"></div>
                      <div className="theme-mockup-line short"></div>
                      <div className="theme-mockup-line"></div>
                    </div>
                  </div>
                </div>
                <span className="theme-label">Light Theme</span>
                <span className="theme-description">Clean and bright, ideal for daytime use</span>
                {formData.preferredTheme === 'light' && <Check className="theme-check" />}
              </button>
            </div>
          </div>
        );

      case 'welcome':
        return (
          <div className="step-content welcome-content">
            <div className="welcome-animation">
              <div className="success-circle">
                <Check className="success-check" />
              </div>
            </div>
            <p className="welcome-message">
              Your account has been created successfully! You're ready to begin your journey of self-discovery with Καιρός.
            </p>
            <button
              type="button"
              onClick={onNext}
              className="welcome-continue-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="su-loading-indicator">
                  <div className="su-spinner-ring"></div>
                  <span>Setting up your account...</span>
                </div>
              ) : (
                <>
                  Start Your Journey
                  <ChevronRight className="nav-icon" />
                </>
              )}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // FIXED: Get proper button text based on mode and step
  const getActionButtonText = () => {
    if (isSignIn) {
      return 'Sign In';
    }
    
    if (currentStep === steps.length - 2) {
      return 'Create Account';
    }
    
    if (currentStep === steps.length - 1) {
      return 'Start Your Journey';
    }
    
    return 'Continue';
  };

  return (
    <div className="su-container">
      <div className="su-card-container">
        {/* Back Button */}
        {onBack && currentStep === 0 && (
          <button 
            onClick={onBack} 
            className="su-back-button"
            aria-label="Go back"
          >
            <ArrowLeft className="su-back-icon" />
            <span>Back</span>
          </button>
        )}
        
        <div className="su-card">
          {/* FIXED: Progress Indicator - only show for sign-up mode */}
          {!isSignIn && (
            <div className="step-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
              <div className="progress-dots">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`progress-dot ${index <= currentStep ? 'active' : ''} ${index === currentStep ? 'current' : ''}`}
                  />
                ))}
              </div>
              <div className="progress-text">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
          )}

          <div className="su-card-content">
            {/* Step Header */}
            <div className="su-header">
              <h1 className="su-title">
                {steps[currentStep].title}
              </h1>
              <p className="su-subtitle">
                {steps[currentStep].subtitle}
              </p>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="su-error-message" role="alert">
                <X className="su-error-icon" />
                <span>{error}</span>
              </div>
            )}
            
            {/* Step Content */}
            <div className={`step-container ${isTransitioning ? `slide-${slideDirection}` : ''}`}>
              {renderStepContent()}
            </div>
            
            {/* FIXED: Navigation Buttons - different logic for sign-in vs sign-up */}
            {steps[currentStep].id !== 'welcome' && (
              <div className="step-navigation">
                {/* FIXED: Back button only for sign-up mode and not first step */}
                {!isSignIn && currentStep > 0 && (
                  <button
                    type="button"
                    onClick={goToPreviousStep}
                    className="nav-button nav-button-secondary"
                    disabled={isLoading || isTransitioning}
                  >
                    <ChevronLeft className="nav-icon" />
                    Back
                  </button>
                )}
                
                {/* FIXED: Action button with proper text */}
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="nav-button nav-button-primary"
                  disabled={isLoading || isTransitioning}
                >
                  {isLoading ? (
                    <div className="su-loading-indicator">
                      <div className="su-spinner-ring"></div>
                      <span>{isSignIn ? 'Signing in...' : 'Processing...'}</span>
                    </div>
                  ) : (
                    <>
                      {getActionButtonText()}
                      {!isSignIn && currentStep < steps.length - 2 && <ChevronRight className="nav-icon" />}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Terms Text */}
        <div className="su-terms-section">
          <p className="su-terms-text">
            By continuing, you agree to our{' '}
            <button onClick={navigateToTerms} className="su-terms-link">
              Terms of Service
            </button>{' '}
            and{' '}
            <button onClick={navigateToPrivacy} className="su-terms-link">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;