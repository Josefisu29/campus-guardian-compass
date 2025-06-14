
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MapPin, Upload, Plus, Edit, Trash2, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminPanel = () => {
  const { toast } = useToast();
  const [locations, setLocations] = useState([
    { id: 1, name: 'Main Library', type: 'academic', lat: 37.422, lng: -122.084, description: 'Central campus library', image: null },
    { id: 2, name: 'Science Building', type: 'academic', lat: 37.423, lng: -122.085, description: 'Physics and Chemistry labs', image: null },
  ]);
  const [newLocation, setNewLocation] = useState({
    name: '',
    type: 'academic',
    lat: '',
    lng: '',
    description: '',
    image: null
  });
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const locationTypes = [
    { value: 'academic', label: 'Academic Building' },
    { value: 'dining', label: 'Dining Hall' },
    { value: 'recreation', label: 'Recreation Center' },
    { value: 'library', label: 'Library' },
    { value: 'parking', label: 'Parking Lot' },
    { value: 'emergency', label: 'Emergency Station' },
    { value: 'service', label: 'Campus Service' }
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLocation = () => {
    // Validate required fields
    if (!newLocation.name || !newLocation.lat || !newLocation.lng || !newLocation.description) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate coordinates
    const lat = parseFloat(newLocation.lat);
    const lng = parseFloat(newLocation.lng);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast({
        title: "Invalid coordinates",
        description: "Please enter valid latitude (-90 to 90) and longitude (-180 to 180)",
        variant: "destructive"
      });
      return;
    }

    const locationData = {
      id: Date.now(),
      name: newLocation.name,
      type: newLocation.type,
      lat: lat,
      lng: lng,
      description: newLocation.description,
      image: selectedImage ? URL.createObjectURL(selectedImage) : null
    };

    setLocations([...locations, locationData]);
    
    // Reset form
    setNewLocation({
      name: '',
      type: 'academic',
      lat: '',
      lng: '',
      description: '',
      image: null
    });
    setSelectedImage(null);
    setImagePreview(null);
    setIsAddLocationOpen(false);

    toast({
      title: "Location added successfully",
      description: `${locationData.name} has been added to the campus map`
    });
  };

  const handleDeleteLocation = (locationId) => {
    setLocations(locations.filter(loc => loc.id !== locationId));
    toast({
      title: "Location deleted",
      description: "Location has been removed from the campus map"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Admin Panel</CardTitle>
          <CardDescription>
            Manage campus locations, images, and navigation data
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Add Location Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Management
          </CardTitle>
          <CardDescription>
            Add and manage campus locations with images and details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Total Locations: {locations.length}
            </p>
            <Dialog open={isAddLocationOpen} onOpenChange={setIsAddLocationOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Location
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Campus Location</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="location-name">Location Name *</Label>
                      <Input
                        id="location-name"
                        placeholder="e.g., Engineering Building"
                        value={newLocation.name}
                        onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="location-type">Location Type</Label>
                      <Select value={newLocation.type} onValueChange={(value) => setNewLocation({...newLocation, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location type" />
                        </SelectTrigger>
                        <SelectContent>
                          {locationTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="latitude">Latitude *</Label>
                        <Input
                          id="latitude"
                          placeholder="37.422"
                          value={newLocation.lat}
                          onChange={(e) => setNewLocation({...newLocation, lat: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="longitude">Longitude *</Label>
                        <Input
                          id="longitude"
                          placeholder="-122.084"
                          value={newLocation.lng}
                          onChange={(e) => setNewLocation({...newLocation, lng: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of the location..."
                        value={newLocation.description}
                        onChange={(e) => setNewLocation({...newLocation, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="location-image">Location Image</Label>
                      <div className="mt-2">
                        <input
                          id="location-image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('location-image').click()}
                          className="w-full flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Image
                        </Button>
                      </div>
                      {imagePreview && (
                        <div className="mt-3">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-md border"
                          />
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Max file size: 5MB. Supported formats: JPG, PNG, GIF
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setIsAddLocationOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddLocation}>
                    Add Location
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Locations List */}
          <div className="space-y-3">
            {locations.map((location) => (
              <div key={location.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-4">
                  {location.image ? (
                    <img src={location.image} alt={location.name} className="w-12 h-12 object-cover rounded-md" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                      <Image className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{location.name}</h3>
                    <p className="text-sm text-gray-600">{location.description}</p>
                    <p className="text-xs text-gray-400">
                      {location.lat}, {location.lng} • {locationTypes.find(t => t.value === location.type)?.label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteLocation(location.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{locations.length}</div>
            <p className="text-sm text-gray-600">Total Locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{locations.filter(l => l.image).length}</div>
            <p className="text-sm text-gray-600">Locations with Images</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{locationTypes.length}</div>
            <p className="text-sm text-gray-600">Location Categories</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
