import puppeteer from 'puppeteer';
import Event, { IEvent } from '../routes/events/models/Event';
import { createEmbedding } from '../utils/createEmbeddings';

const fetchEvents = async (): Promise<IEvent[]> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://devitjobs.com/events', { waitUntil: 'networkidle2' });

    await page.waitForSelector('div[data-test="row"].row.my-5.justify-content-center'); // Wait for the first container to load

    const events: Partial<IEvent>[] = await page.evaluate(() => {
      const container = document.querySelector('div[data-test="row"].row.my-5.justify-content-center');
      if (!container) {
        return [];
      }

      const eventElements = container.querySelectorAll('div[data-test="col"]');
      const events: Partial<IEvent>[] = [];

      eventElements.forEach((element) => {
        const title = element.querySelector('.mobile-small-header b, .font-size-bigger b')?.textContent?.trim();
        const location = (element.querySelector('.icon-map-marker')?.parentElement as HTMLElement)?.innerText.trim();
        const date = element.querySelector('.icon-calendar')?.parentElement?.textContent?.trim();
        const thumbnail_url = (element.querySelector('img[data-test="card-image"]') as HTMLImageElement)?.src || '';
        const url = (element.querySelector('a') as HTMLAnchorElement)?.href || '';
        const category = (element.querySelector('[data-test="badge"]') as HTMLElement)?.innerText.trim();
        const description = (element.querySelector('.only-desktop .pointer-cursor') as HTMLElement)?.innerText.trim();

        if (title && url) {
          events.push({
            title,
            category,
            displayed_location: {
              icon: 'icon-map-marker',
              location
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
        }
      });

      return events;
    });

    // Generate embeddings for each event
    for (const event of events) {
      if (event.description) {
        const embeddingText = `${event.title} ${event.description}`;
        const embedding = await createEmbedding(embeddingText);
        if (embedding) {
          event.embedding = embedding;
        }
      }
    }

    console.log(`Fetched ${events.length} events from devitjobs`);
    return events as IEvent[];
  } catch (error) {
    console.error('Error fetching events from devitjobs:', error);
    return [];
  } finally {
    await browser.close();
  }
};

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

export const devitParser = async () => {
  const events = await fetchEvents();
  if (events.length > 0) {
    await saveEventsToDatabase(events);
  } else {
    console.log('No events found to save.');
  }
  console.log('Scraping completed.');
};
