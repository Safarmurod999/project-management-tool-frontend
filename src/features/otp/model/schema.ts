import { z } from 'zod';

export const otpRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'Email kiritish shart')
    .email('Noto\'g\'ri email formati'),
});

export type OTPRequestData = z.infer<typeof otpRequestSchema>;

export const otpVerifySchema = z.object({
  code: z
    .string()
    .min(1, 'OTP kod kiritish shart')
    .min(6, 'OTP kod 6 raqamdan iborat bo\'lishi kerak'),
});

export type OTPVerifyData = z.infer<typeof otpVerifySchema>;
