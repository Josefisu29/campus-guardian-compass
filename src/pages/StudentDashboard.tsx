
import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, Award, Users, Navigation, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CampusMap from '../components/CampusMap';
import SearchBar from '../components/SearchBar';
import SafetyAlerts from '../components/SafetyAlerts';
import IncidentReport from '../components/IncidentReport';
import IndoorNavigation from '../components/IndoorNavigation';
import MultiModalRouting from '../components/MultiModalRouting';
import { useAuth } from '../contexts/AuthContext';
import { useFirebase } from '../hooks/useFirebase';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { alerts, incidents, updateUserPoints } = useFirebase();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('map');

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
    updateUserPoints(10);
  };

  const handleIncidentReport = (report) => {
    updateUserPoints(20);
  };

  const userRole = user?.role === 'student' ? 'Student' : 'Staff';
  const userPoints = user?.points || 0;
  const userBadges = user?.badges?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Campus Navigator</h1>
                <p className="text-gray-600">Welcome back, {user?.name || userRole}!</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                  <p className="text-xs text-gray-500">{userRole}</p>
                </div>
                <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-2 rounded-full">
                  <Award className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">{userPoints} points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="indoor">Indoor Nav</TabsTrigger>
            <TabsTrigger value="routing">Routing</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-6">
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
              <Card>
                <CardHeader>
                  <CardTitle>Directions to {selectedLocation.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Estimated walking time: {selectedLocation.walkTime || '5-10 minutes'}
                  </p>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      🎉 You earned 10 points for exploring a new location!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="indoor">
            <IndoorNavigation />
          </TabsContent>

          <TabsContent value="routing">
            <MultiModalRouting />
          </TabsContent>

          <TabsContent value="safety">
            <SafetyAlerts alerts={alerts} />
          </TabsContent>

          <TabsContent value="report">
            <IncidentReport 
              onReport={handleIncidentReport}
              userLocation={userLocation}
            />
          </TabsContent>

          <TabsContent value="community">
            <div className="space-y-6">
              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="h-5 w-5" />
                      <span>Your Achievements</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-purple-100">Points: {userPoints}</p>
                      <p className="text-purple-100">Badges: {userBadges}</p>
                      <p className="text-purple-100">Rank: Explorer</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-teal-500 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Community Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-green-100">Reports: {incidents.length}</p>
                      <p className="text-green-100">Active Alerts: {alerts.length}</p>
                      <p className="text-green-100">Campus Safety: 95%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Navigation className="h-5 w-5" />
                      <span>Your Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-blue-100">Places Visited: 12</p>
                      <p className="text-blue-100">Routes Taken: 8</p>
                      <p className="text-blue-100">Incidents Reported: 2</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Campus Activity</CardTitle>
                  <CardDescription>Stay updated with what's happening on campus</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Campus Safety Walk</p>
                        <p className="text-sm text-gray-600">Tomorrow at 7:00 PM - Main Quad</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="font-medium">Construction Notice</p>
                        <p className="text-sm text-gray-600">Science Building entrance closed until Friday</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <Award className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="font-medium">New Badge Available</p>
                        <p className="text-sm text-gray-600">Report 5 incidents to earn "Community Guardian" badge</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => setActiveTab('report')}
                    >
                      <AlertTriangle className="h-5 w-5" />
                      <span className="text-xs">Report Issue</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => setActiveTab('safety')}
                    >
                      <AlertTriangle className="h-5 w-5" />
                      <span className="text-xs">View Alerts</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => setActiveTab('map')}
                    >
                      <MapPin className="h-5 w-5" />
                      <span className="text-xs">Find Location</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => setActiveTab('routing')}
                    >
                      <Navigation className="h-5 w-5" />
                      <span className="text-xs">Get Directions</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
