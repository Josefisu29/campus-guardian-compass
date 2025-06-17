
// AFIT Campus Geofence Configuration and Building Data
const AFIT_GEOFENCE_CONFIG = {
  "center": {
    "latitude": 10.333000,
    "longitude": 7.750000
  },
  "radii": [500, 1000, 1500, 2000],
  "locations": [
    { "id": "alfa_hall", "name": "Ibrahim Alfa Hall", "lat": 10.333674, "lng": 7.749362, "type": "residential" },
    { "id": "library", "name": "AFIT Library", "lat": 10.334120, "lng": 7.749732, "type": "academic" },
    { "id": "admin_block", "name": "Main Admin Block", "lat": 10.333958, "lng": 7.750204, "type": "administrative" },
    { "id": "stadium", "name": "Stadium (Sports Complex)", "lat": 10.333612, "lng": 7.751177, "type": "recreational" },
    { "id": "lecture_theatre", "name": "Lecture Theatre Complex", "lat": 10.333326, "lng": 7.750579, "type": "academic" },
    { "id": "hostels", "name": "Officer Cadets Hostels A–D", "lat": 10.334300, "lng": 7.749900, "type": "residential" },
    { "id": "air_eng_block", "name": "Air Engineering Block", "lat": 10.334600, "lng": 7.750500, "type": "academic" },
    { "id": "computing_block", "name": "Computing Block", "lat": 10.333800, "lng": 7.750800, "type": "academic" },
    { "id": "ground_comm_block", "name": "Ground & Communication Eng.", "lat": 10.334000, "lng": 7.751000, "type": "academic" },
    { "id": "social_mgmt_block", "name": "Social & Management Sciences", "lat": 10.333500, "lng": 7.749500, "type": "academic" },
    { "id": "sciences_block", "name": "Faculty of Sciences Block", "lat": 10.333900, "lng": 7.751500, "type": "academic" },
    { "id": "sps", "name": "School of Postgraduate Studies", "lat": 10.334200, "lng": 7.750200, "type": "academic" },
    { "id": "medical_clinic", "name": "AFIT Medical Clinic", "lat": 10.332800, "lng": 7.749800, "type": "service" },
    { "id": "cafeteria", "name": "Main Cafeteria / Dining Hall", "lat": 10.333700, "lng": 7.749200, "type": "service" },
    { "id": "chapel", "name": "Chapel / Multi‑Faith Centre", "lat": 10.334000, "lng": 7.749400, "type": "service" },
    { "id": "guest_house", "name": "Guest House / Staff Quarters", "lat": 10.334400, "lng": 7.751200, "type": "residential" },
    { "id": "naf_hospital", "name": "NAF Hospital (adjacent)", "lat": 10.332500, "lng": 7.752000, "type": "service" },
    { "id": "rec_center", "name": "Fitness & Recreation Centre", "lat": 10.333200, "lng": 7.748800, "type": "recreational" }
  ]
};

