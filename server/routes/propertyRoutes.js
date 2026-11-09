import express from 'express';
import mongoose from 'mongoose';
import Property from '../models/Property.js';
import MasterPreset from '../models/MasterPreset.js';
import { getActiveMasterPresets } from './presetRoutes.js';

const router = express.Router();

const INITIAL_PROPERTIES = [];

// Seed initial database if empty
export const seedInitialProperties = async () => {
  try {
    const count = await Property.countDocuments();
    if (count === 0 && INITIAL_PROPERTIES.length > 0) {
      await Property.insertMany(INITIAL_PROPERTIES);
      console.log('🌱 Successfully seeded initial GrabMyKey luxury properties into MongoDB');
    }
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};

/**
 * Dynamic Synchronizer for Master Presets & Existing Properties
 * Ensures that whenever a new Master Feature or Legal Verification item is added
 * globally to the system, all existing (previously published) properties automatically
 * display the new item.
 * 
 * Default Fallbacks:
 * - Feature Specifications: isAvailable: false ("— Not Included") & descriptionNote: "Status Not Updated"
 * - Legal Verification: verifiedStatus: 'Pending' ("⏳ Pending") & verificationNote: "Pending Audit / Status Not Updated"
 * - Preserves all previously recorded property-specific states, custom features, and custom legal items!
 */
export const syncPropertyWithMasterPresets = (propertyInput, masterPresets = []) => {
  if (!propertyInput) return propertyInput;

  // Ensure property is a plain object
  const property = (typeof propertyInput.toObject === 'function') 
    ? propertyInput.toObject() 
    : { ...propertyInput };

  const propCategory = (property.category || property.type || '').trim().toLowerCase();

  const isCategoryMatch = (appCat) => {
    if (!appCat || appCat === 'ALL') return true;
    const ac = appCat.toLowerCase();
    if (propCategory.includes(ac) || ac.includes(propCategory)) return true;
    if (propCategory === 'estate' && ac === 'villa') return true;
    if (propCategory === 'independent house' && ac === 'villa') return true;
    return false;
  };

  const normalize = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Dynamic Merge for Feature Specifications Matrix
  const activeFeatures = masterPresets.filter(p => {
    if (p.presetType !== 'PROPERTY_FEATURE' || p.isActive === false) return false;
    const hasExisting = (property.componentsMatrix || []).some(
      c => c && (normalize(c.featureName) === normalize(p.title))
    );
    if (hasExisting) return true;
    return isCategoryMatch(p.applicableCategory);
  });

  const mergedComponents = [];
  const matchedFeatureKeys = new Set();

  for (const preset of activeFeatures) {
    const key = normalize(preset.title);
    // Check if property already has explicit data for this preset
    const existing = (property.componentsMatrix || []).find(
      c => c && (c.featureName === preset.title || (key && normalize(c.featureName) === key))
    );

    if (existing) {
      mergedComponents.push(existing);
    } else {
      // Default fallback for previous properties
      mergedComponents.push({
        categoryName: preset.groupCategory || 'General',
        featureName: preset.title,
        isAvailable: false, // Default: — (Not Available / Cross)
        descriptionNote: "Status Not Updated"
      });
    }
    if (key) matchedFeatureKeys.add(key);
  }

  // Preserve any custom features previously recorded on this property
  if (Array.isArray(property.componentsMatrix)) {
    for (const c of property.componentsMatrix) {
      const key = normalize(c.featureName);
      if (key && !matchedFeatureKeys.has(key)) {
        mergedComponents.push(c);
        matchedFeatureKeys.add(key);
      }
    }
  }

  // 2. Dynamic Merge for Legal Verification Checklist
  const activeLegalChecks = masterPresets.filter(p => 
    p.presetType === 'LEGAL_CHECK' && p.isActive !== false
  );

  const mergedLegal = [];
  const matchedLegalKeys = new Set();

  for (const preset of activeLegalChecks) {
    const key = normalize(preset.title);
    // Check if property already has explicit data for this preset
    const existing = (property.legalVerification || []).find(
      l => l && (l.documentName === preset.title || (key.length > 5 && normalize(l.documentName) === key))
    );

    if (existing) {
      mergedLegal.push(existing);
    } else {
      // Default fallback for previous properties
      mergedLegal.push({
        documentName: preset.title,
        category: preset.groupCategory || 'General Title',
        verifiedStatus: 'Pending', // Default: Pending / Not Updated
        verificationNote: 'Pending Audit / Status Not Updated',
        isCustomItem: false
      });
    }
    if (key) matchedLegalKeys.add(key);
  }

  // Preserve any custom legal checklist items previously recorded on this property
  if (Array.isArray(property.legalVerification)) {
    for (const l of property.legalVerification) {
      const key = normalize(l.documentName);
      if (key && !matchedLegalKeys.has(key)) {
        mergedLegal.push(l);
        matchedLegalKeys.add(key);
      }
    }
  }

  // Assign synced matrices
  property.componentsMatrix = mergedComponents;
  property.legalVerification = mergedLegal;

  return property;
};

// Controller: getPropertyBySlug
export const getPropertyBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    let property = null;

    if (mongoose.connection.readyState === 1) {
      property = await Property.findOne({ slug });
    }

    if (!property) {
      property = INITIAL_PROPERTIES.find(p => p.slug === slug);
    }

    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Fetch active master presets
    const masterPresets = await getActiveMasterPresets();

    // Dynamically sync matrices
    const responseData = syncPropertyWithMasterPresets(property, masterPresets);

    return res.status(200).json({
      success: true,
      data: responseData,
      ...responseData
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Controller: getPropertyById (Supports ObjectId or Slug)
export const getPropertyById = async (req, res) => {
  try {
    const identifier = req.params.id;
    let property = null;

    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(identifier)) {
        property = await Property.findById(identifier);
      }
      if (!property) {
        property = await Property.findOne({ slug: identifier });
      }
    }

    if (!property) {
      // Check in fallback cache
      property = INITIAL_PROPERTIES.find(p => 
        p.slug === identifier || String(p.id) === identifier || String(p._id) === identifier
      );
    }

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Fetch active master presets
    const masterPresets = await getActiveMasterPresets();

    // Dynamically sync matrices
    const responseData = syncPropertyWithMasterPresets(property, masterPresets);

    return res.status(200).json({
      success: true,
      data: responseData,
      ...responseData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching property details',
      error: error.message
    });
  }
};

// Controller: getAllProperties
export const getAllProperties = async (req, res) => {
  try {
    let properties = [];

    if (mongoose.connection.readyState !== 1) {
      properties = INITIAL_PROPERTIES;
    } else {
      properties = await Property.find().sort({ createdAt: -1 });
      
      // Auto-seed if collection is currently empty
      if (properties.length === 0) {
        await seedInitialProperties();
        properties = await Property.find().sort({ createdAt: -1 });
      }
    }

    // Fetch active master presets and sync each property
    const masterPresets = await getActiveMasterPresets();
    const syncedProperties = properties.map(p => syncPropertyWithMasterPresets(p, masterPresets));

    return res.json({
      success: true,
      count: syncedProperties.length,
      data: syncedProperties,
      source: mongoose.connection.readyState === 1 ? 'mongodb' : 'cache'
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving properties',
      error: error.message
    });
  }
};

// GET /api/properties - Retrieve all listings with synced master presets
router.get('/', getAllProperties);

// GET /api/properties/slug/:slug - Explicit slug route
router.get('/slug/:slug', getPropertyBySlug);

// GET /api/properties/:id - Single property details (By ObjectId or Slug)
router.get('/:id', getPropertyById);

// POST /api/properties - Create listing (Admin only)
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const title = body.title;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Property title is required'
      });
    }

    // Generate unique slug
    let slug = body.slug;
    if (!slug) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7);
    }

    const newProperty = new Property({
      title,
      slug,
      city: body.city || 'Mangaluru',
      locality: body.locality || (body.location ? body.location.split(',')[0].trim() : 'Central'),
      category: body.category || body.type || 'Villa',
      dealType: body.dealType || 'Resale',
      pricing: body.pricing || {
        expectedPrice: Number(body.priceRaw) || 25000000,
        isNegotiable: body.pricing?.isNegotiable ?? true,
        maintenanceFee: Number(body.pricing?.maintenanceFee) || 0
      },
      specs: body.specs || {
        bedrooms: Number(body.beds) || 0,
        bathrooms: Number(body.baths) || 0,
        carpetAreaSqFt: parseInt(String(body.area || '').replace(/[^0-9]/g, ''), 10) || 0,
        furnishingStatus: body.specs?.furnishingStatus || 'Fully Furnished',
        floorLevel: body.specs?.floorLevel || 'G',
        totalFloors: body.specs?.totalFloors || '1'
      },
      youtubeVideoId: body.youtubeVideoId || (body.videoUrl ? body.videoUrl.split('v=')[1]?.substring(0, 11) : 'dQw4w9WgXcQ'),
      galleryImages: Array.isArray(body.galleryImages) && body.galleryImages.length > 0 
        ? body.galleryImages 
        : (Array.isArray(body.images) && body.images.length > 0 ? body.images : ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80"]),
      description: body.description || '',
      componentsMatrix: Array.isArray(body.componentsMatrix) ? body.componentsMatrix : [],
      legalVerification: Array.isArray(body.legalVerification) ? body.legalVerification : [],
      transitMatrix: Array.isArray(body.transitMatrix) ? body.transitMatrix.map(t => ({
        landmarkName: t.landmarkName || t.destination || '',
        destination: t.destination || t.landmarkName || '',
        travelMode: t.travelMode || t.transportMode || 'Drive',
        transportMode: t.transportMode || t.travelMode || 'Drive',
        distanceText: t.distanceText || (t.distanceKm !== undefined ? `${t.distanceKm} km` : ''),
        distanceKm: t.distanceKm !== undefined ? Number(t.distanceKm) : (parseFloat(t.distanceText) || 0),
        durationText: t.durationText || (t.travelTimeMins !== undefined ? `${t.travelTimeMins}m` : ''),
        travelTimeMins: t.travelTimeMins !== undefined ? Number(t.travelTimeMins) : (parseInt(t.durationText, 10) || 0)
      })) : [],
      roadIngressText: body.roadIngressText || '',
      zoningTagText: body.zoningTagText || '',
      investmentAnalysis: body.investmentAnalysis || {},
      advocateVerificationAvailable: body.advocateVerificationAvailable ?? true,
      isFeatured: body.isFeatured ?? false,
      status: body.status || 'Active',

      // Legacy fields
      location: body.location || `${body.locality || 'Central'}, ${body.city || 'Mangaluru'}`,
      price: body.price || '₹2.50 Cr',
      priceRaw: Number(body.priceRaw) || body.pricing?.expectedPrice || 25000000,
      type: body.type || body.category || 'Villa',
      beds: Number(body.beds) || body.specs?.bedrooms || 0,
      baths: Number(body.baths) || body.specs?.bathrooms || 0,
      area: body.area || `${body.specs?.carpetAreaSqFt || 2500} sq.ft`,
      videoUrl: body.videoUrl || `https://www.youtube.com/watch?v=${body.youtubeVideoId || 'dQw4w9WgXcQ'}`,
      images: Array.isArray(body.images) ? body.images : body.galleryImages || [],
      badge: body.badge || 'Verified Listing',
      legalStatus: body.legalStatus || 'Clear Title / RERA Verified',
      highlights: Array.isArray(body.highlights) ? body.highlights : ["Advocate Audited Clear Title", "Direct Ingress", "Verified Listing"]
    });

    const saved = await newProperty.save();

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: saved
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create property',
      error: error.message
    });
  }
});

