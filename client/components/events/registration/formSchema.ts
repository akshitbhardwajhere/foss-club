import * as z from "zod";

export const eventRegistrationSchema = z
  .object({
    name: z.string().min(2, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email" }),
    institute: z.string().min(2, { message: "Institute name is required" }),
    enrollmentNo: z.string().optional(),
    branch: z.string().min(2, { message: "Branch is required" }),
    isIndividual: z.string().min(1, { message: "Please select an option" }),
    teamName: z.string().optional(),
    teamMembers: z.string().optional(),
    areaOfInterest: z
      .string()
      .min(1, { message: "Area of interest is required" }),
  })
  .superRefine((data, ctx) => {
    if (data.isIndividual === "false") {
      if (!data.teamName || data.teamName.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Team Name is required",
          path: ["teamName"],
        });
      }
      if (!data.teamMembers || data.teamMembers.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Team Members is required",
          path: ["teamMembers"],
        });
      }
    }
  });

export type EventRegistrationValues = z.infer<typeof eventRegistrationSchema>;
