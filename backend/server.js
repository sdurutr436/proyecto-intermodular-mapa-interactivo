/**
 * @file server.js
 * @description Punto de entrada principal de la aplicación backend.
 * Configura el servidor Express, middlewares, rutas y la conexión a la base de datos.
 * @author Proyecto Intermodular - Mapa Interactivo
 * @version 1.0.0
 */

// IMPORTANTE: instrument.js debe ser el primer require para que Sentry capture todos los errores
require('./instrument.js');

require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const Sentry = require('@sentry/node');

/**
 * Instancia principal de la aplicación Express
 * @type {express.Application}
 */
const app = express();

// Connect to Database
connectDB();

/**
 * Configuración de CORS para permitir peticiones desde el frontend
 * @type {Object}
 * @property {string} origin - URL del frontend permitida (desde variable de entorno o wildcard)
 * @property {boolean} credentials - Permite el envío de credenciales en las peticiones
 * @property {number} optionsSuccessStatus - Código de estado para preflight requests exitosos
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
 * Health check endpoint para Docker healthcheck y monitoreo
 * @route GET /health
 * @returns {200} - Servidor funcionando correctamente
 * @returns {500} - Error en el servidor
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
 * Registro de rutas de la API
 * Todas las rutas están bajo el prefijo /api
 */
app.use('/api/translate', require('./routes/api/translate'));
app.use('/api/game', require('./routes/api/game'));

/**
 * Error handler de Sentry - DEBE ir después de todas las rutas
 * Captura y reporta errores no manejados a Sentry
 */
Sentry.setupExpressErrorHandler(app);

/**
 * Puerto en el que el servidor escuchará
 * @type {number}
 * @default 5000
 */
const PORT = process.env.PORT || 5000;

/**
 * Inicia el servidor Express
 * @listens {number} PORT - Puerto configurado para el servidor
 */
app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));