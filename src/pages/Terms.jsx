// src/pages/Terms.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  ChevronUp,
  Mail,
  ExternalLink,
  Shield,
  Users,
  Globe,
  AlertCircle,
  Brain,
  MapPin,
  Settings,
  Eye,
  Lock,
  Ban,
  PenLine,
  Mic,
  Palette,
  Sparkles,
  TrendingUp,
  Compass,
  CloudSun
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import '../styles/components/terms.css';

const TermsOfService = ({ onBack }) => {
  const { t } = useTranslation('pages');
  const [expandedSections, setExpandedSections] = useState({
    'service-description': true, // Start with key sections expanded
    'user-content': true,
    'location-weather': true
  });

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const ExpandableSection = ({ id, title, icon: Icon, children, isImportant = false }) => {
    const isExpanded = expandedSections[id];
    
    return (
      <div className={`expandable-section ${isImportant ? 'expandable-section-important' : ''}`}>
        <button
          onClick={() => toggleSection(id)}
          className="expandable-header"
          aria-expanded={isExpanded}
          aria-controls={`section-${id}`}
        >
          <div className="expandable-header-content">
            {Icon && <Icon className="expandable-icon" />}
            <h2 className="expandable-title">{title}</h2>
          </div>
          {isExpanded ? (
            <ChevronUp className="expandable-chevron" />
          ) : (
            <ChevronDown className="expandable-chevron" />
          )}
        </button>
        
        <div 
          id={`section-${id}`}
          className={`expandable-content ${isExpanded ? 'expandable-content-expanded' : ''}`}
        >
          <div className="expandable-content-inner">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageLayout title={t('terms.pageTitle', 'Terms of Service')} onBack={onBack}>
      <div className="legal-document">
        <div className="document-header">
          <p className="document-date">{t('terms.lastUpdated', 'Last Updated: November 2025')}</p>

          <div className="info-card info-card-welcome">
            <div className="info-card-icon">
              <Shield size={24} />
            </div>
            <div className="info-card-content">
              <h3 className="info-card-title">{t('terms.welcomeTitle', 'Welcome to Καιρός')}</h3>
              <p className="info-card-text">
                {t('terms.welcomeText', "These Terms of Service govern your use of Καιρός, the world's first multi-modal journaling platform. By using our app, you agree to these terms. We've made them as clear and fair as possible.")}
              </p>
            </div>
          </div>
        </div>

        <div className="quick-summary">
          <h3 className="quick-summary-title">{t('terms.overviewTitle', 'Quick Overview')}</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <Users className="summary-icon" />
              <span>{t('terms.summaryOwnership', 'Your content, your ownership')}</span>
            </div>
            <div className="summary-item">
              <Brain className="summary-icon" />
              <span>{t('terms.summaryAi', 'AI enhances, never replaces you')}</span>
            </div>
            <div className="summary-item">
              <Lock className="summary-icon" />
              <span>{t('terms.summaryPrivacy', 'Privacy & security first')}</span>
            </div>
            <div className="summary-item">
              <Shield className="summary-icon" />
              <span>{t('terms.summaryRespect', 'Respectful use required')}</span>
            </div>
          </div>
        </div>

        <ExpandableSection id="acceptance" title={t('terms.s1Title', '1. Acceptance of Terms')} icon={Shield}>
          <p>
            {t('terms.s1p1', "By accessing or using the Καιρός app, you agree to be bound by these Terms of Service. If you don't agree with any part of these terms, you may not use the app.")}
          </p>

          <div className="info-box">
            <h4 className="info-box-title">{t('terms.s1BoxTitle', 'What This Means')}</h4>
            <p>
              {t('terms.s1BoxText', 'Simply using our app means you accept these terms. If you have questions about any part, please contact us before using the service.')}
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection id="service-description" title={t('terms.s2Title', '2. What Καιρός Does')} icon={Globe} isImportant>
          <p className="section-intro">
            {t('terms.s2Intro', 'Καιρός is the world\'s first multi-modal journaling platform, allowing you to express yourself through text, voice, and visual art—all enhanced by AI-powered insights.')}
          </p>

          <h4 className="subsection-title">{t('terms.s2FeaturesTitle', 'Core Features')}</h4>
          <div className="feature-grid">
            <div className="feature-item"><PenLine size={18} strokeWidth={1.7} aria-hidden="true" />{t('terms.s2Feature1', 'Text journaling with 50+ guided paths')}</div>
            <div className="feature-item"><Mic size={18} strokeWidth={1.7} aria-hidden="true" />{t('terms.s2Feature2', 'Voice journaling with AI transcription')}</div>
            <div className="feature-item"><Palette size={18} strokeWidth={1.7} aria-hidden="true" />{t('terms.s2Feature3', 'Visual journaling through artwork creation')}</div>
            <div className="feature-item"><Sparkles size={18} strokeWidth={1.7} aria-hidden="true" />{t('terms.s2Feature4', 'Claude AI-powered insights & analysis')}</div>
            <div className="feature-item"><TrendingUp size={18} strokeWidth={1.7} aria-hidden="true" />{t('terms.s2Feature5', 'Track your growth across all modalities')}</div>
            <div className="feature-item"><Compass size={18} strokeWidth={1.7} aria-hidden="true" />{t('terms.s2Feature6', 'Personalized journey recommendations')}</div>
            <div className="feature-item"><CloudSun size={18} strokeWidth={1.7} aria-hidden="true" />{t('terms.s2Feature7', 'Optional weather context for entries')}</div>
            <div className="feature-item"><Lock size={18} strokeWidth={1.7} aria-hidden="true" />{t('terms.s2Feature8', 'Private, secure, encrypted storage')}</div>
          </div>

          <div className="highlight-box">
            <h4 className="highlight-title">{t('terms.s2MissionTitle', 'Our Mission')}</h4>
            <p>
              {t('terms.s2MissionText', 'We believe everyone expresses themselves differently. Καιρός empowers your self-discovery journey by letting you journal in whatever way feels right—write, speak, or create—all in one unified platform.')}
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection id="user-accounts" title={t('terms.s3Title', '3. Your Account')} icon={Users}>
          <h4 className="subsection-title">{t('terms.s3RequirementsTitle', 'Account Requirements')}</h4>
          <p>
            {t('terms.s3p1', 'When you create an account, you must provide accurate, complete, and current information. Keeping your information up-to-date helps us provide the best service.')}
          </p>

          <div className="warning-box">
            <AlertCircle className="warning-icon" />
            <div>
              <h4 className="warning-title">{t('terms.s3SecurityTitle', 'Account Security')}</h4>
              <p>{t('terms.s3SecurityText', "You're responsible for keeping your password secure and protecting your account.")}</p>
            </div>
          </div>

          <div className="responsibility-list">
            <h4 className="subsection-title">{t('terms.s3ResponsibilitiesTitle', 'Your Responsibilities')}</h4>
            <ul className="styled-list">
              <li>{t('terms.s3Resp1', 'Provide accurate and complete account information')}</li>
              <li>{t('terms.s3Resp2', "Keep your password secure and don't share it with others")}</li>
              <li>{t('terms.s3Resp3', 'Notify us immediately if you suspect unauthorized access')}</li>
              <li>{t('terms.s3Resp4', 'Only create one account per person')}</li>
              <li>{t('terms.s3Resp5', "Don't let others use your account")}</li>
            </ul>
          </div>
        </ExpandableSection>

        <ExpandableSection id="location-weather" title={t('terms.s4Title', '4. Location & Weather Features')} icon={MapPin} isImportant>
          <div className="highlight-box">
            <h4 className="highlight-title">{t('terms.s4OptionalTitle', 'Completely Optional')}</h4>
            <p>
              {t('terms.s4OptionalText', 'All location features are entirely voluntary. You can skip them during setup, disable them anytime, or use the app without any location sharing.')}
            </p>
          </div>

          <h4 className="subsection-title">{t('terms.s4HowTitle', 'How Location Features Work')}</h4>
          <div className="control-options">
            <div className="control-option">
              <div className="control-option-icon"><MapPin size={20} strokeWidth={1.7} aria-hidden="true" /></div>
              <div>
                <strong>{t('terms.s4CityLabel', 'City Name Only:')}</strong> {t('terms.s4CityText', 'We only collect the city you provide, not precise GPS coordinates')}
              </div>
            </div>
            <div className="control-option">
              <div className="control-option-icon"><CloudSun size={20} strokeWidth={1.7} aria-hidden="true" /></div>
              <div>
                <strong>{t('terms.s4WeatherLabel', 'Weather Service:')}</strong> {t('terms.s4WeatherText', 'Your city name is shared with OpenWeatherMap to get weather data')}
              </div>
            </div>
            <div className="control-option">
              <div className="control-option-icon"><Settings size={20} strokeWidth={1.7} aria-hidden="true" /></div>
              <div>
                <strong>{t('terms.s4ControlLabel', 'Full Control:')}</strong> {t('terms.s4ControlText', 'Update or remove your location information anytime in settings')}
              </div>
            </div>
            <div className="control-option">
              <div className="control-option-icon"><Ban size={20} strokeWidth={1.7} aria-hidden="true" /></div>
              <div>
                <strong>{t('terms.s4TrackingLabel', 'No Tracking:')}</strong> {t('terms.s4TrackingText', 'We never track your movements or precise location')}
              </div>
            </div>
          </div>

          <div className="disclaimer-box">
            <h4 className="disclaimer-title">{t('terms.s4DisclaimerTitle', 'Weather Disclaimer')}</h4>
            <p>
              {t('terms.s4DisclaimerText', "Weather information is provided for informational purposes only. Don't rely on it for critical decisions. Weather data accuracy depends on third-party providers.")}
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection id="user-content" title={t('terms.s5Title', '5. Your Journal Content')} icon={Users} isImportant>
          <div className="highlight-box">
            <h4 className="highlight-title">{t('terms.s5OwnTitle', 'You Own Your Content')}</h4>
            <p>
              {t('terms.s5OwnText', "Your journal entries, photos, and personal content belong to you. We only process them to provide the app's features.")}
            </p>
          </div>

          <h4 className="subsection-title">{t('terms.s5WhatTitle', 'What We Do With Your Content')}</h4>
          <p>
            {t('terms.s5WhatText', "When you upload content to Καιρός, you grant us a limited license to process that content solely for providing the app's features to you. This includes:")}
          </p>

          <ul className="styled-list">
            <li>{t('terms.s5Use1', 'Analyzing your journal entries to provide insights')}</li>
            <li>{t('terms.s5Use2', 'Extracting text from photos you upload')}</li>
            <li>{t('terms.s5Use3', 'Storing your content securely in your account')}</li>
            <li>{t('terms.s5Use4', 'Backing up your data to prevent loss')}</li>
          </ul>

          <h4 className="subsection-title">{t('terms.s5RespTitle', 'Your Content Responsibilities')}</h4>
          <div className="warning-box">
            <AlertCircle className="warning-icon" />
            <div>
              <h4 className="warning-title">{t('terms.s5GuidelinesTitle', 'Content Guidelines')}</h4>
              <p>{t('terms.s5GuidelinesText', "Please ensure your content is appropriate and doesn't violate others' rights.")}</p>
            </div>
          </div>

          <ul className="styled-list">
            <li>{t('terms.s5Resp1', 'You own or have rights to use all content you upload')}</li>
            <li>{t('terms.s5Resp2', "Your content doesn't violate third-party rights")}</li>
            <li>{t('terms.s5Resp3', 'Content is not harmful, offensive, or inappropriate')}</li>
            <li>{t('terms.s5Resp4', 'Location information you provide is accurate')}</li>
            <li>{t('terms.s5Resp5', "You don't upload copyrighted material without permission")}</li>
          </ul>
        </ExpandableSection>

        <ExpandableSection id="prohibited-uses" title={t('terms.s6Title', "6. What's Not Allowed")} icon={Ban}>
          <div className="warning-box">
            <AlertCircle className="warning-icon" />
            <div>
              <h4 className="warning-title">{t('terms.s6GuidelinesTitle', 'Important Guidelines')}</h4>
              <p>{t('terms.s6GuidelinesText', 'Using Καιρός responsibly helps create a safe, positive experience for everyone.')}</p>
            </div>
          </div>

          <h4 className="subsection-title">{t('terms.s6ProhibitedTitle', 'Prohibited Activities')}</h4>
          <ul className="styled-list prohibited-list">
            <li>{t('terms.s6Item1', 'Violating any applicable laws or regulations')}</li>
            <li>{t('terms.s6Item2', 'Sending spam, advertising, or promotional material')}</li>
            <li>{t('terms.s6Item3', 'Impersonating others or providing false information')}</li>
            <li>{t('terms.s6Item4', "Harming or interfering with other users' experience")}</li>
            <li>{t('terms.s6Item5', 'Attempting to damage, disable, or overburden the service')}</li>
            <li>{t('terms.s6Item6', 'Trying to access unauthorized features or data')}</li>
            <li>{t('terms.s6Item7', 'Providing false location information to manipulate weather data')}</li>
            <li>{t('terms.s6Item8', 'Using automated tools to access the service')}</li>
            <li>{t('terms.s6Item9', 'Reverse engineering or copying our technology')}</li>
          </ul>

          <div className="info-box">
            <h4 className="info-box-title">{t('terms.s6DoubtTitle', 'When in Doubt')}</h4>
            <p>
              {t('terms.s6DoubtText', "If you're unsure whether something is allowed, please contact us. We're happy to clarify our policies.")}
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection id="third-party" title={t('terms.s7Title', '7. Third-Party Services')} icon={ExternalLink}>
          <p className="section-intro">
            {t('terms.s7Intro', "Καιρός integrates with third-party services to provide enhanced functionality. Here's what you should know about these integrations.")}
          </p>

          <div className="third-party-service">
            <h4 className="service-title">
              <MapPin className="service-icon" />
              {t('terms.s7WeatherTitle', 'Weather Data (OpenWeatherMap)')}
            </h4>
            <p>
              {t('terms.s7WeatherText', 'When you enable weather features, we use OpenWeatherMap API to get current conditions for your city. This service has its own terms and privacy policy.')}
            </p>

            <div className="info-box">
              <h5 className="info-box-title">{t('terms.s7SharedTitle', 'What Gets Shared')}</h5>
              <ul className="styled-list">
                <li>{t('terms.s7Shared1', 'Only your city name (when you enable weather)')}</li>
                <li>{t('terms.s7Shared2', 'No other personal information is shared')}</li>
                <li>{t('terms.s7Shared3', 'Sharing only happens when refreshing weather data')}</li>
                <li>{t('terms.s7Shared4', 'You can disable this feature anytime')}</li>
              </ul>
            </div>

            <a
              href="https://openweathermap.org/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="external-link"
            >
              {t('terms.s7WeatherLink', 'View OpenWeatherMap Terms')} <ExternalLink size={14} />
            </a>
          </div>

          <div className="third-party-service">
            <h4 className="service-title">
              <Globe className="service-icon" />
              {t('terms.s7GoogleTitle', 'Google Places (City Selection)')}
            </h4>
            <p>
              {t('terms.s7GoogleText', "During account setup, we may use Google Places API to help you select your city more easily. This is optional and Google's policies apply to this interaction.")}
            </p>

            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="external-link"
            >
              {t('terms.s7GoogleLink', 'View Google Terms')} <ExternalLink size={14} />
            </a>
          </div>

          <div className="disclaimer-box">
            <h4 className="disclaimer-title">{t('terms.s7LimitTitle', 'Third-Party Limitations')}</h4>
            <p>
              {t('terms.s7LimitText', "We're not responsible for the availability, accuracy, or functionality of third-party services. Issues with these services should be directed to the respective providers.")}
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection id="intellectual-property" title={t('terms.s8Title', '8. Intellectual Property')} icon={Shield}>
          <p>
            {t('terms.s8p1', 'The Καιρός app, including its design, features, and technology, is owned by us and protected by copyright, trademark, and other intellectual property laws.')}
          </p>

          <h4 className="subsection-title">{t('terms.s8CanTitle', 'What You Can Do')}</h4>
          <ul className="styled-list">
            <li>{t('terms.s8Can1', 'Use the app for personal journaling purposes')}</li>
            <li>{t('terms.s8Can2', 'Export your own content and data')}</li>
            <li>{t('terms.s8Can3', 'Share insights from your own journal entries')}</li>
          </ul>

          <h4 className="subsection-title">{t('terms.s8CantTitle', "What You Can't Do")}</h4>
          <ul className="styled-list prohibited-list">
            <li>{t('terms.s8Cant1', 'Copy, modify, or distribute our app or technology')}</li>
            <li>{t('terms.s8Cant2', 'Use our trademarks or branding without permission')}</li>
            <li>{t('terms.s8Cant3', 'Reverse engineer or attempt to extract our source code')}</li>
            <li>{t('terms.s8Cant4', 'Create derivative works based on our app')}</li>
          </ul>
        </ExpandableSection>

        <ExpandableSection id="ai-technology" title={t('terms.s9Title', '9. AI Analysis & Insights')} icon={Brain}>
          <div className="info-box">
            <h4 className="info-box-title">{t('terms.s9HowTitle', 'How AI Empowers Your Journey')}</h4>
            <p>
              {t('terms.s9HowText', 'Claude AI analyzes your multi-modal entries—text, voice transcriptions, and visual descriptions—to identify patterns, themes, and insights that support your personal growth and self-understanding across all forms of expression.')}
            </p>
          </div>

          <h4 className="subsection-title">{t('terms.s9DisclaimersTitle', 'Important AI Disclaimers')}</h4>
          <div className="warning-box">
            <AlertCircle className="warning-icon" />
            <div>
              <h4 className="warning-title">{t('terms.s9NotAdviceTitle', 'Not Professional Advice')}</h4>
              <p>{t('terms.s9NotAdviceText', 'AI insights are for personal reflection only and should not replace professional medical, psychological, or therapeutic guidance.')}</p>
            </div>
          </div>

          <ul className="styled-list">
            <li>{t('terms.s9Item1', 'AI analysis works across all modalities (text, voice, visual) for holistic insights')}</li>
            <li>{t('terms.s9Item2', 'Insights are intended for personal reflection, not professional advice')}</li>
            <li>{t('terms.s9Item3', 'Analysis quality improves as you journal more consistently')}</li>
            <li>{t('terms.s9Item4', 'You maintain full control—disable AI analysis anytime in privacy settings')}</li>
            <li>{t('terms.s9Item5', 'Your multi-modal data is processed securely and never shared')}</li>
          </ul>

          <div className="info-box">
            <h4 className="info-box-title">{t('terms.s9ImproveTitle', 'Continuous Improvement')}</h4>
            <p>
              {t('terms.s9ImproveText', 'We continually enhance our AI to better understand your unique expression across different modalities, ensuring more meaningful insights over time.')}
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection id="data-accuracy" title={t('terms.s10Title', '10. Service Availability & Accuracy')} icon={Globe}>
          <p className="section-intro">
            {t('terms.s10Intro', 'While we strive to provide reliable service, some factors are beyond our control.')}
          </p>

          <div className="disclaimer-box">
            <h4 className="disclaimer-title">{t('terms.s10LimitTitle', 'Service Limitations')}</h4>
            <p>
              {t('terms.s10LimitText', "Technology services can be affected by various factors. Here's what you should know about service availability and data accuracy.")}
            </p>
          </div>

          <h4 className="subsection-title">{t('terms.s10ExpectTitle', 'What to Expect')}</h4>
          <ul className="styled-list">
            <li>{t('terms.s10Item1', 'Weather information may not always be accurate or current')}</li>
            <li>{t('terms.s10Item2', 'Service availability may be affected by third-party outages')}</li>
            <li>{t('terms.s10Item3', 'Location-based features depend on the accuracy of information you provide')}</li>
            <li>{t('terms.s10Item4', 'AI insights are based on patterns and may not always be perfect')}</li>
            <li>{t('terms.s10Item5', "We'll notify you of planned maintenance when possible")}</li>
          </ul>

          <div className="warning-box">
            <AlertCircle className="warning-icon" />
            <div>
              <h4 className="warning-title">{t('terms.s10RelyTitle', "Don't Rely Solely on App Data")}</h4>
              <p>
                {t('terms.s10RelyText', "Don't make critical decisions based solely on weather information or AI insights from the app. Always use multiple sources for important decisions.")}
              </p>
            </div>
          </div>
        </ExpandableSection>

        <ExpandableSection id="termination" title={t('terms.s11Title', '11. Account Termination')} icon={AlertCircle}>
          <h4 className="subsection-title">{t('terms.s11WhenTitle', 'When Accounts May Be Terminated')}</h4>
          <p>
            {t('terms.s11WhenText', 'We may terminate or suspend your account immediately if you violate these Terms of Service or engage in behavior that harms the service or other users.')}
          </p>

          <h4 className="subsection-title">{t('terms.s11LeaveTitle', 'If You Want to Leave')}</h4>
          <div className="info-box">
            <h4 className="info-box-title">{t('terms.s11DeleteTitle', 'Easy Account Deletion')}</h4>
            <p>
              {t('terms.s11DeleteText', 'You can delete your account anytime through your settings. All your data will be permanently removed within 30 days.')}
            </p>
          </div>

          <ul className="styled-list">
            <li>{t('terms.s11Item1', 'You can discontinue using the app anytime')}</li>
            <li>{t('terms.s11Item2', 'Delete your account through the settings menu')}</li>
            <li>{t('terms.s11Item3', 'Export your data before deletion if you want to keep it')}</li>
            <li>{t('terms.s11Item4', 'Account deletion removes all data, including location information')}</li>
          </ul>
        </ExpandableSection>

        <ExpandableSection id="limitation-liability" title={t('terms.s12Title', '12. Limitation of Liability')} icon={Shield}>
          <div className="warning-box">
            <AlertCircle className="warning-icon" />
            <div>
              <h4 className="warning-title">{t('terms.s12NoticeTitle', 'Important Legal Notice')}</h4>
              <p>{t('terms.s12NoticeText', 'This section limits our legal liability. Please read it carefully.')}</p>
            </div>
          </div>

          <p>
            {t('terms.s12p1', 'To the extent permitted by law, Καιρός and its team are not liable for indirect, incidental, special, or consequential damages, including loss of profits, data, or goodwill, resulting from:')}
          </p>

          <ul className="styled-list">
            <li>{t('terms.s12Item1', 'Your use of or inability to use the app')}</li>
            <li>{t('terms.s12Item2', 'Any third-party content or conduct on the app')}</li>
            <li>{t('terms.s12Item3', 'Unauthorized access to your data')}</li>
            <li>{t('terms.s12Item4', 'Inaccurate weather information or service interruptions')}</li>
            <li>{t('terms.s12Item5', 'Decisions made based on weather or AI insights from the app')}</li>
            <li>{t('terms.s12Item6', 'Privacy or security issues from third-party integrations')}</li>
          </ul>
        </ExpandableSection>

        <ExpandableSection id="disclaimer" title={t('terms.s13Title', '13. Service Disclaimer')} icon={AlertCircle}>
          <div className="disclaimer-box">
            <h4 className="disclaimer-title">{t('terms.s13AsIsTitle', '"AS IS" Service')}</h4>
            <p>
              {t('terms.s13AsIsText', 'Καιρός is provided "as is" without warranties of any kind. We can\'t guarantee the service will always be available or error-free.')}
            </p>
          </div>

          <p>
            {t('terms.s13p1', 'Your use of the app is at your own risk. We provide the service without warranties regarding accuracy, reliability, or availability of weather information, location services, or third-party integrations.')}
          </p>
        </ExpandableSection>

        <ExpandableSection id="governing-law" title={t('terms.s14Title', '14. Governing Law')} icon={Globe}>
          <p>
            {t('terms.s14p1', 'These Terms are governed by the laws of the jurisdiction where Καιρός is based, without regard to conflict of law provisions.')}
          </p>

          <div className="info-box">
            <h4 className="info-box-title">{t('terms.s14DisputeTitle', 'Dispute Resolution')}</h4>
            <p>
              {t('terms.s14DisputeText', 'If you have a dispute with us, we encourage you to contact us directly first. Most issues can be resolved through friendly communication.')}
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection id="changes" title={t('terms.s15Title', '15. Changes to These Terms')} icon={Settings}>
          <p>
            {t('terms.s15p1', 'We may update these Terms of Service from time to time to reflect changes in our service or legal requirements.')}
          </p>

          <h4 className="subsection-title">{t('terms.s15NotifyTitle', "How We'll Notify You")}</h4>
          <ul className="styled-list">
            <li>{t('terms.s15Item1', "Material changes will be announced with at least 30 days' notice")}</li>
            <li>{t('terms.s15Item2', "You'll receive notification through the app or email")}</li>
            <li>{t('terms.s15Item3', 'The "Last Updated" date at the top will be revised')}</li>
            <li>{t('terms.s15Item4', 'Continued use of the app means you accept the new terms')}</li>
          </ul>

          <div className="info-box">
            <h4 className="info-box-title">{t('terms.s15InformedTitle', 'Stay Informed')}</h4>
            <p>
              {t('terms.s15InformedText', "We recommend checking these terms periodically. If you don't agree to new terms, you can stop using the app.")}
            </p>
          </div>
        </ExpandableSection>

        <div className="contact-section">
          <div className="contact-card">
            <Mail className="contact-icon" />
            <div className="contact-content">
              <h3 className="contact-title">{t('terms.contactTitle', 'Questions About These Terms?')}</h3>
              <p className="contact-text">
                {t('terms.contactText', "If you have any questions about these Terms of Service or need clarification on any point, we're here to help. Don't hesitate to reach out.")}
              </p>
              <a href="mailto:contact@kairos-journal.com" className="contact-link">
                contact@kairos-journal.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TermsOfService;