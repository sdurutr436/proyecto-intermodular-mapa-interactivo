/**
 * @file translationService.ts
 * @description Servicio para comunicación con la API de traducción del backend.
 * Maneja traducciones de texto y consultas de países bloqueados.
 * @module services/translationService
 */

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
 * URL base de la API backend
 * @constant
 */
// @ts-ignore - Vite environment variable
const API_URL = import.meta.env?.VITE_API_URL || '';

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
 * const result = await translateText('Hello', { id: 'ESP', properties: { name: 'Spain' } });
 * console.log(result.translation); // 'Hola'
 */
export const translateText = async (text: string, geo: GeoObject): Promise<TranslationResult> => {
  try {
    const response = await fetch(`${API_URL}/api/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, geo }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || result.details || `Error del servidor: ${response.status}`);
    }
    if (!result.translation) {
      throw new Error('La respuesta del servidor no contiene una traducción válida');
    }
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Ocurrió un error de red desconocido.");
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
 * const { blockedCountries, sourceLang } = await getBlockedCountries('Hello world');
 * console.log(sourceLang); // 'en'
 * console.log(blockedCountries); // ['USA', 'GBR', 'CAN', ...]
 */
export const getBlockedCountries = async (text: string): Promise<{ blockedCountries: string[], sourceLang: string }> => {
  const response = await fetch(`${API_URL}/api/translate/blocked-countries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!response.ok) throw new Error('No se pudo obtener países bloqueados');
  return await response.json();
};
