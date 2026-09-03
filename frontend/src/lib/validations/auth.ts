import { z } from "zod";

export const phoneSchema = z.object({
  phone_number: z
    .string()
    .trim()
    .min(8, "Phone number is too short")
    .max(20, "Phone number is too long"),
});

export const otpSchema = z.object({
  otp_code: z
    .string()
    .trim()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

export const registerSchema = otpSchema.extend({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
});

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
});

export type PhoneValues = z.infer<typeof phoneSchema>;
export type OtpValues = z.infer<typeof otpSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
