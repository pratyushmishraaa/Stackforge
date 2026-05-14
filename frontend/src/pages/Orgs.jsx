import { useEffect, useState } from 'react';
import { Plus, Globe, Phone, Building2 } from 'lucide-react';
import api from '../lib/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import SearchBar from '../components/ui/SearchBar';
import Pagination from '../components/ui/Pagination';
import PageHeader from '../components/layout/PageHeader';

const COLORS = ['#6366f1','#8b5cf6','#3b82f6','#10b981','#f59e0b','#ef4444','#ec4899'];

export default function Orgs() {
  const [orgs, setOrgs]     = useState([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]     = useState({ name: '', industry: '', website: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const fetchOrgs = async () => {
    const params = { page, limit: 18, ...(search && { search }) };
    const { data } = await api.get('/orgs', { params });
    setOrgs(data.data);
    setTotal(data.meta.total);
  };

  useEffect(() => { fetchOrgs(); }, [page, search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/orgs', form);
      setShowModal(false);
      setForm({ name: '', industry: '', website: '', phone: '' });
      fetchOrgs();
    } finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader
        title="Organisations"
        subtitle={`${total} companies in your CRM`}
        action={<Button onClick={() => setShowModal(true)}><Plus size={14} />New Org</Button>}
      />

      <div className="max-w-xs mb-6">
        <SearchBar value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search organisations..." />
      </div>

      {orgs.length === 0 ? (
        <Card className="p-16 text-center">
          <Building2 size={32} className="text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">No organisations found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {orgs.map((org, i) => {
            const color = COLORS[i % COLORS.length];
            return (
              <Card key={org._id} className="p-5 hover:border-white/15 transition-all cursor-pointer group">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${color}40, ${color}20)`, border: `1px solid ${color}30` }}>
                    {org.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-zinc-100 truncate group-hover:text-white transition-colors">{org.name}</div>
                    {org.industry && <div className="text-xs text-zinc-500 mt-0.5 truncate">{org.industry}</div>}
                  </div>
                </div>
                <div className="space-y-1.5 border-t border-white/5 pt-3">
                  {org.website && (
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Globe size={11} className="flex-shrink-0" />
                      <span className="truncate">{org.website.replace(/^https?:\/\//, '')}</span>
                    </div>
                  )}
                  {org.phone && (
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Phone size={11} className="flex-shrink-0" />
                      <span>{org.phone}</span>
                    </div>
                  )}
                  {!org.website && !org.phone && (
                    <div className="text-xs text-zinc-700">No contact info</div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {total > 18 && (
        <div className="mt-6">
          <Card>
            <Pagination page={page} total={total} limit={18} onPage={setPage} />
          </Card>
        </div>
      )}

      {showModal && (
        <Modal title="Create Organisation" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input label="Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="Acme Corp" />
            <Input label="Industry" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} placeholder="Technology" />
            <Input label="Website" type="url" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://acme.com" />
            <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 555 0100" />
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Org'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
