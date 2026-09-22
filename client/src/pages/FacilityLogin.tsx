import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const FacilityLogin: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const { facilityLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await facilityLogin({ email: email.trim().toLowerCase(), password });
      if (res.success && res.user) {
        if (redirect) {
          navigate(redirect);
        } else {
          navigate('/facility/dashboard');
        }
      } else {
        setError(res.message || 'Invalid email/ID or password. Please try again.');
      }
    } catch (err) {
      setError('Network connection error. Please check your server connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (type: 'BLR' | 'DELHI') => {
    if (type === 'BLR') {
      setEmail('manager.blr@ecocycle.in');
    } else {
      setEmail('manager.delhi@ecocycle.in');
    }
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-[#F5F7F4] tech-grid">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Operations Console Showcase */}
        <div className="hidden md:block md:col-span-5 bg-[#071A21] rounded-2xl p-8 text-white space-y-6 shadow-3d border border-[#16A6A0]/25 relative overflow-hidden h-full flex flex-col justify-between min-h-[460px]">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#16A6A0]/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="space-y-6">
            <div className="w-12 h-12 bg-[#16A6A0] text-[#071A21] rounded-xl flex items-center justify-center shadow-sm">
              <Building2 className="w-6 h-6 text-[#071A21]" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white font-['Outfit'] tracking-tight">
                Operator Console
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Log in to coordinate doorstep collections, update e-waste processing manifests, and manage your facility's public profile.
              </p>
            </div>
          </div>
          
          <div className="space-y-3 pt-6 border-t border-slate-700/60 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#38D9E8]" />
              <span>Assigned Pickup Manifests</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#38D9E8]" />
              <span>Weighing & Status Logs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#38D9E8]" />
              <span>CPCB Compliance Tracking</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-[#D1DEDF] shadow-card p-6 sm:p-8 space-y-5">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black text-[#071A21] tracking-tight font-['Outfit']">
              Facility Partner Login
            </h1>
            <p className="text-xs sm:text-sm text-[#5e777f] font-semibold">
              Authorized recycling center personnel portal
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#071A21] mb-1">Email / Member ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="manager@facility.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-sm font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-[#071A21]">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-sm font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-[#D8F36A]/10 border border-[#D8F36A]/30 rounded-xl text-[11px] text-[#071A21] flex items-start gap-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#16A6A0] shrink-0 mt-0.5" />
              <span>
                Session utilizes cryptographic token authorization and complies with DPDP Act 2023 regulations.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-press w-full py-3 bg-[#071A21] hover:bg-[#16A6A0] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-card flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-[#38D9E8]" />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Controlled Onboarding Hook */}
          <div className="text-center text-xs text-[#5e777f] pt-2 border-t border-slate-100 space-y-2">
            <div>
              Want to partner with us?{' '}
              <Link to="/facility/register" className="font-bold text-[#16A6A0] hover:underline">
                Apply for Registration
              </Link>
            </div>
            
            {/* Demo Accounts Panel */}
            <div className="bg-[#F5F7F4] p-3 rounded-xl border border-[#D1DEDF] text-left space-y-1.5 mt-2">
              <div className="text-[10px] font-bold text-[#5e777f] uppercase tracking-wider">Demo Accounts (Pre-Seeded)</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoFill('BLR')}
                  className="px-2 py-1 bg-white border border-[#D1DEDF] rounded text-[10px] font-bold text-[#071A21] hover:bg-[#16A6A0]/10 hover:text-[#16A6A0] transition-colors"
                >
                  Bengaluru Manager
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('DELHI')}
                  className="px-2 py-1 bg-white border border-[#D1DEDF] rounded text-[10px] font-bold text-[#071A21] hover:bg-[#16A6A0]/10 hover:text-[#16A6A0] transition-colors"
                >
                  Delhi Manager
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
