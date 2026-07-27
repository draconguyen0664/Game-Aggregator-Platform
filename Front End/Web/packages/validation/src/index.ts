import { z } from "zod";

export const identifierSchema = z.string().trim().min(1).max(128);
export const emailSchema = z.email("Enter a valid email address");
export const passwordSchema = z.string().min(12, "Use at least 12 characters").max(128).regex(/[A-Z]/, "Add an uppercase letter").regex(/[a-z]/, "Add a lowercase letter").regex(/[0-9]/, "Add a number");
export const slugSchema = z.string().trim().min(2).max(64).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1, "Enter your password") });
export const forgotPasswordSchema = z.object({ email: emailSchema });
export const resetPasswordSchema = z.object({ password: passwordSchema, confirmPassword: z.string() }).refine((value) => value.password === value.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });
export const mfaSchema = z.object({ code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code") });
export const pageRequestSchema = z.object({ page: z.number().int().min(0).default(0), size: z.number().int().min(1).max(200).default(20), sort: z.string().optional() });

export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type MfaInput = z.infer<typeof mfaSchema>;
export type PageRequestInput = z.input<typeof pageRequestSchema>;
