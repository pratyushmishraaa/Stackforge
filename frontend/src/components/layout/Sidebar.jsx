import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, TrendingUp,
  CheckSquare, BarChart2, LogOut, Zap, ChevronRight,
  UserCircle, Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Nav links per role
const NAV = {
  admin: [
    { to: '/',       icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/leads',  icon: TrendingUp,      label: 'Leads'     },
    { to: '/deals',  icon: BarChart2,       label: 'Deals'     },
    { to: '/tasks',  icon: CheckSquare,     label: 'Tasks'     },
    { to: '/orgs',   icon: Building2,       label: 'Orgs'      },
    { to: '/users',  icon: Users,           label: 'Users'     },
  ],
  manager: [
    { to: '/',       icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/leads',  icon: TrendingUp,      label: 'Leads'     },
    { to: '/deals',  icon: BarChart2,       label: 'Deals'     },
    { to: '/tasks',  icon: CheckSquare,     label: 'Tasks'     },
    { to: '/orgs',   icon: Building2,       label: 'Orgs'      },
    { to: '/users',  icon: Users,           label: 'Team'      },
  ],
  agent: [
    { to: '/',       icon: LayoutDashboard, label: 'My Workspace' },
    { to: '/leads',  icon: TrendingUp,      label: 'Leads'        },
    { to: '/deals',  icon: BarChart2,       label: 'Deals'        },
    { to: '/tasks',  icon: CheckSquare,     label: 'Tasks'        },
    { to: '/orgs',   icon: Building2,       label: 'Orgs'         },
  ],
};

const BOTTOM = [
  { to: '/profile',  icon: UserCircle, label: 'My Profile' },
  { to: '/settings', icon: Settings,   label: 'Settings'   },
];

const ROLE_GRADIENT = {
  admin:   'linear-gradient(180deg, #1a1040 0%, #0f0c1e 40%, #0d0f14 100%)',
  manager: 'linear-gradient(180deg, #0f1a2e 0%, #0c1220 40%, #0d0f14 100%)',
  agent:   'linear-gradient(180deg, #0f1a14 0%, #0c1510 40%, #0d0f14 100%)',
};

const ROLE_ACCENT = {
  admin:   '#6366f1',
  manager: '#3b82f6',
  agent:   '#10b981',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role     = user?.role || 'agent';
  const links    = NAV[role] || NAV.agent;
  const accent   = ROLE_ACCENT[role];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[220px] flex flex-col z-40"
      style={{ background: ROLE_GRADIENT[role] }}>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }} />

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/8">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}99)`, boxShadow: `0 4px 12px ${accent}40` }}>
          <Zap size={15} className="text-white" />
        </div>
        <div>
          <span className="font-bold text-[15px] text-white tracking-tight">StackCRM</span>
          <div className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: accent + 'aa' }}>
            {role === 'admin' ? 'Admin Portal' : role === 'manager' ? 'Manager View' : 'Agent View'}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest px-3 pb-2 pt-1">Navigation</p>
        <div className="space-y-0.5">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 group
                ${isActive ? 'text-white shadow-sm' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`
              }
              style={({ isActive }) => isActive ? { background: accent + '18' } : {}}
            >
              {({ isActive }) => (
                <>
                  <Icon size={15} style={{ color: isActive ? accent : undefined }} className={isActive ? '' : 'text-white/30 group-hover:text-white/60'} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={12} style={{ color: accent + '80' }} />}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Account section */}
        <div className="mt-4 pt-4 border-t border-white/8">
          <p className="text-[10px] font-semibold text-white/20 uppercase tracking-widest px-3 pb-2">Account</p>
          <div className="space-y-0.5">
            {BOTTOM.map(({ to, icon: Icon, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 group
                  ${isActive ? 'text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`
                }
                style={({ isActive }) => isActive ? { background: accent + '18' } : {}}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={15} style={{ color: isActive ? accent : undefined }} className={isActive ? '' : 'text-white/30 group-hover:text-white/60'} />
                    <span className="flex-1">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/8">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 mb-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}80)` }}>
            {user?.avatar
              ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              : user?.name?.[0]?.toUpperCase()
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-zinc-200 truncate">{user?.name}</div>
            <div className="text-[10px] text-zinc-500 capitalize">{user?.role}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-[12px] text-white/30 hover:text-white/60 hover:bg-white/5 transition-all">
          <LogOut size={13} />Sign out
        </button>
      </div>
    </aside>
  );
}
