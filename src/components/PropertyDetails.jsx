import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PropertySpecifications from './PropertySpecifications';
import PropertyImageGallery from './PropertyImageGallery';
import ArchitecturalOverview from './ArchitecturalOverview';
import Footer from './Footer';
import { 
  Video, MapPin, Phone, CheckCircle2, 
  ExternalLink, Layers, Sparkles, FileCheck, ArrowLeft, 
  Calendar, Plane, Car, Train, Footprints,
  GraduationCap, Bed, Bath, Building2
} from 'lucide-react';

// Helper to format YouTube embed URLs without autoplay
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) 
    ? `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0`
    : url;
};

const getYouTubeWatchUrl = (url) => {
  if (!url) return "#";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) 
    ? `https://www.youtube.com/watch?v=${match[2]}`
    : url;
};

// Safe fallback specs generator
const getDefaultSpecs = (prop) => {
  if (!prop) {
    return {
      inventorySpecs: {
        bedrooms: 0,
        bathrooms: 0,
        halls: "N/A",
        garden: "N/A",
        furnishing: "N/A",
        furnitureAppliances: "N/A",
        kitchenType: "N/A",
        parking: "N/A",
        balconies: "N/A",
        flooring: "N/A",
        powerBackup: "N/A",
        waterSupply: "N/A"
      },
      technicalSpecs: {
        roadWidth: "N/A",
        powerBackup: "N/A",
        waterSource: "N/A",
        zoning: "N/A"
      },
      connectivity: [],
      financials: {
        monthlyRental: "N/A",
        rentalYield: "N/A",
        propertyTax: "N/A",
        stampDuty: "N/A",
        appreciation: "N/A"
      }
    };
  }

  const isCommercial = prop?.type === 'Commercial' || prop?.category === 'Commercial';
  const isEstate = prop?.type === 'Estate' || prop?.category === 'Estate';
  const isPlot = prop?.type === 'Plot / Land' || prop?.type === 'Plot' || prop?.category === 'Plot' || prop?.category === 'Land/Plot';
  const priceVal = prop?.priceRaw || prop?.pricing?.expectedPrice || (parseInt((prop?.price || '').replace(/[^0-9]/g, '')) * 100000) || 25000000;
  const stampDutyVal = `8.0% (~₹${(priceVal * 0.08 / 100000).toFixed(1)} Lakhs)`;
  const estRent = `₹${Math.round(priceVal * (isCommercial ? 0.006 : 0.0035)).toLocaleString('en-IN')} / mo`;

  const inventorySpecs = prop?.inventorySpecs || {
    bedrooms: isPlot ? 0 : (prop?.specs?.bedrooms ?? prop?.beds ?? (isCommercial ? 0 : isEstate ? 5 : 4)),
    bathrooms: isPlot ? 0 : (prop?.specs?.bathrooms ?? prop?.baths ?? (isCommercial ? 2 : isEstate ? 6 : 5)),
    halls: isPlot ? "N/A - Plot Asset" : (isCommercial ? "3 (Reception + Workstation Hall + Boardroom)" : "2 (Formal Living + Lounge)"),
    garden: isPlot ? "Open Land Parcel" : (isCommercial ? "No (Terrace Access)" : "Yes (Private Landscaped Lawn)"),
    furnishing: isPlot ? "Unfurnished (Plot)" : (isCommercial ? "Semi-Furnished (Workstation Ready)" : (prop?.specs?.furnishingStatus || "Fully Furnished")),
    furnitureAppliances: isPlot 
      ? "N/A - Open Land Parcel Ready for Immediate Construction"
      : isCommercial 
      ? "16 Ergonomic Workstations, Boardroom Table, 3 Cassette ACs, Server Rack" 
      : isEstate
      ? "Antique Rosewood Chairs, 4-Poster Teak Beds, Traditional Brass Lamps, Modern Appliances"
      : "Teakwood Dining Table with 6 Chairs, Italian Leather Sofas, 5 Inverter ACs, Smart Refrigerator, Home Theater",
    kitchenType: isPlot ? "N/A" : (isCommercial ? "Pantry & Cafeteria Nook with Microwave Station" : "Modular Italian Kitchen with Island Hob & Hood"),
    parking: isPlot ? "Direct Access Driveway" : (isCommercial ? "2 Reserved Underground Basement Slots" : isEstate ? "Covered Portico for 4 SUVs" : "2 Covered Slots + EV Fast Charger"),
    balconies: isPlot ? "N/A" : (isCommercial ? "1 Road-Facing Executive Veranda" : isEstate ? "Wrap-Around Heritage Verandahs" : "3 Sea-Facing Sundecks"),
    flooring: isPlot ? "Natural Ground / Graded" : (isCommercial ? "Heavy-Duty Vitrified Commercial Tiles" : isEstate ? "Terracotta & Polished Teakwood Planks" : "Italian Marble & Teakwood Parquet"),
    powerBackup: isCommercial ? "25KW 3-Phase + 100% Dedicated DG Failover" : "15KW 3-Phase + 100% Generator Backup",
    waterSupply: isEstate ? "Mountain Stream + Spring Well" : "Open Well + City Corporation Supply"
  };

  const technicalSpecs = prop?.technicalSpecs || {
    roadWidth: isCommercial ? "60ft Four-Lane Arterial Road" : isEstate ? "30ft Paved Plantation Access" : "40ft Tar Road",
    powerBackup: isCommercial ? "3-Phase 25KW + 100% Dedicated DG" : isEstate ? "3-Phase 20KW + Solar Hybrid" : "3-Phase 15KW + 100% DG Backup",
    waterSource: isEstate ? "Perennial Stream + Well" : "Open Well + Corporation Supply",
    zoning: isCommercial ? "Commercial Khata A Approved" : isEstate ? "Freehold Plantation (Non-EFL)" : "Residential / RERA Approved"
  };

  const connectivity = (Array.isArray(prop?.connectivity) && prop.connectivity.length > 0) ? prop.connectivity : [
    { label: "Mangaluru Intl Airport (IXE)", distance: "14 km • 20 mins", type: "airport" },
    { label: "National Highway (NH-66 / Coastal Corridor)", distance: "1.2 km • 3 mins", type: "highway" },
    { label: "Main Railway Junction", distance: "6.5 km • 12 mins", type: "railway" },
    { label: "Super-Specialty Hospital", distance: "3.5 km • 8 mins", type: "hospital" },
    { label: "International School / University", distance: "2.8 km • 6 mins", type: "school" }
  ];

  const financials = prop?.financials || {
    monthlyRental: isPlot ? "N/A (Capital Appreciation Asset)" : estRent,
    rentalYield: isPlot ? "12.0% - 15.0% Capital Yield" : (isCommercial ? "7.2% Commercial Yield" : "4.5% - 5.2% Gross Yield"),
    propertyTax: `₹${isCommercial ? '24,000' : '18,500'} / year (Municipal SAS)`,
    stampDuty: stampDutyVal,
    appreciation: isEstate || isPlot ? "12.5% - 15.0% Y-o-Y" : "11.2% - 13.5% Y-o-Y"
  };

  return { inventorySpecs, technicalSpecs, connectivity, financials };
};

