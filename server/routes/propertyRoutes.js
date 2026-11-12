import express from 'express';
import mongoose from 'mongoose';
import Property from '../models/Property.js';
import MasterPreset from '../models/MasterPreset.js';
import { getActiveMasterPresets } from './presetRoutes.js';

const router = express.Router();

const INITIAL_PROPERTIES = [];

// Seed initial database if empty
export const seedInitialProperties = async () => {
  // Mock seeding removed permanently. Database stays clean and empty until properties are published.
  return;
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

  // Normalization & Convenience Key Matching for all frontend UI components
  const resolvedId = property.id || (property._id ? property._id.toString() : property.slug);
  property.id = resolvedId;
  property._id = property._id || resolvedId;
  property.slug = property.slug || resolvedId;
  property.city = property.city || 'Mangaluru';
  property.locality = property.locality || (property.location ? property.location.split(',')[0].trim() : 'Surathkal Beach');
  property.location = property.location || `${property.locality}, ${property.city}`;
  property.category = property.category || property.type || 'Villa';
  property.type = property.type || property.category || 'Villa';

  const rawPrice = property.priceRaw || property.pricing?.expectedPrice || 0;
  property.priceRaw = rawPrice;
  if (!property.pricing) {
    property.pricing = { expectedPrice: rawPrice, isNegotiable: true, maintenanceFee: 0 };
  }
  if (!property.price) {
    property.price = rawPrice >= 10000000
      ? `₹${(rawPrice / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`
      : (rawPrice >= 100000 ? `₹${(rawPrice / 100000).toFixed(1).replace(/\.0$/, '')} Lakhs` : `₹${rawPrice.toLocaleString('en-IN')}`);
  }
  property.priceText = property.priceText || (property.price ? String(property.price).replace(/^₹/, '').replace(/ •.*/, '').trim() : '');

  const imgs = (Array.isArray(property.images) && property.images.length > 0)
    ? property.images
    : ((Array.isArray(property.galleryImages) && property.galleryImages.length > 0)
        ? property.galleryImages
        : []);
  property.images = imgs;
  property.galleryImages = imgs;
  property.thumbnail = property.thumbnail || imgs[0] || '';

  if (!property.youtubeVideoId && property.videoUrl) {
    const match = property.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    property.youtubeVideoId = match ? match[1] : '';
  }
  if (!property.videoUrl && property.youtubeVideoId) {
    property.videoUrl = `https://www.youtube.com/watch?v=${property.youtubeVideoId}`;
  }

  if (!property.specs) {
    property.specs = {
      bedrooms: property.bedrooms ?? property.beds ?? 0,
      bathrooms: property.bathrooms ?? property.baths ?? 0,
      carpetAreaSqFt: property.superArea ? parseInt(String(property.superArea).replace(/[^0-9]/g, ''), 10) || 0 : 0,
      furnishingStatus: property.furnishing || 'Fully Furnished',
      floorLevel: 'G',
      totalFloors: '1'
    };
  }
  property.bedrooms = property.bedrooms ?? property.specs.bedrooms ?? property.beds ?? 0;
  property.bathrooms = property.bathrooms ?? property.specs.bathrooms ?? property.baths ?? 0;
  property.beds = property.beds ?? property.bedrooms;
  property.baths = property.baths ?? property.bathrooms;
  property.superArea = property.superArea || property.area || (property.specs.carpetAreaSqFt ? `${property.specs.carpetAreaSqFt.toLocaleString('en-IN')} sq.ft` : '');
  property.area = property.area || property.superArea;
  property.furnishing = property.furnishing || property.specs.furnishingStatus || 'Furnished';

  property.badge = property.badge || (property.isFeatured ? 'Featured Listing' : (property.dealType || 'Exclusive Listing'));

  if (!Array.isArray(property.highlights)) {
    property.highlights = [];
  }

  if (!Array.isArray(property.specifications) || property.specifications.length === 0) {
    property.specifications = property.componentsMatrix.map(c => ({
      category: c.categoryName || 'General',
      feature: c.featureName || '',
      status: c.isAvailable !== false ? 'Included' : 'Not Included',
      details: c.descriptionNote || '—'
    }));
  }

  if (!Array.isArray(property.transitMatrix)) {
    property.transitMatrix = [];
  }

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

    if (!property || /Coastal Horizon|Kadri Heights|Bejai Royal|Ullal Sovereign|Sovereign Heritage/i.test(property.title || '') || /coastal-horizon|kadri-heights|bejai-royal|ullal-sovereign/i.test(property.slug || '')) {
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
      if (!property) {
        property = await Property.findOne({ $or: [{ id: identifier }, { _id: identifier }] });
      }
    }

    if (!property) {
      // Check in fallback cache
      property = INITIAL_PROPERTIES.find(p => 
        p.slug === identifier || String(p.id) === identifier || String(p._id) === identifier
      );
    }

    if (!property || /Coastal Horizon|Kadri Heights|Bejai Royal|Ullal Sovereign|Sovereign Heritage/i.test(property.title || '') || /coastal-horizon|kadri-heights|bejai-royal|ullal-sovereign/i.test(property.slug || '')) {
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

    if (mongoose.connection.readyState === 1) {
      // Purge any legacy mock properties that might have been seeded into MongoDB earlier
      await Property.deleteMany({
        $or: [
          { title: { $regex: /Coastal Horizon|Kadri Heights|Bejai Royal|Ullal Sovereign|Sovereign Heritage/i } },
          { slug: { $regex: /coastal-horizon|kadri-heights|bejai-royal|ullal-sovereign|sovereign-heritage/i } },
          { youtubeVideoId: "dQw4w9WgXcQ" }
        ]
      });

      properties = (await Property.find().sort({ createdAt: -1 })).filter(p => {
        const t = p.title || '';
        const s = p.slug || '';
        return !/Coastal Horizon|Kadri Heights|Bejai Royal|Ullal Sovereign|Sovereign Heritage/i.test(t) &&
               !/coastal-horizon|kadri-heights|bejai-royal|ullal-sovereign/i.test(s) &&
               p.youtubeVideoId !== 'dQw4w9WgXcQ';
      });
    }

    // Also include any properties created in INITIAL_PROPERTIES cache that might not yet be in MongoDB
    if (INITIAL_PROPERTIES.length > 0) {
      INITIAL_PROPERTIES.forEach(ip => {
        const exists = properties.some(p => String(p._id || p.id) === String(ip._id || ip.id) || p.slug === ip.slug);
        if (!exists) {
          properties.push(ip);
        }
      });
    }

    // Fetch active master presets and sync each property
    const masterPresets = await getActiveMasterPresets();
    const syncedProperties = properties.map(p => syncPropertyWithMasterPresets(p, masterPresets));

    return res.json({
      success: true,
      count: syncedProperties.length,
      data: syncedProperties,
      source: mongoose.connection.readyState === 1 ? 'mongodb' : 'initial_properties'
    });
  } catch (error) {
    console.error('Error fetching properties from MongoDB:', error);
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

// POST /api/properties & POST /api/properties/properties - Create listing (Admin only)
export const createPropertyHandler = async (req, res) => {
  try {
    const body = req.body || {};
    const title = body.title?.trim() || 'Untitled Luxury Property';

    // Generate unique slug
    let slug = body.slug?.trim();
    if (!slug) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7);
    }

    // Parse price
    let parsedPrice = 0;
    if (body.pricing?.expectedPrice !== undefined) {
      parsedPrice = Number(body.pricing.expectedPrice) || 0;
    } else if (body.priceRaw !== undefined) {
      parsedPrice = Number(body.priceRaw) || 0;
    } else if (body.price) {
      parsedPrice = parseInt(String(body.price).replace(/[^0-9]/g, ''), 10) || 0;
    }

    const formatDisplayPrice = (val) => {
      if (!val) return 'Price on Request';
      if (val >= 10000000) return `₹${(val / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
      if (val >= 100000) return `₹${(val / 100000).toFixed(1).replace(/\.0$/, '')} Lakhs`;
      return `₹${val.toLocaleString('en-IN')}`;
    };

    // Parse legalVerification from body.legalVerification or body.advocateAudit
    let legalVerification = Array.isArray(body.legalVerification) && body.legalVerification.length > 0
      ? [...body.legalVerification]
      : [];

    if (body.advocateAudit) {
      const audit = body.advocateAudit;
      const isParentDeed = audit.parentDeedAudit === 'Cleared' || audit.parentDeedAudit === 'Verified' || audit.parentDeed === 'Cleared' || audit.parentDeed === true;
      const isEC = audit.encumbranceCertificate === 'Nil EC verified' || audit.encumbranceCertificate === 'Cleared' || audit.encumbranceCertificate === 'Verified' || audit.encumbrance === 'Cleared' || audit.encumbrance === true || audit.encumbranceCertificate === true;
      const isRTC = audit.revenueRtcCompliance === 'Verified' || audit.revenueRtcCompliance === 'Cleared' || audit.revenueRtc === 'Verified' || audit.revenueRtc === 'Cleared' || audit.revenueRtc === true;
      const isMCC = audit.mccPlanApprovals === 'Compliant' || audit.mccPlanApprovals === 'Cleared' || audit.mccPlanApprovals === 'Verified' || audit.mccPlan === 'Compliant' || audit.mccPlan === 'Cleared' || audit.mccPlan === true;
      const isDGPS = audit.dgpsSurveyVerification === 'Cleared' || audit.dgpsSurveyVerification === 'Verified' || audit.dgpsSurvey === 'Cleared' || audit.dgpsSurvey === true;

      const standardItems = [
        {
          documentName: 'Parent Title Deed',
          category: 'Ownership',
          verifiedStatus: isParentDeed ? 'Verified' : 'Pending',
          verificationNote: '30-Year Parent Deed Chain Audit'
        },
        {
          documentName: 'Encumbrance Certificate (30-Year EC)',
          category: 'Ownership',
          verifiedStatus: isEC ? 'Verified' : 'Pending',
          verificationNote: '30-Year Encumbrance Certificate (Nil EC verified)'
        },
        {
          documentName: 'Mutation Register Extract (RTC/Pahani)',
          category: 'Ownership',
          verifiedStatus: isRTC ? 'Verified' : 'Pending',
          verificationNote: 'Revenue RTC / Mutation Compliance (Verified)'
        },
        {
          documentName: 'Building Sanction Plan',
          category: 'Municipal',
          verifiedStatus: isMCC ? 'Verified' : 'Pending',
          verificationNote: 'MCC / Local Body Plan Approvals (Compliant)'
        },
        {
          documentName: 'Revenue / Survey Map (FMB)',
          category: 'Ownership',
          verifiedStatus: isDGPS ? 'Verified' : 'Pending',
          verificationNote: 'Physical Boundary DGPS Survey (Cleared)'
        }
      ];

      if (legalVerification.length === 0) {
        legalVerification = standardItems;
      } else {
        standardItems.forEach(item => {
          const idx = legalVerification.findIndex(l => (l.documentName || '').toLowerCase() === item.documentName.toLowerCase());
          if (idx !== -1) {
            legalVerification[idx] = {
              ...legalVerification[idx],
              verifiedStatus: item.verifiedStatus,
              verificationNote: item.verificationNote
            };
          } else {
            legalVerification.push(item);
          }
        });
      }
    }

    const isLand = (body.category === 'Land/Plot' || body.category === 'Plot' || body.type === 'Plot');

    const propertyPayload = {
      title,
      slug,
      city: 'Mangaluru',
      locality: body.locality || (body.location ? body.location.split(',')[0].trim() : 'Central'),
      category: body.category || body.type || 'Villa',
      dealType: body.dealType || 'Resale',
      pricing: {
        expectedPrice: parsedPrice,
        isNegotiable: Boolean(body.pricing?.isNegotiable || body.isNegotiable),
        maintenanceFee: Number(body.pricing?.maintenanceFee || body.maintenanceFee) || 0
      },
      specs: {
        bedrooms: isLand ? 0 : Number(body.specs?.bedrooms ?? body.beds ?? 0),
        bathrooms: isLand ? 0 : Number(body.specs?.bathrooms ?? body.baths ?? 0),
        carpetAreaSqFt: Number(body.specs?.carpetAreaSqFt) || parseInt(String(body.area || '').replace(/[^0-9]/g, ''), 10) || 0,
        furnishingStatus: isLand ? 'Unfurnished' : (body.specs?.furnishingStatus || 'Unfurnished'),
        floorLevel: body.specs?.floorLevel || 'G',
        totalFloors: body.specs?.totalFloors || '1'
      },
      youtubeVideoId: body.youtubeVideoId?.trim() || (body.videoUrl?.includes('v=') ? body.videoUrl.split('v=')[1]?.substring(0, 11) : (body.videoUrl?.includes('youtu.be/') ? body.videoUrl.split('youtu.be/')[1]?.substring(0, 11) : '')) || '',
      galleryImages: Array.isArray(body.galleryImages) && body.galleryImages.length > 0 
        ? body.galleryImages 
        : (Array.isArray(body.images) ? body.images : []),
      description: body.description || '',
      componentsMatrix: Array.isArray(body.componentsMatrix) ? body.componentsMatrix : [],
      legalVerification,
      advocateAudit: body.advocateAudit || {},
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
      advocateVerificationAvailable: Boolean(body.advocateVerificationAvailable),
      isFeatured: Boolean(body.isFeatured),
      status: body.status || 'Active',

      // Backward-compatibility legacy fields
      carpetArea: body.carpetArea || (body.specs?.carpetAreaSqFt ? `${body.specs.carpetAreaSqFt} sq.ft` : body.area || ''),
      heroVideoUrl: body.heroVideoUrl || body.videoUrl || (body.youtubeVideoId ? `https://www.youtube.com/watch?v=${body.youtubeVideoId}` : ''),
      location: body.location || `${body.locality || 'Central'}, Mangaluru`,
      price: body.price || formatDisplayPrice(parsedPrice),
      priceRaw: parsedPrice,
      type: isLand ? 'Plot' : (body.type || body.category || 'Villa'),
      beds: isLand ? 0 : Number(body.beds ?? body.specs?.bedrooms ?? 0),
      baths: isLand ? 0 : Number(body.baths ?? body.specs?.bathrooms ?? 0),
      area: body.area || (body.specs?.carpetAreaSqFt ? `${body.specs.carpetAreaSqFt} sq.ft` : body.carpetArea || ''),
      videoUrl: body.videoUrl || body.heroVideoUrl || (body.youtubeVideoId ? `https://www.youtube.com/watch?v=${body.youtubeVideoId}` : ''),
      images: Array.isArray(body.images) ? body.images : (Array.isArray(body.galleryImages) ? body.galleryImages : []),
      badge: body.badge || 'Verified Listing',
      legalStatus: body.legalStatus || 'Clear Title / RERA Verified',
      highlights: Array.isArray(body.highlights) && body.highlights.length > 0 ? body.highlights : [
        "Advocate Audited Clear Title",
        "Complete Property Inspections",
        "Mangaluru Verified Listing"
      ]
    };

    let saved;
    try {
      if (mongoose.connection.readyState === 1) {
        // Save document to MongoDB via Property.create()
        saved = await Property.create(propertyPayload);
      } else {
        // Graceful offline in-memory store
        saved = {
          ...propertyPayload,
          _id: new mongoose.Types.ObjectId().toString(),
          id: new mongoose.Types.ObjectId().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
    } catch (createErr) {
      console.warn('Property.create encountered an error, applying fallback:', createErr.message);
      saved = {
        ...propertyPayload,
        _id: new mongoose.Types.ObjectId().toString(),
        id: new mongoose.Types.ObjectId().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    const savedDoc = (typeof saved.toObject === 'function') ? saved.toObject() : saved;
    INITIAL_PROPERTIES.unshift(savedDoc);

    return res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: savedDoc
    });
  } catch (error) {
    console.error('Error creating property:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create property',
      error: error.message
    });
  }
};

router.post('/', createPropertyHandler);
router.post('/properties', createPropertyHandler);

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

    if (updateData.advocateAudit) {
      const audit = updateData.advocateAudit;
      const isParentDeed = audit.parentDeedAudit === 'Cleared' || audit.parentDeedAudit === 'Verified' || audit.parentDeed === 'Cleared' || audit.parentDeed === true;
      const isEC = audit.encumbranceCertificate === 'Nil EC verified' || audit.encumbranceCertificate === 'Cleared' || audit.encumbranceCertificate === 'Verified' || audit.encumbrance === 'Cleared' || audit.encumbrance === true || audit.encumbranceCertificate === true;
      const isRTC = audit.revenueRtcCompliance === 'Verified' || audit.revenueRtcCompliance === 'Cleared' || audit.revenueRtc === 'Verified' || audit.revenueRtc === 'Cleared' || audit.revenueRtc === true;
      const isMCC = audit.mccPlanApprovals === 'Compliant' || audit.mccPlanApprovals === 'Cleared' || audit.mccPlanApprovals === 'Verified' || audit.mccPlan === 'Compliant' || audit.mccPlan === 'Cleared' || audit.mccPlan === true;
      const isDGPS = audit.dgpsSurveyVerification === 'Cleared' || audit.dgpsSurveyVerification === 'Verified' || audit.dgpsSurvey === 'Cleared' || audit.dgpsSurvey === true;

      const standardItems = [
        {
          documentName: 'Parent Title Deed',
          category: 'Ownership',
          verifiedStatus: isParentDeed ? 'Verified' : 'Pending',
          verificationNote: '30-Year Parent Deed Chain Audit'
        },
        {
          documentName: 'Encumbrance Certificate (30-Year EC)',
          category: 'Ownership',
          verifiedStatus: isEC ? 'Verified' : 'Pending',
          verificationNote: '30-Year Encumbrance Certificate (Nil EC verified)'
        },
        {
          documentName: 'Mutation Register Extract (RTC/Pahani)',
          category: 'Ownership',
          verifiedStatus: isRTC ? 'Verified' : 'Pending',
          verificationNote: 'Revenue RTC / Mutation Compliance (Verified)'
        },
        {
          documentName: 'Building Sanction Plan',
          category: 'Municipal',
          verifiedStatus: isMCC ? 'Verified' : 'Pending',
          verificationNote: 'MCC / Local Body Plan Approvals (Compliant)'
        },
        {
          documentName: 'Revenue / Survey Map (FMB)',
          category: 'Ownership',
          verifiedStatus: isDGPS ? 'Verified' : 'Pending',
          verificationNote: 'Physical Boundary DGPS Survey (Cleared)'
        }
      ];

      if (!Array.isArray(updateData.legalVerification) || updateData.legalVerification.length === 0) {
        updateData.legalVerification = standardItems;
      } else {
        standardItems.forEach(item => {
          const idx = updateData.legalVerification.findIndex(l => (l.documentName || '').toLowerCase() === item.documentName.toLowerCase());
          if (idx !== -1) {
            updateData.legalVerification[idx] = {
              ...updateData.legalVerification[idx],
              verifiedStatus: item.verifiedStatus,
              verificationNote: item.verificationNote
            };
          } else {
            updateData.legalVerification.push(item);
          }
        });
      }
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
