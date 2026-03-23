import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/shared/api';
import { useAuthStore } from '@/entities/user';

export const useVerifyUserRegistration = () => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: { userId: string; token: string }) =>
      authApi.verifyUserRegistration(data.userId, data.token),
    onSuccess: (response) => {
      // Store the access token
      const accessToken = response.data;
      localStorage.setItem('access_token', accessToken);

      // Update auth store
      setUser({ id: '', email: '', name: '', role: '', createdAt: '', updatedAt: '' });
    },
  });
};
