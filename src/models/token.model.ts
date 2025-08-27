import { model, Schema, Types } from 'mongoose';

export interface IToken {
  token: string;
  userId: Types.ObjectId;
}

const tokenSchema = new Schema<IToken>({
  token: {
    type: String,
    required: [true, 'Token is required'],
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Schema is required'],
  },
});

export default model<IToken>('Token', tokenSchema);
