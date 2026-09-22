import React, { useEffect, useState } from 'react';
import { Building2, Truck, CheckCircle2, RefreshCw, Clock, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { PickupRequest } from '../types';
import { useAuth } from '../context/AuthContext';

export const FacilityManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchQueue = async () => {
    try {
      const res = await api.getPickups();
      if (res.success) {
        setPickups(res.data);
      }
    } catch (err) {
      console.error('Error fetching manager pickups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleStatusChange = async (pickupId: string, newStatus: string) => {
    setUpdatingId(pickupId);
    try {
      const res = await api.updatePickupStatus(pickupId, newStatus);
      if (res.success) {
        fetchQueue();
      } else {
        alert(res.message || 'Failed to update status.');
      }
    } catch (err) {
      console.error('Update status error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#16A6A0]/10 text-[#16A6A0] text-xs font-bold border border-[#16A6A0]/25">
            <Building2 className="w-3.5 h-3.5 text-[#16A6A0]" />
            <span>Facility Operations Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#071A21] tracking-tight font-['Outfit'] mt-1">
            Facility Logistics & Pickup Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#5e777f] font-medium">
            Manage incoming citizen collection manifests, dispatch verification teams, and update lifecycle states
          </p>
        </div>

        <button
          onClick={fetchQueue}
          className="btn-press px-4 py-2 bg-white hover:bg-slate-50 text-[#071A21] font-bold text-xs rounded-xl border border-[#D1DEDF] shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Queue Table Container */}
      <div className="bg-white rounded-2xl border border-[#D1DEDF] shadow-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-[#071A21] flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#16A6A0]" />
            <span>Active Doorstep Collections Assigned</span>
          </h3>
          <span className="text-xs font-semibold text-[#5e777f]">{pickups.length} Requests Total</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : pickups.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#5e777f]">
            No pickups currently queued for this recycling facility.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#F5F7F4] text-[#5e777f] uppercase font-bold text-[10px] border-y border-[#D1DEDF]">
                <tr>
                  <th className="p-3">Tracking Code</th>
                  <th className="p-3">Citizen Contact</th>
                  <th className="p-3">Disposal Items</th>
                  <th className="p-3">Schedule Slot</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3 text-right">Update Lifecycle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {pickups.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-mono font-bold text-[#071A21]">{p.trackingCode}</td>
                    <td className="p-3">
                      <div className="font-bold text-[#071A21]">{p.name || p.user?.name}</div>
                      <div className="text-[11px] text-[#5e777f]">{p.phone}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-[#071A21]">{p.category}</div>
                      <div className="text-[11px] text-[#5e777f]">{p.quantity} units ({p.weightKg} kg)</div>
                    </td>
                    <td className="p-3">
                      <div>{p.preferredDate}</div>
                      <div className="text-[11px] text-[#5e777f]">{p.preferredTimeSlot}</div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'COMPLETED'
                          ? 'bg-[#16A6A0]/10 text-[#16A6A0] border border-[#16A6A0]/25'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <select
                        value={p.status}
                        disabled={updatingId === p.id}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        className="py-1 px-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-lg text-xs font-bold text-[#071A21] focus:border-[#16A6A0] outline-none"
                      >
                        <option value="REQUESTED">Requested</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="PICKED_UP">Picked Up</option>
                        <option value="RECYCLED">Processing</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
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
