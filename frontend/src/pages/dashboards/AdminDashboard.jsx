import { useEffect, useState } from 'react';
import { TrendingUp, BarChart2, CheckSquare, Building2, DollarSign, AlertTriangle, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import api from '../../lib/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#6366f1','#8b5cf6','#f59e0b','#10b981','#ef4444'];

const Stat = ({ icon: Icon, label, value, change, color, sub }) => (
  <Card className="p-5">
    <div className="flex items-start justify-between mb-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: color + '18' }}>
        <Icon size={16} style={{ color }} />
      </div>
      {change !== undefined && (
        <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${change >= 0 ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
          {change >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}{Math.abs(change)}%
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-white mb-0.5">{value ?? '—'}</div>
    <div className="text-xs text-zinc-500">{label}</div>
    {sub && <div className="text-xs text-zinc-600 mt-0.5">{sub}</div>}
  </Card>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1e2a] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-zinc-400 mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>)}
    </div>
  );
};

// Generate last 6 months labels
const getMonthLabels = () => {
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(d.toLocaleString('default', { month: 'short' }));
  }
  return months;
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [leads,   setLeads]   = useState([]);
  const [deals,   setDeals]   = useState([]);
  const [agents,  setAgents]  = useState([]);
  const [tasks,   setTasks]   = useState(null);

  useEffect(() => {
    api.get('/analytics/summary').then(r => setSummary(r.data.data)).catch(() => {});
    api.get('/analytics/leads').then(r => setLeads(r.data.data.funnel || [])).catch(() => {});
    api.get('/analytics/deals').then(r => setDeals(r.data.data.pipeline || [])).catch(() => {});
    api.get('/analytics/agents').then(r => setAgents(r.data.data.agents || [])).catch(() => {});
    api.get('/analytics/tasks').then(r => setTasks(r.data.data)).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Mock monthly trend data
  const months = getMonthLabels();
  const trendData = months.map((m, i) => ({
    month: m,
    revenue: Math.floor(Math.random() * 40000 + 20000),
    leads:   Math.floor(Math.random() * 30 + 10),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-500 text-sm">{greeting}, {user?.name?.split(' ')[0]} 👋</p>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">Admin Overview</h1>
          <p className="text-xs text-zinc-600 mt-1">Full company performance at a glance</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          <Badge label="admin" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Stat icon={TrendingUp}    label="Total Leads"    value={summary?.totalLeads}    color="#6366f1" change={12} />
        <Stat icon={BarChart2}     label="Total Deals"    value={summary?.totalDeals}    color="#8b5cf6" change={8}  />
        <Stat icon={CheckSquare}   label="Total Tasks"    value={summary?.totalTasks}    color="#3b82f6" change={-3} />
        <Stat icon={Building2}     label="Organisations"  value={summary?.totalOrgs}     color="#10b981" />
        <Stat icon={DollarSign}    label="Won Revenue"    value={summary?.wonRevenue ? `$${(summary.wonRevenue/1000).toFixed(1)}k` : '$0'} color="#10b981" change={24} />
        <Stat icon={AlertTriangle} label="Overdue Tasks"  value={summary?.overdueTasksCount} color="#ef4444" sub="Needs attention" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue trend */}
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">Revenue Trend</h3>
              <p className="text-xs text-zinc-600 mt-0.5">Last 6 months</p>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
              <ArrowUpRight size={11} />+24% vs last period
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#52556a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#52556a', fontSize: 11 }} axisLine={false} tickLine={false} width={45} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Deal pipeline donut */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-white mb-1">Deal Pipeline</h3>
          <p className="text-xs text-zinc-600 mb-4">By stage</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={deals} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3}>
                {deals.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-3">
            {deals.slice(0, 4).map((d, i) => (
              <div key={d._id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-zinc-400 capitalize">{d._id}</span>
                </div>
                <span className="text-zinc-300 font-semibold">{d.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Lead funnel */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-white mb-1">Lead Funnel</h3>
          <p className="text-xs text-zinc-600 mb-4">Conversion by status</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={leads} barSize={28}>
              <XAxis dataKey="_id" tick={{ fill: '#52556a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#52556a', fontSize: 11 }} axisLine={false} tickLine={false} width={25} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="count" name="Leads" radius={[5,5,0,0]}>
                {leads.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Task health */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-white mb-1">Task Health</h3>
          <p className="text-xs text-zinc-600 mb-4">Status breakdown</p>
          <div className="space-y-3">
            {(tasks?.breakdown || []).map((t, i) => {
              const total = tasks?.breakdown?.reduce((s, x) => s + x.count, 0) || 1;
              const pct   = Math.round((t.count / total) * 100);
              return (
                <div key={t._id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400 capitalize">{t._id?.replace('_',' ')}</span>
                    <span className="text-zinc-300 font-semibold">{t.count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              );
            })}
            {tasks?.overdue > 0 && (
              <div className="flex items-center gap-2 mt-3 p-3 bg-red-500/8 border border-red-500/15 rounded-xl">
                <AlertTriangle size={13} className="text-red-400 flex-shrink-0" />
                <span className="text-xs text-red-400 font-medium">{tasks.overdue} tasks are overdue</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Agent leaderboard */}
      {agents.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-white">Agent Leaderboard</h3>
              <p className="text-xs text-zinc-600 mt-0.5">Performance across your team</p>
            </div>
            <Users size={15} className="text-zinc-600" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  {['#','Agent','Open Leads','Open Deals','Overdue Tasks','Score'].map(h => (
                    <th key={h} className="pb-3 text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-widest pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {agents
                  .sort((a, b) => (b.openDeals + b.openLeads) - (a.openDeals + a.openLeads))
                  .map((a, idx) => {
                    const score = Math.max(0, 100 - a.overdueTasks * 10 + a.openDeals * 5);
                    return (
                      <tr key={a.agent._id} className="hover:bg-white/2 transition-colors">
                        <td className="py-3 pr-4 text-sm font-bold text-zinc-600">#{idx + 1}</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                              {a.agent.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-zinc-200">{a.agent.name || 'Unknown'}</div>
                              <div className="text-xs text-zinc-600">{a.agent.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-sm text-zinc-300">{a.openLeads}</td>
                        <td className="py-3 pr-4 text-sm text-zinc-300">{a.openDeals}</td>
                        <td className="py-3 pr-4">
                          <span className={`text-sm font-semibold ${a.overdueTasks > 0 ? 'text-red-400' : 'text-zinc-300'}`}>
                            {a.overdueTasks}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden w-16">
                              <div className="h-full rounded-full bg-indigo-500" style={{ width: `${score}%` }} />
                            </div>
                            <span className="text-xs font-semibold text-zinc-400">{score}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
