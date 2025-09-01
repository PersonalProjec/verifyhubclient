import { Link } from 'react-router-dom';

/**
 * Brand logo with inline SVG.
 * variant: 'user' | 'admin'
 * size: 'sm' | 'md' | 'lg'
 */
export default function Logo({ variant = 'user', size = 'md' }) {
  const to = variant === 'admin' ? '/admin' : '/dashboard';

  const sizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
  };

  return (
    <Link
      to={to}
      aria-label="VerifyHub Home"
      className="flex items-center gap-3 group"
    >
      {/* Glyph */}
      <div
        className={`${sizes[size]} w-auto aspect-square rounded-xl grid place-items-center 
                    bg-gradient-to-br from-brand-500/30 to-brand-700/30 border border-white/10`}
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-brand-500">
          {/* simple shield/checkmark */}
          <path
            fill="currentColor"
            d="M12 2l7 3v6c0 5-3.5 9-7 11-3.5-2-7-6-7-11V5l7-3z"
          />
          <path
            fill="#fff"
            d="M10.2 13.3l-1.9-1.9-1.4 1.4 3.3 3.3 6-6-1.4-1.4z"
          />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="leading-tight">
        <div className="font-semibold">
          Verify<span className="text-brand-500">Hub</span>
          {variant === 'admin' && (
            <span className="ml-2 text-xs px-2 py-0.5 rounded bg-white/10">
              Admin
            </span>
          )}
        </div>
        <div className="text-xs text-white/60 hidden sm:block">
          {variant === 'admin' ? 'Control Center' : 'Dashboard'}
        </div>
      </div>
    </Link>
  );
}
