import { NavLink, useNavigate } from 'react-router-dom';
import { setToken } from '../lib/api';
import Logo from './Logo';

const items = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/verify', label: 'Verify' },
  { to: '/dashboard/status', label: 'Verification Status' },
  { to: '/dashboard/payments', label: 'Payment History' },
  { to: '/dashboard/profile', label: 'Profile' },
  { to: '/dashboard/change-password', label: 'Change Password' },
];

export default function Sidebar() {
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    const adminToken = localStorage.getItem('adminToken');
    setToken(adminToken || null);
    nav('/login');
  };

  const base =
    'block px-3 py-2 rounded-xl transition-colors hover:bg-white/5 text-white/80';
  const active = 'bg-brand-500/20 text-white hover:bg-brand-500/20';

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 gap-2 p-4">
      <div className="mb-3">
        <Logo variant="user" size="md" />
      </div>
      <div className="border-b border-white/10 mb-3" />

      {items.map((i) => (
        <NavLink
          key={i.to}
          to={i.to}
          end={i.end}
          className={({ isActive }) => (isActive ? `${base} ${active}` : base)}
        >
          {i.label}
        </NavLink>
      ))}

      <div className="mt-auto pt-4">
        <button
          onClick={logout}
          className="w-full px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/90"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
