import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge"

interface Theme {
  _id: string;
  name: string;
}

interface DisplayedLocation {
  icon: string;
  location: string;
}

interface Hackathon {
  _id: string;
  id: number;
  title: string;
  displayed_location: DisplayedLocation;
  thumbnail_url: string;
  analytics_identifier: string;
  url: string;
  time_left_to_submission: string;
  submission_period_dates: string;
  themes: Theme[];
  prize_amount: string;
  registrations_count: number;
  featured: boolean;
  organization_name: string;
  winners_announced: boolean;
  submission_gallery_url: string;
  start_a_submission_url: string;
  invite_only: boolean;
  eligibility_requirement_invite_only_description: string | null;
  managed_by_devpost_badge: boolean;
  embedding: number[];
  __v: number;
}

interface ApiResponse {
  similarHackathons: Hackathon[];
  highestScoreHackathon: Hackathon;
  answer: string;
}

const HackathonSearch: React.FC = () => {
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [preferences, setPreferences] = useState('');
  //const [query, setQuery] = useState('');
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const exampleQueries = [
    "Возраст: 23; Я из города Алматы; Web developer;",
    "Age: 18; from Shymkent; UX/UI designer;",
  ];

  // const handleExampleClick = (example: string) => {
  //   setQuery(example);
  // };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const response = await axios.post<ApiResponse>('http://localhost:5000/api/v1/embeddings/query-embedding', { query });
  //     setResult(response.data);
  //     setError('');
  //   } catch (err: any) {
  //     console.error('Error fetching data:', err.response?.data || err.message || err);
  //     setError(err.response?.data?.message || 'An error occurred while fetching the data.');
  //     setResult(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleExampleClick = (example: string) => {
    const [queryAge, queryLocation, queryPreferences] = example.split(';').map(part => part.trim());
    setAge(queryAge.replace('Age:', '').trim());
    setLocation(queryLocation.replace('Location:', '').trim());
    setPreferences(queryPreferences.replace('Preferences:', '').trim());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = `${age} ${location} ${preferences}`;
    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>('http://localhost:5000/api/v1/embeddings/query-embedding', { query });
      setResult(response.data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching data:', err.response?.data || err.message || err);
      setError(err.response?.data?.message || 'An error occurred while fetching the data.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCalendar = async (hackathon: Hackathon) => {
    try {
      const [startDate, endDateWithYear] = hackathon.submission_period_dates.split(' - ').map(date => date.trim());
      const [endDate, endYear] = endDateWithYear.split(', ').map(date => date.trim());

      // Assuming startDate is in the format "Jul 21" and endDate is in the format "27"
      const startDateTime = new Date(`${startDate}, ${endYear}`);
      const endMonth = startDate.split(' ')[0]; // Extract the month from the startDate
      const endDateTime = new Date(`${endMonth} ${endDate}, ${endYear}`);

      console.log(`Parsed dates: start - ${startDateTime}, end - ${endDateTime}`);

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        throw new Error('Invalid date format');
      }

      const event = {
        summary: hackathon.title,
        description: hackathon.title, // Example: You can change this to hackathon.description if available
        start: {
          dateTime: startDateTime.toISOString(), // Convert to ISO string
          timeZone: 'Asia/Almaty', // Update with appropriate timezone
        },
        end: {
          dateTime: endDateTime.toISOString(), // Convert to ISO string
          timeZone: 'Asia/Almaty', // Update with appropriate timezone
        },
      };

      await axios.post('http://localhost:5000/api/v1/google-auth/add-to-calendar', { event }, {
        withCredentials: true, // Important for session information transmission
      });

      alert('Event added to Google Calendar');
    } catch (error) {
      console.error('Error adding to Google Calendar:', error);
      alert('Failed to add event to Google Calendar');
    }
  };

  const localizer = momentLocalizer(moment);

  const events: Event[] = result?.similarHackathons.map(hackathon => {
    const [start, end] = hackathon.submission_period_dates.split(' - ').map(date => moment(date, 'YYYY-MM-DD').toDate());
    return {
      title: hackathon.title,
      start,
      end,
      allDay: true,
    };
  }) || [];

  const extractCurrencyValue = (htmlString: string): number => {
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    const span = div.querySelector('span[data-currency-value]');
    if (span) {
      const value = span.textContent || '0';
      return parseFloat(value.replace(/,/g, ''));
    }
    return 0;
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto p-4 mb-12">
        <form onSubmit={handleSubmit} className="mb-2 items-center">
          {/* <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Подобрать персональные мероприятия для меня..."
          className="w-full p-2 border border-gray-300 rounded mb-2"
        /> */}
          <div>
            <input
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Укажите ваш возраст"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Где бы хотели найти IT ивенты"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <textarea
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="Предпочтения, интересы или ваша сфера деятельности"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
          </div>
          <div className="mb-4">
            <div className="flex flex-wrap">
              {exampleQueries.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleExampleClick(example)}
                  className="bg-gray-200 text-gray-800 p-2 rounded mr-2 mb-2"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <button type="submit" className="bg-primary-500 text-white p-2 rounded mb-2 px-20">Подобрать</button>
          </div>
        </form>
      </div>

      {/* <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          /> */}


      <div className="flex flex-col items-center p-4 pt-6">
        <div className="flex items-center justify-between w-full max-w-5xl mb-4">
          <div className="flex items-center space-x-2">
            <Button variant="default">Today</Button>
            <Button variant="default">
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button variant="default">
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-xl font-semibold">July 2024</h2>
          <Button variant="default" className="bg-primary-500">
            Все мероприятия
          </Button>
        </div>
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Badge variant="default" className="bg-green-500">
            Hackathon
          </Badge>
          <Badge variant="default" className="bg-blue-500">
            Meetup
          </Badge>
          <Badge variant="default" className="bg-red-500">
            Conference
          </Badge>
        </div>
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-7 gap-1 text-center">
            <div className="font-semibold">Sunday</div>
            <div className="font-semibold">Monday</div>
            <div className="font-semibold">Tuesday</div>
            <div className="font-semibold">Wednesday</div>
            <div className="font-semibold">Thursday</div>
            <div className="font-semibold">Friday</div>
            <div className="font-semibold">Saturday</div>
            <div className="h-24 bg-gray-100">30</div>
            <div className="h-24">01</div>
            <div className="h-24">02</div>
            <div className="h-24">03</div>
            <div className="h-24">04</div>
            <div className="h-24">05</div>
            <div className="h-24">06</div>
            <div className="h-24">07</div>
            <div className="h-24">08</div>
            <div className="h-24">09</div>
            <div className="h-24">10</div>
            <div className="h-24 relative">
              <div className="absolute inset-0 bg-blue-300 text-white text-xs p-1">DataConnect Conference 2024</div>
            </div>
            <div className="h-24 relative">
              <div className="absolute inset-0 bg-red-300 text-white text-xs p-1">Drupal Camp Asheville 2024</div>
            </div>
            <div className="h-24">13</div>
            <div className="h-24 relative">
              <div className="absolute inset-0 bg-red-300 text-white text-xs p-1">Drupal Camp Asheville 2024</div>
            </div>
            <div className="h-24">15</div>
            <div className="h-24 relative">
              <div className="absolute inset-0 bg-blue-300 text-white text-xs p-1">
                MOMENTUM AI Global Business Summit 2024
              </div>
            </div>
            <div className="h-24 relative">
              <div className="absolute inset-0 bg-red-300 text-white text-xs p-1">WORKTECH24 Chicago</div>
            </div>
            <div className="h-24 relative">
              <div className="absolute inset-0 bg-green-300 text-white text-xs p-1">Phoenix/Scottsdale Cyber...</div>
            </div>
            <div className="h-24">19</div>
            <div className="h-24">20</div>
            <div className="h-24">21</div>
            <div className="h-24">22</div>
            <div className="h-24">23</div>
            <div className="h-24 relative">
              <div className="absolute inset-0 bg-red-300 text-white text-xs p-1">Data Connectors SLED/F...</div>
            </div>
            <div className="h-24">26</div>
            <div className="h-24">27</div>
            <div className="h-24 relative">
              <div className="absolute inset-0 bg-red-300 text-white text-xs p-1">SIGGRAPH 2024</div>
            </div>
            <div className="h-24">29</div>
            <div className="h-24">30</div>
            <div className="h-24 relative">
              <div className="absolute inset-0 bg-red-300 text-white text-xs p-1">Madison Ruby 2024</div>
            </div>
            <div className="h-24">02</div>
            <div className="h-24">03</div>
          </div>
        </div>
      </div>





      {loading && <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-8 w-8" />
      </div>}
      {error && <p className="text-red-500">{error}</p>}
      {result && !loading && (
        <div>

          <section className="w-full py-12 md:py-16 lg:py-20">
            <h1 className="text-3xl font-bold mb-7 mt-5 text-primary-500">Мероприятия подходящие именно вам:</h1>

            <div className="container grid gap-8 px-4 md:px-6">
              <div className="grid gap-4 md:grid-cols-3">
                {result.similarHackathons.map((hackathon, index) => (
                  <Card key={index} className="group">
                    <Link href={hackathon.url} className="relative block overflow-hidden rounded-lg" prefetch={false}>
                      <img
                        src={hackathon.thumbnail_url}
                        alt="HackCSB"
                        width={300}
                        height={200}
                        className="h-[200px] w-full object-cover transition-all duration-300 group-hover:scale-105"
                      />
                    </Link>
                    <CardContent className="space-y-2 p-4">
                      <h3 className="text-lg font-semibold">{hackathon.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <div className="rounded-full bg-secondary px-3 py-1 font-medium">{hackathon.displayed_location.location}</div>

                        {hackathon.themes.map(theme => (
                          <div key={theme._id} className="rounded-full bg-secondary px-3 py-1 font-medium">
                            {theme.name}
                          </div>
                        ))}

                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDaysIcon className="h-4 w-4" />
                        <span>Submission Period: {hackathon.submission_period_dates}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AwardIcon className="h-4 w-4" />
                        <span>${extractCurrencyValue(hackathon.prize_amount)}</span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => handleAddToCalendar(hackathon)} >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          Add to Calendar
                        </Button>
                        {/* <a href={hackathon.url}>
                          <Button rel="noopener noreferrer" className="flex-1">
                            View Details
                          </Button>
                        </a> */}
                        <Link href={`events/${hackathon._id}`}>
                          <Button rel="noopener noreferrer" className="flex-1">
                            View Details
                          </Button>
                        </Link>

                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

            </div>

          </section>
        </div>
      )}
    </div>
  );
};



interface SvgIconProps extends React.SVGProps<SVGSVGElement> { }

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


function CalendarDaysIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
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


function ChevronLeftIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}


function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}



// const CalendarIcon: React.FC<SvgIconProps> = (props) => (
//   <svg
//     {...props}
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M8 2v4" />
//     <path d="M16 2v4" />
//     <rect width="18" height="18" x="3" y="4" rx="2" />
//     <path d="M3 10h18" />
//   </svg>
// );

// const MapPinIcon: React.FC<SvgIconProps> = (props) => (
//   <svg
//     {...props}
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
//     <circle cx="12" cy="10" r="3" />
//   </svg>
// );

// const TagIcon: React.FC<SvgIconProps> = (props) => (
//   <svg
//     {...props}
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
//     <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
//   </svg>
// );


// const TrophyIcon: React.FC<SvgIconProps> = (props) => (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
//       <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
//       <path d="M4 22h16" />
//       <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
//       <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
//       <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
//     </svg>
//   )


export default HackathonSearch;





// import React, { useState } from 'react';
// import axios from 'axios';
// import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
// import moment from 'moment';
// import 'react-big-calendar/lib/css/react-big-calendar.css';

// interface Theme {
//   name: string;
// }

// interface DisplayedLocation {
//   icon: string;
//   location: string;
// }

// interface Hackathon {
//   _id: string;
//   id: number;
//   title: string;
//   displayed_location: DisplayedLocation;
//   thumbnail_url: string;
//   analytics_identifier: string;
//   url: string;
//   time_left_to_submission: string;
//   submission_period_dates: string;
//   themes: Theme[];
//   prize_amount: string;
//   registrations_count: number;
//   featured: boolean;
//   organization_name: string;
//   winners_announced: boolean;
//   submission_gallery_url: string;
//   start_a_submission_url: string;
//   invite_only: boolean;
//   eligibility_requirement_invite_only_description: string | null;
//   managed_by_devpost_badge: boolean;
//   embedding: number[];
//   __v: number;
// }

// interface ApiResponse {
//   similarHackathons: Hackathon[];
//   highestScoreHackathon: Hackathon;
//   answer: string;
// }

// const HackathonSearch: React.FC = () => {
//   const [query, setQuery] = useState('');
//   const [result, setResult] = useState<ApiResponse | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const exampleQueries = [
//     "Web developer; Age: 20; Almaty",
//     "I'm UX/UI designer, sudent, from Kazakhstan",
//   ];

//   const handleExampleClick = (example: string) => {
//     setQuery(example);
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axios.post<ApiResponse>('http://localhost:5000/api/v1/embeddings/query-embedding', { query });
//       setResult(response.data);
//       setError('');
//     } catch (err: any) {
//       console.error('Error fetching data:', err.response?.data || err.message || err);
//       setError(err.response?.data?.message || 'An error occurred while fetching the data.');
//       setResult(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const localizer = momentLocalizer(moment);

//   const events: Event[] = result?.similarHackathons.map(hackathon => {
//     const [start, end] = hackathon.submission_period_dates.split(' - ').map(date => new Date(date));
//     return {
//       title: hackathon.title,
//       start,
//       end,
//       allDay: true,
//     };
//   }) || [];

//   const extractCurrencyValue = (htmlString: string): number => {
//     const div = document.createElement('div');
//     div.innerHTML = htmlString;
//     const span = div.querySelector('span[data-currency-value]');
//     if (span) {
//       const value = span.textContent || '0';
//       return parseFloat(value.replace(/,/g, ''));
//     }
//     return 0;
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <form onSubmit={handleSubmit} className="mb-2 flex items-center">
//         <input 
//           type="text" 
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Напиши о себе..."
//           className="w-full p-2 border border-gray-300 rounded mb-2"
//         />
//         <button type="submit" className="bg-primary-500 text-white p-2 rounded ml-2 mb-2">Search</button>
//       </form>
//       <div className="mb-4">
//         <div className="flex flex-wrap">
//           {exampleQueries.map((example, index) => (
//             <button
//               key={index}
//               type="button"
//               onClick={() => handleExampleClick(example)}
//               className="bg-gray-200 text-gray-800 p-2 rounded mr-2 mb-2"
//             >
//               {example}
//             </button>
//           ))}
//         </div>
//       </div>
//       {loading && <div className="flex items-center justify-center">
//         <div className="animate-spin rounded-full border-4 border-primary border-t-transparent h-8 w-8" />
//       </div>}
//       {error && <p className="text-red-500">{error}</p>}
//       {result && !loading && (
//         <div>
//           {/* <h2 className="text-xl font-bold mb-2">OpenAI Answer:</h2>
//           <p className="mb-4">{result.answer}</p> */}
//           <h2 className="text-xl font-bold mb-3 mt-5 text-primary-500">Мероприятия подходящие именно тебе:</h2>
//           <Calendar
//             localizer={localizer}
//             events={events}
//             startAccessor="start"
//             endAccessor="end" 
//             style={{ height: 500 }}
//           />


//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
//           {result.similarHackathons.map((hackathon, index) => (
//         <div key={index} className='border border-gray-300 rounded-lg'>
//           <img src={hackathon.thumbnail_url} alt="Event Image" className="rounded-t-lg w-full h-48 object-cover" />
//           <div className="p-4">
//             <h3 className="text-lg font-bold mb-2">{hackathon.title}</h3>
//             <div className="flex items-center space-x-2 mb-2">
//               <MapPinIcon className="w-5 h-5 text-muted-foreground" />
//               <span className="text-muted-foreground">{hackathon.displayed_location.location}</span>
//             </div>
//             <div className="flex items-center space-x-2 mb-2">
//               <TagIcon className="w-5 h-5 text-muted-foreground" />
//               <span className="text-muted-foreground">{hackathon.themes.map(theme => theme.name).join(', ')}</span>
//             </div>
//             <div className="flex items-center space-x-2 mb-2">
//               <CalendarIcon className="w-5 h-5 text-muted-foreground" />
//               <span className="text-muted-foreground">Submission Period: {hackathon.submission_period_dates}</span>
//             </div>
//             <div className="flex items-center space-x-2 mb-2">
//               <TrophyIcon className="w-5 h-5 text-muted-foreground" />
//               <span className="text-muted-foreground">${extractCurrencyValue(hackathon.prize_amount)}</span>
//             </div>
//             <p><a href={hackathon.url} target="_blank" className="text-primary-500">View Hackathon</a></p>
//           </div>
//         </div>
//         ))}
//         </div>
//         </div>
//       )}
//     </div>
//   );
// }; 

// interface SvgIconProps extends React.SVGProps<SVGSVGElement> {}

// const CalendarIcon: React.FC<SvgIconProps> = (props) => (
//   <svg
//     {...props}
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M8 2v4" />
//     <path d="M16 2v4" />
//     <rect width="18" height="18" x="3" y="4" rx="2" />
//     <path d="M3 10h18" />
//   </svg>
// );

// const MapPinIcon: React.FC<SvgIconProps> = (props) => (
//   <svg
//     {...props}
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
//     <circle cx="12" cy="10" r="3" />
//   </svg>
// );

// const TagIcon: React.FC<SvgIconProps> = (props) => (
//   <svg
//     {...props}
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
//     <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
//   </svg>
// );


// const TrophyIcon: React.FC<SvgIconProps> = (props) => (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
//       <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
//       <path d="M4 22h16" />
//       <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
//       <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
//       <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
//     </svg>
//   )


// export default HackathonSearch;
