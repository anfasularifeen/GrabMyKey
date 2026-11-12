import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, RotateCw, ShieldCheck, Database,
  LogOut, PlusCircle, Trash2, Video, Upload, FileText,
  X, Check, Lock, ChevronRight, Layers, FileCheck, CheckCircle2,
  Maximize2, Minus, ExternalLink, Play, RefreshCw, MapPin
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import { getAssetSpecPresets } from '../defaultPresets';
import AddCustomItemModal from './AddCustomItemModal';

export default function PublishListingPage({ onExit, onSaveProperty }) {
  const navigate = useNavigate();

  // Navigation & Browser History Back Handler
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/manage-345');
    }
  };

  // Clock
  const [currentTime, setCurrentTime] = useState(() => new Date().toLocaleTimeString());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Form Step State (1: General Details, 2: Media & Links, 3: Feature Matrix & Transit, 4: Legal Audit & Investment)
  const [formStep, setFormStep] = useState(1);
  const currentStep = formStep;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Step 1: General Details state (All checkboxes & switches default to UNCHECKED / false)
  const [title, setTitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [price, setPrice] = useState('');
  const [maintenanceFee, setMaintenanceFee] = useState(0);
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [assetCategory, setAssetCategory] = useState('Plot / Land');
  const [superArea, setSuperArea] = useState('');
  const [featuredBadge, setFeaturedBadge] = useState('Verified Listing');
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [description, setDescription] = useState('');

  // Step 2: Media & Links state
  const [videoUrl, setVideoUrl] = useState('');
  const [showYoutubePicker, setShowYoutubePicker] = useState(false);
  const [channelVideos] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

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

  const removeUploadedFile = (idx) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  // Step 3: Property Specifications & Features (Grouped by Category)
  const [componentsMatrix, setComponentsMatrix] = useState(() => {
    return getAssetSpecPresets('Plot').map(item => ({
      categoryName: item.category,
      featureName: item.feature,
      isAvailable: false,
      status: 'Not Included',
      descriptionNote: item.details || ''
    }));
  });

  // Track user-added custom categories (e.g. "Security & Smart Home", "Eco & Sustainability")
  const [customCategories, setCustomCategories] = useState([]);

  const handleAssetCategoryChange = (newCat) => {
    setAssetCategory(newCat);
    const presets = getAssetSpecPresets(newCat).map(item => ({
      categoryName: item.category,
      featureName: item.feature,
      isAvailable: false,
      status: 'Not Included',
      descriptionNote: item.details || ''
    }));
    // Preserve any custom items from user-created categories
    const customItems = componentsMatrix.filter(item => customCategories.includes(item.categoryName));
    setComponentsMatrix([...presets, ...customItems]);
  };

  const handleToggleFeature = (index) => {
    setComponentsMatrix(prev => {
      const updated = [...prev];
      const nextAvailable = !updated[index].isAvailable;
      updated[index] = {
        ...updated[index],
        isAvailable: nextAvailable,
        status: nextAvailable ? 'Included' : 'Not Included'
      };
      return updated;
    });
  };

  const handleFeatureNoteChange = (index, note) => {
    setComponentsMatrix(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], descriptionNote: note };
      return updated;
    });
  };

  const handleDeleteFeature = (index) => {
    setComponentsMatrix(prev => prev.filter((_, i) => i !== index));
  };

  // Step 3: Dynamic Structural & Land Inventory State (Inclusions default to Not Included / false)
  const [inventory, setInventory] = useState([]);

  const handleAddCustomInventory = () => {
    setInventory(prev => [...prev, { label: '', value: '', isAvailable: false, status: 'Not Included' }]);
  };

  const handleInventoryChange = (index, field, value) => {
    setInventory(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveInventory = (index) => {
    setInventory(prev => prev.filter((_, i) => i !== index));
  };

  // Step 3: Strategic Transit Matrix & Proximity State (Preserved in component state across all wizard steps)
  const [transitMatrix, setTransitMatrix] = useState([
    { landmarkName: "Mangaluru International Airport (IXE)", distanceText: "14.2 km", durationText: "20m", travelMode: "Drive" },
    { landmarkName: "Surathkal Railway Station", distanceText: "3.5 km", durationText: "8m", travelMode: "Drive" },
    { landmarkName: "NITK Surathkal Campus & Beach", distanceText: "2.1 km", durationText: "5m", travelMode: "Drive" },
    { landmarkName: "Mangalore City Central / Hampankatta", distanceText: "17.5 km", durationText: "25m", travelMode: "Drive" }
  ]);

  const handleUpdateTransit = (index, field, value) => {
    setTransitMatrix(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddTransitItem = () => {
    setTransitMatrix(prev => [
      ...prev,
      { landmarkName: '', distanceText: '', durationText: '', travelMode: 'Drive' }
    ]);
  };

  const handleRemoveTransitItem = (index) => {
    setTransitMatrix(prev => prev.filter((_, i) => i !== index));
  };

  // Step 4: Dynamic Self-Verifiable Legal Audit & Due Diligence Checklist (Defaults to Pending)
  const [legalChecklist, setLegalChecklist] = useState([
    {
      id: 'parentDeedAudit',
      key: 'parentDeedAudit',
      documentName: '30-Year Parent Deed Chain Audit',
      category: 'Ownership',
      activeStatus: 'Cleared',
      activeLabel: '✓ Cleared',
      verifiedStatus: 'Pending',
      description: 'Chain of title deeds dating back 30 years verified without break in title',
      verificationNote: '30-Year Parent Deed Chain Audit',
      isCustomItem: false
    },
    {
      id: 'encumbranceCertificate',
      key: 'encumbranceCertificate',
      documentName: '30-Year Encumbrance Certificate',
      category: 'Ownership',
      activeStatus: 'Nil EC verified',
      activeLabel: '✓ Nil EC verified',
      verifiedStatus: 'Pending',
      description: 'Form 15 Nil Encumbrance Certificate verified through Kaveri / Sub-Registrar',
      verificationNote: '30-Year Encumbrance Certificate (Nil EC verified)',
      isCustomItem: false
    },
    {
      id: 'revenueRtcCompliance',
      key: 'revenueRtcCompliance',
      documentName: 'Revenue RTC / Mutation Compliance',
      category: 'Ownership',
      activeStatus: 'Verified',
      activeLabel: '✓ Verified',
      verifiedStatus: 'Pending',
      description: 'Pahani / RTC mutation extract reflects unambiguous vendor ownership',
      verificationNote: 'Revenue RTC / Mutation Compliance (Verified)',
      isCustomItem: false
    },
    {
      id: 'mccPlanApprovals',
      key: 'mccPlanApprovals',
      documentName: 'MCC / Local Body Plan Approvals',
      category: 'Municipal',
      activeStatus: 'Compliant',
      activeLabel: '✓ Compliant',
      verifiedStatus: 'Pending',
      description: 'Mangaluru City Corporation sanctioned blueprint and occupancy certificate',
      verificationNote: 'MCC / Local Body Plan Approvals (Compliant)',
      isCustomItem: false
    },
    {
      id: 'dgpsSurveyVerification',
      key: 'dgpsSurveyVerification',
      documentName: 'Physical Boundary DGPS Survey',
      category: 'Ownership',
      activeStatus: 'Cleared',
      activeLabel: '✓ Cleared',
      verifiedStatus: 'Pending',
      description: 'Field Measurement Book (FMB) coordinates match physical compound boundary',
      verificationNote: 'Physical Boundary DGPS Survey (Cleared)',
      isCustomItem: false
    }
  ]);

  const handleUpdateLegalStatus = (index, newStatus) => {
    setLegalChecklist(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], verifiedStatus: newStatus };
      return updated;
    });
  };

  const handleUpdateLegalNote = (index, newNote) => {
    setLegalChecklist(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], verificationNote: newNote };
      return updated;
    });
  };

  const handleDeleteLegalItem = (index) => {
    setLegalChecklist(prev => prev.filter((_, i) => i !== index));
  };

  const [advocateVerificationAvailable, setAdvocateVerificationAvailable] = useState(false);

  // Investment Analysis
  const [investmentAnalysis, setInvestmentAnalysis] = useState({
    rentalYieldEst: '',
    resaleAppreciationEst: '',
    localityGrowthDriver: ''
  });

  // =========================================================================
  // CUSTOM MODAL DIALOG STATES (Replacing native browser window.prompt dialogs)
  // =========================================================================
  const [modalType, setModalType] = useState(null); // 'ADD_CATEGORY' | 'ADD_FEATURE' | 'ADD_LEGAL_CHECK'
  const [modalTargetCategory, setModalTargetCategory] = useState('');

  // Category Modal Form State
  const [categoryModalData, setCategoryModalData] = useState({
    categoryName: '',
    initialFeatureName: '',
    initialFeatureNote: '',
    isIncluded: true
  });

  // Feature Modal Form State
  const [featureModalData, setFeatureModalData] = useState({
    featureName: '',
    descriptionNote: '',
    isAvailable: true
  });

  // Legal Check Modal Form State
  const [legalModalData, setLegalModalData] = useState({
    documentName: '',
    verifiedStatus: 'Pending Audit',
    verificationNote: ''
  });

  // Open Handlers
  const handleOpenAddCategory = () => {
    setCategoryModalData({
      categoryName: '',
      initialFeatureName: '',
      initialFeatureNote: '',
      isIncluded: true
    });
    setModalType('ADD_CATEGORY');
  };

  const handleOpenAddFeature = (catName) => {
    setModalTargetCategory(catName || 'General');
    setFeatureModalData({
      featureName: '',
      descriptionNote: '',
      isAvailable: true
    });
    setModalType('ADD_FEATURE');
  };

  const handleOpenAddLegalCheck = () => {
    setLegalModalData({
      documentName: '',
      verifiedStatus: 'Pending Audit',
      verificationNote: ''
    });
    setModalType('ADD_LEGAL_CHECK');
  };

  // Submit Handlers for Custom Modals
  const handleConfirmAddCategory = () => {
    const catName = categoryModalData.categoryName.trim();
    if (!catName) {
      alert('Please enter a category name.');
      return;
    }
    if (!customCategories.includes(catName)) {
      setCustomCategories(prev => [...prev, catName]);
    }
    if (categoryModalData.initialFeatureName.trim()) {
      setComponentsMatrix(prev => [
        ...prev,
        {
          categoryName: catName,
          featureName: categoryModalData.initialFeatureName.trim(),
          isAvailable: Boolean(categoryModalData.isIncluded),
          status: categoryModalData.isIncluded ? 'Included' : 'Not Included',
          descriptionNote: (categoryModalData.initialFeatureNote || '').trim()
        }
      ]);
    }
    setModalType(null);
  };

  const handleConfirmAddFeature = () => {
    const featName = featureModalData.featureName.trim();
    if (!featName) {
      alert('Please enter a feature name / title.');
      return;
    }
    setComponentsMatrix(prev => [
      ...prev,
      {
        categoryName: modalTargetCategory || 'General',
        featureName: featName,
        isAvailable: Boolean(featureModalData.isAvailable),
        status: featureModalData.isAvailable ? 'Included' : 'Not Included',
        descriptionNote: (featureModalData.descriptionNote || '').trim()
      }
    ]);
    setModalType(null);
  };

  const handleConfirmAddLegalCheck = () => {
    const docName = legalModalData.documentName.trim();
    if (!docName) {
      alert('Please enter statutory clearance or document title.');
      return;
    }
    const newItem = {
      id: `custom-legal-${Date.now()}`,
      key: `custom-legal-${Date.now()}`,
      documentName: docName,
      category: 'Custom Clearance',
      activeStatus: 'Verified',
      activeLabel: '✓ Verified',
      verifiedStatus: legalModalData.verifiedStatus || 'Pending Audit',
      description: (legalModalData.verificationNote || '').trim() || 'Audited statutory clearance on record',
      verificationNote: (legalModalData.verificationNote || '').trim() || 'Audited clearance on record',
      isCustomItem: true
    };
    setLegalChecklist(prev => [...prev, newItem]);
    setModalType(null);
  };

  const handlePublishSubmit = async (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }

    // STRICT WIZARD GUARD: Prevent premature submission from Step 1, 2, or 3
    // Accidental form submission (e.g. Enter key pressed) moves forward instead of submitting
    if (formStep < 4) {
      setFormStep(prev => Math.min(prev + 1, 4));
      return;
    }

    if (!title || !title.trim()) {
      alert('Please enter a property title.');
      setFormStep(1);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const isLand = (assetCategory === 'Plot / Land' || assetCategory === 'Plot');
    const rawPriceNum = Number(price) || parseInt(String(price || '').replace(/[^0-9]/g, ''), 10) || 0;
    const formatDisplayPrice = (val) => {
      if (!val) return 'Price on Request';
      if (val >= 10000000) return `₹${(val / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
      if (val >= 100000) return `₹${(val / 100000).toFixed(1).replace(/\.0$/, '')} Lakhs`;
      return `₹${val.toLocaleString('en-IN')}`;
    };

    const parsedLocality = locationName ? locationName.split(',')[0].trim() : 'Central';
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.random().toString(36).substring(2, 7);

    const legalVerification = legalChecklist.map(item => ({
      documentName: item.documentName,
      category: item.category || 'Ownership',
      verifiedStatus: (item.verifiedStatus === 'Cleared' || item.verifiedStatus === 'Nil EC verified' || item.verifiedStatus === 'Compliant' || item.verifiedStatus === 'Verified') ? 'Verified' : (item.verifiedStatus === 'Not Applicable' ? 'Not Applicable' : 'Pending'),
      verificationNote: item.verificationNote || '',
      isCustomItem: Boolean(item.isCustomItem)
    }));

    const advocateAuditPayload = {
      parentDeedAudit: legalChecklist.find(i => i.id === 'parentDeedAudit')?.verifiedStatus === 'Cleared' || legalChecklist.find(i => i.id === 'parentDeedAudit')?.verifiedStatus === 'Verified' ? 'Cleared' : 'Pending',
      encumbranceCertificate: legalChecklist.find(i => i.id === 'encumbranceCertificate')?.verifiedStatus === 'Nil EC verified' || legalChecklist.find(i => i.id === 'encumbranceCertificate')?.verifiedStatus === 'Verified' || legalChecklist.find(i => i.id === 'encumbranceCertificate')?.verifiedStatus === 'Cleared' ? 'Nil EC verified' : 'Pending',
      revenueRtcCompliance: legalChecklist.find(i => i.id === 'revenueRtcCompliance')?.verifiedStatus === 'Verified' || legalChecklist.find(i => i.id === 'revenueRtcCompliance')?.verifiedStatus === 'Cleared' ? 'Verified' : 'Pending',
      mccPlanApprovals: legalChecklist.find(i => i.id === 'mccPlanApprovals')?.verifiedStatus === 'Compliant' || legalChecklist.find(i => i.id === 'mccPlanApprovals')?.verifiedStatus === 'Verified' || legalChecklist.find(i => i.id === 'mccPlanApprovals')?.verifiedStatus === 'Cleared' ? 'Compliant' : 'Pending',
      dgpsSurveyVerification: legalChecklist.find(i => i.id === 'dgpsSurveyVerification')?.verifiedStatus === 'Cleared' || legalChecklist.find(i => i.id === 'dgpsSurveyVerification')?.verifiedStatus === 'Verified' ? 'Cleared' : 'Pending'
    };

    const formData = {
      // Direct Top-Level Keys matching Mongoose schema in server/models/Property.js
      title: title.trim(),
      price: price || formatDisplayPrice(rawPriceNum),
      priceRaw: rawPriceNum,
      category: isLand ? 'Land/Plot' : assetCategory,
      locality: parsedLocality,
      carpetArea: superArea || '',
      heroVideoUrl: videoUrl || '',
      videoUrl: videoUrl || '',
      slug: generatedSlug,
      city: 'Mangaluru',
      dealType: 'Resale',
      pricing: {
        expectedPrice: rawPriceNum,
        isNegotiable: Boolean(isNegotiable),
        maintenanceFee: Number(maintenanceFee) || 0
      },
      specs: {
        bedrooms: isLand ? 0 : Number(bedrooms),
        bathrooms: isLand ? 0 : Number(bathrooms),
        carpetAreaSqFt: parseInt(String(superArea || '').replace(/[^0-9]/g, ''), 10) || 0,
        furnishingStatus: isLand ? 'Unfurnished' : 'Unfurnished',
        floorLevel: 'G',
        totalFloors: '1'
      },
      youtubeVideoId: videoUrl?.includes('v=') ? videoUrl.split('v=')[1]?.substring(0, 11) : (videoUrl?.includes('youtu.be/') ? videoUrl.split('youtu.be/')[1]?.substring(0, 11) : ''),
      galleryImages: uploadedFiles.filter(f => f.type === 'image').map(f => f.name),
      description: description || '',
      componentsMatrix: [
        ...componentsMatrix.map(item => ({
          categoryName: item.categoryName || 'General',
          featureName: item.featureName,
          isAvailable: Boolean(item.isAvailable),
          status: item.isAvailable ? 'Included' : 'Not Included',
          descriptionNote: item.descriptionNote || ''
        })),
        ...inventory.map(item => ({
          categoryName: 'Structural Specifications',
          featureName: item.label,
          isAvailable: Boolean(item.isAvailable),
          status: item.isAvailable ? 'Included' : 'Not Included',
          descriptionNote: item.value
        }))
      ],
      transitMatrix: transitMatrix.map(t => ({
        landmarkName: t.landmarkName || t.destination || '',
        destination: t.destination || t.landmarkName || '',
        distanceText: t.distanceText || '',
        distanceKm: parseFloat(t.distanceText) || 0,
        durationText: t.durationText || '',
        travelTimeMins: parseInt(t.durationText, 10) || 0,
        travelMode: t.travelMode || 'Drive',
        transportMode: t.travelMode || 'Drive'
      })),
      advocateAudit: advocateAuditPayload,
      legalChecklist,
      legalVerification,
      investmentAnalysis,
      advocateVerificationAvailable: Boolean(advocateVerificationAvailable),
      isFeatured: Boolean(isFeatured),
      status: 'Active',
      location: locationName || `${parsedLocality}, Mangaluru`,
      type: isLand ? 'Plot' : assetCategory,
      beds: isLand ? 0 : Number(bedrooms),
      baths: isLand ? 0 : Number(bathrooms),
      area: superArea,
      badge: featuredBadge || 'Verified Listing',
      legalStatus: 'Clear Title / RERA Verified',
      highlights: [
        "Advocate Audited Clear Title",
        "Complete Property Inspections",
        "Mangaluru Verified Listing"
      ]
    };

    const apiUrl = API_ENDPOINTS.properties || 'http://localhost:5000/api/properties';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.status === 201 || response.ok) {
        const result = await response.json().catch(() => null);
        const savedDoc = result?.data || formData;

        if (onSaveProperty) {
          onSaveProperty(savedDoc);
        }

        // Automated state refresh / cache invalidation for property inventory
        window.dispatchEvent(new CustomEvent('grabmykey_property_created', { detail: savedDoc }));
        window.dispatchEvent(new CustomEvent('grabmykey_properties_updated'));

        // On HTTP 201 success, navigate to /manage-345 so the new listing immediately populates in the database inventory count
        navigate('/manage-345');
        return;
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Server responded with status ${response.status}`);
      }
    } catch (err) {
      console.error('Failed to post property listing to backend:', err);
      const isServerOffline = !err.response && (
        err.name === 'TypeError' ||
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('NetworkError') ||
        err.message?.includes('ECONNREFUSED') ||
        err.message?.includes('connection refused')
      );

      if (isServerOffline) {
        const offlineMsg = "Backend server is offline. Please start Node server on port 5000.";
        setSubmitError(offlineMsg);
        alert(offlineMsg);
      } else {
        setSubmitError(err.message || 'Failed to submit listing. Please try again.');
        alert(`Submission error: ${err.message || 'Could not connect to backend server'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Aliases for handleSubmit and handlePublish
  const handleSubmit = handlePublishSubmit;
  const handlePublish = handlePublishSubmit;

  return (
    <div className="min-h-screen w-full bg-[#FAF8F5] flex flex-col justify-between font-sans antialiased text-[#0a1d37]">
      <div className="w-full flex flex-col flex-1">
        {/* 1. TOP EXECUTIVE PORTAL BAR (FULL-BLEED 100% VIEWPORT) */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-xs sticky top-0 z-20">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Logo & Portal Branding */}
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm p-1.5 flex items-center justify-center overflow-hidden">
                    <img 
                      src="/logo.png" 
                      alt="GrabMyKey" 
                      className="w-full h-full object-contain" 
                      onError={(e) => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'block'; }}
                    />
                    <span style={{ display: 'none' }} className="text-[10px] font-bold font-serif text-[#0a1d37]">GMK</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-serif font-bold text-[#0a1d37] text-lg tracking-wide">
                        GRABMYKEY EXECUTIVE PORTAL
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-[#b8860b] border border-amber-200 font-bold uppercase tracking-wider">
                        SUITE 1.0
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block tracking-wider uppercase font-semibold">
                      GrabMyKey • Luxury Real Estate Governance & Title Audit
                    </span>
                  </div>
                </div>

                {/* System Connectivity & Exit Admin Button */}
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-mono uppercase tracking-wider">LIVE SYSTEM</span>
                  </div>

                  <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#f8f6f0] border border-slate-200 text-slate-700 text-xs font-medium">
                    <Database className="w-3.5 h-3.5 text-[#b8860b]" />
                    <span className="font-mono text-[11px]">Local Sandbox</span>
                  </div>

                  <div className="text-slate-500 text-xs font-mono hidden lg:block">
                    {currentTime}
                  </div>

                  <button
                    type="button"
                    onClick={onExit || (() => {
                      localStorage.removeItem('adminToken');
                      navigate('/');
                    })}
                    className="bg-[#0a1d37] text-white hover:bg-[#061426] px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>EXIT ADMIN MODE</span>
                  </button>
                </div>

              </div>
            </header>

            {/* 2. PRIMARY TAB ROW */}
            <div className="bg-white border-b border-slate-200 px-6">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <nav className="flex space-x-2 text-xs font-semibold overflow-x-auto">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="py-3.5 px-4 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Executive Analytics
                  </button>
                  <button
                    type="button"
                    className="py-3.5 px-4 border-b-2 border-[#0a1d37] text-[#0a1d37] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5"
                  >
                    <span>Property Inventory (CRUD)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f8f6f0] text-[#b8860b] font-mono font-bold border border-amber-200">
                      Active
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="py-3.5 px-4 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Owner Lead Queue
                  </button>
                </nav>

                <div className="hidden sm:flex items-center space-x-2">
                  <span className="text-xs font-mono text-slate-400">
                    Route: <span className="text-[#b8860b] font-semibold">/manage-345/publish-listing</span>
                  </span>
                </div>
              </div>
            </div>

            {/* 3. MAIN CONTENT CANVAS (EXECUTIVE LIGHT THEME BG-[#F7F5F0]) */}
            <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-6">
              
              {/* PAGE HEADER WITH BACK BUTTON & SUITE TAG */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-[#0a1d37] transition-colors bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-2xs hover:bg-slate-50 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>← Back to Inventory</span>
                    </button>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8860b] font-bold">
                      EXECUTIVE MANAGEMENT SUITE
                    </span>
                  </div>
                  <h1 className="text-3xl font-serif font-bold text-[#0a1d37] tracking-tight">
                    Publish New Luxury Property Listing
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Configure asset specifications, walkthrough inspection, and advocate clearance parameters.
                  </p>
                </div>

                <div className="hidden sm:flex items-center space-x-2">
                  <span className="text-xs text-slate-600 font-mono bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs font-medium">
                    Status: Staging / Draft
                  </span>
                </div>
              </div>

              {/* FORM CONTAINER CARD (#FFFFFF CRISP WHITE) */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
                
                {/* HORIZONTAL STEP NAVIGATION TABS */}
                <div className="flex border-b border-slate-200 mb-8 text-xs font-semibold overflow-x-auto">
                  {[
                    { step: 1, label: '1. General Details' },
                    { step: 2, label: '2. Media & Links' },
                    { step: 3, label: '3. Feature Matrix & Transit' },
                    { step: 4, label: '4. Legal Audit & Investment' }
                  ].map(s => (
                    <button
                      key={s.step}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFormStep(s.step);
                      }}
                      className={`py-3 px-5 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                        (formStep === s.step || currentStep === s.step)
                          ? 'border-[#b8860b] text-[#0a1d37] font-bold bg-[#f8f6f0]'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center justify-between">
                      <span>{submitError}</span>
                      <button type="button" onClick={() => setSubmitError('')} className="text-red-500 hover:text-red-800">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  
                  {/* ======================================================== */}
                  {/* STEP 1: GENERAL DETAILS (DYNAMIC FIELD HIDING FOR PLOT) */}
                  {/* ======================================================== */}
                  {(formStep === 1 || currentStep === 1) && (
                    <div className="space-y-5">
                      
                      {/* Property Title */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Property Title *
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Ultra Luxury Seafront Villa"
                          value={title}
                          onChange={e => setTitle(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:bg-white focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Locality, Asking Price & Monthly Maintenance */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Locality & City *
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="Bejai, Mangaluru"
                            value={locationName}
                            onChange={e => setLocationName(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:bg-white focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Asking Price String *
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="₹2.75 Cr"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:bg-white focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Monthly Maintenance (RWA / Society Fee)
                          </label>
                          <input
                            type="number"
                            placeholder="0"
                            value={maintenanceFee}
                            onChange={e => setMaintenanceFee(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:bg-white focus:outline-none transition-colors"
                          />
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            Enter monthly society/RWA fee. Set to ₹0 if standalone independent property.
                          </span>
                        </div>
                      </div>

                      {/* Asset Category, Super Area, Featured Badge */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Asset Category
                          </label>
                          <select
                            value={assetCategory}
                            onChange={e => setAssetCategory(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-[#C59B27]/60 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-semibold focus:border-[#C59B27] focus:bg-white focus:outline-none"
                          >
                            <option value="Plot / Land">Plot / Land</option>
                            <option value="Villa">Villa</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Estate">Estate</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Super Area
                          </label>
                          <input
                            type="text"
                            placeholder="12,500 sq.ft"
                            value={superArea}
                            onChange={e => setSuperArea(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:bg-white focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Featured Badge
                          </label>
                          <input
                            type="text"
                            placeholder="Exclusive Tour"
                            value={featuredBadge}
                            onChange={e => setFeaturedBadge(e.target.value)}
                            className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* DYNAMIC FIELD HIDING (Plot / Land):
                          When Asset Category is "Plot / Land", Bedrooms & Bathrooms are completely hidden */}
                      {assetCategory !== 'Plot / Land' && assetCategory !== 'Plot' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bedrooms</label>
                            <input
                              type="number"
                              value={bedrooms}
                              onChange={e => setBedrooms(e.target.value)}
                              className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bathrooms</label>
                            <input
                              type="number"
                              value={bathrooms}
                              onChange={e => setBathrooms(e.target.value)}
                              className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* Toggles: Price Negotiation & Featured Listing (Defaults to Unchecked / false) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label className="flex items-center space-x-2.5 p-3.5 bg-[#FAF8F5] border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={isNegotiable}
                            onChange={e => setIsNegotiable(e.target.checked)}
                            className="w-4 h-4 text-[#b8860b] rounded border-slate-300 focus:ring-[#b8860b]"
                          />
                          <span className="text-xs font-semibold text-slate-700">
                            Price is Negotiable upon Inspection
                          </span>
                        </label>

                        <label className="flex items-center space-x-2.5 p-3.5 bg-[#FAF8F5] border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={isFeatured}
                            onChange={e => setIsFeatured(e.target.checked)}
                            className="w-4 h-4 text-[#b8860b] rounded border-slate-300 focus:ring-[#b8860b]"
                          />
                          <span className="text-xs font-semibold text-slate-700">
                            Pin as Featured Showcase Property
                          </span>
                        </label>
                      </div>

                      {/* Architectural Overview: Dynamically shifts up seamlessly */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Architectural Overview {assetCategory === 'Plot / Land' && '• Land Specifications'}
                        </label>
                        <textarea
                          rows={4}
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                          placeholder="Executive luxury estate with private landscaped grounds and panoramic coastal vistas."
                          className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:bg-white focus:outline-none"
                        />
                      </div>

                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* STEP 2: MEDIA & LINKS (YOUTUBE INTEGRATION + LOCAL FILES) */}
                  {/* ======================================================== */}
                  {(formStep === 2 || currentStep === 2) && (
                    <div className="space-y-6">
                      
                      {/* YouTube Walkthrough URL with "Select from YouTube Channel" button */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                          <label className="block text-xs font-semibold text-slate-700">
                            YouTube Walkthrough URL
                          </label>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowYoutubePicker(!showYoutubePicker);
                            }}
                            className="inline-flex items-center space-x-1.5 bg-[#0F1E36] hover:bg-[#081220] text-white border border-[#C59B27]/40 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                            <span>Select from YouTube Channel</span>
                          </button>
                        </div>

                        <input
                          type="text"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={videoUrl}
                          onChange={e => setVideoUrl(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:border-[#C59B27] focus:bg-white focus:outline-none"
                        />
                        <span className="text-[10px] text-slate-500 block mt-1">
                          Platform automatically disables autoplay (autoplay=0) to respect luxury user experience.
                        </span>

                        {/* Inline YouTube Channel Video Picker Gallery */}
                        {showYoutubePicker && (
                          <div className="mt-3 p-4 bg-[#FAF8F5] border border-slate-200 rounded-2xl space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-sans font-bold text-[#0F1E36] uppercase tracking-wider">
                                Official YouTube Channel Walkthroughs
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                API Source: youtube/v3/search • @GrabMyKeyLuxury
                              </span>
                            </div>

                            {channelVideos.length === 0 ? (
                              <p className="text-xs text-slate-500 py-3 text-center">
                                No pre-loaded channel walkthroughs. Paste a direct YouTube link above.
                              </p>
                            ) : (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                {channelVideos.map(vid => (
                                  <div
                                    key={vid.id}
                                    onClick={() => {
                                      setVideoUrl(vid.url);
                                      setShowYoutubePicker(false);
                                    }}
                                    className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-[#C59B27] hover:shadow-md cursor-pointer transition-all"
                                  >
                                    <div className="h-24 relative overflow-hidden bg-slate-900">
                                      <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                      <span className="absolute bottom-1 right-1 bg-black/80 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                                        {vid.duration}
                                      </span>
                                    </div>
                                    <div className="p-2.5">
                                      <p className="text-[11px] font-semibold text-[#0F1E36] group-hover:text-[#C59B27] line-clamp-1">
                                        {vid.title}
                                      </p>
                                      <span className="text-[10px] text-slate-400 block mt-0.5">Click to Select</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* LOCAL FILE UPLOADS: image/*, .pdf */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          High-Resolution Photography & Document Attachments
                        </label>
                        
                        <div className="border-2 border-dashed border-slate-300 hover:border-[#C59B27] rounded-2xl p-6 text-center bg-[#FAF8F5] transition-all group">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-amber-50 text-[#C59B27] border border-amber-200 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                            <Upload className="w-6 h-6" />
                          </div>
                          <h5 className="text-xs font-bold text-[#0F1E36] mb-1">
                            Upload Local Files (.jpg, .png, .pdf)
                          </h5>
                          <p className="text-[11px] text-slate-500 mb-4 max-w-sm mx-auto">
                            Drag and drop local asset photos or legal deed PDFs directly, or browse files from your disk.
                          </p>
                          <label className="inline-flex items-center space-x-2 bg-[#0F1E36] hover:bg-[#081220] text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer shadow-sm transition-all">
                            <Upload className="w-3.5 h-3.5 text-[#e6ca65]" />
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

                        {/* Uploaded File Chips */}
                        {uploadedFiles.length > 0 && (
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            {uploadedFiles.map((file, idx) => (
                              <div key={idx} className="flex items-center space-x-2 p-2.5 bg-white border border-slate-200 rounded-xl text-xs shadow-2xs">
                                <FileText className="w-4 h-4 text-[#C59B27] shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <span className="truncate block text-slate-800 font-medium text-[11px]">{file.name}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">{file.size}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    removeUploadedFile(idx);
                                  }}
                                  className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 shrink-0 cursor-pointer"
                                  title="Remove attachment"
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

                  {/* ======================================================== */}
                  {/* STEP 3: FEATURE MATRIX & TRANSIT                         */}
                  {/* ======================================================== */}
                  {(formStep === 3 || currentStep === 3) && (
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
                              onClick={handleOpenAddCategory}
                              className="inline-flex items-center space-x-1.5 text-xs font-bold text-white bg-[#0F1E36] hover:bg-[#081220] px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm border border-[#C59B27]/40"
                            >
                              <PlusCircle className="w-3.5 h-3.5 text-[#e6ca65]" />
                              <span>+ Add Category</span>
                            </button>
                            <span className="text-xs font-mono text-[#0a1d37] bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 font-bold">
                              {componentsMatrix.length} Features
                            </span>
                          </div>
                        </div>

                        {/* Render items dynamically grouped by category */}
                        {(() => {
                          const allCats = Array.from(new Set([
                            ...componentsMatrix.map(p => p.categoryName || p.category).filter(Boolean),
                            ...customCategories
                          ]));

                          return allCats.map(catName => {
                            const itemsInCat = componentsMatrix
                              .map((item, originalIdx) => ({ ...item, originalIdx }))
                              .filter(item => (item.categoryName || item.category) === catName);

                            return (
                              <div key={catName} className="bg-[#fbf9f5] border border-slate-200 rounded-2xl p-4 space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#0a1d37]">
                                      {catName}
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full font-semibold">
                                      {itemsInCat.length}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenAddFeature(catName)}
                                    className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#b8860b] hover:text-[#0a1d37] bg-white border border-amber-300/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-2xs"
                                  >
                                    <PlusCircle className="w-3 h-3 text-[#b8860b]" />
                                    <span>+ Add Feature</span>
                                  </button>
                                </div>

                                <div className="space-y-2.5">
                                  {itemsInCat.length === 0 ? (
                                    <p className="text-[11px] text-slate-400 font-mono py-2 text-center">
                                      No features in this category yet. Click "+ Add Feature" above.
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
                                                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                              }`}
                                            >
                                              <span>{isIncluded ? '✓' : '—'}</span>
                                              <span className="text-[10px] uppercase font-mono">{isIncluded ? 'Included' : 'Not Included'}</span>
                                            </button>
                                            <span className="text-xs font-bold text-[#0a1d37] truncate" title={item.featureName}>
                                              {item.featureName}
                                            </span>
                                          </div>

                                          {/* Feature Description Note Input */}
                                          <div className="w-full sm:flex-1">
                                            <input
                                              type="text"
                                              value={item.descriptionNote || ''}
                                              onChange={e => handleFeatureNoteChange(item.originalIdx, e.target.value)}
                                              placeholder="Optional description / details..."
                                              className="w-full bg-[#FAF8F5] border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:border-[#C59B27] focus:bg-white focus:outline-none transition-colors"
                                            />
                                          </div>

                                          {/* Delete Feature Button */}
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteFeature(item.originalIdx)}
                                            className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
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

                      {/* B. DYNAMIC STRUCTURAL & LAND INVENTORY GRID */}
                      <div className="space-y-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F1E36]">
                              Asset Inventory & Structural Specifications
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              Configure key-value architectural, soil, fencing, and utility parameters.
                            </p>
                          </div>
                          <span className="text-xs font-mono text-[#C59B27] font-semibold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80">
                            {inventory.length} Parameters
                          </span>
                        </div>

                        {/* Key-Value Pair Grid */}
                        <div className="space-y-3">
                          {inventory.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 bg-[#FAF8F5] border border-slate-200 rounded-xl">
                              <div className="w-full sm:w-1/3">
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                  Parameter Name
                                </label>
                                <input
                                  type="text"
                                  value={item.label}
                                  onChange={e => handleInventoryChange(idx, 'label', e.target.value)}
                                  placeholder="e.g. Fencing / Soil Type / Road Width"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:border-[#C59B27] focus:outline-none"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                  Details / Value
                                </label>
                                <input
                                  type="text"
                                  value={item.value}
                                  onChange={e => handleInventoryChange(idx, 'value', e.target.value)}
                                  placeholder="e.g. Barbed Wire Fencing with Concrete Pillars"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-[#C59B27] focus:outline-none"
                                />
                              </div>
                              <div className="flex items-end justify-end sm:pt-4">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveInventory(idx);
                                  }}
                                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Delete Parameter"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Explicit "+ Add Custom Parameter" button in warm gold/navy */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddCustomInventory();
                          }}
                          className="w-full py-3.5 border-2 border-dashed border-[#C59B27]/60 hover:border-[#C59B27] rounded-xl text-xs font-semibold text-[#0F1E36] hover:bg-amber-50/40 flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xs"
                        >
                          <PlusCircle className="w-4 h-4 text-[#C59B27]" />
                          <span>+ Add Custom Parameter</span>
                        </button>
                      </div>

                      {/* C. STRATEGIC TRANSIT & INFRASTRUCTURE SECTION */}
                      <div className="pt-6 border-t border-slate-200 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-[#C59B27]" />
                              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F1E36]">
                                Strategic Transit & Infrastructure
                              </h4>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Key travel connectivity nodes and verified transit durations (Airport, Rail, Highway, City Center).
                            </p>
                          </div>
                          <span className="text-xs font-mono text-[#C59B27] font-semibold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80">
                            {transitMatrix.length} Nodes
                          </span>
                        </div>

                        <div className="space-y-3">
                          {transitMatrix.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 bg-[#FAF8F5] border border-slate-200 rounded-xl">
                              <div className="w-full sm:w-1/2">
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                  Landmark / Connectivity Destination
                                </label>
                                <input
                                  type="text"
                                  value={item.landmarkName}
                                  onChange={e => handleUpdateTransit(idx, 'landmarkName', e.target.value)}
                                  placeholder="e.g. Mangaluru International Airport (IXE)"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:border-[#C59B27] focus:outline-none"
                                />
                              </div>
                              <div className="w-full sm:w-1/4">
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                  Distance
                                </label>
                                <input
                                  type="text"
                                  value={item.distanceText}
                                  onChange={e => handleUpdateTransit(idx, 'distanceText', e.target.value)}
                                  placeholder="e.g. 14.2 km"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-[#C59B27] focus:outline-none"
                                />
                              </div>
                              <div className="w-full sm:w-1/4">
                                <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                  Duration
                                </label>
                                <input
                                  type="text"
                                  value={item.durationText}
                                  onChange={e => handleUpdateTransit(idx, 'durationText', e.target.value)}
                                  placeholder="e.g. 20m"
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-[#C59B27] focus:outline-none"
                                />
                              </div>
                              <div className="flex items-end justify-end sm:pt-4">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveTransitItem(idx);
                                  }}
                                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Remove Transit Node"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddTransitItem();
                          }}
                          className="w-full py-3 border-2 border-dashed border-[#C59B27]/60 hover:border-[#C59B27] rounded-xl text-xs font-semibold text-[#0F1E36] hover:bg-amber-50/40 flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xs"
                        >
                          <PlusCircle className="w-4 h-4 text-[#C59B27]" />
                          <span>+ Add Transit Landmark</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* STEP 4: LEGAL AUDIT & DUE DILIGENCE CHECKLIST SECTION    */}
                  {/* ======================================================== */}
                  {(formStep === 4 || currentStep === 4) && (
                    <div className="space-y-6">
                      {/* Statutory Due Diligence Header Card with "+ Add Custom Legal Check" */}
                      <div className="p-4 bg-gradient-to-r from-amber-50 to-[#fdfbf7] border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#b8860b] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0a1d37]">
                              Statutory Legal Verification Checklist
                            </h4>
                            <p className="text-xs text-slate-600 mt-0.5">
                              Audit statutory title documents and clearance parameters with standard verification toggles. All items default to Pending until verified.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            type="button"
                            onClick={handleOpenAddLegalCheck}
                            className="bg-white hover:bg-slate-50 text-[#0a1d37] border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center space-x-1.5"
                          >
                            <PlusCircle className="w-3.5 h-3.5 text-[#b8860b]" />
                            <span>+ Add Custom Legal Check</span>
                          </button>
                        </div>
                      </div>

                      {/* List of Legal Audit & Custom Clearance Items */}
                      <div className="space-y-3">
                        {legalChecklist.map((item, idx) => {
                          const isPassed = item.verifiedStatus === 'Cleared' || 
                            item.verifiedStatus === 'Nil EC verified' || 
                            item.verifiedStatus === 'Compliant' || 
                            item.verifiedStatus === 'Verified';

                          return (
                            <div
                              key={item.id || idx}
                              className="p-4 bg-[#FAF8F5] border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                            >
                              <div className="space-y-0.5 flex-1 min-w-0 pr-3">
                                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                  <span className="font-mono text-[11px] text-slate-400 font-semibold">{idx + 1}.</span>
                                  <span className="text-xs font-bold text-[#0a1d37]">{item.documentName}</span>
                                  {item.isCustomItem && (
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-[#b8860b] border border-amber-200 font-bold">
                                      Custom Clearance
                                    </span>
                                  )}
                                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                                    isPassed
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                      : item.verifiedStatus === 'Not Applicable'
                                        ? 'bg-slate-100 text-slate-500 border-slate-200'
                                        : 'bg-slate-100 text-slate-600 border-slate-200'
                                  }`}>
                                    {isPassed ? (item.activeLabel || '✓ Verified') : item.verifiedStatus === 'Not Applicable' ? '— Not Applicable' : '⏳ Pending'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 pl-4">{item.description || item.verificationNote}</p>
                              </div>

                              <div className="flex items-center space-x-2 pl-4 sm:pl-0 shrink-0">
                                {!item.isCustomItem ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleUpdateLegalStatus(idx, 'Pending');
                                      }}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                                        !isPassed
                                          ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                      }`}
                                    >
                                      Pending
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleUpdateLegalStatus(idx, item.activeStatus || 'Cleared');
                                      }}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                                        isPassed
                                          ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                                          : 'bg-white text-emerald-700 border-slate-200 hover:bg-emerald-50'
                                      }`}
                                    >
                                      {item.activeLabel || '✓ Cleared'}
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <select
                                      value={item.verifiedStatus}
                                      onChange={(e) => handleUpdateLegalStatus(idx, e.target.value)}
                                      className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#0a1d37] focus:border-[#C59B27] focus:outline-none cursor-pointer"
                                    >
                                      <option value="Verified">✓ Verified</option>
                                      <option value="Pending Audit">⏳ Pending Audit</option>
                                      <option value="Not Applicable">— Not Applicable</option>
                                    </select>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteLegalItem(idx)}
                                      className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                      title="Delete Clearance"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Advocate Verification Available Bridge Toggle */}
                      <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-[#0a1d37] block">
                            Advocate Legal Search Report / Bank Loan Bridge
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Enable advocate title search report badge on property details page for bank loan facilitation.
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={advocateVerificationAvailable}
                            onChange={e => setAdvocateVerificationAvailable(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      {/* Investment Analysis Matrix */}
                      <div className="p-4 bg-[#FAF8F5] border border-slate-200 rounded-xl space-y-3">
                        <span className="text-xs font-bold text-[#0a1d37] uppercase tracking-wider block">
                          Investment Metrics & Locality Growth Analysis
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <label className="block text-slate-600 font-semibold mb-1">Rental Yield Est. (%)</label>
                            <input
                              type="text"
                              placeholder="e.g. 5.8% Gross"
                              value={investmentAnalysis.rentalYieldEst}
                              onChange={e => setInvestmentAnalysis({ ...investmentAnalysis, rentalYieldEst: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-[#C59B27] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 font-semibold mb-1">Resale Appreciation Est. (%)</label>
                            <input
                              type="text"
                              placeholder="e.g. 12.4% Annualized"
                              value={investmentAnalysis.resaleAppreciationEst}
                              onChange={e => setInvestmentAnalysis({ ...investmentAnalysis, resaleAppreciationEst: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-[#C59B27] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 font-semibold mb-1">Locality Growth Driver</label>
                            <input
                              type="text"
                              placeholder="e.g. High Street Expansion & Port Link"
                              value={investmentAnalysis.localityGrowthDriver}
                              onChange={e => setInvestmentAnalysis({ ...investmentAnalysis, localityGrowthDriver: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:border-[#C59B27] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BOTTOM ACTION BAR */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-6">
                    <div>
                      {formStep > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setFormStep(prev => Math.max(prev - 1, 1));
                          }}
                          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          ← Previous Step
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleBack();
                        }}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
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
                          className="bg-[#0F1E36] hover:bg-[#081220] text-white px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center space-x-1.5"
                        >
                          <span>NEXT STEP</span>
                          <span>→</span>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          onClick={handlePublish}
                          disabled={isSubmitting}
                          className="bg-[#0F1E36] hover:bg-[#081220] text-white border border-[#C59B27]/40 font-semibold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center space-x-1.5 cursor-pointer transition-all disabled:opacity-60"
                        >
                          {isSubmitting ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 text-[#e6ca65] animate-spin" />
                              <span>Publishing...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#e6ca65]" />
                              <span>Publish Live to Catalog</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                </form>

              </div>

        </main>
      </div>

      {/* CLEAN FOOTER */}
      <footer className="w-full bg-white border-t border-slate-200 px-6 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-[#0F1E36]">GRABMYKEY</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">Executive Management Suite</span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">Route: /manage-345/publish-listing</span>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* REUSABLE CUSTOM MODAL DIALOGS (Zero Native Browser prompt() Dialogs)      */}
      {/* ========================================================================= */}

      {/* 1. Modal: Add Specification Category */}
      <AddCustomItemModal
        isOpen={modalType === 'ADD_CATEGORY'}
        onClose={() => setModalType(null)}
        title="Create Specification Category"
        subtitle="Add a brand-new feature grouping (e.g. 'Security & Smart Home', 'Eco & Sustainability')"
        onSubmit={handleConfirmAddCategory}
        submitLabel="Create Category"
      >
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
            Category Name *
          </label>
          <input
            required
            type="text"
            placeholder="e.g. Security & Smart Home"
            value={categoryModalData.categoryName}
            onChange={e => setCategoryModalData({ ...categoryModalData, categoryName: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none transition-colors"
            autoFocus
          />
        </div>

        <div className="pt-2 border-t border-slate-200/80 space-y-3">
          <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Initial Feature (Optional)
          </span>
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Feature Name</label>
            <input
              type="text"
              placeholder="e.g. Biometric Smart Ingress Lock"
              value={categoryModalData.initialFeatureName}
              onChange={e => setCategoryModalData({ ...categoryModalData, initialFeatureName: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">Details / Specification Note</label>
            <input
              type="text"
              placeholder="e.g. Fingerprint + RFID + Mobile App Unlock"
              value={categoryModalData.initialFeatureNote}
              onChange={e => setCategoryModalData({ ...categoryModalData, initialFeatureNote: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
            />
          </div>
          <label className="flex items-center space-x-2.5 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={categoryModalData.isIncluded}
              onChange={e => setCategoryModalData({ ...categoryModalData, isIncluded: e.target.checked })}
              className="w-4 h-4 text-[#C59B27] rounded border-slate-300 focus:ring-[#C59B27]"
            />
            <span className="text-xs font-medium text-slate-700">Mark feature as Included (✓)</span>
          </label>
        </div>
      </AddCustomItemModal>

      {/* 2. Modal: Add Feature to Category */}
      <AddCustomItemModal
        isOpen={modalType === 'ADD_FEATURE'}
        onClose={() => setModalType(null)}
        title={`Add Feature to ${modalTargetCategory || 'Category'}`}
        subtitle="Configure custom architectural, fixture, or amenity specification."
        onSubmit={handleConfirmAddFeature}
        submitLabel="Add Feature"
      >
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
            Feature Name / Title *
          </label>
          <input
            required
            type="text"
            placeholder="e.g. Modular Chimney & Hob"
            value={featureModalData.featureName}
            onChange={e => setFeatureModalData({ ...featureModalData, featureName: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none transition-colors"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
            Details / Value / Note
          </label>
          <input
            type="text"
            placeholder="e.g. Faber 1200 m3/hr suction with auto-clean"
            value={featureModalData.descriptionNote}
            onChange={e => setFeatureModalData({ ...featureModalData, descriptionNote: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
          />
        </div>
        <label className="flex items-center space-x-2.5 pt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={featureModalData.isAvailable}
            onChange={e => setFeatureModalData({ ...featureModalData, isAvailable: e.target.checked })}
            className="w-4 h-4 text-[#C59B27] rounded border-slate-300 focus:ring-[#C59B27]"
          />
          <span className="text-xs font-medium text-slate-700">Mark feature as Included (✓)</span>
        </label>
      </AddCustomItemModal>

      {/* 3. Modal: Add Custom Legal Check */}
      <AddCustomItemModal
        isOpen={modalType === 'ADD_LEGAL_CHECK'}
        onClose={() => setModalType(null)}
        title="Add Custom Statutory Legal Check"
        subtitle="Configure statutory clearance, municipal approval, or environmental NOC document."
        onSubmit={handleConfirmAddLegalCheck}
        submitLabel="Add Legal Check"
      >
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
            Document / Statutory Title *
          </label>
          <input
            required
            type="text"
            placeholder="e.g. Coastal Regulation Zone (CRZ) Clearance"
            value={legalModalData.documentName}
            onChange={e => setLegalModalData({ ...legalModalData, documentName: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none transition-colors"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
            Initial Verification Status
          </label>
          <select
            value={legalModalData.verifiedStatus}
            onChange={e => setLegalModalData({ ...legalModalData, verifiedStatus: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none cursor-pointer"
          >
            <option value="Verified">✓ Verified</option>
            <option value="Pending Audit">⏳ Pending Audit</option>
            <option value="Not Applicable">— Not Applicable</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#1A1A1A] mb-1.5">
            Manual Audit Note / Reference Details
          </label>
          <input
            type="text"
            placeholder="e.g. MCZMA notification No. 2021/CRZ-II cleared on record"
            value={legalModalData.verificationNote}
            onChange={e => setLegalModalData({ ...legalModalData, verificationNote: e.target.value })}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-[#1A1A1A] focus:border-[#C59B27] focus:outline-none"
          />
        </div>
      </AddCustomItemModal>

    </div>
  );
}
