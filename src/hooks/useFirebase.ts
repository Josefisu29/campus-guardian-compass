
import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc, 
  increment 
} from 'firebase/firestore';
import { 
  ref, 
  push, 
  onValue, 
  update,
  serverTimestamp,
  off
} from 'firebase/database';
import { db, rtdb } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

interface Alert {
  id: string;
  message: string;
  coords: [number, number];
  timestamp: string;
  type?: string;
}

interface Incident {
  id: string;
  title: string;
  description: string;
  location: string;
  coords: [number, number];
  timestamp: string;
  reportedBy: string;
}

export const useFirebase = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const { user } = useAuth();
  const userPoints = user?.points || 0;

  // Listen to alerts from Realtime Database
  useEffect(() => {
    const alertsRef = ref(rtdb, 'alerts');
    
    const unsubscribe = onValue(alertsRef, (snapshot) => {
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
      setAlerts(alertsData);
    });

    return () => off(alertsRef, 'value', unsubscribe);
  }, []);

  // Listen to incidents from Realtime Database
  useEffect(() => {
    const incidentsRef = ref(rtdb, 'incidents');
    
    const unsubscribe = onValue(incidentsRef, (snapshot) => {
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
      setIncidents(incidentsData);
    });

    return () => off(incidentsRef, 'value', unsubscribe);
  }, []);

  const updateUserPoints = async (points: number) => {
    if (user) {
      // Update in Firestore for user profile
      await updateDoc(doc(db, 'users', user.uid), {
        points: increment(points)
      });
      
      // Also update in Realtime Database for real-time sync
      const userRef = ref(rtdb, `users/${user.uid}/points`);
      await update(userRef, {
        points: (userPoints + points),
        lastUpdated: serverTimestamp()
      });
      
      console.log(`User earned ${points} points`);
    }
  };

  const addIncident = async (incident: Omit<Incident, 'id' | 'timestamp' | 'reportedBy'>) => {
    if (user) {
      const incidentsRef = ref(rtdb, 'incidents');
      await push(incidentsRef, {
        ...incident,
        timestamp: new Date().toISOString(),
        reportedBy: user.uid,
        createdAt: serverTimestamp()
      });
    }
  };

  const addAlert = async (alert: Omit<Alert, 'id' | 'timestamp'>) => {
    const alertsRef = ref(rtdb, 'alerts');
    await push(alertsRef, {
      ...alert,
      timestamp: new Date().toISOString(),
      createdAt: serverTimestamp()
    });
  };

  return {
    alerts,
    incidents,
    userPoints,
    updateUserPoints,
    addIncident,
    addAlert
  };
};
