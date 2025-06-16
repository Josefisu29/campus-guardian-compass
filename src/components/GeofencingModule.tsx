
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
  const [location, setLocation] = useState(defaultLocation);
  const [mapConfig, setMapConfig] = useState({
    zoom: 15,
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
    // Simulate AI analysis of geofence areas
    setTimeout(() => {
      const insights = `
📍 Location Analysis for ${location.latitude}, ${location.longitude}:

🔵 500m Zone: Core campus facilities including main lecture halls, library, and student center. High foot traffic area with primary academic buildings.

🟢 1000m Zone: Extended academic facilities, dormitories, and dining areas. Secondary buildings and recreational facilities are within this perimeter.

🟡 1500m Zone: Sports complex, parking areas, and auxiliary buildings. This zone includes outdoor recreational spaces and vehicle access points.

🔴 2000m Zone: Campus boundary including security checkpoints, visitor parking, and emergency access routes. Perimeter monitoring recommended.

🏢 POI Density: High concentration of academic buildings in inner rings, residential facilities in middle rings, and support services in outer rings.

⚠️ Security Recommendations: Focus monitoring on 500m-1000m transition zones where student activity is highest.
      `;
      setAiInsights(insights);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleCustomPromptAnalysis = async () => {
    if (!customPrompt.trim()) return;
    
    setIsAnalyzing(true);
    toast({
      title: "Analyzing custom prompt",
      description: "AI is processing your request...",
    });

    // Simulate custom AI analysis
    setTimeout(() => {
      const customInsights = `
🤖 Custom Analysis: "${customPrompt}"

Based on your request, here are the tailored insights:
- Adjusted geofence radii to optimize for your specific use case
- Identified relevant POIs within your specified criteria
- Generated contextual recommendations for your scenario
- Provided actionable insights for campus navigation and safety

${customPrompt.toLowerCase().includes('café') ? '☕ Coffee shop locations prioritized in analysis' : ''}
${customPrompt.toLowerCase().includes('safety') ? '🛡️ Security considerations highlighted' : ''}
${customPrompt.toLowerCase().includes('parking') ? '🚗 Parking availability analyzed' : ''}
      `;
      setAiInsights(customInsights);
      setIsAnalyzing(false);
      toast({
        title: "Analysis complete",
        description: "Custom insights generated successfully",
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
            3D Geofencing & Campus Mapping Module
          </CardTitle>
          <CardDescription>
            Advanced interactive mapping with AI-driven contextual insights and geofencing capabilities
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="map">Interactive Map</TabsTrigger>
          <TabsTrigger value="controls">Map Controls</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-6">
          {/* Main Map Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Campus Map - {location.latitude}, {location.longitude}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{mapConfig.mapType}</Badge>
                  <Badge variant="outline">{mapConfig.zoom}x zoom</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Simulated 3D Map View */}
              <div className="relative w-full h-96 bg-gradient-to-br from-green-100 via-blue-100 to-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                {/* Map Grid Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid-3d" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3B82F6" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-3d)" />
                  </svg>
                </div>

                {/* Geofence Rings Visualization */}
                {geofenceRings.map((ring, index) => (
                  <div
                    key={index}
                    className="absolute rounded-full border-2 opacity-60"
                    style={{
                      width: `${20 + index * 15}%`,
                      height: `${20 + index * 15}%`,
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

                {/* Campus Center Marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-red-500 rounded-full p-2 shadow-lg animate-pulse">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-2 py-1 rounded shadow text-xs font-medium whitespace-nowrap">
                    Campus Center
                  </div>
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

                {/* 3D View Indicator */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>3D View: {mapConfig.tilt}° tilt, {mapConfig.heading}° heading</span>
                  </div>
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
          {/* Location Input */}
          <Card>
            <CardHeader>
              <CardTitle>Location Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    value={location.latitude}
                    onChange={(e) => setLocation({...location, latitude: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    value={location.longitude}
                    onChange={(e) => setLocation({...location, longitude: parseFloat(e.target.value)})}
                  />
                </div>
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
