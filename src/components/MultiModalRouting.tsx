
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { MapPin, Clock, Car, Bike, PersonStanding, Bus } from 'lucide-react';

interface RouteOption {
  mode: 'walking' | 'biking' | 'driving' | 'shuttle';
  duration: string;
  distance: string;
  cost?: string;
  crowdLevel: 'low' | 'medium' | 'high';
}

const MultiModalRouting: React.FC = () => {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [selectedMode, setSelectedMode] = useState<string>('');

  const locations = [
    'Main Library',
    'Science Building',
    'Student Center',
    'Cafeteria',
    'Parking Lot A',
    'Gym',
    'Admin Building'
  ];

  const generateRoutes = () => {
    if (!fromLocation || !toLocation) return;

    const routes: RouteOption[] = [
      {
        mode: 'walking',
        duration: '8 min',
        distance: '0.6 miles',
        crowdLevel: 'low'
      },
      {
        mode: 'biking',
        duration: '3 min',
        distance: '0.6 miles',
        crowdLevel: 'low'
      },
      {
        mode: 'driving',
        duration: '5 min',
        distance: '0.8 miles',
        cost: 'Parking: $2/hr',
        crowdLevel: 'medium'
      },
      {
        mode: 'shuttle',
        duration: '12 min',
        distance: '1.2 miles',
        cost: 'Free',
        crowdLevel: 'high'
      }
    ];

    setRouteOptions(routes);
  };

  const getModeIcon = (mode: string) => {
    const icons = {
      walking: <PersonStanding className="h-5 w-5" />,
      biking: <Bike className="h-5 w-5" />,
      driving: <Car className="h-5 w-5" />,
      shuttle: <Bus className="h-5 w-5" />
    };
    return icons[mode as keyof typeof icons];
  };

  const getCrowdColor = (level: string) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600'
    };
    return colors[level as keyof typeof colors];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Multi-Modal Routing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">From:</label>
            <select
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select starting location...</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">To:</label>
            <select
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select destination...</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button onClick={generateRoutes} className="w-full">
          Find Routes
        </Button>

        {/* Route Options */}
        {routeOptions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Route Options:</h4>
            {routeOptions.map((route, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedMode === route.mode
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedMode(route.mode)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getModeIcon(route.mode)}
                    <div>
                      <p className="font-medium capitalize">{route.mode}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{route.duration}</span>
                        <MapPin className="h-4 w-4" />
                        <span>{route.distance}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {route.cost && (
                      <p className="text-sm text-gray-600">{route.cost}</p>
                    )}
                    <p className={`text-sm font-medium ${getCrowdColor(route.crowdLevel)}`}>
                      {route.crowdLevel} traffic
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Live Traffic Information */}
        {selectedMode && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Live Campus Traffic</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Main Walkway:</span>
                <span className="text-green-600">Light Traffic</span>
              </div>
              <div className="flex justify-between">
                <span>Parking Lot A:</span>
                <span className="text-red-600">Heavy Traffic</span>
              </div>
              <div className="flex justify-between">
                <span>Shuttle Route 1:</span>
                <span className="text-yellow-600">Moderate Delay</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MultiModalRouting;
