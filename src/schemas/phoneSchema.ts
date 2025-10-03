import { z } from "zod";

export const phoneSchema = z.object({
  countryCode: z.string().min(1, "Please select a country"),
  phoneNumber: z
    .string()
    .min(6, "Phone number must be at least 6 digits")
    .max(15, "Phone number is too long"),
});

export type PhoneFormData = z.infer<typeof phoneSchema>;
