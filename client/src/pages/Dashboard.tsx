import React, { useEffect, useState } from 'react';
import {
  Recycle,
  Truck,
  Award,
  Leaf,
  Scan,
  Calendar,
  Sparkles,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  ArrowRight,
  ShieldCheck,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PickupRequest } from '../types';
import { CertificateModal } from '../components/CertificateModal';

const MONTHLY_DATA = [
  { month: 'Mar', weightKg: 2.5, points: 180 },
  { month: 'Apr', weightKg: 4.0, points: 300 },
  { month: 'May', weightKg: 1.8, points: 120 },
  { month: 'Jun', weightKg: 6.2, points: 450 },
  { month: 'Jul', weightKg: 5.0, points: 380 },
  { month: 'Aug', weightKg: 8.5, points: 650 },
];

const CATEGORY_PIE = [
  { name: 'Smartphones', value: 40, color: '#16A6A0' },
  { name: 'Laptops', value: 30, color: '#38D9E8' },
  { name: 'Batteries', value: 15, color: '#F59E0B' },
  { name: 'Monitors', value: 15, color: '#071A21' },
];

const LIFECYCLE_STAGES = [
  { key: 'REQUESTED', label: 'Requested' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'PICKED_UP', label: 'Picked Up' },
  { key: 'RECYCLED', label: 'Processing' },
  { key: 'COMPLETED', label: 'Recycled' },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificatePickup, setSelectedCertificatePickup] = useState<PickupRequest | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [pickupRes, scanRes] = await Promise.all([api.getPickups(), api.getAIScanHistory()]);
        if (pickupRes.success) setPickups(pickupRes.data);
        if (scanRes.success) setScans(scanRes.data);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const completedPickups = pickups.filter((p) => p.status === 'COMPLETED');
  const activePickups = pickups.filter((p) => p.status !== 'COMPLETED');
  const totalRecycledKg = completedPickups.reduce((acc, curr) => acc + (curr.weightKg || 0), 0) + 5.0;
  const co2AvoidedKg = parseFloat((totalRecycledKg * 2.45).toFixed(1));

  const latestActiveRequest = activePickups.length > 0 ? activePickups[0] : pickups[0];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'REQUESTED':
        return 0;
      case 'CONFIRMED':
      case 'ASSIGNED':
        return 1;
      case 'PICKED_UP':
        return 2;
      case 'RECYCLED':
        return 3;
      case 'COMPLETED':
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D1DEDF] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#16A6A0]/10 text-[#16A6A0] text-xs font-bold border border-[#16A6A0]/30 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Citizen E-Waste Recycling Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#071A21] tracking-tight font-['Outfit'] mt-1">
            Recycling Activity & Impact
          </h1>
          <p className="text-xs sm:text-sm text-[#5e777f] font-medium">
            Welcome back, <strong className="text-[#16A6A0]">{user?.name}</strong>! Track collections, view CO₂ offsets, and manage rewards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/rewards"
            className="px-3.5 py-1.5 bg-[#D8F36A]/10 text-[#071A21] text-xs font-bold rounded-lg border border-[#D8F36A]/30 flex items-center gap-1.5 hover:bg-[#D8F36A]/20 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#16A6A0]" />
            <span>{user?.rewardPoints || 0} Eco Points Balance</span>
          </Link>

          <Link
            to="/pickup"
            className="btn-press px-4 py-1.5 bg-[#071A21] hover:bg-[#16A6A0] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Book Pickup</span>
          </Link>
        </div>
      </div>

      {/* 1. IMPACT STATS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-xl p-5 border border-[#D1DEDF] shadow-card space-y-1 hover:border-[#16A6A0] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5e777f] uppercase">E-Waste Disposed</span>
            <Recycle className="w-4 h-4 text-[#16A6A0]" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#071A21] font-['Outfit']">{totalRecycledKg.toFixed(1)} kg</span>
          <span className="text-[10px] text-[#16A6A0] font-extrabold block">Diverted from Landfills</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#D1DEDF] shadow-card space-y-1 hover:border-[#16A6A0] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5e777f] uppercase">Active Requests</span>
            <Truck className="w-4 h-4 text-[#16A6A0]" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#071A21] font-['Outfit']">{activePickups.length}</span>
          <span className="text-[10px] text-[#5e777f] font-medium block">{completedPickups.length} completed manifests</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#D1DEDF] shadow-card space-y-1 hover:border-[#16A6A0] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5e777f] uppercase">Reward Points</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-amber-700 font-['Outfit']">+{user?.rewardPoints || 0}</span>
          <span className="text-[10px] text-amber-700 font-semibold block">Redeemable for brand vouchers</span>
        </div>

        <div className="bg-white rounded-xl p-5 border border-[#D1DEDF] shadow-card space-y-1 hover:border-[#16A6A0] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5e777f] uppercase">CO₂ Abated</span>
            <Leaf className="w-4 h-4 text-emerald-700" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-['Outfit']">{co2AvoidedKg} kg</span>
          <span className="text-[10px] text-emerald-700 font-semibold block">~4 Urban Trees Planted</span>
        </div>

      </div>

      {/* 2. CURRENT REQUEST VISUAL TIMELINE */}
      {latestActiveRequest && (
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D1DEDF] shadow-card space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#5e777f]">Active Request Timeline</span>
              <h3 className="font-bold text-sm sm:text-base text-[#071A21]">
                {latestActiveRequest.category} ({latestActiveRequest.quantity} units, {latestActiveRequest.weightKg} kg)
              </h3>
            </div>
            <span className="font-mono text-xs font-bold text-[#071A21] bg-[#F5F7F4] px-3 py-1 rounded-lg border border-[#D1DEDF]">
              Tracking: {latestActiveRequest.trackingCode}
            </span>
          </div>

          {/* 5-Step Visual Progress Bar */}
          <div className="py-2">
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              {LIFECYCLE_STAGES.map((stage, idx) => {
                const currentIdx = getStageIndex(latestActiveRequest.status);
                const isPassed = idx < currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                  <div key={stage.key} className="space-y-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isPassed
                          ? 'bg-[#16A6A0]'
                          : isCurrent
                          ? 'bg-[#38D9E8] shadow-[0_0_8px_#38d9e8] animate-pulse'
                          : 'bg-slate-200'
                      }`}
                    />
                    <span
                      className={`block text-[11px] font-bold ${
                        isCurrent
                          ? 'text-[#16A6A0]'
                          : isPassed
                          ? 'text-[#071A21]'
                          : 'text-[#5e777f]'
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#5e777f] pt-2 border-t border-slate-100">
            <span>Scheduled for {latestActiveRequest.preferredDate} ({latestActiveRequest.preferredTimeSlot})</span>
            <button
              onClick={() => setSelectedCertificatePickup(latestActiveRequest)}
              className="font-bold text-[#16A6A0] hover:text-[#0f8580] hover:underline flex items-center gap-1 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View E-Manifest</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. DISPOSAL HISTORY & RECENT ACTIVITY */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D1DEDF] shadow-card space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-[#071A21] flex items-center gap-2 font-['Outfit']">
            <Clock className="w-4 h-4 text-[#16A6A0]" />
            <span>Disposal History & Doorstep Collections</span>
          </h3>
          <span className="text-xs font-semibold text-[#5e777f]">{pickups.length} Requests Total</span>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : pickups.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <p className="text-xs font-medium text-[#5e777f]">No pickup requests scheduled yet.</p>
            <Link
              to="/pickup"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#16A6A0] hover:underline"
            >
              <span>Schedule your first doorstep pickup →</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {pickups.map((p) => (
              <div
                key={p.id}
                className="p-4 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl space-y-2.5 hover:border-[#16A6A0] transition-colors"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#071A21] bg-white px-2.5 py-1 rounded-lg border border-[#D1DEDF]">
                      {p.trackingCode}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#071A21]">{p.category}</h4>
                      <p className="text-[11px] text-[#5e777f]">
                        {p.quantity} units ({p.weightKg} kg) • {p.preferredDate} ({p.preferredTimeSlot})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                        p.status === 'COMPLETED'
                          ? 'bg-[#16A6A0]/10 text-[#16A6A0] border border-[#16A6A0]/35'
                          : 'bg-amber-50 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {p.status}
                    </span>

                    <button
                      onClick={() => setSelectedCertificatePickup(p)}
                      className="px-2.5 py-1 bg-white hover:bg-[#16A6A0]/10 text-[#071A21] hover:text-[#16A6A0] font-bold text-[11px] rounded-lg border border-[#D1DEDF] flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Certificate</span>
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-[#5e777f]">
                  <strong className="text-[#071A21]">Pickup Address:</strong> {p.address}, {p.city} - {p.pincode}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      {selectedCertificatePickup && (
        <CertificateModal
          pickup={selectedCertificatePickup}
          onClose={() => setSelectedCertificatePickup(null)}
        />
      )}

    </div>
  );
};
