import { useAuth } from '../context/AuthContext';
import AdminDashboard   from './dashboards/AdminDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import AgentDashboard   from './dashboards/AgentDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'admin')   return <AdminDashboard />;
  if (user?.role === 'manager') return <ManagerDashboard />;
  return <AgentDashboard />;
}
