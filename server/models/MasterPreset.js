import mongoose from 'mongoose';

// Global Master Presets Schema
const MasterPresetSchema = new mongoose.Schema({
  presetType: {
    type: String,
    enum: ['LEGAL_CHECK', 'PROPERTY_FEATURE'],
    required: true
  },

  // For Property Feature Presets
  applicableCategory: {
    type: String,
    enum: ['ALL', 'Apartment', 'Villa', 'Independent House', 'Commercial', 'Land/Plot'],
    default: 'ALL'
  },

  // Feature or Legal Item Name
  title: { type: String, required: true },
  groupCategory: { type: String, default: 'General' }, // e.g., "Interior & Living" or "Municipal Title"
  defaultDescription: { type: String, default: '' },
  defaultStatus: { type: String, default: 'Available' }, // 'Available' | 'Not Available'
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.MasterPreset || mongoose.model('MasterPreset', MasterPresetSchema);
