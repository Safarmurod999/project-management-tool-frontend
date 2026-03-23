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

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email kiritish shart')
    .email('Noto\'g\'ri email formati'),
  name: z
    .string()
    .min(1, 'Ism kiritish shart'),
  password: z
    .string()
    .min(1, 'Parol kiritish shart'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
