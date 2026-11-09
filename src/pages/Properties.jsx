import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProperties } from '../context/PropertyContext';
import { Search, MapPin, RefreshCw, Building2, Plus, Sparkles } from 'lucide-react';

export default function Properties({ 
  properties: externalProperties, 
  onRefresh, 
  isLoading = false,
  standalone = true 
}) {
  const navigate = useNavigate();
  const contextData = useProperties();
  const properties = externalProperties !== undefined ? externalProperties : contextData.properties;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const filteredProperties = useMemo(() => {
    if (!Array.isArray(properties)) return [];
    return properties.filter((prop) => {
      if (!prop) return false;
      const title = prop.title || '';
      const location = prop.location || prop.locality || '';
      const type = prop.type || prop.category || '';
      const locality = prop.locality || '';

      const matchesQuery = title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'All' || type === selectedType;
      const matchesRegion = selectedRegion === 'All' || 
                           location.toLowerCase().includes(selectedRegion.toLowerCase()) ||
                           locality.toLowerCase().includes(selectedRegion.toLowerCase());
      return matchesQuery && matchesType && matchesRegion;
    });
  }, [properties, searchQuery, selectedType, selectedRegion]);

  const content = (
    <section className="py-2 w-full space-y-8">
      {/* Directory Header Bar */}
      <div className="border-b border-slate-200/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27] font-sans">Directory</span>
          <h1 
            className="text-3xl font-serif text-slate-900 mt-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Property Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-sans">
            Browse verified luxury villas, commercial suites, plots, and heritage estates across Mangaluru.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/sell"
            className="inline-flex items-center space-x-1.5 text-xs text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-xl shadow-xs transition-all duration-200 cursor-pointer font-sans font-semibold"
          >
            <Plus className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>List Property</span>
          </Link>
          {onRefresh && (
            <button 
              onClick={onRefresh}
              disabled={isLoading}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-700 hover:text-slate-900 border border-slate-200/80 hover:border-[#C59B27]/40 bg-white px-3.5 py-2 rounded-xl shadow-xs self-start md:self-auto transition-all duration-200 cursor-pointer font-sans"
              title="Refresh database listings"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#C59B27]' : ''}`} />
              <span>Refresh</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by locality, city, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-slate-200/80 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#C59B27] transition-all duration-200 font-sans"
            />
          </div>
          <div>
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#C59B27] transition-all duration-200 cursor-pointer font-sans"
            >
              <option value="All">All Mangaluru Localities</option>
              <option value="Kadri">Kadri / Circuit House</option>
              <option value="Surathkal">Surathkal / Beach Road</option>
              <option value="Bejai">Bejai / Lalbagh</option>
              <option value="Attavar">Attavar / Falnir</option>
              <option value="Panambur">Panambur / Baikampady</option>
            </select>
          </div>
          <div>
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-slate-200/80 rounded-xl px-3 py-2.5 text-xs text-slate-700 focus:outline-none focus:border-[#C59B27] transition-all duration-200 cursor-pointer font-sans"
            >
              <option value="All">All Asset Types</option>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="Commercial">Commercial</option>
              <option value="Estate">Estate</option>
              <option value="Plot">Plot / Land</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties List or Elegant Editorial Coming Soon Placeholder */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs space-y-6 my-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-[#C59B27]/30 text-[10px] font-bold text-[#C59B27] uppercase tracking-widest font-sans">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Coming Soon • Mangaluru Verified Collection</span>
          </div>

          <div className="space-y-2">
            <h3 
              className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Exclusive Verified Walkthroughs Dropping Soon
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-sans max-w-lg mx-auto leading-relaxed">
              Our verified collection is curated on-site with direct title audits and unedited 4K video walkthroughs. New prime residential villas, apartments, plots, and commercial estates across Mangaluru are arriving shortly.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all duration-200 shadow-xs hover:shadow-md font-sans uppercase tracking-wider cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#C59B27]" />
              <span>List Your Property</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-6 py-3.5 rounded-xl border border-slate-200/80 transition-all duration-200 font-sans uppercase tracking-wider cursor-pointer"
            >
              <span>Concierge Inquiries</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map((prop) => (
            <div 
              key={prop._id || prop.id}
              className="bg-white border border-slate-200/80 hover:border-[#C59B27]/40 rounded-2xl overflow-hidden transition-all duration-200 group flex flex-col justify-between shadow-xs hover:shadow-lg relative"
            >
              <div 
                onClick={() => navigate(`/property/${prop.slug || prop._id || prop.id}`)} 
                className="cursor-pointer"
              >
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img 
                    src={prop.images?.[0] || prop.galleryImages?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'} 
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/95 text-slate-900 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border border-slate-200/80 shadow-2xs font-sans">
                      {prop.badge || prop.type || prop.category || 'Prime Listing'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center text-xs text-slate-500 space-x-1 mb-2 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>{prop.location || prop.locality || 'Mangaluru'}</span>
                  </div>
                  <h3 
                    className="text-lg font-serif font-bold text-slate-900 mb-2 group-hover:text-[#C59B27] transition-colors duration-200"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {prop.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-sans">
                    {prop.description || 'Verified property listing ready for on-site inspection.'}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <span className="block text-[9px] uppercase text-slate-400 font-semibold font-sans">Asking Price</span>
                  <span className="text-xl font-serif font-bold text-[#C59B27]">
                    {prop.price || (prop.pricing?.expectedPrice ? (prop.pricing.expectedPrice >= 10000000 ? `₹${(prop.pricing.expectedPrice / 10000000).toFixed(2)} Cr` : `₹${(prop.pricing.expectedPrice / 100000).toFixed(1)} L`) : 'Price on Request')}
                  </span>
                </div>
                <button 
                  onClick={() => navigate(`/property/${prop.slug || prop._id || prop.id}`)}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-900 hover:text-[#C59B27] transition-colors duration-200 cursor-pointer font-sans"
                >
                  <span>View More →</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  if (!standalone) {
    return content;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 font-sans antialiased flex flex-col justify-between selection:bg-[#C59B27]/20 selection:text-[#C59B27]">
      <Navbar activeView="properties" />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-10">
        {content}
      </main>
      <Footer />
    </div>
  );
}

