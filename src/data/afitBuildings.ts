
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

export const afitBuildings: Building[] = [
  {
    id: 'ibrahim-alfa-hall',
    name: 'Ibrahim Alfa Hall',
    description: 'Main residential facility for cadets, named after Air Marshal Ibrahim Alfa. Modern amenities and study spaces.',
    capacity: 1200,
    yearBuilt: 1995,
    coordinates: [10.333674, 7.749362],
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    type: 'residential',
    facilities: ['Study Rooms', 'Common Areas', 'Laundry', 'Cafeteria'],
    events: [
      {
        id: 'alfa-social',
        title: 'Cadet Social Night',
        description: 'Weekly social gathering for cadets at Ibrahim Alfa Hall',
        startTime: '2024-06-15T19:00:00',
        endTime: '2024-06-15T22:00:00',
        buildingId: 'ibrahim-alfa-hall',
        notificationLeadTime: 30
      }
    ]
  },
  {
    id: 'afit-library',
    name: 'AFIT Library',
    description: 'Central library and information resource center with extensive collections and study areas.',
    capacity: 500,
    yearBuilt: 2000,
    coordinates: [10.334120, 7.749732],
    images: ['/placeholder.svg', '/placeholder.svg'],
    type: 'academic',
    facilities: ['Reading Rooms', 'Computer Lab', 'Digital Resources', 'Group Study Areas'],
    events: []
  },
  {
    id: 'main-admin-block',
    name: 'Main Admin Block',
    description: 'Administrative headquarters housing the Commandant\'s office and senior administrative staff.',
    capacity: 200,
    yearBuilt: 1992,
    coordinates: [10.333958, 7.750204],
    images: ['/placeholder.svg'],
    type: 'administrative',
    facilities: ['Commandant Office', 'Registry', 'Admin Offices', 'Conference Rooms'],
    events: []
  },
  {
    id: 'sports-stadium',
    name: 'Stadium (Sports Complex)',
    description: 'Multi-purpose stadium for football, athletics, and major sporting events.',
    capacity: 5000,
    yearBuilt: 2000,
    coordinates: [10.333612, 7.751177],
    images: ['/placeholder.svg', '/placeholder.svg'],
    type: 'recreational',
    facilities: ['Football Pitch', 'Athletics Track', 'Gymnasium', 'Swimming Pool'],
    events: [
      {
        id: 'inter-squadron-football',
        title: 'Inter-Squadron Football Championship',
        description: 'Annual football competition between cadet squadrons',
        startTime: '2024-06-20T16:00:00',
        endTime: '2024-06-20T18:00:00',
        buildingId: 'sports-stadium',
        notificationLeadTime: 60
      }
    ]
  },
  {
    id: 'lecture-theatre-complex',
    name: 'Lecture Theatre Complex',
    description: 'Central venue for large lectures, ceremonies, and academic events.',
    capacity: 800,
    yearBuilt: 1995,
    coordinates: [10.333326, 7.750579],
    images: ['/placeholder.svg', '/placeholder.svg'],
    type: 'academic',
    facilities: ['Large Lecture Halls', 'Audio/Visual Equipment', 'Air Conditioning'],
    events: []
  },
  {
    id: 'cadet-hostels',
    name: 'Officer Cadets Hostels A–D',
    description: 'Residential accommodation blocks for officer cadets, organized by squadrons.',
    capacity: 800,
    yearBuilt: 1998,
    coordinates: [10.334300, 7.749900],
    images: ['/placeholder.svg'],
    type: 'residential',
    facilities: ['Dormitories', 'Common Rooms', 'Study Areas', 'Recreation Facilities'],
    events: []
  },
  {
    id: 'air-engineering-block',
    name: 'Air Engineering Block',
    description: 'Specialized facilities for aeronautical and aerospace engineering programs.',
    capacity: 400,
    yearBuilt: 2005,
    coordinates: [10.334600, 7.750500],
    images: ['/placeholder.svg', '/placeholder.svg'],
    type: 'academic',
    facilities: ['Aerospace Labs', 'CAD Labs', 'Wind Tunnel', 'Research Labs'],
    events: []
  },
  {
    id: 'computing-block',
    name: 'Computing Block',
    description: 'Modern computing facilities with computer labs and IT support services.',
    capacity: 300,
    yearBuilt: 2010,
    coordinates: [10.333800, 7.750800],
    images: ['/placeholder.svg'],
    type: 'academic',
    facilities: ['Computer Labs', 'Server Room', 'IT Support', 'Programming Labs'],
    events: []
  },
  {
    id: 'ground-comm-engineering-block',
    name: 'Ground & Comm. Eng. Block',
    description: 'Facilities for ground engineering and communications engineering programs.',
    capacity: 350,
    yearBuilt: 2003,
    coordinates: [10.334000, 7.751000],
    images: ['/placeholder.svg'],
    type: 'academic',
    facilities: ['Electronics Labs', 'Communications Lab', 'Workshop', 'Practical Rooms'],
    events: []
  },
  {
    id: 'social-management-sciences-block',
    name: 'Social & Management Sciences Block',
    description: 'Academic block for social sciences and management studies programs.',
    capacity: 300,
    yearBuilt: 2001,
    coordinates: [10.333500, 7.749500],
    images: ['/placeholder.svg'],
    type: 'academic',
    facilities: ['Lecture Rooms', 'Seminar Halls', 'Faculty Offices', 'Student Lounge'],
    events: []
  },
  {
    id: 'faculty-sciences-block',
    name: 'Faculty of Sciences Block',
    description: 'Science laboratories and lecture facilities for physics, chemistry, and mathematics.',
    capacity: 400,
    yearBuilt: 2004,
    coordinates: [10.333900, 7.751500],
    images: ['/placeholder.svg'],
    type: 'academic',
    facilities: ['Physics Lab', 'Chemistry Lab', 'Mathematics Dept', 'Research Labs'],
    events: []
  },
  {
    id: 'postgraduate-studies',
    name: 'School of Postgraduate Studies (SPS)',
    description: 'Dedicated facilities for postgraduate programs and research activities.',
    capacity: 200,
    yearBuilt: 2008,
    coordinates: [10.334200, 7.750200],
    images: ['/placeholder.svg'],
    type: 'academic',
    facilities: ['Research Offices', 'Seminar Rooms', 'Library Extension', 'Thesis Defense Hall'],
    events: []
  },
  {
    id: 'medical-clinic',
    name: 'AFIT Medical Clinic',
    description: 'On-campus medical facility providing healthcare services to cadets and staff.',
    capacity: 50,
    yearBuilt: 1996,
    coordinates: [10.332800, 7.749800],
    images: ['/placeholder.svg'],
    type: 'service',
    facilities: ['Consultation Rooms', 'Pharmacy', 'Emergency Care', 'Laboratory'],
    events: []
  },
  {
    id: 'main-cafeteria',
    name: 'Main Cafeteria / Dining Hall',
    description: 'Central dining facility serving meals to cadets and staff throughout the day.',
    capacity: 1000,
    yearBuilt: 1994,
    coordinates: [10.333700, 7.749200],
    images: ['/placeholder.svg'],
    type: 'service',
    facilities: ['Main Dining Hall', 'Kitchen', 'Serving Areas', 'Storage'],
    events: []
  },
  {
    id: 'chapel-multi-faith',
    name: 'Chapel / Multi‑Faith Centre',
    description: 'Religious facility accommodating various faiths for worship and spiritual activities.',
    capacity: 300,
    yearBuilt: 1993,
    coordinates: [10.334000, 7.749400],
    images: ['/placeholder.svg'],
    type: 'service',
    facilities: ['Main Chapel', 'Prayer Rooms', 'Multi-Faith Hall', 'Counseling Rooms'],
    events: []
  },
  {
    id: 'guest-house-staff-quarters',
    name: 'Guest House / Staff Quarters',
    description: 'Accommodation facilities for visiting personnel and permanent staff housing.',
    capacity: 100,
    yearBuilt: 1997,
    coordinates: [10.334400, 7.751200],
    images: ['/placeholder.svg'],
    type: 'residential',
    facilities: ['Guest Rooms', 'Staff Apartments', 'Common Areas', 'Parking'],
    events: []
  },
  {
    id: 'fitness-recreation-centre',
    name: 'Fitness & Recreation Centre',
    description: 'Modern fitness facility with gym equipment and recreational activities.',
    capacity: 200,
    yearBuilt: 2012,
    coordinates: [10.333200, 7.748800],
    images: ['/placeholder.svg'],
    type: 'recreational',
    facilities: ['Gym Equipment', 'Indoor Sports', 'Fitness Classes', 'Changing Rooms'],
    events: []
  }
];
