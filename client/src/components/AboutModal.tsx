// client/src/components/AboutModal.tsx
// Modal de información "Sobre nosotros" con descripción de la aplicación

import React, { useEffect, useRef } from 'react';
import '../styles/AboutModal.css';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

/**
 * Modal de "Sobre nosotros" que muestra información sobre la aplicación
 * - Se cierra al hacer clic fuera del contenido
 * - Se cierra con el botón X
 * - Contenido scrolleable para futuras expansiones
 */
const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, isDarkMode }) => {
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
          aria-label="Cerrar modal"
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
            <h2 id="about-modal-title" className="about-modal-title">Sobre Transkarte</h2>
          </header>

          {/* Descripción principal */}
          <section className="about-modal-section">
            <p className="about-modal-intro">
              <strong>Transkarte</strong> es una aplicación interactiva que te permite explorar el mundo 
              a través de los idiomas. Combina la geografía con el aprendizaje lingüístico de una manera 
              visual y divertida, haciendo que descubrir nuevos idiomas sea una aventura.
            </p>
          </section>

          {/* Modos de juego */}
          <section className="about-modal-section">
            <h3 className="about-modal-section-title">
              <span className="section-icon">🎮</span>
              Modos de juego
            </h3>
            
            <div className="about-modal-modes">
              <div className="about-mode-card">
                <div className="about-mode-icon">🌍</div>
                <div className="about-mode-content">
                  <h4>Modo Traducción</h4>
                  <p>
                    Escribe cualquier palabra o frase y haz clic en cualquier país del mapa mundial. 
                    La aplicación traducirá tu texto al idioma oficial del país seleccionado, 
                    mostrándote cómo se dice en diferentes partes del mundo.
                  </p>
                  <ul>
                    <li>Traducciones a más de 100 idiomas</li>
                    <li>Visualización geográfica intuitiva</li>
                    <li>Aprende vocabulario explorando el mapa</li>
                  </ul>
                </div>
              </div>

              <div className="about-mode-card">
                <div className="about-mode-icon">🎯</div>
                <div className="about-mode-content">
                  <h4>Modo Adivina el Idioma</h4>
                  <p>
                    Pon a prueba tus conocimientos lingüísticos. Se te mostrará una frase en un idioma 
                    desconocido y deberás identificar en qué país del mundo se habla ese idioma.
                  </p>
                  <ul>
                    <li>Sistema de vidas para mayor emoción</li>
                    <li>Pistas disponibles si te atascas</li>
                    <li>Estadísticas de aciertos e intentos</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Cómo funciona */}
          <section className="about-modal-section">
            <h3 className="about-modal-section-title">
              <span className="section-icon">⚙️</span>
              Cómo funciona
            </h3>
            <ol className="about-modal-steps">
              <li>
                <strong>Elige un modo:</strong> Selecciona entre Traducción o Adivina el Idioma 
                desde el menú desplegable en la esquina superior derecha.
              </li>
              <li>
                <strong>Interactúa con el mapa:</strong> Usa el zoom y arrastra el mapa para 
                explorar diferentes regiones del mundo.
              </li>
              <li>
                <strong>Aprende jugando:</strong> Cada interacción te enseña algo nuevo sobre 
                los idiomas y las culturas del mundo.
              </li>
            </ol>
          </section>

          {/* Características */}
          <section className="about-modal-section">
            <h3 className="about-modal-section-title">
              <span className="section-icon">✨</span>
              Características
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
