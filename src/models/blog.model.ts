import { generateSlug } from '@src/utils/index.util';
import { model, Schema, Types } from 'mongoose';

export interface IBlog {
  title: string;
  content: string;
  slug: string;
  banner: {
    publicId: string;
    url: string;
    width: number;
    height: number;
  };
  author: Types.ObjectId;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    content: { type: String, required: [true, 'Content is required'] },
    slug: { type: String, required: [true, 'Slug is required'], unique: true },
    banner: {
      publicId: {
        type: String,
        required: [true, 'Banner publicId is required'],
      },
      url: { type: String, required: [true, 'Banner URL is required'] },
      width: { type: Number, required: [true, 'Banner width is required'] },
      height: { type: Number, required: [true, 'Banner height is required'] },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    viewsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published', 'archived'],
        message: '{VALUE} is not a valid status',
      },
      default: 'draft',
    },
  },
  {
    timestamps: {
      createdAt: 'publishedAt',
      updatedAt: 'updatedAt',
    },
  },
);

// Mongoose Pre validate is used to ensure that the slug field is validated alongside the other fields upon saving
blogSchema.pre<IBlog>('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = generateSlug(this.title);
  }
  if (this.slug) {
    this.slug = this.slug.toLowerCase().trim();
  }

  next();
});

const blogModel = model<IBlog>('Blog', blogSchema);

export default blogModel;
