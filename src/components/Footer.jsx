import React from 'react';

export default function Footer({ className = '' }) {
  return (
    <footer className={`bg-white border-t border-slate-200/80 py-6 px-8 text-xs text-slate-500 ${className}`}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Brand Tagline */}
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <span>GRAB MY KEY</span>
          <span className="text-slate-300 font-normal">|</span>
          <span className="text-slate-500 font-normal">Your Trusted Real Estate Partner</span>
        </div>

        {/* Clean Copyright Notice (No Executive Link) */}
        <div>
          © {new Date().getFullYear()} GrabMyKey. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
