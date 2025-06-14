
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Auth from '../components/Auth';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import LandingPage from '../components/LandingPage';

const Index = () => {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  // Debug logging to track authentication and routing
  useEffect(() => {
    console.log('Index component state:', {
      user: user ? { email: user.email, role: user.role, uid: user.uid } : null,
      loading,
      showAuth
    });
  }, [user, loading, showAuth]);

  if (loading) {
    console.log('Showing loading state...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If no authenticated user
  if (!user) {
    console.log('No authenticated user, showAuth:', showAuth);
    if (!showAuth) {
      return <LandingPage onGetStarted={() => setShowAuth(true)} />;
    }
    return <Auth />;
  }

  // Route authenticated users based on role
  console.log('Routing authenticated user with role:', user.role);
  
  if (user.role === 'admin') {
    console.log('Redirecting to AdminDashboard');
    return <AdminDashboard />;
  }

  // Both students and staff use the same dashboard
  console.log('Redirecting to StudentDashboard for role:', user.role);
  return <StudentDashboard />;
};

export default Index;
