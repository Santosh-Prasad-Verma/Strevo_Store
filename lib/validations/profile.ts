import { z } from "zod";

export const updateProfileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  date_of_birth: z.string().optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other", ""]).optional(),
});

export const addressSchema = z.object({
  address_type: z.enum(["shipping", "billing"]),
  full_name: z.string().min(2).max(100),
  address_line1: z.string().min(5).max(255),
  address_line2: z.string().max(255).optional().or(z.literal("")),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  postal_code: z.string().regex(/^\d{6}$/, "Invalid postal code"),
  country: z.string().min(2).max(100),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/)
    .optional()
    .or(z.literal("")),
  is_default: z.boolean().default(false),
});

export const userSettingsSchema = z.object({
  email_notifications: z.boolean(),
  sms_notifications: z.boolean(),
  push_notifications: z.boolean(),
  marketing_emails: z.boolean(),
  two_factor_enabled: z.boolean(),
});
