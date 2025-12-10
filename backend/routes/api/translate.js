/**
 * @file translate.js
 * @description Rutas de la API para el servicio de traducción.
 * Implementa un sistema híbrido de traducción usando DeepL como servicio principal
 * y Google Translate como fallback gratuito. Incluye detección automática de idioma,
 * caché de traducciones y bloqueo de países según idioma fuente.
 * @module routes/api/translate
 */

const express = require('express');
const router = express.Router();
const Translation = require('../../models/Translation');
const { countryLanguageMap } = require('../../data/countryLanguageMap');
const { countryNameToCode } = require('../../data/countryCodeMapping');
const deepl = require('deepl-node');

/**
 * Configuración del traductor DeepL
 * @type {deepl.Translator|null}
 */
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const translator = DEEPL_API_KEY ? new deepl.Translator(DEEPL_API_KEY) : null;

// ========== DETECCIÓN DE IDIOMA AUTOMÁTICA ==========

/**
 * Detecta el idioma de un texto usando la API gratuita de Google Translate.
 * No requiere autenticación y soporta todos los idiomas disponibles en Google Translate.
 * 
 * @async
 * @function detectLanguageWithGoogle
 * @param {string} text - Texto del cual detectar el idioma
 * @returns {Promise<string|null>} Código ISO 639-1 del idioma detectado (ej: 'es', 'en', 'fr') o null si falla
 * 
 * @example
 * const lang = await detectLanguageWithGoogle('Hello world');
 * console.log(lang); // 'en'
 */
