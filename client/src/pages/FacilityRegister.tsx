import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  Building2,
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Globe,
  Clock,
  Briefcase,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

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

export const FacilityRegister: React.FC = () => {
  const navigate = useNavigate();

  // Personal Account Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Facility Info
  const [facilityName, setFacilityName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [facilityPhone, setFacilityPhone] = useState('');
  const [facilityEmail, setFacilityEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [openingHours, setOpeningHours] = useState('Mon-Sat: 9:00 AM - 6:00 PM');
  const [recyclingServices, setRecyclingServices] = useState('Collection, Segregation, Material Extraction');
  const [capacity, setCapacity] = useState('10,000 kg/month');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCategoryChange = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      setError('Please select at least one accepted e-waste category.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      name,
      email,
      password,
      phone,
      facilityName,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      facilityPhone,
      facilityEmail: facilityEmail || email,
      website: website || null,
      openingHours,
      acceptedCategories: selectedCategories,
      recyclingServices,
      capacity,
    };

    try {
      const res = await api.facilityRegister(payload);
      if (res.success) {
        setSuccess('Your facility registration application has been submitted successfully!');
        setError(null);
        setTimeout(() => {
          navigate('/facility/login');
        }, 5000);
      } else {
        setError(res.message || 'Application submission failed. Please verify your details.');
      }
    } catch (err) {
      setError('Network connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutofillCoordinates = () => {
    // Fill coordinates for Bangalore Electronic City region for ease of demo
    setLatitude('12.8452');
    setLongitude('77.6602');
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#F5F7F4]">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#D1DEDF] shadow-card p-8 text-center space-y-4 animate-fade-in">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#071A21] font-['Outfit']">
              Application Submitted Successfully!
            </h2>
            <p className="text-xs text-[#5e777f] mt-1.5 leading-relaxed">
              Your facility account for <strong className="text-[#071A21]">{facilityName}</strong> has been registered in the system.
            </p>
            <p className="text-xs text-[#5e777f] mt-2">
              Redirecting you to login in 5 seconds...
            </p>
          </div>
          <div className="pt-2">
            <Link to="/facility/login" className="text-xs font-bold text-[#16A6A0] hover:underline">
              Back to Login Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-[#F5F7F4]">
      <div className="max-w-3xl w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#071A21] text-[#38D9E8] rounded-xl flex items-center justify-center mx-auto shadow-sm border border-[#16A6A0]/30">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#071A21] tracking-tight font-['Outfit']">
            Recycler Partnership Registration
          </h1>
          <p className="text-xs sm:text-sm text-[#5e777f] font-semibold">
            Apply to register your center in the EcoLocate recycling locator network
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-[#D1DEDF] shadow-card p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Part 1: Member Account Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#071A21] border-b border-slate-100 pb-1.5 uppercase tracking-wide">
                1. Member Account Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#071A21] mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sundaram"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#071A21] mb-1">Login Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="priya@facility.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#071A21] mb-1">Account Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="At least 8 letters & numbers"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors outline-none"
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
                      placeholder="+91 98123 45678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Part 2: Facility Details */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-[#071A21] border-b border-slate-100 pb-1.5 uppercase tracking-wide flex items-center justify-between">
                <span>2. Recycling Facility Specifications</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#071A21] mb-1">Facility / Center Name</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. GreenTech E-Waste Hub"
                      value={facilityName}
                      onChange={(e) => setFacilityName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#071A21] mb-1">Facility Address</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Plot No. 42, Electronic City Phase 1"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#071A21] mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#071A21] mb-1">State</label>
                  <input
                    type="text"
                    required
                    placeholder="Karnataka"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#071A21] mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    placeholder="560100"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-4 py-2 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-xs font-bold text-[#071A21]">Coordinates (Lat / Lng)</label>
                    <button
                      type="button"
                      onClick={handleAutofillCoordinates}
                      className="text-[10px] text-[#16A6A0] font-bold hover:underline cursor-pointer"
                    >
                      Autofill Coordinates
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Latitude (e.g. 12.8452)"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors outline-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Longitude (e.g. 77.6602)"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#071A21] mb-1">Facility Contact Phone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 80 2852 9900"
                      value={facilityPhone}
                      onChange={(e) => setFacilityPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#071A21] mb-1">Facility Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="contact@greentechrecyclers.in"
                      value={facilityEmail}
                      onChange={(e) => setFacilityEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#071A21] mb-1">Website URL (Optional)</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="https://greentechrecyclers.in"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#071A21] mb-1">Operating Hours</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mon-Sat: 9:00 AM - 7:00 PM"
                      value={openingHours}
                      onChange={(e) => setOpeningHours(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors outline-none"
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
                      placeholder="e.g. 25,000 kg/month"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#071A21] mb-1">Recycling Services Provided</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dismantling, Refurbishing, Board Recovery"
                    value={recyclingServices}
                    onChange={(e) => setRecyclingServices(e.target.value)}
                    className="w-full px-4 py-2 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Part 3: Accepted E-Waste Categories */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-[#071A21] border-b border-slate-100 pb-1.5 uppercase tracking-wide">
                3. Accepted E-Waste Categories
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CATEGORIES_LIST.map((cat) => {
                  const isChecked = selectedCategories.includes(cat);
                  return (
                    <label
                      key={cat}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        isChecked
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

            <button
              type="submit"
              disabled={loading}
              className="btn-press w-full py-3 bg-[#071A21] hover:bg-[#16A6A0] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-card flex items-center justify-center gap-2 transition-all cursor-pointer pt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4 text-[#38D9E8]" />
                  <span>Submit Partnership Application</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-[#5e777f] pt-2 border-t border-slate-100">
            Already have an active facility account?{' '}
            <Link to="/facility/login" className="font-bold text-[#16A6A0] hover:underline">
              Partner Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
