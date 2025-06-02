// src/components/auth/SignUpScreen.jsx

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Lock, User, Calendar, X, MapPin, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/signup.css';

// Google Maps API Key (replace with your actual API key)
const GOOGLE_MAPS_API_KEY = 'AIzaSyBrXIv6K7Uto7fwe8MuzgRM_79W5WXsRM8';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [city, setCity] = useState('');
  const [isSignIn, setIsSignIn] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigatingFrom, setIsNavigatingFrom] = useState(false);
  const [autocompleteInitialized, setAutocompleteInitialized] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const cityInputRef = React.createRef();

  useEffect(() => {
    console.log('SignUpScreen mounted');
    
    if (!isSignIn) {
      loadGoogleMapsScript(() => {
        console.log('Google Maps API loaded');
        setAutocompleteInitialized(false);
      });
    }
    
    return () => console.log('SignUpScreen unmounted');
  }, [isSignIn]);
  
  useEffect(() => {
    if (!autocompleteInitialized && !isSignIn && cityInputRef.current) {
      if (window.google && window.google.maps && window.google.maps.places) {
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
              setCity(cityComponent.long_name);
            } else {
              setCity(place.formatted_address || place.name);
            }
          }
        });
        
        setAutocompleteInitialized(true);
      }
    }
  }, [cityInputRef, autocompleteInitialized, isSignIn]);

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
      case 'birthday':
        if (!isSignIn && !value) {
          error = 'Birthday is required';
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
    // Update field value
    switch (fieldName) {
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'name':
        setName(value);
        break;
      case 'birthday':
        setBirthday(value);
        break;
      case 'city':
        setCity(value);
        break;
    }

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

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isNavigatingFrom) {
      console.log('Already navigating, preventing duplicate');
      return;
    }

    // Validate all fields
    const fields = isSignIn 
      ? [{ name: 'email', value: email }, { name: 'password', value: password }]
      : [
          { name: 'email', value: email },
          { name: 'password', value: password },
          { name: 'name', value: name },
          { name: 'birthday', value: birthday },
          { name: 'city', value: city }
        ];

    let hasErrors = false;
    const newFieldErrors = {};

    fields.forEach(field => {
      if (!validateField(field.name, field.value)) {
        hasErrors = true;
      }
    });

    // Mark all fields as touched
    const allTouched = {};
    fields.forEach(field => {
      allTouched[field.name] = true;
    });
    setTouchedFields(allTouched);

    if (hasErrors) {
      return;
    }
    
    try {
      setIsLoading(true);
      setIsNavigatingFrom(true);
      
      if (isSignIn) {
        await login(email, password);
      } else {
        await signup(email, password, name, birthday, city);
      }
      
      console.log('Auth operation completed successfully, navigating next');
      onNext();
    } catch (error) {
      console.error('Authentication error:', error);
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
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email. Please sign up instead.');
          setIsSignIn(false);
          break;
        default:
          setError(`Authentication failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      console.log('handleGoogleAuth called');
      
      if (isNavigatingFrom) {
        console.log('Already navigating, preventing duplicate');
        return;
      }
      
      setIsLoading(true);
      setIsNavigatingFrom(true);
      
      await signInWithGoogle();
      
      console.log('Google auth completed successfully, navigating next');
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

  return (
    <div className="su-container">
      <div className="su-card-container">
        {/* Back Button */}
        {onBack && (
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
          <div className="su-card-content">
            <div className="su-header">
              <h1 className="su-title">
                {isSignIn ? 'Welcome Back' : 'Create Your Account'}
              </h1>
              
              <p className="su-subtitle">
                {isSignIn 
                  ? 'Sign in to continue your journaling journey' 
                  : 'Begin your self-discovery journey with Καιρός'}
              </p>
            </div>
            
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
            
            <form onSubmit={handleEmailAuth} className="su-form-container" noValidate>
              {!isSignIn && (
                <>
                  {/* Name Field */}
                  <div className="su-floating-label-group">
                    <input
                      id="name"
                      type="text"
                      value={name}
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
                  
                  {/* Birthday Field */}
                  <div className="su-floating-label-group">
                    <input
                      id="birthday"
                      type="date"
                      value={birthday}
                      onChange={(e) => handleFieldChange('birthday', e.target.value)}
                      onBlur={(e) => handleFieldBlur('birthday', e.target.value)}
                      className={`su-floating-input su-date-input ${fieldErrors.birthday && touchedFields.birthday ? 'su-input-error' : ''}`}
                      max={new Date().toISOString().split('T')[0]}
                      autoComplete="bday"
                    />
                    <label htmlFor="birthday" className="su-floating-label">Birthday</label>
                    <Calendar className="su-input-icon" />
                    <span className="su-form-hint">
                      Helps us provide age-appropriate insights
                    </span>
                    {fieldErrors.birthday && touchedFields.birthday && (
                      <span className="su-field-error">{fieldErrors.birthday}</span>
                    )}
                  </div>
                  
                  {/* City Field */}
                  <div className="su-floating-label-group">
                    <input
                      id="city"
                      type="text"
                      ref={cityInputRef}
                      value={city}
                      onChange={(e) => handleFieldChange('city', e.target.value)}
                      onBlur={(e) => handleFieldBlur('city', e.target.value)}
                      className={`su-floating-input ${fieldErrors.city && touchedFields.city ? 'su-input-error' : ''}`}
                      placeholder=" "
                      autoComplete="address-level2"
                    />
                    <label htmlFor="city" className="su-floating-label">City</label>
                    <MapPin className="su-input-icon" />
                    <span className="su-form-hint">
                      For local weather and insights
                    </span>
                    {fieldErrors.city && touchedFields.city && (
                      <span className="su-field-error">{fieldErrors.city}</span>
                    )}
                  </div>
                </>
              )}
              
              {/* Email Field */}
              <div className="su-floating-label-group">
                <input
                  id="email"
                  type="email"
                  value={email}
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
              
              {/* Password Field */}
              <div className="su-floating-label-group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  onBlur={(e) => handleFieldBlur('password', e.target.value)}
                  className={`su-floating-input su-password-input ${fieldErrors.password && touchedFields.password ? 'su-input-error' : ''}`}
                  placeholder=" "
                  autoComplete={isSignIn ? "current-password" : "new-password"}
                />
                <label htmlFor="password" className="su-floating-label">
                  {isSignIn ? "Password" : "Create Password"}
                </label>
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
              
              {/* General Error Message */}
              {error && (
                <div className="su-error-message" role="alert">
                  <X className="su-error-icon" />
                  <span>{error}</span>
                </div>
              )}
              
              {/* Submit Button */}
              <button
                type="submit"
                className="su-submit-button"
                disabled={isLoading}
                aria-describedby={error ? "error-message" : undefined}
              >
                {isLoading ? (
                  <div className="su-loading-indicator">
                    <div className="su-spinner-ring"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span>{isSignIn ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>
            </form>
            
            {/* Toggle Sign In/Sign Up */}
            <div className="su-toggle-section">
              <button
                type="button"
                onClick={() => {
                  setIsSignIn(!isSignIn);
                  setError('');
                  setFieldErrors({});
                  setTouchedFields({});
                }}
                className="su-toggle-button"
              >
                {isSignIn ? "Don't have an account? " : "Already have an account? "}
                <span className="su-toggle-action">
                  {isSignIn ? "Sign up" : "Sign in"}
                </span>
              </button>
            </div>
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