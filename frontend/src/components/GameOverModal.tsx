/**
 * @fileoverview Game over modal that displays final statistics
 * @module components/GameOverModal
 * @description Modal component that is displayed when the player loses
 * all their lives, presenting game statistics and the option to restart.
 */

// src/components/GameOverModal.tsx

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/GameOverModal.css';

/**
 * GameOverModal component properties
 * @interface GameOverModalProps
 */
interface GameOverModalProps {
  /** Statistics of the finished game */
  stats: {
    /** Total number of attempts made */
    attempts: number;
    /** Number of correct answers */
    correct: number;
  };
  /** Callback to restart the game */
  onRestart: () => void;
}

/**
 * Game over modal with statistics
 * 
 * @component
 * @description Displays an overlay modal when the game ends, presenting:
 * - Total number of attempts
 * - Correct answers
 * - Calculated accuracy percentage
 * - Button to restart the game
 * 
 * The modal uses the language context for localized texts.
 * 
 * @example
 * ```tsx
 * <GameOverModal 
 *   stats={{ attempts: 10, correct: 7 }}
 *   onRestart={() => resetGame()}
 * />
 * ```
 * 
 * @param {GameOverModalProps} props - The component properties
 * @returns {JSX.Element} Modal with final game statistics
 */
const GameOverModal: React.FC<GameOverModalProps> = ({ stats, onRestart }) => {
  const { t } = useLanguage();
  const accuracy = stats.attempts > 0 ? Math.round((stats.correct / stats.attempts) * 100) : 0;

  return (
    <aside className="gameover-overlay" role="dialog" aria-modal="true" aria-labelledby="gameover-title">
      <article className="gameover-content">
        <h2 id="gameover-title" className="gameover-title">😵 {t.gameOver}!</h2>
        
        <section className="gameover-stats" aria-label="Game statistics">
          <dl className="gameover-stat">
            <dt className="gameover-stat-label">{t.attempts}</dt>
            <dd className="gameover-stat-value">{stats.attempts}</dd>
          </dl>
          <dl className="gameover-stat">
            <dt className="gameover-stat-label">{t.correct}</dt>
            <dd className="gameover-stat-value success">{stats.correct}</dd>
          </dl>
          <dl className="gameover-stat">
            <dt className="gameover-stat-label">{t.finalScore}</dt>
            <dd className="gameover-stat-value">{accuracy}%</dd>
          </dl>
        </section>

        <button className="gameover-restart-button" onClick={onRestart}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          {t.playAgain}
        </button>
      </article>
    </aside>
  );
};

export default GameOverModal;
