import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, total, limit, onPage }) {
  const pages = Math.ceil(total / limit);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-white/8">
      <span className="text-xs text-zinc-600">
        {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button onClick={() => onPage(page - 1)} disabled={page === 1}
          className="p-1.5 rounded-lg hover:bg-white/8 text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft size={14} />
        </button>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
          const p = page <= 3 ? i + 1 : page - 2 + i;
          if (p < 1 || p > pages) return null;
          return (
            <button key={p} onClick={() => onPage(p)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-indigo-600 text-white' : 'hover:bg-white/8 text-zinc-500 hover:text-zinc-300'}`}>
              {p}
            </button>
          );
        })}
        <button onClick={() => onPage(page + 1)} disabled={page >= pages}
          className="p-1.5 rounded-lg hover:bg-white/8 text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
