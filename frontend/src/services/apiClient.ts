/**
 * @fileoverview Centralized HTTP client with Axios
 * @module services/apiClient
 * @description Axios configuration with interceptors, timeouts and error handling.
 * Single configuration point for all frontend API calls.
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import * as Sentry from '@sentry/react';

/**
 * Base URL of the backend API obtained from environment variables
 * If empty or undefined, uses relative routes to leverage the nginx proxy
 * @constant
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Axios instance configured with default values
 * @constant
 * @type {AxiosInstance}
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Change to true if you use cookies/sessions
});

/**
 * Request interceptor
 * Runs before each HTTP request
 * Useful for adding authentication tokens, logging, etc.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can add authentication headers here if needed:
    // const token = localStorage.getItem('auth_token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Runs after each HTTP response
 * Handles errors globally and transforms responses
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
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

    // Handling specific errors
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 400:
          throw new Error(data?.message || 'Bad request. Please verify the data sent.');
        case 401:
          throw new Error('Unauthorized. Please log in.');
        case 403:
          // For 403, prioritize the server message (e.g.: blocked country)
          throw new Error(data?.message || data?.details || 'Access forbidden. You do not have permission for this action.');
        case 404:
          throw new Error(data?.message || 'Resource not found.');
        case 429:
          throw new Error('Too many requests. Please wait a moment.');
        case 500:
          throw new Error('Server error. Please try again later.');
        case 503:
          throw new Error('Service unavailable. The server is under maintenance.');
        default:
          throw new Error(data?.message || data?.details || `Server error (${status})`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('Could not connect to the server. Please check your internet connection.');
    } else {
      // Something happened while setting up the request
      throw new Error('Error processing the request: ' + error.message);
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
 * Custom error types for better handling
 * @interface ApiError
 */
export interface ApiError {
  /** User-readable error message */
  message: string;
  /** HTTP status code */
  status?: number;
  /** Additional error details */
  details?: any;
}

/**
 * Helper to safely extract error message
 * @param {unknown} error - Captured error
 * @returns {string} Formatted error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error';
};
