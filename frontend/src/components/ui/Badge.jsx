const config = {
  new:          'bg-blue-500/10 text-blue-400 ring-blue-500/20',
  contacted:    'bg-violet-500/10 text-violet-400 ring-violet-500/20',
  qualified:    'bg-amber-500/10 text-amber-400 ring-amber-500/20',
  converted:    'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
  lost:         'bg-red-500/10 text-red-400 ring-red-500/20',
  prospecting:  'bg-indigo-500/10 text-indigo-400 ring-indigo-500/20',
  proposal:     'bg-amber-500/10 text-amber-400 ring-amber-500/20',
  negotiation:  'bg-orange-500/10 text-orange-400 ring-orange-500/20',
  won:          'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
  open:         'bg-blue-500/10 text-blue-400 ring-blue-500/20',
  in_progress:  'bg-amber-500/10 text-amber-400 ring-amber-500/20',
  done:         'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
  low:          'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
  medium:       'bg-amber-500/10 text-amber-400 ring-amber-500/20',
  high:         'bg-red-500/10 text-red-400 ring-red-500/20',
  active:       'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
  inactive:     'bg-zinc-500/10 text-zinc-400 ring-zinc-500/20',
  admin:        'bg-indigo-500/10 text-indigo-400 ring-indigo-500/20',
  manager:      'bg-violet-500/10 text-violet-400 ring-violet-500/20',
  agent:        'bg-blue-500/10 text-blue-400 ring-blue-500/20',
  manual:       'bg-zinc-500/10 text-zinc-400 ring-zinc-500/20',
  web:          'bg-cyan-500/10 text-cyan-400 ring-cyan-500/20',
  referral:     'bg-purple-500/10 text-purple-400 ring-purple-500/20',
  import:       'bg-teal-500/10 text-teal-400 ring-teal-500/20',
};

export default function Badge({ label }) {
  const cls = config[label] || 'bg-zinc-500/10 text-zinc-400 ring-zinc-500/20';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ring-1 capitalize tracking-wide ${cls}`}>
      {label?.replace(/_/g, ' ')}
    </span>
  );
}
