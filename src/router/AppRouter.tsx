import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleGuard from './RoleGuard';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import AdminPage from '../pages/AdminPage';
import ForbiddenPage from '../pages/ForbiddenPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forbidden" element={<ForbiddenPage />} />

        {/* Protected routes — require authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Role-gated routes — require "Admin" role */}
          <Route element={<RoleGuard requiredRoles="Admin" />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
