export default function Select({ label, options = [], error, className = '', ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
          {label}
        </label>
      )}
      <select
        {...props}
        className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-lg px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all ${className}`}
      >
        {options.map(o => (
          <option key={o.value} value={o.value} className="bg-zinc-900">{o.label}</option>
        ))}
      </select>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
