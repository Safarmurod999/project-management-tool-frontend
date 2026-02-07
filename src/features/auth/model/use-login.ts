import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/shared/api';
import { useAuthStore } from '@/entities/user';
import type { LoginFormData } from './schema';
import type { LoginResponse } from '@/entities/user';

export const useLogin = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: LoginFormData) => authApi.login(data),
    onSuccess: (response: LoginResponse) => {
      // Response'dan JWT token'ni olish
      const accessToken = response.data;
      
      // Token'ni localStorage'ga saqlash
      localStorage.setItem('access_token', accessToken);
      
      // Auth store'ni update qilish
      setUser({ id: '', email: '', name: '', role: '', createdAt: '', updatedAt: '' });
      
      // Refresh token cookie'da bo'ladi, har manual saqlashning kerak emas
    },
  });
};
