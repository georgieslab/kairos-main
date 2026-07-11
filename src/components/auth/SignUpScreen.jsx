// src/components/auth/SignUpScreen.jsx
// Refactored: 3-step glass onboarding with flip transition between modes

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  Check,
  Heart,
  Target,
  Sparkles,
  Brain,
  Leaf,
  PenTool,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/signup.css';

// Reusable glass input with floating label
const GlassInput = ({
  id,
  type = 'text',
  icon: Icon,
  value,
  onChange,
  onBlur,
  label,
  error,
  touched,
  autoComplete,
  inputMode,
}) => {
  const { t } = useTranslation('auth');
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="glass-input-group">
      {Icon && <Icon className="input-icon" size={18} />}
      <input
        id={id}
        type={inputType}
        autoComplete={autoComplete}
        inputMode={inputMode}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`glass-input ${error && touched ? 'error' : ''}`}
        placeholder=" "
      />
      <label htmlFor={id} className="glass-label">
        {label}
      </label>
      {isPassword && (
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? t('signup.hidePassword', 'Hide password') : t('signup.showPassword', 'Show password')}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
      {error && touched && <span className="glass-field-error">{error}</span>}
    </div>
  );
};

// Vivid selection card (for interests/goals) – each item carries its own
// accent color + short description so the grid feels alive, not clinical.
const OptionCard = ({ id, label, desc, icon: Icon, color, selected, onToggle, index = 0 }) => {
  return (
    <button
      type="button"
      className={`option-card ${selected ? 'selected' : ''}`}
      onClick={() => onToggle(id)}
      style={{ '--c': color, '--i': index }}
    >
      <div className="option-card-glow" />
      <div className="option-card-icon-wrap">
        <Icon size={22} />
      </div>
      <span className="option-card-label">{label}</span>
      {desc && <span className="option-card-desc">{desc}</span>}
      <div className="option-card-check">
        <Check size={13} strokeWidth={3} />
      </div>
    </button>
  );
};

