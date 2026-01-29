/**
 * @fileoverview "About us" informational modal for Transkarte
 * @module components/AboutModal
 * @description Accessible modal that presents detailed information about
 * the application, its game modes and main features.
 */

// client/src/components/AboutModal.tsx
// "About us" informational modal with application description

import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/AboutModal.css';

/**
 * AboutModal component properties
 * @interface AboutModalProps
 */
interface AboutModalProps {
  /** Controls whether the modal is visible */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Indicates if dark mode is active */
  isDarkMode: boolean;
}

/**
 * "About us" informational modal
 * 
 * @component
 * @description Accessible modal that displays information about Transkarte:
 * - General description of the application
 * - The three available game modes
 * - Special features (dark mode, interactive map, etc.)
 * 
 * Accessibility features:
 * - Closes with the Escape key
 * - Closes when clicking outside the content
 * - Blocks body scroll when open
 * - Includes appropriate ARIA roles
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
 * @param {AboutModalProps} props - The component properties
 * @returns {JSX.Element | null} Rendered modal or null if closed
 */
const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const { t } = useLanguage();
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Close when clicking on the overlay (outside the content)
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
        {/* Close button */}
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

        {/* Scrollable content */}
        <div className="about-modal-scroll">
          {/* Header */}
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

          {/* Main description */}
          <section className="about-modal-section">
            <p className="about-modal-intro">
              <strong>Transkarte</strong> {t.aboutIntro}
            </p>
          </section>

          {/* Game modes */}
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

          {/* Features */}
          <section className="about-modal-section">
            <h3 className="about-modal-section-title">
              <span className="section-icon">✨</span>
              {t.features}
            </h3>
            <div className="about-features-grid">
              <div className="about-feature">
                <span className="feature-icon">🌙</span>
                <span>Dark mode</span>
              </div>
              <div className="about-feature">
                <span className="feature-icon">🗺️</span>
                <span>Interactive map</span>
              </div>
              <div className="about-feature">
                <span className="feature-icon">🔍</span>
                <span>Advanced zoom</span>
              </div>
              <div className="about-feature">
                <span className="feature-icon">💾</span>
                <span>Saves preferences</span>
              </div>
            </div>
          </section>

          {/* Modal footer */}
          <footer className="about-modal-footer">
            <p>Developed with ❤️ for language learning</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
