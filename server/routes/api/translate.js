const express = require('express');
const router = express.Router();
const Translation = require('../../models/Translation');
const { countryLanguageMap } = require('../../data/countryLanguageMap');
const { countryNameToCode } = require('../../data/countryCodeMapping');
const deepl = require('deepl-node');

// Configuración de DeepL
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
const translator = DEEPL_API_KEY ? new deepl.Translator(DEEPL_API_KEY) : null;

// ========== DETECCIÓN DE IDIOMA AUTOMÁTICA ==========
// Usa la API de Google Translate para detectar el idioma (gratuita, sin API key)
// Soporta TODOS los idiomas automáticamente sin diccionarios manuales

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

// Función principal de detección de idioma (usa Google como método principal)
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

// --- FUNCIÓN MEJORADA ---
// Encuentra todos los países donde el idioma de origen es oficial
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

// Lista de idiomas soportados por DeepL
const DEEPL_SUPPORTED_LANGS = [
    'en', 'es', 'fr', 'de', 'it', 'pt', 'pt-BR', 'ru', 'ja', 'zh', 'zh-CN',
    'nl', 'pl', 'tr', 'sv', 'da', 'fi', 'el', 'cs', 'ro', 'hu', 'sk', 'bg',
    'uk', 'id', 'ko', 'no', 'et', 'lv', 'lt', 'sl', 'ar'
];

// Función para traducir con Google Translate (fallback gratuito)
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

// Función para realizar la traducción con DeepL
const translateWithDeepL = async (text, sourceLang, targetLang) => {
    if (!translator) {
        throw new Error('UNSUPPORTED_LANGUAGE'); // Forzar uso de Google Fallback
    }
    console.log(`[DeepL] Traduciendo de ${sourceLang} a ${targetLang}`);
    console.log(`[DeepL] Texto original: "${text}"`);
    try {
        // Mapeo de códigos de idioma para DeepL
        const deeplLangMap = {
            'en': 'EN-US', 'es': 'ES', 'fr': 'FR', 'de': 'DE', 'it': 'IT',
            'pt': 'PT-PT', 'pt-BR': 'PT-BR', 'ru': 'RU', 'ja': 'JA', 'zh': 'ZH', 'zh-CN': 'ZH',
            'nl': 'NL', 'pl': 'PL', 'tr': 'TR', 'sv': 'SV', 'da': 'DA', 'fi': 'FI', 'el': 'EL',
            'cs': 'CS', 'ro': 'RO', 'hu': 'HU', 'sk': 'SK', 'bg': 'BG', 'uk': 'UK', 'id': 'ID',
            'ko': 'KO', 'no': 'NB', 'et': 'ET', 'lv': 'LV', 'lt': 'LT', 'sl': 'SL', 'ar': 'AR',
        };
        // Convertir códigos de idioma
        const sourceDeepL = deeplLangMap[sourceLang] || sourceLang.toUpperCase();
        const targetDeepL = deeplLangMap[targetLang] || targetLang.toUpperCase();
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

// Función híbrida que intenta DeepL primero, luego Google Fallback
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

/* --- ENDPOINT NUEVO opcional: consulta de países bloqueados --- */
// @route   POST /translate/blocked-countries
// @desc    Devuelve la lista de países bloqueados para una frase
// @access  Public
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

/* --- ENDPOINT PRINCIPAL MODIFICADO --- */
// @route   POST /translate
// @desc    Translate text for a given country
// @access  Public
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