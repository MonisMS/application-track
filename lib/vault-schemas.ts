import { z } from "zod";

// Accepts empty string or a valid http/https URL; transforms to null if empty
const optionalUrl = z
  .string()
  .trim()
  .transform((v) => v || null)
  .pipe(
    z
      .string()
      .url("Must be a valid URL")
      .startsWith("http", "URL must start with http:// or https://")
      .nullable()
  )
  .optional()
  .default(null);

export const vaultSchema = z.object({
  fullName: z.string().trim().max(100).optional().transform((v) => v || null),
  email: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || null)
    .pipe(z.string().email("Invalid email").nullable()),
  phone: z.string().trim().max(30).optional().transform((v) => v || null),
  location: z.string().trim().max(100).optional().transform((v) => v || null),
  portfolioUrl: optionalUrl,
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  twitterUrl: optionalUrl,
  resumeUrl: optionalUrl,
  defaultFollowUpDays: z.coerce
    .number()
    .int()
    .min(1, "Must be at least 1")
    .max(30, "Must be at most 30")
    .default(7),
});

export const snippetSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Max 100 chars"),
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(5000, "Max 5000 chars"),
});

export type VaultInput = z.infer<typeof vaultSchema>;
export type SnippetInput = z.infer<typeof snippetSchema>;
