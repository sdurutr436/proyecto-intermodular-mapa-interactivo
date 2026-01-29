/**
 * @file Translation.js
 * @description Mongoose model to store translations in cache.
 * Optimizes performance by avoiding repeated translations.
 * @module models/Translation
 */

const mongoose = require('mongoose');

/**
 * Translation schema for cache
 * @typedef {Object} Translation
 * @property {string} originalText - Original text to translate (indexed)
 * @property {string} alpha3Code - ISO Alpha-3 code of destination country (indexed)
 * @property {string} language - Name of destination language
 * @property {string} translation - Translated text
 * @property {Date} createdAt - Record creation date
 */
const TranslationSchema = new mongoose.Schema({
    originalText: {
        type: String,
        required: true,
        index: true
    },
    alpha3Code: {
        type: String,
        required: true,
        index: true
    },
    language: {
        type: String,
        required: true
    },
    translation: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/**
 * Compound index for efficient translation lookups.
 * Ensures there are no duplicate translations for the same combination
 * of original text and destination country.
 * @index {originalText, alpha3Code} - Unique compound index
 */
TranslationSchema.index({ originalText: 1, alpha3Code: 1 }, { unique: true });

module.exports = mongoose.model('translation', TranslationSchema);
