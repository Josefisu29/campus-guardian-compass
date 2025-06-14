
import React from 'react';
import { Building } from '../data/afitBuildings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar, Image } from 'lucide-react';

interface BuildingPopupProps {
  building: Building;
  onViewDetails: (building: Building) => void;
  onGetDirections: (building: Building) => void;
  onClose: () => void;
}

const BuildingPopup = ({ building, onViewDetails, onGetDirections, onClose }: BuildingPopupProps) => {
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
  ).slice(0, 2) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
        <CardHeader className="relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <div className="flex items-center space-x-2 mb-2">
            <Badge className={getBuildingTypeColor(building.type)}>
              {building.type}
            </Badge>
            {building.capacity && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{building.capacity}</span>
              </Badge>
            )}
          </div>
          <CardTitle className="text-xl">{building.name}</CardTitle>
          <CardDescription>{building.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Building Image */}
          <div className="relative h-40 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={building.images[0]}
              alt={building.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            {building.images.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                <Image className="h-3 w-3" />
                <span>+{building.images.length - 1}</span>
              </div>
            )}
          </div>

          {/* Building Details */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-3 w-3" />
              <span>{building.coordinates[0]}, {building.coordinates[1]}</span>
            </div>
            {building.yearBuilt && (
              <p className="text-sm text-gray-600">Built in {building.yearBuilt}</p>
            )}
          </div>

          {/* Facilities */}
          {building.facilities.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2">Facilities</h4>
              <div className="flex flex-wrap gap-1">
                {building.facilities.map((facility, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {facility}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Upcoming Events</span>
              </h4>
              <div className="space-y-2">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-2 bg-blue-50 rounded text-xs">
                    <p className="font-medium text-blue-800">{event.title}</p>
                    <p className="text-blue-600">
                      {new Date(event.startTime).toLocaleDateString()} at{' '}
                      {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-2">
            <Button 
              onClick={() => onViewDetails(building)}
              className="flex-1"
              size="sm"
            >
              View Details
            </Button>
            <Button 
              onClick={() => onGetDirections(building)}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              Get Directions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BuildingPopup;
