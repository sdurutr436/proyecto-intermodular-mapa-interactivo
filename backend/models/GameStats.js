// server/models/GameStats.js

const mongoose = require('mongoose');

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

// Calcular duración antes de guardar
GameStatsSchema.pre('save', function(next) {
  if (this.gameOver && this.endedAt && this.startedAt) {
    this.duration = Math.floor((this.endedAt - this.startedAt) / 1000);
  }
  next();
});

// Método para calcular puntuación final
GameStatsSchema.methods.calculateFinalScore = function() {
  const correctPoints = this.correct * 10;
  const hintsUsedPenalty = this.hintsUsed * 2;
  const skippedPenalty = this.phrasesSkipped * 5;
  
  this.finalScore = Math.max(0, correctPoints - hintsUsedPenalty - skippedPenalty);
  return this.finalScore;
};

module.exports = mongoose.model('GameStats', GameStatsSchema);
