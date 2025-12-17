import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ChangePassword from './pages/auth/ChangePassword';

// Client Pages
import Dashboard from './pages/client/Dashboard';
import Deposit from './pages/client/Deposit';
import Withdraw from './pages/client/Withdraw';
import Transfer from './pages/client/Transfer';
import History from './pages/client/History';

// Agent Pages
import ClientList from './pages/agent/ClientList';
import CreateClient from './pages/agent/CreateClient';
import AgentOperations from './pages/agent/AgentOperations';
import ManageAccounts from './pages/agent/ManageAccounts';

// Shared Pages
import Profile from './pages/Profile';

import './App.css';

function App() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  // Determine home route based on user role
  const getHomeRoute = () => {
    if (!isAuthenticated) return '/login';
    if (user?.firstLogin) return '/change-password';
    const isAgent = user?.username?.includes('agent');
    return isAgent ? '/agent/clients' : '/client/dashboard';
  };

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to={getHomeRoute()} /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to={getHomeRoute()} /> : <Register />} 
          />

          {/* Change Password - Required for first login */}
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* Profile - Accessible by all authenticated users */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Client Routes */}
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute requiredRole="CLIENT">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/deposit"
            element={
              <ProtectedRoute requiredRole="CLIENT">
                <Deposit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/withdraw"
            element={
              <ProtectedRoute requiredRole="CLIENT">
                <Withdraw />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/transfer"
            element={
              <ProtectedRoute requiredRole="CLIENT">
                <Transfer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/history"
            element={
              <ProtectedRoute requiredRole="CLIENT">
                <History />
              </ProtectedRoute>
            }
          />

          {/* Agent Routes */}
          <Route
            path="/agent/clients"
            element={
              <ProtectedRoute requiredRole="AGENT">
                <ClientList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/create-client"
            element={
              <ProtectedRoute requiredRole="AGENT">
                <CreateClient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/operations"
            element={
              <ProtectedRoute requiredRole="AGENT">
                <AgentOperations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/manage-accounts"
            element={
              <ProtectedRoute requiredRole="AGENT">
                <ManageAccounts />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to={getHomeRoute()} />} />
          <Route path="*" element={<Navigate to={getHomeRoute()} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
