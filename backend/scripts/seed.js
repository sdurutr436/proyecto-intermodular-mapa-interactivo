/**
 * @file seed.js
 * @description Script para poblar la base de datos con datos iniciales de traducciones.
 * @module scripts/seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Translation = require('../models/Translation');

/**
 * Datos de traducciones iniciales para el caché
 * @constant {Array<Object>}
 */
const initialTranslations = [
  // Español -> Otros idiomas
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
 * Conecta a la base de datos MongoDB
 * @async
 * @function connectDB
 * @returns {Promise<void>}
 * @throws {Error} Si la conexión falla
 */
async function connectDB() {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/translator';
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
}

/**
 * Pobla la colección de traducciones con datos iniciales
 * @async
 * @function seedTranslations
 * @returns {Promise<number>} Número de traducciones insertadas
 */
async function seedTranslations() {
  try {
    // Limpiar colección existente
    await Translation.deleteMany({});
    console.log('🗑️  Colección de traducciones limpiada');

    // Insertar nuevos datos
    const result = await Translation.insertMany(initialTranslations);
    console.log(`✅ ${result.length} traducciones insertadas`);
    return result.length;
  } catch (error) {
    console.error('❌ Error poblando traducciones:', error.message);
    throw error;
  }
}

/**
 * Ejecuta el proceso completo de seeding
 * @async
 * @function runSeed
 */
async function runSeed() {
  console.log('🌱 Iniciando proceso de seeding...\n');

  try {
    await connectDB();
    
    const translationsCount = await seedTranslations();

    console.log('\n✨ Proceso de seeding completado exitosamente!');
    console.log(`📊 Total: ${translationsCount} traducciones insertadas\n`);
  } catch (error) {
    console.error('\n❌ Error en el proceso de seeding:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runSeed();
}

module.exports = { runSeed, seedTranslations };
