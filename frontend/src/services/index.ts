/**
 * @fileoverview Índice de servicios API
 * @module services
 * @description Exporta todos los servicios de API para fácil importación.
 * Punto de entrada centralizado para todas las funciones de comunicación con el backend.
 */

// Cliente HTTP base
export { default as apiClient, getErrorMessage } from './apiClient';
export type { ApiError } from './apiClient';

// Servicio de traducción
export {
  translateText,
  getBlockedCountries
} from './translationService';

// Servicio de juego
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
