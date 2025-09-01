import { Link } from 'react-router-dom';

export default function Topbar({ onMenu }) {
  return (
    <div className="md:hidden flex items-center justify-between p-4 sticky top-0 bg-ink/70 backdrop-blur z-20">
      <button onClick={onMenu} className="px-3 py-2 rounded-lg bg-white/5">☰</button>
      <Link to="/" className="font-semibold">Verify<span className="text-brand-500">Hub</span></Link>
      <div className="w-10" />
    </div>
  );
}
