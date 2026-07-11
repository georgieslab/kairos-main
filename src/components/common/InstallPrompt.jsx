import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Download, Smartphone } from 'lucide-react';
import '../../styles/components/InstallPrompt.css';

const InstallPrompt = () => {
  const { t } = useTranslation('layout');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone 
      || document.referrer.includes('android-app://');
    
    setIsStandalone(isStandaloneMode);

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Don't show if already installed
    if (isStandaloneMode) return;

    // Check if install prompt was dismissed recently
    const dismissedTime = localStorage.getItem('installPromptDismissed');
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) return; // Don't show for 7 days after dismissal
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after user has used app for a bit
      const visitCount = parseInt(localStorage.getItem('visitCount') || '0');
      if (visitCount > 2) {
        setTimeout(() => setShowInstallPrompt(true), 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show custom instructions after a few visits
    if (isIOSDevice && !isStandaloneMode) {
      const visitCount = parseInt(localStorage.getItem('visitCount') || '0');
      if (visitCount > 2) {
        setTimeout(() => setShowInstallPrompt(true), 5000);
      }
    }

    // Track app opens
    const appOpenCount = parseInt(localStorage.getItem('visitCount') || '0') + 1;
    localStorage.setItem('visitCount', appOpenCount.toString());

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  if (!showInstallPrompt || isStandalone) return null;

  // iOS Custom Install Instructions
  if (isIOS) {
    return (
      <div className="install-prompt-overlay">
        <div className="install-prompt ios">
          <button className="dismiss-button" onClick={handleDismiss}>
            <X size={20} />
          </button>
          
          <div className="install-icon">
            <Smartphone size={48} />
          </div>
          
          <h3>{t('installPrompt.title', 'Install Kairos Journal')}</h3>
          <p>{t('installPrompt.iosSubtitle', 'Install this app on your iPhone for the best experience')}</p>

          <div className="ios-instructions">
            <div className="instruction-step">
              <span className="step-number">1</span>
              <span>{t('installPrompt.ios.step1', 'Tap the share button')} <span className="share-icon">⎙</span> {t('installPrompt.ios.step1Suffix', 'in Safari')}</span>
            </div>
            <div className="instruction-step">
              <span className="step-number">2</span>
              <span>{t('installPrompt.ios.step2', 'Scroll down and tap "Add to Home Screen"')}</span>
            </div>
            <div className="instruction-step">
              <span className="step-number">3</span>
              <span>{t('installPrompt.ios.step3', 'Tap "Add" to install')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Android/Desktop Install Prompt
  return (
    <div className="install-prompt-overlay">
      <div className="install-prompt">
        <button className="dismiss-button" onClick={handleDismiss}>
          <X size={20} />
        </button>
        
        <div className="install-icon">
          <img src="/icon-192x192.png" alt={t('installPrompt.iconAlt', 'Kairos')} />
        </div>

        <h3>{t('installPrompt.title', 'Install Kairos Journal')}</h3>
        <p>{t('installPrompt.androidSubtitle', 'Install our app for quick access and offline journaling')}</p>

        <div className="install-benefits">
          <div className="benefit">✓ {t('installPrompt.benefitOffline', 'Works offline')}</div>
          <div className="benefit">✓ {t('installPrompt.benefitQuickAccess', 'Quick access from home screen')}</div>
          <div className="benefit">✓ {t('installPrompt.benefitFullScreen', 'Full screen experience')}</div>
        </div>

        <div className="install-actions">
          <button className="install-button" onClick={handleInstallClick}>
            <Download size={20} />
            {t('installPrompt.installButton', 'Install App')}
          </button>
          <button className="later-button" onClick={handleDismiss}>
            {t('installPrompt.laterButton', 'Maybe Later')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;