require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ruta de prueba básica - Sprint 1
app.get('/', (req, res) => {
    res.json({
        message: '🌍 Global Translator API - Sprint 1',
        status: 'Configuración básica completada',
        sprint: 1,
        endpoints: {
            health: '/health',
            test: '/api/test'
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Endpoint de prueba
app.get('/api/test', (req, res) => {
    res.json({
        message: 'API funcionando correctamente',
        sprint: 1,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
    console.log(`📍 Sprint 1 - Configuración básica completada`);
});
