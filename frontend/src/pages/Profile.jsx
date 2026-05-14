import { useState, useRef } from 'react';
import { Camera, Lock, Save, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import PageHeader from '../components/layout/PageHeader';

const Section = ({ title, subtitle, children }) => (
  <Card className="p-6 mb-5">
    <div className="mb-5 pb-4 border-b border-white/8">
      <h2 className="text-sm font-bold text-white">{title}</h2>
      {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
    </div>
    {children}
  </Card>
);

export default function Profile() {
  const { user, updateUser } = useAuth();
  const fileRef = useRef();

  const [profile, setProfile] = useState({
    name:   user?.name   || '',
    phone:  user?.phone  || '',
    bio:    user?.bio    || '',
    avatar: user?.avatar || '',
  });
  const [passwords, setPasswords]   = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw]         = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving]         = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [toast, setToast]           = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { showToast('Image must be under 3MB', 'error'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setProfile(p => ({ ...p, avatar: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!profile.name.trim()) { showToast('Name is required', 'error'); return; }
    setSaving(true);
    try {
      const { data } = await api.patch('/users/me/profile', {
        name: profile.name, phone: profile.phone, bio: profile.bio, avatar: profile.avatar,
      });
      updateUser(data.data.user); // updates context + localStorage + sidebar
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (!passwords.currentPassword) { showToast('Enter your current password', 'error'); return; }
    if (passwords.newPassword.length < 8) { showToast('New password must be at least 8 characters', 'error'); return; }
    if (passwords.newPassword !== passwords.confirmPassword) { showToast('New passwords do not match', 'error'); return; }
    setChangingPw(true);
    try {
      await api.patch('/users/me/password', {
        currentPassword: passwords.currentPassword,
        newPassword:     passwords.newPassword,
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Password changed successfully', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Incorrect current password', 'error');
    } finally { setChangingPw(false); }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="max-w-2xl">
      <PageHeader title="My Profile" subtitle="Manage your personal information and account security" />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl border
          ${toast.type === 'success'
            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/15 border-red-500/30 text-red-400'
          }`}>
          {toast.type === 'success' ? <CheckCircle size={15} /> : <XCircle size={15} />}
          {toast.msg}
        </div>
      )}

      {/* Avatar + info */}
      <Section title="Profile Information" subtitle="Update your photo and personal details">
        <div className="flex items-start gap-6 mb-6">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white ring-2 ring-white/10">
              {profile.avatar
                ? <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                : <span>{initials}</span>
              }
            </div>
            <button type="button" onClick={() => fileRef.current.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg transition-colors ring-2 ring-[#13161e]">
              <Camera size={13} className="text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div className="flex-1">
            <div className="text-base font-bold text-white mb-1">{user?.name}</div>
            <div className="text-sm text-zinc-500 mb-2">{user?.email}</div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge label={user?.role} />
              <Badge label={user?.status} />
            </div>
            <p className="text-xs text-zinc-600 mt-2">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="Jane Doe" />
            <Input label="Phone" value={profile.phone || ''} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+1 555 0100" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">Bio</label>
            <textarea value={profile.bio || ''} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
              placeholder="Tell your team a bit about yourself..." rows={3} maxLength={300}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none" />
            <p className="text-[10px] text-zinc-600 mt-1 text-right">{(profile.bio || '').length}/300</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} disabled={saving}>
              <Save size={14} />{saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Section>

      {/* Change password */}
      <Section title="Change Password" subtitle="Use a strong password with uppercase, lowercase, and numbers">
        <div className="space-y-4">
          {[
            { key: 'currentPassword', label: 'Current Password', show: 'current' },
            { key: 'newPassword',     label: 'New Password',     show: 'new'     },
            { key: 'confirmPassword', label: 'Confirm Password', show: 'confirm' },
          ].map(({ key, label, show }) => (
            <div key={key}>
              <label className="block text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">{label}</label>
              <div className="relative">
                <input type={showPw[show] ? 'text' : 'password'} value={passwords[key]}
                  onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))} placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 pr-10 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 transition-all" />
                <button type="button" onClick={() => setShowPw(p => ({ ...p, [show]: !p[show] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors">
                  {showPw[show] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <Button onClick={handleChangePassword} disabled={changingPw}>
              <Lock size={14} />{changingPw ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </div>
      </Section>

      {/* Account details */}
      <Section title="Account Details" subtitle="Read-only account information">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'User ID',    value: user?._id },
            { label: 'Email',      value: user?.email },
            { label: 'Role',       value: user?.role },
            { label: 'Last Login', value: user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/3 rounded-xl p-3 border border-white/5">
              <div className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-1">{label}</div>
              <div className="text-sm text-zinc-300 font-medium truncate">{value || '—'}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
