// src/components/layout/PageLayout.jsx

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import '../../styles/components/pageLayout.css';

const PageLayout = ({ title, children, onBack }) => {
  return (
    <div className="page-container">
      <div className="page-header">
        <button 
          onClick={onBack}
          className="back-button"
        >
          <ArrowLeft className="back-icon" />
          <span>Back</span>
        </button>
        
        <h1 className="page-title">{title}</h1>
      </div>
      
      <div className="page-content">
        {children}
      </div>
      
      <div className="page-footer">
        <p>© 2025 Καιρός. All rights reserved.</p>
      </div>
    </div>
  );
};

export default PageLayout;