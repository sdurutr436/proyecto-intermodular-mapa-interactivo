/**
 * @file server.js
 * @description Punto de entrada principal de la aplicación backend.
 * Configura el servidor Express, middlewares, rutas y la conexión a la base de datos.
 * @author Proyecto Intermodular - Mapa Interactivo
 * @version 1.0.0
 */

require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

/**
 * Instancia principal de la aplicación Express
 * @type {express.Application}
 */
const app = express();

// Connect to Database
connectDB();

/**
 * Configuración de seguridad con Helmet.js
 * Añade varios headers HTTP para proteger contra vulnerabilidades comunes
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
 * Configuración de rate limiting
 * Limita el número de peticiones desde una misma IP
 * @middleware rateLimit
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 500, // Máximo 500 peticiones por ventana (apropiado para juegos interactivos)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});

// Aplicar rate limiting a todas las rutas
app.use(limiter);

/**
 * Rate limiting específico para rutas de traducción (más estricto)
 * @middleware translateLimiter
 */
const translateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // Máximo 200 traducciones por ventana
  message: 'Too many translation requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

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
app.use('/api/translate', translateLimiter, require('./routes/api/translate'));
app.use('/api/game', require('./routes/api/game'));

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