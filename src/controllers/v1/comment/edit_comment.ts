import { logger } from '@src/lib/winston';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import blogModel from '@src/models/blog.model';
import commentModel from '@src/models/comment.model';
import type { Request, Response } from 'express';
import { CommentInputType } from '@src/schemas/comment.schema';
import 'dompurify';
import userModel from '@src/models/user.model';

const window = new JSDOM('').window;
const purify = createDOMPurify(window);

const editComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { content } = req.body as CommentInputType;
  const userId = req.userId;

  try {
    const comment = await commentModel.findById(commentId).exec();
    const user = await userModel.findById(userId).select('role ').lean().exec();
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment?.userId !== userId && user?.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });

    const cleanContent = purify.sanitize(content);

    const newComment = await commentModel.updateOne(
      {
        userId,
        _id: comment._id,
        blogId: comment.blogId,
      },
      {
        content: cleanContent,
      },
    );

    logger.info(`Comment edited successfully: ${comment._id}`);
    return res.status(200).json({
      message: 'Comment edited successfully',
    });
  } catch (error) {
    logger.error('Error editing comment: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default editComment;
