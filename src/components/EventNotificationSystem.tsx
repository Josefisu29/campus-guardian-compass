
import React, { useEffect, useState } from 'react';
import { Event } from '../data/afitBuildings';
import { useToast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';

interface EventNotificationSystemProps {
  events: Event[];
}

const EventNotificationSystem = ({ events }: EventNotificationSystemProps) => {
  const { toast } = useToast();
  const [notifiedEvents, setNotifiedEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkUpcomingEvents = () => {
      const now = new Date();
      
      events.forEach(event => {
        if (notifiedEvents.has(event.id)) return;
        
        const eventStart = new Date(event.startTime);
        const notificationTime = new Date(eventStart.getTime() - (event.notificationLeadTime * 60 * 1000));
        
        if (now >= notificationTime && now < eventStart) {
          // Show notification
          toast({
            title: "🔔 Upcoming Event",
            description: `${event.title} starts in ${event.notificationLeadTime} minutes!`,
            duration: 10000,
          });
          
          // Request permission for browser notifications
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`AFIT Event Reminder`, {
              body: `${event.title} starts in ${event.notificationLeadTime} minutes!`,
              icon: '/favicon.ico',
              tag: event.id
            });
          }
          
          setNotifiedEvents(prev => new Set([...prev, event.id]));
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkUpcomingEvents, 60000);
    
    // Check immediately
    checkUpcomingEvents();
    
    return () => clearInterval(interval);
  }, [events, notifiedEvents, toast]);

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return null; // This component doesn't render anything visible
};

export default EventNotificationSystem;
