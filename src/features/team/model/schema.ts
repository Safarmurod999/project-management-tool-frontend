import { z } from "zod";

export const teamSchema = z.object({
  name: z.string().min(1, "Jamoa nomi majburiy"),
  description: z.string().min(1, "Jamoa tavsifi majburiy"),
  ownerId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.string(),
});

export const createTeamSchema = z.object({
  name: z.string().min(1, "Jamoa nomi majburiy").max(100, "Jamoa nomi juda uzun"),
  description: z.string().min(1, "Jamoa tavsifi majburiy").max(500, "Jamoa tavsifi juda uzun"),
});

export const updateTeamSchema = z.object({
  name: z.string().min(1, "Jamoa nomi majburiy").max(100, "Jamoa nomi juda uzun").optional(),
  description: z.string().min(1, "Jamoa tavsifi majburiy").max(500, "Jamoa tavsifi juda uzun").optional(),
  status: z.string().optional(),
});

export type TeamFormData = z.infer<typeof teamSchema>;
export type CreateTeamFormData = z.infer<typeof createTeamSchema>;
export type UpdateTeamFormData = z.infer<typeof updateTeamSchema>;