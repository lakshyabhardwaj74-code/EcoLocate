import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7F4]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#16A6A0] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-[#071A21]">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  const isFacilityRoute = location.pathname.startsWith('/facility') && 
                          location.pathname !== '/facility/login' && 
                          location.pathname !== '/facility/register';

  if (!user) {
    if (isFacilityRoute) {
      return <Navigate to="/facility/login" replace state={{ from: location }} />;
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Show a professional 403 Forbidden UI
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#F7F9FC]">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-2xl border border-[#E2E8F0] shadow-card">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-subtle border border-red-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-[#0B1F3A] tracking-tight">403 Forbidden</h1>
            <h2 className="text-base font-bold text-slate-800">Access Denied / Unauthorized</h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Your account role (<strong>{user.role}</strong>) does not have authorization to view this section. If this is a mistake, please contact support or your platform administrator.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2 justify-center">
            <Link
              to={user.role === 'ADMIN' ? '/admin' : user.role === 'FACILITY_MEMBER' ? '/facility/dashboard' : '/dashboard'}
              className="btn-press px-4 py-2.5 bg-[#0B1F3A] hover:bg-[#132D52] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Go to Dashboard</span>
            </Link>
            
            <Link
              to="/"
              className="btn-press px-4 py-2.5 bg-white hover:bg-slate-50 text-[#0B1F3A] font-bold text-xs rounded-xl border border-[#E2E8F0] flex items-center justify-center gap-1.5 transition-all"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
