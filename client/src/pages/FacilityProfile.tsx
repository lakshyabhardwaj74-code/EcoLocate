import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Briefcase,
  Save,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { Facility } from '../types';

const CATEGORIES_LIST = [
  'Smartphone',
  'Laptop',
  'Desktop',
  'Monitor',
  'Television',
  'Printer',
  'Keyboard',
  'Mouse',
  'Charger',
  'Battery',
  'Refrigerator',
  'WashingMachine',
  'Other',
];

export const FacilityProfile: React.FC = () => {
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [recyclingServices, setRecyclingServices] = useState('');
  const [capacity, setCapacity] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.getManagedFacilityStats();
      if (res.success && res.data?.facility) {
        const fac: Facility = res.data.facility;
        setFacility(fac);

        // Populate form
        setName(fac.name);
        setAddress(fac.address);
        setCity(fac.city);
        setState(fac.state);
        setPincode(fac.pincode);
        setPhone(fac.phone);
        setEmail(fac.email);
        setWebsite(fac.website || '');
        setOpeningHours(fac.openingHours);
        setRecyclingServices(fac.recyclingServices);
        setCapacity(fac.capacity);

        // Parse accepted categories
        const cats = fac.acceptedCategories
          ? fac.acceptedCategories.split(',').map((c) => c.trim())
          : [];
        setSelectedCategories(cats);
      } else {
        setError(res.message || 'Failed to load facility profile.');
      }
    } catch (err) {
      setError('Connection error loading profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleCategoryChange = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facility) return;
    if (selectedCategories.length === 0) {
      setError('Please select at least one accepted category.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      name,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      website: website || null,
      openingHours,
      acceptedCategories: selectedCategories.join(', '),
      recyclingServices,
      capacity,
    };

    try {
      const res = await api.updateFacility(facility.id, payload);
      if (res.success) {
        setSuccess('Profile updated successfully.');
        fetchProfile();
      } else {
        setError(res.message || 'Failed to save changes.');
      }
    } catch (err) {
      setError('Connection error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F7F9FC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-[#0B1F3A]">Loading profile details...</p>
        </div>
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-semibold max-w-md mx-auto text-center space-y-3">
          <AlertCircle className="w-10 h-10 mx-auto text-red-500" />
          <div>{error || 'Facility details not found.'}</div>
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isVerified = facility.verificationStatus === 'VERIFIED';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#D1DEDF] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#16A6A0]/10 text-[#16A6A0] text-xs font-bold border border-[#16A6A0]/25">
            <Building2 className="w-3.5 h-3.5" />
            <span>Profile Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#071A21] tracking-tight font-['Outfit'] mt-1.5">
            Recycling Hub Information
          </h1>
          <p className="text-xs sm:text-sm text-[#5e777f] font-semibold mt-0.5">
            View public listings details and operational configurations.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <div className="bg-white rounded-2xl border border-[#D1DEDF] shadow-card p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Section: Read-Only Licensing Stats */}
          <div className="space-y-3 p-4 bg-[#F5F7F4] rounded-2xl border border-[#D1DEDF]">
            <h4 className="text-xs font-bold text-[#071A21] uppercase tracking-wide flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#16A6A0]" />
              <span>Licensing & Verification Status (Controlled by ADMIN)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-700 pt-1">
              <div>
                <span className="text-[10px] text-[#5e777f] font-bold uppercase block">CPCB Status</span>
                <span className={`inline-block mt-0.5 font-bold ${isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {facility.verificationStatus || 'PENDING'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[#5e777f] font-bold uppercase block">Locator Status</span>
                <span className="font-semibold block mt-0.5">{facility.isActive ? 'Active on Map' : 'Inactive on Map'}</span>
              </div>

              <div>
                <span className="text-[10px] text-[#5e777f] font-bold uppercase block">Rating Score</span>
                <span className="font-semibold block mt-0.5">{facility.rating} / 5.0 Stars</span>
              </div>
            </div>
          </div>

          {/* Section: Facility Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#071A21] border-b border-slate-100 pb-1.5 uppercase tracking-wide">
              General Center Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#071A21] mb-1">Center Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-semibold text-[#071A21] focus:bg-white focus:border-[#16A6A0] outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#071A21] mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-semibold text-[#071A21] focus:bg-white focus:border-[#16A6A0] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#071A21] mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-semibold text-[#071A21] focus:bg-white focus:border-[#16A6A0] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#071A21] mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-semibold text-[#071A21] focus:bg-white focus:border-[#16A6A0] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#071A21] mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-semibold text-[#071A21] focus:bg-white focus:border-[#16A6A0] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#071A21] mb-1">Coordinates (Latitude & Longitude - Read-Only)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    disabled
                    value={facility.latitude}
                    className="w-full px-3 py-2.5 bg-[#F1F5F9] border border-[#D1DEDF] rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed"
                  />
                  <input
                    type="text"
                    disabled
                    value={facility.longitude}
                    className="w-full px-3 py-2.5 bg-[#F1F5F9] border border-[#D1DEDF] rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#071A21] mb-1">Contact Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-semibold text-[#071A21] focus:bg-white focus:border-[#16A6A0] outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#071A21] mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-semibold text-[#071A21] focus:bg-white focus:border-[#16A6A0] outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#071A21] mb-1">Website URL</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-semibold text-[#071A21] focus:bg-white focus:border-[#16A6A0] outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#071A21] mb-1">Operating Hours</label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-semibold text-[#071A21] focus:bg-white focus:border-[#16A6A0] outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#071A21] mb-1">Monthly Recycling Capacity</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-semibold text-[#071A21] focus:bg-white focus:border-[#16A6A0] outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#071A21] mb-1">Recycling Services Provided</label>
                <input
                  type="text"
                  required
                  value={recyclingServices}
                  onChange={(e) => setRecyclingServices(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-semibold text-[#071A21] focus:bg-white focus:border-[#16A6A0] outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section: Categories Checkboxes */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-[#071A21] border-b border-slate-100 pb-1.5 uppercase tracking-wide">
              Accepted E-Waste Categories
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES_LIST.map((cat) => {
                const isChecked = selectedCategories.includes(cat);
                return (
                  <label
                    key={cat}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${isChecked
                      ? 'bg-[#16A6A0]/10 border-[#16A6A0]/40 text-[#16A6A0] shadow-xs'
                      : 'bg-[#F5F7F4] border-[#D1DEDF] text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCategoryChange(cat)}
                      className="hidden"
                    />
                    <span>{cat}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Action Trigger */}
          <div className="pt-4 flex items-center justify-end border-t border-slate-100">
            <button
              type="submit"
              disabled={saving}
              className="btn-press px-6 py-3 bg-[#071A21] hover:bg-[#16A6A0] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-card flex items-center gap-2 transition-all cursor-pointer"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
