import { Request, Response } from 'express';
import EventService from './event-service';

class EventController {
  private eventService: EventService;

  constructor(eventService: EventService) {
    this.eventService = eventService;
  }

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
}

export default EventController;
