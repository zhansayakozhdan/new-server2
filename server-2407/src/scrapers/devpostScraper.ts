import axios, { AxiosRequestConfig } from 'axios';
import cheerio from 'cheerio';
import Event, { IEvent } from '../routes/events/models/Event'
import { createEmbedding } from '../utils/createEmbeddings';

const headers = {
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
  'accept': '*/*',
  'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
  'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'Referer': 'https://devpost.com/hackathons?open_to[]=public&status[]=upcoming&status[]=open',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

interface HackathonEvent {
  id: number;
  title: string;
  displayed_location: {
    icon: string;
    location: string;
  };
  open_state: string;
  thumbnail_url: string;
  url: string;
  time_left_to_submission: string;
  submission_period_dates: string;
  themes: {
    id: number;
    name: string;
  }[];
  prize_amount: string;
  registrations_count: number;
  organization_name: string;
  invite_only: boolean;
  eligibility_requirement_invite_only_description: string | null;
}

const fetchMetaData = async () => {
  const url = 'https://devpost.com/api/hackathons?challenge_type[]=online&open_to[]=public&status[]=upcoming&status[]=open';
  const config: AxiosRequestConfig = {
    method: 'get',
    url,
    headers,
  };

  try {
    const response = await axios(config);
    return response.data.meta;
  } catch (error) {
    console.error('Error fetching meta data from devpost:', error);
    return null;
  }
};

const fetchData = async (totalPages: number, page = 1, events: HackathonEvent[] = []): Promise<HackathonEvent[]> => {
  try {
    if (page > totalPages) {
      return events;
    }

    const url = `https://devpost.com/api/hackathons?open_to[]=public&status[]=upcoming&status[]=open&page=${page}`;
    const config: AxiosRequestConfig = {
      method: 'get',
      url,
      headers,
    };

    const response = await axios(config);
    const newEvents = response.data.hackathons.map((hackathon: any) => ({
      id: hackathon.id,
      title: hackathon.title,
      displayed_location: {
        icon: hackathon.displayed_location.icon,
        location: hackathon.displayed_location.location,
      },
      open_state: hackathon.open_state,
      thumbnail_url: hackathon.thumbnail_url,
      url: hackathon.url,
      time_left_to_submission: hackathon.time_left_to_submission,
      submission_period_dates: hackathon.submission_period_dates,
      themes: hackathon.themes.map((theme: any) => ({
        id: theme.id,
        name: theme.name,
      })),
      prize_amount: hackathon.prize_amount,
      registrations_count: hackathon.registrations_count,
      organization_name: hackathon.organization_name,
      invite_only: hackathon.invite_only,
      eligibility_requirement_invite_only_description: hackathon.eligibility_requirement_invite_only_description,
    }));
    return fetchData(totalPages, page + 1, events.concat(newEvents));
  } catch (error) {
    console.error(`Error fetching data on page ${page} from devpost:`, error);
    return events;
  }
};

const scrapeHackathonDetails = async (eventData: HackathonEvent): Promise<IEvent | null> => {
  try {
    const { data } = await axios.get(eventData.url);
    const $ = cheerio.load(data);

    const additionalData = {
      description: $('#challenge-description').text().trim() || 'No description',
      challenges: $('#challenges').text().trim().split('\n').map(s => s.trim()),
      judges: $('#judges').text().trim().split('\n').map(s => s.trim()),
      judging_criteria: $('#judging-criteria').text().trim().split('\n').map(s => s.trim())
    };

    const embedding = await createEmbedding(additionalData.description);
if (!embedding) {
  throw new Error('Failed to create embedding.');
}

    const event = new Event({
      title: eventData.title,
      category: 'Hackathon',
      displayed_location: eventData.displayed_location,
      open_state: eventData.open_state,
      thumbnail_url: eventData.thumbnail_url,
      url: eventData.url,
      time_left_to_submission: eventData.time_left_to_submission,
      submission_period_dates: eventData.submission_period_dates,
      themes: eventData.themes,
      prize_amount: eventData.prize_amount,
      registrations_count: eventData.registrations_count,
      organization_name: eventData.organization_name,
      invite_only: eventData.invite_only,
      eligibility_requirement_invite_only_description: eventData.eligibility_requirement_invite_only_description,
      description: additionalData.description,
      challenges: additionalData.challenges,
      judges: additionalData.judges,
      judging_criteria: additionalData.judging_criteria,
      type: 'Hackathon',
      embedding: embedding
    });

    await event.save();

    return event;
  } catch (error) {
    console.error(`Error scraping ${eventData.url}:`, error);
    return null;
  }
};

export const devpostParser = async () => {
  const meta = await fetchMetaData();
  if (meta) {
    const totalPages = Math.ceil(meta.total_count / meta.per_page);
    const events: HackathonEvent[] = await fetchData(totalPages);
    console.log(`Fetched ${events.length} events from devpost:`);
    for (const event of events) {
      const details = await scrapeHackathonDetails(event);
      if (details) {
        console.log(`Saved event: ${details.title}`);
      }
    }
  }
};






// import axios, { AxiosRequestConfig } from 'axios';
// import cheerio from 'cheerio';
// import Event, { IEvent } from '../routes/event/models/Event';

// const headers = {
//   'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
//   'accept': '*/*',
//   'accept-language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
//   'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
//   'sec-ch-ua-mobile': '?0',
//   'sec-ch-ua-platform': '"Windows"',
//   'sec-fetch-dest': 'empty',
//   'sec-fetch-mode': 'cors',
//   'sec-fetch-site': 'same-origin',
//   'Referer': 'https://devpost.com/hackathons?open_to[]=public&status[]=upcoming&status[]=open',
//   'Referrer-Policy': 'strict-origin-when-cross-origin'
// };

// interface HackathonEvent {
//   id: number;
//   title: string;
//   displayed_location: {
//     icon: string;
//     location: string;
//   };
//   open_state: string;
//   thumbnail_url: string;
//   url: string;
//   time_left_to_submission: string;
//   submission_period_dates: string;
//   themes: {
//     id: number;
//     name: string;
//   }[];
//   prize_amount: string;
//   registrations_count: number;
//   organization_name: string;
//   invite_only: boolean;
//   eligibility_requirement_invite_only_description: string | null;
// }

// const fetchMetaData = async () => {
//   const url = 'https://devpost.com/api/hackathons?challenge_type[]=online&open_to[]=public&status[]=upcoming&status[]=open';
//   const config: AxiosRequestConfig = {
//     method: 'get',
//     url,
//     headers,
//   };

//   try {
//     const response = await axios(config);
//     return response.data.meta;
//   } catch (error) {
//     console.error('Error fetching meta data:', error);
//     return null;
//   }
// };

// const fetchData = async (totalPages: number, page = 1, events: HackathonEvent[] = []): Promise<HackathonEvent[]> => {
//   try {
//     if (page > totalPages) {
//       return events;
//     }

//     const url = `https://devpost.com/api/hackathons?open_to[]=public&status[]=upcoming&status[]=open&page=${page}`;
//     const config: AxiosRequestConfig = {
//       method: 'get',
//       url,
//       headers,
//     };

//     const response = await axios(config);
//     const newEvents = response.data.hackathons.map((hackathon: any) => ({
//       id: hackathon.id,
//       title: hackathon.title,
//       displayed_location: {
//         icon: hackathon.displayed_location.icon,
//         location: hackathon.displayed_location.location,
//       },
//       open_state: hackathon.open_state,
//       thumbnail_url: hackathon.thumbnail_url,
//       url: hackathon.url,
//       time_left_to_submission: hackathon.time_left_to_submission,
//       submission_period_dates: hackathon.submission_period_dates,
//       themes: hackathon.themes.map((theme: any) => ({
//         id: theme.id,
//         name: theme.name,
//       })),
//       prize_amount: hackathon.prize_amount,
//       registrations_count: hackathon.registrations_count,
//       organization_name: hackathon.organization_name,
//       invite_only: hackathon.invite_only,
//       eligibility_requirement_invite_only_description: hackathon.eligibility_requirement_invite_only_description,
//     }));
//     return fetchData(totalPages, page + 1, events.concat(newEvents));
//   } catch (error) {
//     console.error(`Error fetching data on page ${page}:`, error);
//     return events;
//   }
// };

// const scrapeHackathonDetails = async (eventData: HackathonEvent): Promise<IEvent | null> => {
//   try {
//     const { data } = await axios.get(eventData.url);
//     const $ = cheerio.load(data);

//     const additionalData = {
//       description: $('#challenge-description').text().trim() || 'No description',
//       challenges: $('#challenges').text().trim().split('\n').map(s => s.trim()),
//       judges: $('#judges').text().trim().split('\n').map(s => s.trim()),
//       judging_criteria: $('#judging-criteria').text().trim().split('\n').map(s => s.trim())
//     };

//     // Create a new Event instance and assign values
//     const event = new Event({
//       title: eventData.title,
//       category: 'Hackathon',
//       displayed_location: eventData.displayed_location,
//       open_state: eventData.open_state,
//       thumbnail_url: eventData.thumbnail_url,
//       url: eventData.url,
//       time_left_to_submission: eventData.time_left_to_submission,
//       submission_period_dates: eventData.submission_period_dates,
//       themes: eventData.themes,
//       prize_amount: eventData.prize_amount,
//       registrations_count: eventData.registrations_count,
//       organization_name: eventData.organization_name,
//       invite_only: eventData.invite_only,
//       eligibility_requirement_invite_only_description: eventData.eligibility_requirement_invite_only_description,
//       description: additionalData.description,
//       challenges: additionalData.challenges,
//       judges: additionalData.judges,
//       judging_criteria: additionalData.judging_criteria,
//       type: 'Hackathon'
//     });

//     await event.save(); // Save the event to the database

//     return event;
//   } catch (error) {
//     console.error(`Error scraping ${eventData.url}:`, error);
//     return null;
//   }
// };


// export const main = async () => {
//   const meta = await fetchMetaData();
//   if (meta) {
//     const totalPages = Math.ceil(meta.total_count / meta.per_page);
//     const events: HackathonEvent[] = await fetchData(totalPages);
//     console.log(`Fetched ${events.length} events:`);
//     for (const event of events) {
//       const details = await scrapeHackathonDetails(event);
//       if (details) {
//         console.log(`Saved event: ${details.title}`);
//       }
//     }
//   }
// };
