/**
 * @fileoverview Modal de fin de juego que muestra estadísticas finales
 * @module components/GameOverModal
 * @description Componente modal que se muestra cuando el jugador pierde
 * todas sus vidas, presentando estadísticas de la partida y opción de reiniciar.
 */

// src/components/GameOverModal.tsx

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/GameOverModal.css';

/**
 * Propiedades del componente GameOverModal
 * @interface GameOverModalProps
 */
interface GameOverModalProps {
  /** Estadísticas del juego finalizado */
  stats: {
    /** Número total de intentos realizados */
    attempts: number;
    /** Número de respuestas correctas */
    correct: number;
  };
  /** Callback para reiniciar el juego */
  onRestart: () => void;
}

/**
 * Modal de fin de juego con estadísticas
 * 
 * @component
 * @description Muestra un overlay modal cuando el juego termina, presentando:
 * - Número total de intentos
 * - Respuestas correctas
 * - Porcentaje de precisión calculado
 * - Botón para reiniciar el juego
 * 
 * El modal utiliza el contexto de idioma para textos localizados.
 * 
 * @example
 * ```tsx
 * <GameOverModal 
 *   stats={{ attempts: 10, correct: 7 }}
 *   onRestart={() => resetGame()}
 * />
 * ```
 * 
 * @param {GameOverModalProps} props - Las propiedades del componente
 * @returns {JSX.Element} Modal con estadísticas finales del juego
 */
const GameOverModal: React.FC<GameOverModalProps> = ({ stats, onRestart }) => {
  const { t } = useLanguage();
  const accuracy = stats.attempts > 0 ? Math.round((stats.correct / stats.attempts) * 100) : 0;

  return (
    <div className="gameover-overlay">
      <div className="gameover-content">
        <div className="gameover-title">😵 {t.gameOver}!</div>
        
        <div className="gameover-stats">
          <div className="gameover-stat">
            <span className="gameover-stat-label">{t.attempts}</span>
            <span className="gameover-stat-value">{stats.attempts}</span>
          </div>
          <div className="gameover-stat">
            <span className="gameover-stat-label">{t.correct}</span>
            <span className="gameover-stat-value success">{stats.correct}</span>
          </div>
          <div className="gameover-stat">
            <span className="gameover-stat-label">{t.finalScore}</span>
            <span className="gameover-stat-value">{accuracy}%</span>
          </div>
        </div>

        <button className="gameover-restart-button" onClick={onRestart}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          {t.playAgain}
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
