// Default Master Presets for GrabMyKey Executive Console

// --- 1. Dynamic Asset-Specific Property Specifications ---
export const ASSET_SPEC_PRESETS = {
  // --- VILLA / INDEPENDENT HOUSE ---
  Villa: [
    // Build & Material Specifications
    { category: "Build & Materials", feature: "Flooring Type", status: "Included", details: "Imported Italian Marble (Living) + Teak Hardwood (Bedrooms)" },
    { category: "Build & Materials", feature: "Wood & Joinery", status: "Included", details: "100% Seasoned Burma Teakwood (Doors, Frames & Windows)" },
    { category: "Build & Materials", feature: "Wall Finish & Paint", status: "Included", details: "ROYAL Silk Emulsion + Texture Accent Walls" },
    { category: "Build & Materials", feature: "Structural Frame", status: "Included", details: "Earthquake Resistant RCC Framed Structure (M25 Grade)" },
    { category: "Build & Materials", feature: "Roofing & Insulation", status: "Included", details: "Sloped Concrete Slab with Terracotta Tiles & Heat Shield Insulation" },
    { category: "Build & Materials", feature: "Sanitaryware & Fittings", status: "Included", details: "Kohler / Grohe Concealed Diverters & Wall-Hung Closets" },

    // Interior & Living
    { category: "Interior & Living", feature: "Modular Kitchen", status: "Included", details: "Faber Chimney, Blum Soft-Close Hardware & Quartz Island" },
    { category: "Interior & Living", feature: "Air Conditioning", status: "Included", details: "Daikin VRV Centralized Inverter Climate Control" },

    // Building & Security
    { category: "Building & Security", feature: "CCTV & Security", status: "Included", details: "8-Channel IP Cameras + Biometric Video Door Phone" },
    { category: "Building & Security", feature: "Automated Gate", status: "Included", details: "Motorized RFID Sensor Ingress Gate" },

    // Utilities & Outdoor
    { category: "Utilities", feature: "Power Backup", status: "Included", details: "15 kVA Silent DG Generator with Auto-Transfer Switch" },
    { category: "Utilities", feature: "Water Supply", status: "Included", details: "Dual Source (Open Well + Municipal Supply + 10,000L Sump)" },
    { category: "Outdoor", feature: "Covered Vehicle Parking", status: "Included", details: "3 SUV Parking Bay with Integrated 11kW EV Fast Charger" }
  ],

  // --- FLAT / APARTMENT ---
  Apartment: [
    // Build & Material Specifications
    { category: "Build & Materials", feature: "Flooring Type", status: "Included", details: "Vitrified Tiles (800x800mm) + Anti-Skid Ceramic (Balconies)" },
    { category: "Build & Materials", feature: "Wood & Joinery", status: "Included", details: "Teakwood Main Door + Engineered Flush Internal Doors" },
    { category: "Build & Materials", feature: "Plumbing & Sanitary", status: "Included", details: "Jaguar / Hindware CP Fittings with Solar Line Connection" },

    // Amenities & Utilities
    { category: "Building Amenities", feature: "Elevator / Lifts", status: "Included", details: "Dual High-Speed Passenger Lifts + Stretcher Lift" },
    { category: "Building Amenities", feature: "Power Backup", status: "Included", details: "100% Generator Backup for Common Areas & Lighting Points" },
    { category: "Parking", feature: "Designated Parking", status: "Included", details: "1 Reserved Covered Stilt Car Parking Bay" }
  ],

  // --- PLOT / RESIDENTIAL LAND (Build materials not loaded for plots) ---
  Plot: [
    { category: "Infrastructure & Access", feature: "Approach Road Width", status: "Included", details: "30 ft Wide Asphalted Concrete Road Ingress" },
    { category: "Infrastructure & Access", feature: "Compound Wall", status: "Included", details: "Perimeter Laterite Stone Wall with Gate" },
    { category: "Statutory & Approvals", feature: "MUDA / MCC Approval", status: "Included", details: "Clear Residential Layout Approval with Sanctioned DP Plan" },
    { category: "Statutory & Approvals", feature: "Conversion Status", status: "Included", details: "Non-Agricultural (NA) Conversion Completed" },
    { category: "Utilities & Supply", feature: "Electricity & Water Line", status: "Included", details: "MESCOM 3-Phase Electric Connection & Municipal Water Link Ready" }
  ],

  // --- COMMERCIAL PROPERTY ---
  Commercial: [
    { category: "Structure", feature: "Floor Plate & Ceiling", status: "Included", details: "Clear 12ft ceiling height with open column grid" },
    { category: "Utilities & Safety", feature: "Commercial Power Load", status: "Included", details: "30kW sanctioned commercial power connection" },
    { category: "Utilities & Safety", feature: "Fire Fighting Infrastructure", status: "Included", details: "NOC approved sprinklers, smoke detectors & hose reels" },
    { category: "Access & Loading", feature: "Service Lift & Bay", status: "Included", details: "Dedicated freight elevator & rear loading bay" }
  ]
};

