// import puppeteer from 'puppeteer';
// import Event, { IEvent } from '../routes/events/models/Event';

// const scrapeEvents = async (): Promise<IEvent[]> => {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     try {
//         await page.goto('https://afisha.timepad.ru/online/category/452', { waitUntil: 'networkidle2' });

//         // Wait for the event cards to be loaded
//         await page.waitForSelector('.meventcard', { timeout: 6000 });

//         // Debugging: Check the page content
//         const pageContent = await page.content();
//         // console.log(pageContent); // Log the page content to see if it matches expectations

//         const events: IEvent[] = await page.evaluate(() => {
//             const eventCards = Array.from(document.querySelectorAll('.meventcard'));

//             console.log(`Found ${eventCards.length} event cards.`); // Debugging line

//             return eventCards.map(card => {
//                 const titleElement = card.querySelector('.meventcard__title h2');
//                 const imageElement = card.querySelector('.meventcard__image') as HTMLElement;
//                 const linkElement = card.querySelector('.meventcard__title a') as HTMLAnchorElement;
//                 const dateElement = card.querySelector('.meventcard__datetime .meventcard__date');

//                 const title = titleElement?.textContent?.trim() || 'No title';
//                 const imageUrl = imageElement?.style.backgroundImage.replace(/url\(["']?([^"']*)["']?\)/, '$1') || 'No image URL';
//                 const url = linkElement?.href || 'No link';
//                 const date = dateElement?.textContent?.trim() || 'No date';

//                 console.log({ title, imageUrl, url, date }); // Debugging line

//                 return {
//                     title,
//                     imageUrl,
//                     url,
//                     date,
//                 } as IEvent;
//             });
//         });

//         console.log(`Scraped ${events.length} events.`); // Debugging line
//         return events;
//     } catch (error) {
//         console.error('Error scraping events:', error);
//         return [];
//     } finally {
//         await browser.close();
//     }
// };

// const saveEventsToDatabase = async (events: IEvent[]) => {
//     for (const eventData of events) {
//         try {
//             const event = new Event(eventData);
//             await event.save();
//             console.log(`Saved event: ${eventData.title}`);
//         } catch (error) {
//             console.error(`Error saving event: ${eventData.title}`, error);
//         }
//     }
// };

// export const afishaParser = async () => {
//     const events = await scrapeEvents();
//     if (events.length > 0) {
//         await saveEventsToDatabase(events);
//     } else {
//         console.log('No events found to save.');
//     }
//     console.log('Scraping completed.');
// };
