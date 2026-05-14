import { useEffect, useState } from 'react';
import { Plus, Filter } from 'lucide-react';
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
  { key: 'name',   label: 'Name', render: r => (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center text-xs font-bold text-indigo-400 flex-shrink-0">
        {r.name?.[0]?.toUpperCase()}
      </div>
      <div>
        <div className="font-medium text-zinc-200">{r.name}</div>
        <div className="text-xs text-zinc-600">{r.email || '—'}</div>
      </div>
    </div>
  )},
  { key: 'status', label: 'Status', render: r => <Badge label={r.status} /> },
  { key: 'source', label: 'Source', render: r => <Badge label={r.source} /> },
  { key: 'organisation', label: 'Organisation', render: r => r.organisation?.name
    ? <span className="text-zinc-300">{r.organisation.name}</span>
    : <span className="text-zinc-600">—</span>
  },
  { key: 'phone', label: 'Phone', render: r => <span className="text-zinc-400">{r.phone || '—'}</span> },
  { key: 'createdAt', label: 'Created', render: r => (
    <span className="text-zinc-500 text-xs">{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
  )},
];

const EMPTY_FORM = { name: '', email: '', phone: '', status: 'new', source: 'manual' };

export default function Leads() {
  const [leads, setLeads]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]     = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    const params = { page, limit: 20, ...(search && { search }), ...(status && { status }) };
    const { data } = await api.get('/leads', { params });
    setLeads(data.data);
    setTotal(data.meta.total);
  };

  useEffect(() => { fetchLeads(); }, [page, search, status]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/leads', form);
      setShowModal(false);
      setForm(EMPTY_FORM);
      fetchLeads();
    } finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle={`${total} total leads in your pipeline`}
        action={<Button onClick={() => setShowModal(true)}><Plus size={14} />New Lead</Button>}
      />

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 max-w-xs">
          <SearchBar value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search leads..." />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-zinc-600" />
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-300 outline-none focus:border-indigo-500/50 transition-all">
            <option value="" className="bg-zinc-900">All statuses</option>
            {['new','contacted','qualified','lost','converted'].map(s => (
              <option key={s} value={s} className="bg-zinc-900 capitalize">{s}</option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        <Table columns={columns} data={leads} />
        <Pagination page={page} total={total} limit={20} onPage={setPage} />
      </Card>

      {showModal && (
        <Modal title="Create New Lead" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input label="Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="John Smith" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@co.com" />
              <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 555 0100" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                options={['new','contacted','qualified','lost','converted'].map(s => ({ value: s, label: s }))} />
              <Select label="Source" value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                options={['manual','web','referral','import'].map(s => ({ value: s, label: s }))} />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Lead'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
