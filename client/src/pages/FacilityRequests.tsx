import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  Truck,
  Clock,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Eye,
  AlertTriangle,
  Building2,
} from 'lucide-react';
import { PickupRequest } from '../types';

export const FacilityRequests: React.FC = () => {
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [filteredPickups, setFilteredPickups] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(true);

  // Filter/Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Inspect Modal
  const [selectedPickup, setSelectedPickup] = useState<PickupRequest | null>(null);

  const fetchPickups = async () => {
    setLoading(true);
    try {
      // First, get facility status to verify operation capability
      const statsRes = await api.getManagedFacilityStats();
      if (statsRes.success && statsRes.data) {
        setIsVerified(statsRes.data.facility.verificationStatus === 'VERIFIED');
      }

      // Next, fetch pickups assigned to this facility
      const res = await api.getPickups();
      if (res.success) {
        setPickups(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching assigned pickups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  useEffect(() => {
    let result = pickups;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.trackingCode.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'ALL') {
      result = result.filter((p) => p.status === statusFilter);
    }

    setFilteredPickups(result);
  }, [pickups, searchQuery, statusFilter]);

  const handleStatusChange = async (pickupId: string, newStatus: string) => {
    if (!isVerified) {
      alert('Operational functions are restricted. Your facility is currently unverified or suspended.');
      return;
    }

    setUpdatingId(pickupId);
    try {
      const res = await api.updatePickupStatus(pickupId, newStatus);
      if (res.success) {
        fetchPickups();
        if (selectedPickup && selectedPickup.id === pickupId) {
          setSelectedPickup({ ...selectedPickup, status: newStatus as any });
        }
      } else {
        alert(res.message || 'Failed to update pickup status.');
      }
    } catch (err) {
      console.error('Status update error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Verification Warning Alert */}
      {!isVerified && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 shadow-subtle animate-pulse">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-900 uppercase">Operational Functionality Restricted</h4>
            <p className="text-xs text-amber-700 font-medium leading-relaxed">
              Updating pickup manifests or moving items through the recycling lifecycle is locked. Access will be reactivated once approved by a platform administrator.
            </p>
          </div>
        </div>
      )}

      {/* Header Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-200">
            <Truck className="w-3.5 h-3.5" />
            <span>Pickup Logistics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1F3A] tracking-tight font-['Outfit'] mt-1.5">
            Doorstep Collection Manifests
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-semibold mt-0.5">
            Manage incoming citizen recycling handovers and update items lifecycle status.
          </p>
        </div>

        <button
          onClick={fetchPickups}
          className="btn-press px-4 py-2 bg-white hover:bg-slate-50 text-[#0B1F3A] font-bold text-xs rounded-xl border border-[#E2E8F0] shadow-subtle flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Toolbar Filters */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search code, citizen name or items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F7F9FC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#111827] focus:bg-white focus:border-[#2563EB] transition-all outline-none"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 bg-[#F7F9FC] border border-[#E2E8F0] rounded-xl text-xs font-bold text-[#0B1F3A] focus:border-[#2563EB] outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="REQUESTED">Requested</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="PROCESSING">Processing</option>
            <option value="RECYCLED">Recycled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Main Queue Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-[#0B1F3A] flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#2563EB]" />
            <span>Active Doorstep Collections Assigned</span>
          </h3>
          <span className="text-xs font-semibold text-[#64748B]">{filteredPickups.length} Requests Total</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredPickups.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#64748B] font-semibold">
            No pickup requests matched the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#F7F9FC] text-[#64748B] uppercase font-bold text-[10px] border-y border-[#E2E8F0]">
                <tr>
                  <th className="p-3">Tracking Code</th>
                  <th className="p-3">Citizen Contact</th>
                  <th className="p-3">E-Waste Item</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredPickups.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="p-3 font-mono font-bold text-[#0B1F3A]">{p.trackingCode}</td>
                    <td className="p-3">
                      <div className="font-bold text-[#0B1F3A]">{p.name || p.user?.name}</div>
                      <div className="text-[10px] text-[#64748B]">{p.phone}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-[#0B1F3A]">{p.category}</div>
                    </td>
                    <td className="p-3 text-[#64748B]">
                      <div>{p.quantity} units</div>
                      <div className="text-[10px] font-semibold">{p.weightKg} kg weight</div>
                    </td>
                    <td className="p-3 text-[#64748B]">{p.preferredDate}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : p.status === 'REQUESTED'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => setSelectedPickup(p)}
                        className="px-2.5 py-1 text-[#0B1F3A] hover:text-[#2563EB] bg-slate-100 hover:bg-slate-200 rounded text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                      
                      <select
                        value={p.status}
                        disabled={updatingId === p.id || !isVerified}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        className="py-1 px-2 bg-[#F7F9FC] border border-[#E2E8F0] rounded-lg text-xs font-bold text-[#0B1F3A] focus:border-[#2563EB] outline-none cursor-pointer disabled:opacity-50"
                      >
                        <option value="REQUESTED">Requested</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="CONFIRMED" disabled>Confirmed</option>
                        <option value="ASSIGNED" disabled>Assigned</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="PICKED_UP">Picked Up</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="RECYCLED">Recycled</option>
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

      {/* INSPECT MANIFEST MODAL */}
      {selectedPickup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-modal border border-[#E2E8F0]">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#64748B]">Manifest Logistics Details</span>
                <h3 className="text-base font-black text-[#0B1F3A] font-['Outfit']">Manifest {selectedPickup.trackingCode}</h3>
              </div>
              <button
                onClick={() => setSelectedPickup(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 bg-[#F7F9FC] p-4 rounded-xl border border-[#E2E8F0]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] font-bold text-[#64748B] uppercase">Requester Name</div>
                  <div className="font-bold text-[#0B1F3A]">{selectedPickup.name}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#64748B] uppercase">Requester Contact</div>
                  <div className="font-bold text-[#0B1F3A]">{selectedPickup.phone} | {selectedPickup.email}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-[#64748B] uppercase">Handover Address</div>
                <div className="font-bold text-[#0B1F3A] leading-relaxed">{selectedPickup.address}, {selectedPickup.city} - {selectedPickup.pincode}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-200/50 pt-2.5">
                <div>
                  <div className="text-[10px] font-bold text-[#64748B] uppercase">E-Waste Category</div>
                  <div className="font-bold text-[#0B1F3A]">{selectedPickup.category}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#64748B] uppercase">Quantity & Weight</div>
                  <div className="font-bold text-[#0B1F3A]">{selectedPickup.quantity} Units | {selectedPickup.weightKg} kg</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-slate-200/50 pt-2.5">
                <div>
                  <div className="text-[10px] font-bold text-[#64748B] uppercase">Preferred Schedule</div>
                  <div className="font-bold text-[#0B1F3A]">{selectedPickup.preferredDate} ({selectedPickup.preferredTimeSlot})</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#64748B] uppercase">Lifecycle Status</div>
                  <div className="font-extrabold text-[#2563EB]">{selectedPickup.status}</div>
                </div>
              </div>

              {selectedPickup.notes && (
                <div className="border-t border-slate-200/50 pt-2.5">
                  <div className="text-[10px] font-bold text-[#64748B] uppercase">Disposal Notes</div>
                  <div className="font-bold text-[#0B1F3A] leading-relaxed">{selectedPickup.notes}</div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedPickup(null)}
                className="btn-press px-4 py-2 bg-slate-100 text-[#0B1F3A] font-bold text-xs rounded-xl"
              >
                Close Details
              </button>
              
              {isVerified && (
                <select
                  value={selectedPickup.status}
                  disabled={updatingId === selectedPickup.id}
                  onChange={(e) => handleStatusChange(selectedPickup.id, e.target.value)}
                  className="py-2 px-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold outline-none cursor-pointer disabled:opacity-50"
                >
                  <option value="REQUESTED">Requested</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="CONFIRMED" disabled>Confirmed</option>
                  <option value="ASSIGNED" disabled>Assigned</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="PICKED_UP">Picked Up</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="RECYCLED">Recycled</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
