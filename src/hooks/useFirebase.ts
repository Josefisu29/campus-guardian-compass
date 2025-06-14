
import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  updateDoc, 
  increment 
} from 'firebase/firestore';
import { db } from '../config/firebase';
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

  // Listen to alerts collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'alerts'), (snapshot) => {
      const alertsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Alert[];
      setAlerts(alertsData);
    });

    return () => unsubscribe();
  }, []);

  // Listen to incidents collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'incidents'), (snapshot) => {
      const incidentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Incident[];
      setIncidents(incidentsData);
    });

    return () => unsubscribe();
  }, []);

  const updateUserPoints = async (points: number) => {
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), {
        points: increment(points)
      });
      console.log(`User earned ${points} points`);
    }
  };

  const addIncident = async (incident: Omit<Incident, 'id' | 'timestamp' | 'reportedBy'>) => {
    if (user) {
      await addDoc(collection(db, 'incidents'), {
        ...incident,
        timestamp: new Date().toISOString(),
        reportedBy: user.uid
      });
    }
  };

  const addAlert = async (alert: Omit<Alert, 'id' | 'timestamp'>) => {
    await addDoc(collection(db, 'alerts'), {
      ...alert,
      timestamp: new Date().toISOString()
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
