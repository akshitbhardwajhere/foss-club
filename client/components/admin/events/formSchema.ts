import * as z from "zod";

export const EVENT_CATEGORIES = [
  "Workshop",
  "TechTalk / Seminar",
  "Hackathon",
] as const;

export const speakerFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  role: z.string().min(1, { message: "Role is required." }),
  org: z.string().min(1, { message: "Organization is required." }),
  imageUrl: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  bio: z.string().min(5, { message: "Bio must be at least 5 characters." }),
});

export const eventFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  category: z.string().min(1, { message: "Category is required." }),
  date: z.string().min(1, { message: "Date is required." }),
  location: z.string().min(1, { message: "Location empty." }),
  description: z.string().min(10, { message: "Description needed." }),
  imageUrl: z.string().optional(),
  documentUrl: z.string().optional(),
  isDateTentative: z.boolean().optional(),
  speakers: z.array(speakerFormSchema),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
