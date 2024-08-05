import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import { createEmbedding } from '../../utils/createEmbeddings';
import { hitOpenAiApi, hitOpenAiApiNew, hitOpenAiApiTest, hitOpenAiApiTwo } from '../../openai';
import { IEvent } from './models/Event';
import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const retrievalPrompt = `
You are a professional IT specialist who can structure all the technical imformations of event into a structured format. Please provide the following information about event in an unstructured text, and then convert it into the structured JSON format provided below:

Unstructured Information:
"
   {
        "_id": "66a204e1da55709bddff6ede",
        "url": "https://clck.ru/3AsP7o",
        "description": "#LastCall

Уже завтра подойдёт к концу регистрация на хакатон Hack.Genesis от команды Phystech.Genesis при партнёрстве с Мосбиржей. Успей подать заявку!⚡️

🔹Формат: онлайн;
🔹Даты проведения: 31 мая – 2 июня;
🔹Призовой фонд: 250.000 рублей.

В рамках хакатона тебе будет предложено создать систему, помогающую разобраться в финансовых документах с помощью нейронных сетей.

🙌 Мы ждём тебя, если ты:
– Разработчик;
– Аналитик данных;
– Продуктолог.

Hack.Genesis 2024 – это:
– Возможность поработать с опытными специалистами;
– 40-часовое соревнование с другими командами;
– Возможность получить денежные и ценные призы.


❗️Регистрация доступна до 28 мая 23:59, МСК по ссылке: https://clck.ru/3AsP7o",
        "title": "#LastCall",
        "themes": []
    }
"

Structured JSON Format:
"
{
  "_id": "66a204e1da55709bddff6ede",
  "url": "https://clck.ru/3AsP7o",
  "description": "#LastCall

Уже завтра подойдёт к концу регистрация на хакатон Hack.Genesis от команды Phystech.Genesis при партнёрстве с Мосбиржей. Успей подать заявку!⚡️

🔹Формат: онлайн;
🔹Даты проведения: 31 мая – 2 июня;
🔹Призовой фонд: 250.000 рублей.

В рамках хакатона тебе будет предложено создать систему, помогающую разобраться в финансовых документах с помощью нейронных сетей.

🙌 Мы ждём тебя, если ты:
– Разработчик;
– Аналитик данных;
– Продуктолог.

Hack.Genesis 2024 – это:
– Возможность поработать с опытными специалистами;
– 40-часовое соревнование с другими командами;
– Возможность получить денежные и ценные призы.


❗️Регистрация доступна до 28 мая 23:59, МСК по ссылке: https://clck.ru/3AsP7o",

  "title": "Hack.Genesis",
  "date": "31.05.2024",
  "category": "Hackathon",
}"

Please transform the unstructured information into the structured JSON format provided.
`;

class EventService {
  
  private client: MongoClient;

