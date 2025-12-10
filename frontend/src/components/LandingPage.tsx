/**
 * @fileoverview Página de inicio/landing de la aplicación Transkarte
 * @module components/LandingPage
 * @description Componente principal de la pantalla de inicio que muestra el mapa
 * de fondo con efecto de iluminación de países, selector de idioma, información
 * del proyecto y botones para iniciar los diferentes modos de juego.
 */

// client/src/components/LandingPage.tsx

import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps';
import { countryColors } from '../data/countryColors';
import AppLogo from './AppLogo';
import AboutModal from './AboutModal';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/LandingPage.css';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/**
 * Lista de países europeos y asiáticos occidentales para mostrar en el mapa de fondo
 * @constant {string[]}
 */
const displayCountries = [
  // Europa
  'Portugal', 'Spain', 'France', 'United Kingdom', 'Ireland', 'Belgium',
  'Netherlands', 'Germany', 'Denmark', 'Norway', 'Sweden', 'Finland',
  'Estonia', 'Latvia', 'Lithuania', 'Poland', 'Czech Republic', 'Austria',
  'Switzerland', 'Italy', 'Slovenia', 'Croatia', 'Bosnia and Herzegovina',
  'Serbia', 'Montenegro', 'Albania', 'North Macedonia', 'Greece', 'Bulgaria',
  'Romania', 'Hungary', 'Slovakia', 'Ukraine', 'Belarus', 'Moldova',
  'Iceland', 'Luxembourg',
  // Asia occidental y central (visible en el mapa)
  'Turkey', 'Georgia', 'Armenia', 'Azerbaijan', 'Russia', 'Kazakhstan',
  'Iran', 'Iraq', 'Syria', 'Saudi Arabia', 'Egypt', 'Libya', 'Tunisia',
  'Algeria', 'Morocco'
];

// ============================================
// ICONOS SVG - Componentes reutilizables
// ============================================

/**
 * Propiedades comunes para los componentes de iconos SVG
 * @interface IconProps
 */
interface IconProps {
  /** Clase CSS adicional para el icono */
  className?: string;
  /** Tamaño del icono en píxeles */
  size?: number;
  /** Emoji alternativo si el SVG falla */
  fallbackEmoji?: string;
}

/**
 * Icono de idiomas/traducción con texto "A" estilizado
 * @component
 * @param {IconProps} props - Propiedades del icono
 * @returns {JSX.Element} Icono SVG o emoji de respaldo
 */
// Icono de Idiomas/Traducción
const LanguageIcon: React.FC<IconProps> = ({ className = '', size = 24, fallbackEmoji = '🌍' }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <span className={`icon-fallback ${className}`} role="img" aria-label="languages">{fallbackEmoji}</span>;
  }

  return (
    <svg 
      className={className}
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      onError={() => setHasError(true)}
    >
      <path d="M5 8l6 6" />
      <path d="M4 14l6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="M22 22l-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
  );
};

/**
 * Icono de globo con signo de interrogación para el modo de adivinar idioma
 * @component
 * @param {IconProps} props - Propiedades del icono
 * @returns {JSX.Element} Icono SVG o emoji de respaldo
 */
// Icono de Globo con interrogación - para Adivinar idioma
const GlobeQuestionIcon: React.FC<IconProps> = ({ className = '', size = 24, fallbackEmoji = '🎯' }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <span className={`icon-fallback ${className}`} role="img" aria-label="guess-language">{fallbackEmoji}</span>;
  }

  return (
    <svg 
      className={className}
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      onError={() => setHasError(true)}
    >
      {/* Globo terráqueo - ligeramente desplazado a la izquierda y abajo */}
      <circle cx="10" cy="13" r="9" />
      <path d="M1 13h18" />
      <path d="M10 4a13.8 13.8 0 0 1 3.6 9 13.8 13.8 0 0 1-3.6 9 13.8 13.8 0 0 1-3.6-9 13.8 13.8 0 0 1 3.6-9z" />
      {/* Signo de interrogación grande en esquina superior derecha - sin fondo */}
      <text 
        x="20" 
        y="9" 
        textAnchor="middle" 
        fontSize="12" 
        fill="currentColor" 
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >?</text>
    </svg>
  );
};

/**
 * Icono de bandera ondeante para el modo de adivinar banderas
 * @component
 * @param {IconProps} props - Propiedades del icono
 * @returns {JSX.Element} Icono SVG o emoji de respaldo
 */
// Icono de Bandera - para Adivinar Bandera
const FlagIcon: React.FC<IconProps> = ({ className = '', size = 24, fallbackEmoji = '🚩' }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <span className={`icon-fallback ${className}`} role="img" aria-label="flag">{fallbackEmoji}</span>;
  }

  return (
    <svg 
      className={className}
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      onError={() => setHasError(true)}
    >
      {/* Mástil de la bandera */}
      <path d="M4 22V4" />
      {/* Bandera ondeante */}
      <path d="M4 4h12a2 2 0 0 1 0 4c-2 0-4 2-4 2H4" />
      <path d="M4 10h8c0 0 2 2 4 2a2 2 0 0 1 0 4H4" />
    </svg>
  );
};

