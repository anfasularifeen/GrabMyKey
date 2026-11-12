import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FeaturedProperties({ properties: initialProperties = [], isLoading = false }) {
  // Wipe default initial states: strictly start empty []
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    setProperties(Array.isArray(initialProperties) ? initialProperties : []);
  }, [initialProperties]);

  if (isLoading && properties.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between shadow-xs">
            <div className="h-56 bg-slate-100" />
            <div className="p-6 space-y-3">
              <div className="h-3 bg-slate-200 rounded w-1/3" />
              <div className="h-5 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-full" />
            </div>
            <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex justify-between items-center">
              <div className="h-5 bg-slate-200 rounded w-20" />
              <div className="h-4 bg-slate-100 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="py-14 px-6 rounded-3xl bg-white border border-slate-200/80 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#C59B27]/30 flex items-center justify-center mx-auto text-[#C59B27]">
          <Building2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-serif font-bold text-[#0F172A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          No Properties Listed Yet
        </h3>
        <p className="text-xs text-slate-500 font-sans max-w-md mx-auto leading-relaxed">
          No properties listed yet. Add a listing from admin panel.
        </p>
        <div className="pt-2">
          <Link
            to="/manage-345"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#0F172A] hover:bg-[#C59B27] text-white rounded-xl text-xs font-semibold transition-colors font-sans shadow-sm"
          >
            <span>Open Admin Panel</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {properties.slice(0, 4).map((property) => (
        <PropertyCard key={property.id || property._id || property.slug} property={property} />
      ))}
    </div>
  );
}

export { FeaturedProperties };

