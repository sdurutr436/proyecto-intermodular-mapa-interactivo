/**
 * @fileoverview API services index
 * @module services
 * @description Exports all API services for easy importing.
 * Centralized entry point for all backend communication functions.
 */

// Base HTTP client
export { default as apiClient, getErrorMessage } from './apiClient';
export type { ApiError } from './apiClient';

// Translation service
export {
  translateText,
  getBlockedCountries
} from './translationService';

// Game service
export {
  generateRandomPhrase,
  generateRandomFlag,
  checkFlagGuess,
  checkCountryGuess,
  getAvailableLanguages,
  saveGameStats,
  getGameStats,
  getLeaderboard,
  generateSessionId
} from './gameService';
