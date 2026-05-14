import { useEffect, useState } from 'react';
import { TrendingUp, BarChart2, CheckSquare, Clock, AlertTriangle, Plus, ArrowRight, Calendar, Target } from 'lucide-react';
import api from '../../lib/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const QuickStat = ({ icon: Icon, label, value, color, onClick }) => (
  <Card className={`p-4 ${onClick ? 'cursor-pointer hover:border-white/20 transition-all' : ''}`} onClick={onClick}>
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '18' }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div>
        <div className="text-xl font-bold text-white">{value ?? '—'}</div>
        <div className="text-xs text-zinc-500">{label}</div>
      </div>
    </div>
  </Card>
);

export default function AgentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myLeads,    setMyLeads]    = useState([]);
  const [myTasks,    setMyTasks]    = useState([]);
  const [myDeals,    setMyDeals]    = useState([]);
  const [overdue,    setOverdue]    = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);

  useEffect(() => {
    // My leads
    api.get('/leads', { params: { assignedTo: 'me', limit: 5, sort: 'createdAt', order: 'desc' } })
      .then(r => setMyLeads(r.data.data)).catch(() => {});

    // My tasks — all
    api.get('/tasks', { params: { assignedTo: 'me', limit: 100 } })
      .then(r => {
        const all = r.data.data;
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        setMyTasks(all);
        setTodayTasks(all.filter(t => {
          const due = new Date(t.dueDate);
          return due >= todayStart && due <= today && t.status !== 'done';
        }));
        setOverdue(all.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'done'));
      }).catch(() => {});

    // My deals
    api.get('/deals', { params: { assignedTo: 'me', limit: 5 } })
      .then(r => setMyDeals(r.data.data)).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const openTasks  = myTasks.filter(t => t.status !== 'done').length;
  const wonDeals   = myDeals.filter(d => d.stage === 'won').length;
  const pipelineVal = myDeals.filter(d => !['won','lost'].includes(d.stage)).reduce((s, d) => s + (d.value || 0), 0);

  const priorityColor = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-500 text-sm">{greeting}, {user?.name?.split(' ')[0]} 👋</p>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">My Workspace</h1>
          <p className="text-xs text-zinc-600 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <Badge label="agent" />
      </div>

      {/* Today's focus banner */}
      {(todayTasks.length > 0 || overdue.length > 0) && (
        <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Target size={16} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Today's Focus</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                {todayTasks.length > 0 && `${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''} due today`}
                {todayTasks.length > 0 && overdue.length > 0 && ' · '}
                {overdue.length > 0 && <span className="text-red-400">{overdue.length} overdue</span>}
              </p>
            </div>
          </div>
          <button onClick={() => navigate('/tasks')} className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            View Tasks <ArrowRight size={12} />
          </button>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStat icon={TrendingUp}    label="My Leads"       value={myLeads.length}  color="#6366f1" onClick={() => navigate('/leads')} />
        <QuickStat icon={CheckSquare}   label="Open Tasks"     value={openTasks}       color="#3b82f6" onClick={() => navigate('/tasks')} />
        <QuickStat icon={BarChart2}     label="Pipeline Value" value={`$${(pipelineVal/1000).toFixed(1)}k`} color="#8b5cf6" onClick={() => navigate('/deals')} />
        <QuickStat icon={AlertTriangle} label="Overdue"        value={overdue.length}  color="#ef4444" onClick={() => navigate('/tasks')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* My recent leads */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">My Leads</h3>
              <p className="text-xs text-zinc-600 mt-0.5">Recently assigned to you</p>
            </div>
            <button onClick={() => navigate('/leads')} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              View all <ArrowRight size={11} />
            </button>
          </div>
          <div className="space-y-2">
            {myLeads.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp size={24} className="text-zinc-700 mx-auto mb-2" />
                <p className="text-xs text-zinc-600">No leads assigned yet</p>
                <button onClick={() => navigate('/leads')} className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Create your first lead →
                </button>
              </div>
            ) : myLeads.map(lead => (
              <div key={lead._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/3 transition-colors cursor-pointer" onClick={() => navigate('/leads')}>
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center text-xs font-bold text-indigo-400 flex-shrink-0">
                  {lead.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-zinc-200 truncate">{lead.name}</div>
                  <div className="text-xs text-zinc-600 truncate">{lead.email || lead.phone || '—'}</div>
                </div>
                <Badge label={lead.status} />
              </div>
            ))}
          </div>
        </Card>

        {/* My tasks */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">My Tasks</h3>
              <p className="text-xs text-zinc-600 mt-0.5">Due soon and overdue</p>
            </div>
            <button onClick={() => navigate('/tasks')} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              View all <ArrowRight size={11} />
            </button>
          </div>
          <div className="space-y-2">
            {myTasks.filter(t => t.status !== 'done').length === 0 ? (
              <div className="text-center py-8">
                <CheckSquare size={24} className="text-zinc-700 mx-auto mb-2" />
                <p className="text-xs text-zinc-600">All caught up! No open tasks.</p>
              </div>
            ) : myTasks.filter(t => t.status !== 'done').slice(0, 6).map(task => {
              const due     = new Date(task.dueDate);
              const isLate  = due < new Date();
              const isToday = due.toDateString() === new Date().toDateString();
              return (
                <div key={task._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/3 transition-colors cursor-pointer" onClick={() => navigate('/tasks')}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5" style={{ background: priorityColor[task.priority] || '#6b7280' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-zinc-200 truncate">{task.title}</div>
                    <div className={`text-xs flex items-center gap-1 mt-0.5 ${isLate ? 'text-red-400' : isToday ? 'text-amber-400' : 'text-zinc-600'}`}>
                      <Calendar size={10} />
                      {isLate ? 'Overdue · ' : isToday ? 'Due today · ' : ''}{due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <Badge label={task.status} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* My deals */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">My Deals</h3>
            <p className="text-xs text-zinc-600 mt-0.5">Your active pipeline</p>
          </div>
          <button onClick={() => navigate('/deals')} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
            View all <ArrowRight size={11} />
          </button>
        </div>
        {myDeals.length === 0 ? (
          <div className="text-center py-8">
            <BarChart2 size={24} className="text-zinc-700 mx-auto mb-2" />
            <p className="text-xs text-zinc-600">No deals yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {myDeals.map(deal => (
              <div key={deal._id} className="p-3 bg-white/3 border border-white/5 rounded-xl hover:border-white/10 transition-colors cursor-pointer" onClick={() => navigate('/deals')}>
                <div className="flex items-start justify-between mb-2">
                  <div className="text-sm font-semibold text-zinc-200 truncate flex-1">{deal.title}</div>
                  <Badge label={deal.stage} />
                </div>
                <div className="text-lg font-bold text-emerald-400">${deal.value?.toLocaleString()}</div>
                {deal.lead && <div className="text-xs text-zinc-600 mt-1">{deal.lead.name}</div>}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Quick actions */}
      <Card className="p-5">
        <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'New Lead',  icon: TrendingUp,  color: '#6366f1', path: '/leads'  },
            { label: 'New Task',  icon: CheckSquare, color: '#3b82f6', path: '/tasks'  },
            { label: 'New Deal',  icon: BarChart2,   color: '#8b5cf6', path: '/deals'  },
            { label: 'New Org',   icon: Plus,        color: '#10b981', path: '/orgs'   },
          ].map(({ label, icon: Icon, color, path }) => (
            <button key={label} onClick={() => navigate(path)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/3 border border-white/5 hover:border-white/15 hover:bg-white/5 transition-all group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + '18' }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">{label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
