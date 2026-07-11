// src/components/layout/PageLayout.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import '../../styles/components/pageLayout.css';

const PageLayout = ({ title, children, onBack }) => {
  const { t: tCommon } = useTranslation('common');

  return (
    <div className="page-container">
      <div className="page-header">
        <button
          onClick={onBack}
          className="back-button"
        >
          <ArrowLeft className="back-icon" />
          <span>{tCommon('back')}</span>
        </button>

        <h1 className="page-title">{title}</h1>
      </div>

      <div className="page-content">
        {children}
      </div>

      <div className="page-footer">
        <p>{tCommon('footerRights')}</p>
      </div>
    </div>
  );
};

export default PageLayout;