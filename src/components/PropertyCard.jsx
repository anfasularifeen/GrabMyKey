import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function PropertyCard({ property }) {
  if (!property) return null;

  const propId = property.id || property._id || property.slug || '1';
  const propSlug = property.slug || propId;
  const propTitle = property.title || 'Prime Property';
  const propLocation = property.location || property.locality || 'Mangaluru';
  const propBadge = property.badge || property.category || property.type || 'Prime Listing';
  const propDescription = property.description || 'Verified luxury property ready for on-site inspection and video walkthrough.';

  // Image handling with safe fallbacks
  const propImage = property.images?.[0] || property.galleryImages?.[0] || property.thumbnail || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80";

  // Price formatting
  const propPrice = property.price || (
    property.pricing?.expectedPrice
      ? (property.pricing.expectedPrice >= 10000000 
          ? `₹${(property.pricing.expectedPrice / 10000000).toFixed(2)} Cr` 
          : `₹${(property.pricing.expectedPrice / 100000).toFixed(1)} L`)
      : 'Price on Request'
  );

  return (
    <div className="bg-white border border-slate-200/80 hover:border-[#C59B27]/40 rounded-2xl overflow-hidden transition-all duration-200 group flex flex-col justify-between shadow-xs hover:shadow-xl">
      <Link to={`/property/${propSlug}`} className="block">
        <div className="relative h-56 overflow-hidden bg-slate-100">
          <img 
            src={propImage} 
            alt={propTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-white/95 text-[#0a1d37] font-semibold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#0a1d37]/20 shadow-xs font-sans">
              {propBadge}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center text-xs text-slate-500 space-x-1 mb-2 font-sans">
            <MapPin className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>{propLocation}</span>
          </div>
          <h3 
            className="text-lg font-serif font-medium text-[#0a1d37] mb-2 group-hover:text-[#C59B27] transition-colors"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {propTitle}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-sans">
            {propDescription}
          </p>
        </div>
      </Link>

      <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <span className="block text-[9px] uppercase text-slate-400 font-semibold font-sans">Asking Price</span>
          <span className="text-xl font-serif font-bold text-[#C59B27]">
            {propPrice}
          </span>
        </div>
        <Link 
          to={`/property/${propSlug}`}
          className="text-xs font-semibold text-[#0a1d37] hover:text-[#C59B27] flex items-center space-x-1 transition-colors font-sans"
        >
          <span>View More →</span>
        </Link>
      </div>
    </div>
  );
}

export { PropertyCard };

