import { useEffect, useState } from 'react';
import { Plus, Filter, Calendar } from 'lucide-react';
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
  { key: 'title', label: 'Task', render: r => (
    <div>
      <div className="font-medium text-zinc-200">{r.title}</div>
      {r.assignedTo && <div className="text-xs text-zinc-600 mt-0.5">{r.assignedTo.name}</div>}
    </div>
  )},
  { key: 'priority', label: 'Priority', render: r => <Badge label={r.priority} /> },
  { key: 'status',   label: 'Status',   render: r => <Badge label={r.status} /> },
  { key: 'dueDate',  label: 'Due Date', render: r => {
    const due  = new Date(r.dueDate);
    const past = due < new Date() && r.status !== 'done';
    return (
      <div className={`flex items-center gap-1.5 text-xs ${past ? 'text-red-400' : 'text-zinc-400'}`}>
        <Calendar size={11} />
        {due.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>
    );
  }},
  { key: 'createdAt', label: 'Created', render: r => (
    <span className="text-zinc-500 text-xs">{new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
  )},
];

const EMPTY_FORM = { title: '', dueDate: '', priority: 'medium', status: 'open' };

export default function Tasks() {
  const [tasks, setTasks]   = useState([]);
  const [total, setTotal]   = useState(0);
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [myTasks, setMyTasks] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]     = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    const params = { page, limit: 20, ...(search && { search }), ...(status && { status }), ...(myTasks && { assignedTo: 'me' }) };
    const { data } = await api.get('/tasks', { params });
    setTasks(data.data);
    setTotal(data.meta.total);
  };

  useEffect(() => { fetchTasks(); }, [page, search, status, myTasks]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/tasks', form);
      setShowModal(false);
      setForm(EMPTY_FORM);
      fetchTasks();
    } finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle={`${total} tasks total`}
        action={<Button onClick={() => setShowModal(true)}><Plus size={14} />New Task</Button>}
      />

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex-1 max-w-xs">
          <SearchBar value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search tasks..." />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-zinc-600" />
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-300 outline-none focus:border-indigo-500/50 transition-all">
            <option value="" className="bg-zinc-900">All statuses</option>
            {['open','in_progress','done'].map(s => (
              <option key={s} value={s} className="bg-zinc-900">{s.replace('_',' ')}</option>
            ))}
          </select>
          <button onClick={() => setMyTasks(t => !t)}
            className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${myTasks ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400' : 'bg-white/5 border-white/10 text-zinc-500 hover:text-zinc-300'}`}>
            My Tasks
          </button>
        </div>
      </div>

      <Card>
        <Table columns={columns} data={tasks} />
        <Pagination page={page} total={total} limit={20} onPage={setPage} />
      </Card>

      {showModal && (
        <Modal title="Create New Task" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input label="Title *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Follow up call" />
            <Input label="Due Date *" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} required />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Priority" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                options={['low','medium','high'].map(s => ({ value: s, label: s }))} />
              <Select label="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                options={[{value:'open',label:'Open'},{value:'in_progress',label:'In Progress'},{value:'done',label:'Done'}]} />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Task'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
