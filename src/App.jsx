import { Routes, Route, Link, useLocation } from 'react-router-dom';

import Landing from './pages/Landing';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// User overview
import Dashboard from './pages/dashboard/Dashboard';
// User pages
import Verify from './pages/dashboard/Verify';
import Status from './pages/dashboard/Status';
import Payments from './pages/dashboard/Payments';
import Profile from './pages/dashboard/Profile';
import ChangePassword from './pages/dashboard/ChangePassword';

// Admin pages (moved under pages/admin)
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/Users';
import AdminProviders from './pages/admin/Providers';
import AdminChangePassword from './pages/admin/ChangePassword';
import AdminUserDetail from './pages/admin/UserDetail';

import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import PublicVerification from './pages/PublicVerification';
import PublicAttest from './pages/PublicAttest';

export default function App() {
  const { pathname } = useLocation();
  const showPublicNavbar = !(
    pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
  );

  return (
    <>
      {showPublicNavbar && (
        <nav className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/10">
          <Link to="/" className="font-semibold">
            Verify<span className="text-brand-500">Hub</span>
          </Link>
          <div className="flex md:gap-3 gap-1">
            <Link to="/login" className="px-3 py-2 rounded-xl hover:bg-white/5">
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-2 rounded-xl bg-brand-500/20"
            >
              Get Started
            </Link>
          </div>
        </nav>
      )}

      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/v/:code" element={<PublicVerification />} />
        <Route path="/attest" element={<PublicAttest />} />

        {/* User protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/verify"
          element={
            <ProtectedRoute>
              <Verify />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/status"
          element={
            <ProtectedRoute>
              <Status />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/payments"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* Admin protected */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <AdminUsers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <AdminProtectedRoute>
              <AdminUserDetail />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/providers"
          element={
            <AdminProtectedRoute>
              <AdminProviders />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/change-password"
          element={
            <AdminProtectedRoute>
              <AdminChangePassword />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