const SignUpScreen = ({ onNext, onBack, initialMode = 'signup' }) => {
  const { t } = useTranslation('auth');
  const { signup, login, signInWithGoogle, resetPassword } = useAuth();

  // Mode: false = sign up, true = sign in. Explicitly driven by initialMode
  // so callers (e.g. the "Start Journey" CTA) always land on Create Account.
  const [isSignIn, setIsSignIn] = useState(initialMode === 'signin');
  const [isModeSwitching, setIsModeSwitching] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Form state – reduced to essentials
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    interests: [],
    journalingGoals: [],
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [resetMessage, setResetMessage] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // For composition (IME) support
  const [isComposing, setIsComposing] = useState(false);

  // Available options – each gets its own accent color + short description
  // for a more vivid, less clinical selection grid.
  const availableInterests = [
    { id: 'self-discovery', label: t('signup.interests.selfDiscovery.label', 'Self-Discovery'), desc: t('signup.interests.selfDiscovery.desc', 'Uncover who you really are'), icon: User, color: '85, 139, 110' },
    { id: 'mindfulness', label: t('signup.interests.mindfulness.label', 'Mindfulness'), desc: t('signup.interests.mindfulness.desc', 'Stay present, breathe easy'), icon: Leaf, color: '59, 130, 246' },
    { id: 'creativity', label: t('signup.interests.creativity.label', 'Creative Expression'), desc: t('signup.interests.creativity.desc', 'Turn thoughts into art'), icon: PenTool, color: '139, 92, 246' },
    { id: 'personal-growth', label: t('signup.interests.personalGrowth.label', 'Personal Growth'), desc: t('signup.interests.personalGrowth.desc', 'Level up, one page at a time'), icon: Target, color: '249, 115, 22' },
    { id: 'emotional-health', label: t('signup.interests.emotionalHealth.label', 'Emotional Health'), desc: t('signup.interests.emotionalHealth.desc', 'Understand what you feel'), icon: Heart, color: '239, 68, 68' },
    { id: 'gratitude', label: t('signup.interests.gratitude.label', 'Gratitude Practice'), desc: t('signup.interests.gratitude.desc', 'Notice the good, daily'), icon: Sparkles, color: '216, 178, 63' },
  ];

  const availableGoals = [
    { id: 'stress-reduction', label: t('signup.goals.stressReduction.label', 'Reduce Stress'), desc: t('signup.goals.stressReduction.desc', 'Find your calm'), icon: Leaf, color: '59, 130, 246' },
    { id: 'self-awareness', label: t('signup.goals.selfAwareness.label', 'Self-Awareness'), desc: t('signup.goals.selfAwareness.desc', 'See yourself clearly'), icon: Brain, color: '139, 92, 246' },
    { id: 'emotional-processing', label: t('signup.goals.emotionalProcessing.label', 'Process Emotions'), desc: t('signup.goals.emotionalProcessing.desc', "Work through what's hard"), icon: Heart, color: '239, 68, 68' },
    { id: 'personal-growth', label: t('signup.goals.personalGrowth.label', 'Personal Growth'), desc: t('signup.goals.personalGrowth.desc', 'Build the life you want'), icon: Target, color: '249, 115, 22' },
    { id: 'habit-tracking', label: t('signup.goals.habitTracking.label', 'Track Habits'), desc: t('signup.goals.habitTracking.desc', 'Build streaks that stick'), icon: Check, color: '85, 139, 110' },
    { id: 'memory-preservation', label: t('signup.goals.memoryPreservation.label', 'Preserve Memories'), desc: t('signup.goals.memoryPreservation.desc', 'Keep moments that matter'), icon: BookOpen, color: '216, 178, 63' },
  ];

  // Step definitions
  const steps = isSignIn
    ? [{ id: 'signin', title: t('signup.steps.signin.title', 'Welcome Back'), subtitle: t('signup.steps.signin.subtitle', 'Sign in to continue') }]
    : [
        { id: 'account', title: t('signup.steps.account.title', 'Create Account'), subtitle: t('signup.steps.account.subtitle', 'Begin your journaling journey') },
        { id: 'interests', title: t('signup.steps.interests.title', 'Your Interests'), subtitle: t('signup.steps.interests.subtitle', 'What would you like to explore?') },
        { id: 'goals', title: t('signup.steps.goals.title', 'Your Goals'), subtitle: t('signup.steps.goals.subtitle', 'What brings you to journaling?') },
        { id: 'welcome', title: t('signup.steps.welcome.title', 'Welcome to Καιρός'), subtitle: t('signup.steps.welcome.subtitle', "You're all set") },
      ];

  // Validation
  const validateField = (name, value) => {
    let errorMsg = '';
    switch (name) {
      case 'email':
        if (!value) errorMsg = t('signup.validation.emailRequired', 'Email is required');
        else if (!/\S+@\S+\.\S+/.test(value)) errorMsg = t('signup.validation.emailInvalid', 'Enter a valid email');
        break;
      case 'password':
        if (!value) errorMsg = t('signup.validation.passwordRequired', 'Password is required');
        else if (value.length < 6) errorMsg = t('signup.validation.passwordMinLength', 'At least 6 characters');
        break;
      case 'name':
        if (!isSignIn && !value) errorMsg = t('signup.validation.nameRequired', 'Name is required');
        break;
      default:
        break;
    }
    setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return !errorMsg;
  };

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (touchedFields[name]) validateField(name, value);
  };

  const handleInputChange = (name) => (e) => {
    if (isComposing) return;
    handleFieldChange(name, e.target.value);
  };

  const handleBlur = (name) => (e) => {
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    validateField(name, e.target.value);
  };

  const handleArrayToggle = (fieldName, id) => {
    const current = formData[fieldName];
    const updated = current.includes(id)
      ? current.filter((i) => i !== id)
      : [...current, id];
    handleFieldChange(fieldName, updated);
  };

  // Step transition with GPU-friendly animation
  const transitionToStep = async (newStep, direction) => {
    setIsTransitioning(true);
    setSlideDirection(direction);
    await new Promise((r) => setTimeout(r, 160));
    setCurrentStep(newStep);
    await new Promise((r) => setTimeout(r, 160));
    setIsTransitioning(false);
  };

  const goNext = async () => {
    if (isSignIn) return handleSignIn();

    const current = steps[currentStep];
    if (current.id === 'account') {
      const emailValid = validateField('email', formData.email);
      const passValid = validateField('password', formData.password);
      const nameValid = validateField('name', formData.name);
      setTouchedFields({ email: true, password: true, name: true });
      if (!emailValid || !passValid || !nameValid) return;
      await transitionToStep(1, 'right');
    } else if (current.id === 'interests') {
      await transitionToStep(2, 'right');
    } else if (current.id === 'goals') {
      await handleFinalSignUp();
      await transitionToStep(3, 'right');
    }
  };

  const goBack = async () => {
    if (currentStep > 0) {
      await transitionToStep(currentStep - 1, 'left');
    }
  };

  // Mode switching with flip transition
  const switchToSignIn = () => {
    setIsModeSwitching(true);
    setTimeout(() => {
      setIsSignIn(true);
      setIsModeSwitching(false);
    }, 200);
  };

  const switchToSignUp = () => {
    setIsModeSwitching(true);
    setTimeout(() => {
      setIsSignIn(false);
      setIsModeSwitching(false);
    }, 200);
  };

  // Sign In logic
  const handleSignIn = async () => {
    const emailValid = validateField('email', formData.email);
    const passValid = validateField('password', formData.password);
    setTouchedFields({ email: true, password: true });
    if (!emailValid || !passValid) return;

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      onNext(); // proceed to main app
    } catch (err) {
      setError(err.message || t('signup.errors.signInFailed', 'Sign in failed'));
    } finally {
      setIsLoading(false);
    }
  };

  // Final Sign Up – creates account
  const handleFinalSignUp = async () => {
    setIsLoading(true);
    try {
      await signup(formData.email, formData.password, formData.name, {
        interests: formData.interests,
        journalingGoals: formData.journalingGoals,
      });
    } catch (err) {
      setError(err.message || t('signup.errors.accountCreationFailed', 'Account creation failed'));
      if (err.code === 'auth/email-already-in-use') {
        switchToSignIn();
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      onNext(); // proceed to main app
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setError(err.message || t('signup.errors.googleSignInFailed', 'Google sign-in failed'));
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setResetMessage('');
    const emailValid = validateField('email', formData.email);
    setTouchedFields((prev) => ({ ...prev, email: true }));
    if (!emailValid) return;

    setIsResetting(true);
    try {
      await resetPassword(formData.email);
      setResetMessage(t('signup.resetLinkSent', 'Password reset link sent to {{email}}.', { email: formData.email }));
    } catch (err) {
      setError(err.message || t('signup.errors.resetEmailFailed', 'Could not send reset email'));
    } finally {
      setIsResetting(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    const step = steps[currentStep];

    if (step.id === 'signin' || step.id === 'account') {
      return (
        <div className="step-content account-step">
          <button
            type="button"
            className="glass-social-btn google-btn"
            onClick={handleGoogleSignIn}
            disabled={isLoading || isGoogleLoading}
          >
            {isGoogleLoading ? (
              <div className="glass-spinner-small glass-spinner-dark"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.65-2.23 1.03-3.71 1.03-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            <span>{isGoogleLoading ? t('signup.connecting', 'Connecting...') : t('signup.continueWithGoogle', 'Continue with Google')}</span>
          </button>

          <div className="glass-divider">
            <div className="glass-divider-line"></div>
            <div className="glass-divider-text">{t('signup.or', 'or')}</div>
          </div>

          <GlassInput
            id="email"
            type="email"
            icon={Mail}
            label={t('signup.emailLabel', 'Email')}
            value={formData.email}
            onChange={handleInputChange('email')}
            onBlur={handleBlur('email')}
            error={fieldErrors.email}
            touched={touchedFields.email}
            autoComplete="email"
            inputMode="email"
          />

          <GlassInput
            id="password"
            type="password"
            icon={Lock}
            label={t('signup.passwordLabel', 'Password')}
            value={formData.password}
            onChange={handleInputChange('password')}
            onBlur={handleBlur('password')}
            error={fieldErrors.password}
            touched={touchedFields.password}
            autoComplete={isSignIn ? 'current-password' : 'new-password'}
          />

          {isSignIn && (
            <div className="forgot-password-row">
              <button
                type="button"
                className="glass-link-btn forgot-password-link"
                onClick={handleForgotPassword}
                disabled={isResetting}
              >
                {isResetting ? t('signup.sendingLink', 'Sending link...') : t('signup.forgotPassword', 'Forgot password?')}
              </button>
            </div>
          )}

          {resetMessage && (
            <div className="glass-success-banner">
              <Check size={16} />
              <p>{resetMessage}</p>
            </div>
          )}

          {!isSignIn && (
            <GlassInput
              id="name"
              type="text"
              icon={User}
              label={t('signup.fullNameLabel', 'Full Name')}
              value={formData.name}
              onChange={handleInputChange('name')}
              onBlur={handleBlur('name')}
              error={fieldErrors.name}
              touched={touchedFields.name}
              autoComplete="name"
            />
          )}
        </div>
      );
    }

    if (step.id === 'interests') {
      return (
        <div className="step-content preferences-step">
          <div className="preferences-section">
            <div className="preferences-heading">
              <h4 className="preferences-title">{t('signup.interestsStep.title', 'What interests you?')}</h4>
              <p className="preferences-hint">{t('signup.interestsStep.hint', 'Pick as many as resonate')}</p>
            </div>
            {formData.interests.length > 0 && (
              <div className="selection-count-badge">
                <Sparkles size={13} />
                <span>{t('signup.selectedCount', '{{count}} selected', { count: formData.interests.length })}</span>
              </div>
            )}
            <div className="option-grid">
              {availableInterests.map((item, index) => (
                <OptionCard
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  desc={item.desc}
                  icon={item.icon}
                  color={item.color}
                  index={index}
                  selected={formData.interests.includes(item.id)}
                  onToggle={() => handleArrayToggle('interests', item.id)}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (step.id === 'goals') {
      return (
        <div className="step-content preferences-step">
          <div className="preferences-section">
            <div className="preferences-heading">
              <h4 className="preferences-title">{t('signup.goalsStep.title', 'Your journaling goals')}</h4>
              <p className="preferences-hint">{t('signup.goalsStep.hint', 'What do you want to get out of it?')}</p>
            </div>
            {formData.journalingGoals.length > 0 && (
              <div className="selection-count-badge">
                <Sparkles size={13} />
                <span>{t('signup.selectedCount', '{{count}} selected', { count: formData.journalingGoals.length })}</span>
              </div>
            )}
            <div className="option-grid">
              {availableGoals.map((item, index) => (
                <OptionCard
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  desc={item.desc}
                  icon={item.icon}
                  color={item.color}
                  index={index}
                  selected={formData.journalingGoals.includes(item.id)}
                  onToggle={() => handleArrayToggle('journalingGoals', item.id)}
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (step.id === 'welcome') {
      return (
        <div className="step-content welcome-step">
          <div className="welcome-icon-wrapper">
            <div className="success-ring">
              <Check size={40} strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="welcome-title">{t('signup.welcomeStep.title', 'Ready to begin?')}</h2>
          <p className="welcome-text">
            {t('signup.welcomeStep.text', 'Your journal is waiting. Start capturing moments, insights, and growth.')}
          </p>
          <button
            type="button"
            className="welcome-continue-btn"
            onClick={onNext}
            disabled={isLoading}
          >
            {isLoading ? t('signup.settingUp', 'Setting up...') : t('signup.startYourJourney', 'Start Your Journey')}
            <ChevronRight size={18} />
          </button>
        </div>
      );
    }

    return null;
  };

  // Generated once: a field of drifting, twinkling sparks behind the glass card.
  const sparks = useMemo(() => {
    const palette = ['255, 255, 255', '85, 139, 110', '139, 92, 246', '59, 130, 246', '216, 178, 63'];
    return Array.from({ length: 24 }, () => {
      const size = 2 + Math.random() * 4;
      const color = palette[Math.floor(Math.random() * palette.length)];
      return {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: `rgb(${color})`,
        boxShadow: `0 0 ${size * 2}px rgba(${color}, 0.9), 0 0 ${size * 5}px rgba(${color}, 0.4)`,
        // two animations: slow drift + faster twinkle (durations/delays paired)
        animationDuration: `${9 + Math.random() * 13}s, ${2 + Math.random() * 3}s`,
        animationDelay: `${Math.random() * -22}s, ${Math.random() * -5}s`,
        '--drift-x': `${(Math.random() - 0.5) * 140}px`,
        '--drift-y': `${(Math.random() - 0.5) * 140}px`,
      };
    });
  }, []);

  // Reset step when toggling sign-in/up (already handled by useEffect with isSignIn)
  useEffect(() => {
    setCurrentStep(0);
    setError('');
    setResetMessage('');
    setFieldErrors({});
    setTouchedFields({});
  }, [isSignIn]);

  return (
    <div className="glass-signup-container">
      <div className="signup-bg">
        <div className="signup-bg-gradient"></div>
        <div className="signup-bg-orb orb-1"></div>
        <div className="signup-bg-orb orb-2"></div>
        {/* Drifting sparks — crisp & bright so the glass card blurs them into
            soft glowing colour as they pass behind it (the "liquid glass" look) */}
        <div className="signup-sparks" aria-hidden="true">
          {sparks.map((s, i) => (
            <span key={i} className="signup-spark" style={s} />
          ))}
        </div>
      </div>

      <div className="glass-signup-card">
        {onBack && currentStep === 0 && !isSignIn && (
          <button onClick={onBack} className="card-back-btn">
            <ArrowLeft size={20} />
            <span>{t('signup.back', 'Back')}</span>
          </button>
        )}

        <div className="glass-signup-inner">
          <div className={`mode-transition ${isModeSwitching ? 'mode-switching' : ''}`}>
            {/* Progress indicator (only for sign-up) */}
            {!isSignIn && steps.length > 1 && (
              <div className="step-indicator">
                {steps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`step-dot ${idx === currentStep ? 'current' : ''} ${
                      idx < currentStep ? 'completed' : ''
                    }`}
                  />
                ))}
              </div>
            )}

            <div className="step-slide-container">
              <div
                className={`step-slide ${isTransitioning ? `slide-${slideDirection}` : ''}`}
                style={{ willChange: 'transform' }}
              >
                <div className="step-header">
                  <h1 className="step-title">{steps[currentStep].title}</h1>
                  <p className="step-subtitle">{steps[currentStep].subtitle}</p>
                </div>

                {error && (
                  <div className="glass-error-banner">
                    <div className="error-icon-wrap">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <p>{error}</p>
                    <button onClick={() => setError('')} className="error-dismiss">
                      {t('signup.dismiss', 'Dismiss')}
                    </button>
                  </div>
                )}

                {renderStepContent()}
              </div>
            </div>

            {/* Navigation buttons */}
            {steps[currentStep].id !== 'welcome' && (
              <div className="step-nav">
                {!isSignIn && currentStep > 0 && (
                  <button
                    type="button"
                    className="glass-nav-btn secondary"
                    onClick={goBack}
                    disabled={isTransitioning || isLoading}
                  >
                    <ChevronLeft size={18} />
                    {t('signup.back', 'Back')}
                  </button>
                )}
                <button
                  type="button"
                  className="glass-nav-btn primary"
                  onClick={goNext}
                  disabled={isTransitioning || isLoading}
                >
                  {isLoading ? (
                    <div className="glass-spinner-small"></div>
                  ) : (
                    <>
                      {isSignIn ? t('signup.signIn', 'Sign In') : steps[currentStep].id === 'goals' ? t('signup.createAccount', 'Create Account') : t('signup.continue', 'Continue')}
                      {!isSignIn && steps[currentStep].id !== 'goals' && <ChevronRight size={18} />}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Toggle between sign in / sign up */}
            <div className="glass-toggle-section">
              {isSignIn ? (
                <button type="button" className="glass-link-btn" onClick={switchToSignUp}>
                  {t('signup.noAccount', "Don't have an account?")} <span className="toggle-action">{t('signup.signUp', 'Sign up')}</span>
                </button>
              ) : (
                <button type="button" className="glass-link-btn" onClick={switchToSignIn}>
                  {t('signup.haveAccount', 'Already have an account?')} <span className="toggle-action">{t('signup.signIn2', 'Sign in')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="glass-terms">
          <p className="glass-terms-text">
            {t('signup.termsPrefix', 'By continuing, you agree to our')}{' '}
            <button className="term-link">{t('signup.termsOfService', 'Terms of Service')}</button> {t('signup.and', 'and')}{' '}
            <button className="term-link">{t('signup.privacyPolicy', 'Privacy Policy')}</button>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpScreen;