import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(1, "Foydalanuvchi nomi majburiy"),
  email: z.string().min(1, "Email kiritish majburiy"),
  role: z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
  }),
  permissions: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      code: z.string(),
    })
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UserData = z.infer<typeof userSchema>;