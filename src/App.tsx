import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import { ThemeProvider } from './context/ThemeContext';
import AdminRoute from './components/admin/AdminRoute';
import PlanManagement from './pages/admin/PlanManagement';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AdminProvider>
            <Routes>
              <Route path="/auth/signin" element={<SignIn />} />
              <Route path="/auth/signup" element={<SignUp />} />
              <Route path="/" element={<Landing />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/admin/plans"
                element={
                  <AdminRoute>
                    <PlanManagement />
                  </AdminRoute>
                }
              />
            </Routes>
          </AdminProvider>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
