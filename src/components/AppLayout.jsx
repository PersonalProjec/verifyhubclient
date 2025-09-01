import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-30 flex">
          <div className="w-64 bg-ink border-r border-white/10 p-4">
            <button
              onClick={() => setOpen(false)}
              className="mb-4 rounded-lg bg-white/5 px-3 py-2"
            >
              Close
            </button>
            {/* reuse links by rendering Sidebar list quickly */}
            <div className="space-y-2">
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
