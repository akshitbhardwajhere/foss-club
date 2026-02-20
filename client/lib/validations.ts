import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().datetime(),
  location: z.string().min(3, "Location must be at least 3 characters"),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal('')),
});

export const newsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  author: z.string().min(2, "Author must be at least 2 characters"),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal('')),
});

export const blogSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  author: z.string().min(2, "Author must be at least 2 characters"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal('')),
});
