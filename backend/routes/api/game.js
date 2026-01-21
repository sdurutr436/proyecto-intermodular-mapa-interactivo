/**
 * @file game.js
 * @description Rutas de la API para el modo de juego del mapa interactivo.
 * Incluye endpoints para obtener frases/banderas aleatorias, validar respuestas,
 * gestionar estadísticas de juego y consultar el leaderboard.
 * @module routes/api/game
 */

require("../../instrument.js")
const express = require("express");
const router = express.Router();
const phrasesDatabase = require('../../data/phrasesDatabase');
const { countriesDatabase, getFlagUrl } = require('../../data/countriesDatabase');
const Sentry = require("@sentry/node");

const app = express();

/**
 * @route   GET /api/game/phrase
 * @method  GET
 * @desc    Genera una frase aleatoria en un idioma aleatorio para el modo de juego.
 *          El jugador debe adivinar qué país usa ese idioma.
 * @access  Public
 * 
 * @returns {200} Success - Frase generada correctamente
 * @returns {500} Internal Server Error - Error en base de datos de frases
 * 
 * @example Request
 * GET /api/game/phrase
 * 
 * @example Response 200 (Success)
 * {
 *   "text": "Bonjour le monde",
 *   "languageCode": "fr",
 *   "languageName": "French",
 *   "validCountryCodes": ["FRA", "BEL", "CHE", "CAN"]
 * }
 * 
 * @example Response 500 (Error - Sin idiomas)
 * {
 *   "error": "No hay idiomas disponibles en la base de datos"
 * }
 * 
 * @example Response 500 (Error - Datos corruptos)
 * {
 *   "error": "Error al cargar datos del idioma"
 * }
 */
router.get('/phrase', async (req, res) => {
  try {
    // Obtener lista de idiomas disponibles
    const languages = Object.keys(phrasesDatabase);
    
    if (languages.length === 0) {
      return res.status(500).json({ error: 'No hay idiomas disponibles en la base de datos' });
    }

    // Seleccionar idioma aleatorio
    const randomLangCode = languages[Math.floor(Math.random() * languages.length)];
    const langData = phrasesDatabase[randomLangCode];

    if (!langData || !langData.phrases || langData.phrases.length === 0) {
      return res.status(500).json({ error: 'Error al cargar datos del idioma' });
    }

    // Seleccionar frase aleatoria
    const randomPhrase = langData.phrases[Math.floor(Math.random() * langData.phrases.length)];

    // Construir respuesta
    const response = {
      text: randomPhrase,
      languageCode: randomLangCode,
      languageName: langData.languageName,
      validCountryCodes: langData.countryCodes,
    };

    res.json(response);
  } catch (error) {
    console.error('Error al generar frase:', error);
    Sentry.captureException(error, {
      tags: {
        endpoint: '/api/game/phrase',
        operation: 'getPhrase',
      },
    });
    res.status(500).json({ error: 'Error interno del servidor al generar frase' });
  }
});

/**
 * @route   GET /api/game/flag
 * @method  GET
 * @desc    Genera una bandera aleatoria de un país para el modo de juego.
 *          El jugador debe adivinar a qué país pertenece la bandera.
 * @access  Public
 * 
 * @returns {200} Success - Bandera generada correctamente
 * @returns {500} Internal Server Error - Error en base de datos de países
 * 
 * @example Request
 * GET /api/game/flag
 * 
 * @example Response 200 (Success)
 * {
 *   "countryCode": "FRA",
 *   "countryName": "France",
 *   "continent": "Europe",
 *   "flagUrl": "https://flagcdn.com/w320/fr.png"
 * }
 * 
 * @example Response 500 (Error - Sin países)
 * {
 *   "error": "No hay países disponibles en la base de datos"
 * }
 * 
 * @example Response 500 (Error - Datos corruptos)
 * {
 *   "error": "Error al cargar datos del país"
 * }
 */
