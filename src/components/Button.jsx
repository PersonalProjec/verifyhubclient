export default function Button({ children, className = '', ...rest }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium bg-brand-500 hover:bg-brand-600 disabled:opacity-50 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
