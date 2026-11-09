import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, RotateCw, ShieldCheck, Database,
  LogOut, PlusCircle, Trash2, Video, Upload, FileText,
  X, Check, Lock, ChevronRight, Layers, FileCheck, CheckCircle2,
  Maximize2, Minus, ExternalLink, Play
} from 'lucide-react';

export default function PublishListingPage({ onExit, onSaveProperty }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation & Browser History Back Handler as required:
  // const handleBack = () => { if (window.history.length > 1) { navigate(-1); } else { navigate('/manage-345'); } };
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

  // Form Step State (1: General Details, 2: Media & Links, 3: Structural Inventory, 4: Advocate Verification)
  const [formStep, setFormStep] = useState(1);

  // Step 1: General Details state with Asset Category initialized to "Plot / Land" as requested
  const [title, setTitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [price, setPrice] = useState('');
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

  // Step 2 & Document File Uploads State
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

  // Step 3: Dynamic Structural & Land Inventory State
  const [inventory, setInventory] = useState([]);

  const handleAddCustomInventory = () => {
    // Provide an explicit "+ Add Custom Inventory Parameter" button: clicking it appends a new row { label: '', value: '' }
    setInventory(prev => [...prev, { label: '', value: '' }]);
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

  // Step 4: Advocate Legal Verification Checklist
  const [legalChecklist, setLegalChecklist] = useState({
    legalMotherDeed: 'cleared',
    legalEC: 'cleared',
    legalRTC: 'cleared',
    legalKhata: 'cleared',
    legalCRZ: 'cleared',
    legalSurvey: 'cleared'
  });

  const handlePublishSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title,
      location: locationName,
      price,
      type: assetCategory,
      area: superArea,
      badge: featuredBadge,
      beds: (assetCategory === 'Plot / Land' || assetCategory === 'Plot') ? 0 : Number(bedrooms),
      baths: (assetCategory === 'Plot / Land' || assetCategory === 'Plot') ? 0 : Number(bathrooms),
      description,
      videoUrl,
      inventory,
      uploadedFiles,
      legalChecklist
    };
    if (onSaveProperty) {
      onSaveProperty(payload);
    }
    // Return to inventory
    handleBack();
  };

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
                    { step: 3, label: '3. Structural Inventory' },
                    { step: 4, label: '4. Advocate Verification' }
                  ].map(s => (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => setFormStep(s.step)}
                      className={`py-3 px-5 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                        formStep === s.step
                          ? 'border-[#b8860b] text-[#0a1d37] font-bold bg-[#f8f6f0]'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <form onSubmit={handlePublishSubmit} className="space-y-6">
                  
                  {/* ======================================================== */}
                  {/* STEP 1: GENERAL DETAILS (DYNAMIC FIELD HIDING FOR PLOT) */}
                  {/* ======================================================== */}
                  {formStep === 1 && (
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

                      {/* Locality & Asking Price */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  {formStep === 2 && (
                    <div className="space-y-6">
                      
                      {/* YouTube Walkthrough URL with "Select from YouTube Channel" button */}
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                          <label className="block text-xs font-semibold text-slate-700">
                            YouTube Walkthrough URL
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowYoutubePicker(!showYoutubePicker)}
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
                                  onClick={() => removeUploadedFile(idx)}
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
                  {/* STEP 3: DYNAMIC STRUCTURAL & LAND INVENTORY GRID */}
                  {/* ======================================================== */}
                  {formStep === 3 && (
                    <div className="space-y-4">
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
                                onClick={() => handleRemoveInventory(idx)}
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
                        onClick={handleAddCustomInventory}
                        className="w-full py-3.5 border-2 border-dashed border-[#C59B27]/60 hover:border-[#C59B27] rounded-xl text-xs font-semibold text-[#0F1E36] hover:bg-amber-50/40 flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-2xs"
                      >
                        <PlusCircle className="w-4 h-4 text-[#C59B27]" />
                        <span>+ Add Custom Parameter</span>
                      </button>
                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* STEP 4: ADVOCATE LEGAL CLEARANCE MATRIX */}
                  {/* ======================================================== */}
                  {formStep === 4 && (
                    <div className="space-y-4">
                      <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl">
                        <span className="text-xs font-bold text-[#C59B27] block mb-1">
                          Advocate Title Due Diligence Verification Matrix:
                        </span>
                        <p className="text-xs text-slate-600">
                          Configure statutory title parameters. Parameters marked 'Not Inspected' remain hidden from public view.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                        {[
                          { key: 'legalMotherDeed', label: '1. 30-Year Mother Deed Chain' },
                          { key: 'legalEC', label: '2. 30-Year Encumbrance Certificate' },
                          { key: 'legalRTC', label: '3. Land Revenue RTC / Mutation' },
                          { key: 'legalKhata', label: '4. Khata Certificate & Building Plan' },
                          { key: 'legalCRZ', label: '5. CRZ / Environmental / RERA' },
                          { key: 'legalSurvey', label: '6. DGPS Physical Boundary Survey' }
                        ].map(param => (
                          <div key={param.key} className="p-3.5 bg-[#FAF8F5] rounded-xl border border-slate-200">
                            <label className="block text-xs font-bold text-[#0F1E36] mb-1.5">{param.label}</label>
                            <select
                              value={legalChecklist[param.key]}
                              onChange={e => setLegalChecklist({ ...legalChecklist, [param.key]: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:border-[#C59B27] focus:outline-none"
                            >
                              <option value="cleared">✓ Verified Clear (Green Checkmark)</option>
                              <option value="risk">✕ Risk Identified (Red Crossmark)</option>
                              <option value="not_inspected">⊘ Not Inspected (Hide from Public View)</option>
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* BOTTOM ACTION BAR */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200 mt-6">
                    <div>
                      {formStep > 1 && (
                        <button
                          type="button"
                          onClick={() => setFormStep(formStep - 1)}
                          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          ← Previous Step
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>

                      {formStep < 4 ? (
                        <button
                          type="button"
                          onClick={() => setFormStep(formStep + 1)}
                          className="bg-[#0F1E36] hover:bg-[#081220] text-white px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center space-x-1.5"
                        >
                          <span>NEXT STEP</span>
                          <span>→</span>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="bg-[#0F1E36] hover:bg-[#081220] text-white border border-[#C59B27]/40 font-semibold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-md flex items-center space-x-1.5 cursor-pointer transition-all"
                        >
                          <Check className="w-3.5 h-3.5 text-[#e6ca65]" />
                          <span>Publish Listing Live</span>
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

    </div>
  );
}
