import { useEffect, useState } from 'react';
import { Filter, Mail } from 'lucide-react';
import api from '../lib/api';
import Card from '../components/ui/Card';
import Table from '../components/ui/Table';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import Pagination from '../components/ui/Pagination';
import PageHeader from '../components/layout/PageHeader';
import EmailModal from '../components/ui/EmailModal';

const ROLE_COLORS = { admin: '#6366f1', manager: '#8b5cf6', agent: '#3b82f6' };

export default function Users() {
  const [users, setUsers]         = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [role, setRole]           = useState('');
  const [emailTarget, setEmailTarget] = useState(null);

  const fetchUsers = async () => {
    const params = { page, limit: 20, ...(search && { search }), ...(role && { role }) };
    const { data } = await api.get('/users', { params });
    setUsers(data.data);
    setTotal(data.meta.total);
  };

  useEffect(() => { fetchUsers(); }, [page, search, role]);

  const columns = [
    { key: 'name', label: 'User', render: r => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0 overflow-hidden"
          style={{ background: `${ROLE_COLORS[r.role] || '#6366f1'}30`, border: `1px solid ${ROLE_COLORS[r.role] || '#6366f1'}25` }}>
          {r.avatar
            ? <img src={r.avatar} alt="" className="w-full h-full object-cover" />
            : r.name?.[0]?.toUpperCase()
          }
        </div>
        <div>
          <div className="font-medium text-zinc-200">{r.name}</div>
          <div className="text-xs text-zinc-600">{r.email}</div>
        </div>
      </div>
    )},
    { key: 'role',   label: 'Role',   render: r => <Badge label={r.role} /> },
    { key: 'status', label: 'Status', render: r => <Badge label={r.status} /> },
    { key: 'lastLoginAt', label: 'Last Login', render: r => r.lastLoginAt
      ? <span className="text-xs text-zinc-400">{new Date(r.lastLoginAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      : <span className="text-zinc-600 text-xs">Never</span>
    },
    { key: 'createdAt', label: 'Joined', render: r => (
      <span className="text-zinc-500 text-xs">{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
    )},
    { key: 'actions', label: '', render: r => (
      <button onClick={e => { e.stopPropagation(); setEmailTarget(r); }}
        className="p-1.5 rounded-lg hover:bg-indigo-500/15 text-zinc-600 hover:text-indigo-400 transition-colors" title="Send email">
        <Mail size={13} />
      </button>
    )},
  ];

  return (
    <div>
      <PageHeader title="Users" subtitle={`${total} team members`} />

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 max-w-xs">
          <SearchBar value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search users..." />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-zinc-600" />
          <select value={role} onChange={e => { setRole(e.target.value); setPage(1); }}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-300 outline-none focus:border-indigo-500/50 transition-all">
            <option value="" className="bg-zinc-900">All roles</option>
            {['admin','manager','agent'].map(r => (
              <option key={r} value={r} className="bg-zinc-900 capitalize">{r}</option>
            ))}
          </select>
        </div>
      </div>

      <Card>
        <Table columns={columns} data={users} />
        <Pagination page={page} total={total} limit={20} onPage={setPage} />
      </Card>

      {emailTarget && (
        <EmailModal
          onClose={() => setEmailTarget(null)}
          defaultTo={emailTarget.email}
          defaultSubject={`Hi ${emailTarget.name}`}
        />
      )}
    </div>
  );
}
