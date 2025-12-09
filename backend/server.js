require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// Connect to Database
connectDB();

// Init Middleware
// Configurar CORS para permitir el frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Define Routes - Standardizing to /api prefix
app.use('/api/translate', require('./routes/api/translate'));
app.use('/api/game', require('./routes/api/game'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));