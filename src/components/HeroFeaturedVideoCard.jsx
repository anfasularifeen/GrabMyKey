import React, { useState } from 'react';
import { Play, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroFeaturedVideoCard({ property = null }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [featuredProperty, setFeaturedProperty] = useState(null);

  const activeProperty = property || featuredProperty;
  if (!activeProperty) return null;

  const item = {
    title: activeProperty.title || "Exclusive Estate",
    location: activeProperty.location || (activeProperty.locality ? `${activeProperty.locality}, ${activeProperty.city || 'Mangaluru'}` : "Mangaluru"),
    priceText: activeProperty.priceText || (activeProperty.price ? String(activeProperty.price).replace(/^₹/, '').replace(/ •.*/, '') : ''),
    videoUrl: activeProperty.videoUrl || (activeProperty.youtubeVideoId ? `https://www.youtube.com/embed/${activeProperty.youtubeVideoId}?autoplay=1` : null),
    thumbnail: activeProperty.thumbnail || activeProperty.images?.[0] || activeProperty.galleryImages?.[0] || '',
    slug: activeProperty.slug || activeProperty._id || activeProperty.id
  };

  return (
    <div className="relative w-full max-w-xl rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 shadow-xl aspect-[16/11] flex flex-col justify-between p-6">
      
      {isPlaying && item.videoUrl ? (
        <iframe
          src={item.videoUrl}
          title="Property Video Walkthrough"
          className="absolute inset-0 w-full h-full border-0 z-20"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          {/* Background Poster */}
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.title || "Featured Property Walkthrough"}
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-black/30 z-0" />

          {/* Top Badges */}
          <div className="relative z-10 flex justify-between items-center">
            <span className="px-3 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[11px] font-medium text-white border border-white/10 font-sans">
              Featured Video Tour
            </span>
            <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-slate-900 uppercase tracking-wider font-sans">
              EXCLUSIVE LISTING
            </span>
          </div>

          {/* Centered Circular Play Button */}
          {item.videoUrl && (
            <div className="relative z-10 flex items-center justify-center my-auto">
              <button
                onClick={() => setIsPlaying(true)}
                aria-label="Play Property Video Walkthrough"
                className="w-16 h-16 rounded-full bg-slate-900/80 text-white flex items-center justify-center border border-white/20 shadow-2xl hover:scale-110 hover:bg-slate-900 transition-all cursor-pointer"
              >
                <Play className="w-6 h-6 fill-current ml-0.5"/>
              </button>
            </div>
          )}

          {/* Bottom Glassmorphism Property Overlay */}
          <div className="relative z-10 p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 flex items-center justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <h3 className="text-base font-bold text-white tracking-tight truncate" style={{ fontFamily: "'Playfair Display', Georgia, serif", textTransform: 'none' }}>
                {item.title}
              </h3>
              <p className="text-xs text-slate-300 font-sans truncate">
                {item.location} {item.priceText ? <span className="text-white font-semibold">• ₹{item.priceText}</span> : ''}
              </p>
            </div>

            <Link 
              className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-950 transition-colors shrink-0 cursor-pointer" 
              title="View Property" 
              to={item.slug ? `/property/${item.slug}` : '/properties'}
            >
              <ArrowUpRight className="w-4 h-4"/>
            </Link>
          </div>
        </>
      )}

    </div>
  );
}

export default HeroFeaturedVideoCard;
