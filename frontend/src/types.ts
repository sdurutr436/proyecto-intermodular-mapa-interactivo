/**
 * @file types.ts
 * @description Shared TypeScript type definitions across the entire application.
 * Includes interfaces for translations, game questions and results.
 * @module types
 */

/**
 * Result of a translation operation from the backend
 */
export interface TranslationResult {
    /** Indicates if the translation was successful */
    success?: boolean;
    /** Text translated to the target language */
    translation: string;
    /** Full name of the target language */
    language: string;
    /** Name of the country it was translated to */
    country?: string;
    /** ISO 639-1 language code */
    languageCode?: string;
    /** Indicates if the result comes from cache */
    fromCache?: boolean;
}

/**
 * Game phrase in "Guess the language" mode
 */
export interface GamePhrase {
    /** Text of the phrase in the original language */
    text: string;
    /** ISO 639-1 language code of the phrase */
    languageCode: string;
    /** Full name of the language */
    languageName: string;
    /** Array of ISO Alpha-3 country codes where this language is spoken */
    validCountryCodes: string[];
}

/**
 * Flag question in "Guess the flag" mode
 */
export interface FlagQuestion {
    /** ISO Alpha-3 country code */
    countryCode: string;
    /** Country name */
    countryName: string;
    /** Continent the country belongs to */
    continent: string;
    /** Flag image URL */
    flagUrl: string;
}
