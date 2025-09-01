import { Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <>
      {/* Minimal navbar for the landing pages */}
      <nav className="hidden md:flex items-center justify-between px-8 py-4 border-b border-white/10">
        <Link to="/" className="font-semibold">
          Verify<span className="text-brand-500">Hub</span>
        </Link>
        <div className="flex gap-3">
          <Link to="/login" className="px-3 py-2 rounded-xl hover:bg-white/5">
            Login
          </Link>
          <Link
            to="/admin/login"
            className="px-3 py-2 rounded-xl hover:bg-white/5"
          >
            Admin
          </Link>
          <Link to="/register" className="px-3 py-2 rounded-xl bg-brand-500/20">
            Get Started
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}
