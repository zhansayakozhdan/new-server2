// src/controllers/eventController.ts
import { Request, Response } from 'express';
import { createCalendarEvent, TopEvent } from './calendar-service';


export const addEventToCalendar = async (req: Request, res: Response) => {
  const { accessToken, event }: { accessToken: string; event: TopEvent } = req.body;

  try {
    const calendarEvent = await createCalendarEvent(event, accessToken);
    res.status(201).json(calendarEvent);
  } catch (error) {
    console.error('Error adding event to calendar:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
