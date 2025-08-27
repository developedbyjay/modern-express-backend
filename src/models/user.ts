import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
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
}

const userSchema = new Schema<IUser>(
  {
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
      enum: {
        values: ['admin', 'user'],
        message: '{VALUE} is not a valid role',
      },
      default: 'user',
    },
    firstName: {
      type: String,
      maxLength: [100, 'First name must be at most 100 characters'],
    },
    lastName: {
      type: String,
      maxLength: [100, 'Last name must be at most 100 characters'],
    },
    socialLinks: {
      website: {
        type: String,
        maxLength: [100, 'Website URL must be at most 100 characters'],
      },
      x: {
        type: String,
        maxLength: [100, 'X (Twitter) handle must be at most 100 characters'],
      },
      linkedin: {
        type: String,
        maxLength: [100, 'LinkedIn URL must be at most 100 characters'],
      },
      facebook: {
        type: String,
        maxLength: [100, 'Facebook URL must be at most 100 characters'],
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const UserModel = model<IUser>('User', userSchema);

export default UserModel;
