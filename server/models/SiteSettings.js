import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
  heroFeaturedPropertyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property' 
  },
  heroCustomYoutubeId: { 
    type: String, 
    default: "" 
  }, // Direct YouTube ID override
  heroBadgeTag: { 
    type: String, 
    default: "FEATURED PROPERTY" 
  },
  heroOverlayTitle: { 
    type: String, 
    default: "" 
  },
  heroOverlayLocation: { 
    type: String, 
    default: "" 
  }
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
