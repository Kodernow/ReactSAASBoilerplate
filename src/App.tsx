import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import AdminRoute from './components/admin/AdminRoute';
import PlanManagement from './pages/admin/PlanManagement';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Home from './pages/Home';
import Profile from './pages/Profile';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <Routes>
            <Route path="/auth/signin" element={<SignIn />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="/" element={<Home />} />
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
    </Router>
  );
}

export default App;
