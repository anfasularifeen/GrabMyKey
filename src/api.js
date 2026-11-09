import axios from 'axios';
import { mockProperties } from './data/mockProperties';

// Base API URL supporting localhost and public LAN network IP access
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  if (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `http://${window.location.hostname}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Session-based offline detection to prevent hammering a closed port
let isBackendOffline = typeof window !== 'undefined' ? sessionStorage.getItem('gmk_backend_offline') === 'true' : false;

export const setBackendOffline = (offline = true) => {
  isBackendOffline = offline;
  if (typeof window !== 'undefined') {
    if (offline) {
      sessionStorage.setItem('gmk_backend_offline', 'true');
    } else {
      sessionStorage.removeItem('gmk_backend_offline');
    }
  }
};

export const shouldAttemptBackend = () => {
  if (typeof window === 'undefined') return false;
  // If explicitly disabled via env or storage
  if (import.meta.env.VITE_BACKEND_ENABLED === 'false' || import.meta.env.VITE_FRONTEND_ONLY === 'true') {
    return false;
  }
  if (localStorage.getItem('grabmykey_frontend_only') === 'true' || localStorage.getItem('gmk_offline_mode') === 'true') {
    return false;
  }
  // If backend was detected offline in this session
  if (isBackendOffline || sessionStorage.getItem('gmk_backend_offline') === 'true') {
    return false;
  }
  return true;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 8000
});

// Interceptor for response unwrapping and error logging
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Only warn for unexpected HTTP responses from a live server (e.g. 500, 403),
    // and suppress standard connection refused / offline noise when backend isn't running
    const isOffline = error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || !error.response;
    if (isOffline) {
      setBackendOffline(true);
    } else {
      const errorMsg = error.response?.data?.message || error.message || 'API error';
      console.warn(`[GrabMyKey API Warning] ${errorMsg}`);
    }
    return Promise.reject(error);
  }
);

/**
 * Property Endpoints
 */

// Fetch all live properties from MongoDB with graceful offline fallback to mock dataset
export const fetchProperties = async () => {
  const getFallback = () => {
    let localData = [];
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('grabmykey_properties');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            localData = parsed;
          }
        }
      } catch (e) {
        localData = [];
      }
    }
    const dataToReturn = localData.length > 0 ? localData : mockProperties;
    return {
      success: true,
      count: dataToReturn.length,
      data: dataToReturn,
      fromLocal: true
    };
  };

  if (!shouldAttemptBackend()) {
    return getFallback();
  }

  try {
    const res = await apiClient.get('/properties');
    if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('grabmykey_properties', JSON.stringify(res.data));
      }
      return res;
    }
    // If backend is empty, fallback to pristine mockProperties collection
    return {
      success: true,
      count: mockProperties.length,
      data: mockProperties,
      fromMock: true
    };
  } catch (err) {
    setBackendOffline(true);
    return getFallback();
  }
};

// Fetch single property by ID or Slug with fallback to mock data
export const fetchPropertyById = async (id) => {
  try {
    const res = await apiClient.get(`/properties/${id}`);
    if (res?.data) return res;
    throw new Error('Property not found on server');
  } catch (err) {
    const target = String(id).toLowerCase();
    const found = mockProperties.find(p => 
      String(p?.id || '').toLowerCase() === target || 
      String(p?._id || '').toLowerCase() === target || 
      String(p?.slug || '').toLowerCase() === target
    );
    return {
      success: Boolean(found),
      data: found || null,
      fromMock: true
    };
  }
};

// Create a new property listing (Admin PIN verified)
export const createProperty = async (propertyData) => {
  return await apiClient.post('/properties', propertyData);
};

// Delete a property listing by ID (Admin)
export const deleteProperty = async (id) => {
  return await apiClient.delete(`/properties/${id}`);
};

// Update an existing property listing (Admin)
export const updateProperty = async (id, propertyData) => {
  return await apiClient.put(`/properties/${id}`, propertyData);
};

/**
 * Lead / Seller Onboarding Endpoints
 */

// Submit a seller onboarding request
export const submitLead = async (leadData) => {
  return await apiClient.post('/leads', leadData);
};

// Fetch all owner onboarding requests (Admin) with offline fallback
export const fetchLeads = async () => {
  const getFallback = () => {
    let localData = [];
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('grabmykey_leads');
        if (cached) localData = JSON.parse(cached);
      } catch (e) {
        localData = [];
      }
    }
    return {
      success: true,
      count: localData.length,
      data: localData,
      fromLocal: true
    };
  };

  if (!shouldAttemptBackend()) {
    return getFallback();
  }

  try {
    const res = await apiClient.get('/leads');
    if (res?.data && Array.isArray(res.data) && typeof window !== 'undefined') {
      localStorage.setItem('grabmykey_leads', JSON.stringify(res.data));
    }
    return res;
  } catch (err) {
    setBackendOffline(true);
    return getFallback();
  }
};

// Update status of lead ticket (Admin)
export const updateLeadStatus = async (id, status) => {
  return await apiClient.patch(`/leads/${id}`, { status });
};

// Delete an onboarding lead ticket (Admin)
export const deleteLead = async (id) => {
  return await apiClient.delete(`/leads/${id}`);
};

/**
 * Site Settings Endpoints (Hero Featured Video & Dynamic Config)
 */
// Fetch site settings with offline fallback
export const fetchSiteSettings = async () => {
  const getFallback = () => {
    let localData = null;
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('grabmykey_hero_settings');
        if (cached) localData = JSON.parse(cached);
      } catch (e) {
        localData = null;
      }
    }
    return {
      success: true,
      data: localData,
      fromLocal: true
    };
  };

  if (!shouldAttemptBackend()) {
    return getFallback();
  }

  try {
    const res = await apiClient.get('/settings');
    if (res?.data && typeof window !== 'undefined') {
      localStorage.setItem('grabmykey_hero_settings', JSON.stringify(res.data));
    }
    return res;
  } catch (err) {
    setBackendOffline(true);
    return getFallback();
  }
};

export const updateSiteSettings = async (settingsData) => {
  return await apiClient.put('/settings', settingsData);
};

/**
 * Master Presets Endpoints (Legal Checks & Category Feature Matrices)
 */
export const fetchPresets = async (params = {}) => {
  if (!shouldAttemptBackend()) {
    return {
      success: true,
      data: [],
      fromLocal: true
    };
  }

  try {
    return await apiClient.get('/presets', { params });
  } catch (err) {
    setBackendOffline(true);
    return {
      success: true,
      data: [],
      fromLocal: true
    };
  }
};

export const createPreset = async (presetData) => {
  return await apiClient.post('/presets', presetData);
};

export const updatePreset = async (id, presetData) => {
  return await apiClient.put(`/presets/${id}`, presetData);
};

export const deletePreset = async (id) => {
  return await apiClient.delete(`/presets/${id}`);
};

export const seedDefaultPresets = async () => {
  return await apiClient.post('/presets/seed-defaults');
};

/**
 * Server Status Check
 */
export const checkServerHealth = async (forceProbe = false) => {
  if (!forceProbe && !shouldAttemptBackend()) {
    return { status: 'offline', mode: 'frontend_only', fromLocal: true };
  }

  try {
    const res = await apiClient.get('/health');
    setBackendOffline(false);
    return res;
  } catch (err) {
    setBackendOffline(true);
    return { status: 'offline', error: err.message, fromLocal: true };
  }
};

export default {
  fetchProperties,
  fetchPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  submitLead,
  fetchLeads,
  updateLeadStatus,
  deleteLead,
  fetchSiteSettings,
  updateSiteSettings,
  fetchPresets,
  createPreset,
  updatePreset,
  deletePreset,
  seedDefaultPresets,
  checkServerHealth
};


