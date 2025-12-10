/**
 * @file Translation.js
 * @description Modelo de Mongoose para almacenar traducciones en caché.
 * Optimiza el rendimiento evitando traducciones repetidas.
 * @module models/Translation
 */

const mongoose = require('mongoose');

/**
 * Esquema de traducción para caché
 * @typedef {Object} Translation
 * @property {string} originalText - Texto original a traducir (indexado)
 * @property {string} alpha3Code - Código ISO Alpha-3 del país destino (indexado)
 * @property {string} language - Nombre del idioma destino
 * @property {string} translation - Texto traducido
 * @property {Date} createdAt - Fecha de creación del registro
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
 * Índice compuesto para búsquedas eficientes de traducciones.
 * Garantiza que no haya traducciones duplicadas para la misma combinación
 * de texto original y país destino.
 * @index {originalText, alpha3Code} - Índice único compuesto
 */
TranslationSchema.index({ originalText: 1, alpha3Code: 1 }, { unique: true });

module.exports = mongoose.model('translation', TranslationSchema);