// Single-purpose icon resolver matching transit category
export const getTransitIcon = (mode, name = '') => {
  const lowerName = (name || '').toLowerCase();
  
  if (mode === 'Flight' || lowerName.includes('airport')) {
    return <Plane className="w-4 h-4 text-slate-700 stroke-[1.75]"/>;
  }
  if (mode === 'Transit' || lowerName.includes('station') || lowerName.includes('rail')) {
    return <Train className="w-4 h-4 text-slate-700 stroke-[1.75]"/>;
  }
  if (lowerName.includes('campus') || lowerName.includes('college') || lowerName.includes('school')) {
    return <GraduationCap className="w-4 h-4 text-slate-700 stroke-[1.75]"/>;
  }
  if (mode === 'Walk') {
    return <Footprints className="w-4 h-4 text-slate-700 stroke-[1.75]"/>;
  }
  return <Car className="w-4 h-4 text-slate-700 stroke-[1.75]"/>;
};

export function NearbyInfrastructure({ property, className = "" }) {
  const transitList = property?.transitMatrix?.length > 0 
    ? property.transitMatrix 
    : [
        { landmarkName: "Mangaluru International Airport (IXE)", travelMode: "Flight", distanceText: "14.2 km", durationText: "20m" },
        { landmarkName: "Surathkal Railway Station", travelMode: "Transit", distanceText: "3.5 km", durationText: "8m" },
        { landmarkName: "NITK Surathkal Campus & Beach", travelMode: "Drive", distanceText: "2.1 km", durationText: "5m" },
        { landmarkName: "Mangalore City Central / Hampankatta", travelMode: "Drive", distanceText: "17.5 km", durationText: "25m" }
      ];

  return (
    <div className={`bg-white rounded-2xl p-6 border border-slate-200/80 space-y-5 shadow-xs ${className}`}>
      
      {/* Header */}
      <h3 className="text-xl font-serif font-bold text-slate-900 tracking-tight">
        Nearby Infrastructure
      </h3>

      {/* Clean Transit List */}
      <div className="space-y-3">
        {transitList.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs py-1.5">
            
            {/* Left: Icon Tile + Landmark Name */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-slate-200/50 flex items-center justify-center shrink-0 shadow-2xs">
                {getTransitIcon(item.travelMode || item.transportMode, item.landmarkName || item.destination)}
              </div>
              <span className="font-semibold text-slate-800 text-xs truncate">
                {item.landmarkName || item.destination}
              </span>
            </div>

            {/* Right: Clean Distance & Duration */}
            <div className="text-right shrink-0 font-medium text-xs text-slate-500 pl-2">
              <span>{item.distanceText || (item.distanceKm ? `${item.distanceKm} km` : '')}</span>
              <span className="text-slate-300 mx-1.5">•</span>
              <span className="text-amber-700 font-bold">{item.durationText || (item.travelTimeMins ? `${item.travelTimeMins}m` : '')}</span>
            </div>

          </div>
        ))}
      </div>

      {/* Footer Details */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <span className="text-slate-500 font-medium">{property?.roadIngressText || '40ft Wide Asphalt Road'}</span>
        <span className="font-bold text-emerald-700 tracking-wide">{property?.zoningTagText || 'RERA Compliant'}</span>
      </div>

    </div>
  );
}

