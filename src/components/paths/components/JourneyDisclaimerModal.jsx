// src/components/paths/components/JourneyDisclaimerModal.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, AlertTriangle, Check, ExternalLink } from 'lucide-react';

/**
 * Modal component to display disclaimer before starting the Transformation Journey
 */
const JourneyDisclaimerModal = ({ onAccept, onCancel }) => {
  const { t } = useTranslation('paths');
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            <AlertTriangle className="modal-title-icon" />
            {t('disclaimerModal.header', 'Important Information')}
          </h2>
          <button onClick={onCancel} className="modal-close">
            <X className="modal-close-icon" />
          </button>
        </div>

        <div className="modal-content">
          <div className="disclaimer-section">
            <h3 className="disclaimer-title">{t('disclaimerModal.aboutTitle', 'About This Journey')}</h3>
            <p>
              {t('disclaimerModal.aboutText', 'The "Transformation Journey: Breaking Patterns" is designed to support you in addressing and transforming challenging patterns in your life. This may include habits related to substances, behaviors, or thought patterns that you wish to change.')}
            </p>
          </div>

          <div className="disclaimer-section">
            <h3 className="disclaimer-title">{t('disclaimerModal.disclaimerTitle', 'Important Disclaimer')}</h3>
            <p>
              {t('disclaimerModal.disclaimerText', "While journaling can be a powerful tool for personal growth and recovery, this journey is not a substitute for professional treatment, therapy, or medical advice. If you're struggling with addiction or other serious mental health issues, please consult with a healthcare professional.")}
            </p>
          </div>

          <div className="disclaimer-section">
            <h3 className="disclaimer-title">{t('disclaimerModal.privacyTitle', 'Privacy & Personalization')}</h3>
            <p>
              {t('disclaimerModal.privacyText1', 'The prompts in this journey will refer to "[substance/behavior]" - mentally replace this with the specific pattern you\'re working to transform. Your responses are private and processed according to your privacy settings.')}
            </p>
            <p>
              {t('disclaimerModal.privacyText2', 'Your entries are processed to generate your reflections and are never used to train AI models.')}
            </p>
          </div>

          <div className="disclaimer-section">
            <h3 className="disclaimer-title">{t('disclaimerModal.resourcesTitle', 'Support Resources')}</h3>
            <ul className="resource-list">
              <li>
                <ExternalLink className="resource-icon" />
                <a href="https://www.samhsa.gov/find-help/national-helpline" target="_blank" rel="noopener noreferrer">
                  {t('disclaimerModal.resourceSamhsa', 'SAMHSA National Helpline: 1-800-662-4357')}
                </a>
              </li>
              <li>
                <ExternalLink className="resource-icon" />
                <a href="https://www.aa.org/" target="_blank" rel="noopener noreferrer">
                  {t('disclaimerModal.resourceAA', 'Alcoholics Anonymous')}
                </a>
              </li>
              <li>
                <ExternalLink className="resource-icon" />
                <a href="https://www.smartrecovery.org/" target="_blank" rel="noopener noreferrer">
                  {t('disclaimerModal.resourceSmartRecovery', 'SMART Recovery')}
                </a>
              </li>
              <li>
                <ExternalLink className="resource-icon" />
                <a href="https://www.psychologytoday.com/us/therapists" target="_blank" rel="noopener noreferrer">
                  {t('disclaimerModal.resourceFindTherapist', 'Find a Therapist')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onCancel} className="modal-button secondary">
            {t('disclaimerModal.cancel', 'Cancel')}
          </button>
          <button onClick={onAccept} className="modal-button primary">
            <Check className="button-icon" />
            {t('disclaimerModal.accept', 'I Understand & Want to Begin')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JourneyDisclaimerModal;