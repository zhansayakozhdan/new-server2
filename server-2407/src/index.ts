import 'dotenv/config'
import express from 'express'
import { createServer } from 'node:http'
import connectDB from './db'
import globalRouter from './routes/global-router'
import { logger } from './logger'
import { telegramParser } from './scrapers/telegramScraper'
import mongoose from 'mongoose'
import { dataconnectorsParser } from './scrapers/dataConnectorsScraper'
import { devitParser } from './scrapers/devitScraper'
import { devpostParser } from './scrapers/devpostScraper'
import cron from 'node-cron';
import { kzItEventsTgParser } from './scrapers/kzEventsTgScraper'


connectDB()

const app = express()

app.use(express.json())
app.use(logger)
app.use('/api/v5', globalRouter)

const server = createServer(app)

cron.schedule('0 0 * * *', async () => {
  console.log('Running scheduled tasks...');

  try {
    console.log('Scheduler started.');

    await devitParser();
    await dataconnectorsParser();
    //await devpostParser();
    await telegramParser('https://t.me/s/hackathons');
    await kzItEventsTgParser('https://t.me/s/kz_it_events');
  } catch (error) {
    console.error('Error running scheduled tasks:', error);
  }

  console.log('Scheduled tasks completed.');
}, {
  timezone: 'Asia/Almaty' // Adjust timezone as needed
});


server.listen(5002, () => {
  console.log('server running at http://localhost:5002/api/v5')
})

// const main = async () => {
//   try {
//     await devitParser();
//     await dataconnectorsParser();
//     await devpostParser();
//     await telegramParser('https://t.me/s/hackathons');
//     await kzItEventsTgParser('https://t.me/s/kz_it_events');
//     //await afishaParser();

//     console.log('Scraping completed.');
//   } catch (err: any) {
//     console.error('Error in main function:', err.message);
//     process.exit(1);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// main().catch(error => {
//   console.error('Error in main function:', error);
// });


