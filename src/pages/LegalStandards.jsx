import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ShieldCheck, CheckCircle, CheckCircle2 } from 'lucide-react';

export default function LegalStandards() {
  const verificationSteps = [
    {
      step: "01",
      title: "Direct Physical & Video Walkthrough Audit",
      description: "Every property is personally inspected on-site to shoot unedited HD video walkthroughs, confirming exact physical boundaries, road ingress, and actual site conditions.",
      badge: "SITE CLARITY"
    },
    {
      step: "02",
      title: "Parent Deed & 30-Year Ownership Chain",
      description: "We manually examine mother deeds, sale deeds, gift deeds, and inheritance records to verify clear 30-year ownership history and ensure zero family title disputes.",
      badge: "TITLE INTEGRITY"
    },
    {
      step: "03",
      title: "Encumbrance Certificate & SRO Audit",
      description: "Sub-Registrar Office (SRO) Encumbrance Certificates (EC) are thoroughly reviewed to verify that the property has zero active bank mortgages, court attachments, or liens.",
      badge: "ZERO MORTGAGE CLAIM"
    },
    {
      step: "04",
      title: "Karnataka Revenue Records (RTC / A-Khata)",
      description: "We inspect RTC (Pahani) records, A-Khata certificates, mutation extracts, and latest Mangaluru City Corporation (MCC) tax receipts to guarantee clear revenue status.",
      badge: "STATUTORY CLEARANCE"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Main Header Container */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-xs space-y-8">

          {/* Section Header */}
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Verification Protocol
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-slate-900 tracking-tight">
              Direct Title & Property Inspection
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every listing on GrabMyKey undergoes rigorous direct verification before going live. We personally inspect mother deeds, revenue records, encumbrance certificates, and physical site details in Mangaluru to ensure total transparency.
            </p>
          </div>

          {/* Grid Layout for Verification Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {verificationSteps.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] rounded-2xl p-6 border border-slate-200/60 flex flex-col justify-between space-y-4 hover:border-amber-300 transition-all"
              >
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-[#0F172A] font-serif flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#C59B27] shrink-0" />
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <span className="text-[10px] font-bold text-amber-800 tracking-wider uppercase">
                  {item.badge}
                </span>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Clean Footer */}
      <Footer />
    </div>
  );
}

