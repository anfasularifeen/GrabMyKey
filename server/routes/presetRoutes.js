import express from 'express';
import mongoose from 'mongoose';
import MasterPreset from '../models/MasterPreset.js';

const router = express.Router();

export const DEFAULT_SEED_PRESETS = [
  // --- Legal Checks ---
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Parent Title Deed',
    groupCategory: 'Title',
    defaultDescription: '30-Year clear parent deed chain verified by High Court panel',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Encumbrance Certificate (30-Year EC)',
    groupCategory: 'Title',
    defaultDescription: 'Nil encumbrance Form 15 issued via Kaveri / registration portal',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Khata / Possession Certificate',
    groupCategory: 'Municipal',
    defaultDescription: 'A-Khata / Possession Certificate active and on record',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Latest Property Tax Receipts',
    groupCategory: 'Tax',
    defaultDescription: 'Municipal property tax cleared through current financial year',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Building Sanction Plan',
    groupCategory: 'Municipal',
    defaultDescription: 'Sanctioned approved construction blueprint on record',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Occupancy Certificate (OC)',
    groupCategory: 'Municipal',
    defaultDescription: 'Final Occupancy Certificate issued by statutory authority',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'No Objection Certificates (NOCs)',
    groupCategory: 'Municipal',
    defaultDescription: 'Statutory fire, pollution, and structural NOCs cleared',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'NOC from Society / Association',
    groupCategory: 'Municipal',
    defaultDescription: 'RWA / Society dues clearance and transfer NOC verified',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Possession & Allotment Letter',
    groupCategory: 'Title',
    defaultDescription: 'Original physical allotment letter and possession memo',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Utility Dues Clearances',
    groupCategory: 'Tax',
    defaultDescription: 'Power (MESCOM) and water board zero-dues receipt',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Mutation Register Extract (RTC/Pahani)',
    groupCategory: 'Title',
    defaultDescription: 'Revenue mutation extract / RTC reflects unambiguous title',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Revenue / Survey Map (FMB)',
    groupCategory: 'Title',
    defaultDescription: 'Field Measurement Book (FMB) sketch matches physical boundary',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'CRZ Coastal Clearance',
    groupCategory: 'Environmental',
    defaultDescription: 'CRZ-II/III statutory clearance certificate for coastal zoning',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Panchayat NOC',
    groupCategory: 'Municipal',
    defaultDescription: 'Panchayat building clearance and road widening setback compliance',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'RERA Registration Certificate',
    groupCategory: 'Title',
    defaultDescription: 'Statutory RERA registration certificate active and valid',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Agricultural Non-Alienation Certificate',
    groupCategory: 'Title',
    defaultDescription: 'Section 109 / Land Conversion statutory non-alienation order',
    defaultStatus: 'Available',
    isActive: true
  },

  // --- Category: Villa ---
  // Build & Material Specifications
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Flooring Type',
    groupCategory: 'Build & Materials',
    defaultDescription: 'Imported Italian Marble (Living) + Teak Hardwood (Bedrooms)',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Wood & Joinery',
    groupCategory: 'Build & Materials',
    defaultDescription: '100% Seasoned Burma Teakwood (Doors, Frames & Windows)',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Wall Finish & Paint',
    groupCategory: 'Build & Materials',
    defaultDescription: 'ROYAL Silk Emulsion + Texture Accent Walls',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Structural Frame',
    groupCategory: 'Build & Materials',
    defaultDescription: 'Earthquake Resistant RCC Framed Structure (M25 Grade)',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Roofing & Insulation',
    groupCategory: 'Build & Materials',
    defaultDescription: 'Sloped Concrete Slab with Terracotta Tiles & Heat Shield Insulation',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Sanitaryware & Fittings',
    groupCategory: 'Build & Materials',
    defaultDescription: 'Kohler / Grohe Concealed Diverters & Wall-Hung Closets',
    defaultStatus: 'Available',
    isActive: true
  },

  // Interior & Living
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Modular Kitchen',
    groupCategory: 'Interior & Living',
    defaultDescription: 'Faber Chimney, Blum Soft-Close Hardware & Quartz Island',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Air Conditioning',
    groupCategory: 'Interior & Living',
    defaultDescription: 'Daikin VRV Centralized Inverter Climate Control',
    defaultStatus: 'Available',
    isActive: true
  },

  // Building & Security
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'CCTV & Security',
    groupCategory: 'Building & Security',
    defaultDescription: '8-Channel IP Cameras + Biometric Video Door Phone',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Automated Gate',
    groupCategory: 'Building & Security',
    defaultDescription: 'Motorized RFID Sensor Ingress Gate',
    defaultStatus: 'Available',
    isActive: true
  },

  // Utilities & Outdoor
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Power Backup',
    groupCategory: 'Utilities',
    defaultDescription: '15 kVA Silent DG Generator with Auto-Transfer Switch',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Water Supply',
    groupCategory: 'Utilities',
    defaultDescription: 'Dual Source (Open Well + Municipal Supply + 10,000L Sump)',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Villa',
    title: 'Covered Vehicle Parking',
    groupCategory: 'Outdoor',
    defaultDescription: '3 SUV Parking Bay with Integrated 11kW EV Fast Charger',
    defaultStatus: 'Available',
    isActive: true
  },

  // --- Category: Apartment ---
  // Build & Material Specifications
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Apartment',
    title: 'Flooring Type',
    groupCategory: 'Build & Materials',
    defaultDescription: 'Vitrified Tiles (800x800mm) + Anti-Skid Ceramic (Balconies)',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Apartment',
    title: 'Wood & Joinery',
    groupCategory: 'Build & Materials',
    defaultDescription: 'Teakwood Main Door + Engineered Flush Internal Doors',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Apartment',
    title: 'Plumbing & Sanitary',
    groupCategory: 'Build & Materials',
    defaultDescription: 'Jaguar / Hindware CP Fittings with Solar Line Connection',
    defaultStatus: 'Available',
    isActive: true
  },

  // Amenities & Utilities
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Apartment',
    title: 'Elevator / Lifts',
    groupCategory: 'Building Amenities',
    defaultDescription: 'Dual High-Speed Passenger Lifts + Stretcher Lift',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Apartment',
    title: 'Power Backup',
    groupCategory: 'Building Amenities',
    defaultDescription: '100% Generator Backup for Common Areas & Lighting Points',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Apartment',
    title: 'Designated Parking',
    groupCategory: 'Parking',
    defaultDescription: '1 Reserved Covered Stilt Car Parking Bay',
    defaultStatus: 'Available',
    isActive: true
  },

  // --- Category: Land/Plot ---
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Land/Plot',
    title: 'Approach Road Width',
    groupCategory: 'Infrastructure & Access',
    defaultDescription: '30 ft Wide Asphalted Concrete Road Ingress',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Land/Plot',
    title: 'Compound Wall',
    groupCategory: 'Infrastructure & Access',
    defaultDescription: 'Perimeter Laterite Stone Wall with Gate',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Land/Plot',
    title: 'MUDA / MCC Approval',
    groupCategory: 'Statutory & Approvals',
    defaultDescription: 'Clear Residential Layout Approval with Sanctioned DP Plan',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Land/Plot',
    title: 'Conversion Status',
    groupCategory: 'Statutory & Approvals',
    defaultDescription: 'Non-Agricultural (NA) Conversion Completed',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Land/Plot',
    title: 'Electricity & Water Line',
    groupCategory: 'Utilities & Supply',
    defaultDescription: 'MESCOM 3-Phase Electric Connection & Municipal Water Link Ready',
    defaultStatus: 'Available',
    isActive: true
  },

  // --- Category: Commercial ---
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Commercial',
    title: 'Floor Plate & Ceiling',
    groupCategory: 'Structure',
    defaultDescription: 'Clear 12ft ceiling height with open column grid',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Commercial',
    title: 'Commercial Power Load',
    groupCategory: 'Utilities & Safety',
    defaultDescription: '30kW sanctioned commercial power connection',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Commercial',
    title: 'Fire Fighting Infrastructure',
    groupCategory: 'Utilities & Safety',
    defaultDescription: 'NOC approved sprinklers, smoke detectors & hose reels',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    presetType: 'PROPERTY_FEATURE',
    applicableCategory: 'Commercial',
    title: 'Service Lift & Bay',
    groupCategory: 'Access & Loading',
    defaultDescription: 'Dedicated freight elevator & rear loading bay',
    defaultStatus: 'Available',
    isActive: true
  }
];

