// src/services/calendarService.ts
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// src/models/TopEvent.ts
export interface TopEvent {
    _id: string;
    title: string;
    displayed_location?: string;
    thumbnail_url?: string;
    analytics_identifier?: string;
    url: string;
    time_left_to_submission?: string;
    submission_period_dates: string;
    themes?: string[];
    prize_amount?: string;
    registrations_count?: number;
    featured?: boolean;
    organization_name?: string;
    winners_announced?: boolean;
    start_a_submission_url?: string;
    invite_only?: boolean;
    eligibility_requirement_invite_only_description?: string | null;
  }
  
  const parseDateRange = (dateRangeStr: string): { startDateTime: string; endDateTime: string } => {
    const [startDate, endDate] = dateRangeStr.split(' - ');
  
    const start = parseDate(startDate);
    const end = endDate ? parseDate(endDate) : new Date(new Date(start).getTime() + 3600000).toISOString(); // Default to 1-hour duration
  
    return { startDateTime: start, endDateTime: end };
  };
  
  const parseDate = (dateStr: string): string => {
    const [day, month, year] = dateStr.split('.').map(Number);
    const date = new Date(year, month - 1, day); // months are 0-based
    return date.toISOString();
  };

const calendar = google.calendar('v3');
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);


export const createCalendarEvent = async (event: TopEvent, accessToken: string) => {
    if (!event.submission_period_dates) {
        throw new Error('Event does not have a submission_period_dates property');
      }
    
      oauth2Client.setCredentials({ access_token: accessToken });

      let startDateTime: string;
      let endDateTime: string;


      if (event.submission_period_dates.includes(' - ')) {
        // Handle date range
        const { startDateTime: start, endDateTime: end } = parseDateRange(event.submission_period_dates);
        startDateTime = start;
        endDateTime = end;
      } else {
        // Handle single date
        startDateTime = parseDate(event.submission_period_dates);
        endDateTime = new Date(new Date(startDateTime).getTime() + 3600000).toISOString(); // Default to 1-hour duration
      }
    
  const eventPayload = {
    summary: event.title,
    location: event.displayed_location,
    description: event.analytics_identifier,
    start: {
      dateTime: startDateTime,
      timeZone: 'Asia/Almaty',
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'Asia/Almaty',
    },
    // Add other event properties as needed
  };

  try {
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      requestBody: eventPayload,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    throw error;
  }
};


