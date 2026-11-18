import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(1, "Loyiha nomi majburiy"),
  code: z.string().min(1, "Loyiha tavsifi majburiy"),
  roleId: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(1, "Loyiha nomi majburiy")
    .max(100, "Loyiha nomi juda uzun"),
  code: z
    .string()
    .min(1, "Loyiha tavsifi majburiy")
    .max(500, "Loyiha tavsifi juda uzun"),
  status: z.string(),
});

export const updateRoleSchema = z.object({
  name: z
    .string()
    .min(1, "Loyiha nomi majburiy")
    .max(100, "Loyiha nomi juda uzun"),
  teamId: z.string(),
  status: z.string(),
  description: z
    .string()
    .min(1, "Loyiha tavsifi majburiy")
    .max(500, "Loyiha tavsifi juda uzun"),
});

export type RoleFormData = z.infer<typeof roleSchema>;
export type CreateRoleFormData = z.infer<typeof createRoleSchema>;
export type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;
