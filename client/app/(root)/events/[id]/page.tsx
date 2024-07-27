
import { notFound } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { FC } from 'react';
import EventDetails from '@/components/shared/EventDetails';
import { Button } from '@/components/ui/button';
import Image from 'next/image';


interface Event {
  title: string;
  displayed_location?: {
    location: string;
  };
  url: string;
  prize_amount?: string;
  rules?: string;
  time_left_to_submission?: string;
  submission_period_dates?: string;
  thumbnail_url?: string;
  description?: string;
  themes?: {
    id: number;
    name: string;
  }[];
  _id: string;
}

const fetchEvent = async (id: string): Promise<Event> => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching hackathon:', error);
    throw new Error('Failed to fetch hackathon data');
  }
};

const EventDetailsPage: FC<{ params: { id: string } }> = async ({ params }) => {
  const { id } = params;

  try {
    const event = await fetchEvent(id);

    return (
      <div className="flex flex-col min-h-screen">
        <section className="bg-gradient-to-r from-primary to-primary-foreground py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-[1fr_400px] md:gap-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              {event.title}
              </h1>
              <div className="flex flex-col gap-2 text-primary-foreground">
                <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                <span>Submission Period: {event.submission_period_dates}</span>
                </div>
                <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5" />
                <span>Time Left to Submit: {event.time_left_to_submission}</span>
                </div>
                <div className="flex items-center gap-2">
                <AwardIcon className="w-5 h-5" />
                <span>Total Prize: {event.prize_amount}</span>
                </div>
                <div className="flex items-center gap-2">
                <LocateIcon className="w-5 h-5" />
                <span>{event.displayed_location ? event.displayed_location.location : 'не указано'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
              <FlagIcon className="w-5 h-5" />
              <span>Event Status: Open</span>
            </div>
              </div>
            </div>
            <div className="flex flex-col items-start gap-4 md:items-center md:justify-center md:h-full">
              <Button className="px-8 py-4 text-lg">Generate To-Do List</Button>
            </div>
          </div>
        </div>
      </section>
        
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-[1fr_400px] md:gap-12">
            <div>
              <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About the Event</h2>
              <p className="text-muted-foreground">
                The Tech Conference 2024 is a premier event for technology professionals, entrepreneurs, and innovators.
                This three-day conference will feature a wide range of engaging sessions, workshops, and networking
                opportunities, covering the latest trends and advancements in the tech industry.
              </p>
              <p className="mt-4 text-muted-foreground">
                Attendees will have the chance to learn from industry experts, connect with like-minded individuals, and
                explore new technologies that are shaping the future. Whether you&apos;re a seasoned tech veteran or just
                starting your journey, this conference is the perfect place to expand your knowledge, build valuable
                connections, and be inspired by the transformative power of technology.
              </p>
            </div>
            {/* <div className="flex flex-col items-start gap-4">
              <Image src="${event.thumbnail_url}" width={400} height={300} alt="Event" className="rounded-lg object-cover" />
            </div> */}
          </div>
        </div>
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* {hackathon.themes.map(theme => (
                <div key={theme.id} className="grid gap-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">{theme.name}</div>
              </div>
            ))} */}
            
          </div>
        </div>
        </section>
        <EventDetails event={event} />
      </div>
    );
  } catch (error) {
    notFound();
  }
};

export default EventDetailsPage;


function AwardIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
        <circle cx="12" cy="8" r="6" />
      </svg>
    )
  }
  
  
  function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
      </svg>
    )
  }
  
  
  function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    )
  }
  
  
  function FlagIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" x2="4" y1="22" y2="15" />
      </svg>
    )
  }
  
  
  function LocateIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="2" x2="5" y1="12" y2="12" />
        <line x1="19" x2="22" y1="12" y2="12" />
        <line x1="12" x2="12" y1="2" y2="5" />
        <line x1="12" x2="12" y1="19" y2="22" />
        <circle cx="12" cy="12" r="7" />
      </svg>
    )
  }
  
  
  function XIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    )
  }

// 'use client'
// import React, { useState } from 'react';
// import axios from 'axios';

// const EventDetailsPage: React.FC = () => {
//   const [hackathonId, setHackathonId] = useState<string | null>(null);
//   const [eventDetails, setEventDetails] = useState<any>(null);
//   const [todoList, setTodoList] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchEventDetails = async () => {
//     setLoading(true);
//     setError(null);
  
//     try {
//       const response = await axios.get(`http://localhost:5000/api/v1/embeddings/hackathons/${hackathonId}`);
//       setEventDetails(response.data);
//     } catch (err) {
//       setError('Failed to fetch event details');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const generateTodoList = async () => {
//     setLoading(true);
//     setError(null);
  
//     try {
//       const response = await axios.post('http://localhost:5000/api/v1/embeddings/query-todo', {
//         hackathonId,
//       });
  
//       setTodoList(response.data.todoList);
//     } catch (err) {
//       setError('Failed to generate TO-DO list');
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   const handleFetchAndGenerate = async () => {
//     await fetchEventDetails();
//     await generateTodoList();
//   };

//   return (
//     <div>
//       <h1>Event Details Page</h1>
//       <input
//         type="text"
//         placeholder="Enter Hackathon ID"
//         value={hackathonId || ''}
//         onChange={(e) => setHackathonId(e.target.value)}
//       />
//       <button onClick={handleFetchAndGenerate}>Fetch Details & Generate TO-DO</button>

//       {loading && <p>Loading...</p>}
//       {error && <p style={{ color: 'red' }}>{error}</p>}

//       {eventDetails && (
//         <div>
//           <h2>{eventDetails.title}</h2>
//           <p>Location: {eventDetails.displayed_location.location}</p>
//           <p>URL: <a href={eventDetails.url} target="_blank" rel="noopener noreferrer">{eventDetails.url}</a></p>
//           <p>Prize Amount: {eventDetails.prize_amount}</p>
//           <p>Rules: {eventDetails.rules}</p>
//         </div>
//       )}

//       {todoList && (
//         <div>
//           <h2>TO-DO List</h2>
//           <pre>{todoList}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EventDetailsPage;
