import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, Brain, MessageCircle, Shield, ChevronRight, BookOpen, PenTool, 
  TrendingUp, User, Zap, ArrowRight, Palette, Camera, FileText, BarChart3, 
  Download, Heart, Compass, Target, Clock, Award, Infinity, Check, Star,
  Lightbulb, Smile, Gem, Trophy, CheckCircle, Mic, Layers
} from 'lucide-react';
import claudeLogo from '../icons/claude.png';
import kairosLogo from '../icons/kairos-logo.svg';
import { APP_VERSION } from '../utils/versionControl';
import '../styles/components/welcomeScreen.css';

const WelcomeScreen = ({ onStart, onNavigate }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const containerRef = useRef(null);

  const totalPages = 12;

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
            <p className="kairos-hero-tagline">
              Transform your thoughts into profound insights through the power of journaling
            </p>
          </div>
          
          <div className="kairos-hero-features">
            <div className="kairos-feature-chip kairos-chip-highlight">
              <Infinity className="kairos-chip-icon" />
              <span>World's First Multi-Modal</span>
            </div>
            <div className="kairos-feature-chip">
              <BookOpen className="kairos-chip-icon" />
              <span>50+ Journey Paths</span>
            </div>
          </div>

          <div className="kairos-hero-highlights">
            <div className="kairos-highlight-item">
              <PenTool className="kairos-chip-icon" />
              <span>Write, Speak, or Create</span>
            </div>
            <div className="kairos-highlight-item">
              <Lightbulb className="kairos-chip-icon" />
              <span>AI-Powered Deep Insights</span>
            </div>
            <div className="kairos-highlight-item">
              <TrendingUp className="kairos-chip-icon" />
              <span>Track Your Growth Journey</span>
            </div>
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
              Unlock deep insights about your personality through Claude AI analysis of your journal entries
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
            <h2 className="kairos-feature-title">Ask Your Journal Anything</h2>
            <p className="kairos-feature-description">
              Chat with your journal entries to uncover patterns, insights, and wisdom from your own words
            </p>
          </div>
          
          <div className="kairos-example-questions">
            <div className="kairos-question-chip">"What makes me happiest?"</div>
            <div className="kairos-question-chip">"How have I grown this month?"</div>
            <div className="kairos-question-chip">"What patterns do I repeat?"</div>
          </div>
        </div>
      )
    },
    
    // Page 4: Multi-Modal
    {
      id: 'multimodal',
      component: (
        <div className="kairos-welcome-page-content">
          <div className="kairos-feature-badge kairos-badge-revolutionary">
            <Layers className="kairos-badge-icon" />
            <span>REVOLUTIONARY</span>
          </div>
          
          <div className="kairos-feature-icon-container">
            <div className="kairos-feature-icon kairos-multimodal">
              <Layers />
              <div className="kairos-modality-icons">
                <div className="kairos-modality-icon kairos-mod-write"><PenTool /></div>
                <div className="kairos-modality-icon kairos-mod-speak"><Mic /></div>
                <div className="kairos-modality-icon kairos-mod-create"><Palette /></div>
              </div>
            </div>
          </div>
          
          <div className="kairos-feature-text">
            <h2 className="kairos-feature-title">Express Your Way</h2>
            <p className="kairos-feature-description">
              World's first multi-modal journaling: Write, speak, or create art - your choice, your expression
            </p>
          </div>
          
          <div className="kairos-modality-cards">
            <div className="kairos-modality-card">
              <PenTool className="kairos-card-icon" />
              <span>Write</span>
            </div>
            <div className="kairos-modality-card kairos-card-voice">
              <Mic className="kairos-card-icon" />
              <span>Speak</span>
              <div className="kairos-sound-waves">
                <div className="kairos-sound-wave"></div>
                <div className="kairos-sound-wave"></div>
                <div className="kairos-sound-wave"></div>
                <div className="kairos-sound-wave"></div>
                <div className="kairos-sound-wave"></div>
              </div>
            </div>
            <div className="kairos-modality-card">
              <Palette className="kairos-card-icon" />
              <span>Create</span>
            </div>
          </div>
        </div>
      )
    },
    
    // Page 5: Handwriting
    {
      id: 'handwriting',
      component: (
        <div className="kairos-welcome-page-content">
          <div className="kairos-feature-icon-container">
            <div className="kairos-feature-icon kairos-handwriting">
              <PenTool />
              <div className="kairos-writing-lines">
                <div className="kairos-writing-line"></div>
                <div className="kairos-writing-line"></div>
                <div className="kairos-writing-line"></div>
              </div>
            </div>
          </div>
          
          <div className="kairos-feature-text">
            <h2 className="kairos-feature-title">Handwriting Magic</h2>
            <p className="kairos-feature-description">
              Snap a photo of your handwritten journal and watch AI extract your thoughts with 92%+ accuracy
            </p>
          </div>
          
          <div className="kairos-feature-benefits">
            <div className="kairos-benefit-item">
              <Check className="kairos-benefit-check" />
              <span>92%+ accuracy rate</span>
            </div>
            <div className="kairos-benefit-item">
              <Check className="kairos-benefit-check" />
              <span>Works with any handwriting</span>
            </div>
            <div className="kairos-benefit-item">
              <Check className="kairos-benefit-check" />
              <span>Instant text extraction</span>
            </div>
          </div>
        </div>
      )
    },
    
    // Page 6: Voice Journaling
    {
      id: 'voice',
      component: (
        <div className="kairos-welcome-page-content">
          <div className="kairos-feature-badge kairos-badge-new">
            <Mic className="kairos-badge-icon" />
            <span>NEW</span>
          </div>
          
          <div className="kairos-feature-icon-container">
            <div className="kairos-feature-icon kairos-voice">
              <Mic />
              <div className="kairos-voice-waves">
                <div className="kairos-voice-wave"></div>
                <div className="kairos-voice-wave"></div>
                <div className="kairos-voice-wave"></div>
              </div>
            </div>
          </div>
          
          <div className="kairos-feature-text">
            <h2 className="kairos-feature-title">Speak Your Truth</h2>
            <p className="kairos-feature-description">
              Record your thoughts with live transcription and emotional tone analysis
            </p>
          </div>
          
          <div className="kairos-feature-benefits">
            <div className="kairos-benefit-item">
              <Check className="kairos-benefit-check" />
              <span>Live transcription</span>
            </div>
            <div className="kairos-benefit-item">
              <Check className="kairos-benefit-check" />
              <span>Vocal tone analysis</span>
            </div>
            <div className="kairos-benefit-item">
              <Check className="kairos-benefit-check" />
              <span>5 dedicated voice paths</span>
            </div>
          </div>
        </div>
      )
    },
    
    // Page 7: Journey Paths
    {
      id: 'paths',
      component: (
        <div className="kairos-welcome-page-content">
          <div className="kairos-feature-icon-container">
            <div className="kairos-feature-icon kairos-paths">
              <Compass />
              <div className="kairos-path-dots">
                <div className="kairos-path-dot"></div>
                <div className="kairos-path-dot"></div>
                <div className="kairos-path-dot"></div>
              </div>
            </div>
          </div>
          
          <div className="kairos-feature-text">
            <h2 className="kairos-feature-title">50+ Journey Paths</h2>
            <p className="kairos-feature-description">
              From 4-day challenges to 100-day transformations, find your perfect path
            </p>
          </div>
          
          <div className="kairos-path-cards">
            <div className="kairos-path-card">
              <Target className="kairos-path-icon" />
              <span>Self-Discovery</span>
            </div>
            <div className="kairos-path-card">
              <Heart className="kairos-path-icon" />
              <span>Inner Child</span>
            </div>
            <div className="kairos-path-card">
              <Brain className="kairos-path-icon" />
              <span>Shadow Work</span>
            </div>
          </div>
        </div>
      )
    },
    
    // Page 8: AI Insights
    {
      id: 'insights',
      component: (
        <div className="kairos-welcome-page-content">
          <div className="kairos-feature-icon-container">
            <div className="kairos-feature-icon kairos-insights">
              <Brain />
              <div className="kairos-brain-glow"></div>
            </div>
          </div>
          
          <div className="kairos-feature-text">
            <h2 className="kairos-feature-title">Deep AI Insights</h2>
            <p className="kairos-feature-description">
              Get personalized psychological insights powered by Claude AI with therapeutic frameworks
            </p>
          </div>
          
          <div className="kairos-insight-preview">
            <div className="kairos-insight-card">
              <Lightbulb className="kairos-insight-icon" />
              <p>"Your pattern of seeking approval reveals a deep desire for connection..."</p>
            </div>
          </div>
        </div>
      )
    },
    
    // Page 9: Analytics
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
              </div>
            </div>
          </div>
          
          <div className="kairos-feature-text">
            <h2 className="kairos-feature-title">Track Your Growth</h2>
            <p className="kairos-feature-description">
              Visualize your emotional patterns, track streaks, and celebrate milestones
            </p>
          </div>
          
          <div className="kairos-stat-chips">
            <div className="kairos-stat-chip">
              <TrendingUp className="kairos-stat-icon" />
              <span>Growth Trends</span>
            </div>
            <div className="kairos-stat-chip">
              <Award className="kairos-stat-icon" />
              <span>Streak Tracking</span>
            </div>
            <div className="kairos-stat-chip">
              <Heart className="kairos-stat-icon" />
              <span>Emotional Patterns</span>
            </div>
          </div>
        </div>
      )
    },
    
    // Page 10: Privacy
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
              Complete control over your data with 4-tier privacy architecture and industry-leading security
            </p>
          </div>
          
          <div className="kairos-privacy-badges">
            <div className="kairos-privacy-badge">🔒 End-to-End Encrypted</div>
            <div className="kairos-privacy-badge">💾 Local-First Processing</div>
            <div className="kairos-privacy-badge">🛡️ GDPR Compliant</div>
          </div>
        </div>
      )
    },
    
    // Page 11: Claude AI
    {
      id: 'claude',
      component: (
        <div className="kairos-welcome-page-content">
          <div className="kairos-claude-logo-container">
            <img src={claudeLogo} alt="Claude AI" className="kairos-claude-logo" />
            <div className="kairos-claude-glow"></div>
          </div>
          
          <div className="kairos-feature-text">
            <h2 className="kairos-feature-title">Built With Claude, Powered by Claude</h2>
            <p className="kairos-feature-description">
              The entire app was created using Claude AI as the development partner - a testament to the power of AI collaboration
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
    
    // Page 12: Get Started
    {
      id: 'start',
      component: (
        <div className="kairos-welcome-page-content kairos-start-page-content">
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
              Join thousands discovering deeper self-awareness through the world's first AI-powered multi-modal journaling platform
            </p>
          </div>
          
          <button onClick={handleBeginJourney} className="kairos-start-button kairos-pulse-button">
            <span>Start Your Journey</span>
            <ArrowRight className="kairos-button-icon" />
            <div className="kairos-button-shimmer"></div>
          </button>
          
          <div className="kairos-trust-indicators">
            <div className="kairos-trust-item">
              <Shield className="kairos-trust-icon" />
              <span>Privacy First</span>
            </div>
            <div className="kairos-trust-item">
              <Infinity className="kairos-trust-icon" />
              <span>Multi-Modal</span>
            </div>
            <div className="kairos-trust-item">
              <Star className="kairos-trust-icon" />
              <span>50+ Paths</span>
            </div>
          </div>
          
          <div className="kairos-version-info">Version {APP_VERSION}</div>
        </div>
      )
    }
  ];

  return (
    <div className={`kairos-welcome-container ${isLoaded ? 'kairos-loaded' : ''} ${isMobile ? 'kairos-mobile' : 'kairos-desktop'}`}>
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
        ref={containerRef}
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
              <div className="kairos-page-scroll-container">
                {page.component}
              </div>
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