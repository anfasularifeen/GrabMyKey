import React from 'react';
import { LogOut } from 'lucide-react';

const TAB_LABELS = {
  overview: 'Dashboard',
  inventory: 'Property Inventory',
  leads: 'Owner Lead Queue',
  'publish-listing': 'Publish / Edit Listing',
  'hero-settings': 'Hero Video Settings',
  'master-presets': 'System Presets & Config'
};

export default function Navbar({ activeTab, onNewListing, onExit }) {
  const currentLabel = TAB_LABELS[activeTab] || 'Dashboard';

  return (
    <header className="h-16 bg-white border-b border-neutral-200/80 px-8 flex items-center justify-between sticky top-0 z-40 shadow-xs shrink-0">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs font-medium">
        <span className="text-neutral-400">Admin</span>
        <span className="text-neutral-300">/</span>
        <span className="text-neutral-900 font-semibold">{currentLabel}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Primary Action Button */}
        <button
          type="button"
          onClick={onNewListing}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-2 border border-slate-800 cursor-pointer"
        >
          <span className="text-amber-400 font-bold text-sm">+</span>
          <span>New Listing</span>
        </button>

        {/* Secondary Action Button */}
        <button
          type="button"
          onClick={onExit}
          className="border border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-semibold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>EXIT CONSOLE</span>
        </button>
      </div>
    </header>
  );
}
