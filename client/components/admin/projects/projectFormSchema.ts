import * as z from "zod";

export const projectFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().optional(),
  url: z.string().url({ message: "Please enter a valid website/project URL." }),
  githubUrl: z
    .string()
    .url({ message: "Please enter a valid GitHub URL." })
    .or(z.literal(""))
    .optional(),
  mediaType: z.enum(["image", "video"]),
  previewUrl: z.string().min(1, { message: "Preview image or video URL is required." }),
  developedBy: z.string().min(2, { message: "Developed by is required." }),
  order: z.number().optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
