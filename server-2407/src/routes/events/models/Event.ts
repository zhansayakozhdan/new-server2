import { Schema, model } from 'mongoose';

export interface IEvent {
    title: string;
    description?: string;
    url?: string;
    imageUrl?: string;
    displayed_location?: {
      icon?: string;
      location?: string;
    };
    open_state?: string;
    thumbnail_url?: string;
    time_left_to_submission?: string;
    submission_period_dates?: string;
    themes?: Array<{
      id: number;
      name: string;
    }>;
    prize_amount?: string;
    registrations_count?: number;
    organization_name?: string;
    invite_only?: boolean;
    eligibility_requirement_invite_only_description?: string | null;
    featured?: boolean;
    winners_announced?: boolean;
    submission_gallery_url?: string;
    start_a_submission_url?: string;
    rules?: string;
    ourUrl?: string;
    category?: string;
    website?: string;
    twitterLink?: string;
    linkedinLink?: string;
    start?: string;
    end?: string;
    place?: string;
    location?: string;
    stateCategory?: string;
    techTags?: string[];
    language?: string;
    createdAt?: Date;
    updatedAt?: Date;
    embedding: number[];
    embeddings: number[];
  }
  

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, unique: true }, 
  imageUrl: { type: String },
  displayed_location: {
    icon: { type: String },
    location: { type: String },
  },
  open_state: { type: String },
  thumbnail_url: { type: String },
  time_left_to_submission: { type: String },
  submission_period_dates: { type: String },
  themes: [
    {
      id: { type: Number },
      name: { type: String },
    },
  ],
  prize_amount: { type: String },
  registrations_count: { type: Number },
  organization_name: { type: String },
  invite_only: { type: Boolean },
  eligibility_requirement_invite_only_description: { type: String },
  featured: { type: Boolean },
  winners_announced: { type: Boolean },
  submission_gallery_url: { type: String },
  start_a_submission_url: { type: String },
  rules: { type: String },
  ourUrl: { type: String },
  category: { type: String },
  website: { type: String },
  twitterLink: { type: String },
  linkedinLink: { type: String },
  start: { type: String },
  end: { type: String },
  place: { type: String },
  location: { type: String },
  stateCategory: { type: String },
  techTags: { type: [String] },
  language: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  embedding: [Number],
  embeddings: [Number],
});

const Event = model<IEvent>('Event', EventSchema);

export default Event;
