import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <Navbar/>

      <main className="max-w-5xl mx-auto px-6 py-12 flex-1 w-full flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-xs w-full">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Left Sidebar: Operational Details (No Physical Address) */}
            <div className="md:col-span-5 space-y-8 border-b md:border-b-0 md:border-r border-slate-100 pb-8 md:pb-0 md:pr-8">
              
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-amber-700 tracking-widest uppercase">
                  Concierge & Inquiries
                </span>
                <h1 className="text-3xl font-serif text-slate-900 tracking-tight">
                  Contact GrabMyKey
                </h1>
              </div>

              {/* Service Region (No Physical Office) */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-amber-600"/>
                  Primary Coverage Area
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  Mangaluru, Karnataka
                </p>
                <p className="text-xs text-slate-500">
                  On-site inspections & private site tours available across all primary localities.
                </p>
              </div>

              {/* Inquiries / Direct Email */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Mail className="w-3.5 h-3.5 text-amber-600"/>
                  Inquiries & Inspection
                </div>
                <a 
                  href="mailto:contact@grabmykey.in" 
                  className="text-sm font-bold text-amber-700 hover:text-amber-800 transition-colors block"
                >
                  contact@grabmykey.in
                </a>
              </div>

              {/* Business Model Clarification */}
              <div className="space-y-1.5 bg-[#FAF8F5] p-4 rounded-xl border border-slate-200/60">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Owner & Buyer Advisory
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Verified Property Walkthroughs • Direct Owner Pricing • Zero upfront marketing charges for listing owners.
                </p>
              </div>

            </div>

            {/* Right Side: Inquiry Form */}
            <div className="md:col-span-7 flex flex-col justify-center">
              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-2">
                  <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto"/>
                  <h3 className="font-bold text-sm">Inquiry Received</h3>
                  <p className="text-xs text-emerald-700">
                    Our team will reach out directly via phone or WhatsApp regarding your property request.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Shetty"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">How can we assist you?</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Specify property location, buy/rental inquiry, or site tour scheduling..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-slate-800 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400"/>
                    SEND INQUIRY
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </main>

      {/* Clean Footer */}
      <Footer />
    </div>
  );
}

