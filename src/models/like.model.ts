import { Schema, model, Types } from 'mongoose';

interface Ilike {
  blogId?: Types.ObjectId;
  userId: Types.ObjectId;
  commentId?: Types.ObjectId;
}

const likeSchema = new Schema<Ilike>({
  blogId: {
    type: Schema.Types.ObjectId,
    ref: 'Blog',
  },
  commentId: {
    type: Schema.Types.ObjectId,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default model<Ilike>('Like', likeSchema);