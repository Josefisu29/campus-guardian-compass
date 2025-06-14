
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface Floor {
  id: string;
  name: string;
  rooms: Room[];
}

interface Room {
  id: string;
  name: string;
  type: 'classroom' | 'office' | 'restroom' | 'lab' | 'other';
  coordinates: { x: number; y: number };
}

const IndoorNavigation: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedFloor, setSelectedFloor] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  
  // Sample building data
  const buildings = {
    'science': {
      name: 'Science Building',
      floors: [
        {
          id: 'floor1',
          name: 'Floor 1',
          rooms: [
            { id: 'room101', name: 'Room 101', type: 'classroom', coordinates: { x: 50, y: 100 } },
            { id: 'room102', name: 'Room 102', type: 'lab', coordinates: { x: 150, y: 100 } },
            { id: 'restroom1', name: 'Restroom', type: 'restroom', coordinates: { x: 250, y: 50 } }
          ]
        },
        {
          id: 'floor2',
          name: 'Floor 2',
          rooms: [
            { id: 'room201', name: 'Room 201', type: 'classroom', coordinates: { x: 50, y: 100 } },
            { id: 'room202', name: 'Professor Office', type: 'office', coordinates: { x: 150, y: 100 } }
          ]
        }
      ]
    },
    'library': {
      name: 'Main Library',
      floors: [
        {
          id: 'floor1',
          name: 'Ground Floor',
          rooms: [
            { id: 'entrance', name: 'Main Entrance', type: 'other', coordinates: { x: 100, y: 200 } },
            { id: 'circulation', name: 'Circulation Desk', type: 'other', coordinates: { x: 100, y: 150 } },
            { id: 'study1', name: 'Study Area 1', type: 'other', coordinates: { x: 200, y: 100 } }
          ]
        }
      ]
    }
  };

  const currentBuilding = buildings[selectedBuilding as keyof typeof buildings];
  const currentFloor = currentBuilding?.floors.find(f => f.id === selectedFloor);

  const getRoomIcon = (type: string) => {
    const icons = {
      classroom: '🏫',
      office: '🏢',
      restroom: '🚻',
      lab: '🔬',
      other: '📍'
    };
    return icons[type as keyof typeof icons] || '📍';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Indoor Navigation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Building Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Select Building:</label>
          <select
            value={selectedBuilding}
            onChange={(e) => {
              setSelectedBuilding(e.target.value);
              setSelectedFloor('');
              setSelectedRoom('');
            }}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Choose a building...</option>
            {Object.entries(buildings).map(([key, building]) => (
              <option key={key} value={key}>
                {building.name}
              </option>
            ))}
          </select>
        </div>

        {/* Floor Selection */}
        {currentBuilding && (
          <div>
            <label className="block text-sm font-medium mb-2">Select Floor:</label>
            <select
              value={selectedFloor}
              onChange={(e) => {
                setSelectedFloor(e.target.value);
                setSelectedRoom('');
              }}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Choose a floor...</option>
              {currentBuilding.floors.map((floor) => (
                <option key={floor.id} value={floor.id}>
                  {floor.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Room Selection */}
        {currentFloor && (
          <div>
            <label className="block text-sm font-medium mb-2">Select Room:</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Choose a room...</option>
              {currentFloor.rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {getRoomIcon(room.type)} {room.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Floor Plan */}
        {currentFloor && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Floor Plan - {currentFloor.name}</h4>
            <div className="relative bg-gray-100 border rounded-lg p-4" style={{ height: '300px' }}>
              {currentFloor.rooms.map((room) => (
                <div
                  key={room.id}
                  className={`absolute w-16 h-12 border-2 rounded flex items-center justify-center text-xs font-medium cursor-pointer transition-all ${
                    selectedRoom === room.id
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'bg-white border-gray-300 hover:border-blue-400'
                  }`}
                  style={{
                    left: room.coordinates.x,
                    top: room.coordinates.y
                  }}
                  onClick={() => setSelectedRoom(room.id)}
                  title={room.name}
                >
                  <span>{getRoomIcon(room.type)}</span>
                </div>
              ))}
              
              {/* Path visualization */}
              {selectedRoom && (
                <svg className="absolute inset-0 pointer-events-none">
                  <path
                    d="M 20 280 Q 100 200 200 150"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                </svg>
              )}
            </div>
            
            {selectedRoom && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  📍 Directions to {currentFloor.rooms.find(r => r.id === selectedRoom)?.name}:
                  Enter through main entrance, take the corridor on your right, and it's the second door.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IndoorNavigation;
