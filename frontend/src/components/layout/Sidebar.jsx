import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, TrendingUp,
  CheckSquare, BarChart2, LogOut, Zap, ChevronRight,
  UserCircle, Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/',        icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads',   icon: TrendingUp,      label: 'Leads'     },
  { to: '/deals',   icon: BarChart2,       label: 'Deals'     },
  { to: '/tasks',   icon: CheckSquare,     label: 'Tasks'     },
  { to: '/orgs',    icon: Building2,       label: 'Orgs'      },
  { to: '/users',   icon: Users,           label: 'Users'     },
];

const bottomLinks = [
  { to: '/profile',  icon: UserCircle, label: 'My Profile' },
  { to: '/settings', icon: Settings,   label: 'Settings'   },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[220px] flex flex-col z-40"
      style={{ background: 'linear-gradient(180deg, #1a1040 0%, #0f0c1e 40%, #0d0f14 100%)' }}>

      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/8">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Zap size={15} className="text-white" />
        </div>
        <div>
          <span className="font-bold text-[15px] text-white tracking-tight">StackCRM</span>
          <div className="text-[10px] text-indigo-400/70 font-medium tracking-wider uppercase">AI Powered</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest px-3 pb-2 pt-1">Menu</p>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 group
              ${isActive
                ? 'bg-indigo-500/15 text-white shadow-sm'
                : 'text-white/40 hover:text-white/80 hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={15} className={isActive ? 'text-indigo-400' : 'text-white/30 group-hover:text-white/60'} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={12} className="text-indigo-400/60" />}
              </>
            )}
          </NavLink>
        ))}

        <div className="pt-3 mt-3 border-t border-white/8">
          <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest px-3 pb-2">Account</p>
          {bottomLinks.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 group
                ${isActive
                  ? 'bg-indigo-500/15 text-white shadow-sm'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={15} className={isActive ? 'text-indigo-400' : 'text-white/30 group-hover:text-white/60'} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={12} className="text-indigo-400/60" />}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-white/8">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 mb-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-zinc-200 truncate">{user?.name}</div>
            <div className="text-[10px] text-zinc-500 capitalize">{user?.role}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-[12px] text-white/30 hover:text-white/60 hover:bg-white/5 transition-all">
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
