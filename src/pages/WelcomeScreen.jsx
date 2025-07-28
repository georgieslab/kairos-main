// Enhanced WelcomeScreen.jsx - Completely rewritten for mobile and web
import React, { useState, useEffect } from 'react';
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
  Star,
  Bot,
  Zap,
  Heart,
  Compass,
  ArrowRight,
  Palette,
  Calendar,
  MessageCircle,
  Mic,
  ChevronDown,
  Play,
  CheckCircle,
  Eye,
  Layers,
  Award,
  Users
} from 'lucide-react';
import claudeLogo from '../icons/claude.png';

const WelcomeScreen = ({ onStart, onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleBeginJourney = (e) => {
    e.preventDefault();
    console.log('Begin journey button clicked');
    if (typeof onStart === 'function') {
      onStart();
    } else {
      console.error('onStart is not a function:', onStart);
    }
  };

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Insights",
      description: "Get personalized analysis of your thoughts and emotions",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Multi-Modal Journaling",
      description: "Express yourself through text, voice, and visual art",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "40 Journey Paths",
      description: "Guided experiences for every aspect of personal growth",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy First",
      description: "Your thoughts stay private with end-to-end encryption",
      color: "from-amber-500 to-orange-500"
    }
  ];

  const journeyTypes = [
    {
      icon: <Compass className="w-8 h-8" />,
      title: "Self-Discovery",
      description: "Explore your values, beliefs, and aspirations",
      duration: "10 days",
      difficulty: "Beginner",
      color: "bg-emerald-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Emotional Intelligence",
      description: "Master your emotional landscape and relationships",
      duration: "10 days", 
      difficulty: "Intermediate",
      color: "bg-rose-500"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Creative Expression",
      description: "Unlock your creativity through guided art journaling",
      duration: "14 days",
      difficulty: "Beginner", 
      color: "bg-purple-500"
    }
  ];

  const stats = [
    { number: "40+", label: "Journey Paths" },
    { number: "92%", label: "Recognition Accuracy" },
    { number: "5K+", label: "Daily Users" },
    { number: "4.8", label: "App Store Rating" }
  ];

  return (
    <div className="welcome-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
        </div>
        
        <div className="hero-content">
          <div className={`hero-logo ${isVisible ? 'animate-in' : ''}`}>
            <div className="logo-container">
              <Sparkles className="logo-icon" />
            </div>
          </div>
          
          <h1 className={`hero-title ${isVisible ? 'animate-in' : ''}`}>
            Καιρός
          </h1>
          
          <p className={`hero-subtitle ${isVisible ? 'animate-in' : ''}`}>
            The perfect moment for<br />mindful self-reflection
          </p>
          
          <div className={`hero-badge ${isVisible ? 'animate-in' : ''}`}>
            <img src={claudeLogo} alt="Claude AI" className="claude-icon" />
            <span>Powered by Claude AI</span>
          </div>
          
          <button 
            onClick={handleBeginJourney}
            className={`cta-button primary ${isVisible ? 'animate-in' : ''}`}
          >
            <span>Begin Your Journey</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          
          <div className={`hero-stats ${isVisible ? 'animate-in' : ''}`}>
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="scroll-indicator">
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose Καιρός?</h2>
          <p className="section-subtitle">
            Experience the future of journaling with AI-powered insights and personalized growth
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`feature-card ${activeFeature === index ? 'active' : ''}`}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className={`feature-icon bg-gradient-to-r ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Journey Types Section */}
      <section className="journeys-section">
        <div className="section-header">
          <h2 className="section-title">Popular Journey Paths</h2>
          <p className="section-subtitle">
            Start with these carefully crafted experiences designed for personal growth
          </p>
        </div>
        
        <div className="journeys-grid">
          {journeyTypes.map((journey, index) => (
            <div key={index} className="journey-card">
              <div className="journey-header">
                <div className={`journey-icon ${journey.color}`}>
                  {journey.icon}
                </div>
                <div className="journey-meta">
                  <span className="journey-duration">
                    <Clock className="w-4 h-4" />
                    {journey.duration}
                  </span>
                  <span className={`journey-difficulty ${journey.difficulty.toLowerCase()}`}>
                    <Star className="w-4 h-4" />
                    {journey.difficulty}
                  </span>
                </div>
              </div>
              
              <h3 className="journey-title">{journey.title}</h3>
              <p className="journey-description">{journey.description}</p>
              
              <button 
                onClick={handleBeginJourney}
                className="cta-button secondary"
              >
                Start This Path
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="journeys-footer">
          <p className="more-paths">+ 37 more specialized paths available</p>
          <button 
            onClick={handleBeginJourney}
            className="cta-button ghost"
          >
            Explore All Paths
          </button>
        </div>
      </section>

      {/* Multi-Modal Feature Highlight */}
      <section className="multimodal-section">
        <div className="multimodal-content">
          <div className="multimodal-text">
            <div className="feature-badge">
              <Sparkles className="w-4 h-4" />
              <span>World's First</span>
            </div>
            <h2 className="multimodal-title">Multi-Modal Journaling</h2>
            <p className="multimodal-description">
              Experience the revolutionary Inner Elements Journey - explore the same themes 
              through writing, visual art, and voice within a single 9-day experience.
            </p>
            
            <div className="modality-showcase">
              <div className="modality-item">
                <FileText className="w-6 h-6" />
                <span>Write</span>
              </div>
              <div className="modality-plus">+</div>
              <div className="modality-item">
                <Palette className="w-6 h-6" />
                <span>Create</span>
              </div>
              <div className="modality-plus">+</div>
              <div className="modality-item">
                <Mic className="w-6 h-6" />
                <span>Speak</span>
              </div>
            </div>
          </div>
          
          <div className="multimodal-visual">
            <div className="element-circle earth">
              <span>Earth</span>
            </div>
            <div className="element-circle water">
              <span>Water</span>
            </div>
            <div className="element-circle fire">
              <span>Fire</span>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">Loved by Thousands</h2>
        </div>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="testimonial-text">
              "Καιρός transformed my journaling practice. The AI insights helped me see patterns I never noticed."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">M</div>
              <div>
                <div className="author-name">Michael K.</div>
                <div className="author-role">Daily Journaler</div>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="testimonial-text">
              "The multi-modal journeys are incredible. Being able to express through art and voice changed everything."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">S</div>
              <div>
                <div className="author-name">Sarah J.</div>
                <div className="author-role">Creative Explorer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="privacy-section">
        <div className="privacy-content">
          <div className="privacy-icon">
            <Shield className="w-12 h-12" />
          </div>
          <h2 className="privacy-title">Your Privacy, Protected</h2>
          <p className="privacy-description">
            Your deepest thoughts deserve the highest protection. We use end-to-end encryption, 
            local-first storage, and never share your personal data.
          </p>
          
          <div className="privacy-features">
            <div className="privacy-feature">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>End-to-end encryption</span>
            </div>
            <div className="privacy-feature">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>Local-first storage</span>
            </div>
            <div className="privacy-feature">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>GDPR compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-section">
        <div className="final-cta-content">
          <h2 className="final-cta-title">Ready to Discover Yourself?</h2>
          <p className="final-cta-description">
            Join thousands on their journey to greater self-awareness and personal growth.
          </p>
          
          <button 
            onClick={handleBeginJourney}
            className="cta-button primary large"
          >
            <span>Start Journaling Now</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          
          <p className="final-cta-note">
            Free to start • No credit card required • Premium features available
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="welcome-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Sparkles className="w-6 h-6" />
            <span>Καιρός</span>
          </div>
          
          <div className="footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('privacy-policy'); }}>
              Privacy Policy
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('terms-of-service'); }}>
              Terms of Service
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('contact-us'); }}>
              Contact
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>
              About
            </a>
          </div>
          
          <p className="footer-copyright">
            © 2025 Καιρός. All rights reserved.
          </p>
        </div>
      </footer>

      <style jsx>{`
        .welcome-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          overflow-x: hidden;
        }

        /* Hero Section */
        .hero-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 2rem 1rem;
          text-align: center;
        }

        .hero-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 0;
        }

        .floating-orb {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
          animation: float 6s ease-in-out infinite;
        }

        .orb-1 {
          width: 200px;
          height: 200px;
          top: 10%;
          right: 10%;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 150px;
          height: 150px;
          bottom: 20%;
          left: 10%;
          animation-delay: 2s;
        }

        .orb-3 {
          width: 100px;
          height: 100px;
          top: 60%;
          right: 30%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 600px;
          margin: 0 auto;
        }

        .hero-logo {
          margin-bottom: 2rem;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease;
        }

        .hero-logo.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .logo-container {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          color: white;
        }

        .hero-title {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 800;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #34d399, #10b981, #059669);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease 0.2s;
        }

        .hero-title.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 3vw, 1.5rem);
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 2rem;
          line-height: 1.5;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease 0.4s;
        }

        .hero-subtitle.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.5rem 1rem;
          background: rgba(17, 24, 39, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 2rem;
          margin-bottom: 2rem;
          backdrop-filter: blur(8px);
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease 0.6s;
        }

        .hero-badge.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .claude-icon {
          width: 20px;
          height: 20px;
          margin-right: 0.5rem;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1.1rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .cta-button.primary {
          background: linear-gradient(135deg, #34d399, #10b981);
          color: white;
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease 0.8s, background 0.3s ease, transform 0.2s ease;
        }

        .cta-button.primary.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .cta-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(16, 185, 129, 0.4);
        }

        .cta-button.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .cta-button.secondary:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .cta-button.ghost {
          background: transparent;
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .cta-button.large {
          padding: 1.25rem 2.5rem;
          font-size: 1.2rem;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 3rem;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease 1s;
        }

        .hero-stats.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #10b981;
        }

        .stat-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 0.5);
        }

        /* Section Styles */
        .features-section,
        .journeys-section,
        .multimodal-section,
        .testimonials-section,
        .privacy-section,
        .final-cta-section {
          padding: 5rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #34d399, #10b981);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: rgba(17, 24, 39, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
        }

        .feature-card:hover,
        .feature-card.active {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .feature-description {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
        }

        /* Journeys Grid */
        .journeys-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .journey-card {
          background: rgba(17, 24, 39, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 2rem;
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }

        .journey-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }

        .journey-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .journey-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .journey-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: flex-end;
        }

        .journey-duration,
        .journey-difficulty {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .journey-difficulty.beginner {
          color: #10b981;
        }

        .journey-difficulty.intermediate {
          color: #f59e0b;
        }

        .journey-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .journey-description {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .journeys-footer {
          text-align: center;
        }

        .more-paths {
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 1rem;
        }

        /* Multi-Modal Section */
        .multimodal-section {
          background: rgba(17, 24, 39, 0.3);
          border-radius: 2rem;
          margin: 5rem 1rem;
        }

        .multimodal-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }

        .feature-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(147, 51, 234, 0.2);
          color: #a855f7;
          border-radius: 2rem;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .multimodal-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .multimodal-description {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .modality-showcase {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .modality-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          min-width: 80px;
        }

        .modality-plus {
          color: rgba(255, 255, 255, 0.5);
          font-size: 1.5rem;
          font-weight: 600;
        }

        .multimodal-visual {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .element-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .element-circle.earth {
          background: linear-gradient(135deg, #92400e, #78350f);
        }

        .element-circle.water {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }

        .element-circle.fire {
          background: linear-gradient(135deg, #ea580c, #dc2626);
        }

        /* Testimonials */
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .testimonial-card {
          background: rgba(17, 24, 39, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 2rem;
          backdrop-filter: blur(8px);
        }

        .testimonial-stars {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }

        .testimonial-text {
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
        }

        .author-name {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .author-role {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Privacy Section */
        .privacy-section {
          text-align: center;
          background: rgba(17, 24, 39, 0.3);
          border-radius: 2rem;
          margin: 5rem 1rem;
        }

        .privacy-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .privacy-icon {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          color: white;
        }

        .privacy-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .privacy-description {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .privacy-features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 400px;
          margin: 0 auto;
        }

        .privacy-feature {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: rgba(255, 255, 255, 0.8);
        }

        /* Final CTA */
        .final-cta-section {
          text-align: center;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1));
          border-radius: 2rem;
          margin: 5rem 1rem;
        }

        .final-cta-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .final-cta-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .final-cta-description {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .final-cta-note {
          margin-top: 1rem;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
        }

        /* Footer */
        .welcome-footer {
          background: rgba(17, 24, 39, 0.8);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 3rem 1rem;
          margin-top: 5rem;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: #10b981;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: #10b981;
        }

        .footer-copyright {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.875rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-stats {
            gap: 1rem;
          }

          .stat-item {
            min-width: 60px;
          }

          .stat-number {
            font-size: 1.2rem;
          }

          .features-grid,
          .journeys-grid,
          .testimonials-grid {
            grid-template-columns: 1fr;
          }

          .multimodal-content {
            text-align: center;
          }

          .multimodal-title {
            font-size: 2rem;
          }

          .footer-links {
            gap: 1rem;
          }

          .footer-links a {
            font-size: 0.875rem;
          }
        }

        @media (min-width: 1024px) {
          .multimodal-content {
            grid-template-columns: 1fr 1fr;
            text-align: left;
          }

          .multimodal-visual {
            justify-content: flex-end;
          }
          
          .element-circle {
            width: 120px;
            height: 120px;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
          }
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .welcome-container {
            background: #000;
            color: #fff;
          }
          
          .feature-card,
          .journey-card,
          .testimonial-card {
            border-color: #fff;
          }
        }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;