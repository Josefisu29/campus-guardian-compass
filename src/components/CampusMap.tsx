
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, AlertTriangle, Shield, Navigation } from 'lucide-react';
import { afitBuildings, Building } from '../data/afitBuildings';
import BuildingPopup from './BuildingPopup';
import BuildingDetailPage from './BuildingDetailPage';

const CampusMap = ({ selectedLocation, userLocation, alerts, incidents }) => {
  const mapRef = useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [showBuildingDetail, setShowBuildingDetail] = useState(false);

  // AFIT Campus center coordinates (Kaduna, Nigeria)
  const AFIT_CENTER = { lat: 10.333674, lng: 7.749362 };

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
    console.log(`Getting directions to ${building.name} at coordinates:`, building.coordinates);
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

  // Convert lat/lng to screen position (simplified for demo)
  const getScreenPosition = (building: Building, index: number) => {
    // Calculate relative position based on AFIT center coordinates
    const latDiff = (building.coordinates[0] - AFIT_CENTER.lat) * 100000; // Scale factor for visibility
    const lngDiff = (building.coordinates[1] - AFIT_CENTER.lng) * 100000;
    
    return {
      left: `${50 + (lngDiff * 200)}%`, // Center + offset
      top: `${50 - (latDiff * 200)}%`   // Center + offset (inverted for screen coords)
    };
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
    <div className="relative h-96 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg overflow-hidden border">
      {/* Map Container with satellite-like background */}
      <div ref={mapRef} className="absolute inset-0">
        {/* Satellite view background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-green-100 to-blue-100">
          <div className="absolute inset-0 opacity-30">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="campus-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#059669" strokeWidth="0.5" opacity="0.3"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#campus-grid)" />
            </svg>
          </div>
        </div>

        {/* Campus Buildings with accurate positioning */}
        {afitBuildings.map((building, index) => {
          const position = getScreenPosition(building, index);
          
          return (
            <div
              key={building.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 hover:z-20 ${
                selectedBuilding?.id === building.id ? 'scale-125 z-30' : 'z-10'
              }`}
              style={position}
              onClick={() => handleBuildingClick(building)}
              title={`${building.name} - ${building.type}`}
            >
              <div className={`rounded-full p-2 shadow-lg border-2 transition-all ${getBuildingColor(building.type)} hover:shadow-xl`}>
                <span className="text-lg">{getBuildingIcon(building.type)}</span>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow-md text-xs font-medium whitespace-nowrap max-w-32 text-center border">
                {building.name}
              </div>
              {/* Event indicator */}
              {building.events && building.events.length > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow"></div>
              )}
            </div>
          );
        })}

        {/* User Location at AFIT center */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-40"
          style={{ left: '50%', top: '50%' }}
        >
          <div className="bg-blue-600 rounded-full p-3 shadow-lg animate-pulse border-2 border-white">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-blue-600 text-white px-3 py-1 rounded shadow text-xs font-medium whitespace-nowrap">
            You are here - AFIT Campus
          </div>
        </div>

        {/* Safety Alerts */}
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15"
            style={{
              left: `${40 + (index * 20)}%`,
              top: `${30 + (index * 15)}%`
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
              top: `${70 + (index * 10)}%`
            }}
          >
            <div className="bg-red-500 rounded-full p-2 shadow-lg">
              <AlertTriangle className="h-3 w-3 text-white" />
            </div>
          </div>
        ))}

        {/* Navigation Route if destination selected */}
        {selectedLocation && (
          <svg className="absolute inset-0 pointer-events-none z-5">
            <path
              d="M 50% 50% Q 30% 30% 70% 30%"
              stroke="#10B981"
              strokeWidth="3"
              fill="none"
              strokeDasharray="8,4"
              className="animate-pulse"
            />
            <path
              d="M 50% 50% Q 70% 70% 30% 70%"
              stroke="#3B82F6"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4,2"
              className="animate-pulse"
            />
          </svg>
        )}
      </div>

      {/* Enhanced Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 text-xs max-w-xs border">
        <h4 className="font-semibold mb-2 text-gray-800">AFIT Campus Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Your Location (Campus Center)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏛️</span>
            <span>Academic Buildings</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏠</span>
            <span>Residential Facilities</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏢</span>
            <span>Administrative</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏃‍♂️</span>
            <span>Recreation & Sports</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🔧</span>
            <span>Services & Facilities</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Active Events</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-green-500 rounded"></div>
            <span>Navigation Route</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t text-gray-600">
          <div className="text-xs">📍 AFIT Kaduna, Nigeria</div>
          <div className="text-xs">🗺️ {afitBuildings.length} Campus Locations</div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="bg-white/90 backdrop-blur-sm p-2 rounded shadow hover:bg-white transition-colors">
          <Navigation className="h-4 w-4 text-gray-700" />
        </button>
        <button className="bg-white/90 backdrop-blur-sm p-2 rounded shadow hover:bg-white transition-colors">
          🔍
        </button>
        <button className="bg-white/90 backdrop-blur-sm p-2 rounded shadow hover:bg-white transition-colors">
          🛰️
        </button>
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
