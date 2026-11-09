import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Video, Phone } from 'lucide-react';

export default function Navbar({ activeView, onNavigate }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = onNavigate || navigate;
  const currentView = activeView || (
    location.pathname === '/properties' ? 'properties' :
    (location.pathname === '/legal' || location.pathname === '/legal-standards') ? 'legal' :
    location.pathname === '/contact' ? 'contact' :
    location.pathname === '/sell' ? 'sell' : 'home'
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="w-full px-6 lg:px-12 max-w-none h-20 flex items-center justify-between">
        {/* Brand Logo & Tagline Wrapper */}
        <Link className="flex items-center gap-3 group" to="/">
          {/* Icon Mark Box */}
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center p-2 group-hover:border-[#C59B27]/40 transition-colors">
            <img src="/logo.png" onError={(e) => { e.currentTarget.src = "/logo-icon.svg"; }} alt="GrabMyKey" className="w-full h-full object-contain" />
          </div>

          {/* Brand Name & Tagline - Tightened Vertical Spacing */}
          <div className="flex flex-col gap-0 justify-center">
            <div 
              className="text-lg font-extrabold tracking-tight font-serif leading-none flex items-center gap-1.5 text-slate-900"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <span>GRAB</span>
              <span className="text-[#C59B27]">MY</span>
              <span>KEY</span>
            </div>
            <span className="text-[9px] font-bold text-[#C59B27] uppercase tracking-widest font-sans leading-tight mt-0.5">
              YOUR TRUSTED REAL ESTATE PARTNER
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-700 font-sans">
          <Link className="hover:text-[#C59B27] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27]" to="/">
            Home
          </Link>

          <Link className="hover:text-[#C59B27] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27]" to="/properties">
            Properties
          </Link>

          <Link className="hover:text-[#C59B27] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27]" to="/legal-standards">
            Legal Standards
          </Link>

          <Link className="hover:text-[#C59B27] transition-colors py-1 border-b-2 border-transparent hover:border-[#C59B27]" to="/contact">
            Contact
          </Link>
        </nav>

        {/* Header Action CTAs */}
        <div className="flex items-center space-x-3">
          <button 
            type="button"
            onClick={() => handleNavigate('/sell')}
            className="hidden sm:flex items-center space-x-1.5 border border-slate-300 hover:border-[#0a1d37] text-slate-700 hover:text-[#0a1d37] px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
          >
            <span>List Property</span>
          </button>

          <a 
            href="https://wa.me/919876543210?text=Hello%20GrabMyKey,%20I%20would%20like%20to%20schedule%20a%20private%20tour."
            target="_blank"
            rel="noreferrer"
            className="bg-[#0a1d37] hover:bg-[#061224] text-white px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer shadow-sm flex items-center space-x-2"
          >
            <Phone className="w-3.5 h-3.5 text-[#e6ca65]" />
            <span>Schedule a Tour</span>
          </a>
        </div>
      </div>
    </header>
  );
}

