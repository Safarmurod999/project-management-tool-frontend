import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/shared/api';
import type { LoginFormData } from './schema';
import type { LoginResponse } from '@/entities/user';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: (response: LoginResponse) => {
      // Response'dan JWT token'ni olish
      const accessToken = response.data;
      
      // Token'ni localStorage'ga saqlash
      localStorage.setItem('access_token', accessToken);
      
      // Refresh token cookie'da bo'ladi, har manual saqlashning kerak emas
    },
  });
};
