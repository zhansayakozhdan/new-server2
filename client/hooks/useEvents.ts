'use client'
import { Event1 } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface Hackathon {
    _id: string;
    title: string;
    displayed_location?: { location: string };
    thumbnail_url?: string;
    url: string;
    prize_amount?: string;
}

interface Event {
    _id: string;
    title: string;
    displayed_location?: { location: string };
    thumbnail_url?: string;
    url: string;
    prize_amount?: string;
    description?: string;
}

export const useEvents = (page: number, limit: number) => {
    const [events, setEvents] = useState<Hackathon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/events?page=${page}&limit=${limit}`);
                const data = await response.json();
                setEvents(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching events:', error);
                setLoading(false);
            }
        };

        fetchEvents();
    }, [page, limit]);

    return { events, loading };
};

export const useEvent = (id: string) => {
    const [event, setEvent] = useState<Event1 | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchEvent = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/events/${id}`);
          if (!response.ok) {
            throw new Error(`Error fetching event: ${response.statusText}`);
          }
          const data: Event1 = await response.json();
          setEvent(data);
        } catch (error) {
          console.error('Error fetching event:', error);
          setError('Failed to fetch event');
        } finally {
          setLoading(false);
        }
      };
  
      if (id) {
        fetchEvent();
      }
    }, [id]);
  
    return { event, loading, error };
  };
