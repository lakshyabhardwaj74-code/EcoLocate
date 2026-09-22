import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Recycle,
  UserPlus,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password strength logic
  const hasMinLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const isPasswordValid = hasMinLength && hasLetter && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError('Password must be at least 8 characters and include both letters and numbers.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await register({ name, email, password, phone, role: 'USER' });
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Registration failed. Please check your details.');
      }
    } catch (err) {
      setError('Connection error registering account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-[#F5F7F4] tech-grid">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#16A6A0] text-[#071A21] rounded-xl flex items-center justify-center mx-auto shadow-sm border border-[#16A6A0]/30">
            <Recycle className="w-6 h-6 text-[#071A21] font-bold" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#071A21] tracking-tight font-['Outfit']">
            Join the EcoLocate Network
          </h1>
          <p className="text-xs sm:text-sm text-[#5e777f] font-medium">
            Create an account to recycle safely and claim 100 Welcome Eco Points
          </p>
        </div>

        {/* Clean Registration Card */}
        <div className="bg-white rounded-2xl border border-[#D1DEDF] shadow-card p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#071A21] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-sm font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors"
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
                  placeholder="aarav@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-sm font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#071A21] mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-sm font-medium text-[#071A21] focus:bg-white focus:border-[#16A6A0] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#071A21] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 8 letters & numbers"
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

              {/* Password Requirements Checklist */}
              {password.length > 0 && (
                <div className="flex items-center gap-4 pt-1.5 text-[11px]">
                  <div className={`flex items-center gap-1 ${hasMinLength ? 'text-[#16A6A0] font-extrabold' : 'text-slate-400'}`}>
                    {hasMinLength ? <CheckCircle className="w-3.5 h-3.5 text-[#16A6A0]" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>8+ characters</span>
                  </div>
                  <div className={`flex items-center gap-1 ${hasLetter && hasNumber ? 'text-[#16A6A0] font-extrabold' : 'text-slate-400'}`}>
                    {hasLetter && hasNumber ? <CheckCircle className="w-3.5 h-3.5 text-[#16A6A0]" /> : <XCircle className="w-3.5 h-3.5" />}
                    <span>Letters & Numbers</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-[#D8F36A]/10 border border-[#D8F36A]/30 rounded-xl text-[11px] text-[#071A21] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16A6A0] shrink-0" />
              <span>Passwords securely hashed with bcrypt. Data strictly protected under DPDP Act.</span>
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
                  <UserPlus className="w-4 h-4 text-[#38D9E8]" />
                  <span>Create Account & Claim 100 Points</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-[#5e777f] pt-2 border-t border-slate-100">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#16A6A0] hover:underline">
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
