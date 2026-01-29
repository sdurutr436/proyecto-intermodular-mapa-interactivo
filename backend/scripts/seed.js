/**
 * @file seed.js
 * @description Script to populate the database with initial translation data.
 * @module scripts/seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Translation = require('../models/Translation');

/**
 * Initial translation data for cache
 * @constant {Array<Object>}
 */
const initialTranslations = [
  // Spanish -> Other languages
  {
    originalText: 'hello',
    alpha3Code: 'ESP',
    language: 'Spanish',
    translation: 'Hola'
  },
  {
    originalText: 'hello',
    alpha3Code: 'FRA',
    language: 'French',
    translation: 'Bonjour'
  },
  {
    originalText: 'hello',
    alpha3Code: 'DEU',
    language: 'German',
    translation: 'Hallo'
  },
  {
    originalText: 'hello',
    alpha3Code: 'ITA',
    language: 'Italian',
    translation: 'Ciao'
  },
  {
    originalText: 'hello',
    alpha3Code: 'JPN',
    language: 'Japanese',
    translation: 'こんにちは'
  },
  {
    originalText: 'hello',
    alpha3Code: 'CHN',
    language: 'Chinese',
    translation: '你好'
  },
  {
    originalText: 'hello',
    alpha3Code: 'RUS',
    language: 'Russian',
    translation: 'Привет'
  },
  {
    originalText: 'hello',
    alpha3Code: 'PRT',
    language: 'Portuguese',
    translation: 'Olá'
  },
  {
    originalText: 'hello',
    alpha3Code: 'NLD',
    language: 'Dutch',
    translation: 'Hallo'
  },
  {
    originalText: 'hello',
    alpha3Code: 'SWE',
    language: 'Swedish',
    translation: 'Hej'
  },
  // Good morning
  {
    originalText: 'good morning',
    alpha3Code: 'ESP',
    language: 'Spanish',
    translation: 'Buenos días'
  },
  {
    originalText: 'good morning',
    alpha3Code: 'FRA',
    language: 'French',
    translation: 'Bonjour'
  },
  {
    originalText: 'good morning',
    alpha3Code: 'DEU',
    language: 'German',
    translation: 'Guten Morgen'
  },
  {
    originalText: 'good morning',
    alpha3Code: 'ITA',
    language: 'Italian',
    translation: 'Buongiorno'
  },
  {
    originalText: 'good morning',
    alpha3Code: 'JPN',
    language: 'Japanese',
    translation: 'おはようございます'
  },
  // Thank you
  {
    originalText: 'thank you',
    alpha3Code: 'ESP',
    language: 'Spanish',
    translation: 'Gracias'
  },
  {
    originalText: 'thank you',
    alpha3Code: 'FRA',
    language: 'French',
    translation: 'Merci'
  },
  {
    originalText: 'thank you',
    alpha3Code: 'DEU',
    language: 'German',
    translation: 'Danke'
  },
  {
    originalText: 'thank you',
    alpha3Code: 'ITA',
    language: 'Italian',
    translation: 'Grazie'
  },
  {
    originalText: 'thank you',
    alpha3Code: 'JPN',
    language: 'Japanese',
    translation: 'ありがとう'
  },
  // Goodbye
  {
    originalText: 'goodbye',
    alpha3Code: 'ESP',
    language: 'Spanish',
    translation: 'Adiós'
  },
  {
    originalText: 'goodbye',
    alpha3Code: 'FRA',
    language: 'French',
    translation: 'Au revoir'
  },
  {
    originalText: 'goodbye',
    alpha3Code: 'DEU',
    language: 'German',
    translation: 'Auf Wiedersehen'
  },
  {
    originalText: 'goodbye',
    alpha3Code: 'ITA',
    language: 'Italian',
    translation: 'Arrivederci'
  },
  {
    originalText: 'goodbye',
    alpha3Code: 'JPN',
    language: 'Japanese',
    translation: 'さようなら'
  }
];

/**
 * Connects to the MongoDB database
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} If connection fails
 */
async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/translator';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

/**
 * Populates the translations collection with initial data
 * @async
 * @function seedTranslations
 * @returns {Promise<number>} Number of translations inserted
 */
async function seedTranslations() {
  try {
    // Clear existing collection
    await Translation.deleteMany({});
    console.log('🗑️  Translations collection cleared');

    // Insert new data
    const result = await Translation.insertMany(initialTranslations);
    console.log(`✅ ${result.length} translations inserted`);
    return result.length;
  } catch (error) {
    console.error('❌ Error populating translations:', error.message);
    throw error;
  }
}

/**
 * Executes the complete seeding process
 * @async
 * @function runSeed
 */
async function runSeed() {
  console.log('🌱 Starting seeding process...\n');

  try {
    await connectDB();
    
    const translationsCount = await seedTranslations();

    console.log('\n✨ Seeding process completed successfully!');
    console.log(`📊 Total: ${translationsCount} translations inserted\n`);
  } catch (error) {
    console.error('\n❌ Error in seeding process:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runSeed();
}

module.exports = { runSeed, seedTranslations };
