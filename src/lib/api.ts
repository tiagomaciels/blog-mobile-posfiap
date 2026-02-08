import axios from 'axios';

/**
 * URL base da API do backend.
 * - Android Emulator: usa 10.0.2.2 para acessar localhost do host
 * - iOS Simulator/Web: usa localhost
 */

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Instância configurada do Axios para chamadas à API
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (__DEV__) {
      console.error('[API Error]', error.response?.data ?? error.message);
    }
    return Promise.reject(error);
  }
);
