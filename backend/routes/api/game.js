/**
 * @file game.js
 * @description API routes for the interactive map game mode.
 * Includes endpoints to get random phrases/flags, validate answers,
 * manage game statistics and query the leaderboard.
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
 * @desc    Generates a random phrase in a random language for the game mode.
 *          The player must guess which country uses that language.
 * @access  Public
 * 
 * @returns {200} Success - Phrase generated successfully
 * @returns {500} Internal Server Error - Error in phrase database
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
 * @example Response 500 (Error - No languages)
 * {
 *   "error": "No languages available in the database"
 * }
 * 
 * @example Response 500 (Error - Corrupted data)
 * {
 *   "error": "Error loading language data"
 * }
 */
router.get('/phrase', async (req, res) => {
  try {
    // Get list of available languages
    const languages = Object.keys(phrasesDatabase);
    
    if (languages.length === 0) {
      return res.status(500).json({ error: 'No languages available in the database' });
    }

    // Select random language
    const randomLangCode = languages[Math.floor(Math.random() * languages.length)];
    const langData = phrasesDatabase[randomLangCode];

    if (!langData || !langData.phrases || langData.phrases.length === 0) {
      return res.status(500).json({ error: 'Error loading language data' });
    }

    // Select random phrase
    const randomPhrase = langData.phrases[Math.floor(Math.random() * langData.phrases.length)];

    // Build response
    const response = {
      text: randomPhrase,
      languageCode: randomLangCode,
      languageName: langData.languageName,
      validCountryCodes: langData.countryCodes,
    };

    res.json(response);
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        endpoint: '/api/game/phrase',
        operation: 'getPhrase',
      },
    });
    res.status(500).json({ error: 'Internal server error generating phrase' });
  }
});

/**
 * @route   GET /api/game/flag
 * @method  GET
 * @desc    Generates a random flag from a country for the game mode.
 *          The player must guess which country the flag belongs to.
 * @access  Public
 * 
 * @returns {200} Success - Flag generated successfully
 * @returns {500} Internal Server Error - Error in country database
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
 * @example Response 500 (Error - No countries)
 * {
 *   "error": "No countries available in the database"
 * }
 * 
 * @example Response 500 (Error - Corrupted data)
 * {
 *   "error": "Error loading country data"
 * }
 */
router.get('/flag', async (req, res) => {
  try {
    // Get list of available countries
    const countryCodes = Object.keys(countriesDatabase);
    
    if (countryCodes.length === 0) {
      return res.status(500).json({ error: 'No countries available in the database' });
    }

    // Select random country
    const randomCountryCode = countryCodes[Math.floor(Math.random() * countryCodes.length)];
    const countryData = countriesDatabase[randomCountryCode];
    const flagUrl = getFlagUrl(randomCountryCode);

    if (!countryData || !flagUrl) {
      return res.status(500).json({ error: 'Error loading country data' });
    }

    // Build response
    const response = {
      countryCode: randomCountryCode,
      countryName: countryData.name,
      continent: countryData.continent,
      flagUrl: flagUrl,
    };

    res.json(response);
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        endpoint: '/api/game/flag',
        operation: 'getFlag',
      },
    });
    res.status(500).json({ error: 'Internal server error generating flag' });
  }
});

/**
 * @route   POST /api/game/validate-flag
 * @method  POST
 * @desc    Validates if the country selected by the player corresponds to the shown flag.
 *          Returns if correct and the name of the correct country.
 * @access  Public
 * 
 * @param   {Object} req.body - Request body
 * @param   {string} req.body.targetCountryCode - ISO Alpha-3 code of the correct country (e.g.: "FRA")
 * @param   {string} req.body.guessedCountryCode - ISO Alpha-3 code of the selected country
 * 
 * @returns {200} Success - Validation completed
 * @returns {400} Bad Request - Missing required parameters
 * @returns {404} Not Found - Country does not exist in database
 * @returns {500} Internal Server Error - Validation error
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
 *   "error": "Missing required parameters",
 *   "details": "targetCountryCode and guessedCountryCode are required"
 * }
 * 
 * @example Response 404 (Not Found)
 * {
 *   "error": "Country not found",
 *   "details": "Country code 'XXX' does not exist in the database"
 * }
 */
router.post('/validate-flag', async (req, res) => {
  try {
    const { targetCountryCode, guessedCountryCode } = req.body;

    // Validate input
    if (!targetCountryCode || !guessedCountryCode) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        details: 'targetCountryCode and guessedCountryCode are required' 
      });
    }

    // Verify that the target country exists
    const targetCountry = countriesDatabase[targetCountryCode];
    if (!targetCountry) {
      return res.status(404).json({ 
        error: 'Country not found',
        details: `Country code '${targetCountryCode}' does not exist in the database` 
      });
    }

    // Validate if the country is correct
    const isCorrect = targetCountryCode === guessedCountryCode;

    res.json({
      isCorrect,
      correctCountryName: targetCountry.name,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error validating answer' });
  }
});

/**
 * @route   POST /api/game/validate
 * @method  POST
 * @desc    Validates if the country selected by the player speaks the language of the shown phrase.
 *          Returns if correct, the language name and the valid countries.
 * @access  Public
 * 
 * @param   {Object} req.body - Request body
 * @param   {string} req.body.languageCode - ISO 639-1 language code (e.g.: "fr", "es", "en")
 * @param   {string} req.body.countryCode - ISO Alpha-3 code of the selected country (e.g.: "FRA")
 * 
 * @returns {200} Success - Validation completed
 * @returns {400} Bad Request - Missing required parameters
 * @returns {404} Not Found - Language does not exist in database
 * @returns {500} Internal Server Error - Validation error
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
 *   "error": "Missing required parameters",
 *   "details": "languageCode and countryCode are required"
 * }
 * 
 * @example Response 404 (Not Found)
 * {
 *   "error": "Language not found",
 *   "details": "Language code 'xx' does not exist in the database"
 * }
 */
