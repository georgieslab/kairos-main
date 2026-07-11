// src/components/common/LanguageSwitcher.jsx
// Apple Spatial Glass language toggle – mirrors ThemeSwitcher's pill/thumb pattern

import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/components/themeSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const isGerman = i18n.resolvedLanguage === 'de';

  return (
    <button
      className={`liquid-theme-switch lang-switch ${isGerman ? 'active' : ''}`}
      onClick={() => i18n.changeLanguage(isGerman ? 'en' : 'de')}
      aria-label={isGerman ? 'Switch to English' : 'Auf Deutsch wechseln'}
    >
      <div className="glass-thumb lang-thumb">
        {isGerman ? 'DE' : 'EN'}
      </div>
    </button>
  );
};

export default LanguageSwitcher;
