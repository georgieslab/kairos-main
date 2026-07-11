// src/components/common/ErrorBoundary.jsx

import React from 'react';
import { withTranslation } from 'react-i18next';
import { ERROR_TYPES } from '../../hooks/useErrorHandler';

/**
 * Error boundary component for React components
 * (class component — uses the withTranslation HOC since hooks aren't available here)
 */
class ErrorBoundaryBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    const analyticsData = {
      type: ERROR_TYPES.GENERAL,
      message: error.message,
      details: errorInfo.componentStack,
      context: 'react-component',
      timestamp: new Date()
    };
    
    // Log to analytics
    console.log('Error logged to analytics:', analyticsData);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    const { t } = this.props;
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>{t('errorBoundary.title', 'Something went wrong')}</h2>
          <p>{t('errorBoundary.message', "We're sorry, but there was a problem loading this content.")}</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            {t('errorBoundary.retry', 'Try again')}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const ErrorBoundary = withTranslation('layout')(ErrorBoundaryBase);

export { ErrorBoundary };