// Controller: updateProperty
export const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // Sanitize payload: prevent modifying immutable _id in MongoDB
    const updateData = { ...req.body };
    delete updateData._id;

    if (Array.isArray(updateData.transitMatrix)) {
      updateData.transitMatrix = updateData.transitMatrix.map(t => ({
        landmarkName: t.landmarkName || t.destination || '',
        destination: t.destination || t.landmarkName || '',
        travelMode: t.travelMode || t.transportMode || 'Drive',
        transportMode: t.transportMode || t.travelMode || 'Drive',
        distanceText: t.distanceText || (t.distanceKm !== undefined ? `${t.distanceKm} km` : ''),
        distanceKm: t.distanceKm !== undefined ? Number(t.distanceKm) : (parseFloat(t.distanceText) || 0),
        durationText: t.durationText || (t.travelTimeMins !== undefined ? `${t.travelTimeMins}m` : ''),
        travelTimeMins: t.travelTimeMins !== undefined ? Number(t.travelTimeMins) : (parseInt(t.durationText, 10) || 0)
      }));
    }

    let updatedProperty = null;

    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        // Use findByIdAndUpdate with { new: true, runValidators: true }
        updatedProperty = await Property.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true } // { new: true } returns the updated doc
        );
      }
      if (!updatedProperty) {
        // Fallback: try finding and updating by slug
        updatedProperty = await Property.findOneAndUpdate(
          { slug: id },
          { $set: updateData },
          { new: true, runValidators: true }
        );
      }
    } else {
      // In-memory cache fallback if MongoDB is offline
      const idx = INITIAL_PROPERTIES.findIndex(p => String(p._id) === String(id) || String(p.id) === String(id) || p.slug === id);
      if (idx !== -1) {
        INITIAL_PROPERTIES[idx] = { ...INITIAL_PROPERTIES[idx], ...updateData };
        updatedProperty = INITIAL_PROPERTIES[idx];
      }
    }

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property listing not found" });
    }

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: updatedProperty
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: error.message });
  }
};

// PUT /api/properties/:id - Update property listing (Admin only)
router.put('/:id', updateProperty);

// PUT /api/properties/manage/:id - Alias update route
router.put('/manage/:id', updateProperty);

// DELETE /api/properties/:id - Remove listing (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Property not found to delete'
      });
    }

    res.json({
      success: true,
      message: 'Property deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete property',
      error: error.message
    });
  }
});

export default router;
