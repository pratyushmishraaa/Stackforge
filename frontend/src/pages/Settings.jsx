import { useState } from 'react';
import { Building2, Bell, Palette, Shield, CheckCircle, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageHeader from '../components/layout/PageHeader';

const Section = ({ icon: Icon, title, subtitle, children }) => (
  <Card className="p-6 mb-5">
    <div className="flex items-start gap-3 mb-5 pb-4 border-b border-white/8">
      <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-indigo-400" />
      </div>
      <div>
        <h2 className="text-sm font-bold text-white">{title}</h2>
        {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {children}
  </Card>
);

const Toggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
    <div>
      <div className="text-sm font-medium text-zinc-200">{label}</div>
      {description && <div className="text-xs text-zinc-600 mt-0.5">{description}</div>}
    </div>
    <button onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-white/10'}`}>
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  </div>
);

export default function Settings() {
  const [workspace, setWorkspace] = useState({
    name:     localStorage.getItem('ws_name')     || 'My Company',
    website:  localStorage.getItem('ws_website')  || '',
    timezone: localStorage.getItem('ws_timezone') || 'UTC',
  });
  const [notifications, setNotifications] = useState({
    leadAssigned:   JSON.parse(localStorage.getItem('notif_leadAssigned')   ?? 'true'),
    taskDue:        JSON.parse(localStorage.getItem('notif_taskDue')        ?? 'true'),
    dealWon:        JSON.parse(localStorage.getItem('notif_dealWon')        ?? 'true'),
    weeklyReport:   JSON.parse(localStorage.getItem('notif_weeklyReport')   ?? 'false'),
    emailDigest:    JSON.parse(localStorage.getItem('notif_emailDigest')    ?? 'false'),
  });
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const saveWorkspace = () => {
    Object.entries(workspace).forEach(([k, v]) => localStorage.setItem(`ws_${k}`, v));
    showToast('Workspace settings saved');
  };

  const toggleNotif = (key) => (val) => {
    setNotifications(n => ({ ...n, [key]: val }));
    localStorage.setItem(`notif_${key}`, JSON.stringify(val));
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage workspace preferences and notifications" />

      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-sm font-medium shadow-xl">
          <CheckCircle size={15} /> {toast}
        </div>
      )}

      {/* Workspace */}
      <Section icon={Building2} title="Workspace" subtitle="General workspace configuration">
        <div className="space-y-4">
          <Input label="Company Name" value={workspace.name} onChange={e => setWorkspace(w => ({ ...w, name: e.target.value }))} placeholder="Acme Corp" />
          <Input label="Website" value={workspace.website} onChange={e => setWorkspace(w => ({ ...w, website: e.target.value }))} placeholder="https://acme.com" />
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Timezone</label>
            <select value={workspace.timezone} onChange={e => setWorkspace(w => ({ ...w, timezone: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-indigo-500/60 transition-all">
              {['UTC','America/New_York','America/Los_Angeles','Europe/London','Europe/Paris','Asia/Kolkata','Asia/Tokyo','Australia/Sydney'].map(tz => (
                <option key={tz} value={tz} className="bg-zinc-900">{tz}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <Button onClick={saveWorkspace}><Save size={14} />Save Workspace</Button>
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notifications" subtitle="Choose what you want to be notified about">
        <div>
          <Toggle label="Lead Assigned" description="When a lead is assigned to you" checked={notifications.leadAssigned} onChange={toggleNotif('leadAssigned')} />
          <Toggle label="Task Due Reminder" description="24 hours before a task is due" checked={notifications.taskDue} onChange={toggleNotif('taskDue')} />
          <Toggle label="Deal Won" description="When a deal is marked as won" checked={notifications.dealWon} onChange={toggleNotif('dealWon')} />
          <Toggle label="Weekly Report" description="Summary of your pipeline every Monday" checked={notifications.weeklyReport} onChange={toggleNotif('weeklyReport')} />
          <Toggle label="Email Digest" description="Daily email summary of activity" checked={notifications.emailDigest} onChange={toggleNotif('emailDigest')} />
        </div>
      </Section>

      {/* Appearance */}
      <Section icon={Palette} title="Appearance" subtitle="Customize how the CRM looks">
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'dark',    label: 'Dark',    bg: '#0d0f14', accent: '#6366f1' },
            { id: 'darker',  label: 'Darker',  bg: '#080a0f', accent: '#8b5cf6' },
            { id: 'midnight',label: 'Midnight', bg: '#0a0a14', accent: '#3b82f6' },
          ].map(theme => (
            <button key={theme.id}
              className={`p-3 rounded-xl border transition-all text-left ${theme.id === 'dark' ? 'border-indigo-500/50 ring-2 ring-indigo-500/20' : 'border-white/10 hover:border-white/20'}`}>
              <div className="w-full h-10 rounded-lg mb-2 flex items-end p-1.5 gap-1" style={{ background: theme.bg }}>
                <div className="w-2 h-4 rounded-sm" style={{ background: theme.accent }} />
                <div className="flex-1 h-2 rounded-sm bg-white/10" />
              </div>
              <div className="text-xs font-semibold text-zinc-300">{theme.label}</div>
            </button>
          ))}
        </div>
      </Section>

      {/* Security */}
      <Section icon={Shield} title="Security" subtitle="Account security settings">
        <div className="space-y-3">
          {[
            { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security', badge: 'Coming Soon' },
            { label: 'Active Sessions',           desc: 'Manage devices logged into your account', badge: 'Coming Soon' },
            { label: 'Login History',             desc: 'View recent login activity', badge: 'Coming Soon' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-3 bg-white/3 rounded-xl border border-white/5">
              <div>
                <div className="text-sm font-medium text-zinc-300">{item.label}</div>
                <div className="text-xs text-zinc-600 mt-0.5">{item.desc}</div>
              </div>
              <span className="text-[10px] font-semibold text-zinc-600 bg-white/5 px-2 py-1 rounded-full border border-white/8">{item.badge}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
