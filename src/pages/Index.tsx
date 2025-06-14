
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

  // If no authenticated user, show landing page or auth
  if (!user) {
    console.log('No authenticated user, showAuth:', showAuth);
    if (!showAuth) {
      return <LandingPage onGetStarted={() => setShowAuth(true)} />;
    }
    return <Auth />;
  }

  // Role-based access control and routing
  console.log('Routing authenticated user with role:', user.role);
  
  // Admin access - only users with 'admin' role
  if (user.role === 'admin') {
    console.log('Granting admin access to:', user.email);
    return <AdminDashboard />;
  }

  // Student and Staff access - both use StudentDashboard but with different permissions
  if (user.role === 'student' || user.role === 'staff') {
    console.log(`Granting ${user.role} access to:`, user.email);
    return <StudentDashboard />;
  }

  // Fallback for users with invalid/unknown roles
  console.warn('User has invalid role:', user.role);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <div className="text-center max-w-md">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">
          Your account role ({user.role}) is not recognized. Please contact an administrator.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default Index;
