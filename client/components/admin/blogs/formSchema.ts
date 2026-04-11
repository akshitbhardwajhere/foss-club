import * as z from "zod";

export const blogFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  author: z.string().min(2, { message: "Author needed." }),
  content: z.string().min(50, { message: "Blog content needed." }),
  imageUrl: z.string().optional(),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;
