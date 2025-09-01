import { NavLink, useNavigate } from 'react-router-dom';
import { setToken } from '../lib/api';
import Logo from './Logo';
import { notify } from '../lib/toast';

const items = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/providers', label: 'Providers' },
  { to: '/admin/change-password', label: 'Change Password' },
];

export default function AdminSidebar() {
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem('adminToken');
     const userToken = localStorage.getItem('token');
    setToken(userToken || null);
    notify.success('Logged out successfully');
    nav('/admin/login');
  };

  const base =
    'block px-3 py-2 rounded-xl transition-colors hover:bg-white/5 text-white/80';
  const active = 'bg-brand-500/20 text-white hover:bg-brand-500/20';

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 gap-2 p-4">
      <div className="mb-3">
        <Logo variant="admin" size="md" />
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
