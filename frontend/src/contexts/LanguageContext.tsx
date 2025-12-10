/**
 * @file LanguageContext.tsx
 * @description Context de React para manejo de idioma de la interfaz (i18n).
 * Proporciona funcionalidad de cambio de idioma y traducciones a toda la aplicación.
 * @module contexts/LanguageContext
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Translations, getTranslation } from '../i18n/translations';

/**
 * Clave de localStorage para persistir el idioma seleccionado
 * @constant
 */
const STORAGE_KEY_LANGUAGE = 'transkarte_language';

/**
 * Tipo del contexto de idioma
 */
interface LanguageContextType {
  /** Idioma actual ('es' o 'en') */
  language: Language;
  /** Función para cambiar el idioma */
  setLanguage: (lang: Language) => void;
  /** Objeto con todas las traducciones del idioma actual */
  t: Translations;
}

/**
 * Contexto de idioma
 */
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Props del proveedor de idioma
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
