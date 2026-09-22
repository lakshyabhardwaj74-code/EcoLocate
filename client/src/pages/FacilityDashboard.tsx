import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  ShieldCheck,
  ShieldAlert,
  Clock,
  MapPin,
  Phone,
  Mail,
  Truck,
  CheckCircle2,
  Trash2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { Facility, PickupRequest } from '../types';

export const FacilityDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [facility, setFacility] = useState<Facility | null>(null);
  const [stats, setStats] = useState({
    totalPickups: 0,
    pendingRequests: 0,
    activePickups: 0,
    completedPickups: 0,
    totalWeightKg: 0.0,
  });
  const [recentRequests, setRecentRequests] = useState<PickupRequest[]>([]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.getManagedFacilityStats();
      if (res.success && res.data) {
        setFacility(res.data.facility);
        setStats(res.data.stats);
        setRecentRequests(res.data.recentRequests || []);
        setError(null);
      } else {
        setError(res.message || 'Failed to retrieve facility records.');
      }
    } catch (err) {
      setError('Connection error fetching facility metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F5F7F4] tech-grid">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#16A6A0] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-[#071A21]">Loading console metrics...</p>
        </div>
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-semibold max-w-md mx-auto text-center space-y-3">
          <ShieldAlert className="w-10 h-10 mx-auto text-red-500" />
          <div>{error || 'No managed facility found associated with this account.'}</div>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
          >
            Retry Fetch
          </button>
        </div>
      </div>
    );
  }

  const isVerified = facility.verificationStatus === 'VERIFIED';
  const statusColors: Record<string, string> = {
    VERIFIED: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    PENDING: 'bg-amber-50 text-amber-900 border border-amber-200',
    REJECTED: 'bg-red-50 text-red-900 border border-red-200',
    SUSPENDED: 'bg-rose-50 text-rose-900 border border-rose-200',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Verification Status Warning Alert */}
      {!isVerified && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 shadow-subtle animate-pulse">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-900 uppercase">Operational Functionality Restricted</h4>
            <p className="text-xs text-amber-700 font-medium leading-relaxed">
              Your recycling center status is currently <span className="font-extrabold underline">{facility.verificationStatus || 'PENDING'}</span>. Incoming doorstep collections, status updates, and public locator search listings are locked until approved by a platform administrator.
            </p>
          </div>
        </div>
      )}

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D1DEDF] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#16A6A0]/10 text-[#16A6A0] text-xs font-bold border border-[#16A6A0]/30 shadow-sm">
            <Building2 className="w-3.5 h-3.5" />
            <span>Facility Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#071A21] tracking-tight font-['Outfit'] mt-1.5">
            {facility.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#5e777f] font-semibold mt-0.5">
            Operations & Pickup Management Dashboard
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold border uppercase ${statusColors[facility.verificationStatus || 'PENDING']}`}>
            Status: {facility.verificationStatus || 'PENDING'}
          </span>
          <button
            onClick={fetchStats}
            className="btn-press p-2 bg-white hover:bg-[#F5F7F4] text-[#071A21] rounded-xl border border-[#D1DEDF] hover:text-[#16A6A0] hover:border-[#16A6A0] shadow-sm transition-all"
            title="Refresh Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Details Card & Info Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Facility Details Box */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-[#D1DEDF] shadow-card p-5 sm:p-6 space-y-4 font-medium">
          <h3 className="font-bold text-sm text-[#071A21] border-b border-slate-100 pb-2 uppercase tracking-wide font-['Outfit']">
            Facility Profile Details
          </h3>
          
          <div className="space-y-3.5 text-xs text-[#071A21] font-medium">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#16A6A0] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="text-[10px] text-[#5e777f] font-bold uppercase">Address</div>
                <div className="leading-relaxed">{facility.address}, {facility.city}, {facility.state} - {facility.pincode}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#16A6A0] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="text-[10px] text-[#5e777f] font-bold uppercase">Telephone</div>
                <div>{facility.phone}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#16A6A0] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="text-[10px] text-[#5e777f] font-bold uppercase">Email Inbox</div>
                <div className="break-all">{facility.email}</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#16A6A0] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="text-[10px] text-[#5e777f] font-bold uppercase">Operating Hours</div>
                <div>{facility.openingHours}</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link
              to="/facility/profile"
              className="btn-press w-full py-2.5 bg-[#F5F7F4] hover:bg-[#16A6A0]/10 text-[#071A21] hover:text-[#16A6A0] border border-[#D1DEDF] hover:border-[#16A6A0]/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <span>Edit Facility Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Operational Statistics Indicators */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-2 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-[#D1DEDF] shadow-card flex flex-col justify-between h-36 hover:border-[#16A6A0] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#5e777f] uppercase">Total Assigned</span>
              <div className="p-1.5 bg-[#16A6A0]/10 text-[#16A6A0] rounded-lg">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-black text-[#071A21] block font-['Outfit']">{stats.totalPickups}</span>
              <span className="text-[10px] text-[#5e777f] font-semibold">Incoming collection manifests</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D1DEDF] shadow-card flex flex-col justify-between h-36 hover:border-[#16A6A0] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-700 uppercase">Pending Requests</span>
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-black text-amber-700 block font-['Outfit']">{stats.pendingRequests}</span>
              <span className="text-[10px] text-amber-700 font-semibold">Awaiting acceptance/scheduling</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D1DEDF] shadow-card flex flex-col justify-between h-36 hover:border-[#16A6A0] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#16A6A0] uppercase">Active Transits</span>
              <div className="p-1.5 bg-[#16A6A0]/10 text-[#16A6A0] rounded-lg">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-black text-[#16A6A0] block font-['Outfit']">{stats.activePickups}</span>
              <span className="text-[10px] text-[#16A6A0] font-semibold">Currently out for collection</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#D1DEDF] shadow-card flex flex-col justify-between h-36 hover:border-[#16A6A0] transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800 uppercase">E-Waste Diverted</span>
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-black text-emerald-800 block font-['Outfit']">
                {stats.totalWeightKg.toLocaleString()} kg
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">
                {stats.completedPickups} completed recycles
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Recent Pickup Manifests Section */}
      <div className="bg-white rounded-2xl border border-[#D1DEDF] shadow-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-[#071A21] flex items-center gap-2 font-['Outfit']">
            <Truck className="w-4 h-4 text-[#16A6A0]" />
            <span>Recent Manifest Assignments</span>
          </h3>
          <Link
            to="/facility/requests"
            className="text-xs font-bold text-[#16A6A0] hover:text-[#0f8580] hover:underline flex items-center gap-1 transition-colors"
          >
            <span>View Full Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#5e777f] font-semibold">
            No collection requests currently assigned to your recycling center.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#F5F7F4] text-[#5e777f] uppercase font-bold text-[10px] border-y border-[#D1DEDF]">
                <tr>
                  <th className="p-3">Tracking ID</th>
                  <th className="p-3">Citizen Contact</th>
                  <th className="p-3">Items Category</th>
                  <th className="p-3">Disposal Weight</th>
                  <th className="p-3">Preferred Date</th>
                  <th className="p-3">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentRequests.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#071A21]">{p.trackingCode}</td>
                    <td className="p-3">
                      <div className="font-bold text-[#071A21]">{p.name}</div>
                    </td>
                    <td className="p-3 font-bold text-[#071A21]">{p.category}</td>
                    <td className="p-3 text-[#5e777f]">{p.quantity} units ({p.weightKg} kg)</td>
                    <td className="p-3 text-[#5e777f]">{p.preferredDate}</td>
                    <td className="p-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'COMPLETED'
                          ? 'bg-[#16A6A0]/10 text-[#16A6A0] border border-[#16A6A0]/25'
                          : p.status === 'REQUESTED'
                          ? 'bg-amber-50 text-amber-900 border border-amber-200'
                          : 'bg-[#16A6A0]/5 text-[#071A21] border border-[#16A6A0]/15'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
