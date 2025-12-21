// src/pages/About.jsx

import React from 'react';
import { Heart, Lightbulb, BookOpen, Users, Code, Globe, Feather, BookMarked, Mic, Palette, Sparkles, Crown } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import '../styles/components/about-help.css';
import founderImage from '../assets/founder.jpg';

const About = ({ onBack }) => {
  return (
    <PageLayout title="About Καιρός" onBack={onBack}>
      {/* App Introduction */}
      <div className="info-card mb-8">
        <p className="text-lg">
          <strong>Καιρός (Kairos)</strong> is an ancient Greek word that represents the opportune moment—a perfect time when conditions align for meaningful action and transformation.
        </p>
        <p className="text-lg mt-4">
          We've created the <strong>world's first true multi-modal journaling platform</strong>, combining the intimacy of handwritten reflection with the power of AI insights, voice expression, and visual creativity—all in one unified experience.
        </p>
      </div>
      
      {/* Our Philosophy */}
      <section className="about-section">
        <h2 className="section-title">Our Philosophy</h2>
        <div className="philosophy-container">
          <div className="quote-card">
            <BookMarked className="quote-icon" />
            <blockquote>
              "Look well into thyself; there is a source of strength which will always spring up if thou wilt always look."
              <cite>― Marcus Aurelius, Meditations</cite>
            </blockquote>
          </div>

          <p className="about-text">
            At Καιρός, we believe in the transformative power of multi-modal self-expression. Whether you prefer writing, speaking, or creating art, your journey to self-discovery deserves support and insight.
          </p>
          
          <p className="about-text">
            Inspired by the stoic wisdom of Marcus Aurelius' "Meditations," we envision a world where everyone can express and reflect on their own thoughts through their preferred medium—writing their own books of wisdom, speaking their truth, or painting their emotions.
          </p>
          
          <p className="about-text">
            By honoring the intimacy of physical journaling while enhancing it with AI insights, voice expression, and visual creativity, we've created a unique experience that respects tradition while embracing innovation.
          </p>
        </div>
      </section>
      
      {/* What Makes Us Different */}
      <section className="about-section">
        <h2 className="section-title">What Makes Καιρός Unique</h2>
        
        <div className="info-card" style={{ marginBottom: '2rem' }}>
          <p className="text-lg" style={{ textAlign: 'center', margin: 0 }}>
            <strong>🌟 World's First Multi-Modal Journaling Platform 🌟</strong>
          </p>
          <p className="about-text" style={{ textAlign: 'center', marginTop: '0.75rem', marginBottom: 0 }}>
            We're pioneering a new era of self-expression where you can write, speak, or create art—all analyzed by the same AI to provide comprehensive insights into your inner world.
          </p>
        </div>
        
        <div className="values-grid">
          <div className="value-card">
            <div className="value-header">
              <BookOpen className="value-icon" />
              <h3>50 Journey Paths</h3>
            </div>
            <p>
              From 7-day explorations to intensive 100-day transformations, we offer the most comprehensive collection of guided journaling paths available anywhere.
            </p>
          </div>
          
          <div className="value-card">
            <div className="value-header">
              <Mic className="value-icon" />
              <h3>Voice Journaling</h3>
            </div>
            <p>
              Sometimes words flow easier when spoken. Our voice journaling paths with real-time transcription acknowledge the unique courage of vocal self-expression.
            </p>
          </div>
          
          <div className="value-card">
            <div className="value-header">
              <Palette className="value-icon" />
              <h3>Visual Expression</h3>
            </div>
            <p>
              Draw, paint, or create visual responses to prompts. Our AI analyzes colors, composition, and emotional expression in your artwork.
            </p>
          </div>
          
          <div className="value-card">
            <div className="value-header">
              <Sparkles className="value-icon" />
              <h3>AI-Powered Insights</h3>
            </div>
            <p>
              Advanced personality analysis, daily AI questions, and comprehensive analytics help you discover patterns and insights in your journaling journey.
            </p>
          </div>
        </div>
      </section>
      
      {/* Founder Section */}
      <section className="about-section">
        <h2 className="section-title">Meet the Founder</h2>
        
        <div className="founder-container">
          <div className="founder-image-container">
            {/* If you have a founder image, use it here */}
            {founderImage ? (
              <img src={founderImage} alt="Georgie" className="founder-image" />
            ) : (
              <div className="founder-image-placeholder">
                <span>G</span>
              </div>
            )}
          </div>
          
          <div className="founder-content">
            <h3 className="founder-name">Georgie</h3>
            <p className="founder-title">Creative Technologist & AI Innovator</p>
            
            <p className="founder-bio">
              Combining a deep appreciation for ancient wisdom with modern technological expertise, I create solutions that enhance human connection and personal growth. My journey from Georgia to Austria has shaped my unique perspective on bridging traditional practices with innovative technology.
            </p>
            
            <div className="founder-values">
              <h4>Core Values:</h4>
              <div className="values-container">
                <span className="value-pill">Authenticity</span>
                <span className="value-pill">Innovation</span>
                <span className="value-pill">Cultural Wisdom</span>
                <span className="value-pill">Human Connection</span>
              </div>
            </div>
            
            <div className="founder-achievements">
              <div className="achievement-item">
                <h4><Lightbulb className="achievement-icon" /> Recent Success</h4>
                <p>Successfully launched multilingual Tarot AI application with NFC integration, supporting 9 languages</p>
              </div>
              
              <div className="achievement-item">
                <h4><Code className="achievement-icon" /> Technical Expertise</h4>
                <p>Self-taught in AI integration, NFC technology, and full-stack development</p>
              </div>
              
              <div className="achievement-item">
                <h4><Globe className="achievement-icon" /> Vision & Leadership</h4>
                <p>Bringing fresh perspective to wellness technology through cross-cultural innovation</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Journey */}
      <section className="about-section">
        <h2 className="section-title">Our Journey</h2>
        <p className="about-text">
          Καιρός began as a simple 10-day self-discovery journey and has evolved into the world's first true multi-modal journaling platform. What started as handwritten journal analysis has expanded to include voice journaling, visual expression, and AI-powered personality insights—a revolutionary combination never before available in a single platform.
        </p>
        <p className="about-text">
          Today, we offer 50 unique journaling paths spanning traditional writing, voice reflection, and visual creativity—from quick 7-day explorations to transformative 100-day journeys. Each path is carefully crafted with progressive prompts designed to deepen self-awareness and foster personal growth.
        </p>
        <p className="about-text">
          Our commitment to honoring the physical journaling experience while embracing technological innovation has created something truly unique: the only platform in the world that respects your preferred mode of expression—whether written, spoken, or visual—while providing unified AI insights you wouldn't discover alone.
        </p>
      </section>
      
      {/* Our Values */}
      <section className="about-section">
        <h2 className="section-title">Our Values</h2>
        
        <div className="values-grid">
          <div className="value-card">
            <div className="value-header">
              <Heart className="value-icon" />
              <h3>Authenticity</h3>
            </div>
            <p>
              We believe in creating a space where you can be completely authentic. Your journal is a judgment-free zone for honest self-expression.
            </p>
          </div>
          
          <div className="value-card">
            <div className="value-header">
              <Lightbulb className="value-icon" />
              <h3>Innovation</h3>
            </div>
            <p>
              We continuously seek innovative ways to enhance the journaling experience, blending traditional practices with cutting-edge technology.
            </p>
          </div>
          
          <div className="value-card">
            <div className="value-header">
              <BookOpen className="value-icon" />
              <h3>Wisdom</h3>
            </div>
            <p>
              We honor ancient wisdom traditions while helping you discover and cultivate your own inner wisdom through reflective practice.
            </p>
          </div>
          
          <div className="value-card">
            <div className="value-header">
              <Users className="value-icon" />
              <h3>Connection</h3>
            </div>
            <p>
              Although journaling is often a solitary practice, we believe it ultimately leads to deeper connection with yourself and others.
            </p>
          </div>
        </div>
      </section>
      
      {/* The Technology Behind Καιρός */}
      <section className="about-section">
        <h2 className="section-title">The Technology Behind Καιρός</h2>
        <p className="about-text">
          Καιρός leverages cutting-edge AI technology to enhance your multi-modal journaling experience without compromising the personal nature of your reflections.
        </p>
        
        <div className="tech-container glass-card">
          <div className="tech-header">
            <Code className="tech-icon" />
            <h3>Our AI Approach</h3>
          </div>
          <p className="tech-description">
            <strong>Claude Sonnet 4:</strong> Our AI analyzes written journals, voice transcriptions, and visual artwork to identify patterns, themes, and emotional undertones that might not be immediately apparent.
          </p>
          <p className="tech-description">
            <strong>OpenAI Whisper:</strong> For voice journaling on mobile devices, we use industry-leading speech-to-text technology to ensure accurate transcription of your spoken reflections.
          </p>
          <p className="tech-description">
            <strong>Web Speech API:</strong> Real-time voice recognition on desktop browsers provides immediate feedback as you speak your truth.
          </p>
          <p className="tech-description">
            <strong>Privacy First:</strong> We never use your personal data to train our models. Your privacy is paramount, and all analysis is performed with strict confidentiality measures in place. Your journals belong to you alone.
          </p>
        </div>
      </section>
      
      {/* Free vs Artisan */}
      <section className="about-section">
        <h2 className="section-title">Choose Your Experience</h2>
        
        <div className="subscription-comparison">
          <div className="tier-card">
            <div className="tier-header">
              <Heart className="tier-icon" />
              <h3>Free Tier</h3>
            </div>
            <ul className="tier-features">
              <li>9 curated 10-day journaling paths</li>
              <li>90 days of guided prompts</li>
              <li>Handwritten journal upload & analysis</li>
              <li>Basic analytics and insights</li>
              <li>Perfect for exploring journaling</li>
            </ul>
          </div>
          
          <div className="tier-card artisan-tier">
            <div className="tier-header">
              <Crown className="tier-icon" />
              <h3>Artisan Tier</h3>
              <span className="tier-price">€11.99/month</span>
            </div>
            <ul className="tier-features">
              <li>All 50 premium journaling paths</li>
              <li>365+ days of specialized prompts</li>
              <li>Voice journaling with transcription</li>
              <li>Visual journaling with AI analysis</li>
              <li>Advanced personality insights</li>
              <li>Daily AI questions (1 per day)</li>
              <li>Comprehensive analytics dashboard</li>
              <li>Export journals to PDF</li>
              <li>Priority support</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* Coming Soon */}
      <section className="about-section">
        <h2 className="section-title">On The Horizon</h2>
        <p className="about-text">
          We're continually innovating to enhance your multi-modal journaling experience:
        </p>
        <ul className="features-list">
          <li><strong>NFC Smart Journal Integration:</strong> Tap your physical journal to instantly upload and analyze your entries</li>
          <li><strong>Personalized Audio Meditations:</strong> AI-generated meditations based on your journal insights and emotional patterns</li>
          <li><strong>Advanced Voice Analysis:</strong> Emotion detection and speaking pattern insights from your voice journals</li>
          <li><strong>Collaborative Journaling:</strong> Share selected insights with trusted friends or therapists</li>
          <li><strong>iOS Native App:</strong> Full-featured iOS application following our successful Android launch</li>
          <li><strong>More Journey Paths:</strong> Continuously expanding our library with specialized paths for specific life situations</li>
        </ul>
        <p className="about-text mt-4">
          Stay tuned as we continue to explore the intersection of ancient wisdom, modern technology, and human creativity.
        </p>
      </section>
      
      {/* Get in Touch */}
      <section className="about-section">
        <h2 className="section-title">Get in Touch</h2>
        <p className="about-text">
          We love hearing from our community! Whether you have questions, feedback, success stories, or feature requests, please don't hesitate to reach out.
        </p>
        <p className="contact-info">
          Email: <a href="mailto:contact@kairos-journal.com">contact@kairos-journal.com</a>
        </p>
        <p className="about-text mt-4">
          <strong>For Artisan subscribers:</strong> You receive priority support and typically hear back within 24 hours.
        </p>
      </section>
    </PageLayout>
  );
};

export default About;