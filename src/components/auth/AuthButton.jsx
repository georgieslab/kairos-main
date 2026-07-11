// src/components/auth/AuthButton.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Github, Chrome } from 'lucide-react';

const AuthButton = ({ provider, onClick, isLoading }) => {
  const { t } = useTranslation('auth');

  const getProviderIcon = () => {
    switch (provider) {
      case 'email':
        return <Mail className="w-5 h-5" />;
      case 'google':
        return <Chrome className="w-5 h-5" />;
      case 'github':
        return <Github className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      return t('authButton.loading', 'Loading...');
    }

    switch (provider) {
      case 'email':
        return t('authButton.continueWithEmail', 'Continue with Email');
      case 'google':
        return t('authButton.continueWithGoogle', 'Continue with Google');
      case 'github':
        return t('authButton.continueWithGithub', 'Continue with GitHub');
      default:
        return t('authButton.continue', 'Continue');
    }
  };

  const getButtonClass = () => {
    const baseClass = 'flex items-center justify-center w-full py-3 px-4 rounded-lg transition-all duration-300 mb-3 font-medium';
    
    if (isLoading) {
      return `${baseClass} opacity-70 cursor-not-allowed`;
    }
    
    switch (provider) {
      case 'email':
        return `${baseClass} bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-md hover:shadow-lg`;
      case 'google':
        return `${baseClass} bg-white text-gray-800 hover:bg-gray-100 border border-gray-300 shadow-md hover:shadow-lg`;
      case 'github':
        return `${baseClass} bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 shadow-md hover:shadow-lg`;
      default:
        return baseClass;
    }
  };

  return (
    <button
      className={getButtonClass()}
      onClick={onClick}
      disabled={isLoading}
    >
      <span className="mr-3">
        {getProviderIcon()}
      </span>
      <span className="font-medium">{getButtonText()}</span>
      {isLoading && (
        <span className="ml-3">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
    </button>
  );
};

export default AuthButton;