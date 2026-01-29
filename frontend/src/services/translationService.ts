/**
 * @file translationService.ts
 * @description Service for communication with the backend translation API using Axios.
 * Handles text translations and blocked countries queries.
 * @module services/translationService
 */

import apiClient, { getErrorMessage } from './apiClient';
import type { TranslationResult } from '../types';

/**
 * Geographic object with country information from the map
 */
interface GeoObject {
  id: string;
  properties: {
    name: string;
  };
}

/**
 * Translates text to the official language of the selected country.
 * Sends a POST request to the backend with the text and geographic data.
 * 
 * @async
 * @param {string} text - Text to translate
 * @param {GeoObject} geo - Geographic object of the destination country
 * @returns {Promise<TranslationResult>} Translation result with language and metadata
 * @throws {Error} If the API fails or returns invalid data
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
    
    if (!result.translation) {
      throw new Error('The server response does not contain a valid translation');
    }
    
    return result;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

/**
 * Gets the list of blocked countries for translation based on the detected language of the text.
 * Blocked countries are those where the text's language is the official language.
 * 
 * @async
 * @param {string} text - Text to detect language and determine blocks
 * @returns {Promise<{blockedCountries: string[], sourceLang: string}>} Blocked countries and detected language
 * @throws {Error} If the API does not respond correctly
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
