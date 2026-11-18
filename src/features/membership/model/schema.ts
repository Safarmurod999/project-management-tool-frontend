import { z } from "zod";

export const membershipSchema = z.object({
  userId: z.string(),
  scopeType: z.string(),
  scopeId: z.string(),
  roleId: z.string(),
  override: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  status: z.string(),
});

export const memberSchema = z.object({
  id: z.string(),
  user: z.object({
    name: z.string(),
    email: z.string(),
  }),
  role: z.object({
    name: z.string(),
    description: z.string(),
    code: z.string(),
  }),
  scopeType: z.string(),
  scopeId: z.string(),
  override: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createMembershipSchema = z.object({
  userId: z.string(),
  scopeType: z.string(),
  scopeId: z.string(),
  roleId: z.string(),
});

export const updateMembershipSchema = z.object({
  userId: z.string().optional(),
  scopeType: z.string().optional(),
  scopeId: z.string().optional(),
  roleId: z.string().optional(),
});

export type MembershipFormData = z.infer<typeof membershipSchema>;
export type CreateMembershipFormData = z.infer<typeof createMembershipSchema>;
export type UpdateMembershipFormData = z.infer<typeof updateMembershipSchema>;
