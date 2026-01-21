/**
 * @file sentry.ts
 * @description Configuración de Sentry para el frontend React
 * @module sentry
 */

import * as Sentry from "@sentry/react";

/**
 * Inicializa Sentry para capturar errores y monitoreo de performance
 */
export const initSentry = () => {
  const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

  // Solo inicializar si hay DSN configurado
  if (!SENTRY_DSN) {
    console.warn('⚠️ VITE_SENTRY_DSN no configurado - Monitoreo de errores deshabilitado');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: import.meta.env.PROD ? 1.0 : 0.1,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    sendDefaultPii: false,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });

  console.log('✅ Sentry inicializado correctamente en frontend');
};
