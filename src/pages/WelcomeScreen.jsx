<<<<<<< HEAD
// src/pages/WelcomeScreen.jsx - v5.1.0-alpha Enhanced with Multi-Modal Feature

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Brain, 
  MessageCircle,
  Shield,
  ChevronRight,
  BookOpen,
  PenTool,
  TrendingUp,
  User,
  Zap,
  ArrowRight,
  Palette,
  Camera,
  FileText,
  BarChart3,
  Download,
  Heart,
  Compass,
  Target,
  Clock,
  Award,
  Infinity,
  Mic,
  Layers,
  Flame,
  Droplets,
  Mountain
} from 'lucide-react';
=======
// src/pages/WelcomeScreen.jsx - Updated with w- prefixed classes and new components

import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Shield, 
  User, 
  Brain, 
  Clock, 
  LineChart, 
  FileText,
  Lock,
  Database,
  Star,
  Headphones,
  Bot,
  Zap,
  Heart,
  Compass,
  ArrowRight,
  Palette,
  RotateCcw,
  Calendar,
  MessageCircle,
  Mic
} from 'lucide-react';
import MeditationMockup from '../components/mockups/MeditationMockup';
import AICoachingMockup from '../components/mockups/AICoachingMockup';
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
import claudeLogo from '../icons/claude.png';
import '../styles/components/welcome.css';
import { APP_VERSION } from '../utils/versionControl';

