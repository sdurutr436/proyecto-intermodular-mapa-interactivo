import type { TranslationResult } from '../types';

interface GeoObject {
    id: string;
    properties: {
        name: string;
    };
}

export const translateText = async (text: string, geo: GeoObject): Promise<TranslationResult> => {
    try {
        console.log('Enviando solicitud de traducción:', { text, country: geo.properties.name });

        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, geo }),
        });

        const result = await response.json();
        console.log('Respuesta recibida:', result);

        if (!response.ok) {
            // Si la respuesta no es OK, lanzar error con el mensaje del servidor
            throw new Error(result.message || result.details || `Error del servidor: ${response.status}`);
        }

        // Validar que la traducción existe en la respuesta
        if (!result.translation) {
            throw new Error('La respuesta del servidor no contiene una traducción válida');
        }

        return result;

    } catch (error) {
        if (error instanceof Error) {
            console.error("Error al llamar al backend de traducción:", error.message);
            throw error;
        }
        throw new Error("Ocurrió un error de red desconocido.");
    }
};
