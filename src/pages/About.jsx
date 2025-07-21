// src/pages/About.jsx

import React from 'react';
import { Heart, Lightbulb, BookOpen, Users, Code, Globe, Feather, BookMarked } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import '../styles/components/about-help.css';
import founderImage from '../assets/founder.jpg'; // Add a founder image to your assets folder

const About = ({ onBack }) => {
  return (
    <PageLayout title="About Καιρός" onBack={onBack}>
      {/* App Introduction */}
      <div className="info-card mb-8">
        <p className="text-lg">
          <strong>Καιρός (Kairos)</strong> is an ancient Greek word that represents a moment of opportunity, a time when conditions are right for the accomplishment of a crucial action.
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
            At Καιρός, we believe in the transformative power of reflective journaling. Our mission is to provide a space where individuals can capture their moments of insight, strengthen their self-awareness, and discover patterns in their thoughts and feelings that lead to personal growth.
          </p>
          
          <p className="about-text">
            Inspired by the stoic wisdom of Marcus Aurelius' "Meditations," we envision a world where everyone can express and reflect on their own thoughts, writing their own books of wisdom. We believe there is a unique kind of wisdom within every person that deserves to be explored and shared.
          </p>
          
          <p className="about-text">
            By combining the intimacy of handwritten journaling with the insights of AI technology, we've created a unique experience that honors the tradition of journaling while enhancing it with modern analysis tools.
          </p>
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
          Καιρός was born from a personal journey of self-reflection and growth. What began as a simple idea has grown into a comprehensive journaling experience designed to help people gain insights into their thoughts, emotions, and patterns.
        </p>
        <p className="about-text">
          Our 10-day journaling journey is carefully crafted to guide you through a process of self-discovery and reflection, with each prompt building upon the previous day's insights. This structured approach, combined with AI-powered analysis, creates a unique experience that balances traditional journaling with technological innovation.
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
          Καιρός leverages advanced AI technology to enhance your journaling experience without compromising the personal nature of your reflections.
        </p>
        
        <div className="tech-container glass-card">
          <div className="tech-header">
            <Code className="tech-icon" />
            <h3>Our AI Approach</h3>
          </div>
          <p className="tech-description">
            Our AI technology is designed to understand the nuances of your writing, identifying patterns, themes, and emotional undertones that might not be immediately apparent. This analysis is used to provide personalized insights and suggestions that deepen your self-reflection.
          </p>
          <p className="tech-description">
            We use natural language processing techniques to extract meaning from your journal entries, but we never use your personal data to train our models. Your privacy is paramount, and all analysis is performed with strict confidentiality measures in place.
          </p>
        </div>
      </section>
      
      {/* Coming Soon */}
      <section className="about-section">
        <h2 className="section-title">On The Horizon</h2>
        <p className="about-text">
          We're continually working to enhance your journaling experience. Soon, we'll be introducing personalized audio meditations based on your journal entries, providing another dimension to your self-reflection journey.
        </p>
        <p className="about-text">
          Stay tuned for more innovations as we continue to explore the intersection of ancient wisdom and modern technology.
        </p>
      </section>
      
      {/* Get in Touch */}
      <section className="about-section">
        <h2 className="section-title">Get in Touch</h2>
        <p className="about-text">
          We love hearing from our users! If you have questions, feedback, or just want to share your journaling experience with us, please don't hesitate to reach out.
        </p>
        <p className="contact-info">
          Email: <a href="mailto:contact@kairos-journal.com">contact@kairos-journal.com</a>
        </p>
      </section>
    </PageLayout>
  );
};

export default About;