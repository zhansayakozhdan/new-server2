import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

async function hitOpenAiApi(prompt: string): Promise<string | undefined> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
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
                                          title: 'Название мероприятия',
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
    console.log('Sending request to OpenAI API with prompt:', prompt);
    console.log('Events data being sent:', events);

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
                "submission_period_dates": "25.09.2024 - 29.09.2024",
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
            Do not invent non-existent events that are not on the list, take only those suitable events from my list.
            Add the reason field there and specify the reason for choosing this event based on the user's request and also document. Add this fields 
            "_id": укажи _id,
            "title": укажи title,
            "url": укажи url,
            "description": возьми это поле с самой базы данных,
            "reason": пропиши аргументируя почему я должна заинтересоваться именно этим мероприятеим,
            "date": укажи дату в формате DD.MM.YYYY, возьми это поле с самой базы данных submission_period_dates, чтобы вскоре я могла данное мероприятие добавить в гугл календарь, если не найдешь то укажи 'не указан',
           "thumbnail_url": укажи thumbnail_url если есть, а если нет null,
           "location": укажи место где будет проходить это мероприятие или же он онлайн, если не найдешь то укажи 'не указан',

            Return at least 6 of the most suitable events (it can be conference, hackathon, meetup or any type of events) based on user's preference in the following JSON format:
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

    if (!gptResponse || !gptResponse.choices || gptResponse.choices.length === 0) {
      console.error('No choices received in the response from OpenAI API');
      return undefined;
    }

    const content = gptResponse.choices[0].message?.content?.trim();
    console.log('Received content from OpenAI API:', content);

    return content;
  } catch (error) {
    console.error('Error hitting OpenAI API:', error);
    return undefined;
  }
};




async function hitOpenAiApiTwo(prompt: string): Promise<string | undefined> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content: string | undefined = response.choices[0]?.message?.content ?? undefined;
    return content;
  } catch (error) {
    console.error('Error hitting OpenAI API:', error);
    return undefined;
  }
}

export { hitOpenAiApi, hitOpenAiApiTest, hitOpenAiApiNew, hitOpenAiApiTwo };
