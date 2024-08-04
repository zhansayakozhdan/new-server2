import { CreateUserDto } from './dtos/CreateUser.dto';
import { IUser, IUserWithTokens } from './models/User';
import UserModel from './models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import RefreshTokenModel from './models/RefreshToken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

dotenv.config();

class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET!;
  private readonly jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;

  async registerUser(createUserDto: CreateUserDto): Promise<IUser> {
    const { email, password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      email,
      password: hashedPassword
    });

    await newUser.save();
    return newUser;
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<{
    user: IUser;
    accessToken: string;
    refreshToken: string;
  } | null> {
    const user = await UserModel.findOne({ email });
    if (!user || !user.password) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    const accessToken = this.generateJwt(user);
    const refreshToken = this.generateRefreshToken(user);

    const refreshTokenDoc = new RefreshTokenModel({
      token: refreshToken,
      user: user._id
    });
    await refreshTokenDoc.save();

    return { user, accessToken, refreshToken };
  }

  generateJwt(user: IUser): string {
    return jwt.sign({ id: user._id, email: user.email }, this.jwtSecret, {
      expiresIn: '1h'
    });
  }

   generateRefreshToken(user: IUser): string {
    return jwt.sign(
      { id: user._id, email: user.email },
      this.jwtRefreshSecret,
      { expiresIn: '7d' }
    );
  }

  verifyJwt(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (err) {
      return null;
    }
  }

  verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtRefreshSecret);
    } catch (err) {
      return null;
    }
  }

  async getUserById(id: string) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error('Event not found');
    }

    return user;
  }

  async refreshToken(
    oldToken: string
  ): Promise<{ accessToken: string; refreshToken: string } | null> {
    const payload = this.verifyRefreshToken(oldToken);
    if (!payload) return null;

    const user = await UserModel.findById(payload.id);
    if (!user) return null;

    const newAccessToken = this.generateJwt(user);
    const newRefreshToken = this.generateRefreshToken(user);

    const refreshTokenDoc = new RefreshTokenModel({
      token: newRefreshToken,
      user: user._id
    });
    await refreshTokenDoc.save();

    await RefreshTokenModel.deleteOne({ token: oldToken });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}

export default AuthService;

// const authService = new AuthService();
// const oauth2Client = new OAuth2Client(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   `${process.env.SERVER_API_URL}/api/v5/auth/google/callback`
// );



export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${process.env.SERVER_API_URL}/api/v5/auth/google/callback`
);

export const getAuthUrl = (): string => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
};


export const getTokens = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens;
};

export const getGoogleUserProfile = async () => {
  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2',
  });

  const userInfo = await oauth2.userinfo.get();
  return userInfo.data;
};
export const getCalendarEvents = async () => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const events = await calendar.events.list({ calendarId: 'primary' });
  return events.data.items;
};







// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID!,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//   callbackURL: `${process.env.SERVER_API_URL}/api/v5/auth/google/callback`,
// }, async (accessToken: string, refreshToken: string, profile: any, done: Function) => {
//   try {
//     let user = await UserModel.findOne({ googleId: profile.id });

//     if (!user) {
//       user = new UserModel({
//         googleId: profile.id,
//         email: profile.emails[0].value,
//         username: profile.displayName,
//         password: null,
//       });
//       await user.save();
//     }

//     // Save the refresh token
//     await RefreshTokenModel.updateOne(
//       { user: user._id },
//       { token: refreshToken },
//       { upsert: true }
//     );

//     // Generate application-specific tokens
//     const newAccessToken = authService.generateJwt(user);
//     const newRefreshToken = authService.generateRefreshToken(user);

//     // Pass user and tokens to the callback
//     const userWithTokens: IUserWithTokens = {
//       _id: user._id.toString(),
//       email: user.email,
//       username: user.username,
//       googleId: user.googleId,
//       accessToken: newAccessToken,
//       refreshToken: newRefreshToken,
//     };

//     done(null, userWithTokens);
//   } catch (err) {
//     console.error('Error during Google authentication:', err);
//     done(err, null);
//   }
// }));





// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID!,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     callbackURL: `${process.env.SERVER_API_URL}/api/v5/auth/google/callback`,
//   }, async (accessToken: string, refreshToken: string, profile: any, done: Function) => {
//     try {
//       let user = await UserModel.findOne({ googleId: profile.id });
  
//       if (!user) {
//         user = new UserModel({
//           googleId: profile.id,
//           email: profile.emails[0].value,
//           username: profile.displayName,
//           password: null,
//         });
//         await user.save();
//       }
  
//       // Generate new tokens
//       const newAccessToken = authService.generateJwt(user);
//       const newRefreshToken = authService.generateRefreshToken(user);
  
//       // Save the refresh token
//       await RefreshTokenModel.updateOne(
//         { user: user._id }, 
//         { token: newRefreshToken }, 
//         { upsert: true }
//       );
  
//       // Pass user and tokens to the callback
//       done(null, { user, accessToken: newAccessToken, refreshToken: newRefreshToken });
//     } catch (err) {
//       done(err, null);
//     }
//   }));

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID!,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//   callbackURL: `${process.env.SERVER_API_URL}/api/v5/auth/google/callback`
// }, async (accessToken, refreshToken, profile, done): Promise<{
//   user: IUser;
//   accessToken: string;
//   refreshToken: string;
// } | null> => {
//   try {
//     let user = await UserModel.findOne({ googleId: profile.id });

//     if (!user) {
//       user = new UserModel({
//         googleId: profile.id,
//         email: profile.emails[0].value,
//         username: profile.displayName,
//         password: null
//       });
//       await user.save();
//     }

//     // Return only the user object, not the accessToken
//     return done(null, user, accessToken, refreshToken, profile);
//   } catch (err) {
//     return done(err, null);
//   }
// }));

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  // Ensure that the user object has the _id field
  if (user && (user as IUser)._id) {
    done(null, (user as IUser)._id);
  } else {
    done(new Error('User object is missing _id'), null);
  }
});

passport.deserializeUser(async (id: string, done) => {
  console.log('Deserializing user with ID:', id);
  try {
    const user = await UserModel.findById(id);
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'), null);
    }
  } catch (err) {
    done(err, null);
  }
});

export { passport };
