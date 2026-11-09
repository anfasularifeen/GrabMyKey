import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  PlusCircle,
  Video,
  FolderCog,
  LogOut
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  onTabSwitch,
  onNewListing,
  propertiesCount = 0,
  newLeadsCount = 0,
  presetsCount = 0,
  onExit
}) {
  const navItems = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: LayoutDashboard,
      onClick: () => onTabSwitch('overview')
    },
    {
      id: 'inventory',
      label: 'Property Inventory',
      icon: Building2,
      count: propertiesCount,
      onClick: () => onTabSwitch('inventory')
    },
    {
      id: 'leads',
      label: 'Owner Lead Queue',
      icon: Users,
      badgeText: newLeadsCount > 0 ? `${newLeadsCount} New` : null,
      count: newLeadsCount > 0 ? null : 0,
      onClick: () => onTabSwitch('leads')
    },
    {
      id: 'publish-listing',
      label: 'Publish / Edit Listing',
      icon: PlusCircle,
      onClick: onNewListing
    },
    {
      id: 'hero-settings',
      label: 'Hero Video Settings',
      icon: Video,
      onClick: () => onTabSwitch('hero-settings')
    },
    {
      id: 'master-presets',
      label: 'System Presets & Config',
      icon: FolderCog,
      count: presetsCount,
      onClick: () => onTabSwitch('master-presets')
    }
  ];

  return (
    <aside className="bg-slate-50/70 border-r border-neutral-200/80 w-64 min-h-screen flex flex-col justify-between p-4 shrink-0">
      <div>
        {/* Header Branding */}
        <div className="flex items-center gap-3 px-2 py-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/90 shadow-xs p-1.5 flex items-center justify-center overflow-hidden shrink-0">
            <img 
              src="/logo.png" 
              alt="GrabMyKey" 
              className="w-full h-full object-contain"
              onError={(e) => { 
                e.target.style.display = 'none'; 
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'block'; 
              }}
            />
            <span style={{ display: 'none' }} className="text-[10px] font-bold font-serif text-slate-900">
              GMK
            </span>
          </div>
          <div>
            <span className="font-serif font-bold text-slate-900 text-lg tracking-wider block leading-tight">
              GRAB<span className="text-amber-500">MY</span>KEY
            </span>
            <span className="text-[11px] font-medium tracking-wider text-slate-400 block">
              Admin
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badgeText && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.badgeText}
                  </span>
                )}

                {item.count !== undefined && item.count !== null && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-slate-800 text-slate-200'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Action: EXIT CONSOLE */}
      <div className="pt-4 border-t border-slate-200/80">
        <button
          type="button"
          onClick={onExit}
          className="w-full text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-lg py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>EXIT CONSOLE</span>
        </button>
      </div>
    </aside>
  );
}