// Category Aliases
ASSET_SPEC_PRESETS['Independent House'] = ASSET_SPEC_PRESETS.Villa;
ASSET_SPEC_PRESETS['Villa / House'] = ASSET_SPEC_PRESETS.Villa;
ASSET_SPEC_PRESETS['Flat / Apartment'] = ASSET_SPEC_PRESETS.Apartment;
ASSET_SPEC_PRESETS['Land/Plot'] = ASSET_SPEC_PRESETS.Plot;
ASSET_SPEC_PRESETS['Plot / Land'] = ASSET_SPEC_PRESETS.Plot;

// Safe Category Preset Resolver
export const getAssetSpecPresets = (category) => {
  if (!category) return ASSET_SPEC_PRESETS.Villa;
  const normalized = String(category).trim();
  if (ASSET_SPEC_PRESETS[normalized]) return ASSET_SPEC_PRESETS[normalized];
  const lower = normalized.toLowerCase();
  if (lower.includes('apartment') || lower.includes('flat')) return ASSET_SPEC_PRESETS.Apartment;
  if (lower.includes('plot') || lower.includes('land')) return ASSET_SPEC_PRESETS.Plot;
  if (lower.includes('commercial')) return ASSET_SPEC_PRESETS.Commercial;
  return ASSET_SPEC_PRESETS.Villa;
};

// --- 2. Master Presets for Executive Admin Console ---
export const DEFAULT_MASTER_PRESETS = [
  // --- Legal Checks ---
  {
    _id: 'preset-legal-1',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Parent Title Deed',
    groupCategory: 'Title',
    defaultDescription: '30-Year clear parent deed chain verified by High Court panel',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-2',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Encumbrance Certificate (30-Year EC)',
    groupCategory: 'Title',
    defaultDescription: 'Nil encumbrance Form 15 issued via Kaveri / registration portal',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-3',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Khata / Possession Certificate',
    groupCategory: 'Municipal',
    defaultDescription: 'A-Khata / Possession Certificate active and on record',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-4',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Latest Property Tax Receipts',
    groupCategory: 'Tax',
    defaultDescription: 'Municipal property tax cleared through current financial year',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-5',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Building Sanction Plan',
    groupCategory: 'Municipal',
    defaultDescription: 'Sanctioned approved construction blueprint on record',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-6',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Occupancy Certificate (OC)',
    groupCategory: 'Municipal',
    defaultDescription: 'Final Occupancy Certificate issued by statutory authority',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-7',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'No Objection Certificates (NOCs)',
    groupCategory: 'Municipal',
    defaultDescription: 'Statutory fire, pollution, and structural NOCs cleared',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-8',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'NOC from Society / Association',
    groupCategory: 'Municipal',
    defaultDescription: 'RWA / Society dues clearance and transfer NOC verified',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-9',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Possession & Allotment Letter',
    groupCategory: 'Title',
    defaultDescription: 'Original physical allotment letter and possession memo',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-10',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Utility Dues Clearances',
    groupCategory: 'Tax',
    defaultDescription: 'Power (MESCOM) and water board zero-dues receipt',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-11',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Mutation Register Extract (RTC/Pahani)',
    groupCategory: 'Title',
    defaultDescription: 'Revenue mutation extract / RTC reflects unambiguous title',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-12',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Revenue / Survey Map (FMB)',
    groupCategory: 'Title',
    defaultDescription: 'Field Measurement Book (FMB) sketch matches physical boundary',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-13',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'CRZ Coastal Clearance',
    groupCategory: 'Environmental',
    defaultDescription: 'CRZ-II/III statutory clearance certificate for coastal zoning',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-14',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Panchayat NOC',
    groupCategory: 'Municipal',
    defaultDescription: 'Panchayat building clearance and road widening setback compliance',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-15',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'RERA Registration Certificate',
    groupCategory: 'Title',
    defaultDescription: 'Statutory RERA registration certificate active and valid',
    defaultStatus: 'Available',
    isActive: true
  },
  {
    _id: 'preset-legal-16',
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: 'Agricultural Non-Alienation Certificate',
    groupCategory: 'Title',
    defaultDescription: 'Section 109 / Land Conversion statutory non-alienation order',
    defaultStatus: 'Available',
    isActive: true
  },

  // --- Category-Filtered Property Feature Presets (Generated from ASSET_SPEC_PRESETS) ---
  ...['Villa', 'Apartment', 'Plot', 'Commercial'].flatMap(cat => {
    const applicableCat = cat === 'Plot' ? 'Land/Plot' : cat;
    return ASSET_SPEC_PRESETS[cat].map((item, idx) => ({
      _id: `preset-feat-${cat.toLowerCase().slice(0, 3)}-${idx + 1}`,
      presetType: 'PROPERTY_FEATURE',
      applicableCategory: applicableCat,
      title: item.feature,
      groupCategory: item.category,
      defaultDescription: item.details,
      defaultStatus: item.status === 'Included' ? 'Available' : 'Not Available',
      isActive: true
    }));
  })
];
