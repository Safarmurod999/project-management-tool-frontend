import { apiClient } from './client';
import type { LoginFormData } from '@/features/auth';
import type { LoginResponse, RefreshTokenResponse } from '@/entities/user';

export const authApi = {
  login: async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>(
      '/auth/refresh-token'
    );
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },
};
