/**
 * Issue 2.5 - Sprint 2
 * Server.js - Backend completo con Express y MongoDB
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware de logging (Issue 2.11)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] INFO: ${req.method} ${req.path}`);
  next();
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: '🌍 Global Translator API - Sprint 2',
    status: 'Backend y Base de Datos conectados',
    sprint: 2,
    endpoints: {
      health: '/health',
      translateTest: 'POST /api/translate/test',
      translate: 'POST /api/translate'
    },
    database: 'MongoDB',
    version: '1.0.0'
  });
});

// Health check
app.get('/health', (req, res) => {
  const dbStatus = require('mongoose').connection.readyState;
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: dbStates[dbStatus],
    sprint: 2
  });
});

// Rutas de API - Sprint 2
const translateRoutes = require('./routes/api/translate');
app.use('/api/translate', translateRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    timestamp: new Date().toISOString()
  });
});

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] INFO: ✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`[${new Date().toISOString()}] INFO: 📍 Sprint 2 - Backend y Base de Datos`);
  console.log(`[${new Date().toISOString()}] INFO: 🌐 Entorno: ${process.env.NODE_ENV}`);
});
