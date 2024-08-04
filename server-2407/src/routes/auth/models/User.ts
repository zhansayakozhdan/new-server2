import { Document, model, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  username?: string;
  password: string | null;
  googleId?: string;
}

export interface IUserWithTokens {
  _id: string;
  email: string;
  username?: string;
  googleId?: string;
  accessToken: string;
  refreshToken: string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  username: { type: String },
  password: { type: String, required: false },
  googleId: { type: String, required: false }
});

const UserModel = model<IUser>('User', userSchema);

export default UserModel;
