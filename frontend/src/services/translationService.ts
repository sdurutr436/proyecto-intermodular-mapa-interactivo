import type { TranslationResult } from '../types';

interface GeoObject {
  id: string;
  properties: {
    name: string;
  };
}

export const translateText = async (text: string, geo: GeoObject): Promise<TranslationResult> => {
  try {
    const response = await fetch('/api/translate', {
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

// --- NUEVA FUNCIÓN PARA OBTENER PAÍSES BLOQUEADOS ---
export const getBlockedCountries = async (text: string): Promise<{ blockedCountries: string[], sourceLang: string }> => {
  const response = await fetch('/api/translate/blocked-countries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (!response.ok) throw new Error('No se pudo obtener países bloqueados');
  return await response.json();
};