router.get('/flag', async (req, res) => {
  try {
    // Obtener lista de países disponibles
    const countryCodes = Object.keys(countriesDatabase);
    
    if (countryCodes.length === 0) {
      return res.status(500).json({ error: 'No hay países disponibles en la base de datos' });
    }

    // Seleccionar país aleatorio
    const randomCountryCode = countryCodes[Math.floor(Math.random() * countryCodes.length)];
    const countryData = countriesDatabase[randomCountryCode];
    const flagUrl = getFlagUrl(randomCountryCode);

    if (!countryData || !flagUrl) {
      return res.status(500).json({ error: 'Error al cargar datos del país' });
    }

    // Construir respuesta
    const response = {
      countryCode: randomCountryCode,
      countryName: countryData.name,
      continent: countryData.continent,
      flagUrl: flagUrl,
    };

    res.json(response);
  } catch (error) {
    console.error('Error al generar bandera:', error);
    Sentry.captureException(error, {
      tags: {
        endpoint: '/api/game/flag',
        operation: 'getFlag',
      },
    });
    res.status(500).json({ error: 'Error interno del servidor al generar bandera' });
  }
});

/**
 * @route   POST /api/game/validate-flag
 * @method  POST
 * @desc    Valida si el país seleccionado por el jugador corresponde a la bandera mostrada.
 *          Devuelve si es correcto y el nombre del país correcto.
 * @access  Public
 * 
 * @param   {Object} req.body - Cuerpo de la petición
 * @param   {string} req.body.targetCountryCode - Código ISO Alpha-3 del país correcto (ej: "FRA")
 * @param   {string} req.body.guessedCountryCode - Código ISO Alpha-3 del país seleccionado
 * 
 * @returns {200} Success - Validación completada
 * @returns {400} Bad Request - Faltan parámetros requeridos
 * @returns {404} Not Found - País no existe en base de datos
 * @returns {500} Internal Server Error - Error en validación
 * 
 * @example Request
 * POST /api/game/validate-flag
 * Content-Type: application/json
 * 
 * {
 *   "targetCountryCode": "FRA",
 *   "guessedCountryCode": "FRA"
 * }
 * 
 * @example Response 200 (Success - Correcto)
 * {
 *   "isCorrect": true,
 *   "correctCountryName": "France"
 * }
 * 
 * @example Response 200 (Success - Incorrecto)
 * {
 *   "isCorrect": false,
 *   "correctCountryName": "France"
 * }
 * 
 * @example Response 400 (Bad Request)
 * {
 *   "error": "Faltan parámetros requeridos",
 *   "details": "Se requiere targetCountryCode y guessedCountryCode"
 * }
 * 
 * @example Response 404 (Not Found)
 * {
 *   "error": "País no encontrado",
 *   "details": "El código de país 'XXX' no existe en la base de datos"
 * }
 */
router.post('/validate-flag', async (req, res) => {
  try {
    const { targetCountryCode, guessedCountryCode } = req.body;

    // Validar entrada
    if (!targetCountryCode || !guessedCountryCode) {
      return res.status(400).json({ 
        error: 'Faltan parámetros requeridos',
        details: 'Se requiere targetCountryCode y guessedCountryCode' 
      });
    }

    // Verificar que el país objetivo existe
    const targetCountry = countriesDatabase[targetCountryCode];
    if (!targetCountry) {
      return res.status(404).json({ 
        error: 'País no encontrado',
        details: `El código de país '${targetCountryCode}' no existe en la base de datos` 
      });
    }

    // Validar si el país es correcto
    const isCorrect = targetCountryCode === guessedCountryCode;

    res.json({
      isCorrect,
      correctCountryName: targetCountry.name,
    });
  } catch (error) {
    console.error('Error al validar respuesta:', error);
    res.status(500).json({ error: 'Error interno del servidor al validar respuesta' });
  }
});

