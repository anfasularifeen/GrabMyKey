import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Building2 } from 'lucide-react';

export default function PropertyImageGallery({ 
  images = [], 
  selectedImage: externalSelectedImage, 
  setSelectedImage: externalSetSelectedImage 
}) {
  const [internalSelectedImage, setInternalSelectedImage] = useState(0);
  const selectedImage = externalSelectedImage !== undefined ? externalSelectedImage : internalSelectedImage;
  const setSelectedImage = externalSetSelectedImage || setInternalSelectedImage;

  const [showZoom, setShowZoom] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, percentageX: 0, percentageY: 0 });
  const imageRef = useRef(null);

  const galleryImages = Array.isArray(images) && images.length > 0 ? images : [];
  const currentImage = galleryImages[selectedImage] || galleryImages[0] || '';

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const percentageX = Math.max(0, Math.min(100, (x / width) * 100));
    const percentageY = Math.max(0, Math.min(100, (y / height) * 100));

    setZoomPos({ x, y, percentageX, percentageY });
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setSelectedImage((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setSelectedImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Keyboard navigation for full-screen modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      if (e.key === 'Escape') setIsModalOpen(false);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, galleryImages.length]);

  if (galleryImages.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-[#0F172A] font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Photos
        </h3>
        <div className="relative h-[320px] rounded-2xl bg-slate-100 border border-slate-200/80 flex flex-col items-center justify-center text-slate-400">
          <Building2 className="w-10 h-10 mb-2 stroke-[1.5]" />
          <span className="text-xs font-sans font-medium uppercase tracking-wider">No Gallery Images Uploaded</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Clean Simplified Gallery Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-[#0F172A] font-serif" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Photos
        </h3>
        <span className="text-xs text-slate-500 font-sans font-medium">
          Photo {selectedImage + 1} of {galleryImages.length}
        </span>
      </div>

      {/* Main Image Viewport with Redesigned Expand Button */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div 
          ref={imageRef}
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
          onMouseMove={handleMouseMove}
          onClick={() => {
            setShowZoom(false);
            setIsModalOpen(true);
          }}
          className="lg:col-span-12 relative h-[420px] rounded-2xl overflow-hidden bg-slate-900 cursor-pointer border border-slate-200 shadow-xs select-none group"
        >
          <img
            src={currentImage}
            alt="Property High-Res Capture"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
          />

          {/* Hover Magnifier Glass Box */}
          {showZoom && (
            <div 
              className="absolute w-36 h-36 border-2 border-[#C59B27] bg-[#C59B27]/20 backdrop-blur-3xs pointer-events-none rounded-lg shadow-lg hidden lg:block"
              style={{
                left: `${zoomPos.x - 72}px`,
                top: `${zoomPos.y - 72}px`,
              }}
            />
          )}

          {/* Redesigned Floating "Click to Expand" Button (Only Bottom Right) */}
          <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-[#C59B27] border border-[#C59B27]/40 backdrop-blur-md text-xs font-semibold font-sans shadow-md group-hover:bg-slate-950 transition-all">
              <Maximize2 className="w-3.5 h-3.5 text-[#C59B27]"/>
              Click to Expand
            </span>
          </div>
        </div>

        {/* Desktop Side Zoom Window Overlay */}
        {showZoom && (
          <div className="absolute top-0 left-full ml-4 w-[500px] h-[420px] rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-950 shadow-2xl z-40 pointer-events-none hidden lg:block">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${currentImage})`,
                backgroundPosition: `${zoomPos.percentageX}% ${zoomPos.percentageY}%`,
                backgroundSize: '250%',
                backgroundRepeat: 'no-repeat'
              }}
            />
          </div>
        )}
      </div>

      {/* Thumbnail Selector Strip (Inset Gold Outline Fix) */}
      {galleryImages.length > 0 && (
        <div className="flex items-center gap-3 overflow-x-auto py-3 px-2">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative w-20 h-14 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer shrink-0 p-[2px] ${
                selectedImage === idx 
                  ? 'bg-[#C59B27] shadow-md scale-105' 
                  : 'bg-transparent opacity-60 hover:opacity-100 hover:scale-102'
              }`}
            >
              <div className="w-full h-full rounded-[10px] overflow-hidden bg-white">
                <img 
                  src={img} 
                  alt={`Thumbnail ${idx + 1}`} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* CLEAN FULL-SCREEN LIGHTBOX MODAL */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-[#FAF8F5]/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200 select-none"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Top Controls Header */}
          <div className="flex items-center justify-between text-slate-800 z-10">
            {/* Clean Photo Counter (No 'Fullscreen View' label) */}
            <span className="text-xs font-bold text-slate-600 font-sans tracking-wide">
              Photo {selectedImage + 1} of {galleryImages.length}
            </span>

            {/* Floating Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 transition-all cursor-pointer border border-slate-200 shadow-md hover:scale-105"
              title="Close (Esc)"
            >
              <X className="w-5 h-5"/>
            </button>
          </div>

          {/* Centered Main Image with Navigation Arrows */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* Left Arrow */}
            {galleryImages.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 z-20 p-3.5 rounded-full bg-white/90 hover:bg-white text-slate-900 border border-slate-200/80 shadow-xl transition-all hover:scale-110 cursor-pointer"
                title="Previous Image"
              >
                <ChevronLeft className="w-5 h-5"/>
              </button>
            )}

            {/* Active Expanded Image */}
            <img
              src={currentImage}
              alt="Expanded Property High-Res View"
              onClick={(e) => e.stopPropagation()}
              className="max-h-[82vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl border border-slate-200/40"
            />

            {/* Right Arrow */}
            {galleryImages.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-6 z-20 p-3.5 rounded-full bg-white/90 hover:bg-white text-slate-900 border border-slate-200/80 shadow-xl transition-all hover:scale-110 cursor-pointer"
                title="Next Image"
              >
                <ChevronRight className="w-5 h-5"/>
              </button>
            )}
          </div>

          {/* Fullscreen Modal Bottom Thumbnail Strip (Inset Gold Ring Fix) */}
          <div 
            className="flex items-center justify-center gap-3 overflow-x-auto py-3 px-2 z-10 max-w-2xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-16 h-12 rounded-xl overflow-hidden transition-all duration-200 cursor-pointer shrink-0 p-[2px] ${
                  selectedImage === idx 
                    ? 'bg-[#C59B27] shadow-md scale-105' 
                    : 'bg-transparent opacity-50 hover:opacity-100 hover:scale-102'
                }`}
              >
                <div className="w-full h-full rounded-[10px] overflow-hidden bg-white">
                  <img 
                    src={img} 
                    alt={`Modal Thumbnail ${idx + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
