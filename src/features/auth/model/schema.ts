import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email kiritish shart'),
  password: z
    .string()
    .min(1, 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
