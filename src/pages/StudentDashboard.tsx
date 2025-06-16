
import React, { useState } from 'react';
import { MapPin, Calendar, Users, Shield, AlertTriangle, Navigation, LogOut, UserX } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CampusMap from '../components/CampusMap';
import GeofencingModule from '../components/GeofencingModule';
import SafetyAlerts from '../components/SafetyAlerts';
import { useFirebase } from '../hooks/useFirebase';
import { useAuth } from '../contexts/AuthContext';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const { alerts, incidents } = useFirebase();
  const [activeTab, setActiveTab] = useState('navigation');
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Optional login - allow access without authentication but with limited features
  const isAuthenticated = !!user;
  const userRole = user?.role || 'guest';

  const handleOptionalLogin = () => {
    // This would redirect to auth page or show auth modal
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Campus Navigator</h1>
                <p className="text-gray-600">Your campus companion for navigation and safety</p>
              </div>
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className={`h-3 w-3 rounded-full ${
                        userRole === 'staff' ? 'bg-purple-500' : 'bg-blue-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-700">
                        {userRole === 'staff' ? 'Staff' : 'Student'}: {user.name}
                      </span>
                    </div>
                    <Button onClick={logout} variant="outline" size="sm">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <UserX className="h-4 w-4" />
                      <span className="text-sm">Guest Mode</span>
                    </div>
                    <Button onClick={handleOptionalLogin} size="sm">
                      Login for Full Access
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="geofencing">Campus Maps</TabsTrigger>
            <TabsTrigger value="safety">Safety</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            {isAuthenticated && <TabsTrigger value="profile">Profile</TabsTrigger>}
          </TabsList>

          <TabsContent value="navigation" className="space-y-6">
            {/* Quick Stats for Students/Staff */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Your Location</CardTitle>
                  <MapPin className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">Campus Center</div>
                  <p className="text-xs text-muted-foreground">10.333°N, 7.750°E</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">{alerts.length}</div>
                  <p className="text-xs text-muted-foreground">Campus notifications</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Navigation Mode</CardTitle>
                  <Navigation className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">Walking</div>
                  <p className="text-xs text-muted-foreground">Optimized routes</p>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Campus Map */}
            <Card>
              <CardHeader>
                <CardTitle>Interactive Campus Map</CardTitle>
                <CardDescription>
                  {isAuthenticated 
                    ? "Navigate to your destinations with personalized routes" 
                    : "Explore the campus - login for personalized navigation"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CampusMap 
                  selectedLocation={selectedLocation} 
                  userLocation={{ lat: 10.333, lng: 7.750 }} 
                  alerts={alerts} 
                  incidents={incidents} 
                />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center" variant="outline">
                <MapPin className="h-6 w-6 mb-2" />
                Find Building
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center" variant="outline">
                <Navigation className="h-6 w-6 mb-2" />
                Get Directions
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center" variant="outline">
                <Shield className="h-6 w-6 mb-2" />
                Emergency Help
              </Button>
              <Button className="h-20 flex flex-col items-center justify-center" variant="outline">
                <Calendar className="h-6 w-6 mb-2" />
                Campus Events
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="geofencing">
            <GeofencingModule 
              defaultLocation={{ latitude: 10.333, longitude: 7.750 }}
              isAdmin={false}
              isAuthenticated={isAuthenticated}
            />
          </TabsContent>

          <TabsContent value="safety">
            <SafetyAlerts alerts={alerts} isAdmin={false} />
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Campus Events</CardTitle>
                <CardDescription>Upcoming events and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Student Orientation</h3>
                    <p className="text-sm text-gray-600">Tomorrow, 10:00 AM - Main Auditorium</p>
                    <Button size="sm" className="mt-2">Get Directions</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold">Career Fair</h3>
                    <p className="text-sm text-gray-600">Friday, 2:00 PM - Engineering Building</p>
                    <Button size="sm" className="mt-2">Get Directions</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isAuthenticated && (
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Manage your campus profile and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Personal Information</h3>
                      <p className="text-sm text-gray-600">Name: {user.name}</p>
                      <p className="text-sm text-gray-600">Email: {user.email}</p>
                      <p className="text-sm text-gray-600">Role: {userRole}</p>
                    </div>
                    {user.role === 'student' && (
                      <div>
                        <h3 className="font-medium">Campus Points</h3>
                        <p className="text-sm text-gray-600">Points: {user.points || 0}</p>
                        <p className="text-sm text-gray-600">Badges: {user.badges?.length || 0}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
