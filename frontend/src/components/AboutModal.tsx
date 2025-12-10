/**
 * @fileoverview Modal informativo "Sobre nosotros" de Transkarte
 * @module components/AboutModal
 * @description Modal accesible que presenta información detallada sobre
 * la aplicación, sus modos de juego y características principales.
 */

// client/src/components/AboutModal.tsx
// Modal de información "Sobre nosotros" con descripción de la aplicación

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/AboutModal.css';

/**
 * Propiedades del componente AboutModal
 * @interface AboutModalProps
 */
interface AboutModalProps {
  /** Controla si el modal está visible */
  isOpen: boolean;
  /** Callback para cerrar el modal */
  onClose: () => void;
  /** Indica si el modo oscuro está activo */
  isDarkMode: boolean;
}

/**
 * Modal informativo "Sobre nosotros"
 * 
 * @component
 * @description Modal accesible que muestra información sobre Transkarte:
 * - Descripción general de la aplicación
 * - Los tres modos de juego disponibles
 * - Características especiales (modo oscuro, mapa interactivo, etc.)
 * 
 * Características de accesibilidad:
 * - Se cierra con la tecla Escape
 * - Se cierra al hacer clic fuera del contenido
 * - Bloquea el scroll del body cuando está abierto
 * - Incluye roles ARIA apropiados
 * 
 * @example
 * ```tsx
 * <AboutModal 
 *   isOpen={showAbout}
 *   onClose={() => setShowAbout(false)}
 *   isDarkMode={isDarkMode}
 * />
 * ```
 * 
 * @param {AboutModalProps} props - Las propiedades del componente
 * @returns {JSX.Element | null} Modal renderizado o null si está cerrado
 */
const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const { t } = useLanguage();
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Cerrar al hacer clic en el overlay (fuera del contenido)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`about-modal-overlay ${isDarkMode ? 'dark' : 'light'}`}
      onClick={handleOverlayClick}
    >
      <div 
        className="about-modal-content"
        ref={modalContentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-title"
      >
        {/* Botón de cerrar */}
        <button 
          className="about-modal-close"
          onClick={onClose}
          aria-label={t.closeModal}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Contenido scrolleable */}
        <div className="about-modal-scroll">
          {/* Cabecera */}
          <header className="about-modal-header">
            <div className="about-modal-logo">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h2 id="about-modal-title" className="about-modal-title">{t.aboutTitle}</h2>
          </header>

          {/* Descripción principal */}
          <section className="about-modal-section">
            <p className="about-modal-intro">
              <strong>Transkarte</strong> {t.aboutIntro}
            </p>
          </section>

          {/* Modos de juego */}
          <section className="about-modal-section">
            <h3 className="about-modal-section-title">
              <span className="section-icon">🎮</span>
              {t.gameModes}
            </h3>
            
            <div className="about-modal-modes">
              <div className="about-mode-card">
                <div className="about-mode-icon">🌍</div>
                <div className="about-mode-content">
                  <h4>{t.translationModeTitle}</h4>
                  <p>{t.translationModeDesc}</p>
                </div>
              </div>

              <div className="about-mode-card">
                <div className="about-mode-icon">🎯</div>
                <div className="about-mode-content">
                  <h4>{t.guessLanguageModeTitle}</h4>
                  <p>{t.guessLanguageModeDesc}</p>
                </div>
              </div>

              <div className="about-mode-card">
                <div className="about-mode-icon">🚩</div>
                <div className="about-mode-content">
                  <h4>{t.guessFlagModeTitle}</h4>
                  <p>{t.guessFlagModeDesc}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Características */}
          <section className="about-modal-section">
            <h3 className="about-modal-section-title">
              <span className="section-icon">✨</span>
              {t.features}
            </h3>
            <div className="about-features-grid">
              <div className="about-feature">
                <span className="feature-icon">🌙</span>
                <span>Modo oscuro</span>
              </div>
              <div className="about-feature">
                <span className="feature-icon">🗺️</span>
                <span>Mapa interactivo</span>
              </div>
              <div className="about-feature">
                <span className="feature-icon">🔍</span>
                <span>Zoom avanzado</span>
              </div>
              <div className="about-feature">
                <span className="feature-icon">💾</span>
                <span>Guarda preferencias</span>
              </div>
            </div>
          </section>

          {/* Footer del modal */}
          <footer className="about-modal-footer">
            <p>Desarrollado con ❤️ para el aprendizaje de idiomas</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
