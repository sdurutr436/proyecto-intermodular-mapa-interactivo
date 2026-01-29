/**
 * @file GuessGameMode.tsx
 * @description "Guess the language" game mode. Shows a phrase in a random language
 * and the player must click on a country where that language is spoken.
 * @module components/GuessGameMode
 */

import React, { useState, useCallback } from 'react';
import WorldMap from './WorldMap';
import GameStats from './shared/GameStats';
import GameFeedback from './shared/GameFeedback';
import useGameFeedback from '../hooks/useGameFeedback';
import { checkCountryGuess } from '../services/gameService';
import { countryNameToCode } from '../data/countryCodeMapping';
import { useLanguage } from '../contexts/LanguageContext';
import type { GamePhrase } from '../types';
import '../styles/GuessGameMode.css';

interface GuessGameModeProps {
  currentPhrase: GamePhrase | null;
  isLoading: boolean;
  stats: { attempts: number; correct: number; lives: number };
  onCountryGuess: (isCorrect: boolean, countryName: string) => void;
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
  const { feedback, feedbackType, showFeedback } = useGameFeedback();
  const [isValidating, setIsValidating] = useState(false);

  const handleCountryClick = useCallback(async (geo: any) => {
    if (!currentPhrase || isLoading || isValidating) return;

    const countryName = geo.properties.name;
    const countryCode = countryNameToCode[countryName];

    setIsValidating(true);
    try {
      const result = await checkCountryGuess(currentPhrase.languageCode, countryCode);
      const isCorrect = result.isCorrect;

      const message = isCorrect 
        ? `${t.correctAnswer} ${countryName} ${t.speaks} ${result.languageName}`
        : `${t.incorrectAnswer} ${countryName} ${t.doesNotSpeak} ${result.languageName}`;
      
      showFeedback(message, isCorrect ? 'success' : 'error');
      onCountryGuess(isCorrect, countryName);
    } catch (error) {
      showFeedback(t.validationError, 'error');
    } finally {
      setIsValidating(false);
    }
  }, [currentPhrase, isLoading, isValidating, onCountryGuess, t, showFeedback]);

  return (
    <>
      <GameStats {...stats} />
      
      {feedback && feedbackType && (
        <GameFeedback message={feedback} type={feedbackType} />
      )}

      <WorldMap 
        onCountryClick={handleCountryClick} 
        blockedCountries={[]} 
        isGameMode={true}
      />
    </>
  );
};

export default GuessGameMode;
