/**
 * @file gameService.ts
 * @description Servicio para comunicación con la API de juegos del backend usando Axios.
 * Maneja generación de preguntas, validación de respuestas y estadísticas.
 * @module services/gameService
 */

import apiClient, { getErrorMessage } from './apiClient';
import type { GamePhrase, FlagQuestion } from '../types';

/**
 * Genera una frase aleatoria en un idioma aleatorio desde el backend.
 * 
 * @async
 * @returns {Promise<GamePhrase>} Frase aleatoria con idioma y códigos de países válidos
 * @throws {Error} Si el servidor no responde o devuelve error
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
    console.error('Error al obtener frase del servidor:', error);
    throw new Error('No se pudo conectar con el servidor. Por favor, verifica que el backend esté en funcionamiento.');
  }
};

/**
 * Genera una pregunta aleatoria de bandera desde el backend.
 * 
 * @async
 * @returns {Promise<FlagQuestion>} Pregunta con bandera, código de país y metadata
 * @throws {Error} Si el servidor no responde o devuelve error
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
    console.error('Error al obtener bandera del servidor:', error);
    throw new Error('No se pudo conectar con el servidor. Por favor, verifica que el backend esté en funcionamiento.');
  }
};

/**
 * Verifica si el país seleccionado es correcto para la bandera mostrada.
 * 
 * @async
 * @param {string} targetCountryCode - Código ISO del país correcto
 * @param {string} guessedCountryCode - Código ISO del país seleccionado por el jugador
 * @returns {Promise<{isCorrect: boolean, correctCountryName: string}>} Resultado de validación
 * @throws {Error} Si el servidor no responde o devuelve error
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
    console.error('Error al validar respuesta en el servidor:', error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Verifica si el país seleccionado es correcto para el idioma mostrado.
 * 
 * @async
 * @param {string} languageCode - Código ISO del idioma de la frase
 * @param {string} guessedCountryCode - Código ISO del país seleccionado por el jugador
 * @returns {Promise<{isCorrect: boolean, languageName: string, validCountryCodes: string[]}>} Resultado con validación y países válidos
 * @throws {Error} Si el servidor no responde o devuelve error
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
    console.error('Error al validar respuesta en el servidor:', error);
    throw new Error('No se pudo validar la respuesta. Por favor, verifica la conexión con el servidor.');
  }
};

/**
 * Obtiene lista de todos los idiomas disponibles desde el backend
 * 
 * @async
 * @returns {Promise<any>} Lista de idiomas disponibles
 * @throws {Error} Si el servidor no responde
 */
export const getAvailableLanguages = async () => {
  try {
    const response = await apiClient.get('/api/game/languages');
    return response.data;
  } catch (error) {
    console.error('Error al obtener idiomas:', error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Guarda o actualiza estadísticas de juego en el backend
 * 
 * @async
 * @param {string} sessionId - ID único de la sesión de juego
 * @param {any} statsData - Datos de estadísticas a guardar
 * @returns {Promise<any>} Estadísticas guardadas o null si falla
 */
export const saveGameStats = async (sessionId: string, statsData: any) => {
  try {
    const response = await apiClient.post('/api/game/stats', {
      sessionId,
      ...statsData
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al guardar estadísticas:', error);
    // No lanzar error para no interrumpir el juego si falla el guardado
    return null;
  }
};

/**
 * Obtiene estadísticas de una sesión específica
 * 
 * @async
 * @param {string} sessionId - ID de la sesión
 * @returns {Promise<any>} Estadísticas de la sesión
 * @throws {Error} Si el servidor no responde
 */
export const getGameStats = async (sessionId: string) => {
  try {
    const response = await apiClient.get(`/api/game/stats/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Obtiene el ranking de mejores puntuaciones
 * 
 * @async
 * @param {number} limit - Número máximo de resultados (default: 10)
 * @returns {Promise<any>} Lista de mejores puntuaciones
 * @throws {Error} Si el servidor no responde
 */
export const getLeaderboard = async (limit: number = 10) => {
  try {
    const response = await apiClient.get('/api/game/leaderboard', {
      params: { limit }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error al obtener leaderboard:', error);
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Genera un ID único para la sesión de juego
 * 
 * @returns {string} ID único de sesión
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
