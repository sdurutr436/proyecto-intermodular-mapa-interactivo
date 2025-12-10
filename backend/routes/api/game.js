/**
 * @file game.js
 * @description Rutas de la API para el modo de juego del mapa interactivo.
 * Incluye endpoints para obtener frases/banderas aleatorias, validar respuestas,
 * gestionar estadísticas de juego y consultar el leaderboard.
 * @module routes/api/game
 */

const express = require('express');
const router = express.Router();
const phrasesDatabase = require('../../data/phrasesDatabase');
const { countriesDatabase, getFlagUrl } = require('../../data/countriesDatabase');

/**
 * @route   GET api/game/phrase
 * @desc    Obtiene una frase aleatoria en un idioma aleatorio
 * @access  Public
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
    res.status(500).json({ error: 'Error interno del servidor al generar frase' });
  }
});

/**
 * @route   GET api/game/flag
 * @desc    Obtiene una bandera aleatoria de un país
 * @access  Public
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
    res.status(500).json({ error: 'Error interno del servidor al generar bandera' });
  }
});

/**
 * @route   POST api/game/validate-flag
 * @desc    Valida si un país seleccionado es correcto para la bandera
 * @access  Public
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
 * @route   POST api/game/validate
 * @desc    Valida si un país seleccionado es correcto para el idioma
 * @access  Public
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
 * @route   GET api/game/languages
 * @desc    Obtiene la lista de todos los idiomas disponibles
 * @access  Public
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
 * @route   POST api/game/stats
 * @desc    Guarda o actualiza estadísticas de una sesión de juego
 * @access  Public
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
 * @route   GET api/game/stats/:sessionId
 * @desc    Obtiene estadísticas de una sesión específica
 * @access  Public
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
 * @route   GET api/game/leaderboard
 * @desc    Obtiene el ranking de mejores puntuaciones
 * @access  Public
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

module.exports = router;
