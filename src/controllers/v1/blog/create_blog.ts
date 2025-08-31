import createDOMPurify from 'dompurify';
import { Request, Response } from 'express';
import { logger } from '@src/lib/winston';
import { JSDOM } from 'jsdom';
import blogModel from '@src/models/blog.model';
import { CreateBlogInput } from '@src/schemas/blog.schema';

const window = new JSDOM('').window;
const purify = createDOMPurify(window);

const createBlog = async (req: Request, res: Response) => {
  const { title, content, status, banner } = req.body as CreateBlogInput;
  const userid = req.userId;
  const sanitizedContent = purify.sanitize(content);

  try {
    const newBlog = await blogModel.create({
      title,
      content: sanitizedContent,
      status,
      banner,
      author: userid,
    });
    res
      .status(201)
      .json({ message: 'Blog created successfully', blog: newBlog });
    logger.info(`Blog created successfully: ${newBlog.id}`);
  } catch (err) {
    res
      .status(500)
      .json({ code: 'SERVER_ERROR', message: 'Error creating blog' });
  }
};

export default createBlog;
