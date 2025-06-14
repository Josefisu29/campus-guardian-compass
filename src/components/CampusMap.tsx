import React, { useEffect, useRef, useState } from 'react';
import { MapPin, AlertTriangle, Shield } from 'lucide-react';
import { afitBuildings, Building } from '../data/afitBuildings';
import BuildingPopup from './BuildingPopup';
import BuildingDetailPage from './BuildingDetailPage';

const CampusMap = ({ selectedLocation, userLocation, alerts, incidents }) => {
  const mapRef = useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [showBuildingDetail, setShowBuildingDetail] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInitialized) return;
    setMapInitialized(true);
  }, [mapInitialized]);

  const handleBuildingClick = (building: Building) => {
    setSelectedBuilding(building);
  };

  const handleViewDetails = (building: Building) => {
    setSelectedBuilding(building);
    setShowBuildingDetail(true);
  };

  const handleGetDirections = (building: Building) => {
    // In a real implementation, this would integrate with navigation
    console.log(`Getting directions to ${building.name}`);
    setSelectedBuilding(null);
  };

  const getBuildingIcon = (type: string) => {
    const icons = {
      academic: '🏛️',
      residential: '🏠',
      administrative: '🏢',
      recreational: '🏃‍♂️',
      service: '🔧'
    };
    return icons[type] || '📍';
  };

  const getBuildingColor = (type: string) => {
    const colors = {
      academic: 'border-blue-500 bg-blue-100',
      residential: 'border-green-500 bg-green-100',
      administrative: 'border-purple-500 bg-purple-100',
      recreational: 'border-orange-500 bg-orange-100',
      service: 'border-gray-500 bg-gray-100'
    };
    return colors[type] || 'border-gray-500 bg-gray-100';
  };

  if (showBuildingDetail && selectedBuilding) {
    return (
      <BuildingDetailPage
        building={selectedBuilding}
        onBack={() => {
          setShowBuildingDetail(false);
          setSelectedBuilding(null);
        }}
      />
    );
  }

  return (
    <div className="relative h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden">
      {/* Map Container */}
      <div ref={mapRef} className="absolute inset-0">
        {/* Campus Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3B82F6" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* AFIT Buildings */}
        {afitBuildings.map((building, index) => (
          <div
            key={building.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 ${
              selectedBuilding?.id === building.id ? 'scale-125 z-10' : ''
            }`}
            style={{
              left: `${20 + (index * 15)}%`,
              top: `${25 + (index * 12)}%`
            }}
            onClick={() => handleBuildingClick(building)}
          >
            <div className={`rounded-full p-3 shadow-lg border-2 ${getBuildingColor(building.type)}`}>
              <span className="text-2xl">{getBuildingIcon(building.type)}</span>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow text-xs font-medium whitespace-nowrap">
              {building.name}
            </div>
            {/* Event indicator */}
            {building.events && building.events.length > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            )}
          </div>
        ))}

        {/* Legacy campus locations for backward compatibility */}
        {/* Sample campus locations */}
        {/* {campusLocations.map((location) => (
          <div
            key={location.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 ${
              selectedLocation?.id === location.id ? 'scale-125 z-10' : ''
            }`}
            style={{
              left: `${20 + (location.id * 15)}%`,
              top: `${30 + (location.id * 8)}%`
            }}
          >
            <div className="bg-white rounded-full p-3 shadow-lg border-2 border-blue-500">
              <span className="text-2xl">{getLocationIcon(location.type)}</span>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow text-xs font-medium whitespace-nowrap">
              {location.name}
            </div>
          </div>
        ))} */}

        {/* User Location */}
        {userLocation && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ left: '15%', top: '25%' }}
          >
            <div className="bg-blue-600 rounded-full p-2 shadow-lg animate-pulse">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-blue-600 text-white px-2 py-1 rounded shadow text-xs font-medium">
              You are here
            </div>
          </div>
        )}

        {/* Safety Alerts */}
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15"
            style={{
              left: `${40 + (index * 20)}%`,
              top: `${50 + (index * 10)}%`
            }}
          >
            <div className="bg-yellow-500 rounded-full p-2 shadow-lg animate-bounce">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
          </div>
        ))}

        {/* Incident Reports */}
        {incidents.map((incident, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15"
            style={{
              left: `${60 + (index * 15)}%`,
              top: `${40 + (index * 12)}%`
            }}
          >
            <div className="bg-red-500 rounded-full p-2 shadow-lg">
              <AlertTriangle className="h-3 w-3 text-white" />
            </div>
          </div>
        ))}

        {/* Safe Route Indicator */}
        {selectedLocation && (
          <svg className="absolute inset-0 pointer-events-none">
            <path
              d="M 15% 25% Q 30% 15% 50% 35%"
              stroke="#10B981"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
          </svg>
        )}
      </div>

      {/* Enhanced Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs max-w-xs">
        <h4 className="font-semibold mb-2">AFIT Campus Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏛️</span>
            <span>Academic Buildings</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏠</span>
            <span>Residential (Alfa Hall)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏃‍♂️</span>
            <span>Recreation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Event Indicator</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-1 bg-green-500 rounded"></div>
            <span>Safe Route</span>
          </div>
        </div>
      </div>

      {/* Building Popup */}
      {selectedBuilding && !showBuildingDetail && (
        <BuildingPopup
          building={selectedBuilding}
          onViewDetails={handleViewDetails}
          onGetDirections={handleGetDirections}
          onClose={() => setSelectedBuilding(null)}
        />
      )}
    </div>
  );
};

export default CampusMap;
