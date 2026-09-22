import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Recycle,
  MapPin,
  Camera,
  Truck,
  Award,
  BookOpen,
  User,
  LogOut,
  Shield,
  Building2,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const getNavLinks = () => {
    if (user?.role === 'FACILITY_MEMBER') {
      return [
        { path: '/facility/dashboard', label: 'Dashboard' },
        { path: '/facility/requests', label: 'Pickup Requests' },
        { path: '/facility/profile', label: 'Facility Profile' },
        { path: '/facility/settings', label: 'Settings' },
      ];
    }
    if (user?.role === 'ADMIN') {
      return [
        { path: '/admin', label: 'Admin Dashboard' },
        { path: '/admin?tab=users', label: 'Users' },
        { path: '/admin?tab=facilities', label: 'Facilities' },
        { path: '/admin?tab=verification', label: 'Verification' },
        { path: '/admin?tab=pickups', label: 'Pickup Requests' },
      ];
    }
    // Default citizen links
    return [
      { path: '/', label: 'Home' },
      { path: '/facilities', label: 'Find Facilities' },
      { path: '/scan', label: 'AI Scanner' },
      { path: '/pickup', label: 'Doorstep Pickup' },
      { path: '/rewards', label: 'Rewards' },
      { path: '/learn', label: 'How It Works' },
    ];
  };

  const linksToRender = getNavLinks();

  return (
    <header className="sticky top-0 z-50 bg-[#061B21] border-b border-white/10 shadow-md shadow-[#061B21]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#071A21]/80 text-[#38D9E8] border border-[#38D9E8]/30 flex items-center justify-center shadow-md group-hover:bg-[#16A6A0] group-hover:text-[#071A21] transition-all duration-300">
              <Recycle className="w-5 h-5 text-[#38D9E8] group-hover:text-[#071A21] transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight leading-tight text-white font-['Outfit']">
                Eco<span className="text-[#16A6A0]">Locate</span>
              </span>
              <span className="text-[9px] font-bold text-slate-300/80 tracking-wider uppercase hidden sm:block">
                E-Waste Facility Locator
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Centered) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
            {linksToRender.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-normal transition-all duration-200 ${
                    active
                      ? 'bg-[#16A6A0]/20 text-[#38D9E8] font-bold border border-[#16A6A0]/35 shadow-xs'
                      : 'text-white/80 hover:text-[#38D9E8] hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Auth Action / Strong CTA (Right Side) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-2.5">
                {/* Rewards Badge */}
                <Link
                  to="/rewards"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#071A21]/75 border border-[#D8F36A]/35 text-[#D8F36A] text-xs font-bold hover:bg-[#D8F36A]/20 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#D8F36A]" />
                  <span>{user.rewardPoints} Pts</span>
                </Link>

                {/* Role Switcher Shortcut */}
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-[#38D9E8] border border-white/15 text-xs font-bold hover:bg-white/20 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#38D9E8]" />
                    <span>Admin Panel</span>
                  </Link>
                )}

                {user.role === 'FACILITY_MEMBER' && (
                  <Link
                    to="/facility/dashboard"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-[#38D9E8] border border-white/15 text-xs font-bold hover:bg-white/20 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Operations</span>
                  </Link>
                )}

                <Link
                  to={user.role === 'ADMIN' ? '/admin' : user.role === 'FACILITY_MEMBER' ? '/facility/profile' : '/dashboard'}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                    isActive('/dashboard') || isActive('/facility/profile')
                      ? 'bg-[#16A6A0]/20 text-[#38D9E8] border-[#16A6A0]/40'
                      : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-[#38D9E8]" />
                  <span>{user.name.split(' ')[0]}</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  title="Sign Out"
                  className="p-1.5 rounded-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold text-white/85 hover:text-[#38D9E8] hover:bg-white/5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/facilities"
                  className="btn-press px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#16A6A0] hover:bg-[#0f8580] text-[#071A21] shadow-lg shadow-[#16A6A0]/20 flex items-center gap-1.5 transition-all border border-[#38D9E8]/40 cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#071A21]" />
                  <span>Find a Facility</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <Link
                to="/rewards"
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#071A21]/80 text-[#D8F36A] border border-[#D8F36A]/30 text-xs font-bold"
              >
                <Sparkles className="w-3 h-3 text-[#D8F36A]" />
                <span>{user.rewardPoints}</span>
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 px-4 py-4 space-y-3 animate-fade-in bg-[#061B21]">
          <div className="space-y-1">
            {linksToRender.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    active
                      ? 'bg-[#16A6A0]/20 text-[#38D9E8] border border-[#16A6A0]/30'
                      : 'text-white/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10">
            {user ? (
              <div className="space-y-2">
                <Link
                  to={user.role === 'ADMIN' ? '/admin' : user.role === 'FACILITY_MEMBER' ? '/facility/dashboard' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#38D9E8]" />
                    <span>{user.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-300 font-mono">{user.role}</span>
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#071A21] border border-[#16A6A0]/30 text-white text-xs font-bold"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#38D9E8]" />
                    <span>Admin Operations Console</span>
                  </Link>
                )}
                {user.role === 'FACILITY_MEMBER' && (
                  <Link
                    to="/facility/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#071A21] border border-[#16A6A0]/30 text-white text-xs font-bold"
                  >
                    <Building2 className="w-4 h-4 text-[#38D9E8]" />
                    <span>Operations Console</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-red-500/25 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl border border-white/15 bg-white/5 text-white font-bold text-xs text-center hover:bg-white/10 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/facilities"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl bg-[#16A6A0] text-[#071A21] font-bold text-xs text-center hover:bg-[#0f8580] transition-colors"
                >
                  Find a Facility
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
