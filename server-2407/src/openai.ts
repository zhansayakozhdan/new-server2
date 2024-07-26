import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

async function hitOpenAiApi(prompt: string): Promise<string | undefined> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-16k',
      stream: false,
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant with comprehensive knowledge of IT events.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
    });

    const content: string | undefined = response.choices[0]?.message?.content ?? undefined;
    return content;
  } catch (error) {
    console.error('Error hitting OpenAI API:', error);
    return undefined;
  }
}

async function hitOpenAiApiTest(prompt: string): Promise<string | undefined> {
    try {
      const gptResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant with comprehensive knowledge of IT events. Ответ должен быть строго в формате JSON массива и не должен включать никакого дополнительного текста.
            Учти все условия а так же дату отправки запроса чтобы не выводить пользователю уже прошедшие мероприятия.
                                  JSON массив должен выглядеть следующим образом:
                                  [
                                      {
                                          _id: new ObjectId('6699664927fb8fa5acb374aa'),
                                          title: 'Название хакатона',
                                          displayed_location: { icon: 'globe', location: 'Online' },
                                          open_state: 'upcoming',
                                          thumbnail_url: '//d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/002/951/096/datas/medium_square.png',
                                          analytics_identifier: 'InnovateX hackathon (21871)',
                                          url: 'https://innovatex-hackathon.devpost.com/',
                                          time_left_to_submission: 'Upcoming',
                                          submission_period_dates: 'Jul 25 - 29, 2024',
                                          prize_amount: '$<span data-currency-value>6,000</span>',
                                          registrations_count: 16,
                                          featured: false,
                                          organization_name: 'InnovativeX',
                                          winners_announced: false,
                                          submission_gallery_url: 'https://innovatex-hackathon.devpost.com/project-gallery',
                                          start_a_submission_url: 'https://innovatex-hackathon.devpost.com/challenges/start_a_submission',
                                          invite_only: false,
                                          eligibility_requirement_invite_only_description: null,
                                          managed_by_devpost_badge: false,
                                          rules: '',
                                          themes: [ {
                                              "id": 23,
                                              "name": "Beginner Friendly",
                                              "_id": "66874a6054891f9d1650ac28"
                                          },
                                          {
                                              "id": 17,
                                              "name": "Low/No Code",
                                              "_id": "66874a6054891f9d1650ac29"
                                          },
                                          {
                                              "id": 22,
                                              "name": "Open Ended",
                                              "_id": "66874a6054891f9d1650ac2a"
                                          } ],
                                          score: 0.6319528818130493
                                          }
                                  ]
                `,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
      });
  
      const content: string | undefined = gptResponse.choices[0]?.message?.content ?? undefined;
      // console.log('response', content);
      return content;
    } catch (error) {
      console.error('Error hitting OpenAI API:', error);
      return undefined;
    }
  }


//   async function hitOpenAiApiNew(prompt: string): Promise<string | undefined> {
//     try {
//       const gptResponse = await openai.chat.completions.create({
//         model: 'gpt-4o-mini',
//         messages: [
//           {
//             role: 'system',
//             content: `
//             You are professional IT specialist who knows all IT events.
//             You should recommend events to a user based on their preferences.
//             You will get an input array of events and their description.
//             For example, a single object may look something like this: 
//                                       {
//                                           _id: new ObjectId('6699664927fb8fa5acb374aa'),
//                                           title: 'Название хакатона',
//                                           displayed_location: { icon: 'globe', location: 'Online' },
//                                           open_state: 'upcoming',
//                                           thumbnail_url: '//d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/002/951/096/datas/medium_square.png',
//                                           analytics_identifier: 'InnovateX hackathon (21871)',
//                                           url: 'https://innovatex-hackathon.devpost.com/',
//                                           time_left_to_submission: 'Upcoming',
//                                           submission_period_dates: 'Jul 25 - 29, 2024',
//                                           prize_amount: '$<span data-currency-value>6,000</span>',
//                                           registrations_count: 16,
//                                           featured: false,
//                                           organization_name: 'InnovativeX',
//                                           winners_announced: false,
//                                           submission_gallery_url: 'https://innovatex-hackathon.devpost.com/project-gallery',
//                                           start_a_submission_url: 'https://innovatex-hackathon.devpost.com/challenges/start_a_submission',
//                                           invite_only: false,
//                                           eligibility_requirement_invite_only_description: null,
//                                           managed_by_devpost_badge: false,
//                                           rules: '',
//                                           themes: [ {
//                                               "id": 23,
//                                               "name": "Beginner Friendly",
//                                               "_id": "66874a6054891f9d1650ac28"
//                                           },
//                                           {
//                                               "id": 17,
//                                               "name": "Low/No Code",
//                                               "_id": "66874a6054891f9d1650ac29"
//                                           },
//                                           {
//                                               "id": 22,
//                                               "name": "Open Ended",
//                                               "_id": "66874a6054891f9d1650ac2a"
//                                           } ],
//                                           score: 0.6319528818130493
//                                           }

//             User will write their preferences in a text format. You should take this text into the consideration and recommend the Tech events based on the user's preferences.
//             You should write the cause of the event is the best for the user based on their preferences.
//             Return at least 3 events to choose from in the following JSON format:
//           `,
//           },
//           {
//             role: 'user',
//             content: [
//               {
//                 type: 'text',
//                 text: `Here are the events`,
//               },
//             ],
//           },
//           {
//             role: 'user',
//             content: [
//               {
//                 type: 'text',
//                 text: `This is my preferences: ${prompt}`,
//               },
//             ],
//           },
//         ],
//         response_format: {
//           type: 'json_object',
//         },
//       });

//       const content = gptResponse.choices[0]?.message?.content ?? undefined;
//       // console.log('response', content);
//       return content;
//     } catch (error) {
//       console.error('Error hitting OpenAI API:', error);
//       return undefined;
//     }
//   }



const hitOpenAiApiNew = async (prompt: string, events: any[]): Promise<string | undefined> => {
  try {
      const gptResponse = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
              {
                  role: 'system',
                  content: `
                      You are a professional IT specialist who knows all IT events.
                      You should recommend events to a user based on their preferences.
                      You will receive an input array of events and their descriptions.
                      For example, a single object may look something like this:
                      {
                          "_id": "6699664927fb8fa5acb374aa",
                          "title": "Название хакатона",
                          "displayed_location": {"icon": "globe", "location": "Online"},
                          "open_state": "upcoming",
                          "thumbnail_url": "//d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/002/951/096/datas/medium_square.png",
                          "url": "https://innovatex-hackathon.devpost.com/",
                          "time_left_to_submission": "Upcoming",
                          "submission_period_dates": "Jul 25 - 29, 2024",
                          "prize_amount": "$6,000",
                          "registrations_count": 16,
                          "organization_name": "InnovativeX",
                          "invite_only": false,
                          "themes": [
                              {"id": 23, "name": "Beginner Friendly"},
                              {"id": 17, "name": "Low/No Code"},
                              {"id": 22, "name": "Open Ended"}
                          ],
                          "score": 0.6319528818130493
                      }
                      User will write their preferences in text format. You should consider this and recommend the tech events based on the user's preferences.
                      Return at least 9 the most suitable events in the following JSON format:
                  `
              },
              {
                  role: 'user',
                  content: `
                  This is user preference: ${prompt}
                  Here are the events: ${JSON.stringify(events)}`
              }
          ],
          max_tokens: 1500  // Adjust based on expected response size
      });

      const content = gptResponse.choices[0]?.message?.content ?? undefined;
      return content;
  } catch (error) {
      console.error('Error hitting OpenAI API:', error);
      return undefined;
  }
};




export { hitOpenAiApi, hitOpenAiApiTest, hitOpenAiApiNew };
