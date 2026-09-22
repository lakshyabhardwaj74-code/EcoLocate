import React, { useState } from 'react';
import {
  BookOpen,
  ShieldAlert,
  Battery,
  Lock,
  Trash2,
  CheckSquare,
  Square,
  AlertTriangle,
  Leaf,
  Info,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CHECKLIST_ITEMS = [
  { id: 1, text: 'Back up personal data, media, and credentials to cloud or external drive.' },
  { id: 2, text: 'Execute a full factory reset and cryptographic storage wipe.' },
  { id: 3, text: 'Unlink Google / Apple accounts and remove SIM & MicroSD cards.' },
  { id: 4, text: 'Remove detachable Lithium batteries if non-sealed.' },
  { id: 5, text: 'Tape exposed battery terminals with non-conductive electrical tape.' },
  { id: 6, text: 'Place delicate screens and circuit boards in padded or cardboard packaging.' },
];

export const Learn: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const toggleCheck = (id: number) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter((i) => i !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  const progressPercent = Math.round((checkedItems.length / CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#16A6A0]/10 border border-[#16A6A0]/35 text-[#16A6A0] text-xs font-bold shadow-sm">
          <BookOpen className="w-3.5 h-3.5" />
          <span>E-Waste Safety & Compliance Hub</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#071A21] tracking-tight font-['Outfit']">
          Safety Protocols & Guidelines
        </h1>
        <p className="text-[#5e777f] text-xs sm:text-sm">
          Guidelines on hazardous materials, Lithium-Ion fire safety, pre-handover data destruction, and EPR guidelines.
        </p>
      </div>

      {/* INTERACTIVE BEFORE YOU RECYCLE CHECKLIST */}
      <div className="bg-[#071A21] rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-[#16A6A0]/20 tech-grid relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#38D9E8]/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#16A6A0]/15 pb-4 relative z-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#38D9E8]">
              Mandatory Prep Guide
            </span>
            <h2 className="text-xl font-bold text-white font-['Outfit'] mt-0.5">
              Pre-Disposal Checklist for Citizens & Corporates
            </h2>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs font-bold text-slate-400 block">Readiness Score</span>
            <span className="text-lg font-black text-[#38D9E8] font-['Outfit']">
              {progressPercent}% Complete
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#051419] rounded-full h-2 overflow-hidden relative z-10">
          <div
            className="bg-[#16A6A0] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Checklist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 relative z-10">
          {CHECKLIST_ITEMS.map((item) => {
            const isChecked = checkedItems.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                  isChecked
                    ? 'bg-[#16A6A0]/15 border-[#16A6A0] text-white shadow-md'
                    : 'bg-[#071A21]/45 border-[#16A6A0]/15 text-slate-300 hover:border-[#16A6A0]/35'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-[#38D9E8]" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <span className={`text-xs font-medium ${isChecked ? 'line-through text-slate-400' : ''}`}>
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* 3 EDUCATIONAL SAFETY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-2xl p-6 border border-[#D1DEDF] shadow-card space-y-3 hover:border-[#16A6A0]/40 hover:shadow-lg transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/25">
            <Battery className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#071A21] font-['Outfit']">Lithium Battery Fire Safety</h3>
          <p className="text-xs text-[#5e777f] leading-relaxed">
            Never pierce or incinerate lithium cells. Punctured batteries react violently with oxygen, sparking chemical fires. Keep bloated batteries in non-flammable containers.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#D1DEDF] shadow-card space-y-3 hover:border-[#16A6A0]/40 hover:shadow-lg transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#16A6A0]/10 text-[#16A6A0] flex items-center justify-center border border-[#16A6A0]/25">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-[#071A21] font-['Outfit']">Certified Data Destruction</h3>
          <p className="text-xs text-[#5e777f] leading-relaxed">
            Formatting an SSD or HDD is not enough. CPCB authorized recyclers use multi-pass degaussing or mechanical shearing compliant with NIST 800-88 data destruction standards.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#D1DEDF] shadow-card space-y-3 hover:border-[#16A6A0]/40 hover:shadow-lg transition-all">
          <div className="w-10 h-10 rounded-xl bg-[#38D9E8]/10 text-[#16A6A0] flex items-center justify-center border border-[#38D9E8]/25">
            <ShieldAlert className="w-5 h-5 text-[#16A6A0]" />
          </div>
          <h3 className="font-bold text-sm text-[#071A21] font-['Outfit']">Hazardous Heavy Metals</h3>
          <p className="text-xs text-[#5e777f] leading-relaxed">
            Cathode ray tubes and solder contain Lead (Pb) and Mercury (Hg). When dumped in informal open yards, these leach into agricultural groundwater, causing irreversible neurological toxicity.
          </p>
        </div>

      </div>

      {/* CTA Box */}
      <div className="bg-white rounded-2xl p-6 border border-[#D1DEDF] shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-[#071A21] font-['Outfit']">Ready to Recycle Responsibly?</h3>
          <p className="text-xs text-[#5e777f]">
            Find the nearest certified drop-off point or request free doorstep weighing.
          </p>
        </div>
        <Link
          to="/facilities"
          className="btn-press px-5 py-2.5 bg-[#071A21] hover:bg-[#16A6A0] text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 shrink-0 transition-colors"
        >
          <span>Find Nearby Verified Facility</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
};