const detectLanguageWithGoogle = async (text) => {
    try {
        const fetch = require('node-fetch');
        // Usar la API de Google Translate para detectar idioma
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        if (!response.ok) {
            throw new Error(`Error de API: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Google devuelve el idioma detectado en data[2]
        if (data && data[2]) {
            const detectedLang = data[2];
            console.log(`[Google Detect] Idioma detectado: ${detectedLang} para texto: "${text.substring(0, 50)}..."`);
            return detectedLang;
        }
        
        return null;
    } catch (error) {
        console.error('[Google Detect] Error:', error.message);
        return null;
    }
};

/**
 * Función principal para detectar el idioma de un texto.
 * Utiliza Google Translate como motor de detección.
 * 
 * @async
 * @function detectLanguage
 * @param {string} text - Texto a analizar
 * @returns {Promise<string|null>} Código base del idioma (sin variantes regionales) o null
 * 
 * @example
 * const lang = await detectLanguage('Bonjour le monde');
 * console.log(lang); // 'fr'
 */
const detectLanguage = async (text) => {
    try {
        const normalizedText = text.trim();
        
        // Si el texto es muy corto (menos de 2 caracteres), no podemos detectar bien
        if (normalizedText.length < 2) {
            console.log('Texto muy corto para detectar idioma, devolviendo null');
            return null;
        }
        
        // Usar Google Translate API para detección automática
        const detectedLang = await detectLanguageWithGoogle(normalizedText);
        
        if (detectedLang) {
            // Normalizar el código de idioma (algunos vienen como zh-CN, pt-BR, etc.)
            const baseLang = detectedLang.split('-')[0].toLowerCase();
            console.log(`[detectLanguage] Resultado final: ${baseLang}`);
            return baseLang;
        }
        
        console.log('[detectLanguage] No se pudo detectar el idioma');
        return null;
    } catch (error) {
        console.error('Error en detección de idioma:', error.message);
        return null;
    }
};

/**
 * Obtiene la lista de países que deben ser bloqueados para traducción
 * basado en el idioma fuente detectado. Bloquea países donde el idioma
 * fuente es el idioma oficial para evitar traducciones sin sentido.
 * 
 * @function getBlockedCountriesBySourceLang
 * @param {string} sourceLangCode - Código ISO del idioma fuente (ej: 'es', 'en', 'pt-BR')
 * @returns {string[]} Array de códigos ISO Alpha-3 de países bloqueados
 * 
 * @example
 * const blocked = getBlockedCountriesBySourceLang('es');
 * console.log(blocked); // ['ESP', 'MEX', 'ARG', 'COL', ...]
 */
function getBlockedCountriesBySourceLang(sourceLangCode) {
    if (!sourceLangCode) return [];
    
    const normalizedSourceLang = sourceLangCode.toLowerCase().split('-')[0]; // 'pt-BR' -> 'pt'
    
    // Devuelve ISO alpha3 de los países donde ese idioma es oficial
    return Object.entries(countryLanguageMap)
        .filter(([countryCode, langObj]) => {
            // Normalizar el código del país también
            const countryLang = langObj.code.toLowerCase().split('-')[0];
            return countryLang === normalizedSourceLang;
        })
        .map(([countryCode]) => countryCode);
}

/**
 * Lista de códigos de idiomas soportados por la API de DeepL.
 * Incluye variantes regionales como pt-BR (Portugués de Brasil) y zh-CN (Chino simplificado).
 * 
 * @constant {string[]}
 */
const DEEPL_SUPPORTED_LANGS = [
    'en', 'es', 'fr', 'de', 'it', 'pt', 'pt-BR', 'ru', 'ja', 'zh', 'zh-CN',
    'nl', 'pl', 'tr', 'sv', 'da', 'fi', 'el', 'cs', 'ro', 'hu', 'sk', 'bg',
    'uk', 'id', 'ko', 'no', 'et', 'lv', 'lt', 'sl', 'ar'
];

/**
 * Traduce texto usando la API gratuita de Google Translate.
 * Se usa como fallback cuando DeepL no está disponible o no soporta el idioma.
 * 
 * @async
 * @function translateWithGoogleFallback
 * @param {string} text - Texto a traducir
 * @param {string} sourceLang - Código del idioma fuente
 * @param {string} targetLang - Código del idioma destino
 * @returns {Promise<string>} Texto traducido
 * @throws {Error} Si la traducción falla o la respuesta es inválida
 * 
 * @example
 * const translated = await translateWithGoogleFallback('Hello', 'en', 'es');
 * console.log(translated); // 'Hola'
 */
const translateWithGoogleFallback = async (text, sourceLang, targetLang) => {
    console.log(`[Google Fallback] Traduciendo de ${sourceLang} a ${targetLang}`);
    console.log(`[Google Fallback] Texto original: "${text}"`);
    try {
        const fetch = require('node-fetch');
        // API de Google Translate gratuita (sin autenticación)
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        if (!response.ok) {
            throw new Error(`Error de API: ${response.status}`);
        }
        const data = await response.json();
        if (!data || !data[0] || !data[0][0] || !data[0][0][0]) {
            throw new Error('Respuesta de traducción inválida');
        }
        // Google devuelve un array de arrays, concatenamos todas las traducciones
        const translatedText = data[0].map(item => item[0]).join('').trim();
        console.log(`[Google Fallback] Traducción exitosa: "${translatedText}"`);
        return translatedText;
    } catch (error) {
        console.error('[Google Fallback] Error:', error.message);
        throw new Error(`Error en Google Fallback: ${error.message}`);
    }
};

/**
 * Traduce texto usando la API de DeepL (servicio premium de mayor calidad).
 * Requiere API key válida configurada en DEEPL_API_KEY.
 * 
 * @async
 * @function translateWithDeepL
 * @param {string} text - Texto a traducir
 * @param {string} sourceLang - Código del idioma fuente
 * @param {string} targetLang - Código del idioma destino
 * @returns {Promise<string>} Texto traducido con alta calidad
 * @throws {Error} Si la API key es inválida, se excede la cuota, o el idioma no está soportado
 * 
 * @example
 * const translated = await translateWithDeepL('Hello world', 'en', 'es');
 * console.log(translated); // 'Hola mundo'
 */
const translateWithDeepL = async (text, sourceLang, targetLang) => {
    if (!translator) {
        throw new Error('UNSUPPORTED_LANGUAGE'); // Forzar uso de Google Fallback
    }
    console.log(`[DeepL] Traduciendo de ${sourceLang} a ${targetLang}`);
    console.log(`[DeepL] Texto original: "${text}"`);
    try {
        // Mapeo de códigos de idioma para DeepL (solo para idioma DESTINO)
        // Para idioma FUENTE, DeepL solo acepta códigos base sin variantes
        const deeplTargetLangMap = {
            'en': 'EN-US', 'es': 'ES', 'fr': 'FR', 'de': 'DE', 'it': 'IT',
            'pt': 'PT-PT', 'pt-BR': 'PT-BR', 'ru': 'RU', 'ja': 'JA', 'zh': 'ZH', 'zh-CN': 'ZH',
            'nl': 'NL', 'pl': 'PL', 'tr': 'TR', 'sv': 'SV', 'da': 'DA', 'fi': 'FI', 'el': 'EL',
            'cs': 'CS', 'ro': 'RO', 'hu': 'HU', 'sk': 'SK', 'bg': 'BG', 'uk': 'UK', 'id': 'ID',
            'ko': 'KO', 'no': 'NB', 'et': 'ET', 'lv': 'LV', 'lt': 'LT', 'sl': 'SL', 'ar': 'AR',
        };
        
        // Para idioma fuente, usar siempre código base (sin variantes regionales)
        const sourceDeepL = sourceLang.toUpperCase();
        // Para idioma destino, usar el mapeo con variantes
        const targetDeepL = deeplTargetLangMap[targetLang] || targetLang.toUpperCase();
        
        console.log(`[DeepL] Códigos ajustados: ${sourceLang} -> ${sourceDeepL}, ${targetLang} -> ${targetDeepL}`);
        // Realizar traducción con DeepL
        const result = await translator.translateText(
            text,
            sourceDeepL,
            targetDeepL
        );
        if (!result || !result.text) {
            throw new Error('Respuesta de traducción inválida');
        }
        const translatedText = result.text.trim();
        console.log(`[DeepL] Traducción exitosa: "${translatedText}"`);
        console.log(`[DeepL] Idioma detectado: ${result.detectedSourceLang || sourceLang}`);
        return translatedText;
    } catch (error) {
        console.error('[DeepL] Error:', error.message);
        // Mensajes de error más específicos
        if (error.message.includes('Authorization') || error.message.includes('403')) {
            throw new Error('API Key de DeepL inválida o expirada. Por favor verifica tu configuración.');
        }
        if (error.message.includes('quota') || error.message.includes('limit')) {
            throw new Error('Límite de caracteres de DeepL alcanzado. Por favor espera o actualiza tu plan.');
        }
        if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
            throw new Error('Tiempo de espera agotado al conectar con DeepL');
        }
        if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
            throw new Error('No se pudo conectar con el servicio de traducción');
        }
        if (error.message.includes('not supported') || error.message.includes('language')) {
            // Si el idioma no está soportado, lanzar error para usar fallback
            throw new Error('UNSUPPORTED_LANGUAGE');
        }
        throw new Error(`Error en DeepL: ${error.message}`);
    }
};

/**
 * Función híbrida de traducción que selecciona automáticamente el mejor servicio.
 * Intenta usar DeepL primero (mayor calidad) y usa Google Translate como fallback.
 * 
 * @async
 * @function translateText
 * @param {string} text - Texto a traducir
 * @param {string} sourceLang - Código del idioma fuente
 * @param {string} targetLang - Código del idioma destino
 * @returns {Promise<string>} Texto traducido
 * @throws {Error} Si ambos servicios fallan
 * 
 * @example
 * const result = await translateText('Hello', 'en', 'ja');
 * console.log(result); // 'こんにちは'
 */
const translateText = async (text, sourceLang, targetLang) => {
    // Verificar si ambos idiomas están soportados por DeepL
    const sourceSupported = DEEPL_SUPPORTED_LANGS.includes(sourceLang);
    const targetSupported = DEEPL_SUPPORTED_LANGS.includes(targetLang) || targetLang.split('-')[0] && DEEPL_SUPPORTED_LANGS.includes(targetLang.split('-')[0]);
    if (sourceSupported && targetSupported) {
        try {
            console.log('[Sistema Híbrido] Intentando con DeepL (mejor calidad)...');
            return await translateWithDeepL(text, sourceLang, targetLang);
        } catch (error) {
            if (error.message === 'UNSUPPORTED_LANGUAGE') {
                console.log('[Sistema Híbrido] Idioma no soportado por DeepL, usando Google Fallback...');
                return await translateWithGoogleFallback(text, sourceLang, targetLang);
            }
            throw error;
        }
    } else {
        console.log(`[Sistema Híbrido] Idioma ${!sourceSupported ? sourceLang : targetLang} no soportado por DeepL, usando Google Fallback...`);
        return await translateWithGoogleFallback(text, sourceLang, targetLang);
    }
};

/**
 * @route   POST /api/translate/blocked-countries
 * @method  POST
 * @desc    Detecta automáticamente el idioma de un texto y devuelve la lista de países bloqueados
 *          para evitar traducciones al mismo idioma. Útil para validación previa de países antes
 *          de realizar una traducción.
 * @access  Public
 * 
 * @param   {Object} req.body - Cuerpo de la petición
 * @param   {string} req.body.text - Texto para detectar idioma (mínimo 2 caracteres)
 * 
 * @returns {200} Success - Países bloqueados detectados correctamente
 * @returns {400} Bad Request - Texto inválido o vacío
 * @returns {500} Internal Server Error - Error en el servicio de detección
 * 
 * @example Request
 * POST /api/translate/blocked-countries
 * Content-Type: application/json
 * 
 * {
 *   "text": "Hola mundo"
 * }
 * 
 * @example Response 200 (Success)
 * {
 *   "blockedCountries": ["ESP", "MEX", "ARG", "COL", "CHL"],
 *   "sourceLang": "es",
 *   "message": "OK"
 * }
 * 
 * @example Response 200 (Texto muy corto)
 * {
 *   "blockedCountries": [],
 *   "sourceLang": null,
 *   "message": "Texto muy corto para detectar idioma"
 * }
 * 
 * @example Response 400 (Bad Request)
 * {
 *   "success": false,
 *   "message": "Texto inválido"
 * }
 * 
 * @example Response 200 (No se pudo detectar)
 * {
 *   "blockedCountries": [],
 *   "sourceLang": null,
 *   "message": "No se pudo detectar el idioma"
 * }
 */
router.post('/blocked-countries', async (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
        return res.status(400).json({ success: false, message: 'Texto inválido' });
    }
    
    // Si el texto es muy corto, no bloquear nada
    const trimmedText = text.trim();
    if (trimmedText.length < 2) {
        return res.json({ blockedCountries: [], sourceLang: null, message: 'Texto muy corto para detectar idioma' });
    }
    
    try {
        const sourceLang = await detectLanguage(trimmedText);
        
        // Si no se pudo detectar el idioma, devolver lista vacía
        if (!sourceLang) {
            console.log(`[blocked-countries] No se pudo detectar idioma para: "${trimmedText.substring(0, 50)}..."`);
            return res.json({ blockedCountries: [], sourceLang: null, message: 'No se pudo detectar el idioma' });
        }
        
        const blockedCountries = getBlockedCountriesBySourceLang(sourceLang);
        console.log(`[blocked-countries] Idioma: ${sourceLang}, Países bloqueados: ${blockedCountries.length}`);
        res.json({ blockedCountries, sourceLang });
    } catch (error) {
        console.error('[blocked-countries] Error:', error.message);
        res.json({ blockedCountries: [], sourceLang: null, message: 'Error al detectar idioma' });
    }
});

/**
 * @route   POST /api/translate
 * @method  POST
 * @desc    Traduce un texto al idioma oficial del país seleccionado usando sistema híbrido
 *          (DeepL para mejor calidad, Google Translate como fallback gratuito). Incluye
 *          detección automática de idioma fuente, bloqueo de países con mismo idioma,
 *          sistema de caché MongoDB y validación completa de parámetros.
 * @access  Public
 * 
 * @param   {Object} req.body - Cuerpo de la petición
 * @param   {string} req.body.text - Texto a traducir (máximo 500 caracteres, mínimo 1)
 * @param   {Object} req.body.geo - Información geográfica del país destino
 * @param   {Object} req.body.geo.properties - Propiedades del país
 * @param   {string} req.body.geo.properties.name - Nombre del país en inglés (ej: "Spain", "France")
 * 
 * @returns {200} Success - Traducción realizada correctamente
 * @returns {400} Bad Request - Parámetros inválidos o texto demasiado largo
 * @returns {403} Forbidden - País bloqueado porque habla el mismo idioma del texto
 * @returns {404} Not Found - País no soportado o idioma no configurado
 * @returns {429} Too Many Requests - Cuota de API excedida
 * @returns {500} Internal Server Error - Error en servicio de traducción
 * @returns {502} Bad Gateway - No se pudo conectar con el servicio externo
 * @returns {504} Gateway Timeout - Tiempo de espera agotado
 * 
 * @example Request
 * POST /api/translate
 * Content-Type: application/json
 * 
 * {
 *   "text": "Hello world",
 *   "geo": {
 *     "properties": { "name": "Spain" }
 *   }
 * }
 * 
 * @example Response 200 (Success - Nueva traducción)
 * {
 *   "success": true,
 *   "translation": "Hola mundo",
 *   "language": "Spanish",
 *   "country": "Spain",
 *   "languageCode": "es",
 *   "fromCache": false,
 *   "blockedCountries": ["USA", "GBR", "AUS"]
 * }
 * 
 * @example Response 200 (Success - Desde caché)
 * {
 *   "success": true,
 *   "translation": "Hola mundo",
 *   "language": "Spanish",
 *   "country": "Spain",
 *   "languageCode": "es",
 *   "fromCache": true
 * }
 * 
 * @example Response 200 (Success - Mismo idioma)
 * {
 *   "success": true,
 *   "translation": "Hola mundo",
 *   "language": "Spanish",
 *   "country": "Spain",
 *   "languageCode": "es",
 *   "fromCache": false,
 *   "note": "El texto ya está en el idioma del país seleccionado"
 * }
 * 
 * @example Response 400 (Bad Request - Texto inválido)
 * {
 *   "success": false,
 *   "message": "Texto inválido",
 *   "details": "Se requiere un texto válido para traducir"
 * }
 * 
 * @example Response 400 (Bad Request - Texto muy largo)
 * {
 *   "success": false,
 *   "message": "Texto demasiado largo",
 *   "details": "El texto no puede exceder los 500 caracteres"
 * }
 * 
 * @example Response 400 (Bad Request - Datos incompletos)
 * {
 *   "success": false,
 *   "message": "Datos incompletos",
 *   "details": "Se requiere información del país destino"
 * }
 * 
 * @example Response 403 (Forbidden - País bloqueado)
 * {
 *   "success": false,
 *   "message": "El país 'Spain' está bloqueado porque su idioma principal coincide con el idioma fuente.",
 *   "blockedCountries": ["ESP", "MEX", "ARG"],
 *   "sourceLang": "es",
 *   "details": "Debes elegir un país diferente donde no se hable ese idioma como principal."
 * }
 * 
 * @example Response 404 (Not Found - País no soportado)
 * {
 *   "success": false,
 *   "message": "País no soportado: Antarctica",
 *   "details": "El país no está en nuestra base de datos"
 * }
 * 
 * @example Response 404 (Not Found - Idioma no configurado)
 * {
 *   "success": false,
 *   "message": "Idioma no configurado para: Vatican City",
 *   "details": "No se encontró el idioma asociado al país"
 * }
 * 
 * @example Response 429 (Too Many Requests)
 * {
 *   "success": false,
 *   "message": "Cuota de traducción excedida",
 *   "details": "quota exceeded for DeepL API",
 *   "timestamp": "2025-12-10T00:45:23.123Z"
 * }
 * 
 * @example Response 500 (Internal Server Error)
 * {
 *   "success": false,
 *   "message": "Error interno del servidor",
 *   "details": "Database connection failed",
 *   "timestamp": "2025-12-10T00:45:23.123Z"
 * }
 * 
 * @example Response 502 (Bad Gateway)
 * {
 *   "success": false,
 *   "message": "No se pudo conectar con el servicio de traducción",
 *   "details": "ENOTFOUND api.deepl.com",
 *   "timestamp": "2025-12-10T00:45:23.123Z"
 * }
 * 
 * @example Response 504 (Gateway Timeout)
 * {
 *   "success": false,
 *   "message": "Tiempo de espera agotado",
 *   "details": "Request timeout after 30s",
 *   "timestamp": "2025-12-10T00:45:23.123Z"
 * }
 */
router.post('/', async (req, res) => {
    try {
        const { text, geo } = req.body;
        console.log('Solicitud de traducción recibida:', {
            text,
            country: geo?.properties?.name,
            timestamp: new Date().toISOString()
        });

        // Validaciones
        if (!text || typeof text !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Texto inválido',
                details: 'Se requiere un texto válido para traducir'
            });
        }

        if (!geo?.properties?.name) {
            return res.status(400).json({
                success: false,
                message: 'Datos incompletos',
                details: 'Se requiere información del país destino'
            });
        }

        // Validar longitud del texto
        if (text.length > 500) {
            return res.status(400).json({
                success: false,
                message: 'Texto demasiado largo',
                details: 'El texto no puede exceder los 500 caracteres'
            });
        }

        // Obtener código de país
        const alpha3Code = countryNameToCode[geo.properties.name];
        if (!alpha3Code) {
            return res.status(404).json({
                success: false,
                message: `País no soportado: ${geo.properties.name}`,
                details: 'El país no está en nuestra base de datos'
            });
        }

        // Obtener información del idioma
        const languageInfo = countryLanguageMap[alpha3Code];
        if (!languageInfo) {
            return res.status(404).json({
                success: false,
                message: `Idioma no configurado para: ${geo.properties.name}`,
                details: 'No se encontró el idioma asociado al país'
            });
        }

        // Ajustar el código de idioma para MyMemory
        let targetLang = languageInfo.code.toLowerCase();
        if (targetLang === 'zh') targetLang = 'zh-CN';  // Chino simplificado
        if (targetLang === 'pt') targetLang = 'pt-BR';  // Portugués de Brasil

        // Buscar en caché
        const cachedTranslation = await Translation.findOne({
            originalText: text.toLowerCase().trim(),
            alpha3Code: alpha3Code
        });

        if (cachedTranslation) {
            console.log('Traducción encontrada en caché');
            return res.json({
                success: true,
                translation: cachedTranslation.translation,
                language: cachedTranslation.language,
                country: geo.properties.name,
                languageCode: languageInfo.code,
                fromCache: true
            });
        }

        // --- BLOQUEO DE PAÍSES aquí ---
        const sourceLang = await detectLanguage(text);
        const blockedCountries = getBlockedCountriesBySourceLang(sourceLang);
        
        if (blockedCountries.includes(alpha3Code)) {
            console.log(`[BLOQUEO] ❌ País bloqueado: ${geo.properties.name} (${alpha3Code}) - Idioma fuente: ${sourceLang}`);
            return res.status(403).json({
                success: false,
                message: `El país "${geo.properties.name}" está bloqueado porque su idioma principal coincide con el idioma fuente.`,
                blockedCountries,
                sourceLang,
                details: 'Debes elegir un país diferente donde no se hable ese idioma como principal.'
            });
        }

        // Traducir con sistema híbrido (DeepL + Google Fallback)
        console.log(`Traduciendo con sistema híbrido al idioma ${languageInfo.name} (${targetLang})`);
        console.log(`Texto original en: ${sourceLang}, traduciendo a: ${targetLang}`);
        // Si el idioma de origen es el mismo que el destino, no traducir
        if (sourceLang === targetLang || sourceLang === targetLang.split('-')[0]) {
            console.log('El texto ya está en el idioma destino, no se traduce');
            return res.json({
                success: true,
                translation: text,
                language: languageInfo.name,
                country: geo.properties.name,
                languageCode: targetLang,
                fromCache: false,
                note: 'El texto ya está en el idioma del país seleccionado'
            });
        }
        const translatedText = await translateText(text, sourceLang, targetLang);

        // Validar que la traducción sea válida
        if (!translatedText || translatedText.trim() === '') {
            throw new Error('La traducción devuelta está vacía');
        }

        // Guardar en caché
        try {
            const newTranslation = new Translation({
                originalText: text.toLowerCase().trim(),
                alpha3Code: alpha3Code,
                language: languageInfo.name,
                translation: translatedText
            });
            await newTranslation.save();
            console.log('Traducción guardada en caché');
        } catch (cacheError) {
            console.error('Error al guardar en caché:', cacheError);
        }

        // Enviar respuesta
        return res.json({
            success: true,
            translation: translatedText,
            language: languageInfo.name,
            country: geo.properties.name,
            languageCode: languageInfo.code,
            fromCache: false,
            blockedCountries  // Extra info opcional
        });

    } catch (error) {
        console.error('Error en el servicio de traducción:', {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        let statusCode = 500;
        let errorMessage = 'Error interno del servidor';
        let errorDetails = error.message;
        const errorMap = {
            'autenticación': { status: 401, message: 'Error de autenticación con el servicio de traducción' },
            'Tiempo de espera': { status: 504, message: 'Tiempo de espera agotado' },
            'quota exceeded': { status: 429, message: 'Cuota de traducción excedida' },
            'Too many requests': { status: 429, message: 'Demasiadas solicitudes' },
            'conectar': { status: 502, message: 'No se pudo conectar con el servicio de traducción' },
            'Language not supported': { status: 400, message: 'Idioma no soportado' },
            'Text too long': { status: 400, message: 'Texto demasiado largo' }
        };
        for (const [key, value] of Object.entries(errorMap)) {
            if (error.message.toLowerCase().includes(key.toLowerCase())) {
                statusCode = value.status;
                errorMessage = value.message;
                break;
            }
        }
        res.status(statusCode).json({
            success: false,
            message: errorMessage,
            details: errorDetails,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;