import { Schema, model } from 'mongoose';

export interface IUser {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    x?: string;
    linkedin?: string;
    facebook?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, 'Username is required'],
    maxLength: [20, 'Username must be at most 20 characters'],
    unique: [true, 'Username must be unique'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Email must be unique'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: { values: ['admin', 'user'], message: '{VALUE} is not a valid role' },
    default: 'user',
  },
  firstName: { type: String },
  lastName: { type: String },
  socialLinks: {
    website: { type: String },
    x: { type: String },
    linkedin: { type: String },
    facebook: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel = model<IUser>('User', userSchema);

export default UserModel;
