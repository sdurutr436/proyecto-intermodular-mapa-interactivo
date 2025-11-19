const mongoose = require('mongoose');

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

// Create a compound index for efficient lookups
TranslationSchema.index({ originalText: 1, alpha3Code: 1 }, { unique: true });

module.exports = mongoose.model('translation', TranslationSchema);
