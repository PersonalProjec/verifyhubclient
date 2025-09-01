export default function Input({ label, ...props }) {
  return (
    <label className="block space-y-1">
      {label && <span className="text-sm text-white/80">{label}</span>}
      <input
        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
        {...props}
      />
    </label>
  );
}
