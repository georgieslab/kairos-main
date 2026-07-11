// src/pages/ContactUs.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, MessageSquare, Send, HelpCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

const ContactUs = ({ onBack }) => {
  const { t } = useTranslation('pages');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage({
        type: 'success',
        text: t('contact.submitSuccess', "Thank you for your message! We'll get back to you soon.")
      });

      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitMessage(null);
      }, 5000);
    }, 1500);
  };

  return (
    <PageLayout title={t('contact.pageTitle', 'Contact Us')} onBack={onBack}>
      <div className="info-card">
        <p>
          {t('contact.intro', "Have questions, feedback, or need support? We'd love to hear from you. Fill out the form below or reach out to us directly using one of our contact methods.")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div>
          <h2>{t('contact.getInTouchTitle', 'Get in Touch')}</h2>
          <p>
            {t('contact.getInTouchText', "We're here to help with any questions or concerns you might have about Καιρός. Our team typically responds within 24-48 hours.")}
          </p>

          <div className="mt-6">
            <h3>{t('contact.methodsTitle', 'Contact Methods')}</h3>

            <div className="mt-4 space-y-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-emerald-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">{t('contact.emailUsTitle', 'Email Us')}</h4>
                  <p className="text-sm mt-1">
                    <a href="mailto:contact@kairos-journal.com">contact@kairos-journal.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <HelpCircle className="w-5 h-5 text-emerald-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">{t('contact.helpCenterTitle', 'Help Center')}</h4>
                  <p className="text-sm mt-1">
                    {t('contact.helpCenterTextPrefix', 'Visit our')} <a href="#">{t('contact.helpCenterLink', 'Help Center')}</a> {t('contact.helpCenterTextSuffix', 'for FAQs and guides')}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MessageSquare className="w-5 h-5 text-emerald-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">{t('contact.feedbackTitle', 'Feedback')}</h4>
                  <p className="text-sm mt-1">
                    {t('contact.feedbackTextPrefix', 'Share your')} <a href="#">{t('contact.feedbackLink', 'feedback and suggestions')}</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3>{t('contact.businessTitle', 'Business Inquiries')}</h3>
            <p className="mt-2">
              {t('contact.businessText', 'For business partnerships, press inquiries, or other business-related matters, please contact:')}
            </p>
            <p className="mt-2">
              <a href="mailto:business@kairos-journal.com">contact@kairos-journal.com</a>
            </p>
          </div>
        </div>

        <div>
          <h2>{t('contact.formTitle', 'Contact Form')}</h2>

          {submitMessage && (
            <div className={`p-4 rounded-md mb-4 ${
              submitMessage.type === 'success'
                ? 'bg-emerald-900/20 border border-emerald-800/30 text-emerald-400'
                : 'bg-red-900/20 border border-red-800/30 text-red-400'
            }`}>
              {submitMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">{t('contact.formNameLabel', 'Name')}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
                placeholder={t('contact.formNamePlaceholder', 'Your name')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">{t('contact.formEmailLabel', 'Email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject" className="form-label">{t('contact.formSubjectLabel', 'Subject')}</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-input"
                required
                placeholder={t('contact.formSubjectPlaceholder', 'What is this regarding?')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">{t('contact.formMessageLabel', 'Message')}</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                required
                placeholder={t('contact.formMessagePlaceholder', 'Your message...')}
                rows="5"
              ></textarea>
            </div>

            <button
              type="submit"
              className="form-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  {t('contact.formSending', 'Sending...')}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {t('contact.formSend', 'Send Message')}
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="section-divider"></div>

      <div className="info-card mt-8">
        <h3 className="mb-2">{t('contact.urgentTitle', 'Need Immediate Help?')}</h3>
        <p>
          {t('contact.urgentTextPrefix', 'For urgent assistance or technical issues, check our')} <a href="#">{t('contact.urgentLink', 'Troubleshooting Guide')}</a> {t('contact.urgentTextSuffix', 'for common solutions or email us with "URGENT" in the subject line.')}
        </p>
      </div>
    </PageLayout>
  );
};

export default ContactUs;
