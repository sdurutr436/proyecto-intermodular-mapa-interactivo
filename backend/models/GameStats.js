/**
 * @file GameStats.js
 * @description Modelo de Mongoose para almacenar estadísticas de sesiones de juego.
 * Registra intentos, aciertos, pistas usadas y calcula puntuaciones finales.
 * @module models/GameStats
 */

const mongoose = require('mongoose');

/**
 * Esquema de estadísticas de juego
 * @typedef {Object} GameStats
 * @property {string} sessionId - Identificador único de la sesión
 * @property {number} attempts - Número total de intentos
 * @property {number} correct - Número de respuestas correctas
 * @property {number} incorrect - Número de respuestas incorrectas
 * @property {number} livesLost - Número de vidas perdidas
 * @property {number} hintsUsed - Número de pistas utilizadas
 * @property {number} phrasesSkipped - Número de frases saltadas
 * @property {boolean} gameOver - Indica si el juego ha terminado
 * @property {number} finalScore - Puntuación final calculada
 * @property {Array<Object>} languagesPlayed - Historial de idiomas jugados
 * @property {Date} startedAt - Fecha y hora de inicio
 * @property {Date} endedAt - Fecha y hora de finalización
 * @property {number} duration - Duración del juego en segundos
 */
const GameStatsSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  correct: {
    type: Number,
    default: 0,
  },
  incorrect: {
    type: Number,
    default: 0,
  },
  livesLost: {
    type: Number,
    default: 0,
  },
  hintsUsed: {
    type: Number,
    default: 0,
  },
  phrasesSkipped: {
    type: Number,
    default: 0,
  },
  gameOver: {
    type: Boolean,
    default: false,
  },
  finalScore: {
    type: Number,
    default: 0,
  },
  languagesPlayed: [{
    languageCode: String,
    languageName: String,
    correct: Boolean,
    countryGuessed: String,
  }],
  startedAt: {
    type: Date,
    default: Date.now,
  },
  endedAt: {
    type: Date,
  },
  duration: {
    type: Number, // en segundos
  },
});

/**
 * Hook pre-save que calcula automáticamente la duración del juego
 * cuando la sesión termina.
 * 
 * @function
 * @param {Function} next - Callback de Mongoose para continuar
 */
GameStatsSchema.pre('save', function(next) {
  if (this.gameOver && this.endedAt && this.startedAt) {
    this.duration = Math.floor((this.endedAt - this.startedAt) / 1000);
  }
  next();
});

/**
 * Calcula la puntuación final basada en aciertos, pistas usadas y frases saltadas.
 * Fórmula: (aciertos * 10) - (pistas * 2) - (saltadas * 5)
 * 
 * @method calculateFinalScore
 * @returns {number} Puntuación final (mínimo 0)
 * 
 * @example
 * const stats = new GameStats({ correct: 10, hintsUsed: 2, phrasesSkipped: 1 });
 * const score = stats.calculateFinalScore();
 * console.log(score); // 91
 */
GameStatsSchema.methods.calculateFinalScore = function() {
  const correctPoints = this.correct * 10;
  const hintsUsedPenalty = this.hintsUsed * 2;
  const skippedPenalty = this.phrasesSkipped * 5;
  
  this.finalScore = Math.max(0, correctPoints - hintsUsedPenalty - skippedPenalty);
  return this.finalScore;
};

module.exports = mongoose.model('GameStats', GameStatsSchema);