/**
 * @route   POST /api/game/validate
 * @method  POST
 * @desc    Valida si el país seleccionado por el jugador habla el idioma de la frase mostrada.
 *          Devuelve si es correcto, el nombre del idioma y los países válidos.
 * @access  Public
 * 
 * @param   {Object} req.body - Cuerpo de la petición
 * @param   {string} req.body.languageCode - Código ISO 639-1 del idioma (ej: "fr", "es", "en")
 * @param   {string} req.body.countryCode - Código ISO Alpha-3 del país seleccionado (ej: "FRA")
 * 
 * @returns {200} Success - Validación completada
 * @returns {400} Bad Request - Faltan parámetros requeridos
 * @returns {404} Not Found - Idioma no existe en base de datos
 * @returns {500} Internal Server Error - Error en validación
 * 
 * @example Request
 * POST /api/game/validate
 * Content-Type: application/json
 * 
 * {
 *   "languageCode": "fr",
 *   "countryCode": "FRA"
 * }
 * 
 * @example Response 200 (Success - Correcto)
 * {
 *   "isCorrect": true,
 *   "languageName": "French",
 *   "validCountryCodes": ["FRA", "BEL", "CHE", "CAN"]
 * }
 * 
 * @example Response 200 (Success - Incorrecto)
 * {
 *   "isCorrect": false,
 *   "languageName": "French",
 *   "validCountryCodes": ["FRA", "BEL", "CHE", "CAN"]
 * }
 * 
 * @example Response 400 (Bad Request)
 * {
 *   "error": "Faltan parámetros requeridos",
 *   "details": "Se requiere languageCode y countryCode"
 * }
 * 
 * @example Response 404 (Not Found)
 * {
 *   "error": "Idioma no encontrado",
 *   "details": "El código de idioma 'xx' no existe en la base de datos"
 * }
 */
router.post('/validate', async (req, res) => {
  try {
    const { languageCode, countryCode } = req.body;

    // Validar entrada
    if (!languageCode || !countryCode) {
      return res.status(400).json({ 
        error: 'Faltan parámetros requeridos',
        details: 'Se requiere languageCode y countryCode' 
      });
    }

    // Verificar que el idioma existe
    const langData = phrasesDatabase[languageCode];
    if (!langData) {
      return res.status(404).json({ 
        error: 'Idioma no encontrado',
        details: `El código de idioma '${languageCode}' no existe en la base de datos` 
      });
    }

    // Validar si el país es correcto
    const isCorrect = langData.countryCodes.includes(countryCode);

    res.json({
      isCorrect,
      languageName: langData.languageName,
      validCountryCodes: langData.countryCodes,
    });
  } catch (error) {
    console.error('Error al validar respuesta:', error);
    res.status(500).json({ error: 'Error interno del servidor al validar respuesta' });
  }
});

/**
 * @route   GET /api/game/languages
 * @method  GET
 * @desc    Obtiene la lista completa de todos los idiomas disponibles en el modo de juego,
 *          incluyendo metadatos como número de países y frases disponibles.
 * @access  Public
 * 
 * @returns {200} Success - Lista de idiomas obtenida
 * @returns {500} Internal Server Error - Error al consultar base de datos
 * 
 * @example Request
 * GET /api/game/languages
 * 
 * @example Response 200 (Success)
 * {
 *   "total": 50,
 *   "languages": [
 *     {
 *       "code": "es",
 *       "name": "Spanish",
 *       "countriesCount": 21,
 *       "phrasesCount": 15
 *     },
 *     {
 *       "code": "fr",
 *       "name": "French",
 *       "countriesCount": 4,
 *       "phrasesCount": 12
 *     }
 *   ]
 * }
 * 
 * @example Response 500 (Internal Server Error)
 * {
 *   "error": "Error interno del servidor al obtener idiomas"
 * }
 */
router.get('/languages', async (req, res) => {
  try {
    const languages = Object.keys(phrasesDatabase).map(code => ({
      code,
      name: phrasesDatabase[code].languageName,
      countriesCount: phrasesDatabase[code].countryCodes.length,
      phrasesCount: phrasesDatabase[code].phrases.length,
    }));

    res.json({
      total: languages.length,
      languages,
    });
  } catch (error) {
    console.error('Error al obtener idiomas:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener idiomas' });
  }
});

