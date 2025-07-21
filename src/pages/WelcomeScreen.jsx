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
import claudeLogo from '../icons/claude.png';
import '../styles/components/welcome.css';
import { APP_VERSION } from '../utils/versionControl';

const WelcomeScreen = ({ onStart, onNavigate }) => {
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
    if (typeof onStart === 'function') {
      onStart();
    } else {
      console.error('onStart is not a function:', onStart);
    }
  };

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
    </div>
  );
};

export default WelcomeScreen;