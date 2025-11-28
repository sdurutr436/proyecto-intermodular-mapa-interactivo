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
import '../styles/LandingPage.css';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Países europeos y parte de Asia para el mapa de fondo
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

interface IconProps {
  className?: string;
  size?: number;
  fallbackEmoji?: string;
}

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

// Mapeo de iconos por ID de modo
const MODE_ICONS: Record<string, React.FC<IconProps>> = {
  translation: LanguageIcon,
  guess: GlobeQuestionIcon,
};

// Emojis de fallback por ID de modo
const MODE_FALLBACK_EMOJIS: Record<string, string> = {
  translation: '🌍',
  guess: '🎯',
};

// ============================================
// CONFIGURACIÓN DE MODOS DE JUEGO
// ============================================

interface GameMode {
  id: string;
  name: string;
  description: string;
  available: boolean;
}

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
  // Añade nuevos modos aquí fácilmente:
  // {
  //   id: 'flags',
  //   name: 'Banderas del Mundo',
  //   description: 'Identifica países por sus banderas',
  //   available: false,
  // },
];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

interface LandingPageProps {
  onStart: (mode: 'translation' | 'guess') => void;
  isDarkMode: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, isDarkMode }) => {
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

      {/* Botón "Sobre nosotros" en esquina superior derecha de la VENTANA */}
      <button 
        className="landing-about-button"
        onClick={() => setShowAboutModal(true)}
        title="Sobre nosotros"
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
        <span>Sobre nosotros</span>
      </button>

      {/* Contenido principal en 3 filas */}
      <div className="landing-content">
        {/* Fila 1: Logo y título */}
        <header className="landing-header">
          {/* Logo reutilizable */}
          <AppLogo size="large" showTitle gradientId="landing" />
        </header>

        {/* Fila 2: Descripción */}
        <section className="landing-description">
          <p>Explora el mundo a través de los idiomas. Traduce, aprende y juega.</p>
        </section>

        {/* Fila 3: Botones de acción */}
        <footer className="landing-actions">
          <button 
            className="landing-start-button"
            onClick={() => onStart('translation')}
          >
            Empezar
          </button>

          <div className="landing-modes-container">
            <p className="modes-label">O elige un modo:</p>
            <div className="landing-modes-grid">
              {availableModes.map(mode => (
                <button
                  key={mode.id}
                  className="landing-mode-button"
                  onClick={() => onStart(mode.id as 'translation' | 'guess')}
                  title={mode.description}
                >
                  <span className="mode-icon">{renderModeIcon(mode.id)}</span>
                  <span className="mode-name">{mode.name}</span>
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
