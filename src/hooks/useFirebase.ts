
import { useState, useEffect } from 'react';

// Mock Firebase hook for demonstration
// In a real implementation, this would connect to Firebase Firestore
export const useFirebase = () => {
  const [alerts, setAlerts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [userPoints, setUserPoints] = useState(0);

  // Simulate real-time data updates
  useEffect(() => {
    // Simulate loading initial data
    const timer = setTimeout(() => {
      setAlerts([
        {
          id: 1,
          message: 'Construction work near Science Building',
          coords: [37.423, -122.085],
          timestamp: new Date().toISOString()
        }
      ]);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const updateUserPoints = (points) => {
    setUserPoints(prev => prev + points);
    // In a real app, this would update Firebase Firestore
    console.log(`User earned ${points} points`);
  };

  const addIncident = (incident) => {
    setIncidents(prev => [...prev, { ...incident, id: Date.now() }]);
    // In a real app, this would save to Firebase Firestore
  };

  const addAlert = (alert) => {
    setAlerts(prev => [...prev, { ...alert, id: Date.now() }]);
    // In a real app, this would save to Firebase Firestore
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
