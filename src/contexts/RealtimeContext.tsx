import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface RealtimeContextType {
  isConnected: boolean;
  lastUpdate: Date | null;
}

const RealtimeContext = createContext<RealtimeContextType>({
  isConnected: false,
  lastUpdate: null,
});

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

interface RealtimeProviderProps {
  children: React.ReactNode;
}

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to realtime changes on profiles table
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Profile updated:', payload);
          setLastUpdate(new Date());
          
          // Show toast notification for profile updates
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Member Joined",
              description: `${payload.new.first_name} ${payload.new.last_name} has joined Lambda Empire`,
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: "Member Profile Updated",
              description: `${payload.new.first_name} ${payload.new.last_name}'s profile has been updated`,
            });
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          console.log('Connected to realtime profiles updates');
        } else if (status === 'CLOSED') {
          setIsConnected(false);
          console.log('Disconnected from realtime updates');
        }
      });

    // Subscribe to other tables as needed
    const eventsChannel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          console.log('Event updated:', payload);
          setLastUpdate(new Date());
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: "New Event Created",
              description: `${payload.new.title} has been scheduled`,
            });
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(eventsChannel);
    };
  }, [toast]);

  return (
    <RealtimeContext.Provider value={{ isConnected, lastUpdate }}>
      {children}
    </RealtimeContext.Provider>
  );
};