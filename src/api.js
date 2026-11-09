import axios from 'axios';

// Base API URL supporting localhost and public LAN network IP access
const getApiBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location?.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
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
  if (import.meta?.env?.VITE_BACKEND_ENABLED === 'false' || import.meta?.env?.VITE_FRONTEND_ONLY === 'true') {
    return false;
  }
  if (localStorage.getItem('grabmykey_frontend_only') === 'true' || localStorage.getItem('gmk_offline_mode') === 'true') {
    return false;
  }
  return true;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

// Interceptor for response unwrapping and error logging
apiClient.interceptors.response.use(
  (response) => {
    setBackendOffline(false);
    return response.data;
  },
  (error) => {
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
 * Normalizes property keys to ensure complete compatibility across all UI components:
 * PropertyCard, HeroFeaturedVideoCard, PropertyDetails, PropertySpecifications, etc.
 */
export const normalizeProperty = (p) => {
  if (!p) return p;
  const prop = { ...p };
  const id = prop.id || (prop._id ? prop._id.toString() : prop.slug);
  prop.id = id;
  prop._id = prop._id || id;
  prop.slug = prop.slug || id;
  prop.title = prop.title || 'Prime Property';
  prop.locality = prop.locality || (prop.location ? prop.location.split(',')[0].trim() : 'Surathkal Beach');
  prop.city = prop.city || 'Mangaluru';
  prop.location = prop.location || `${prop.locality}, ${prop.city}`;
  prop.category = prop.category || prop.type || 'Villa';
  prop.type = prop.type || prop.category || 'Villa';

  const rawPrice = prop.priceRaw || prop.pricing?.expectedPrice || 0;
  prop.priceRaw = rawPrice;
  if (!prop.pricing) {
    prop.pricing = { expectedPrice: rawPrice, isNegotiable: true, maintenanceFee: 0 };
  }
  if (!prop.price) {
    prop.price = rawPrice >= 10000000
      ? `₹${(rawPrice / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`
      : (rawPrice >= 100000 ? `₹${(rawPrice / 100000).toFixed(1).replace(/\.0$/, '')} Lakhs` : `₹${rawPrice.toLocaleString('en-IN')}`);
  }
  prop.priceText = prop.priceText || (prop.price ? String(prop.price).replace(/^₹/, '').replace(/ •.*/, '').trim() : '');

  const imgs = (Array.isArray(prop.images) && prop.images.length > 0)
    ? prop.images
    : ((Array.isArray(prop.galleryImages) && prop.galleryImages.length > 0)
        ? prop.galleryImages
        : []);
  prop.images = imgs;
  prop.galleryImages = imgs;
  prop.thumbnail = prop.thumbnail || imgs[0] || '';

  if (!prop.youtubeVideoId && prop.videoUrl) {
    const match = prop.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    prop.youtubeVideoId = match ? match[1] : '';
  }
  if (!prop.videoUrl && prop.youtubeVideoId) {
    prop.videoUrl = `https://www.youtube.com/watch?v=${prop.youtubeVideoId}`;
  }

  if (!prop.specs) {
    prop.specs = {
      bedrooms: prop.bedrooms ?? prop.beds ?? 0,
      bathrooms: prop.bathrooms ?? prop.baths ?? 0,
      carpetAreaSqFt: prop.superArea ? parseInt(String(prop.superArea).replace(/[^0-9]/g, ''), 10) || 0 : 0,
      furnishingStatus: prop.furnishing || 'Fully Furnished',
      floorLevel: 'G',
      totalFloors: '1'
    };
  }
  prop.bedrooms = prop.bedrooms ?? prop.specs.bedrooms ?? prop.beds ?? 0;
  prop.bathrooms = prop.bathrooms ?? prop.specs.bathrooms ?? prop.baths ?? 0;
  prop.beds = prop.beds ?? prop.bedrooms;
  prop.baths = prop.baths ?? prop.bathrooms;
  prop.superArea = prop.superArea || prop.area || (prop.specs.carpetAreaSqFt ? `${prop.specs.carpetAreaSqFt.toLocaleString('en-IN')} sq.ft` : '');
  prop.area = prop.area || prop.superArea;
  prop.furnishing = prop.furnishing || prop.specs.furnishingStatus || 'Furnished';

  prop.badge = prop.badge || (prop.isFeatured ? 'Featured Listing' : (prop.dealType || 'Exclusive Listing'));

  if (!Array.isArray(prop.highlights)) {
    prop.highlights = [];
  }

  if (!Array.isArray(prop.specifications) || prop.specifications.length === 0) {
    if (Array.isArray(prop.componentsMatrix) && prop.componentsMatrix.length > 0) {
      prop.specifications = prop.componentsMatrix.map(c => ({
        category: c.categoryName || 'General',
        feature: c.featureName || '',
        status: c.isAvailable !== false ? 'Included' : 'Not Included',
        details: c.descriptionNote || '—'
      }));
    }
  }

  return prop;
};

/**
 * Property Endpoints
 */

// Filter utility to detect and eliminate any legacy mock property relics
export const isMockProperty = (p) => {
  if (!p) return true;
  const title = p.title || '';
  const slug = p.slug || '';
  if (
    title.includes('Coastal Horizon') ||
    title.includes('Kadri Heights') ||
    title.includes('Bejai Royal') ||
    title.includes('Ullal Sovereign') ||
    title.includes('Sovereign Heritage') ||
    slug.includes('coastal-horizon') ||
    slug.includes('kadri-heights') ||
    slug.includes('bejai-royal') ||
    slug.includes('ullal-sovereign') ||
    p.youtubeVideoId === 'dQw4w9WgXcQ'
  ) {
    return true;
  }
  return false;
};

// Fetch all live properties exclusively from Express backend API
export const fetchProperties = async () => {
  const getCachedFallback = () => {
    let localData = [];
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('grabmykey_properties');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            // Strictly exclude any legacy mock properties
            localData = parsed.filter(p => !isMockProperty(p)).map(normalizeProperty);
            // Resave sanitized version
            localStorage.setItem('grabmykey_properties', JSON.stringify(localData));
          }
        }
      } catch (e) {
        localData = [];
      }
    }
    return {
      success: localData.length > 0,
      count: localData.length,
      data: localData,
      fromCache: true
    };
  };

  if (!shouldAttemptBackend()) {
    return getCachedFallback();
  }

  try {
    const res = await apiClient.get('/properties');
    if (res?.data && Array.isArray(res.data)) {
      const sanitized = res.data.filter(p => !isMockProperty(p));
      const normalizedData = sanitized.map(normalizeProperty);
      if (typeof window !== 'undefined') {
        localStorage.setItem('grabmykey_properties', JSON.stringify(normalizedData));
      }
      return {
        ...res,
        count: normalizedData.length,
        data: normalizedData
      };
    }
    return {
      success: true,
      count: 0,
      data: []
    };
  } catch (err) {
    return getCachedFallback();
  }
};

// Fetch single property by ID or Slug exclusively from Express backend API
export const fetchPropertyById = async (id) => {
  const getCachedFallback = () => {
    const target = String(id).toLowerCase();
    let found = null;
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('grabmykey_properties');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            found = parsed.find(p => 
              (String(p?.id || '').toLowerCase() === target || 
              String(p?._id || '').toLowerCase() === target || 
              String(p?.slug || '').toLowerCase() === target) &&
              !isMockProperty(p)
            );
          }
        }
      } catch (e) {}
    }
    return {
      success: Boolean(found),
      data: found ? normalizeProperty(found) : null,
      fromCache: Boolean(found)
    };
  };

  if (!shouldAttemptBackend()) {
    return getCachedFallback();
  }

  try {
    const res = await apiClient.get(`/properties/${id}`);
    if (res?.data && !isMockProperty(res.data)) {
      return {
        ...res,
        data: normalizeProperty(res.data)
      };
    }
    return getCachedFallback();
  } catch (err) {
    return getCachedFallback();
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


