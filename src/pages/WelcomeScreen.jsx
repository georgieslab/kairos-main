// src/pages/WelcomeScreen.jsx
// Refactored: 5 slides – Apple Spatial Glass, all Lucide icons

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Pen, Mic, Palette, Sparkles, Brain,
  ArrowRight, ArrowLeft, Shield, BookOpen,
  User, Heart, Star, Zap, Check,
  Infinity as InfinityIcon, Target, Layers, Compass, Clock,
  Smartphone, Wifi, Lock, Download, Trash2
} from 'lucide-react';
import claudeLogo from '../icons/claude.png';
import kairosLogo from '../icons/kairos-logo.svg';
import { APP_VERSION } from '../utils/versionControl';
import '../styles/components/welcomeScreen.css';

const WelcomeScreen = ({ onStart, onNavigate }) => {
  const { t } = useTranslation('auth');
  const [currentCard, setCurrentCard] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const carouselRef = useRef(null);

  const minSwipeDistance = 50;

  // ===== 5 SLIDES (Merged) =====
  const cards = [
    { id: 'hero', type: 'hero' },
    { id: 'express', type: 'express' },        // multimodal + NFC merged
    { id: 'ai-intelligence', type: 'ai-intelligence' }, // AI + Personality merged
    { id: 'journeys', type: 'journeys' },
    { id: 'privacy-start', type: 'privacy-start' } // Privacy + Start merged
  ];

  const totalCards = cards.length;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (currentCard === 0) {
      const timer = setTimeout(() => {
        goToCard(1);
      }, isMobile ? 6000 : 5000);
      return () => clearTimeout(timer);
    }
  }, [currentCard, isMobile]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && currentCard < totalCards - 1) {
        goToCard(currentCard + 1);
      } else if (e.key === 'ArrowLeft' && currentCard > 0) {
        goToCard(currentCard - 1);
      } else if ((e.key === 'Enter' || e.key === ' ') && currentCard === totalCards - 1) {
        handleBeginJourney(e);
      } else if (e.key === 'Escape') {
        goToCard(totalCards - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCard]);

  const goToCard = (index) => {
    if (index >= 0 && index < totalCards && !isAnimating) {
      setIsAnimating(true);
      setCurrentCard(index);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const nextCard = () => goToCard(currentCard + 1);
  const prevCard = () => goToCard(currentCard - 1);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) nextCard();
      else prevCard();
    }
  };

  const handleBeginJourney = (e) => {
    if (e) e.preventDefault();
    if (typeof onStart === 'function') onStart();
  };

  const handleSkip = () => goToCard(totalCards - 1);

  // ===== SLIDE 1: HERO =====
  const HeroCard = () => (
    <div className="ws-card-content ws-hero">
      <div className="ws-hero-icon-container">
        <div className="ws-app-icon-large">
          <img src={kairosLogo} alt="Καιρός" className="ws-hero-logo" />
          <div className="ws-icon-glow"></div>
        </div>
        <div className="ws-pulse-rings">
          <div className="ws-pulse-ring"></div>
          <div className="ws-pulse-ring"></div>
          <div className="ws-pulse-ring"></div>
        </div>
      </div>
      <h1 className="ws-hero-title">Καιρός</h1>
      <p className="ws-hero-subtitle">{t('welcomeScreen.hero.subtitle', 'Your AI-Powered Journey to Self-Discovery')}</p>
      <div className="ws-hero-chips">
        <div className="ws-chip ws-chip-highlight">
                    <InfinityIcon size={16} />
          <span>{t('welcomeScreen.hero.chipMultiModal', "World's First Multi-Modal")}</span>
        </div>
        <div className="ws-chip">
          <Compass size={16} />
          <span>{t('welcomeScreen.hero.chipPaths', '50+ Journey Paths')}</span>
        </div>
      </div>
      <div className="ws-swipe-hint">
        <div className="ws-swipe-arrows">
          <ArrowRight className="ws-swipe-arrow" />
          <ArrowRight className="ws-swipe-arrow ws-swipe-echo" />
        </div>
        <span>{t('welcomeScreen.hero.swipeHint', 'Swipe to explore')}</span>
      </div>
    </div>
  );

  // ===== SLIDE 2: EXPRESS YOUR WAY (Multimodal + NFC merged) =====
  const ExpressCard = () => (
    <div className="ws-card-content ws-express">
      <div className="ws-badge ws-badge-new">
        <Zap size={14} />
        <span>{t('welcomeScreen.express.badge', 'MULTI-MODAL')}</span>
      </div>
      <h2 className="ws-card-title">{t('welcomeScreen.express.title', 'Express Your Way')}</h2>
      <p className="ws-card-subtitle">{t('welcomeScreen.express.subtitle', 'Write, Speak, or Paint — Your Journal Adapts')}</p>

      <div className="ws-modalities">
        <div className="ws-modality">
          <div className="ws-modality-icon ws-modality-pen">
            <Pen size={28} />
            <div className="ws-modality-glow"></div>
          </div>
          <span className="ws-modality-label">{t('welcomeScreen.express.handwrittenLabel', 'Handwritten')}</span>
          <span className="ws-modality-desc">{t('welcomeScreen.express.handwrittenDesc', 'Traditional journaling')}</span>
        </div>
        <div className="ws-modality">
          <div className="ws-modality-icon ws-modality-voice">
            <Mic size={28} />
            <div className="ws-modality-glow"></div>
          </div>
          <span className="ws-modality-label">{t('welcomeScreen.express.voiceLabel', 'Voice')}</span>
          <span className="ws-modality-desc">{t('welcomeScreen.express.voiceDesc', 'Speak your thoughts')}</span>
        </div>
        <div className="ws-modality">
          <div className="ws-modality-icon ws-modality-art">
            <Palette size={28} />
            <div className="ws-modality-glow"></div>
          </div>
          <span className="ws-modality-label">{t('welcomeScreen.express.artLabel', 'Visual Art')}</span>
          <span className="ws-modality-desc">{t('welcomeScreen.express.artDesc', 'Create & express')}</span>
        </div>
      </div>

      {/* NFC Bridge – merged here */}
      <div className="ws-nfc-bridge">
        <div className="ws-nfc-bridge-icon">
          <Smartphone size={20} />
          <Wifi size={16} className="ws-nfc-wifi" />
          <BookOpen size={20} />
        </div>
        <p className="ws-nfc-bridge-text">
          <span className="ws-nfc-highlight">{t('welcomeScreen.express.nfcHighlight', 'NFC-enabled')}</span> {t('welcomeScreen.express.nfcText', 'physical journals — tap to sync')}
        </p>
      </div>

      <p className="ws-card-description">
        {t('welcomeScreen.express.description', 'Write by hand, speak your heart, or paint your emotions. Your journal adapts to how you feel.')}
      </p>
    </div>
  );

  // ===== SLIDE 3: AI INTELLIGENCE (AI + Personality merged) =====
  const AIIntelligenceCard = () => (
    <div className="ws-card-content ws-ai-intelligence">
      <div className="ws-claude-badge-large">
        <img src={claudeLogo} alt="Claude" className="ws-claude-icon-large" />
        <div className="ws-claude-glow"></div>
        <div className="ws-claude-orbit" aria-hidden="true">
          <span className="ws-orbit-dot ws-orbit-dot-1"></span>
          <span className="ws-orbit-dot ws-orbit-dot-2"></span>
          <span className="ws-orbit-dot ws-orbit-dot-3"></span>
        </div>
      </div>
      
      <h2 className="ws-card-title">{t('welcomeScreen.ai.title', 'Powered by Claude AI')}</h2>
      <p className="ws-card-subtitle">{t('welcomeScreen.ai.subtitle', 'Intelligence That Understands You')}</p>

      <div className="ws-ai-grid">
        <div className="ws-ai-item">
          <div className="ws-ai-item-icon"><Sparkles size={20} /></div>
          <div className="ws-ai-item-text">
            <span className="ws-ai-item-title">{t('welcomeScreen.ai.smartAnalysisTitle', 'Smart Analysis')}</span>
            <span className="ws-ai-item-desc">{t('welcomeScreen.ai.smartAnalysisDesc', 'Deep pattern recognition')}</span>
          </div>
        </div>
        <div className="ws-ai-item">
          <div className="ws-ai-item-icon"><Brain size={20} /></div>
          <div className="ws-ai-item-text">
            <span className="ws-ai-item-title">{t('welcomeScreen.ai.contextualMemoryTitle', 'Contextual Memory')}</span>
            <span className="ws-ai-item-desc">{t('welcomeScreen.ai.contextualMemoryDesc', 'Remembers your journey')}</span>
          </div>
        </div>
        <div className="ws-ai-item">
          <div className="ws-ai-item-icon"><Heart size={20} /></div>
          <div className="ws-ai-item-text">
            <span className="ws-ai-item-title">{t('welcomeScreen.ai.empatheticInsightsTitle', 'Empathetic Insights')}</span>
            <span className="ws-ai-item-desc">{t('welcomeScreen.ai.empatheticInsightsDesc', 'Compassionate guidance')}</span>
          </div>
        </div>
        <div className="ws-ai-item">
          <div className="ws-ai-item-icon"><User size={20} /></div>
          <div className="ws-ai-item-text">
            <span className="ws-ai-item-title">{t('welcomeScreen.ai.personalityTitle', 'Personality Profile')}</span>
            <span className="ws-ai-item-desc">{t('welcomeScreen.ai.personalityDesc', 'Discover your true self')}</span>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== SLIDE 4: JOURNEYS =====
  const JourneysCard = () => (
    <div className="ws-card-content ws-journeys">
      <div className="ws-journeys-icon">
        <Compass size={40} />
        <div className="ws-compass-spin"></div>
      </div>
      <h2 className="ws-card-title">{t('welcomeScreen.journeys.title', '50+ Journey Paths')}</h2>
      <p className="ws-card-subtitle">{t('welcomeScreen.journeys.subtitle', 'Guided Experiences for Every Goal')}</p>

      {/* Journey path infographic — draws itself in */}
      <div className="ws-path-viz" aria-hidden="true">
        <svg viewBox="0 0 280 64" fill="none">
          <path
            className="ws-path-line"
            pathLength="1"
            d="M12 50 C 34 30, 54 22, 76 30 C 98 38, 118 50, 140 42 C 162 34, 182 16, 204 22 C 226 28, 248 24, 268 12"
          />
          <circle className="ws-path-dot ws-path-dot-1" cx="12" cy="50" r="5" />
          <circle className="ws-path-dot ws-path-dot-2" cx="76" cy="30" r="5" />
          <circle className="ws-path-dot ws-path-dot-3" cx="140" cy="42" r="5" />
          <circle className="ws-path-dot ws-path-dot-4" cx="204" cy="22" r="5" />
          <circle className="ws-path-dot ws-path-dot-5 ws-path-dot-star" cx="268" cy="12" r="6" />
        </svg>
        <div className="ws-path-labels">
          <span>{t('welcomeScreen.journeys.pathLabelStart', 'Day 1')}</span>
          <span>{t('welcomeScreen.journeys.pathLabelMiddle', 'Daily prompts')}</span>
          <span>{t('welcomeScreen.journeys.pathLabelEnd', 'Transformed')}</span>
        </div>
      </div>

      <div className="ws-journey-tags">
        <span className="ws-journey-tag">{t('welcomeScreen.journeys.tagSelfDiscovery', 'Self-Discovery')}</span>
        <span className="ws-journey-tag">{t('welcomeScreen.journeys.tagEmotionalIntelligence', 'Emotional Intelligence')}</span>
        <span className="ws-journey-tag">{t('welcomeScreen.journeys.tagMindfulness', 'Mindfulness')}</span>
        <span className="ws-journey-tag">{t('welcomeScreen.journeys.tagShadowWork', 'Shadow Work')}</span>
        <span className="ws-journey-tag">{t('welcomeScreen.journeys.tagGratitude', 'Gratitude')}</span>
        <span className="ws-journey-tag">{t('welcomeScreen.journeys.tagCreativeExpression', 'Creative Expression')}</span>
      </div>

      <div className="ws-journey-stats">
        <div className="ws-journey-stat">
          <Clock size={16} />
          <span>{t('welcomeScreen.journeys.statDays', '7–100 days')}</span>
        </div>
        <div className="ws-journey-stat">
          <Layers size={16} />
          <span>{t('welcomeScreen.journeys.statMultiModal', 'Multi-modal')}</span>
        </div>
        <div className="ws-journey-stat">
          <Target size={16} />
          <span>{t('welcomeScreen.journeys.statPersonalized', 'Personalized')}</span>
        </div>
      </div>
    </div>
  );

  // ===== SLIDE 5: PRIVACY + START (merged) =====
  const PrivacyStartCard = () => (
    <div className="ws-card-content ws-privacy-start">
      <div className="ws-privacy-icon">
        <Shield size={44} />
        <div className="ws-shield-glow"></div>
        <div className="ws-shield-check"><Check size={18} /></div>
      </div>
      
      <h2 className="ws-card-title">{t('welcomeScreen.privacyStart.title', 'Yours, and Yours Alone')}</h2>
      <p className="ws-card-subtitle">{t('welcomeScreen.privacyStart.subtitle', 'Private by Design')}</p>

      <div className="ws-privacy-features">
        <div className="ws-privacy-feature">
          <Brain size={16} className="ws-privacy-icon-svg" />
          <span>{t('welcomeScreen.privacyStart.feature1', 'Never used to train AI')}</span>
        </div>
        <div className="ws-privacy-feature">
          <Lock size={16} className="ws-privacy-icon-svg" />
          <span>{t('welcomeScreen.privacyStart.feature2', 'Encrypted in transit & at rest')}</span>
        </div>
        <div className="ws-privacy-feature">
          <Download size={16} className="ws-privacy-icon-svg" />
          <span>{t('welcomeScreen.privacyStart.feature3', 'Export your journals anytime')}</span>
        </div>
        <div className="ws-privacy-feature">
          <Trash2 size={16} className="ws-privacy-icon-svg" />
          <span>{t('welcomeScreen.privacyStart.feature4', 'Delete everything, anytime')}</span>
        </div>
      </div>

      <div className="ws-privacy-divider"></div>

      <p className="ws-card-description">
        {t('welcomeScreen.privacyStart.description', 'Transform your reflections into profound insights. Start writing your story today.')}
      </p>

      <button className="ws-start-button" onClick={handleBeginJourney}>
        <span>{t('welcomeScreen.privacyStart.button', 'Start Your Journey')}</span>
        <ArrowRight size={20} />
        <div className="ws-button-shimmer"></div>
      </button>

      <div className="ws-trust-badges">
        <div className="ws-trust-badge">
          <Shield size={14} />
          <span>{t('welcomeScreen.privacyStart.trustPrivacy', 'Privacy First')}</span>
        </div>
        <div className="ws-trust-badge">
              <InfinityIcon size={14} />
          <span>{t('welcomeScreen.privacyStart.trustMultiModal', 'Multi-Modal')}</span>
        </div>
        <div className="ws-trust-badge">
          <Star size={14} />
          <span>{t('welcomeScreen.privacyStart.trustPaths', '50+ Paths')}</span>
        </div>
      </div>
    </div>
  );

  // Render as plain function calls (not <JSX/> components): these are
  // redefined on every render, so mounting them as components gives React a
  // new element type each time → full remount → CSS entrance animations
  // replayed twice. Calling them keeps the DOM stable across re-renders.
  const renderCard = (card) => {
    switch (card.type) {
      case 'hero': return HeroCard();
      case 'express': return ExpressCard();
      case 'ai-intelligence': return AIIntelligenceCard();
      case 'journeys': return JourneysCard();
      case 'privacy-start': return PrivacyStartCard();
      default: return null;
    }
  };

  return (
    <div className={`ws-container ${isLoaded ? 'ws-loaded' : ''} ${isMobile ? 'ws-mobile' : 'ws-desktop'}`}>
      {/* Animated Background – No dots, only orbs */}
      <div className="ws-background">
        <div className="ws-bg-gradient"></div>
        <div className="ws-bg-orbs">
          <div className="ws-bg-orb ws-orb-1"></div>
          <div className="ws-bg-orb ws-orb-2"></div>
          <div className="ws-bg-orb ws-orb-3"></div>
        </div>
        <div className="ws-bg-vignette"></div>
      </div>

      {currentCard < totalCards - 1 && (
        <button className="ws-skip-btn" onClick={handleSkip}>
          <span>{t('welcomeScreen.skip', 'Skip')}</span>
          <ArrowRight size={16} />
        </button>
      )}

      <div 
        className="ws-carousel"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="ws-cards-track"
          style={{ transform: `translateX(-${currentCard * 100}%)` }}
        >
          {cards.map((card, index) => (
            <div 
              key={card.id} 
              className={`ws-card ws-card-${card.id} ${currentCard === index ? 'ws-card-active' : ''}`}
            >
              <div className="ws-card-inner">
                {renderCard(card)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ws-nav">
        <button 
          className={`ws-nav-arrow ${currentCard === 0 ? 'ws-nav-disabled' : ''}`}
          onClick={prevCard}
          disabled={currentCard === 0}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="ws-dots">
          {cards.map((_, index) => (
            <button
              key={index}
              className={`ws-dot ${currentCard === index ? 'ws-dot-active' : ''}`}
              onClick={() => goToCard(index)}
            />
          ))}
        </div>
        <button 
          className={`ws-nav-arrow ${currentCard === totalCards - 1 ? 'ws-nav-disabled' : ''}`}
          onClick={nextCard}
          disabled={currentCard === totalCards - 1}
        >
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="ws-version">v{APP_VERSION}</div>
    </div>
  );
};

export default WelcomeScreen;
