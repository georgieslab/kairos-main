// src/components/pages/Help.jsx

import React from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  BookOpen, 
  Upload, 
  FileText, 
  Settings, 
  Mail, 
  MessageCircle, 
  ExternalLink 
} from 'lucide-react';
import '../../styles/components/about-help.css';

const Help = ({ onBack }) => {
  return (
    <div className="about-help-container">
      <div className="header-section">
        <button 
          onClick={onBack}
          className="back-button"
        >
          <ArrowLeft className="back-icon" />
          Back
        </button>
        
        <h1 className="page-title">
          <HelpCircle className="title-icon" />
          Help & Support
        </h1>
      </div>
      
      <div className="content-section">
        <h2 className="section-heading">
          <BookOpen className="section-icon" />
          Getting Started
        </h2>
        <p className="content-text">
          Καιρός combines traditional handwritten journaling with AI-powered insights. Here's how to get started:
        </p>
        <ul className="feature-list">
          <li className="feature-item">
            <BookOpen className="feature-icon" />
            <div className="feature-text">
              <strong>Choose a Journal Path</strong> - Select a 10-day journaling journey that matches your interests and goals.
            </div>
          </li>
          <li className="feature-item">
            <FileText className="feature-icon" />
            <div className="feature-text">
              <strong>Write in Your Physical Journal</strong> - Respond to the daily prompt in your physical journal.
            </div>
          </li>
          <li className="feature-item">
            <Upload className="feature-icon" />
            <div className="feature-text">
              <strong>Upload Your Entry</strong> - Take a photo of your journal entry using the app.
            </div>
          </li>
          <li className="feature-item">
            <FileText className="feature-icon" />
            <div className="feature-text">
              <strong>Review Your Insights</strong> - Explore the AI-generated analysis, reflections, and action steps.
            </div>
          </li>
        </ul>
      </div>
      
      <div className="content-section">
        <h2 className="section-heading">
          <HelpCircle className="section-icon" />
          Frequently Asked Questions
        </h2>
        <div className="faq-list">
          <div className="faq-item">
            <div className="faq-question">How does the AI analyze my journal entries?</div>
            <div className="faq-answer">
              Καιρός uses Claude AI to analyze your handwritten journal entries. The AI extracts text from your journal image, identifies themes and patterns, and generates personalized insights. Your entries are processed with privacy-first principles and are never used to train AI models.
            </div>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">Is my journal data private and secure?</div>
            <div className="faq-answer">
              Yes! Your privacy is our top priority. All journal entries are encrypted and stored securely. We implement strict data protection measures, and you can enable additional privacy features like private mode and biometric authentication in the settings.
            </div>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">Can I export my journal entries and insights?</div>
            <div className="faq-answer">
              Absolutely. You can export all your journal data, including entries and AI-generated insights, in various formats (JSON, PDF, or text). This feature is available in Settings → Data Management.
            </div>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">What if the text extraction isn't accurate?</div>
            <div className="faq-answer">
              If the automatic text extraction isn't perfect, don't worry! You can always edit the extracted text before analysis. After uploading your journal image, you'll see an "Edit Text" option to make any necessary corrections.
            </div>
          </div>
          
          <div className="faq-item">
            <div className="faq-question">What happens after I complete the 10-day journey?</div>
            <div className="faq-answer">
              Upon completing a 10-day journey, you'll receive a comprehensive analysis of your full journey, highlighting patterns, growth, and key insights across all entries. You can then start a new journey with different prompts or revisit your completed one.
            </div>
          </div>
        </div>
      </div>
      
      <div className="content-section contact-section">
        <h2 className="section-heading">
          <MessageCircle className="section-icon" />
          Contact Support
        </h2>
        <p className="content-text">
          Need help with something not covered here? Our support team is ready to assist you.
        </p>
        
        <div className="contact-methods">
          <div className="contact-method">
            <Mail className="contact-icon" />
            <div className="contact-label">Email Support</div>
            <div className="contact-value">support@kairos-journal.com</div>
          </div>
          
          <div className="contact-method">
            <MessageCircle className="contact-icon" />
            <div className="contact-label">Chat Support</div>
            <div className="contact-value">Available 9am-5pm ET</div>
          </div>
          
          <div className="contact-method">
            <ExternalLink className="contact-icon" />
            <div className="contact-label">Help Center</div>
            <div className="contact-value">Visit our knowledge base</div>
          </div>
        </div>
      </div>
      
      <div className="content-section">
        <h2 className="section-heading">
          <Settings className="section-icon" />
          App Preferences
        </h2>
        <p className="content-text">
          You can customize your experience in the Settings menu:
        </p>
        <ul className="feature-list">
          <li className="feature-item">
            <User className="feature-icon" />
            <div className="feature-text">
              <strong>Profile Settings</strong> - Update your personal information and profile image.
            </div>
          </li>
          <li className="feature-item">
            <Bell className="feature-icon" />
            <div className="feature-text">
              <strong>Notifications</strong> - Configure daily reminders and weekly summaries.
            </div>
          </li>
          <li className="feature-item">
            <Moon className="feature-icon" />
            <div className="feature-text">
              <strong>Appearance</strong> - Switch between light and dark themes.
            </div>
          </li>
          <li className="feature-item">
            <Shield className="feature-icon" />
            <div className="feature-text">
              <strong>Privacy</strong> - Manage privacy settings and enable biometric authentication.
            </div>
          </li>
          <li className="feature-item">
            <Download className="feature-icon" />
            <div className="feature-text">
              <strong>Data Management</strong> - Export your data or manage your account.
            </div>
          </li>
        </ul>
      </div>
      
      <div className="version-info">
        <p>If you need further assistance, please don't hesitate to reach out!</p>
        <p><a href="#" className="link">Terms of Service</a> | <a href="#" className="link">Privacy Policy</a></p>
      </div>
    </div>
  );
};

export default Help;