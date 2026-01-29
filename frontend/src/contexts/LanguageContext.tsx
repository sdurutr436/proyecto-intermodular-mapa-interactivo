/**
 * @file LanguageContext.tsx
 * @description React context for interface language handling (i18n).
 * Provides language switching functionality and translations to the entire application.
 * @module contexts/LanguageContext
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Translations, getTranslation } from '../i18n/translations';

/**
 * localStorage key to persist the selected language
 * @constant
 */
const STORAGE_KEY_LANGUAGE = 'transkarte_language';

/**
 * Language context type
 */
interface LanguageContextType {
  /** Current language ('es' or 'en') */
  language: Language;
  /** Function to change the language */
  setLanguage: (lang: Language) => void;
  /** Object with all translations for the current language */
  t: Translations;
}

/**
 * Language context
 */
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Language provider props
 */
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANGUAGE);
    if (saved === 'es' || saved === 'en') {
      return saved;
    }
    // Default to English
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY_LANGUAGE, lang);
  };

  const t = getTranslation(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
