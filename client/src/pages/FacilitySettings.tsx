import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Save,
  User,
  Mail,
  Phone,
} from 'lucide-react';

export const FacilitySettings: React.FC = () => {
  const { user, refreshUser } = useAuth();
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Password validation
  const hasMinLength = newPassword.length >= 8;
  const hasLetter = /[A-Za-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setError('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (!isPasswordValid) {
      setError('New password does not meet complexity requirements.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ecocycle_token')}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccess('Password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || 'Failed to update password.');
      }
    } catch (err) {
      setError('Connection error updating password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-200">
            <Settings className="w-3.5 h-3.5" />
            <span>Settings Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1F3A] tracking-tight font-['Outfit'] mt-1.5">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-semibold mt-0.5">
            Manage your personal profile credentials and access security parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Member Profile Overview */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-[#E2E8F0] shadow-card p-5 sm:p-6 space-y-4">
          <h3 className="font-bold text-sm text-[#0B1F3A] border-b border-slate-100 pb-2 uppercase tracking-wide">
            Operator Account Info
          </h3>

          {user && (
            <div className="space-y-4 text-xs font-medium text-slate-700">
              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#64748B] font-bold uppercase block font-sans">Full Name</span>
                  <span className="text-[#0B1F3A] font-bold">{user.name}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#64748B] font-bold uppercase block font-sans">Email Address</span>
                  <span className="text-[#0B1F3A] font-bold break-all">{user.email}</span>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-[#64748B] font-bold uppercase block font-sans">Phone Number</span>
                    <span className="text-[#0B1F3A] font-bold">{user.phone}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Security Password Change Form */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] shadow-card p-6 sm:p-8 space-y-5">
          <h3 className="font-bold text-sm text-[#0B1F3A] border-b border-slate-100 pb-2 uppercase tracking-wide">
            Change Account Password
          </h3>

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

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1">Current Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F7F9FC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#111827] focus:bg-white focus:border-[#2563EB] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-[#F7F9FC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#111827] focus:bg-white focus:border-[#2563EB] outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Requirement Checks */}
              {newPassword.length > 0 && (
                <div className="flex items-center gap-4 pt-2 text-[10px] font-bold">
                  <div className={hasMinLength ? 'text-[#2563EB]' : 'text-slate-400'}>
                    ✓ 8+ Characters
                  </div>
                  <div className={hasLetter && hasNumber ? 'text-[#2563EB]' : 'text-slate-400'}>
                    ✓ Letters & Numbers
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0B1F3A] mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#F7F9FC] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#111827] focus:bg-white focus:border-[#2563EB] outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-press px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-card flex items-center gap-1.5 transition-all cursor-pointer float-right"
            >
              {loading ? (
                <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
