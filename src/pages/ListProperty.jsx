import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UploadCloud, X, Image as ImageIcon, CheckCircle, Send } from 'lucide-react';
import { submitLead } from '../api';
import { useProperties } from '../context/PropertyContext';

export default function ListProperty() {
  const { addProperty } = useProperties();
  const [formData, setFormData] = useState({
    ownerName: '',
    phone: '',
    locality: '',
    assetCategory: 'Villa',
    expectedPrice: '',
    overview: ''
  });

  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setImages((prev) => [...prev, ...newPreviews]);
  };

  // Drag-and-drop file upload handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const newPreviews = files.map((file) => ({
        file,
        url: URL.createObjectURL(file)
      }));
      setImages((prev) => [...prev, ...newPreviews]);
    }
  };

  // Remove individual image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitLead({
        ownerName: formData.ownerName,
        phone: formData.phone,
        location: formData.locality,
        assetType: formData.assetCategory,
        expectedPrice: formData.expectedPrice,
        details: formData.overview
      });
    } catch {
      // Handled gracefully if backend server is offline
    }

    // Dynamic state insertion: append new listing directly into active property state
    const cleanPrice = formData.expectedPrice ? (formData.expectedPrice.startsWith('₹') ? formData.expectedPrice : `₹${formData.expectedPrice}`) : 'Price on Request';
    const cleanLocation = formData.locality ? `${formData.locality}, Mangaluru` : 'Mangaluru';
    const cleanTitle = `${formData.locality || 'Mangaluru'} ${formData.assetCategory || 'Residence'}`;
    const cleanImages = images.length > 0 ? images.map(img => img.url) : [];

    addProperty({
      title: cleanTitle,
      category: formData.assetCategory || 'Villa',
      type: formData.assetCategory || 'Villa',
      locality: formData.locality || 'Mangaluru',
      location: cleanLocation,
      city: 'Mangaluru',
      price: cleanPrice,
      description: formData.overview || `${formData.assetCategory} in ${formData.locality}, Mangaluru ready for physical inspection.`,
      badge: 'NEW LISTING',
      images: cleanImages,
      galleryImages: cleanImages,
      ownerName: formData.ownerName,
      phone: formData.phone,
      pricing: {
        expectedPrice: parseInt((formData.expectedPrice || '').replace(/[^0-9]/g, '')) || 10000000,
        isNegotiable: true
      },
      specs: {
        bedrooms: formData.assetCategory === 'Plot' ? 0 : 3,
        bathrooms: formData.assetCategory === 'Plot' ? 0 : 3,
        carpetAreaSqFt: 2200,
        furnishingStatus: 'Semi-Furnished'
      }
    });

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <Navbar/>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-xs w-full space-y-8">
          
          {/* Header */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-amber-700 tracking-widest uppercase">
              Property Owner Portal
            </span>
            <h1 className="text-3xl font-serif text-slate-900 tracking-tight">
              List Your Property on GrabMyKey
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
              Submit property details below. Our team will verify legal titles, conduct an on-site property walkthrough, and publish the listing with zero upfront marketing charges.
            </p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-2xl text-center space-y-4">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto"/>
              <h3 className="font-bold text-base">Property Listed Successfully</h3>
              <p className="text-xs text-emerald-700 max-w-md mx-auto">
                Your property listing has been added to the directory. Our team will verify legal titles and contact you directly to schedule an on-site walkthrough in Mangaluru.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <Link
                  to="/properties"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all duration-200 font-sans"
                >
                  <span>View in Directory</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      ownerName: '',
                      phone: '',
                      locality: '',
                      assetCategory: 'Villa',
                      expectedPrice: '',
                      overview: ''
                    });
                    setImages([]);
                  }}
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl border border-slate-200 transition-all duration-200 font-sans cursor-pointer"
                >
                  <span>List Another Property</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Owner / Representative Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              {/* Row 2: Locality, Category & Price */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Locality & City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bejai, Mangaluru"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Asset Category
                  </label>
                  <select
                    value={formData.assetCategory}
                    onChange={(e) => setFormData({ ...formData, assetCategory: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800 cursor-pointer"
                  >
                    <option value="Villa">Villa / Independent House</option>
                    <option value="Apartment">Apartment / Flat</option>
                    <option value="Plot">Residential Plot / Land</option>
                    <option value="Commercial">Commercial Space</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Expected Price (Approx.)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹1.50 Cr"
                    value={formData.expectedPrice}
                    onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              {/* Overview Textarea */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Property Overview & Key Highlights
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention area (sq ft), floor level, available documents (RTC/Khata), key amenities..."
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800 resize-none"
                />
              </div>

              {/* Image Upload Dropzone */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Property Photos / Layout Plans (Optional)
                </label>
                
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed ${isDragging ? 'border-amber-500 bg-amber-50/40' : 'border-slate-200 bg-[#FAF8F5]'} rounded-2xl p-6 hover:border-amber-400 transition-colors text-center cursor-pointer`}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                      <UploadCloud className="w-5 h-5"/>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Click to upload or drag and drop photos
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        PNG, JPG or WEBP up to 10MB each
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mt-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 group h-20 bg-slate-100">
                        <img src={img.url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-slate-900/80 hover:bg-red-600 text-white p-1 rounded-full transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3"/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs uppercase tracking-wider cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-amber-400"/>
                Submit Onboarding Request
              </button>

            </form>
          )}

        </div>
      </main>

      {/* Clean Footer (No Executive Login) */}
      <Footer />
    </div>
  );
}

