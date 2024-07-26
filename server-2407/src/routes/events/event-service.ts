import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import { createEmbedding } from '../../utils/createEmbeddings';
import { hitOpenAiApi, hitOpenAiApiNew, hitOpenAiApiTest } from '../../openai';
import { IEvent } from './models/Event';

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
    this.client = new MongoClient(process.env.MONGODB_URL || 'mongodb://localhost:27017');
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
    } finally {
      await this.client.close();
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
    } finally {
      await this.client.close();
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
    } finally {
      await this.client.close();
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
          'path': 'embedding',
          'queryVector': embedding,
          'numCandidates': 150,
          'limit': 20
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
  } finally {
    await this.client.close();
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

  
  
}


export default EventService;
