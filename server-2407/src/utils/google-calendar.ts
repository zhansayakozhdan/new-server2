// import { google } from 'passport-google-oauth20';
// import path from 'path';
// import fs from 'fs';
// import { OAuth2Client } from '';

// // Путь к вашему файлу credentials.json
// const CREDENTIALS_PATH = path.resolve(__dirname, 'credentials.json');
// const TOKEN_PATH = path.resolve(__dirname, 'token.json');

// const SCOPES = ['https://www.googleapis.com/auth/calendar'];

// export const getOAuth2Client = (): OAuth2Client => {
//   const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
//   const { client_id, client_secret, redirect_uris } = credentials.installed;
//   return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
// };

// export const getCalendarClient = async () => {
//   const oAuth2Client = getOAuth2Client();
  
//   // Load previously authorized token from disk
//   try {
//     const token = fs.readFileSync(TOKEN_PATH, 'utf-8');
//     oAuth2Client.setCredentials(JSON.parse(token));
//   } catch (err) {
//     throw new Error('Token not found. Please authenticate first.');
//   }
  
//   return google.calendar({ version: 'v3', auth: oAuth2Client });
// };
