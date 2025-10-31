import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Brain, MessageCircle, Shield, ChevronRight, BookOpen, PenTool, 
  TrendingUp, User, Zap, ArrowRight, Palette, Camera, FileText, BarChart3, 
  Download, Heart, Compass, Target, Clock, Award, Infinity, Check, Star,
  Lightbulb, Smile, Gem, Trophy, CheckCircle, Menu, X
} from 'lucide-react';
import claudeLogo from '../icons/claude.png';
import kairosLogo from '../icons/kairos-logo.svg';
import { APP_VERSION } from '../utils/versionControl';
import '../styles/components/welcomeScreen.css'; // Import the CSS file

const WelcomeScreen = ({ onStart, onNavigate }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef(null);

  const totalPages = 10;

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animate on load
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

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

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' && currentPage < totalPages - 1) {
        navigateToPage(currentPage + 1);
      } else if (e.key === 'ArrowLeft' && currentPage > 0) {
        navigateToPage(currentPage - 1);
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (currentPage === totalPages - 1) {
          handleBeginJourney();
        } else {
          navigateToPage(currentPage + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage]);

  const navigateToPage = (page) => {
    if (page >= 0 && page < totalPages && !isAnimating) {
      setIsAnimating(true);
      setCurrentPage(page);
      setTimeout(() => setIsAnimating(false), 400);
    }
  };

  // Auto-advance timer for hero screen
  useEffect(() => {
    if (currentPage === 0) {
      const timer = setTimeout(() => {
        navigateToPage(1);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const handleBeginJourney = (e) => {
    if (e) e.preventDefault();
    if (typeof onStart === 'function') {
      onStart();
    }
  };

  const pages = [
    // Page 1: Hero
    {
      id: 'hero',
      component: (
        <div className="kairos-welcome-page-content">
          <div className="kairos-hero-icon-container">
            <div className="kairos-app-icon-large">
              <img src={kairosLogo} alt="Καιρός" className="kairos-hero-logo" />
              <div className="kairos-icon-glow"></div>
              <div className="kairos-floating-sparkles">
                <Star className="kairos-sparkle kairos-sparkle-1" />
                <Gem className="kairos-sparkle kairos-sparkle-2" />
                <Heart className="kairos-sparkle kairos-sparkle-3" />
              </div>
            </div>
          </div>
          
          <div className="kairos-hero-text">
            <h1 className="kairos-hero-title">Καιρός</h1>
            <p className="kairos-hero-subtitle">Your AI-Powered Journey to Self-Discovery</p>
          </div>
          
          <div className="kairos-hero-features">
            <div className="kairos-feature-chip">
              <Brain className="kairos-chip-icon" />
              <span>Personality Insights</span>
            </div>
            <div className="kairos-feature-chip">
              <MessageCircle className="kairos-chip-icon" />
              <span>AI Questions</span>
            </div>
            <div className="kairos-feature-chip">
              <BookOpen className="kairos-chip-icon" />
              <span>40 Journey Paths</span>
            </div>
          </div>
          
          <div className="kairos-swipe-hint">
            <div className="kairos-swipe-icon">
              <ChevronRight />
            </div>
            <span>Swipe to explore features</span>
          </div>
        </div>
      )
    },
    
    // Page 2: AI Personality
    {
      id: 'personality',
      component: (
        <div className="kairos-welcome-page-content">
          <div className="kairos-feature-badge kairos-badge-new">
            <Zap className="kairos-badge-icon" />
            <span>NEW</span>
          </div>
          
          <div className="kairos-feature-icon-container">
            <div className="kairos-feature-icon kairos-personality">
              <User />
              <div className="kairos-pulse-rings">
                <div className="kairos-pulse-ring"></div>
                <div className="kairos-pulse-ring"></div>
                <div className="kairos-pulse-ring"></div>
              </div>
            </div>
          </div>
          
          <div className="kairos-feature-text">
            <h2 className="kairos-feature-title">Discover Your True Self</h2>
            <p className="kairos-feature-description">
              Unlock deep insights about your personality through AI analysis of your journal entries
            </p>
          </div>
          
          <div className="kairos-feature-benefits">
            <div className="kairos-benefit-item">
              <Check className="kairos-benefit-check" />
              <span>Understand your core traits</span>
            </div>
            <div className="kairos-benefit-item">
              <Check className="kairos-benefit-check" />
              <span>Track personal evolution</span>
            </div>
            <div className="kairos-benefit-item">
              <Check className="kairos-benefit-check" />
              <span>Get growth recommendations</span>
            </div>
          </div>
        </div>
      )
    },
    
    // Page 3: AI Questions
    {
      id: 'questions',
      component: (
        <div className="kairos-welcome-page-content">
          <div className="kairos-feature-badge kairos-badge-smart">
            <Sparkles className="kairos-badge-icon" />
            <span>SMART</span>
          </div>
          
          <div className="kairos-feature-icon-container">
            <div className="kairos-feature-icon kairos-questions">
              <MessageCircle />
              <div className="kairos-chat-bubbles">
                <div className="kairos-chat-bubble"></div>
                <div className="kairos-chat-bubble"></div>
                <div className="kairos-chat-bubble"></div>
              </div>
            </div>
          </div>
          
          <div className="kairos-feature-text">
            <h2 className="kairos-feature-title">Your Personal AI Coach</h2>
            <p className="kairos-feature-description">
              Ask meaningful questions and receive insights based on your entire journaling journey
            </p>
          </div>
          
          <div className="kairos-example-questions">
            <div className="kairos-question-card">
              <Smile className="kairos-question-icon" />
              <p>"What patterns do you see in my happiness?"</p>
            </div>
            <div className="kairos-question-card">
              <TrendingUp className="kairos-question-icon" />
              <p>"How have I grown this month?"</p>
            </div>
          </div>
        </div>
      )
    },
    
    // Page 4: Journey Paths
    {
      id: 'paths',
      component: (
        <div className="kairos-welcome-page-content">
          <div className="kairos-feature-icon-container">
            <div className="kairos-feature-icon kairos-paths">
              <Compass />
              <div className="kairos-path-lines">
                <div className="kairos-path-line"></div>
                <div className="kairos-path-line"></div>
                <div className="kairos-path-dot"></div>
                <div className="kairos-path-dot"></div>
                <div className="kairos-path-dot"></div>
              </div>
            </div>
          </div>
          
          <div className="kairos-feature-text">
            <h2 className="kairos-feature-title">40 Unique Journey Paths</h2>
            <p className="kairos-feature-description">
              Choose from carefully crafted experiences tailored to your growth needs
            </p>
          </div>
          
          <div className="kairos-path-preview">
            <div className="kairos-path-mini-card">
              <Heart className="kairos-path-mini-icon" />
              <span>Emotional Growth</span>
            </div>
            <div className="kairos-path-mini-card">
              <Target className="kairos-path-mini-icon" />
              <span>Life Purpose</span>
            </div>
            <div className="kairos-path-mini-card">
              <Palette className="kairos-path-mini-icon" />
              <span>Creative Expression</span>
            </div>
          </div>
        </div>
      )
    },
    
    // Page 5: Visual Journaling
    {
      id: 'visual',
      component: (
        <div className="kairos-welcome-page-content">
          <div className="kairos-feature-icon-container">
            <div className="kairos-feature-icon kairos-visual">
              <PenTool />
              <div className="kairos-paint-drops">
                <div className="kairos-paint-drop"></div>
                <div className="kairos-paint-drop"></div>
                <div className="kairos-paint-drop"></div>
              </div>
            </div>
          </div>
          
          <div className="kairos-feature-text">
            <h2 className="kairos-feature-title">Express Beyond Words</h2>
            <p className="kairos-feature-description">
              Create visual art and let colors speak your emotions
            </p>
          </div>
          
          <div className="kairos-visual-tools">
            <div className="kairos-tool-emoji">🎨</div>
            <div className="kairos-tool-emoji">✏️</div>
            <div className="kairos-tool-emoji">🖌️</div>
            <div className="kairos-tool-emoji">🖊️</div>
          </div>
        </div>
      )
    },
    
    // Page 6: Text Extraction
    {
      id: 'extraction',
      component: (
        <div className="kairos-welcome-page-content">
          <div className="kairos-feature-icon-container">
            <div className="kairos-feature-icon kairos-extraction">
              <FileText />
              <div className="kairos-scan-line"></div>
            </div>
          </div>
          
          <div className="kairos-feature-text">
            <h2 className="kairos-feature-title">Smart Text Recognition</h2>
            <p className="kairos-feature-description">
              Transform handwritten pages into digital insights with 92%+ accuracy
            </p>
          </div>
          
          <div className="kairos-accuracy-badge">
            <Award className="kairos-accuracy-icon" />
            <span>92%+ Accuracy</span>
          </div>
        </div>
      )
    },
    
    // Page 7: Analytics
    {
      id: 'analytics',
      component: (
        <div className="kairos-welcome-page-content">
          <div className="kairos-feature-icon-container">
            <div className="kairos-feature-icon kairos-analytics">
              <BarChart3 />
              <div className="kairos-chart-bars">
                <div className="kairos-chart-bar"></div>
                <div className="kairos-chart-bar"></div>
                <div className="kairos-chart-bar"></div>
                <div className="kairos-chart-bar"></div>
              </div>
            </div>
          </div>
          
          <div className="kairos-feature-text">
            <h2 className="kairos-feature-title">Track Your Growth</h2>
            <p className="kairos-feature-description">
              Visualize patterns and celebrate your personal development milestones
            </p>
          </div>
          
          <div className="kairos-stats-preview">
            <div className="kairos-stat-chip">
              <TrendingUp className="kairos-stat-icon" />
              <span>Progress Tracking</span>
            </div>
            <div className="kairos-stat-chip">
              <Heart className="kairos-stat-icon" />
              <span>Emotional Patterns</span>
            </div>
          </div>
        </div>
      )
    },
    
    // Page 8: Privacy
    {
      id: 'privacy',
      component: (
        <div className="kairos-welcome-page-content">
          <div className="kairos-feature-icon-container">
            <div className="kairos-feature-icon kairos-privacy">
              <Shield />
              <div className="kairos-shield-glow"></div>
            </div>
          </div>
          
          <div className="kairos-feature-text">
            <h2 className="kairos-feature-title">Your Privacy Matters</h2>
            <p className="kairos-feature-description">
              Complete control over your data with industry-leading security
            </p>
          </div>
          
          <div className="kairos-privacy-badges">
            <div className="kairos-privacy-badge">🔒 Encrypted</div>
            <div className="kairos-privacy-badge">💾 Local First</div>
            <div className="kairos-privacy-badge">🛡️ GDPR Compliant</div>
          </div>
        </div>
      )
    },
    
    // Page 9: Claude AI
    {
      id: 'claude',
      component: (
        <div className="kairos-welcome-page-content">
          <div className="kairos-claude-logo-container">
            <img src={claudeLogo} alt="Claude AI" className="kairos-claude-logo" />
            <div className="kairos-claude-glow"></div>
          </div>
          
          <div className="kairos-feature-text">
            <h2 className="kairos-feature-title">Powered by Claude AI</h2>
            <p className="kairos-feature-description">
              Experience the most advanced AI for personal growth and self-reflection
            </p>
          </div>
          
          <div className="kairos-ai-features">
            <div className="kairos-ai-feature">
              <Sparkles className="kairos-ai-icon" />
              <span>Contextual Understanding</span>
            </div>
            <div className="kairos-ai-feature">
              <Brain className="kairos-ai-icon" />
              <span>Pattern Recognition</span>
            </div>
            <div className="kairos-ai-feature">
              <Heart className="kairos-ai-icon" />
              <span>Empathetic Responses</span>
            </div>
          </div>
        </div>
      )
    },
    
    // Page 10: Get Started
    {
      id: 'start',
      component: (
        <div className="kairos-welcome-page-content">
          <div className="kairos-success-container">
            <div className="kairos-success-icon">
              <img src={kairosLogo} alt="Καιρός" className="kairos-success-logo" />
              <div className="kairos-success-rings">
                <div className="kairos-success-ring"></div>
                <div className="kairos-success-ring"></div>
                <div className="kairos-success-ring"></div>
              </div>
            </div>
          </div>
          
          <div className="kairos-feature-text">
            <h2 className="kairos-feature-title">Begin Your Journey</h2>
            <p className="kairos-feature-description">
              Join thousands discovering deeper self-awareness through AI-powered journaling
            </p>
          </div>
          
          <button onClick={handleBeginJourney} className="kairos-start-button">
            <span>Start Your Journey</span>
            <ArrowRight className="kairos-button-icon" />
          </button>
          
          <div className="kairos-trust-indicators">
            <div className="kairos-trust-item">
              <Shield className="kairos-trust-icon" />
              <span>Privacy First</span>
            </div>
            <div className="kairos-trust-item">
              <Brain className="kairos-trust-icon" />
              <span>AI-Powered</span>
            </div>
            <div className="kairos-trust-item">
              <Star className="kairos-trust-icon" />
              <span>40 Paths</span>
            </div>
          </div>
          
          <div className="kairos-version-info">Version {APP_VERSION}</div>
        </div>
      )
    }
  ];

  return (
    <div className={`kairos-welcome-container ${isLoaded ? 'kairos-loaded' : ''}`}>
      {/* Animated Background */}
      <div className="kairos-welcome-background">
        <div className="kairos-bg-gradient"></div>
        <div className="kairos-bg-orbs">
          <div className="kairos-bg-orb kairos-orb-1"></div>
          <div className="kairos-bg-orb kairos-orb-2"></div>
          <div className="kairos-bg-orb kairos-orb-3"></div>
        </div>
        <div className="kairos-bg-particles">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`kairos-particle kairos-particle-${i}`}></div>
          ))}
        </div>
      </div>

      {/* Desktop Navigation */}
      {!isMobile && (
        <header className="kairos-desktop-nav">
          <div className="kairos-nav-logo">
            <img src={kairosLogo} alt="Καιρός" className="kairos-logo-icon" />
            <span>Καιρός</span>
          </div>
          
          <nav className="kairos-nav-dots">
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => navigateToPage(index)}
                className={`kairos-nav-dot ${index === currentPage ? 'kairos-active' : ''}`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </nav>
          
          {currentPage < totalPages - 1 && (
            <button 
              onClick={() => navigateToPage(totalPages - 1)}
              className="kairos-skip-button"
            >
              <span>Skip</span>
              <ArrowRight />
            </button>
          )}
        </header>
      )}

      {/* Mobile Skip Button */}
      {isMobile && currentPage < totalPages - 1 && (
        <button 
          onClick={() => navigateToPage(totalPages - 1)}
          className="kairos-mobile-skip-button"
        >
          <span>Skip</span>
          <ArrowRight />
        </button>
      )}

      {/* Main Content */}
      <main 
        className="kairos-welcome-main"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="kairos-pages-wrapper"
          style={{
            transform: `translateX(-${currentPage * 100}vw)`,
            width: `${totalPages * 100}vw`
          }}
        >
          {pages.map((page, index) => (
            <div 
              key={page.id}
              className={`kairos-welcome-page kairos-${page.id} ${index === currentPage ? 'kairos-active' : ''}`}
            >
              {page.component}
            </div>
          ))}
        </div>
      </main>

      {/* Page Indicators */}
      <div className="kairos-page-indicators">
        {pages.map((_, index) => (
          <button
            key={index}
            onClick={() => navigateToPage(index)}
            className={`kairos-indicator ${index === currentPage ? 'kairos-active' : ''}`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;