
import { useState, useEffect } from 'react';
import { 
  ref, 
  push, 
  onValue, 
  update,
  remove,
  serverTimestamp,
  off,
  set
} from 'firebase/database';
import { rtdb } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Building, Event } from '../data/afitBuildings';

interface RealtimeUser {
  uid: string;
  email: string;
  role: 'admin' | 'student' | 'staff';
  name: string;
  points?: number;
  badges?: string[];
  assignedBuildings?: string[];
  isOnline: boolean;
  lastSeen: string;
}

export const useRealtimeDatabase = () => {
  const [onlineUsers, setOnlineUsers] = useState<RealtimeUser[]>([]);
  const [realtimeEvents, setRealtimeEvents] = useState<Event[]>([]);
  const [realtimeBuildings, setRealtimeBuildings] = useState<Building[]>([]);
  const { user } = useAuth();

  // Track online users
  useEffect(() => {
    const usersRef = ref(rtdb, 'onlineUsers');
    
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const usersData: RealtimeUser[] = [];
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach(key => {
          usersData.push({
            uid: key,
            ...data[key]
          });
        });
      }
      setOnlineUsers(usersData);
    });

    return () => off(usersRef, 'value', unsubscribe);
  }, []);

  // Listen to real-time events
  useEffect(() => {
    const eventsRef = ref(rtdb, 'events');
    
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      const eventsData: Event[] = [];
      if (snapshot.exists()) {
        const data = snapshot.val();
        Object.keys(data).forEach(key => {
          eventsData.push({
            id: key,
            ...data[key]
          });
        });
      }
      setRealtimeEvents(eventsData);
    });

    return () => off(eventsRef, 'value', unsubscribe);
  }, []);

  // Set user online status
  const setUserOnline = async () => {
    if (user) {
      const userStatusRef = ref(rtdb, `onlineUsers/${user.uid}`);
      await set(userStatusRef, {
        email: user.email,
        role: user.role,
        name: user.name,
        isOnline: true,
        lastSeen: serverTimestamp()
      });
    }
  };

  // Set user offline status
  const setUserOffline = async () => {
    if (user) {
      const userStatusRef = ref(rtdb, `onlineUsers/${user.uid}`);
      await update(userStatusRef, {
        isOnline: false,
        lastSeen: serverTimestamp()
      });
    }
  };

  // Add real-time event
  const addRealtimeEvent = async (event: Omit<Event, 'id'>) => {
    const eventsRef = ref(rtdb, 'events');
    await push(eventsRef, {
      ...event,
      createdAt: serverTimestamp(),
      createdBy: user?.uid
    });
  };

  // Update real-time event
  const updateRealtimeEvent = async (eventId: string, updates: Partial<Event>) => {
    const eventRef = ref(rtdb, `events/${eventId}`);
    await update(eventRef, {
      ...updates,
      updatedAt: serverTimestamp(),
      updatedBy: user?.uid
    });
  };

  // Delete real-time event
  const deleteRealtimeEvent = async (eventId: string) => {
    const eventRef = ref(rtdb, `events/${eventId}`);
    await remove(eventRef);
  };

  // Send real-time notification
  const sendRealtimeNotification = async (notification: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'emergency';
    targetUsers?: string[];
  }) => {
    const notificationsRef = ref(rtdb, 'notifications');
    await push(notificationsRef, {
      ...notification,
      timestamp: serverTimestamp(),
      sentBy: user?.uid,
      isRead: false
    });
  };

  return {
    onlineUsers,
    realtimeEvents,
    realtimeBuildings,
    setUserOnline,
    setUserOffline,
    addRealtimeEvent,
    updateRealtimeEvent,
    deleteRealtimeEvent,
    sendRealtimeNotification
  };
};