// In-memory store fallback for offline/sandbox environments
export let memoryPresets = DEFAULT_SEED_PRESETS.map((p, idx) => ({
  ...p,
  _id: `mem-preset-${idx + 1}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}));

// Retrieve all active master presets from MongoDB with resilient memory fallback
export const getActiveMasterPresets = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      const count = await MasterPreset.countDocuments();
      if (count === 0) {
        await MasterPreset.insertMany(DEFAULT_SEED_PRESETS);
      }
      const presets = await MasterPreset.find({ isActive: true });
      if (presets && presets.length > 0) {
        return presets.map(p => (typeof p.toObject === 'function' ? p.toObject() : p));
      }
    }
  } catch (err) {
    console.warn('Error fetching active presets from MongoDB, falling back to memory store:', err.message);
  }
  return memoryPresets.filter(p => p.isActive !== false);
};

// GET /api/presets - Fetch all presets with optional filters
router.get('/', async (req, res) => {
  try {
    const { presetType, applicableCategory, isActive } = req.query;

    if (mongoose.connection.readyState === 1) {
      const count = await MasterPreset.countDocuments();
      if (count === 0) {
        console.log('Seeding MasterPreset collection with default legal checks & feature sets...');
        await MasterPreset.insertMany(DEFAULT_SEED_PRESETS);
      }

      const query = {};
      if (presetType) query.presetType = presetType;
      if (applicableCategory && applicableCategory !== 'ALL') {
        query.$or = [{ applicableCategory: 'ALL' }, { applicableCategory }];
      }
      if (isActive !== undefined) {
        query.isActive = isActive === 'true' || isActive === true;
      }

      const presets = await MasterPreset.find(query).sort({ groupCategory: 1, title: 1 });
      return res.json({
        success: true,
        count: presets.length,
        data: presets
      });
    }

    // Memory store fallback
    let filtered = [...memoryPresets];
    if (presetType) {
      filtered = filtered.filter(p => p.presetType === presetType);
    }
    if (applicableCategory && applicableCategory !== 'ALL') {
      filtered = filtered.filter(p => p.applicableCategory === 'ALL' || p.applicableCategory === applicableCategory);
    }
    if (isActive !== undefined) {
      const boolVal = isActive === 'true' || isActive === true;
      filtered = filtered.filter(p => p.isActive === boolVal);
    }

    return res.json({
      success: true,
      count: filtered.length,
      data: filtered,
      note: 'Serving from memory store (MongoDB disconnected)'
    });
  } catch (err) {
    console.error('Error fetching master presets:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch master presets',
      error: err.message
    });
  }
});

// POST /api/presets - Create a new preset
router.post('/', async (req, res) => {
  try {
    const {
      presetType,
      applicableCategory = 'ALL',
      title,
      groupCategory = 'General',
      defaultDescription = '',
      defaultStatus = 'Available',
      isActive = true
    } = req.body;

    if (!presetType || !title) {
      return res.status(400).json({
        success: false,
        message: 'presetType and title are required fields.'
      });
    }

    const newPresetData = {
      presetType,
      applicableCategory,
      title: title.trim(),
      groupCategory: groupCategory.trim(),
      defaultDescription: defaultDescription.trim(),
      defaultStatus,
      isActive: Boolean(isActive)
    };

    if (mongoose.connection.readyState === 1) {
      const created = await MasterPreset.create(newPresetData);
      return res.status(201).json({
        success: true,
        message: 'Master preset created successfully',
        data: created
      });
    }

    const createdMemory = {
      ...newPresetData,
      _id: `mem-preset-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryPresets.push(createdMemory);

    return res.status(201).json({
      success: true,
      message: 'Master preset created in memory',
      data: createdMemory
    });
  } catch (err) {
    console.error('Error creating master preset:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create master preset',
      error: err.message
    });
  }
});

