const mongoose = require('mongoose');

/**
 * Issue 2.2 - Sprint 2
 * Conecta a MongoDB usando Mongoose
 * Maneja eventos de conexión, error y desconexión
 * Implementa lógica de reconexión automática
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`[${new Date().toISOString()}] INFO: MongoDB conectado: ${conn.connection.host}`);

    // Evento: Conexión establecida
    mongoose.connection.on('connected', () => {
      console.log(`[${new Date().toISOString()}] INFO: Mongoose conectado a MongoDB`);
    });

    // Evento: Error de conexión
    mongoose.connection.on('error', (err) => {
      console.error(`[${new Date().toISOString()}] ERROR: Error de conexión a MongoDB:`, err);
    });

    // Evento: Desconexión
    mongoose.connection.on('disconnected', () => {
      console.log(`[${new Date().toISOString()}] WARN: Mongoose desconectado de MongoDB`);
    });

    // Manejo de cierre de aplicación
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log(`[${new Date().toISOString()}] INFO: Conexión a MongoDB cerrada debido a terminación de la aplicación`);
      process.exit(0);
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] ERROR: Error al conectar a MongoDB:`, error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
