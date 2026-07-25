import { z } from "zod";

export const identifierSchema = z.string().trim().min(1).max(128);
export const emailSchema = z.email();
export const slugSchema = z
  .string()
  .trim()
  .min(2)
  .max(64)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const pageRequestSchema = z.object({
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(200).default(20),
  sort: z.string().optional(),
});

export type PageRequestInput = z.input<typeof pageRequestSchema>;
