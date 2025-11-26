export interface TranslationResult {
    success?: boolean;
    translation: string;
    language: string;
    country?: string;
    languageCode?: string;
    fromCache?: boolean;
}

export interface GamePhrase {
    text: string;
    languageCode: string;
    languageName: string;
    validCountryCodes: string[];
}
