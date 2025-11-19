export interface TranslationResult {
    success?: boolean;
    translation: string;
    language: string;
    country?: string;
    languageCode?: string;
    fromCache?: boolean;
}
