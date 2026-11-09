import React from 'react';
import { Bed, Bath } from 'lucide-react';

export default function PropertySummaryCard({ property = {} }) {
  const isLand = (property?.type || '').toLowerCase().includes('land') || 
                 (property?.type || '').toLowerCase().includes('plot') ||
                 (property?.category || '').toLowerCase().includes('land') || 
                 (property?.category || '').toLowerCase().includes('plot');

  if (isLand) {
    return (
      <div className="grid grid-cols-2 gap-3 my-6">
        {/* Plot Area */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
            PLOT AREA
          </span>
          <p className="text-sm font-bold text-[#0F172A] font-sans">
            {property.plotArea || property.superArea || property.area || "Not Specified"}
          </p>
        </div>

        {/* Boundary Wall / Fencing */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
            BOUNDARY / FENCING
          </span>
          <p className="text-sm font-bold text-[#0F172A] font-sans">
            {property.boundary || "Not Specified"}
          </p>
        </div>

        {/* Zoning / Land Use */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
            ZONING TYPE
          </span>
          <p className="text-sm font-bold text-[#0F172A] font-sans">
            {property.zoning || "Not Specified"}
          </p>
        </div>

        {/* Road Ingress / Frontage */}
        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
            ROAD FRONTAGE
          </span>
          <p className="text-sm font-bold text-[#0F172A] font-sans">
            {property.roadWidth || "Not Specified"}
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
          {property.bedrooms ?? property.beds ?? "N/A"}
        </p>
      </div>

      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
          BATHROOMS
        </span>
        <p className="text-sm font-bold text-[#0F172A] font-sans flex items-center gap-1.5">
          <Bath className="w-4 h-4 text-[#C59B27]"/>
          {property.bathrooms ?? property.baths ?? "N/A"}
        </p>
      </div>

      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
          SUPER AREA
        </span>
        <p className="text-sm font-bold text-[#0F172A] font-sans">
          {property.superArea || property.builtUpArea || property.area}
        </p>
      </div>

      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-slate-200/60 space-y-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans block">
          FURNISHING
        </span>
        <p className="text-sm font-bold text-[#0F172A] font-sans">
          {property.furnishing || property.specs?.furnishingStatus || "Unfurnished"}
        </p>
      </div>
    </div>
  );
}

