import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach admin authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error formatting
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg = error.response?.data?.message || error.message || 'API connection failed';
    console.error('[Admin API Error]:', errorMsg);
    return Promise.reject(new Error(errorMsg));
  }
);

// --- PROPERTY CRUD API ---

export const fetchProperties = async () => {
  try {
    const res = await api.get('/properties');
    return res;
  } catch (err) {
    console.warn('API error in fetchProperties:', err.message);
    throw err;
  }
};

export const fetchPropertyById = async (id) => {
  try {
    const res = await api.get(`/properties/${id}`);
    return res;
  } catch (err) {
    console.warn(`API error in fetchPropertyById (${id}):`, err.message);
    throw err;
  }
};

export const createProperty = async (propertyData) => {
  try {
    const res = await api.post('/properties', propertyData);
    return res;
  } catch (err) {
    console.warn('API error in createProperty:', err.message);
    throw err;
  }
};

export const updateProperty = async (id, propertyData) => {
  try {
    const res = await api.put(`/properties/${id}`, propertyData);
    return res;
  } catch (err) {
    console.warn(`API error in updateProperty (${id}):`, err.message);
    throw err;
  }
};

export const deleteProperty = async (id) => {
  try {
    const res = await api.delete(`/properties/${id}`);
    return res;
  } catch (err) {
    console.warn(`API error in deleteProperty (${id}):`, err.message);
    throw err;
  }
};

// --- OWNER LEADS & INBOUND ONBOARDING QUEUE API ---

export const fetchLeads = async () => {
  try {
    const res = await api.get('/leads');
    return res;
  } catch (err) {
    console.warn('API error in fetchLeads:', err.message);
    throw err;
  }
};

export const updateLeadStatus = async (id, status) => {
  try {
    const res = await api.patch(`/leads/${id}`, { status });
    return res;
  } catch (err) {
    console.warn(`API error in updateLeadStatus (${id}):`, err.message);
    throw err;
  }
};

export const deleteLead = async (id) => {
  try {
    const res = await api.delete(`/leads/${id}`);
    return res;
  } catch (err) {
    console.warn(`API error in deleteLead (${id}):`, err.message);
    throw err;
  }
};

// --- SYSTEM HEALTH CHECK ---

export const checkServerHealth = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/properties', { timeout: 3000 });
    return { online: true, source: res.data?.source || 'live' };
  } catch {
    return { online: false, source: 'offline' };
  }
};

export default api;
