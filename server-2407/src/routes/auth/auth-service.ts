import { CreateUserDto } from './dtos/CreateUser.dto';
import { IUser } from './models/User';
import UserModel from './models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import RefreshTokenModel from './models/RefreshToken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

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

  private generateRefreshToken(user: IUser): string {
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

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: `${process.env.SERVER_API_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await UserModel.findOne({ googleId: profile.id });

    if (!user) {
      user = new UserModel({
        googleId: profile.id,
        email: profile.emails[0].value,
        username: profile.displayName,
        password: null
      });
      await user.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Correctly typing the user for serializeUser and deserializeUser
passport.serializeUser((user, done) => {
  done(null, (user as IUser)._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default AuthService;
export { passport };
