import axios from "axios";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface Event1 {
  _id: string;
  title: string;
  description?: string;
  displayed_location?: {
    location: string;
  };
  open_state?: boolean;
  thumbnail_url?: string;
  url?: string;
  time_left_to_submission?: string;
  submission_period_dates?: string;
  themes?: { name: string }[];
  prize_amount?: number;
  registrations_count?: number;
  featured?: boolean;
  organization_name?: string;
  winners_announced?: boolean;
  submission_gallery_url?: string;
  start_a_submission_url?: string;
  invite_only?: boolean;
  eligibility_requirement_invite_only_description?: string;
  managed_by_devpost_badge?: boolean;
  category?: string;
}

export const fetchEvent = async (id: string): Promise<Event1> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/events/${id}`);
    return response.data; // Assuming the response.data contains the event object
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error; // Propagate the error to handle it in the calling code
  }
};
