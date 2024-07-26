'use client';

'use client';

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {v4 as uuidv4} from 'uuid';

interface Hackathon {
  title: string;
  displayed_location: {
    location: string;
  };
  url: string;
  prize_amount: string;
  rules: string;
  time_left_to_submission: string;
  submission_period_dates: string;
  thumbnail_url: string;
  themes: {
    id: number;
    name: string;
  }[];
  _id: string;
}

const EventDetails = ({ hackathon }: { hackathon: Hackathon }) => {
  const [todoList, setTodoList] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTodoList = async (hackathonId: string) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/v1/embeddings/query-todo', { hackathonId });
      const todoString = response.data.todoList;
      const todoArray = todoString
        .split('\n')
        .filter((item: string) => item.trim() !== '')
        .map((item: string) => ({ id: uuidv4(), text: item, completed: false })); // Use uuid for unique ids
      setTodoList(todoArray);
    } catch (error) {
      console.error('Error generating To-Do list:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTodoList([...todoList, { id: uuidv4(), text: newTask, completed: false }]); // Use uuid for unique ids
      setNewTask('');
    }
  };

  const toggleTaskCompletion = (id: string) => {
    setTodoList(todoList.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTodoList(todoList.filter((task) => task.id !== id));
  };


  return (
    <main className="flex-1">
      <section className="py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">About the Hackathon</h2>
              <p className="text-muted-foreground">
                SummerHacks By YCW is an exciting hackathon that encourages participants to build innovative projects
                using the latest technologies. With a focus on beginner-friendly, low/no-code, and open-ended themes,
                this event is perfect for developers of all skill levels.
              </p>
              <p className="text-muted-foreground">
                The hackathon is hosted by YCW, a leading organization dedicated to empowering the next generation of
                technologists. Participants will have the opportunity to showcase their skills, network with industry
                professionals, and compete for a total prize pool of $10,380.
              </p>
            </div>
            <div className="grid gap-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Key Details</h2>
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span className="font-medium">Submission Period:</span>
                  <span>{hackathon.submission_period_dates}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5" />
                  <span className="font-medium">Time Left to Submit:</span>
                  <span>{hackathon.time_left_to_submission}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AwardIcon className="w-5 h-5" />
                  <span className="font-medium">Total Prize:</span>
                  <span>{hackathon.prize_amount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FlagIcon className="w-5 h-5" />
                  <span className="font-medium">Event Status:</span>
                  <span>Open</span>
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Get Involved</h2>
              <p className="text-muted-foreground">
                If you're interested in participating in SummerHacks By YCW, visit the event website to learn more and
                submit your project. You can also follow us on social media to stay up-to-date with the latest news
                and updates.
              </p>
              <div className="flex gap-2">
              <button
                  onClick={() => fetchTodoList(hackathon._id)}

                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Generate To-Do List
                </button>
                <Link
                  href={hackathon.url}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-6 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/90 border"
                >
                  Visit Website
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {loading ? (
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">To-Do List</h2>
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
    </main>
  );
};

export default EventDetails;



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


