import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Compass,
  Filter,
  Star,
  ShieldCheck,
  Building2,
  Navigation,
  Clock,
  Phone,
  Truck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Map as MapIcon,
  List,
} from 'lucide-react';
import { FacilityMap } from '../components/FacilityMap';
import { api } from '../services/api';
import { Facility } from '../types';

const CITIES = [
  'All',
  'Bengaluru',
  'New Delhi',
  'Noida',
  'Gurugram',
  'Faridabad',
  'Mysuru',
  'Mangaluru',
  'Mumbai',
  'Thane',
  'Pune',
  'Nagpur',
  'Nashik',
  'Hyderabad',
  'Visakhapatnam',
  'Chennai',
  'Coimbatore',
  'Kochi',
  'Trivandrum',
  'Kolkata',
  'Bhubaneswar',
  'Guwahati',
  'Ahmedabad',
  'Surat',
  'Jaipur',
  'Lucknow',
  'Chandigarh',
  'Indore',
  'Goa',
];

const CATEGORIES = ['All', 'Smartphone', 'Laptop', 'Desktop', 'Battery', 'Monitor', 'Television', 'Printer'];

export const Facilities: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialCity = searchParams.get('city') || 'All';

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);

  // User location state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const fetchFacilities = async (lat?: number, lng?: number) => {
    setLoading(true);
    try {
      const res = await api.getFacilities({
        city: selectedCity === 'All' ? undefined : selectedCity,
        category: selectedCategory === 'All' ? undefined : selectedCategory,
        search: searchQuery || undefined,
        verifiedOnly: verifiedOnly || undefined,
        lat: lat ?? userCoords?.lat,
        lng: lng ?? userCoords?.lng,
      });

      if (res.success) {
        setFacilities(res.data);
      }
    } catch (error) {
      console.error('Error loading facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [selectedCity, selectedCategory, verifiedOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFacilities();
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserCoords(coords);
        setLocating(false);
        fetchFacilities(coords.lat, coords.lng);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setLocationError('Unable to retrieve location. Showing nationwide facility directory.');
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D1DEDF] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#071A21] tracking-tight font-['Outfit']">
            CPCB Authorized E-Waste Facilities
          </h1>
          <p className="text-xs sm:text-sm text-[#5e777f] font-medium">
            Locate certified collection hubs & large-scale dismantlers across 38+ Indian cities
          </p>
        </div>

        <button
          onClick={handleUseLocation}
          disabled={locating}
          className="btn-press px-4 py-2.5 bg-white hover:bg-[#F5F7F4] text-[#071A21] font-bold text-xs rounded-xl border border-[#D1DEDF] shadow-sm flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <Compass className={`w-4 h-4 text-[#16A6A0] ${locating ? 'animate-spin' : ''}`} />
          <span>{locating ? 'Locating...' : 'Use My Current Location'}</span>
        </button>
      </div>

      {locationError && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{locationError}</span>
        </div>
      )}

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#D1DEDF] shadow-card space-y-4">
        
        {/* Search Row */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search facility name, address, or pincode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs sm:text-sm font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0]"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full py-2.5 px-3 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs sm:text-sm font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0]"
            >
              <option value="All">All Cities (Nationwide)</option>
              {CITIES.filter((c) => c !== 'All').map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex items-center">
            <label className="flex items-center gap-2 text-xs font-bold text-[#071A21] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 text-[#16A6A0] rounded border-slate-300 focus:ring-[#16A6A0]"
              />
              <span>Verified Only</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="btn-press w-full py-2.5 bg-[#071A21] hover:bg-[#16A6A0] text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              Apply Filter
            </button>
          </div>

        </form>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-bold text-[#5e777f] uppercase tracking-wider shrink-0 mr-1">
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#16A6A0] text-[#071A21] shadow-sm font-extrabold'
                  : 'bg-[#F5F7F4] text-[#5e777f] hover:bg-[#16A6A0]/10 border border-[#D1DEDF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* MAIN SPLIT VIEW (MAP + FACILITY CARDS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Facility Cards Directory */}
        <div className="lg:col-span-7 space-y-4 max-h-[750px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs text-[#5e777f] font-bold px-1">
            <span>Showing {facilities.length} Authorized Center(s)</span>
            <span>Sorted by relevance</span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white p-5 rounded-2xl border border-[#D1DEDF] animate-pulse space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-8 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : facilities.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-[#D1DEDF] text-center space-y-3 shadow-subtle">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-[#071A21] text-sm">No facilities match your search</h3>
              <p className="text-xs text-[#5e777f]">
                Try selecting "All Cities" or clearing category filters to view centers nationwide.
              </p>
              <button
                onClick={() => {
                  setSelectedCity('All');
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setVerifiedOnly(false);
                }}
                className="btn-press px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#071A21] text-xs font-bold rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            facilities.map((facility) => {
              const isSelected = selectedFacilityId === facility.id;
              return (
                <div
                  key={facility.id}
                  onClick={() => setSelectedFacilityId(facility.id)}
                  className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer shadow-card hover:border-[#16A6A0] ${
                    isSelected ? 'border-[#16A6A0] ring-2 ring-[#16A6A0]/20 bg-[#16A6A0]/5' : 'border-[#D1DEDF]'
                  }`}
                >
                  <div className="space-y-3">
                    
                    {/* Facility Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-[#071A21] text-sm sm:text-base">{facility.name}</h3>
                        <p className="text-xs text-[#5e777f] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#16A6A0] shrink-0" />
                          <span>{facility.address}, {facility.city} - {facility.pincode}</span>
                        </p>
                      </div>
                      {facility.isVerified && (
                        <span className="shrink-0 text-[10px] font-bold bg-[#16A6A0]/10 text-[#16A6A0] px-2 py-0.5 rounded border border-[#16A6A0]/20 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-[#16A6A0]" />
                          CPCB Verified
                        </span>
                      )}
                    </div>

                    {/* Meta Details */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-[#5e777f] pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{facility.openingHours}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{facility.phone}</span>
                      </div>
                    </div>

                    {/* Accepted Categories Badges */}
                    <div className="text-[11px] text-[#5e777f] bg-[#F5F7F4] p-2.5 rounded-lg border border-[#D1DEDF] space-y-1">
                      <span className="font-bold text-[#071A21]">Accepted Materials:</span>
                      <p className="line-clamp-2 text-[#5e777f]">{facility.acceptedCategories}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold">
                      <Link
                        to={`/facilities/${facility.id}`}
                        className="text-[#071A21] hover:text-[#16A6A0] transition-colors"
                      >
                        View Full Details →
                      </Link>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-press px-3 py-1.5 bg-[#F5F7F4] hover:bg-[#16A6A0]/10 text-[#071A21] rounded-lg border border-[#D1DEDF] flex items-center gap-1 transition-colors"
                        >
                          <Navigation className="w-3 h-3 text-[#16A6A0]" />
                          <span>Directions</span>
                        </a>

                        <Link
                          to={`/pickup?facilityId=${facility.id}`}
                          className="btn-press px-3.5 py-1.5 bg-[#071A21] hover:bg-[#16A6A0] text-white rounded-lg transition-colors shadow-sm"
                        >
                          Book Pickup
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Interactive Leaflet Map */}
        <div className="lg:col-span-5 sticky top-24 h-[650px]">
          <FacilityMap
            facilities={facilities}
            selectedFacilityId={selectedFacilityId}
            userCoords={userCoords}
            onSelectFacility={(f) => setSelectedFacilityId(f.id)}
          />
        </div>

      </div>

    </div>
  );
};
