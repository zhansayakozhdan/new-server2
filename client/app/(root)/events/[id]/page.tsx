'use client'
import { notFound } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import EventDetails from '@/components/shared/EventDetails';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { fetchEvent } from '@/lib/utils';
import { useEvent } from '@/hooks/useEvents';
import {v4 as uuidv4} from 'uuid';

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


const EventDetailsPage: FC<{ params: { id: string } }> = ({ params }) => {
  const { id } = params;
  const { event, loading: eventLoading, error } = useEvent(id);
  const [todoList, setTodoList] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  const isHackathon = event?.category === 'Hackathon';

  // const fetchTodoList = async (eventId: string) => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/events/generate-todo`, { eventId });
  //     const todoString = response.data.todoList;
  //     const todoArray = todoString
  //       .split('\n')
  //       .filter((item: string) => item.trim() !== '')
  //       .map((item: string) => ({ id: uuidv4(), text: item, completed: false })); // Use uuid for unique ids
  //     setTodoList(todoArray);
  //   } catch (error) {
  //     console.error('Error generating To-Do list:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const fetchTodoList = async (eventId: string) => {
  //   console.log(event?._id)
  //   console.log(eventId)
  //   if (!eventId) {
  //     console.error('No event ID provided');
  //     return;
  //   }
  
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/events/generate-todo`, { eventId });
  //     const todoString = response.data.todoList;
  //     const todoArray = todoString
  //       .split('\n')
  //       .filter((item: string) => item.trim() !== '')
  //       .map((item: string) => ({ id: uuidv4(), text: item, completed: false }));
  //     setTodoList(todoArray);
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.error('Axios error generating To-Do list:', error.response?.data || error.message);
  //     } else if (error instanceof Error) {
  //       console.error('Error generating To-Do list:', error.message);
  //     } else {
  //       console.error('Unknown error generating To-Do list:', error);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  const addEventToCalendar1 = async (event: Event1) => {
    const accessToken = localStorage.getItem('accessToken');
  
    if (!accessToken) {
      alert('You need to be logged in to add events to the calendar.');
      return;
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/events/add-event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken,
          event,
        }),
      });
  
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to add event to calendar');
        }
  
        alert(`Event successfully added with ID: ${data.id}`);
      } else {
        const text = await response.text();
        console.error('Unexpected response:', text);
        throw new Error('Received non-JSON response from server');
      }
    } catch (error) {
      console.error('Error adding event:', error);
      alert(`Failed to add event to calendar: ${error}`);
    }
  };

  const localStorageKey = `todoList_${id}`;

  useEffect(() => {
    const savedTodoList = localStorage.getItem(localStorageKey);
    if (savedTodoList) {
      try {
        const todoArray = JSON.parse(savedTodoList);
        setTodoList(todoArray);
        console.log('To-Do list loaded from local storage');
      } catch (error) {
        console.error('Error parsing To-Do list from local storage:', error);
      }
    }
  }, [id]);

  const fetchTodoList = async (eventId: string) => {
    console.log('Event ID:', eventId);

    if (!eventId || typeof eventId !== 'string') {
      console.error('No event ID provided or ID is not a string');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/events/generate-todo`, { eventId });
      const todoString = response.data.todoList;
      const todoArray = todoString
        .split('\n')
        .filter((item: string) => item.trim() !== '')
        .map((item: string) => ({ id: uuidv4(), text: item, completed: false }));

      setTodoList(todoArray);

      // Save to local storage
      localStorage.setItem(localStorageKey, JSON.stringify(todoArray));
      console.log('To-Do list saved to local storage');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error generating To-Do list:', error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error('Error generating To-Do list:', error.message);
      } else {
        console.error('Unknown error generating To-Do list:', error);
      }
    } finally {
      setLoading(false);
    }
  };


  const addTask = () => {
    if (newTask.trim() !== '') {
      if (newTask.trim() !== '') {
        const updatedTodoList = [...todoList, { id: uuidv4(), text: newTask, completed: false }];
        setTodoList(updatedTodoList);
  
        // Save the updated list to local storage
        localStorage.setItem(localStorageKey, JSON.stringify(updatedTodoList));
        setNewTask('');
      }
    }
  };

  const toggleTaskCompletion = (id: string) => {
    const updatedTodoList = todoList.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTodoList(updatedTodoList);

    // Save the updated list to local storage
    localStorage.setItem(localStorageKey, JSON.stringify(updatedTodoList));
  };

  const deleteTask = (id: string) => {
    const updatedTodoList = todoList.filter((task) => task.id !== id);
    setTodoList(updatedTodoList);

    // Save the updated list to local storage
    localStorage.setItem(localStorageKey, JSON.stringify(updatedTodoList));
  };

  if (eventLoading) {
    return (
    <div className="flex items-center justify-center h-full">
      <div className="relative w-20 h-20 animate-spin">
      <div className="absolute bg-primary rounded-full" />
      <div className="absolute bg-background rounded-full flex items-center justify-center">
      <RocketIcon className="w-8 h-8 text-primary" />
      </div>
      </div>
    </div>
      )
    }

  if (error) {
    return <div>{error}</div>;
  }

  if (!event) {
    return <div>No event found</div>;
  }

  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:order-2">
            <Image
              src={event.thumbnail_url ? event.thumbnail_url.startsWith('//') ? `https:${event.thumbnail_url}` : event.thumbnail_url : '/assets/images/example1.jpg'} // Default placeholder image
              alt={event.title || 'Event Image'} // Improved alt text
              className="w-full h-auto rounded-lg object-cover"
              width={600}
              height={400}
              style={{ aspectRatio: "600/400", objectFit: "cover" }}
            />
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{event.title}</h1>
              <p className="text-muted-foreground text-lg">
                <CalendarIcon className="w-5 h-5 inline-block mr-2" />
                {event.submission_period_dates || 'Dates not available'}
              </p>
              <p className="text-muted-foreground text-lg">
                <MapPinIcon className="w-5 h-5 inline-block mr-2" />
                {event.displayed_location ? event.displayed_location.location : 'Location not specified'}
              </p>
            </div>
            <div className="prose max-w-none">
              <p>{event.description || 'No description available'}</p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
          <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => addEventToCalendar1(event)}>
            <CalendarCheckIcon className="w-5 h-5 mr-2" />
            Добавить в календарь
          </Button>
          <Link href={event.url || '#'} className="">  
          <Button variant="outline" className="flex-1 sm:flex-none w-full">
            <ExternalLinkIcon className="w-5 h-5 mr-2" />
            Перейти на страницу оригинала
            </Button>
          </Link>
           {/* Generate Todo List Button - Shown only if category is Hackathon */}
           {isHackathon && (
                <Button variant="outline" 
                className="flex-1 sm:flex-none" 
                onClick={() => fetchTodoList(event._id)}
                >
                <ListIcon className="w-5 h-5 mr-2" />
                Генерировать план подготовки
              </Button>
            )}
        </div>
      </div>
      {/* {event && <EventDetails event={event}/>} */}

      {loading ? (
        <div className="flex items-center justify-center h-full">
        <div className="relative w-20 h-20 animate-spin">
        <div className="absolute bg-primary rounded-full" />
        <div className="absolute bg-background rounded-full flex items-center justify-center">
        <RocketIcon className="w-8 h-8 text-primary" />
        </div>
        </div>
        </div>
      ) : (
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-4">
              <h2 className="text-3xl font-bold sm:text-4xl">План подготовки</h2>
              <div className="flex items-center mb-4">
                <Input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task"
                  className="flex-1 mr-2 bg-muted text-muted-foreground"
                />
                <Button onClick={addTask}>Add</Button>
              </div>
              <div className="h-[400px] overflow-auto">
                <ul className="space-y-2">
                  {todoList.map((task) => (
                    <li key={task.id} className="flex items-center justify-between bg-muted rounded-md px-4 py-2">
                      <div className="flex items-center">
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                        />
                        <label
                          htmlFor={`task-${task.id}`}
                          className={`ml-2 text-muted-foreground ${task.completed ? 'line-through' : ''}`}
                        >
                          {task.text}
                        </label>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                        <Trash2Icon className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};


function CalendarCheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m9 16 2 2 4-4" />
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

function Trash2Icon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  )
}


function ExternalLinkIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  )
}


function ListIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  )
}


function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function RocketIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  )
}

// const fetchEvent = async (id: string): Promise<Event> => {
//   try {
//     const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_API_URL}/events/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching hackathon:', error);
//     throw new Error('Failed to fetch hackathon data');
//   }
// };

// const EventDetailsPage: FC<{ params: { id: string } }> = async ({ params }) => {
//   const { id } = params;
//   const event = await fetchEvent(id);

//   return(
//     <>
//     <EventDetails event={event} />
//     </>
//   )

  // try {
  //   const event = await fetchEvent(id);

    // return (
    //   <div className="flex flex-col min-h-screen">
    //     <section className="bg-gradient-to-r from-primary to-primary-foreground py-12 md:py-24 lg:py-32">
    //     <div className="container px-4 md:px-6">
    //       <div className="grid gap-6 md:grid-cols-[1fr_400px] md:gap-12">
    //         <div className="space-y-4">
    //           <h1 className="text-4xl font-bold tracking-tighter text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl">
    //           {event.title}
    //           </h1>
    //           <div className="flex flex-col gap-2 text-primary-foreground">
    //             <div className="flex items-center gap-2">
    //             <CalendarIcon className="w-5 h-5" />
    //             <span>Submission Period: {event.submission_period_dates}</span>
    //             </div>
    //             <div className="flex items-center gap-2">
    //             <ClockIcon className="w-5 h-5" />
    //             <span>Time Left to Submit: {event.time_left_to_submission}</span>
    //             </div>
    //             <div className="flex items-center gap-2">
    //             <AwardIcon className="w-5 h-5" />
    //             <span>Total Prize: {event.prize_amount}</span>
    //             </div>
    //             <div className="flex items-center gap-2">
    //             <LocateIcon className="w-5 h-5" />
    //             <span>{event.displayed_location ? event.displayed_location.location : 'не указано'}</span>
    //             </div>
    //             <div className="flex items-center gap-2 text-sm font-medium">
    //           <FlagIcon className="w-5 h-5" />
    //           <span>Event Status: Open</span>
    //         </div>
    //           </div>
    //         </div>
    //         <div className="flex flex-col items-start gap-4 md:items-center md:justify-center md:h-full">
    //           <Button className="px-8 py-4 text-lg">Generate To-Do List</Button>
    //         </div>
    //       </div>
    //     </div>
    //   </section>
        
    //   <section className="py-12 md:py-24 lg:py-32">
    //     <div className="container px-4 md:px-6">
    //       <div className="grid gap-6 md:grid-cols-[1fr_400px] md:gap-12">
    //         <div>
    //           <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About the Event</h2>
              
    //           <p className="mt-4 text-muted-foreground">
    //             Attendees will have the chance to learn from industry experts, connect with like-minded individuals, and
    //             explore new technologies that are shaping the future. Whether you&apos;re a seasoned tech veteran or just
    //             starting your journey, this conference is the perfect place to expand your knowledge, build valuable
    //             connections, and be inspired by the transformative power of technology.
    //           </p>
    //         </div>
    //         {/* <div className="flex flex-col items-start gap-4">
    //           <Image src="${event.thumbnail_url}" width={400} height={300} alt="Event" className="rounded-lg object-cover" />
    //         </div> */}
    //       </div>
    //     </div>
    //     <div className="container px-4 md:px-6">
    //       <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
    //       {/* {hackathon.themes.map(theme => (
    //             <div key={theme.id} className="grid gap-2">
    //             <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">{theme.name}</div>
    //           </div>
    //         ))} */}
            
    //       </div>
    //     </div>
    //     </section>
    //     <EventDetails event={event} />
    //   </div>
    // );
  // } catch (error) {
  //   notFound();
  // }
//};

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
