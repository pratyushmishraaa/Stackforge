import { useEffect, useState } from 'react';
import { TrendingUp, BarChart2, CheckSquare, Building2, DollarSign, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../lib/api';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#6366f1','#8b5cf6','#f59e0b','#10b981','#ef4444'];

const StatCard = ({ icon: Icon, label, value, sub, color, trend }) => (
  <Card className="p-5 hover:border-white/15 transition-all group">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ background: color + '18' }}>
        <Icon size={18} style={{ color }} />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
          <ArrowUpRight size={11} />{trend}
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
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [leads,   setLeads]   = useState([]);
  const [deals,   setDeals]   = useState([]);
  const [agents,  setAgents]  = useState([]);

  useEffect(() => {
    api.get('/analytics/summary').then(r => setSummary(r.data.data)).catch(() => {});
    api.get('/analytics/leads').then(r => setLeads(r.data.data.funnel || [])).catch(() => {});
    api.get('/analytics/deals').then(r => setDeals(r.data.data.pipeline || [])).catch(() => {});
    api.get('/analytics/agents').then(r => setAgents(r.data.data.agents || [])).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-zinc-500 text-sm mb-1">{greeting}, {user?.name?.split(' ')[0]} 👋</p>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard icon={TrendingUp}    label="Total Leads"    value={summary?.totalLeads}    color="#6366f1" trend="+12%" />
        <StatCard icon={BarChart2}     label="Total Deals"    value={summary?.totalDeals}    color="#8b5cf6" trend="+8%" />
        <StatCard icon={CheckSquare}   label="Total Tasks"    value={summary?.totalTasks}    color="#3b82f6" />
        <StatCard icon={Building2}     label="Organisations"  value={summary?.totalOrgs}     color="#10b981" />
        <StatCard icon={DollarSign}    label="Won Revenue"    value={summary?.wonRevenue ? `$${(summary.wonRevenue/1000).toFixed(1)}k` : '$0'} color="#10b981" trend="+24%" />
        <StatCard icon={AlertTriangle} label="Overdue Tasks"  value={summary?.overdueTasksCount} color="#ef4444" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Lead funnel */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white">Lead Funnel</h3>
              <p className="text-xs text-zinc-600 mt-0.5">Conversion by status</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={leads} barSize={32} barGap={4}>
              <XAxis dataKey="_id" tick={{ fill: '#52556a', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#52556a', fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="count" name="Leads" radius={[6,6,0,0]}>
                {leads.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Deal pipeline */}
        <Card className="p-6">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-white">Deal Pipeline</h3>
            <p className="text-xs text-zinc-600 mt-0.5">By stage</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={deals} dataKey="count" nameKey="_id" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                {deals.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {deals.slice(0,4).map((d, i) => (
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

      {/* Agent performance */}
      {agents.length > 0 && (
        <Card className="p-6">
          <h3 className="text-sm font-bold text-white mb-5">Agent Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8">
                  {['Agent','Open Leads','Open Deals','Overdue Tasks'].map(h => (
                    <th key={h} className="pb-3 text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {agents.map(a => (
                  <tr key={a.agent._id} className="hover:bg-white/2 transition-colors">
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
                    <td className="py-3 text-sm text-zinc-300">{a.openLeads}</td>
                    <td className="py-3 text-sm text-zinc-300">{a.openDeals}</td>
                    <td className="py-3">
                      <span className={`text-sm font-semibold ${a.overdueTasks > 0 ? 'text-red-400' : 'text-zinc-300'}`}>
                        {a.overdueTasks}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
