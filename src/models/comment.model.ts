import { Schema, model, Types } from 'mongoose';

interface IComment {
  content: string;
  userId: Types.ObjectId;
  blogId: Types.ObjectId;
}

const commentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    blogId: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
  },
  { timestamps: true },
);

const commentModel = model<IComment>('Comment', commentSchema);

export default commentModel;
