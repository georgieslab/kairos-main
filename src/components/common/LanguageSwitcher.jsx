// src/components/common/LanguageSwitcher.jsx
// Apple Spatial Glass language toggle – shares ThemeSwitcher's 56×30 pill and
// sliding glass thumb so it stacks cleanly with ThemeSwitcher and WhatsNew in
// .header-controls. The thumb carries the active language code and advances one
// stop per tap, cycling through SUPPORTED_LANGUAGES.

import React from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../../i18n/config';
import '../../styles/components/themeSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const active = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0];
  const index = Math.max(0, SUPPORTED_LANGUAGES.findIndex((l) => l.code === active));
  const next = SUPPORTED_LANGUAGES[(index + 1) % SUPPORTED_LANGUAGES.length];

  return (
    <button
      className="liquid-theme-switch lang-switch"
      onClick={() => i18n.changeLanguage(next.code)}
      aria-label={`Switch to ${next.label}`}
      title={SUPPORTED_LANGUAGES[index].label}
    >
      <div className={`glass-thumb lang-thumb lang-thumb--${index}`}>
        {SUPPORTED_LANGUAGES[index].short}
      </div>
    </button>
  );
};

export default LanguageSwitcher;
