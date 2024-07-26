import axios from 'axios';
import cheerio from 'cheerio';
import Event, { IEvent } from '../routes/events/models/Event';
import { createEmbedding } from '../utils/createEmbeddings';

const fetchEventDetails = async (eventUrl: string): Promise<{ description: string, title: string }> => {
  try {
    const response = await axios.get(eventUrl);
    const html = response.data;
    const $ = cheerio.load(html);

    const description = $('#hs_cos_wrapper_post_body').text().trim();
    const title = $('h1 span#hs_cos_wrapper_name').text().trim();
    return { description, title };
  } catch (error) {
    console.error(`Error fetching event details from ${eventUrl}:`, error);
    return { description: '', title: '' };
  }
};

const fetchEvents = async (): Promise<IEvent[]> => {
  try {
    const response = await axios.get('https://dataconnectors.com/events');
    const html = response.data;
    const $ = cheerio.load(html);

    const events: Partial<IEvent>[] = [];
    const processedUrls = new Set<string>();

    const eventPromises = $('.column.items article').map(async (index, element) => {
      const date = $(element).find('.date-time').attr('datetime') || '';
      const thumbnail_url = $(element).find('.post-article__image').css('background-image')?.replace(/url\(['"]?(.*?)['"]?\)/i, '$1') || '';
      const url = $(element).find('.post-article__link').attr('href') || '';
      const category = $(element).find('.tag-name').text().trim();
      const location = $(element).find('.title').text().trim();

      if (url && !processedUrls.has(url)) {
        processedUrls.add(url);
        const { description, title } = await fetchEventDetails(url);

        if (title && url && location) {
          events.push({
            title,
            category,
            displayed_location: {
              icon: 'icon-map-marker',
              location,
            },
            open_state: 'open',
            thumbnail_url,
            url,
            time_left_to_submission: 'N/A',
            submission_period_dates: date,
            themes: [],
            prize_amount: 'N/A',
            registrations_count: 0,
            organization_name: 'Unknown',
            invite_only: false,
            eligibility_requirement_invite_only_description: null,
            description,
          });
        } else {
          console.warn(`Skipping event due to missing title, URL, or location: ${title || 'N/A'}`);
        }
      }
    }).get();

    await Promise.all(eventPromises);

    for (const event of events) {
        const embeddingText = `${event.title} ${event.description}`;
        const embedding = await createEmbedding(embeddingText);
        if (embedding) {
          event.embedding = embedding;
        }
      }

    console.log(`Fetched ${events.length} events from dataconnectors`);
    return events as IEvent[];
  } catch (error) {
    console.error('Error fetching events from dataconnectors:', error);
    return [];
  }
};

// const saveEventsToDatabase = async (events: IEvent[]) => {
//   for (const eventData of events) {
//     try {
//       const event = new Event(eventData);
//       await event.save();
//       console.log(`Saved event: ${event.title}`);
//     } catch (error) {
//       console.error(`Error saving event: ${eventData.title}`, error);
//     }
//   }
// };

const saveEventsToDatabase = async (events: IEvent[]) => {
    for (const eventData of events) {
      try {
        await Event.findOneAndUpdate(
          { url: eventData.url },
          eventData,
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log(`Saved or updated event: ${eventData.title}`);
      } catch (error) {
        console.error(`Error saving or updating event: ${eventData.title}`, error);
      }
    }
  };

export const dataconnectorsParser = async () => {
  const events = await fetchEvents();
  if (events.length > 0) {
    await saveEventsToDatabase(events);
  } else {
    console.log('No events found to save.');
  }
  console.log('Scraping completed.');
};
