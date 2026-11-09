import React from 'react';

export default function ArchitecturalOverview({ description, highlights }) {
  const highlightList = Array.isArray(highlights) ? highlights : [];

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

        {description && (
          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-sans max-w-4xl">
            {description}
          </p>
        )}
      </div>

      {highlightList.length > 0 && (
        <>
          <div className="h-px bg-slate-100 w-full" />

          {/* Clean Highlight Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {highlightList.map((item, idx) => {
              const labelText = typeof item === 'string' ? item : item?.label || '';
              if (!labelText) return null;

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
        </>
      )}
    </div>
  );
}
