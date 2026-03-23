import { apiClient } from './client';
import type { LoginFormData, RegisterFormData } from '@/features/auth';
import type { LoginResponse, RefreshTokenResponse } from '@/entities/user';
import type { RegisterResponse } from '@/entities/user/model/types';

export interface OTPResponse {
  success: boolean;
  status: number;
  data: {
    token: string;
  };
}

export interface UserVerificationResponse {
  success: boolean;
  status: number;
  data: string; // JWT access token
}

export const authApi = {
  login: async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterFormData): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  sendOtp: async (email: string): Promise<OTPResponse> => {
    const response = await apiClient.post<OTPResponse>('/otp', { email });
    return response.data;
  },

  verifyOtp: async (token: string, code: string): Promise<OTPResponse> => {
    const response = await apiClient.patch<OTPResponse>(`/otp/${token}`, { otpCode: code });
    return response.data;
  },

  verifyUserRegistration: async (userId: string, token: string): Promise<UserVerificationResponse> => {
    const response = await apiClient.patch<string>(`/auth/${userId}`, { token });
    return {
      success: true,
      status: 201,
      data: response.data,
    };
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
