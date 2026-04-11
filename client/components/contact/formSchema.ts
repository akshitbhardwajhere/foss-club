import * as z from "zod";

export const contactFormSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z
      .string()
      .refine((val) => !val || val.length >= 10, {
        message: "Please enter a valid phone number.",
      })
      .optional(),
    isNitSrinagar: z.string().min(1, {
      message: "Please select if you are from NIT Srinagar.",
    }),
    institute: z.string().optional(),
    enrollment: z.string().optional(),
    expertise: z.string().min(2, {
      message: "Expertise must be at least 2 characters.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.isNitSrinagar === "yes") {
      if (!data.enrollment || data.enrollment.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enrollment number is required.",
          path: ["enrollment"],
        });
      }
    } else if (data.isNitSrinagar === "no") {
      if (!data.institute || data.institute.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Institute name must be at least 2 characters.",
          path: ["institute"],
        });
      }
    }
  });

export type ContactFormValues = z.infer<typeof contactFormSchema>;
