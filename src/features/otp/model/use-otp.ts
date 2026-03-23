import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/shared/api';
import type { OTPRequestData } from './schema';

export const useSendOtp = () => {
  return useMutation({
    mutationFn: (data: OTPRequestData) => authApi.sendOtp(data.email),
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: (data: { token: string; code: string }) =>
      authApi.verifyOtp(data.token, data.code),
  });
};
