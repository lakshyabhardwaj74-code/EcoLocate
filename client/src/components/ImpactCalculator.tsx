import React, { useState } from 'react';
import { Calculator, Sparkles, Leaf, Award, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const ITEM_TYPES = [
  { name: 'Smartphone', weight: 0.2, gold: 0.034, silver: 0.35, copper: 15, co2: 12, points: 100 },
  { name: 'Laptop', weight: 2.1, gold: 0.14, silver: 1.2, copper: 185, co2: 45, points: 250 },
  { name: 'Desktop CPU', weight: 8.5, gold: 0.25, silver: 2.5, copper: 450, co2: 110, points: 200 },
  { name: 'Monitor / TV', weight: 5.0, gold: 0.05, silver: 0.8, copper: 220, co2: 60, points: 150 },
  { name: 'Battery (Li-Ion)', weight: 0.5, gold: 0.0, silver: 0.1, copper: 40, co2: 15, points: 50 },
  { name: 'Printer / Scanner', weight: 6.2, gold: 0.08, silver: 0.9, copper: 310, co2: 75, points: 120 },
];

export const ImpactCalculator: React.FC = () => {
  const [selectedItemName, setSelectedItemName] = useState('Smartphone');
  const [quantity, setQuantity] = useState(2);

  const selectedItem = ITEM_TYPES.find((i) => i.name === selectedItemName) || ITEM_TYPES[0];

  const totalWeight = (selectedItem.weight * quantity).toFixed(1);
  const totalGold = (selectedItem.gold * quantity).toFixed(3);
  const totalSilver = (selectedItem.silver * quantity).toFixed(2);
  const totalCopper = (selectedItem.copper * quantity).toFixed(0);
  const totalCO2 = (selectedItem.co2 * quantity).toFixed(1);
  const totalPoints = selectedItem.points * quantity;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 text-slate-900 shadow-card border border-[#E2E8F0] space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#16A6A0]/10 text-[#16A6A0] flex items-center justify-center border border-[#16A6A0]/25">
            <Calculator className="w-5 h-5 text-[#16A6A0]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#071A21] font-['Outfit']">
              E-Waste Impact & Metal Recovery Calculator
            </h3>
            <p className="text-[#5e777f] text-xs font-medium">
              Simulate raw precious metal recovery, greenhouse gas avoidance, and loyalty points
            </p>
          </div>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider bg-[#16A6A0]/10 text-[#16A6A0] border border-[#16A6A0]/25 px-3 py-1 rounded-md">
          CPCB Standard Rates
        </span>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F5F7F4] p-4 rounded-xl border border-[#D1DEDF]">
        <div>
          <label className="block text-xs font-bold text-[#071A21] mb-1.5 font-['Outfit']">
            Select Device Category
          </label>
          <select
            value={selectedItemName}
            onChange={(e) => setSelectedItemName(e.target.value)}
            className="w-full bg-white border border-[#D1DEDF] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#071A21] font-medium focus:border-[#16A6A0] transition-colors outline-none"
          >
            {ITEM_TYPES.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name} (Avg ~{t.weight} kg)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#071A21] mb-1.5 font-['Outfit']">
            Quantity: <span className="text-[#16A6A0] font-black">{quantity} units</span>
          </label>
          <input
            type="range"
            min={1}
            max={20}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full accent-[#16A6A0] mt-2 cursor-pointer"
          />
        </div>
      </div>

      {/* Metrics Output Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#F5F7F4] rounded-xl p-4 border border-[#D1DEDF] space-y-1">
          <span className="text-[10px] font-bold text-[#5e777f] uppercase block">Disposed Weight</span>
          <span className="text-xl sm:text-2xl font-black text-[#071A21] font-['Outfit'] block">{totalWeight} kg</span>
          <span className="text-[11px] text-[#5e777f]">Solid scrap diverted</span>
        </div>

        <div className="bg-[#F5F7F4] rounded-xl p-4 border border-[#D1DEDF] space-y-1">
          <span className="text-[10px] font-bold text-[#5e777f] uppercase block">Gold Yield</span>
          <span className="text-xl sm:text-2xl font-black text-amber-600 font-['Outfit'] block">~{totalGold} g</span>
          <span className="text-[11px] text-[#5e777f]">Recoverable pure Au</span>
        </div>

        <div className="bg-[#F5F7F4] rounded-xl p-4 border border-[#D1DEDF] space-y-1">
          <span className="text-[10px] font-bold text-[#5e777f] uppercase block">CO₂ Abatement</span>
          <span className="text-xl sm:text-2xl font-black text-[#16A6A0] font-['Outfit'] block">{totalCO2} kg</span>
          <span className="text-[11px] text-[#5e777f]">Emissions prevented</span>
        </div>

        <div className="bg-[#F5F7F4] rounded-xl p-4 border border-[#D1DEDF] space-y-1">
          <span className="text-[10px] font-bold text-[#5e777f] uppercase block">Reward Points</span>
          <span className="text-xl sm:text-2xl font-black text-amber-700 font-['Outfit'] block">+{totalPoints} Pts</span>
          <span className="text-[11px] text-amber-700">Credited to wallet</span>
        </div>
      </div>

      {/* Conversion CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
        <span className="text-[#5e777f]">
          Copper Recovery Yield: <strong className="text-[#071A21]">~{totalCopper}g</strong> & Silver Recovery Yield: <strong className="text-[#071A21]">~{totalSilver}g</strong>
        </span>
        <Link
          to={`/pickup?category=${encodeURIComponent(selectedItem.name)}&quantity=${quantity}&weight=${totalWeight}&points=${totalPoints}`}
          className="btn-press px-5 py-2.5 bg-[#071A21] hover:bg-[#16A6A0] text-white font-bold rounded-xl shadow-sm flex items-center gap-2 transition-all border border-[#16A6A0]/25"
        >
          <span>Schedule Doorstep Pickup for this Batch</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#38D9E8]" />
        </Link>
      </div>

    </div>
  );
};
