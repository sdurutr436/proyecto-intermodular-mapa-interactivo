/**
 * @file GameStats.js
 * @description Mongoose model to store game session statistics.
 * Records attempts, correct answers, hints used and calculates final scores.
 * @module models/GameStats
 */

const mongoose = require('mongoose');

/**
 * Game statistics schema
 * @typedef {Object} GameStats
 * @property {string} sessionId - Unique session identifier
 * @property {number} attempts - Total number of attempts
 * @property {number} correct - Number of correct answers
 * @property {number} incorrect - Number of incorrect answers
 * @property {number} livesLost - Number of lives lost
 * @property {number} hintsUsed - Number of hints used
 * @property {number} phrasesSkipped - Number of phrases skipped
 * @property {boolean} gameOver - Indicates if the game has ended
 * @property {number} finalScore - Calculated final score
 * @property {Array<Object>} languagesPlayed - History of languages played
 * @property {Date} startedAt - Start date and time
 * @property {Date} endedAt - End date and time
 * @property {number} duration - Game duration in seconds
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
    type: Number, // in seconds
  },
});

/**
 * Pre-save hook that automatically calculates game duration
 * when the session ends.
 * 
 * @function
 * @param {Function} next - Mongoose callback to continue
 */
GameStatsSchema.pre('save', function(next) {
  if (this.gameOver && this.endedAt && this.startedAt) {
    this.duration = Math.floor((this.endedAt - this.startedAt) / 1000);
  }
  next();
});

/**
 * Calculates the final score based on correct answers, hints used and phrases skipped.
 * Formula: (correct * 10) - (hints * 2) - (skipped * 5)
 * 
 * @method calculateFinalScore
 * @returns {number} Final score (minimum 0)
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
