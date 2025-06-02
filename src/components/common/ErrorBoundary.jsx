// src/components/common/ErrorBoundary.jsx

import React from 'react';
import { ERROR_TYPES } from '../../hooks/useErrorHandler';

/**
 * Error boundary component for React components
 */
class ErrorBoundary extends React.Component {
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
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We're sorry, but there was a problem loading this content.</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };