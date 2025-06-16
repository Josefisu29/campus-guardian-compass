import React, { useState } from 'react';
import { MapPin, Calendar, Users, Shield, Bell, Navigation, LogOut, UserX, Search, Star, Settings, Bookmark } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import CampusMap from '../components/CampusMap';
import GeofencingModule from '../components/GeofencingModule';
import { useAuth } from '../contexts/AuthContext';

const StudentDashboard = () => {
  const { user, logout, setTestUser } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Optional login - allow access without authentication but with limited features
  const isAuthenticated = !!user;
  const userRole = user?.role || 'guest';

  // Test mode login options
  const handleTestLogin = (role: 'admin' | 'student' | 'staff') => {
    setTestUser(role);
  };

  const mockEvents = [
    { id: 1, title: 'Orientation Program', location: 'Main Auditorium', date: '2024-01-20', time: '10:00 AM', category: 'Academic' },
    { id: 2, title: 'Career Fair', location: 'Engineering Building', date: '2024-01-25', time: '2:00 PM', category: 'Career' },
    { id: 3, title: 'Sports Tournament', location: 'Sports Complex', date: '2024-01-30', time: '4:00 PM', category: 'Recreation' }
  ];

  const mockBuildings = [
    { id: 1, name: 'Engineering Building', type: 'Academic', capacity: 500, description: 'Main engineering faculty building' },
    { id: 2, name: 'Main Auditorium', type: 'Assembly', capacity: 1000, description: 'Large venue for events and ceremonies' },
    { id: 3, name: 'Library Complex', type: 'Academic', capacity: 300, description: 'Central library and study areas' }
  ];

  const userBookmarks = user?.preferences?.bookmarks || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AFIT Campus Navigator</h1>
                <p className="text-gray-600">Nigerian Air Force Institute of Technology - Campus Guide</p>
              </div>
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className={`h-3 w-3 rounded-full ${
                        userRole === 'staff' ? 'bg-purple-500' : userRole === 'admin' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-700">
                        {userRole === 'staff' ? 'Staff' : userRole === 'admin' ? 'Admin' : 'Student'}: {user.name}
                      </span>
                    </div>
                    {user.role === 'student' && (
                      <Badge variant="secondary">{user.points} points</Badge>
                    )}
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
                    <div className="flex space-x-2">
                      <Button onClick={() => handleTestLogin('student')} size="sm" variant="outline">
                        Test as Student
                      </Button>
                      <Button onClick={() => handleTestLogin('staff')} size="sm" variant="outline">
                        Test as Staff
                      </Button>
                      <Button onClick={() => handleTestLogin('admin')} size="sm">
                        Test as Admin
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="map">Campus Map</TabsTrigger>
            <TabsTrigger value="buildings">Buildings</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            {isAuthenticated && <TabsTrigger value="profile">Profile</TabsTrigger>}
            {isAuthenticated && <TabsTrigger value="settings">Settings</TabsTrigger>}
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            {/* Welcome Banner */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-2">
                  Welcome{isAuthenticated ? ` back, ${user.name}!` : ' to AFIT Campus!'}
                </h2>
                <p className="text-blue-100">
                  {isAuthenticated 
                    ? "Navigate the Nigerian Air Force Institute of Technology campus with ease and stay updated on events." 
                    : "Explore AFIT Kaduna campus and discover amazing locations. Login for personalized features."}
                </p>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Event</CardTitle>
                  <Calendar className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">Orientation Program</div>
                  <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Campus Buildings</CardTitle>
                  <MapPin className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">45</div>
                  <p className="text-xs text-muted-foreground">Explore locations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isAuthenticated ? 'Your Bookmarks' : 'Popular Spots'}
                  </CardTitle>
                  <Bookmark className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold">
                    {isAuthenticated ? userBookmarks.length : '12'}
                  </div>
                  <p className="text-xs text-muted-foreground">Saved locations</p>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Events Widget */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Don't miss out on campus activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-gray-600">{event.location} • {event.date} at {event.time}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="outline">{event.category}</Badge>
                        <Button size="sm" variant="outline">
                          <Bell className="h-3 w-3 mr-1" />
                          Notify Me
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Campus Map Preview with correct coordinates */}
            <Card>
              <CardHeader>
                <CardTitle>AFIT Campus Overview</CardTitle>
                <CardDescription>Interactive map of Nigerian Air Force Institute of Technology, Kaduna</CardDescription>
              </CardHeader>
              <CardContent>
                <CampusMap 
                  selectedLocation={selectedLocation} 
                  userLocation={{ lat: 10.333674, lng: 7.749362 }} // AFIT center coordinates
                  alerts={[]} 
                  incidents={[]} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <GeofencingModule 
              defaultLocation={{ latitude: 10.333674, longitude: 7.749362 }} // AFIT coordinates
              isAdmin={false}
              isAuthenticated={isAuthenticated}
            />
          </TabsContent>

          <TabsContent value="buildings" className="space-y-6">
            {/* Buildings Directory */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Campus Buildings</CardTitle>
                    <CardDescription>Explore facilities and amenities</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search buildings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockBuildings.map((building) => (
                    <Card key={building.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{building.name}</h3>
                          {isAuthenticated && userBookmarks.includes(`building-${building.id}`) && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{building.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{building.type}</Badge>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">View Details</Button>
                            <Button size="sm">Get Directions</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            {/* Events Directory */}
            <Card>
              <CardHeader>
                <CardTitle>Campus Events</CardTitle>
                <CardDescription>Stay updated with campus activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-gray-600">{event.location}</p>
                          <p className="text-xs text-gray-500">{event.date} at {event.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{event.category}</Badge>
                        <Button size="sm" variant="outline">
                          <Bell className="h-3 w-3 mr-1" />
                          Remind Me
                        </Button>
                        <Button size="sm">Get Directions</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isAuthenticated && (
            <TabsContent value="profile" className="space-y-6">
              {/* User Profile */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Manage your campus profile and achievements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Personal Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Name:</span> {user.name}</p>
                        <p><span className="font-medium">Email:</span> {user.email}</p>
                        <p><span className="font-medium">Role:</span> {userRole}</p>
                      </div>
                    </div>
                    {user.role === 'student' && (
                      <div>
                        <h3 className="font-medium mb-2">Campus Achievements</h3>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Campus Points</span>
                            <Badge variant="secondary">{user.points || 0}</Badge>
                          </div>
                          <div className="space-y-1">
                            <span className="text-sm font-medium">Badges Earned</span>
                            <div className="flex flex-wrap gap-1">
                              {(user.badges || []).map((badge, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {user.role === 'staff' && user.assignedBuildings && (
                    <div>
                      <h3 className="font-medium mb-2">Assigned Buildings</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.assignedBuildings.map((buildingId, index) => (
                          <Badge key={index} variant="default">
                            Building {buildingId}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {isAuthenticated && (
            <TabsContent value="settings" className="space-y-6">
              {/* User Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Control how you receive campus updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Event Notifications</h4>
                      <p className="text-sm text-gray-600">Get notified about upcoming events</p>
                    </div>
                    <Switch defaultChecked={user.preferences?.notifications} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Emergency Alerts</h4>
                      <p className="text-sm text-gray-600">Receive urgent campus safety alerts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Building Updates</h4>
                      <p className="text-sm text-gray-600">Updates about facility changes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Accessibility Settings</CardTitle>
                  <CardDescription>Customize your campus navigation experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">High Contrast Mode</h4>
                      <p className="text-sm text-gray-600">Enhanced visibility for better readability</p>
                    </div>
                    <Switch defaultChecked={user.preferences?.accessibility} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Large Text</h4>
                      <p className="text-sm text-gray-600">Increase text size throughout the app</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Voice Navigation</h4>
                      <p className="text-sm text-gray-600">Audio directions for campus navigation</p>
                    </div>
                    <Switch />
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
