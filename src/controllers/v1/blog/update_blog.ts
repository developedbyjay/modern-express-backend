import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import userModel from '@src/models/user.model';
import blogModel from '@src/models/blog.model';
import { Request, Response } from 'express';
import { UpdateBlogInput } from '@src/schemas/blog.schema';
import { logger } from '@src/lib/winston';
const window = new JSDOM('').window;
const purify = createDOMPurify(window);

const update_blog = async (req: Request, res: Response) => {
  const blogId = req.params.blogId;
  const userId = req.userId;
  const { content, title, banner, status } = req.body as UpdateBlogInput;

  try {
    const user = await userModel.findById(userId).select('role').lean().exec();
    const blog = await blogModel.findById(blogId).select('-__v').exec();
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (blog.author !== userId && user?.role !== 'admin') {
      return res.status(403).json({ code: 'FORBIDDEN', error: 'Forbidden' });
    }

    if (title) blog.title = title;
    if (content) blog.content = purify.sanitize(content);
    if (banner) blog.banner = banner;
    if (status) blog.status = status;

    await blog.save();

    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    logger.error({
      message: 'Error updating blog',
      error,
    });

    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default update_blog;
