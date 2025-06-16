
import React, { useState } from 'react';
import { Users, AlertTriangle, MapPin, BarChart3, Settings, Shield, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CampusMap from '../components/CampusMap';
import AdminPanel from '../components/AdminPanel';
import SafetyAlerts from '../components/SafetyAlerts';
import GeofencingModule from '../components/GeofencingModule';
import { useFirebase } from '../hooks/useFirebase';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { alerts, incidents } = useFirebase();
  const [activeTab, setActiveTab] = useState('overview');

  // Enforce admin-only access
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center max-w-md">
          <Shield className="mx-auto h-16 w-16 text-red-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">Administrator privileges required to access this page.</p>
          <Button onClick={logout} variant="outline">Return to Login</Button>
        </div>
      </div>
    );
  }

  const stats = {
    totalUsers: 1250,
    activeAlerts: alerts.length,
    totalIncidents: incidents.length,
    locationsManaged: 45
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Control Center</h1>
                <p className="text-gray-600">Campus Security & Management Dashboard</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-700">Administrator: {user.name}</span>
                </div>
                <Button onClick={logout} variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="geofencing">3D Geofencing</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="alerts">Safety Alerts</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.activeAlerts}</div>
                  <p className="text-xs text-muted-foreground">Requires attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Incidents Reported</CardTitle>
                  <BarChart3 className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalIncidents}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Campus Locations</CardTitle>
                  <MapPin className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.locationsManaged}</div>
                  <p className="text-xs text-muted-foreground">Managed locations</p>
                </CardContent>
              </Card>
            </div>

            {/* Campus Map Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Live Campus Overview</CardTitle>
                <CardDescription>Real-time campus monitoring and navigation</CardDescription>
              </CardHeader>
              <CardContent>
                <CampusMap 
                  selectedLocation={null} 
                  userLocation={{ lat: 10.333, lng: 7.750 }} 
                  alerts={alerts} 
                  incidents={incidents} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geofencing">
            <GeofencingModule 
              defaultLocation={{ latitude: 10.333, longitude: 7.750 }}
              isAdmin={true}
            />
          </TabsContent>

          <TabsContent value="locations">
            <AdminPanel />
          </TabsContent>

          <TabsContent value="alerts">
            <SafetyAlerts alerts={alerts} isAdmin={true} />
          </TabsContent>

          <TabsContent value="incidents">
            <Card>
              <CardHeader>
                <CardTitle>Incident Management</CardTitle>
                <CardDescription>Review and manage reported incidents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{incident.title}</h3>
                        <span className="text-xs text-gray-500">{new Date(incident.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                      <p className="text-xs text-gray-500 mb-3">Location: {incident.location}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm" variant="outline">Resolve</Button>
                        <Button size="sm" variant="outline">Archive</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Students</h3>
                      <p className="text-sm text-gray-600">1,050 active users</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Staff</h3>
                      <p className="text-sm text-gray-600">200 active users</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Administrators</h3>
                      <p className="text-sm text-gray-600">5 active users</p>
                    </div>
                    <Button variant="outline">Manage</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
