import React, { useRef } from 'react';
import { PickupRequest } from '../types';
import { Award, ShieldCheck, Printer, X, Recycle, CheckCircle2 } from 'lucide-react';

interface CertificateModalProps {
  pickup: PickupRequest;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ pickup, onClose }) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const certId = `CERT-${pickup.trackingCode}`;
  const co2Avoided = (pickup.weightKg * 2.45).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Certificate Printable Canvas Container */}
        <div
          ref={certRef}
          className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-8 border-double border-emerald-700/80 rounded-2xl p-6 sm:p-10 text-center space-y-6 shadow-inner relative overflow-hidden"
        >
          {/* Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Recycle className="w-96 h-96 text-emerald-900" />
          </div>

          {/* Header */}
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Official Digital Recycling Certificate
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
              Certificate of Responsible Disposal
            </h2>
            <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
              EcoLocate Network — National Clean Environment Protocol
            </p>
          </div>

          {/* Recipient */}
          <div className="py-4 border-y border-emerald-200/80 relative z-10 space-y-2">
            <p className="text-sm text-slate-600 italic">This is proudly awarded to</p>
            <h3 className="text-xl sm:text-3xl font-black text-emerald-800 tracking-wide">
              {pickup.name || pickup.user?.name || 'Valued Eco-Partner'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              for successfully recycling electronic waste and diverting hazardous pollutants from landfills under certified urban mining standards.
            </p>
          </div>

          {/* Item & Impact Spec Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-emerald-100 relative z-10">
            <div>
              <span className="block text-[10px] text-slate-500 font-bold uppercase">Item Category</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800">{pickup.category}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 font-bold uppercase">Disposed Weight</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800">{pickup.weightKg} kg ({pickup.quantity} pcs)</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 font-bold uppercase">CO₂ Offset</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-700">{co2Avoided} kg CO₂</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 font-bold uppercase">Points Earned</span>
              <span className="text-xs sm:text-sm font-bold text-amber-600">+{pickup.earnedPoints || pickup.estimatedPoints} Pts</span>
            </div>
          </div>

          {/* Verification Footer & Stamp */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-slate-600 relative z-10">
            <div className="text-left">
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Processing Center</span>
              <span className="font-bold text-slate-800">{pickup.facility?.name || 'GreenTech Recyclers'}</span>
              <span className="block text-[10px] text-emerald-600 font-semibold">Verified CPCB Authorized Recycler</span>
            </div>

            {/* Stamp Badge */}
            <div className="w-20 h-20 rounded-full border-4 border-dashed border-emerald-600 bg-emerald-50/80 flex flex-col items-center justify-center text-emerald-800 p-1 shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <span className="text-[8px] font-black uppercase tracking-tighter text-center">Certified Green</span>
            </div>

            <div className="text-right">
              <span className="block text-[10px] text-slate-400 font-bold uppercase">Certificate ID</span>
              <span className="font-mono text-xs font-bold text-slate-800">{certId}</span>
              <span className="block text-[10px] text-slate-400">Issued: {new Date(pickup.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 italic relative z-10">
            Verified electronic certificate issued by EcoCycle Responsible E-Waste Locator Platform.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print / Save Certificate
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
