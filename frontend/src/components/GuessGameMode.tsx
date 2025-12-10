/**
 * @file GuessGameMode.tsx
 * @description Modo de juego "Adivina el idioma". Muestra una frase en un idioma aleatorio
 * y el jugador debe hacer clic en un país donde se hable ese idioma.
 * @module components/GuessGameMode
 */

import React, { useState, useCallback } from 'react';
import WorldMap from './WorldMap';
import { checkCountryGuess } from '../services/gameService';
import { countryNameToCode } from '../data/countryCodeMapping';
import { useLanguage } from '../contexts/LanguageContext';
import type { GamePhrase } from '../types';
import '../styles/GuessGameMode.css';

/**
 * Props del componente GuessGameMode
 */
interface GuessGameModeProps {
  /** Frase actual del juego con su idioma */
  currentPhrase: GamePhrase | null;
  /** Indica si se está cargando una nueva frase */
  isLoading: boolean;
  /** Estadísticas actuales del juego */
  stats: { attempts: number; correct: number; lives: number };
  /** Callback ejecutado cuando el jugador hace una adivinanza */
  onCountryGuess: (isCorrect: boolean, countryName: string) => void;
  /** Indica si se debe mostrar la pista (continente) */
  showHint: boolean;
}

const GuessGameMode: React.FC<GuessGameModeProps> = ({ 
  currentPhrase, 
  isLoading,
  stats,
  onCountryGuess,
  showHint
}) => {
  const { t } = useLanguage();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const handleCountryClick = useCallback(async (geo: any) => {
    if (!currentPhrase || isLoading || isValidating) return;

    const countryName = geo.properties.name;
    const countryCode = countryNameToCode[countryName];

    // Validar con el backend
    setIsValidating(true);
    try {
      const result = await checkCountryGuess(currentPhrase.languageCode, countryCode);
      const isCorrect = result.isCorrect;

      if (isCorrect) {
        setFeedback(`${t.correctAnswer} ${countryName} ${t.speaks} ${result.languageName}`);
        setFeedbackType('success');
        
        // Limpiar feedback después de 2 segundos
        setTimeout(() => {
          setFeedback(null);
          setFeedbackType(null);
        }, 2000);
      } else {
        setFeedback(`${t.incorrectAnswer} ${countryName} ${t.doesNotSpeak} ${result.languageName}`);
        setFeedbackType('error');
        
        // Limpiar feedback después de 2 segundos
        setTimeout(() => {
          setFeedback(null);
          setFeedbackType(null);
        }, 2000);
      }

      onCountryGuess(isCorrect, countryName);
    } catch (error) {
      console.error('Error al validar:', error);
      setFeedback(t.validationError);
      setFeedbackType('error');
      
      setTimeout(() => {
        setFeedback(null);
        setFeedbackType(null);
      }, 2000);
    } finally {
      setIsValidating(false);
    }
  }, [currentPhrase, isLoading, isValidating, onCountryGuess, t]);

  return (
    <>
      {/* Estadísticas flotantes sobre el mapa */}
      <div className="game-stats-floating">
        <div className="stat-item-floating stat-attempts">
          <span className="stat-icon">🎯</span>
          <div className="stat-content">
            <span className="stat-label">{t.attempts}</span>
            <span className="stat-value">{stats.attempts}</span>
          </div>
        </div>
        <div className="stat-item-floating stat-correct">
          <span className="stat-icon">✓</span>
          <div className="stat-content">
            <span className="stat-label">{t.correct}</span>
            <span className="stat-value">{stats.correct}</span>
          </div>
        </div>
        <div className="stat-item-floating stat-lives">
          <span className="stat-icon">❤️</span>
          <div className="stat-content">
            <span className="stat-label">{t.lives}</span>
            <span className="stat-value">{stats.lives}</span>
          </div>
        </div>
      </div>

      {/* Feedback visual */}
      {feedback && (
        <div className={`game-feedback ${feedbackType}`}>
          <div className="feedback-content">
            {feedbackType === 'success' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
              </svg>
            )}
            <span>{feedback}</span>
          </div>
        </div>
      )}

      {/* Mapa interactivo */}
      <WorldMap 
        onCountryClick={handleCountryClick} 
        blockedCountries={[]} 
        isGameMode={true}
      />
    </>
  );
};

export default GuessGameMode;
