import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(1, "Loyiha nomi majburiy"),
  description: z.string().min(1, "Loyiha tavsifi majburiy"),
  teamId: z.string(),
  userId: z.string(),
  roleId: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Loyiha nomi majburiy")
    .max(100, "Loyiha nomi juda uzun"),
  teamId: z.string(),
  userId: z.string(),
  roleId: z.string(),
  status: z.string(),
  description: z
    .string()
    .min(1, "Loyiha tavsifi majburiy")
    .max(500, "Loyiha tavsifi juda uzun"),
});

export const updateProjectSchema = z.object({
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

export type ProjectFormData = z.infer<typeof projectSchema>;
export type CreateProjectFormData = z.infer<typeof createProjectSchema>;
export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>;
