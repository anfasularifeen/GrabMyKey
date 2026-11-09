import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Play, ArrowUpRight } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/PropertyCard';
import { mockProperties } from '../data/mockProperties';

export default function Home({
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
  selectedRegion: externalSelectedRegion,
  setSelectedRegion: externalSetSelectedRegion,
  onBrowseAll,
  property = null,
  properties: externalProperties,
  showGrid = true
} = {}) {
  const navigate = useNavigate();
  const { properties: contextProperties } = useProperties();
  const properties = externalProperties !== undefined ? externalProperties : contextProperties;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [localSearch, setLocalSearch] = useState('');
  const [localRegion, setLocalRegion] = useState('All');
  
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : localSearch;
  const setSearchQuery = externalSetSearchQuery || setLocalSearch;
  const selectedRegion = externalSelectedRegion !== undefined ? externalSelectedRegion : localRegion;
  const setSelectedRegion = externalSetSelectedRegion || setLocalRegion;

  // Safe Fallback Dataset
  const activeListings = (properties && properties.length > 0) ? properties : mockProperties;
  const featured = property || activeListings[0];

  const activeVideoUrl = featured?.videoUrl || (featured?.youtubeVideoId ? `https://www.youtube.com/embed/${featured.youtubeVideoId}?autoplay=1` : null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onBrowseAll) {
      onBrowseAll();
    } else {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (selectedRegion && selectedRegion !== 'All') params.set('region', selectedRegion);
      const queryStr = params.toString();
      navigate(queryStr ? `/properties?${queryStr}` : '/properties');
    }
  };

  const handleBrowseClick = () => {
    if (onBrowseAll) {
      onBrowseAll();
    } else {
      navigate('/properties');
    }
  };

  return (
    <div className="space-y-12 pb-12 w-full">
      {/* 1. HERO SECTION */}
      <section className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-10 pt-12 sm:pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Subtext, Search & Trust Badges */}
          <div className="lg:col-span-6 space-y-6">
            {/* Main Heading (<h1> - Refined Semi-Bold Weight & Contrast) */}
            <h1 
              className="text-4xl sm:text-5xl lg:text-[54px] font-semibold text-[#0F172A] tracking-tight leading-[1.12]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Transparent Property<br />
              Walkthroughs for<br />
              <span className="text-[#C59B27] font-semibold">Prime Estates.</span>
            </h1>

            {/* Body Subtext (<p>) */}
            <p className="text-base sm:text-lg text-slate-600 font-medium font-sans max-w-lg leading-relaxed">
              GrabMyKey connects serious buyers, NRI investors, and verified property owners directly across Mangaluru—backed by unedited video walkthroughs and direct title audits.
            </p>

            {/* Search Container & Trust Badges */}
            <div className="pt-2 max-w-xl space-y-4">
              <form onSubmit={handleSearchSubmit} className="p-2 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-3 flex-1 px-3 w-full">
                  <Search className="w-5 h-5 text-slate-400 shrink-0"/>
                  <input 
                    type="text"
                    placeholder="Locality, city, or property..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none font-sans"
                  />
                </div>
                
                <div className="relative shrink-0 border-t sm:border-t-0 sm:border-l border-slate-200">
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="appearance-none bg-transparent pl-3 pr-8 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 font-sans flex items-center gap-1 outline-none cursor-pointer"
                  >
                    <option value="All">All Regions</option>
                    <option value="Kadri">Kadri</option>
                    <option value="Surathkal">Surathkal</option>
                    <option value="Bejai">Bejai</option>
                    <option value="Kottara">Kottara</option>
                    <option value="Ullal">Ullal</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"/>
                </div>

                <button 
                  type="button"
                  onClick={handleBrowseClick}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0F172A] hover:bg-[#C59B27] text-white transition-colors text-xs font-bold font-sans tracking-wider shrink-0 cursor-pointer shadow-sm"
                >
                  BROWSE ALL
                </button>
              </form>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 text-xs font-bold text-slate-600 font-sans pt-1">
                <span>100% Title Audited</span>
                <span>Walkthrough Tours</span>
                <span>Direct Zero-Spam Deals</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Video Card (lg:col-span-6) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] min-h-[360px] flex flex-col justify-between p-6 select-none group w-full">
              {isPlaying && activeVideoUrl ? (
                <iframe
                  src={activeVideoUrl}
                  title="Property Video Walkthrough"
                  className="absolute inset-0 w-full h-full border-0 z-20"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  {/* Top Floating Pill Badges */}
                  <div className="flex items-center justify-between z-10">
                    <span className="px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-white tracking-wider border border-white/10 uppercase">
                      Featured Video Tour
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-white text-[10px] font-bold text-slate-900 uppercase tracking-widest shadow-sm">
                      EXCLUSIVE LISTING
                    </span>
                  </div>

                  {/* Center Play Control Button */}
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div 
                      onClick={() => {
                        if (activeVideoUrl) setIsPlaying(true);
                      }}
                      className={`w-16 h-16 rounded-full bg-slate-950/80 border border-white/20 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform ${activeVideoUrl ? 'cursor-pointer pointer-events-auto' : ''}`}
                    >
                      <Play className="w-6 h-6 fill-white ml-0.5"/>
                    </div>
                  </div>

                  {/* Video Background Cover & Dark Overlay */}
                  <img 
                    src={featured?.images?.[0] || featured?.galleryImages?.[0] || featured?.thumbnail || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80"} 
                    alt="Featured Property Walkthrough"
                    className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/40 pointer-events-none" />

                  {/* Bottom Sleek Floating Metadata Bar */}
                  <div className="z-10 p-4 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/10 flex items-center justify-between shadow-lg">
                    <div className="space-y-0.5 min-w-0 pr-3">
                      <h3 className="text-sm sm:text-base font-bold text-white font-serif truncate" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {featured?.title || "The Coastal Horizon Sea Villa"}
                      </h3>
                      <p className="text-xs text-slate-300 font-sans truncate">
                        {featured?.location || "Surathkal Beach, Mangaluru"} <span className="text-white font-semibold ml-1">• {featured?.price || (featured?.priceText ? `₹${featured.priceText}` : "₹3.85 Cr")}</span>
                      </p>
                    </div>

                    <Link 
                      to={featured?.slug ? `/property/${featured.slug}` : '/properties'} 
                      className="w-9 h-9 rounded-full bg-white/10 hover:bg-white hover:text-slate-900 flex items-center justify-center text-white shrink-0 group-hover:bg-[#C59B27] group-hover:text-slate-950 transition-all duration-200 cursor-pointer"
                      title="View Property"
                    >
                      <ArrowUpRight className="w-4 h-4"/>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 2. FEATURED PROPERTIES GRID SECTION */}
      {showGrid && (
        <section className="w-full max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-10 space-y-6 pt-4 pb-8">
          <div className="flex items-end justify-between border-b border-slate-200/60 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#C59B27] uppercase tracking-widest font-sans block">
                VERIFIED COLLECTION
              </span>
              <h2 
                className="text-2xl sm:text-3xl font-bold text-[#0F172A] font-serif"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Featured Properties
              </h2>
            </div>

            <Link className="text-xs font-bold text-[#C59B27] hover:text-amber-700 transition-colors font-sans flex items-center gap-1" to="/properties">
              View More Properties ({activeListings.length}) &gt;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeListings.slice(0, 4).map((property) => (
              <PropertyCard key={property.id || property._id || property.slug} property={property} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export { Home as HeroSection, Home };
