import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AdminConsole from './AdminConsole';
import PropertyDetails from './components/PropertyDetails';
import LegalStandards from './pages/LegalStandards';
import Contact from './pages/Contact';
import ListProperty from './pages/ListProperty';
import Footer from './components/Footer';
import Home, { HeroSection } from './pages/Home';
import Properties from './pages/Properties';
import { useProperties } from './context/PropertyContext';
import { 
  Search, Video, MapPin, Phone, 
  Play, CheckCircle2, ChevronRight, X, 
  Lock, ExternalLink, Layers, Sparkles,
  FileCheck, ArrowLeft, Calendar,
  RefreshCw, Zap, Droplet,
  Plane, Car, Train, Bus, HeartPulse, GraduationCap, TrendingUp,
  Bed, Bath, Sofa, Utensils, Building2, Plus
} from 'lucide-react';
import { 
  fetchProperties, 
  fetchPropertyById,
  fetchLeads, 
  submitLead, 
  checkServerHealth,
  fetchSiteSettings
} from './api';


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

const INITIAL_PROPERTIES = [];

const getPropertySpecs = (prop) => {
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
  const isCommercial = prop.type === 'Commercial' || prop.category === 'Commercial';
  const isEstate = prop.type === 'Estate' || prop.category === 'Estate';
  const isPlot = prop.type === 'Plot / Land' || prop.type === 'Plot' || prop.category === 'Plot' || prop.category === 'Land/Plot';
  const priceVal = prop.priceRaw || (parseInt((prop.price || '').replace(/[^0-9]/g, '')) * 100000) || 0;
  const stampDutyVal = priceVal ? `8.0% (~₹${(priceVal * 0.08 / 100000).toFixed(1)} Lakhs)` : 'N/A';
  const estRent = priceVal ? `₹${Math.round(priceVal * (isCommercial ? 0.006 : 0.0035)).toLocaleString('en-IN')} / mo` : 'N/A';

  const inventorySpecs = prop.inventorySpecs || {
    bedrooms: isPlot ? 0 : (prop.beds ?? (isCommercial ? 0 : isEstate ? 5 : (prop.specs?.bedrooms ?? 0))),
    bathrooms: isPlot ? 0 : (prop.baths ?? (isCommercial ? 2 : isEstate ? 6 : (prop.specs?.bathrooms ?? 0))),
    halls: isPlot ? "N/A - Plot Asset" : (isCommercial ? "Workstation Hall" : "Living + Dining"),
    garden: isPlot ? "Open Land Parcel" : (isCommercial ? "No" : "Yes (Private Lawn)"),
    furnishing: prop.specs?.furnishingStatus || (isPlot ? "Unfurnished (Plot)" : "Unfurnished"),
    furnitureAppliances: prop.furnishing || (isPlot ? "N/A - Open Land Parcel" : "Standard"),
    kitchenType: isPlot ? "N/A" : (isCommercial ? "Pantry" : "Standard Kitchen"),
    parking: isPlot ? "Direct Access" : "Covered Parking",
    balconies: isPlot ? "N/A" : "Standard Balcony",
    flooring: isPlot ? "Natural Ground" : "Vitrified Tiles",
    powerBackup: prop.powerBackup || "Standard Backup",
    waterSupply: prop.waterSupply || "Corporation Supply"
  };

  const technicalSpecs = prop.technicalSpecs || {
    roadWidth: prop.roadWidth || (isCommercial ? "60ft Four-Lane Arterial Road" : "40ft Tar Road"),
    powerBackup: prop.powerBackup || (isCommercial ? "3-Phase 25KW + 100% Dedicated DG" : "3-Phase 15KW + 100% DG Backup"),
    waterSource: prop.waterSupply || "Corporation Supply",
    zoning: prop.zoning || (isCommercial ? "Commercial Khata A Approved" : "Residential / RERA Approved")
  };

  const connectivity = prop.connectivity || [];

  const financials = prop.financials || {
    monthlyRental: isPlot ? "N/A (Capital Appreciation Asset)" : estRent,
    rentalYield: isPlot ? "12.0% - 15.0% Capital Yield" : (isCommercial ? "7.2% Commercial Yield" : (priceVal ? "4.5% - 5.2% Gross Yield" : "N/A")),
    propertyTax: priceVal ? `₹${isCommercial ? '24,000' : '18,500'} / year (Municipal SAS)` : "N/A",
    stampDuty: stampDutyVal,
    appreciation: "11.2% - 13.5% Y-o-Y"
  };

  return { inventorySpecs, technicalSpecs, connectivity, financials };
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken') === 'true';
    }
    return false;
  });

  // URL route parsing for unified browser navigation
  const currentPath = location.pathname;
  const isAdminRoute = currentPath.startsWith('/manage-345') || currentPath === '/admin' || currentPath.startsWith('/admin/');
  const isPropertyDetailRoute = currentPath.startsWith('/property/');
  const propertyIdFromUrl = isPropertyDetailRoute ? currentPath.replace(/^\/property\//, '').split('/')[0] : null;

  // View state derived from URL
  const activeView = useMemo(() => {
    if (isAdminRoute) return 'admin';
    if (isPropertyDetailRoute) return 'property-detail';
    if (currentPath === '/properties') return 'properties';
    if (currentPath === '/legal' || currentPath === '/legal-standards') return 'legal';
    if (currentPath === '/contact') return 'contact';
    if (currentPath === '/sell') return 'sell';
    return 'home';
  }, [currentPath, isAdminRoute, isPropertyDetailRoute]);

  const { properties, setProperties } = useProperties();
  const [selectedPropertyId, setSelectedPropertyId] = useState(() => propertyIdFromUrl || "1");
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Admin PIN Gate modal
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [adminPinError, setAdminPinError] = useState(false);

  // Dynamic Site Settings (Hero Featured Video & Content)
  const [heroSettings, setHeroSettings] = useState({
    heroFeaturedPropertyId: null,
    heroCustomYoutubeId: "",
    heroBadgeTag: "FEATURED VIDEO TOUR",
    heroOverlayTitle: "",
    heroOverlayLocation: ""
  });

  // Inbound seller requests (initialized to empty array)
  const [sellerRequests, setSellerRequests] = useState([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const propRes = await fetchProperties();
      if (propRes?.success && Array.isArray(propRes.data)) {
        setProperties(propRes.data);
      } else {
        setProperties([]);
      }

      const leadRes = await fetchLeads();
      if (leadRes?.success && Array.isArray(leadRes.data)) {
        setSellerRequests(leadRes.data);
      } else {
        setSellerRequests([]);
      }

      const settingsRes = await fetchSiteSettings();
      if (settingsRes?.success && settingsRes.data) {
        setHeroSettings(settingsRes.data);
      }
    } catch (err) {
      // Gracefully handled offline fallback
    } finally {
      setIsLoading(false);
    }
  };


  // Synchronize selected property ID when URL changes to /property/:id
  useEffect(() => {
    if (propertyIdFromUrl) {
      setSelectedPropertyId(propertyIdFromUrl);
      setActiveGalleryIdx(0);

      const target = String(propertyIdFromUrl).toLowerCase();
      const exists = Array.isArray(properties) && properties.some(p => 
        String(p?.id || '').toLowerCase() === target || 
        String(p?._id || '').toLowerCase() === target || 
        String(p?.slug || '').toLowerCase() === target
      );

      if (!exists) {
        fetchPropertyById(propertyIdFromUrl).then(res => {
          if (res?.data) {
            setProperties(prev => {
              const currentList = Array.isArray(prev) ? prev : [];
              if (currentList.some(p => String(p.id) === String(res.data.id) || p.slug === res.data.slug)) {
                return currentList;
              }
              return [res.data, ...currentList];
            });
          }
        }).catch(() => {});
      }
    }
  }, [propertyIdFromUrl, properties, setProperties]);

  // Check admin auth state when visiting admin routes
  useEffect(() => {
    if (isAdminRoute) {
      if (localStorage.getItem('adminToken') !== 'true') {
        setShowAdminLoginModal(true);
      } else {
        setIsAdminLoggedIn(true);
      }
    } else {
      setShowAdminLoginModal(false);
      setAdminPinError(false);
    }
  }, [isAdminRoute]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView, selectedPropertyId]);

  // Load database listings & health on mount
  useEffect(() => {
    loadData();

    // Hotkey: Ctrl + Shift + A opens Admin Portal
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (localStorage.getItem('adminToken') === 'true') {
          navigate('/manage-345');
        } else {
          setShowAdminLoginModal(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Real-time synchronization for site settings changes from Admin Console
    const handleSettingsUpdated = (e) => {
      if (e?.detail) {
        setHeroSettings(e.detail);
      } else {
        fetchSiteSettings().then(res => {
          if (res?.success && res.data) {
            setHeroSettings(res.data);
          }
        }).catch(() => {});
      }
    };
    window.addEventListener('grabmykey_settings_updated', handleSettingsUpdated);

    const handlePropertiesUpdated = () => {
      loadData();
    };
    window.addEventListener('grabmykey_properties_updated', handlePropertiesUpdated);
    window.addEventListener('grabmykey_property_created', handlePropertiesUpdated);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('grabmykey_settings_updated', handleSettingsUpdated);
      window.removeEventListener('grabmykey_properties_updated', handlePropertiesUpdated);
      window.removeEventListener('grabmykey_property_created', handlePropertiesUpdated);
    };
  }, [navigate]);

  // Browser navigation helper - never uses replace: true
  const navigateTo = (path) => {
    navigate(path);
  };

  const navigateToProperty = (idOrSlug) => {
    setSelectedPropertyId(String(idOrSlug));
    setActiveGalleryIdx(0);
    navigate(`/property/${idOrSlug}`);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPin.trim() === '345' || adminPin.trim() === '1234') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('adminToken', 'true');
      setShowAdminLoginModal(false);
      setAdminPin('');
      setAdminPinError(false);
      if (!location.pathname.startsWith('/manage-345')) {
        navigate('/manage-345');
      }
    } else {
      setAdminPinError(true);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  // 1. Safe Optional Chaining Guard for Hero & Gallery References
  const featuredProperty = properties && properties.length > 0 ? properties[0] : null;

  // Always ensure images is an array to prevent "Cannot read properties of undefined (reading 'images')"
  const featuredImages = featuredProperty?.images || featuredProperty?.galleryImages || [];
  const primaryHeroImage = featuredImages.length > 0 ? featuredImages[0] : "";

  // Selected Property Object (matches by slug, id, or _id)
  const selectedProperty = useMemo(() => {
    if (!properties || properties.length === 0) return null;
    if (!selectedPropertyId) {
      return isPropertyDetailRoute ? null : (properties[0] || null);
    }
    const target = String(selectedPropertyId).trim().toLowerCase();
    const found = properties.find(p => {
      if (!p) return false;
      const matchSlug = p.slug && String(p.slug).trim().toLowerCase() === target;
      const matchId = (p.id && String(p.id).trim().toLowerCase() === target);
      const matchMongoId = (p._id && String(p._id).trim().toLowerCase() === target);
      return matchSlug || matchId || matchMongoId;
    });
    if (found) return found;
    if (isPropertyDetailRoute) {
      return null;
    }
    return properties[0] || null;
  }, [properties, selectedPropertyId, isPropertyDetailRoute]);

  const propertySpecs = useMemo(() => {
    return getPropertySpecs(selectedProperty);
  }, [selectedProperty]);

  // Unified display bindings supporting both new MongoDB schemas & legacy models
  const propDisplayId = selectedProperty?.id || selectedProperty?._id || "1";
  const propDisplaySlug = selectedProperty?.slug || `gmk-${propDisplayId}`;
  const propDisplayLocation = selectedProperty?.locality 
    ? `${selectedProperty.locality}, ${selectedProperty.city || 'Mangaluru'}` 
    : (selectedProperty?.location || "Mangaluru");
  const propDisplayPrice = selectedProperty?.price || (selectedProperty?.pricing?.expectedPrice ? (selectedProperty.pricing.expectedPrice >= 10000000 ? `₹${(selectedProperty.pricing.expectedPrice / 10000000).toFixed(2)} Cr` : `₹${(selectedProperty.pricing.expectedPrice / 100000).toFixed(1)} Lakhs`) : 'Price on Request');
  const propDisplayPriceRaw = selectedProperty?.priceRaw || selectedProperty?.pricing?.expectedPrice || 0;
  const propDisplayType = selectedProperty?.category || selectedProperty?.type || 'Villa';
  const propDisplayArea = selectedProperty?.specs?.carpetAreaSqFt 
    ? `${selectedProperty.specs.carpetAreaSqFt.toLocaleString('en-IN')} sq.ft` 
    : (selectedProperty?.area || 'N/A');
  const propDisplayBeds = selectedProperty?.specs?.bedrooms ?? selectedProperty?.beds ?? 0;
  const propDisplayBaths = selectedProperty?.specs?.bathrooms ?? selectedProperty?.baths ?? 0;
  
  // Safe Array Fallback for Property Images
  const selectedPropImages = (selectedProperty?.galleryImages && selectedProperty.galleryImages.length > 0)
    ? selectedProperty.galleryImages
    : ((selectedProperty?.images && selectedProperty.images.length > 0) ? selectedProperty.images : []);
  const propDisplayImages = selectedPropImages.length > 0 ? selectedPropImages : [primaryHeroImage];
  
  const propDisplayVideoUrl = selectedProperty?.youtubeVideoId 
    ? `https://www.youtube.com/watch?v=${selectedProperty.youtubeVideoId}` 
    : (selectedProperty?.videoUrl || '');
  const propDisplayBadge = selectedProperty?.badge || (selectedProperty?.isFeatured ? 'Featured Listing' : (selectedProperty?.dealType || 'Exclusive Listing'));

  // Filtered properties for public catalog
  const filteredProperties = useMemo(() => {
    if (!Array.isArray(properties)) return [];
    return properties.filter(prop => {
      if (!prop) return false;
      const title = prop?.title || '';
      const location = prop?.location || prop?.locality || '';
      const type = prop?.type || prop?.category || '';
      const locality = prop?.locality || '';
      const matchesQuery = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All' || type === selectedType;
      const matchesRegion = selectedRegion === 'All' || 
                           location.toLowerCase().includes(selectedRegion.toLowerCase()) ||
                           locality.toLowerCase().includes(selectedRegion.toLowerCase());
      return matchesQuery && matchesType && matchesRegion;
    });
  }, [properties, searchQuery, selectedType, selectedRegion]);

  // Dynamic Hero Video & Overlay Bindings
  const heroFeaturedProperty = useMemo(() => {
    if (!properties || properties.length === 0) return null;
    const targetId = heroSettings?.heroFeaturedPropertyId?._id || heroSettings?.heroFeaturedPropertyId;
    if (targetId) {
      const found = properties.find(p => String(p._id) === String(targetId) || String(p.id) === String(targetId));
      if (found) return found;
    }
    return properties[0] || null;
  }, [properties, heroSettings]);

  const heroYoutubeId = useMemo(() => {
    if (heroSettings?.heroCustomYoutubeId && heroSettings.heroCustomYoutubeId.trim()) {
      const raw = heroSettings.heroCustomYoutubeId.trim();
      const match = raw.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
      return (match && match[2].length === 11) ? match[2] : raw;
    }
    return heroFeaturedProperty?.youtubeVideoId || "";
  }, [heroSettings, heroFeaturedProperty]);

  const heroThumbnail = useMemo(() => {
    if (heroYoutubeId) {
      return `https://img.youtube.com/vi/${heroYoutubeId}/maxresdefault.jpg`;
    }
    return heroFeaturedProperty?.images?.[0] || heroFeaturedProperty?.galleryImages?.[0] || "";
  }, [heroYoutubeId, heroFeaturedProperty]);

  const heroTitle = heroSettings?.heroOverlayTitle || heroFeaturedProperty?.title || "";
  const heroLocation = heroSettings?.heroOverlayLocation || (heroFeaturedProperty ? `${heroFeaturedProperty.location || 'Mangaluru'} • ${heroFeaturedProperty.price || ''}` : '');
  const heroBadge = heroSettings?.heroBadgeTag || "FEATURED PROPERTY";
  const heroTargetSlug = heroFeaturedProperty?.slug || heroFeaturedProperty?._id || heroFeaturedProperty?.id || "";

  const heroCardProperty = useMemo(() => {
    // If no properties in state AND no custom video has been explicitly configured, hero shows Coming Soon
    if ((!properties || properties.length === 0) && !heroSettings?.heroCustomYoutubeId) {
      return null;
    }
    if (!heroFeaturedProperty && !heroTitle && !heroYoutubeId) {
      return null;
    }
    const locParts = (heroLocation || '').split('•');
    const locText = locParts[0]?.trim() || heroFeaturedProperty?.location || 'Mangaluru';
    const priceRaw = locParts[1]?.trim() || heroFeaturedProperty?.price || '';
    const priceText = priceRaw.replace(/^₹/, '');

    return {
      title: heroTitle || heroFeaturedProperty?.title || 'Featured Property',
      location: locText,
      priceText: priceText,
      videoUrl: heroYoutubeId ? `https://www.youtube.com/embed/${heroYoutubeId}?autoplay=1` : '',
      thumbnail: heroThumbnail,
      slug: heroTargetSlug
    };
  }, [properties, heroSettings, heroTitle, heroLocation, heroFeaturedProperty, heroYoutubeId, heroThumbnail, heroTargetSlug]);


  // =========================================================================
  // VIEW 1: EXECUTIVE ADMIN SUITE (/manage-345 & /manage-345/publish-listing)
  // Strictly isolated from public storefront layout
  // =========================================================================
  if (isAdminRoute) {
    if (isAdminLoggedIn) {
      return (
        <AdminConsole
          onExit={handleAdminLogout}
          onViewLiveProperty={(id) => {
            navigateToProperty(id);
          }}
          onDataUpdated={loadData}
        />
      );
    }

    return (
      <div className="min-h-screen bg-[#060d19] text-slate-100 flex items-center justify-center p-4">
        <div className="bg-[#0b1528] border border-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
          <button 
            onClick={() => navigate('/')}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Return to Public Storefront"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-[#d4af37] border border-slate-700 flex items-center justify-center mx-auto mb-3 shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white tracking-wide">Executive Command Center</h3>
            <p className="text-xs text-slate-400 mt-1">Authorized personnel only (PIN: 345)</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <input 
                type="password"
                placeholder="Enter PIN"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-center text-lg tracking-widest text-white font-semibold focus:border-[#d4af37] focus:outline-none transition-colors"
                autoFocus
              />
              {adminPinError && (
                <p className="text-red-400 text-xs text-center mt-2 font-medium">Incorrect security PIN code. Try 345.</p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-[#b8860b] to-[#d4af37] hover:brightness-110 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
            >
              Authenticate & Enter
            </button>
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="w-full text-center text-xs text-slate-400 hover:text-white transition-colors cursor-pointer mt-2"
            >
              ← Return to Public Storefront
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: LEGAL STANDARDS & DIRECT TITLE VERIFICATION (/legal)
  // =========================================================================
  if (activeView === 'legal') {
    return <LegalStandards />;
  }

  // =========================================================================
  // VIEW: DIGITAL CONCIERGE & CONTACT (/contact)
  // =========================================================================
  if (activeView === 'contact') {
    return <Contact />;
  }

  // =========================================================================
  // VIEW: OWNER LISTING PORTAL (/sell)
  // =========================================================================
  if (activeView === 'sell') {
    return <ListProperty />;
  }

  // =========================================================================
  // PUBLIC STOREFRONT & PROPERTY DETAILS LAYOUT
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0a1d37] font-sans antialiased selection:bg-[#b8860b] selection:text-white flex flex-col justify-between">
      
      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="w-full px-6 lg:px-12 max-w-none h-20 flex items-center justify-between">

          
          {/* Brand Logo & Tagline Wrapper */}
          <Link className="flex items-center gap-3 group" to="/">
            {/* Icon Mark Box */}
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center p-2 group-hover:border-[#C59B27]/40 transition-colors">
              <img src="/logo.png" onError={(e) => { e.currentTarget.src = "/logo-icon.svg"; }} alt="GrabMyKey" className="w-full h-full object-contain" />
            </div>

            {/* Brand Name & Tagline - Tightened Vertical Spacing */}
            <div className="flex flex-col gap-0 justify-center">
              <div 
                className="text-lg font-extrabold tracking-tight font-serif leading-none flex items-center gap-1.5 text-slate-900"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                <span>GRAB</span>
                <span className="text-[#C59B27]">MY</span>
                <span>KEY</span>
              </div>
              <span className="text-[9px] font-bold text-[#C59B27] uppercase tracking-widest font-sans leading-tight mt-0.5">
                YOUR TRUSTED REAL ESTATE PARTNER
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-700 font-sans">
            <Link className="hover:text-[#C59B27] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27]" to="/">
              Home
            </Link>

            <Link className="hover:text-[#C59B27] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27]" to="/properties">
              Properties
            </Link>

            <Link className="hover:text-[#C59B27] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27]" to="/legal-standards">
              Legal Standards
            </Link>

            <Link className="hover:text-[#C59B27] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27]" to="/contact">
              Contact
            </Link>
          </nav>

          {/* Header Action CTAs */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigateTo('/sell')}
              className="hidden sm:flex items-center space-x-1.5 border border-slate-300 hover:border-[#0a1d37] text-slate-700 hover:text-[#0a1d37] px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>List Property</span>
            </button>

            {/* Header CTA: Schedule a Tour in #0a1d37 */}
            <a 
              href={activeView === 'property-detail' && selectedProperty
                ? `https://wa.me/919876543210?text=Hello%20GrabMyKey,%20I%20would%20like%20to%20schedule%20a%20private%20tour%20for%20Property%20%23${propDisplayId}%20(Slug:%20${propDisplaySlug}):%20${encodeURIComponent(selectedProperty.title)}%20(${encodeURIComponent(propDisplayLocation)})`
                : "https://wa.me/919876543210?text=Hello%20GrabMyKey,%20I%20would%20like%20to%20schedule%20a%20private%20tour."}
              target="_blank"
              rel="noreferrer"
              className="bg-[#0a1d37] hover:bg-[#061224] text-white px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer shadow-sm flex items-center space-x-2"
            >
              <Phone className="w-3.5 h-3.5 text-[#e6ca65]" />
              <span>Schedule a Tour</span>
            </a>
          </div>
        </div>
      </header>

      {/* MAIN VIEW CONTENT */}
      <main className="flex-grow">
        
        {/* =================================================================== */}
        {/* VIEW: HOME STOREFRONT                                               */}
        {/* =================================================================== */}
        {activeView === 'home' && (
          <div className="bg-[#FAF8F5] w-full">
            <Home
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onBrowseAll={() => navigateTo('/properties')}
              property={heroCardProperty}
              properties={properties}
            />
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW: FULL PROPERTY DIRECTORY CATALOG (/properties)                 */}
        {/* =================================================================== */}
        {activeView === 'properties' && (
          <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 py-8">
            <Properties 
              properties={properties} 
              onRefresh={loadData} 
              isLoading={isLoading} 
              standalone={false} 
            />
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW: DETAILED PROPERTY VIEW (/property/:id)                        */}
        {/* =================================================================== */}
        {activeView === 'property-detail' && (
          <PropertyDetails
            property={selectedProperty}
            loading={isLoading && !selectedProperty}
            onBack={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigateTo('/properties');
              }
            }}
            activeGalleryIdx={activeGalleryIdx}
            setActiveGalleryIdx={setActiveGalleryIdx}
            propertySpecs={propertySpecs}
          />
        )}

      </main>

      {/* =================================================================== */}
      {/* ADMIN PIN AUTHENTICATION MODAL (PIN: 345)                           */}
      {/* =================================================================== */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1d37]/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative shadow-2xl border border-slate-200">
            <button 
              onClick={() => {
                setShowAdminLoginModal(false);
                setAdminPin('');
                setAdminPinError(false);
                if (location.pathname.startsWith('/manage-345')) {
                  navigateTo('/');
                }
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-[#b8860b] border border-amber-200 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-[#0a1d37]">Private Admin Portal</h3>
              <p className="text-xs text-slate-500 mt-1">Enter your admin PIN (PIN: 345)</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <input 
                  type="password"
                  placeholder="Enter PIN"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-center text-lg tracking-widest text-[#0a1d37] font-semibold focus:border-[#b8860b] focus:outline-none"
                  autoFocus
                />
                {adminPinError && (
                  <p className="text-red-600 text-xs text-center mt-2 font-medium">Incorrect PIN code. Try 345.</p>
                )}
              </div>

              <button 
                type="submit"
                className="w-full bg-[#0a1d37] hover:bg-[#061426] text-white border border-[#b8860b]/30 hover:border-[#b8860b] font-semibold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                Authenticate Access
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER - Hidden on property detail view so page ends cleanly above the fixed bottom bar */}
      {activeView !== 'property-detail' && <Footer />}

    </div>
  );
}

