/**
 * @file GameStats.tsx
 * @description Reusable component to display game statistics.
 * Used by GuessGameMode and FlagGameMode.
 * @module components/shared/GameStats
 */

import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface GameStatsProps {
  attempts: number;
  correct: number;
  lives: number;
}

const GameStats: React.FC<GameStatsProps> = ({ attempts, correct, lives }) => {
  const { t } = useLanguage();

  return (
    <aside className="game-stats-floating" aria-label="Game statistics">
      <article className="stat-item-floating stat-attempts">
        <span className="stat-icon" aria-hidden="true">🎯</span>
        <dl className="stat-content">
          <dt className="stat-label">{t.attempts}</dt>
          <dd className="stat-value">{attempts}</dd>
        </dl>
      </article>
      <article className="stat-item-floating stat-correct">
        <span className="stat-icon" aria-hidden="true">✓</span>
        <dl className="stat-content">
          <dt className="stat-label">{t.correct}</dt>
          <dd className="stat-value">{correct}</dd>
        </dl>
      </article>
      <article className="stat-item-floating stat-lives">
        <span className="stat-icon" aria-hidden="true">❤️</span>
        <dl className="stat-content">
          <dt className="stat-label">{t.lives}</dt>
          <dd className="stat-value">{lives}</dd>
        </dl>
      </article>
    </aside>
  );
};

export default GameStats;
