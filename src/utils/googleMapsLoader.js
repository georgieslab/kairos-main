// src/utils/googleMapsLoader.js

// This utility helps load the Google Maps API script only once
// and provides a way to know when it's ready

// Google Maps API Key - Using the same key that works in SignUpScreen.jsx
const GOOGLE_MAPS_API_KEY = 'AIzaSyBrXIv6K7Uto7fwe8MuzgRM_79W5WXsRM8';

// Track loading state
let isLoading = false;
let isLoaded = false;

// List of callbacks to run when the API is loaded
const callbacks = [];

/**
 * Load the Google Maps API script if not already loaded
 * @param {Function} callback - Function to call when script is loaded
 * @returns {Promise} - Promise that resolves when the API is loaded
 */
export const loadGoogleMapsApi = (callback) => {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (isLoaded && window.google && window.google.maps) {
      if (callback) callback();
      resolve();
      return;
    }
    
    // Add to callbacks list if provided
    if (callback) {
      callbacks.push(callback);
    }
    
    // Add promise resolver to callbacks
    callbacks.push(resolve);
    
    // If already loading, wait for it to complete
    if (isLoading) {
      return;
    }
    
    // Start loading
    isLoading = true;
    
    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    // Set callback when script is loaded
    script.onload = () => {
      console.log('Google Maps API loaded successfully');
      isLoaded = true;
      isLoading = false;
      
      // Execute all callbacks
      callbacks.forEach(cb => {
        if (typeof cb === 'function') {
          cb();
        }
      });
      
      // Clear callbacks
      callbacks.length = 0;
    };
    
    // Handle errors
    script.onerror = (error) => {
      console.error('Error loading Google Maps API', error);
      isLoading = false;
      
      // Reject all promises
      callbacks.forEach(cb => {
        if (cb instanceof Function && cb.name === 'resolver') {
          reject(new Error('Failed to load Google Maps API'));
        }
      });
      
      // Clear callbacks
      callbacks.length = 0;
    };
    
    // Add script to document
    document.head.appendChild(script);
  });
};

/**
 * Initialize the Places Autocomplete widget on an input element
 * @param {HTMLElement} inputElement - The input element to attach autocomplete to
 * @param {Object} options - Options for the autocomplete
 * @param {Function} onPlaceChanged - Callback when a place is selected
 * @returns {Promise<Object>} - Promise resolving to the autocomplete object
 */
export const initPlacesAutocomplete = async (inputElement, options = {}, onPlaceChanged = null) => {
  if (!inputElement) {
    throw new Error('Input element is required for Places Autocomplete');
  }
  
  // Default options for city search
  const defaultOptions = {
    types: ['(cities)'],
    fields: ['address_components', 'formatted_address', 'geometry', 'name']
  };
  
  // Merge options
  const autocompleteOptions = {
    ...defaultOptions,
    ...options
  };
  
  // Make sure Google Maps API is loaded
  await loadGoogleMapsApi();
  
  // Create autocomplete
  const autocomplete = new window.google.maps.places.Autocomplete(
    inputElement,
    autocompleteOptions
  );
  
  // Add place changed listener if callback provided
  if (onPlaceChanged) {
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      onPlaceChanged(place);
    });
  }
  
  return autocomplete;
};

/**
 * Extract city name from Google Places result
 * @param {Object} place - The place object from Google Places API
 * @returns {string} - The city name
 */
export const extractCityFromPlace = (place) => {
  if (!place || !place.address_components) {
    return place?.formatted_address || place?.name || '';
  }
  
  // Find the city component
  const cityComponent = place.address_components.find(
    component => component.types.includes('locality')
  );
  
  // If found, return the long name
  if (cityComponent) {
    return cityComponent.long_name;
  }
  
  // Fallbacks if locality not found
  const subLocalityComponent = place.address_components.find(
    component => component.types.includes('sublocality')
  );
  
  if (subLocalityComponent) {
    return subLocalityComponent.long_name;
  }
  
  // Administrative area fallback
  const adminAreaComponent = place.address_components.find(
    component => component.types.includes('administrative_area_level_1')
  );
  
  if (adminAreaComponent) {
    return adminAreaComponent.long_name;
  }
  
  // Last resort fallback
  return place.formatted_address || place.name || '';
};

export default {
  loadGoogleMapsApi,
  initPlacesAutocomplete,
  extractCityFromPlace
};