/**
 * @route   POST /api/game/stats
 * @method  POST
 * @desc    Guarda o actualiza las estadísticas de una sesión de juego en MongoDB.
 *          Si es la primera vez, crea una nueva entrada. Si ya existe, actualiza los datos.
 *          Cuando gameOver=true, calcula la puntuación final automáticamente.
 * @access  Public
 * 
 * @param   {Object} req.body - Cuerpo de la petición
 * @param   {string} req.body.sessionId - ID único de la sesión (requerido)
 * @param   {number} [req.body.correct] - Número de respuestas correctas
 * @param   {number} [req.body.attempts] - Número total de intentos
 * @param   {boolean} [req.body.gameOver] - Indica si el juego ha terminado
 * @param   {number} [req.body.duration] - Duración del juego en segundos
 * @param   {Object} [req.body.*] - Cualquier otro campo del modelo GameStats
 * 
 * @returns {200} Success - Estadísticas guardadas/actualizadas
 * @returns {400} Bad Request - Falta sessionId
 * @returns {500} Internal Server Error - Error en base de datos
 * 
 * @example Request (Nueva sesión)
 * POST /api/game/stats
 * Content-Type: application/json
 * 
 * {
 *   "sessionId": "abc123-def456",
 *   "correct": 0,
 *   "attempts": 0,
 *   "gameOver": false
 * }
 * 
 * @example Request (Actualizar durante juego)
 * POST /api/game/stats
 * Content-Type: application/json
 * 
 * {
 *   "sessionId": "abc123-def456",
 *   "correct": 5,
 *   "attempts": 8,
 *   "gameOver": false
 * }
 * 
 * @example Request (Finalizar juego)
 * POST /api/game/stats
 * Content-Type: application/json
 * 
 * {
 *   "sessionId": "abc123-def456",
 *   "correct": 10,
 *   "attempts": 15,
 *   "gameOver": true,
 *   "duration": 180
 * }
 * 
 * @example Response 200 (Success)
 * {
 *   "success": true,
 *   "stats": {
 *     "sessionId": "abc123-def456",
 *     "correct": 10,
 *     "attempts": 15,
 *     "finalScore": 850,
 *     "gameOver": true,
 *     "startedAt": "2025-12-10T00:30:00.000Z",
 *     "endedAt": "2025-12-10T00:33:00.000Z",
 *     "duration": 180
 *   }
 * }
 * 
 * @example Response 400 (Bad Request)
 * {
 *   "error": "Se requiere sessionId"
 * }
 * 
 * @example Response 500 (Internal Server Error)
 * {
 *   "error": "Error interno del servidor al guardar estadísticas"
 * }
 */
router.post('/stats', async (req, res) => {
  try {
    const GameStats = require('../../models/GameStats');
    const { sessionId, ...statsData } = req.body;

    if (!sessionId) {
      return res.status(400).json({ 
        error: 'Se requiere sessionId' 
      });
    }

    // Buscar sesión existente o crear nueva
    let gameStats = await GameStats.findOne({ sessionId });

    if (gameStats) {
      // Actualizar estadísticas existentes
      Object.assign(gameStats, statsData);
    } else {
      // Crear nueva sesión
      gameStats = new GameStats({
        sessionId,
        ...statsData,
      });
    }

    // Si el juego terminó, calcular puntuación final
    if (statsData.gameOver) {
      gameStats.endedAt = new Date();
      gameStats.calculateFinalScore();
    }

    await gameStats.save();

    res.json({
      success: true,
      stats: gameStats,
    });
  } catch (error) {
    console.error('Error al guardar estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor al guardar estadísticas' });
  }
});

