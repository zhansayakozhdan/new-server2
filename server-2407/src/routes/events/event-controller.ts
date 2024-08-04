import { Request, Response } from 'express';
import EventService from './event-service';
import { createCalendarEvent, TopEvent } from './calendar-service';

class EventController {
  private eventService: EventService;

  constructor(eventService: EventService) {
    this.eventService = eventService;
  }

//   async addEventToCalendar(req: Request, res: Response): Promise<void> {
//     const { userId, title, date, description, location } = req.body;

//     if (!userId || !title || !date) {
//         res.status(400).json({ error: 'Missing required fields: userId, title, and date are required.' });
//         return;
//     }

//     if (typeof userId !== 'string' || userId.length !== 24) {
//         res.status(400).json({ error: 'Invalid userId format' });
//         return;
//     }

//     try {
//         const eventId = await this.eventService.addEventToCalendar(userId, {
//             title,
//             date,
//             description,
//             location,
//         });

//         res.status(200).json({ eventId });
//     } catch (error) {
//         console.error('Error adding event to calendar:', error);
//         res.status(500).json({ error: 'Failed to add event to calendar' });
//     }
// }
  

  getAllEvents = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    try {
      const events = await this.eventService.getAllEvents(page, limit);
      res.status(200).json(events);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ message: 'Error getting all events', error: errorMessage });
    }
  }

  getEventById = async (req: Request, res: Response) => {
    const eventId = req.params.id;

    try {
      const event = await this.eventService.getEventById(eventId);
      res.status(200).json(event);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ message: 'Error getting event by ID', error: errorMessage });
    }
  }


  public getEventByUrl = async (req: Request, res: Response) => {
    try {
      const url = req.query.url as string;
      if (!url) {
        return res.status(400).json({ error: 'URL parameter is missing' });
      }
      console.log(`Fetching event by URL: ${url}`);
      const event = await this.eventService.getEventByUrl(url);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      res.status(200).json(event);
    } catch (error) {
      console.error('Error getting event by URL:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  getSuitableEvents = async (req: Request, res: Response) => {
    const { query } = req.body;

    try {
      const result = await this.eventService.getSuitableEvents(query);
      res.status(200).json(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      res.status(500).json({ message: 'Error querying embeddings', error: errorMessage });
    }
  }


  public generateTodoList = async (req: Request, res: Response): Promise<void> => {
    const { eventId } = req.body;
  
    if (!eventId || typeof eventId !== 'string') {
      res.status(400).json({ error: 'Hackathon ID is required and must be a string' });
      return;
    }
  
    try {
      const todoList = await this.eventService.generateTodoList(eventId);
  
      if (!todoList) {
        res.status(404).json({ error: 'Todo list could not be generated' });
        return;
      }
  
      res.status(200).json({ todoList });
    } catch (err) {
      console.error('Error generating TO-DO list:', err);
  
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
  
}

export default EventController;
