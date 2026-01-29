/**
 * @file GameFeedback.tsx
 * @description Reusable component to display visual game feedback.
 * Shows success or error messages with appropriate icons.
 * @module components/shared/GameFeedback
 */

import React from 'react';

interface GameFeedbackProps {
  message: string;
  type: 'success' | 'error';
}

/** Success icon (check) */
const SuccessIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
  </svg>
);

/** Error icon (X) */
const ErrorIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
  </svg>
);

const GameFeedback: React.FC<GameFeedbackProps> = ({ message, type }) => {
  return (
    <output 
      className={`game-feedback ${type}`} 
      role="status" 
      aria-live="polite"
    >
      <figure className="feedback-content">
        {type === 'success' ? <SuccessIcon /> : <ErrorIcon />}
        <figcaption>{message}</figcaption>
      </figure>
    </output>
  );
};

export default GameFeedback;
