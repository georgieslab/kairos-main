// src/pages/About.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Lightbulb, BookOpen, Users, Code, Globe, Feather, BookMarked, Mic, Palette, Sparkles, Crown } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import '../styles/components/about-help.css';
import founderImage from '../assets/founder.jpg';

const About = ({ onBack }) => {
  const { t } = useTranslation('pages');

  return (
    <PageLayout title={t('about.pageTitle', 'About Καιρός')} onBack={onBack}>
      <div className="about-help-page">
      {/* App Introduction */}
      <div className="info-card mb-8">
        <p className="text-lg">
          <strong>{t('about.introBrandName', 'Καιρός (Kairos)')}</strong> {t('about.introText1', 'is an ancient Greek word that represents the opportune moment—a perfect time when conditions align for meaningful action and transformation.')}
        </p>
        <p className="text-lg mt-4">
          {t('about.introText2', "We've created the ")}<strong>{t('about.introText2Strong', "world's first true multi-modal journaling platform")}</strong>{t('about.introText2Rest', ', combining the intimacy of handwritten reflection with the power of AI insights, voice expression, and visual creativity—all in one unified experience.')}
        </p>
      </div>

      {/* Our Philosophy */}
      <section className="about-section">
        <h2 className="section-title">{t('about.philosophyTitle', 'Our Philosophy')}</h2>
        <div className="philosophy-container">
          <div className="quote-card">
            <BookMarked className="quote-icon" />
            <blockquote>
              {t('about.philosophyQuote', '"Look well into thyself; there is a source of strength which will always spring up if thou wilt always look."')}
              <cite>{t('about.philosophyQuoteCite', '― Marcus Aurelius, Meditations')}</cite>
            </blockquote>
          </div>

          <p className="about-text">
            {t('about.philosophyText1', 'At Καιρός, we believe in the transformative power of multi-modal self-expression. Whether you prefer writing, speaking, or creating art, your journey to self-discovery deserves support and insight.')}
          </p>

          <p className="about-text">
            {t('about.philosophyText2', 'Inspired by the stoic wisdom of Marcus Aurelius\' "Meditations," we envision a world where everyone can express and reflect on their own thoughts through their preferred medium—writing their own books of wisdom, speaking their truth, or painting their emotions.')}
          </p>

          <p className="about-text">
            {t('about.philosophyText3', 'By honoring the intimacy of physical journaling while enhancing it with AI insights, voice expression, and visual creativity, we\'ve created a unique experience that respects tradition while embracing innovation.')}
          </p>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="about-section">
        <h2 className="section-title">{t('about.uniqueTitle', 'What Makes Καιρός Unique')}</h2>

        <div className="info-card" style={{ marginBottom: '2rem' }}>
          <p className="text-lg" style={{ textAlign: 'center', margin: 0 }}>
            <strong>{t('about.uniqueBanner', "World's First Multi-Modal Journaling Platform")}</strong>
          </p>
          <p className="about-text" style={{ textAlign: 'center', marginTop: '0.75rem', marginBottom: 0 }}>
            {t('about.uniqueBannerText', "We're pioneering a new era of self-expression where you can write, speak, or create art—all analyzed by the same AI to provide comprehensive insights into your inner world.")}
          </p>
        </div>

        <div className="values-grid">
          <div className="value-card">
            <div className="value-header">
              <BookOpen className="value-icon" />
              <h3>{t('about.feature1Title', '50 Journey Paths')}</h3>
            </div>
            <p>
              {t('about.feature1Text', 'From 7-day explorations to intensive 100-day transformations, we offer the most comprehensive collection of guided journaling paths available anywhere.')}
            </p>
          </div>

          <div className="value-card">
            <div className="value-header">
              <Mic className="value-icon" />
              <h3>{t('about.feature2Title', 'Voice Journaling')}</h3>
            </div>
            <p>
              {t('about.feature2Text', 'Sometimes words flow easier when spoken. Our voice journaling paths with real-time transcription acknowledge the unique courage of vocal self-expression.')}
            </p>
          </div>

          <div className="value-card">
            <div className="value-header">
              <Palette className="value-icon" />
              <h3>{t('about.feature3Title', 'Visual Expression')}</h3>
            </div>
            <p>
              {t('about.feature3Text', 'Draw, paint, or create visual responses to prompts. Our AI analyzes colors, composition, and emotional expression in your artwork.')}
            </p>
          </div>

          <div className="value-card">
            <div className="value-header">
              <Sparkles className="value-icon" />
              <h3>{t('about.feature4Title', 'AI-Powered Insights')}</h3>
            </div>
            <p>
              {t('about.feature4Text', 'Advanced personality analysis, daily AI questions, and comprehensive analytics help you discover patterns and insights in your journaling journey.')}
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="about-section">
        <h2 className="section-title">{t('about.founderTitle', 'Meet the Founder')}</h2>

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
            <h3 className="founder-name">{t('about.founderName', 'Georgie')}</h3>
            <p className="founder-title">{t('about.founderRole', 'Creative Technologist & AI Innovator')}</p>

            <p className="founder-bio">
              {t('about.founderBio', 'Combining a deep appreciation for ancient wisdom with modern technological expertise, I create solutions that enhance human connection and personal growth. My journey from Georgia to Austria has shaped my unique perspective on bridging traditional practices with innovative technology.')}
            </p>

            <div className="founder-values">
              <h4>{t('about.founderValuesTitle', 'Core Values:')}</h4>
              <div className="values-container">
                <span className="value-pill">{t('about.founderValue1', 'Authenticity')}</span>
                <span className="value-pill">{t('about.founderValue2', 'Innovation')}</span>
                <span className="value-pill">{t('about.founderValue3', 'Cultural Wisdom')}</span>
                <span className="value-pill">{t('about.founderValue4', 'Human Connection')}</span>
              </div>
            </div>

            <div className="founder-achievements">
              <div className="achievement-item">
                <h4><Lightbulb className="achievement-icon" /> {t('about.achievement1Title', 'Recent Success')}</h4>
                <p>{t('about.achievement1Text', 'Successfully launched multilingual Tarot AI application with NFC integration, supporting 9 languages')}</p>
              </div>

              <div className="achievement-item">
                <h4><Code className="achievement-icon" /> {t('about.achievement2Title', 'Technical Expertise')}</h4>
                <p>{t('about.achievement2Text', 'Self-taught in AI integration, NFC technology, and full-stack development')}</p>
              </div>

              <div className="achievement-item">
                <h4><Globe className="achievement-icon" /> {t('about.achievement3Title', 'Vision & Leadership')}</h4>
                <p>{t('about.achievement3Text', 'Bringing fresh perspective to wellness technology through cross-cultural innovation')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="about-section">
        <h2 className="section-title">{t('about.journeyTitle', 'Our Journey')}</h2>
        <p className="about-text">
          {t('about.journeyText1', 'Καιρός began as a simple 10-day self-discovery journey and has evolved into the world\'s first true multi-modal journaling platform. What started as handwritten journal analysis has expanded to include voice journaling, visual expression, and AI-powered personality insights—a revolutionary combination never before available in a single platform.')}
        </p>
        <p className="about-text">
          {t('about.journeyText2', 'Today, we offer 50 unique journaling paths spanning traditional writing, voice reflection, and visual creativity—from quick 7-day explorations to transformative 100-day journeys. Each path is carefully crafted with progressive prompts designed to deepen self-awareness and foster personal growth.')}
        </p>
        <p className="about-text">
          {t('about.journeyText3', 'Our commitment to honoring the physical journaling experience while embracing technological innovation has created something truly unique: the only platform in the world that respects your preferred mode of expression—whether written, spoken, or visual—while providing unified AI insights you wouldn\'t discover alone.')}
        </p>
      </section>

      {/* Our Values */}
      <section className="about-section">
        <h2 className="section-title">{t('about.valuesTitle', 'Our Values')}</h2>

        <div className="values-grid">
          <div className="value-card">
            <div className="value-header">
              <Heart className="value-icon" />
              <h3>{t('about.value1Title', 'Authenticity')}</h3>
            </div>
            <p>
              {t('about.value1Text', 'We believe in creating a space where you can be completely authentic. Your journal is a judgment-free zone for honest self-expression.')}
            </p>
          </div>

          <div className="value-card">
            <div className="value-header">
              <Lightbulb className="value-icon" />
              <h3>{t('about.value2Title', 'Innovation')}</h3>
            </div>
            <p>
              {t('about.value2Text', 'We continuously seek innovative ways to enhance the journaling experience, blending traditional practices with cutting-edge technology.')}
            </p>
          </div>

          <div className="value-card">
            <div className="value-header">
              <BookOpen className="value-icon" />
              <h3>{t('about.value3Title', 'Wisdom')}</h3>
            </div>
            <p>
              {t('about.value3Text', 'We honor ancient wisdom traditions while helping you discover and cultivate your own inner wisdom through reflective practice.')}
            </p>
          </div>

          <div className="value-card">
            <div className="value-header">
              <Users className="value-icon" />
              <h3>{t('about.value4Title', 'Connection')}</h3>
            </div>
            <p>
              {t('about.value4Text', 'Although journaling is often a solitary practice, we believe it ultimately leads to deeper connection with yourself and others.')}
            </p>
          </div>
        </div>
      </section>

      {/* The Technology Behind Καιρός */}
      <section className="about-section">
        <h2 className="section-title">{t('about.techTitle', 'The Technology Behind Καιρός')}</h2>
        <p className="about-text">
          {t('about.techIntro', 'Καιρός leverages cutting-edge AI technology to enhance your multi-modal journaling experience without compromising the personal nature of your reflections.')}
        </p>

        <div className="tech-container glass-card">
          <div className="tech-header">
            <Code className="tech-icon" />
            <h3>{t('about.techApproachTitle', 'Our AI Approach')}</h3>
          </div>
          <p className="tech-description">
            <strong>{t('about.techClaudeLabel', 'Claude Sonnet 4:')}</strong> {t('about.techClaudeText', 'Our AI analyzes written journals, voice transcriptions, and visual artwork to identify patterns, themes, and emotional undertones that might not be immediately apparent.')}
          </p>
          <p className="tech-description">
            <strong>{t('about.techWhisperLabel', 'OpenAI Whisper:')}</strong> {t('about.techWhisperText', 'For voice journaling on mobile devices, we use industry-leading speech-to-text technology to ensure accurate transcription of your spoken reflections.')}
          </p>
          <p className="tech-description">
            <strong>{t('about.techWebSpeechLabel', 'Web Speech API:')}</strong> {t('about.techWebSpeechText', 'Real-time voice recognition on desktop browsers provides immediate feedback as you speak your truth.')}
          </p>
          <p className="tech-description">
            <strong>{t('about.techPrivacyLabel', 'Privacy First:')}</strong> {t('about.techPrivacyText', 'We never use your personal data to train our models. Your privacy is paramount, and all analysis is performed with strict confidentiality measures in place. Your journals belong to you alone.')}
          </p>
        </div>
      </section>

      {/* Free vs Artisan */}
      <section className="about-section">
        <h2 className="section-title">{t('about.experienceTitle', 'Choose Your Experience')}</h2>

        <div className="subscription-comparison">
          <div className="tier-card">
            <div className="tier-header">
              <Heart className="tier-icon" />
              <h3>{t('about.freeTierTitle', 'Free Tier')}</h3>
            </div>
            <ul className="tier-features">
              <li>{t('about.freeTierFeature1', '9 curated 10-day journaling paths')}</li>
              <li>{t('about.freeTierFeature2', '90 days of guided prompts')}</li>
              <li>{t('about.freeTierFeature3', 'Handwritten journal upload & analysis')}</li>
              <li>{t('about.freeTierFeature4', 'Basic analytics and insights')}</li>
              <li>{t('about.freeTierFeature5', 'Perfect for exploring journaling')}</li>
            </ul>
          </div>

          <div className="tier-card artisan-tier">
            <div className="tier-header">
              <Crown className="tier-icon" />
              <h3>{t('about.artisanTierTitle', 'Artisan Tier')}</h3>
              <span className="tier-price">{t('about.artisanTierPrice', '€11.99/month')}</span>
            </div>
            <ul className="tier-features">
              <li>{t('about.artisanTierFeature1', 'All 50 premium journaling paths')}</li>
              <li>{t('about.artisanTierFeature2', '365+ days of specialized prompts')}</li>
              <li>{t('about.artisanTierFeature3', 'Voice journaling with transcription')}</li>
              <li>{t('about.artisanTierFeature4', 'Visual journaling with AI analysis')}</li>
              <li>{t('about.artisanTierFeature5', 'Advanced personality insights')}</li>
              <li>{t('about.artisanTierFeature6', 'Daily AI questions (1 per day)')}</li>
              <li>{t('about.artisanTierFeature7', 'Comprehensive analytics dashboard')}</li>
              <li>{t('about.artisanTierFeature8', 'Export journals to PDF')}</li>
              <li>{t('about.artisanTierFeature9', 'Priority support')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="about-section">
        <h2 className="section-title">{t('about.horizonTitle', 'On The Horizon')}</h2>
        <p className="about-text">
          {t('about.horizonIntro', "We're continually innovating to enhance your multi-modal journaling experience:")}
        </p>
        <ul className="features-list">
          <li><strong>{t('about.horizonFeature1Title', 'NFC Smart Journal Integration:')}</strong> {t('about.horizonFeature1Text', 'Tap your physical journal to instantly upload and analyze your entries')}</li>
          <li><strong>{t('about.horizonFeature2Title', 'Personalized Audio Meditations:')}</strong> {t('about.horizonFeature2Text', 'AI-generated meditations based on your journal insights and emotional patterns')}</li>
          <li><strong>{t('about.horizonFeature3Title', 'Advanced Voice Analysis:')}</strong> {t('about.horizonFeature3Text', 'Emotion detection and speaking pattern insights from your voice journals')}</li>
          <li><strong>{t('about.horizonFeature4Title', 'Collaborative Journaling:')}</strong> {t('about.horizonFeature4Text', 'Share selected insights with trusted friends or therapists')}</li>
          <li><strong>{t('about.horizonFeature5Title', 'iOS Native App:')}</strong> {t('about.horizonFeature5Text', 'Full-featured iOS application following our successful Android launch')}</li>
          <li><strong>{t('about.horizonFeature6Title', 'More Journey Paths:')}</strong> {t('about.horizonFeature6Text', 'Continuously expanding our library with specialized paths for specific life situations')}</li>
        </ul>
        <p className="about-text mt-4">
          {t('about.horizonOutro', 'Stay tuned as we continue to explore the intersection of ancient wisdom, modern technology, and human creativity.')}
        </p>
      </section>

      {/* Get in Touch */}
      <section className="about-section">
        <h2 className="section-title">{t('about.touchTitle', 'Get in Touch')}</h2>
        <p className="about-text">
          {t('about.touchText', "We love hearing from our community! Whether you have questions, feedback, success stories, or feature requests, please don't hesitate to reach out.")}
        </p>
        <p className="contact-info">
          {t('about.touchEmailLabel', 'Email:')} <a href="mailto:contact@kairos-journal.com">contact@kairos-journal.com</a>
        </p>
        <p className="about-text mt-4">
          <strong>{t('about.touchArtisanLabel', 'For Artisan subscribers:')}</strong> {t('about.touchArtisanText', 'You receive priority support and typically hear back within 24 hours.')}
        </p>
      </section>
      </div>
    </PageLayout>
  );
};

export default About;
