import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { ThemeProvider } from './context/ThemeContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { TodoProvider } from './context/TodoContext';
import AdminRoute from './components/admin/AdminRoute';
import ProtectedRoute from './components/auth/ProtectedRoute';
import FeatureRoute from './components/auth/FeatureRoute';
import AdminLayout from './components/admin/AdminLayout';
import Layout from './components/layout/Layout';

// Pages
import Landing from './pages/Landing';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import TodoBoard from './pages/TodoBoard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PlanManagement from './pages/admin/PlanManagement';
import CouponManagement from './pages/admin/CouponManagement';

import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <SubscriptionProvider>
            <TodoProvider>
              <Router>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Landing />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/auth/signin" element={<SignIn />} />
                  <Route path="/auth/signup" element={<SignUp />} />
                  <Route path="/auth/forgot-password" element={<ForgotPassword />} />

                  {/* Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Dashboard />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/todo"
                    element={
                      <ProtectedRoute>
                        <FeatureRoute feature="todoboardEnabled">
                          <Layout>
                            <TodoBoard />
                          </Layout>
                        </FeatureRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Profile />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Layout>
                          <Settings />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminLayout>
                          <AdminDashboard />
                        </AdminLayout>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <AdminRoute>
                        <AdminLayout>
                          <UserManagement />
                        </AdminLayout>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/plans"
                    element={
                      <AdminRoute>
                        <AdminLayout>
                          <PlanManagement />
                        </AdminLayout>
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/coupons"
                    element={
                      <AdminRoute>
                        <AdminLayout>
                          <CouponManagement />
                        </AdminLayout>
                      </AdminRoute>
                    }
                  />
                </Routes>
              </Router>
            </TodoProvider>
          </SubscriptionProvider>
        </AdminProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-light)',
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;