/**
 * @route   GET /api/game/stats/:sessionId
 * @method  GET
 * @desc    Obtiene las estadísticas completas de una sesión de juego específica.
 *          Útil para recuperar el progreso de una partida guardada.
 * @access  Public
 * 
 * @param   {string} req.params.sessionId - ID único de la sesión
 * 
 * @returns {200} Success - Estadísticas obtenidas
 * @returns {404} Not Found - Sesión no existe
 * @returns {500} Internal Server Error - Error en base de datos
 * 
 * @example Request
 * GET /api/game/stats/abc123-def456
 * 
 * @example Response 200 (Success)
 * {
 *   "sessionId": "abc123-def456",
 *   "correct": 10,
 *   "attempts": 15,
 *   "finalScore": 850,
 *   "gameOver": true,
 *   "startedAt": "2025-12-10T00:30:00.000Z",
 *   "endedAt": "2025-12-10T00:33:00.000Z",
 *   "duration": 180
 * }
 * 
 * @example Response 404 (Not Found)
 * {
 *   "error": "Sesión no encontrada"
 * }
 * 
 * @example Response 500 (Internal Server Error)
 * {
 *   "error": "Error interno del servidor al obtener estadísticas"
 * }
 */
router.get('/stats/:sessionId', async (req, res) => {
  try {
    const GameStats = require('../../models/GameStats');
    const { sessionId } = req.params;

    const gameStats = await GameStats.findOne({ sessionId });

    if (!gameStats) {
      return res.status(404).json({ 
        error: 'Sesión no encontrada' 
      });
    }

    res.json(gameStats);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener estadísticas' });
  }
});

/**
 * @route   GET /api/game/leaderboard
 * @method  GET
 * @desc    Obtiene el ranking global de mejores puntuaciones de todos los jugadores.
 *          Solo incluye sesiones finalizadas (gameOver=true), ordenadas por puntuación final.
 * @access  Public
 * 
 * @query   {number} [limit=10] - Número máximo de resultados a devolver (por defecto: 10)
 * 
 * @returns {200} Success - Leaderboard obtenido
 * @returns {500} Internal Server Error - Error en base de datos
 * 
 * @example Request (Por defecto - Top 10)
 * GET /api/game/leaderboard
 * 
 * @example Request (Top 50)
 * GET /api/game/leaderboard?limit=50
 * 
 * @example Response 200 (Success)
 * {
 *   "total": 10,
 *   "leaderboard": [
 *     {
 *       "sessionId": "xyz789-abc123",
 *       "correct": 15,
 *       "attempts": 18,
 *       "finalScore": 1200,
 *       "startedAt": "2025-12-10T00:20:00.000Z",
 *       "duration": 120
 *     },
 *     {
 *       "sessionId": "def456-ghi789",
 *       "correct": 12,
 *       "attempts": 15,
 *       "finalScore": 950,
 *       "startedAt": "2025-12-10T00:25:00.000Z",
 *       "duration": 150
 *     }
 *   ]
 * }
 * 
 * @example Response 200 (Success - Vacío)
 * {
 *   "total": 0,
 *   "leaderboard": []
 * }
 * 
 * @example Response 500 (Internal Server Error)
 * {
 *   "error": "Error interno del servidor al obtener leaderboard"
 * }
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const GameStats = require('../../models/GameStats');
    const limit = parseInt(req.query.limit) || 10;

    const leaderboard = await GameStats.find({ gameOver: true })
      .sort({ finalScore: -1 })
      .limit(limit)
      .select('sessionId correct attempts finalScore startedAt duration');

    res.json({
      total: leaderboard.length,
      leaderboard,
    });
  } catch (error) {
    console.error('Error al obtener leaderboard:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener leaderboard' });
  }
});

/**
 * @route   GET /api/game/test-error
 * @method  GET
 * @desc    Ruta de prueba que genera un error intencionalmente para verificar que Sentry captura errores.
 *          Esta ruta NO debe usarse en producción.
 * @access  Public
 * 
 * @returns {500} Internal Server Error - Error capturado por Sentry
 * 
 * @example Request
 * GET /api/game/test-error
 */

router.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

module.exports = router;