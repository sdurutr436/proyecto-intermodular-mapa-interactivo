/**
 * @file translationService.ts
 * @description Servicio para comunicación con la API de traducción del backend usando Axios.
 * Maneja traducciones de texto y consultas de países bloqueados.
 * @module services/translationService
 */

import apiClient, { getErrorMessage } from './apiClient';
import type { TranslationResult } from '../types';

/**
 * Objeto geográfico con información de país del mapa
 */
interface GeoObject {
  id: string;
  properties: {
    name: string;
  };
}

/**
 * Traduce un texto al idioma oficial del país seleccionado.
 * Envía una petición POST al backend con el texto y datos geográficos.
 * 
 * @async
 * @param {string} text - Texto a traducir
 * @param {GeoObject} geo - Objeto geográfico del país destino
 * @returns {Promise<TranslationResult>} Resultado de la traducción con idioma y metadata
 * @throws {Error} Si la API falla o devuelve datos inválidos
 * 
 * @example
 * ```ts
 * const result = await translateText('Hello', { id: 'ESP', properties: { name: 'Spain' } });
 * console.log(result.translation); // 'Hola'
 * ```
 */
export const translateText = async (text: string, geo: GeoObject): Promise<TranslationResult> => {
  try {
    const response = await apiClient.post<TranslationResult>('/api/translate', {
      text,
      geo
    });

    const result = response.data;
    
    console.log('📦 Respuesta del servidor:', result);
    console.log('✅ fromCache:', result.fromCache);
    
    if (!result.translation) {
      throw new Error('La respuesta del servidor no contiene una traducción válida');
    }
    
    return result;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Obtiene la lista de países bloqueados para traducción basado en el idioma detectado del texto.
 * Países bloqueados son aquellos donde el idioma del texto es el idioma oficial.
 * 
 * @async
 * @param {string} text - Texto para detectar idioma y determinar bloqueos
 * @returns {Promise<{blockedCountries: string[], sourceLang: string}>} Países bloqueados e idioma detectado
 * @throws {Error} Si la API no responde correctamente
 * 
 * @example
 * ```ts
 * const { blockedCountries, sourceLang } = await getBlockedCountries('Hello world');
 * console.log(sourceLang); // 'en'
 * console.log(blockedCountries); // ['USA', 'GBR', 'CAN', ...]
 * ```
 */
export const getBlockedCountries = async (text: string): Promise<{ blockedCountries: string[], sourceLang: string }> => {
  try {
    const response = await apiClient.post<{ blockedCountries: string[], sourceLang: string }>(
      '/api/translate/blocked-countries',
      { text }
    );
    
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
