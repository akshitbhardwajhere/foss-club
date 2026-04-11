import * as z from "zod";

export const EVENT_CATEGORIES = [
  "Workshop",
  "TechTalk / Seminar",
  "Hackathon",
] as const;

export const eventFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  category: z.string().min(1, { message: "Category is required." }),
  date: z.string().min(1, { message: "Date is required." }),
  location: z.string().min(1, { message: "Location empty." }),
  description: z.string().min(10, { message: "Description needed." }),
  imageUrl: z.string().optional(),
  documentUrl: z.string().optional(),
  isDateTentative: z.boolean().optional(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
