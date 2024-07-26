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

        const prompt = `Based on the query "${query}"
        , here is a list of suitable IT events:
        ${topEvents.map(event => `Title: ${event.title}
        Location: ${event.displayed_location?.location || 'Not Available'}
        Description: ${event.description || 'Not Available'}
        Status: ${event.open_state || 'Not Available'}
        Submission Deadline: ${event.time_left_to_submission || 'Not Available'}
        Prize Amount: ${event.prize_amount || 'Not Available'}
        URL: ${event.url}`).join('\n\n')}

        Please select and return the most suitable events for the user in the following JSON array format:
        [
            {
                "_id": "Event ID",
                "title": "Event Title",
                "displayed_location": "Event Location" || "Not Available",
                "open_state": "Event Status" || "Not Available",
                "thumbnail_url": "Thumbnail URL" || "Not Available",
                "url": "Event URL",
                "time_left_to_submission": "Submission Deadline" || "Not Available",
                "submission_period_dates": "Submission Period Dates" || "Not Available",
                "prize_amount": "Prize Amount" || "Not Available",
                "registrations_count": "Registration Count" || "Not Available",
                "featured": "Featured" || "Not Available",
                "organization_name": "Organization Name" || "Not Available",
                "description": "Event description" || "Not Available",
                "themes": [
                    {
                        "name": "Theme Name"
                    }
                ] || "Not Available",
                "score": "Event Score"
            }
        ]`;

        const selectedEventsResponse: string | undefined = await hitOpenAiApiNew(prompt, topEvents);

        if (!selectedEventsResponse || typeof selectedEventsResponse !== 'string') {
            throw new Error('Invalid response from OpenAI API.');
        }

        // Log the raw response for debugging
        console.log('Raw response from OpenAI:', selectedEventsResponse);

        let cleanedResponse = selectedEventsResponse.trim();
        if (cleanedResponse.startsWith('```') && cleanedResponse.endsWith('```')) {
            cleanedResponse = cleanedResponse.slice(3, -3).trim();
        }

        let selectedEvents: any[] = [];
        try {
            selectedEvents = JSON.parse(cleanedResponse);
        } catch (error) {
            console.error('Failed to parse selected events JSON:', error);
            console.log('Cleaned response:', cleanedResponse);  // Additional logging to see the response before parsing
            throw new Error('Failed to parse the selected events data.');
        }

        console.log('Parsed selected events:', selectedEvents);

        return { topEvents, selectedEvents };
    } catch (err) {
        console.error('Error fetching suitable events:', err);
        throw new Error('Internal server error');
    }
}





  
  
}


export default EventService;
