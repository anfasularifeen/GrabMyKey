import React from 'react';

export default function ArchitecturalOverview({ description, highlights }) {
  const defaultHighlights = [
    "Verified Physical On-Site Inspection",
    "Clear Title & Encumbrance Verified",
    "Independent Access Road Frontage",
    "High-Growth Residential & Commercial Corridor"
  ];

  const highlightList = highlights && highlights.length > 0 ? highlights : defaultHighlights;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 md:p-8 space-y-6">
      {/* Header & Executive Narrative */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-[#C59B27] uppercase tracking-widest font-sans block">
          EXECUTIVE NARRATIVE
        </span>

        <h2 
          className="text-2xl md:text-3xl font-bold text-[#0F172A]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Architectural Overview
        </h2>

        <p className="text-sm md:text-base text-slate-600 leading-relaxed font-sans max-w-4xl">
          {description || "Verified property listing with on-site physical inspection and authenticated documentation across Mangaluru."}
        </p>
      </div>

      <div className="h-px bg-slate-100 w-full" />

      {/* Clean 4-Card Highlight Grid (No Sparkle Icons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {highlightList.map((item, idx) => {
          const labelText = typeof item === 'string' ? item : item.label;

          return (
            <div 
              key={idx}
              className="flex items-center justify-center text-center px-4 py-3.5 rounded-2xl bg-[#FAF8F5] border border-[#C59B27]/30 text-slate-800 shadow-2xs hover:border-[#C59B27] hover:bg-white transition-all cursor-default"
            >
              <span className="text-xs font-semibold font-sans leading-tight">
                {labelText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
