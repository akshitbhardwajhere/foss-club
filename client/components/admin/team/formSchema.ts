import * as z from "zod";

export const TEAM_ROLES = [
  "Team Lead",
  "Co-Lead",
  "Core Team Member",
  "Graphic Designer",
  "Content Writer",
  "Volunteer",
] as const;

export const teamFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  role: z.string().min(1, { message: "Role is required." }),
  email: z.string().email().optional().or(z.literal("")),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  imageUrl: z.string().optional(),
});

export type TeamFormValues = z.infer<typeof teamFormSchema>;
