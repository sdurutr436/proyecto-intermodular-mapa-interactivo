// src/services/gameService.ts

import type { GamePhrase } from '../types';

// @ts-ignore - Vite environment variable
const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000';

/**
 * Genera una frase aleatoria en un idioma aleatorio desde el backend
 */
export const generateRandomPhrase = async (): Promise<GamePhrase> => {
  try {
    const response = await fetch(`${API_URL}/api/game/phrase`);
    
    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener frase del servidor:', error);
    throw new Error('No se pudo conectar con el servidor. Por favor, verifica que el backend esté en funcionamiento.');
  }
};

/**
 * Verifica si el país seleccionado es correcto para el idioma usando el backend
 */
export const checkCountryGuess = async (
  languageCode: string, 
  guessedCountryCode: string
): Promise<{ isCorrect: boolean; languageName: string; validCountryCodes: string[] }> => {
  try {
    const response = await fetch(`${API_URL}/api/game/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        languageCode,
        countryCode: guessedCountryCode,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al validar respuesta en el servidor:', error);
    throw new Error('No se pudo validar la respuesta. Por favor, verifica la conexión con el servidor.');
  }
};

/**
 * Obtiene lista de todos los idiomas disponibles desde el backend
 */
export const getAvailableLanguages = async () => {
  try {
    const response = await fetch(`${API_URL}/api/game/languages`);
    
    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener idiomas:', error);
    throw error;
  }
};

/**
 * Guarda o actualiza estadísticas de juego en el backend
 */
export const saveGameStats = async (sessionId: string, statsData: any) => {
  try {
    const response = await fetch(`${API_URL}/api/game/stats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        ...statsData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al guardar estadísticas:', error);
    // No lanzar error para no interrumpir el juego si falla el guardado
    return null;
  }
};

/**
 * Obtiene estadísticas de una sesión específica
 */
export const getGameStats = async (sessionId: string) => {
  try {
    const response = await fetch(`${API_URL}/api/game/stats/${sessionId}`);
    
    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

/**
 * Obtiene el ranking de mejores puntuaciones
 */
export const getLeaderboard = async (limit: number = 10) => {
  try {
    const response = await fetch(`${API_URL}/api/game/leaderboard?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener leaderboard:', error);
    throw error;
  }
};

/**
 * Genera un ID único para la sesión de juego
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
