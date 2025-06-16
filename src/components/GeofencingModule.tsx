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

interface GeofencingModuleProps {
  defaultLocation: { latitude: number; longitude: number };
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
  // Set correct AFIT coordinates
  const [location, setLocation] = useState({
    latitude: 10.333674, // AFIT center coordinates
    longitude: 7.749362
  });
  const [mapConfig, setMapConfig] = useState({
    zoom: 17, // Higher zoom for campus view
    tilt: 45,
    heading: 0,
    mapType: 'satellite'
  });
  const [geofenceRings, setGeofenceRings] = useState<GeofenceRing[]>([
    { radius: 500, color: '#3B82F6', label: 'Inner Campus', pois: [] },
    { radius: 1000, color: '#10B981', label: 'Academic Zone', pois: [] },
    { radius: 1500, color: '#F59E0B', label: 'Extended Campus', pois: [] },
    { radius: 2000, color: '#EF4444', label: 'Campus Perimeter', pois: [] }
  ]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [activeTab, setActiveTab] = useState('map');

  // Simulate map initialization
  useEffect(() => {
    generateAIInsights();
  }, [location, geofenceRings]);

  const generateAIInsights = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis of geofence areas for AFIT campus
    setTimeout(() => {
      const insights = `
📍 AFIT Campus Analysis (Kaduna, Nigeria) - ${location.latitude}, ${location.longitude}:

🔵 500m Zone: Core academic facilities including Ibrahim Alfa Hall, Main Admin Block, Lecture Theatre Complex, and AFIT Library. High cadet activity zone with primary teaching facilities.

🟢 1000m Zone: Extended campus including Air Engineering Block, Computing Block, Sports Stadium, and Officer Cadets Hostels. Secondary academic buildings and major recreational facilities.

🟡 1500m Zone: Campus periphery including Faculty of Sciences, Ground & Communications Engineering, Medical Clinic, and Fitness Centre. Specialized facilities and support services.

🔴 2000m Zone: Full campus boundary including Guest House, NAF Hospital (adjacent), Chapel, and Main Cafeteria. Complete campus perimeter with all AFIT facilities.

🏢 Academic Distribution: 
- Engineering blocks concentrated in northern sector
- Residential facilities in central-eastern area  
- Administrative and service buildings in southern sector
- Sports and recreation in western zone

⚠️ Security Recommendations: 
- Primary monitoring on main campus roads and cadet movement routes
- Focus on areas between residential and academic blocks during peak hours
- Enhanced coverage around main gates and administrative areas

🎯 Campus Navigation Insights:
- Ibrahim Alfa Hall serves as central reference point
- Main pedestrian routes connect academic blocks efficiently  
- Vehicle access primarily through southern entrance
- Emergency routes established to medical facilities
      `;
      setAiInsights(insights);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleCustomPromptAnalysis = async () => {
    if (!customPrompt.trim()) return;
    
    setIsAnalyzing(true);
    toast({
      title: "Analyzing AFIT campus prompt",
      description: "AI is processing your request for AFIT Kaduna...",
    });

    // Simulate custom AI analysis for AFIT
    setTimeout(() => {
      const customInsights = `
🤖 AFIT Campus Custom Analysis: "${customPrompt}"

Based on your request for AFIT Kaduna campus:
- Adjusted geofence radii to optimize for AFIT's specific layout and size
- Identified relevant campus facilities within your specified criteria
- Generated contextual recommendations for AFIT navigation and operations
- Provided actionable insights specific to Nigerian Air Force Academy environment

${customPrompt.toLowerCase().includes('cafeteria') || customPrompt.toLowerCase().includes('dining') ? '🍽️ Main Cafeteria/Dining Hall location prioritized in analysis' : ''}
${customPrompt.toLowerCase().includes('safety') || customPrompt.toLowerCase().includes('security') ? '🛡️ Campus security considerations and emergency protocols highlighted' : ''}
${customPrompt.toLowerCase().includes('parking') || customPrompt.toLowerCase().includes('vehicle') ? '🚗 Vehicle access routes and parking areas near Guest House analyzed' : ''}
${customPrompt.toLowerCase().includes('hostel') || customPrompt.toLowerCase().includes('accommodation') ? '🏠 Cadet accommodation blocks and residential facilities mapped' : ''}
${customPrompt.toLowerCase().includes('engineering') ? '⚙️ Engineering facilities (Air, Ground, Computing) distribution analyzed' : ''}
${customPrompt.toLowerCase().includes('library') || customPrompt.toLowerCase().includes('study') ? '📚 AFIT Library and study areas accessibility reviewed' : ''}
      `;
      setAiInsights(customInsights);
      setIsAnalyzing(false);
      toast({
        title: "AFIT analysis complete",
        description: "Custom insights generated for AFIT campus",
      });
    }, 3000);
  };

  const updateRingRadius = (index: number, newRadius: number) => {
    const updatedRings = [...geofenceRings];
    updatedRings[index] = { ...updatedRings[index], radius: newRadius };
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
            Login required for full mapping features and customization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MapPin className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              Advanced geofencing and 3D mapping features are available to authenticated users
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
            AFIT 3D Geofencing & Campus Mapping Module
          </CardTitle>
          <CardDescription>
            Advanced interactive mapping for Nigerian Air Force Institute of Technology (AFIT) Kaduna
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="map">AFIT Campus Map</TabsTrigger>
          <TabsTrigger value="controls">Map Controls</TabsTrigger>
          <TabsTrigger value="ai-insights">Campus AI Insights</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-6">
          {/* Main Map Display for AFIT */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>AFIT Campus Map - Kaduna, Nigeria</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{mapConfig.mapType}</Badge>
                  <Badge variant="outline">{mapConfig.zoom}x zoom</Badge>
                  <Badge variant="outline">📍 AFIT</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Simulated 3D Map View for AFIT Campus */}
              <div className="relative w-full h-96 bg-gradient-to-br from-green-100 via-blue-100 to-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                {/* AFIT Campus Grid Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="afit-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#059669" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#afit-grid)" />
                  </svg>
                </div>

                {/* Geofence Rings Visualization for AFIT */}
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
                      {ring.radius}m - {ring.label}
                    </div>
                  </div>
                ))}

                {/* AFIT Campus Center Marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-red-500 rounded-full p-3 shadow-lg animate-pulse">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-3 py-2 rounded shadow text-xs font-medium whitespace-nowrap border">
                    AFIT Campus Center
                    <div className="text-gray-500">Ibrahim Alfa Hall Area</div>
                  </div>
                </div>

                {/* Sample AFIT Buildings */}
                <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-blue-500 rounded p-1 shadow text-white text-xs">🏛️</div>
                  <div className="text-xs mt-1 text-center">Academic</div>
                </div>
                <div className="absolute top-2/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-green-500 rounded p-1 shadow text-white text-xs">🏠</div>
                  <div className="text-xs mt-1 text-center">Hostels</div>
                </div>
                <div className="absolute bottom-1/4 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-orange-500 rounded p-1 shadow text-white text-xs">🏃‍♂️</div>
                  <div className="text-xs mt-1 text-center">Stadium</div>
                </div>

                {/* Map Controls Overlay */}
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

                {/* AFIT 3D View Indicator */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="h-4 w-4" />
                    <span className="font-medium">AFIT 3D Campus View</span>
                  </div>
                  <div>📐 {mapConfig.tilt}° tilt, {mapConfig.heading}° heading</div>
                  <div>📍 Coordinates: {location.latitude}, {location.longitude}</div>
                  <div>🎯 Zoom: {mapConfig.zoom}x (Campus Level)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Target className="h-6 w-6 mb-2" />
              Center on Campus
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Sparkles className="h-6 w-6 mb-2" />
              AI Analysis
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Camera className="h-6 w-6 mb-2" />
              Snapshot
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Download className="h-6 w-6 mb-2" />
              Export
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="controls" className="space-y-6">
          {/* Location Configuration for AFIT */}
          <Card>
            <CardHeader>
              <CardTitle>AFIT Campus Location Configuration</CardTitle>
              <CardDescription>Nigerian Air Force Institute of Technology, Kaduna</CardDescription>
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
                📍 Current: AFIT Campus, Kaduna State, Nigeria<br/>
                🏛️ Reference: Ibrahim Alfa Hall (Main Residential Area)<br/>
                🗺️ Coverage: Full campus including all academic, residential, and service buildings
              </div>
            </CardContent>
          </Card>

          {/* Map Controls */}
          <Card>
            <CardHeader>
              <CardTitle>3D Map Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Zoom Level: {mapConfig.zoom}</Label>
                <Slider
                  value={[mapConfig.zoom]}
                  onValueChange={(value) => setMapConfig({...mapConfig, zoom: value[0]})}
                  max={20}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Tilt Angle: {mapConfig.tilt}°</Label>
                <Slider
                  value={[mapConfig.tilt]}
                  onValueChange={(value) => setMapConfig({...mapConfig, tilt: value[0]})}
                  max={90}
                  min={0}
                  step={5}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Heading: {mapConfig.heading}°</Label>
                <Slider
                  value={[mapConfig.heading]}
                  onValueChange={(value) => setMapConfig({...mapConfig, heading: value[0]})}
                  max={360}
                  min={0}
                  step={15}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Map Type</Label>
                <Select value={mapConfig.mapType} onValueChange={(value) => setMapConfig({...mapConfig, mapType: value})}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select map type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="satellite">Satellite</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="terrain">Terrain</SelectItem>
                    <SelectItem value="roadmap">Street</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Geofence Ring Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Geofence Rings Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {geofenceRings.map((ring, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="font-medium">{ring.label}</Label>
                    <div 
                      className="w-6 h-6 rounded-full border-2"
                      style={{ backgroundColor: ring.color }}
                    ></div>
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
