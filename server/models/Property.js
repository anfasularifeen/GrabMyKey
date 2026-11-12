import mongoose from 'mongoose';

// 1. Dynamic Property Specification / Feature Item Schema
const ComponentItemSchema = new mongoose.Schema({
  categoryName: { type: String, required: true }, // e.g., "Interior & Living", "Building & Security"
  featureName: { type: String, required: true },  // e.g., "Modular Kitchen", "Power Backup"
  isAvailable: { type: Boolean, default: false },  // true = ✓, false = —
  status: { type: String, default: 'Not Included' },
  descriptionNote: { type: String, default: "" } // e.g., "Teak finish with Faber chimney"
}, { _id: true });

// 2. Dynamic Legal Audit Item Schema
const LegalAuditItemSchema = new mongoose.Schema({
  documentName: { type: String, required: true }, // e.g., "Encumbrance Certificate (EC)", "Khata / Possession"
  category: { type: String, default: 'General Title' }, // "Ownership", "Municipal", "Tax", "Custom"
  verifiedStatus: { 
    type: String, 
    enum: ['Verified', 'Pending', 'Issue Flagged', 'Not Applicable'], 
    default: 'Pending' 
  },
  verificationNote: { type: String, default: "" }, // e.g., "30-Year Clear EC verified via Kaveri portal"
  verifiedDate: { type: Date, default: Date.now },
  isCustomItem: { type: Boolean, default: false } // Enables dynamic admin-added legal items
}, { _id: true });

// 3. Dynamic Manual Strategic Transit & Infrastructure Item Schema
const TransitItemSchema = new mongoose.Schema({
  landmarkName: { type: String, required: true },
  travelMode: { 
    type: String, 
    enum: ['Walk', 'Drive', 'Transit', 'Flight'], 
    default: 'Drive' 
  },
  distanceText: { type: String, required: true },
  durationText: { type: String, required: true },

  // Backward compatibility fields
  destination: { type: String, default: "" },
  distanceKm: { type: Number, default: 0 },
  travelTimeMins: { type: Number, default: 0 },
  transportMode: { type: String, default: "Drive" }
}, { _id: false });

// Helper schema for legacy legal checklist items
const legalChecklistItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, required: true },
  isCleared: { type: Boolean, default: true },
  inspected: { type: Boolean, default: true },
  details: { type: String, default: '' }
}, { _id: false });

// 4. Master Property Listing Schema
const PropertySchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.Mixed },
  id: { type: String },
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  city: { type: String, enum: ['Mangaluru'], default: 'Mangaluru', required: true },
  locality: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ['Apartment', 'Villa', 'Independent House', 'Commercial', 'Land/Plot', 'Plot', 'Estate'], 
    required: true 
  },
  dealType: { type: String, enum: ['Resale', 'Rental', 'New Launch', 'Direct Sale'], required: true, default: 'Resale' },
  
  pricing: {
    expectedPrice: { type: Number, default: 0 },
    isNegotiable: { type: Boolean, default: false },
    maintenanceFee: { type: Number, default: 0 }
  },

  specs: {
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    carpetAreaSqFt: { type: Number, default: 0 },
    furnishingStatus: { 
      type: String, 
      enum: ['Fully Furnished', 'Semi-Furnished', 'Unfurnished', 'Furnished'],
      default: 'Unfurnished'
    },
    floorLevel: { type: String, default: 'G' },
    totalFloors: { type: String, default: '1' }
  },

  youtubeVideoId: { type: String, default: '' },
  galleryImages: { type: [String], default: [] },
  description: { type: String, default: '' },

  // Dynamic & Manual Admin Matrices
  componentsMatrix: [ComponentItemSchema],
  legalVerification: [LegalAuditItemSchema],
  transitMatrix: [TransitItemSchema],
  roadIngressText: { type: String, default: "40ft Wide Asphalt Road" },
  zoningTagText: { type: String, default: "RERA Compliant" },

  investmentAnalysis: {
    rentalYieldEst: { type: String, default: '' },
    resaleAppreciationEst: { type: String, default: '' },
    localityGrowthDriver: { type: String, default: '' }
  },

  advocateAudit: { type: mongoose.Schema.Types.Mixed, default: {} },
  advocateVerificationAvailable: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  status: { type: String, enum: ['Active', 'Draft', 'Sold', 'Rented'], default: 'Active' },

  // Direct Payload & Backward-compatibility Fields
  carpetArea: { type: mongoose.Schema.Types.Mixed },
  heroVideoUrl: { type: String, default: '' },
  location: { type: String, trim: true },
  price: { type: String, trim: true },
  priceRaw: { type: Number, default: 0 },
  type: { type: String },
  beds: { type: Number, default: 0 },
  baths: { type: Number, default: 0 },
  area: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  images: { type: [String], default: [] },
  hasVideo: { type: Boolean, default: false },
  badge: { type: String, default: 'Verified Listing' },
  legalStatus: { type: String, default: 'Clear Title / RERA Verified' },
  highlights: { type: [String], default: [] },
  legalChecklist: { type: [legalChecklistItemSchema], default: [] },
  inventorySpecs: { type: mongoose.Schema.Types.Mixed, default: {} },
  technicalSpecs: { type: mongoose.Schema.Types.Mixed, default: {} },
  connectivity: { type: [mongoose.Schema.Types.Mixed], default: [] },
  financials: { type: mongoose.Schema.Types.Mixed, default: {} }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id.toString();
      delete ret.__v;
      return ret;
    }
  }
});

