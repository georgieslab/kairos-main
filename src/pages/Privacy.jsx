// src/pages/Privacy.jsx

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, Shield, Eye, Lock, MapPin, Brain, Download, Trash2, Settings, ExternalLink, Users, AlertCircle, Clock, Globe, FileText, Database, Smartphone } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const PrivacyPolicy = ({ onBack }) => {
  const [expandedSections, setExpandedSections] = useState({
    'data-collection': true,
    'your-rights': true,
    'data-security': true
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
    <PageLayout title="Privacy Policy" onBack={onBack}>
      <div className="legal-document">
        <div className="document-header">
          <p className="document-date">Last Updated: March 15, 2025</p>
          
          <div className="info-card info-card-welcome">
            <div className="info-card-icon">
              <Shield size={24} />
            </div>
            <div className="info-card-content">
              <h3 className="info-card-title">Your Privacy Is Our Priority</h3>
              <p className="info-card-text">
                Καιρός is committed to protecting your privacy and giving you complete control over your personal information. 
                This policy explains exactly how we collect, use, and protect your data when you use our journaling app.
              </p>
            </div>
          </div>
        </div>

        <div className="privacy-highlights">
          <h3 className="highlights-title">Your Privacy Rights at a Glance</h3>
          <div className="highlights-grid">
            <div className="highlight-item highlight-positive">
              <Lock className="highlight-icon" />
              <div className="highlight-content">
                <h4>Complete Data Control</h4>
                <p>View, export, modify, or permanently delete all your data anytime</p>
              </div>
            </div>
            <div className="highlight-item highlight-positive">
              <Eye className="highlight-icon" />
              <div className="highlight-content">
                <h4>Full Transparency</h4>
                <p>We clearly explain what data we collect, why, and who we share it with</p>
              </div>
            </div>
            <div className="highlight-item highlight-neutral">
              <MapPin className="highlight-icon" />
              <div className="highlight-content">
                <h4>Optional Location Services</h4>
                <p>City sharing for weather is completely voluntary and can be disabled</p>
              </div>
            </div>
            <div className="highlight-item highlight-positive">
              <Brain className="highlight-icon" />
              <div className="highlight-content">
                <h4>AI Processing Control</h4>
                <p>Choose your level of AI analysis or disable it completely</p>
              </div>
            </div>
            <div className="highlight-item highlight-positive">
              <Database className="highlight-icon" />
              <div className="highlight-content">
                <h4>Data Minimization</h4>
                <p>We only collect what's necessary to provide our service</p>
              </div>
            </div>
            <div className="highlight-item highlight-positive">
              <Globe className="highlight-icon" />
              <div className="highlight-content">
                <h4>GDPR Compliant</h4>
                <p>Full compliance with international privacy regulations</p>
              </div>
            </div>
          </div>
        </div>

        <ExpandableSection id="data-collection" title="What Information We Collect" icon={Database} isImportant>
          <p className="section-intro">
            We collect only the information necessary to provide you with a personalized journaling experience. 
            Here's exactly what we collect and why:
          </p>

          <div className="data-category">
            <h4 className="data-category-title">
              <Users className="data-category-icon" />
              Account & Profile Information
            </h4>
            <div className="data-items">
              <div className="data-item">📧 <strong>Email address</strong> - For account creation, login, and important notifications</div>
              <div className="data-item">👤 <strong>Full name</strong> - To personalize your experience and communications</div>
              <div className="data-item">🎂 <strong>Date of birth</strong> - To provide age-appropriate content and insights</div>
              <div className="data-item">🖼️ <strong>Profile picture</strong> - Optional, only if you choose to upload one</div>
              <div className="data-item">🔐 <strong>Password (encrypted)</strong> - Securely hashed, never stored in plain text</div>
              <div className="data-item">⚙️ <strong>App preferences</strong> - Your settings, theme choices, and notification preferences</div>
            </div>
          </div>

          <div className="data-category">
            <h4 className="data-category-title">
              <MapPin className="data-category-icon" />
              Location Information (Optional)
            </h4>
            <div className="info-box">
              <h5 className="info-box-title">🎯 What We Actually Store</h5>
              <ul className="styled-list">
                <li><strong>City Name Only:</strong> We store just the city you provide (e.g., "Vienna"), not precise GPS coordinates</li>
                <li><strong>Completely Optional:</strong> You can skip this during signup or leave it blank</li>
                <li><strong>User Controlled:</strong> Update, change, or delete your location information anytime</li>
                <li><strong>No Tracking:</strong> We never track your movements, location history, or precise location</li>
                <li><strong>Weather Only:</strong> Used exclusively to provide local weather information on your dashboard</li>
              </ul>
            </div>
          </div>

          <div className="data-category">
            <h4 className="data-category-title">
              <Brain className="data-category-icon" />
              Journal Content & Analysis
            </h4>
            <div className="data-items">
              <div className="data-item">✍️ <strong>Written entries</strong> - Text you type directly into the app</div>
              <div className="data-item">📷 <strong>Uploaded photos</strong> - Images of handwritten journal pages you choose to upload</div>
              <div className="data-item">🔤 <strong>Extracted text</strong> - Text recognized from your uploaded photos using OCR technology</div>
              <div className="data-item">💡 <strong>AI insights</strong> - Analysis and patterns generated from your journal content (optional)</div>
              <div className="data-item">📊 <strong>Progress data</strong> - Your journaling streaks, completion rates, and journey progress</div>
              <div className="data-item">🏷️ <strong>Tags and categories</strong> - Labels and organization you apply to your entries</div>
            </div>
            
            <div className="warning-box">
              <AlertCircle className="warning-icon" />
              <div>
                <strong>Your Journal Content Belongs to You:</strong> We never claim ownership of your personal journal entries. 
                You retain all rights to your content and can export or delete it at any time.
              </div>
            </div>
          </div>

          <div className="data-category">
            <h4 className="data-category-title">
              <Smartphone className="data-category-icon" />
              Technical & Usage Information
            </h4>
            <div className="data-items">
              <div className="data-item">📱 <strong>Device information</strong> - Device type, OS version, app version</div>
              <div className="data-item">📊 <strong>Usage analytics</strong> - How you use the app (anonymized and aggregated)</div>
              <div className="data-item">🐛 <strong>Error logs</strong> - Technical information to help us fix bugs and improve performance</div>
              <div className="data-item">⏰ <strong>Session data</strong> - When you use the app and for how long (to improve features)</div>
              <div className="data-item">🌐 <strong>IP address</strong> - For security and to prevent abuse (not linked to your identity)</div>
            </div>
          </div>

          <div className="disclaimer-box">
            <h4 className="disclaimer-title">What We DON'T Collect</h4>
            <ul className="styled-list">
              <li>Precise GPS coordinates or location tracking</li>
              <li>Content from other apps on your device</li>
              <li>Your contacts, photos, or other personal files (unless you explicitly share them)</li>
              <li>Microphone or camera data (except when you actively use these features)</li>
              <li>Browsing history or activity outside our app</li>
              <li>Financial information (handled securely by payment processors)</li>
            </ul>
          </div>
        </ExpandableSection>

        <ExpandableSection id="data-usage" title="How We Use Your Information" icon={Settings}>
          <p className="section-intro">
            We use your information solely to provide and improve our journaling service. Here's exactly how:
          </p>

          <div className="usage-grid">
            <div className="usage-item">
              <Brain className="usage-icon" />
              <div className="usage-content">
                <h4>Journal Analysis & Insights</h4>
                <p>AI analyzes your entries to identify patterns, themes, and provide personalized insights to support your personal growth</p>
                <div className="usage-note">
                  <small><strong>Control:</strong> Can be disabled in privacy settings</small>
                </div>
              </div>
            </div>
            <div className="usage-item">
              <MapPin className="usage-icon" />
              <div className="usage-content">
                <h4>Weather Services</h4>
                <p>Your city name is used to fetch local weather conditions and provide contextual prompts based on weather</p>
                <div className="usage-note">
                  <small><strong>Control:</strong> Completely optional and removable</small>
                </div>
              </div>
            </div>
            <div className="usage-item">
              <Settings className="usage-icon" />
              <div className="usage-content">
                <h4>Service Improvement</h4>
                <p>Anonymized usage data helps us understand which features are most valuable and how to improve the app</p>
                <div className="usage-note">
                  <small><strong>Privacy:</strong> Data is aggregated and never personally identifiable</small>
                </div>
              </div>
            </div>
            <div className="usage-item">
              <Mail className="usage-icon" />
              <div className="usage-content">
                <h4>Communication</h4>
                <p>Send you important updates, security notifications, and optional journaling prompts (if enabled)</p>
                <div className="usage-note">
                  <small><strong>Control:</strong> Manage all communication preferences in settings</small>
                </div>
              </div>
            </div>
            <div className="usage-item">
              <FileText className="usage-icon" />
              <div className="usage-content">
                <h4>Content Organization</h4>
                <p>Help you organize, search, and navigate your journal entries with smart categorization and tagging</p>
                <div className="usage-note">
                  <small><strong>Benefit:</strong> Makes your journal more valuable over time</small>
                </div>
              </div>
            </div>
            <div className="usage-item">
              <Shield className="usage-icon" />
              <div className="usage-content">
                <h4>Security & Safety</h4>
                <p>Protect your account from unauthorized access and ensure the security of your personal data</p>
                <div className="usage-note">
                  <small><strong>Purpose:</strong> Account protection and fraud prevention</small>
                </div>
              </div>
            </div>
          </div>

          <div className="ai-processing-details">
            <h4 className="subsection-title">AI Processing Details</h4>
            <div className="info-box">
              <h5 className="info-box-title">How AI Analysis Works</h5>
              <ul className="styled-list">
                <li><strong>Local Processing:</strong> Basic analysis happens on your device when possible</li>
                <li><strong>Secure Cloud Processing:</strong> Advanced analysis uses encrypted data in secure servers</li>
                <li><strong>No Human Review:</strong> Your journal content is never read by our team members</li>
                <li><strong>Pattern Recognition:</strong> AI identifies emotional patterns, themes, and growth opportunities</li>
                <li><strong>Personalized Insights:</strong> Recommendations are tailored specifically to your writing patterns</li>
                <li><strong>Continuous Learning:</strong> AI improves its suggestions based on your feedback (anonymously)</li>
              </ul>
            </div>
          </div>

          <div className="weather-service-details">
            <h4 className="subsection-title">Weather Service Integration</h4>
            <div className="info-box">
              <p>
                <strong>Third-Party Service:</strong> We use OpenWeatherMap API to provide weather information. 
                When you request weather data, only your city name is sent to OpenWeatherMap to retrieve current conditions.
              </p>
              <p>
                <strong>Data Sharing:</strong> No personal information (name, email, journal content) is ever shared with weather services.
                OpenWeatherMap has their own privacy policy available at{' '}
                <a 
                  href="https://openweathermap.org/privacy-policy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="external-link"
                >
                  openweathermap.org/privacy-policy <ExternalLink size={14} />
                </a>
              </p>
            </div>
          </div>
        </ExpandableSection>

        <ExpandableSection id="data-security" title="How We Protect Your Data" icon={Lock} isImportant>
          <div className="security-intro">
            <Lock className="security-intro-icon" />
            <div>
              <h4>Enterprise-Grade Security</h4>
              <p>We implement multiple layers of protection to keep your personal journal entries and data secure.</p>
            </div>
          </div>

          <div className="security-measures">
            <h4 className="subsection-title">Technical Security Measures</h4>
            <div className="security-grid">
              <div className="security-item">🔐 <strong>End-to-end encryption</strong> for journal content during transmission</div>
              <div className="security-item">🏦 <strong>AES-256 encryption</strong> for data storage at rest</div>
              <div className="security-item">🔒 <strong>HTTPS/TLS 1.3</strong> for all data transmission</div>
              <div className="security-item">🛡️ <strong>Password hashing</strong> using bcrypt with salt</div>
              <div className="security-item">🔍 <strong>Regular security audits</strong> by third-party experts</div>
              <div className="security-item">👥 <strong>Strict access controls</strong> - limited team access on need-to-know basis</div>
              <div className="security-item">📊 <strong>Real-time monitoring</strong> for suspicious activity</div>
              <div className="security-item">💾 <strong>Secure backups</strong> with redundant storage</div>
              <div className="security-item">🏢 <strong>SOC 2 compliant</strong> data centers</div>
            </div>
          </div>

          <div className="operational-security">
            <h4 className="subsection-title">Operational Security</h4>
            <div className="control-options">
              <div className="control-option">
                <div className="control-option-icon">👨‍💻</div>
                <div>
                  <strong>Team Training:</strong> All team members receive regular security and privacy training
                </div>
              </div>
              <div className="control-option">
                <div className="control-option-icon">📋</div>
                <div>
                  <strong>Privacy by Design:</strong> Security and privacy considerations built into every feature
                </div>
              </div>
              <div className="control-option">
                <div className="control-option-icon">🔒</div>
                <div>
                  <strong>Access Logging:</strong> All data access is logged and monitored for unusual activity
                </div>
              </div>
              <div className="control-option">
                <div className="control-option-icon">⚠️</div>
                <div>
                  <strong>Incident Response:</strong> Established procedures for handling any security incidents
                </div>
              </div>
            </div>
          </div>

          <div className="user-security">
            <h4 className="subsection-title">What You Can Do</h4>
            <div className="info-box">
              <h5 className="info-box-title">Protect Your Account</h5>
              <ul className="styled-list">
                <li>Use a strong, unique password for your Καιρός account</li>
                <li>Enable two-factor authentication when available</li>
                <li>Keep your app updated to the latest version</li>
                <li>Log out of shared devices after use</li>
                <li>Report any suspicious activity immediately</li>
                <li>Review your account activity regularly in settings</li>
              </ul>
            </div>
          </div>

          <div className="disclaimer-box">
            <h4 className="disclaimer-title">Security Limitations</h4>
            <p>
              While we implement strong security measures, no method of transmission over the internet 
              or electronic storage is 100% secure. We continuously work to improve our security practices 
              and will notify you immediately of any security incidents that may affect your data.
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection id="your-rights" title="Your Privacy Rights & Controls" icon={Settings} isImportant>
          <p className="section-intro">
            You have extensive control over your information and how we use it. These rights apply regardless of where you're located.
          </p>

          <div className="control-categories">
            <div className="control-category">
              <h4 className="control-title">
                <Eye className="control-icon" />
                Access & Portability Rights
              </h4>
              <div className="control-options">
                <div className="control-option">
                  <div className="control-option-icon">👁️</div>
                  <div>
                    <strong>View All Data:</strong> See exactly what personal information we have about you
                  </div>
                </div>
                <div className="control-option">
                  <div className="control-option-icon">📥</div>
                  <div>
                    <strong>Download Everything:</strong> Export all your data in multiple formats (JSON, TXT, CSV, PDF)
                  </div>
                </div>
                <div className="control-option">
                  <div className="control-option-icon">📋</div>
                  <div>
                    <strong>Data Report:</strong> Get a comprehensive report of how your data is being used
                  </div>
                </div>
                <div className="control-option">
                  <div className="control-option-icon">🔄</div>
                  <div>
                    <strong>Transfer Data:</strong> Move your data to another service (data portability)
                  </div>
                </div>
              </div>
            </div>

            <div className="control-category">
              <h4 className="control-title">
                <Settings className="control-icon" />
                Modification & Correction Rights
              </h4>
              <div className="control-options">
                <div className="control-option">
                  <div className="control-option-icon">✏️</div>
                  <div>
                    <strong>Update Information:</strong> Correct or update any personal information anytime
                  </div>
                </div>
                <div className="control-option">
                  <div className="control-option-icon">🏷️</div>
                  <div>
                    <strong>Edit Entries:</strong> Modify, update, or enhance any of your journal entries
                  </div>
                </div>
                <div className="control-option">
                  <div className="control-option-icon">⚙️</div>
                  <div>
                    <strong>Privacy Settings:</strong> Adjust all privacy and data processing preferences
                  </div>
                </div>
              </div>
            </div>

            <div className="control-category">
              <h4 className="control-title">
                <MapPin className="control-icon" />
                Location Control
              </h4>
              <div className="control-options">
                <div className="control-option">
                  <div className="control-option-icon">🎯</div>
                  <div>
                    <strong>Skip During Setup:</strong> Choose not to provide location information during account creation
                  </div>
                </div>
                <div className="control-option">
                  <div className="control-option-icon">🌍</div>
                  <div>
                    <strong>Change Anytime:</strong> Update your city or location information whenever you move
                  </div>
                </div>
                <div className="control-option">
                  <div className="control-option-icon">🚫</div>
                  <div>
                    <strong>Remove Completely:</strong> Delete all location data to disable weather features
                  </div>
                </div>
                <div className="control-option">
                  <div className="control-option-icon">🔒</div>
                  <div>
                    <strong>No Tracking:</strong> We never track your precise location or movement history
                  </div>
                </div>
              </div>
            </div>

            <div className="control-category">
              <h4 className="control-title">
                <Brain className="control-icon" />
                AI Processing Control
              </h4>
              <div className="control-options">
                <div className="control-option">
                  <div className="control-option-icon">🤖</div>
                  <div>
                    <strong>Enable/Disable AI:</strong> Turn AI analysis on or off completely in privacy settings
                  </div>
                </div>
                <div className="control-option">
                  <div className="control-option-icon">🎚️</div>
                  <div>
                    <strong>Processing Levels:</strong> Choose local-only, basic cloud, or advanced AI processing
                  </div>
                </div>
                <div className="control-option">
                  <div className="control-option-icon">💡</div>
                  <div>
                    <strong>Insight Control:</strong> Delete previous insights or prevent future analysis of specific entries
                  </div>
                </div>
              </div>
            </div>

            <div className="control-category">
              <h4 className="control-title">
                <Clock className="control-icon" />
                Data Retention Control
              </h4>
              <div className="control-options">
                <div className="control-option">
                  <div className="control-option-icon">⏱️</div>
                  <div>
                    <strong>Retention Periods:</strong> Choose how long we keep your data (1 month to indefinite)
                  </div>
                </div>
                <div className="control-option">
                  <div className="control-option-icon">🗑️</div>
                  <div>
                    <strong>Auto-Delete:</strong> Set automatic deletion of old entries after specified time periods
                  </div>
                </div>
                <div className="control-option">
                  <div className="control-option-icon">💾</div>
                  <div>
                    <strong>Backup Control:</strong> Choose whether your data is included in our backup systems
                  </div>
                </div>
              </div>
            </div>

            <div className="control-category">
              <h4 className="control-title">
                <Trash2 className="control-icon" />
                Deletion Rights
              </h4>
              <div className="warning-box">
                <AlertCircle className="warning-icon" />
                <div>
                  <strong>Complete Data Removal:</strong> You can permanently delete your entire account and all 
                  associated data through account settings. This action is irreversible.
                </div>
              </div>
              <div className="control-options">
                <div className="control-option">
                  <div className="control-option-icon">🗑️</div>
                  <div>
                    <strong>Delete Individual Entries:</strong> Remove specific journal entries permanently
                  </div>
                </div>
                <div className="control-option">
                  <div className="control-option-icon">🧹</div>
                  <div>
                    <strong>Selective Deletion:</strong> Remove specific types of data (location, photos, insights)
                  </div>
                </div>
                <div className="control-option">
                  <div className="control-option-icon">💣</div>
                  <div>
                    <strong>Account Deletion:</strong> Permanently delete everything and close your account
                  </div>
                </div>
                <div className="control-option">
                  <div className="control-option-icon">⏰</div>
                  <div>
                    <strong>30-Day Grace Period:</strong> Recover your account within 30 days of deletion request
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="gdpr-compliance">
            <h4 className="subsection-title">International Privacy Rights</h4>
            <div class="info-box">
              <h5 className="info-box-title">GDPR & International Compliance</h5>
              <p>
                If you're located in the European Union, United Kingdom, or other regions with comprehensive 
                privacy laws, you have additional rights including:
              </p>
              <ul className="styled-list">
                <li><strong>Right to Object:</strong> Object to processing of your data for specific purposes</li>
                <li><strong>Right to Restrict:</strong> Limit how we process your data in certain circumstances</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing anytime</li>
                <li><strong>Right to Complain:</strong> File complaints with your local data protection authority</li>
                <li><strong>Data Protection Officer:</strong> Contact our DPO for privacy-related questions</li>
              </ul>
            </div>
          </div>
        </ExpandableSection>

        <ExpandableSection id="data-sharing" title="When We Share Your Information" icon={Users}>
          <div className="sharing-intro">
            <Shield className="sharing-intro-icon" />
            <div>
              <h4>We Never Sell Your Personal Data</h4>
              <p>Your journal content and personal information are never sold, rented, or shared for marketing purposes.</p>
            </div>
          </div>

          <div className="sharing-scenarios">
            <div className="sharing-scenario">
              <h4 className="sharing-title">
                <Settings className="sharing-icon" />
                Service Providers & Infrastructure
              </h4>
              <p>
                We share limited information with trusted service providers who help us operate the app. 
                These companies are contractually required to protect your data and cannot use it for their own purposes.
              </p>
              <div className="info-box">
                <h5 className="info-box-title">Current Service Providers</h5>
                <ul className="styled-list">
                  <li><strong>Cloud Infrastructure:</strong> AWS (encrypted data storage and processing)</li>
                  <li><strong>Analytics:</strong> Privacy-focused analytics (no personal data shared)</li>
                  <li><strong>Email Service:</strong> Transactional email providers for account notifications</li>
                  <li><strong>Payment Processing:</strong> Stripe (for subscription payments, governed by their privacy policy)</li>
                  <li><strong>Customer Support:</strong> Support platform providers (only when you contact us)</li>
                </ul>
              </div>
            </div>

            <div className="sharing-scenario">
              <h4 className="sharing-title">
                <MapPin className="sharing-icon" />
                Weather Service Integration
              </h4>
              <div className="info-box">
                <h5 className="info-box-title">What Gets Shared with Weather Services</h5>
                <ul className="styled-list">
                  <li><strong>Only City Name:</strong> Your city name is sent to OpenWeatherMap for weather data</li>
                  <li><strong>When It's Shared:</strong> Only when you actively use weather features</li>
                  <li><strong>What's Protected:</strong> No personal information, journal content, or other data is shared</li>
                  <li><strong>Frequency:</strong> Only when weather data needs to be refreshed</li>
                  <li><strong>Your Control:</strong> Disable weather features to stop all sharing with weather services</li>
                </ul>
              </div>
            </div>

            <div className="sharing-scenario">
              <h4 className="sharing-title">
                <AlertCircle className="sharing-icon" />
                Legal Requirements
              </h4>
              <p>
                We may disclose your information if required by law, court order, or to protect the rights, 
                property, or safety of Καιρός, our users, or others. We will:
              </p>
              <ul className="styled-list">
                <li>Notify you when legally permitted</li>
                <li>Challenge overly broad requests</li>
                <li>Only share the minimum information required</li>
                <li>Provide transparency reports annually</li>
              </ul>
            </div>

            <div className="sharing-scenario">
              <h4 className="sharing-title">
                <Users className="sharing-icon" />
                Business Changes
              </h4>
              <p>
                If Καιρός is involved in a merger, acquisition, or sale, your information may be transferred. 
                In such cases, we will:
              </p>
              <ul className="styled-list">
                <li>Notify you via email at least 30 days in advance</li>
                <li>Ensure the new entity follows this privacy policy</li>
                <li>Provide options to delete your data before transfer</li>
                <li>Give you the right to object to the transfer</li>
              </ul>
            </div>
          </div>

          <div className="no-sharing-box">
            <h4 className="subsection-title">What We Never Share</h4>
            <div className="highlight-box">
              <ul className="styled-list">
                <li>Your actual journal content or personal entries</li>
                <li>Your personal insights or AI analysis results</li>
                <li>Your email address or contact information (except with your explicit consent)</li>
                <li>Individual usage patterns or behavior data</li>
                <li>Any information for advertising or marketing purposes</li>
                <li>Data with companies for profiling or targeting</li>
              </ul>
            </div>
          </div>
        </ExpandableSection>

        <ExpandableSection id="third-party" title="Third-Party Services & Integrations" icon={ExternalLink}>
          <p className="section-intro">
            Καιρός integrates with carefully selected third-party services to enhance your experience. 
            Here's what you need to know about each integration:
          </p>

          <div className="third-party-service">
            <h4 className="service-title">
              <MapPin className="service-icon" />
              Weather Data (OpenWeatherMap)
            </h4>
            <div className="service-details">
              <p>
                <strong>Purpose:</strong> Provides current weather conditions for your location to enhance journaling prompts and insights.
              </p>
              <div className="info-box">
                <h5 className="info-box-title">Data Sharing Details</h5>
                <ul className="styled-list">
                  <li><strong>What's Shared:</strong> Only your city name (e.g., "Vienna")</li>
                  <li><strong>When:</strong> Only when you actively use weather features</li>
                  <li><strong>Frequency:</strong> When weather data needs refreshing (typically every few hours)</li>
                  <li><strong>Protection:</strong> No personal information or journal content is shared</li>
                </ul>
              </div>
              <a 
                href="https://openweathermap.org/privacy-policy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="external-link"
              >
                View OpenWeatherMap Privacy Policy <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="third-party-service">
            <h4 className="service-title">
              <Globe className="service-icon" />
              Google Services
            </h4>
            <div className="service-details">
              <p>
                <strong>Purpose:</strong> Google Places API helps you select your city during account setup for more accurate location matching.
              </p>
              <div className="info-box">
                <h5 className="info-box-title">Limited Integration</h5>
                <ul className="styled-list">
                  <li><strong>When Used:</strong> Only during account setup when you choose to use the city search feature</li>
                  <li><strong>What's Shared:</strong> Your search queries for city names</li>
                  <li><strong>Optional:</strong> You can skip this feature and manually enter your city</li>
                  <li><strong>No Tracking:</strong> We don't use Google Analytics or other tracking services</li>
                </ul>
              </div>
              <a 
                href="https://policies.google.com/privacy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="external-link"
              >
                View Google Privacy Policy <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="third-party-service">
            <h4 className="service-title">
              <Database className="service-icon" />
              Cloud Infrastructure (AWS)
            </h4>
            <div className="service-details">
              <p>
                <strong>Purpose:</strong> Amazon Web Services provides secure cloud infrastructure for data storage and processing.
              </p>
              <div className="info-box">
                <h5 className="info-box-title">Security & Compliance</h5>
                <ul className="styled-list">
                  <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
                  <li><strong>Location:</strong> Data stored in EU/US regions based on your location</li>
                  <li><strong>Compliance:</strong> SOC 2, ISO 27001, and GDPR compliant infrastructure</li>
                  <li><strong>Access:</strong> AWS personnel cannot access your encrypted data</li>
                </ul>
              </div>
              <a 
                href="https://aws.amazon.com/privacy/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="external-link"
              >
                View AWS Privacy Notice <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="disclaimer-box">
            <h4 className="disclaimer-title">Third-Party Responsibility</h4>
            <p>
              While we carefully select our partners and require them to protect your data, we're not responsible 
              for the privacy practices of third-party services. We encourage you to review their privacy policies 
              and contact us if you have concerns about any integration.
            </p>
          </div>
        </ExpandableSection>

        <ExpandableSection id="data-retention" title="How Long We Keep Your Data" icon={Clock}>
          <p className="section-intro">
            We keep your data only as long as necessary to provide our service and as required by law. 
            You can control retention periods for different types of data.
          </p>

          <div className="retention-categories">
            <div className="retention-category">
              <h4 className="retention-title">
                <FileText className="retention-icon" />
                Journal Content
              </h4>
              <div className="retention-options">
                <div className="retention-option">
                  <div className="retention-period">📅 <strong>Default:</strong> Indefinite</div>
                  <div className="retention-description">
                    Your journal entries are kept until you delete them or close your account. 
                    This allows you to build a long-term personal archive.
                  </div>
                </div>
                <div className="retention-option">
                  <div className="retention-period">⚙️ <strong>Customizable:</strong> 1 month to 10 years</div>
                  <div className="retention-description">
                    Set automatic deletion of entries older than your chosen time period in privacy settings.
                  </div>
                </div>
              </div>
            </div>

            <div className="retention-category">
              <h4 className="retention-title">
                <Users className="retention-icon" />
                Account Information
              </h4>
              <div class="retention-options">
                <div className="retention-option">
                  <div className="retention-period">🔄 <strong>Active Account:</strong> Until deletion</div>
                  <div className="retention-description">
                    Profile information is kept as long as your account is active and for service provision.
                  </div>
                </div>
                <div className="retention-option">
                  <div className="retention-period">🗑️ <strong>After Deletion:</strong> 30 days maximum</div>
                  <div className="retention-description">
                    Account recovery period, then permanently deleted from all systems including backups.
                  </div>
                </div>
              </div>
            </div>

            <div className="retention-category">
              <h4 className="retention-title">
                <Brain className="retention-icon" />
                AI Analysis & Insights
              </h4>
              <div className="retention-options">
                <div className="retention-option">
                  <div className="retention-period">🤖 <strong>Linked to Entries:</strong> Same as journal content</div>
                  <div className="retention-description">
                    AI insights are deleted when the corresponding journal entries are deleted.
                  </div>
                </div>
                <div className="retention-option">
                  <div className="retention-period">📊 <strong>Aggregated Patterns:</strong> Anonymized indefinitely</div>
                  <div className="retention-description">
                    Anonymous, aggregated insights help improve AI for all users (no personal data retained).
                  </div>
                </div>
              </div>
            </div>

            <div className="retention-category">
              <h4 className="retention-title">
                <Smartphone className="retention-icon" />
                Technical & Usage Data
              </h4>
              <div className="retention-options">
                <div className="retention-option">
                  <div className="retention-period">📊 <strong>Analytics:</strong> 2 years maximum</div>
                  <div className="retention-description">
                    Anonymized usage data for app improvement, automatically deleted after 2 years.
                  </div>
                </div>
                <div className="retention-option">
                  <div className="retention-period">🐛 <strong>Error Logs:</strong> 90 days</div>
                  <div className="retention-description">
                    Technical logs for debugging and performance optimization, automatically deleted quarterly.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="retention-control">
            <h4 className="subsection-title">Your Retention Controls</h4>
            <div className="info-box">
              <h5 className="info-box-title">Manage Data Retention</h5>
              <ul className="styled-list">
                <li><strong>Individual Control:</strong> Delete specific entries, photos, or data types anytime</li>
                <li><strong>Batch Operations:</strong> Delete multiple entries by date range or category</li>
                <li><strong>Automatic Deletion:</strong> Set rules for automatic deletion of old content</li>
                <li><strong>Retention Preferences:</strong> Choose different retention periods for different data types</li>
                <li><strong>Export Before Deletion:</strong> Download your data before automatic deletion</li>
              </ul>
            </div>
          </div>
        </ExpandableSection>

        <ExpandableSection id="international" title="International Data Transfers" icon={Globe}>
          <p className="section-intro">
            Καιρός operates globally, and we may process your data in different countries to provide our service. 
            Here's how we ensure your data remains protected across borders.
          </p>

          <div className="transfer-details">
            <h4 className="subsection-title">Where Your Data May Be Processed</h4>
            <div className="transfer-locations">
              <div className="transfer-location">
                <h5 className="location-title">🇪🇺 European Union</h5>
                <p>Primary data processing for EU residents, full GDPR compliance and protection.</p>
              </div>
              <div className="transfer-location">
                <h5 className="location-title">🇺🇸 United States</h5>
                <p>Infrastructure services with EU-US Data Privacy Framework compliance for EU data.</p>
              </div>
              <div className="transfer-location">
                <h5 className="location-title">🌍 Other Regions</h5>
                <p>Limited processing only with adequate protection measures and your explicit consent.</p>
              </div>
            </div>
          </div>

          <div className="transfer-protections">
            <h4 className="subsection-title">Protection Measures</h4>
            <div className="info-box">
              <h5 className="info-box-title">How We Protect Your Data Internationally</h5>
              <ul className="styled-list">
                <li><strong>Adequacy Decisions:</strong> Transfers only to countries with EU adequacy decisions when possible</li>
                <li><strong>Standard Contractual Clauses:</strong> EU-approved contracts for international transfers</li>
                <li><strong>Data Privacy Framework:</strong> Compliance with EU-US and other international frameworks</li>
                <li><strong>Additional Safeguards:</strong> Technical and organizational measures beyond legal requirements</li>
                <li><strong>Encryption:</strong> Data encrypted during international transfers and storage</li>
                <li><strong>Regular Audits:</strong> Ongoing compliance monitoring in all processing locations</li>
              </ul>
            </div>
          </div>

          <div className="user-location-control">
            <h4 className="subsection-title">Your Location Preferences</h4>
            <div className="control-options">
              <div className="control-option">
                <div className="control-option-icon">📍</div>
                <div>
                  <strong>Data Residency:</strong> Choose your preferred data processing region in account settings
                </div>
              </div>
              <div className="control-option">
                <div className="control-option-icon">🚫</div>
                <div>
                  <strong>Transfer Restrictions:</strong> Opt out of international transfers where technically possible
                </div>
              </div>
              <div className="control-option">
                <div className="control-option-icon">📧</div>
                <div>
                  <strong>Transfer Notifications:</strong> Receive notifications about any new international processing
                </div>
              </div>
            </div>
          </div>
        </ExpandableSection>

        <ExpandableSection id="children" title="Children's Privacy & Age Requirements" icon={Shield}>
          <div className="age-requirements">
            <div className="warning-box">
              <AlertCircle className="warning-icon" />
              <div>
                <h4 className="warning-title">Age Restrictions</h4>
                <p>
                  Καιρός is designed for users aged 13 and older. We do not knowingly collect personal 
                  information from children under 13 years of age.
                </p>
              </div>
            </div>
          </div>

          <div className="age-verification">
            <h4 className="subsection-title">Age Verification & Protection</h4>
            <ul className="styled-list">
              <li><strong>Date of Birth Requirement:</strong> We collect date of birth during signup to verify age eligibility</li>
              <li><strong>Under-13 Prevention:</strong> Users under 13 cannot create accounts and are directed to age-appropriate alternatives</li>
              <li><strong>Parental Rights:</strong> Parents can request deletion of any data if their child created an account illegally</li>
              <li><strong>Teen Privacy:</strong> Users 13-17 have the same privacy rights as adults, with additional protections</li>
              <li><strong>Age-Appropriate Content:</strong> Journaling prompts and features are adapted based on user age</li>
            </ul>
          </div>

          <div className="parental-controls">
            <h4 className="subsection-title">For Parents & Guardians</h4>
            <div class="info-box">
              <h5 className="info-box-title">If You Believe Your Child Has Created an Account</h5>
              <p>
                If you discover that your child under 13 has provided personal information to Καιρός, 
                please contact us immediately at{' '}
                <a href="mailto:privacy@kairos-journal.com" className="contact-link">
                  privacy@kairos-journal.com
                </a>
                . We will:
              </p>
              <ul className="styled-list">
                <li>Immediately suspend the account</li>
                <li>Delete all personal information</li>
                <li>Remove all journal content</li>
                <li>Confirm deletion within 48 hours</li>
              </ul>
            </div>
          </div>

          <div className="teen-considerations">
            <h4 className="subsection-title">Special Considerations for Teens (13-17)</h4>
            <div className="control-options">
              <div className="control-option">
                <div className="control-option-icon">🛡️</div>
                <div>
                  <strong>Enhanced Privacy:</strong> Additional privacy protections and simplified settings
                </div>
              </div>
              <div className="control-option">
                <div className="control-option-icon">📚</div>
                <div>
                  <strong>Educational Content:</strong> Age-appropriate journaling guidance and mental health resources
                </div>
              </div>
              <div className="control-option">
                <div className="control-option-icon">👥</div>
                <div>
                  <strong>Limited Sharing:</strong> Reduced data sharing and additional consent requirements
                </div>
              </div>
              <div className="control-option">
                <div className="control-option-icon">🆘</div>
                <div>
                  <strong>Crisis Resources:</strong> Immediate access to mental health support when needed
                </div>
              </div>
            </div>
          </div>
        </ExpandableSection>

        <ExpandableSection id="policy-changes" title="Changes to This Privacy Policy" icon={FileText}>
          <p className="section-intro">
            We may update this Privacy Policy from time to time to reflect changes in our practices, 
            technology, legal requirements, or other factors.
          </p>

          <div className="change-notification">
            <h4 className="subsection-title">How We Notify You of Changes</h4>
            <div className="notification-methods">
              <div className="notification-method">
                <h5 className="method-title">📧 Email Notification</h5>
                <p>We'll send you an email about significant changes at least 30 days before they take effect.</p>
              </div>
              <div className="notification-method">
                <h5 className="method-title">📱 In-App Notice</h5>
                <p>Important changes will be highlighted when you next open the app.</p>
              </div>
              <div className="notification-method">
                <h5 className="method-title">🌐 Website Banner</h5>
                <p>Major policy updates will be announced on our website and support pages.</p>
              </div>
            </div>
          </div>

          <div className="change-types">
            <h4 className="subsection-title">Types of Changes</h4>
            <div className="change-category">
              <h5 className="change-title">⚠️ Material Changes</h5>
              <p>Significant changes that affect your rights or how we use your data:</p>
              <ul className="styled-list">
                <li>New data collection practices</li>
                <li>Changes to data sharing arrangements</li>
                <li>Modifications to your privacy rights</li>
                <li>Changes to data retention periods</li>
              </ul>
              <div className="info-box">
                <p><strong>30-day notice period</strong> - You can object or delete your account before changes take effect.</p>
              </div>
            </div>

            <div className="change-category">
              <h5 className="change-title">ℹ️ Minor Changes</h5>
              <p>Small updates that don't affect your rights:</p>
              <ul className="styled-list">
                <li>Clarifications to existing policies</li>
                <li>Contact information updates</li>
                <li>Minor technical corrections</li>
                <li>Formatting and readability improvements</li>
              </ul>
              <div className="info-box">
                <p><strong>Immediate effect</strong> - Changes are reflected in the updated policy date.</p>
              </div>
            </div>
          </div>

          <div className="version-history">
            <h4 className="subsection-title">Policy Version History</h4>
            <div className="info-box">
              <h5 className="info-box-title">Recent Updates</h5>
              <ul className="styled-list">
                <li><strong>March 15, 2025:</strong> Comprehensive rewrite with enhanced user rights and international compliance</li>
                <li><strong>January 2025:</strong> Added AI processing controls and expanded data retention options</li>
                <li><strong>November 2024:</strong> Initial privacy policy for Καιρός launch</li>
              </ul>
              <p>
                <a href="/privacy-history" className="external-link">
                  View complete version history
                </a>
              </p>
            </div>
          </div>

          <div className="your-options">
            <h4 className="subsection-title">Your Options When Policies Change</h4>
            <div class="control-options">
              <div className="control-option">
                <div className="control-option-icon">✅</div>
                <div>
                  <strong>Accept Changes:</strong> Continue using Καιρός under the new policy
                </div>
              </div>
              <div className="control-option">
                <div className="control-option-icon">❌</div>
                <div>
                  <strong>Object to Changes:</strong> Contact us to discuss specific concerns
                </div>
              </div>
              <div className="control-option">
                <div className="control-option-icon">📥</div>
                <div>
                  <strong>Export Your Data:</strong> Download all your information before changes take effect
                </div>
              </div>
              <div className="control-option">
                <div className="control-option-icon">🗑️</div>
                <div>
                  <strong>Delete Your Account:</strong> Permanently remove all data before new policy applies
                </div>
              </div>
            </div>
          </div>
        </ExpandableSection>

        <div className="contact-section">
          <div className="contact-card">
            <Mail className="contact-icon" />
            <div className="contact-content">
              <h3 className="contact-title">Privacy Questions or Concerns?</h3>
              <p className="contact-text">
                Our privacy team is here to help you understand how your data is protected and 
                to assist with any privacy-related requests.
              </p>
              <div className="contact-methods">
                <div className="contact-method">
                  <strong>General Privacy Questions:</strong>
                  <a href="mailto:privacy@kairos-journal.com" className="contact-link">
                    privacy@kairos-journal.com
                  </a>
                </div>
                <div className="contact-method">
                  <strong>Data Protection Officer:</strong>
                  <a href="mailto:dpo@kairos-journal.com" className="contact-link">
                    dpo@kairos-journal.com
                  </a>
                </div>
                <div className="contact-method">
                  <strong>GDPR Requests:</strong>
                  <a href="mailto:gdpr@kairos-journal.com" className="contact-link">
                    gdpr@kairos-journal.com
                  </a>
                </div>
                <div className="contact-method">
                  <strong>Data Deletion Requests:</strong>
                  <a href="mailto:delete@kairos-journal.com" className="contact-link">
                    delete@kairos-journal.com
                  </a>
                </div>
              </div>
              <div className="response-time">
                <p><strong>Response Time:</strong> We respond to all privacy inquiries within 72 hours, 
                and fulfill most requests within 30 days as required by law.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PrivacyPolicy;