const WelcomeScreen = ({ onStart, onNavigate }) => {
<<<<<<< HEAD
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const totalPages = 11; // Expanded from 10 to 11 pages

  // Handle swipe gestures
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0 && currentPage < totalPages - 1) {
        navigateToPage(currentPage + 1);
      } else if (swipeDistance < 0 && currentPage > 0) {
        navigateToPage(currentPage - 1);
      }
    }
  };

  const navigateToPage = (page) => {
    if (page >= 0 && page < totalPages && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage(page);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  // Auto-advance timer for hero screen
  useEffect(() => {
    if (currentPage === 0) {
      const timer = setTimeout(() => {
        navigateToPage(1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const handleBeginJourney = (e) => {
    e.preventDefault();
    console.log('Begin journey button clicked');
=======
  // Make sure the event handler is properly defined
  const handleBeginJourney = (e) => {
    // Prevent default behavior
    e.preventDefault();
    
    // Add console log for debugging
    console.log('Begin journey button clicked');
    
    // Make sure onStart is a function before calling it
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    if (typeof onStart === 'function') {
      onStart();
    } else {
      console.error('onStart is not a function:', onStart);
    }
  };
<<<<<<< HEAD

  const pages = [
    // Page 1: Hero
    <div className="welcome-page hero-page" key="hero">
      <div className="hero-background">
        <div className="hero-gradient-1"></div>
        <div className="hero-gradient-2"></div>
        <div className="floating-element float-1"></div>
        <div className="floating-element float-2"></div>
        <div className="floating-element float-3"></div>
      </div>
      
      <div className="hero-content">
        <div className="app-icon-large">
          <div className="icon-inner">
            <Sparkles size={48} className="icon-sparkle" />
          </div>
        </div>
        
        <h1 className="hero-title">Καιρός</h1>
        <p className="hero-subtitle">AI-Powered Journaling Revolution</p>
        
        <div className="hero-features">
          <div className="hero-feature">
            <Brain size={20} />
            <span>Personality Insights</span>
          </div>
          <div className="hero-feature">
            <Layers size={20} />
            <span>Multi-Modal Journeys</span>
          </div>
          <div className="hero-feature">
            <BookOpen size={20} />
            <span>40 Journey Paths</span>
          </div>
        </div>
        
        <div className="swipe-hint">
          <ChevronRight className="swipe-icon" />
          <span>Swipe to explore</span>
        </div>
      </div>
    </div>,

    // Page 2: AI Personality Insights
    <div className="welcome-page feature-page ai-personality-page" key="ai-personality">
      <div className="feature-background personality-bg">
        <div className="neural-network"></div>
      </div>
      
      <div className="feature-content">
        <div className="feature-badge new-badge">
          <Zap size={16} />
          <span>NEW</span>
        </div>
        
        <div className="feature-icon-container personality-icon">
          <User size={32} />
          <Brain size={16} className="icon-overlay" />
        </div>
        
        <h2 className="feature-title">AI Personality Insights</h2>
        <p className="feature-description">
          Discover who you truly are through AI analysis of your journal entries
        </p>
        
        <div className="feature-grid">
          <div className="feature-item">
            <div className="feature-item-icon">✓</div>
            <span>Comprehensive personality profile</span>
          </div>
          <div className="feature-item">
            <div className="feature-item-icon">✓</div>
            <span>Identify your core strengths</span>
          </div>
          <div className="feature-item">
            <div className="feature-item-icon">✓</div>
            <span>Understand values & motivations</span>
          </div>
          <div className="feature-item">
            <div className="feature-item-icon">✓</div>
            <span>Track personality evolution</span>
          </div>
        </div>
        
        <div className="feature-preview">
          <div className="preview-card">
            <h4>Your Key Strengths</h4>
            <div className="strength-tags">
              <span className="tag">Empathetic</span>
              <span className="tag">Creative</span>
              <span className="tag">Resilient</span>
              <span className="tag">Analytical</span>
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Page 3: Daily AI Questions
    <div className="welcome-page feature-page ai-questions-page" key="ai-questions">
      <div className="feature-background questions-bg">
        <div className="chat-bubbles"></div>
      </div>
      
      <div className="feature-content">
        <div className="feature-badge new-badge">
          <Zap size={16} />
          <span>NEW</span>
        </div>
        
        <div className="feature-icon-container questions-icon">
          <MessageCircle size={32} />
          <Sparkles size={16} className="icon-overlay" />
        </div>
        
        <h2 className="feature-title">Daily AI Questions</h2>
        <p className="feature-description">
          Ask one personalized question daily and receive insights based on your entire journaling journey
        </p>
        
        <div className="feature-grid">
          <div className="question-example">
            <p>"What patterns do you notice in my emotions?"</p>
          </div>
          <div className="question-example">
            <p>"How has my perspective evolved over time?"</p>
          </div>
          <div className="question-example">
            <p>"What strengths am I developing?"</p>
          </div>
          <div className="question-example">
            <p>"What themes keep appearing in my life?"</p>
          </div>
        </div>
        
        <div className="feature-preview">
          <div className="ai-response-preview">
            <div className="ai-avatar">AI</div>
            <div className="ai-message">
              "Based on your 47 journal entries, I notice you're developing stronger emotional resilience..."
            </div>
          </div>
        </div>
      </div>
    </div>,

    // Page 4: Journey Paths Overview
    <div className="welcome-page feature-page paths-page" key="paths">
      <div className="feature-background paths-bg">
        <div className="path-network"></div>
      </div>
      
      <div className="feature-content">
        <div className="feature-icon-container paths-icon">
          <Compass size={32} />
        </div>
        
        <h2 className="feature-title">40 Unique Journey Paths</h2>
        <p className="feature-description">
          Choose from carefully crafted journaling experiences tailored to your growth needs
        </p>
        
        <div className="feature-grid">
          <div className="category-card">
            <div className="category-header">
              <Heart size={20} />
              <h4>Emotional Growth</h4>
            </div>
            <ul className="category-list">
              <li>Emotional Intelligence</li>
              <li>Anxiety Alchemy</li>
              <li>Inner Child Healing</li>
            </ul>
          </div>
          
          <div className="category-card">
            <div className="category-header">
              <Palette size={20} />
              <h4>Creative Expression</h4>
            </div>
            <ul className="category-list">
              <li>Mindful Visualization</li>
              <li>Abstract Emotions</li>
              <li>Sacred Geometry</li>
            </ul>
          </div>
        </div>
        
        <div className="feature-preview">
          <div className="path-duration-info">
            <Clock size={16} />
            <span>Paths range from 7 to 100 days</span>
          </div>
        </div>
      </div>
    </div>,

    // Page 5: 🌟 NEW - Revolutionary Multi-Modal Feature
    <div className="welcome-page feature-page multimodal-page" key="multimodal">
      <div className="feature-background multimodal-bg">
        <div className="elemental-flow"></div>
      </div>
      
      <div className="feature-content">
        <div className="feature-badge revolutionary-badge">
          <Sparkles size={16} />
          <span>WORLD'S FIRST</span>
        </div>
        
        <div className="feature-icon-container multimodal-icon">
          <Layers size={32} />
          <Infinity size={16} className="icon-overlay" />
        </div>
        
        <h2 className="feature-title">Multi-Modal Journeys</h2>
        <p className="feature-description">
          Revolutionary journeys that blend writing, visual art, and voice within single experiences
        </p>
        
        <div className="feature-grid">
          <div className="modality-card earth">
            <div className="modality-header">
              <Mountain size={20} />
              <h4>Earth Element</h4>
            </div>
            <div className="modality-sequence">
              <span className="modality-step">Day 1: Write</span>
              <span className="modality-step">Day 2: Draw</span>
              <span className="modality-step">Day 3: Speak</span>
            </div>
          </div>
          
          <div className="modality-card water">
            <div className="modality-header">
              <Droplets size={20} />
              <h4>Water Element</h4>
            </div>
            <div className="modality-sequence">
              <span className="modality-step">Day 4: Write</span>
              <span className="modality-step">Day 5: Draw</span>
              <span className="modality-step">Day 6: Speak</span>
            </div>
          </div>
        </div>
        
        <div className="feature-preview">
          <div className="multimodal-showcase">
            <div className="modality-icon">
              <FileText size={16} />
            </div>
            <div className="modality-plus">+</div>
            <div className="modality-icon">
              <Palette size={16} />
            </div>
            <div className="modality-plus">+</div>
            <div className="modality-icon">
              <Mic size={16} />
            </div>
            <div className="modality-equals">=</div>
            <div className="modality-result">Complete Self-Discovery</div>
          </div>
        </div>
      </div>
    </div>,

    // Page 6: Visual Journaling (Updated for consistency)
    <div className="welcome-page feature-page visual-page" key="visual">
      <div className="feature-background visual-bg">
        <div className="art-pattern"></div>
      </div>
      
      <div className="feature-content">
        <div className="feature-icon-container visual-icon">
          <PenTool size={32} />
        </div>
        
        <h2 className="feature-title">Visual Journaling</h2>
        <p className="feature-description">
          Express yourself through art with our specialized visual journaling paths
        </p>
        
        <div className="feature-grid">
          <div className="visual-item">
            <div className="visual-icon">🎨</div>
            <h4>Artistic Expression</h4>
            <p>Draw, paint, or sketch emotions</p>
          </div>
          
          <div className="visual-item">
            <div className="visual-icon">🖋️</div>
            <h4>Black Ink Mastery</h4>
            <p>33-day journey with techniques</p>
          </div>
          
          <div className="visual-item">
            <div className="visual-icon">🔮</div>
            <h4>Sacred Geometry</h4>
            <p>Create mandalas and patterns</p>
          </div>
          
          <div className="visual-item">
            <div className="visual-icon">🌿</div>
            <h4>Nature Sketching</h4>
            <p>Connect with nature through art</p>
          </div>
        </div>
        
        <div className="feature-preview">
          <div className="upload-preview">
            <Camera size={20} />
            <span>Upload artwork instead of text</span>
          </div>
        </div>
      </div>
    </div>,

    // Page 7: Smart Text Extraction (Updated for consistency)
    <div className="welcome-page feature-page extraction-page" key="extraction">
      <div className="feature-background extraction-bg">
        <div className="scan-lines"></div>
      </div>
      
      <div className="feature-content">
        <div className="feature-icon-container extraction-icon">
          <FileText size={32} />
          <Camera size={16} className="icon-overlay" />
        </div>
        
        <h2 className="feature-title">Smart Text Extraction</h2>
        <p className="feature-description">
          Transform your handwritten pages into digital text with advanced AI recognition
        </p>
        
        <div className="feature-grid">
          <div className="process-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Snap a Photo</h4>
              <p>Take picture of journal page</p>
            </div>
          </div>
          
          <div className="process-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>AI Processing</h4>
              <p>Advanced OCR extracts text</p>
            </div>
          </div>
          
          <div className="process-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Get Insights</h4>
              <p>Receive personalized analysis</p>
            </div>
          </div>
          
          <div className="process-step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>Track Growth</h4>
              <p>See patterns over time</p>
            </div>
          </div>
        </div>
        
        <div className="feature-preview">
          <div className="accuracy-badge">
            <Award size={20} />
            <span>92%+ accuracy on handwriting</span>
          </div>
        </div>
      </div>
    </div>,

    // Page 8: Progress Analytics (Updated for consistency)
    <div className="welcome-page feature-page analytics-page" key="analytics">
      <div className="feature-background analytics-bg">
        <div className="chart-pattern"></div>
      </div>
      
      <div className="feature-content">
        <div className="feature-icon-container analytics-icon">
          <BarChart3 size={32} />
          <TrendingUp size={16} className="icon-overlay" />
        </div>
        
        <h2 className="feature-title">Deep Analytics</h2>
        <p className="feature-description">
          Track your growth with comprehensive insights and pattern recognition
        </p>
        
        <div className="feature-grid">
          <div className="analytics-item">
            <Infinity size={20} />
            <h4>Streak Tracking</h4>
            <p>Build consistent habits</p>
          </div>
          
          <div className="analytics-item">
            <Heart size={20} />
            <h4>Emotional Patterns</h4>
            <p>Understand emotional cycles</p>
          </div>
          
          <div className="analytics-item">
            <Target size={20} />
            <h4>Progress Metrics</h4>
            <p>See growth over time</p>
          </div>
          
          <div className="analytics-item">
            <Brain size={20} />
            <h4>Theme Analysis</h4>
            <p>Discover recurring themes</p>
          </div>
        </div>
        
        <div className="feature-preview">
          <div className="export-feature">
            <Download size={20} />
            <span>Export your journey as PDF</span>
          </div>
        </div>
      </div>
    </div>,

    // Page 9: Privacy & Security (Updated for consistency)
    <div className="welcome-page feature-page privacy-page" key="privacy">
      <div className="feature-background privacy-bg">
        <div className="lock-pattern"></div>
      </div>
      
      <div className="feature-content">
        <div className="feature-icon-container privacy-icon">
          <Shield size={32} />
        </div>
        
        <h2 className="feature-title">Your Privacy Matters</h2>
        <p className="feature-description">
          Complete control over your data with industry-leading security
        </p>
        
        <div className="feature-grid">
          <div className="privacy-item">
            <div className="privacy-icon-small">🔒</div>
            <h4>End-to-End Encryption</h4>
            <p>AES-256 encrypted entries</p>
          </div>
          
          <div className="privacy-item">
            <div className="privacy-icon-small">💾</div>
            <h4>Local Storage First</h4>
            <p>Data stays on your device</p>
          </div>
          
          <div className="privacy-item">
            <div className="privacy-icon-small">🚫</div>
            <h4>No Third-Party Sharing</h4>
            <p>Your thoughts remain private</p>
          </div>
          
          <div className="privacy-item">
            <div className="privacy-icon-small">🗑️</div>
            <h4>Delete Anytime</h4>
            <p>Full control over your data</p>
          </div>
        </div>
        
        <div className="feature-preview">
          <div className="compliance-badges">
            <span className="compliance-badge">GDPR</span>
            <span className="compliance-badge">ENCRYPTED</span>
          </div>
        </div>
      </div>
    </div>,

    // Page 10: AI Partnership (Updated for consistency)
    <div className="welcome-page feature-page ai-partner-page" key="ai-partner">
      <div className="feature-background partner-bg">
        <div className="ai-network"></div>
      </div>
      
      <div className="feature-content">
        <div className="feature-icon-container claude-icon">
          <img src={claudeLogo} alt="Claude AI" className="claude-logo-small" />
        </div>
        
        <h2 className="feature-title">Powered by Claude AI</h2>
        <p className="feature-description">
          Experience the most advanced AI assistant for personal growth and self-reflection
        </p>
        
        <div className="feature-grid">
          <div className="capability-item">
            <Sparkles size={20} />
            <h4>Contextual Understanding</h4>
            <p>AI that truly gets your journey</p>
          </div>
          
          <div className="capability-item">
            <Brain size={20} />
            <h4>Pattern Recognition</h4>
            <p>Discovers insights you might miss</p>
          </div>
          
          <div className="capability-item">
            <Heart size={20} />
            <h4>Empathetic Responses</h4>
            <p>Supportive, non-judgmental</p>
          </div>
          
          <div className="capability-item">
            <Shield size={20} />
            <h4>Ethical AI</h4>
            <p>Built with safety in mind</p>
          </div>
        </div>
        
        <div className="feature-preview">
          <div className="ai-partnership-badge">
            <Brain size={16} />
            <span>Next-generation AI technology</span>
          </div>
        </div>
      </div>
    </div>,

    // Page 11: Get Started (Updated for consistency)
    <div className="welcome-page get-started-page" key="get-started">
      <div className="started-background">
        <div className="radial-gradient"></div>
        <div className="particle-field"></div>
      </div>
      
      <div className="started-content">
        <div className="success-icon">
          <Sparkles size={48} />
        </div>
        
        <h2 className="started-title">Begin Your Journey</h2>
        <p className="started-description">
          Join thousands discovering deeper self-awareness through AI-powered journaling
        </p>
        
        <button className="get-started-button" onClick={handleBeginJourney}>
          <span>Start Journaling</span>
          <ArrowRight size={20} />
        </button>
        
        <div className="trust-indicators">
          <div className="trust-item">
            <Shield size={16} />
            <span>Privacy First</span>
          </div>
          <div className="trust-item">
            <Layers size={16} />
            <span>Multi-Modal</span>
          </div>
          <div className="trust-item">
            <BookOpen size={16} />
            <span>40 Paths</span>
          </div>
        </div>
        
        <div className="app-version">
          <span>Version {APP_VERSION}</span>
        </div>
      </div>
    </div>
  ];

  return (
    <div 
      className="android-welcome-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Status Bar Spacer */}
      <div className="status-bar-spacer"></div>
      
      {/* Skip Button */}
      {currentPage < totalPages - 1 && (
        <button 
          className="skip-button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Skip button clicked, navigating to page:', totalPages - 1);
            setCurrentPage(totalPages - 1);
          }}
        >
          Skip
        </button>
      )}
      
      {/* Pages Container */}
      <div className="pages-container">
        <div 
          className="pages-wrapper"
          style={{ 
            transform: `translateX(-${currentPage * 100}vw)`,
            width: `${totalPages * 100}vw`
          }}
        >
          {pages}
        </div>
      </div>
      
      {/* Page Indicators */}
      <div className="page-indicators">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentPage ? 'active' : ''}`}
            onClick={() => navigateToPage(index)}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Navigation Buttons (for larger screens or accessibility) */}
      {currentPage < totalPages - 1 && (
        <button 
          className="next-button"
          onClick={() => navigateToPage(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={24} />
        </button>
      )}
=======
  
  return (
    <div className="w-welcome-container">
      {/* Hero Section */}
      <section className="w-hero-section">
        <div className="w-bg-pattern"></div>
        
        <div className="w-title-container">
          <div className="w-laurel-wreath-left"></div>
          <h1 className="w-app-title">Καιρός</h1>
          <div className="w-laurel-wreath-right"></div>
          <p className="w-tagline">The Timeless Art of Momentary Reflection</p>
        </div>
        
        <p className="w-subtitle">
          Transform your journaling experience with AI-powered insights and guidance.
          Discover patterns, gain clarity, and deepen your self-awareness.
        </p>
        
        {/* AI Partnership Badge */}
        <div className="w-ai-partnership">
          <div className="w-badge">
            <img src={claudeLogo} alt="Claude AI" className="w-claude-logo" />
            <span>Powered by Claude AI</span>
          </div>
        </div>
        
        {/* CTA Button */}
        <div className="w-cta-section">
          <button 
            onClick={handleBeginJourney}
            className="w-cta-button"
            id="begin-journey-button"
          >
            Begin Your Journey
          </button>
        </div>
      </section>

      {/* Updated Journeys Section */}
      <section className="w-journeys-section">
        <h2 className="w-section-title">Five Paths to Greater Awareness</h2>
        <p className="w-journeys-intro">
          Explore our personalized journaling paths, each designed to guide you through a unique experience 
          that enhances different aspects of your personal growth.
        </p>
        
        <div className="w-journeys-grid">
          {/* Self-Discovery Journey */}
          <div className="w-journey-card self-discovery">
            <div className="w-journey-icon-container">
              <Compass className="w-journey-icon" />
            </div>
            <h3 className="w-journey-title">Self-Discovery Journey</h3>
            <p className="w-journey-description">
              Explore your core values, beliefs, and aspirations through guided reflection prompts 
              that help you understand who you truly are.
            </p>
            <ul className="w-journey-benefits">
              <li>Gain clarity on personal values</li>
              <li>Identify thought patterns</li>
              <li>Develop greater self-awareness</li>
              <li>Create a vision for your future</li>
            </ul>
            <div className="w-journey-metadata">
              <div className="w-journey-difficulty">
                <Zap size={16} style={{ color: '#0ea5e9' }} />
                <span>Beginner</span>
              </div>
              <div className="w-journey-duration">
                <Calendar size={16} />
                <span>10 days</span>
              </div>
            </div>
            <button 
              className="w-journey-button"
              onClick={handleBeginJourney}
            >
              <span>Start This Path</span>
              <ArrowRight size={16} />
            </button>
          </div>
          
          {/* Emotional Intelligence */}
          <div className="w-journey-card emotional-intelligence">
            <div className="w-journey-icon-container">
              <Heart className="w-journey-icon" />
            </div>
            <h3 className="w-journey-title">Emotional Intelligence</h3>
            <p className="w-journey-description">
              Develop awareness and mastery of your emotional landscape through structured 
              exercises that enhance your ability to understand and manage feelings.
            </p>
            <ul className="w-journey-benefits">
              <li>Recognize complex emotions</li>
              <li>Understand emotional triggers</li>
              <li>Develop emotional regulation</li>
              <li>Improve relationships</li>
            </ul>
            <div className="w-journey-metadata">
              <div className="w-journey-difficulty">
                <Zap size={16} style={{ color: '#a855f7' }} />
                <span>Intermediate</span>
              </div>
              <div className="w-journey-duration">
                <Calendar size={16} />
                <span>10 days</span>
              </div>
            </div>
            <button 
              className="w-journey-button"
              onClick={handleBeginJourney}
            >
              <span>Start This Path</span>
              <ArrowRight size={16} />
            </button>
          </div>
          
          {/* Mindfulness & Awareness */}
          <div className="w-journey-card mindfulness">
            <div className="w-journey-icon-container">
              <Brain className="w-journey-icon" />
            </div>
            <h3 className="w-journey-title">Mindfulness & Awareness</h3>
            <p className="w-journey-description">
              Learn to be more present through daily journaling practices focused on sensory 
              awareness, thought observation, and engagement with the present moment.
            </p>
            <ul className="w-journey-benefits">
              <li>Reduce future/past anxiety</li>
              <li>Enhance sensory awareness</li>
              <li>Develop non-judgmental observation</li>
              <li>Find peace in daily life</li>
            </ul>
            <div className="w-journey-metadata">
              <div className="w-journey-difficulty">
                <Zap size={16} style={{ color: '#0ea5e9' }} />
                <span>Beginner</span>
              </div>
              <div className="w-journey-duration">
                <Calendar size={16} />
                <span>10 days</span>
              </div>
            </div>
            <button className="w-journey-button">
              <span>Start This Path</span>
              <ArrowRight size={16} />
            </button>
          </div>
          
          {/* New: Transformation Journey */}
          <div className="w-journey-card transformation-journey">
            <div className="w-journey-icon-container">
              <RotateCcw className="w-journey-icon" />
            </div>
            <h3 className="w-journey-title">Transformation Journey</h3>
            <p className="w-journey-description">
              This extended journey helps you understand, address, and transform challenging patterns in your 
              life through awareness, strategy-building, and sustainable change practices.
            </p>
            <ul className="w-journey-benefits">
              <li>Identify limiting patterns</li>
              <li>Develop effective change strategies</li>
              <li>Create sustainable habits</li>
              <li>Build resilience through awareness</li>
            </ul>
            <div className="w-journey-metadata">
              <div className="w-journey-difficulty">
                <Star size={16} style={{ color: '#dc2626' }} />
                <span>Advanced</span>
              </div>
              <div className="w-journey-duration">
                <Calendar size={16} />
                <span>21 days</span>
              </div>
            </div>
            <button 
              className="w-journey-button"
              onClick={handleBeginJourney}
            >
              <span>Start This Path</span>
              <ArrowRight size={16} />
            </button>
          </div>
          
          {/* New: Creative Expression */}
          <div className="w-journey-card creative-expression">
            <div className="w-journey-icon-container">
              <Palette className="w-journey-icon" />
            </div>
            <h3 className="w-journey-title">Creative Expression</h3>
            <p className="w-journey-description">
              Rediscover your creative voice through daily prompts designed to overcome blocks, 
              explore new forms of expression, and establish a sustainable creative practice.
            </p>
            <ul className="w-journey-benefits">
              <li>Overcome creative blocks</li>
              <li>Explore new modes of expression</li>
              <li>Connect with your authentic voice</li>
              <li>Develop creative confidence</li>
            </ul>
            <div className="w-journey-metadata">
              <div className="w-journey-difficulty">
                <Zap size={16} style={{ color: '#0ea5e9' }} />
                <span>Beginner</span>
              </div>
              <div className="w-journey-duration">
                <Calendar size={16} />
                <span>14 days</span>
              </div>
            </div>
            <button 
              className="w-journey-button"
              onClick={handleBeginJourney}
            >
              <span>Start This Path</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-features-section">
        <h2 className="w-section-title">Discover Deeper Self-Awareness</h2>
        
        <div className="w-features-grid">
          <div className="w-feature-card">
            <div className="w-feature-icon-container">
              <Sparkles className="w-feature-icon" />
            </div>
            <h3 className="w-feature-title">AI-Powered Insights</h3>
            <p className="w-feature-description">
              Transform your journaling with personalized analysis that reveals patterns and provides meaningful insights about your thoughts and emotions.
            </p>
          </div>

          <div className="w-feature-card">
            <div className="w-feature-icon-container">
              <BookOpen className="w-feature-icon" />
            </div>
            <h3 className="w-feature-title">Multiple Journeys</h3>
            <p className="w-feature-description">
              Embark on a variety of unique journeys, each designed to promote different aspects of personal growth, creativity, and awareness.
            </p>
          </div>

          <div className="w-feature-card">
            <div className="w-feature-icon-container">
              <Brain className="w-feature-icon" />
            </div>
            <h3 className="w-feature-title">Personalized Analysis</h3>
            <p className="w-feature-description">
              Receive tailored insights from Claude AI that adapt to your writing style and content, highlighting valuable patterns unique to your journaling practice.
            </p>
          </div>

          <div className="w-feature-card">
            <div className="w-feature-icon-container">
              <Clock className="w-feature-icon" />
            </div>
            <h3 className="w-feature-title">Track Progress</h3>
            <p className="w-feature-description">
              Monitor your journaling streak, track emotional trends, and visualize your growth over time with intuitive analytics for each journaling path.
            </p>
          </div>

          <div className="w-feature-card">
            <div className="w-feature-icon-container">
              <LineChart className="w-feature-icon" />
            </div>
            <h3 className="w-feature-title">Emotional Insights</h3>
            <p className="w-feature-description">
              Gain deeper understanding of your emotional patterns with visual representations of moods and feelings extracted from your writing.
            </p>
          </div>

          <div className="w-feature-card">
            <div className="w-feature-icon-container">
              <FileText className="w-feature-icon" />
            </div>
            <h3 className="w-feature-title">Text Extraction</h3>
            <p className="w-feature-description">
              Turn your handwritten journal entries into digital text automatically with our advanced text recognition technology.
            </p>
          </div>
        </div>
      </section>
      
      {/* Upcoming Features Header */}
      <div className="w-upcoming-features-header" style={{textAlign: 'center', marginTop: '3rem'}}>
        <h2 className="w-section-title">Upcoming Features</h2>
        <p style={{color: 'rgba(255, 255, 255, 0.7)', maxWidth: '800px', margin: '0 auto 1rem', lineHeight: '1.6', fontSize: '1.125rem'}}>
          We're constantly evolving. Here's a sneak peek at powerful new features coming to Καιρός later this year.
        </p>
      </div>
      
      {/* AI Coaching Section - Coming Soon */}
      <section className="w-ai-coaching-section">
        <div className="w-bg-pattern-subtle"></div>
        <h2 className="w-section-title" style={{background: 'linear-gradient(90deg, #6366F1, #8B5CF6)'}}>AI Coach Assistant</h2>
        
        <div className="w-ai-coaching-card">
          <div className="w-ai-coaching-content">
            <div className="w-ai-coaching-text">
              <h3 className="w-ai-coaching-title">Personal Growth Coach in Your Pocket</h3>
              <p className="w-ai-coaching-description">
                Engage in meaningful conversations with your AI coach that understands your unique journey through your journal entries. 
                Get personalized guidance, reflective questions, and supportive feedback to help you navigate challenges and achieve your personal growth goals.
              </p>
              
              <div className="w-ai-coaching-mockup">
                <AICoachingMockup />
              </div>
              
              <div className="w-ai-coaching-features">
                <div className="w-coaching-pill">
                  <MessageCircle size={16} />
                  <span>Conversational guidance</span>
                </div>
                <div className="w-coaching-pill">
                  <Bot size={16} />
                  <span>Personalized to your entries</span>
                </div>
                <div className="w-coaching-pill">
                  <Mic size={16} />
                  <span>Voice & text interaction</span>
                </div>
              </div>
              
              <div className="w-coming-soon-timeline">
                <span className="w-timeline-label">Expected Release:</span>
                <span className="w-timeline-date">Fall 2025</span>
              </div>
              
              <button className="w-notify-button" style={{backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#8B5CF6', borderColor: 'rgba(99, 102, 241, 0.3)'}}>
                Get Notified
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Coming Soon Section - Updated Meditation */}
      <section className="w-coming-soon-section">
        <div className="w-bg-pattern-subtle"></div>
        <h2 className="w-section-title" style={{background: 'linear-gradient(90deg, #10B981, #059669)'}}>Guided Meditations</h2>
        
        <div className="w-coming-soon-card">
          <div className="w-coming-soon-content">
            <div className="w-coming-soon-text">
              <h3 className="w-coming-soon-title">Personalized Audio Journeys</h3>
              <p className="w-coming-soon-description">
                Experience personalized guided meditations created based on your journal entries. 
                Our AI analyzes your reflections and generates custom audio meditations 
                that address your specific thoughts, concerns, and aspirations.
              </p>
              
              <div className="w-coming-soon-mockup">
                <MeditationMockup />
              </div>
              
              <div className="w-coming-soon-features">
                <div className="w-feature-pill">
                  <Zap size={16} />
                  <span>Personalized content</span>
                </div>
                <div className="w-feature-pill">
                  <Bot size={16} />
                  <span>AI-generated scripts</span>
                </div>
                <div className="w-feature-pill">
                  <Headphones size={16} />
                  <span>Premium voice narration</span>
                </div>
              </div>
              
              <div className="w-coming-soon-timeline">
                <span className="w-timeline-label">Expected Release:</span>
                <span className="w-timeline-date">Summer 2025</span>
              </div>
              
              <button className="w-notify-button">
                Get Notified
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="w-testimonials-section">
        <h2 className="w-section-title">What Our Users Say</h2>
        
        <div className="w-testimonials-container">
          <div className="w-testimonial-card">
            <p className="w-testimonial-quote">
              "Καιρός has transformed my journaling practice. The AI insights helped me notice patterns in my thoughts I never would have seen on my own."
            </p>
            <div className="w-testimonial-author">
              <div className="w-author-avatar">M</div>
              <div className="w-author-info">
                <p className="w-author-name">Michael K.</p>
                <p className="w-author-role">Daily Journaler</p>
              </div>
            </div>
          </div>
          
          <div className="w-testimonial-card">
            <p className="w-testimonial-quote">
              "The 10-day journey was exactly what I needed to establish a consistent journaling habit. The prompts were thoughtful and the insights were eye-opening."
            </p>
            <div className="w-testimonial-author">
              <div className="w-author-avatar">S</div>
              <div className="w-author-info">
                <p className="w-author-name">Sarah J.</p>
                <p className="w-author-role">Mindfulness Practitioner</p>
              </div>
            </div>
          </div>
          
          <div className="w-testimonial-card">
            <p className="w-testimonial-quote">
              "The Emotional Intelligence path helped me understand my feelings in a whole new way. I'm much more aware of my emotional triggers and responses now."
            </p>
            <div className="w-testimonial-author">
              <div className="w-author-avatar">J</div>
              <div className="w-author-info">
                <p className="w-author-name">James T.</p>
                <p className="w-author-role">Emotional Intelligence Explorer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-how-it-works-section">
        <h2 className="w-section-title">How It Works</h2>
        
        <div className="w-how-it-works-container">
          <div className="w-how-it-works-card">
            <div className="w-feature-icon-container" style={{ margin: "0 auto 1rem" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>1</div>
            </div>
            <h3 className="w-feature-title" style={{ textAlign: "center" }}>Choose Your Path</h3>
            <p className="w-how-it-works-description">
              Select from five unique journaling paths based on your personal growth goals and interests.
            </p>
          </div>
          
          <div className="w-how-it-works-card">
            <div className="w-feature-icon-container" style={{ margin: "0 auto 1rem" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>2</div>
            </div>
            <h3 className="w-feature-title" style={{ textAlign: "center" }}>Write & Upload</h3>
            <p className="w-how-it-works-description">
              Respond to daily prompts in your journal and upload a photo of your entry or type directly in the app.
            </p>
          </div>
          
          <div className="w-how-it-works-card">
            <div className="w-feature-icon-container" style={{ margin: "0 auto 1rem" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>3</div>
            </div>
            <h3 className="w-feature-title" style={{ textAlign: "center" }}>Receive Insights</h3>
            <p className="w-how-it-works-description">
              Get personalized analysis and path-specific guidance from Claude AI based on your writing.
            </p>
          </div>
          
          <div className="w-how-it-works-card">
            <div className="w-feature-icon-container" style={{ margin: "0 auto 1rem" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>4</div>
            </div>
            <h3 className="w-feature-title" style={{ textAlign: "center" }}>Track Growth</h3>
            <p className="w-how-it-works-description">
              Monitor your progress through comprehensive analytics as you complete all journaling paths.
            </p>
          </div>
        </div>
      </section>
      
      {/* Claude AI Partnership Section */}
      <section className="w-ai-partnership-section">
        <div className="w-ai-partnership-container">
          <div className="w-ai-partnership-content">
            <div className="w-ai-partnership-logo">
              <img src={claudeLogo} alt="Claude AI" className="w-partnership-claude-logo" />
            </div>
            <div className="w-ai-partnership-text">
              <h3 className="w-ai-partnership-title">Powered by Claude AI</h3>
              <p className="w-ai-partnership-description">
                Καιρός partners with Anthropic's Claude AI to deliver insightful analysis of your journal entries. 
                Claude's natural language understanding helps identify patterns, emotions, and themes in your writing, 
                offering personalized guidance for your self-reflection journey.
              </p>
              <p className="w-ai-partnership-description">
                With Claude's advanced capabilities, your journal entries are transformed into meaningful 
                insights that promote self-awareness and personal growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="w-privacy-section">
        <h2 className="w-section-title">Privacy & Data Protection</h2>
        
        <div className="w-privacy-grid">
          <div className="w-privacy-card">
            <div className="w-privacy-header">
              <Shield className="w-privacy-icon" />
              <h3 className="w-privacy-title">Data Collection</h3>
            </div>
            <ul className="w-privacy-list">
              <li className="w-privacy-item">
                <span className="w-privacy-bullet">•</span>
                <span className="w-privacy-text">Journal entries are stored locally first</span>
              </li>
              <li className="w-privacy-item">
                <span className="w-privacy-bullet">•</span>
                <span className="w-privacy-text">End-to-end encryption for cloud sync</span>
              </li>
              <li className="w-privacy-item">
                <span className="w-privacy-bullet">•</span>
                <span className="w-privacy-text">No third-party data sharing</span>
              </li>
            </ul>
          </div>

          <div className="w-privacy-card">
            <div className="w-privacy-header">
              <User className="w-privacy-icon" />
              <h3 className="w-privacy-title">Your Rights</h3>
            </div>
            <ul className="w-privacy-list">
              <li className="w-privacy-item">
                <span className="w-privacy-bullet">•</span>
                <span className="w-privacy-text">Full control over your data</span>
              </li>
              <li className="w-privacy-item">
                <span className="w-privacy-bullet">•</span>
                <span className="w-privacy-text">Right to export all entries</span>
              </li>
              <li className="w-privacy-item">
                <span className="w-privacy-bullet">•</span>
                <span className="w-privacy-text">Right to delete account</span>
              </li>
            </ul>
          </div>

          <div className="w-privacy-card">
            <div className="w-privacy-header">
              <Lock className="w-privacy-icon" />
              <h3 className="w-privacy-title">Security</h3>
            </div>
            <ul className="w-privacy-list">
              <li className="w-privacy-item">
                <span className="w-privacy-bullet">•</span>
                <span className="w-privacy-text">AES-256 encryption</span>
              </li>
              <li className="w-privacy-item">
                <span className="w-privacy-bullet">•</span>
                <span className="w-privacy-text">Regular security audits</span>
              </li>
              <li className="w-privacy-item">
                <span className="w-privacy-bullet">•</span>
                <span className="w-privacy-text">GDPR compliance</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Additional CTA */}
      <section className="w-cta-section" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
        <h2 className="w-section-title" style={{ marginBottom: "2rem" }}>Ready to Start Your Journaling Journey?</h2>
        <button 
          onClick={handleBeginJourney}
          className="w-cta-button"
        >
          Begin Now
        </button>
      </section>
      
      {/* Footer */}
      <footer className="w-welcome-footer">
        <div className="w-footer-links">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onNavigate('privacy-policy');
            }} 
            className="w-footer-link"
          >
            Privacy Policy
          </a>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onNavigate('terms-of-service');
            }} 
            className="w-footer-link"
          >
            Terms of Service
          </a>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onNavigate('contact-us');
            }} 
            className="w-footer-link"
          >
            Contact Us
          </a>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              onNavigate('about');
            }} 
            className="w-footer-link"
          >
            About
          </a>
        </div>
        <p className="w-copyright">© 2025 Καιρός. All rights reserved.</p>
        <p className="w-version-info">Version {APP_VERSION}</p>
      </footer>
>>>>>>> d849eb9f8284a74721875c0198cc025c3e69e188
    </div>
  );
};

export default WelcomeScreen;