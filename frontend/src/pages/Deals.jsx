import { useEffect, useState } from 'react';
import { Plus, Filter, DollarSign } from 'lucide-react';
import api from '../lib/api';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import SearchBar from '../components/ui/SearchBar';
import Pagination from '../components/ui/Pagination';
import PageHeader from '../components/layout/PageHeader';

const columns = [
  { key: 'title', label: 'Deal', render: r => (
    <div>
      <div className="font-medium text-zinc-200">{r.title}</div>
      <div className="text-xs text-zinc-600 mt-0.5">{r.lead?.name || '—'}</div>
    </div>
  )},
  { key: 'value', label: 'Value', render: r => (
    <div className="flex items-center gap-1.5">
      <DollarSign size={12} className="text-emerald-500" />
      <span className="font-semibold text-emerald-400">{r.value?.toLocaleString()}</span>
    </div>
  )},
  { key: 'stage', label: 'Stage', render: r => <Badge label={r.stage} /> },
  { key: 'assignedTo', label: 'Owner', render: r => r.assignedTo?.name
    ? <span className="text-zinc-300">{r.assignedTo.name}</span>
    : <span className="text-zinc-600">—</span>
  },
  { key: 'closedAt', label: 'Closed', render: r => r.closedAt
    ? <span className="text-xs text-zinc-400">{new Date(r.closedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
    : <span className="text-zinc-600 text-xs">—</span>
  },
  { key: 'createdAt', label: 'Created', render: r => (
    <span className="text-zinc-500 text-xs">{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
  )},
];

const EMPTY_FORM = { title: '', value: '', stage: 'prospecting', lead: '' };

export default function Deals() {
  const [deals, setDeals]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [stage, setStage]   = useState('');
  const [leads, setLeads]   = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]     = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const fetchDeals = async () => {
    const params = { page, limit: 20, ...(search && { search }), ...(stage && { stage }) };
    const { data } = await api.get('/deals', { params });
    setDeals(data.data);
    setTotal(data.meta.total);
  };

  useEffect(() => { fetchDeals(); }, [page, search, stage]);
  useEffect(() => {
    api.get('/leads', { params: { limit: 100 } }).then(r => setLeads(r.data.data)).catch(() => {});
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/deals', { ...form, value: +form.value });
      setShowModal(false);
      setForm(EMPTY_FORM);
      fetchDeals();
    } finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader
        title="Deals"
        subtitle={`${total} deals in pipeline`}
        action={<Button onClick={() => setShowModal(true)}><Plus size={14} />New Deal</Button>}
      />

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 max-w-xs">
          <SearchBar value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search deals..." />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-zinc-600" />
          <select value={stage} onChange={e => { setStage(e.target.value); setPage(1); }}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-300 outline-none focus:border-indigo-500/50 transition-all">
            <option value="" className="bg-zinc-900">All stages</option>
            {['prospecting','proposal','negotiation','won','lost'].map(s => (
              <option key={s} value={s} className="bg-zinc-900 capitalize">{s}</option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        <Table columns={columns} data={deals} />
        <Pagination page={page} total={total} limit={20} onPage={setPage} />
      </Card>

      {showModal && (
        <Modal title="Create New Deal" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input label="Title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Enterprise License" />
            <Input label="Value ($) *" type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} required placeholder="15000" />
            <Select label="Stage" value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}
              options={['prospecting','proposal','negotiation','won','lost'].map(s => ({ value: s, label: s }))} />
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Lead *</label>
              <select value={form.lead} onChange={e => setForm(f => ({ ...f, lead: e.target.value }))} required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all">
                <option value="" className="bg-zinc-900">Select a lead</option>
                {leads.map(l => <option key={l._id} value={l._id} className="bg-zinc-900">{l.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Deal'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
