
// AFIT Campus Geofence Data
window.AFIT_DATA = {
  GEOFENCE_CONFIG: {
    center: {
      latitude: 10.6085,
      longitude: 7.4165
    },
    radii: [500, 1000, 1500, 2000],
    locations: [
      {
        id: 'academic-block-a',
        name: 'Academic Block A',
        type: 'academic',
        lat: 10.6090,
        lng: 7.4170
      },
      {
        id: 'academic-block-b',
        name: 'Academic Block B',
        type: 'academic',
        lat: 10.6085,
        lng: 7.4175
      },
      {
        id: 'library',
        name: 'AFIT Library',
        type: 'academic',
        lat: 10.6080,
        lng: 7.4160
      },
      {
        id: 'admin-block',
        name: 'Administrative Block',
        type: 'administrative',
        lat: 10.6095,
        lng: 7.4165
      },
      {
        id: 'hostel-1',
        name: 'Cadet Hostel 1',
        type: 'residential',
        lat: 10.6075,
        lng: 7.4155
      },
      {
        id: 'hostel-2',
        name: 'Cadet Hostel 2',
        type: 'residential',
        lat: 10.6070,
        lng: 7.4150
      },
      {
        id: 'mess-hall',
        name: 'Mess Hall',
        type: 'service',
        lat: 10.6088,
        lng: 7.4158
      },
      {
        id: 'sports-complex',
        name: 'Sports Complex',
        type: 'recreational',
        lat: 10.6065,
        lng: 7.4180
      },
      {
        id: 'medical-center',
        name: 'Medical Center',
        type: 'service',
        lat: 10.6100,
        lng: 7.4155
      },
      {
        id: 'chapel',
        name: 'Chapel',
        type: 'service',
        lat: 10.6082,
        lng: 7.4162
      }
    ]
  },
  
  BUILDING_DETAILS: {
    'academic-block-a': {
      description: 'Main academic building with lecture halls and laboratories',
      facilities: ['Lecture Halls', 'Computer Labs', 'Physics Lab', 'Chemistry Lab']
    },
    'academic-block-b': {
      description: 'Secondary academic building with specialized classrooms',
      facilities: ['Classrooms', 'Seminar Rooms', 'Faculty Offices']
    },
    'library': {
      description: 'Central library with study areas and digital resources',
      facilities: ['Reading Rooms', 'Digital Library', 'Study Halls', 'Research Section']
    },
    'admin-block': {
      description: 'Administrative headquarters and offices',
      facilities: ['Registrar Office', 'Bursary', 'Dean\'s Office', 'Conference Room']
    },
    'hostel-1': {
      description: 'Primary cadet accommodation facility',
      facilities: ['Dormitories', 'Common Room', 'Study Areas', 'Laundry']
    },
    'hostel-2': {
      description: 'Secondary cadet accommodation facility',
      facilities: ['Dormitories', 'Recreation Room', 'Study Areas', 'Laundry']
    },
    'mess-hall': {
      description: 'Central dining facility for cadets and staff',
      facilities: ['Dining Hall', 'Kitchen', 'Storage', 'Serving Area']
    },
    'sports-complex': {
      description: 'Recreational and sports facilities',
      facilities: ['Gymnasium', 'Football Field', 'Basketball Court', 'Fitness Center']
    },
    'medical-center': {
      description: 'Campus healthcare facility',
      facilities: ['Clinic', 'Pharmacy', 'Emergency Room', 'Medical Office']
    },
    'chapel': {
      description: 'Religious and spiritual facility',
      facilities: ['Main Hall', 'Prayer Rooms', 'Office', 'Sound System']
    }
  },
  
  BUILDING_TYPE_COLORS: {
    academic: '#3B82F6',
    administrative: '#8B5CF6',
    residential: '#10B981',
    recreational: '#F59E0B',
    service: '#6B7280'
  }
};

console.log('AFIT Geofence data loaded successfully');