// Detailed building information
const BUILDING_DETAILS = {
  'alfa_hall': {
    description: 'Main residential facility for cadets, named after Air Marshal Ibrahim Alfa. Modern amenities and study spaces.',
    capacity: 1200,
    yearBuilt: 1995,
    facilities: ['Study Rooms', 'Common Areas', 'Laundry', 'Cafeteria', 'Wi-Fi'],
    images: ['/images/alfa-hall-1.jpg', '/images/alfa-hall-2.jpg'],
    floorPlan: '/documents/alfa-hall-floor-plan.pdf'
  },
  'library': {
    description: 'Central library and information resource center with extensive collections and study areas.',
    capacity: 500,
    yearBuilt: 2000,
    facilities: ['Reading Rooms', 'Computer Lab', 'Digital Resources', 'Group Study Areas', 'Silent Study Zones'],
    images: ['/images/library-1.jpg', '/images/library-2.jpg'],
    floorPlan: '/documents/library-floor-plan.pdf'
  },
  'admin_block': {
    description: 'Administrative headquarters housing the Commandant\'s office and senior administrative staff.',
    capacity: 200,
    yearBuilt: 1992,
    facilities: ['Commandant Office', 'Registry', 'Admin Offices', 'Conference Rooms', 'Reception'],
    images: ['/images/admin-block-1.jpg'],
    floorPlan: '/documents/admin-block-floor-plan.pdf'
  },
  'stadium': {
    description: 'Multi-purpose stadium for football, athletics, and major sporting events.',
    capacity: 5000,
    yearBuilt: 2000,
    facilities: ['Football Pitch', 'Athletics Track', 'Gymnasium', 'Swimming Pool', 'Changing Rooms'],
    images: ['/images/stadium-1.jpg', '/images/stadium-2.jpg'],
    floorPlan: '/documents/stadium-floor-plan.pdf'
  },
  'lecture_theatre': {
    description: 'Central venue for large lectures, ceremonies, and academic events.',
    capacity: 800,
    yearBuilt: 1995,
    facilities: ['Large Lecture Halls', 'Audio/Visual Equipment', 'Air Conditioning', 'Projectors'],
    images: ['/images/lecture-theatre-1.jpg'],
    floorPlan: '/documents/lecture-theatre-floor-plan.pdf'
  },
  'hostels': {
    description: 'Residential accommodation blocks for officer cadets, organized by squadrons.',
    capacity: 800,
    yearBuilt: 1998,
    facilities: ['Dormitories', 'Common Rooms', 'Study Areas', 'Recreation Facilities', 'Laundry'],
    images: ['/images/hostels-1.jpg', '/images/hostels-2.jpg'],
    floorPlan: '/documents/hostels-floor-plan.pdf'
  },
  'air_eng_block': {
    description: 'Specialized facilities for aeronautical and aerospace engineering programs.',
    capacity: 400,
    yearBuilt: 2005,
    facilities: ['Aerospace Labs', 'CAD Labs', 'Wind Tunnel', 'Research Labs', 'Workshop'],
    images: ['/images/air-eng-1.jpg'],
    floorPlan: '/documents/air-eng-floor-plan.pdf'
  },
  'computing_block': {
    description: 'Modern computing facilities with computer labs and IT support services.',
    capacity: 300,
    yearBuilt: 2010,
    facilities: ['Computer Labs', 'Server Room', 'IT Support', 'Programming Labs', 'Network Center'],
    images: ['/images/computing-1.jpg'],
    floorPlan: '/documents/computing-floor-plan.pdf'
  },
  'ground_comm_block': {
    description: 'Facilities for ground engineering and communications engineering programs.',
    capacity: 350,
    yearBuilt: 2003,
    facilities: ['Electronics Labs', 'Communications Lab', 'Workshop', 'Practical Rooms', 'Equipment Store'],
    images: ['/images/ground-comm-1.jpg'],
    floorPlan: '/documents/ground-comm-floor-plan.pdf'
  },
  'social_mgmt_block': {
    description: 'Academic block for social sciences and management studies programs.',
    capacity: 300,
    yearBuilt: 2001,
    facilities: ['Lecture Rooms', 'Seminar Halls', 'Faculty Offices', 'Student Lounge', 'Library Annex'],
    images: ['/images/social-mgmt-1.jpg'],
    floorPlan: '/documents/social-mgmt-floor-plan.pdf'
  },
  'sciences_block': {
    description: 'Science laboratories and lecture facilities for physics, chemistry, and mathematics.',
    capacity: 400,
    yearBuilt: 2004,
    facilities: ['Physics Lab', 'Chemistry Lab', 'Mathematics Dept', 'Research Labs', 'Prep Rooms'],
    images: ['/images/sciences-1.jpg'],
    floorPlan: '/documents/sciences-floor-plan.pdf'
  },
  'sps': {
    description: 'Dedicated facilities for postgraduate programs and research activities.',
    capacity: 200,
    yearBuilt: 2008,
    facilities: ['Research Offices', 'Seminar Rooms', 'Library Extension', 'Thesis Defense Hall', 'Faculty Lounge'],
    images: ['/images/sps-1.jpg'],
    floorPlan: '/documents/sps-floor-plan.pdf'
  },
  'medical_clinic': {
    description: 'On-campus medical facility providing healthcare services to cadets and staff.',
    capacity: 50,
    yearBuilt: 1996,
    facilities: ['Consultation Rooms', 'Pharmacy', 'Emergency Care', 'Laboratory', 'Waiting Area'],
    images: ['/images/medical-1.jpg'],
    floorPlan: '/documents/medical-floor-plan.pdf'
  },
  'cafeteria': {
    description: 'Central dining facility serving meals to cadets and staff throughout the day.',
    capacity: 1000,
    yearBuilt: 1994,
    facilities: ['Main Dining Hall', 'Kitchen', 'Serving Areas', 'Storage', 'Washing Area'],
    images: ['/images/cafeteria-1.jpg'],
    floorPlan: '/documents/cafeteria-floor-plan.pdf'
  },
  'chapel': {
    description: 'Religious facility accommodating various faiths for worship and spiritual activities.',
    capacity: 300,
    yearBuilt: 1993,
    facilities: ['Main Chapel', 'Prayer Rooms', 'Multi-Faith Hall', 'Counseling Rooms', 'Office'],
    images: ['/images/chapel-1.jpg'],
    floorPlan: '/documents/chapel-floor-plan.pdf'
  },
  'guest_house': {
    description: 'Accommodation facilities for visiting personnel and permanent staff housing.',
    capacity: 100,
    yearBuilt: 1997,
    facilities: ['Guest Rooms', 'Staff Apartments', 'Common Areas', 'Parking', 'Reception'],
    images: ['/images/guest-house-1.jpg'],
    floorPlan: '/documents/guest-house-floor-plan.pdf'
  },
  'naf_hospital': {
    description: 'Adjacent Nigerian Air Force Hospital providing comprehensive medical care.',
    capacity: 150,
    yearBuilt: 1990,
    facilities: ['Emergency Room', 'Wards', 'Specialized Clinics', 'Laboratory', 'Pharmacy'],
    images: ['/images/naf-hospital-1.jpg'],
    floorPlan: '/documents/naf-hospital-floor-plan.pdf'
  },
  'rec_center': {
    description: 'Modern fitness facility with gym equipment and recreational activities.',
    capacity: 200,
    yearBuilt: 2012,
    facilities: ['Gym Equipment', 'Indoor Sports', 'Fitness Classes', 'Changing Rooms', 'Lounge'],
    images: ['/images/rec-center-1.jpg'],
    floorPlan: '/documents/rec-center-floor-plan.pdf'
  }
};

// Building type colors for map markers
const BUILDING_TYPE_COLORS = {
  'academic': '#1E40AF',      // Blue
  'residential': '#059669',   // Green
  'administrative': '#DC2626', // Red
  'recreational': '#7C3AED',  // Purple
  'service': '#F59E0B'        // Orange
};

// Export for global use
window.AFIT_DATA = {
  GEOFENCE_CONFIG: AFIT_GEOFENCE_CONFIG,
  BUILDING_DETAILS,
  BUILDING_TYPE_COLORS
};
