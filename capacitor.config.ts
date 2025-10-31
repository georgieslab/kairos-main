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
    Camera: {
      permissions: ['camera', 'photos']
    },
    Permissions: {
      camera: "This app uses the camera to capture journal entries.",
      microphone: "This app uses the microphone to record voice journal entries for analysis and transcription."
    },
    CapacitorHttp: {
      enabled: true
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;
