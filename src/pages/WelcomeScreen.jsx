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
import claudeLogo from '../icons/claude.png';
import '../styles/components/welcome.css';
import { APP_VERSION } from '../utils/versionControl';

const WelcomeScreen = ({ onStart, onNavigate }) => {
  // Make sure the event handler is properly defined
  const handleBeginJourney = (e) => {
    // Prevent default behavior
    e.preventDefault();
    
    // Add console log for debugging
    console.log('Begin journey button clicked');
    
    // Make sure onStart is a function before calling it
    if (typeof onStart === 'function') {
      onStart();
    } else {
      console.error('onStart is not a function:', onStart);
    }
  };
  
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
    </div>
  );
};

export default WelcomeScreen;