import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, ArrowRight } from 'lucide-react';
import api from '../lib/api';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [mode, setMode]       = useState('login');
  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'agent' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await api.post('/auth/register', { name: form.name, email: form.email, password: form.password, role: form.role });
      }
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1040 0%, #0f0c1e 60%, #0d0f14 100%)' }}>
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 80%, #8b5cf6 0%, transparent 50%)' }} />
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">StackCRM</span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Manage your<br />pipeline with<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">AI precision</span>
          </h2>
          <p className="text-zinc-400 text-base leading-relaxed">
            Track leads, close deals, and grow your business with an intelligent CRM built for modern teams.
          </p>
        </div>
        <div className="relative flex gap-6">
          {[['10k+','Leads tracked'],['98%','Uptime SLA'],['3x','Faster close rate']].map(([v,l]) => (
            <div key={l}>
              <div className="text-2xl font-bold text-white">{v}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">StackCRM</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-zinc-500 text-sm">
              {mode === 'login' ? "Sign in to your workspace" : "Get started for free today"}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-8 border border-white/8">
            {['login','register'].map(m => (
              <button key={m} type="button" onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'text-zinc-500 hover:text-zinc-300'}`}>
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Full Name</label>
                <input value={form.name} onChange={set('name')} required placeholder="Jane Doe" type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
              </div>
            )}
            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Email</label>
              <input value={form.email} onChange={set('email')} required placeholder="you@company.com" type="email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Password</label>
              <input value={form.password} onChange={set('password')} required placeholder="Min 8 characters" type="password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
            </div>
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Role</label>
                <select value={form.role} onChange={set('role')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-100 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all">
                  <option value="agent" className="bg-zinc-900">Agent</option>
                  <option value="manager" className="bg-zinc-900">Manager</option>
                  <option value="admin" className="bg-zinc-900">Admin</option>
                </select>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
              {!loading && <ArrowRight size={15} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
