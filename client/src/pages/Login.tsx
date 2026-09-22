import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Recycle,
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  MapPin,
} from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  const { login } = useAuth();
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
      const res = await login({ email: email.trim().toLowerCase(), password });
      if (res.success && res.user) {
        if (redirect) {
          navigate(redirect);
        } else if (res.user.role === 'ADMIN') {
          navigate('/admin');
        } else if (res.user.role === 'FACILITY_MANAGER') {
          navigate('/facility-manager');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(res.message || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Network connection error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('user@example.com');
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-[#F5F7F4] tech-grid">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Desktop 3D Environmental Tech Showcase Card */}
        <div className="hidden md:block md:col-span-5 bg-[#071A21] rounded-2xl p-8 text-white space-y-6 shadow-3d border border-[#16A6A0]/25 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#16A6A0]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="w-12 h-12 bg-[#16A6A0] text-[#071A21] rounded-xl flex items-center justify-center shadow-sm border border-[#16A6A0]/30">
            <Recycle className="w-6 h-6 text-[#071A21] font-bold" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white font-['Outfit']">
              Responsible E-Waste Disposal
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Join thousands of citizens diverting hazardous electronics from landfills and earning verified eco-points.
            </p>
          </div>
          <div className="space-y-2.5 pt-2 border-t border-slate-700 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#38D9E8]" />
              <span>38+ CPCB Authorized Centers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#38D9E8]" />
              <span>Doorstep Pickup & Weighing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#38D9E8]" />
              <span>Instant Digital Recycling Certificate</span>
            </div>
          </div>
        </div>

        {/* Right Side: Clean Login Form */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-[#D1DEDF] shadow-card p-6 sm:p-8 space-y-5">
          
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black text-[#071A21] tracking-tight font-['Outfit']">
                Sign In
              </h1>
              <Link
                to="/facility/login"
                className="text-xs font-bold text-[#16A6A0] hover:text-[#0f8580] hover:underline transition-colors"
              >
                Facility Member Login
              </Link>
            </div>
            <p className="text-xs text-[#5e777f] font-medium">
              Access your citizen recycling ledger, track pickups & redeem rewards
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#071A21] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-sm font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#071A21]">Password</label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-sm font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-press w-full py-3 bg-[#071A21] hover:bg-[#16A6A0] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-card flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Option */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-[#5e777f] font-medium">Testing evaluator?</span>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-xs font-bold text-[#16A6A0] hover:underline flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A6A0]" />
              <span>Fill Citizen Demo</span>
            </button>
          </div>

          <div className="text-center text-xs text-[#5e777f] pt-2 border-t border-slate-100">
            <div>
              Don't have an account yet?{' '}
              <Link to="/register" className="font-bold text-[#16A6A0] hover:underline">
                Create Account (Get 100 Pts)
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