// PUT /api/presets/:id - Update an existing preset
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    delete updateData._id;

    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        const updated = await MasterPreset.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (updated) {
          return res.json({
            success: true,
            message: 'Master preset updated',
            data: updated
          });
        }
      }
    }

    // In-memory update
    const idx = memoryPresets.findIndex(p => String(p._id) === String(id));
    if (idx !== -1) {
      memoryPresets[idx] = {
        ...memoryPresets[idx],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      return res.json({
        success: true,
        message: 'Master preset updated in memory',
        data: memoryPresets[idx]
      });
    }

    return res.status(404).json({
      success: false,
      message: `Preset with id ${id} not found.`
    });
  } catch (err) {
    console.error('Error updating master preset:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update master preset',
      error: err.message
    });
  }
});

// DELETE /api/presets/:id - Delete a preset
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const deleted = await MasterPreset.findByIdAndDelete(id);
      if (deleted) {
        return res.json({
          success: true,
          message: 'Master preset deleted',
          data: deleted
        });
      }
    }

    const idx = memoryPresets.findIndex(p => String(p._id) === String(id));
    if (idx !== -1) {
      const [removed] = memoryPresets.splice(idx, 1);
      return res.json({
        success: true,
        message: 'Master preset removed from memory',
        data: removed
      });
    }

    return res.status(404).json({
      success: false,
      message: `Preset with id ${id} not found.`
    });
  } catch (err) {
    console.error('Error deleting master preset:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete master preset',
      error: err.message
    });
  }
});

// POST /api/presets/seed-defaults - Force reset to default presets
router.post('/seed-defaults', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await MasterPreset.deleteMany({});
      const created = await MasterPreset.insertMany(DEFAULT_SEED_PRESETS);
      return res.json({
        success: true,
        message: 'Successfully reset database to master defaults',
        count: created.length,
        data: created
      });
    }

    memoryPresets = DEFAULT_SEED_PRESETS.map((p, idx) => ({
      ...p,
      _id: `mem-preset-${idx + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    return res.json({
      success: true,
      message: 'Successfully reset memory store to master defaults',
      count: memoryPresets.length,
      data: memoryPresets
    });
  } catch (err) {
    console.error('Error seeding master presets:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to seed master presets',
      error: err.message
    });
  }
});

export default router;
