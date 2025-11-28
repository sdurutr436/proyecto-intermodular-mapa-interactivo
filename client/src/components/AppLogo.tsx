// client/src/components/AppLogo.tsx
// Componente reutilizable del logo de Transkarte
// Basado en el logo original del header de la aplicación

import React from 'react';
import '../styles/AppLogo.css';

interface AppLogoProps {
  size?: 'small' | 'medium' | 'large';
  showTitle?: boolean;
  className?: string;
  gradientId?: string; // Para evitar conflictos de ID en SVG
}

/**
 * Componente de Logo de la aplicación Transkarte
 * Réplica exacta del logo original del header
 * 
 * @param size - Tamaño del logo: 'small' (36px header), 'medium' (50px), 'large' (80px landing)
 * @param showTitle - Si debe mostrar el título "Transkarte" al lado/debajo del logo
 * @param className - Clases CSS adicionales
 * @param gradientId - ID único para los gradientes SVG (útil cuando hay múltiples logos)
 */
const AppLogo: React.FC<AppLogoProps> = ({ 
  size = 'medium', 
  showTitle = false,
  className = '',
  gradientId = 'default'
}) => {
  // Tamaños del globo según el prop (basado en el original: 36px para header)
  const globeSizes = {
    small: 36,   // Header original
    medium: 50,
    large: 80,   // Landing page
  };

  const globeSize = globeSizes[size];
  
  // IDs únicos para los gradientes (evita conflictos cuando hay múltiples logos)
  const gradientIdMain = `globeGradient-${gradientId}`;
  const shineIdMain = `globeShine-${gradientId}`;

  return (
    <div className={`logo-container app-logo app-logo--${size} ${className}`}>
      <div className="logo-wrapper">
        {/* Globo terráqueo SVG - Exactamente igual al original del header */}
        <svg 
          className="logo-globe" 
          width={globeSize} 
          height={globeSize} 
          viewBox="0 0 100 100" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={gradientIdMain} x1="30%" y1="20%" x2="70%" y2="80%">
              <stop offset="0%" style={{ stopColor: '#5BA4E0', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#4A8FCC', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
            </linearGradient>
            <radialGradient id={shineIdMain} cx="35%" cy="35%">
              <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.5 }} />
              <stop offset="50%" style={{ stopColor: '#ffffff', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
            </radialGradient>
          </defs>
          
          {/* Sombra del globo */}
          <ellipse cx="50" cy="90" rx="38" ry="6" fill="#000000" opacity="0.15"/>
          
          {/* Círculo principal del globo */}
          <circle cx="50" cy="50" r="44" fill={`url(#${gradientIdMain})`} stroke="#2c5aa0" strokeWidth="2.5"/>
          
          {/* Líneas de latitud con diferentes grosores */}
          <ellipse cx="50" cy="50" rx="44" ry="12" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.7"/>
          <ellipse cx="50" cy="50" rx="44" ry="26" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5"/>
          <ellipse cx="50" cy="50" rx="44" ry="38" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.3"/>
          
          {/* Línea del ecuador - más prominente */}
          <line x1="6" y1="50" x2="94" y2="50" stroke="#ffffff" strokeWidth="2.2" opacity="0.85" strokeLinecap="round"/>
          
          {/* Líneas de longitud */}
          <ellipse cx="50" cy="50" rx="12" ry="44" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.7"/>
          <ellipse cx="50" cy="50" rx="26" ry="44" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5"/>
          <ellipse cx="50" cy="50" rx="38" ry="44" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.3"/>
          
          {/* Meridiano principal */}
          <line x1="50" y1="6" x2="50" y2="94" stroke="#ffffff" strokeWidth="2.2" opacity="0.85" strokeLinecap="round"/>
          
          {/* Continentes más detallados */}
          {/* América */}
          <path d="M 28 30 Q 30 25, 32 28 L 34 26 Q 36 28, 35 32 L 37 35 Q 38 38, 36 40 L 35 45 Q 33 48, 31 50 L 29 55 Q 27 58, 25 55 L 24 50 Q 23 45, 25 42 L 26 38 Q 27 33, 28 30 Z" 
                fill="#4CAF7E" opacity="0.85" stroke="#2d8659" strokeWidth="0.5"/>
          {/* Europa/África */}
          <path d="M 48 25 L 52 24 Q 55 25, 56 28 L 58 30 L 60 33 Q 61 36, 59 38 L 58 42 Q 56 45, 54 47 L 52 52 Q 51 56, 53 59 L 55 63 Q 56 67, 54 70 L 52 73 Q 50 75, 48 72 L 47 68 Q 46 64, 48 61 L 49 56 Q 50 52, 48 49 L 46 45 Q 45 41, 47 38 L 48 33 Q 49 28, 48 25 Z" 
                fill="#E86B5C" opacity="0.85" stroke="#c14a3f" strokeWidth="0.5"/>
          {/* Asia */}
          <path d="M 65 28 L 68 27 Q 71 28, 72 31 L 74 35 Q 75 39, 73 42 L 70 46 Q 68 50, 65 48 L 62 45 Q 61 41, 63 38 L 64 33 Q 65 30, 65 28 Z" 
                fill="#F2C957" opacity="0.85" stroke="#d4a83d" strokeWidth="0.5"/>
          {/* Oceanía */}
          <path d="M 70 58 L 72 57 Q 74 58, 73 60 L 72 62 Q 70 63, 69 61 L 70 58 Z" 
                fill="#5983C9" opacity="0.85" stroke="#4267a3" strokeWidth="0.5"/>
          
          {/* Efecto de brillo/reflejo */}
          <circle cx="50" cy="50" r="44" fill={`url(#${shineIdMain})`} pointerEvents="none"/>
          
          {/* Brillo superior */}
          <ellipse cx="38" cy="32" rx="12" ry="8" fill="#ffffff" opacity="0.4" transform="rotate(-25 38 32)"/>
        </svg>
        
        {/* Caracteres flotantes alrededor del globo - Clases originales */}
        <span className="kanji kanji-top">翻</span>
        <span className="kanji kanji-bottom">訳</span>
        <span className="lang-char lang-arabic">ت</span>
        <span className="lang-char lang-russian">П</span>
      </div>
      
      {showTitle && (
        <h1 className="app-title">Transkarte</h1>
      )}
    </div>
  );
};

export default AppLogo;
