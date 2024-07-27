'use client'
import { useState, useEffect } from 'react';

interface Hackathon {
    _id: string;
    title: string;
    displayed_location?: { location: string };
    thumbnail_url?: string;
    url: string;
    prize_amount?: string;
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
