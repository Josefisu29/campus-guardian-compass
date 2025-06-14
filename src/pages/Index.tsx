
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Auth from '../components/Auth';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import LandingPage from '../components/LandingPage';

const Index = () => {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user && !showAuth) {
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  if (!user && showAuth) {
    return <Auth />;
  }

  // Route users to appropriate dashboard based on role
  if (user.role === 'admin') {
    return <AdminDashboard />;
  }

  // Both students and staff use the same dashboard with slight differences
  return <StudentDashboard />;
};

export default Index;