router.post('/validate', async (req, res) => {
  try {
    const { languageCode, countryCode } = req.body;

    // Validate input
    if (!languageCode || !countryCode) {
      return res.status(400).json({ 
        error: 'Missing required parameters',
        details: 'languageCode and countryCode are required' 
      });
    }

    // Verify that the language exists
    const langData = phrasesDatabase[languageCode];
    if (!langData) {
      return res.status(404).json({ 
        error: 'Language not found',
        details: `Language code '${languageCode}' does not exist in the database` 
      });
    }

    // Validate if the country is correct
    const isCorrect = langData.countryCodes.includes(countryCode);

    res.json({
      isCorrect,
      languageName: langData.languageName,
      validCountryCodes: langData.countryCodes,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error validating answer' });
  }
});

/**
 * @route   GET /api/game/languages
 * @method  GET
 * @desc    Gets the complete list of all available languages in the game mode,
 *          including metadata like number of countries and phrases available.
 * @access  Public
 * 
 * @returns {200} Success - Language list obtained
 * @returns {500} Internal Server Error - Error querying database
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
 *   "error": "Internal server error getting languages"
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
    res.status(500).json({ error: 'Internal server error getting languages' });
  }
});

/**
 * @route   POST /api/game/stats
 * @method  POST
 * @desc    Saves or updates game session statistics in MongoDB.
 *          If first time, creates a new entry. If exists, updates data.
 *          When gameOver=true, calculates final score automatically.
 * @access  Public
 * 
 * @param   {Object} req.body - Request body
 * @param   {string} req.body.sessionId - Unique session ID (required)
 * @param   {number} [req.body.correct] - Number of correct answers
 * @param   {number} [req.body.attempts] - Total number of attempts
 * @param   {boolean} [req.body.gameOver] - Indicates if game has ended
 * @param   {number} [req.body.duration] - Game duration in seconds
 * @param   {Object} [req.body.*] - Any other field from GameStats model
 * 
 * @returns {200} Success - Statistics saved/updated
 * @returns {400} Bad Request - Missing sessionId
 * @returns {500} Internal Server Error - Database error
 * 
 * @example Request (New session)
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
 * @example Request (Update during game)
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
 * @example Request (End game)
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
 *   "error": "sessionId is required"
 * }
 * 
 * @example Response 500 (Internal Server Error)
 * {
 *   "error": "Internal server error saving statistics"
 * }
 */
router.post('/stats', async (req, res) => {
  try {
    const GameStats = require('../../models/GameStats');
    const { sessionId, ...statsData } = req.body;

    if (!sessionId) {
      return res.status(400).json({ 
        error: 'sessionId is required' 
      });
    }

    // Find existing session or create new
    let gameStats = await GameStats.findOne({ sessionId });

    if (gameStats) {
      // Update existing statistics
      Object.assign(gameStats, statsData);
    } else {
      // Create new session
      gameStats = new GameStats({
        sessionId,
        ...statsData,
      });
    }

    // If game ended, calculate final score
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
    res.status(500).json({ error: 'Internal server error saving statistics' });
  }
});

/**
 * @route   GET /api/game/stats/:sessionId
 * @method  GET
 * @desc    Gets the complete statistics of a specific game session.
 *          Useful for recovering the progress of a saved game.
 * @access  Public
 * 
 * @param   {string} req.params.sessionId - Unique session ID
 * 
 * @returns {200} Success - Statistics obtained
 * @returns {404} Not Found - Session does not exist
 * @returns {500} Internal Server Error - Database error
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
 *   "error": "Session not found"
 * }
 * 
 * @example Response 500 (Internal Server Error)
 * {
 *   "error": "Internal server error getting statistics"
 * }
 */
router.get('/stats/:sessionId', async (req, res) => {
  try {
    const GameStats = require('../../models/GameStats');
    const { sessionId } = req.params;

    const gameStats = await GameStats.findOne({ sessionId });

    if (!gameStats) {
      return res.status(404).json({ 
        error: 'Session not found' 
      });
    }

    res.json(gameStats);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error getting statistics' });
  }
});

/**
 * @route   GET /api/game/leaderboard
 * @method  GET
 * @desc    Gets the global ranking of best scores from all players.
 *          Only includes finished sessions (gameOver=true), sorted by final score.
 * @access  Public
 * 
 * @query   {number} [limit=10] - Maximum number of results to return (default: 10)
 * 
 * @returns {200} Success - Leaderboard obtained
 * @returns {500} Internal Server Error - Database error
 * 
 * @example Request (Default - Top 10)
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
 * @example Response 200 (Success - Empty)
 * {
 *   "total": 0,
 *   "leaderboard": []
 * }
 * 
 * @example Response 500 (Internal Server Error)
 * {
 *   "error": "Internal server error getting leaderboard"
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
    res.status(500).json({ error: 'Internal server error getting leaderboard' });
  }
});

/**
 * @route   GET /api/game/test-error
 * @method  GET
 * @desc    Test route that intentionally generates an error to verify that Sentry captures errors.
 *          This route should NOT be used in production.
 * @access  Public
 * 
 * @returns {500} Internal Server Error - Error captured by Sentry
 * 
 * @example Request
 * GET /api/game/test-error
 */

router.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

module.exports = router;