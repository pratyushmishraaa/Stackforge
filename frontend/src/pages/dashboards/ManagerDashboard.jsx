import { useEffect, useState } from 'react';
import { TrendingUp, BarChart2, CheckSquare, Users, DollarSign, AlertTriangle, ArrowUpRight, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, FunnelChart, Funnel, LabelList } from 'recharts';
import api from '../../lib/api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';

const COLORS = ['#6366f1','#8b5cf6','#f59e0b','#10b981','#ef4444'];

const Stat = ({ icon: Icon, label, value, color, sub }) => (
  <Card className="p-5">
    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: color + '18' }}>
      <Icon size={16} style={{ color }} />
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

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [leads,   setLeads]   = useState([]);
  const [deals,   setDeals]   = useState([]);
  const [agents,  setAgents]  = useState([]);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    api.get('/analytics/summary').then(r => setSummary(r.data.data)).catch(() => {});
    api.get('/analytics/leads').then(r => setLeads(r.data.data.funnel || [])).catch(() => {});
    api.get('/analytics/deals').then(r => setDeals(r.data.data.pipeline || [])).catch(() => {});
    api.get('/analytics/agents').then(r => setAgents(r.data.data.agents || [])).catch(() => {});
    api.get('/activity', { params: { limit: 8 } }).then(r => setActivity(r.data.data || [])).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Conversion funnel data
  const funnelData = [
    { name: 'Total Leads',   value: summary?.totalLeads || 0,   fill: '#6366f1' },
    { name: 'Contacted',     value: leads.find(l => l._id === 'contacted')?.count || 0, fill: '#8b5cf6' },
    { name: 'Qualified',     value: leads.find(l => l._id === 'qualified')?.count || 0, fill: '#f59e0b' },
    { name: 'Converted',     value: leads.find(l => l._id === 'converted')?.count || 0, fill: '#10b981' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-zinc-500 text-sm">{greeting}, {user?.name?.split(' ')[0]} 👋</p>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">Team Dashboard</h1>
          <p className="text-xs text-zinc-600 mt-1">Monitor your team's pipeline and performance</p>
        </div>
        <Badge label="manager" />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={TrendingUp}  label="Total Leads"  value={summary?.totalLeads}  color="#6366f1" />
        <Stat icon={BarChart2}   label="Active Deals" value={summary?.totalDeals}  color="#8b5cf6" />
        <Stat icon={DollarSign}  label="Won Revenue"  value={summary?.wonRevenue ? `$${(summary.wonRevenue/1000).toFixed(1)}k` : '$0'} color="#10b981" />
        <Stat icon={AlertTriangle} label="Overdue Tasks" value={summary?.overdueTasksCount} color="#ef4444" sub="Across team" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Deal pipeline by stage */}
        <Card className="p-5 lg:col-span-2">
          <h3 className="text-sm font-bold text-white mb-1">Pipeline by Stage</h3>
          <p className="text-xs text-zinc-600 mb-4">Deal count and value per stage</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deals} barSize={32}>
              <XAxis dataKey="_id" tick={{ fill: '#52556a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#52556a', fontSize: 11 }} axisLine={false} tickLine={false} width={25} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="count" name="Deals" radius={[5,5,0,0]}>
                {deals.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Conversion funnel */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-white mb-1">Conversion Funnel</h3>
          <p className="text-xs text-zinc-600 mb-4">Lead to close rate</p>
          <div className="space-y-2">
            {funnelData.map((d, i) => {
              const pct = funnelData[0]?.value ? Math.round((d.value / funnelData[0].value) * 100) : 0;
              return (
                <div key={d.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-400">{d.name}</span>
                    <span className="text-zinc-300 font-semibold">{d.value} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: d.fill }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Agent workload */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Agent Workload</h3>
              <p className="text-xs text-zinc-600 mt-0.5">Open leads per agent</p>
            </div>
            <Users size={14} className="text-zinc-600" />
          </div>
          <div className="space-y-3">
            {agents.slice(0, 6).map(a => {
              const max = Math.max(...agents.map(x => x.openLeads), 1);
              const pct = Math.round((a.openLeads / max) * 100);
              return (
                <div key={a.agent._id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 flex-shrink-0">
                    {a.agent.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-300 truncate">{a.agent.name || 'Unknown'}</span>
                      <span className="text-zinc-500 ml-2 flex-shrink-0">{a.openLeads} leads</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  {a.overdueTasks > 0 && (
                    <span className="text-xs text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded-full flex-shrink-0">{a.overdueTasks} late</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent activity */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Recent Activity</h3>
              <p className="text-xs text-zinc-600 mt-0.5">Latest team actions</p>
            </div>
            <Activity size={14} className="text-zinc-600" />
          </div>
          <div className="space-y-3">
            {activity.length === 0 ? (
              <p className="text-xs text-zinc-600 text-center py-6">No recent activity</p>
            ) : activity.map(a => (
              <div key={a._id} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/15 flex items-center justify-center text-[10px] font-bold text-indigo-400 flex-shrink-0 mt-0.5">
                  {a.userName?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-300">
                    <span className="font-semibold">{a.userName}</span>
                    {' '}<span className="text-zinc-500">{a.action}</span>
                    {' '}<span className="text-zinc-400 capitalize">{a.resource}</span>
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">{new Date(a.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
