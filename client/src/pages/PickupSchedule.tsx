import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Truck,
  Calendar,
  Clock,
  MapPin,
  Package,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  ArrowRight,
  ShieldCheck,
  Building2,
  Check,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Facility, PickupRequest } from '../types';

const CATEGORIES = [
  'Smartphone',
  'Laptop',
  'Desktop Computer',
  'Monitor / TV',
  'Battery (Li-Ion / Lead Acid)',
  'Printer / Scanner',
  'Keyboards & Mice',
  'Chargers & Power Cables',
  'Refrigerator / Washing Machine',
  'Other Mixed Electronics',
];

const TIME_SLOTS = [
  '09:00 AM - 12:00 PM (Morning)',
  '12:00 PM - 03:00 PM (Afternoon)',
  '03:00 PM - 06:00 PM (Evening)',
  '06:00 PM - 08:00 PM (Late Evening)',
];

export const PickupSchedule: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const initialCategory = searchParams.get('category') || 'Smartphone';
  const initialWeight = parseFloat(searchParams.get('weight') || '1.0');
  const initialQuantity = parseInt(searchParams.get('quantity') || '1');
  const preselectedFacilityId = searchParams.get('facilityId') || '';

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: 'Flat 402, Sunshine Heights, Sector 1',
    city: 'Bengaluru',
    pincode: '560102',
    category: initialCategory,
    quantity: initialQuantity,
    weightKg: initialWeight,
    notes: 'Please call 10 mins before arrival. Items packed in box.',
    preferredDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    preferredTimeSlot: TIME_SLOTS[0],
    facilityId: preselectedFacilityId,
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<PickupRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    async function loadFacilities() {
      try {
        const res = await api.getFacilities({});
        if (res.success) {
          setFacilities(res.data);
          if (!preselectedFacilityId && res.data.length > 0) {
            setFormData((prev) => ({ ...prev, facilityId: res.data[0].id }));
          }
        }
      } catch (err) {
        console.error('Error fetching facilities for pickup:', err);
      }
    }
    loadFacilities();
  }, [preselectedFacilityId]);

  // Dynamic point estimate calculation
  const calculateEstimatedPoints = () => {
    let base = 50;
    if (formData.category.includes('Smartphone')) base = 100;
    if (formData.category.includes('Laptop')) base = 250;
    if (formData.category.includes('Desktop')) base = 200;
    if (formData.category.includes('Battery')) base = 50;
    if (formData.category.includes('Monitor')) base = 150;
    return Math.round(base * formData.quantity + formData.weightKg * 15);
  };

  const estimatedPoints = calculateEstimatedPoints();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please sign in first so your reward points and CPCB recycling certificate can be credited to your account.');
      navigate('/login');
      return;
    }

    if (!formData.name || !formData.phone || !formData.address || !formData.preferredDate) {
      setError('Please fill in all mandatory pickup details.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await api.createPickup({
        ...formData,
        facilityId: formData.facilityId || undefined,
      });

      if (res.success) {
        setConfirmation(res.data);
        await refreshUser();
      } else {
        setError(res.message || 'Failed to schedule doorstep pickup.');
      }
    } catch (err) {
      console.error('Pickup submission error:', err);
      setError('Network error scheduling pickup request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#16A6A0]/10 text-[#16A6A0] text-xs font-bold border border-[#16A6A0]/35 shadow-sm">
          <Truck className="w-3.5 h-3.5 text-[#16A6A0]" />
          <span>Doorstep E-Waste Collection Service</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#071A21] tracking-tight font-['Outfit']">
          Schedule Doorstep Pickup
        </h1>
        <p className="text-[#5e777f] text-xs sm:text-sm">
          Verified collection agents will weigh items at your doorstep, provide manifest receipts, and credit instant points.
        </p>
      </div>

      {confirmation ? (
        /* CONFIRMATION CARD DISPLAY */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#16A6A0]/15 shadow-card space-y-6">
          
          <div className="text-center space-y-2 border-b border-slate-100 pb-5">
            <div className="w-14 h-14 rounded-full bg-[#16A6A0]/10 text-[#16A6A0] flex items-center justify-center mx-auto border border-[#16A6A0]/25 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-[#071A21] font-['Outfit']">Pickup Request Confirmed</h2>
            <p className="text-xs text-[#5e777f] font-medium">
              Your electronic waste collection request has been registered in the national registry.
            </p>
          </div>

          {/* Tracking Details */}
          <div className="bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="block text-[10px] font-bold text-[#5e777f] uppercase">Manifest Tracking Code</span>
                <span className="font-mono text-lg sm:text-xl font-black text-[#071A21]">{confirmation.trackingCode}</span>
              </div>
              <span className="px-3 py-1 bg-[#16A6A0] text-[#071A21] font-extrabold text-xs rounded-full">
                Status: {confirmation.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Scheduled Date</span>
                <span className="font-bold text-slate-800">{confirmation.preferredDate}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Time Slot</span>
                <span className="font-bold text-slate-800">{confirmation.preferredTimeSlot}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Category</span>
                <span className="font-bold text-slate-800">{confirmation.category}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase">Estimated Points</span>
                <span className="font-black text-[#16A6A0]">+{confirmation.estimatedPoints} Pts</span>
              </div>
            </div>

            <div className="text-xs text-[#5e777f] pt-2 border-t border-slate-200">
              <strong>Pickup Address:</strong> {confirmation.address}, {confirmation.city} - {confirmation.pincode}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(confirmation.trackingCode);
                setCopiedCode(true);
                setTimeout(() => setCopiedCode(false), 2000);
              }}
              className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#071A21] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-[#D1DEDF]"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-[#16A6A0]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Tracking Code Copied!' : 'Copy Manifest Code'}</span>
            </button>

            <Link
              to="/dashboard"
              className="btn-press w-full sm:w-auto px-5 py-2.5 bg-[#071A21] hover:bg-[#16A6A0] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View in Citizen Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      ) : (
        /* PICKUP BOOKING FORM */
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D1DEDF] shadow-card space-y-6">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!user && (
            <div className="p-3.5 bg-[#16A6A0]/10 border border-[#16A6A0]/30 rounded-xl text-xs font-semibold text-[#071A21] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#16A6A0] shrink-0" />
                <span>Sign in required to schedule doorstep collection and claim Eco-Reward points.</span>
              </div>
              <Link
                to="/login"
                className="px-3.5 py-1.5 bg-[#071A21] hover:bg-[#16A6A0] text-white text-xs font-bold rounded-lg transition-colors text-center shrink-0"
              >
                Sign In to Schedule
              </Link>
            </div>
          )}

          {/* Step 1: Items & Batch Details */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-[#071A21] border-b border-slate-100 pb-2 font-['Outfit']">
              1. Electronic Items for Disposal
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-[#071A21] mb-1">Item Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#071A21] mb-1">Quantity (Units)</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#071A21] mb-1">Estimated Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min={0.1}
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 0.5 })}
                  className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0]"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Date & Slot Selection */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-[#071A21] border-b border-slate-100 pb-2 font-['Outfit']">
              2. Preferred Schedule Window
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#071A21] mb-1">Pickup Date</label>
                <input
                  type="date"
                  required
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#071A21] mb-1">Time Slot</label>
                <select
                  value={formData.preferredTimeSlot}
                  onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                  className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0]"
                >
                  {TIME_SLOTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Contact & Address */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-[#071A21] border-b border-slate-100 pb-2 font-['Outfit']">
              3. Doorstep Location & Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#071A21] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#071A21] mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#071A21] mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#071A21] mb-1">Pickup Address</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#071A21] mb-1">City</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#071A21] mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0]"
                />
              </div>
            </div>
          </div>

          {/* Points Preview Bar */}
          <div className="p-4 bg-[#D8F36A]/10 border border-[#D8F36A]/30 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#16A6A0]" />
              <div>
                <span className="font-bold text-xs text-[#071A21] block">Estimated Eco-Points on Weighing:</span>
                <span className="text-[11px] text-[#5e777f]">Credited automatically upon agent verification</span>
              </div>
            </div>
            <span className="text-xl font-black text-[#16A6A0] font-['Outfit']">+{estimatedPoints} Pts</span>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-press w-full py-3.5 bg-[#071A21] hover:bg-[#16A6A0] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Truck className="w-4 h-4" />
                <span>Confirm & Generate Collection Manifest</span>
              </>
            )}
          </button>

        </form>
      )}

    </div>
  );
};
