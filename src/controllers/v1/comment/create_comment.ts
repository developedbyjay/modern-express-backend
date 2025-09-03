import { logger } from '@src/lib/winston';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import blogModel from '@src/models/blog.model';
import commentModel from '@src/models/comment.model';
import type { Request, Response } from 'express';
import { CommentInputType } from '@src/schemas/comment.schema';
import 'dompurify';

const window = new JSDOM('').window;
const purify = createDOMPurify(window);

const commentBlog = async (req: Request, res: Response) => {
  const { blogId } = req.params;
  const { content } = req.body as CommentInputType;
  const userId = req.userId;

  try {
    const blog = await blogModel
      .findById(blogId)
      .select('_id commentsCount')
      .exec();
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const cleanContent = purify.sanitize(content);

    const comment = await commentModel.create({
      content: cleanContent,
      userId,
      blogId,
    });

    blog.commentsCount += 1;
    await blog.save();

    logger.info(
      `Comment created successfully: ${comment._id} on blog: ${blogId}`,
    );
    return res.status(201).json({
      message: 'Comment added successfully',
      comment,
    });
  } catch (error) {
    logger.error('Error creating comment: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default commentBlog;
