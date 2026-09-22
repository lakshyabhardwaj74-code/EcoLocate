import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Shield,
  KeyRound,
  CheckCircle2,
  Building,
  Terminal,
} from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both administrator email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await adminLogin({ email: email.trim().toLowerCase(), password });
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.message || 'Administrator authentication failed. Please check credentials.');
      }
    } catch (err: any) {
      setError('Connection error. Unable to reach security authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFillDemo = () => {
    setEmail('admin@ecolocate.local');
    setPassword('EcoLocate@Admin2026!');
    setError(null);
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-[#071A21] tech-grid relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#16A6A0]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#38D9E8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        
        {/* Header Branding & Security Notice */}
        <div className="text-center space-y-2.5">
          <div className="w-14 h-14 bg-[#051419] text-[#16A6A0] rounded-2xl flex items-center justify-center mx-auto shadow-3d border border-[#16A6A0]/30">
            <ShieldCheck className="w-7 h-7 text-[#16A6A0]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#051419] text-[#38D9E8] text-xs font-bold rounded-full uppercase tracking-wider border border-[#16A6A0]/30">
            <Shield className="w-3.5 h-3.5" />
            <span>Authorized Operations Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Outfit']">
            Administrator Security Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Centralized CPCB facility verification, audit logs, and EPR management console
          </p>
        </div>

        {/* Security Login Card */}
        <div className="bg-[#051419]/95 backdrop-blur-md rounded-2xl border border-[#16A6A0]/25 shadow-modal p-6 sm:p-8 space-y-5 text-white">
          {error && (
            <div className="p-3.5 bg-red-950/80 border border-red-800/80 rounded-xl text-red-200 text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Administrator Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@ecolocate.local"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#071A21] border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-[#16A6A0] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Master Security Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#071A21] border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-[#16A6A0] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-press w-full py-3 bg-[#16A6A0] hover:bg-[#0f8580] disabled:opacity-50 text-[#071A21] font-extrabold text-sm rounded-xl shadow-card flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-[#071A21] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-[#071A21]" />
                  <span>Authenticate & Access Console</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Box for Reviewers */}
          <div className="pt-4 border-t border-slate-800">
            <div className="bg-[#071A21] p-3.5 rounded-xl border border-[#16A6A0]/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#38D9E8]" />
                  Evaluator Demo Account
                </span>
                <button
                  type="button"
                  onClick={handleQuickFillDemo}
                  className="text-[11px] font-bold text-[#38D9E8] hover:underline"
                >
                  Auto-Fill
                </button>
              </div>
              <div className="text-[11px] font-mono text-slate-400 space-y-0.5 bg-[#051419] p-2 rounded-lg border border-slate-800">
                <div><span className="text-slate-500 select-none">ID:   </span>admin@ecolocate.local</div>
                <div><span className="text-slate-500 select-none">Pass: </span>EcoLocate@Admin2026!</div>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Citizen Recycler? <span className="text-[#38D9E8] font-bold underline">Go to Citizen Sign-In</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
