// src/components/paths/components/PathInfoModal.jsx - Updated for direct approach
import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, CheckCircle, ArrowRight } from 'lucide-react';

const PathInfoModal = ({
  content,
  onClose,
  onContinue,
  pathId // Explicitly passed pathId
}) => {
  const { t } = useTranslation('paths');
  const handleContinue = () => {
    if (!pathId) {
      // If pathId isn't explicitly provided, try to infer it from the title
      const inferredPathId = 
        content.title === 'Self-Discovery Journey' ? 'self-discovery' :
        content.title === 'Emotional Intelligence Expedition' ? 'emotional-intelligence' :
        content.title === 'Mindfulness & Present Awareness' ? 'mindfulness-awareness' : 
        'self-discovery'; // Default to self-discovery if none matches
      
      console.log('[MODAL] Inferred pathId:', inferredPathId);
      
      // Call the continue handler with the inferred path
      onContinue(inferredPathId);
    } else {
      console.log('[MODAL] Using explicit pathId:', pathId);
      
      // Call the continue handler with the explicit path
      onContinue(pathId);
    }
  };
  
  return (
    <div className="path-info-modal-overlay" onClick={onClose}>
      {/* Stop propagation to prevent closing when clicking inside the modal */}
      <div className="path-info-modal" onClick={(e) => e.stopPropagation()}>
        <button className="path-info-close" onClick={onClose}>
          <X className="path-info-close-icon" />
        </button>
        
        <div className="path-info-header">
          <h2 className="path-info-title">{content.title}</h2>
        </div>
        
        <div className="path-info-content">
          <p className="path-info-description">{content.description}</p>
          
          {content.benefits && content.benefits.length > 0 && (
            <div className="path-info-section">
              <h3 className="path-info-section-title">{t('pathInfoModal.benefits', 'Benefits')}</h3>
              <ul className="path-info-benefits">
                {content.benefits.map((benefit, index) => (
                  <li key={index} className="path-info-benefit-item">
                    <CheckCircle className="path-info-benefit-icon" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {content.structure && (
            <div className="path-info-section">
              <h3 className="path-info-section-title">{t('pathInfoModal.journeyStructure', 'Journey Structure')}</h3>
              <p className="path-info-structure">{content.structure}</p>
            </div>
          )}
        </div>
        
        {/* Show action button */}
        <div className="path-info-actions">
          <button 
            className="path-info-button primary"
            onClick={handleContinue}
          >
            {t('pathInfoModal.continueJourney', 'Continue Journey')}
            <ArrowRight className="path-info-button-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathInfoModal;