import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout    from './components/layout/Layout';
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads     from './pages/Leads';
import Deals     from './pages/Deals';
import Tasks     from './pages/Tasks';
import Orgs      from './pages/Orgs';
import Users     from './pages/Users';

const PrivateRoute = ({ children }) => {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" replace />;
};

// AppRoutes must be inside AuthProvider so useAuth() works
const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
    <Route path="/leads" element={<PrivateRoute><Layout><Leads /></Layout></PrivateRoute>} />
    <Route path="/deals" element={<PrivateRoute><Layout><Deals /></Layout></PrivateRoute>} />
    <Route path="/tasks" element={<PrivateRoute><Layout><Tasks /></Layout></PrivateRoute>} />
    <Route path="/orgs"  element={<PrivateRoute><Layout><Orgs  /></Layout></PrivateRoute>} />
    <Route path="/users" element={<PrivateRoute><Layout><Users /></Layout></PrivateRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
