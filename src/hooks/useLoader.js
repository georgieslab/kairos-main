import { useState, useCallback } from 'react';

/**
 * Custom hook for managing loading state and providing loader control functions
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.initialState - Initial loading state (default: false)
 * @param {number} options.defaultDuration - Default duration in ms for showLoader (default: 0, no auto-hide)
 * @returns {Object} - Loader state and control functions
 */
const useLoader = ({ initialState = false, defaultDuration = 0 } = {}) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loaderProps, setLoaderProps] = useState({
    size: 'medium',
    fullScreen: true,
    autoHide: defaultDuration,
    useOpacity: true
  });

  // Show loader with optional configuration
  const showLoader = useCallback((props = {}) => {
    setLoaderProps(prevProps => ({
      ...prevProps,
      ...props,
      autoHide: props.duration || props.autoHide || defaultDuration
    }));
    setIsLoading(true);
    
    // Return a promise that resolves when loader would hide
    // useful for chaining operations after loader is done
    return new Promise(resolve => {
      const duration = props.duration || props.autoHide || defaultDuration;
      if (duration > 0) {
        setTimeout(resolve, duration + 300); // Add transition time
      }
    });
  }, [defaultDuration]);

  // Hide loader
  const hideLoader = useCallback(() => {
    setIsLoading(false);
    
    // Return a promise that resolves after transition completes
    return new Promise(resolve => {
      setTimeout(resolve, 500); // Match transition time in CSS
    });
  }, []);

  // Update loader props without changing visibility
  const updateLoaderProps = useCallback((props = {}) => {
    setLoaderProps(prevProps => ({
      ...prevProps,
      ...props
    }));
  }, []);

  return {
    isLoading,
    loaderProps,
    showLoader,
    hideLoader,
    updateLoaderProps
  };
};

export default useLoader;