export default function PropertyDetails({
  property = null,
  loading = false,
  onBack,
  activeGalleryIdx: parentActiveGalleryIdx,
  setActiveGalleryIdx: parentSetActiveGalleryIdx,
  propertySpecs: propSpecsInput,
}) {
  const navigate = useNavigate();

  const [internalGalleryIdx, setInternalGalleryIdx] = useState(0);
  const activeGalleryIdx = parentActiveGalleryIdx !== undefined ? parentActiveGalleryIdx : internalGalleryIdx;
  const setActiveGalleryIdx = parentSetActiveGalleryIdx || setInternalGalleryIdx;

  // 1. Loading & Error Boundary Guards
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans text-slate-700 bg-[#FAF8F5]">
        Loading property details...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans text-slate-700 bg-[#FAF8F5]">
        Property not found
      </div>
    );
  }

  // 2. Safety Default Props & Guarded Dynamic Arrays
  const components = property?.componentsMatrix || [];
  const legal = property?.legalVerification || [];

  // Specs & Display Bindings with Safe Fallbacks
  const specs = propSpecsInput || getDefaultSpecs(property);
  const propDisplayId = property?.id || property?._id || "1";
  const propDisplaySlug = property?.slug || `gmk-${propDisplayId}`;
  const propDisplayLocation = property?.locality 
    ? `${property.locality}, ${property.city}` 
    : (property?.location || "Mangaluru");
  const propDisplayPrice = property?.price || (property?.pricing?.expectedPrice ? (property.pricing.expectedPrice >= 10000000 ? `₹${(property.pricing.expectedPrice / 10000000).toFixed(2)} Cr` : `₹${(property.pricing.expectedPrice / 100000).toFixed(1)} Lakhs`) : '₹1.50 Cr');
  const propDisplayPriceRaw = property?.priceRaw || property?.pricing?.expectedPrice || 15000000;
  const propDisplayType = property?.category || property?.type || 'Villa';
  const propDisplayArea = property?.specs?.carpetAreaSqFt 
    ? `${property.specs.carpetAreaSqFt.toLocaleString('en-IN')} sq.ft` 
    : (property?.area || '2,400 sq.ft');
  const propDisplayBeds = property?.specs?.bedrooms ?? property?.beds ?? 4;
  const propDisplayBaths = property?.specs?.bathrooms ?? property?.baths ?? 4;
  const propDisplayImages = (property?.galleryImages && property.galleryImages.length > 0)
    ? property.galleryImages
    : ((property?.images && property.images.length > 0) ? property.images : ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80']);
  const propDisplayVideoUrl = property?.youtubeVideoId 
    ? `https://www.youtube.com/watch?v=${property.youtubeVideoId}` 
    : property?.videoUrl;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/properties');
    }
  };

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen flex flex-col justify-between">
      <section className="pt-8 pb-16 w-full max-w-[1440px] mx-auto px-6 lg:px-10 relative flex-1">
      {/* Clean Single-Arrow Back Link */}
      <Link 
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-[#C59B27] transition-colors font-sans mb-4 group" 
        to="/properties"
        onClick={(e) => {
          if (onBack) {
            e.preventDefault();
            handleBack();
          }
        }}
      >
        <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-[#C59B27] group-hover:-translate-x-0.5 transition-transform"/>
        <span>Back to Directory</span>
      </Link>

      {/* =================================================================== */}
      {/* 2-COLUMN MAIN CONTENT & STICKY ASIDE LAYOUT                         */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">
        
        {/* ============================================================= */}
        {/* LEFT COLUMN (Spans 8 Columns): Media Gallery & Core Details   */}
        {/* ============================================================= */}
        <div className="lg:col-span-8 space-y-8 min-w-0">
          
          {/* Property Title & Price Header */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
              <div className="space-y-1">
                {/* Clean Category & Listing ID (EXCLUSIVE TOUR & VERIFIED Removed) */}
                <div className="text-[11px] font-bold text-amber-700 uppercase tracking-widest flex items-center gap-2">
                  <span>{property?.category || propDisplayType || 'Villa'}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400 font-normal">Listing #{property?.listingId || propDisplayId || '1'}</span>
                </div>

                {/* Property Title */}
                <h1 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-tight">
                  {property?.title}
                </h1>

                {/* Locality */}
                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{property?.location || propDisplayLocation || 'Surathkal Beach, Mangaluru'}</span>
                </p>
              </div>

              {/* Clean Price Display (Price Negotiable Removed) */}
              <div className="text-left md:text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Asking Price
                </div>
                <div className="text-2xl md:text-3xl font-serif font-bold text-amber-700">
                  {(property?.priceText || property?.price || propDisplayPrice || '').startsWith('₹') 
                    ? (property?.priceText || property?.price || propDisplayPrice) 
                    : `₹${property?.priceText || property?.price || propDisplayPrice}`}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Main Photo Gallery (Takes full width of Left Column) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6">
            <PropertyImageGallery 
              images={propDisplayImages}
              selectedImage={activeGalleryIdx}
              setSelectedImage={setActiveGalleryIdx}
            />
          </div>
          
          {/* 1. Architectural Overview & Highlights Narrative */}
          <ArchitecturalOverview 
            description={property?.description} 
            highlights={property?.highlights} 
          />

          {/* 2. Structured HTML Table Component: Property Specifications & Features */}
          <PropertySpecifications 
            specifications={components && components.length > 0 ? components.map(c => ({
              category: c?.categoryName || c?.category || 'General',
              feature: c?.featureName || c?.feature || c?.label,
              status: (c?.isAvailable !== false && c?.status !== 'Not Included') ? 'Included' : 'Not Included',
              details: c?.descriptionNote || c?.details || '—'
            })) : undefined} 
          />

          {/* 3. Legal Audit Checklist Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#0a1d37] text-[#e6ca65] flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#0a1d37]">
                Legal & Title Verification
              </h3>
            </div>

            {/* Line-by-Line Stacked Container */}
            <div className="w-full bg-white rounded-xl border border-neutral-200/80 divide-y divide-neutral-100 shadow-sm overflow-hidden mb-6">
              {legal && legal.length > 0 ? (
                legal.map((item, index) => {
                  const status = item?.verifiedStatus || 'Verified';
                  return (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-neutral-50/60 transition-colors">
                      
                      {/* Left: Document Name & Note */}
                      <div className="flex-1 pr-4">
                        <h4 className="font-semibold text-sm text-[#0a1d37]">{item?.documentName}</h4>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {item?.verificationNote || "Status Not Updated"}
                        </p>
                      </div>

                      {/* Right: Status Badge */}
                      <div className="shrink-0">
                        {status === 'Verified' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            ✓ Verified
                          </span>
                        ) : status === 'Pending' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                            ⏳ Pending
                          </span>
                        ) : status === 'Issue Flagged' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200/60">
                            ✕ Flagged
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200/60">
                            — Pending
                          </span>
                        )}
                      </div>

                    </div>
                  );
                })
              ) : (
                (property?.legalChecklist || [])
                  .filter(item => item && item.inspected !== false && item.inspected !== 'false' && item.status !== 'not_inspected' && item.status !== 'Pending Legal Audit')
                  .map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-neutral-50/60 transition-colors">
                      
                      {/* Left: Document Name & Note */}
                      <div className="flex-1 pr-4">
                        <h4 className="font-semibold text-sm text-[#0a1d37]">{item?.name}</h4>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {item?.details || "Status Not Updated"}
                        </p>
                      </div>

                      {/* Right: Status Badge */}
                      <div className="shrink-0">
                        {item?.isCleared ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200/60">
                            ✕ Action Req.
                          </span>
                        )}
                      </div>

                    </div>
                  ))
              )}
            </div>

            {/* Bank Loan Bridge Advocate Verification Action */}
            {(property?.advocateVerificationAvailable !== false) && (
              <div className="bg-[#fcfbf7] border border-slate-200/90 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0a1d37] block">Bank Loan Search Report & Legal Search Bridge</span>
                    <span className="text-[11px] text-slate-500 block">Pre-cleared with SBI, HDFC, Canara & Federal Bank empanelled advocates.</span>
                  </div>
                </div>
                <a 
                  href={`https://wa.me/919876543210?text=Hello%20GrabMyKey,%20I%20would%20like%20to%20verify%20title%20clearance%20with%20an%20Advocate%20(Bank%20Loan%20Bridge)%20for%20Property%20%23${propDisplayId}%20(Slug:%20${propDisplaySlug}):%20${encodeURIComponent(property?.title || 'Property')}%20(${encodeURIComponent(propDisplayLocation)})`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 bg-[#0a1d37] hover:bg-[#061224] text-white font-semibold px-4 py-2.5 rounded-xl text-xs tracking-wider transition-all shadow-sm shrink-0"
                >
                  <FileCheck className="w-3.5 h-3.5 text-[#e6ca65]" />
                  <span>Verify with Advocate (Bank Loan Bridge)</span>
                </a>
              </div>
            )}
          </div>

        </div>

        {/* ============================================================= */}
        {/* RIGHT COLUMN (Spans 4 Columns): Sticky Video Card & Pricing   */}
        {/* ============================================================= */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          
          {/* Video Walkthrough Card */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 space-y-3 shadow-xs">
            
            {/* Updated Header (Text Changed to "VIDEO WALKTHROUGH") */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Video className="w-3.5 h-3.5"/>
              </div>
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                Video Walkthrough
              </span>
            </div>

            {/* YouTube Video Embed Container */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200/60">
              {propDisplayVideoUrl ? (
                <iframe
                  src={getYouTubeEmbedUrl(propDisplayVideoUrl)}
                  title="Property Video Walkthrough"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                  No video available
                </div>
              )}
            </div>

            {/* Video Walkthrough Card Footer */}
            <div className="flex items-center justify-end pt-1 text-[11px]">
              <a
                href={getYouTubeWatchUrl(propDisplayVideoUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-slate-700 hover:text-amber-700 flex items-center gap-1 transition-colors"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="w-3 h-3 text-slate-400"/>
              </a>
            </div>

          </div>

          {/* 2. Sticky Property Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-amber-50 text-[#b8860b] border border-amber-200 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md">
                {propDisplayType || 'RESALE'}
              </span>
              <span className="text-xs font-mono text-slate-500 font-semibold">
                #{propDisplayId}
              </span>
            </div>

            {/* Asking Price with Optional Chaining */}
            <div className="mb-4 pb-4 border-b border-slate-100">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Asking Price</span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-3xl font-serif font-bold text-[#b8860b]">{propDisplayPrice}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                {propDisplayPriceRaw ? (
                  <span className="text-xs text-slate-500 font-medium">
                    ≈ ₹{Math.round(propDisplayPriceRaw / (parseInt((propDisplayArea || '1').replace(/[^0-9]/g, '')) || 1)).toLocaleString('en-IN')} / sq.ft
                  </span>
                ) : null}
              </div>
            </div>

            {/* Dynamic Property Specifications Grid */}
            {(() => {
              const isLand = property?.type?.toLowerCase().includes('land') || 
                             property?.type?.toLowerCase().includes('plot') ||
                             property?.category?.toLowerCase().includes('land') || 
                             property?.category?.toLowerCase().includes('plot');

              if (isLand) {
                return (
                  <div className="grid grid-cols-2 gap-3 my-6">
                    {/* Plot Area */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
                        PLOT AREA
                      </span>
                      <p className="text-sm font-bold text-[#0F172A] font-sans">
                        {property?.plotArea || property?.specs?.plotArea || property?.superArea || propDisplayArea || "12.5 Cents"}
                      </p>
                    </div>

                    {/* Boundary Wall / Fencing */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
                        BOUNDARY / FENCING
                      </span>
                      <p className="text-sm font-bold text-[#0F172A] font-sans">
                        {property?.boundary || property?.specs?.compoundWall || "Gated Compound"}
                      </p>
                    </div>

                    {/* Zoning / Land Use */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
                        ZONING TYPE
                      </span>
                      <p className="text-sm font-bold text-[#0F172A] font-sans">
                        {property?.zoning || property?.specs?.conversionStatus || "Residential Conversion"}
                      </p>
                    </div>

                    {/* Road Ingress / Frontage */}
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
                        ROAD FRONTAGE
                      </span>
                      <p className="text-sm font-bold text-[#0F172A] font-sans">
                        {property?.roadWidth || property?.specs?.roadWidth || "30 ft Concrete Road"}
                      </p>
                    </div>
                  </div>
                );
              }

              // Standard Villa / Residential / Commercial Suite Specs
              return (
                <div className="grid grid-cols-2 gap-3 my-6">
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
                      BEDROOMS
                    </span>
                    <p className="text-sm font-bold text-[#0F172A] font-sans flex items-center gap-1.5">
                      <Bed className="w-4 h-4 text-[#C59B27]"/>
                      {property?.bedrooms || propDisplayBeds || "N/A"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
                      BATHROOMS
                    </span>
                    <p className="text-sm font-bold text-[#0F172A] font-sans flex items-center gap-1.5">
                      <Bath className="w-4 h-4 text-[#C59B27]"/>
                      {property?.bathrooms || propDisplayBaths || "N/A"}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
                      SUPER AREA
                    </span>
                    <p className="text-sm font-bold text-[#0F172A] font-sans">
                      {property?.superArea || property?.builtUpArea || propDisplayArea}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
                      FURNISHING
                    </span>
                    <p className="text-sm font-bold text-[#0F172A] font-sans">
                      {property?.furnishing || property?.specs?.furnishingStatus || "Unfurnished"}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Primary WhatsApp CTA Button */}
            <a 
              href={`https://wa.me/919876543210?text=Hello%20GrabMyKey,%20I%20am%20interested%20in%20inspecting%20Property%20%23${propDisplayId}%20(Slug:%20${propDisplaySlug}):%20${encodeURIComponent(property?.title || 'Property')}%20(${encodeURIComponent(propDisplayLocation)})`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:from-[#c49f28] hover:to-[#997315] text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider text-center flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer mb-3"
            >
              <Phone className="w-4 h-4 text-white" />
              <span>Book On-Site Inspection via WhatsApp</span>
            </a>

            {/* Schedule Private Tour Button */}
            <a 
              href={`https://wa.me/919876543210?text=Hello%20GrabMyKey,%20I%20would%20like%20to%20schedule%20a%20private%20tour%20for%20Property%20%23${propDisplayId}%20(Slug:%20${propDisplaySlug}):%20${encodeURIComponent(property?.title || 'Property')}%20(${encodeURIComponent(propDisplayLocation)})`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#0a1d37] hover:bg-[#061224] text-white font-semibold py-2.5 px-4 rounded-xl text-xs tracking-wider text-center flex items-center justify-center space-x-2 transition-all cursor-pointer border border-[#b8860b]/30"
            >
              <Calendar className="w-3.5 h-3.5 text-[#e6ca65]" />
              <span>Schedule Private Tour</span>
            </a>

          </div>

        </div>

      </div>

      {/* Streamlined Investment & Transit Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">

        {/* Left: Minimalist Investment Highlights (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 space-y-6 shadow-xs">
          <h3 className="text-lg font-serif font-bold text-slate-900 tracking-tight">
            Investment Analysis
          </h3>

          {/* Metric Grid - Bold Numbers, No Extra Captions */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-slate-200/50">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Unit Rate
              </div>
              <div className="text-xl font-serif font-bold text-slate-900">
                ₹{property.sqftPrice || (propDisplayPriceRaw ? Math.round(propDisplayPriceRaw / (parseInt((propDisplayArea || '1').replace(/[^0-9]/g, '')) || 1)).toLocaleString('en-IN') : '9,167')}
                <span className="text-[10px] font-sans text-slate-400 font-normal">/sq.ft</span>
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-slate-200/50">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Est. Rent
              </div>
              <div className="text-xl font-serif font-bold text-slate-900">
                ₹{(property.rentalEstimate || property?.investmentAnalysis?.rentalYieldEst?.split(' ')[0] || specs?.financials?.monthlyRental || '1.45L').replace(/^₹/, '').replace(' / mo', '')}
                <span className="text-[10px] font-sans text-slate-400 font-normal">/mo</span>
              </div>
            </div>

            <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-slate-200/50">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Appreciation
              </div>
              <div className="text-xl font-serif font-bold text-amber-700">
                {property.appreciationRate || (property?.investmentAnalysis?.resaleAppreciationEst ? property.investmentAnalysis.resaleAppreciationEst.split(' ')[0].replace('Compound', '').trim() : '11 - 13%')}
              </div>
            </div>
          </div>

          {/* Statutory Costs - Compact Key-Value Bars */}
          <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
            <div className="flex justify-between items-center bg-slate-50 px-3.5 py-2.5 rounded-lg border border-slate-100">
              <span className="text-slate-500 text-[11px]">Property Tax</span>
              <span className="font-bold text-slate-900 text-[11px]">{specs?.financials?.propertyTax ? specs.financials.propertyTax.replace(' / year', ' / yr') : '₹18.5K / yr'}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-50 px-3.5 py-2.5 rounded-lg border border-slate-100">
              <span className="text-slate-500 text-[11px]">Stamp Duty</span>
              <span className="font-bold text-slate-900 text-[11px]">{specs?.financials?.stampDuty ? specs.financials.stampDuty.replace('Lakhs', 'L') : '8.0% (~₹30.8L)'}</span>
            </div>
          </div>
        </div>

        {/* Right: Clean Nearby Transit (5 Cols) */}
        <NearbyInfrastructure property={property} className="lg:col-span-5" />

      </div>

      </section>
      <Footer />
    </div>
  );
}

export { PropertyImageGallery, ArchitecturalOverview, Footer };

