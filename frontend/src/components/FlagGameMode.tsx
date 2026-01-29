/**
 * @file FlagGameMode.tsx
 * @description "Guess the flag" game mode. Shows the flag of a random country
 * and the player must click on the correct country on the map.
 * @module components/FlagGameMode
 */

import React, { useState, useCallback } from 'react';
import WorldMap from './WorldMap';
import GameStats from './shared/GameStats';
import GameFeedback from './shared/GameFeedback';
import useGameFeedback from '../hooks/useGameFeedback';
import { checkFlagGuess } from '../services/gameService';
import { countryNameToCode } from '../data/countryCodeMapping';
import { useLanguage } from '../contexts/LanguageContext';
import type { FlagQuestion } from '../types';
import '../styles/FlagGameMode.css';

interface FlagGameModeProps {
  currentFlag: FlagQuestion | null;
  isLoading: boolean;
  stats: { attempts: number; correct: number; lives: number };
  onCountryGuess: (isCorrect: boolean, countryName: string) => void;
  showHint: boolean;
}

const FlagGameMode: React.FC<FlagGameModeProps> = ({ 
  currentFlag, 
  isLoading,
  stats,
  onCountryGuess,
  showHint
}) => {
  const { t } = useLanguage();
  const { feedback, feedbackType, showFeedback } = useGameFeedback();
  const [isValidating, setIsValidating] = useState(false);

  const handleCountryClick = useCallback(async (geo: any) => {
    if (!currentFlag || isLoading || isValidating) return;

    const countryName = geo.properties.name;
    const countryCode = countryNameToCode[countryName];

    setIsValidating(true);
    try {
      const result = await checkFlagGuess(currentFlag.countryCode, countryCode);
      const isCorrect = result.isCorrect;

      const message = isCorrect 
        ? `${t.correctAnswer} ${t.isTheFlagOf} ${result.correctCountryName}`
        : `${t.incorrectAnswer} ${countryName} ${t.isNotCorrect}`;
      
      showFeedback(message, isCorrect ? 'success' : 'error');
      onCountryGuess(isCorrect, countryName);
    } catch (error) {
      showFeedback(t.validationError, 'error');
    } finally {
      setIsValidating(false);
    }
  }, [currentFlag, isLoading, isValidating, onCountryGuess, t, showFeedback]);

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

export default FlagGameMode;
