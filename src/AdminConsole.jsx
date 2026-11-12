import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Building2, Users, PlusCircle, Trash2, Edit3,
  CheckCircle2, Eye, RefreshCw, Phone, Search, DollarSign,
  Sparkles, MapPin, X, Check, Save, ArrowLeft, Video, Upload,
  FileText, ShieldCheck, Layers, Car,
  FileCheck, ArrowUpRight, Play, FolderCog, Tag, Filter,
  ChevronUp, ChevronDown, Footprints, Train, Plane
} from 'lucide-react';

import {
  fetchProperties,
  createProperty,
  updateProperty,
  deleteProperty,
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
} from './api';
import { DEFAULT_MASTER_PRESETS, ASSET_SPEC_PRESETS, getAssetSpecPresets } from './defaultPresets';
import Navbar from './components/admin/Navbar';
import Sidebar from './components/admin/Sidebar';
import AddCustomItemModal from './components/AddCustomItemModal';



// Preset: Default 12-Point Legal Checklist (Defaults to Pending for new listings)
const DEFAULT_12_POINT_LEGAL_CHECKLIST = [
  { documentName: "Parent Title Deed", category: "Ownership", verifiedStatus: "Pending", verificationNote: "30-Year clear parent deed chain audit", isCustomItem: false },
  { documentName: "Encumbrance Certificate (30-Year EC)", category: "Ownership", verifiedStatus: "Pending", verificationNote: "Nil encumbrance Form 15 status", isCustomItem: false },
  { documentName: "Khata / Possession Certificate", category: "Municipal", verifiedStatus: "Pending", verificationNote: "A-Khata / Possession Certificate verification", isCustomItem: false },
  { documentName: "Latest Property Tax Receipts", category: "Tax", verifiedStatus: "Pending", verificationNote: "Municipal property tax clearance", isCustomItem: false },
  { documentName: "Building Sanction Plan", category: "Municipal", verifiedStatus: "Pending", verificationNote: "Sanctioned approved construction blueprint on record", isCustomItem: false },
  { documentName: "Occupancy Certificate (OC)", category: "Municipal", verifiedStatus: "Pending", verificationNote: "Final Occupancy Certificate issued by statutory authority", isCustomItem: false },
  { documentName: "No Objection Certificates (NOCs)", category: "Municipal", verifiedStatus: "Pending", verificationNote: "Statutory fire, pollution, and structural NOCs", isCustomItem: false },
  { documentName: "NOC from Society / Association", category: "Municipal", verifiedStatus: "Pending", verificationNote: "RWA / Society dues clearance and transfer NOC", isCustomItem: false },
  { documentName: "Possession & Allotment Letter", category: "Ownership", verifiedStatus: "Pending", verificationNote: "Original physical allotment letter and possession memo", isCustomItem: false },
  { documentName: "Utility Dues Clearances", category: "Tax", verifiedStatus: "Pending", verificationNote: "Power (MESCOM) and water board zero-dues receipt", isCustomItem: false },
  { documentName: "Mutation Register Extract (RTC/Pahani)", category: "Ownership", verifiedStatus: "Pending", verificationNote: "Revenue mutation extract / RTC status", isCustomItem: false },
  { documentName: "Revenue / Survey Map (FMB)", category: "Ownership", verifiedStatus: "Pending", verificationNote: "Field Measurement Book (FMB) physical boundary verification", isCustomItem: false }
];

// Preset: Default Dynamic Property Features Matrix (Defaults to Not Included for new listings)
const DEFAULT_PROPERTY_FEATURES = [
  // Build & Material Specifications
  { categoryName: "Build & Materials", featureName: "Flooring Type", isAvailable: false, status: 'Not Included', descriptionNote: "Imported Italian Marble (Living) + Teak Hardwood (Bedrooms)" },
  { categoryName: "Build & Materials", featureName: "Wood & Joinery", isAvailable: false, status: 'Not Included', descriptionNote: "100% Seasoned Burma Teakwood (Doors, Frames & Windows)" },
  { categoryName: "Build & Materials", featureName: "Wall Finish & Paint", isAvailable: false, status: 'Not Included', descriptionNote: "ROYAL Silk Emulsion + Texture Accent Walls" },
  { categoryName: "Build & Materials", featureName: "Structural Frame", isAvailable: false, status: 'Not Included', descriptionNote: "Earthquake Resistant RCC Framed Structure (M25 Grade)" },
  { categoryName: "Build & Materials", featureName: "Roofing & Insulation", isAvailable: false, status: 'Not Included', descriptionNote: "Sloped Concrete Slab with Terracotta Tiles & Heat Shield Insulation" },
  { categoryName: "Build & Materials", featureName: "Sanitaryware & Fittings", isAvailable: false, status: 'Not Included', descriptionNote: "Kohler / Grohe Concealed Diverters & Wall-Hung Closets" },

  // Interior & Living
  { categoryName: "Interior & Living", featureName: "Modular Kitchen", isAvailable: false, status: 'Not Included', descriptionNote: "Faber Chimney, Blum Soft-Close Hardware & Quartz Island" },
  { categoryName: "Interior & Living", featureName: "Air Conditioning", isAvailable: false, status: 'Not Included', descriptionNote: "Daikin VRV Centralized Inverter Climate Control" },

  // Building & Security
  { categoryName: "Building & Security", featureName: "CCTV & Security", isAvailable: false, status: 'Not Included', descriptionNote: "8-Channel IP Cameras + Biometric Video Door Phone" },
  { categoryName: "Building & Security", featureName: "Automated Gate", isAvailable: false, status: 'Not Included', descriptionNote: "Motorized RFID Sensor Ingress Gate" },

  // Utilities & Outdoor
  { categoryName: "Utilities", featureName: "Power Backup", isAvailable: false, status: 'Not Included', descriptionNote: "15 kVA Silent DG Generator with Auto-Transfer Switch" },
  { categoryName: "Utilities", featureName: "Water Supply", isAvailable: false, status: 'Not Included', descriptionNote: "Dual Source (Open Well + Municipal Supply + 10,000L Sump)" },
  { categoryName: "Outdoor", featureName: "Covered Vehicle Parking", isAvailable: false, status: 'Not Included', descriptionNote: "3 SUV Parking Bay with Integrated 11kW EV Fast Charger" }
];
const DEFAULT_CAR_STYLE_FEATURES = DEFAULT_PROPERTY_FEATURES; // Alias for backward compatibility

// Preset: Default Manual Strategic Transit & Infrastructure
const DEFAULT_TRANSIT_MATRIX = [
  { landmarkName: "Mangaluru International Airport (IXE)", destination: "Mangaluru International Airport (IXE)", distanceText: "14.2 km", distanceKm: 14.2, durationText: "20m", travelTimeMins: 20, travelMode: "Flight", transportMode: "Drive" },
  { landmarkName: "Surathkal Railway Station", destination: "Surathkal Railway Station", distanceText: "3.5 km", distanceKm: 3.5, durationText: "8m", travelTimeMins: 8, travelMode: "Transit", transportMode: "Drive" },
  { landmarkName: "NITK Surathkal Campus & Beach", destination: "NITK Surathkal Campus & Beach", distanceText: "2.1 km", distanceKm: 2.1, durationText: "5m", travelTimeMins: 5, travelMode: "Drive", transportMode: "Drive" },
  { landmarkName: "Mangalore City Central / Hampankatta", destination: "Mangalore City Central / Hampankatta", distanceText: "17.5 km", distanceKm: 17.5, durationText: "25m", travelTimeMins: 25, travelMode: "Drive", transportMode: "Drive" }
];

// Initial state for property creation/editing (All toggles & checkboxes default to false / unchecked)
const INITIAL_FORM_STATE = {
  title: '',
  slug: '',
  city: 'Mangaluru',
  locality: 'Bejai',
  category: 'Villa',
  dealType: 'Resale',
  expectedPrice: 27500000,
  isNegotiable: false,
  maintenanceFee: 0,
  bedrooms: 4,
  bathrooms: 4,
  carpetAreaSqFt: 3800,
  furnishingStatus: 'Unfurnished',
  floorLevel: 'G+1',
  totalFloors: '2',
  youtubeVideoId: '',
  galleryImagesStr: '',
  description: '',
  badge: 'Verified Listing',
  isFeatured: false,
  status: 'Active',
  advocateVerificationAvailable: false,

  // Dynamic Car-Style Feature Matrix (Defaults to Not Included)
  componentsMatrix: DEFAULT_CAR_STYLE_FEATURES,

  // Manual Strategic Transit & Infrastructure
  transitMatrix: DEFAULT_TRANSIT_MATRIX,
  roadIngressText: '',
  zoningTagText: '',

  // Dynamic Self-Verifiable Legal Audit (Defaults to Pending)
  legalVerification: DEFAULT_12_POINT_LEGAL_CHECKLIST,

  // Statutory Advocate Audit State
  advocateAudit: {
    parentDeedAudit: 'Pending',
    encumbranceCertificate: 'Pending',
    revenueRtcCompliance: 'Pending',
    mccPlanApprovals: 'Pending',
    dgpsSurveyVerification: 'Pending'
  },

  // Investment Analysis
  rentalYieldEst: '',
  resaleAppreciationEst: '',
  localityGrowthDriver: ''
};

const SAMPLE_PROPERTIES = [];

const SAMPLE_INBOUND_LEADS = [];

