import { Link, useNavigate } from 'react-router-dom';
import { setToken } from '../lib/api';
import { useState } from 'react';

export default function Topbar({ onMenu }) {
  const nav = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = () => {
    if (loggingOut) return;
    setLoggingOut(true);
    const isAdmin = !!localStorage.getItem('adminToken');
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    setToken(null);
    nav(isAdmin ? '/admin/login' : '/login');
  };

  return (
    <div className="md:hidden flex items-center justify-between p-4 sticky top-0 bg-ink/70 backdrop-blur z-20">
      <button onClick={onMenu} className="px-3 py-2 rounded-lg bg-white/5">
        ☰
      </button>
      <Link to="/" className="font-semibold">
        Verify<span className="text-brand-500">Hub</span>
      </Link>
      <button
        onClick={logout}
        className="px-3 py-2 rounded-lg bg-white/5"
        disabled={loggingOut}
        aria-label="Logout"
      >
        ⎋
      </button>
    </div>
  );
}
