import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchProperties } from '../api';

const PropertyContext = createContext();

// Automatically purge legacy mock properties from localStorage cache
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('grabmykey_properties');
    if (saved && (
      saved.includes('Coastal Horizon') ||
      saved.includes('Kadri Heights') ||
      saved.includes('Bejai Royal') ||
      saved.includes('Ullal Sovereign') ||
      saved.includes('dQw4w9WgXcQ')
    )) {
      localStorage.removeItem('grabmykey_properties');
    }
  } catch (e) {
    // Ignore storage errors
  }
}

export function PropertyProvider({ children }) {
  // Wipe default initial states: strictly start empty []
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Live Backend API Synchronization exclusively from Express
  const loadPropertiesFromApi = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetchProperties();
      if (res?.data && Array.isArray(res.data)) {
        setProperties(res.data);
        return res.data;
      } else {
        setProperties([]);
        return [];
      }
    } catch (err) {
      setError(err?.message || 'Failed to fetch properties from server');
      console.warn('[PropertyContext] Live API fetch error:', err?.message || err);
      setProperties([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetchProperties();
        if (isMounted) {
          if (res?.data && Array.isArray(res.data)) {
            setProperties(res.data);
          } else {
            setProperties([]);
          }
        }
      } catch (err) {
        console.warn('[PropertyContext] Initial mount backend fetch error:', err?.message || err);
        if (isMounted) {
          setProperties([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && Array.isArray(properties)) {
      localStorage.setItem('grabmykey_properties', JSON.stringify(properties));
    }
  }, [properties]);

  const addProperty = (newProperty) => {
    const timestamp = Date.now();
    const title = newProperty?.title || 'New Property';
    const generatedId = newProperty?.id || newProperty?._id || `gmk-${timestamp}`;
    const generatedSlug = newProperty?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prop-${timestamp}`;

    const propertyToAdd = {
      id: generatedId,
      _id: generatedId,
      slug: generatedSlug,
      createdAt: new Date().toISOString(),
      ...newProperty
    };

    setProperties((prev) => [propertyToAdd, ...(prev || [])]);
    return propertyToAdd;
  };

  const updateProperty = (id, updatedFields) => {
    setProperties((prev) =>
      (prev || []).map((prop) => {
        if (String(prop?.id) === String(id) || String(prop?._id) === String(id)) {
          return { ...prop, ...updatedFields, updatedAt: new Date().toISOString() };
        }
        return prop;
      })
    );
  };

  const deleteProperty = (id) => {
    setProperties((prev) =>
      (prev || []).filter((prop) => String(prop?.id) !== String(id) && String(prop?._id) !== String(id))
    );
  };

  const clearAllProperties = () => {
    setProperties([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('grabmykey_properties');
    }
  };

  return (
    <PropertyContext.Provider value={{
      properties,
      setProperties,
      isLoading,
      error,
      refreshProperties: loadPropertiesFromApi,
      reloadProperties: loadPropertiesFromApi,
      resetToMockProperties: loadPropertiesFromApi,
      addProperty,
      updateProperty,
      deleteProperty,
      clearAllProperties
    }}>
      {children}
    </PropertyContext.Provider>
  );
}

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    return {
      properties: [],
      setProperties: () => {},
      isLoading: false,
      error: null,
      refreshProperties: async () => [],
      reloadProperties: async () => [],
      resetToMockProperties: async () => [],
      addProperty: () => {},
      updateProperty: () => {},
      deleteProperty: () => {},
      clearAllProperties: () => {}
    };
  }
  return context;
};

export default PropertyContext;

