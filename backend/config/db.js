/**
 * @file db.js
 * @description Configuración y conexión a la base de datos MongoDB usando Mongoose.
 * @module config/db
 */

const mongoose = require('mongoose');

/**
 * Establece la conexión con la base de datos MongoDB.
 * Lee la URI de conexión desde la variable de entorno MONGO_URI.
 * Si la conexión falla, el proceso termina con código de error 1.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>} Promesa que se resuelve cuando la conexión se establece correctamente
 * @throws {Error} Si no se puede establecer la conexión con MongoDB
 * 
 * @example
 * // Uso típico en server.js
 * const connectDB = require('./config/db');
 * connectDB();
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
