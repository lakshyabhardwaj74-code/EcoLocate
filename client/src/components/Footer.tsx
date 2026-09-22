import React from 'react';
import { Link } from 'react-router-dom';
import { Recycle, ShieldCheck, Heart, Leaf, Mail, Phone, MapPin, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#071A21] text-slate-300 border-t border-[#16A6A0]/20 text-xs tech-grid relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Brand & CPCB Protocol */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#16A6A0] flex items-center justify-center text-[#071A21] shadow-sm">
                <Recycle className="w-4 h-4 font-bold text-[#071A21]" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white font-['Outfit']">EcoLocate</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              India's verified e-waste collection and certified recycling network. Connecting citizens, bulk consumers, and recyclers to divert hazardous scrap from landfills.
            </p>
            <div className="inline-flex items-center gap-1.5 bg-[#051419]/90 border border-[#16A6A0]/30 text-[#38D9E8] px-3 py-1 rounded-md text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#38D9E8]" />
              <span>CPCB & EPR Compliant Platform</span>
            </div>
          </div>

          {/* Column 2: Citizen Services */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-3 text-xs border-b border-slate-800 pb-1.5 font-['Outfit']">
              Services & Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/facilities" className="hover:text-[#38D9E8] transition-colors">
                  Find Nearest Authorized Center
                </Link>
              </li>
              <li>
                <Link to="/scan" className="hover:text-[#38D9E8] transition-colors">
                  AI Scrap Material Estimation
                </Link>
              </li>
              <li>
                <Link to="/pickup" className="hover:text-[#38D9E8] transition-colors">
                  Book Doorstep Collection
                </Link>
              </li>
              <li>
                <Link to="/rewards" className="hover:text-[#38D9E8] transition-colors">
                  Eco Reward Points Catalog
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#38D9E8] transition-colors">
                  Track Request Status & Certificate
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Sustainability & Safety */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-3 text-xs border-b border-slate-800 pb-1.5 font-['Outfit']">
              Safety & Regulations
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/learn" className="hover:text-[#38D9E8] transition-colors">
                  Lithium Battery Handling Protocol
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-[#38D9E8] transition-colors">
                  Pre-Recycling Data Sanitization Guide
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-[#38D9E8] transition-colors">
                  Hazardous Metals (Lead, Mercury, Cadmium)
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-[#38D9E8] transition-colors">
                  EPR Producer Guidelines & CPCB Rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Operations */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-3 text-xs border-b border-slate-800 pb-1.5 font-['Outfit']">
              Helpline & Operations
            </h3>
            <ul className="space-y-2.5 text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#38D9E8] shrink-0" />
                <span>National Helpline: <strong className="text-white">1800-ECO-LOCATE</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#38D9E8] shrink-0" />
                <span>support@ecolocate.org.in</span>
              </li>
              <li className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#051419] hover:bg-[#16A6A0]/20 text-[#38D9E8] font-bold rounded-lg border border-[#16A6A0]/30 transition-colors shadow-sm"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin & Operations Portal</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 EcoLocate E-Waste Facility Locator. Compliant with CPCB E-Waste Management Rules.</p>
          <div className="flex items-center gap-1">
            <span>Built for Clean India & Urban Mineral Recovery</span>
            <Leaf className="w-3 h-3 text-[#16A6A0] ml-1" />
          </div>
        </div>

      </div>
    </footer>
  );
};
