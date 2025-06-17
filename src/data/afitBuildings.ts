
import geofenceConfig from '../config/geofence.json';

export interface Building {
  id: string;
  name: string;
  description: string;
  capacity?: number;
  yearBuilt?: number;
  coordinates: [number, number]; // [latitude, longitude]
  images: string[];
  type: 'academic' | 'residential' | 'administrative' | 'recreational' | 'service';
  facilities: string[];
  events?: Event[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  buildingId: string;
  notificationLeadTime: number; // minutes before event
}

// Dynamic building data from geofence config
export const afitBuildings: Building[] = geofenceConfig.locations.map(location => {
  const buildingDetails = {
    'alfa_hall': {
      description: 'Main residential facility for cadets, named after Air Marshal Ibrahim Alfa. Modern amenities and study spaces.',
      capacity: 1200,
      yearBuilt: 1995,
      facilities: ['Study Rooms', 'Common Areas', 'Laundry', 'Cafeteria'],
      events: [
        {
          id: 'alfa-social',
          title: 'Cadet Social Night',
          description: 'Weekly social gathering for cadets at Ibrahim Alfa Hall',
          startTime: '2024-06-15T19:00:00',
          endTime: '2024-06-15T22:00:00',
          buildingId: 'alfa_hall',
          notificationLeadTime: 30
        }
      ]
    },
    'library': {
      description: 'Central library and information resource center with extensive collections and study areas.',
      capacity: 500,
      yearBuilt: 2000,
      facilities: ['Reading Rooms', 'Computer Lab', 'Digital Resources', 'Group Study Areas'],
      events: []
    },
    'admin_block': {
      description: 'Administrative headquarters housing the Commandant\'s office and senior administrative staff.',
      capacity: 200,
      yearBuilt: 1992,
      facilities: ['Commandant Office', 'Registry', 'Admin Offices', 'Conference Rooms'],
      events: []
    },
    'stadium': {
      description: 'Multi-purpose stadium for football, athletics, and major sporting events.',
      capacity: 5000,
      yearBuilt: 2000,
      facilities: ['Football Pitch', 'Athletics Track', 'Gymnasium', 'Swimming Pool'],
      events: [
        {
          id: 'inter-squadron-football',
          title: 'Inter-Squadron Football Championship',
          description: 'Annual football competition between cadet squadrons',
          startTime: '2024-06-20T16:00:00',
          endTime: '2024-06-20T18:00:00',
          buildingId: 'stadium',
          notificationLeadTime: 60
        }
      ]
    },
    'lecture_theatre': {
      description: 'Central venue for large lectures, ceremonies, and academic events.',
      capacity: 800,
      yearBuilt: 1995,
      facilities: ['Large Lecture Halls', 'Audio/Visual Equipment', 'Air Conditioning'],
      events: []
    },
    'hostels': {
      description: 'Residential accommodation blocks for officer cadets, organized by squadrons.',
      capacity: 800,
      yearBuilt: 1998,
      facilities: ['Dormitories', 'Common Rooms', 'Study Areas', 'Recreation Facilities'],
      events: []
    },
    'air_eng_block': {
      description: 'Specialized facilities for aeronautical and aerospace engineering programs.',
      capacity: 400,
      yearBuilt: 2005,
      facilities: ['Aerospace Labs', 'CAD Labs', 'Wind Tunnel', 'Research Labs'],
      events: []
    },
    'computing_block': {
      description: 'Modern computing facilities with computer labs and IT support services.',
      capacity: 300,
      yearBuilt: 2010,
      facilities: ['Computer Labs', 'Server Room', 'IT Support', 'Programming Labs'],
      events: []
    },
    'ground_comm_block': {
      description: 'Facilities for ground engineering and communications engineering programs.',
      capacity: 350,
      yearBuilt: 2003,
      facilities: ['Electronics Labs', 'Communications Lab', 'Workshop', 'Practical Rooms'],
      events: []
    },
    'social_mgmt_block': {
      description: 'Academic block for social sciences and management studies programs.',
      capacity: 300,
      yearBuilt: 2001,
      facilities: ['Lecture Rooms', 'Seminar Halls', 'Faculty Offices', 'Student Lounge'],
      events: []
    },
    'sciences_block': {
      description: 'Science laboratories and lecture facilities for physics, chemistry, and mathematics.',
      capacity: 400,
      yearBuilt: 2004,
      facilities: ['Physics Lab', 'Chemistry Lab', 'Mathematics Dept', 'Research Labs'],
      events: []
    },
    'sps': {
      description: 'Dedicated facilities for postgraduate programs and research activities.',
      capacity: 200,
      yearBuilt: 2008,
      facilities: ['Research Offices', 'Seminar Rooms', 'Library Extension', 'Thesis Defense Hall'],
      events: []
    },
    'medical_clinic': {
      description: 'On-campus medical facility providing healthcare services to cadets and staff.',
      capacity: 50,
      yearBuilt: 1996,
      facilities: ['Consultation Rooms', 'Pharmacy', 'Emergency Care', 'Laboratory'],
      events: []
    },
    'cafeteria': {
      description: 'Central dining facility serving meals to cadets and staff throughout the day.',
      capacity: 1000,
      yearBuilt: 1994,
      facilities: ['Main Dining Hall', 'Kitchen', 'Serving Areas', 'Storage'],
      events: []
    },
    'chapel': {
      description: 'Religious facility accommodating various faiths for worship and spiritual activities.',
      capacity: 300,
      yearBuilt: 1993,
      facilities: ['Main Chapel', 'Prayer Rooms', 'Multi-Faith Hall', 'Counseling Rooms'],
      events: []
    },
    'guest_house': {
      description: 'Accommodation facilities for visiting personnel and permanent staff housing.',
      capacity: 100,
      yearBuilt: 1997,
      facilities: ['Guest Rooms', 'Staff Apartments', 'Common Areas', 'Parking'],
      events: []
    },
    'naf_hospital': {
      description: 'Adjacent Nigerian Air Force Hospital providing comprehensive medical care.',
      capacity: 150,
      yearBuilt: 1990,
      facilities: ['Emergency Room', 'Wards', 'Specialized Clinics', 'Laboratory'],
      events: []
    },
    'rec_center': {
      description: 'Modern fitness facility with gym equipment and recreational activities.',
      capacity: 200,
      yearBuilt: 2012,
      facilities: ['Gym Equipment', 'Indoor Sports', 'Fitness Classes', 'Changing Rooms'],
      events: []
    }
  };

  const details = buildingDetails[location.id] || {
    description: `${location.name} facility at AFIT campus.`,
    capacity: 100,
    yearBuilt: 2000,
    facilities: ['General Facilities'],
    events: []
  };

  return {
    id: location.id,
    name: location.name,
    description: details.description,
    capacity: details.capacity,
    yearBuilt: details.yearBuilt,
    coordinates: [location.lat, location.lng],
    images: ['/placeholder.svg'],
    type: location.type as Building['type'],
    facilities: details.facilities,
    events: details.events
  };
});

// Export geofence config for use in mapping components
export const geofenceConfiguration = geofenceConfig;
