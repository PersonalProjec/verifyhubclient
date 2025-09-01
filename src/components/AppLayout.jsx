import { useState } from 'react';
import Sidebar from './Sidebar';
import AdminSidebar from './AdminSidebar';
import Topbar from './Topbar';
import { setToken } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { notify } from '../lib/toast';

export default function AppLayout({ children, variant = 'user' }) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const logout = () => {
    const isAdmin = variant === 'admin';
    if (isAdmin) localStorage.removeItem('adminToken');
    else localStorage.removeItem('token');
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    setToken(null);
    setOpen(false);
    notify.info('Logged out successfully');
    nav(isAdmin ? '/admin/login' : '/login');
  };

  return (
    <div className="min-h-screen flex">
      {variant === 'admin' ? <AdminSidebar /> : <Sidebar />}

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30 flex">
          <div className="w-64 bg-ink border-r border-white/10 p-4 flex flex-col">
            <button
              onClick={() => setOpen(false)}
              className="mb-4 rounded-lg bg-white/5 px-3 py-2"
            >
              Close
            </button>

            <div className="space-y-2 flex-1">
              {variant === 'admin' ? (
                <>
                  <a
                    href="/admin"
                    className="block px-3 py-2 rounded-xl hover:bg-white/5"
                  >
                    Overview
                  </a>
                  <a
                    href="/admin/users"
                    className="block px-3 py-2 rounded-xl hover:bg-white/5"
                  >
                    Users
                  </a>
                  <a
                    href="/admin/providers"
                    className="block px-3 py-2 rounded-xl hover:bg-white/5"
                  >
                    Providers
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/dashboard"
                    className="block px-3 py-2 rounded-xl hover:bg-white/5"
                  >
                    Overview
                  </a>
                  <a
                    href="/dashboard/requests"
                    className="block px-3 py-2 rounded-xl hover:bg-white/5"
                  >
                    Requests
                  </a>
                  <a
                    href="/dashboard/profile"
                    className="block px-3 py-2 rounded-xl hover:bg-white/5"
                  >
                    Profile
                  </a>
                </>
              )}
            </div>

            <button
              onClick={logout}
              className="w-full px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/90"
            >
              Logout
            </button>
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
