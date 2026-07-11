import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n/config'
import { AuthProvider } from './contexts/AuthContext'
import { setupNetworkMonitoring } from './utils/networkUtils';
// Add this import for our new navigation context
import { NavigationProvider } from './contexts/NavigationContext'

// Import and initialize the API cache service BEFORE any components render
import apiCacheService from './services/apiCacheService.js'

// Make the cache service globally available
window.apiCacheService = apiCacheService;

// Initialize network monitoring
setupNetworkMonitoring().then(capabilities => {
    console.log('🌐 Initial network state:', capabilities);
});

// Log that cache service is initialized
console.log('API cache service initialized:', !!window.apiCacheService);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      {/* Add NavigationProvider between AuthProvider and App */}
      <NavigationProvider>
        <App />
      </NavigationProvider>
    </AuthProvider>
  </React.StrictMode>,
)