  constructor() {
    const uri = process.env.MONGODB_URL || 'mongodb://localhost:27017/main';
    this.client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000, // Adjust the timeout as needed
    });
  }


  async addEventToCalendar(userId: string, eventDetails: { title: string; date: string; description: string; location: string; }): Promise<string> {
    try {
        console.log('Connecting to the database...');
        await this.client.connect();
        const db = this.client.db('main');

        console.log('Fetching user details...');
        const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

        console.log('Fetching token...');
        const token = await db.collection('refreshtokens').findOne({ user: new ObjectId(userId) });

        if (!user || !token) {
            throw new Error('User not authenticated or access token missing');
        }

        console.log('User:', user);
        console.log('Token:', token);

        console.log('Setting up Google Calendar API client...');
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            `https://new-server2-3mje.onrender.com/api/v5/auth/google/callback`
        );
        
        // Set initial credentials
        oauth2Client.setCredentials({
            access_token: token.accessToken,
            refresh_token: token.token,
        });

        // Refresh the access token
        await oauth2Client.getAccessToken(); // This will automatically refresh the token if needed

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        console.log('Parsing event date...');
        const [day, month, year] = eventDetails.date.split('.').map(Number);
        const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59));

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error('Invalid date format');
        }

        const event = {
            summary: eventDetails.title,
            description: eventDetails.description,
            location: eventDetails.location,
            start: {
                dateTime: startDate.toISOString(),
                timeZone: 'Asia/Almaty',
            },
            end: {
                dateTime: endDate.toISOString(),
                timeZone: 'Asia/Almaty',
            },
        };

        console.log('Calling Google Calendar API...');
        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });

        if (!response.data.id) {
            throw new Error('Event ID not found in the response');
        }

        console.log('Event added successfully with ID:', response.data.id);
        return response.data.id;
    } catch (error) {
        console.error('Error adding event to calendar:', error);
        throw new Error('Failed to add event to calendar');
    } finally {
        console.log('Closing database connection...');
        await this.client.close();
    }
}



  async getAllEvents(page: number, limit: number) {
    const skip = (page - 1) * limit;

    try {
      await this.client.connect();

      const db = this.client.db('main');
      const collection = db.collection('events');

      const events = await collection.find({}, {
        projection: {
          _id: 1,
          title: 1,
          'displayed_location.location': 1,
          thumbnail_url: 1,
          url: 1,
          prize_amount: 1,
        }
      })
      .skip(skip)
      .limit(limit)
      .toArray();

      return events;
    } catch (err) {
      console.error('Error fetching events:', err);
      throw new Error('Internal server error');
    } 
  }

  async getEventById(eventId: string) {
    try {
      await this.client.connect();

      const db = this.client.db('main');
      const collection = db.collection('events');

      const event = await collection.findOne({ _id: new ObjectId(eventId) });

      if (!event) {
        throw new Error('Event not found');
      }

      return event;
    } catch (err) {
      console.error('Error fetching event by ID:', err);
      throw new Error('Internal server error');
    } 
  }

  async getEventByUrl(eventUrl: string) {
    try {
      await this.client.connect();

      const db = this.client.db('main');
      const collection = db.collection('events');

      const event = await collection.findOne({ url: eventUrl });

      if (!event) {
        throw new Error('Event not found');
      }

      return event;
    } catch (err) {
      console.error('Error fetching event by URL:', err);
      throw new Error('Internal server error');
    } 
  }


//   async getSuitableEvents(query: string) {
//     try {
//       await this.client.connect();
//       const db = this.client.db('main');
//       const collection = db.collection('events');
  
//       const embedding = await createEmbedding(query);
//       if (!embedding) {
//         throw new Error('Failed to create embedding');
//       }
  
//       const events = await collection.aggregate([
//         {
//          '$vectorSearch': {
//                 'index': 'default', 
//                 'path': 'embedding', 
//                 'queryVector': embedding, 
//             'numCandidates': 150, 
//                 'limit': 10
//           }
//         },
//         {
//           $project: {
//             _id: 1,
//             title: 1,
//             description: 1,
//             displayed_location: 1,
//             open_state: 1,
//             thumbnail_url: 1,
//             analytics_identifier: 1,
//             url: 1,
//             time_left_to_submission: 1,
//             submission_period_dates: 1,
//             themes: { $map: { input: "$themes", as: "theme", in: { name: "$$theme.name" } } },
//             prize_amount: 1,
//             registrations_count: 1,
//             featured: 1,
//             organization_name: 1,
//             winners_announced: 1,
//             submission_gallery_url: 1,
//             start_a_submission_url: 1,
//             invite_only: 1,
//             eligibility_requirement_invite_only_description: 1,
//             managed_by_devpost_badge: 1,
//             score: { $meta: 'searchScore' },
//           }
//         }
//       ]).toArray();
  
//       const topEvents = events.sort((a, b) => b.score - a.score);
  
//       const prompt = `Список подходящих IT мероприятий для запроса "${query}":
//         ${topEvents.map(event => `Название: ${event.title}
//         Локация: ${event.displayed_location}
//         Статус: ${event.open_state}
//         Срок подачи заявок: ${event.time_left_to_submission}
//         Призовой фонд: ${event.prize_amount}
//         URL: ${event.url}`).join('\n\n')
//       }
  
