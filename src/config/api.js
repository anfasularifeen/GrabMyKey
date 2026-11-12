/**
 * GrabMyKeys - Centralized Dynamic API Configuration
 * Standardizes the backend API URL across all fetch/axios calls.
 * 
 * Priority:
 * 1. import.meta.env.VITE_API_URL
 * 2. import.meta.env.VITE_API_BASE_URL
 * 3. Dynamic hostname with port 5000 (for local LAN IP testing)
 * 4. Default fallback: http://localhost:5000/api
 */

export const getApiBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
    }
    if (import.meta.env.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '');
    }
  }

  // Support local network IP testing from mobile devices or other computers on LAN
  if (
    typeof window !== 'undefined' &&
    window.location?.hostname &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return `http://${window.location.hostname}:5000/api`;
  }

  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  properties: `${API_BASE_URL}/properties`,
  leads: `${API_BASE_URL}/leads`,
  settings: `${API_BASE_URL}/settings`,
  presets: `${API_BASE_URL}/presets`,
  health: `${API_BASE_URL}/health`
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  getApiBaseUrl
};

