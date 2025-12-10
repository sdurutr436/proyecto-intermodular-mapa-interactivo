/**
 * @file types.ts
 * @description Definiciones de tipos TypeScript compartidos en toda la aplicación.
 * Incluye interfaces para traducciones, preguntas de juego y resultados.
 * @module types
 */

/**
 * Resultado de una operación de traducción desde el backend
 */
export interface TranslationResult {
    /** Indica si la traducción fue exitosa */
    success?: boolean;
    /** Texto traducido al idioma destino */
    translation: string;
    /** Nombre completo del idioma destino */
    language: string;
    /** Nombre del país al que se tradujo */
    country?: string;
    /** Código ISO 639-1 del idioma */
    languageCode?: string;
    /** Indica si el resultado proviene de caché */
    fromCache?: boolean;
}

/**
 * Frase de juego en modo "Adivina el idioma"
 */
export interface GamePhrase {
    /** Texto de la frase en el idioma original */
    text: string;
    /** Código ISO 639-1 del idioma de la frase */
    languageCode: string;
    /** Nombre completo del idioma */
    languageName: string;
    /** Array de códigos ISO Alpha-3 de países donde se habla este idioma */
    validCountryCodes: string[];
}

/**
 * Pregunta de bandera en modo "Adivina la bandera"
 */
export interface FlagQuestion {
    /** Código ISO Alpha-3 del país */
    countryCode: string;
    /** Nombre del país */
    countryName: string;
    /** Continente al que pertenece el país */
    continent: string;
    /** URL de la imagen de la bandera */
    flagUrl: string;
}
