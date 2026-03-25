import { Request, Response } from "express";
import prisma from "../config/prisma";
import { deleteCloudinaryImage } from "../utils/cloudinary";

/**
 * Retrieves a list of all blogs, ordered by newest first.
 * Does not include full content to keep the payload lightweight.
 *
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.
 */
export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        author: true,
        tags: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Retrieves a single blog by its ID, including full content.
 *
 * @param {Request} req - The express request object containing the blog ID in params.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
export const getBlogById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Creates a new blog post.
 *
 * @param {Request} req - The express request object containing blog data in body.
 * @param {Response} res - The express response object.
 */
export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, author, tags, imageUrl } = req.body;

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        author,
        tags: tags || [],
        imageUrl,
      },
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Updates an existing blog post.
 * If a new image URL is provided, securely deletes the old image from Cloudinary.
 *
 * @param {Request} req - The express request object containing updated blog data in body and ID in params.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
export const updateBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, content, author, tags, imageUrl } = req.body;
    const id = req.params.id as string;

    const blogExists = await prisma.blog.findUnique({ where: { id } });

    if (blogExists) {
      if (
        imageUrl !== undefined &&
        blogExists.imageUrl &&
        imageUrl !== blogExists.imageUrl
      ) {
        await deleteCloudinaryImage(blogExists.imageUrl);
      }

      const updatedBlog = await prisma.blog.update({
        where: { id },
        data: {
          title: title || undefined,
          content: content || undefined,
          author: author || undefined,
          tags: tags ? { set: tags } : undefined,
          imageUrl: imageUrl === "" ? null : imageUrl || undefined,
        },
      });
      res.json(updatedBlog);
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Deletes a specifically identified blog post.
 * Also removes any associated images from Cloudinary to prevent orphaned assets.
 *
 * @param {Request} req - The express request object containing the blog ID in params.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>}
 */
export const deleteBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;

    const blogExists = await prisma.blog.findUnique({ where: { id } });

    if (blogExists) {
      if (blogExists.imageUrl) {
        await deleteCloudinaryImage(blogExists.imageUrl);
      }
      await prisma.blog.delete({ where: { id } });
      res.json({ message: "Blog removed" });
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
