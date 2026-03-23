import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/shared/api';
import { useAuthStore } from '@/entities/user';
import type { RegisterFormData } from './schema';
import type { RegisterResponse } from '@/entities/user/model/types';

export const useRegister = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: RegisterFormData) => authApi.register(data),
    onSuccess: (response: RegisterResponse) => {
      // Response'dan JWT token'ni olish
      const res = response.data;
      
      // Token'ni localStorage'ga saqlash
      localStorage.setItem('userData', JSON.stringify(res));
      
      // Auth store'ni update qilish
      setUser({ id: '', email: '', name: '', role: '', createdAt: '', updatedAt: '' });
      
      // Refresh token cookie'da bo'ladi, har manual saqlashning kerak emas
    },
  });
};
