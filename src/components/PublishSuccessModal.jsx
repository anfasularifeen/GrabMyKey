import React, { useEffect } from 'react';
import { CheckCircle2, Eye, ArrowLeft, ExternalLink, X, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PublishSuccessModal({
  isOpen,
  onClose,
  property,
  onViewProperty,
  onBackToInventory
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !property) return null;

  const propId = property.id || property._id || '';
  const propSlug = property.slug || propId;
  const propListingCode = property.listingCode || (
    propId ? `GMK-MLR-${String(propId).replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase()}` : 'GMK-MLR-101'
  );
  const propLocation = property.locality 
    ? `${property.locality}, ${property.city || 'Mangaluru'}`
    : (property.location || 'Mangaluru, Karnataka');

  const handleView = () => {
    if (onViewProperty) {
      onViewProperty(property);
    } else {
      navigate(`/property/${propSlug}`);
    }
    if (onClose) onClose();
  };

  const handleBack = () => {
    if (onBackToInventory) {
      onBackToInventory();
    } else {
      navigate('/admin');
    }
    if (onClose) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBack}
    >
      <div
        className="bg-[#FAF8F5] text-[#1A1A1A] border border-amber-200/80 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleBack}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 md:p-8 text-center">
          {/* Animated Gold Checkmark Badge */}
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full bg-amber-100/80 animate-ping opacity-25" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#b8860b]/20 to-amber-100 border-2 border-[#C59B27] flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-10 h-10 text-[#C59B27] stroke-[2.2]" />
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#C59B27] block mb-1">
            EXECUTIVE PUBLISHER • LIVE CONFIRMATION
          </span>
          <h2 className="font-serif font-bold text-2xl md:text-3xl text-[#0F1E36] tracking-tight">
            Listing Published Live!
          </h2>
          <p className="text-xs text-slate-600 mt-2 max-w-sm mx-auto leading-relaxed">
            The property listing has been recorded in the database and is now live on the GrabMyKey storefront.
          </p>

          {/* Property Summary Card */}
          <div className="mt-6 p-4 bg-white border border-slate-200/90 rounded-2xl text-left shadow-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-50 text-[#C59B27] border border-amber-200 text-[10px] font-bold tracking-wider font-mono">
                {property.category || property.type || 'LUXURY ASSET'}
              </span>
              <span className="font-mono text-xs font-bold text-[#0F1E36]">
                Ref: {propListingCode}
              </span>
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-[#0F1E36] truncate">
                {property.title}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                <span className="truncate">{propLocation}</span>
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Asking Price:</span>
              <span className="font-serif font-bold text-lg text-[#C59B27]">
                {property.price || (property.pricing?.expectedPrice ? `₹${property.pricing.expectedPrice.toLocaleString('en-IN')}` : 'Price on Request')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleView}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#C59B27] hover:bg-[#b0881e] text-white transition-all shadow-md cursor-pointer border border-[#C59B27]/50 flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>View Property</span>
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-white hover:bg-slate-100 text-[#0F1E36] border border-slate-300 transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Back to Inventory</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

