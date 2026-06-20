import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import DsaTracker from './pages/student/DsaTracker';
import AddDsaProgress from './pages/student/AddDsaProgress';
import JobTracker from './pages/student/JobTracker';
import ProfilePage from './pages/student/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import StudentProgressDetail from './pages/admin/StudentProgressDetail';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Paths */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Student Protected Paths */}
      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/dsa" element={<DsaTracker />} />
          <Route path="/dsa/add" element={<AddDsaProgress />} />
          <Route path="/jobs" element={<JobTracker />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Admin Protected Paths */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/students" element={<ManageStudents />} />
          <Route path="/admin/students/:id" element={<StudentProgressDetail />} />
        </Route>
      </Route>

      {/* Redirect Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
