/**
 * @file useGameFeedback.ts
 * @description Custom hook to handle visual game feedback.
 * Provides state and functions to show/hide feedback messages.
 * @module hooks/useGameFeedback
 */

import { useState, useCallback } from 'react';

type FeedbackType = 'success' | 'error' | null;

interface UseGameFeedbackReturn {
  feedback: string | null;
  feedbackType: FeedbackType;
  showFeedback: (message: string, type: 'success' | 'error', duration?: number) => void;
  clearFeedback: () => void;
}

/**
 * Hook to handle temporary visual feedback in the game.
 * 
 * @param {number} defaultDuration - Default feedback duration in ms (default: 2000)
 * @returns {UseGameFeedbackReturn} Feedback state and functions
 * 
 * @example
 * const { feedback, feedbackType, showFeedback } = useGameFeedback();
 * showFeedback('Correct!', 'success');
 */
const useGameFeedback = (defaultDuration: number = 2000): UseGameFeedbackReturn => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(null);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
    setFeedbackType(null);
  }, []);

  const showFeedback = useCallback((
    message: string, 
    type: 'success' | 'error', 
    duration: number = defaultDuration
  ) => {
    setFeedback(message);
    setFeedbackType(type);
    
    setTimeout(clearFeedback, duration);
  }, [defaultDuration, clearFeedback]);

  return {
    feedback,
    feedbackType,
    showFeedback,
    clearFeedback
  };
};

export default useGameFeedback;