/**
 * Icono de globo terráqueo genérico (usado como fallback)
 * @component
 * @param {IconProps} props - Propiedades del icono
 * @returns {JSX.Element} Icono SVG o emoji de respaldo
 */
// Icono de Globo genérico (fallback)
const GlobeIcon: React.FC<IconProps> = ({ className = '', size = 24, fallbackEmoji = '🌐' }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <span className={`icon-fallback ${className}`} role="img" aria-label="globe">{fallbackEmoji}</span>;
  }

  return (
    <svg 
      className={className}
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      onError={() => setHasError(true)}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
};

/**
 * Mapeo de iconos SVG por ID de modo de juego
 * @constant {Record<string, React.FC<IconProps>>}
 */
// Mapeo de iconos por ID de modo
const MODE_ICONS: Record<string, React.FC<IconProps>> = {
  translation: LanguageIcon,
  guess: GlobeQuestionIcon,
  flag: FlagIcon,
};

// Emojis de fallback por ID de modo
const MODE_FALLBACK_EMOJIS: Record<string, string> = {
  translation: '🌍',
  guess: '🎯',
  flag: '🚩',
};

// ============================================
// CONFIGURACIÓN DE MODOS DE JUEGO
// ============================================

/**
 * Representa un modo de juego disponible en la aplicación
 * @interface GameMode
 */
interface GameMode {
  /** Identificador único del modo */
  id: string;
  /** Nombre visible del modo */
  name: string;
  /** Descripción breve del modo */
  description: string;
  /** Indica si el modo está disponible para jugar */
  available: boolean;
}

/**
 * Configuración de todos los modos de juego de la aplicación
 * @constant {GameMode[]}
 */
const GAME_MODES: GameMode[] = [
  {
    id: 'translation',
    name: 'Traducción',
    description: 'Traduce palabras a diferentes idiomas',
    available: true,
  },
  {
    id: 'guess',
    name: 'Adivina el Idioma',
    description: 'Adivina de qué idioma es la frase',
    available: true,
  },
  {
    id: 'flag',
    name: 'Adivinar la Bandera',
    description: 'Adivina a qué país corresponde la bandera',
    available: true,
  },
  // Añade nuevos modos aquí fácilmente:
  // {
  //   id: 'capitals',
  //   name: 'Capitales del Mundo',
  //   description: 'Identifica países por sus capitales',
  //   available: false,
  // },
];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

/**
 * Propiedades del componente LandingPage
 * @interface LandingPageProps
 */
interface LandingPageProps {
  /** Callback que se ejecuta al seleccionar un modo de juego */
  onStart: (mode: 'translation' | 'guess' | 'flag') => void;
  /** Indica si el modo oscuro está activo */
  isDarkMode: boolean;
}

/**
 * Página de inicio de Transkarte
 * 
 * @component
 * @description Componente principal de la landing page que incluye:
 * - Mapa de fondo con animación de países iluminados (efecto "luces de navidad")
 * - Logo de la aplicación con animaciones
 * - Selector de idioma (español/inglés)
 * - Botón "Sobre nosotros" que abre modal informativo
 * - Botones para seleccionar modo de juego
 * 
 * Utiliza react-simple-maps para renderizar el mapa de Europa y Asia.
 * El efecto de iluminación cambia países aleatoriamente cada 1.8 segundos.
 * 
 * @example
 * ```tsx
 * <LandingPage 
 *   onStart={(mode) => navigateToGame(mode)}
 *   isDarkMode={true}
 * />
 * ```
 * 
 * @param {LandingPageProps} props - Las propiedades del componente
 * @returns {JSX.Element} Página de inicio completa
 */
