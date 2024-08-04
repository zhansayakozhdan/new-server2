// src/controllers/authController.ts
import { Request, Response } from 'express';
import * as authService from './auth-service';
import { oauth2Client } from './auth-service';
import { getGoogleUserProfile } from './auth-service';


export const googleCallback = async (req: Request, res: Response) => {
    try {
      const { code } = req.query;
      const { tokens } = await oauth2Client.getToken(code as string);
      oauth2Client.setCredentials(tokens);
  
      // Retrieve user profile information
      const userInfo = await getGoogleUserProfile();
  
      if (userInfo) {
        // Here you would typically store user info in your database
        // and issue your own application-specific tokens
        const accessToken = tokens.access_token;
        const refreshToken = tokens.refresh_token;
  
        // Redirect to frontend with tokens (avoid exposing tokens in URL in production)
        res.redirect(`https://techeventsai.vercel.app/?accessToken=${accessToken}&refreshToken=${refreshToken}`);
      } else {
        res.status(401).json({ message: 'Unable to fetch user profile' });
      }
    } catch (error) {
      console.error('Error during Google OAuth callback:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

export const redirectToGoogle = (req: Request, res: Response) => {
  const url = authService.getAuthUrl();
  res.redirect(url);
};

export const handleGoogleCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const tokens = await authService.getTokens(code);
    const userInfo = await authService.getGoogleUserProfile();

    // Save the tokens and user info to your database
    console.log('User Info:', userInfo);
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);

    // Fetch calendar events
    const events = await authService.getCalendarEvents();
    console.log('Google Calendar Events:', events);

    //res.send('Успешная авторизация');
    res.redirect(`https://techeventsai.vercel.app`)
  } catch (error) {
    console.error('Ошибка при авторизации:', error);
    res.status(500).send('Ошибка при авторизации');
  }
};

export const checkTokens = async (req: Request, res: Response) => {
    try {
      const { accessToken, refreshToken } = req.body;
  
      // Set credentials
      oauth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });
  
      // Verify the token by getting user profile
      const userInfo = await getGoogleUserProfile();
  
      if (userInfo) {
        // Respond with user information and tokens
        return res.json({
          user: userInfo,
          accessToken: oauth2Client.credentials.access_token,
          refreshToken: oauth2Client.credentials.refresh_token,
        });
      } else {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
    } catch (error) {
      console.error('Error verifying tokens:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
