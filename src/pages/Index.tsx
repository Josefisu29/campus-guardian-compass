
import React, { useState, useEffect } from 'react';
import { Search, MapPin, AlertTriangle, Award, Users, Shield, Building, Route } from 'lucide-react';
import CampusMap from '../components/CampusMap';
import SearchBar from '../components/SearchBar';
import SafetyAlerts from '../components/SafetyAlerts';
import IncidentReport from '../components/IncidentReport';
import UserProfile from '../components/UserProfile';
import AdminPanel from '../components/AdminPanel';
import IndoorNavigation from '../components/IndoorNavigation';
import MultiModalRouting from '../components/MultiModalRouting';
import Auth from '../components/Auth';
import { useAuth } from '../contexts/AuthContext';
import { useFirebase } from '../hooks/useFirebase';
import { Button } from '../components/ui/button';

const Index = () => {
  const { user, logout, loading } = useAuth();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('map');
  const [userLocation, setUserLocation] = useState(null);
  const { alerts, incidents, updateUserPoints } = useFirebase();

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied:', error);
          // Default to campus center
          setUserLocation({ lat: 37.422, lng: -122.084 });
        }
      );
    }
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    if (user?.role !== 'admin') {
      updateUserPoints(10);
    }
  };

  const handleIncidentReport = (report) => {
    if (user?.role !== 'admin') {
      updateUserPoints(20);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const tabConfig = [
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'indoor', label: 'Indoor Nav', icon: Building },
    { id: 'routing', label: 'Routing', icon: Route },
    { id: 'alerts', label: 'Safety', icon: Shield },
    { id: 'report', label: 'Report', icon: AlertTriangle },
    ...(user.role === 'admin' 
      ? [{ id: 'admin', label: 'Admin', icon: Users }] 
      : [{ id: 'community', label: 'Community', icon: Users }]
    )
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Campus Navigator</h1>
                <p className="text-sm text-gray-500">Your smart campus companion</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="font-medium">{user.email}</span>
                <span className="ml-2 text-gray-500">({user.role})</span>
              </div>
              {user.role !== 'admin' && (
                <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-1 rounded-full">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">{user.points || 0} points</span>
                </div>
              )}
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabConfig.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'map' && (
          <div className="space-y-6">
            <SearchBar onLocationSelect={handleLocationSelect} />
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <CampusMap
                selectedLocation={selectedLocation}
                userLocation={userLocation}
                alerts={alerts}
                incidents={incidents}
              />
            </div>
            {selectedLocation && (
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Directions to {selectedLocation.name}
                </h3>
                <p className="text-gray-600">
                  Estimated walking time: {selectedLocation.walkTime || '5-10 minutes'}
                </p>
                {user.role !== 'admin' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      🎉 You earned 10 points for exploring a new location!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'indoor' && <IndoorNavigation />}

        {activeTab === 'routing' && <MultiModalRouting />}

        {activeTab === 'alerts' && <SafetyAlerts alerts={alerts} />}

        {activeTab === 'report' && (
          <IncidentReport 
            onReport={handleIncidentReport}
            userLocation={userLocation}
          />
        )}

        {activeTab === 'admin' && user.role === 'admin' && <AdminPanel />}

        {activeTab === 'community' && user.role !== 'admin' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Hub</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 rounded-lg text-white">
                <Award className="h-8 w-8 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Your Achievements</h3>
                <p className="text-purple-100">Points: {user.points || 0}</p>
                <p className="text-purple-100">Badges: {user.badges?.length || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-teal-500 p-6 rounded-lg text-white">
                <Users className="h-8 w-8 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Community Reports</h3>
                <p className="text-green-100">{incidents.length} active reports</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-6 rounded-lg text-white">
                <Shield className="h-8 w-8 mb-3" />
                <h3 className="text-lg font-semibold mb-2">Safety Score</h3>
                <p className="text-blue-100">95% Safe Routes</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