// Helper function to extract YouTube video ID
const extractYouTubeId = (url) => {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : url;
};

// Helper function to format INR currency string
const formatInrPrice = (amount) => {
  if (!amount || isNaN(amount)) return '₹0';
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1).replace(/\.0$/, '')} Lakhs`;
  }
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

// Auto-sync backward compatibility and new schema fields before saving
PropertySchema.pre('save', function () {
  // Generate slug if absent
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7);
  }

  // Sync city and locality with location
  if (!this.city) {
    this.city = 'Mangaluru';
  }
  if (!this.locality) {
    this.locality = this.location ? this.location.split(',')[0].trim() : 'Central';
  }
  if (!this.location) {
    this.location = `${this.locality}, ${this.city}`;
  }

  // Sync category with legacy type
  if (!this.category) {
    if (this.type === 'Commercial') this.category = 'Commercial';
    else if (this.type === 'Apartment') this.category = 'Apartment';
    else if (this.type === 'Plot' || this.type === 'Plot / Land') this.category = 'Land/Plot';
    else this.category = 'Villa';
  }
  if (!this.type) {
    this.type = this.category === 'Land/Plot' ? 'Plot' : this.category;
  }

  // Sync pricing
  if (!this.pricing || !this.pricing.expectedPrice) {
    const numPrice = this.priceRaw || parseInt(String(this.price || '').replace(/[^0-9]/g, ''), 10) || 0;
    this.pricing = {
      expectedPrice: numPrice,
      isNegotiable: true,
      maintenanceFee: 0
    };
  }
  if (!this.priceRaw) {
    this.priceRaw = this.pricing.expectedPrice;
  }
  if (!this.price) {
    this.price = formatInrPrice(this.pricing.expectedPrice);
  }

  // Sync specs
  if (!this.specs) {
    this.specs = {
      bedrooms: Number(this.beds) || 0,
      bathrooms: Number(this.baths) || 0,
      carpetAreaSqFt: parseInt(String(this.area || '').replace(/[^0-9]/g, ''), 10) || 0,
      furnishingStatus: 'Fully Furnished',
      floorLevel: 'G',
      totalFloors: '1'
    };
  }
  if (this.beds === undefined || this.beds === null) {
    this.beds = this.specs.bedrooms || 0;
  }
  if (this.baths === undefined || this.baths === null) {
    this.baths = this.specs.bathrooms || 0;
  }
  if (!this.area && this.specs.carpetAreaSqFt) {
    this.area = `${this.specs.carpetAreaSqFt.toLocaleString('en-IN')} sq.ft`;
  }

  // Sync YouTube Video ID, heroVideoUrl & videoUrl
  if (!this.heroVideoUrl && this.videoUrl) {
    this.heroVideoUrl = this.videoUrl;
  }
  if (!this.videoUrl && this.heroVideoUrl) {
    this.videoUrl = this.heroVideoUrl;
  }
  if (!this.youtubeVideoId && this.videoUrl) {
    this.youtubeVideoId = extractYouTubeId(this.videoUrl);
  }
  if (!this.videoUrl && this.youtubeVideoId) {
    this.videoUrl = `https://www.youtube.com/watch?v=${this.youtubeVideoId}`;
    if (!this.heroVideoUrl) this.heroVideoUrl = this.videoUrl;
  }
  this.hasVideo = Boolean(this.youtubeVideoId || (this.videoUrl && this.videoUrl.trim().length > 0));

  // Sync carpetArea with specs and area string
  if (this.carpetArea && (!this.specs || !this.specs.carpetAreaSqFt)) {
    const parsedArea = Number(this.carpetArea) || parseInt(String(this.carpetArea).replace(/[^0-9]/g, ''), 10) || 0;
    if (this.specs) this.specs.carpetAreaSqFt = parsedArea;
  }
  if (this.carpetArea && !this.area) {
    this.area = `${this.carpetArea} sq.ft`;
  }

  // Sync images and galleryImages
  if ((!this.galleryImages || this.galleryImages.length === 0) && Array.isArray(this.images) && this.images.length > 0) {
    this.galleryImages = [...this.images];
  }
  if ((!this.images || this.images.length === 0) && Array.isArray(this.galleryImages) && this.galleryImages.length > 0) {
    this.images = [...this.galleryImages];
  }

  // Sync transitMatrix dual fields
  if (Array.isArray(this.transitMatrix)) {
    this.transitMatrix.forEach(t => {
      if (!t.landmarkName && t.destination) t.landmarkName = t.destination;
      if (!t.destination && t.landmarkName) t.destination = t.landmarkName;
      if (!t.travelMode && t.transportMode) t.travelMode = t.transportMode;
      if (!t.transportMode && t.travelMode) t.transportMode = t.travelMode;
      if (!t.distanceText && t.distanceKm !== undefined) t.distanceText = `${t.distanceKm} km`;
      if (!t.durationText && t.travelTimeMins !== undefined) t.durationText = `${t.travelTimeMins}m`;
    });
  }
});

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

export default Property;
