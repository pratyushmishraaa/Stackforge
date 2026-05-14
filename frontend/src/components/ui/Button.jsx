const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20',
  ghost:   'bg-transparent hover:bg-white/5 text-zinc-400 hover:text-zinc-200 ring-1 ring-white/10',
  danger:  'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20',
  success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
  subtle:  'bg-white/5 hover:bg-white/10 text-zinc-300',
};
const sizes = {
  xs: 'px-2.5 py-1 text-xs gap-1',
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-sm gap-2',
};

export default function Button({ children, variant = 'primary', size = 'md', onClick, type = 'button', disabled, className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
