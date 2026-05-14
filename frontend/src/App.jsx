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
import Profile   from './pages/Profile';
import Settings  from './pages/Settings';

const PrivateRoute = ({ children }) => {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" replace />;
};

const P = ({ children }) => (
  <PrivateRoute><Layout>{children}</Layout></PrivateRoute>
);

const AppRoutes = () => (
  <Routes>
    <Route path="/login"    element={<Login />} />
    <Route path="/"         element={<P><Dashboard /></P>} />
    <Route path="/leads"    element={<P><Leads /></P>} />
    <Route path="/deals"    element={<P><Deals /></P>} />
    <Route path="/tasks"    element={<P><Tasks /></P>} />
    <Route path="/orgs"     element={<P><Orgs /></P>} />
    <Route path="/users"    element={<P><Users /></P>} />
    <Route path="/profile"  element={<P><Profile /></P>} />
    <Route path="/settings" element={<P><Settings /></P>} />
    <Route path="*"         element={<Navigate to="/" replace />} />
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
