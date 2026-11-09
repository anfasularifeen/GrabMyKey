import React, { useState } from 'react';
import { Layers, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function PropertySpecifications({ specifications = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const specsList = Array.isArray(specifications) ? specifications : [];
  const visibleSpecs = isExpanded ? specsList : specsList.slice(0, 3);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Clean Header (Removed '100% Physical On-Site Verified' Badge) */}
      <div className="p-6 md:p-8 bg-[#FAF8F5] border-b border-slate-200/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-[#C59B27] shrink-0">
            <Layers className="w-5 h-5"/>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#C59B27] uppercase tracking-widest font-sans block">
              ESTATE SPECIFICATIONS
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Property Features & Amenity Overview
            </h2>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6">Specification / Feature</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-sans">
            {specsList.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-slate-500 font-sans">
                  No specifications currently recorded for this property.
                </td>
              </tr>
            ) : (
              visibleSpecs.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="inline-block px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-[#0F172A] whitespace-nowrap">
                    {item.feature}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
                      <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]"/>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 leading-relaxed max-w-lg">
                    {item.details}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Simplified Toggle Button Footer */}
      {specsList.length > 3 && (
        <div className="p-4 bg-slate-50/70 border-t border-slate-200/60 flex justify-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-[#C59B27]/40 text-[#0F172A] hover:border-[#C59B27] hover:bg-[#FAF8F5] transition-all text-xs font-bold font-sans shadow-xs cursor-pointer"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-4 h-4 text-[#C59B27]"/>
              </>
            ) : (
              <>
                View All ({specsList.length}) <ChevronDown className="w-4 h-4 text-[#C59B27]"/>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
