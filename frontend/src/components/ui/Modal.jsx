import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ title, onClose, children, width = 'max-w-lg' }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className={`relative w-full ${width} bg-[#13161e] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 max-h-[90vh] overflow-auto`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h3 className="text-base font-bold text-zinc-100">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/8 text-zinc-500 hover:text-zinc-300 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
