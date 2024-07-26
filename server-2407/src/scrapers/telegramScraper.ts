import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import Event, { IEvent } from '../routes/events/models/Event'; // Adjust the path as needed
import { createEmbedding } from '../utils/createEmbeddings';

const fetchEventsFromTelegram = async (telegramUrl: string): Promise<IEvent[]> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(telegramUrl, { waitUntil: 'networkidle2' });

    const events: Partial<IEvent>[] = await page.evaluate(() => {
      const eventElements = document.querySelectorAll('.tgme_widget_message_wrap');
      const events: Partial<IEvent>[] = [];

      eventElements.forEach((element) => {
        const title = (element.querySelector('.tgme_widget_message_text') as HTMLElement)?.innerText.split('\n')[0].trim();
        const description = (element.querySelector('.tgme_widget_message_text') as HTMLElement)?.innerText.trim();
        const url = (element.querySelector('.tgme_widget_message_bubble a[target="_blank"]') as HTMLAnchorElement)?.href;
        const thumbnail_url = (element.querySelector('.tgme_widget_message_photo img') as HTMLImageElement)?.src;
        const date = element.querySelector('.tgme_widget_message_footer time')?.getAttribute('datetime');

        if (title && url) {
          events.push({
            title,
            description,
            url,
            thumbnail_url,
            
          });
        }
      });

      return events;
    });

    for (const event of events) {
        const embeddingText = `${event.title} ${event.description}`;
        const embedding = await createEmbedding(embeddingText);
        if (embedding) {
          event.embedding = embedding;
        }
      }

    console.log(`Fetched ${events.length} events from Telegram ${telegramUrl}`);
    return events as IEvent[];
  } catch (error) {
    console.error('Error fetching events from Telegram:', error);
    return [];
  } finally {
    await browser.close();
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

export const telegramParser = async (telegramUrl: string) => {
  try {
    const events = await fetchEventsFromTelegram(telegramUrl);
    if (events.length > 0) {
      await saveEventsToDatabase(events);
    } else {
      console.log('No events found to save.');
    }

    console.log('Scraping completed.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  } 
};


