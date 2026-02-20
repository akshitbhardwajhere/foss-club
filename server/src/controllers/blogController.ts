import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

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

export const updateBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, content, author, tags, imageUrl } = req.body;
    const id = req.params.id as string;

    const blogExists = await prisma.blog.findUnique({ where: { id } });

    if (blogExists) {
      const updatedBlog = await prisma.blog.update({
        where: { id },
        data: {
          title: title || undefined,
          content: content || undefined,
          author: author || undefined,
          tags: tags ? { set: tags } : undefined,
          imageUrl: imageUrl || undefined,
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

export const deleteBlog = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;

    const blogExists = await prisma.blog.findUnique({ where: { id } });

    if (blogExists) {
      await prisma.blog.delete({ where: { id } });
      res.json({ message: "Blog removed" });
    } else {
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