const LandingPage: React.FC<LandingPageProps> = ({ onStart, isDarkMode }) => {
  const { language, setLanguage, t } = useLanguage();
  
  // Estado para países iluminados con transición suave
  const [illuminatedCountries, setIlluminatedCountries] = useState<Map<string, number>>(new Map());
  const illuminationRef = useRef<Map<string, number>>(new Map());
  
  // Estado para el modal "Sobre nosotros"
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Efecto de iluminación de países tipo "luces de navidad" con transición suave
  useEffect(() => {
    const updateIllumination = () => {
      const newMap = new Map<string, number>();
      
      // Mantener algunos países del ciclo anterior (fade out gradual)
      illuminationRef.current.forEach((opacity, country) => {
        if (opacity > 0.1) {
          newMap.set(country, opacity * 0.7); // Fade out gradual
        }
      });
      
      // Añadir nuevos países iluminados
      const numNewCountries = Math.floor(Math.random() * 3) + 1; // 1-3 países nuevos
      for (let i = 0; i < numNewCountries; i++) {
        const randomIndex = Math.floor(Math.random() * displayCountries.length);
        const country = displayCountries[randomIndex];
        newMap.set(country, 1); // Opacidad completa para nuevos
      }
      
      illuminationRef.current = newMap;
      setIlluminatedCountries(new Map(newMap));
    };

    // Intervalo más lento para transiciones suaves
    const interval = setInterval(updateIllumination, 1800);
    updateIllumination(); // Inicializar

    return () => clearInterval(interval);
  }, []);

  // Memorizar los modos disponibles
  const availableModes = useMemo(() => 
    GAME_MODES.filter(mode => mode.available), 
    []
  );

  // Renderizar icono del modo con fallback
  const renderModeIcon = (modeId: string) => {
    const IconComponent = MODE_ICONS[modeId] || GlobeIcon;
    const fallbackEmoji = MODE_FALLBACK_EMOJIS[modeId] || '🎮';
    
    return (
      <IconComponent 
        className="mode-icon-svg" 
        size={28} 
        fallbackEmoji={fallbackEmoji}
      />
    );
  };

  return (
    <div className={`landing-page ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Fondo con mapa */}
      <div className="landing-background">
        {/* Animación del mar */}
        <div className="sea-animation">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
          <div className="wave wave3"></div>
        </div>

        {/* Mapa de Europa y Asia */}
        <div className="europe-map-container">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 450,
              center: [35, 50],
            }}
            className="europe-map-svg"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies
                  .filter(geo => displayCountries.includes(geo.properties?.name))
                  .map(geo => {
                    const countryName = geo.properties?.name;
                    const illuminationOpacity = illuminatedCountries.get(countryName) || 0;
                    const isIlluminated = illuminationOpacity > 0;
                    const countryColor = countryColors[countryName] || '#667eea';

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        className="europe-country"
                        style={{
                          default: {
                            fill: isIlluminated ? countryColor : 'transparent',
                            fillOpacity: illuminationOpacity,
                            stroke: isDarkMode ? '#6b7a8f' : '#d4a574',
                            strokeWidth: 0.6,
                            transition: 'fill-opacity 1.2s ease-in-out, fill 0.8s ease-in-out',
                          },
                          hover: {
                            fill: isIlluminated ? countryColor : 'transparent',
                            fillOpacity: illuminationOpacity,
                            stroke: isDarkMode ? '#6b7a8f' : '#d4a574',
                            strokeWidth: 0.6,
                          },
                          pressed: {
                            fill: isIlluminated ? countryColor : 'transparent',
                            fillOpacity: illuminationOpacity,
                            stroke: isDarkMode ? '#6b7a8f' : '#d4a574',
                            strokeWidth: 0.6,
                          },
                        }}
                      />
                    );
                  })
              }
            </Geographies>
          </ComposableMap>
        </div>
      </div>

      {/* Capa de desenfoque */}
      <div className="landing-blur-overlay"></div>

      {/* Contenedor de botones superiores (idioma + sobre nosotros) */}
      <div className="landing-top-buttons">
        {/* Selector de idioma */}
        <div className="landing-language-selector">
          <button className="landing-language-indicator">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="landing-language-code">{language.toUpperCase()}</span>
            <svg className="landing-dropdown-icon" width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 8L2 4h8L6 8z" />
            </svg>
          </button>
          <div className="landing-language-dropdown">
            <button 
              className={`landing-language-option ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              <span className="lang-flag">🇬🇧</span>
              <span>English</span>
            </button>
            <button 
              className={`landing-language-option ${language === 'es' ? 'active' : ''}`}
              onClick={() => setLanguage('es')}
            >
              <span className="lang-flag">🇪🇸</span>
              <span>Español</span>
            </button>
          </div>
        </div>

        {/* Botón "Sobre nosotros" */}
        <button 
          className="landing-about-button"
          onClick={() => setShowAboutModal(true)}
          title={t.aboutUs}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>{t.aboutUs}</span>
        </button>
      </div>

      {/* Contenido principal en 3 filas */}
      <div className="landing-content">
        {/* Fila 1: Logo y título */}
        <header className="landing-header">
          {/* Logo reutilizable */}
          <AppLogo size="large" showTitle gradientId="landing" />
        </header>

        {/* Fila 2: Descripción */}
        <section className="landing-description">
          <p>{t.landingDescription}</p>
        </section>

        {/* Fila 3: Botones de acción */}
        <footer className="landing-actions">
          <button 
            className="landing-start-button"
            onClick={() => onStart('translation')}
          >
            <span>{t.startButton}</span>
          </button>

          <div className="landing-modes-container">
            <p className="modes-label">{t.orChooseMode}</p>
            <div className="landing-modes-grid">
              {availableModes.map(mode => (
                <button
                  key={mode.id}
                  className="landing-mode-button"
                  onClick={() => onStart(mode.id as 'translation' | 'guess' | 'flag')}
                  title={mode.id === 'translation' ? t.translationDescription : 
                         mode.id === 'guess' ? t.guessLanguageDescription : 
                         t.guessFlagDescription}
                >
                  <span className="mode-icon">{renderModeIcon(mode.id)}</span>
                  <span className="mode-name">
                    {mode.id === 'translation' ? t.translation : 
                     mode.id === 'guess' ? t.guessLanguage : 
                     t.guessFlag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </footer>
      </div>
      
      {/* Modal "Sobre nosotros" */}
      <AboutModal 
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default LandingPage;
