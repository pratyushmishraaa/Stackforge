import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/15 transition-all"
      />
    </div>
  );
}
