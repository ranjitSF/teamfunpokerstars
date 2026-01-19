import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Games from './pages/Games';
import Players from './pages/Players';
import { isDemoMode } from './config/app';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected routes with shared layout */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/games" element={<Games />} />
            <Route path="/players" element={<Players />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      {isDemoMode && (
        <div className="fixed bottom-4 right-4 bg-poker-accent text-poker-dark px-4 py-2 rounded-lg font-bold shadow-gold z-50">
          DEMO MODE
        </div>
      )}
    </AuthProvider>
  );
}

export default App;
