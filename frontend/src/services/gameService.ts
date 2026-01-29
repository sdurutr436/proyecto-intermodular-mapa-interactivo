/**
 * @file gameService.ts
 * @description Service for communication with the backend game API using Axios.
 * Handles question generation, answer validation and statistics.
 * @module services/gameService
 */

import apiClient, { getErrorMessage } from './apiClient';
import type { GamePhrase, FlagQuestion } from '../types';

/**
 * Generates a random phrase in a random language from the backend.
 * 
 * @async
 * @returns {Promise<GamePhrase>} Random phrase with language and valid country codes
 * @throws {Error} If the server does not respond or returns an error
 * 
 * @example
 * ```ts
 * const phrase = await generateRandomPhrase();
 * console.log(phrase.text); // 'Bonjour'
 * console.log(phrase.languageName); // 'French'
 * ```
 */
export const generateRandomPhrase = async (): Promise<GamePhrase> => {
  try {
    const response = await apiClient.get<GamePhrase>('/api/game/phrase');
    return response.data;
  } catch (error) {
    throw new Error('Could not connect to the server. Please verify that the backend is running.');
  }
};

/**
 * Generates a random flag question from the backend.
 * 
 * @async
 * @returns {Promise<FlagQuestion>} Question with flag, country code and metadata
 * @throws {Error} If the server does not respond or returns an error
 * 
 * @example
 * ```ts
 * const flag = await generateRandomFlag();
 * console.log(flag.flagUrl); // 'https://flagcdn.com/w320/es.png'
 * console.log(flag.countryName); // 'Spain'
 * ```
 */
export const generateRandomFlag = async (): Promise<FlagQuestion> => {
  try {
    const response = await apiClient.get<FlagQuestion>('/api/game/flag');
    return response.data;
  } catch (error) {
    throw new Error('Could not connect to the server. Please verify that the backend is running.');
  }
};

/**
 * Verifies if the selected country is correct for the displayed flag.
 * 
 * @async
 * @param {string} targetCountryCode - ISO code of the correct country
 * @param {string} guessedCountryCode - ISO code of the country selected by the player
 * @returns {Promise<{isCorrect: boolean, correctCountryName: string}>} Validation result
 * @throws {Error} If the server does not respond or returns an error
 * 
 * @example
 * ```ts
 * const result = await checkFlagGuess('ESP', 'FRA');
 * console.log(result.isCorrect); // false
 * console.log(result.correctCountryName); // 'Spain'
 * ```
 */
export const checkFlagGuess = async (
  targetCountryCode: string, 
  guessedCountryCode: string
): Promise<{ isCorrect: boolean; correctCountryName: string }> => {
  try {
    const response = await apiClient.post<{ isCorrect: boolean; correctCountryName: string }>(
      '/api/game/validate-flag',
      {
        targetCountryCode,
        guessedCountryCode
      }
    );
    
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Verifies if the selected country is correct for the displayed language.
 * 
 * @async
 * @param {string} languageCode - ISO code of the phrase's language
 * @param {string} guessedCountryCode - ISO code of the country selected by the player
 * @returns {Promise<{isCorrect: boolean, languageName: string, validCountryCodes: string[]}>} Result with validation and valid countries
 * @throws {Error} If the server does not respond or returns an error
 * 
 * @example
 * ```ts
 * const result = await checkCountryGuess('es', 'MEX');
 * console.log(result.isCorrect); // true
 * console.log(result.languageName); // 'Spanish'
 * ```
 */
export const checkCountryGuess = async (
  languageCode: string, 
  guessedCountryCode: string
): Promise<{ isCorrect: boolean; languageName: string; validCountryCodes: string[] }> => {
  try {
    const response = await apiClient.post<{ isCorrect: boolean; languageName: string; validCountryCodes: string[] }>(
      '/api/game/validate',
      {
        languageCode,
        countryCode: guessedCountryCode
      }
    );
    
    return response.data;
  } catch (error) {
    throw new Error('Could not validate the answer. Please check the connection to the server.');
  }
};

/**
 * Gets list of all available languages from the backend
 * 
 * @async
 * @returns {Promise<any>} List of available languages
 * @throws {Error} If the server does not respond
 */
export const getAvailableLanguages = async () => {
  try {
    const response = await apiClient.get('/api/game/languages');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Saves or updates game statistics in the backend
 * 
 * @async
 * @param {string} sessionId - Unique game session ID
 * @param {any} statsData - Statistics data to save
 * @returns {Promise<any>} Saved statistics or null if it fails
 */
export const saveGameStats = async (sessionId: string, statsData: any) => {
  try {
    const response = await apiClient.post('/api/game/stats', {
      sessionId,
      ...statsData
    });
    
    return response.data;
  } catch (error) {
    // Don't throw error to not interrupt the game if saving fails
    return null;
  }
};

/**
 * Gets statistics of a specific session
 * 
 * @async
 * @param {string} sessionId - Session ID
 * @returns {Promise<any>} Session statistics
 * @throws {Error} If the server does not respond
 */
export const getGameStats = async (sessionId: string) => {
  try {
    const response = await apiClient.get(`/api/game/stats/${sessionId}`);
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Gets the leaderboard of best scores
 * 
 * @async
 * @param {number} limit - Maximum number of results (default: 10)
 * @returns {Promise<any>} List of best scores
 * @throws {Error} If the server does not respond
 */
export const getLeaderboard = async (limit: number = 10) => {
  try {
    const response = await apiClient.get('/api/game/leaderboard', {
      params: { limit }
    });
    
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Generates a unique ID for the game session
 * 
 * @returns {string} Unique session ID
 * 
 * @example
 * ```ts
 * const sessionId = generateSessionId();
 * console.log(sessionId); // 'session_1702245678901_abc123'
 * ```
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
