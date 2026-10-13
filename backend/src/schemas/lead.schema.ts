import { z } from "zod";

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .max(150, "Email cannot exceed 150 characters"),
  phone: z
    .string()
    .trim()
    .min(7, "Phone must be at least 7 characters")
    .max(50, "Phone cannot exceed 50 characters"),
  investment_amount: z
    .string()
    .trim()
    .min(1, "Investment amount cannot be empty")
    .max(100, "Investment amount cannot exceed 100 characters"),
  website: z
    .string()
    .trim()
    .max(150, "Website cannot exceed 150 characters")
    .optional()
    .or(z.literal("")),
  comment: z
    .string()
    .trim()
    .max(1000, "Comment cannot exceed 1000 characters")
    .optional()
    .or(z.literal("")),
  // Honeypot fields to catch bots
  hp_field: z.string().optional(),
  trap_website: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export function isHoneypotTriggered(body: Record<string, unknown>): boolean {
  const hp = body.hp_field;
  const trap = body.trap_website;

  if (hp !== undefined && hp !== null && String(hp).trim().length > 0) {
    return true;
  }
  if (trap !== undefined && trap !== null && String(trap).trim().length > 0) {
    return true;
  }
  return false;
}
