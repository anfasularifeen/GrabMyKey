import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockProperties } from '../data/mockProperties';

const PropertyContext = createContext();

export function PropertyProvider({ children }) {
  // Initialized with cached properties or robust mockProperties collection
  const [properties, setProperties] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('grabmykey_properties');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Failed to parse cached properties', e);
      }
    }
    return mockProperties;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
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

  const resetToMockProperties = () => {
    setProperties(mockProperties);
    if (typeof window !== 'undefined') {
      localStorage.setItem('grabmykey_properties', JSON.stringify(mockProperties));
    }
  };

  return (
    <PropertyContext.Provider value={{
      properties,
      setProperties,
      addProperty,
      updateProperty,
      deleteProperty,
      clearAllProperties,
      resetToMockProperties
    }}>
      {children}
    </PropertyContext.Provider>
  );
}

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    return {
      properties: mockProperties,
      setProperties: () => {},
      addProperty: () => {},
      updateProperty: () => {},
      deleteProperty: () => {},
      clearAllProperties: () => {},
      resetToMockProperties: () => {}
    };
  }
  return context;
};

export default PropertyContext;

