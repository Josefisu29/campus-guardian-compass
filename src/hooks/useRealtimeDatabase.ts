
import { useState, useEffect } from 'react';
import { ref, push, onValue, off, update, serverTimestamp } from 'firebase/database';
import { rtdb } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import geofenceConfig from '../config/geofence.json';

interface RealtimeData {
  alerts: Alert[];
  incidents: Incident[];
  onlineUsers: OnlineUser[];
  campusEvents: CampusEvent[];
}

interface Alert {
  id: string;
  message: string;
  coords: [number, number];
  timestamp: string;
  type: 'safety' | 'emergency' | 'maintenance' | 'event';
}

interface Incident {
  id: string;
  title: string;
  description: string;
  location: string;
  coords: [number, number];
  timestamp: string;
  reportedBy: string;
  status: 'reported' | 'investigating' | 'resolved';
}

interface OnlineUser {
  id: string;
  displayName: string;
  lastSeen: string;
  location?: string;
}

interface CampusEvent {
  id: string;
  title: string;
  description: string;
  buildingId: string;
  startTime: string;
  endTime: string;
  notificationLeadTime: number;
}

export const useRealtimeDatabase = () => {
  const [data, setData] = useState<RealtimeData>({
    alerts: [],
    incidents: [],
    onlineUsers: [],
    campusEvents: []
  });
  const { user } = useAuth();

  useEffect(() => {
    // Listen to alerts
    const alertsRef = ref(rtdb, 'alerts');
    const alertsUnsubscribe = onValue(alertsRef, (snapshot) => {
      const alertsData: Alert[] = [];
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach(key => {
          alertsData.push({
            id: key,
            ...data[key]
          });
        });
      }
      setData(prev => ({ ...prev, alerts: alertsData }));
    });

    // Listen to incidents
    const incidentsRef = ref(rtdb, 'incidents');
    const incidentsUnsubscribe = onValue(incidentsRef, (snapshot) => {
      const incidentsData: Incident[] = [];
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach(key => {
          incidentsData.push({
            id: key,
            ...data[key]
          });
        });
      }
      setData(prev => ({ ...prev, incidents: incidentsData }));
    });

    // Listen to online users
    const usersRef = ref(rtdb, 'onlineUsers');
    const usersUnsubscribe = onValue(usersRef, (snapshot) => {
      const usersData: OnlineUser[] = [];
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach(key => {
          if (data[key].isOnline) {
            usersData.push({
              id: key,
              displayName: data[key].displayName || data[key].email || 'Anonymous',
              lastSeen: data[key].lastSeen || new Date().toISOString()
            });
          }
        });
      }
      setData(prev => ({ ...prev, onlineUsers: usersData }));
    });

    // Listen to campus events
    const eventsRef = ref(rtdb, 'events');
    const eventsUnsubscribe = onValue(eventsRef, (snapshot) => {
      const eventsData: CampusEvent[] = [];
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach(key => {
          eventsData.push({
            id: key,
            ...data[key]
          });
        });
      }
      setData(prev => ({ ...prev, campusEvents: eventsData }));
    });

    // Set user as online when hook mounts
    if (user) {
      const userStatusRef = ref(rtdb, `onlineUsers/${user.uid}`);
      update(userStatusRef, {
        isOnline: true,
        lastSeen: serverTimestamp(),
        displayName: user.name || user.email,
        email: user.email
      });
    }

    return () => {
      // Cleanup listeners
      off(alertsRef, 'value', alertsUnsubscribe);
      off(incidentsRef, 'value', incidentsUnsubscribe);
      off(usersRef, 'value', usersUnsubscribe);
      off(eventsRef, 'value', eventsUnsubscribe);

      // Set user as offline when hook unmounts
      if (user) {
        const userStatusRef = ref(rtdb, `onlineUsers/${user.uid}`);
        update(userStatusRef, {
          isOnline: false,
          lastSeen: serverTimestamp()
        });
      }
    };
  }, [user]);

  const addAlert = async (alert: Omit<Alert, 'id' | 'timestamp'>) => {
    const alertsRef = ref(rtdb, 'alerts');
    await push(alertsRef, {
      ...alert,
      timestamp: new Date().toISOString(),
      createdAt: serverTimestamp()
    });
  };

  const addIncident = async (incident: Omit<Incident, 'id' | 'timestamp' | 'reportedBy' | 'status'>) => {
    if (user) {
      const incidentsRef = ref(rtdb, 'incidents');
      await push(incidentsRef, {
        ...incident,
        timestamp: new Date().toISOString(),
        reportedBy: user.uid,
        status: 'reported',
        createdAt: serverTimestamp()
      });
    }
  };

  const addCampusEvent = async (event: Omit<CampusEvent, 'id'>) => {
    const eventsRef = ref(rtdb, 'events');
    await push(eventsRef, {
      ...event,
      createdAt: serverTimestamp()
    });
  };

  // Helper function to get building name by coordinates
  const getBuildingByCoords = (coords: [number, number]): string => {
    const building = geofenceConfig.locations.find(loc => 
      Math.abs(loc.lat - coords[0]) < 0.0001 && Math.abs(loc.lng - coords[1]) < 0.0001
    );
    return building ? building.name : 'Unknown Location';
  };

  // Helper function to check if coordinates are within AFIT campus
  const isWithinCampus = (coords: [number, number]): boolean => {
    const campusCenter = [geofenceConfig.center.latitude, geofenceConfig.center.longitude];
    const maxRadius = Math.max(...geofenceConfig.radii);
    
    // Simple distance calculation (Haversine formula simplified)
    const deltaLat = coords[0] - campusCenter[0];
    const deltaLng = coords[1] - campusCenter[1];
    const distance = Math.sqrt(deltaLat * deltaLat + deltaLng * deltaLng) * 111000; // Convert to meters
    
    return distance <= maxRadius;
  };

  return {
    ...data,
    addAlert,
    addIncident,
    addCampusEvent,
    getBuildingByCoords,
    isWithinCampus,
    campusCenter: [geofenceConfig.center.latitude, geofenceConfig.center.longitude] as [number, number],
    campusBuildings: geofenceConfig.locations
  };
};
