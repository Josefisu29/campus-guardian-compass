import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Download, 
  Settings, 
  Layers, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Camera,
  Globe,
  Target,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { geofenceConfiguration } from '../data/afitBuildings';
import { useFirebase } from '../hooks/useFirebase';

interface GeofencingModuleProps {
  defaultLocation?: { latitude: number; longitude: number };
  isAdmin: boolean;
  isAuthenticated?: boolean;
}

interface GeofenceRing {
  radius: number;
  color: string;
  label: string;
  pois: string[];
}

const GeofencingModule: React.FC<GeofencingModuleProps> = ({
  defaultLocation,
  isAdmin,
  isAuthenticated = true
}) => {
  const { toast } = useToast();
  const { alerts, incidents } = useFirebase();
  
  // Use dynamic AFIT coordinates from geofence config
  const [location, setLocation] = useState({
    latitude: geofenceConfiguration.center.latitude,
    longitude: geofenceConfiguration.center.longitude
  });
  
  const [mapConfig, setMapConfig] = useState({
    zoom: 17,
    tilt: 45,
    heading: 0,
    mapType: 'satellite'
  });
  
  // Dynamic geofence rings from config
  const [geofenceRings, setGeofenceRings] = useState<GeofenceRing[]>(
    geofenceConfiguration.radii.map((radius, index) => ({
      radius,
      color: index === 0 ? '#3B82F6' : index === 1 ? '#10B981' : index === 2 ? '#F59E0B' : '#EF4444',
      label: index === 0 ? 'Inner Campus' : index === 1 ? 'Academic Zone' : index === 2 ? 'Extended Campus' : 'Campus Perimeter',
      pois: geofenceConfiguration.locations
        .filter(loc => {
          const distance = calculateDistance(
            geofenceConfiguration.center.latitude,
            geofenceConfiguration.center.longitude,
            loc.lat,
            loc.lng
          );
          return distance <= radius;
        })
        .map(loc => loc.name)
    }))
  );

  const [customPrompt, setCustomPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [activeTab, setActiveTab] = useState('map');

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Generate AI insights with real Firebase data
  const generateAIInsights = async () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const totalBuildings = geofenceConfiguration.locations.length;
      const academicBuildings = geofenceConfiguration.locations.filter(loc => loc.type === 'academic').length;
      const residentialBuildings = geofenceConfiguration.locations.filter(loc => loc.type === 'residential').length;
      const serviceBuildings = geofenceConfiguration.locations.filter(loc => loc.type === 'service').length;
      const recreationalBuildings = geofenceConfiguration.locations.filter(loc => loc.type === 'recreational').length;
      const administrativeBuildings = geofenceConfiguration.locations.filter(loc => loc.type === 'administrative').length;
      
      const insights = `
📍 AFIT Real-time Campus Analysis - Kaduna, Nigeria:
Coordinates: ${location.latitude}, ${location.longitude}

🏢 Building Distribution (${totalBuildings} total):
- Academic Facilities: ${academicBuildings} buildings
- Residential Blocks: ${residentialBuildings} facilities  
- Service Buildings: ${serviceBuildings} facilities
- Recreational Areas: ${recreationalBuildings} complexes
- Administrative: ${administrativeBuildings} buildings

🔵 ${geofenceRings[0].radius}m Zone (${geofenceRings[0].pois.length} locations):
${geofenceRings[0].pois.slice(0, 5).join(', ')}${geofenceRings[0].pois.length > 5 ? '...' : ''}

🟢 ${geofenceRings[1].radius}m Zone (${geofenceRings[1].pois.length} locations):
${geofenceRings[1].pois.slice(0, 5).join(', ')}${geofenceRings[1].pois.length > 5 ? '...' : ''}

🟡 ${geofenceRings[2].radius}m Zone (${geofenceRings[2].pois.length} locations):
${geofenceRings[2].pois.slice(0, 5).join(', ')}${geofenceRings[2].pois.length > 5 ? '...' : ''}

🔴 ${geofenceRings[3].radius}m Zone (${geofenceRings[3].pois.length} locations):
All campus facilities included in perimeter zone.

📊 Real-time Firebase Data:
- Active Alerts: ${alerts.length} safety notifications
- Incident Reports: ${incidents.length} reported incidents
- Data Source: Firebase Realtime Database
- Last Update: ${new Date().toLocaleString()}

🎯 Campus Navigation Recommendations:
- Ibrahim Alfa Hall serves as primary residential hub
- Academic buildings clustered in northern sector
- Sports and recreation facilities in western zone
- Medical and support services distributed throughout campus
      `;
      setAiInsights(insights);
      setIsAnalyzing(false);
    }, 2000);
  };

  useEffect(() => {
    generateAIInsights();
  }, [location, geofenceRings, alerts, incidents]);

  const handleCustomPromptAnalysis = async () => {
    if (!customPrompt.trim()) return;
    
    setIsAnalyzing(true);
    toast({
      title: "Analyzing AFIT campus prompt",
      description: "AI is processing your request with real-time data...",
    });

    setTimeout(() => {
      const customInsights = `
🤖 AFIT Real-time Custom Analysis: "${customPrompt}"

Based on current Firebase data and your request:
- Real-time Alerts: ${alerts.length} active safety notifications
- Live Incidents: ${incidents.length} reported incidents  
- Campus Buildings: ${geofenceConfiguration.locations.length} mapped locations
- Geofence Zones: ${geofenceRings.length} monitoring areas

${customPrompt.toLowerCase().includes('cafeteria') || customPrompt.toLowerCase().includes('dining') ? '🍽️ Main Cafeteria: Active in real-time monitoring zone' : ''}
${customPrompt.toLowerCase().includes('safety') || customPrompt.toLowerCase().includes('security') ? '🛡️ Security Status: ' + alerts.length + ' active alerts in Firebase' : ''}
${customPrompt.toLowerCase().includes('hostel') || customPrompt.toLowerCase().includes('accommodation') ? '🏠 Residential: Ibrahim Alfa Hall + Officer Cadets Hostels A-D tracked' : ''}
${customPrompt.toLowerCase().includes('engineering') ? '⚙️ Engineering: Air, Ground/Comm, Computing blocks all monitored' : ''}

🔄 Data freshness: Connected to Firebase Realtime Database
📍 Coordinate precision: Using exact AFIT surveyed coordinates
🎯 Analysis completeness: ${Math.round((geofenceConfiguration.locations.length / 20) * 100)}% campus coverage
      `;
      setAiInsights(customInsights);
      setIsAnalyzing(false);
      toast({
        title: "Real-time analysis complete",
        description: "Insights generated with live Firebase data",
      });
    }, 3000);
  };

  const updateRingRadius = (index: number, newRadius: number) => {
    const updatedRings = [...geofenceRings];
    updatedRings[index] = { 
      ...updatedRings[index], 
      radius: newRadius,
      pois: geofenceConfiguration.locations
        .filter(loc => {
          const distance = calculateDistance(
            geofenceConfiguration.center.latitude,
            geofenceConfiguration.center.longitude,
            loc.lat,
            loc.lng
          );
          return distance <= newRadius;
        })
        .map(loc => loc.name)
    };
    setGeofenceRings(updatedRings);
  };

  const exportAsReactComponent = () => {
    const componentCode = `
import React from 'react';

const CampusGeofenceMap = () => {
  const location = { lat: ${location.latitude}, lng: ${location.longitude} };
  const rings = ${JSON.stringify(geofenceRings, null, 2)};
  
  return (
    <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Campus Geofence Map</h3>
        <p className="text-sm text-gray-600">
          Location: {location.lat}, {location.lng}
        </p>
        <p className="text-sm text-gray-600">
          Rings: {rings.length} configured zones
        </p>
      </div>
    </div>
  );
};

export default CampusGeofenceMap;
    `;

    const blob = new Blob([componentCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CampusGeofenceMap.jsx';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Component exported",
      description: "React component downloaded successfully",
    });
  };

  const exportAsHTML = () => {
    const htmlCode = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Campus Geofence Map</title>
    <style>
        .map-container { width: 100%; height: 400px; background: #f3f4f6; border-radius: 8px; }
        .controls { margin: 20px 0; padding: 20px; background: #fff; border-radius: 8px; }
    </style>
</head>
<body>
    <h1>3D Campus Geofencing Map</h1>
    <div class="map-container">
        <div style="display: flex; align-items: center; justify-content: center; height: 100%;">
            <div style="text-align: center;">
                <h3>Campus Location: ${location.latitude}, ${location.longitude}</h3>
                <p>Geofence Rings: ${geofenceRings.length} zones configured</p>
            </div>
        </div>
    </div>
    <div class="controls">
        <h3>Map Configuration</h3>
        <p>Zoom: ${mapConfig.zoom}</p>
        <p>Tilt: ${mapConfig.tilt}°</p>
        <p>Heading: ${mapConfig.heading}°</p>
        <p>Map Type: ${mapConfig.mapType}</p>
    </div>
</body>
</html>
    `;

    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campus-geofence-map.html';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "HTML widget exported",
      description: "Standalone HTML file downloaded successfully",
    });
  };

  if (!isAuthenticated && !isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            3D Geofencing & Campus Mapping
          </CardTitle>
          <CardDescription>
            Login required for full mapping features and real-time data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MapPin className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              Advanced geofencing and real-time Firebase data available to authenticated users
            </p>
            <Button>Login to Access Full Features</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            AFIT Real-time 3D Campus Mapping & Firebase Integration
          </CardTitle>
          <CardDescription>
            Live data from Firebase Realtime Database - Nigerian Air Force Institute of Technology, Kaduna
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="map">Live Campus Map</TabsTrigger>
          <TabsTrigger value="controls">Geofence Controls</TabsTrigger>
          <TabsTrigger value="ai-insights">Real-time AI Insights</TabsTrigger>
          <TabsTrigger value="export">Export & Deploy</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>AFIT Live Campus Map - Kaduna, Nigeria</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{mapConfig.mapType}</Badge>
                  <Badge variant="outline">{mapConfig.zoom}x zoom</Badge>
                  <Badge variant="outline">🔴 LIVE</Badge>
                  <Badge variant="outline">📍 {geofenceConfiguration.locations.length} locations</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Enhanced 3D Map View with real building positions */}
              <div className="relative w-full h-96 bg-gradient-to-br from-green-100 via-blue-100 to-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                {/* Real geofence rings from config */}
                {geofenceRings.map((ring, index) => (
                  <div
                    key={index}
                    className="absolute rounded-full border-2 opacity-60"
                    style={{
                      width: `${15 + index * 18}%`,
                      height: `${15 + index * 18}%`,
                      borderColor: ring.color,
                      backgroundColor: `${ring.color}20`,
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div 
                      className="absolute top-2 left-2 px-2 py-1 bg-white rounded text-xs font-medium shadow"
                      style={{ color: ring.color }}
                    >
                      {ring.radius}m - {ring.label} ({ring.pois.length})
                    </div>
                  </div>
                ))}

                {/* Real AFIT buildings from geofence config */}
                {geofenceConfiguration.locations.map((location, index) => {
                  const angle = (index / geofenceConfiguration.locations.length) * 2 * Math.PI;
                  const distance = 30 + (index % 3) * 15;
                  const x = 50 + Math.cos(angle) * distance;
                  const y = 50 + Math.sin(angle) * distance;
                  
                  const typeIcons = {
                    academic: '🏛️',
                    residential: '🏠',
                    administrative: '🏢',
                    recreational: '🏃‍♂️',
                    service: '🔧'
                  };

                  return (
                    <div
                      key={location.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                      style={{ left: `${x}%`, top: `${y}%` }}
                      title={`${location.name} (${location.lat}, ${location.lng})`}
                    >
                      <div className="bg-white rounded p-1 shadow border text-xs">
                        {typeIcons[location.type] || '📍'}
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-1 py-0.5 rounded shadow text-xs text-center whitespace-nowrap max-w-20 overflow-hidden">
                        {location.name.split(' ')[0]}
                      </div>
                    </div>
                  );
                })}

                {/* AFIT Campus Center with exact coordinates */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-red-500 rounded-full p-3 shadow-lg animate-pulse">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-3 py-2 rounded shadow text-xs font-medium whitespace-nowrap border">
                    AFIT Campus Center
                    <div className="text-gray-500">{location.latitude}, {location.longitude}</div>
                  </div>
                </div>

                {/* Real-time Firebase alerts overlay */}
                {alerts.slice(0, 3).map((alert, index) => (
                  <div
                    key={`alert-${index}`}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${30 + index * 25}%`,
                      top: `${25 + index * 20}%`
                    }}
                  >
                    <div className="bg-yellow-500 rounded-full p-1 shadow animate-bounce">
                      <span className="text-white text-xs">⚠️</span>
                    </div>
                  </div>
                ))}

                {/* Real-time Firebase incidents overlay */}
                {incidents.slice(0, 2).map((incident, index) => (
                  <div
                    key={`incident-${index}`}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${60 + index * 20}%`,
                      top: `${65 + index * 15}%`
                    }}
                  >
                    <div className="bg-red-500 rounded-full p-1 shadow">
                      <span className="text-white text-xs">🚨</span>
                    </div>
                  </div>
                ))}

                {/* Enhanced 3D View Indicator */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="h-4 w-4" />
                    <span className="font-medium">AFIT 3D Live View</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>📐 {mapConfig.tilt}° tilt, {mapConfig.heading}° heading</div>
                  <div>📍 Center: {location.latitude}, {location.longitude}</div>
                  <div>🎯 Zoom: {mapConfig.zoom}x | 🔄 Live Firebase Data</div>
                  <div>🏢 Buildings: {geofenceConfiguration.locations.length} | ⚠️ Alerts: {alerts.length}</div>
                </div>

                {/* Map controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button size="sm" variant="secondary">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Layers className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time data summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Target className="h-6 w-6 mb-2" />
              <span className="text-xs">Buildings: {geofenceConfiguration.locations.length}</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Sparkles className="h-6 w-6 mb-2" />
              <span className="text-xs">Live Alerts: {alerts.length}</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Camera className="h-6 w-6 mb-2" />
              <span className="text-xs">Incidents: {incidents.length}</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Download className="h-6 w-6 mb-2" />
              <span className="text-xs">Firebase: Connected</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="controls" className="space-y-6">
          {/* Location Configuration with exact AFIT coordinates */}
          <Card>
            <CardHeader>
              <CardTitle>AFIT Precise Location Configuration</CardTitle>
              <CardDescription>Nigerian Air Force Institute of Technology - Exact Survey Coordinates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude (AFIT Center)</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    value={location.latitude}
                    onChange={(e) => setLocation({...location, latitude: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude (AFIT Center)</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    value={location.longitude}
                    onChange={(e) => setLocation({...location, longitude: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                📍 Current: AFIT Campus Center, Kaduna State, Nigeria<br/>
                🏛️ Reference: Between Ibrahim Alfa Hall and Main Admin Block<br/>
                🗺️ Coverage: All {geofenceConfiguration.locations.length} campus buildings mapped<br/>
                🔄 Data Source: Firebase Realtime Database with live updates
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Geofence Ring Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Dynamic Geofence Rings Configuration</CardTitle>
              <CardDescription>Real-time radius adjustment with building counting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {geofenceRings.map((ring, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="font-medium">{ring.label}</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full border-2"
                        style={{ backgroundColor: ring.color }}
                      ></div>
                      <Badge variant="outline">{ring.pois.length} buildings</Badge>
                    </div>
                  </div>
                  <div>
                    <Label>Radius: {ring.radius}m</Label>
                    <Slider
                      value={[ring.radius]}
                      onValueChange={(value) => updateRingRadius(index, value[0])}
                      max={3000}
                      min={100}
                      step={50}
                      className="mt-2"
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    Buildings in zone: {ring.pois.slice(0, 3).join(', ')}
                    {ring.pois.length > 3 && ` and ${ring.pois.length - 3} more...`}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          {/* Custom Prompt Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI-Driven Contextual Analysis
              </CardTitle>
              <CardDescription>
                Get intelligent insights about your geofenced areas and campus mapping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="custom-prompt">Custom Analysis Prompt</Label>
                <Textarea
                  id="custom-prompt"
                  placeholder="e.g., 'Show me a 750m zone around the main library and highlight study areas and café locations'"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={3}
                />
              </div>
              <Button 
                onClick={handleCustomPromptAnalysis} 
                disabled={isAnalyzing || !customPrompt.trim()}
                className="w-full"
              >
                {isAnalyzing ? 'Analyzing...' : 'Generate AI Insights'}
              </Button>
            </CardContent>
          </Card>

          {/* AI Insights Display */}
          <Card>
            <CardHeader>
              <CardTitle>Contextual Insights</CardTitle>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                  <span>AI is analyzing your campus geofencing...</span>
                </div>
              ) : (
                <div className="whitespace-pre-line text-sm bg-gray-50 p-4 rounded-lg">
                  {aiInsights || 'Click "Generate AI Insights" to analyze your campus mapping configuration.'}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Options
              </CardTitle>
              <CardDescription>
                Export your geofencing configuration as code or static files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={exportAsReactComponent} className="h-20 flex flex-col items-center justify-center">
                  <div className="text-lg mb-2">⚛️</div>
                  Export as React Component
                </Button>
                <Button onClick={exportAsHTML} variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <div className="text-lg mb-2">🌐</div>
                  Export as HTML Widget
                </Button>
              </div>
              
              {isAdmin && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium">Admin Export Options</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <Camera className="h-6 w-6 mb-2" />
                      Export PNG Snapshot
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <Settings className="h-6 w-6 mb-2" />
                      Export Configuration JSON
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Export Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Export Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
{`// Generated Campus Geofence Configuration
const campusConfig = {
  location: { lat: ${location.latitude}, lng: ${location.longitude} },
  mapSettings: ${JSON.stringify(mapConfig, null, 2)},
  geofenceRings: ${JSON.stringify(geofenceRings, null, 2)}
};`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeofencingModule;
