import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Recycle,
  MapPin,
  Scan,
  Truck,
  Award,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Building2,
  Leaf,
  Search,
  ExternalLink,
  Shield,
  FileCheck,
  Zap,
  ChevronDown,
  Sparkles,
  Layers,
  BarChart3,
  Clock,
  Compass,
} from 'lucide-react';
import { ImpactCalculator } from '../components/ImpactCalculator';
import { api } from '../services/api';
import { Facility } from '../types';

const STORY_STEPS = [
  {
    step: '01',
    title: 'AI Scrap Scanner',
    subtitle: 'Computer Vision Material Valuation',
    description: 'Instant photo recognition identifying electronic waste categories and computing recoverable precious metals (Gold, Silver, Copper).',
    actionText: 'Try AI Scanner',
    actionPath: '/scan',
    icon: Scan,
    badge: 'Real-Time Neural Valuation',
    stats: ['Au & Cu Yield Estimation', 'Toxic Element Detection', 'Instant Point Quote'],
  },
  {
    step: '02',
    title: 'CPCB Authorized Hubs',
    subtitle: 'Nationwide Verified Recycler Directory',
    description: 'Explore certified dismantling centers with live operating hours, accepted scrap types, and turn-by-turn navigation across 38+ cities.',
    actionText: 'Find Nearby Centers',
    actionPath: '/facilities',
    icon: MapPin,
    badge: '100% CPCB Licensed',
    stats: ['Live GPS Routing', 'Operator Ratings & Reviews', 'Drop-off Timings'],
  },
  {
    step: '03',
    title: 'Doorstep Pickup Dispatch',
    subtitle: 'Verified Logistics & Scale Receipts',
    description: 'Book convenient doorstep collection slots. Drivers arrive with calibrated digital scales and issue instant tamper-proof digital manifests.',
    actionText: 'Book Free Pickup',
    actionPath: '/pickup',
    icon: Truck,
    badge: 'Calibrated Digital Scales',
    stats: ['Real-Time Tracking Code', 'Weight Manifest Receipts', 'Flexible Time Slots'],
  },
  {
    step: '04',
    title: 'Eco-Rewards & Certificates',
    subtitle: 'Green Economy Loyalty & Compliance',
    description: 'Earn redeemable Eco-Points for e-commerce shopping vouchers and download official CPCB-compliant digital recycling certificates.',
    actionText: 'Explore Rewards Store',
    actionPath: '/rewards',
    icon: Award,
    badge: 'Government Compliant Audits',
    stats: ['Redeemable Brand Vouchers', 'Shareable PDF Certificates', 'CO2 Offset Badges'],
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredFacilities, setFeaturedFacilities] = useState<Facility[]>([]);
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getFacilities({});
        if (res.success) {
          setFeaturedFacilities(res.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load home facilities:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectStory = (idx: number) => {
    if (idx === activeStoryIdx || isSliding) return;
    setIsSliding(true);
    setTimeout(() => {
      setActiveStoryIdx(idx);
      setIsSliding(false);
    }, 200);
  };

  const handleNextStory = () => {
    handleSelectStory((activeStoryIdx + 1) % STORY_STEPS.length);
  };

  const handlePrevStory = () => {
    handleSelectStory((activeStoryIdx - 1 + STORY_STEPS.length) % STORY_STEPS.length);
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      navigate(`/facilities?city=${encodeURIComponent(searchCity.trim())}`);
    } else {
      navigate('/facilities');
    }
  };

  const currentStory = STORY_STEPS[activeStoryIdx];
  const StoryIcon = currentStory.icon;

  return (
    <div className="w-full bg-[#F5F7F4] text-[#071A21]">
      
      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO SECTION WITH SEAMLESS STORYTELLING STAGE */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-[#071A21] text-white py-12 sm:py-16">
        
        {/* Full-Width Background Image (Cover, Center - Enhanced Clarity & Visibility) */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 transform scale-105 opacity-95"
          style={{
            backgroundImage: "url('/hero-bg.jpg')",
          }}
        />

        {/* Balanced Vignette & Gradient Overlays (Enhanced Image Visibility) */}
        <div className="absolute inset-0 bg-[#071A21]/45 md:bg-[#071A21]/40 backdrop-brightness-[0.85] z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#061B21]/70 via-transparent to-[#071A21]/90 z-[2]" />

        {/* 12-Column Subtle Vertical Grid Overlay */}
        <div className="absolute inset-0 z-[3] pointer-events-none w-full h-full flex justify-between px-4 sm:px-8 md:px-12 max-w-[1440px] mx-auto">
          {Array.from({ length: 12 }).map((_, idx) => (
            <div
              key={idx}
              className="w-px h-full bg-white/[0.04] sm:bg-white/[0.05]"
            />
          ))}
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-5xl mx-auto w-full my-auto space-y-6 sm:space-y-8">
          
          {/* Top Brand Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#071A21]/90 backdrop-blur-md border border-[#16A6A0]/40 text-[#38D9E8] text-xs font-semibold shadow-xl">
            <span className="w-2 h-2 rounded-full bg-[#16A6A0] animate-pulse" />
            <span className="text-white/95">National E-Waste Management & Recovery</span>
          </div>

          {/* Balanced Editorial Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white font-['Outfit'] leading-[1.15] drop-shadow-lg">
            Give Your E-Waste a<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#38D9E8] to-[#D8F36A]">
              Responsible Destination
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-[720px] text-xs sm:text-base md:text-lg text-slate-100 font-normal leading-relaxed text-center drop-shadow-md mx-auto">
            Find verified recycling facilities near you, schedule pickups, and track your e-waste from collection to responsible recycling.
          </p>

          {/* ========================================================================= */}
          {/* SEAMLESS SLIDE UP/DOWN STORYTELLING STAGE (High Contrast & Zero Dullness) */}
          {/* ========================================================================= */}
          <div className="w-full max-w-4xl mx-auto pt-2">
            
            {/* Step Switcher Tabs (Clickable Navigation) */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              {STORY_STEPS.map((s, idx) => {
                const active = idx === activeStoryIdx;
                return (
                  <button
                    key={s.step}
                    onClick={() => handleSelectStory(idx)}
                    className={`btn-press px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                      active
                        ? 'bg-[#16A6A0] text-[#071A21] shadow-lg shadow-[#16A6A0]/30 border border-[#38D9E8]'
                        : 'bg-[#071A21]/70 hover:bg-white/10 text-white/80 border border-white/15'
                    }`}
                  >
                    <span className={`text-[11px] font-extrabold ${active ? 'text-[#071A21]' : 'text-[#38D9E8]'}`}>
                      {s.step}
                    </span>
                    <span>{s.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Vibrant Sliding Story Showcase Card */}
            <div className="relative bg-[#061B21]/90 backdrop-blur-2xl border border-white/20 hover:border-[#38D9E8]/50 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 text-left overflow-hidden group">
              
              {/* Luminous Background Gradient Aura */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#16A6A0]/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#38D9E8]/10 rounded-full blur-3xl pointer-events-none" />

              <div
                className={`transition-all duration-300 transform ${
                  isSliding
                    ? 'opacity-0 -translate-y-4 scale-[0.98]'
                    : 'opacity-100 translate-y-0 scale-100'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  
                  {/* Left Column: Number & Content */}
                  <div className="space-y-3.5 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#38D9E8] to-[#D8F36A] font-['Outfit']">
                        {currentStory.step}
                      </span>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16A6A0]/20 border border-[#38D9E8]/40 text-[#38D9E8] text-xs font-bold">
                        <StoryIcon className="w-3.5 h-3.5 text-[#38D9E8]" />
                        <span>{currentStory.badge}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
                        {currentStory.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-[#38D9E8] mt-0.5">
                        {currentStory.subtitle}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-100 leading-relaxed max-w-xl">
                      {currentStory.description}
                    </p>

                    {/* Highlight Spec Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {currentStory.stats.map((st, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-[11px] font-semibold text-white/90"
                        >
                          <CheckCircle2 className="w-3 h-3 text-[#38D9E8]" />
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Interactive Action & Prev/Next Controls */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-4 shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                    <Link
                      to={currentStory.actionPath}
                      className="btn-press px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#16A6A0] hover:bg-[#0f8580] text-[#071A21] font-bold text-xs sm:text-sm shadow-xl shadow-[#16A6A0]/25 flex items-center gap-2 border border-[#38D9E8]/50 transition-all cursor-pointer"
                    >
                      <span>{currentStory.actionText}</span>
                      <ArrowUpRight className="w-4 h-4 text-[#071A21]" />
                    </Link>

                    {/* Step Glide Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevStory}
                        aria-label="Previous story stage"
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer"
                      >
                        <ChevronDown className="w-4 h-4 rotate-90" />
                      </button>
                      <span className="text-xs font-mono text-slate-300 font-bold px-1">
                        {activeStoryIdx + 1} / {STORY_STEPS.length}
                      </span>
                      <button
                        onClick={handleNextStory}
                        aria-label="Next story stage"
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer"
                      >
                        <ChevronDown className="w-4 h-4 -rotate-90" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 2. FACILITY LOCATOR SEARCH BAR & TELEMETRY SECTION */}
      {/* ========================================================================= */}
      <section className="relative z-20 -mt-8 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-[#D1DEDF] backdrop-blur-lg">
          <form
            onSubmit={handleHeroSearch}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="relative flex-1 w-full">
              <MapPin className="w-5 h-5 text-[#16A6A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter your city or postal pincode (e.g. Bengaluru, 560001)..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs sm:text-sm font-medium text-[#071A21] placeholder-slate-400 focus:bg-white focus:border-[#16A6A0] outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="btn-press w-full sm:w-auto px-6 py-3 bg-[#071A21] hover:bg-[#16A6A0] text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm font-['Outfit']"
            >
              <Search className="w-4 h-4 text-[#38D9E8]" />
              <span>Search Nearby Hubs</span>
            </button>
          </form>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. NATIONAL RECYCLING IMPACT TELEMETRY */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D1DEDF] shadow-card hover:border-[#16A6A0] transition-colors space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#16A6A0]/10 text-[#16A6A0] flex items-center justify-center mb-2">
              <Recycle className="w-5 h-5" />
            </div>
            <span className="block text-2xl sm:text-3xl font-black text-[#071A21] font-['Outfit']">142,500+ kg</span>
            <span className="block text-xs font-bold text-[#5e777f] uppercase tracking-wide">E-Waste Diverted</span>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D1DEDF] shadow-card hover:border-[#16A6A0] transition-colors space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#38D9E8]/15 text-[#16A6A0] flex items-center justify-center mb-2">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="block text-2xl sm:text-3xl font-black text-[#071A21] font-['Outfit']">38+ Centers</span>
            <span className="block text-xs font-bold text-[#5e777f] uppercase tracking-wide">CPCB Authorized Hubs</span>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D1DEDF] shadow-card hover:border-[#16A6A0] transition-colors space-y-2">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#071A21] flex items-center justify-center mb-2">
              <Users className="w-5 h-5" />
            </div>
            <span className="block text-2xl sm:text-3xl font-black text-[#071A21] font-['Outfit']">28,000+</span>
            <span className="block text-xs font-bold text-[#5e777f] uppercase tracking-wide">Registered Citizens</span>
          </div>

          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#D1DEDF] shadow-card hover:border-[#16A6A0] transition-colors space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#D8F36A]/20 text-[#16A6A0] flex items-center justify-center mb-2">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="block text-2xl sm:text-3xl font-black text-[#16A6A0] font-['Outfit']">350,000 kg</span>
            <span className="block text-xs font-bold text-[#5e777f] uppercase tracking-wide">CO₂ Abated</span>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HOW IT WORKS (4-STEP PIPELINE) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16A6A0]/10 border border-[#16A6A0]/25 text-[#16A6A0] text-xs font-bold uppercase tracking-wider">
            <span>Seamless Lifecycle</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#071A21] font-['Outfit']">
            How EcoLocate Works
          </h2>
          <p className="text-xs sm:text-sm text-[#5e777f] font-medium leading-relaxed">
            From scrap identification to certified precious metals extraction, our 4-step framework ensures 100% auditable recycling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D1DEDF] shadow-card space-y-4 hover:border-[#16A6A0] transition-all hover:shadow-lg relative group">
            <span className="text-4xl font-black text-[#16A6A0]/20 group-hover:text-[#16A6A0] font-['Outfit'] transition-colors block">01</span>
            <div className="w-10 h-10 rounded-xl bg-[#16A6A0]/10 text-[#16A6A0] flex items-center justify-center">
              <Scan className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#071A21] font-['Outfit']">Scan & Value</h3>
            <p className="text-xs text-[#5e777f] leading-relaxed">
              Use our AI Scrap Scanner to identify device categories, calculate recoverable precious metals (Gold, Silver, Copper), and estimate rewards.
            </p>
            <Link to="/scan" className="text-xs font-bold text-[#16A6A0] hover:underline inline-flex items-center gap-1 pt-1">
              Try Scanner <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D1DEDF] shadow-card space-y-4 hover:border-[#16A6A0] transition-all hover:shadow-lg relative group">
            <span className="text-4xl font-black text-[#16A6A0]/20 group-hover:text-[#16A6A0] font-['Outfit'] transition-colors block">02</span>
            <div className="w-10 h-10 rounded-xl bg-[#38D9E8]/15 text-[#16A6A0] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#071A21] font-['Outfit']">Locate Centers</h3>
            <p className="text-xs text-[#5e777f] leading-relaxed">
              Browse interactive maps to find verified CPCB-authorized dismantlers, check operating hours, accepted items, and get turn-by-turn navigation.
            </p>
            <Link to="/facilities" className="text-xs font-bold text-[#16A6A0] hover:underline inline-flex items-center gap-1 pt-1">
              View Map <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D1DEDF] shadow-card space-y-4 hover:border-[#16A6A0] transition-all hover:shadow-lg relative group">
            <span className="text-4xl font-black text-[#16A6A0]/20 group-hover:text-[#16A6A0] font-['Outfit'] transition-colors block">03</span>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#071A21] flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#071A21] font-['Outfit']">Book Pickup</h3>
            <p className="text-xs text-[#5e777f] leading-relaxed">
              Schedule convenient doorstep collection with verified scales, or drop off items directly at certified dropboxes with instant weighing receipts.
            </p>
            <Link to="/pickup" className="text-xs font-bold text-[#16A6A0] hover:underline inline-flex items-center gap-1 pt-1">
              Book Schedule <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D1DEDF] shadow-card space-y-4 hover:border-[#16A6A0] transition-all hover:shadow-lg relative group">
            <span className="text-4xl font-black text-[#16A6A0]/20 group-hover:text-[#16A6A0] font-['Outfit'] transition-colors block">04</span>
            <div className="w-10 h-10 rounded-xl bg-[#D8F36A]/20 text-[#16A6A0] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-lg text-[#071A21] font-['Outfit']">Earn & Track</h3>
            <p className="text-xs text-[#5e777f] leading-relaxed">
              Earn redeemable green Eco-Points for e-commerce shopping vouchers and download tamper-proof CPCB recycling certificates.
            </p>
            <Link to="/rewards" className="text-xs font-bold text-[#16A6A0] hover:underline inline-flex items-center gap-1 pt-1">
              Rewards Store <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CPCB VERIFIED FACILITIES SPOTLIGHT */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#071A21] font-['Outfit']">
              CPCB Authorized Centers
            </h2>
            <p className="text-xs sm:text-sm text-[#5e777f] font-medium">
              Government-authorized electronic waste dismantlers across Indian metropolitan hubs
            </p>
          </div>
          <Link
            to="/facilities"
            className="btn-press text-xs font-bold text-[#071A21] hover:text-[#16A6A0] hover:bg-[#16A6A0]/10 flex items-center gap-1.5 bg-white px-4 py-2 rounded-xl border border-[#D1DEDF] shadow-sm transition-all"
          >
            <span>View All 38+ Centers</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#16A6A0]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredFacilities.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-2xl p-6 border border-[#D1DEDF] shadow-card space-y-4 flex flex-col justify-between hover:border-[#16A6A0] transition-all hover:shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-[#071A21] text-base leading-snug font-['Outfit']">{f.name}</h3>
                  {f.isVerified && (
                    <span className="shrink-0 text-[10px] font-bold bg-[#16A6A0]/10 text-[#16A6A0] px-2.5 py-0.5 rounded-full border border-[#16A6A0]/25 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#16A6A0]" />
                      Verified
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#5e777f] flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#16A6A0] shrink-0 mt-0.5" />
                  <span>{f.address}, {f.city} - {f.pincode}</span>
                </p>

                <div className="text-[11px] text-[#5e777f] bg-[#F5F7F4] p-3 rounded-xl border border-[#D1DEDF] space-y-1">
                  <span className="font-bold text-[#071A21] block">Accepted Items:</span>
                  <p className="text-[#5e777f] line-clamp-2">{f.acceptedCategories}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold">
                <Link
                  to={`/facilities/${f.id}`}
                  className="text-[#071A21] hover:text-[#16A6A0] transition-colors"
                >
                  View Details →
                </Link>
                <Link
                  to={`/pickup?facilityId=${f.id}`}
                  className="btn-press px-4 py-2 bg-[#071A21] hover:bg-[#16A6A0] text-white rounded-xl transition-all shadow-xs"
                >
                  Book Pickup
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ENVIRONMENTAL IMPACT CALCULATOR */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ImpactCalculator />
      </section>

      {/* ========================================================================= */}
      {/* 7. REGULATORY COMPLIANCE & EPR CERTIFICATION BANNER */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#071A21] text-white rounded-3xl p-8 sm:p-12 border border-[#16A6A0]/20 shadow-2xl relative overflow-hidden tech-grid">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#38D9E8]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-8">
            <div className="max-w-2xl space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                E-Waste Management Rules & EPR Compliance
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                EcoLocate complies with the Central Pollution Control Board (CPCB) and Ministry of Environment, Forest and Climate Change guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#051419]/80 border border-[#16A6A0]/20">
                <div className="w-10 h-10 rounded-xl bg-[#16A6A0]/20 text-[#38D9E8] flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white font-['Outfit']">CPCB Verification</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Every dismantler in our directory holds verified authorizations under Indian statutory rules.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#051419]/80 border border-[#16A6A0]/20">
                <div className="w-10 h-10 rounded-xl bg-[#16A6A0]/20 text-[#38D9E8] flex items-center justify-center shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white font-['Outfit']">EPR Digital Credits</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Tamper-proof digital weight receipts and certified manifests for corporate compliance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#051419]/80 border border-[#16A6A0]/20">
                <div className="w-10 h-10 rounded-xl bg-[#16A6A0]/20 text-[#38D9E8] flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white font-['Outfit']">Zero Landfill Standard</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    95%+ circular material recovery rate, preventing toxic lead and cadmium ground contamination.
                  </p>
                </div>
              </div>

            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
              <span className="text-xs text-slate-400 font-medium">Ready to properly recycle obsolete electronics?</span>
              <Link
                to="/facilities"
                className="btn-press px-6 py-3 rounded-full bg-[#16A6A0] hover:bg-[#0f8580] text-[#071A21] font-extrabold text-xs sm:text-sm shadow-lg transition-all"
              >
                Find Nearest Authorized Drop-Off
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