export default function AdminConsole({ onExit, onViewLiveProperty, onDataUpdated }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Active view tab state derived from URL or internal selection
  const isPublishRoute = location.pathname.includes('publish-listing');
  const isMasterPresetsRoute = location.pathname.includes('master-presets');
  const [internalTab, setInternalTab] = useState('overview');
  const activeTab = isPublishRoute ? 'publish-listing' : (isMasterPresetsRoute ? 'master-presets' : internalTab);

  // Data states
  const [properties, setProperties] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [leadStatusFilter, setLeadStatusFilter] = useState('All');

  // Master Presets & System Config state
  const [presets, setPresets] = useState(DEFAULT_MASTER_PRESETS);
  const [presetTab, setPresetTab] = useState('legal'); // 'legal' | 'features'
  const [presetCategoryFilter, setPresetCategoryFilter] = useState('Apartment'); // For Tab 2
  const [presetGroupFilter, setPresetGroupFilter] = useState('All');
  const [presetSearchQuery, setPresetSearchQuery] = useState('');
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [editingPresetId, setEditingPresetId] = useState(null);
  const [isSavingPreset, setIsSavingPreset] = useState(false);
  const [presetFormData, setPresetFormData] = useState({
    presetType: 'LEGAL_CHECK',
    applicableCategory: 'ALL',
    title: '',
    groupCategory: 'Title',
    defaultDescription: '',
    defaultStatus: 'Available',
    isActive: true
  });

  // Form & Wizard state for View 4: Publish Listing
  const [formStep, setFormStep] = useState(1);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showYoutubePicker, setShowYoutubePicker] = useState(false);

  // Custom Modal State (Replacing window.prompt)
  const [customItemModal, setCustomItemModal] = useState({
    isOpen: false,
    type: '', // 'FEATURE' | 'LEGAL'
    categoryName: '',
    title: '',
    note: '',
    status: 'Verified'
  });

  // Hero Featured Video & Settings state
  const [heroSettings, setHeroSettings] = useState({
    heroFeaturedPropertyId: '',
    heroCustomYoutubeId: '',
    heroBadgeTag: 'FEATURED PROPERTY',
    heroOverlayTitle: '',
    heroOverlayLocation: ''
  });
  const [isSavingHeroSettings, setIsSavingHeroSettings] = useState(false);
  const [heroSaveSuccess, setHeroSaveSuccess] = useState(false);

  // Dynamic feature selector based on category and presets (defaults to false / Not Included for new listings)
  const getFeaturesForCategory = (cat, defaultAvailable = false) => {
    const rawPresets = getAssetSpecPresets(cat);
    return rawPresets.map(p => ({
      categoryName: p.category,
      featureName: p.feature,
      isAvailable: defaultAvailable,
      status: defaultAvailable ? 'Included' : 'Not Included',
      descriptionNote: p.details
    }));
  };

  // Master Presets Action Handlers
  const handleOpenAddPreset = (type = 'LEGAL_CHECK') => {
    setEditingPresetId(null);
    if (type === 'LEGAL_CHECK') {
      setPresetFormData({
        presetType: 'LEGAL_CHECK',
        applicableCategory: 'ALL',
        title: '',
        groupCategory: 'Title',
        defaultDescription: '',
        defaultStatus: 'Available',
        isActive: true
      });
    } else {
      setPresetFormData({
        presetType: 'PROPERTY_FEATURE',
        applicableCategory: presetCategoryFilter === 'ALL' ? 'Apartment' : presetCategoryFilter,
        title: '',
        groupCategory: 'Interior & Living',
        defaultDescription: '',
        defaultStatus: 'Available',
        isActive: true
      });
    }
    setShowPresetModal(true);
  };

  const handleOpenEditPreset = (item) => {
    setEditingPresetId(item._id || item.id);
    setPresetFormData({
      presetType: item.presetType || 'LEGAL_CHECK',
      applicableCategory: item.applicableCategory || 'ALL',
      title: item.title || '',
      groupCategory: item.groupCategory || (item.presetType === 'LEGAL_CHECK' ? 'Title' : 'General'),
      defaultDescription: item.defaultDescription || '',
      defaultStatus: item.defaultStatus || 'Available',
      isActive: item.isActive !== false
    });
    setShowPresetModal(true);
  };

  const handleSavePreset = async (e) => {
    e.preventDefault();
    if (!presetFormData.title || !presetFormData.title.trim()) {
      alert('Please enter a title / document name.');
      return;
    }

    setIsSavingPreset(true);
    try {
      if (editingPresetId) {
        const res = await updatePreset(editingPresetId, presetFormData);
        if (res?.success && res.data) {
          setPresets(prev => prev.map(p => (String(p._id) === String(editingPresetId) || String(p.id) === String(editingPresetId)) ? res.data : p));
        } else {
          setPresets(prev => prev.map(p => (String(p._id) === String(editingPresetId) || String(p.id) === String(editingPresetId)) ? { ...p, ...presetFormData } : p));
        }
      } else {
        const res = await createPreset(presetFormData);
        if (res?.success && res.data) {
          setPresets(prev => [...prev, res.data]);
        } else {
          const fallbackItem = { ...presetFormData, _id: `local-${Date.now()}` };
          setPresets(prev => [...prev, fallbackItem]);
        }
      }
      setShowPresetModal(false);
    } catch (err) {
      console.warn('Saved preset to local state:', err.message);
      if (editingPresetId) {
        setPresets(prev => prev.map(p => (String(p._id) === String(editingPresetId) || String(p.id) === String(editingPresetId)) ? { ...p, ...presetFormData } : p));
      } else {
        setPresets(prev => [...prev, { ...presetFormData, _id: `local-${Date.now()}` }]);
      }
      setShowPresetModal(false);
    } finally {
      setIsSavingPreset(false);
    }
  };

  const handleDeletePreset = async (id) => {
    if (!window.confirm('Delete this master preset? Listings already published will retain their existing records.')) {
      return;
    }
    try {
      await deletePreset(id);
    } catch (err) {
      console.warn('Deleted preset locally:', err.message);
    }
    setPresets(prev => prev.filter(p => String(p._id) !== String(id) && String(p.id) !== String(id)));
  };

  const handleTogglePresetActive = async (item) => {
    const id = item._id || item.id;
    const newActive = item.isActive === false ? true : false;
    setPresets(prev => prev.map(p => (String(p._id) === String(id) || String(p.id) === String(id)) ? { ...p, isActive: newActive } : p));
    try {
      await updatePreset(id, { isActive: newActive });
    } catch (err) {
      console.warn('Toggled preset locally:', err.message);
    }
  };

  const handleSeedDefaults = async () => {
    if (!window.confirm('Reset master presets to statutory GrabMyKey defaults? Custom presets will be refreshed.')) {
      return;
    }
    try {
      const res = await seedDefaultPresets();
      if (res?.success && Array.isArray(res.data)) {
        setPresets(res.data);
      } else {
        setPresets(DEFAULT_MASTER_PRESETS);
      }
      alert('Master presets reset to statutory defaults successfully!');
    } catch (err) {
      console.warn('Using local default master presets:', err.message);
      setPresets(DEFAULT_MASTER_PRESETS);
      alert('Master presets reset to statutory defaults.');
    }
  };

  // Load database data on mount
  const loadData = async () => {
    setLoading(true);
    try {
      await checkServerHealth();

      const propRes = await fetchProperties();
      if (propRes?.success && Array.isArray(propRes.data)) {
        setProperties(propRes.data);
      } else {
        setProperties([]);
      }

      const leadRes = await fetchLeads();
      if (leadRes?.success && Array.isArray(leadRes.data)) {
        setLeads(leadRes.data);
      } else {
        setLeads([]);
      }

      try {
        const settingsRes = await fetchSiteSettings();
        if (settingsRes?.success && settingsRes.data) {
          const d = settingsRes.data;
          setHeroSettings({
            heroFeaturedPropertyId: d.heroFeaturedPropertyId?._id || d.heroFeaturedPropertyId || '',
            heroCustomYoutubeId: d.heroCustomYoutubeId || '',
            heroBadgeTag: d.heroBadgeTag || 'FEATURED PROPERTY',
            heroOverlayTitle: d.heroOverlayTitle || '',
            heroOverlayLocation: d.heroOverlayLocation || ''
          });
        }
      } catch (settingsErr) {
        console.warn('Could not load site settings in admin:', settingsErr.message);
      }

      try {
        const presetRes = await fetchPresets();
        if (presetRes?.success && Array.isArray(presetRes.data) && presetRes.data.length > 0) {
          setPresets(presetRes.data);
        }
      } catch (presetErr) {
        console.warn('Using default master presets:', presetErr.message);
      }
    } catch (err) {
      console.warn('Admin running on cached state:', err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadData();
    const handleRefreshEvent = () => {
      loadData();
    };
    window.addEventListener('grabmykey_properties_updated', handleRefreshEvent);
    window.addEventListener('grabmykey_property_created', handleRefreshEvent);
    return () => {
      window.removeEventListener('grabmykey_properties_updated', handleRefreshEvent);
      window.removeEventListener('grabmykey_property_created', handleRefreshEvent);
    };
  }, []);

  // Navigation handlers
  const handleTabSwitch = (tabName) => {
    if (tabName === 'publish-listing') {
      navigate('/manage-345/publish-listing');
    } else if (tabName === 'master-presets') {
      navigate('/manage-345/master-presets');
    } else {
      setInternalTab(tabName);
      if (location.pathname !== '/manage-345') {
        navigate('/manage-345');
      }
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPropertyId(null);
    setFormData(INITIAL_FORM_STATE);
    setFormStep(1);
    navigate('/manage-345/publish-listing');
  };

  const handleCancelForm = () => {
    setEditingPropertyId(null);
    setFormData(INITIAL_FORM_STATE);
    setFormStep(1);
    handleTabSwitch('inventory');
  };

  const handleOpenEditModal = (prop) => {
    setEditingPropertyId(prop._id || prop.id);
    const resolvedCat = prop.category || prop.type || 'Villa';
    const numPrice = prop.pricing?.expectedPrice || prop.priceRaw || parseInt(String(prop.price || '').replace(/[^0-9]/g, ''), 10) || 25000000;
    const resolvedCity = 'Mangaluru';
    const resolvedLocality = prop.locality || (prop.location ? prop.location.split(',')[0].trim() : 'Central');
    const resolvedSlug = prop.slug || prop.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || '';

    // Dynamic sync with active master presets
    let initialComponents = Array.isArray(prop.componentsMatrix) && prop.componentsMatrix.length > 0
      ? [...prop.componentsMatrix]
      : [...DEFAULT_CAR_STYLE_FEATURES];
    const activeFeaturePresets = presets.filter(p =>
      p.presetType === 'PROPERTY_FEATURE' &&
      p.isActive !== false &&
      (p.applicableCategory === 'ALL' || !p.applicableCategory || p.applicableCategory === resolvedCat || (resolvedCat === 'Independent House' && p.applicableCategory === 'Villa'))
    );
    for (const p of activeFeaturePresets) {
      if (!initialComponents.some(c => (c.featureName || '').toLowerCase() === (p.title || '').toLowerCase())) {
        initialComponents.push({
          categoryName: p.groupCategory || 'General',
          featureName: p.title,
          isAvailable: false,
          descriptionNote: "Status Not Updated"
        });
      }
    }

    let initialLegal = Array.isArray(prop.legalVerification) && prop.legalVerification.length > 0
      ? [...prop.legalVerification]
      : [...DEFAULT_12_POINT_LEGAL_CHECKLIST];
    const activeLegalPresets = presets.filter(p => p.presetType === 'LEGAL_CHECK' && p.isActive !== false);
    for (const p of activeLegalPresets) {
      if (!initialLegal.some(l => (l.documentName || '').toLowerCase() === (p.title || '').toLowerCase())) {
        initialLegal.push({
          documentName: p.title,
          category: p.groupCategory || 'General Title',
          verifiedStatus: 'Pending',
          verificationNote: 'Pending Audit / Status Not Updated',
          isCustomItem: false
        });
      }
    }

    setFormData({
      title: prop.title || '',
      slug: resolvedSlug,
      city: resolvedCity,
      locality: resolvedLocality,
      category: resolvedCat,
      dealType: prop.dealType || 'Resale',
      expectedPrice: numPrice,
      isNegotiable: prop.pricing?.isNegotiable ?? true,
      maintenanceFee: prop.pricing?.maintenanceFee || 0,
      bedrooms: prop.specs?.bedrooms ?? prop.beds ?? 4,
      bathrooms: prop.specs?.bathrooms ?? prop.baths ?? 4,
      carpetAreaSqFt: prop.specs?.carpetAreaSqFt || parseInt(String(prop.area || '').replace(/[^0-9]/g, ''), 10) || 3500,
      furnishingStatus: prop.specs?.furnishingStatus || 'Fully Furnished',
      floorLevel: prop.specs?.floorLevel || 'G',
      totalFloors: prop.specs?.totalFloors || '1',
      youtubeVideoId: prop.youtubeVideoId || (prop.videoUrl?.includes('v=') ? prop.videoUrl.split('v=')[1]?.substring(0, 11) : ''),
      galleryImagesStr: Array.isArray(prop.galleryImages) && prop.galleryImages.length > 0
        ? prop.galleryImages.join('\n')
        : (Array.isArray(prop.images) ? prop.images.join('\n') : ''),
      badge: prop.badge || 'Verified Listing',
      description: prop.description || '',
      isFeatured: prop.isFeatured ?? false,
      status: prop.status || 'Active',
      advocateVerificationAvailable: prop.advocateVerificationAvailable ?? true,

      componentsMatrix: initialComponents,
      transitMatrix: (Array.isArray(prop.transitMatrix) && prop.transitMatrix.length > 0
        ? prop.transitMatrix
        : DEFAULT_TRANSIT_MATRIX).map(t => ({
          landmarkName: t.landmarkName || t.destination || '',
          destination: t.destination || t.landmarkName || '',
          travelMode: t.travelMode || t.transportMode || 'Drive',
          transportMode: t.transportMode || t.travelMode || 'Drive',
          distanceText: t.distanceText || (t.distanceKm !== undefined ? `${t.distanceKm} km` : ''),
          distanceKm: t.distanceKm !== undefined ? Number(t.distanceKm) : (parseFloat(t.distanceText) || 0),
          durationText: t.durationText || (t.travelTimeMins !== undefined ? `${t.travelTimeMins}m` : ''),
          travelTimeMins: t.travelTimeMins !== undefined ? Number(t.travelTimeMins) : (parseInt(t.durationText, 10) || 0)
        })),
      roadIngressText: prop.roadIngressText || prop.specs?.technicalSpecs?.roadWidth || '40ft Tar Road',
      zoningTagText: prop.zoningTagText || prop.specs?.technicalSpecs?.zoning || 'RERA Compliant',
      legalVerification: initialLegal,

      rentalYieldEst: prop.investmentAnalysis?.rentalYieldEst || '₹95,000 / mo (4.5% Gross Yield)',
      resaleAppreciationEst: prop.investmentAnalysis?.resaleAppreciationEst || '11.0% - 13.5% Compound Y-o-Y',
      localityGrowthDriver: prop.investmentAnalysis?.localityGrowthDriver || 'High-growth corridor with infrastructure development'
    });
    setFormStep(1);
    navigate('/manage-345/publish-listing');
  };

  // CRUD Property actions
  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Delete this luxury listing from the active catalog? This action is irreversible.')) return;
    try {
      await deleteProperty(id);
    } catch (err) {
      console.warn('Backend delete error, removing locally:', err.message);
    }
    setProperties(prev => prev.filter(p => (p._id || p.id) !== id));
    if (onDataUpdated) onDataUpdated();
  };

  // Lead actions
  const handleUpdateLeadStatus = async (leadId, newStatus) => {
    try {
      await updateLeadStatus(leadId, newStatus);
    } catch (err) {
      console.warn('Backend lead status update error:', err.message);
    }
    setLeads(prev => prev.map(l => ((l._id || l.id) === leadId ? { ...l, status: newStatus } : l)));
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Remove this lead inquiry from the queue?')) return;
    try {
      await deleteLead(leadId);
    } catch (err) {
      console.warn('Backend lead delete error:', err.message);
    }
    setLeads(prev => prev.filter(l => (l._id || l.id) !== leadId));
  };

  // Hero Featured Video Handlers
  const handleSelectHeroProperty = (propertyId) => {
    const prop = properties.find(p => String(p._id) === String(propertyId) || String(p.id) === String(propertyId));
    if (prop) {
      setHeroSettings(prev => ({
        ...prev,
        heroFeaturedPropertyId: propertyId,
        heroOverlayTitle: prop.title || prev.heroOverlayTitle,
        heroOverlayLocation: `${prop.location || prop.locality || 'Surathkal Beach, Mangaluru'} • ${prop.price || '₹3.85 Cr'}`,
        heroBadgeTag: prop.badge || prev.heroBadgeTag || 'FEATURED PROPERTY',
        heroCustomYoutubeId: prev.heroCustomYoutubeId || prop.youtubeVideoId || ''
      }));
    } else {
      setHeroSettings(prev => ({
        ...prev,
        heroFeaturedPropertyId: propertyId
      }));
    }
  };

  const handleSaveHeroSettings = async (e) => {
    if (e) e.preventDefault();
    setIsSavingHeroSettings(true);
    try {
      const payload = {
        heroFeaturedPropertyId: heroSettings.heroFeaturedPropertyId || null,
        heroCustomYoutubeId: (heroSettings.heroCustomYoutubeId || '').trim(),
        heroBadgeTag: (heroSettings.heroBadgeTag || '').trim() || 'FEATURED PROPERTY',
        heroOverlayTitle: (heroSettings.heroOverlayTitle || '').trim(),
        heroOverlayLocation: (heroSettings.heroOverlayLocation || '').trim()
      };
      const res = await updateSiteSettings(payload);
      if (res?.success) {
        window.dispatchEvent(new CustomEvent('grabmykey_settings_updated', { detail: res.data }));
        setHeroSaveSuccess(true);
        setTimeout(() => setHeroSaveSuccess(false), 3000);
        if (onDataUpdated) onDataUpdated();
      }
    } catch (err) {
      alert('Failed to save Hero Settings: ' + err.message);
    } finally {
      setIsSavingHeroSettings(false);
    }
  };

  const previewYoutubeId = useMemo(() => {
    if (heroSettings.heroCustomYoutubeId && heroSettings.heroCustomYoutubeId.trim()) {
      const raw = heroSettings.heroCustomYoutubeId.trim();
      const match = raw.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
      return (match && match[2].length === 11) ? match[2] : raw;
    }
    const prop = properties.find(p => String(p._id) === String(heroSettings.heroFeaturedPropertyId) || String(p.id) === String(heroSettings.heroFeaturedPropertyId));
    return prop?.youtubeVideoId || "";
  }, [heroSettings.heroCustomYoutubeId, heroSettings.heroFeaturedPropertyId, properties]);

  const previewThumbnail = useMemo(() => {
    if (previewYoutubeId) {
      return `https://img.youtube.com/vi/${previewYoutubeId}/maxresdefault.jpg`;
    }
    const prop = properties.find(p => String(p._id) === String(heroSettings.heroFeaturedPropertyId) || String(p.id) === String(heroSettings.heroFeaturedPropertyId));
    return prop?.images?.[0] || '';
  }, [previewYoutubeId, heroSettings.heroFeaturedPropertyId, properties]);

  // Dynamic Car-Style Feature Matrix Handlers


  const handleToggleFeature = (idx) => {
    setFormData(prev => {
      const updated = [...(prev.componentsMatrix || [])];
      const isCurrentlyAvailable = updated[idx].isAvailable !== false && updated[idx].status !== 'Not Included';
      updated[idx] = { 
        ...updated[idx], 
        isAvailable: !isCurrentlyAvailable,
        status: !isCurrentlyAvailable ? 'Included' : 'Not Included'
      };
      return { ...prev, componentsMatrix: updated };
    });
  };

  const handleFeatureNoteChange = (idx, note) => {
    setFormData(prev => {
      const updated = [...(prev.componentsMatrix || [])];
      updated[idx] = { 
        ...updated[idx], 
        descriptionNote: note,
        details: note 
      };
      return { ...prev, componentsMatrix: updated };
    });
  };

  const handleDeleteFeature = (idx) => {
    setFormData(prev => ({
      ...prev,
      componentsMatrix: (prev.componentsMatrix || []).filter((_, i) => i !== idx)
    }));
  };

  const handleAddCustomFeature = (categoryName = 'Interior & Living') => {
    setCustomItemModal({
      isOpen: true,
      type: 'FEATURE',
      categoryName,
      title: '',
      note: '',
      status: 'Included'
    });
  };

  const handleResetDefaultFeatures = () => {
    const cat = formData.category || 'Villa';
    if (window.confirm(`Reset feature matrix to standard ${cat} master template?`)) {
      setFormData(prev => ({
        ...prev,
        componentsMatrix: getFeaturesForCategory(cat)
      }));
    }
  };

  // Manual Strategic Transit Handlers
  const handleUpdateTransit = (idx, field, value) => {
    setFormData(prev => {
      const updated = [...(prev.transitMatrix || [])];
      updated[idx] = { ...updated[idx], [field]: value };
      if (field === 'landmarkName') updated[idx].destination = value;
      if (field === 'destination') updated[idx].landmarkName = value;
      if (field === 'travelMode') updated[idx].transportMode = value;
      if (field === 'transportMode') updated[idx].travelMode = value;
      if (field === 'distanceText') {
        const num = parseFloat(value);
        if (!isNaN(num)) updated[idx].distanceKm = num;
      }
      if (field === 'distanceKm') {
        updated[idx].distanceText = `${value} km`;
      }
      if (field === 'durationText') {
        const num = parseInt(value, 10);
        if (!isNaN(num)) updated[idx].travelTimeMins = num;
      }
      if (field === 'travelTimeMins') {
        updated[idx].durationText = `${value}m`;
      }
      return { ...prev, transitMatrix: updated };
    });
  };

  const handleDeleteTransit = (idx) => {
    setFormData(prev => ({
      ...prev,
      transitMatrix: (prev.transitMatrix || []).filter((_, i) => i !== idx)
    }));
  };

  const handleMoveTransit = (idx, direction) => {
    setFormData(prev => {
      const list = [...(prev.transitMatrix || [])];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const [movedItem] = list.splice(idx, 1);
      list.splice(targetIdx, 0, movedItem);
      return { ...prev, transitMatrix: list };
    });
  };

  const handleAddTransitRoute = () => {
    setFormData(prev => ({
      ...prev,
      transitMatrix: [
        ...(prev.transitMatrix || []),
        {
          landmarkName: '',
          destination: '',
          travelMode: 'Drive',
          transportMode: 'Drive',
          distanceText: '',
          distanceKm: 0,
          durationText: '',
          travelTimeMins: 0
        }
      ]
    }));
  };

  // Dynamic Self-Verifiable Legal Audit Handlers
  const handleLoadDefault12PointLegal = () => {
    const activeLegalPresets = presets.filter(p => p.presetType === 'LEGAL_CHECK' && p.isActive !== false);
    if (activeLegalPresets.length > 0) {
      const mapped = activeLegalPresets.map(p => ({
        documentName: p.title,
        category: p.groupCategory || 'Ownership',
        verifiedStatus: 'Verified',
        verificationNote: p.defaultDescription || 'Verified by advocate panel',
        isCustomItem: false
      }));
      setFormData(prev => ({
        ...prev,
        legalVerification: mapped
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        legalVerification: [...DEFAULT_12_POINT_LEGAL_CHECKLIST]
      }));
    }
  };

  const handleUpdateLegalItem = (idx, field, value) => {
    setFormData(prev => {
      const updated = [...(prev.legalVerification || [])];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, legalVerification: updated };
    });
  };

  const handleDeleteLegalItem = (idx) => {
    setFormData(prev => ({
      ...prev,
      legalVerification: (prev.legalVerification || []).filter((_, i) => i !== idx)
    }));
  };

  const handleAddCustomLegalCheck = () => {
    setCustomItemModal({
      isOpen: true,
      type: 'LEGAL',
      categoryName: 'Custom Clearance',
      title: '',
      note: '',
      status: 'Verified'
    });
  };

  const handleConfirmCustomModal = () => {
    if (!customItemModal.title.trim()) {
      alert('Please enter a valid title.');
      return;
    }
    if (customItemModal.type === 'FEATURE') {
      setFormData(prev => ({
        ...prev,
        componentsMatrix: [
          ...(prev.componentsMatrix || []),
          {
            categoryName: customItemModal.categoryName || 'General',
            featureName: customItemModal.title.trim(),
            isAvailable: true,
            status: 'Included',
            descriptionNote: (customItemModal.note || '').trim()
          }
        ]
      }));
    } else if (customItemModal.type === 'LEGAL') {
      setFormData(prev => ({
        ...prev,
        legalVerification: [
          ...(prev.legalVerification || []),
          {
            documentName: customItemModal.title.trim(),
            category: 'Custom',
            verifiedStatus: customItemModal.status || 'Verified',
            verificationNote: (customItemModal.note || '').trim() || 'Audited clearance on record',
            isCustomItem: true
          }
        ]
      }));
    }
    setCustomItemModal(prev => ({ ...prev, isOpen: false }));
  };

  // File Upload Handlers
  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        type: f.name.endsWith('.pdf') ? 'document' : 'image'
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (idx) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // Save Property Form Submit
  const handleSavePropertySubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (formStep < 4) {
      setFormStep(prev => Math.min(prev + 1, 4));
      return;
    }
    const isLand = formData.category === 'Land/Plot';
    const parsedImages = formData.galleryImagesStr
      ? formData.galleryImagesStr.split('\n').map(s => s.trim()).filter(Boolean)
      : [];

    const priceNum = Number(formData.expectedPrice) || 25000000;
    const formatDisplayPrice = (val) => {
      if (val >= 10000000) return `₹${(val / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
      if (val >= 100000) return `₹${(val / 100000).toFixed(1).replace(/\.0$/, '')} Lakhs`;
      return `₹${val.toLocaleString('en-IN')}`;
    };

    const generatedSlug = (editingPropertyId && formData.slug?.trim())
      ? formData.slug.trim()
      : (formData.slug?.trim() ||
        (formData.title || 'luxury-property')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 6));

    const propertyPayload = {
      title: formData.title,
      slug: generatedSlug,
      city: formData.city,
      locality: formData.locality,
      category: formData.category,
      dealType: formData.dealType,
      pricing: {
        expectedPrice: priceNum,
        isNegotiable: Boolean(formData.isNegotiable),
        maintenanceFee: Number(formData.maintenanceFee) || 0
      },
      specs: {
        bedrooms: isLand ? 0 : Number(formData.bedrooms),
        bathrooms: isLand ? 0 : Number(formData.bathrooms),
        carpetAreaSqFt: Number(formData.carpetAreaSqFt) || 0,
        furnishingStatus: isLand ? 'Unfurnished' : formData.furnishingStatus,
        floorLevel: formData.floorLevel || 'G',
        totalFloors: formData.totalFloors || '1'
      },
      youtubeVideoId: formData.youtubeVideoId?.trim() || '',
      galleryImages: parsedImages,
      description: formData.description,
      componentsMatrix: formData.componentsMatrix || [],
      legalVerification: formData.legalVerification || [],
      transitMatrix: (formData.transitMatrix || []).map(t => ({
        landmarkName: t.landmarkName || t.destination || '',
        destination: t.destination || t.landmarkName || '',
        travelMode: t.travelMode || t.transportMode || 'Drive',
        transportMode: t.transportMode || t.travelMode || 'Drive',
        distanceText: t.distanceText || (t.distanceKm !== undefined ? `${t.distanceKm} km` : ''),
        distanceKm: t.distanceKm !== undefined ? Number(t.distanceKm) : (parseFloat(t.distanceText) || 0),
        durationText: t.durationText || (t.travelTimeMins !== undefined ? `${t.travelTimeMins}m` : ''),
        travelTimeMins: t.travelTimeMins !== undefined ? Number(t.travelTimeMins) : (parseInt(t.durationText, 10) || 0)
      })),
      roadIngressText: formData.roadIngressText || '',
      zoningTagText: formData.zoningTagText || '',
      investmentAnalysis: {
        rentalYieldEst: formData.rentalYieldEst,
        resaleAppreciationEst: formData.resaleAppreciationEst,
        localityGrowthDriver: formData.localityGrowthDriver
      },
      advocateVerificationAvailable: Boolean(formData.advocateVerificationAvailable),
      isFeatured: Boolean(formData.isFeatured),
      status: formData.status || 'Active',
      advocateAudit: formData.advocateAudit || {
        parentDeedAudit: (formData.legalVerification || []).some(d => /parent|title\s*deed/i.test(d.documentName || '') && (d.verifiedStatus === 'Verified' || d.verifiedStatus === 'cleared')) ? 'Cleared' : 'Pending',
        encumbranceCertificate: (formData.legalVerification || []).some(d => /encumbrance|\bEC\b/i.test(d.documentName || '') && (d.verifiedStatus === 'Verified' || d.verifiedStatus === 'cleared')) ? 'Nil EC verified' : 'Pending',
        revenueRtcCompliance: (formData.legalVerification || []).some(d => /mutation|rtc|pahani|khata/i.test(d.documentName || '') && (d.verifiedStatus === 'Verified' || d.verifiedStatus === 'cleared')) ? 'Verified' : 'Pending',
        mccPlanApprovals: (formData.legalVerification || []).some(d => /sanction|mcc|plan|occupancy|\bOC\b/i.test(d.documentName || '') && (d.verifiedStatus === 'Verified' || d.verifiedStatus === 'cleared')) ? 'Compliant' : 'Pending',
        dgpsSurveyVerification: (formData.legalVerification || []).some(d => /survey|fmb|dgps|boundary/i.test(d.documentName || '') && (d.verifiedStatus === 'Verified' || d.verifiedStatus === 'cleared')) ? 'Cleared' : 'Pending'
      },

      // Synchronize backward-compatibility fields
      location: `${formData.locality}, ${formData.city}`,
      price: formatDisplayPrice(priceNum),
      priceRaw: priceNum,
      type: formData.category === 'Land/Plot' ? 'Plot' : formData.category,
      beds: isLand ? 0 : Number(formData.bedrooms),
      baths: isLand ? 0 : Number(formData.bathrooms),
      area: `${formData.carpetAreaSqFt} sq.ft`,
      videoUrl: `https://www.youtube.com/watch?v=${formData.youtubeVideoId}`,
      images: parsedImages,
      badge: formData.badge || 'Verified Listing',
      legalStatus: 'Clear Title / RERA Verified',
      highlights: [
        "Advocate Audited Clear Title",
        "Complete Property Inspections",
        `${formData.city} Verified Listing`
      ]
    };

    try {
      if (editingPropertyId) {
        const res = await updateProperty(editingPropertyId, propertyPayload);
        const updatedDoc = res?.data || propertyPayload;
        setProperties(prev => prev.map(p => (String(p._id || p.id) === String(editingPropertyId) ? { ...p, ...propertyPayload, ...updatedDoc } : p)));
        window.dispatchEvent(new CustomEvent('grabmykey_properties_updated'));
        alert(`Listing #${editingPropertyId} (${propertyPayload.title}) updated successfully!`);
      } else {
        const res = await createProperty(propertyPayload);
        const newRecord = res?.data || { ...propertyPayload, _id: String(Date.now()), id: String(Date.now()) };
        setProperties(prev => [newRecord, ...prev]);
        window.dispatchEvent(new CustomEvent('grabmykey_property_created', { detail: newRecord }));
        window.dispatchEvent(new CustomEvent('grabmykey_properties_updated'));
        alert(`New property listing "${newRecord.title}" published live to catalog!`);
      }
    } catch (err) {
      console.error('API submission error:', err);
      const isServerOffline = !err.response && (
        err.name === 'TypeError' ||
        err.message?.includes('Network Error') ||
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('ECONNREFUSED') ||
        err.message?.includes('connection refused')
      );
      if (isServerOffline) {
        alert("Backend server is offline. Please start Node server on port 5000.");
      } else {
        alert(`Submission error: ${err.message || 'Could not connect to backend server'}`);
      }
    } finally {
      // Clear editing ID and form state so future creates don't overwrite or duplicate
      setEditingPropertyId(null);
      setFormData(INITIAL_FORM_STATE);
      setFormStep(1);
    }

    if (onDataUpdated) onDataUpdated();
    await loadData();
    handleTabSwitch('inventory');
  };

  // Filtered Properties for Inventory CRUD Table
  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      const matchesSearch = (prop.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prop.location || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || prop.type === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [properties, searchQuery, categoryFilter]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (leadStatusFilter === 'All') return true;
      return lead.status === leadStatusFilter;
    });
  }, [leads, leadStatusFilter]);

  // Calculated Valuation Aggregate for Overview View
  const totalValuationCr = useMemo(() => {
    const totalRaw = properties.reduce((acc, curr) => {
      const price = curr.priceRaw || curr.expectedPrice || curr.pricing?.expectedPrice || 0;
      return acc + price;
    }, 0);
    return (totalRaw / 10000000).toFixed(2);
  }, [properties]);

  // Asset Class Breakdown for Overview Charts
  const assetBreakdown = useMemo(() => {
    const counts = { Villa: 0, Apartment: 0, Commercial: 0, Estate: 0, 'Plot / Land': 0 };
    properties.forEach(p => {
      const type = (p.type === 'Plot' || p.type === 'Plot / Land') ? 'Plot / Land' : (counts[p.type] !== undefined ? p.type : 'Villa');
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [properties]);

  // Dynamic Title Clearance Ratio & Statutory Advocate Due Diligence Metrics
  const complianceData = useMemo(() => {
    if (!properties || properties.length === 0) {
      return {
        hasProperties: false,
        titleClearanceRatio: 0,
        titleClearanceRatioFormatted: '0%',
        metrics: [
          { label: '30-Year Parent Deed Chain Audit', status: 'No active audits', pct: 0 },
          { label: '30-Year Encumbrance Certificates (Nil EC)', status: 'No active audits', pct: 0 },
          { label: 'Revenue RTC / Mutation Compliance', status: 'No active audits', pct: 0 },
          { label: 'MCC / Local Body Plan Approvals', status: 'No active audits', pct: 0 },
          { label: 'Physical Boundary DGPS Surveys', status: 'No active audits', pct: 0 }
        ]
      };
    }

    const checkDocVerified = (prop, regex, auditKey) => {
      // 1. Direct check in advocateAudit object
      if (prop.advocateAudit && auditKey && prop.advocateAudit[auditKey]) {
        const val = String(prop.advocateAudit[auditKey]).toLowerCase();
        if (val === 'cleared' || val === 'verified' || val === 'compliant' || val === 'nil ec verified' || prop.advocateAudit[auditKey] === true) {
          return true;
        }
        if (val === 'pending' || val === 'false') {
          return false;
        }
      }

      // 2. Check in legalVerification matrix
      if (Array.isArray(prop.legalVerification) && prop.legalVerification.length > 0) {
        const doc = prop.legalVerification.find(d => regex.test(d.documentName || d.title || d.verificationNote || ''));
        if (doc) {
          const s = (doc.verifiedStatus || doc.status || '').toLowerCase();
          return s === 'verified' || s === 'cleared' || s === 'compliant' || s === 'nil ec verified' || doc.isVerified === true;
        }
      }
      return prop.advocateVerificationAvailable === true;
    };

    // Calculate individual audit metric clearance counts
    const parentDeedCount = properties.filter(p => checkDocVerified(p, /parent|title\s*deed/i, 'parentDeedAudit')).length;
    const encumbranceCount = properties.filter(p => checkDocVerified(p, /encumbrance|\bEC\b/i, 'encumbranceCertificate')).length;
    const revenueRtcCount = properties.filter(p => checkDocVerified(p, /mutation|rtc|pahani|khata/i, 'revenueRtcCompliance')).length;
    const mccPlanCount = properties.filter(p => checkDocVerified(p, /sanction|mcc|plan|occupancy|\bOC\b/i, 'mccPlanApprovals')).length;
    const dgpsSurveyCount = properties.filter(p => checkDocVerified(p, /survey|fmb|dgps|boundary/i, 'dgpsSurveyVerification')).length;

    const parentDeedPct = Math.round((parentDeedCount / properties.length) * 100);
    const encumbrancePct = Math.round((encumbranceCount / properties.length) * 100);
    const revenueRtcPct = Math.round((revenueRtcCount / properties.length) * 100);
    const mccPlanPct = Math.round((mccPlanCount / properties.length) * 100);
    const dgpsSurveyPct = Math.round((dgpsSurveyCount / properties.length) * 100);

    // Calculate overall Title Clearance Ratio across active properties
    const totalRatioSum = properties.reduce((sum, p) => {
      if (p.advocateAudit && typeof p.advocateAudit === 'object' && Object.keys(p.advocateAudit).length > 0) {
        const auditKeys = ['parentDeedAudit', 'encumbranceCertificate', 'revenueRtcCompliance', 'mccPlanApprovals', 'dgpsSurveyVerification'];
        const passedCount = auditKeys.filter(k => {
          const val = String(p.advocateAudit[k] || '').toLowerCase();
          return val === 'cleared' || val === 'verified' || val === 'compliant' || val === 'nil ec verified' || p.advocateAudit[k] === true;
        }).length;
        return sum + (passedCount / auditKeys.length);
      }
      if (Array.isArray(p.legalVerification) && p.legalVerification.length > 0) {
        const verifiedCount = p.legalVerification.filter(d => {
          const s = (d.verifiedStatus || d.status || '').toLowerCase();
          return s === 'verified' || s === 'cleared' || s === 'compliant' || s === 'nil ec verified' || d.isVerified === true;
        }).length;
        return sum + (verifiedCount / p.legalVerification.length);
      }
      return sum + (p.advocateVerificationAvailable ? 1 : 0);
    }, 0);

    const rawAvg = (totalRatioSum / properties.length) * 100;
    const titleClearanceRatio = Math.round(rawAvg * 10) / 10;
    const titleClearanceRatioFormatted = titleClearanceRatio % 1 === 0
      ? `${titleClearanceRatio}%`
      : `${titleClearanceRatio.toFixed(1)}%`;

    return {
      hasProperties: true,
      titleClearanceRatio,
      titleClearanceRatioFormatted,
      metrics: [
        {
          label: '30-Year Parent Deed Chain Audit',
          status: parentDeedPct > 0 ? `✓ ${parentDeedPct}% Cleared` : '0% Cleared',
          pct: parentDeedPct
        },
        {
          label: '30-Year Encumbrance Certificates (Nil EC)',
          status: encumbrancePct > 0 ? `✓ ${encumbrancePct}% Cleared` : '0% Cleared',
          pct: encumbrancePct
        },
        {
          label: 'Revenue RTC / Mutation Compliance',
          status: revenueRtcPct > 0 ? `✓ ${revenueRtcPct}% Verified` : '0% Verified',
          pct: revenueRtcPct
        },
        {
          label: 'MCC / Local Body Plan Approvals',
          status: mccPlanPct > 0 ? `✓ ${mccPlanPct}% Compliant` : '0% Compliant',
          pct: mccPlanPct
        },
        {
          label: 'Physical Boundary DGPS Surveys',
          status: dgpsSurveyPct > 0 ? `✓ ${dgpsSurveyPct}% Cleared` : '0% Cleared',
          pct: dgpsSurveyPct
        }
      ]
    };
  }, [properties]);

  return (
    <div className="min-h-screen bg-neutral-50/50 text-[#0a1d37] font-sans antialiased flex flex-col md:flex-row selection:bg-[#b8860b] selection:text-white">

      {/* ===================================================================== */}
      {/* 1. LEFT SIDEBAR NAVIGATION (MODERN LIGHT EXECUTIVE THEME)             */}
      {/* ===================================================================== */}
      <Sidebar
        activeTab={activeTab}
        onTabSwitch={handleTabSwitch}
        onNewListing={handleOpenCreateModal}
        propertiesCount={properties.length}
        newLeadsCount={leads.filter(l => l.status === 'New Inquiry').length}
        presetsCount={presets.length}
        onExit={onExit || (() => navigate('/'))}
      />

      {/* ===================================================================== */}
      {/* 2. MAIN VIEW CONTAINER WITH LIGHT TOP BAR & CONTENT CANVAS            */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* TOP BAR */}
        <Navbar
          activeTab={activeTab}
          onNewListing={handleOpenCreateModal}
          onExit={onExit || (() => navigate('/'))}
        />

        {/* SCROLLABLE MAIN CANVAS */}
        <main className="flex-1 overflow-y-auto bg-neutral-50/50">
          <div className="w-full max-w-7xl mx-auto px-8 py-6 space-y-8">

            {/* ================================================================= */}
            {/* VIEW 1: 📊 EXECUTIVE OVERVIEW                                     */}
            {/* ================================================================= */}
            {activeTab === 'overview' && (
              <div className="space-y-8 w-full">

                {/* Header Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[#0a1d37] tracking-tight flex items-center space-x-2.5">
                      <span>Executive Operations Overview</span>
                      <Sparkles className="w-5 h-5 text-[#b8860b]" />
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Real-time portfolio metrics, valuation aggregate, and advocate statutory governance.
                    </p>
                  </div>
                  <button
                    onClick={loadData}
                    disabled={loading}
                    className="inline-flex items-center space-x-1.5 text-xs text-slate-700 hover:text-[#0a1d37] border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#b8860b]' : ''}`} />
                    <span>Refresh Telemetry</span>
                  </button>
                </div>

                {/* 4 Clean White Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* 1. Total Portfolios */}
                  <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Portfolios</span>
                      <div className="w-9 h-9 rounded-xl bg-[#0a1d37] text-[#e6ca65] flex items-center justify-center shadow-xs">
                        <Building2 className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className="text-2xl font-serif font-bold text-[#0a1d37]">{properties.length} Properties</span>
                      <span className={`block text-xs mt-1 font-semibold ${properties.length === 0 ? 'text-slate-400' : 'text-emerald-700'}`}>
                        {properties.length === 0 ? '0 active listings in catalog' : '100% Verified in catalog'}
                      </span>
                    </div>
                  </div>

                  {/* 2. Gross Valuation */}
                  <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Gross Asset Valuation</span>
                      <div className="w-9 h-9 rounded-xl bg-[#0a1d37] text-[#e6ca65] flex items-center justify-center shadow-xs">
                        <DollarSign className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className="text-2xl font-serif font-bold text-[#b8860b]">₹{totalValuationCr} Cr</span>
                      <span className="block text-xs text-slate-500 mt-1">Aggregated catalog valuation</span>
                    </div>
                  </div>

                  {/* 3. Inbound Leads */}
                  <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending Owner Leads</span>
                      <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shadow-xs">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className="text-2xl font-serif font-bold text-[#0a1d37]">{leads.length} Tickets</span>
                      <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-xs font-semibold inline-block mt-1 border border-amber-200">
                        {leads.filter(l => l.status === 'New Inquiry').length} Uncontacted submissions
                      </span>
                    </div>
                  </div>

                  {/* 4. Title Clearance Ratio */}
                  <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Title Clearance Ratio</span>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-xs ${
                        complianceData.hasProperties
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                          : 'bg-slate-100 border border-slate-200 text-slate-500'
                      }`}>
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <span className={`text-2xl font-serif font-bold ${
                        complianceData.hasProperties ? 'text-emerald-800' : 'text-slate-400'
                      }`}>
                        {complianceData.titleClearanceRatioFormatted}
                      </span>
                      {complianceData.hasProperties ? (
                        <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full text-xs font-semibold inline-block mt-1 border border-emerald-200">
                          Advocate panel audited title
                        </span>
                      ) : (
                        <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full text-xs font-semibold inline-block mt-1 border border-slate-200">
                          No active audits
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Visual Charts: Asset Class Distribution & Advocate Due Diligence */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* Chart 1: Asset Class Distribution (White Card + Soft Slate Bars) */}
                  <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
                      <div>
                        <h3 className="font-serif font-bold text-base text-[#0a1d37]">Asset Class Distribution</h3>
                        <p className="text-[11px] text-slate-500">Breakdown of inventory by development typology</p>
                      </div>
                      <span className="text-xs font-mono text-[#0a1d37] bg-slate-100 px-3 py-1 rounded-full border border-slate-200 font-semibold">
                        {properties.length} Active Listings
                      </span>
                    </div>

                    <div className="space-y-4">
                      {[
                        { type: 'Villa', count: assetBreakdown['Villa'] || 0, color: 'bg-[#0a1d37]' },
                        { type: 'Apartment', count: assetBreakdown['Apartment'] || 0, color: 'bg-slate-700' },
                        { type: 'Commercial', count: assetBreakdown['Commercial'] || 0, color: 'bg-[#b8860b]' },
                        { type: 'Estate', count: assetBreakdown['Estate'] || 0, color: 'bg-emerald-800' },
                        { type: 'Plot / Land', count: assetBreakdown['Plot / Land'] || 0, color: 'bg-[#d4af37]' }
                      ].map(item => {
                        const pct = properties.length > 0 ? Math.round((item.count / properties.length) * 100) : 0;
                        return (
                          <div key={item.type} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-[#0a1d37]">{item.type}</span>
                              <span className="font-mono text-slate-500">{item.count} Units ({pct}%)</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${item.color} rounded-full transition-all duration-500`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Chart 2: Advocate Due Diligence Health (White Card + Green Pill Badges) */}
                  <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
                        <div>
                          <h3 className="font-serif font-bold text-base text-[#0a1d37]">Advocate Due Diligence Health</h3>
                          <p className="text-[11px] text-slate-500">Statutory audit compliance across active listings</p>
                        </div>
                        {complianceData.hasProperties ? (
                          <div className="flex items-center space-x-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>High Court Aligned</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                            <span>No active audits</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        {complianceData.metrics.map(metric => (
                          <div key={metric.label} className="p-3 bg-[#fbf9f5] rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                            <span className="text-[#0a1d37] font-semibold">{metric.label}</span>
                            <span className={`font-bold px-3 py-1 rounded-full text-xs font-mono shadow-2xs ${
                              metric.pct > 0 && complianceData.hasProperties
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}>
                              {metric.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Karnataka Land Revenue Laws & MCC Bylaws</span>
                      <button onClick={() => handleTabSwitch('inventory')} className="text-[#b8860b] hover:text-[#0a1d37] font-bold flex items-center space-x-1 cursor-pointer">
                        <span>Manage All Inventory</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Quick Leads Strip (White Card) */}
                <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-[#b8860b]" />
                      <h3 className="font-serif font-bold text-base text-[#0a1d37]">Recent Inbound Owner Inquiries</h3>
                    </div>
                    <button onClick={() => handleTabSwitch('leads')} className="text-xs text-[#b8860b] hover:text-[#0a1d37] font-bold cursor-pointer">
                      View Full Lead Queue →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {leads.slice(0, 3).map(lead => (
                      <div key={lead._id || lead.id} className="p-4 bg-[#fbf9f5] border border-slate-200 rounded-xl text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-slate-500 font-semibold">#{lead.ticketId || lead.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${lead.status === 'New Inquiry' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                              lead.status === 'Contacted' ? 'bg-sky-50 text-sky-800 border-sky-300' :
                                'bg-emerald-50 text-emerald-800 border-emerald-300'
                            }`}>
                            {lead.status}
                          </span>
                        </div>
                        <p className="font-bold text-[#0a1d37] text-sm">{lead.ownerName}</p>
                        <p className="text-slate-500">{lead.location} • {lead.assetType}</p>
                        <p className="text-[#b8860b] font-serif font-bold">{lead.expectedPrice}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* ================================================================= */}
            {/* VIEW 2: 🏢 PROPERTY INVENTORY (LIGHT-LUXURY CRUD TABLE)           */}
            {/* ================================================================= */}
            {activeTab === 'inventory' && (
              <div className="space-y-6 w-full">

                {/* Header Title & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                  <div>
                    <h1 className="text-2xl font-serif font-bold text-[#0a1d37] tracking-tight flex items-center space-x-2">
                      <span>Property Inventory Management</span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Live catalog synchronized with MongoDB. Edit parameters, preview listings, or remove assets.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenCreateModal}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2 border border-slate-800 cursor-pointer"
                  >
                    <span className="text-amber-400 font-bold text-sm">+</span>
                    <span>Publish New Listing</span>
                  </button>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="bg-white border border-slate-200/90 shadow-sm rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="w-full md:w-1/2 relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by title, location, or locality..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-[#0a1d37] focus:outline-none focus:border-[#b8860b] focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="w-full md:w-auto flex items-center space-x-3">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0a1d37] focus:outline-none focus:border-[#b8860b]"
                    >
                      <option value="All">All Categories</option>
                      <option value="Villa">Villa</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Estate">Estate</option>
                      <option value="Plot / Land">Plot / Land</option>
                    </select>

                    <button
                      onClick={loadData}
                      disabled={loading}
                      className="p-2 border border-slate-300 rounded-xl bg-white text-slate-600 hover:text-[#0a1d37] transition-colors cursor-pointer"
                      title="Refresh data"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#b8860b]' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* High-Contrast Crisp White Inventory Table */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#f8f6f0] text-[#0a1d37] font-sans uppercase tracking-wider text-xs font-bold border-b border-slate-200/80">
                          <th className="py-3.5 px-6 font-bold">Asset Info</th>
                          <th className="py-3.5 px-6 font-bold">Locality & City</th>
                          <th className="py-3.5 px-6 font-bold">Category</th>
                          <th className="py-3.5 px-6 font-bold">Asking Price</th>
                          <th className="py-3.5 px-6 font-bold">Legal Status</th>
                          <th className="py-3.5 px-6 font-bold text-right">Quick Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredProperties.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-slate-500 font-mono">
                              No property listings found matching query.
                            </td>
                          </tr>
                        ) : (
                          filteredProperties.map(prop => (
                            <tr key={prop._id || prop.id} className="even:bg-[#fbf9f5] hover:bg-amber-50/30 transition-colors">
                              {/* Asset Info & Thumbnail */}
                              <td className="py-4 px-6">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-2xs flex items-center justify-center">
                                    {prop.images?.[0] ? (
                                      <img
                                        src={prop.images[0]}
                                        alt={prop.title}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <Building2 className="w-4 h-4 text-slate-400" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <span className="font-bold text-[#0a1d37] text-xs block truncate max-w-xs">{prop.title}</span>
                                    <span className="font-mono text-[10px] text-slate-400">#{prop._id || prop.id}</span>
                                  </div>
                                </div>
                              </td>

                              {/* Locality */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                <span className="flex items-center space-x-1.5 text-slate-600 font-medium">
                                  <MapPin className="w-3.5 h-3.5 text-[#b8860b] shrink-0" />
                                  <span>{prop.location}</span>
                                </span>
                              </td>

                              {/* Category */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[#0a1d37] font-semibold text-xs">
                                  {prop.type}
                                </span>
                              </td>

                              {/* Price in Champagne Gold */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                <span className="font-serif font-bold text-sm text-[#b8860b]">
                                  {prop.price}
                                </span>
                              </td>

                              {/* Legal Status */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
                                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>Clear Title / RERA</span>
                                </span>
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-6 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditModal(prop)}
                                    className="p-2 rounded-lg bg-[#0a1d37] hover:bg-[#061426] text-white transition-colors cursor-pointer shadow-xs"
                                    title="Edit Listing"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (onViewLiveProperty) {
                                        onViewLiveProperty(prop._id || prop.id);
                                      } else {
                                        navigate(`/property/${prop._id || prop.id}`);
                                      }
                                    }}
                                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
                                    title="View Live on Storefront"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProperty(prop._id || prop.id)}
                                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors cursor-pointer"
                                    title="Delete Property"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ================================================================= */}
            {/* VIEW 3: 📩 OWNER LEAD QUEUE (LIGHT-LUXURY TABLE)                  */}
            {/* ================================================================= */}
            {activeTab === 'leads' && (
              <div className="space-y-6 w-full">

                {/* Header Title & Filter Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                  <div>
                    <h1 className="text-2xl font-serif font-bold text-[#0a1d37] tracking-tight flex items-center space-x-2">
                      <span>Inbound Owner Lead Queue</span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      Manage onboarding leads submitted by verified owners via public portal.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {['All', 'New Inquiry', 'Contacted', 'Archived / Resolved'].map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setLeadStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${leadStatusFilter === st
                            ? 'bg-[#0a1d37] text-white font-bold shadow-xs'
                            : 'bg-white border border-slate-300 text-slate-600 hover:text-[#0a1d37] hover:bg-slate-50'
                          }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* High-Contrast White Leads Table */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#f8f6f0] text-[#0a1d37] font-sans uppercase tracking-wider text-xs font-bold border-b border-slate-200/80">
                          <th className="py-3.5 px-6 font-bold">Ticket ID</th>
                          <th className="py-3.5 px-6 font-bold">Owner Name & Phone</th>
                          <th className="py-3.5 px-6 font-bold">Property Locality</th>
                          <th className="py-3.5 px-6 font-bold">Category</th>
                          <th className="py-3.5 px-6 font-bold">Expected Price</th>
                          <th className="py-3.5 px-6 font-bold">Status Badge</th>
                          <th className="py-3.5 px-6 font-bold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredLeads.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                              No owner lead submissions found in this status.
                            </td>
                          </tr>
                        ) : (
                          filteredLeads.map(lead => (
                            <tr key={lead._id || lead.id} className="even:bg-[#fbf9f5] hover:bg-amber-50/30 transition-colors">
                              {/* Ticket ID in Champagne Gold */}
                              <td className="py-4 px-6 font-mono font-bold text-[#b8860b]">
                                #{lead.ticketId || lead.id}
                              </td>

                              {/* Owner & Phone */}
                              <td className="py-4 px-6">
                                <span className="font-bold text-[#0a1d37] block text-xs">{lead.ownerName}</span>
                                <span className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                                  <Phone className="w-3 h-3 text-slate-400" />
                                  <span>{lead.phone}</span>
                                </span>
                              </td>

                              {/* Locality */}
                              <td className="py-4 px-6">
                                <span className="font-medium text-slate-700">{lead.location}</span>
                              </td>

                              {/* Asset Type */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[#0a1d37] font-semibold text-xs">
                                  {lead.assetType}
                                </span>
                              </td>

                              {/* Price */}
                              <td className="py-4 px-6 font-serif font-bold text-[#0a1d37] whitespace-nowrap text-sm">
                                {lead.expectedPrice}
                              </td>

                              {/* Status */}
                              <td className="py-4 px-6 whitespace-nowrap">
                                <select
                                  value={lead.status}
                                  onChange={(e) => handleUpdateLeadStatus(lead._id || lead.id, e.target.value)}
                                  className={`text-xs font-bold px-3 py-1 rounded-lg border focus:outline-none cursor-pointer shadow-2xs ${lead.status === 'New Inquiry' ? 'bg-amber-50 border-amber-300 text-amber-800' :
                                      lead.status === 'Contacted' ? 'bg-sky-50 border-sky-300 text-sky-800' :
                                        'bg-emerald-50 border-emerald-300 text-emerald-800'
                                    }`}
                                >
                                  <option value="New Inquiry">New Inquiry</option>
                                  <option value="Contacted">Contacted</option>
                                  <option value="Archived / Resolved">Archived / Resolved</option>
                                </select>
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-6 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end space-x-2">
                                  <a
                                    href={`https://wa.me/${(lead.phone || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.ownerName)},%20regarding%20your%20property%20listing%20ticket%20#${lead.ticketId || lead.id}%20on%20GrabMyKey`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 transition-colors"
                                    title="WhatsApp Contact"
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLead(lead._id || lead.id)}
                                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 transition-colors cursor-pointer"
                                    title="Delete Lead"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ================================================================= */}
            {/* VIEW 4: ➕ FULL-BLEED PROPERTY PUBLISHER (LIGHT LUXURY)           */}
            {/* ================================================================= */}
            {activeTab === 'publish-listing' && (
              <div className="space-y-6 max-w-5xl mx-auto pb-12">

                {/* Publisher Header with Back to Inventory */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <button
                        type="button"
                        onClick={() => handleTabSwitch('inventory')}
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#0a1d37] hover:bg-slate-100 transition-colors bg-white border border-slate-300 rounded-lg px-3 py-1.5 shadow-2xs cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>← Back to Inventory</span>
                      </button>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8860b] font-bold">
                        EXECUTIVE PUBLISHER
                      </span>
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-[#0a1d37] tracking-tight">
                      {editingPropertyId ? `Edit Listing #${editingPropertyId}` : 'Publish New Luxury Property Listing'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure asset specifications, walkthrough inspection, and advocate clearance parameters.
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center space-x-2">
                    <span className="text-xs font-mono text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs font-semibold">
                      Staging Mode
                    </span>
                  </div>
                </div>

                {/* Form Container Card in Crisp Pure White */}
                <div className="bg-white border border-slate-200/90 rounded-2xl shadow-md p-6 md:p-8">

                  {/* 4-Step Horizontal Tabs */}
                  <div className="flex border-b border-slate-200 mb-8 text-xs font-semibold overflow-x-auto">
                    {[
                      { step: 1, label: '1. Core Typology & Pricing' },
                      { step: 2, label: '2. Walkthrough & Gallery' },
                      { step: 3, label: '3. Feature Matrix & Transit' },
                      { step: 4, label: '4. Legal Audit & Investment' }
                    ].map(s => (
                      <button
                        key={s.step}
                        type="button"
                        onClick={() => setFormStep(s.step)}
                        className={`py-3 px-5 border-b-2 whitespace-nowrap transition-all cursor-pointer ${formStep === s.step
                            ? 'border-[#b8860b] text-[#b8860b] font-bold bg-amber-50/60'
                            : 'border-transparent text-slate-500 hover:text-[#0a1d37]'
                          }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSavePropertySubmit} className="space-y-6">

                    {/* STEP 1: CORE TYPOLOGY & PRICING */}
                    {formStep === 1 && (
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Property Title *</label>
                            <input
                              required
                              type="text"
                              placeholder="e.g. Ultra Luxury Seafront Villa"
                              value={formData.title}
                              onChange={e => {
                                const newTitle = e.target.value;
                                const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                setFormData(prev => ({
                                  ...prev,
                                  title: newTitle,
                                  slug: prev.slug === '' || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') ? autoSlug : prev.slug
                                }));
                              }}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:bg-white focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">URL Slug (Unique) *</label>
                            <input
                              required
                              type="text"
                              placeholder="coastal-horizon-sea-villa"
                              value={formData.slug}
                              onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] font-mono focus:border-[#b8860b] focus:bg-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">City *</label>
                            <select
                              value={formData.city}
                              onChange={e => setFormData({ ...formData, city: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] font-semibold focus:border-[#b8860b] focus:outline-none"
                            >
                              <option value="Mangaluru">Mangaluru</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Locality / Sector *</label>
                            <input
                              required
                              type="text"
                              placeholder="e.g. Kadri Hills / Falnir / Bejai"
                              value={formData.locality}
                              onChange={e => setFormData({ ...formData, locality: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Category *</label>
                            <select
                              value={formData.category}
                              onChange={e => {
                                const newCat = e.target.value;
                                setFormData(prev => ({
                                  ...prev,
                                  category: newCat,
                                  componentsMatrix: getFeaturesForCategory(newCat)
                                }));
                              }}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] font-semibold focus:border-[#b8860b] focus:outline-none"
                            >
                              <option value="Villa">Villa</option>
                              <option value="Apartment">Apartment</option>
                              <option value="Independent House">Independent House</option>
                              <option value="Commercial">Commercial</option>
                              <option value="Land/Plot">Land/Plot</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Deal Type *</label>
                            <select
                              value={formData.dealType}
                              onChange={e => setFormData({ ...formData, dealType: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] font-semibold focus:border-[#b8860b] focus:outline-none"
                            >
                              <option value="Resale">Resale</option>
                              <option value="Rental">Rental</option>
                            </select>
                          </div>
                        </div>

                        {/* Pricing Block */}
                        <div className="p-4 bg-[#fbf9f5] border border-slate-200 rounded-xl space-y-3">
                          <span className="text-xs font-bold text-[#0a1d37] uppercase tracking-wider block">
                            Pricing & Maintenance Parameters
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Expected Price (₹ in Raw Number) *</label>
                              <input
                                required
                                type="number"
                                placeholder="38500000"
                                value={formData.expectedPrice}
                                onChange={e => setFormData({ ...formData, expectedPrice: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-[#b8860b] focus:border-[#b8860b] focus:outline-none"
                              />
                              <span className="text-[10px] text-slate-500 mt-1 block">
                                Display preview: {formData.expectedPrice >= 10000000 ? `₹${(formData.expectedPrice / 10000000).toFixed(2)} Cr` : `₹${(formData.expectedPrice / 100000).toFixed(1)} Lakhs`}
                              </span>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Monthly Maintenance (RWA / Society Fee)</label>
                              <input
                                type="number"
                                placeholder="0"
                                value={formData.maintenanceFee}
                                onChange={e => setFormData({ ...formData, maintenanceFee: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                              />
                              <span className="text-[10px] text-slate-500 mt-1 block">
                                Enter monthly society/RWA fee. Set to ₹0 if standalone independent property.
                              </span>
                            </div>
                            <div className="flex flex-col justify-center">
                              <span className="text-xs font-bold text-[#0a1d37] mb-2">Price Negotiation</span>
                              <label className="inline-flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.isNegotiable}
                                  onChange={e => setFormData({ ...formData, isNegotiable: e.target.checked })}
                                  className="w-4 h-4 text-[#b8860b] rounded focus:ring-[#b8860b]"
                                />
                                <span className="text-xs text-slate-700 font-semibold">Price is Negotiable upon Inspection</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Physical Specs */}
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Carpet Area (Sq.Ft) *</label>
                            <input
                              required
                              type="number"
                              placeholder="4200"
                              value={formData.carpetAreaSqFt}
                              onChange={e => setFormData({ ...formData, carpetAreaSqFt: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Furnishing Status</label>
                            <select
                              value={formData.furnishingStatus}
                              onChange={e => setFormData({ ...formData, furnishingStatus: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] font-semibold focus:border-[#b8860b] focus:outline-none"
                            >
                              <option value="Fully Furnished">Fully Furnished</option>
                              <option value="Semi-Furnished">Semi-Furnished</option>
                              <option value="Unfurnished">Unfurnished</option>
                            </select>
                          </div>
                          {formData.category !== 'Land/Plot' ? (
                            <>
                              <div>
                                <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Bedrooms</label>
                                <input
                                  type="number"
                                  value={formData.bedrooms}
                                  onChange={e => setFormData({ ...formData, bedrooms: e.target.value })}
                                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Bathrooms</label>
                                <input
                                  type="number"
                                  value={formData.bathrooms}
                                  onChange={e => setFormData({ ...formData, bathrooms: e.target.value })}
                                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                                />
                              </div>
                            </>
                          ) : (
                            <div className="sm:col-span-2 flex items-center p-3 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
                              <span>Land/Plot asset: Room specifications are automatically bypassed.</span>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Floor Level</label>
                            <input
                              type="text"
                              placeholder="e.g. Ground / 4th Floor / G+2"
                              value={formData.floorLevel}
                              onChange={e => setFormData({ ...formData, floorLevel: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Total Floors in Structure</label>
                            <input
                              type="text"
                              placeholder="e.g. 3 / 12"
                              value={formData.totalFloors}
                              onChange={e => setFormData({ ...formData, totalFloors: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Marketing Badge</label>
                            <input
                              type="text"
                              placeholder="Exclusive Tour"
                              value={formData.badge}
                              onChange={e => setFormData({ ...formData, badge: e.target.value })}
                              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Architectural Narrative Overview *</label>
                          <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Ultra-luxury cliffside residence with private infinity pool overlooking the Arabian Sea..."
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* STEP 2: MEDIA & VIDEO */}
                    {formStep === 2 && (
                      <div className="space-y-5">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold text-[#0a1d37]">YouTube Walkthrough Video ID / URL *</label>
                            <button
                              type="button"
                              onClick={() => setShowYoutubePicker(!showYoutubePicker)}
                              className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-[#0a1d37] border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xs transition-all cursor-pointer"
                            >
                              <Video className="w-3.5 h-3.5 text-red-600" />
                              <span>Sample Walkthroughs</span>
                            </button>
                          </div>

                          <div className="flex items-center space-x-3">
                            <input
                              required
                              type="text"
                              placeholder="e.g. 7X8mLSQkg4Y or https://www.youtube.com/watch?v=..."
                              value={formData.youtubeVideoId}
                              onChange={e => {
                                const val = e.target.value;
                                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                const match = val.match(regExp);
                                const vid = (match && match[2].length === 11) ? match[2] : val;
                                setFormData({ ...formData, youtubeVideoId: vid });
                              }}
                              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#0a1d37] font-mono focus:border-[#b8860b] focus:outline-none"
                            />
                            <span className="text-xs font-mono font-bold text-[#b8860b] bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
                              ID: {formData.youtubeVideoId || 'None'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 block mt-1">
                            Transparent inspection policy: Walkthrough is embedded without autoplay for silent luxury viewing.
                          </span>

                          {showYoutubePicker && (
                            <div className="mt-3 p-4 bg-[#f8f6f0] border border-slate-200 rounded-2xl space-y-3">
                              <span className="text-xs font-mono font-bold text-[#0a1d37] uppercase tracking-wider block">
                                Existing Property Walkthrough Tours:
                              </span>
                              {properties.filter(p => p.youtubeVideoId).length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  {properties.filter(p => p.youtubeVideoId).slice(0, 6).map((p, i) => (
                                    <div
                                      key={p._id || p.id || i}
                                      onClick={() => {
                                        setFormData({ ...formData, youtubeVideoId: p.youtubeVideoId });
                                        setShowYoutubePicker(false);
                                      }}
                                      className="p-3 bg-white hover:bg-amber-50/60 border border-slate-300 rounded-xl cursor-pointer text-xs transition-colors"
                                    >
                                      <p className="font-bold text-[#0a1d37] truncate">{p.title}</p>
                                      <span className="text-[10px] text-[#b8860b] font-semibold mt-1 block">Click to Apply ({p.youtubeVideoId})</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-slate-500 py-1">
                                  No previous video tours found. Enter a custom YouTube video ID or URL in the input above.
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Photo Image URLs string */}
                        <div>
                          <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">
                            Gallery Image URLs (One URL per line)
                          </label>
                          <textarea
                            rows={4}
                            value={formData.galleryImagesStr}
                            onChange={e => setFormData({ ...formData, galleryImagesStr: e.target.value })}
                            placeholder="https://example.com/property-photo.jpg (one URL per line)"
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#0a1d37] font-mono focus:border-[#b8860b] focus:outline-none"
                          />
                        </div>

                        {/* Local File Upload Dropzone */}
                        <div>
                          <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">
                            Local Attachments & Legal Deeds (.jpg, .png, .pdf)
                          </label>
                          <div className="border-2 border-dashed border-slate-300 hover:border-[#b8860b] rounded-2xl p-6 text-center bg-[#f8f6f0] transition-all">
                            <Upload className="w-8 h-8 text-[#b8860b] mx-auto mb-2" />
                            <h5 className="text-xs font-bold text-[#0a1d37] mb-1">
                              Upload Local Photos & Legal Audit PDFs
                            </h5>
                            <p className="text-[11px] text-slate-500 mb-4 max-w-sm mx-auto">
                              Attach statutory Mother Deeds, EC Form 15, or physical survey certificates directly.
                            </p>
                            <label className="inline-flex items-center space-x-2 bg-[#0a1d37] hover:bg-[#061426] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-all">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Browse Files</span>
                              <input
                                type="file"
                                multiple
                                accept="image/*,.pdf"
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {uploadedFiles.length > 0 && (
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {uploadedFiles.map((file, idx) => (
                                <div key={idx} className="flex items-center space-x-2 p-2.5 bg-white border border-slate-200 rounded-xl text-xs shadow-2xs">
                                  <FileText className="w-4 h-4 text-[#b8860b] shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <span className="truncate block text-[#0a1d37] font-bold text-[11px]">{file.name}</span>
                                    <span className="text-[10px] text-slate-500 font-mono">{file.size}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFile(idx)}
                                    className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-slate-100 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    )}

                    {/* STEP 3: PROPERTY SPECIFICATIONS & FEATURES & STRATEGIC TRANSIT */}
                    {formStep === 3 && (
                      <div className="space-y-8">

                        {/* A. PROPERTY SPECIFICATIONS & FEATURES */}
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
                            <div>
                              <div className="flex items-center space-x-2">
                                <Layers className="w-4 h-4 text-[#b8860b]" />
                                <h3 className="font-serif font-bold text-base text-[#0a1d37]">
                                  Property Specifications & Features
                                </h3>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Grouped specifications with availability toggles (✓ / —) and optional custom descriptive notes.
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={handleResetDefaultFeatures}
                                className="text-xs bg-slate-100 hover:bg-slate-200 text-[#0a1d37] border border-slate-300 px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer"
                              >
                                Reset Features
                              </button>
                              <span className="text-xs font-mono text-[#0a1d37] bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 font-bold">
                                {(formData.componentsMatrix || []).length} Features
                              </span>
                            </div>
                          </div>

                          {/* Dynamic Asset Type Preset Selector */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80">
                            <div className="flex items-center space-x-2">
                              <span className="text-[11px] font-bold text-[#b8860b] uppercase tracking-wider">
                                Asset Specification Preset:
                              </span>
                              <span className="text-xs font-bold text-[#0a1d37]">
                                {formData.category || 'Villa'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {[
                                { label: 'Villa / House', cat: 'Villa' },
                                { label: 'Flat / Apartment', cat: 'Apartment' },
                                { label: 'Plot / Land', cat: 'Plot' },
                                { label: 'Commercial', cat: 'Commercial' }
                              ].map(a => {
                                const isSelected = (formData.category === a.cat) || 
                                  (a.cat === 'Villa' && formData.category === 'Independent House') ||
                                  (a.cat === 'Plot' && (formData.category === 'Land/Plot' || formData.category === 'Plot / Land'));
                                return (
                                  <button
                                    key={a.cat}
                                    type="button"
                                    onClick={() => {
                                      const targetCat = a.cat === 'Plot' ? 'Land/Plot' : a.cat;
                                      setFormData(prev => ({
                                        ...prev,
                                        category: targetCat,
                                        componentsMatrix: getFeaturesForCategory(targetCat)
                                      }));
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                                      isSelected 
                                        ? 'bg-[#0a1d37] text-white shadow-xs font-bold' 
                                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                                    }`}
                                  >
                                    {a.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Render items dynamically grouped by category */}
                          {(() => {
                            const templateCategories = getAssetSpecPresets(formData.category || 'Villa').map(p => p.category);
                            const matrixCategories = (formData.componentsMatrix || []).map(p => p.categoryName || p.category).filter(Boolean);
                            const uniqueCategories = Array.from(new Set([...templateCategories, ...matrixCategories]));

                            return uniqueCategories.map(catName => {
                              const itemsInCat = (formData.componentsMatrix || []).map((item, originalIdx) => ({ ...item, originalIdx }))
                                .filter(item => (item.categoryName || item.category) === catName);

                              return (
                                <div key={catName} className="bg-[#fbf9f5] border border-slate-200 rounded-2xl p-4 space-y-3">
                                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                                    <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#0a1d37]">
                                      {catName}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleAddCustomFeature(catName)}
                                      className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#b8860b] hover:text-[#0a1d37] bg-white border border-amber-300/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs"
                                    >
                                      <PlusCircle className="w-3 h-3 text-[#b8860b]" />
                                      <span>+ Add Feature</span>
                                    </button>
                                  </div>

                                  <div className="space-y-2.5">
                                    {itemsInCat.length === 0 ? (
                                      <p className="text-[11px] text-slate-400 font-mono py-2 text-center">
                                        No features in this category. Click "+ Add Feature" above.
                                      </p>
                                    ) : (
                                      itemsInCat.map(item => {
                                        const isIncluded = (item.isAvailable !== false && item.status !== 'Not Included');
                                        return (
                                          <div
                                            key={item.originalIdx}
                                            className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs hover:border-amber-300 transition-all"
                                          >
                                            {/* Feature Name & Toggle Switch */}
                                            <div className="flex items-center space-x-3 w-full sm:w-1/3 min-w-0">
                                              <button
                                                type="button"
                                                onClick={() => handleToggleFeature(item.originalIdx)}
                                                title={isIncluded ? "Click to mark Not Included (—)" : "Click to mark Included (✓)"}
                                                className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center space-x-1 shrink-0 transition-transform active:scale-95 cursor-pointer shadow-2xs ${
                                                  isIncluded
                                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                    : 'bg-slate-400 text-white hover:bg-slate-500'
                                                }`}
                                              >
                                                {isIncluded ? (
                                                  <>
                                                    <Check className="w-3 h-3" />
                                                    <span>Included</span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <X className="w-3 h-3" />
                                                    <span>Not Included</span>
                                                  </>
                                                )}
                                              </button>
                                              <span className="font-bold text-[#0a1d37] text-xs truncate">
                                                {item.featureName || item.feature}
                                              </span>
                                            </div>

                                            {/* Description Note / Details Input */}
                                            <div className="flex-1 w-full">
                                              <input
                                                type="text"
                                                value={item.descriptionNote ?? item.details ?? ''}
                                                onChange={e => handleFeatureNoteChange(item.originalIdx, e.target.value)}
                                                placeholder="Specific notes & equipment details..."
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:border-[#b8860b] focus:bg-white focus:outline-none transition-colors"
                                              />
                                            </div>

                                            {/* Delete Row Button */}
                                            <button
                                              type="button"
                                              onClick={() => handleDeleteFeature(item.originalIdx)}
                                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                                              title="Delete Feature"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        );
                                      })
                                    )}
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>

                        {/* B. MANUAL STRATEGIC TRANSIT & INFRASTRUCTURE */}
                        <div className="space-y-4 pt-4 border-t border-slate-200">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
                            <div>
                              <div className="flex items-center space-x-2">
                                <Car className="w-4 h-4 text-[#b8860b]" />
                                <h3 className="font-serif font-bold text-base text-[#0a1d37]">
                                  Manual Strategic Transit & Infrastructure
                                </h3>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Manual verified road & transit milestones replacing automated APIs.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={handleAddTransitRoute}
                              className="inline-flex items-center space-x-1 text-xs font-bold text-white bg-[#0a1d37] hover:bg-[#061426] px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-sm"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                              <span>+ Add Transit Route</span>
                            </button>
                          </div>

                          <div className="space-y-3">
                            {(!formData.transitMatrix || formData.transitMatrix.length === 0) ? (
                              <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                <Car className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs font-semibold text-slate-600">No transit landmarks added yet.</p>
                                <p className="text-[11px] text-slate-400 mt-0.5 mb-3">Add key landmarks like airports, railway stations, highways, and metro nodes.</p>
                                <button
                                  type="button"
                                  onClick={handleAddTransitRoute}
                                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-[#0a1d37] hover:bg-[#061426] px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                                >
                                  <PlusCircle className="w-3.5 h-3.5" />
                                  <span>+ Add First Transit Route</span>
                                </button>
                              </div>
                            ) : (
                              (formData.transitMatrix || []).map((tItem, tIdx) => (
                                <div
                                  key={tIdx}
                                  className="bg-[#fbf9f5] border border-slate-200 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center shadow-2xs hover:border-slate-300 transition-colors"
                                >
                                  {/* Reordering & Position Indicator */}
                                  <div className="sm:col-span-1 flex items-center justify-between sm:justify-center gap-1.5 sm:pt-4">
                                    <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-1 rounded min-w-[28px] text-center" title={`Position ${tIdx + 1}`}>
                                      #{tIdx + 1}
                                    </span>
                                    <div className="flex sm:flex-col gap-0.5">
                                      <button
                                        type="button"
                                        onClick={() => handleMoveTransit(tIdx, 'up')}
                                        disabled={tIdx === 0}
                                        className="p-1 sm:p-0.5 text-slate-500 hover:text-[#0a1d37] disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-200 rounded transition-colors cursor-pointer"
                                        title="Move landmark up"
                                        aria-label="Move landmark up"
                                      >
                                        <ChevronUp className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleMoveTransit(tIdx, 'down')}
                                        disabled={tIdx === (formData.transitMatrix || []).length - 1}
                                        className="p-1 sm:p-0.5 text-slate-500 hover:text-[#0a1d37] disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-200 rounded transition-colors cursor-pointer"
                                        title="Move landmark down"
                                        aria-label="Move landmark down"
                                      >
                                        <ChevronDown className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Travel Mode (Walk, Drive, Transit, Flight) */}
                                  <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                      Travel Mode
                                    </label>
                                    <div className="relative">
                                      <select
                                        value={tItem.travelMode || tItem.transportMode || 'Drive'}
                                        onChange={e => handleUpdateTransit(tIdx, 'travelMode', e.target.value)}
                                        className="w-full bg-white border border-slate-300 rounded-lg pl-7 pr-2 py-1.5 text-xs font-semibold text-[#0a1d37] focus:border-[#b8860b] focus:outline-none cursor-pointer"
                                      >
                                        <option value="Walk">Walk</option>
                                        <option value="Drive">Drive</option>
                                        <option value="Transit">Transit</option>
                                        <option value="Flight">Flight</option>
                                      </select>
                                      <div className="absolute left-2 top-2 pointer-events-none">
                                        {(tItem.travelMode === 'Walk' || tItem.transportMode === 'Walk') ? <Footprints className="w-3.5 h-3.5 text-emerald-600" /> :
                                         (tItem.travelMode === 'Flight' || tItem.transportMode === 'Flight') ? <Plane className="w-3.5 h-3.5 text-sky-600" /> :
                                         (tItem.travelMode === 'Transit' || tItem.transportMode === 'Transit') ? <Train className="w-3.5 h-3.5 text-amber-600" /> :
                                         <Car className="w-3.5 h-3.5 text-blue-600" />}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Landmark Name */}
                                  <div className="sm:col-span-4">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                      Landmark Name
                                    </label>
                                    <input
                                      type="text"
                                      value={tItem.landmarkName || tItem.destination || ''}
                                      onChange={e => handleUpdateTransit(tIdx, 'landmarkName', e.target.value)}
                                      placeholder="e.g. Mangaluru Central Railway Station"
                                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                                    />
                                  </div>

                                  {/* Distance */}
                                  <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                      Distance
                                    </label>
                                    <input
                                      type="text"
                                      value={tItem.distanceText || (tItem.distanceKm !== undefined && tItem.distanceKm !== 0 ? `${tItem.distanceKm} km` : '')}
                                      onChange={e => handleUpdateTransit(tIdx, 'distanceText', e.target.value)}
                                      placeholder="e.g. 4.2 km"
                                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                                    />
                                  </div>

                                  {/* Duration */}
                                  <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                      Duration
                                    </label>
                                    <input
                                      type="text"
                                      value={tItem.durationText || (tItem.travelTimeMins !== undefined && tItem.travelTimeMins !== 0 ? `${tItem.travelTimeMins}m` : '')}
                                      onChange={e => handleUpdateTransit(tIdx, 'durationText', e.target.value)}
                                      placeholder="e.g. 10m"
                                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                                    />
                                  </div>

                                  {/* Delete button */}
                                  <div className="sm:col-span-1 flex justify-end sm:justify-center sm:pt-4">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteTransit(tIdx)}
                                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 hover:bg-red-50 transition-colors cursor-pointer"
                                      title="Delete Landmark"
                                      aria-label="Delete Landmark"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          {/* Road Ingress & Zoning Metadata */}
                          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                Road Ingress Specification
                              </label>
                              <input
                                type="text"
                                value={formData.roadIngressText || ''}
                                onChange={e => setFormData(prev => ({ ...prev, roadIngressText: e.target.value }))}
                                placeholder="e.g. 40ft Wide Asphalt Road"
                                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                              />
                              <p className="text-[10px] text-slate-400 mt-1">Displayed in property footer transit strip.</p>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                Zoning & Approval Tag
                              </label>
                              <input
                                type="text"
                                value={formData.zoningTagText || ''}
                                onChange={e => setFormData(prev => ({ ...prev, zoningTagText: e.target.value }))}
                                placeholder="e.g. RERA Compliant / MCC A-Khata"
                                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                              />
                              <p className="text-[10px] text-slate-400 mt-1">e.g. RERA Compliant, Commercial Khata A, etc.</p>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* STEP 4: DYNAMIC SELF-VERIFIABLE LEGAL AUDIT UI & INVESTMENT */}
                    {formStep === 4 && (
                      <div className="space-y-8">

                        {/* LEGAL & TITLE VERIFICATION SECTION */}
                        <div className="space-y-4">
                          <div className="p-4 bg-gradient-to-r from-amber-50 to-[#fdfbf7] border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center space-x-2">
                                <FileCheck className="w-4 h-4 text-[#b8860b]" />
                                <h4 className="font-serif font-bold text-sm text-[#0a1d37]">
                                  Legal & Title Verification
                                </h4>
                              </div>
                              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                                Audit statutory title documents with individual status badges and manual verification logging.
                              </p>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0">
                              <button
                                type="button"
                                onClick={handleLoadDefault12PointLegal}
                                className="bg-[#0a1d37] hover:bg-[#061426] text-white px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center space-x-1.5"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-[#e6ca65]" />
                                <span>Load Default 12-Point Checklist</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleAddCustomLegalCheck}
                                className="bg-white hover:bg-slate-50 text-[#0a1d37] border border-slate-300 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center space-x-1"
                              >
                                <PlusCircle className="w-3.5 h-3.5 text-[#b8860b]" />
                                <span>+ Add Custom Legal Check</span>
                              </button>
                            </div>
                          </div>

                          {/* List of Legal Audit Items */}
                          <div className="space-y-3">
                            {(formData.legalVerification || []).map((legalItem, lIdx) => (
                              <div
                                key={lIdx}
                                className="bg-[#fbf9f5] border border-slate-200 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center shadow-2xs"
                              >
                                {/* Document Name */}
                                <div className="sm:col-span-4">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Document Title {legalItem.isCustomItem && <span className="text-[#b8860b] font-normal">(Custom)</span>}
                                  </label>
                                  <input
                                    type="text"
                                    value={legalItem.documentName}
                                    onChange={e => handleUpdateLegalItem(lIdx, 'documentName', e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                                  />
                                </div>

                                {/* Verified Status */}
                                <div className="sm:col-span-3">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Verification Status
                                  </label>
                                  <select
                                    value={legalItem.verifiedStatus}
                                    onChange={e => handleUpdateLegalItem(lIdx, 'verifiedStatus', e.target.value)}
                                    className={`w-full border rounded-lg px-2.5 py-1.5 text-xs font-bold focus:outline-none cursor-pointer ${legalItem.verifiedStatus === 'Verified' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                                        legalItem.verifiedStatus === 'Pending' ? 'bg-amber-50 border-amber-300 text-amber-800' :
                                          legalItem.verifiedStatus === 'Issue Flagged' ? 'bg-red-50 border-red-300 text-red-800' :
                                            'bg-slate-50 border-slate-300 text-slate-700'
                                      }`}
                                  >
                                    <option value="Verified">✓ Verified (Clean Clear Title)</option>
                                    <option value="Pending">⏳ Pending Audit</option>
                                    <option value="Issue Flagged">✕ Issue Flagged / Action Required</option>
                                    <option value="Not Applicable">— Not Applicable</option>
                                  </select>
                                </div>

                                {/* Verification Note */}
                                <div className="sm:col-span-4">
                                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    Manual Audit Note
                                  </label>
                                  <input
                                    type="text"
                                    value={legalItem.verificationNote || ''}
                                    onChange={e => handleUpdateLegalItem(lIdx, 'verificationNote', e.target.value)}
                                    placeholder="e.g. Verified via Kaveri 2.0 portal"
                                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:border-[#b8860b] focus:outline-none"
                                  />
                                </div>

                                {/* Delete button */}
                                <div className="sm:col-span-1 flex justify-end sm:pt-4">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLegalItem(lIdx)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 hover:bg-red-50 transition-colors cursor-pointer"
                                    title="Delete Item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* ADVOCATE VERIFICATION BRIDGE TOGGLE */}
                        <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-[#0a1d37] block">
                              Advocate Legal Search Report / Bank Loan Bridge
                            </span>
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              Keep "Verify with Advocate (Bank Loan Bridge)" action active on storefront for buyers needing bank approvals.
                            </span>
                          </div>
                          <label className="inline-flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.advocateVerificationAvailable}
                              onChange={e => setFormData({ ...formData, advocateVerificationAvailable: e.target.checked })}
                              className="w-5 h-5 text-[#0a1d37] rounded focus:ring-[#b8860b]"
                            />
                            <span className="text-xs font-bold text-emerald-800">Active</span>
                          </label>
                        </div>

                        {/* STRATEGIC INVESTMENT ANALYSIS INPUTS */}
                        <div className="p-4 bg-[#fbf9f5] border border-slate-200 rounded-2xl space-y-3">
                          <span className="text-xs font-bold text-[#0a1d37] uppercase tracking-wider block">
                            Strategic Investment & Yield Guidance
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Estimated Monthly Rental Yield</label>
                              <input
                                type="text"
                                value={formData.rentalYieldEst}
                                onChange={e => setFormData({ ...formData, rentalYieldEst: e.target.value })}
                                placeholder="e.g. ₹1,25,000 / mo (4.2% Gross Yield)"
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Annual Resale Appreciation</label>
                              <input
                                type="text"
                                value={formData.resaleAppreciationEst}
                                onChange={e => setFormData({ ...formData, resaleAppreciationEst: e.target.value })}
                                placeholder="e.g. 11.5% - 13.0% Compound Y-o-Y"
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-[#0a1d37] mb-1.5">Locality Growth Driver</label>
                              <input
                                type="text"
                                value={formData.localityGrowthDriver}
                                onChange={e => setFormData({ ...formData, localityGrowthDriver: e.target.value })}
                                placeholder="e.g. Coastal expansion & IT corridor ingress"
                                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Step Navigation Controls */}
                    <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-6">
                      <div>
                        {formStep > 1 && (
                          <button
                            type="button"
                            onClick={() => setFormStep(formStep - 1)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-[#0a1d37] hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                          >
                            ← Previous Step
                          </button>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={handleCancelForm}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-[#0a1d37] transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>

                        {formStep < 4 ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setFormStep(prev => Math.min(prev + 1, 4));
                            }}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer border border-slate-800"
                          >
                            Next Step →
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-2.5 rounded-lg text-xs shadow-sm flex items-center space-x-1.5 cursor-pointer transition-all border border-slate-800"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{editingPropertyId ? 'Save Updates' : 'Publish Live to Catalog'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                  </form>
                </div>

              </div>
            )}

            {/* =============================================================== */}
            {/* VIEW 5: HERO SETTINGS & FEATURED VIDEO CONTROLLER               */}
            {/* =============================================================== */}
            {activeTab === 'hero-settings' && (
              <div className="space-y-8 w-full">

                {/* Header Banner */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#b8860b]">
                        Command Center • Dynamic Media Controller
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        Live Dynamic Hook
                      </span>
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-[#0a1d37] mt-1">
                      Hero Featured Video Showcase
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                      Configure the widescreen 16:9 featured video showcase appearing on the live homepage hero. Select any existing property listing to link directly, or paste a custom YouTube ID/URL override with custom typography.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => navigate('/')}
                      className="border border-slate-200 bg-[#f8f6f0] hover:bg-slate-100 text-[#0a1d37] px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
                      title="View current live homepage"
                    >
                      <Eye className="w-4 h-4 text-[#b8860b]" />
                      <span>View Live Site</span>
                    </button>
                    <button
                      onClick={handleSaveHeroSettings}
                      disabled={isSavingHeroSettings}
                      className="bg-[#0a1d37] hover:bg-[#061426] text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center space-x-2 shadow-md cursor-pointer"
                    >
                      {isSavingHeroSettings ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-[#b8860b]" />
                      ) : heroSaveSuccess ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Save className="w-4 h-4 text-[#e6ca65]" />
                      )}
                      <span>{heroSaveSuccess ? 'Deployed Live!' : isSavingHeroSettings ? 'Deploying...' : 'Save & Deploy'}</span>
                    </button>
                  </div>
                </div>

                {/* Main Grid: Form Controls (Left) & Real-time 16:9 Live Preview (Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                  {/* Left Column: Configuration Form */}
                  <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6">

                    {/* Field 1: Property Listing Selector */}
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        1. Select Associated Property Listing (Click to redirect)
                      </label>
                      <select
                        value={heroSettings.heroFeaturedPropertyId || ''}
                        onChange={(e) => handleSelectHeroProperty(e.target.value)}
                        className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#0a1d37] font-medium focus:outline-none focus:border-[#b8860b]"
                      >
                        <option value="">-- No Direct Link (Custom Showcase) --</option>
                        {properties.map((p) => (
                          <option key={p._id || p.id} value={p._id || p.id}>
                            {p.title} • {p.locality || p.city || p.location} ({p.price})
                          </option>
                        ))}
                      </select>
                      <div className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between">
                        <span>Clicking the hero video card on the homepage redirects buyers directly to this property's inspection dossier.</span>
                        {heroSettings.heroFeaturedPropertyId && (
                          <button
                            type="button"
                            onClick={() => handleSelectHeroProperty(heroSettings.heroFeaturedPropertyId)}
                            className="text-[#b8860b] hover:underline font-semibold ml-2 cursor-pointer"
                          >
                            Re-sync Metadata
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Field 2: Custom YouTube Video ID or URL */}
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        2. Direct YouTube Video ID or URL Override
                      </label>
                      <div className="relative">
                        <Video className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. 7X8mLSQkg4Y or https://www.youtube.com/watch?v=..."
                          value={heroSettings.heroCustomYoutubeId || ''}
                          onChange={(e) => setHeroSettings({ ...heroSettings, heroCustomYoutubeId: e.target.value })}
                          className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-[#0a1d37] font-medium focus:outline-none focus:border-[#b8860b]"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1.5">
                        Leave empty to use the selected property's default YouTube video ID. Direct video IDs or full YouTube URLs automatically resolve in 16:9 widescreen HD thumbnails.
                      </p>
                    </div>

                    {/* Field 3: Badge Tag */}
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        3. Hero Badge Tag Pill
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. FEATURED PROPERTY"
                        value={heroSettings.heroBadgeTag || ''}
                        onChange={(e) => setHeroSettings({ ...heroSettings, heroBadgeTag: e.target.value })}
                        className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#0a1d37] font-medium focus:outline-none focus:border-[#b8860b]"
                      />
                      {/* Quick Badge Suggestions */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="text-[10px] text-slate-400 font-mono self-center mr-1">Suggestions:</span>
                        {['FEATURED PROPERTY', 'VERIFIED RESALE', 'EXCLUSIVE SEA VILLA', 'WATERFRONT PENTHOUSE', 'INVESTOR HIGHLIGHT'].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setHeroSettings({ ...heroSettings, heroBadgeTag: tag })}
                            className={`text-[10px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${heroSettings.heroBadgeTag === tag
                                ? 'bg-red-50 text-red-700 border-red-300 font-bold'
                                : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300'
                              }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Field 4: Overlay Display Title */}
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        4. Overlay Display Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ultra Luxury Seafront Villa"
                        value={heroSettings.heroOverlayTitle || ''}
                        onChange={(e) => setHeroSettings({ ...heroSettings, heroOverlayTitle: e.target.value })}
                        className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#0a1d37] font-medium focus:outline-none focus:border-[#b8860b]"
                      />
                    </div>

                    {/* Field 5: Overlay Location & Price */}
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                        5. Overlay Location & Price Text
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Surathkal Beach, Mangaluru • ₹3.85 Cr"
                        value={heroSettings.heroOverlayLocation || ''}
                        onChange={(e) => setHeroSettings({ ...heroSettings, heroOverlayLocation: e.target.value })}
                        className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#0a1d37] font-medium focus:outline-none focus:border-[#b8860b]"
                      />
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        Changes deploy in real-time without requiring site restart.
                      </span>
                      <button
                        type="button"
                        onClick={handleSaveHeroSettings}
                        disabled={isSavingHeroSettings}
                        className="bg-[#0a1d37] hover:bg-[#061426] text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center space-x-2 shadow-md cursor-pointer"
                      >
                        {isSavingHeroSettings ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#b8860b]" />
                        ) : (
                          <Save className="w-3.5 h-3.5 text-[#e6ca65]" />
                        )}
                        <span>{isSavingHeroSettings ? 'Deploying...' : 'Save & Deploy Live'}</span>
                      </button>
                    </div>

                  </div>

                  {/* Right Column: Live 16:9 Widescreen Card Preview */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0a1d37]">
                            Live 16:9 Homepage Preview
                          </h2>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                          Aspect: 16:9 Widescreen
                        </span>
                      </div>

                      {/* Exact 16:9 Hero Card Container */}
                      <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 relative bg-[#0a1d37] group">
                        <img
                          src={previewThumbnail}
                          alt="Hero Preview"
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            if (e.target.src.includes('maxresdefault.jpg')) {
                              e.target.src = `https://img.youtube.com/vi/${previewYoutubeId}/hqdefault.jpg`;
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1d37]/95 via-[#0a1d37]/35 to-black/20" />

                        {/* Top Badge */}
                        <div className="absolute top-3.5 left-3.5 z-10">
                          <span className="bg-red-600 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full flex items-center space-x-1.5 shadow-md">
                            <Video className="w-3.5 h-3.5" />
                            <span>{heroSettings.heroBadgeTag || 'FEATURED PROPERTY'}</span>
                          </span>
                        </div>

                        {/* Center Play Button */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10 pointer-events-none">
                          <div className="w-14 h-14 rounded-full bg-white/95 text-[#0a1d37] flex items-center justify-center shadow-2xl mb-2">
                            <Play className="w-6 h-6 fill-current ml-0.5 text-[#0a1d37]" />
                          </div>
                          <span className="text-xs font-semibold text-white tracking-wide bg-[#0a1d37]/80 px-3.5 py-1 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
                            View Property Details
                          </span>
                        </div>

                        {/* Bottom Overlay Info */}
                        <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white z-10">
                          <span className="text-[10px] text-[#e6ca65] uppercase tracking-widest font-bold block mb-0.5">
                            Exclusive Listing
                          </span>
                          <h3 className="text-base font-serif font-medium truncate drop-shadow-sm text-white">
                            {heroSettings.heroOverlayTitle || 'Featured Property Walkthrough'}
                          </h3>
                          <p className="text-xs text-slate-200 truncate mt-0.5">
                            {heroSettings.heroOverlayLocation || 'Mangaluru'}
                          </p>
                        </div>
                      </div>

                      {/* Metadata Specs Panel */}
                      <div className="mt-5 pt-4 border-t border-slate-100 text-xs space-y-2">
                        <div className="flex justify-between py-1 text-slate-600">
                          <span className="font-mono text-slate-400">Target Listing:</span>
                          <span className="font-semibold text-[#0a1d37] truncate max-w-[200px]">
                            {properties.find(p => String(p._id) === String(heroSettings.heroFeaturedPropertyId) || String(p.id) === String(heroSettings.heroFeaturedPropertyId))?.title || 'None (Custom)'}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 text-slate-600">
                          <span className="font-mono text-slate-400">Active YouTube ID:</span>
                          <span className="font-mono font-semibold text-[#b8860b]">
                            {previewYoutubeId}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 text-slate-600">
                          <span className="font-mono text-slate-400">Thumbnail Resolution:</span>
                          <span className="font-semibold text-slate-700">1280 × 720 (16:9 MaxRes)</span>
                        </div>
                        <div className="flex justify-between py-1 text-slate-600">
                          <span className="font-mono text-slate-400">Sync Status:</span>
                          <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Ready for Deployment</span>
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* =============================================================== */}
            {/* VIEW 6: SYSTEM PRESETS & CONFIG MANAGER (Dual-Tab)              */}
            {/* =============================================================== */}
            {activeTab === 'master-presets' && (
              <div className="space-y-8 w-full">

                {/* Header Card */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-amber-800/20 bg-amber-50/70 text-[#8b6508] text-[11px] font-semibold mb-2">
                      <FolderCog className="w-3.5 h-3.5 text-[#b8860b]" />
                      <span>Global Master Catalog & System Config</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-serif text-[#0a1d37]">
                      System Presets & Specifications
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                      Centrally manage statutory advocate legal checklists and category-filtered property feature matrices. Changes synchronize dynamically with listing creators and published verified properties.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <button
                      onClick={handleSeedDefaults}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-[#fbf9f5] hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
                      title="Reset to default legal checks and feature matrices"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#b8860b]" />
                      <span>Reset Defaults</span>
                    </button>
                    <button
                      onClick={() => handleOpenAddPreset(presetTab === 'legal' ? 'LEGAL_CHECK' : 'PROPERTY_FEATURE')}
                      className="inline-flex items-center space-x-1.5 bg-[#0a1d37] hover:bg-[#061426] text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-[#e6ca65]" />
                      <span>{presetTab === 'legal' ? '+ Add Master Legal Check' : '+ Add Feature Preset'}</span>
                    </button>
                  </div>
                </div>

                {/* Dual-Tab Navigation Selector */}
                <div className="flex border-b border-slate-200 space-x-6">
                  <button
                    onClick={() => { setPresetTab('legal'); setPresetGroupFilter('All'); setPresetSearchQuery(''); }}
                    className={`pb-4 px-2 text-xs uppercase font-bold tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${presetTab === 'legal'
                        ? 'border-b-2 border-[#b8860b] text-[#0a1d37]'
                        : 'text-slate-400 hover:text-slate-700'
                      }`}
                  >
                    <ShieldCheck className={`w-4 h-4 ${presetTab === 'legal' ? 'text-[#b8860b]' : 'text-slate-400'}`} />
                    <span>Global Legal Advisory & Audit Presets</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-[#b8860b] border border-amber-200">
                      {presets.filter(p => p.presetType === 'LEGAL_CHECK').length}
                    </span>
                  </button>

                  <button
                    onClick={() => { setPresetTab('features'); setPresetGroupFilter('All'); setPresetSearchQuery(''); }}
                    className={`pb-4 px-2 text-xs uppercase font-bold tracking-wider transition-all flex items-center space-x-2 cursor-pointer ${presetTab === 'features'
                        ? 'border-b-2 border-[#b8860b] text-[#0a1d37]'
                        : 'text-slate-400 hover:text-slate-700'
                      }`}
                  >
                    <Layers className={`w-4 h-4 ${presetTab === 'features' ? 'text-[#b8860b]' : 'text-slate-400'}`} />
                    <span>Category-Based Feature & Specification Presets</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {presets.filter(p => p.presetType === 'PROPERTY_FEATURE').length}
                    </span>
                  </button>
                </div>

                {/* TAB 1: GLOBAL LEGAL ADVISORY & AUDIT PRESETS */}
                {presetTab === 'legal' && (
                  <div className="space-y-6">
                    {/* Filter & Search Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="relative w-full md:w-80">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search legal documents, clearance types..."
                          value={presetSearchQuery}
                          onChange={e => setPresetSearchQuery(e.target.value)}
                          className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs text-[#0a1d37] focus:outline-none focus:border-[#b8860b]"
                        />
                      </div>

                      <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                        <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center space-x-1">
                          <Filter className="w-3 h-3" />
                          <span>Category:</span>
                        </span>
                        {['All', 'Title', 'Municipal', 'Tax', 'Environmental', 'Custom'].map(cat => (
                          <button
                            key={cat}
                            onClick={() => setPresetGroupFilter(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${presetGroupFilter === cat
                                ? 'bg-[#0a1d37] text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Legal Presets Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-[#fbf9f5] border-b border-slate-200 text-slate-500 font-serif">
                              <th className="py-3.5 px-6 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Document / Audit Title</th>
                              <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Statutory Category</th>
                              <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Standard Audit Tip / Guide Note</th>
                              <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Active Status</th>
                              <th className="py-3.5 px-6 font-bold uppercase tracking-wider text-[11px] text-right text-[#0a1d37]">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {presets
                              .filter(p => p.presetType === 'LEGAL_CHECK')
                              .filter(p => presetGroupFilter === 'All' || p.groupCategory?.toLowerCase() === presetGroupFilter.toLowerCase() || (presetGroupFilter === 'Title' && p.groupCategory === 'Ownership'))
                              .filter(p => !presetSearchQuery || p.title?.toLowerCase().includes(presetSearchQuery.toLowerCase()) || p.defaultDescription?.toLowerCase().includes(presetSearchQuery.toLowerCase()))
                              .map((preset, idx) => {
                                const group = preset.groupCategory || 'Title';
                                const badgeColor =
                                  group.toLowerCase().includes('title') || group.toLowerCase().includes('ownership')
                                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                                    : group.toLowerCase().includes('municipal')
                                      ? 'bg-blue-50 text-blue-900 border-blue-200'
                                      : group.toLowerCase().includes('tax')
                                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                        : group.toLowerCase().includes('environ')
                                          ? 'bg-teal-50 text-teal-900 border-teal-200'
                                          : 'bg-purple-50 text-purple-900 border-purple-200';

                                return (
                                  <tr key={preset._id || idx} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-3.5 px-6 font-semibold text-[#0a1d37] min-w-[240px]">
                                      <div className="flex items-center space-x-2.5">
                                        <ShieldCheck className="w-4 h-4 text-[#b8860b] shrink-0" />
                                        <span>{preset.title}</span>
                                      </div>
                                    </td>
                                    <td className="py-3.5 px-4 whitespace-nowrap">
                                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${badgeColor}`}>
                                        {preset.groupCategory || 'Title'}
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-slate-600 max-w-md">
                                      <p className="line-clamp-2 leading-relaxed">{preset.defaultDescription || '—'}</p>
                                    </td>
                                    <td className="py-3.5 px-4 whitespace-nowrap">
                                      <button
                                        onClick={() => handleTogglePresetActive(preset)}
                                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${preset.isActive !== false
                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                            : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                                          }`}
                                      >
                                        <span className={`w-1.5 h-1.5 rounded-full ${preset.isActive !== false ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                                        <span>{preset.isActive !== false ? 'Active' : 'Disabled'}</span>
                                      </button>
                                    </td>
                                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                                      <div className="inline-flex items-center space-x-1.5">
                                        <button
                                          onClick={() => handleOpenEditPreset(preset)}
                                          className="p-1.5 text-slate-500 hover:text-[#0a1d37] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                          title="Edit Preset"
                                        >
                                          <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleDeletePreset(preset._id || preset.id)}
                                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                          title="Delete Preset"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: CATEGORY-BASED FEATURE & SPECIFICATION PRESETS */}
                {presetTab === 'features' && (
                  <div className="space-y-6">

                    {/* Property Category Selector Tabs */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8860b] font-bold block">Target Asset Category</span>
                          <h4 className="font-serif font-bold text-sm text-[#0a1d37]">Select Category Matrix to Configure</h4>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {['Apartment', 'Villa', 'Independent House', 'Commercial', 'Land/Plot', 'ALL'].map(cat => (
                            <button
                              key={cat}
                              onClick={() => { setPresetCategoryFilter(cat); }}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${presetCategoryFilter === cat
                                  ? 'bg-[#0a1d37] text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Secondary Filter & Search */}
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-1">
                        <div className="relative w-full md:w-80">
                          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search specifications, elevator, pool, power..."
                            value={presetSearchQuery}
                            onChange={e => setPresetSearchQuery(e.target.value)}
                            className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs text-[#0a1d37] focus:outline-none focus:border-[#b8860b]"
                          />
                        </div>

                        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center space-x-1">
                            <Tag className="w-3 h-3" />
                            <span>Group:</span>
                          </span>
                          {['All', 'Interior & Living', 'Building & Security', 'Utilities', 'Outdoor'].map(grp => (
                            <button
                              key={grp}
                              onClick={() => setPresetGroupFilter(grp)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${presetGroupFilter === grp
                                  ? 'bg-amber-100 text-[#8b6508] border border-amber-300 font-bold'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                              {grp}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Feature Presets Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-[#fbf9f5] border-b border-slate-200 text-slate-500 font-serif">
                              <th className="py-3.5 px-6 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Feature / Specification</th>
                              <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Group</th>
                              <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Asset Type</th>
                              <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Default Status</th>
                              <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Standard Specification Guide</th>
                              <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[11px] text-[#0a1d37]">Active</th>
                              <th className="py-3.5 px-6 font-bold uppercase tracking-wider text-[11px] text-right text-[#0a1d37]">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {presets
                              .filter(p => p.presetType === 'PROPERTY_FEATURE')
                              .filter(p => presetCategoryFilter === 'ALL' || p.applicableCategory === 'ALL' || p.applicableCategory === presetCategoryFilter || (presetCategoryFilter === 'Independent House' && p.applicableCategory === 'Villa'))
                              .filter(p => presetGroupFilter === 'All' || p.groupCategory === presetGroupFilter)
                              .filter(p => !presetSearchQuery || p.title?.toLowerCase().includes(presetSearchQuery.toLowerCase()) || p.defaultDescription?.toLowerCase().includes(presetSearchQuery.toLowerCase()))
                              .map((preset, idx) => (
                                <tr key={preset._id || idx} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="py-3.5 px-6 font-semibold text-[#0a1d37] min-w-[200px]">
                                    <div className="flex items-center space-x-2">
                                      <Layers className="w-3.5 h-3.5 text-[#b8860b] shrink-0" />
                                      <span>{preset.title}</span>
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                      {preset.groupCategory || 'General'}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-[#8b6508] border border-amber-200">
                                      {preset.applicableCategory || 'ALL'}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    {preset.defaultStatus !== 'Not Available' ? (
                                      <span className="text-emerald-700 font-bold flex items-center space-x-1">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>✓ Included</span>
                                      </span>
                                    ) : (
                                      <span className="text-slate-400 font-medium">— Not Included</span>
                                    )}
                                  </td>
                                  <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                                    <p className="truncate leading-relaxed">{preset.defaultDescription || '—'}</p>
                                  </td>
                                  <td className="py-3.5 px-4 whitespace-nowrap">
                                    <button
                                      onClick={() => handleTogglePresetActive(preset)}
                                      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${preset.isActive !== false
                                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                          : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                                        }`}
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full ${preset.isActive !== false ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                                      <span>{preset.isActive !== false ? 'Active' : 'Disabled'}</span>
                                    </button>
                                  </td>
                                  <td className="py-3.5 px-6 text-right whitespace-nowrap">
                                    <div className="inline-flex items-center space-x-1.5">
                                      <button
                                        onClick={() => handleOpenEditPreset(preset)}
                                        className="p-1.5 text-slate-500 hover:text-[#0a1d37] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                        title="Edit Preset"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDeletePreset(preset._id || preset.id)}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                        title="Delete Preset"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </main>

      </div>

      {/* =================================================================== */}
      {/* MODAL: ADD / EDIT MASTER PRESET                                     */}
      {/* =================================================================== */}
      {showPresetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1d37]/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowPresetModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 cursor-pointer p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#b8860b]">
                {editingPresetId ? 'Edit Configuration' : 'Create Master Preset'}
              </span>
              <h3 className="text-xl font-serif font-bold text-[#0a1d37] mt-1">
                {editingPresetId
                  ? 'Edit Master Preset'
                  : (presetFormData.presetType === 'LEGAL_CHECK' ? 'Add Master Legal Check' : 'Add Property Feature Preset')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure defaults that will propagate to listing creation workflows and client specifications.
              </p>
            </div>

            <form onSubmit={handleSavePreset} className="space-y-4">
              {/* Preset Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Preset Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPresetFormData({ ...presetFormData, presetType: 'LEGAL_CHECK', groupCategory: 'Title' })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${presetFormData.presetType === 'LEGAL_CHECK'
                        ? 'bg-[#0a1d37] text-white border-[#0a1d37] shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    Legal Check
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresetFormData({ ...presetFormData, presetType: 'PROPERTY_FEATURE', groupCategory: 'Interior & Living' })}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all cursor-pointer ${presetFormData.presetType === 'PROPERTY_FEATURE'
                        ? 'bg-[#0a1d37] text-white border-[#0a1d37] shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    Feature / Amenity
                  </button>
                </div>
              </div>

              {/* Title / Document Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {presetFormData.presetType === 'LEGAL_CHECK' ? 'Document / Clearance Name *' : 'Feature / Amenity Title *'}
                </label>
                <input
                  required
                  type="text"
                  placeholder={presetFormData.presetType === 'LEGAL_CHECK' ? 'e.g. CRZ Coastal Clearance Certificate' : 'e.g. Automatic High-Speed Elevators'}
                  value={presetFormData.title}
                  onChange={e => setPresetFormData({ ...presetFormData, title: e.target.value })}
                  className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none"
                />
              </div>

              {/* If Feature: Applicable Category & Default Status */}
              {presetFormData.presetType === 'PROPERTY_FEATURE' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Applicable Category</label>
                    <select
                      value={presetFormData.applicableCategory}
                      onChange={e => setPresetFormData({ ...presetFormData, applicableCategory: e.target.value })}
                      className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#b8860b]"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Independent House">Independent House</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Land/Plot">Land/Plot</option>
                      <option value="ALL">ALL Asset Types</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Default Status</label>
                    <select
                      value={presetFormData.defaultStatus}
                      onChange={e => setPresetFormData({ ...presetFormData, defaultStatus: e.target.value })}
                      className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#b8860b]"
                    >
                      <option value="Available">✓ Available (Included)</option>
                      <option value="Not Available">— Not Available</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Group Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {presetFormData.presetType === 'LEGAL_CHECK' ? 'Default Legal Category' : 'Specification Group'}
                </label>
                {presetFormData.presetType === 'LEGAL_CHECK' ? (
                  <select
                    value={presetFormData.groupCategory}
                    onChange={e => setPresetFormData({ ...presetFormData, groupCategory: e.target.value })}
                    className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#b8860b]"
                  >
                    <option value="Title">Title / Ownership</option>
                    <option value="Municipal">Municipal Clearance</option>
                    <option value="Tax">Tax & Revenue</option>
                    <option value="Environmental">Environmental / CRZ</option>
                    <option value="Custom">Custom Audit</option>
                  </select>
                ) : (
                  <select
                    value={presetFormData.groupCategory}
                    onChange={e => setPresetFormData({ ...presetFormData, groupCategory: e.target.value })}
                    className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#b8860b]"
                  >
                    <option value="Interior & Living">Interior & Living</option>
                    <option value="Building & Security">Building & Security</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="General">General</option>
                  </select>
                )}
              </div>

              {/* Standard Audit Tip / Guide */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {presetFormData.presetType === 'LEGAL_CHECK' ? 'Standard Audit Tip / Guide Note' : 'Default Specification Note'}
                </label>
                <textarea
                  rows="3"
                  placeholder={presetFormData.presetType === 'LEGAL_CHECK'
                    ? 'Mention statutory verification procedure, required authority stamp, or advocate panel advisory...'
                    : 'Mention technical specifications, brand standards, or capacity details...'}
                  value={presetFormData.defaultDescription}
                  onChange={e => setPresetFormData({ ...presetFormData, defaultDescription: e.target.value })}
                  className="w-full bg-[#f8f6f0] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-[#0a1d37] focus:border-[#b8860b] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Active Toggle Checkbox */}
              <div className="flex items-center space-x-2.5 pt-1">
                <input
                  type="checkbox"
                  id="presetActiveCheckbox"
                  checked={presetFormData.isActive}
                  onChange={e => setPresetFormData({ ...presetFormData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0a1d37] border-slate-300 focus:ring-[#b8860b]"
                />
                <label htmlFor="presetActiveCheckbox" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Preset is Active (will automatically appear in listing creation forms)
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPresetModal(false)}
                  className="w-1/3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPreset}
                  className="w-2/3 py-2.5 bg-[#0a1d37] hover:bg-[#061426] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-60"
                >
                  {isSavingPreset ? 'Saving Preset...' : (editingPresetId ? 'Save Changes' : 'Create Preset')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reusable Custom Item Modal (Zero Native Browser prompt() Dialogs) */}
      <AddCustomItemModal
        isOpen={customItemModal.isOpen}
        onClose={() => setCustomItemModal(prev => ({ ...prev, isOpen: false }))}
        title={customItemModal.type === 'FEATURE' ? `Add Feature to ${customItemModal.categoryName || 'Category'}` : 'Add Custom Statutory Legal Check'}
        subtitle={customItemModal.type === 'FEATURE' ? 'Configure custom architectural, fixture, or amenity specification.' : 'Configure statutory clearance, municipal approval, or environmental NOC document.'}
        onSubmit={handleConfirmCustomModal}
        submitLabel={customItemModal.type === 'FEATURE' ? 'Add Feature' : 'Add Legal Check'}
      >
        {customItemModal.type === 'FEATURE' ? (
          <>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Feature / Amenity Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Italian Botticino Marble Flooring, Private Plunge Pool"
                value={customItemModal.title}
                onChange={e => setCustomItemModal(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Specification / Description Note <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Imported 20mm slab, anti-skid polished finish"
                value={customItemModal.note}
                onChange={e => setCustomItemModal(prev => ({ ...prev, note: e.target.value }))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Document / Statutory Clearance Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Coastal Regulation Zone (CRZ) Clearance"
                value={customItemModal.title}
                onChange={e => setCustomItemModal(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Initial Verification Status
              </label>
              <select
                value={customItemModal.status}
                onChange={e => setCustomItemModal(prev => ({ ...prev, status: e.target.value }))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none cursor-pointer"
              >
                <option value="Verified">Verified (Compliant on record)</option>
                <option value="Pending Audit">Pending Audit (Under advocate review)</option>
                <option value="Not Applicable">Not Applicable (Exempt by zone / type)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Audit Reference Note <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. NOC ref #CRZ-2024-8849 issued by CZMA"
                value={customItemModal.note}
                onChange={e => setCustomItemModal(prev => ({ ...prev, note: e.target.value }))}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
              />
            </div>
          </>
        )}
      </AddCustomItemModal>

    </div>
  );
}
