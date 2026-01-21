// Import with import * as Sentry from "@sentry/node" if you are using ESM
const Sentry = require("@sentry/node");

// Cargar variables de entorno antes de inicializar Sentry
require('dotenv').config();

// Solo inicializar Sentry si hay un DSN configurado
const SENTRY_DSN = process.env.SENTRY_DSN;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
    environment: process.env.NODE_ENV || 'development',
    // Configurar sample rate para no enviar todos los errores en desarrollo
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 1.0 : 0.1,
  });
  console.log('✅ Sentry inicializado correctamente');
} else {
  console.log('⚠️ Sentry DSN no configurado - Monitoreo de errores deshabilitado');
}