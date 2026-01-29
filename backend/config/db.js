/**
 * @file db.js
 * @description MongoDB database configuration and connection using Mongoose.
 * @module config/db
 */

const mongoose = require('mongoose');

/**
 * Establishes connection with MongoDB database.
 * Reads connection URI from MONGO_URI environment variable.
 * If connection fails, process exits with error code 1.
 * 
 * @async
 * @function connectDB
 * @returns {Promise<void>} Promise that resolves when connection is established successfully
 * @throws {Error} If unable to establish connection with MongoDB
 * 
 * @example
 * // Typical usage in server.js
 * const connectDB = require('./config/db');
 * connectDB();
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
        // Critical error - server cannot function without database
        process.exit(1);
    }
};

module.exports = connectDB;