//       Пожалуйста, выбери самые подходящие мероприятия и укажи, почему они лучше всего подходят для запроса пользователя.
//       Ответ должен быть строго в формате JSON массива и не должен включать никакого дополнительного текста.
//       JSON массив должен выглядеть следующим образом и должен быть заполнен данными мероприятия:
//       [
//           {
//               _id: _id мероприятия,
//               title: Название мероприятия,
//               displayed_location: Локация мероприятия,
//               open_state: ,
//               thumbnail_url: ,
//               url: ,
//               time_left_to_submission: ,
//               submission_period_dates: ,
//               prize_amount: ,
//               registrations_count: ,
//               featured: ,
//               organization_name: ,
//               themes: [ {
//                   "id": ,
//                   "name": ,
//                   "_id": 
//               },
//               {
//                   "id": ,
//                   "name": ,
//                   "_id": 
//               },
//               {
//                   "id": ,
//                   "name": ,
//                   "_id": 
//               } ],
//               score: 
//           }
//       ]`;
  
//       const selectedEvents = await hitOpenAiApiTest(prompt);
  
//       return { topEvents, selectedEvents };
//     } catch (err) {
//       console.error('Error fetching suitable events:', err);
//       throw new Error('Internal server error');
//     } finally {
//       await this.client.close();
//     }
//   }

async getTopEvents(query: string) {
  try {
    await this.client.connect();
    const db = this.client.db('main');
    const collection = db.collection('events');

    const embedding = await createEmbedding(query);
    if (!embedding) {
      throw new Error('Failed to create embedding');
    }

    const currentDate = new Date();

    const events = await collection.aggregate([
      {
        '$vectorSearch': {
          'index': 'default',
          'path': 'embeddings',
          'queryVector': embedding,
          'numCandidates': 150,
          'limit': 15
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          displayed_location: 1,
          open_state: 1,
          thumbnail_url: 1,
          url: 1,
          time_left_to_submission: 1,
          submission_period_dates: 1,
          themes: { $map: { input: "$themes", as: "theme", in: { name: "$$theme.name" } } },
          prize_amount: 1,
          registrations_count: 1,
          featured: 1,
          organization_name: 1,
          winners_announced: 1,
          submission_gallery_url: 1,
          start_a_submission_url: 1,
          invite_only: 1,
          eligibility_requirement_invite_only_description: 1,
          managed_by_devpost_badge: 1,
          score: { $meta: 'searchScore' },
        }
      }
    ]).toArray();

    console.log('Fetched events:', events);

    const topEvents = events.sort((a, b) => b.score - a.score);

    return topEvents;
  } catch (err) {
    console.error('Error fetching top events:', err);
    throw new Error('Internal server error');
  } 
}

async getSuitableEvents(query: string) {
  try {
    const topEvents = await this.getTopEvents(query);

    if (!topEvents || topEvents.length === 0) {
      console.log('No events found after query.');
      return { topEvents: [], selectedEvents: [] };
    }

    const response = await hitOpenAiApiNew(query, topEvents);

    if (!response) {
      throw new Error('Failed to get a valid response from OpenAI API');
    }

    // Extract JSON content from the response
    const jsonResponseMatch = response.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonResponseMatch) {
      throw new Error('Invalid JSON format in the response');
    }

    const jsonResponse = jsonResponseMatch[1];
    const selectedEvents = JSON.parse(jsonResponse);

    return {
      topEvents,
      selectedEvents
    };
  } catch (err) {
    console.error('Error getting suitable events:', err);
    throw new Error('Internal server error');
  }
}



public async generateTodoList(eventId: string): Promise<string> {
  try {
    await this.client.connect();
    const db = this.client.db('main');
    const collection = db.collection('events');

    const hackathon = await collection.findOne({ _id: new ObjectId(eventId) });
    if (!hackathon) {
      throw new Error('Hackathon not found');
    }

    const prompt = `Составь подробный список дел для участия в следующем хакатоне: ${hackathon.title}.
    Правила хакатона: ${hackathon.description}.
    
    Список дел должен включать:
    Подготовку до начала хакатона, с указанием дедлайнов (например, регистрация, сбор команды, изучение темы).
    Задачи на время хакатона, с указанием сроков выполнения (например, разработка идеи, программирование, тестирование).
    Завершение хакатона, с указанием конечных сроков (например, подготовка презентации, подача проекта).
    
    Пожалуйста, предоставь подробный и организованный список дел с указанием дедлайнов для успешного участия в хакатоне.`;

    const todoList = await hitOpenAiApiTwo(prompt);
    return todoList || '';
  } catch (err) {
    console.error('Error generating TO-DO list:', err);
    throw new Error('Internal server error');
  } 
}
}

export default EventService;
