import { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminSidebar from './AdminSidebar';
import Topbar from './Topbar';
import Logo from './Logo';

export default function AppLayout({ children, variant = 'user' }) {
  const [open, setOpen] = useState(false);
  // const nav = useNavigate();

  // Menus (match your spec)
  const items = useMemo(() => {
    if (variant === 'admin') {
      return [
        { to: '/admin', label: 'Overview', end: true },
        { to: '/admin/users', label: 'Users' },
        { to: '/admin/providers', label: 'Providers' },
        { to: '/admin/change-password', label: 'Change Password' },
      ];
    }
    return [
      { to: '/dashboard', label: 'Overview', end: true },
      { to: '/dashboard/verify', label: 'Verify' },
      { to: '/dashboard/status', label: 'Verification Status' },
      { to: '/dashboard/payments', label: 'Payment History' },
      { to: '/dashboard/profile', label: 'Profile' },
      { to: '/dashboard/change-password', label: 'Change Password' },
    ];
  }, [variant]);

  const DrawerLink = ({ to, label, end }) => (
    <NavLink
      to={to}
      end={end}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-xl transition-colors ${
          isActive
            ? 'bg-brand-500/20 text-white'
            : 'hover:bg-white/5 text-white/80'
        }`
      }
    >
      {label}
    </NavLink>
  );

  return (
    <div className="min-h-screen flex">
      {variant === 'admin' ? <AdminSidebar /> : <Sidebar />}

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30 flex">
          <div className="w-64 bg-ink border-r border-white/10 p-4 flex flex-col">
            {/* Header with logo */}
            <div className="mb-3">
              <Logo variant={variant} size="sm" />
            </div>
            <div className="border-b border-white/10 mb-3" />

            <button
              onClick={() => setOpen(false)}
              className="mb-4 rounded-lg bg-white/5 px-3 py-2"
            >
              Close
            </button>

            <div className="space-y-2 flex-1">
              {items.map((i) => (
                <DrawerLink key={i.to} {...i} />
              ))}
            </div>
          </div>

          <div className="flex-1" onClick={() => setOpen(false)} />
        </div>
      )}

      <div className="flex-1">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
