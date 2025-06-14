
export interface Building {
  id: string;
  name: string;
  description: string;
  capacity?: number;
  yearBuilt?: number;
  coordinates: [number, number];
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
    id: 'alfa-hall',
    name: 'Alfa Hall',
    description: 'Home to 1,200 undergraduates, the main residential facility built in 1995. Features modern amenities and study spaces.',
    capacity: 1200,
    yearBuilt: 1995,
    coordinates: [7.1775, 3.3792],
    images: [
      '/placeholder.svg',
      '/placeholder.svg',
      '/placeholder.svg'
    ],
    type: 'residential',
    facilities: ['Study Rooms', 'Common Areas', 'Laundry', 'Cafeteria'],
    events: [
      {
        id: 'alfa-social',
        title: 'Swag Night at Alfa Hall',
        description: 'Weekly social gathering for cadets',
        startTime: '2024-06-15T19:00:00',
        endTime: '2024-06-15T22:00:00',
        buildingId: 'alfa-hall',
        notificationLeadTime: 30
      }
    ]
  },
  {
    id: 'main-auditorium',
    name: 'Main Auditorium',
    description: 'The central venue for ceremonies, graduations, and major academic events. Seats 2,000 people.',
    capacity: 2000,
    yearBuilt: 1992,
    coordinates: [7.1780, 3.3795],
    images: ['/placeholder.svg', '/placeholder.svg'],
    type: 'academic',
    facilities: ['Audio/Visual Equipment', 'Air Conditioning', 'Stage'],
    events: []
  },
  {
    id: 'engineering-complex',
    name: 'Engineering Complex',
    description: 'State-of-the-art engineering laboratories and lecture halls for aeronautical and mechanical engineering programs.',
    capacity: 800,
    yearBuilt: 2005,
    coordinates: [7.1785, 3.3788],
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    type: 'academic',
    facilities: ['CAD Labs', 'Workshop', 'Research Labs', 'Lecture Theatres'],
    events: []
  },
  {
    id: 'sports-stadium',
    name: 'AFIT Sports Stadium',
    description: 'Multi-purpose stadium for football, athletics, and major sporting events.',
    capacity: 5000,
    yearBuilt: 2000,
    coordinates: [7.1770, 3.3800],
    images: ['/placeholder.svg', '/placeholder.svg'],
    type: 'recreational',
    facilities: ['Football Pitch', 'Athletics Track', 'Gymnasium', 'Swimming Pool'],
    events: [
      {
        id: 'football-trials',
        title: 'Football Trials',
        description: 'Annual football team selection trials',
        startTime: '2024-06-15T16:00:00',
        endTime: '2024-06-15T18:00:00',
        buildingId: 'sports-stadium',
        notificationLeadTime: 30
      }
    ]
  },
  {
    id: 'command-building',
    name: 'Command Building',
    description: 'Administrative headquarters housing the Commandant\'s office and senior staff.',
    coordinates: [7.1788, 3.3790],
    images: ['/placeholder.svg'],
    type: 'administrative',
    facilities: ['Commandant Office', 'Registry', 'Admin Offices'],
    events: []
  }
];
