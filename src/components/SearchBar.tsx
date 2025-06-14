
import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

const SearchBar = ({ onLocationSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const campusLocations = [
    { id: 1, name: 'Main Library', category: 'Library', walkTime: '3 minutes' },
    { id: 2, name: 'Science Building', category: 'Academic', walkTime: '5 minutes' },
    { id: 3, name: 'Student Center', category: 'Student Services', walkTime: '2 minutes' },
    { id: 4, name: 'Cafeteria', category: 'Dining', walkTime: '4 minutes' },
    { id: 5, name: 'Gym', category: 'Recreation', walkTime: '7 minutes' },
    { id: 6, name: 'Computer Lab', category: 'Academic', walkTime: '6 minutes' },
    { id: 7, name: 'Parking Lot A', category: 'Parking', walkTime: '8 minutes' },
    { id: 8, name: 'Health Center', category: 'Services', walkTime: '4 minutes' },
  ];

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    if (searchQuery.length > 0) {
      const filtered = campusLocations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleLocationClick = (location) => {
    setQuery(location.name);
    setSuggestions([]);
    onLocationSelect(location);
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for buildings, departments, or services..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>

        {suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
            {suggestions.map((location) => (
              <button
                key={location.id}
                onClick={() => handleLocationClick(location)}
                className="w-full px-6 py-4 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium text-gray-900">{location.name}</div>
                      <div className="text-sm text-gray-500">{location.category}</div>
                    </div>
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    {location.walkTime}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Access Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {['Library', 'Cafeteria', 'Parking', 'Gym'].map((quickSearch) => (
          <button
            key={quickSearch}
            onClick={() => handleSearch(quickSearch)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
          >
            {quickSearch}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
