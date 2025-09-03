import type { Request, Response } from 'express';
import { logger } from '@src/lib/winston';
import commentModel from '@src/models/comment.model';
import blogModel from '@src/models/blog.model';
import userModel from '@src/models/user.model';

const deleteComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;

  try {
    const [comment, user] = await Promise.all([
      commentModel.findById(commentId).select('userId blogId').exec(),
      userModel.findById(req.userId).select('role').exec(),
    ]);

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.userId !== req.userId && user?.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Promise.all([
      commentModel.deleteOne({ _id: commentId }),
      blogModel.updateOne(
        { _id: comment?.blogId },
        { $inc: { commentsCount: -1 } },
      ),
    ]);

    logger.info(`Comment deleted: ${commentId}`);
    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    logger.error('Error deleting comment: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default deleteComment;
