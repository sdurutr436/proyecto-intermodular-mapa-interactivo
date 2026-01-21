/**
 * @fileoverview Cliente HTTP centralizado con Axios
 * @module services/apiClient
 * @description Configuración de axios con interceptores, timeouts y manejo de errores.
 * Punto único de configuración para todas las llamadas API del frontend.
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import * as Sentry from '@sentry/react';

/**
 * URL base de la API backend obtenida de variables de entorno
 * @constant
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Instancia de axios configurada con valores por defecto
 * @constant
 * @type {AxiosInstance}
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 segundos
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Cambiar a true si usas cookies/sesiones
});

/**
 * Interceptor de peticiones
 * Se ejecuta antes de cada petición HTTP
 * Útil para añadir tokens de autenticación, logging, etc.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Logging en desarrollo
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    // Aquí puedes añadir headers de autenticación si los necesitas:
    // const token = localStorage.getItem('auth_token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

/**
 * Interceptor de respuestas
 * Se ejecuta después de cada respuesta HTTP
 * Maneja errores globalmente y transforma respuestas
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Logging en desarrollo
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    }

    // Retornar directamente los datos
    return response;
  },
  (error: AxiosError) => {
    // Logging de errores
    if (import.meta.env.DEV) {
      console.error('[API Response Error]', error.response?.status, error.message);
    }

    // Capturar error en Sentry
    if (error.response) {
      Sentry.captureException(error, {
        tags: {
          errorType: 'http_error',
          httpStatus: error.response.status,
          endpoint: error.config?.url,
          method: error.config?.method?.toUpperCase(),
        },
        level: error.response.status >= 500 ? 'error' : 'warning',
      });
    } else if (error.request) {
      Sentry.captureException(error, {
        tags: {
          errorType: 'network_error',
        },
        level: 'warning',
      });
    }

    // Manejo de errores específicos
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 400:
          throw new Error(data?.message || 'Solicitud incorrecta. Verifica los datos enviados.');
        case 401:
          throw new Error('No autorizado. Por favor, inicia sesión.');
        case 403:
          // Para 403, priorizar el mensaje del servidor (ej: país bloqueado)
          throw new Error(data?.message || data?.details || 'Acceso prohibido. No tienes permisos para esta acción.');
        case 404:
          throw new Error(data?.message || 'Recurso no encontrado.');
        case 429:
          throw new Error('Demasiadas peticiones. Por favor, espera un momento.');
        case 500:
          throw new Error('Error del servidor. Por favor, intenta más tarde.');
        case 503:
          throw new Error('Servicio no disponible. El servidor está en mantenimiento.');
        default:
          throw new Error(data?.message || data?.details || `Error del servidor (${status})`);
      }
    } else if (error.request) {
      // La petición se hizo pero no se recibió respuesta
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    } else {
      // Algo sucedió al configurar la petición
      throw new Error('Error al procesar la petición: ' + error.message);
    }
  }
);

/**
 * Cliente HTTP exportado para uso en servicios
 * @example
 * ```ts
 * import { apiClient } from './apiClient';
 * 
 * const response = await apiClient.get('/api/users');
 * const user = await apiClient.post('/api/users', { name: 'John' });
 * ```
 */
export default apiClient;

/**
 * Tipos de error personalizados para mejor manejo
 * @interface ApiError
 */
export interface ApiError {
  /** Mensaje de error legible para el usuario */
  message: string;
  /** Código de estado HTTP */
  status?: number;
  /** Detalles adicionales del error */
  details?: any;
}

/**
 * Helper para extraer mensaje de error de forma segura
 * @param {unknown} error - Error capturado
 * @returns {string} Mensaje de error formateado
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Error desconocido';
};
