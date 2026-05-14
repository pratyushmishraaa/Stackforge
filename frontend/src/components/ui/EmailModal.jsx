import { useState } from 'react';
import { Send, Paperclip, X, Mail } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export default function EmailModal({ onClose, defaultTo = '', defaultSubject = '' }) {
  const [form, setForm] = useState({
    to:      defaultTo,
    subject: defaultSubject,
    body:    '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.to || !form.subject || !form.body) return;
    setSending(true);
    // Simulate send — replace with real email API call when SMTP is configured
    await new Promise(r => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
    setTimeout(onClose, 1500);
  };

  return (
    <Modal title="Compose Email" onClose={onClose} width="max-w-xl">
      {sent ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <Send size={20} className="text-emerald-400" />
          </div>
          <p className="text-sm font-semibold text-emerald-400">Email sent successfully</p>
        </div>
      ) : (
        <form onSubmit={handleSend} className="space-y-4">
          {/* To */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">To</label>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
              <Mail size={13} className="text-zinc-600 flex-shrink-0" />
              <input value={form.to} onChange={set('to')} required type="email" placeholder="recipient@company.com"
                className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-600 outline-none" />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Subject</label>
            <input value={form.subject} onChange={set('subject')} required placeholder="Email subject..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
          </div>

          {/* Body */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Message</label>
            <textarea value={form.body} onChange={set('body')} required rows={8} placeholder="Write your message here..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <button type="button" className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              <Paperclip size={13} /> Attach file
            </button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
              <Button type="submit" disabled={sending}>
                <Send size={13} />{sending ? 'Sending...' : 'Send Email'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
