import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import HRDashboard from './components/hr/HRDashboard';
import EmployeeDashboard from './components/employee/EmployeeDashboard';
import Navbar from './components/layout/Navbar';
import Loading from './components/layout/Loading';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DeviceRestriction from './components/layout/DeviceRestriction';
import useScreenSize from './hooks/useScreenSize';

function App() {
  const { isAuthenticated, loading, user } = useAuth();
  const isMobile = useScreenSize();

  if (loading) {
    return <Loading />;
  }

  // Show device restriction message on mobile devices
  if (isMobile) {
    return <DeviceRestriction />;
  }

  return (
    <div className="App">
      {isAuthenticated && <Navbar />}
      <div className="container">
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/" /> : <Register />} 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                {user?.role === 'hr' ? <HRDashboard /> : <EmployeeDashboard />}
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/hr/*" 
            element={
              <ProtectedRoute requiredRole="hr">
                <HRDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee/*" 
            element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App; 