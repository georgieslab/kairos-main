import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kairos.journal',
  appName: 'Καιρός Smart Journal',
  webDir: 'dist', // Change this to match your actual build directory
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0f172a",
      showSpinner: false,
      androidSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      overlaysWebView: true,
      style: 'dark',
      backgroundColor: '#0f172a'
    },
    Camera: {
      permissions: ['camera', 'photos']
    },
    NFC: {
      // Enable NFC tag reading/writing
      alertMessage: 'Hold phone near NFC tag',
      invalidateAfterFirstRead: false,
    },
    Permissions: {
      camera: "This app uses the camera to capture journal entries.",
      microphone: "This app uses the microphone to record voice journal entries for analysis and transcription.",
      storage: "This app needs storage access to save your journal entries and media.",
      notifications: "We'll notify you about your journal reminders and insights.",
      nfc: "This app uses NFC to quickly scan and register your Καιρός Smart Journal."
    },
    // Disable web fetch interception to let the WebView talk directly to Firebase services.
    // The Capacitor HTTP native interceptor can cause '/_capacitor_http_interceptor_' proxy errors
    // if the native bridge isn't available at startup. Disable it to remove ERR_CONNECTION_REFUSED.
    CapacitorHttp: {
      enabled: false
    },
    Network: {
      displayNetworkAlert: true
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    // Enable edge-to-edge and hide navigation bar
    backgroundColor: '#0f172a',
    // Additional immersive mode settings will be in MainActivity.java
  }
};

export default config;
