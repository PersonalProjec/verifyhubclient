import { Link, useLocation } from 'react-router-dom';

const items = [
  { to: '/dashboard', label: 'Overview' },
  { to: '/dashboard/requests', label: 'Requests' },
  { to: '/dashboard/profile', label: 'Profile' },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 gap-2 p-4">
      {items.map((i) => (
        <Link
          key={i.to}
          className={`px-3 py-2 rounded-xl ${
            pathname.startsWith(i.to)
              ? 'bg-brand-500/20 text-white'
              : 'hover:bg-white/5 text-white/80'
          }`}
          to={i.to}
        >
          {i.label}
        </Link>
      ))}
    </aside>
  );
}
