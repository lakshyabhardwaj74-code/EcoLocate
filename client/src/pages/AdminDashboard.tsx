import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Users,
  Building2,
  Download,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  AlertTriangle,
  Eye,
  Filter,
  Search,
  MapPin,
  Phone,
  Mail,
  Shield,
  Layers,
  LayoutDashboard,
  FileText,
  Settings,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api';
import { AdminStats, Facility, User, PickupRequest } from '../types';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Active section in sidebar
  const [activeNav, setActiveNav] = useState<'OVERVIEW' | 'FACILITIES' | 'VERIFICATION' | 'PICKUPS' | 'USERS' | 'REPORTS'>('OVERVIEW');

  // Filter states for facilities
  const [facilityFilter, setFacilityFilter] = useState<'ALL' | 'VERIFIED' | 'PENDING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Inspect Facility Modal
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  // Add Facility modal form state
  const [showAddFacility, setShowAddFacility] = useState(false);
  const [newFacility, setNewFacility] = useState({
    name: '',
    address: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560100',
    latitude: '12.9716',
    longitude: '77.5946',
    phone: '+91 99999 88888',
    email: 'info@newfacility.in',
    acceptedCategories: 'Smartphone, Laptop, Battery, Monitor',
    capacity: '15,000 kg/month',
  });

  const loadAdminData = async () => {
    try {
      const [statRes, userRes, facRes, pickRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getFacilities({}),
        api.getPickups().catch(() => ({ success: true, data: [] })),
      ]);

      if (statRes.success) setStats(statRes.data);
      if (userRes.success) setUsersList(userRes.data);
      if (facRes.success) setFacilities(facRes.data);
      if (pickRes.success) setPickups(pickRes.data || []);
    } catch (err) {
      console.error('Admin data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleVerify = async (facilityId: string, currentVerified: boolean) => {
    try {
      const res = await api.toggleFacilityVerify(facilityId, !currentVerified);
      if (res.success) {
        loadAdminData();
        if (selectedFacility && selectedFacility.id === facilityId) {
          setSelectedFacility({ ...selectedFacility, isVerified: !currentVerified });
        }
      }
    } catch (err) {
      console.error('Verify toggle error:', err);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      await api.downloadAdminAuditCSV();
    } catch (err) {
      console.error('Export CSV error:', err);
      alert('Failed to download CPCB audit report.');
    } finally {
      setExporting(false);
    }
  };

  const handleAddFacilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createFacility(newFacility);
      if (res.success) {
        setShowAddFacility(false);
        setNewFacility({
          name: '',
          address: '',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560100',
          latitude: '12.9716',
          longitude: '77.5946',
          phone: '+91 99999 88888',
          email: 'info@newfacility.in',
          acceptedCategories: 'Smartphone, Laptop, Battery, Monitor',
          capacity: '15,000 kg/month',
        });
        loadAdminData();
      } else {
        alert(res.message || 'Failed to add facility.');
      }
    } catch (err) {
      console.error('Facility creation error:', err);
    }
  };

  // Filter facilities
  const filteredFacilities = facilities.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.acceptedCategories.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeNav === 'VERIFICATION') {
      return matchesSearch && !f.isVerified;
    }
    if (facilityFilter === 'VERIFIED') return matchesSearch && f.isVerified;
    if (facilityFilter === 'PENDING') return matchesSearch && !f.isVerified;
    return matchesSearch;
  });

  const verifiedCount = facilities.filter((f) => f.isVerified).length;
  const pendingCount = facilities.filter((f) => !f.isVerified).length;

  return (
    <div className="min-h-screen bg-[#F5F7F4] flex flex-col md:flex-row">
      
      {/* 1. DARK NAVY SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-[#071A21] text-slate-300 p-5 space-y-6 shrink-0 border-r border-[#16A6A0]/20 tech-grid relative">
        
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-[#16A6A0] text-[#071A21] flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-5 h-5 text-[#071A21]" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-white font-['Outfit'] block leading-tight">EcoLocate</span>
            <span className="text-[10px] text-[#38D9E8] font-bold uppercase tracking-wider">Operations Console</span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="space-y-1 text-xs font-bold">
          <button
            onClick={() => setActiveNav('OVERVIEW')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
              activeNav === 'OVERVIEW'
                ? 'bg-[#16A6A0] text-[#071A21] shadow-sm font-extrabold'
                : 'text-[#5e777f] hover:text-white hover:bg-[#16A6A0]/10'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview Dashboard</span>
          </button>

          <button
            onClick={() => setActiveNav('FACILITIES')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
              activeNav === 'FACILITIES'
                ? 'bg-[#16A6A0] text-[#071A21] shadow-sm font-extrabold'
                : 'text-[#5e777f] hover:text-white hover:bg-[#16A6A0]/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className="w-4 h-4" />
              <span>All Facilities</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">{facilities.length}</span>
          </button>

          <button
            onClick={() => setActiveNav('VERIFICATION')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
              activeNav === 'VERIFICATION'
                ? 'bg-[#16A6A0] text-[#071A21] shadow-sm font-extrabold'
                : 'text-[#5e777f] hover:text-white hover:bg-[#16A6A0]/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#38D9E8]" />
              <span>Verification Queue</span>
            </div>
            {pendingCount > 0 && (
              <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveNav('PICKUPS')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
              activeNav === 'PICKUPS'
                ? 'bg-[#16A6A0] text-[#071A21] shadow-sm font-extrabold'
                : 'text-[#5e777f] hover:text-white hover:bg-[#16A6A0]/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4" />
              <span>Pickup Requests</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">{pickups.length}</span>
          </button>

          <button
            onClick={() => setActiveNav('USERS')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
              activeNav === 'USERS'
                ? 'bg-[#16A6A0] text-[#071A21] shadow-sm font-extrabold'
                : 'text-[#5e777f] hover:text-white hover:bg-[#16A6A0]/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span>User Registry</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">{usersList.length}</span>
          </button>

          <button
            onClick={() => setActiveNav('REPORTS')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all ${
              activeNav === 'REPORTS'
                ? 'bg-[#16A6A0] text-[#071A21] shadow-sm font-extrabold'
                : 'text-[#5e777f] hover:text-white hover:bg-[#16A6A0]/10'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-[#38D9E8]" />
            <span>Audit & Reports</span>
          </button>
        </nav>

        {/* CPCB Regulatory Seal Card */}
        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
          <span className="font-bold text-slate-300 block">Compliance Standard:</span>
          <p className="leading-relaxed">CPCB E-Waste (Management) Rules 2022 & EPR Framework</p>
        </div>

      </aside>

      {/* 2. MAIN OPERATIONS CONTENT AREA */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 space-y-8 overflow-y-auto">
        
        {/* Top Action Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D1DEDF] pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#071A21] tracking-tight font-['Outfit']">
              {activeNav === 'OVERVIEW' && 'Operations Overview'}
              {activeNav === 'FACILITIES' && 'Facility Management Directory'}
              {activeNav === 'VERIFICATION' && 'CPCB Verification & Inspection Queue'}
              {activeNav === 'PICKUPS' && 'Pickup Requests & Manifests'}
              {activeNav === 'USERS' && 'Registered Users & Managers'}
              {activeNav === 'REPORTS' && 'Audit Reports & Compliance Exports'}
            </h1>
            <p className="text-xs text-[#5e777f] font-medium mt-0.5">
              Live telemetry, verification actions, and database records
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="btn-press px-4 py-2.5 bg-[#071A21] hover:bg-[#16A6A0] text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {exporting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-4 h-4 text-[#38D9E8]" />
              )}
              <span>{exporting ? 'Generating...' : 'Export CPCB Audit (CSV)'}</span>
            </button>

            <button
              onClick={() => setShowAddFacility(true)}
              className="btn-press px-4 py-2.5 bg-[#16A6A0] hover:bg-[#0f8580] text-[#071A21] font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Facility</span>
            </button>
          </div>
        </div>

        {/* METRIC OVERVIEW CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          <div className="bg-white p-4 rounded-xl border border-[#D1DEDF] shadow-card space-y-1 hover:border-[#16A6A0] transition-colors">
            <span className="text-[11px] font-bold text-[#5e777f] uppercase block">Total Citizens</span>
            <span className="text-2xl font-black text-[#071A21] font-['Outfit'] block">{stats?.totalUsers || usersList.length}</span>
            <span className="text-[10px] text-[#5e777f] font-medium block">Registered Accounts</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#D1DEDF] shadow-card space-y-1 hover:border-[#16A6A0] transition-colors">
            <span className="text-[11px] font-bold text-[#5e777f] uppercase block">Total Hubs</span>
            <span className="text-2xl font-black text-[#071A21] font-['Outfit'] block">{facilities.length}</span>
            <span className="text-[10px] text-[#5e777f] font-medium block">Nationwide</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#D1DEDF] shadow-card space-y-1 hover:border-[#16A6A0] transition-colors">
            <span className="text-[11px] font-bold text-[#16A6A0] uppercase block">Verified Hubs</span>
            <span className="text-2xl font-black text-[#16A6A0] font-['Outfit'] block">{verifiedCount}</span>
            <span className="text-[10px] text-[#16A6A0] font-medium block">CPCB Authorized</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#D1DEDF] shadow-card space-y-1 hover:border-[#16A6A0] transition-colors">
            <span className="text-[11px] font-bold text-amber-700 uppercase block">Pending Approval</span>
            <span className="text-2xl font-black text-amber-700 font-['Outfit'] block">{pendingCount}</span>
            <span className="text-[10px] text-amber-700 font-medium block">Requires Review</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#D1DEDF] shadow-card space-y-1 hover:border-[#16A6A0] transition-colors">
            <span className="text-[11px] font-bold text-[#5e777f] uppercase block">Recycled Volume</span>
            <span className="text-2xl font-black text-[#071A21] font-['Outfit'] block">{stats?.totalRecycledWeightKg || 142.5} kg</span>
            <span className="text-[10px] text-[#5e777f] font-medium block">Diverted Scrap</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#D1DEDF] shadow-card space-y-1 hover:border-[#16A6A0] transition-colors">
            <span className="text-[11px] font-bold text-[#38D9E8] uppercase block">Points Issued</span>
            <span className="text-2xl font-black text-[#071A21] font-['Outfit'] block">+{stats?.totalPointsIssued || 3800}</span>
            <span className="text-[10px] text-[#38D9E8] font-medium block">Community Total</span>
          </div>

        </div>

        {/* SECTION: FACILITIES & VERIFICATION TABLE */}
        {(activeNav === 'OVERVIEW' || activeNav === 'FACILITIES' || activeNav === 'VERIFICATION') && (
          <div className="bg-white rounded-xl border border-[#D1DEDF] shadow-card space-y-4 p-5 sm:p-6">
            
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFacilityFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    facilityFilter === 'ALL'
                      ? 'bg-[#071A21] text-white shadow-sm'
                      : 'bg-[#F5F7F4] text-[#5e777f] hover:bg-[#16A6A0]/10 border border-[#D1DEDF]'
                  }`}
                >
                  All Hubs ({facilities.length})
                </button>

                <button
                  onClick={() => setFacilityFilter('VERIFIED')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    facilityFilter === 'VERIFIED'
                      ? 'bg-[#16A6A0] text-[#071A21] shadow-sm font-extrabold'
                      : 'bg-[#F5F7F4] text-[#5e777f] hover:bg-[#16A6A0]/10 border border-[#D1DEDF]'
                  }`}
                >
                  Verified ({verifiedCount})
                </button>

                <button
                  onClick={() => setFacilityFilter('PENDING')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    facilityFilter === 'PENDING'
                      ? 'bg-amber-500 text-[#071A21] shadow-sm font-extrabold'
                      : 'bg-[#F5F7F4] text-[#5e777f] hover:bg-[#16A6A0]/10 border border-[#D1DEDF]'
                  }`}
                >
                  Pending Review ({pendingCount})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search centers or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-lg text-xs text-[#071A21] focus:bg-white focus:border-[#16A6A0]"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#F5F7F4] text-[#5e777f] uppercase font-bold text-[10px] border-y border-[#D1DEDF]">
                  <tr>
                    <th className="p-3">Facility Name</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Accepted Categories</th>
                    <th className="p-3">Monthly Capacity</th>
                    <th className="p-3">CPCB Status</th>
                    <th className="p-3 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-[#071A21]">
                  {filteredFacilities.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-[#071A21]">{f.name}</div>
                        <div className="text-[11px] text-[#5e777f]">{f.phone}</div>
                      </td>
                      <td className="p-3">
                        <div>{f.city}, {f.state}</div>
                        <div className="text-[11px] text-[#5e777f] font-mono">{f.pincode}</div>
                      </td>
                      <td className="p-3 max-w-xs truncate text-[#5e777f]">
                        {f.acceptedCategories}
                      </td>
                      <td className="p-3 font-semibold text-[#071A21]">{f.capacity}</td>
                      <td className="p-3">
                        {f.isVerified ? (
                          <span className="inline-flex items-center gap-1 bg-[#16A6A0]/10 text-[#16A6A0] border border-[#16A6A0]/25 px-2 py-0.5 rounded text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-[#16A6A0]" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => setSelectedFacility(f)}
                          className="px-2.5 py-1 text-[#071A21] hover:text-[#16A6A0] bg-[#F5F7F4] hover:bg-[#16A6A0]/10 border border-[#D1DEDF] rounded text-[11px] font-bold transition-all"
                        >
                          Inspect
                        </button>
                        <button
                          onClick={() => handleToggleVerify(f.id, f.isVerified)}
                          className={`btn-press px-2.5 py-1 text-[11px] font-bold rounded transition-all ${
                            f.isVerified
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                              : 'bg-[#16A6A0] text-[#071A21] hover:bg-[#0f8580]'
                          }`}
                        >
                          {f.isVerified ? 'Revoke' : 'Approve'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* SECTION: USERS DIRECTORY */}
        {(activeNav === 'OVERVIEW' || activeNav === 'USERS') && (
          <div className="bg-white rounded-xl border border-[#D1DEDF] shadow-card p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-[#071A21] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#16A6A0]" />
                Registered Citizens & Facility Managers Registry
              </h3>
              <span className="text-xs font-semibold text-[#5e777f]">{usersList.length} Active Accounts</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#F5F7F4] text-[#5e777f] uppercase font-bold text-[10px] border-y border-[#D1DEDF]">
                  <tr>
                    <th className="p-3">User Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">System Role</th>
                    <th className="p-3">Reward Balance</th>
                    <th className="p-3">Registered On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-[#071A21]">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-[#071A21]">{u.name}</td>
                      <td className="p-3 text-[#5e777f]">{u.email}</td>
                      <td className="p-3 text-[#5e777f]">{u.phone || 'N/A'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-[#16A6A0]/10 text-[#16A6A0]'
                            : u.role === 'FACILITY_MANAGER'
                            ? 'bg-[#38D9E8]/10 text-[#38D9E8]'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-[#16A6A0]">+{u.rewardPoints} Pts</td>
                      <td className="p-3 text-[#5e777f]">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* INSPECT FACILITY MODAL */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-modal border border-[#D1DEDF]">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#5e777f]">Facility Inspection</span>
                <h3 className="text-base font-bold text-[#071A21] font-['Outfit']">{selectedFacility.name}</h3>
              </div>
              <button
                onClick={() => setSelectedFacility(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700 bg-[#F5F7F4] p-4 rounded-xl border border-[#D1DEDF]">
              <div><strong>Address:</strong> {selectedFacility.address}, {selectedFacility.city}, {selectedFacility.state} - {selectedFacility.pincode}</div>
              <div><strong>Contact:</strong> {selectedFacility.phone} | {selectedFacility.email}</div>
              <div><strong>Operating Hours:</strong> {selectedFacility.openingHours}</div>
              <div><strong>Monthly Capacity:</strong> {selectedFacility.capacity}</div>
              <div><strong>Recycling Services:</strong> {selectedFacility.recyclingServices}</div>
              <div><strong>Accepted Items:</strong> {selectedFacility.acceptedCategories}</div>
              <div>
                <strong>Status:</strong>{' '}
                <span className={selectedFacility.isVerified ? 'text-[#16A6A0] font-extrabold' : 'text-amber-700 font-extrabold'}>
                  {selectedFacility.isVerified ? 'CPCB Authorized & Verified' : 'Pending Verification Review'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedFacility(null)}
                className="btn-press px-4 py-2 bg-[#F5F7F4] text-[#071A21] hover:bg-[#16A6A0]/10 border border-[#D1DEDF] font-bold text-xs rounded-lg transition-all"
              >
                Close
              </button>
              <button
                onClick={() => handleToggleVerify(selectedFacility.id, selectedFacility.isVerified)}
                className={`btn-press px-4 py-2 font-bold text-xs rounded-lg text-white transition-all ${
                  selectedFacility.isVerified
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[#16A6A0] hover:bg-[#0f8580] text-[#071A21]'
                }`}
              >
                {selectedFacility.isVerified ? 'Revoke Authorization' : 'Approve CPCB Authorization'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD FACILITY MODAL */}
      {showAddFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-modal border border-[#D1DEDF] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#071A21] font-['Outfit']">Add New E-Waste Recycling Center</h3>
              <button
                onClick={() => setShowAddFacility(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFacilitySubmit} className="space-y-3.5 text-xs text-[#071A21]">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Facility Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EcoRecycle Dismantlers Pvt Ltd"
                  value={newFacility.name}
                  onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
                  className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-lg text-xs focus:bg-white focus:border-[#16A6A0] text-[#071A21]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <input
                     type="text"
                     required
                     value={newFacility.city}
                     onChange={(e) => setNewFacility({ ...newFacility, city: e.target.value })}
                     className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-lg text-xs focus:bg-white focus:border-[#16A6A0] text-[#071A21]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State</label>
                  <input
                     type="text"
                     required
                     value={newFacility.state}
                     onChange={(e) => setNewFacility({ ...newFacility, state: e.target.value })}
                     className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-lg text-xs focus:bg-white focus:border-[#16A6A0] text-[#071A21]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Street Address</label>
                <input
                  type="text"
                  required
                  value={newFacility.address}
                  onChange={(e) => setNewFacility({ ...newFacility, address: e.target.value })}
                  className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-lg text-xs focus:bg-white focus:border-[#16A6A0] text-[#071A21]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    value={newFacility.pincode}
                    onChange={(e) => setNewFacility({ ...newFacility, pincode: e.target.value })}
                    className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-lg text-xs focus:bg-white focus:border-[#16A6A0] text-[#071A21]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newFacility.latitude}
                    onChange={(e) => setNewFacility({ ...newFacility, latitude: e.target.value })}
                    className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-lg text-xs focus:bg-white focus:border-[#16A6A0] text-[#071A21]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newFacility.longitude}
                    onChange={(e) => setNewFacility({ ...newFacility, longitude: e.target.value })}
                    className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-lg text-xs focus:bg-white focus:border-[#16A6A0] text-[#071A21]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={newFacility.phone}
                    onChange={(e) => setNewFacility({ ...newFacility, phone: e.target.value })}
                    className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-lg text-xs focus:bg-white focus:border-[#16A6A0] text-[#071A21]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={newFacility.email}
                    onChange={(e) => setNewFacility({ ...newFacility, email: e.target.value })}
                    className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-lg text-xs focus:bg-white focus:border-[#16A6A0] text-[#071A21]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Accepted Categories</label>
                <input
                  type="text"
                  required
                  value={newFacility.acceptedCategories}
                  onChange={(e) => setNewFacility({ ...newFacility, acceptedCategories: e.target.value })}
                  className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-lg text-xs focus:bg-white focus:border-[#16A6A0] text-[#071A21]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddFacility(false)}
                  className="btn-press px-4 py-2 bg-[#F5F7F4] text-[#071A21] hover:bg-[#16A6A0]/10 border border-[#D1DEDF] font-bold text-xs rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-press px-4 py-2 bg-[#071A21] hover:bg-[#16A6A0] text-white font-bold text-xs rounded-lg transition-all"
                >
                  Save Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
