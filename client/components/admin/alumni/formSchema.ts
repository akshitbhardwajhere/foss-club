import * as z from "zod";

export const alumniFormSchema = z.object({
  teamMemberId: z.string().min(1, { message: "Please select a team member." }),
  role: z.string().min(1, { message: "Role is required." }),
  company: z.string().optional(),
});

export type AlumniFormValues = z.infer<typeof alumniFormSchema>;
