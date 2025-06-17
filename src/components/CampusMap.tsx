
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, AlertTriangle, Shield, Navigation } from 'lucide-react';
import { afitBuildings, Building, geofenceConfiguration } from '../data/afitBuildings';
import BuildingPopup from './BuildingPopup';
import BuildingDetailPage from './BuildingDetailPage';
import { useFirebase } from '../hooks/useFirebase';

const CampusMap = ({ selectedLocation, userLocation, alerts = [], incidents = [] }) => {
  const mapRef = useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [showBuildingDetail, setShowBuildingDetail] = useState(false);
  const { alerts: firebaseAlerts, incidents: firebaseIncidents } = useFirebase();

  // Use dynamic AFIT campus center from geofence config
  const AFIT_CENTER = { 
    lat: geofenceConfiguration.center.latitude, 
    lng: geofenceConfiguration.center.longitude 
  };

  // Combine prop alerts with Firebase alerts
  const allAlerts = [...alerts, ...firebaseAlerts];
  const allIncidents = [...incidents, ...firebaseIncidents];

  useEffect(() => {
    if (!mapRef.current || mapInitialized) return;
    setMapInitialized(true);
    console.log('Map initialized with AFIT center:', AFIT_CENTER);
    console.log('Total buildings loaded:', afitBuildings.length);
  }, [mapInitialized]);

  const handleBuildingClick = (building: Building) => {
    setSelectedBuilding(building);
    console.log('Building selected:', building.name, 'at coordinates:', building.coordinates);
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

  // Convert exact lat/lng coordinates to screen position with proper scaling
  const getScreenPosition = (building: Building) => {
    const latDiff = (building.coordinates[0] - AFIT_CENTER.lat) * 10000; // Adjusted scale for AFIT campus
    const lngDiff = (building.coordinates[1] - AFIT_CENTER.lng) * 10000;
    
    return {
      left: `${50 + (lngDiff * 300)}%`, // Enhanced scaling for better visibility
      top: `${50 - (latDiff * 300)}%`   // Enhanced scaling for better visibility
    };
  };

  // Position alerts using real coordinates
  const getAlertPosition = (alert, index) => {
    if (alert.coords) {
      const latDiff = (alert.coords[0] - AFIT_CENTER.lat) * 10000;
      const lngDiff = (alert.coords[1] - AFIT_CENTER.lng) * 10000;
      return {
        left: `${50 + (lngDiff * 300)}%`,
        top: `${50 - (latDiff * 300)}%`
      };
    }
    // Fallback positioning for alerts without coordinates
    return {
      left: `${40 + (index * 20)}%`,
      top: `${30 + (index * 15)}%`
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
        {/* Satellite view background with geofence rings */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-green-100 to-blue-100">
          {/* Geofence rings visualization */}
          {geofenceConfiguration.radii.map((radius, index) => (
            <div
              key={index}
              className="absolute rounded-full border-2 opacity-40"
              style={{
                width: `${20 + index * 25}%`,
                height: `${20 + index * 25}%`,
                borderColor: index === 0 ? '#3B82F6' : index === 1 ? '#10B981' : index === 2 ? '#F59E0B' : '#EF4444',
                backgroundColor: `${index === 0 ? '#3B82F6' : index === 1 ? '#10B981' : index === 2 ? '#F59E0B' : '#EF4444'}20`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div 
                className="absolute top-2 left-2 px-2 py-1 bg-white rounded text-xs font-medium shadow"
                style={{ color: index === 0 ? '#3B82F6' : index === 1 ? '#10B981' : index === 2 ? '#F59E0B' : '#EF4444' }}
              >
                {radius}m
              </div>
            </div>
          ))}
          
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

        {/* Campus Buildings with exact positioning */}
        {afitBuildings.map((building) => {
          const position = getScreenPosition(building);
          
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

        {/* Real-time Safety Alerts */}
        {allAlerts.map((alert, index) => (
          <div
            key={`alert-${index}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15"
            style={getAlertPosition(alert, index)}
          >
            <div className="bg-yellow-500 rounded-full p-2 shadow-lg animate-bounce">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-yellow-500 text-white px-2 py-1 rounded shadow text-xs font-medium whitespace-nowrap">
              {alert.message || 'Safety Alert'}
            </div>
          </div>
        ))}

        {/* Real-time Incident Reports */}
        {allIncidents.map((incident, index) => (
          <div
            key={`incident-${index}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-15"
            style={getAlertPosition(incident, index)}
          >
            <div className="bg-red-500 rounded-full p-2 shadow-lg">
              <AlertTriangle className="h-3 w-3 text-white" />
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-red-500 text-white px-2 py-1 rounded shadow text-xs font-medium whitespace-nowrap">
              {incident.title || 'Incident Report'}
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
          </svg>
        )}
      </div>

      {/* Enhanced Map Legend with real data */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 text-xs max-w-xs border">
        <h4 className="font-semibold mb-2 text-gray-800">AFIT Campus Navigator</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏛️</span>
            <span>Academic ({afitBuildings.filter(b => b.type === 'academic').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏠</span>
            <span>Residential ({afitBuildings.filter(b => b.type === 'residential').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏢</span>
            <span>Administrative ({afitBuildings.filter(b => b.type === 'administrative').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🏃‍♂️</span>
            <span>Recreation ({afitBuildings.filter(b => b.type === 'recreational').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🔧</span>
            <span>Services ({afitBuildings.filter(b => b.type === 'service').length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Live Alerts ({allAlerts.length})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Incidents ({allIncidents.length})</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t text-gray-600">
          <div className="text-xs">📍 {AFIT_CENTER.lat}, {AFIT_CENTER.lng}</div>
          <div className="text-xs">🗺️ {afitBuildings.length} Campus Locations</div>
          <div className="text-xs">🔄 Real-time Firebase Data</div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="bg-white/90 backdrop-blur-sm p-2 rounded shadow hover:bg-white transition-colors" title="Center on Campus">
          <Navigation className="h-4 w-4 text-gray-700" />
        </button>
        <button className="bg-white/90 backdrop-blur-sm p-2 rounded shadow hover:bg-white transition-colors" title="Zoom">
          🔍
        </button>
        <button className="bg-white/90 backdrop-blur-sm p-2 rounded shadow hover:bg-white transition-colors" title="Satellite View">
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
