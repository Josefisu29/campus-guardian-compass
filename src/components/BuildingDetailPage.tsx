
import React, { useState } from 'react';
import { Building } from '../data/afitBuildings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, MapPin, Users, Calendar, Bell, Image } from 'lucide-react';

interface BuildingDetailPageProps {
  building: Building;
  onBack: () => void;
}

const BuildingDetailPage = ({ building, onBack }: BuildingDetailPageProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === building.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? building.images.length - 1 : prev - 1
    );
  };

  const getBuildingTypeColor = (type: string) => {
    switch (type) {
      case 'academic': return 'bg-blue-500';
      case 'residential': return 'bg-green-500';
      case 'administrative': return 'bg-purple-500';
      case 'recreational': return 'bg-orange-500';
      case 'service': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const upcomingEvents = building.events?.filter(event => 
    new Date(event.startTime) > new Date()
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button onClick={onBack} variant="outline">
            ← Back to Map
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{building.name}</h1>
            <p className="text-gray-600">AFIT Campus Building</p>
          </div>
        </div>

        {/* Image Gallery */}
        <Card>
          <CardContent className="p-0">
            <div className="relative h-96 bg-gray-200 rounded-t-lg overflow-hidden">
              <img
                src={building.images[currentImageIndex]}
                alt={`${building.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              
              {building.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                  >
                    →
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {building.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded flex items-center space-x-1">
                    <Image className="h-3 w-3" />
                    <span>{currentImageIndex + 1} of {building.images.length}</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Building Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Badge className={getBuildingTypeColor(building.type)}>
                    {building.type}
                  </Badge>
                  <span>About This Building</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{building.description}</p>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                  {building.capacity && (
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Capacity: {building.capacity}</span>
                    </div>
                  )}
                  {building.yearBuilt && (
                    <div className="text-sm text-gray-600">
                      Built in {building.yearBuilt}
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{building.coordinates[0]}, {building.coordinates[1]}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card>
              <CardHeader>
                <CardTitle>Facilities & Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {building.facilities.map((facility, index) => (
                    <Badge key={index} variant="outline" className="justify-center py-2">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="sm">
                  Get Directions
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Report Issue
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Share Location
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Upcoming Events</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900">{event.title}</h4>
                      <p className="text-sm text-blue-700 mt-1">{event.description}</p>
                      <div className="flex items-center space-x-1 mt-2 text-xs text-blue-600">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(event.startTime).toLocaleDateString()} at{' '}
                          {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full mt-2">
                        <Bell className="h-3 w-3 mr-1" />
                        Set Reminder
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildingDetailPage;
