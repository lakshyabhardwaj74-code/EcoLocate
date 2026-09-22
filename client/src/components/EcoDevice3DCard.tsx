import React, { useState } from 'react';
import {
  MapPin,
  Recycle,
  ShieldCheck,
  Cpu,
  Zap,
  Building2,
  CheckCircle2,
  Navigation,
  Sparkles,
} from 'lucide-react';

export const EcoDevice3DCard: React.FC = () => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left - card.width / 2;
    const y = e.clientY - card.top - card.height / 2;
    const rotateX = -(y / 25);
    const rotateY = x / 25;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      className="perspective-1000 w-full max-w-lg mx-auto select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative preserve-3d transition-transform duration-300 ease-out bg-[#071A21]/90 backdrop-blur-md rounded-2xl p-6 sm:p-7 border border-[#16A6A0]/20 shadow-2xl text-white"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#16A6A0]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#38D9E8]/10 rounded-full blur-2xl pointer-events-none" />

        {/* 3D Floating Top Header */}
        <div className="flex items-center justify-between border-b border-[#16A6A0]/25 pb-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#16A6A0] text-[#071A21] flex items-center justify-center shadow-sm">
              <Recycle className="w-4 h-4 font-bold" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white font-['Outfit']">EcoLocate Network</h4>
              <p className="text-[11px] text-slate-400">Live Facilities Telemetry</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#16A6A0]/10 border border-[#16A6A0]/35 text-[#38D9E8] text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38D9E8] animate-pulse" />
            <span>38 Hubs Active</span>
          </div>
        </div>

        {/* 3D Isometric Device Showcase Centerpiece */}
        <div className="my-5 relative z-10 bg-[#051419]/90 rounded-xl p-4 border border-[#16A6A0]/15 space-y-3.5">
          
          {/* Main Verified Facility Node */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#38D9E8] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#38D9E8]" />
                <span>CPCB Authorized Dismantler</span>
              </div>
              <h5 className="font-bold text-sm text-white">GreenTech E-Waste Hub</h5>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#16A6A0]" />
                <span>Electronic City, Bengaluru • 3.2 km</span>
              </p>
            </div>

            <div className="w-9 h-9 rounded-lg bg-[#071A21] border border-[#16A6A0]/30 flex items-center justify-center text-[#38D9E8] shrink-0 shadow-sm">
              <Cpu className="w-4 h-4" />
            </div>
          </div>

          {/* Urban Mining Live Recovery Preview */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#16A6A0]/15">
            <div className="bg-[#071A21]/70 p-2 rounded-lg border border-[#16A6A0]/10">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Gold Yield</span>
              <span className="font-bold text-xs text-amber-400">~0.034g</span>
            </div>
            <div className="bg-[#071A21]/70 p-2 rounded-lg border border-[#16A6A0]/10">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">Copper Yield</span>
              <span className="font-bold text-xs text-slate-200">~15.0g</span>
            </div>
            <div className="bg-[#071A21]/70 p-2 rounded-lg border border-[#16A6A0]/10">
              <span className="block text-[10px] text-slate-400 uppercase font-bold">CO₂ Saved</span>
              <span className="font-bold text-xs text-[#38D9E8]">12.4 kg</span>
            </div>
          </div>

        </div>

        {/* 3D Interactive Facility Node Badges */}
        <div className="grid grid-cols-2 gap-2 relative z-10 text-xs">
          <div className="bg-[#071A21]/60 p-2.5 rounded-lg border border-[#16A6A0]/15 flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#16A6A0]/20 text-[#16A6A0] flex items-center justify-center shrink-0">
              <Navigation className="w-3 h-3" />
            </div>
            <div className="truncate">
              <span className="block font-bold text-white text-[11px] truncate">Delhi-NCR Cluster</span>
              <span className="text-[10px] text-slate-400">12 Verified Hubs</span>
            </div>
          </div>

          <div className="bg-[#071A21]/60 p-2.5 rounded-lg border border-[#16A6A0]/15 flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#38D9E8]/20 text-[#38D9E8] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3 h-3" />
            </div>
            <div className="truncate">
              <span className="block font-bold text-white text-[11px] truncate">Mumbai MMR Center</span>
              <span className="text-[10px] text-slate-400">8 Verified Hubs</span>
            </div>
          </div>
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-4 pt-3 border-t border-[#16A6A0]/15 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
          <span className="flex items-center gap-1 text-slate-300">
            <Sparkles className="w-3 h-3 text-[#38D9E8]" />
            <span>Zero-Landfill Processing Standard</span>
          </span>
          <span className="font-mono text-[#38D9E8] font-semibold">100% CPCB Verified</span>
        </div>

      </div>
    </div>
  );
};
