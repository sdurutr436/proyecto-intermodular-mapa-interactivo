/**
 * @file server.js
 * @description Main entry point of the backend application.
 * Configures Express server, middlewares, routes and database connection.
 * @author Intermodular Project - Interactive Map
 * @version 1.0.0
 */

// IMPORTANT: instrument.js must be the first require so Sentry captures all errors
require('./instrument.js');

require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Sentry = require('@sentry/node');

/**
 * Main Express application instance
 * @type {express.Application}
 */
const app = express();

// Connect to Database
connectDB();

/**
 * Helmet.js security configuration
 * Adds various HTTP headers to protect against common vulnerabilities
 * @middleware helmet
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

/**
 * CORS configuration to allow requests from the frontend
 * @type {Object}
 * @property {string} origin - Allowed frontend URL (from environment variable or wildcard)
 * @property {boolean} credentials - Allows sending credentials in requests
 * @property {number} optionsSuccessStatus - Status code for successful preflight requests
 */
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

// Init Middleware
app.use(cors(corsOptions));
app.use(express.json());

/**
 * Rate limiting configuration
 * Limits the number of requests from the same IP
 * @middleware rateLimit
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Maximum 500 requests per window (appropriate for interactive games)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// Apply rate limiting to all routes
app.use(limiter);

/**
 * Specific rate limiting for translation routes (stricter)
 * @middleware translateLimiter
 */
const translateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Maximum 200 translations per window
  message: 'Too many translation requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Health check endpoint for Docker healthcheck and monitoring
 * @route GET /health
 * @returns {200} - Server running correctly
 * @returns {500} - Server error
 */
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * API routes registration
 * All routes are under the /api prefix
 */
app.use('/api/translate', translateLimiter, require('./routes/api/translate'));
app.use('/api/game', require('./routes/api/game'));

/**
 * Sentry error handler - MUST be placed after all routes
 * Captures and reports unhandled errors to Sentry
 */
Sentry.setupExpressErrorHandler(app);

/**
 * Port on which the server will listen
 * @type {number}
 * @default 5000
 */
const PORT = process.env.PORT || 5000;

/**
 * Starts the Express server
 * @listens {number} PORT - Configured port for the server
 */
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));