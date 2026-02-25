import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/auth/Login';

import EmployeeDashboard from './pages/employee/Dashboard';
import Jobs from './pages/employee/Jobs';
import JobDetail from './pages/employee/JobDetail';
import Scan from './pages/employee/Scan';
import Barcodes from './pages/employee/Barcodes';
import Customers from './pages/employee/Customers';
import CustomerDetail from './pages/employee/CustomerDetail';
import Reports from './pages/employee/Reports';
import Invoices from './pages/employee/Invoices';
import Employees from './pages/employee/Employees';
import Settings from './pages/employee/Settings';

import CustomerDashboard from './pages/customer/Dashboard';
import Visits from './pages/customer/Visits';
import VisitDetail from './pages/customer/VisitDetail';
import CustomerReports from './pages/customer/Reports';
import CustomerInvoices from './pages/customer/Invoices';
import CustomerSettings from './pages/customer/Settings';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'customer' ? '/customer/dashboard' : '/app/dashboard'} replace />;
  }
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/app" element={
        <ProtectedRoute allowedRoles={['admin', 'employee']}>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="scan" element={<Scan />} />
        <Route path="barcodes" element={<Barcodes />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/:id" element={<CustomerDetail />} />
        <Route path="reports" element={<Reports />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="employees" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Employees />
          </ProtectedRoute>
        } />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/customer" element={
        <ProtectedRoute allowedRoles={['customer']}>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="visits" element={<Visits />} />
        <Route path="visits/:id" element={<VisitDetail />} />
        <Route path="reports" element={<CustomerReports />} />
        <Route path="invoices" element={<CustomerInvoices />} />
        <Route path="settings" element={<CustomerSettings />} />
      </Route>

      <Route path="*" element={
        <Navigate to={user ? (user.role === 'customer' ? '/customer/dashboard' : '/app/dashboard') : '/login'} replace />
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/Almojzeh-app">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
