// src/pages/Terms.jsx

import React, { useState } from 'react';
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
  Ban
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import '../styles/components/terms.css';

const TermsOfService = ({ onBack }) => {
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
    <PageLayout title="Terms of Service" onBack={onBack}>
      <div className="legal-document">
        <div className="document-header">
          <p className="document-date">Last Updated: November 2025</p>
          
          <div className="info-card info-card-welcome">
            <div className="info-card-icon">
              <Shield size={24} />
            </div>
            <div className="info-card-content">
              <h3 className="info-card-title">Welcome to Καιρός</h3>
              <p className="info-card-text">
                These Terms of Service govern your use of Καιρός, the world's first multi-modal 
                journaling platform. By using our app, you agree to these terms. We've made them 
                as clear and fair as possible.
              </p>
            </div>
          </div>
        </div>

        <div className="quick-summary">
          <h3 className="quick-summary-title">Quick Overview</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <Users className="summary-icon" />
              <span>Your content, your ownership</span>
            </div>
            <div className="summary-item">
              <Brain className="summary-icon" />
              <span>AI enhances, never replaces you</span>
            </div>
            <div className="summary-item">
              <Lock className="summary-icon" />
              <span>Privacy & security first</span>
            </div>
            <div className="summary-item">
              <Shield className="summary-icon" />
              <span>Respectful use required</span>
            </div>
          </div>
        </div>

        <ExpandableSection id="acceptance" title="1. Acceptance of Terms" icon={Shield}>
          <p>
            By accessing or using the Καιρός app, you agree to be bound by these Terms of Service. 
            If you don't agree with any part of these terms, you may not use the app.
          </p>
          
          <div className="info-box">
            <h4 className="info-box-title">💡 What This Means</h4>
            <p>
              Simply using our app means you accept these terms. If you have questions about any 
              part, please contact us before using the service.
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection id="service-description" title="2. What Καιρός Does" icon={Globe} isImportant>
          <p className="section-intro">
            Καιρός is the world's first multi-modal journaling platform, allowing you to express 
            yourself through text, voice, and visual art—all enhanced by AI-powered insights.
          </p>
          
          <h4 className="subsection-title">Core Features</h4>
          <div className="feature-grid">
            <div className="feature-item">✍️ Text journaling with 50+ guided paths</div>
            <div className="feature-item">🎤 Voice journaling with AI transcription</div>
            <div className="feature-item">🎨 Visual journaling through artwork creation</div>
            <div className="feature-item">🤖 Claude AI-powered insights & analysis</div>
            <div className="feature-item">📊 Track your growth across all modalities</div>
            <div className="feature-item">🌟 Personalized journey recommendations</div>
            <div className="feature-item">🌤️ Optional weather context for entries</div>
            <div className="feature-item">� Private, secure, encrypted storage</div>
          </div>

          <div className="highlight-box">
            <h4 className="highlight-title">🎯 Our Mission</h4>
            <p>
              We believe everyone expresses themselves differently. Καιρός empowers your self-discovery 
              journey by letting you journal in whatever way feels right—write, speak, or create—all 
              in one unified platform.
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection id="user-accounts" title="3. Your Account" icon={Users}>
          <h4 className="subsection-title">Account Requirements</h4>
          <p>
            When you create an account, you must provide accurate, complete, and current information. 
            Keeping your information up-to-date helps us provide the best service.
          </p>
          
          <div className="warning-box">
            <AlertCircle className="warning-icon" />
            <div>
              <h4 className="warning-title">Account Security</h4>
              <p>You're responsible for keeping your password secure and protecting your account.</p>
            </div>
          </div>
          
          <div className="responsibility-list">
            <h4 className="subsection-title">Your Responsibilities</h4>
            <ul className="styled-list">
              <li>Provide accurate and complete account information</li>
              <li>Keep your password secure and don't share it with others</li>
              <li>Notify us immediately if you suspect unauthorized access</li>
              <li>Only create one account per person</li>
              <li>Don't let others use your account</li>
            </ul>
          </div>
        </ExpandableSection>

        <ExpandableSection id="location-weather" title="4. Location & Weather Features" icon={MapPin} isImportant>
          <div className="highlight-box">
            <h4 className="highlight-title">🎯 Completely Optional</h4>
            <p>
              All location features are entirely voluntary. You can skip them during setup, 
              disable them anytime, or use the app without any location sharing.
            </p>
          </div>
          
          <h4 className="subsection-title">How Location Features Work</h4>
          <div className="control-options">
            <div className="control-option">
              <div className="control-option-icon">📍</div>
              <div>
                <strong>City Name Only:</strong> We only collect the city you provide, not precise GPS coordinates
              </div>
            </div>
            <div className="control-option">
              <div className="control-option-icon">🌤️</div>
              <div>
                <strong>Weather Service:</strong> Your city name is shared with OpenWeatherMap to get weather data
              </div>
            </div>
            <div className="control-option">
              <div className="control-option-icon">⚙️</div>
              <div>
                <strong>Full Control:</strong> Update or remove your location information anytime in settings
              </div>
            </div>
            <div className="control-option">
              <div className="control-option-icon">🚫</div>
              <div>
                <strong>No Tracking:</strong> We never track your movements or precise location
              </div>
            </div>
          </div>
          
          <div className="disclaimer-box">
            <h4 className="disclaimer-title">Weather Disclaimer</h4>
            <p>
              Weather information is provided for informational purposes only. Don't rely on it 
              for critical decisions. Weather data accuracy depends on third-party providers.
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection id="user-content" title="5. Your Journal Content" icon={Users} isImportant>
          <div className="highlight-box">
            <h4 className="highlight-title">🎯 You Own Your Content</h4>
            <p>
              Your journal entries, photos, and personal content belong to you. We only process 
              them to provide the app's features.
            </p>
          </div>
          
          <h4 className="subsection-title">What We Do With Your Content</h4>
          <p>
            When you upload content to Καιρός, you grant us a limited license to process that 
            content solely for providing the app's features to you. This includes:
          </p>
          
          <ul className="styled-list">
            <li>Analyzing your journal entries to provide insights</li>
            <li>Extracting text from photos you upload</li>
            <li>Storing your content securely in your account</li>
            <li>Backing up your data to prevent loss</li>
          </ul>
          
          <h4 className="subsection-title">Your Content Responsibilities</h4>
          <div className="warning-box">
            <AlertCircle className="warning-icon" />
            <div>
              <h4 className="warning-title">Content Guidelines</h4>
              <p>Please ensure your content is appropriate and doesn't violate others' rights.</p>
            </div>
          </div>
          
          <ul className="styled-list">
            <li>You own or have rights to use all content you upload</li>
            <li>Your content doesn't violate third-party rights</li>
            <li>Content is not harmful, offensive, or inappropriate</li>
            <li>Location information you provide is accurate</li>
            <li>You don't upload copyrighted material without permission</li>
          </ul>
        </ExpandableSection>

        <ExpandableSection id="prohibited-uses" title="6. What's Not Allowed" icon={Ban}>
          <div className="warning-box">
            <AlertCircle className="warning-icon" />
            <div>
              <h4 className="warning-title">Important Guidelines</h4>
              <p>Using Καιρός responsibly helps create a safe, positive experience for everyone.</p>
            </div>
          </div>
          
          <h4 className="subsection-title">Prohibited Activities</h4>
          <ul className="styled-list prohibited-list">
            <li>Violating any applicable laws or regulations</li>
            <li>Sending spam, advertising, or promotional material</li>
            <li>Impersonating others or providing false information</li>
            <li>Harming or interfering with other users' experience</li>
            <li>Attempting to damage, disable, or overburden the service</li>
            <li>Trying to access unauthorized features or data</li>
            <li>Providing false location information to manipulate weather data</li>
            <li>Using automated tools to access the service</li>
            <li>Reverse engineering or copying our technology</li>
          </ul>
          
          <div className="info-box">
            <h4 className="info-box-title">💡 When in Doubt</h4>
            <p>
              If you're unsure whether something is allowed, please contact us. We're happy 
              to clarify our policies.
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection id="third-party" title="7. Third-Party Services" icon={ExternalLink}>
          <p className="section-intro">
            Καιρός integrates with third-party services to provide enhanced functionality. 
            Here's what you should know about these integrations.
          </p>

          <div className="third-party-service">
            <h4 className="service-title">
              <MapPin className="service-icon" />
              Weather Data (OpenWeatherMap)
            </h4>
            <p>
              When you enable weather features, we use OpenWeatherMap API to get current conditions 
              for your city. This service has its own terms and privacy policy.
            </p>
            
            <div className="info-box">
              <h5 className="info-box-title">What Gets Shared</h5>
              <ul className="styled-list">
                <li>Only your city name (when you enable weather)</li>
                <li>No other personal information is shared</li>
                <li>Sharing only happens when refreshing weather data</li>
                <li>You can disable this feature anytime</li>
              </ul>
            </div>
            
            <a 
              href="https://openweathermap.org/terms" 
              target="_blank" 
              rel="noopener noreferrer"
              className="external-link"
            >
              View OpenWeatherMap Terms <ExternalLink size={14} />
            </a>
          </div>

          <div className="third-party-service">
            <h4 className="service-title">
              <Globe className="service-icon" />
              Google Places (City Selection)
            </h4>
            <p>
              During account setup, we may use Google Places API to help you select your city 
              more easily. This is optional and Google's policies apply to this interaction.
            </p>
            
            <a 
              href="https://policies.google.com/terms" 
              target="_blank" 
              rel="noopener noreferrer"
              className="external-link"
            >
              View Google Terms <ExternalLink size={14} />
            </a>
          </div>
          
          <div className="disclaimer-box">
            <h4 className="disclaimer-title">Third-Party Limitations</h4>
            <p>
              We're not responsible for the availability, accuracy, or functionality of third-party 
              services. Issues with these services should be directed to the respective providers.
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection id="intellectual-property" title="8. Intellectual Property" icon={Shield}>
          <p>
            The Καιρός app, including its design, features, and technology, is owned by us and 
            protected by copyright, trademark, and other intellectual property laws.
          </p>
          
          <h4 className="subsection-title">What You Can Do</h4>
          <ul className="styled-list">
            <li>Use the app for personal journaling purposes</li>
            <li>Export your own content and data</li>
            <li>Share insights from your own journal entries</li>
          </ul>
          
          <h4 className="subsection-title">What You Can't Do</h4>
          <ul className="styled-list prohibited-list">
            <li>Copy, modify, or distribute our app or technology</li>
            <li>Use our trademarks or branding without permission</li>
            <li>Reverse engineer or attempt to extract our source code</li>
            <li>Create derivative works based on our app</li>
          </ul>
        </ExpandableSection>

        <ExpandableSection id="ai-technology" title="9. AI Analysis & Insights" icon={Brain}>
          <div className="info-box">
            <h4 className="info-box-title">🤖 How AI Empowers Your Journey</h4>
            <p>
              Claude AI analyzes your multi-modal entries—text, voice transcriptions, and visual 
              descriptions—to identify patterns, themes, and insights that support your personal 
              growth and self-understanding across all forms of expression.
            </p>
          </div>
          
          <h4 className="subsection-title">Important AI Disclaimers</h4>
          <div className="warning-box">
            <AlertCircle className="warning-icon" />
            <div>
              <h4 className="warning-title">Not Professional Advice</h4>
              <p>AI insights are for personal reflection only and should not replace professional medical, psychological, or therapeutic guidance.</p>
            </div>
          </div>
          
          <ul className="styled-list">
            <li>AI analysis works across all modalities (text, voice, visual) for holistic insights</li>
            <li>Insights are intended for personal reflection, not professional advice</li>
            <li>Analysis quality improves as you journal more consistently</li>
            <li>You maintain full control—disable AI analysis anytime in privacy settings</li>
            <li>Your multi-modal data is processed securely and never shared</li>
          </ul>
          
          <div className="info-box">
            <h4 className="info-box-title">💡 Continuous Improvement</h4>
            <p>
              We continually enhance our AI to better understand your unique expression across 
              different modalities, ensuring more meaningful insights over time.
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection id="data-accuracy" title="10. Service Availability & Accuracy" icon={Globe}>
          <p className="section-intro">
            While we strive to provide reliable service, some factors are beyond our control.
          </p>
          
          <div className="disclaimer-box">
            <h4 className="disclaimer-title">Service Limitations</h4>
            <p>
              Technology services can be affected by various factors. Here's what you should know 
              about service availability and data accuracy.
            </p>
          </div>
          
          <h4 className="subsection-title">What to Expect</h4>
          <ul className="styled-list">
            <li>Weather information may not always be accurate or current</li>
            <li>Service availability may be affected by third-party outages</li>
            <li>Location-based features depend on the accuracy of information you provide</li>
            <li>AI insights are based on patterns and may not always be perfect</li>
            <li>We'll notify you of planned maintenance when possible</li>
          </ul>
          
          <div className="warning-box">
            <AlertCircle className="warning-icon" />
            <div>
              <h4 className="warning-title">Don't Rely Solely on App Data</h4>
              <p>
                Don't make critical decisions based solely on weather information or AI insights 
                from the app. Always use multiple sources for important decisions.
              </p>
            </div>
          </div>
        </ExpandableSection>

        <ExpandableSection id="termination" title="11. Account Termination" icon={AlertCircle}>
          <h4 className="subsection-title">When Accounts May Be Terminated</h4>
          <p>
            We may terminate or suspend your account immediately if you violate these Terms of Service 
            or engage in behavior that harms the service or other users.
          </p>
          
          <h4 className="subsection-title">If You Want to Leave</h4>
          <div className="info-box">
            <h4 className="info-box-title">💡 Easy Account Deletion</h4>
            <p>
              You can delete your account anytime through your settings. All your data will be 
              permanently removed within 30 days.
            </p>
          </div>
          
          <ul className="styled-list">
            <li>You can discontinue using the app anytime</li>
            <li>Delete your account through the settings menu</li>
            <li>Export your data before deletion if you want to keep it</li>
            <li>Account deletion removes all data, including location information</li>
          </ul>
        </ExpandableSection>

        <ExpandableSection id="limitation-liability" title="12. Limitation of Liability" icon={Shield}>
          <div className="warning-box">
            <AlertCircle className="warning-icon" />
            <div>
              <h4 className="warning-title">Important Legal Notice</h4>
              <p>This section limits our legal liability. Please read it carefully.</p>
            </div>
          </div>
          
          <p>
            To the extent permitted by law, Καιρός and its team are not liable for indirect, 
            incidental, special, or consequential damages, including loss of profits, data, 
            or goodwill, resulting from:
          </p>
          
          <ul className="styled-list">
            <li>Your use of or inability to use the app</li>
            <li>Any third-party content or conduct on the app</li>
            <li>Unauthorized access to your data</li>
            <li>Inaccurate weather information or service interruptions</li>
            <li>Decisions made based on weather or AI insights from the app</li>
            <li>Privacy or security issues from third-party integrations</li>
          </ul>
        </ExpandableSection>

        <ExpandableSection id="disclaimer" title="13. Service Disclaimer" icon={AlertCircle}>
          <div className="disclaimer-box">
            <h4 className="disclaimer-title">"AS IS" Service</h4>
            <p>
              Καιρός is provided "as is" without warranties of any kind. We can't guarantee 
              the service will always be available or error-free.
            </p>
          </div>
          
          <p>
            Your use of the app is at your own risk. We provide the service without warranties 
            regarding accuracy, reliability, or availability of weather information, location 
            services, or third-party integrations.
          </p>
        </ExpandableSection>

        <ExpandableSection id="governing-law" title="14. Governing Law" icon={Globe}>
          <p>
            These Terms are governed by the laws of the jurisdiction where Καιρός is based, 
            without regard to conflict of law provisions.
          </p>
          
          <div className="info-box">
            <h4 className="info-box-title">💡 Dispute Resolution</h4>
            <p>
              If you have a dispute with us, we encourage you to contact us directly first. 
              Most issues can be resolved through friendly communication.
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection id="changes" title="15. Changes to These Terms" icon={Settings}>
          <p>
            We may update these Terms of Service from time to time to reflect changes in our 
            service or legal requirements.
          </p>
          
          <h4 className="subsection-title">How We'll Notify You</h4>
          <ul className="styled-list">
            <li>Material changes will be announced with at least 30 days' notice</li>
            <li>You'll receive notification through the app or email</li>
            <li>The "Last Updated" date at the top will be revised</li>
            <li>Continued use of the app means you accept the new terms</li>
          </ul>
          
          <div className="info-box">
            <h4 className="info-box-title">💡 Stay Informed</h4>
            <p>
              We recommend checking these terms periodically. If you don't agree to new terms, 
              you can stop using the app.
            </p>
          </div>
        </ExpandableSection>

        <div className="contact-section">
          <div className="contact-card">
            <Mail className="contact-icon" />
            <div className="contact-content">
              <h3 className="contact-title">Questions About These Terms?</h3>
              <p className="contact-text">
                If you have any questions about these Terms of Service or need clarification 
                on any point, we're here to help. Don't hesitate to reach out.
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