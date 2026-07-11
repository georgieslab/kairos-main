// src/components/pages/Help.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  HelpCircle,
  BookOpen,
  Upload,
  FileText,
  Settings,
  Mail,
  MessageCircle,
  ExternalLink,
  User,
  Bell,
  Moon,
  Shield,
  Download
} from 'lucide-react';
import '../../styles/components/about-help.css';

const Help = ({ onBack }) => {
  const { t } = useTranslation('pages');

  return (
    <div className="about-help-container about-help-page">
      <div className="header-section">
        <button
          onClick={onBack}
          className="back-button"
        >
          <ArrowLeft className="back-icon" />
          {t('help.back', 'Back')}
        </button>

        <h1 className="page-title">
          <HelpCircle className="title-icon" />
          {t('help.pageTitle', 'Help & Support')}
        </h1>
      </div>

      <div className="content-section">
        <h2 className="section-heading">
          <BookOpen className="section-icon" />
          {t('help.gettingStartedTitle', 'Getting Started')}
        </h2>
        <p className="content-text">
          {t('help.gettingStartedIntro', "Καιρός combines traditional handwritten journaling with AI-powered insights. Here's how to get started:")}
        </p>
        <ul className="feature-list">
          <li className="feature-item">
            <BookOpen className="feature-icon" />
            <div className="feature-text">
              <strong>{t('help.step1Title', 'Choose a Journal Path')}</strong> - {t('help.step1Text', 'Select a 10-day journaling journey that matches your interests and goals.')}
            </div>
          </li>
          <li className="feature-item">
            <FileText className="feature-icon" />
            <div className="feature-text">
              <strong>{t('help.step2Title', 'Write in Your Physical Journal')}</strong> - {t('help.step2Text', 'Respond to the daily prompt in your physical journal.')}
            </div>
          </li>
          <li className="feature-item">
            <Upload className="feature-icon" />
            <div className="feature-text">
              <strong>{t('help.step3Title', 'Upload Your Entry')}</strong> - {t('help.step3Text', 'Take a photo of your journal entry using the app.')}
            </div>
          </li>
          <li className="feature-item">
            <FileText className="feature-icon" />
            <div className="feature-text">
              <strong>{t('help.step4Title', 'Review Your Insights')}</strong> - {t('help.step4Text', 'Explore the AI-generated analysis, reflections, and action steps.')}
            </div>
          </li>
        </ul>
      </div>

      <div className="content-section">
        <h2 className="section-heading">
          <HelpCircle className="section-icon" />
          {t('help.faqTitle', 'Frequently Asked Questions')}
        </h2>
        <div className="faq-list">
          <div className="faq-item">
            <div className="faq-question">{t('help.faq1Question', 'How does the AI analyze my journal entries?')}</div>
            <div className="faq-answer">
              {t('help.faq1Answer', 'Καιρός uses Claude AI to analyze your handwritten journal entries. The AI extracts text from your journal image, identifies themes and patterns, and generates personalized insights. Your entries are processed with privacy-first principles and are never used to train AI models.')}
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">{t('help.faq2Question', 'Is my journal data private and secure?')}</div>
            <div className="faq-answer">
              {t('help.faq2Answer', 'Yes! Your privacy is our top priority. All journal entries are encrypted and stored securely. We implement strict data protection measures, and you can enable additional privacy features like private mode and biometric authentication in the settings.')}
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">{t('help.faq3Question', 'Can I export my journal entries and insights?')}</div>
            <div className="faq-answer">
              {t('help.faq3Answer', 'Absolutely. You can export all your journal data, including entries and AI-generated insights, in various formats (JSON, PDF, or text). This feature is available in Settings → Data Management.')}
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">{t('help.faq4Question', "What if the text extraction isn't accurate?")}</div>
            <div className="faq-answer">
              {t('help.faq4Answer', 'If the automatic text extraction isn\'t perfect, don\'t worry! You can always edit the extracted text before analysis. After uploading your journal image, you\'ll see an "Edit Text" option to make any necessary corrections.')}
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">{t('help.faq5Question', 'What happens after I complete the 10-day journey?')}</div>
            <div className="faq-answer">
              {t('help.faq5Answer', "Upon completing a 10-day journey, you'll receive a comprehensive analysis of your full journey, highlighting patterns, growth, and key insights across all entries. You can then start a new journey with different prompts or revisit your completed one.")}
            </div>
          </div>
        </div>
      </div>

      <div className="content-section contact-section">
        <h2 className="section-heading">
          <MessageCircle className="section-icon" />
          {t('help.contactTitle', 'Contact Support')}
        </h2>
        <p className="content-text">
          {t('help.contactIntro', 'Need help with something not covered here? Our support team is ready to assist you.')}
        </p>

        <div className="contact-methods">
          <div className="contact-method">
            <Mail className="contact-icon" />
            <div className="contact-label">{t('help.contactEmailLabel', 'Email Support')}</div>
            <div className="contact-value">support@kairos-journal.com</div>
          </div>

          <div className="contact-method">
            <MessageCircle className="contact-icon" />
            <div className="contact-label">{t('help.contactChatLabel', 'Chat Support')}</div>
            <div className="contact-value">{t('help.contactChatValue', 'Available 9am-5pm ET')}</div>
          </div>

          <div className="contact-method">
            <ExternalLink className="contact-icon" />
            <div className="contact-label">{t('help.contactCenterLabel', 'Help Center')}</div>
            <div className="contact-value">{t('help.contactCenterValue', 'Visit our knowledge base')}</div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2 className="section-heading">
          <Settings className="section-icon" />
          {t('help.preferencesTitle', 'App Preferences')}
        </h2>
        <p className="content-text">
          {t('help.preferencesIntro', 'You can customize your experience in the Settings menu:')}
        </p>
        <ul className="feature-list">
          <li className="feature-item">
            <User className="feature-icon" />
            <div className="feature-text">
              <strong>{t('help.pref1Title', 'Profile Settings')}</strong> - {t('help.pref1Text', 'Update your personal information and profile image.')}
            </div>
          </li>
          <li className="feature-item">
            <Bell className="feature-icon" />
            <div className="feature-text">
              <strong>{t('help.pref2Title', 'Notifications')}</strong> - {t('help.pref2Text', 'Configure daily reminders and weekly summaries.')}
            </div>
          </li>
          <li className="feature-item">
            <Moon className="feature-icon" />
            <div className="feature-text">
              <strong>{t('help.pref3Title', 'Appearance')}</strong> - {t('help.pref3Text', 'Switch between light and dark themes.')}
            </div>
          </li>
          <li className="feature-item">
            <Shield className="feature-icon" />
            <div className="feature-text">
              <strong>{t('help.pref4Title', 'Privacy')}</strong> - {t('help.pref4Text', 'Manage privacy settings and enable biometric authentication.')}
            </div>
          </li>
          <li className="feature-item">
            <Download className="feature-icon" />
            <div className="feature-text">
              <strong>{t('help.pref5Title', 'Data Management')}</strong> - {t('help.pref5Text', 'Export your data or manage your account.')}
            </div>
          </li>
        </ul>
      </div>

      <div className="version-info">
        <p>{t('help.footerText', "If you need further assistance, please don't hesitate to reach out!")}</p>
        <p><a href="#" className="link">{t('help.footerTerms', 'Terms of Service')}</a> | <a href="#" className="link">{t('help.footerPrivacy', 'Privacy Policy')}</a></p>
      </div>
    </div>
  );
};

export default Help;
