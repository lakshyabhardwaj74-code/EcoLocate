import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GreenLeafChatbot } from './components/GreenLeafChatbot';

import { Home } from './pages/Home';
import { Facilities } from './pages/Facilities';
import { FacilityDetails } from './pages/FacilityDetails';
import { AIScanner } from './pages/AIScanner';
import { PickupSchedule } from './pages/PickupSchedule';
import { Dashboard } from './pages/Dashboard';
import { Rewards } from './pages/Rewards';
import { Learn } from './pages/Learn';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLogin } from './pages/AdminLogin';
import { FacilityLogin } from './pages/FacilityLogin';
import { FacilityRegister } from './pages/FacilityRegister';
import { FacilityDashboard } from './pages/FacilityDashboard';
import { FacilityRequests } from './pages/FacilityRequests';
import { FacilityProfile } from './pages/FacilityProfile';
import { FacilitySettings } from './pages/FacilitySettings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans relative">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/facilities/:id" element={<FacilityDetails />} />
              <Route path="/scan" element={<AIScanner />} />
              <Route path="/scanner" element={<AIScanner />} />
              <Route path="/pickup" element={<PickupSchedule />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/facility/login" element={<FacilityLogin />} />
              <Route path="/facility/register" element={<FacilityRegister />} />
              <Route
                path="/facility/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['FACILITY_MEMBER']}>
                    <FacilityDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/facility/requests"
                element={
                  <ProtectedRoute allowedRoles={['FACILITY_MEMBER']}>
                    <FacilityRequests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/facility/profile"
                element={
                  <ProtectedRoute allowedRoles={['FACILITY_MEMBER']}>
                    <FacilityProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/facility/settings"
                element={
                  <ProtectedRoute allowedRoles={['FACILITY_MEMBER']}>
                    <FacilitySettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/facility-manager"
                element={
                  <ProtectedRoute allowedRoles={['FACILITY_MEMBER', 'ADMIN']}>
                    <FacilityDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/facility-dashboard"
                element={
                  <ProtectedRoute allowedRoles={['FACILITY_MEMBER', 'ADMIN']}>
                    <FacilityDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Footer />

          {/* Floating GreenLeaf Potted Sunflower Chatbot */}
          <GreenLeafChatbot />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
